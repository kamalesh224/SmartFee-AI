// agent-notes: { ctx: "RAG Assistant response generation service with grounded context retrieval and interactive action triggers", deps: ["src/lib/ragEngine.ts", "src/types/ragTypes.ts"], state: active, last: "antigravity@2026-08-21" }
import { retrieveKnowledgeChunks, buildDynamicContext } from '../lib/ragEngine';
import type { ChatMessage, RAGQueryOptions, KnowledgeChunk } from '../types/ragTypes';

export async function processRAGQuery(
  query: string,
  options: RAGQueryOptions
): Promise<ChatMessage> {
  const queryLower = query.toLowerCase().trim();
  const retrievedResults = retrieveKnowledgeChunks(queryLower, 3);
  const matchedChunks: KnowledgeChunk[] = retrievedResults.map((r) => r.chunk);

  let responseText = '';
  let actionTrigger: ChatMessage['actionTrigger'] = undefined;

  // 1. Check for specific student action triggers (e.g. paying pending fees)
  if (options.userRole === 'student') {
    const pendingItems = options.feeItems?.filter((item) => item.status !== 'paid') || [];
    
    if (queryLower.includes('pay') || queryLower.includes('pending') || queryLower.includes('due')) {
      if (pendingItems.length > 0) {
        const primaryPending = pendingItems[0];
        actionTrigger = {
          type: 'PAY_FEE',
          label: `Pay ${primaryPending.title} (₹${primaryPending.amount.toLocaleString('en-IN')})`,
          feeId: primaryPending.id,
        };
      }
    } else if (queryLower.includes('receipt') || queryLower.includes('paid') || queryLower.includes('history')) {
      if (options.recentTransactions && options.recentTransactions.length > 0) {
        actionTrigger = {
          type: 'VIEW_RECEIPT',
          label: `Download Receipt (${options.recentTransactions[0].id})`,
        };
      }
    }
  } else if (options.userRole === 'admin') {
    if (queryLower.includes('risk') || queryLower.includes('default') || queryLower.includes('high')) {
      actionTrigger = {
        type: 'VIEW_RISK_ANALYTICS',
        label: 'Inspect High-Risk Student Matrix',
      };
    }
  }

  // 2. Synthesize Grounded RAG Response using retrieved chunks & dynamic live context
  if (matchedChunks.length > 0) {
    const topChunk = matchedChunks[0];

    // Contextual answer builder
    let answerContent = '';

    if (queryLower.includes('tuition') || queryLower.includes('semester')) {
      if (options.userRole === 'student' && options.feeItems) {
        const tuitionItem = options.feeItems.find((i) => i.category === 'Tuition' || i.title.includes('Tuition'));
        if (tuitionItem) {
          answerContent = `According to institutional records, your **${tuitionItem.title}** is currently **${tuitionItem.status.toUpperCase()}** with an amount of **₹${tuitionItem.amount.toLocaleString('en-IN')}**, due on **${tuitionItem.dueDate}**.\n\n${topChunk.content}`;
        } else {
          answerContent = topChunk.content;
        }
      } else {
        answerContent = topChunk.content;
      }
    } else if (queryLower.includes('hostel') || queryLower.includes('mess')) {
      if (options.userRole === 'student' && options.feeItems) {
        const hostelItem = options.feeItems.find((i) => i.category === 'Hostel');
        if (hostelItem) {
          answerContent = `Your **${hostelItem.title}** balance is **₹${hostelItem.amount.toLocaleString('en-IN')}** (Status: ${hostelItem.status.toUpperCase()}).\n\n${topChunk.content}`;
        } else {
          answerContent = topChunk.content;
        }
      } else {
        answerContent = topChunk.content;
      }
    } else if (queryLower.includes('late') || queryLower.includes('fine') || queryLower.includes('penalty') || queryLower.includes('grace')) {
      answerContent = `Here is the official policy regarding late fee penalties:\n\n${topChunk.content}`;
    } else if (queryLower.includes('scholarship') || queryLower.includes('concession') || queryLower.includes('waiver')) {
      answerContent = `SmartFee AI Scholarship & Concession Guidelines:\n\n${topChunk.content}`;
    } else if (queryLower.includes('refund') || queryLower.includes('cancel') || queryLower.includes('withdraw')) {
      answerContent = `Fee Refund and Admission Cancellation Terms:\n\n${topChunk.content}`;
    } else if (queryLower.includes('risk') || queryLower.includes('prediction') || queryLower.includes('default')) {
      if (options.userRole === 'admin' && options.riskPredictions) {
        const highRisk = options.riskPredictions.filter((r) => r.riskLevel === 'HIGH');
        answerContent = `**AI Risk Prediction Analysis**:\nCurrently, **${highRisk.length} students** are flagged as HIGH Default Risk in the portal (e.g. ${highRisk.map((s) => s.studentName).join(', ')}).\n\n${topChunk.content}`;
      } else {
        answerContent = topChunk.content;
      }
    } else {
      answerContent = `${topChunk.content}`;
    }

    // Add explicit citations
    const citationsText = matchedChunks
      .map((chunk, idx) => `[Source ${idx + 1}: ${chunk.sourceRef}]`)
      .join(' ');

    responseText = `${answerContent}\n\n📌 **Verified References:**\n${citationsText}`;
  } else {
    // Fallback response with live account summary
    const dynamicCtx = buildDynamicContext(options);
    responseText = `I searched the SmartFee AI knowledge base for your query: "${query}". While I didn't find an exact match in the institutional handbook, here is your active account summary:\n\n${dynamicCtx}\n\n💡 *Tip: You can ask about tuition fees, hostel deadlines, late penalties, scholarship eligibility, refund policies, or AI default risk predictions.*`;
  }

  return {
    id: `RAG-MSG-${Date.now()}`,
    sender: 'assistant',
    text: responseText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sources: matchedChunks,
    actionTrigger,
  };
}
