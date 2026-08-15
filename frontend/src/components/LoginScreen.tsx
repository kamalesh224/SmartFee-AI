// agent-notes: { ctx: "Login screen component for Vaigai College of Engineering (Anna University Campus)", deps: ["src/types.ts"], state: active, last: "antigravity@2026-08-15" }
import React, { useState } from 'react';
import type { UserRole } from '../types';
import { Sparkles, UserCheck, ShieldCheck, ArrowRight, Lock, Mail } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (role: UserRole, email: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole>('student');
  const [emailOrId, setEmailOrId] = useState('alex.rivera@smartfee.edu');
  const [password, setPassword] = useState('password123');

  const handleRoleToggle = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'student') {
      setEmailOrId('alex.rivera@smartfee.edu');
    } else {
      setEmailOrId('s.jenkins@smartfee.edu');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(role, emailOrId);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4 font-sans selection:bg-blue-600 selection:text-white">
      
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-slate-200 space-y-6">
        
        {/* 1. App Logo + Name */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-600/30">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Vaigai College of Engineering</h1>
          <p className="text-xs text-slate-500 font-medium">Anna University Campus • SmartFee AI Portal</p>
        </div>

        {/* 2. Admin / Student Toggle */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => handleRoleToggle('student')}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
              role === 'student'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Student Login
          </button>

          <button
            type="button"
            onClick={() => handleRoleToggle('admin')}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
              role === 'admin'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Admin Login
          </button>
        </div>

        {/* 3. Form: Email/ID & Password */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              {role === 'student' ? 'Email or Student ID' : 'Admin Email'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={emailOrId}
                onChange={(e) => setEmailOrId(e.target.value)}
                required
                placeholder={role === 'student' ? 'STU-2026-042 or email' : 'admin@smartfee.edu'}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* 4. Login Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all mt-6"
          >
            <span>Login as {role === 'student' ? 'Student' : 'Admin'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-[11px] text-slate-400">
          Clean Blue & White Design • SmartFee AI v2.5
        </div>

      </div>
    </div>
  );
};
