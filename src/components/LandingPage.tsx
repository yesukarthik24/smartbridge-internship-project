import React, { useState } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Bot, 
  Database, 
  CheckCircle, 
  Cpu, 
  FileCheck, 
  TrendingUp, 
  Users, 
  Play, 
  HelpCircle,
  Clock,
  GraduationCap
} from "lucide-react";

interface LandingPageProps {
  onStartApplying: () => void;
  onOpenChat: () => void;
  onNavigate: (page: string) => void;
}

export default function LandingPage({ onStartApplying, onOpenChat, onNavigate }: LandingPageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const stats = [
    { label: "Students Registered", value: "48,290+", icon: Users, color: "text-blue-500 bg-blue-500/10" },
    { label: "Applications Processed", value: "124,000+", icon: FileCheck, color: "text-purple-500 bg-purple-500/10" },
    { label: "AI Verification Accuracy", value: "99.8%", icon: Cpu, color: "text-emerald-500 bg-emerald-500/10" },
    { label: "Colleges Connected", value: "350+", icon: GraduationCap, color: "text-amber-500 bg-amber-500/10" }
  ];

  const features = [
    {
      title: "AI Eligibility Prediction",
      desc: "Instant neural network prediction matching high school grades, reservations, and test thresholds to college standards.",
      icon: TrendingUp,
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "Smart Document Audit",
      desc: "Computer vision analysis validating stamp authentication, OCR certificate integrity, blur detection, and instant status tagging.",
      icon: ShieldCheck,
      color: "from-purple-500 to-pink-600"
    },
    {
      title: "Admission Tracking Pipeline",
      desc: "Live visual stage tracking reflecting current processing milestones and real-time email triggers.",
      icon: Clock,
      color: "from-indigo-500 to-blue-600"
    },
    {
      title: "Salesforce CRM Sync",
      desc: "Out-of-the-box Salesforce integration maintaining contact leads, automation logs, and pipeline funnel stages.",
      icon: Database,
      color: "from-amber-500 to-orange-600"
    },
    {
      title: "AI Interactive Assistant",
      desc: "24/7 conversational support handling scholarship inquiries, course matching recommendations, and fee schedules.",
      icon: Bot,
      color: "from-emerald-500 to-teal-600"
    },
    {
      title: "Automated Notifications",
      desc: "Context-aware notification logs warning about blurry documents or confirming successful program admissions.",
      icon: Sparkles,
      color: "from-red-500 to-rose-600"
    }
  ];

  const timelineSteps = [
    { title: "Student Registration", desc: "Create a verified secure file profile in under 2 minutes." },
    { title: "Upload Credentials", desc: "Drag & drop SSC sheets, identity proof cards, and test scores." },
    { title: "AI Document Audit", desc: "Integrated computer vision checks signatures and verifies stamp seals instantly." },
    { title: "Eligibility Rating", desc: "Neural forecasting models predict acceptance probabilities across preferred programs." },
    { title: "Counselling Slots", desc: "Intelligent scheduling matching faculty advisors to high-probability candidates." },
    { title: "Admission Confirmed", desc: "Pay course fees and receive automatic verification letters ready for download." }
  ];

  const testimonials = [
    {
      name: "Devon Lane",
      role: "Admitted Student, B.Tech AI & Data Science",
      quote: "The instant document verification saved me weeks of manual follow-ups. The AI correctly highlighted my entrance rank weightage!",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
    },
    {
      name: "Dr. Eleanor Vance",
      role: "Academic Registrar, Tech Campus",
      quote: "Using this system reduced our office's manual audit overhead by 80%. Salesforce integration allows us to sync leads instantly.",
      img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"
    }
  ];

  const faqs = [
    {
      q: "How does the AI verify my submitted certificates?",
      a: "Our system runs OCR models combined with stamp classification neural nets. It inspects paper contrast to identify low-clarity blur, verifies seal authentication, matches student names directly to board transcripts, and provides confidence ratings."
    },
    {
      q: "Is my personal data synchronized with Salesforce CRM securely?",
      a: "Yes. All student profiles automatically update contacts, leads, and pipeline stages via standard API hooks with secure authentication. No details are shared with unauthorized parties."
    },
    {
      q: "What happens if a document is rejected by the AI auditor?",
      a: "You will receive an instant notification detailing the reason (e.g. 'Blurred SSC mark sheet'). You can immediately upload a higher resolution scan in the 'Verify Documents' interface."
    }
  ];

  return (
    <div className="space-y-16 py-8 animate-fade-in text-slate-800 dark:text-slate-100">
      
      {/* 1. Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
          
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <Sparkles className="h-3.5 w-3.5 animate-spin-none" />
              <span>Next-Gen Academic Automation</span>
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl font-sans">
              Autonomous Admissions
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent mt-2">
                Powered by AI & CRM
              </span>
            </h1>
            
            <p className="text-base text-gray-500 dark:text-slate-400 max-w-lg leading-relaxed">
              Automate the complete academic student lifecycle. Verify credentials instantly with computer vision, predict program fit ratings, and synchronize pipeline stages with Salesforce CRM seamlessly.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                id="hero-apply-btn"
                onClick={onStartApplying}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-bold shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] duration-200"
              >
                <span>Initiate Application</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              
              <button
                id="hero-demo-btn"
                onClick={() => onNavigate("student-dashboard")}
                className="flex items-center space-x-2 px-5 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-800 text-sm font-bold text-gray-700 dark:text-slate-300 transition-all"
              >
                <Play className="h-3.5 w-3.5 fill-current text-blue-600 dark:text-blue-400" />
                <span>Simulate Dashboard</span>
              </button>
            </div>
          </div>

          {/* Interactive Illustration Hero Widget */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl -z-10"></div>
            <div className="rounded-3xl border border-gray-200/60 bg-white/80 p-6 shadow-2xl dark:border-slate-800/60 dark:bg-slate-900/80 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-400"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
                </div>
                <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 px-2 py-0.5 rounded uppercase">
                  Salesforce Pipeline Sync: Active
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span>Aadhar ID scan verify</span>
                    <span className="text-emerald-500">99.4% CONFIDENCE</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-800 h-1.5 rounded-full">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: "99.4%" }}></div>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1.5">No facial matches discrepancies detected.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Eligible Cutoff Forecast</span>
                    <span className="text-purple-600 dark:text-purple-400 font-mono">92% Acceptance</span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400">Matching B.Tech AI programs criteria.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Statistics Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((st, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow dark:border-slate-800/80 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest leading-none">
                  {st.label}
                </span>
                <div className={`p-2 rounded-xl ${st.color}`}>
                  <st.icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900 dark:text-white font-mono leading-none">
                {st.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Features Grid Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Intelligent Automation Modules
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            A comprehensive suite of machine learning algorithms and workflows optimized for registrar operations.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((fe, idx) => (
            <div 
              key={idx}
              className="group relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-xl transition-all hover:scale-[1.01] duration-300 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className={`h-10 w-10 rounded-xl bg-gradient-to-tr ${fe.color} flex items-center justify-center text-white mb-4 shadow-md`}>
                <fe.icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">
                {fe.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                {fe.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. How It Works - Interactive Timeline */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 bg-slate-50/50 dark:bg-slate-950/20 py-12 rounded-3xl border border-gray-100 dark:border-slate-900">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Our Automated Process Lifecycle
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Track how student profiles transition effortlessly from initial interest into enrolled candidates.
          </p>
        </div>

        <div className="relative border-l border-indigo-200 dark:border-indigo-950/60 ml-4 md:ml-32 space-y-8 py-4">
          {timelineSteps.map((st, idx) => (
            <div key={idx} className="relative pl-6 md:pl-8 group">
              <div className="absolute -left-3.5 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-xs ring-4 ring-white dark:ring-slate-900 shadow">
                {idx + 1}
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  {st.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-slate-400 max-w-lg">
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Testimonials */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Trust Reports from the Field
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Discover how students and university officials scale enrollment pipelines.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {testimonials.map((te, idx) => (
            <div 
              key={idx}
              className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <p className="text-xs italic text-gray-600 dark:text-slate-300 leading-relaxed mb-4">
                "{te.quote}"
              </p>
              <div className="flex items-center space-x-3">
                <img 
                  src={te.img} 
                  alt={te.name} 
                  className="h-10 w-10 rounded-full object-cover border border-indigo-500/20"
                />
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-none mb-1">
                    {te.name}
                  </h4>
                  <span className="text-[10px] text-gray-400 dark:text-slate-500">
                    {te.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Frequently Answered Concerns
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Learn more about verification scoring, integration details, and program policies.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((f, idx) => (
            <div 
              key={idx}
              className="border border-gray-100 rounded-xl bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="flex w-full items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/40"
              >
                <span className="text-xs font-bold text-gray-800 dark:text-slate-200">
                  {f.q}
                </span>
                <HelpCircle className="h-4 w-4 text-indigo-500 shrink-0" />
              </button>
              {activeFaq === idx && (
                <div className="p-4 border-t border-gray-100 text-xs text-gray-500 dark:border-slate-800 dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-slate-950/20">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
