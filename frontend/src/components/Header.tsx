// agent-notes: { ctx: "App header bar with branding for Vaigai College of Engineering (Anna University Campus)", deps: ["src/types.ts"], state: active, last: "antigravity@2026-08-15" }
import React from 'react';
import type { User } from '../types';
import { ShieldCheck, UserCheck, Bell, Monitor, Smartphone, Sparkles, LogOut } from 'lucide-react';

interface HeaderProps {
  currentUser: User;
  onSwitchRole: (role: 'student' | 'admin') => void;
  viewportMode: 'desktop' | 'mobile';
  onToggleViewport: () => void;
  unreadNotifCount: number;
  onOpenNotifications: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSwitchRole,
  viewportMode,
  onToggleViewport,
  unreadNotifCount,
  onOpenNotifications,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white">SmartFee <span className="gradient-text">AI</span></h1>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Anna University Campus
              </span>
            </div>
            <p className="text-xs text-slate-400">Vaigai College of Engineering • Intelligent Fee Portal</p>
          </div>
        </div>

        {/* Center Toolbar: Role Switcher & Viewport Toggle */}
        <div className="hidden md:flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          
          {/* Role Pills */}
          <button
            onClick={() => onSwitchRole('student')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentUser.role === 'student'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Student View
          </button>

          <button
            onClick={() => onSwitchRole('admin')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentUser.role === 'admin'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin Portal
          </button>

          <div className="w-px h-4 bg-slate-800 my-auto mx-1" />

          {/* Viewport Frame Toggle */}
          <button
            onClick={onToggleViewport}
            title={viewportMode === 'desktop' ? "Switch to Mobile View" : "Switch to Desktop View"}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            {viewportMode === 'desktop' ? (
              <>
                <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden lg:inline text-[11px]">Mobile Frame</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden lg:inline text-[11px]">Desktop View</span>
              </>
            )}
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          
          {/* FCM Notification Trigger */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
            title="Real-time FCM Push Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadNotifCount}
              </span>
            )}
          </button>

          {/* User Profile Badge */}
          <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full border border-blue-500/30 object-cover"
            />
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-white">{currentUser.name}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">{currentUser.role}</div>
            </div>
            
            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
