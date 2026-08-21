// agent-notes: { ctx: "Knowledge base corpus with pre-computed vector embeddings for institutional RAG AI Assistant", deps: ["src/types/ragTypes.ts"], state: active, last: "antigravity@2026-08-21" }
import type { KnowledgeChunk } from '../types/ragTypes';

// Vocabulary dimension mapping for fast deterministic client-side vector embeddings (128-dimensional embedding)
const EMBEDDING_VOCAB = [
  'tuition', 'fee', 'payment', 'due', 'date', 'hostel', 'exam', 'library', 'lab', 'laboratory',
  'penalty', 'late', 'fine', 'scholarship', 'refund', 'cancellation', 'concession', 'merit',
  'upi', 'razorpay', 'stripe', 'card', 'bank', 'receipt', 'transaction', 'failed', 'pending',
  'risk', 'prediction', 'default', 'high', 'medium', 'low', 'probability', 'history', 'delay',
  'installment', 'deadline', 'anna', 'university', 'vaigai', 'college', 'engineering', 'policy',
  'discount', 'early', 'bird', 'concession', 'waiver', 'portal', 'support', 'contact', 'finance',
  'dean', 'student', 'admin', 'analytics', 'compliance', 'overdue', 'amount', 'rupees', 'status',
  'verification', 'fcm', 'alert', 'notice', 'academic', 'year', 'semester', 'sem', 'receipts',
  'download', 'pdf', 'print', 'digital', 'subscription', 'annual', 'mess', 'block', 'b',
  'course', 'credit', 'debit', 'netbanking', 'success', 'reference', 'rule', 'section', 'clause',
  'approval', 'registrar', 'bursar', 'bureau', 'quota', 'sports', 'economically', 'weaker', 'section',
  'grace', 'period', 'remediation', 'counseling', 'notification', 'schedule', 'timetable', 'hall', 'ticket'
];

/**
 * Generates a normalized 128-dimensional vector representation for a given text snippet.
 */
export function generateEmbedding(text: string): number[] {
  const normalized = text.toLowerCase();
  const vector = new Array(EMBEDDING_VOCAB.length).fill(0);
  
  EMBEDDING_VOCAB.forEach((word, idx) => {
    // Count exact or substring matches
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = normalized.match(regex);
    if (matches) {
      vector[idx] = matches.length * 1.5;
    } else if (normalized.includes(word)) {
      vector[idx] = 0.5;
    }
  });

  // Calculate L2 norm for vector normalization
  const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  if (norm === 0) return vector;
  return vector.map((val) => Number((val / norm).toFixed(4)));
}

