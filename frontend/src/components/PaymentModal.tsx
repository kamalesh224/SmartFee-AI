import React, { useState } from 'react';
import type { FeeItem, Transaction } from '../types';
import { X, CreditCard, QrCode, Building, ShieldCheck, CheckCircle2, Loader2, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

import { initiateRazorpayPayment } from '../lib/razorpay';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  feeItem: FeeItem | null;
  onPaymentSuccess: (transaction: Transaction) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  feeItem,
  onPaymentSuccess,
}) => {
  const [gateway, setGateway] = useState<'Razorpay' | 'Stripe'>('Razorpay');
  const [method, setMethod] = useState<'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !feeItem) return null;

  const handlePayNow = async () => {
    if (gateway === 'Razorpay') {
      setIsProcessing(true);
      await initiateRazorpayPayment({
        feeItem,
        amount: feeItem.amount,
        paymentMethod: method,
        onSuccess: (newTxn) => {
          setIsProcessing(false);
          setIsSuccess(true);
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
          setTimeout(() => {
            onPaymentSuccess(newTxn);
            setIsSuccess(false);
            onClose();
          }, 1500);
        },
        onFailure: (err) => {
          console.error('Razorpay Error:', err);
          setIsProcessing(false);
        },
        onDismiss: () => {
          setIsProcessing(false);
        },
      });
      return;
    }

    // Stripe / Simulated fallback
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      // Trigger Confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      const newTxn: Transaction = {
        id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        receiptNo: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        studentId: 'STU-2026-042',
        studentName: 'Alex Rivera',
        rollNo: '2026-CS-042',
        amountPaid: feeItem.amount,
        paymentMethod: method,
        gateway: gateway,
        transactionDate: new Date().toLocaleString(),
        feeType: feeItem.title,
        status: 'SUCCESS',
      };

      setTimeout(() => {
        onPaymentSuccess(newTxn);
        setIsSuccess(false);
        onClose();
      }, 2000);

    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Secure Gateway Checkout</h3>
              <p className="text-xs text-slate-400">256-bit Encrypted Transaction</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-white">Payment Received!</h4>
            <p className="text-xs text-slate-300">
              ₹{feeItem.amount.toLocaleString('en-IN')} paid successfully via {gateway} ({method}). Receipt generated automatically.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            
            {/* Fee Item Summary Box */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">{feeItem.category} Fee</span>
                <h4 className="text-sm font-semibold text-white mt-0.5">{feeItem.title}</h4>
                <p className="text-xs text-slate-400">Due: {feeItem.dueDate}</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Amount Due</div>
                <div className="text-lg font-extrabold text-emerald-400">₹{feeItem.amount.toLocaleString('en-IN')}</div>
              </div>
            </div>

            {/* Gateway Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">Select Payment Gateway</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGateway('Razorpay')}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    gateway === 'Razorpay'
                      ? 'bg-blue-600/10 border-blue-500 text-white'
                      : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold">Razorpay (India)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">UPI / Cards</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGateway('Stripe')}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    gateway === 'Stripe'
                      ? 'bg-purple-600/10 border-purple-500 text-white'
                      : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold">Stripe (Intl)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">Cards / Wire</span>
                </button>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">Payment Method</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'UPI', label: 'UPI Instant', icon: QrCode },
                  { id: 'Credit Card', label: 'Credit Card', icon: CreditCard },
                  { id: 'Debit Card', label: 'Debit Card', icon: CreditCard },
                  { id: 'Net Banking', label: 'Net Banking', icon: Building },
                ].map((item) => {
                  const IconComponent = item.icon;
                  const isSelected = method === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMethod(item.id as any)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                          : 'bg-slate-800/50 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="text-[11px] font-medium leading-tight">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Simulated Payment Input Details */}
            {method === 'UPI' ? (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <label className="text-xs font-medium text-slate-400">Virtual Payment Address (VPA / UPI ID)</label>
                <input
                  type="text"
                  defaultValue="alex.rivera@okaxis"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
                <p className="text-[11px] text-slate-500">Instant approval via GPay, PhonePe, Paytm, BHIM</p>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-400">Card Number</label>
                  <input
                    type="text"
                    defaultValue="4532 •••• •••• 8842"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 mt-1 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-slate-400">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      defaultValue="08/29"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 mt-1 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400">CVV</label>
                    <input
                      type="password"
                      defaultValue="•••"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 mt-1 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Pay Action Button */}
            <button
              onClick={handlePayNow}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying with {gateway}...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Pay ₹{feeItem.amount.toLocaleString('en-IN')} Now
                </>
              )}
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
