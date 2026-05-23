'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type, title, message, duration = 4000 }: Omit<ToastMessage, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, title, message, duration }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback((message: string, title?: string) => {
    addToast({ type: 'success', title: title || 'Success', message });
  }, [addToast]);

  const error = useCallback((message: string, title?: string) => {
    addToast({ type: 'error', title: title || 'Error', message });
  }, [addToast]);

  const info = useCallback((message: string, title?: string) => {
    addToast({ type: 'info', title: title || 'Info', message });
  }, [addToast]);

  const warning = useCallback((message: string, title?: string) => {
    addToast({ type: 'warning', title: title || 'Warning', message });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, info, warning }}>
      {children}
      
      {/* Toast Portal/Container */}
      <div className="fixed bottom-5 right-5 z-55 flex flex-col gap-3 max-w-md w-full pointer-events-none px-4 md:px-0">
        {toasts.map((toast) => {
          let bgClass = 'bg-stone-900 border-stone-800 text-stone-200';
          let Icon = Info;
          let iconColor = 'text-blue-400';

          if (toast.type === 'success') {
            bgClass = 'bg-emerald-950/90 border-emerald-800/40 text-emerald-100 shadow-emerald-950/20';
            Icon = CheckCircle;
            iconColor = 'text-emerald-400';
          } else if (toast.type === 'error') {
            bgClass = 'bg-red-950/90 border-red-800/40 text-red-100 shadow-red-950/20';
            Icon = AlertCircle;
            iconColor = 'text-red-400';
          } else if (toast.type === 'warning') {
            bgClass = 'bg-amber-950/90 border-amber-800/40 text-amber-100 shadow-amber-950/20';
            Icon = AlertTriangle;
            iconColor = 'text-amber-400';
          } else if (toast.type === 'info') {
            bgClass = 'bg-stone-900/95 border-stone-800 text-stone-200 shadow-stone-950/30';
            Icon = Info;
            iconColor = 'text-amber-300';
          }

          return (
            <div
              key={toast.id}
              className={`flex items-start gap-3 p-4 rounded border backdrop-blur-md shadow-2xl transition-all duration-300 pointer-events-auto transform translate-y-0 animate-[slideIn_0.2s_ease-out] ${bgClass}`}
            >
              <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${iconColor}`} />
              <div className="flex-1">
                {toast.title && <h4 className="text-xs font-black uppercase tracking-wider mb-0.5">{toast.title}</h4>}
                <p className="text-xs font-sans text-stone-300 leading-relaxed">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-stone-400 hover:text-white p-0.5 rounded transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(1rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