export const rawKnowledgeDocs: Array<Omit<KnowledgeChunk, 'embedding'>> = [
  {
    id: 'KNOW-FEE-001',
    title: 'Tuition Fee Structure & Due Date Guidelines',
    category: 'Fee Policy',
    sourceRef: 'Institutional Fee Policy §2.1 (AY 2026-27)',
    tags: ['tuition', 'fee', 'due', 'date', 'semester', 'payment', 'schedule'],
    content: `Tuition fees for Vaigai College of Engineering (affiliated with Anna University) are payable at the start of each semester. 
For Semester 6 (Academic Year 2026-27), the baseline tuition fee is ₹45,000. 
The official payment deadline is August 25, 2026. Payments can be made online via UPI, Credit/Debit Cards, or Net Banking through Razorpay or Stripe gateways. 
Early bird payments completed before August 15 receive an automatic 5% concession on lab fees.`,
  },
  {
    id: 'KNOW-FEE-002',
    title: 'Hostel Accommodation & Mess Charge Regulations',
    category: 'Fee Policy',
    sourceRef: 'Hostel Board Guidelines §5.4',
    tags: ['hostel', 'mess', 'block', 'accommodation', 'due', 'date', 'payment'],
    content: `Hostel Block B room accommodation and mess charges for the term total ₹28,000, due on September 10, 2026. 
Hostel fee clearance is mandatory prior to room allocation for subsequent academic quarters. 
Partial payments are permitted with prior Dean of Student Welfare approval.`,
  },
  {
    id: 'KNOW-PEN-001',
    title: 'Late Fee Penalties & Grace Periods',
    category: 'Late Penalty & Refund',
    sourceRef: 'Financial Ordinance Clause 7.2',
    tags: ['late', 'penalty', 'fine', 'grace', 'period', 'overdue', 'delay'],
    content: `A grace period of 7 days (until September 1, 2026 for tuition) is extended without financial penalty. 
If fees remain unpaid after the grace period:
- Days 8 to 15 late: Flat penalty of ₹500.
- Days 16 to 30 late: Flat penalty of ₹1,500.
- Exceeding 30 days late: Temporary hold on hall tickets for university end-term examinations and library access suspension until dues are settled.`,
  },
  {
    id: 'KNOW-SCH-001',
    title: 'Merit & Need-Based Fee Concession Rules',
    category: 'Scholarship & Concessions',
    sourceRef: 'Scholarship Manual §3.8',
    tags: ['scholarship', 'merit', 'concession', 'discount', 'waiver', 'economically', 'weaker'],
    content: `Students with a CGPA of 8.5 or higher receive a 25% waiver on Tuition Fees under the Merit Excellence Scheme. 
Students from Economically Weaker Sections (EWS) or First Generation Graduates can submit applications through the SmartFee portal for up to 50% tuition concession. 
Applications for AY 2026-27 close on September 15, 2026.`,
  },
  {
    id: 'KNOW-REF-001',
    title: 'Fee Refund & Admission Withdrawal Policy',
    category: 'Late Penalty & Refund',
    sourceRef: 'Anna University Withdrawal Statutes §12',
    tags: ['refund', 'cancellation', 'withdrawal', 'percentage', 'deduction'],
    content: `In the event of course withdrawal or transfer:
- Notice given 15+ days before semester commencement: 90% fee refund (10% processing charge retained).
- Notice given within 15 days of semester commencement: 80% fee refund.
- Notice given after 30 days from commencement: Non-refundable, except caution deposits.
All refund requests must be submitted through the SmartFee portal with original payment receipt attached.`,
  },
  {
    id: 'KNOW-GW-001',
    title: 'Payment Gateway Troubleshooting & Instant Receipt Download',
    category: 'Payment Gateway',
    sourceRef: 'SmartFee Tech Support Guide §1.2',
    tags: ['upi', 'razorpay', 'stripe', 'failed', 'pending', 'receipt', 'download', 'pdf'],
    content: `If your payment transaction shows 'Pending' or funds are deducted from your bank account without immediate status update:
1. Do not retry payment immediately; bank webhooks sync within 15 minutes.
2. If status remains pending after 30 minutes, click 'Verify Payment Status' on the dashboard.
3. Official GST-compliant payment receipts with unique receipt numbers (e.g., REC-2026-8841) are auto-generated upon success and can be instantly downloaded as PDF or printed from the transactions tab.`,
  },
  {
    id: 'KNOW-AI-001',
    title: 'AI Default Risk Scoring & Early Warning Engine Explanation',
    category: 'AI Risk Prediction',
    sourceRef: 'SmartFee AI Prediction System Architecture §4',
    tags: ['risk', 'prediction', 'default', 'high', 'medium', 'low', 'probability', 'factors'],
    content: `SmartFee AI utilizes historical payment timelines, past installment delays, fee balance proximity to due dates, and gateway error trends to compute Student Default Risk Scores:
- HIGH Risk (80%+ Probability): 3+ late payments historically, overdue balances > 15 days, or multiple payment failures. Prompt administrator outreach & reminder triggers are recommended.
- MEDIUM Risk (40%-79% Probability): Minor past delays (5-10 days) or approaching deadline with large pending balance.
- LOW Risk (<40% Probability): Consistent on-time payment track record or scholarship recipient.
Admins can send targeted auto-reminders or flag students for payment plan counseling directly from the Admin Portal.`,
  },
  {
    id: 'KNOW-INS-001',
    title: 'Installment Payment Plan Requests',
    category: 'Fee Policy',
    sourceRef: 'Finance Office Circular #2026/04',
    tags: ['installment', 'plan', 'partial', 'split', 'payment', 'approval'],
    content: `Students experiencing financial constraint can request a 2-part or 3-part installment plan for Tuition and Hostel fees. 
Installment requests require submitting an online application via SmartFee AI before the primary due date. 
Once approved by the Finance Dean, custom due dates are updated in the student's dashboard without late fee penalties.`,
  }
];

// Pre-compute normalized embedding vectors for all knowledge base documents
export const knowledgeBaseChunks: KnowledgeChunk[] = rawKnowledgeDocs.map((doc) => ({
  ...doc,
  embedding: generateEmbedding(`${doc.title} ${doc.category} ${doc.tags.join(' ')} ${doc.content}`),
}));
