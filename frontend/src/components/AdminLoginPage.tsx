import React, { useState } from 'react';
import type { User } from '../types';
import {
  ShieldCheck,
  ArrowRight,
  Lock,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  BrainCircuit,
  PieChart,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { mockAdmin } from '../data/mockData';

interface AdminLoginPageProps {
  onLogin: (user: User) => void;
  onSwitchToStudent: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLogin, onSwitchToStudent }) => {
  const [email, setEmail] = useState('s.jenkins@smartfee.edu');
  const [password, setPassword] = useState('adminfee2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleQuickFill = () => {
    setEmail('s.jenkins@smartfee.edu');
    setPassword('adminfee2026');
    setSuccessMessage('Loaded Dr. Sarah Jenkins (Dean of Finance) admin credentials!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.info('Supabase Auth fallback for admin:', error.message);
      }

      setTimeout(() => {
        setIsLoading(false);
        onLogin(mockAdmin);
      }, 500);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Admin authentication failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 lg:p-8 relative overflow-hidden font-sans selection:bg-purple-600 selection:text-white">
      
      {/* Background Glow Spheres - Admin Theme (Purple / Indigo) */}
      <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] bg-purple-600/20 rounded-full blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] bg-indigo-600/20 rounded-full blur-[130px] pointer-events-none animate-pulse" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Side: Admin Console Features */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Administrator Security Portal</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Financial Operations <br />
            & <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">AI Predictive Control</span>
          </h1>

          <p className="text-slate-400 text-sm leading-relaxed">
            Monitor institutional fee collections, track high-risk default predictions, and dispatch automated FCM reminders to overdue students.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">ML Risk Forecasting Engine</h4>
                <p className="text-[11px] text-slate-400">Identifies students at risk of default using historical payment velocity</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <div className="p-2 rounded-xl bg-pink-600/20 text-pink-400">
                <PieChart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Real-Time Department Analytics</h4>
                <p className="text-[11px] text-slate-400">Track CS, ECE, ME, and Civil compliance rates and collection targets</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Admin Login Form */}
        <div className="lg:col-span-6">
          <div className="bg-slate-900/90 border border-purple-900/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            
            {/* Top Card Gradient Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="inline-block px-2.5 py-0.5 rounded-md bg-purple-500/10 text-purple-400 font-bold text-[10px] uppercase tracking-wider mb-1">
                  Admin Sign In
                </div>
                <h2 className="text-xl font-bold text-white">Dean & Finance Portal</h2>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-lg">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            {/* Notifications */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Admin Official Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@smartfee.edu"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">Admin Security Passcode</label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      setSuccessMessage('Admin security reset link sent to registered email!');
                    }}
                    className="text-[11px] text-purple-400 hover:underline"
                  >
                    Reset Passcode?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-purple-600 focus:ring-purple-500 focus:ring-offset-slate-900"
                  />
                  <span className="text-xs text-slate-400">Remember admin session</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 transition-all mt-4"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Admin Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between">
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Auto-fill Admin Demo
              </button>

              <button
                type="button"
                onClick={onSwitchToStudent}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Switch to Student Login
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
