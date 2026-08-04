import React, { useState } from 'react';
import type { User, FeeItem, Transaction } from '../types';
import { CreditCard, Download, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { generateReceiptPDF } from '../utils/pdfGenerator';

interface StudentDashboardProps {
  student: User;
  feeItems: FeeItem[];
  transactions: Transaction[];
  onOpenPaymentModal: (feeItem: FeeItem) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  feeItems,
  transactions,
  onOpenPaymentModal,
}) => {
  const [activeTab, setActiveTab] = useState<'fees' | 'transactions'>('fees');

  const totalAssigned = feeItems.reduce((acc, item) => acc + item.amount, 0);
  const totalPaid = feeItems
    .filter((item) => item.status === 'paid')
    .reduce((acc, item) => acc + item.amount, 0);
  const totalPending = totalAssigned - totalPaid;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Student Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-6 border border-slate-800">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={student.avatarUrl}
              alt={student.name}
              className="w-14 h-14 rounded-2xl border-2 border-blue-500/40 object-cover shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white">{student.name}</h2>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Active Enrolled
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {student.department} • <span className="font-mono text-blue-300">{student.rollNo}</span> • {student.academicYear}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400">Current Semester Fee</div>
              <div className="text-lg font-black text-white">₹{totalAssigned.toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Card 1: Paid */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Fees Paid</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-3">₹{totalPaid.toLocaleString('en-IN')}</div>
          <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-medium">
            <span>{Math.round((totalPaid / totalAssigned) * 100)}% Settled</span>
          </div>
        </div>

        {/* Card 2: Pending */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Outstanding Balance</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400 mt-3">₹{totalPending.toLocaleString('en-IN')}</div>
          <div className="text-xs text-slate-400 mt-1">2 Pending Categories Due Soon</div>
        </div>

        {/* Card 3: AI Smart Advice */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              SmartFee AI Insight
            </span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
              Medium Risk
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-3 leading-relaxed">
            Pay <span className="text-white font-semibold">Tuition Fee</span> by Aug 25 to lock in Early-Bird Concession (Save ₹1,500).
          </p>
        </div>

      </div>

      {/* Tabs & Main Table Card */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        
        {/* Navigation Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('fees')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'fees'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Fee Allocation & Dues ({feeItems.length})
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'transactions'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Payment History & Receipts ({transactions.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Fee Allocation Items */}
        {activeTab === 'fees' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950/40">
                  <th className="py-3.5 px-6">Fee Description</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {feeItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-semibold text-white">
                      {item.title}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-300 font-mono">
                      {item.dueDate}
                    </td>
                    <td className="py-4 px-4 font-bold text-white">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4">
                      {item.status === 'paid' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          PAID
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <Clock className="w-3 h-3" />
                          DUE SOON
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {item.status === 'pending' ? (
                        <button
                          onClick={() => onOpenPaymentModal(item)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          Pay Online
                        </button>
                      ) : (
                        <span className="text-slate-500 text-[11px] font-medium">Receipt Ready</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Transactions & Receipts */}
        {activeTab === 'transactions' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950/40">
                  <th className="py-3.5 px-6">Receipt No</th>
                  <th className="py-3.5 px-4">Fee Item</th>
                  <th className="py-3.5 px-4">Payment Method</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Amount Paid</th>
                  <th className="py-3.5 px-6 text-right">Download Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-blue-400">
                      {txn.receiptNo}
                    </td>
                    <td className="py-4 px-4 font-medium text-white">
                      {txn.feeType}
                    </td>
                    <td className="py-4 px-4 text-slate-300">
                      {txn.gateway} ({txn.paymentMethod})
                    </td>
                    <td className="py-4 px-4 text-slate-400 font-mono text-[11px]">
                      {txn.transactionDate}
                    </td>
                    <td className="py-4 px-4 font-bold text-emerald-400">
                      ₹{txn.amountPaid.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => generateReceiptPDF(txn)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 transition-all"
                      >
                        <Download className="w-3.5 h-3.5 text-blue-400" />
                        Download PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};
