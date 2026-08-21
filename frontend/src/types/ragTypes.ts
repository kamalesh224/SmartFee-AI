// agent-notes: { ctx: "TypeScript interfaces for RAG AI Assistant engine, knowledge base, and chat widget", deps: [], state: active, last: "antigravity@2026-08-21" }

export interface KnowledgeChunk {
  id: string;
  title: string;
  category: 'Fee Policy' | 'Scholarship & Concessions' | 'Late Penalty & Refund' | 'Payment Gateway' | 'AI Risk Prediction' | 'General';
  content: string;
  sourceRef: string;
  tags: string[];
  embedding: number[]; // Normalized vector representation
}

export interface RAGSearchResult {
  chunk: KnowledgeChunk;
  similarityScore: number;
  matchedTerms: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  sources?: KnowledgeChunk[];
  actionTrigger?: {
    type: 'PAY_FEE' | 'VIEW_RECEIPT' | 'VIEW_RISK_ANALYTICS' | 'FILTER_HIGH_RISK';
    label: string;
    feeId?: string;
    studentId?: string;
  };
}

export interface RAGQueryOptions {
  userRole: 'student' | 'admin';
  studentName?: string;
  studentId?: string;
  pendingFeeTotal?: number;
  feeItems?: Array<{ id: string; title: string; amount: number; dueDate: string; category?: string; status: string }>;
  recentTransactions?: Array<{ id: string; feeType: string; amountPaid: number; transactionDate: string }>;
  riskPredictions?: Array<{ studentId: string; studentName: string; riskLevel: string; pendingAmount: number; probabilityPercentage: number }>;
  topK?: number;
}
