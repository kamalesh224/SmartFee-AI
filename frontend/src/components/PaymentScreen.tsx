// agent-notes: { ctx: "Payment Screen with Razorpay test gateway checkout integration and instant receipt triggering", deps: ["src/types/index.ts", "src/lib/razorpay.ts"], state: active, last: "antigravity@2026-08-21" }
import React, { useState } from 'react';
import type { FeeItem, Transaction, User } from '../types';
import { initiateRazorpayPayment, RAZORPAY_KEY_ID } from '../lib/razorpay';
import { X, CreditCard, Smartphone, ShieldCheck, ArrowRight, Lock } from 'lucide-react';

interface PaymentScreenProps {
  isOpen: boolean;
  feeItem: FeeItem | null;
  currentUser?: User;
  onClose: () => void;
  onPaymentSuccess: (txn: Transaction) => void;
}

export const PaymentScreen: React.FC<PaymentScreenProps> = ({
  isOpen,
  feeItem,
  currentUser,
  onClose,
  onPaymentSuccess,
}) => {
  const [amount, setAmount] = useState<number>(feeItem ? feeItem.amount : 0);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Credit Card' | 'Net Banking'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync amount when feeItem changes
  React.useEffect(() => {
    if (feeItem) {
      setAmount(feeItem.amount);
    }
  }, [feeItem]);

  if (!isOpen || !feeItem) return null;

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    await initiateRazorpayPayment({
      feeItem,
      amount,
      paymentMethod,
      student: currentUser,
      onSuccess: (newTxn) => {
        setIsProcessing(false);
        onPaymentSuccess(newTxn);
      },
      onFailure: (err) => {
        console.error('Payment checkout failed:', err);
        setIsProcessing(false);
      },
      onDismiss: () => {
        setIsProcessing(false);
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 font-sans selection:bg-blue-600 selection:text-white animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/60">
              Razorpay Secured Checkout
            </span>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold border border-emerald-200">
              Test Mode
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900">{feeItem.title}</h2>
          <p className="text-xs text-slate-500 font-medium">Category: {feeItem.category} • Due Date: {feeItem.dueDate}</p>
        </div>

        {/* Form: Essential Options */}
        <form onSubmit={handlePayNow} className="space-y-5">
          {/* 1. Enter Amount */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Enter Amount to Pay (₹)</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-sm font-bold text-slate-400">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
                min={1}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-3 text-base font-black text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* 2. Select Payment Method */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">Select Preferred Payment Method</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all ${
                  paymentMethod === 'UPI'
                    ? 'border-blue-600 bg-blue-50/80 text-blue-600 font-bold shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <Smartphone className="w-5 h-5 mb-1" />
                <span className="text-xs">UPI / GPay / QR</span>
                <span className="text-[10px] text-slate-400 font-normal">Zero Gateway Surcharge</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Credit Card')}
                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all ${
                  paymentMethod === 'Credit Card'
                    ? 'border-blue-600 bg-blue-50/80 text-blue-600 font-bold shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <CreditCard className="w-5 h-5 mb-1" />
                <span className="text-xs">Cards / NetBanking</span>
                <span className="text-[10px] text-slate-400 font-normal">Visa / Master / Rupay</span>
              </button>
            </div>
          </div>

          {/* Gateway Credentials Info */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Gateway Provider:</span>
              </div>
              <span className="font-bold text-slate-800">Razorpay</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>Merchant Key:</span>
              <span className="bg-slate-200/80 px-2 py-0.5 rounded text-[10px] text-slate-700">
                {RAZORPAY_KEY_ID.slice(0, 12)}...
              </span>
            </div>
          </div>

          {/* 3. Razorpay Pay Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Launching Razorpay Checkout...</span>
              </div>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Proceed with Razorpay (₹{amount.toLocaleString('en-IN')})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
