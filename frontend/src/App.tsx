import React, { useState } from 'react';
import type { User, FeeItem, Transaction, NotificationItem, UserRole } from './types';
import {
  mockCurrentStudent,
  mockAdmin,
  mockFeeItems,
  mockTransactions,
  mockAIRiskPredictions,
  mockNotifications,
} from './data/mockData';
import { Header } from './components/Header';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { PaymentModal } from './components/PaymentModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { LoginModal } from './components/LoginModal';

export const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentUser, setCurrentUser] = useState<User>(mockCurrentStudent);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');

  const [feeItems, setFeeItems] = useState<FeeItem[]>(mockFeeItems);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [riskPredictions] = useState(mockAIRiskPredictions);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedFeeItem, setSelectedFeeItem] = useState<FeeItem | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleLogin = (role: UserRole) => {
    setCurrentUser(role === 'student' ? mockCurrentStudent : mockAdmin);
    setIsLoggedIn(true);
  };

  const handleSwitchRole = (role: UserRole) => {
    setCurrentUser(role === 'student' ? mockCurrentStudent : mockAdmin);
  };

  const handleToggleViewport = () => {
    setViewportMode((prev) => (prev === 'desktop' ? 'mobile' : 'desktop'));
  };

  const handleOpenPaymentModal = (feeItem: FeeItem) => {
    setSelectedFeeItem(feeItem);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (newTxn: Transaction) => {
    // 1. Add new transaction
    setTransactions((prev) => [newTxn, ...prev]);

    // 2. Update fee item status to paid
    if (selectedFeeItem) {
      setFeeItems((prev) =>
        prev.map((item) => (item.id === selectedFeeItem.id ? { ...item, status: 'paid' } : item))
      );
    }

    // 3. Add FCM Push notification
    const newNotif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: 'Payment Received Successfully',
      message: `Receipt ${newTxn.receiptNo} generated for ${newTxn.feeType} (₹${newTxn.amountPaid.toLocaleString('en-IN')}).`,
      timestamp: 'Just now',
      read: false,
      type: 'payment',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleTriggerFCMReminder = (studentName: string) => {
    const newNotif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: 'FCM Reminder Sent',
      message: `Push notification alert sent to ${studentName} for overdue fee payment.`,
      timestamp: 'Just now',
      read: false,
      type: 'ai_alert',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  if (!isLoggedIn) {
    return <LoginModal onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Header Navigation */}
      <Header
        currentUser={currentUser}
        onSwitchRole={handleSwitchRole}
        viewportMode={viewportMode}
        onToggleViewport={handleToggleViewport}
        unreadNotifCount={unreadNotifCount}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onLogout={() => setIsLoggedIn(false)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 py-6 px-4 lg:px-8">
        <div
          className={`mx-auto transition-all duration-300 ${
            viewportMode === 'mobile'
              ? 'max-w-sm rounded-[40px] border-[10px] border-slate-900 shadow-2xl p-4 bg-slate-950 min-h-[750px] my-4'
              : 'max-w-7xl'
          }`}
        >
          {currentUser.role === 'student' ? (
            <StudentDashboard
              student={currentUser}
              feeItems={feeItems}
              transactions={transactions}
              onOpenPaymentModal={handleOpenPaymentModal}
            />
          ) : (
            <AdminDashboard
              admin={currentUser}
              riskPredictions={riskPredictions}
              onTriggerFCMReminder={handleTriggerFCMReminder}
            />
          )}
        </div>
      </main>

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        feeItem={selectedFeeItem}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* FCM Push Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAllRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
      />

      {/* Footer */}
      <footer className="py-4 border-t border-slate-900 text-center text-xs text-slate-500">
        SmartFee AI Cross-Platform Architecture • Android • iOS • Windows • Integrated Payment & AI Risk Engine
      </footer>

    </div>
  );
};

export default App;
