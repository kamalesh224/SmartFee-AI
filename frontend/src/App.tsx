import React, { useState, useEffect } from 'react';
import type { User, FeeItem, Transaction, UserRole, AIRiskPrediction } from './types';
import {
  mockCurrentStudent,
  mockAdmin,
  mockFeeItems,
  mockTransactions,
  mockAIRiskPredictions,
} from './data/mockData';
import { LoginPage } from './components/LoginPage';
import { StudentDashboardScreen } from './components/StudentDashboardScreen';
import { PaymentScreen } from './components/PaymentScreen';
import { ReceiptScreen } from './components/ReceiptScreen';
import { AdminDashboardScreen } from './components/AdminDashboardScreen';
import {
  fetchFeeItems,
  fetchTransactions,
  fetchAIRiskPredictions,
  updateFeeItemStatus,
  recordTransaction,
  deleteAIRiskPrediction,
} from './lib/supabase';

export const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(mockCurrentStudent);

  const [feeItems, setFeeItems] = useState<FeeItem[]>(mockFeeItems);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [riskPredictions, setRiskPredictions] = useState<AIRiskPrediction[]>(mockAIRiskPredictions);

  // Modal / Screen states
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedFeeItem, setSelectedFeeItem] = useState<FeeItem | null>(null);

  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Transaction | null>(null);

  useEffect(() => {
    const loadSupabaseData = async () => {
      try {
        const [fees, txns, risks] = await Promise.all([
          fetchFeeItems(),
          fetchTransactions(),
          fetchAIRiskPredictions(),
        ]);
        if (fees.length > 0) setFeeItems(fees);
        if (txns.length > 0) setTransactions(txns);
        if (risks.length > 0) setRiskPredictions(risks);
      } catch (err) {
        console.warn('Falling back to local mock data:', err);
      }
    };
    loadSupabaseData();
  }, []);

  const handleLogin = (role: UserRole, user?: User) => {
    if (user) {
      setCurrentUser(user);
    } else {
      setCurrentUser(role === 'student' ? mockCurrentStudent : mockAdmin);
    }
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleOpenPayment = (feeItem: FeeItem) => {
    setSelectedFeeItem(feeItem);
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = (newTxn: Transaction) => {
    // 1. Add new transaction
    setTransactions((prev) => [newTxn, ...prev]);
    recordTransaction(newTxn);

    // 2. Update fee item status to paid
    if (selectedFeeItem) {
      setFeeItems((prev) =>
        prev.map((item) => (item.id === selectedFeeItem.id ? { ...item, status: 'paid' } : item))
      );
      updateFeeItemStatus(selectedFeeItem.id, 'paid');
    }

    setIsPaymentOpen(false);

    // 3. Open receipt automatically
    setSelectedReceipt(newTxn);
    setIsReceiptOpen(true);
  };

  const handleViewReceipt = (txn: Transaction) => {
    setSelectedReceipt(txn);
    setIsReceiptOpen(true);
  };

  const handleAddStudent = (newPrediction: AIRiskPrediction) => {
    setRiskPredictions((prev) => [newPrediction, ...prev]);
  };

  const handleDeleteStudent = (studentId: string) => {
    setRiskPredictions((prev) => prev.filter((student) => student.studentId !== studentId));
    deleteAIRiskPrediction(studentId);
  };

  // 1. LOGIN SCREEN WITH STUDENT VERIFICATION
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} registeredStudents={riskPredictions} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* 2. STUDENT DASHBOARD vs 5. ADMIN DASHBOARD */}
      {currentUser.role === 'student' ? (
        <StudentDashboardScreen
          student={currentUser}
          feeItems={feeItems}
          transactions={transactions}
          onOpenPayment={handleOpenPayment}
          onViewReceipt={handleViewReceipt}
          onLogout={handleLogout}
        />
      ) : (
        <AdminDashboardScreen
          admin={currentUser}
          riskPredictions={riskPredictions}
          onAddStudent={handleAddStudent}
          onDeleteStudent={handleDeleteStudent}
          onLogout={handleLogout}
        />
      )}

      {/* 3. PAYMENT SCREEN MODAL */}
      <PaymentScreen
        isOpen={isPaymentOpen}
        feeItem={selectedFeeItem}
        onClose={() => setIsPaymentOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* 4. RECEIPT SCREEN MODAL */}
      <ReceiptScreen
        isOpen={isReceiptOpen}
        transaction={selectedReceipt}
        onClose={() => setIsReceiptOpen(false)}
      />

    </div>
  );
};

export default App;
