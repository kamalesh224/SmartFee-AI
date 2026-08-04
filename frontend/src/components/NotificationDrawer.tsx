import React from 'react';
import type { NotificationItem } from '../types';
import { X, Bell, AlertTriangle, CheckCircle2, Sparkles, Megaphone } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'due':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'payment':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'ai_alert':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-white text-base">FCM Notification Center</h3>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No notifications yet
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  notif.read
                    ? 'bg-slate-900/40 border-slate-800/60 text-slate-400'
                    : 'bg-slate-800/80 border-slate-700 text-white shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="text-xs font-semibold text-white">{notif.title}</h4>
                      <span className="text-[10px] text-slate-500">{notif.timestamp}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-300">{notif.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Note */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-center text-[11px] text-slate-500">
          Powered by Firebase Cloud Messaging (FCM) Push Service
        </div>

      </div>
    </div>
  );
};
