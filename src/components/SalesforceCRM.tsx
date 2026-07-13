import React, { useState } from "react";
import { 
  Database, 
  CloudLightning, 
  UserCheck, 
  FolderSync, 
  Mail, 
  Phone, 
  Activity, 
  ChevronRight, 
  Sparkles,
  Calendar,
  CheckCircle,
  Plus,
  Trash,
  Clock,
  Briefcase,
  AlertCircle
} from "lucide-react";
import { CRMLead, Role } from "../types";

interface SalesforceCRMProps {
  leads: CRMLead[];
  onUpdateLeadStage: (leadId: string, stage: CRMLead["stage"]) => void;
  onAddLeadTask: (leadId: string, taskTitle: string, type: string, dueDate: string) => void;
}

export default function SalesforceCRM({ leads, onUpdateLeadStage, onAddLeadTask }: SalesforceCRMProps) {
  const [selectedLead, setSelectedLead] = useState<CRMLead | null>(leads[0] || null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskType, setNewTaskType] = useState("Task");
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState("Admissions Invitation");

  // CRM Funnel Metrics (Demo data stats)
  const funnelStages = [
    { label: "New Leads Captured", count: 240, color: "bg-blue-500" },
    { label: "Student Contacted", count: 185, color: "bg-indigo-500" },
    { label: "Qualified Prospects", count: 142, color: "bg-purple-500" },
    { label: "Active Applicants", count: 98, color: "bg-pink-500" },
    { label: "Enrolled Cohorts", count: 72, color: "bg-emerald-500" }
  ];

  // Automation Logs List
  const automationLogs = [
    { time: "10:15 AM", message: "AI document verification triggered webhook sync.", module: "System Flow" },
    { time: "09:42 AM", message: "Lead stage updated to 'Applicant' for Alex Rivera.", module: "Salesforce Core" },
    { time: "08:12 AM", message: "Automated Email 'Admissions Invitation' dispatched to Marcus Aurelius.", module: "Email Trigger" }
  ];

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newTaskTitle.trim()) return;
    
    // Add task via prop
    onAddLeadTask(
      selectedLead.id,
      newTaskTitle,
      newTaskType,
      new Date(Date.now() + 172800000).toISOString().split('T')[0] // 2 days from now
    );
    setNewTaskTitle("");

    // Refresh selected lead state by grabbing updated lead from leads array
    const updated = leads.find(l => l.id === selectedLead.id);
    if (updated) setSelectedLead(updated);
  };

  const getLeadScoreBadge = (score: number) => {
    if (score >= 90) return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    if (score >= 75) return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    return "bg-amber-500/10 text-amber-500 border-amber-500/20";
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100">
      
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="h-10 w-10 bg-[#1589ee] text-white rounded-xl flex items-center justify-center shrink-0 shadow-md">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Salesforce CRM Integration</h1>
            <p className="text-xs text-gray-500 dark:text-slate-400">Direct academic pipeline connection checking leads quality, task scheduling, and automation flow state triggers.</p>
          </div>
        </div>

        <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 px-2.5 py-1 rounded-full uppercase tracking-widest font-black flex items-center space-x-1">
          <CheckCircle className="h-3 w-3" />
          <span>Connected</span>
        </span>
      </div>

      {/* Main Double Column Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* Left column: Leads scoring queue & Funnel visual */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Funnel chart */}
          <div className="bg-white border border-gray-100 p-5 rounded-3xl dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Enrollment Pipeline Funnel</h3>
            <div className="space-y-2">
              {funnelStages.map(f => (
                <div key={f.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{f.label}</span>
                    <span className="font-mono text-gray-400">{f.count} Students</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className={`${f.color} h-full rounded-full transition-all`} style={{ width: `${(f.count / 240) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CRM Leads table queue */}
          <div className="bg-white border border-gray-100 rounded-3xl p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-50 dark:border-slate-800/55">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">AI Leads Scoring Table</h3>
              <p className="text-[10px] text-gray-400">Click on any candidate record row to manage scheduled activities.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-gray-100 dark:divide-slate-800">
                <thead>
                  <tr className="text-gray-400 dark:text-slate-500 uppercase tracking-widest text-[9px] font-black">
                    <th className="py-2 px-1">Student Lead Name</th>
                    <th className="py-2 px-1">Lead Source</th>
                    <th className="py-2 px-1">AI Match Score</th>
                    <th className="py-2 px-1">Pipeline Stage</th>
                    <th className="py-2 px-1">Last Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                  {leads.map(l => (
                    <tr 
                      key={l.id} 
                      onClick={() => setSelectedLead(l)}
                      className={`cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors ${selectedLead?.id === l.id ? 'bg-indigo-50/40 dark:bg-slate-950/30 border-l-2 border-indigo-600' : ''}`}
                    >
                      <td className="py-3 px-1 font-bold text-slate-900 dark:text-white">
                        <div>{l.name}</div>
                        <div className="text-[10px] text-gray-400 font-normal">{l.email}</div>
                      </td>
                      <td className="py-3 px-1 text-gray-500">{l.source}</td>
                      <td className="py-3 px-1">
                        <span className={`px-2 py-0.5 text-[10px] font-bold border rounded ${getLeadScoreBadge(l.score)}`}>
                          {l.score}
                        </span>
                      </td>
                      <td className="py-3 px-1">
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 rounded-md font-semibold text-[10px]">
                          {l.stage}
                        </span>
                      </td>
                      <td className="py-3 px-1 font-mono text-[10px] text-gray-400">
                        {new Date(l.lastActivity).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right column: Lead Activities & Email templates panels */}
        <div className="lg:col-span-4 space-y-6">
          
          {selectedLead ? (
            <div className="bg-white border border-gray-100 rounded-3xl p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-5 text-xs">
              
              {/* Lead details overview */}
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">{selectedLead.id}</span>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">{selectedLead.name}</h3>
                <p className="text-gray-400">{selectedLead.phone}</p>
              </div>

              {/* Stage progression controls */}
              <div className="space-y-1.5 pt-2 border-t border-gray-50 dark:border-slate-800/50">
                <label className="block font-semibold text-gray-600 dark:text-slate-400">Advance Stage</label>
                <select
                  value={selectedLead.stage}
                  onChange={(e) => onUpdateLeadStage(selectedLead.id, e.target.value as CRMLead["stage"])}
                  className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 font-semibold"
                >
                  <option value="Lead">Lead</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Prospect">Prospect</option>
                  <option value="Applicant">Applicant</option>
                  <option value="Enrolled">Enrolled</option>
                  <option value="Nurturing">Nurturing</option>
                </select>
              </div>

              {/* Task list scheduler */}
              <div className="space-y-3 pt-2 border-t border-gray-50 dark:border-slate-800/50">
                <h4 className="font-bold text-slate-700 dark:text-slate-300">Task Scheduler</h4>
                
                <div className="space-y-2">
                  {selectedLead.tasks?.map(t => (
                    <div key={t.id} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-950/20 rounded-xl border border-gray-50 dark:border-slate-800">
                      <div className="flex items-center space-x-1.5">
                        <Clock className="h-3.5 w-3.5 text-gray-400" />
                        <span>{t.title}</span>
                      </div>
                      <span className="text-[9px] text-indigo-600 font-mono font-bold uppercase">{t.status}</span>
                    </div>
                  ))}
                  {(!selectedLead.tasks || selectedLead.tasks.length === 0) && (
                    <p className="text-gray-400 italic">No scheduled items</p>
                  )}
                </div>

                <form onSubmit={handleAddTaskSubmit} className="flex items-center space-x-1.5 pt-2">
                  <input
                    type="text"
                    placeholder="New follow-up title..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="flex-1 rounded-xl border border-gray-200 bg-slate-50 px-2.5 py-1.5 focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950"
                  />
                  <button 
                    type="submit"
                    className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </form>
              </div>

              {/* Email Templates Selector */}
              <div className="space-y-2 pt-2 border-t border-gray-50 dark:border-slate-800/50">
                <h4 className="font-bold text-slate-700 dark:text-slate-300">Mail Templates Dispatcher</h4>
                <select
                  value={selectedEmailTemplate}
                  onChange={(e) => setSelectedEmailTemplate(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                >
                  <option value="Admissions Invitation">Admissions Invitation Template</option>
                  <option value="Document Verification Alert">Verification Outcry Notice</option>
                  <option value="Scholarship Grant Offer">Scholarship Offer Letter</option>
                </select>
                <button className="flex w-full justify-center items-center space-x-1.5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-all dark:bg-slate-100 dark:text-slate-950">
                  <Mail className="h-3.5 w-3.5" />
                  <span>Send Salesforce Email</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-slate-50/50 border border-gray-100 p-8 rounded-3xl text-center dark:border-slate-800 dark:bg-slate-950/20">
              <p className="text-xs text-gray-400">Select a candidate row record to view details.</p>
            </div>
          )}

          {/* Direct Workflow automation panel */}
          <div className="bg-white border border-gray-100 rounded-3xl p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Automation Flowlogs</h4>
            <div className="space-y-3">
              {automationLogs.map((log, idx) => (
                <div key={idx} className="flex justify-between items-start text-xs border-b border-gray-50 pb-2.5 last:border-0 last:pb-0 dark:border-slate-800/50">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{log.message}</p>
                    <span className="text-[10px] font-mono text-gray-400">{log.module}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0">{log.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
