import React, { useState } from 'react';
import type { FeeItem, Transaction } from '../types';
import { X, CreditCard, Smartphone, ShieldCheck, ArrowRight } from 'lucide-react';

interface PaymentScreenProps {
  isOpen: boolean;
  feeItem: FeeItem | null;
  onClose: () => void;
  onPaymentSuccess: (txn: Transaction) => void;
}

export const PaymentScreen: React.FC<PaymentScreenProps> = ({
  isOpen,
  feeItem,
  onClose,
  onPaymentSuccess,
}) => {
  const [amount, setAmount] = useState<number>(feeItem ? feeItem.amount : 0);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Credit Card'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync amount when feeItem changes
  React.useEffect(() => {
    if (feeItem) {
      setAmount(feeItem.amount);
    }
  }, [feeItem]);

  if (!isOpen || !feeItem) return null;

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
      2,
      '0'
    )}`;

    const newTxn: Transaction = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      receiptNo: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: 'STU-2026-042',
      studentName: 'Alex Rivera',
      rollNo: '2026-CS-042',
      amountPaid: amount,
      paymentMethod: paymentMethod === 'UPI' ? 'UPI' : 'Credit Card',
      gateway: paymentMethod === 'UPI' ? 'Razorpay' : 'Stripe',
      transactionDate: formattedDate,
      feeType: feeItem.title,
      status: 'SUCCESS',
    };

    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess(newTxn);
    }, 1000);
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

        {/* Modal Header */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md">
            Payment Gateway
          </span>
          <h2 className="text-xl font-black text-slate-900">{feeItem.title}</h2>
          <p className="text-xs text-slate-500 font-medium">Category: {feeItem.category}</p>
        </div>

        {/* Form: Essential Options Only */}
        <form onSubmit={handlePayNow} className="space-y-5">
          
          {/* 1. Enter Amount */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Enter Amount (₹)</label>
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

          {/* 2. Select Payment Method (UPI / Card) */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">Select Payment Method</label>
            <div className="grid grid-cols-2 gap-3">
              
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                  paymentMethod === 'UPI'
                    ? 'border-blue-600 bg-blue-50 text-blue-600 font-bold shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <Smartphone className="w-6 h-6 mb-1.5" />
                <span className="text-xs">UPI / GPay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Credit Card')}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                  paymentMethod === 'Credit Card'
                    ? 'border-blue-600 bg-blue-50 text-blue-600 font-bold shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <CreditCard className="w-6 h-6 mb-1.5" />
                <span className="text-xs">Credit / Debit Card</span>
              </button>

            </div>
          </div>

          {/* Security Badge */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>256-Bit SSL Encrypted & RBI Verified Gateway</span>
          </div>

          {/* 3. Big Pay Now Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all"
          >
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Pay ₹{amount.toLocaleString('en-IN')} Now</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};
