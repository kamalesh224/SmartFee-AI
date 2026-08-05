import React from 'react';
import type { User, FeeItem, Transaction } from '../types';
import { DollarSign, CheckCircle2, AlertCircle, Calendar, CreditCard, Receipt, LogOut } from 'lucide-react';

interface StudentDashboardScreenProps {
  student: User;
  feeItems: FeeItem[];
  transactions: Transaction[];
  onOpenPayment: (feeItem: FeeItem) => void;
  onViewReceipt: (txn: Transaction) => void;
  onLogout: () => void;
}

export const StudentDashboardScreen: React.FC<StudentDashboardScreenProps> = ({
  student,
  feeItems,
  transactions,
  onOpenPayment,
  onViewReceipt,
  onLogout,
}) => {
  const totalFees = feeItems.reduce((acc, item) => acc + item.amount, 0);
  const paidAmount = feeItems
    .filter((item) => item.status === 'paid')
    .reduce((acc, item) => acc + item.amount, 0);
  const pendingAmount = totalFees - paidAmount;
  const nextDueDate = feeItems.find((item) => item.status !== 'paid')?.dueDate || 'Aug 25, 2026';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 lg:p-8 selection:bg-blue-600 selection:text-white">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Student Header */}
        <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
              Student Dashboard
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-1">{student.name}</h1>
            <p className="text-xs text-slate-500 font-medium">
              {student.department} • <span className="font-mono text-slate-700">{student.rollNo}</span> • {student.academicYear}
            </p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* 4 Cards Layout (VERY IMPORTANT FOR MODERN LOOK) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Fees */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Total Fees</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">
              ₹{totalFees.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] font-medium text-slate-400">Total Academic Fee</div>
          </div>

          {/* Card 2: Paid Amount */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Paid Amount</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-600">
              ₹{paidAmount.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] font-medium text-emerald-600">Cleared & Verified</div>
          </div>

          {/* Card 3: Pending Amount */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Pending Amount</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-600">
              ₹{pendingAmount.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] font-medium text-amber-600">Outstanding Balance</div>
          </div>

          {/* Card 4: Due Date */}
          <div className="bg-blue-600 text-white p-5 rounded-3xl shadow-lg shadow-blue-600/20 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-blue-100">
              <span>Next Due Date</span>
              <div className="w-8 h-8 rounded-xl bg-white/20 text-white flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white">{nextDueDate}</div>
            <div className="text-[11px] font-medium text-blue-100">Upcoming Deadline</div>
          </div>

        </div>

        {/* Fee Items List Cards */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-black text-slate-900">Fee Items & Payment Breakdown</h2>

          <div className="space-y-3">
            {feeItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100/50 transition-all gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{item.title}</span>
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        item.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Category: {item.category} • Due: {item.dueDate}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-base font-black text-slate-900">
                    ₹{item.amount.toLocaleString('en-IN')}
                  </div>

                  {item.status === 'paid' ? (
                    <button
                      onClick={() => {
                        const txn = transactions.find((t) => t.feeType === item.title) || transactions[0];
                        if (txn) onViewReceipt(txn);
                      }}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-all"
                    >
                      <Receipt className="w-4 h-4 text-blue-600" />
                      View Receipt
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenPayment(item)}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
                    >
                      <CreditCard className="w-4 h-4" />
                      Pay Fee
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};


