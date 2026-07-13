import React from "react";
import { 
  Sparkles, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  User, 
  CreditCard, 
  Calendar, 
  Download, 
  ArrowRight,
  ShieldCheck,
  Zap,
  PhoneCall
} from "lucide-react";
import { Role, ApplicationStatus, VerificationStatus, DocumentType } from "../types";

interface StudentDashboardProps {
  application: any;
  student: any;
  notifications: any[];
  onNavigate: (page: string) => void;
  onPayFee: () => void;
  onDownloadLetter: () => void;
  onTriggerHeuristicAudit: () => void;
}

export default function StudentDashboard({
  application,
  student,
  notifications,
  onNavigate,
  onPayFee,
  onDownloadLetter,
  onTriggerHeuristicAudit
}: StudentDashboardProps) {

  // Default Fallbacks
  const regId = student?.registrationId || "REG-2026-PENDING";
  const fullName = student?.fullName || "Guest Scholar";
  const selectedCourse = student?.selectedCourse || "No Program Selected";
  const status = application?.status || ApplicationStatus.Submitted;
  const progress = application?.progress || 15;
  const docs = application?.documents || {};

  // Score verification levels
  const verifiedDocsCount = Object.values(docs).filter((d: any) => d.status === VerificationStatus.Valid).length;
  const totalRequiredDocs = 5; // Aadhar, SSC, Inter, Photo, TC
  const profilePercent = Math.min(100, Math.floor(((verifiedDocsCount + (student ? 2 : 0)) / 7) * 100));

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100">
      
      {/* 1. Glassmorphic Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 rounded-3xl p-6 sm:p-8 text-white overflow-hidden shadow-lg shadow-blue-500/10">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Profile ID: {regId}</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Greetings, {fullName}!
          </h1>
          
          <p className="text-sm text-blue-100 leading-relaxed">
            Your file is synchronized. You are currently in the <span className="font-bold underline">{status}</span> phase. Our predictive neural cutoff forecasts a <span className="font-bold text-amber-300">92% eligibility rate</span> for your B.Tech course preference.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate("tracker")}
              className="px-5 py-2.5 bg-white text-indigo-700 hover:bg-slate-50 rounded-xl text-xs font-bold shadow-sm transition-transform active:scale-[0.98]"
            >
              Examine Journey Roadmap
            </button>
            <button
              onClick={() => onNavigate("chatbot")}
              className="px-5 py-2.5 bg-white/15 hover:bg-white/20 border border-white/10 text-white rounded-xl text-xs font-bold transition-all"
            >
              Query Admission Bot
            </button>
          </div>
        </div>

        {/* Floating shapes */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute right-1/4 bottom-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
      </div>

      {/* 2. Interactive KPI Row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        
        {/* Metric 1 */}
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">
            File Completion Rate
          </p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-black font-mono">{profilePercent}%</p>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Verified</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3">
            <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${profilePercent}%` }}></div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">
            Verified Documents
          </p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-black font-mono">{verifiedDocsCount} / {totalRequiredDocs}</p>
            <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">Automatic</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3">
            <div className="bg-purple-600 h-full rounded-full transition-all duration-500" style={{ width: `${(verifiedDocsCount / totalRequiredDocs) * 100}%` }}></div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">
            Current Stage Authority
          </p>
          <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>AI Verified & Synchronized</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-3 leading-relaxed">
            All records synchronized to Salesforce student pipeline index.
          </p>
        </div>

      </div>

      {/* 3. Main Dashboard Double Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* Left Column (8 cols): Progress Details & Audits */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Active Program Card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Preferred Selection</span>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mt-0.5">{selectedCourse}</h3>
              </div>
              <span className="px-2.5 py-1 text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 rounded-full uppercase tracking-wider">
                Rank Match
              </span>
            </div>

            {/* Stage Progress Indicator */}
            <div className="border-t border-gray-100 pt-4 dark:border-slate-800">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-gray-700 dark:text-slate-300">Pipeline Progression</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{progress}% Completed</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-50 dark:border-slate-800/50">
              <span className="text-[10px] bg-slate-50 dark:bg-slate-800/40 px-2.5 py-1 rounded text-gray-500 dark:text-slate-400 font-medium">Entrance Rank: {student?.entranceScore || 185} / 200</span>
              <span className="text-[10px] bg-slate-50 dark:bg-slate-800/40 px-2.5 py-1 rounded text-gray-500 dark:text-slate-400 font-medium">Inter GPA: {student?.interMarks || 91.2}%</span>
            </div>
          </div>

          {/* Documents Status */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Credentials Verification Audit</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400">Examine how integrated computer-vision models verified uploaded transcripts.</p>
              </div>
              <button 
                onClick={() => onNavigate("verify")}
                className="text-xs text-blue-600 hover:underline dark:text-blue-400 font-semibold"
              >
                Upload missing files
              </button>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-slate-800">
              {Object.entries(docs).map(([key, doc]: [string, any]) => (
                <div key={key} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-indigo-500 shrink-0" />
                    <div>
                      <h4 className="text-xs font-semibold text-gray-900 dark:text-white">{key}</h4>
                      <p className="text-[10px] text-gray-400 font-mono">{doc.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {doc.status === VerificationStatus.Valid ? (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 rounded">
                        <span>Valid ({doc.confidence}%)</span>
                      </span>
                    ) : doc.status === VerificationStatus.Pending ? (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 rounded">
                        <span>Pending Scanning</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[9px] font-bold bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400 rounded">
                        <span>{doc.status}</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Simulated verification assistant trigger */}
            {verifiedDocsCount < totalRequiredDocs && (
              <div className="bg-indigo-50/50 border border-indigo-100 dark:bg-slate-950/20 dark:border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center space-x-3 text-left">
                  <Zap className="h-5 w-5 text-amber-500 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Rapid Transcript Audit Scanner</h4>
                    <p className="text-[10px] text-slate-500">Run quick computerized vision checks to instantly populate document state values.</p>
                  </div>
                </div>
                <button
                  onClick={onTriggerHeuristicAudit}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-xl transition-all"
                >
                  Verify All Drafts
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Right Column (4 cols): Quick Actions, Counselling & Payment */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Actions Panel */}
          <div className="bg-white border border-gray-100 rounded-3xl p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => onNavigate("form")}
                className="p-3 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-blue-50 dark:hover:bg-blue-950/10 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800 transition-colors"
              >
                Edit Admission File
              </button>
              <button 
                onClick={() => onNavigate("eligibility")}
                className="p-3 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-purple-50 dark:hover:bg-purple-950/10 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800 transition-colors"
              >
                Recalculate AI Score
              </button>
              <button 
                onClick={() => onNavigate("tracker")}
                className="p-3 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-indigo-50 dark:hover:bg-indigo-950/10 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800 transition-colors"
              >
                Inspect Roadmap
              </button>
              <button 
                onClick={() => onNavigate("chatbot")}
                className="p-3 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-emerald-50 dark:hover:bg-emerald-950/10 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800 transition-colors"
              >
                Speak with Bot
              </button>
            </div>
          </div>

          {/* Counselling Allocation Slot */}
          <div className="bg-white border border-gray-100 rounded-3xl p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Counselling Schedule</h4>
            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
              <div className="text-left">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Virtual Allocation Panel</h4>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">July 5th, 2026 | 10:30 AM PST</p>
                <span className="inline-block text-[9px] bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 px-2 py-0.5 rounded font-bold mt-2">
                  Advisor: Dr. Rajesh Soni
                </span>
              </div>
            </div>
            <button className="flex w-full justify-center items-center space-x-1.5 py-2 border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors">
              <PhoneCall className="h-3.5 w-3.5" />
              <span>Join Live Google Meet</span>
            </button>
          </div>

          {/* Tuition Fee checkout slot */}
          <div className="bg-white border border-gray-100 rounded-3xl p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest leading-none">Financial Desk</h4>
              {status === ApplicationStatus.Confirmed ? (
                <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded uppercase">PAID</span>
              ) : (
                <span className="text-[9px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 px-2 py-0.5 rounded uppercase">DUE</span>
              )}
            </div>

            <div className="space-y-1">
              <p className="text-[10px] text-gray-400">Total Admission Fee Program</p>
              <p className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400">$8,500.00</p>
            </div>

            {status === ApplicationStatus.Confirmed ? (
              <div className="space-y-2">
                <button
                  onClick={onDownloadLetter}
                  className="flex w-full items-center justify-center space-x-2 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-md transition-transform active:scale-[0.98]"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Admission Letter</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={onPayFee}
                  className="flex w-full items-center justify-center space-x-2 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs font-bold rounded-xl shadow-md transition-transform active:scale-[0.98]"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Pay Tuition Checkout</span>
                </button>
                <p className="text-[9px] text-center text-gray-400">Complete verification prior to payment deadlines.</p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
