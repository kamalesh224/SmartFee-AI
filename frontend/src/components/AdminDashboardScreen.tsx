// agent-notes: { ctx: "Admin dashboard screen with multi-field search across student name, roll number, department, academic year, pending fee, fee status", deps: ["src/types.ts"], state: active, last: "antigravity@2026-08-15" }
import React, { useState } from 'react';
import type { User, AIRiskPrediction } from '../types';
import { UserPlus, Filter, Search, LogOut, CheckCircle2, AlertCircle, X } from 'lucide-react';

interface AdminDashboardScreenProps {
  admin: User;
  riskPredictions: AIRiskPrediction[];
  onAddStudent: (newStudent: AIRiskPrediction) => void;
  onLogout: () => void;
}

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({
  admin,
  riskPredictions,
  onAddStudent,
  onLogout,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState<'ALL' | 'CSE' | 'ECE' | 'EEE' | 'CIVIL' | 'MECH'>('ALL');
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);

  // New Student Form State
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [academicYear, setAcademicYear] = useState('3rd Year');
  const [pendingAmount, setPendingAmount] = useState<number>(45000);

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

    let matchesDept = true;
    if (deptFilter === 'CSE') matchesDept = item.department.toLowerCase().includes('computer');
    else if (deptFilter === 'ECE') matchesDept = item.department.toLowerCase().includes('electronics');
    else if (deptFilter === 'EEE') matchesDept = item.department.toLowerCase().includes('electrical');
    else if (deptFilter === 'CIVIL') matchesDept = item.department.toLowerCase().includes('civil');
    else if (deptFilter === 'MECH') matchesDept = item.department.toLowerCase().includes('mechanical');

    return matchesSearch && matchesDept;
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const newPrediction: AIRiskPrediction = {
      studentId: `STU-2026-${Math.floor(100 + Math.random() * 900)}`,
      studentName: name,
      rollNo: rollNo || `2026-DEPT-${Math.floor(10 + Math.random() * 90)}`,
      department,
      academicYear,
      pendingAmount,
      riskLevel: pendingAmount > 40000 ? 'HIGH' : pendingAmount > 20000 ? 'MEDIUM' : 'LOW',
      probabilityPercentage: pendingAmount > 40000 ? 85 : 35,
      historicalDelayDaysAvg: 12,
      primaryRiskFactors: ['Newly enrolled student record', 'Initial fee installment pending'],
      lastPaymentDate: '2026-08-01',
    };

    onAddStudent(newPrediction);
    setIsAddStudentOpen(false);
    setName('');
    setRollNo('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 lg:p-8 selection:bg-blue-600 selection:text-white space-y-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-6 rounded-3xl border border-slate-200 shadow-sm gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
              Vaigai College of Engineering • Anna University Campus
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-1">{admin.name}</h1>
            <p className="text-xs text-slate-500 font-medium">{admin.department} • Administrator Portal</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Big "Add Student" Button */}
            <button
              onClick={() => setIsAddStudentOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              Add Student
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search Student Name, Roll Number, Department, Academic Year, Pending Fee, Fee Status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="text-xs font-bold text-slate-500">
              Showing <span className="text-blue-600">{filteredPredictions.length}</span> Registered Students
            </div>
          </div>

          {/* Filter by Department (CSE, ECE, EEE, Civil, Mech) */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-slate-500 shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Department Filter:
            </span>
            {(
              [
                { code: 'ALL', label: 'All' },
                { code: 'CSE', label: 'CSE' },
                { code: 'ECE', label: 'ECE' },
                { code: 'EEE', label: 'EEE' },
                { code: 'CIVIL', label: 'Civil' },
                { code: 'MECH', label: 'Mechanical' },
              ] as const
            ).map((dept) => (
              <button
                key={dept.code}
                onClick={() => setDeptFilter(dept.code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  deptFilter === dept.code
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {dept.label}
              </button>
            ))}
          </div>

        </div>

        {/* Fee Status Table (View Students) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <h2 className="text-lg font-black text-slate-900">Student Fee Status Table</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
                  <th className="py-3.5 px-4">Student Name</th>
                  <th className="py-3.5 px-4">Roll Number</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Academic Year</th>
                  <th className="py-3.5 px-4">Pending Fee</th>
                  <th className="py-3.5 px-4">Fee Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredPredictions.map((st) => (
                  <tr key={st.studentId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900">{st.studentName}</td>
                    <td className="py-4 px-4 text-slate-600 font-mono">{st.rollNo}</td>
                    <td className="py-4 px-4 font-semibold text-blue-600">{st.department}</td>
                    <td className="py-4 px-4 text-slate-600">{st.academicYear}</td>
                    <td className="py-4 px-4 font-bold text-amber-600">
                      ₹{st.pendingAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold ${
                          st.pendingAmount === 0
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {st.pendingAmount === 0 ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> PAID
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3" /> PENDING
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Add Student Modal */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 relative">
            
            <button
              onClick={() => setIsAddStudentOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md">
                Admin Form
              </span>
              <h2 className="text-xl font-black text-slate-900">Add New Student</h2>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. David Miller"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Roll Number</label>
                <input
                  type="text"
                  required
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  placeholder="e.g. 2026-CS-099"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Academic Year</label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering (CSE)</option>
                  <option value="Electronics & Comm.">Electronics & Communication (ECE)</option>
                  <option value="Electrical Engineering">Electrical & Electronics (EEE)</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Pending Fee Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={pendingAmount}
                  onChange={(e) => setPendingAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all mt-2"
              >
                Save Student Record
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};


