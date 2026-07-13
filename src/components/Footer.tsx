import React from "react";
import { Sparkles, Mail, Phone, Clock, ShieldCheck } from "lucide-react";

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="w-full border-t border-gray-200/80 bg-slate-50 dark:border-slate-800/80 dark:bg-slate-950 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate("landing")}>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Aegis Admission
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
              Automating the full student lifecycle. Integrating deep neural-verification scoring, predictive eligibility matrices, and live Salesforce pipeline sync.
            </p>
            <div className="flex items-center space-x-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-1 rounded-md w-fit">
              <ShieldCheck className="h-3 w-3" />
              <span>SOC2 Type II Certified</span>
            </div>
          </div>

          {/* Col 2: Admissions Links */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 dark:text-slate-500">Admissions</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate("form")} className="text-gray-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400">
                  Admission Form
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("eligibility")} className="text-gray-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400">
                  AI Predictor
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("verify")} className="text-gray-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400">
                  Document Audit
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("tracker")} className="text-gray-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400">
                  Live tracker
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Salesforce & Admin Links */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 dark:text-slate-500">Academic Operations</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate("admin-dashboard")} className="text-gray-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400">
                  Admin Console
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("crm")} className="text-gray-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400">
                  Salesforce Pipeline
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("analytics")} className="text-gray-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400">
                  Departmental Trends
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("chatbot")} className="text-gray-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400">
                  Ask AI Assistant
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Support & Details */}
          <div className="space-y-2 text-xs">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 dark:text-slate-500">Contact Support</h4>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-slate-300">
              <Mail className="h-3.5 w-3.5 text-blue-500" />
              <span>admissions@aegis.academy.edu</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-slate-300">
              <Phone className="h-3.5 w-3.5 text-purple-500" />
              <span>+1 (800) 555-0199</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-slate-300">
              <Clock className="h-3.5 w-3.5 text-indigo-500" />
              <span>Mon - Fri (8:00 AM - 6:00 PM PST)</span>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-200 mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between dark:border-slate-800">
          <p className="text-[11px] text-gray-400 dark:text-slate-500">
            &copy; 2026 Aegis Academic Technologies. All Rights Reserved. Powered by Gemini & Salesforce CRM Automation.
          </p>
          <div className="flex space-x-4 mt-2 sm:mt-0 text-[11px]">
            <a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300">Terms of Service</a>
            <button onClick={() => onNavigate("contact")} className="text-blue-500 hover:underline">Support Portal</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
