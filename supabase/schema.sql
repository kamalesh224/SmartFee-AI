-- ====================================================================
-- SmartFee AI - Supabase Database Schema & Initial Data Seed Script
-- Project ID: kcbigpwbpeofsllmrmmo
-- Target Database: PostgreSQL / Supabase Cloud
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. EXTENSIONS
-- --------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 2. TABLE DEFINITIONS
-- --------------------------------------------------------------------

-- User Profiles (Students & Admins)
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('student', 'admin')),
  avatar_url TEXT,
  department TEXT,
  roll_no TEXT,
  academic_year TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fee Items (Tuition, Lab, Library, Hostel, Exam)
CREATE TABLE IF NOT EXISTS public.fee_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
  due_date DATE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Tuition', 'Hostel', 'Exam', 'Library', 'Laboratory', 'Sports')),
  status TEXT NOT NULL CHECK (status IN ('paid', 'pending', 'overdue')),
  student_id TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment Transactions & Receipts
CREATE TABLE IF NOT EXISTS public.transactions (
  id TEXT PRIMARY KEY,
  receipt_no TEXT NOT NULL UNIQUE,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  roll_no TEXT NOT NULL,
  amount_paid NUMERIC(12, 2) NOT NULL CHECK (amount_paid >= 0),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('UPI', 'Credit Card', 'Debit Card', 'Net Banking')),
  gateway TEXT NOT NULL CHECK (gateway IN ('Razorpay', 'Stripe')),
  transaction_date TIMESTAMP NOT NULL DEFAULT NOW(),
  fee_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('SUCCESS', 'FAILED', 'PENDING')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Risk Predictions & ML Fee Default Engine Data
CREATE TABLE IF NOT EXISTS public.ai_risk_predictions (
  student_id TEXT PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  roll_no TEXT NOT NULL,
  department TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  pending_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('HIGH', 'MEDIUM', 'LOW')),
  probability_percentage INTEGER NOT NULL CHECK (probability_percentage BETWEEN 0 AND 100),
  historical_delay_days_avg INTEGER NOT NULL DEFAULT 0,
  primary_risk_factors TEXT[] NOT NULL DEFAULT '{}',
  last_payment_date DATE NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Push Notifications & FCM Alert History
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  type TEXT NOT NULL CHECK (type IN ('payment', 'due', 'ai_alert', 'announcement')),
  user_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 3. INDEXES FOR QUERY OPTIMIZATION
