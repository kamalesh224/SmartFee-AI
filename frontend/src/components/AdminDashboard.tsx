// agent-notes: { ctx: "Admin dashboard component with multi-field student search and risk analytics", deps: ["src/types.ts", "src/data/mockData.ts"], state: active, last: "antigravity@2026-08-15" }
import React, { useState } from 'react';
import type { User, AIRiskPrediction } from '../types';
import { mockAnalyticsData } from '../data/mockData';
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Send,
  Search,
  Filter,
  Sparkles,
  BarChart2,
  PieChart as PieIcon,
  CheckCircle2,
  BellRing,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface AdminDashboardProps {
  admin: User;
  riskPredictions: AIRiskPrediction[];
  onTriggerFCMReminder: (studentName: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  admin,
  riskPredictions,
  onTriggerFCMReminder,
}) => {
  const [adminTab, setAdminTab] = useState<'overview' | 'ai_insights' | 'analytics'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [deptFilter, setDeptFilter] = useState<'ALL' | 'CSE' | 'ECE' | 'EEE' | 'CIVIL' | 'MECH'>('ALL');
  const [remindedStudents, setRemindedStudents] = useState<string[]>([]);

  const filteredPredictions = riskPredictions.filter((item) => {
    const searchLower = searchTerm.toLowerCase().trim();
    const feeStatus = item.pendingAmount === 0 ? 'paid' : 'pending';
    const pendingAmountStr = item.pendingAmount.toString();
    const pendingAmountFormatted = `₹${item.pendingAmount.toLocaleString('en-IN')}`.toLowerCase();

    const matchesSearch =
      !searchLower ||
      item.studentName.toLowerCase().includes(searchLower) ||
      item.rollNo.toLowerCase().includes(searchLower) ||
      item.department.toLowerCase().includes(searchLower) ||
      item.academicYear.toLowerCase().includes(searchLower) ||
      pendingAmountStr.includes(searchLower) ||
      pendingAmountFormatted.includes(searchLower) ||
      feeStatus.includes(searchLower);

    const matchesRisk = riskFilter === 'ALL' || item.riskLevel === riskFilter;
    
    let matchesDept = true;
    if (deptFilter === 'CSE') matchesDept = item.department.toLowerCase().includes('computer');
    else if (deptFilter === 'ECE') matchesDept = item.department.toLowerCase().includes('electronics');
    else if (deptFilter === 'EEE') matchesDept = item.department.toLowerCase().includes('electrical');
    else if (deptFilter === 'CIVIL') matchesDept = item.department.toLowerCase().includes('civil');
    else if (deptFilter === 'MECH') matchesDept = item.department.toLowerCase().includes('mechanical');

    return matchesSearch && matchesRisk && matchesDept;
  });

  const handleSendReminder = (studentName: string) => {
    onTriggerFCMReminder(studentName);
    setRemindedStudents((prev) => [...prev, studentName]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Admin Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white">Institutional Finance Control</h2>
            <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Admin Portal
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Logged in as <span className="text-white font-medium">{admin.name}</span> ({admin.department})
          </p>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setAdminTab('overview')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              adminTab === 'overview'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Overview & Roster
          </button>
          <button
            onClick={() => setAdminTab('ai_insights')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              adminTab === 'ai_insights'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            AI Late Payment Engine
          </button>
          <button
            onClick={() => setAdminTab('analytics')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              adminTab === 'analytics'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Analytics & Reports
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Total Assigned Fees</span>
            <DollarSign className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            ₹{(mockAnalyticsData.overallCollectionStats.totalAssigned / 100000).toFixed(1)} L
          </div>
          <div className="text-[11px] text-slate-400 mt-1">AY 2026-27 Enrollment</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Total Collected</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-2">
            ₹{(mockAnalyticsData.overallCollectionStats.totalCollected / 100000).toFixed(1)} L
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-medium">
            {mockAnalyticsData.overallCollectionStats.complianceRate}% Collection Rate
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Outstanding Due</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 mt-2">
            ₹{(mockAnalyticsData.overallCollectionStats.totalPending / 100000).toFixed(1)} L
          </div>
          <div className="text-[11px] text-amber-400 mt-1 font-medium">Pending Collection</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/40">
          <div className="flex items-center justify-between text-xs font-semibold text-purple-300">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              High Risk Cohort
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400">
              AI Alert
            </span>
          </div>
          <div className="text-2xl font-black text-rose-400 mt-2">
            {mockAnalyticsData.overallCollectionStats.highRiskCount} Students
          </div>
          <div className="text-[11px] text-slate-300 mt-1">Predicted &gt;80% delay probability</div>
        </div>

      </div>

      {/* TAB 1: OVERVIEW & ROSTER */}
      {adminTab === 'overview' && (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden space-y-4 p-5">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search Student Name, Roll Number, Department, Academic Year, Pending Fee, Fee Status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-400">Filter Risk:</span>
              {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setRiskFilter(lvl)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    riskFilter === lvl
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Department Filter Bar */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60 overflow-x-auto pb-1">
            <span className="text-[11px] font-bold text-slate-400 shrink-0">Department:</span>
            {(
              [
                { code: 'ALL', label: 'All Depts' },
                { code: 'CSE', label: 'CSE (Computer Science)' },
                { code: 'ECE', label: 'ECE (Electronics)' },
                { code: 'EEE', label: 'EEE (Electrical)' },
                { code: 'CIVIL', label: 'Civil Eng.' },
                { code: 'MECH', label: 'Mechanical' },
              ] as const
            ).map((dept) => (
              <button
                key={dept.code}
                onClick={() => setDeptFilter(dept.code)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-all ${
                  deptFilter === dept.code
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {dept.label}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950/50">
                  <th className="py-3.5 px-4">Student Info</th>
                  <th className="py-3.5 px-4">Department & Year</th>
                  <th className="py-3.5 px-4">Pending Amount</th>
                  <th className="py-3.5 px-4">Avg Payment Delay</th>
                  <th className="py-3.5 px-4">AI Risk Prediction</th>
                  <th className="py-3.5 px-4 text-right">FCM Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredPredictions.map((student) => (
                  <tr key={student.studentId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-white">{student.studentName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{student.rollNo}</div>
                    </td>
                    <td className="py-4 px-4 text-slate-300">
                      <div>{student.department}</div>
                      <div className="text-[11px] text-slate-500">{student.academicYear}</div>
                    </td>
                    <td className="py-4 px-4 font-bold text-amber-400">
                      ₹{student.pendingAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4 text-slate-300 font-mono">
                      {student.historicalDelayDaysAvg} days
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold ${
                          student.riskLevel === 'HIGH'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : student.riskLevel === 'MEDIUM'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        <Sparkles className="w-3 h-3" />
                        {student.riskLevel} ({student.probabilityPercentage}%)
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {remindedStudents.includes(student.studentName) ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          FCM Alert Sent
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSendReminder(student.studentName)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-semibold transition-all"
                        >
                          <Send className="w-3 h-3" />
                          Send FCM Alert
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 2: AI LATE PAYMENT ENGINE */}
      {adminTab === 'ai_insights' && (
        <div className="space-y-6">
          
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-950 via-purple-950/20 to-slate-950">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
                  <Sparkles className="w-6 h-6 animate-spin-slow" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Python FastAPI AI Risk Inference Microservice</h3>
                  <p className="text-xs text-slate-400">
                    Model: XGBoost / Random Forest Classifier • Training Dataset: 15,000+ Historical Payment Logs
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  riskPredictions.filter(s => s.riskLevel === 'HIGH').forEach(s => handleSendReminder(s.studentName));
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 text-white text-xs font-extrabold shadow-lg shadow-rose-600/20 hover:scale-105 transition-all"
              >
                <BellRing className="w-4 h-4" />
                Notify All High-Risk Students ({riskPredictions.filter(s => s.riskLevel === 'HIGH').length})
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {riskPredictions.slice(0, 3).map((pred) => (
                <div key={pred.studentId} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{pred.studentName}</h4>
                      <p className="text-[11px] text-slate-400">{pred.department}</p>
                    </div>
                    <span
                      className={`text-xs font-black px-2.5 py-1 rounded-full ${
                        pred.riskLevel === 'HIGH'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {pred.probabilityPercentage}% Risk
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Key AI Risk Drivers:</span>
                    <ul className="space-y-1">
                      {pred.primaryRiskFactors.map((factor, idx) => (
                        <li key={idx} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-400">Avg Payment Delay:</span>
                    <span className="font-bold text-white font-mono">{pred.historicalDelayDaysAvg} days late</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* TAB 3: ANALYTICS & CHARTS */}
      {adminTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Monthly Collection Chart */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-purple-400" />
                Monthly Fee Collection Trend (INR)
              </h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockAnalyticsData.monthlyCollection}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }} />
                  <Bar dataKey="amount" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Department Breakdown */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-emerald-400" />
                Department Payment Compliance %
              </h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={mockAnalyticsData.departmentBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis type="number" stroke="#94a3b8" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" width={110} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }} />
                  <Bar dataKey="paid" fill="#10b981" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
