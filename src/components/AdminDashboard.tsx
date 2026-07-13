import React, { useState } from "react";
import { 
  Users, 
  FileCheck, 
  XCircle, 
  AlertCircle, 
  DollarSign, 
  Search, 
  Filter, 
  Download, 
  Settings, 
  BookOpen, 
  GraduationCap, 
  ChevronRight,
  TrendingUp,
  Cpu,
  MailCheck,
  CheckCircle,
  Clock
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line 
} from "recharts";
import { ApplicationStatus, VerificationStatus, Role } from "../types";

interface AdminDashboardProps {
  students: any[];
  applications: any[];
  courses: any[];
  faculty: any[];
  onUpdateAppStatus: (appId: string, status: ApplicationStatus) => void;
  onNavigate: (page: string) => void;
}

export default function AdminDashboard({
  students,
  applications,
  courses,
  faculty,
  onUpdateAppStatus,
  onNavigate
}: AdminDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"queue" | "courses" | "faculty">("queue");

  // Counter Statistics
  const totalApps = applications.length + 128; // loaded demo metrics
  const approvedApps = Math.floor(totalApps * 0.65);
  const rejectedApps = Math.floor(totalApps * 0.05);
  const pendingApps = totalApps - approvedApps - rejectedApps;
  const simulatedRevenue = approvedApps * 8500;

  // Chart Data Configurations
  const barData = courses.map(c => ({ name: c.code, filled: c.filled, capacity: c.intake }));
  const pieData = [
    { name: "Approved", value: approvedApps, color: "#10b981" },
    { name: "Pending Verify", value: pendingApps, color: "#f59e0b" },
    { name: "Rejected", value: rejectedApps, color: "#ef4444" }
  ];

  // Filtering Application list
  const filteredApps = applications.filter((app) => {
    const matchesSearch = app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || app.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const exportCSV = () => {
    const headers = ["Application ID", "Student Name", "Course Preferred", "Status", "Last Updated"];
    const rows = filteredApps.map(a => [a.id, a.studentName, a.course, a.status, a.lastUpdated]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Admissions_Report_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Admissions Registrar Console</h1>
          <p className="text-xs text-gray-500 dark:text-slate-400">Track incoming cohorts, manage academic program rosters, and allocate faculty counsel advisorships.</p>
        </div>

        <button 
          onClick={() => onNavigate("crm")}
          className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all shrink-0"
        >
          <Cpu className="h-4 w-4" />
          <span>Go to Salesforce CRM</span>
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Candidates</span>
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-xl font-black font-mono">{totalApps}</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Enrollment Rate</span>
            <FileCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-xl font-black font-mono">{approvedApps}</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pending Audit</span>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-xl font-black font-mono">{pendingApps}</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pipeline Revenue</span>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </div>
          <p className="text-xl font-black font-mono">${simulatedRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Visual Analytics Plots Panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Department Fill Rates */}
        <div className="lg:col-span-8 bg-white border border-gray-100 p-5 rounded-3xl dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Course Intake Capacities</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "none", borderRadius: "12px", color: "#fff", fontSize: "11px" }} />
                <Bar dataKey="filled" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="capacity" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Funnel Ratios */}
        <div className="lg:col-span-4 bg-white border border-gray-100 p-5 rounded-3xl dark:border-slate-800 dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Admissions Split</h3>
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-3 text-[10px] font-bold">
            {pieData.map(p => (
              <span key={p.name} className="flex items-center space-x-1">
                <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                <span>{p.name} ({p.value})</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-gray-100 dark:border-slate-800 pb-px">
        <button
          onClick={() => setActiveTab("queue")}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${activeTab === 'queue' ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          Applications Queue ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab("courses")}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${activeTab === 'courses' ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          Roster Specifications ({courses.length})
        </button>
        <button
          onClick={() => setActiveTab("faculty")}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${activeTab === 'faculty' ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          Faculty Advisor Council ({faculty.length})
        </button>
      </div>

      {/* Tab Area Panel */}
      {activeTab === "queue" && (
        <div className="bg-white border border-gray-100 rounded-3xl p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-64">
              <Search className="h-4 w-4 text-gray-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                placeholder="Search file number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-1.5 pl-9 pr-4 text-xs"
              />
            </div>

            <div className="flex space-x-2 w-full sm:w-auto">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-50 border border-gray-200 dark:bg-slate-950 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 w-full sm:w-auto"
              >
                <option value="all">Filter: All phases</option>
                {Object.values(ApplicationStatus).map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>

              <button 
                onClick={exportCSV}
                className="flex items-center space-x-1 px-3 py-1.5 border border-gray-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 w-full sm:w-auto shrink-0 justify-center"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Applications Table list */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300 divide-y divide-gray-100 dark:divide-slate-800">
              <thead>
                <tr className="text-gray-400 dark:text-slate-500 uppercase tracking-widest text-[9px] font-black">
                  <th className="py-3 px-2">Application File</th>
                  <th className="py-3 px-2">Program Requested</th>
                  <th className="py-3 px-2">Current Phase</th>
                  <th className="py-3 px-2">Last Updated</th>
                  <th className="py-3 px-2 text-right">Actions Actionable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800/55">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                    <td className="py-4 px-2 font-bold text-slate-900 dark:text-white">
                      <div>{app.studentName}</div>
                      <div className="text-[10px] text-gray-400 font-mono font-normal">{app.id}</div>
                    </td>
                    <td className="py-4 px-2 max-w-xs truncate">{app.course}</td>
                    <td className="py-4 px-2">
                      <span className="px-2 py-0.5 font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 rounded">
                        {app.status}
                      </span>
                    </td>
                    <td className="py-4 px-2 font-mono text-gray-400">{new Date(app.lastUpdated).toLocaleDateString()}</td>
                    <td className="py-4 px-2 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => onUpdateAppStatus(app.id, ApplicationStatus.Confirmed)}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                          title="Confirm Admissions Approval"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onUpdateAppStatus(app.id, ApplicationStatus.Rejected)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Reject Application File"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* Course Specifications spec tab */}
      {activeTab === "courses" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(c => (
            <div key={c.id} className="bg-white border border-gray-100 rounded-3xl p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">{c.code}</span>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{c.name}</h4>
                </div>
              </div>

              <div className="border-t border-gray-50 pt-3 dark:border-slate-800/50 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Core Department:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{c.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration Period:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{c.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Filled Slots Ratio:</span>
                  <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400">{c.filled} / {c.intake} seats</span>
                </div>
              </div>

              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full" style={{ width: `${(c.filled / c.intake) * 100}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Faculty tab */}
      {activeTab === "faculty" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faculty.map(f => (
            <div key={f.id} className="bg-white border border-gray-100 rounded-3xl p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex flex-col justify-between h-44">
              <div className="flex items-start space-x-3">
                <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{f.name}</h4>
                  <p className="text-[10px] text-gray-400">{f.role}</p>
                </div>
              </div>

              <div className="border-t border-gray-50 pt-3 dark:border-slate-800/50 flex justify-between items-center text-xs">
                <div>
                  <p className="text-[10px] text-gray-400">Active Students Assigned</p>
                  <p className="font-bold font-mono text-indigo-600 dark:text-indigo-400">{f.assignedStudentsCount} Candidates</p>
                </div>
                <span className="text-[9px] bg-slate-50 dark:bg-slate-950/40 border border-gray-100 dark:border-slate-800 px-2.5 py-1 rounded-full font-bold">
                  {f.department}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
