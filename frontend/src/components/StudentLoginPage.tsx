// agent-notes: { ctx: "Student login page with Name, Roll No, Email, Password verification against Admin registered roster", deps: ["src/types.ts", "src/data/mockData.ts"], state: active, last: "antigravity@2026-08-18" }
import React, { useState } from 'react';
import type { User, AIRiskPrediction } from '../types';
import {
  Sparkles,
  UserCheck,
  ArrowRight,
  Lock,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  GraduationCap,
  ShieldCheck,
  User as UserIcon,
  Hash,
} from 'lucide-react';
import { mockCurrentStudent, mockAIRiskPredictions } from '../data/mockData';

interface StudentLoginPageProps {
  onLogin: (user: User) => void;
  onSwitchToAdmin: () => void;
  registeredStudents?: AIRiskPrediction[];
}

export const StudentLoginPage: React.FC<StudentLoginPageProps> = ({
  onLogin,
  onSwitchToAdmin,
  registeredStudents = mockAIRiskPredictions,
}) => {
  const [studentName, setStudentName] = useState('Alex Rivera');
  const [rollNo, setRollNo] = useState('2026-CS-042');
  const [email, setEmail] = useState('alex.rivera@smartfee.edu');
  const [password, setPassword] = useState('smartfee2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleQuickFill = (student: AIRiskPrediction) => {
    setStudentName(student.studentName);
    setRollNo(student.rollNo);
    setEmail(student.email || `${student.studentName.toLowerCase().replace(/\s+/g, '.')}@smartfee.edu`);
    setPassword(student.password || 'password123');
    setSuccessMessage(`Loaded ${student.studentName} (${student.rollNo}) credentials!`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanName = studentName.trim().toLowerCase();
    const cleanRollNo = rollNo.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    // 1. Verify if student is registered in Admin Student Roster (by Name/Roll Number or Email)
    const matchingStudent = registeredStudents.find((s) => {
      const sName = s.studentName.trim().toLowerCase();
      const sRoll = s.rollNo.trim().toLowerCase();
      const sEmail = (s.email || '').trim().toLowerCase();

      const isRollAndNameMatch = (sRoll === cleanRollNo || !cleanRollNo) && (sName.includes(cleanName) || cleanName.includes(sName));
      const isEmailMatch = sEmail && sEmail === cleanEmail;

      return isRollAndNameMatch || isEmailMatch;
    });

    setTimeout(() => {
      // 2. If Student detail is NOT added by Admin yet:
      if (!matchingStudent) {
        setIsLoading(false);
        setErrorMessage(
          'Student Verification Failed: Details not found in Admin database. The administrator must add your student details (Name, Roll Number) first before you can verify.'
        );
        return;
      }

      // 3. If password check is enforced:
      if (matchingStudent.password && matchingStudent.password !== password) {
        setIsLoading(false);
        setErrorMessage('Verification Error: Password does not match the registered student record.');
        return;
      }

      // 4. Verification Completed successfully!
      setSuccessMessage(
        `✅ Student Verification Completed for ${matchingStudent.studentName} (${matchingStudent.rollNo})! Redirecting to Student Dashboard...`
      );

      setTimeout(() => {
        setIsLoading(false);
        const verifiedUser: User = {
          id: matchingStudent.studentId || `STU-${Date.now()}`,
          name: matchingStudent.studentName,
          email: matchingStudent.email || email,
          role: 'student',
          department: matchingStudent.department,
          rollNo: matchingStudent.rollNo,
          academicYear: matchingStudent.academicYear,
          avatarUrl: mockCurrentStudent.avatarUrl,
        };
        onLogin(verifiedUser);
      }, 1200);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 lg:p-8 relative overflow-hidden font-sans selection:bg-blue-600 selection:text-white">
      {/* Background Glow Spheres - Student Theme (Blue / Cyan) */}
      <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] bg-blue-600/20 rounded-full blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] bg-cyan-600/15 rounded-full blur-[130px] pointer-events-none animate-pulse" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Side: Student Portal Info */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <GraduationCap className="w-4 h-4" />
            <span>Student Self-Service Portal</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Student Fee <br />
            & <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">Instant Verification</span>
          </h1>

          <p className="text-slate-400 text-sm leading-relaxed">
            Verify your student record added by Admin, view fee dues, pay securely via UPI, Credit/Debit cards, or Net Banking, and download official receipts.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Admin Roster Verification</h4>
                <p className="text-[11px] text-slate-400">Verifies Name, Roll No, Email, and Password against Admin registered student database</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <div className="p-2 rounded-xl bg-cyan-600/20 text-cyan-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Instant Access to Dashboard</h4>
                <p className="text-[11px] text-slate-400">Once verified, access personalized fee breakdown, payment history, and AI alerts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Student Login Form */}
        <div className="lg:col-span-6">
          <div className="bg-slate-900/90 border border-blue-900/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            {/* Top Card Gradient Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="inline-block px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 font-bold text-[10px] uppercase tracking-wider mb-1">
                  Student Verification & Login
                </div>
                <h2 className="text-xl font-bold text-white">Student Login Portal</h2>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-lg">
                <UserCheck className="w-5 h-5" />
              </div>
            </div>

            {/* Notifications */}
            {errorMessage && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <span className="leading-snug">{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Student Name */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Student Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required
                    placeholder="e.g. Alex Rivera"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Roll Number */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Roll Number
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    required
                    placeholder="e.g. 2026-CS-042"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Student Institutional Email */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Student Institutional Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="alex.rivera@smartfee.edu"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">Password</label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
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

              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                  />
                  <span className="text-xs text-slate-400">Remember credentials</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all mt-4"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Verify & Login Student</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Registered Student Quick Fill Demos */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2">
              <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span>Admin Registered Demo Students:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {registeredStudents.slice(0, 3).map((st) => (
                  <button
                    key={st.studentId}
                    type="button"
                    onClick={() => handleQuickFill(st)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-blue-900/40 border border-slate-700 text-[11px] text-blue-300 transition-colors"
                  >
                    {st.studentName} ({st.rollNo})
                  </button>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={onSwitchToAdmin}
                  className="w-full text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Switch to Admin Login (To Add New Students)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
