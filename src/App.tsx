import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Database, 
  MapPin, 
  Phone, 
  Mail, 
  TrendingUp, 
  Users, 
  Cpu, 
  MessageSquare, 
  Lock, 
  ShieldCheck, 
  BookOpen, 
  Send,
  HelpCircle,
  Clock,
  ArrowRight,
  Info,
  CheckCircle,
  AlertTriangle,
  X,
  RefreshCw,
  PieChart,
  AreaChart,
  BarChart,
  GraduationCap,
  Download
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart as ReLineChart, 
  Line as ReLine, 
  XAxis, 
  YAxis, 
  Tooltip as ReTooltip, 
  AreaChart as ReAreaChart, 
  Area as ReArea,
  BarChart as ReBarChart,
  Bar as ReBar,
  Legend
} from "recharts";

import { 
  Role, 
  ApplicationStatus, 
  VerificationStatus, 
  DocumentType,
  StudentProfile,
  ApplicationForm,
  Notification,
  ChatMessage,
  CRMLead,
  CourseData,
  FacultyMember
} from "./types";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import StudentDashboard from "./components/StudentDashboard";
import AdmissionForm from "./components/AdmissionForm";
import AIEligibility from "./components/AIEligibility";
import DocumentVerification from "./components/DocumentVerification";
import Chatbot from "./components/Chatbot";
import AdminDashboard from "./components/AdminDashboard";
import SalesforceCRM from "./components/SalesforceCRM";

