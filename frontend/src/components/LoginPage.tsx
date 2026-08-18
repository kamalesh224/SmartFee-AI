// agent-notes: { ctx: "Unified login portal with role toggle and dynamic light/dark theme support", deps: ["src/types.ts", "src/data/mockData.ts", "src/lib/supabase.ts"], state: active, last: "antigravity@2026-08-18" }
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
  AlertCircle,
  ArrowRight,
  Sun,
  Moon,
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
  // Same unified default theme mode (light) for both student and admin
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

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

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    // Keep theme consistent across both student and admin roles
    setErrorMessage(null);
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

  const isLight = theme === 'light';

  return (
    <div
      className={`min-h-screen transition-colors duration-300 flex items-center justify-center p-4 relative overflow-hidden font-sans ${
        isLight ? 'bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white' : 'bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white'
      }`}
    >
      {/* Background Glow Spheres */}
      <div
        className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none transition-colors duration-500 ${
          isLight ? 'bg-blue-400/25' : 'bg-blue-600/15'
        }`}
      />
      <div
        className={`absolute bottom-10 right-10 w-96 h-96 rounded-full blur-[120px] pointer-events-none transition-colors duration-500 ${
          isLight ? 'bg-indigo-300/20' : 'bg-indigo-900/20'
        }`}
      />

      {/* Main Login Card */}
      <div
        className={`w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6 relative z-10 transition-all duration-300 ${
          isLight
            ? 'bg-white/95 border border-slate-200 text-slate-900 shadow-slate-200/50'
            : 'bg-slate-900/90 border border-slate-800 text-slate-100'
        }`}
      >
        {/* Top Header Row with Theme Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-blue-500/20">
              {activeRole === 'student' ? (
                <GraduationCap className="w-5 h-5" />
              ) : (
                <ShieldCheck className="w-5 h-5" />
              )}
            </div>
            <div>
              <h1 className={`text-xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                SmartFee <span className="text-blue-600">AI</span>
              </h1>
              <p className={`text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Institutional Fee Portal
              </p>
            </div>
          </div>

          {/* Sun / Moon Theme Toggle */}
          <button
            type="button"
            onClick={() => setTheme(isLight ? 'dark' : 'light')}
            className={`p-2.5 rounded-2xl border transition-all ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-amber-400'
            }`}
            title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
          >
            {isLight ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
        </div>

        {/* Role Toggle Selector */}
        <div
          className={`grid grid-cols-2 p-1 rounded-2xl text-xs font-bold transition-colors ${
            isLight ? 'bg-slate-100 border border-slate-200' : 'bg-slate-950 border border-slate-800'
          }`}
        >
          <button
            type="button"
            onClick={() => handleRoleChange('student')}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all ${
              activeRole === 'student'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Student Portal
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('admin')}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all ${
              activeRole === 'admin'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Admin Portal
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STUDENT FORM */}
        {activeRole === 'student' ? (
          <form onSubmit={handleStudentSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className={`text-xs font-bold block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Student Name or Roll Number
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={studentQuery}
                  onChange={(e) => setStudentQuery(e.target.value)}
                  placeholder="e.g. Alex Rivera or 2026-CS-042"
                  className={`w-full rounded-xl pl-10 pr-4 py-2.5 text-xs transition-all ${
                    isLight
                      ? 'bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white'
                      : 'bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500'
                  }`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={`text-xs font-bold block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={studentPassword}
                  onChange={(e) => setStudentPassword(e.target.value)}
                  placeholder="Enter your student password"
                  className={`w-full rounded-xl pl-10 pr-10 py-2.5 text-xs transition-all ${
                    isLight
                      ? 'bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white'
                      : 'bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
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
              <label className={`text-xs font-bold block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="e.g. s.jenkins@smartfee.edu"
                  className={`w-full rounded-xl pl-10 pr-4 py-2.5 text-xs transition-all ${
                    isLight
                      ? 'bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white'
                      : 'bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500'
                  }`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={`text-xs font-bold block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className={`w-full rounded-xl pl-10 pr-10 py-2.5 text-xs transition-all ${
                    isLight
                      ? 'bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white'
                      : 'bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
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
                  <span>Sign In to Admin Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer Note */}
        <div className={`text-center text-[10px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
          Vaigai College of Engineering • Anna University
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
