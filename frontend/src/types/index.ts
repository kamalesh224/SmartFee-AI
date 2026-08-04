export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  department?: string;
  rollNo?: string;
  academicYear?: string;
}

export interface FeeItem {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  category: 'Tuition' | 'Hostel' | 'Exam' | 'Library' | 'Laboratory' | 'Sports';
  status: 'paid' | 'pending' | 'overdue';
}

export interface Transaction {
  id: string;
  receiptNo: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  amountPaid: number;
  paymentMethod: 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking';
  gateway: 'Razorpay' | 'Stripe';
  transactionDate: string;
  feeType: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
}

export interface AIRiskPrediction {
  studentId: string;
  studentName: string;
  rollNo: string;
  department: string;
  academicYear: string;
  pendingAmount: number;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  probabilityPercentage: number;
  historicalDelayDaysAvg: number;
  primaryRiskFactors: string[];
  lastPaymentDate: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'payment' | 'due' | 'ai_alert' | 'announcement';
}
