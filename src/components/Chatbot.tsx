import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  HelpCircle, 
  Sparkles,
  User,
  Clock,
  ChevronRight
} from "lucide-react";
import { ChatMessage } from "../types";

interface ChatbotProps {
  chatMessages: ChatMessage[];
  onSendMessage: (msg: string) => Promise<any>;
}

export default function Chatbot({ chatMessages, onSendMessage }: ChatbotProps) {
  const [inputText, setInputText] = useState("");
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const defaultSuggestions = [
    "Am I eligible for B.Tech CSE?",
    "How does automatic document verification work?",
    "What scholarships are currently active?",
    "Can I connect my Salesforce pipeline?"
  ];

  const activeSuggestions = chatMessages[chatMessages.length - 1]?.suggestions || defaultSuggestions;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, loading]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    setInputText("");
    setLoading(true);
    try {
      await onSendMessage(text);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const simulateVoiceInput = () => {
    setRecording(true);
    const phrases = [
      "Check my application status",
      "Is there a sports scholarship?",
      "Verify my SSC results",
      "What is the total fee for CS AI?"
    ];
    const picked = phrases[Math.floor(Math.random() * phrases.length)];
    
    setTimeout(() => {
      setInputText(picked);
      setRecording(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 dark:text-slate-100 max-w-4xl mx-auto h-[600px] flex flex-col">
      
      {/* Header */}
      <div className="shrink-0">
        <h1 className="text-2xl font-extrabold tracking-tight">AI Admission Assistant</h1>
        <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Ask our admissions bot about fees, eligibility, course options, and Salesforce pipelines.</p>
      </div>

      {/* Main Chat Container */}
      <div className="flex-1 bg-white border border-gray-100 rounded-3xl dark:border-slate-800 dark:bg-slate-900 shadow-sm flex flex-col overflow-hidden">
        
        {/* Banner */}
        <div className="p-4 border-b border-gray-50 bg-slate-50/50 flex items-center justify-between dark:border-slate-800 dark:bg-slate-950/20 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Aegis AI Copilot</span>
          </div>
          <span className="text-[10px] bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 px-2 py-0.5 rounded uppercase font-bold">
            Gemini Core
          </span>
        </div>

        {/* Scrollable chat log */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex items-start gap-2.5 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Profile Icon */}
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                msg.sender === 'user' 
                  ? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300' 
                  : 'bg-indigo-600 text-white'
              }`}>
                {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              {/* Text Balloon */}
              <div className={`p-4 rounded-3xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-50 border border-slate-100 text-slate-800 dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-200 rounded-tl-none'
              }`}>
                <p className="whitespace-pre-line">{msg.content}</p>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-black/5 dark:border-white/5 text-[9px] opacity-70">
                  <span className="font-mono">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {msg.sender === 'ai' && (
                    <button className="text-indigo-600 hover:underline dark:text-indigo-400 flex items-center space-x-0.5">
                      <Volume2 className="h-3 w-3" />
                      <span>Listen speech</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-start gap-2.5 mr-auto max-w-[85%]">
              <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-slate-50 border border-slate-100 dark:bg-slate-950/40 dark:border-slate-800 p-4 rounded-3xl rounded-tl-none text-xs text-gray-400 flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        {/* Quick suggestions panel */}
        <div className="px-4 py-2 border-t border-gray-50 dark:border-slate-800/50 flex flex-wrap gap-1.5 shrink-0">
          {activeSuggestions.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sug)}
              className="px-3 py-1 bg-slate-50 border border-slate-100 dark:bg-slate-800/30 dark:border-slate-800 hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-500 text-[10px] font-bold rounded-full transition-all text-slate-600 dark:text-slate-400"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Input Form Box */}
        <div className="p-4 border-t border-gray-50 dark:border-slate-800 shrink-0">
          <div className="relative flex items-center">
            
            {/* Voice Input Sim button */}
            <button
              onClick={simulateVoiceInput}
              className={`p-2.5 rounded-xl border border-gray-100 mr-2 hover:bg-slate-50 dark:border-slate-800 text-slate-500 shrink-0 transition-colors ${recording ? 'bg-red-500/10 text-red-500 border-red-500/20' : ''}`}
              title="Simulate Voice Input"
            >
              {recording ? <Mic className="h-4 w-4 animate-ping" /> : <Mic className="h-4 w-4" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText)}
              placeholder={recording ? "Listening voice..." : "Ask your admissions query here..."}
              disabled={recording}
              className="flex-1 bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl py-3 px-4 text-xs pr-12 focus:outline-none focus:border-indigo-500"
            />

            <button
              onClick={() => handleSend(inputText)}
              disabled={!inputText.trim()}
              className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl shadow-md transition-all shrink-0"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