export default function App() {
  const [currentRole, setCurrentRole] = useState<Role>(Role.Student);
  const [activePage, setActivePage] = useState<string>("landing");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null);

  // Synced state variables
  const [students, setStudents] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [crmLeads, setCrmLeads] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [faculty, setFaculty] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      sender: "ai",
      content: "Hello! I am your AI Admission Assistant representing Aegis Academy. I can help you calculate dynamic eligibility ratings, scan high-school transcripts, or review Salesforce CRM integration states. What would you like to explore?",
      timestamp: new Date().toISOString(),
      suggestions: ["Am I eligible for B.Tech CS?", "What files should I upload?", "Explain Salesforce CRM sync"]
    }
  ]);

  // Login Form Page State
  const [loginEmail, setLoginEmail] = useState("alex.rivera@example.com");
  const [loginPassword, setLoginPassword] = useState("••••••••");
  const [loginRole, setLoginRole] = useState<Role>(Role.Student);
  const [rememberMe, setRememberMe] = useState(true);

  // Contact Form Page State
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  // Fetch initial synced state from node backend server on startup
  const fetchState = async () => {
    try {
      const response = await fetch("/api/state");
      const data = await response.json();
      setStudents(data.students);
      setApplications(data.applications);
      setNotifications(data.notifications);
      setCrmLeads(data.crmLeads);
      setCourses(data.courses);
      setFaculty(data.faculty);
    } catch (err) {
      console.error("Failed to load initial API state from Express backend:", err);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  // Sync dark mode class with standard body element list classes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Toast Helpers
  const showToast = (message: string, type: "success" | "info" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleMarkNotificationRead = async (id: string) => {
    try {
      await fetch("/api/notifications/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      fetchState();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAllNotifications = async () => {
    try {
      await fetch("/api/notifications/read-all", {
        method: "POST"
      });
      fetchState();
      showToast("Cleared active notifications logs.");
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Admission form handler
  const handleAdmissionFormSubmit = async ({ profile, isDraft }: { profile: any; isDraft: boolean }) => {
    try {
      const response = await fetch("/api/students/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, isDraft })
      });
      const data = await response.json();
      if (data.success) {
        showToast(isDraft ? "Saved application file as draft." : "Submitted application file to admissions queue!");
        fetchState();
        setActivePage("student-dashboard");
      }
    } catch (err) {
      console.error("Form submit failed:", err);
      showToast("Application submission failed.", "error");
    }
  };

  // Document Verification handler
  const handleVerifyDoc = async (docType: DocumentType, fileName: string, base64: string) => {
    const activeApp = applications[0] || { id: "APP-2026-1049" };
    try {
      const response = await fetch("/api/verify-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appId: activeApp.id,
          docType,
          fileName,
          imageBase64: base64
        })
      });
      const data = await response.json();
      if (data.success) {
        showToast(`AI verified document: ${docType} with ${data.verification.confidence}% confidence score!`);
        fetchState();
      }
    } catch (err) {
      console.error(err);
      showToast("Document verification failed.", "error");
    }
  };

  // AI Eligibility Prediction handler
  const handlePredictEligibility = async (params: any) => {
    const activeApp = applications[0] || { id: "APP-2026-1049" };
    try {
      const response = await fetch("/api/predict-eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...params,
          appId: activeApp.id
        })
      });
      const data = await response.json();
      if (data.success) {
        showToast(`Admissions Fit Calculated: ${data.prediction.status}`);
        fetchState();
      }
      return data;
    } catch (err) {
      console.error(err);
      showToast("Failed to calculate AI prediction.", "error");
      return null;
    }
  };

  // AI Chat Assistant messaging handler
  const handleSendChatMessage = async (messageText: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      content: messageText,
      timestamp: new Date().toISOString()
    };
    setChatMessages(prev => [...prev, userMsg]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText })
      });
      const data = await response.json();
      if (data.success) {
        const aiMsg: ChatMessage = {
          id: `msg-ai-${Date.now()}`,
          sender: "ai",
          content: data.content,
          timestamp: new Date().toISOString(),
          suggestions: data.suggestions
        };
        setChatMessages(prev => [...prev, aiMsg]);
      }
    } catch (err) {
      console.error(err);
      showToast("Could not communicate with AI chatbot.", "error");
    }
  };

  // Salesforce Update Lead Stage handler
  const handleUpdateLeadStage = async (leadId: string, stage: CRMLead["stage"]) => {
    try {
      const response = await fetch("/api/crm/leads/update-stage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, stage })
      });
      const data = await response.json();
      if (data.success) {
        showToast(`Salesforce pipeline contact stage advanced to: ${stage}`);
        fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Salesforce Add Task handler
  const handleAddLeadTask = async (leadId: string, title: string, type: string, dueDate: string) => {
    try {
      const response = await fetch("/api/crm/leads/add-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, title, type, dueDate })
      });
      const data = await response.json();
      if (data.success) {
        showToast(`CRM Task Scheduled: "${title}"`);
        fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin Queue Action Update App Status handler
  const handleUpdateAppStatus = async (appId: string, status: ApplicationStatus) => {
    try {
      const response = await fetch("/api/applications/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appId,
          status,
          ...(status === ApplicationStatus.Confirmed && { progress: 100, currentStep: 6 })
        })
      });
      const data = await response.json();
      if (data.success) {
        showToast(`Admissions Queue: Updated Application File Status to ${status}!`);
        
        // Trigger Smart Notification
        await fetch("/api/notifications/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: status === ApplicationStatus.Confirmed ? "Admissions Approved!" : "File Audited",
            content: status === ApplicationStatus.Confirmed 
              ? "Congratulations! Your B.Tech admission file has been approved by the Registrar board."
              : "A registrar official has completed manual review on your file.",
            type: status === ApplicationStatus.Confirmed ? "success" : "warning"
          })
        });

        fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePayFee = async () => {
    const activeApp = applications[0];
    if (activeApp) {
      await handleUpdateAppStatus(activeApp.id, ApplicationStatus.Confirmed);
      showToast("Tuition fee payment processed successfully! Admissions Confirmed.", "success");
    }
  };

  const handleDownloadLetter = () => {
    showToast("Generating dynamic admission certification PDF...");
    setTimeout(() => {
      showToast("Downloaded official admissions letter!", "success");
    }, 1500);
  };

  // Interactive quick pre-fill verifying all documents at once
  const handleTriggerHeuristicAudit = async () => {
    const activeApp = applications[0] || { id: "APP-2026-1049" };
    showToast("Simulating fast automated computer vision audit scanning...");
    
    const dTypes = [DocumentType.Intermediate, DocumentType.TransferCertificate, DocumentType.IncomeCertificate];
    for (const dt of dTypes) {
      await fetch("/api/verify-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appId: activeApp.id,
          docType: dt,
          fileName: `scanned_transcript_${dt.toLowerCase().replace(/ /g, "_")}.jpg`
        })
      });
    }
    fetchState();
  };

  // Mock Login Handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentRole(loginRole);
    showToast(`Welcome back, verified ${loginRole}!`, "success");
    if (loginRole === Role.Student) {
      setActivePage("student-dashboard");
    } else {
      setActivePage("admin-dashboard");
    }
  };

  // Mock Contact Form submission
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Your message has been submitted to Admissions Desk!");
    setContactName("");
    setContactEmail("");
    setContactMessage("");
  };

  const analyticsTrendsData = [
    { name: "Mon", CS: 4000, ME: 2400, EC: 2400 },
    { name: "Tue", CS: 3000, ME: 1398, EC: 2210 },
    { name: "Wed", CS: 2000, ME: 9800, EC: 2290 },
    { name: "Thu", CS: 2780, ME: 3908, EC: 2000 },
    { name: "Fri", CS: 1890, ME: 4800, EC: 2181 },
    { name: "Sat", CS: 2390, ME: 3800, EC: 2500 },
    { name: "Sun", CS: 3490, ME: 4300, EC: 2100 }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      
      {/* 1. Global Sync Indicator Bar */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-[10px] font-mono py-1 px-4 text-center tracking-wider shrink-0 flex items-center justify-center space-x-2">
        <Sparkles className="h-3 w-3 animate-pulse text-amber-300" />
        <span>DEVELOPMENT PREVIEW MODE ACTIVE — PERSISTED SALESFORCE DATABASE PORT: 3000</span>
      </div>

      {/* 2. Responsive Navigation Header */}
      <Navbar
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onClearAllNotifications={handleClearAllNotifications}
        onNavigate={setActivePage}
        activePage={activePage}
      />

      {/* 3. Main Viewport Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* LANDING PAGE VIEW */}
        {activePage === "landing" && (
          <LandingPage
            onStartApplying={() => setActivePage("form")}
            onOpenChat={() => setActivePage("chatbot")}
            onNavigate={setActivePage}
          />
        )}

        {/* LOGIN PAGE VIEW */}
        {activePage === "login" && (
          <div className="max-w-md mx-auto py-12 animate-fade-in">
            <div className="bg-white border border-gray-100 rounded-3xl p-8 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-black">Authorized Portal Gateway</h1>
                <p className="text-xs text-gray-400">Select your registrar role or credential class to simulate platform views.</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                {/* Role Switcher */}
                <div className="space-y-1">
                  <label className="block font-semibold text-gray-600 dark:text-slate-400">Designated Role Account</label>
                  <select
                    value={loginRole}
                    onChange={(e) => setLoginRole(e.target.value as Role)}
                    className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <option value={Role.Student}>Student (Alex Rivera)</option>
                    <option value={Role.Officer}>Admission Officer (Registrar)</option>
                    <option value={Role.Admin}>Admin Console (Superuser)</option>
                    <option value={Role.Mentor}>Faculty Mentor Advisor</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-gray-600 dark:text-slate-400">Primary Email</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-gray-600 dark:text-slate-400">Secure Pin / Password</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-400">
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-indigo-600"
                    />
                    <span>Remember this machine</span>
                  </label>
                  <a href="#" className="hover:underline text-blue-500">Forgotten credential?</a>
                </div>

                <button
                  id="portal-gateway-login-btn"
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-md transition-all text-xs"
                >
                  Gateway Portal Entrance
                </button>
              </form>

              <div className="border-t border-gray-50 pt-4 text-center dark:border-slate-800">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-3">Enterprise OAuth Gateway</p>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  <button onClick={() => showToast("Simulated Google Workspace Connection", "info")} className="py-2 border border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50 rounded-xl">Google ID</button>
                  <button onClick={() => showToast("Simulated Microsoft Azure Connection", "info")} className="py-2 border border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50 rounded-xl">Microsoft AD</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STUDENT DASHBOARD VIEW */}
        {activePage === "student-dashboard" && (
          <StudentDashboard
            application={applications[0]}
            student={students[0]}
            notifications={notifications}
            onNavigate={setActivePage}
            onPayFee={handlePayFee}
            onDownloadLetter={handleDownloadLetter}
            onTriggerHeuristicAudit={handleTriggerHeuristicAudit}
          />
        )}

        {/* APPLICATION ADMISSION FORM VIEW */}
        {activePage === "form" && (
          <AdmissionForm
            courses={courses}
            onFormSubmit={handleAdmissionFormSubmit}
          />
        )}

        {/* AI ELIGIBILITY PREDICTION VIEW */}
        {activePage === "eligibility" && (
          <AIEligibility
            student={students[0]}
            courses={courses}
            onPredict={handlePredictEligibility}
          />
        )}

        {/* DOCUMENT VERIFICATION SCREEN */}
        {activePage === "verify" && (
          <DocumentVerification
            application={applications[0]}
            onVerifyDoc={handleVerifyDoc}
          />
        )}

        {/* ADMISSION JOURNEY TRACKER */}
        {activePage === "tracker" && (
          <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Active Admission Journey Tracker</h1>
              <p className="text-xs text-gray-500 dark:text-slate-400">Monitor automated checking milestones in real-time. Estimations are powered by network latency analysis.</p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Timeline list left */}
              <div className="lg:col-span-8 bg-white border border-gray-100 p-6 rounded-3xl dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-6">
                
                <div className="flex justify-between items-center pb-2 border-b border-gray-50 dark:border-slate-800/50">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Processing Progression</h3>
                  <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">Estimated validation overhead: 4m remaining</span>
                </div>

                <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-4 pl-6 space-y-8">
                  <div className="relative">
                    <div className="absolute -left-9 top-0.5 h-6 w-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white dark:ring-slate-900 shadow-sm">✓</div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Application Submitted</h4>
                      <p className="text-[11px] text-gray-400">File successfully locked with initial parameters. Dispatched CRM sync webhook.</p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-9 top-0.5 h-6 w-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white dark:ring-slate-900 shadow-sm">✓</div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Document verification</h4>
                      <p className="text-[11px] text-gray-400">AI Computer-vision checked stamp markings and transcripts authentication signatures.</p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-9 top-0.5 h-6 w-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold ring-4 ring-white dark:ring-slate-900 shadow-sm animate-pulse">3</div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Eligibility forecasting checks</h4>
                      <p className="text-[11px] text-gray-400">Validating GPA values against historical statistical cutoffs matching target slots.</p>
                    </div>
                  </div>

                  <div className="relative opacity-50">
                    <div className="absolute -left-9 top-0.5 h-6 w-6 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center text-[10px] font-bold ring-4 ring-white dark:ring-slate-900 shadow-sm">4</div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Virtual Counselling Slots Allocation</h4>
                      <p className="text-[11px] text-gray-400">Meet faculty advisors to lock secondary electives choices.</p>
                    </div>
                  </div>

                  <div className="relative opacity-50">
                    <div className="absolute -left-9 top-0.5 h-6 w-6 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center text-[10px] font-bold ring-4 ring-white dark:ring-slate-900 shadow-sm">5</div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Admission Letter confirmation</h4>
                      <p className="text-[11px] text-gray-400">Tuition fee settlement confirmation and instant certification dispatch.</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Status card right */}
              <div className="lg:col-span-4 bg-white border border-gray-100 p-5 rounded-3xl dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4 text-xs">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Telemetry Tracker logs</h4>
                
                <div className="p-4 bg-slate-50 rounded-2xl dark:bg-slate-950/20 border border-slate-50 dark:border-slate-800/50 space-y-2">
                  <div className="flex justify-between font-mono text-[10px]">
                    <span className="text-gray-400">Last heartbeat:</span>
                    <span className="text-emerald-500 font-bold uppercase">ALIVE</span>
                  </div>
                  <div className="flex justify-between font-mono text-[10px]">
                    <span className="text-gray-400">Current Phase status:</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">{applications[0]?.status || ApplicationStatus.Verification}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-700 dark:text-slate-300">Live Webhook logs</h4>
                  <div className="text-[10px] font-mono text-indigo-700 dark:text-indigo-300 space-y-1">
                    <p className="truncate">» [Sync] Connected to Express.js server</p>
                    <p className="truncate">» [POST] /api/verify-document completed (98.4%)</p>
                    <p className="truncate">» [Salesforce] Contact Lead ID synced successfully</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI INTERACTIVE CHATBOT */}
        {activePage === "chatbot" && (
          <Chatbot
            chatMessages={chatMessages}
            onSendMessage={handleSendChatMessage}
          />
        )}

        {/* REGISTRAR ADMIN CONSOLE VIEW */}
        {activePage === "admin-dashboard" && (
          <AdminDashboard
            students={students}
            applications={applications}
            courses={courses}
            faculty={faculty}
            onUpdateAppStatus={handleUpdateAppStatus}
            onNavigate={setActivePage}
          />
        )}

        {/* SALESFORCE CRM VIEW */}
        {activePage === "crm" && (
          <SalesforceCRM
            leads={crmLeads}
            onUpdateLeadStage={handleUpdateLeadStage}
            onAddLeadTask={handleAddLeadTask}
          />
        )}

        {/* ANALYTICS PAGE TRENDS */}
        {activePage === "analytics" && (
          <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight">Academic Analytics trends</h1>
                <p className="text-xs text-gray-500 dark:text-slate-400">Real-time analytical graphs checking intake trendlines and demographic categories splits.</p>
              </div>

              <button 
                onClick={() => showToast("Exported PDF Report successfully!", "success")}
                className="flex items-center space-x-1.5 px-4 py-2 border border-gray-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition-all shrink-0"
              >
                <Download className="h-4 w-4" />
                <span>Export Report PDF</span>
              </button>
            </div>

            {/* Advanced Charts Panels */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              
              {/* Plot 1 */}
              <div className="bg-white border border-gray-100 p-5 rounded-3xl dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">Weekly Applications Volume Trend</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReAreaChart data={analyticsTrendsData}>
                      <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                      <ReTooltip contentStyle={{ background: "#1e293b", border: "none", borderRadius: "12px", color: "#fff", fontSize: "11px" }} />
                      <Legend />
                      <ReArea type="monotone" dataKey="CS" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.15} />
                      <ReArea type="monotone" dataKey="ME" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.15} />
                    </ReAreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Plot 2 */}
              <div className="bg-white border border-gray-100 p-5 rounded-3xl dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">Department Wise Seat Acceptance Ratio</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart data={analyticsTrendsData}>
                      <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                      <ReTooltip contentStyle={{ background: "#1e293b", border: "none", borderRadius: "12px", color: "#fff", fontSize: "11px" }} />
                      <Legend />
                      <ReBar dataKey="CS" fill="#818cf8" radius={[4, 4, 0, 0]} />
                      <ReBar dataKey="EC" fill="#c084fc" radius={[4, 4, 0, 0]} />
                    </ReBarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* AI Insights Board */}
            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-3xl dark:border-slate-800 dark:bg-slate-950/20 text-xs space-y-3">
              <div className="flex items-center space-x-2 text-indigo-700 dark:text-indigo-400 font-bold">
                <Cpu className="h-5 w-5" />
                <span>AI Core Admissions Recommendation Insight</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Our models project a 14% increase in B.Tech Artificial Intelligence applications for the upcoming cohort. We recommend allocating additional advisory counseling seats to avoid manual scaling delays. Computer Science intake is approaching 92% capacity thresholds.
              </p>
            </div>
          </div>
        )}

        {/* CONTACT PAGE VIEW */}
        {activePage === "contact" && (
          <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Academic Communications Desk</h1>
              <p className="text-xs text-gray-500 dark:text-slate-400">Get in touch with admissions coordinators, technical support desk, or financial registrars.</p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Form left */}
              <form onSubmit={handleContactSubmit} className="lg:col-span-7 bg-white border border-gray-100 p-6 rounded-3xl dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2 dark:border-slate-800/50">Send Correspondence File</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="block font-semibold text-gray-600 dark:text-slate-400">Full Name</label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2.5 focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-semibold text-gray-600 dark:text-slate-400">Email Address</label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2.5 focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950"
                      required
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="block font-semibold text-gray-600 dark:text-slate-400">Inquiry Message</label>
                    <textarea
                      rows={5}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2.5 focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-md transition-all text-xs"
                >
                  Dispatch Ticket
                </button>
              </form>

              {/* Sidebar Info right */}
              <div className="lg:col-span-5 space-y-6 text-xs">
                
                {/* Info Card */}
                <div className="bg-white border border-gray-100 p-5 rounded-3xl dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">Office Specifications</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2.5 text-gray-600 dark:text-slate-300">
                      <MapPin className="h-4 w-4 text-indigo-500 shrink-0" />
                      <span>Main Technical Campus, Block D, Sector A</span>
                    </div>

                    <div className="flex items-center space-x-2.5 text-gray-600 dark:text-slate-300">
                      <Phone className="h-4 w-4 text-indigo-500 shrink-0" />
                      <span>+1 (800) 555-0199</span>
                    </div>

                    <div className="flex items-center space-x-2.5 text-gray-600 dark:text-slate-300">
                      <Mail className="h-4 w-4 text-indigo-500 shrink-0" />
                      <span>admissions@aegis.academy.edu</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Maps Widget */}
                <div className="rounded-3xl border border-gray-200/50 overflow-hidden relative shadow-sm h-48 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 flex flex-col justify-center items-center text-center p-4">
                    <MapPin className="h-8 w-8 text-indigo-500 animate-bounce mb-2" />
                    <span className="font-bold text-slate-800 dark:text-slate-200">Interactive Location Map</span>
                    <span className="text-[10px] text-gray-400 font-mono mt-0.5">LAT 37.7749° N, LON 122.4194° W</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </main>

      {/* 4. Global Toast Notifications Overlay */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center space-x-2.5 p-4 rounded-2xl border border-gray-100/40 bg-white/95 backdrop-blur-md shadow-2xl dark:border-slate-800/40 dark:bg-slate-900/95 animate-slide-up text-xs font-bold text-slate-800 dark:text-slate-100 max-w-sm">
          {toast.type === "success" && <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />}
          {toast.type === "info" && <Info className="h-5 w-5 text-blue-500 shrink-0" />}
          {toast.type === "error" && <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />}
          <span className="flex-1 leading-normal">{toast.message}</span>
          <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 5. Footer */}
      <Footer onNavigate={setActivePage} />

    </div>
  );
}
