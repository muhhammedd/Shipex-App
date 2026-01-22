import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type = 'success', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in fade-in slide-in-from-bottom-4">
      <div className={`flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg ${
        type === 'success' 
          ? 'border-green-500/20 bg-green-500/10 text-green-500' 
          : 'border-red-500/20 bg-red-500/10 text-red-500'
      }`}>
        {type === 'success' ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          <AlertCircle className="h-5 w-5" />
        )}
        <p className="text-sm font-medium">{message}</p>
        <button 
          onClick={onClose}
          className="ml-2 rounded-full p-1 hover:bg-white/10 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
