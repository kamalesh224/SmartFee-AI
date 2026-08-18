// agent-notes: { ctx: "Simplified unified login portal with role toggle, clean UI, and demo quick-fill", deps: ["src/types.ts", "src/data/mockData.ts", "src/lib/supabase.ts"], state: active, last: "antigravity@2026-08-18" }
import React, { useState } from 'react';
import type { UserRole, User, AIRiskPrediction } from '../types';
import { mockCurrentStudent, mockAdmin, mockAIRiskPredictions } from '../data/mockData';
import { supabase } from '../lib/supabase';
import {
  GraduationCap,
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  User as UserIcon,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (role: UserRole, user?: User) => void;
  initialRole?: UserRole;
  registeredStudents?: AIRiskPrediction[];
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  initialRole = 'student',
  registeredStudents = mockAIRiskPredictions,
}) => {
  const [activeRole, setActiveRole] = useState<UserRole>(initialRole);

  // Student Form State
  const [studentQuery, setStudentQuery] = useState('Alex Rivera');
  const [studentPassword, setStudentPassword] = useState('smartfee2026');

  // Admin Form State
  const [adminEmail, setAdminEmail] = useState('s.jenkins@smartfee.edu');
  const [adminPassword, setAdminPassword] = useState('adminfee2026');

  // Common UI State
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleQuickFill = () => {
    if (activeRole === 'student') {
      const demoStudent = registeredStudents[0] || mockAIRiskPredictions[0];
      setStudentQuery(demoStudent.studentName);
      setStudentPassword(demoStudent.password || 'smartfee2026');
      setSuccessMessage(`Demo loaded: ${demoStudent.studentName} (${demoStudent.rollNo})`);
    } else {
      setAdminEmail('s.jenkins@smartfee.edu');
      setAdminPassword('adminfee2026');
      setSuccessMessage('Demo loaded: Dr. Sarah Jenkins (Admin)');
    }
    setTimeout(() => setSuccessMessage(null), 2500);
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const queryLower = studentQuery.trim().toLowerCase();

    // Look for matching student in registered roster
    const match = registeredStudents.find(
      (s) =>
        s.studentName.toLowerCase().includes(queryLower) ||
        s.rollNo.toLowerCase().includes(queryLower) ||
        (s.email && s.email.toLowerCase() === queryLower)
    );

    setTimeout(() => {
      if (!match) {
        setIsLoading(false);
        setErrorMessage('Student not found in institutional database. Please contact Admin.');
        return;
      }

      if (match.password && match.password !== studentPassword) {
        setIsLoading(false);
        setErrorMessage('Incorrect password. Please verify and try again.');
        return;
      }

      const verifiedUser: User = {
        id: match.studentId || `STU-${Date.now()}`,
        name: match.studentName,
        email: match.email || `${match.studentName.toLowerCase().replace(/\s+/g, '.')}@smartfee.edu`,
        role: 'student',
        department: match.department,
        rollNo: match.rollNo,
        academicYear: match.academicYear,
        avatarUrl: mockCurrentStudent.avatarUrl,
      };

      setIsLoading(false);
      onLogin('student', verifiedUser);
    }, 400);
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Optional Supabase auth attempt
      await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword,
      });
    } catch {
      // Fallback gracefully
    }

    setTimeout(() => {
      setIsLoading(false);
      onLogin('admin', mockAdmin);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-blue-600 selection:text-white">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20 mb-1">
            {activeRole === 'student' ? (
              <GraduationCap className="w-6 h-6" />
            ) : (
              <ShieldCheck className="w-6 h-6" />
            )}
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">SmartFee AI</h1>
          <p className="text-xs text-slate-400 font-medium">
            Institutional Fee & AI Prediction Platform
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveRole('student');
              setErrorMessage(null);
            }}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all ${
              activeRole === 'student'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Student Portal
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveRole('admin');
              setErrorMessage(null);
            }}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all ${
              activeRole === 'admin'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Admin Portal
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* STUDENT FORM */}
        {activeRole === 'student' ? (
          <form onSubmit={handleStudentSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Student Name or Roll Number</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={studentQuery}
                  onChange={(e) => setStudentQuery(e.target.value)}
                  placeholder="e.g. Alex Rivera or 2026-CS-042"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={studentPassword}
                  onChange={(e) => setStudentPassword(e.target.value)}
                  placeholder="Enter your student password"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all mt-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Student Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* ADMIN FORM */
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Admin Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="e.g. s.jenkins@smartfee.edu"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Admin Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 transition-all mt-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Admin Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Quick Demo Credentials Button */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">Testing account?</span>
          <button
            type="button"
            onClick={handleQuickFill}
            className="flex items-center gap-1 text-[11px] font-bold text-purple-400 hover:text-purple-300 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>Load Demo Credentials</span>
          </button>
        </div>

        {/* Footer Note */}
        <div className="text-center text-[10px] text-slate-500 font-medium">
          Vaigai College of Engineering • Anna University Campus
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
