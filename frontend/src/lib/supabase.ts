import { createClient } from '@supabase/supabase-js';
import type { User, FeeItem, Transaction, AIRiskPrediction, NotificationItem } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kcbigpwbpeofsllmrmmo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjYmlncHdicGVvZnNsbG1ybW1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4OTU2NzAsImV4cCI6MjEwMTQ3MTY3MH0.QA1iUX8zfzlr7o8w9iuTYVtOleb50H4h7Bwwmxd4zRA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Data mapping helpers
export const fetchProfiles = async (): Promise<User[]> => {
  const { data, error } = await supabase.from('profiles').select('*');
  if (error || !data) return [];
  return data.map((p) => ({
    id: p.id,
    name: p.name,
    email: p.email,
    role: p.role,
    avatarUrl: p.avatar_url,
    department: p.department,
    rollNo: p.roll_no,
    academicYear: p.academic_year,
  }));
};

export const fetchFeeItems = async (studentId?: string): Promise<FeeItem[]> => {
  let query = supabase.from('fee_items').select('*');
  if (studentId) {
    query = query.eq('student_id', studentId);
  }
  const { data, error } = await query;
  if (error || !data) return [];
  return data.map((item) => ({
    id: item.id,
    title: item.title,
    amount: Number(item.amount),
    dueDate: item.due_date,
    category: item.category,
    status: item.status,
  }));
};

export const fetchTransactions = async (studentId?: string): Promise<Transaction[]> => {
  let query = supabase.from('transactions').select('*').order('transaction_date', { ascending: false });
  if (studentId) {
    query = query.eq('student_id', studentId);
  }
  const { data, error } = await query;
  if (error || !data) return [];
  return data.map((t) => ({
    id: t.id,
    receiptNo: t.receipt_no,
    studentId: t.student_id,
    studentName: t.student_name,
    rollNo: t.roll_no,
    amountPaid: Number(t.amount_paid),
    paymentMethod: t.payment_method,
    gateway: t.gateway,
    transactionDate: t.transaction_date,
    feeType: t.fee_type,
    status: t.status,
  }));
};

export const fetchAIRiskPredictions = async (): Promise<AIRiskPrediction[]> => {
  const { data, error } = await supabase.from('ai_risk_predictions').select('*');
  if (error || !data) return [];
  return data.map((p) => ({
    studentId: p.student_id,
    studentName: p.student_name,
    rollNo: p.roll_no,
    department: p.department,
    academicYear: p.academic_year,
    pendingAmount: Number(p.pending_amount),
    riskLevel: p.risk_level,
    probabilityPercentage: p.probability_percentage,
    historicalDelayDaysAvg: p.historical_delay_days_avg,
    primaryRiskFactors: p.primary_risk_factors || [],
    lastPaymentDate: p.last_payment_date,
  }));
};

export const fetchNotifications = async (): Promise<NotificationItem[]> => {
  const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
  if (error || !data) return [];
  return data.map((n) => ({
    id: n.id,
    title: n.title,
    message: n.message,
    timestamp: n.timestamp,
    read: n.read,
    type: n.type,
  }));
};

export const updateFeeItemStatus = async (feeId: string, status: 'paid' | 'pending' | 'overdue') => {
  const { error } = await supabase.from('fee_items').update({ status }).eq('id', feeId);
  if (error) console.error('Supabase update fee item error:', error);
};

export const recordTransaction = async (txn: Transaction) => {
  const { error } = await supabase.from('transactions').insert({
    id: txn.id,
    receipt_no: txn.receiptNo,
    student_id: txn.studentId,
    student_name: txn.studentName,
    roll_no: txn.rollNo,
    amount_paid: txn.amountPaid,
    payment_method: txn.paymentMethod,
    gateway: txn.gateway,
    transaction_date: txn.transactionDate,
    fee_type: txn.feeType,
    status: txn.status,
  });
  if (error) console.error('Supabase record transaction error:', error);
};

export const createNotification = async (notif: NotificationItem) => {
  const { error } = await supabase.from('notifications').insert({
    id: notif.id,
    title: notif.title,
    message: notif.message,
    timestamp: notif.timestamp,
    read: notif.read,
    type: notif.type,
  });
  if (error) console.error('Supabase create notification error:', error);
};
