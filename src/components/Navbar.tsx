import React, { useState } from "react";
import { 
  Bell, 
  Sun, 
  Moon, 
  ShieldAlert, 
  User, 
  Sparkles,
  Menu,
  X
} from "lucide-react";
import { Role, Notification } from "../types";

interface NavbarProps {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  notifications: Notification[];
  onMarkNotificationRead: (id: string) => void;
  onClearAllNotifications: () => void;
  onNavigate: (page: string) => void;
  activePage: string;
}

export default function Navbar({
  currentRole,
  setCurrentRole,
  darkMode,
  setDarkMode,
  notifications,
  onMarkNotificationRead,
  onClearAllNotifications,
  onNavigate,
  activePage
}: NavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const roles = [Role.Student, Role.Officer, Role.Admin, Role.Mentor];

  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case Role.Admin: return "bg-red-500/10 text-red-500 border-red-500/20";
      case Role.Officer: return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case Role.Mentor: return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      default: return "bg-purple-500/10 text-purple-500 border-purple-500/20";
    }
  };

  const navItems = [
    { id: "landing", label: "Home", roles: ["all"] },
    { id: "form", label: "Apply", roles: [Role.Student] },
    { id: "eligibility", label: "AI Eligibility", roles: [Role.Student, Role.Mentor] },
    { id: "verify", label: "Verify Documents", roles: [Role.Student, Role.Officer] },
    { id: "tracker", label: "Track Progress", roles: [Role.Student] },
    { id: "student-dashboard", label: "My Dashboard", roles: [Role.Student] },
    { id: "admin-dashboard", label: "Admin Console", roles: [Role.Admin, Role.Officer] },
    { id: "crm", label: "Salesforce CRM", roles: [Role.Admin, Role.Officer] },
    { id: "analytics", label: "Analytics Trends", roles: [Role.Admin, Role.Officer, Role.Mentor] },
    { id: "chatbot", label: "AI Assistant", roles: ["all"] },
    { id: "contact", label: "Contact Us", roles: ["all"] }
  ];

  const visibleItems = navItems.filter(item => 
    item.roles.includes("all") || item.roles.includes(currentRole)
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/85 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo Brand */}
          <div 
            onClick={() => onNavigate("landing")} 
            className="flex cursor-pointer items-center space-x-2 group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-500 bg-clip-text text-transparent font-sans">
                Aegis Admission
              </span>
              <p className="text-[10px] font-mono tracking-wider text-gray-400 dark:text-slate-500 leading-none">
                AI + CRM ENGINE
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {visibleItems.map(item => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activePage === item.id 
                    ? "bg-blue-50/80 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 font-semibold"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-slate-100"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Controls Panel */}
          <div className="flex items-center space-x-3">
            
            {/* Quick Role Toggle (Academic perspective previewer) */}
            <div className="relative">
              <button
                id="role-dropdown-btn"
                onClick={() => setShowRoleSelector(!showRoleSelector)}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-all ${getRoleBadgeColor(currentRole)}`}
              >
                <User className="h-3 w-3" />
                <span>{currentRole}</span>
              </button>

              {showRoleSelector && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-900 z-50">
                  <div className="px-2.5 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest dark:text-slate-500 mb-1">
                    Preview Perspective
                  </div>
                  {roles.map(role => (
                    <button
                      key={role}
                      onClick={() => {
                        setCurrentRole(role);
                        setShowRoleSelector(false);
                        if (role === Role.Student) onNavigate("student-dashboard");
                        else onNavigate("admin-dashboard");
                      }}
                      className={`flex w-full items-center justify-between px-2.5 py-1.5 text-xs rounded-lg text-left ${
                        currentRole === role 
                          ? "bg-purple-50 text-purple-600 font-semibold dark:bg-purple-950/20 dark:text-purple-400"
                          : "text-gray-700 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800/40"
                      }`}
                    >
                      <span>{role}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark Mode Switcher */}
            <button
              id="theme-toggle-btn"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl border border-gray-100 hover:bg-gray-100 dark:border-slate-800 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 transition-colors duration-200"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-blue-600" />}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                id="notification-bell-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl border border-gray-100 hover:bg-gray-100 dark:border-slate-800 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 transition-colors duration-200"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-gray-100 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 z-50">
                  <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5 dark:border-slate-800">
                    <span className="text-xs font-semibold text-gray-900 dark:text-white">Smart Notifications</span>
                    <button 
                      onClick={onClearAllNotifications}
                      className="text-[10px] text-blue-600 hover:underline dark:text-blue-400 font-medium"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto p-1.5">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-gray-400 dark:text-slate-500">
                        No active alerts
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div 
                          key={notif.id}
                          onClick={() => onMarkNotificationRead(notif.id)}
                          className={`p-2.5 rounded-lg mb-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors ${notif.read ? 'opacity-65' : 'bg-blue-50/20 dark:bg-blue-950/5 border-l-2 border-blue-500'}`}
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="text-xs font-semibold text-gray-800 dark:text-slate-200">{notif.title}</h4>
                            <span className="text-[9px] text-gray-400 dark:text-slate-500 font-mono">
                              {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-600 dark:text-slate-400 mt-0.5 leading-relaxed">{notif.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-gray-100 hover:bg-gray-100 dark:border-slate-800 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 md:hidden"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white/95 py-2 px-4 dark:border-slate-800 dark:bg-slate-900 md:hidden animate-fade-in">
          <div className="space-y-1">
            {visibleItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activePage === item.id 
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400"
                    : "text-gray-700 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
