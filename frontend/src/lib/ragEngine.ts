// agent-notes: { ctx: "Hybrid RAG Vector Search & Retrieval Engine with dynamic user context synthesis", deps: ["src/data/knowledgeBase.ts", "src/types/ragTypes.ts"], state: active, last: "antigravity@2026-08-21" }
import { knowledgeBaseChunks, generateEmbedding } from '../data/knowledgeBase';
import type { RAGSearchResult, RAGQueryOptions } from '../types/ragTypes';

/**
 * Calculates Cosine Similarity between two normalized vectors.
 * Vector values range from -1.0 to 1.0 (for normalized non-negative vectors, range is 0.0 to 1.0).
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
  }
  return Math.min(Math.max(dotProduct, 0), 1);
}

/**
 * Queries the knowledge base using hybrid vector similarity and keyword frequency.
 */
export function retrieveKnowledgeChunks(query: string, topK: number = 3): RAGSearchResult[] {
  const queryEmbedding = generateEmbedding(query);
  const normalizedQueryTokens = query.toLowerCase().split(/\W+/).filter((t) => t.length > 2);

  const searchResults: RAGSearchResult[] = knowledgeBaseChunks.map((chunk) => {
    // 1. Vector Cosine Similarity
    const vectorSim = cosineSimilarity(queryEmbedding, chunk.embedding);

    // 2. Keyword & Tag Match Scoring
    const matchedTerms: string[] = [];
    let keywordScore = 0;

    normalizedQueryTokens.forEach((token) => {
      // Check tags
      if (chunk.tags.some((tag) => tag.includes(token))) {
        keywordScore += 0.25;
        if (!matchedTerms.includes(token)) matchedTerms.push(token);
      }
      // Check content / title
      if (chunk.title.toLowerCase().includes(token)) {
        keywordScore += 0.35;
        if (!matchedTerms.includes(token)) matchedTerms.push(token);
      } else if (chunk.content.toLowerCase().includes(token)) {
        keywordScore += 0.15;
        if (!matchedTerms.includes(token)) matchedTerms.push(token);
      }
    });

    // 3. Combined Hybrid Score
    const combinedScore = vectorSim * 0.6 + Math.min(keywordScore, 0.4);

    return {
      chunk,
      similarityScore: Number(combinedScore.toFixed(4)),
      matchedTerms,
    };
  });

  // Sort descending by similarity score
  return searchResults
    .filter((res) => res.similarityScore > 0.05)
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, topK);
}

/**
 * Dynamically synthesizes live user account context for the RAG prompt pipeline.
 */
export function buildDynamicContext(options: RAGQueryOptions): string {
  const parts: string[] = [];

  if (options.userRole === 'student') {
    parts.push(`[Active User Context: Student]`);
    if (options.studentName) parts.push(`Student Name: ${options.studentName} (${options.studentId || 'ID N/A'})`);
    if (options.pendingFeeTotal !== undefined) parts.push(`Total Outstanding Pending Dues: ₹${options.pendingFeeTotal.toLocaleString('en-IN')}`);
    
    if (options.feeItems && options.feeItems.length > 0) {
      parts.push(`Current Student Fee Breakdown:`);
      options.feeItems.forEach((item) => {
        parts.push(`- Fee Item: "${item.title}" | Amount: ₹${item.amount.toLocaleString('en-IN')} | Due Date: ${item.dueDate} | Status: ${item.status.toUpperCase()}`);
      });
    }

    if (options.recentTransactions && options.recentTransactions.length > 0) {
      parts.push(`Recent Cleared Transactions:`);
      options.recentTransactions.forEach((txn) => {
        parts.push(`- Txn ID: ${txn.id} | Fee: "${txn.feeType}" | Paid: ₹${txn.amountPaid.toLocaleString('en-IN')} | Date: ${txn.transactionDate}`);
      });
    }
  } else {
    parts.push(`[Active User Context: Administrator]`);
    parts.push(`Role: Financial Operations Admin & AI Risk Manager`);
    if (options.riskPredictions && options.riskPredictions.length > 0) {
      parts.push(`AI Default Risk Summary:`);
      const highRisk = options.riskPredictions.filter((r) => r.riskLevel === 'HIGH');
      parts.push(`- Total High Risk Students: ${highRisk.length}`);
      highRisk.forEach((r) => {
        parts.push(`  * ${r.studentName} (${r.studentId}): Default Prob: ${r.probabilityPercentage}%, Pending: ₹${r.pendingAmount.toLocaleString('en-IN')}`);
      });
    }
  }

  return parts.join('\n');
}
