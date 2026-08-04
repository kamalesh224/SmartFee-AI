import React, { useState } from 'react';
import type { UserRole } from '../types';
import { Sparkles, ShieldCheck, UserCheck, ArrowRight, Lock, Mail } from 'lucide-react';

interface LoginModalProps {
  onLogin: (role: UserRole) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('alex.rivera@smartfee.edu');
  const [password, setPassword] = useState('••••••••••••');

  const handleRoleToggle = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'student') {
      setEmail('alex.rivera@smartfee.edu');
    } else {
      setEmail('s.jenkins@smartfee.edu');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRole);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Glow Spheres */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 glass-panel animate-in fade-in zoom-in-95 duration-300">
        
        {/* Brand Logo Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center mx-auto shadow-xl shadow-blue-500/20">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">SmartFee <span className="gradient-text">AI</span></h1>
          <p className="text-xs text-slate-400">Autonomous Student Fee & AI Prediction Platform</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => handleRoleToggle('student')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedRole === 'student'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Student Login
          </button>

          <button
            type="button"
            onClick={() => handleRoleToggle('admin')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedRole === 'admin'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Admin Portal
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Institutional Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all mt-6"
          >
            Sign In as {selectedRole === 'student' ? 'Student' : 'Administrator'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-[11px] text-slate-500">
          Demo Mode Enabled • Select role above & click Sign In
        </div>

      </div>
    </div>
  );
};