-- --------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_fee_items_student_id ON public.fee_items(student_id);
CREATE INDEX IF NOT EXISTS idx_fee_items_status ON public.fee_items(status);
CREATE INDEX IF NOT EXISTS idx_transactions_student_id ON public.transactions(student_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- --------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_risk_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Development RLS Policies (Idempotent: Drop policy if exists before creating)
DROP POLICY IF EXISTS "Allow open access to profiles" ON public.profiles;
CREATE POLICY "Allow open access to profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow open access to fee_items" ON public.fee_items;
CREATE POLICY "Allow open access to fee_items" ON public.fee_items FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow open access to transactions" ON public.transactions;
CREATE POLICY "Allow open access to transactions" ON public.transactions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow open access to ai_risk_predictions" ON public.ai_risk_predictions;
CREATE POLICY "Allow open access to ai_risk_predictions" ON public.ai_risk_predictions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow open access to notifications" ON public.notifications;
CREATE POLICY "Allow open access to notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);

-- --------------------------------------------------------------------
-- 5. INITIAL SEED DATA
-- --------------------------------------------------------------------

-- Seed User Profiles
INSERT INTO public.profiles (id, name, email, role, department, roll_no, academic_year, avatar_url)
VALUES 
  ('STU-2026-042', 'Alex Rivera', 'alex.rivera@smartfee.edu', 'student', 'Computer Science & Engineering', '2026-CS-042', '3rd Year (Sem 6)', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
  ('ADM-2026-001', 'Dr. Sarah Jenkins', 's.jenkins@smartfee.edu', 'admin', 'Dean of Finance & Operations', NULL, NULL, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  email = EXCLUDED.email;

-- Seed Fee Items
INSERT INTO public.fee_items (id, title, amount, due_date, category, status, student_id)
VALUES 
  ('FEE-101', 'Tuition Fee - Semester 6', 45000.00, '2026-08-25', 'Tuition', 'pending', 'STU-2026-042'),
  ('FEE-102', 'Advanced AI & Data Science Lab Fee', 7500.00, '2026-08-15', 'Laboratory', 'pending', 'STU-2026-042'),
  ('FEE-103', 'Central Library Annual Digital Subscription', 2500.00, '2026-07-30', 'Library', 'paid', 'STU-2026-042'),
  ('FEE-104', 'University End-Term Examination Fee', 3200.00, '2026-07-15', 'Exam', 'paid', 'STU-2026-042'),
  ('FEE-105', 'Hostel Block B Accommodation & Mess', 28000.00, '2026-09-10', 'Hostel', 'pending', 'STU-2026-042')
ON CONFLICT (id) DO NOTHING;

-- Seed Transactions
INSERT INTO public.transactions (id, receipt_no, student_id, student_name, roll_no, amount_paid, payment_method, gateway, transaction_date, fee_type, status)
VALUES 
  ('TXN-984210', 'REC-2026-8841', 'STU-2026-042', 'Alex Rivera', '2026-CS-042', 2500.00, 'UPI', 'Razorpay', '2026-07-28 14:32:05', 'Central Library Annual Digital Subscription', 'SUCCESS'),
  ('TXN-982104', 'REC-2026-7612', 'STU-2026-042', 'Alex Rivera', '2026-CS-042', 3200.00, 'Credit Card', 'Stripe', '2026-07-14 09:15:22', 'University End-Term Examination Fee', 'SUCCESS'),
  ('TXN-978112', 'REC-2026-5541', 'STU-2026-042', 'Alex Rivera', '2026-CS-042', 42000.00, 'Net Banking', 'Razorpay', '2026-01-10 11:20:44', 'Tuition Fee - Semester 5', 'SUCCESS')
ON CONFLICT (id) DO NOTHING;

-- Seed AI Risk Predictions
INSERT INTO public.ai_risk_predictions (student_id, student_name, roll_no, department, academic_year, pending_amount, risk_level, probability_percentage, historical_delay_days_avg, primary_risk_factors, last_payment_date)
VALUES 
  ('STU-2026-108', 'Marcus Vance', '2026-ME-018', 'Mechanical Engineering', '4th Year', 52500.00, 'HIGH', 88, 24, ARRAY['Consistent 20+ day late payment history', 'Pending Hostel Fee overdue by 12 days', 'No partial payments made'], '2026-02-14'),
  ('STU-2026-214', 'Sophia Patel', '2026-ECE-091', 'Electronics & Comm.', '2nd Year', 45000.00, 'HIGH', 82, 19, ARRAY['Missed 2 early bird discount deadlines', 'Multiple failed card attempts in past term'], '2026-03-01'),
  ('STU-2026-042', 'Alex Rivera', '2026-CS-042', 'Computer Science & Eng.', '3rd Year', 52500.00, 'MEDIUM', 54, 8, ARRAY['Delayed tuition payment in Sem 5 by 7 days', 'High pending balance vs due date proximity'], '2026-07-28'),
  ('STU-2026-305', 'Liam O''Connor', '2026-EEE-012', 'Electrical Engineering', '1st Year', 18000.00, 'MEDIUM', 48, 5, ARRAY['First installment paid on final due date'], '2026-06-15'),
  ('STU-2026-411', 'Emma Watson', '2026-CS-112', 'Computer Science & Eng.', '3rd Year', 0.00, 'LOW', 12, 0, ARRAY['100% on-time payment track record', 'Scholarship auto-credited'], '2026-07-25'),
  ('STU-2026-520', 'Noah Kim', '2026-CIV-045', 'Civil Engineering', '2nd Year', 12000.00, 'LOW', 18, 2, ARRAY['Consistent prompt payments'], '2026-07-20')
ON CONFLICT (student_id) DO NOTHING;

-- Seed Notifications
INSERT INTO public.notifications (id, title, message, timestamp, read, type)
VALUES 
  ('NOTIF-01', 'Payment Deadline Reminder', 'Tuition Fee Semester 6 payment of ₹45,000 is due on August 25, 2026.', '10 mins ago', false, 'due'),
  ('NOTIF-02', 'Payment Received Successfully', 'Receipt REC-2026-8841 of ₹2,500 generated for Central Library Subscription.', '2 hours ago', false, 'payment'),
  ('NOTIF-03', 'AI Smart Reminder', 'SmartFee AI detected upcoming exam fee deadline. Pay now to avoid late penalty.', '1 day ago', true, 'ai_alert'),
  ('NOTIF-04', 'New Scholarship Portal Open', 'Merit-based fee concession applications are open for AY 2026-27.', '3 days ago', true, 'announcement')
ON CONFLICT (id) DO NOTHING;