import React from 'react';
import type { Transaction } from '../types';
import { X, CheckCircle2, Download } from 'lucide-react';
import { generateReceiptPDF } from '../utils/pdfGenerator';

interface ReceiptScreenProps {
  isOpen: boolean;
  transaction: Transaction | null;
  onClose: () => void;
}

export const ReceiptScreen: React.FC<ReceiptScreenProps> = ({
  isOpen,
  transaction,
  onClose,
}) => {
  if (!isOpen || !transaction) return null;

  const handleDownloadPDF = () => {
    generateReceiptPDF(transaction);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans selection:bg-blue-600 selection:text-white animate-in fade-in duration-200">
      
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Banner */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Payment Successful
          </span>
          <h2 className="text-xl font-black text-slate-900">Official Fee Receipt</h2>
        </div>

        {/* Clean Receipt Card (Essential Info Only) */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3.5">
          
          <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200">
            <span className="font-bold text-slate-500">Payment ID</span>
            <span className="font-mono font-bold text-slate-900">{transaction.id}</span>
          </div>

          <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200">
            <span className="font-bold text-slate-500">Receipt No</span>
            <span className="font-mono font-bold text-blue-600">{transaction.receiptNo}</span>
          </div>

          <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200">
            <span className="font-bold text-slate-500">Amount Paid</span>
            <span className="text-base font-black text-emerald-600">
              ₹{transaction.amountPaid.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200">
            <span className="font-bold text-slate-500">Transaction Date</span>
            <span className="font-semibold text-slate-900">{transaction.transactionDate}</span>
          </div>

          <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200">
            <span className="font-bold text-slate-500">Fee Type</span>
            <span className="font-bold text-slate-900 text-right max-w-[200px] truncate">
              {transaction.feeType}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-500">Payment Method</span>
            <span className="font-semibold text-slate-900">
              {transaction.paymentMethod} ({transaction.gateway})
            </span>
          </div>

        </div>

        {/* Big Download Button */}
        <button
          onClick={handleDownloadPDF}
          className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Download Official PDF Receipt</span>
        </button>

      </div>
    </div>
  );
};
