import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export default function CustomAlert({ isOpen, message, type = 'info', onClose }) {
  if (!isOpen) return null;

  const icons = {
    info: <Info className="w-8 h-8 text-blue-500 animate-bounce" />,
    success: <CheckCircle className="w-8 h-8 text-emerald-500 animate-bounce" />,
    error: <AlertCircle className="w-8 h-8 text-pink-500 animate-bounce" />,
  };

  const borderColors = {
    info: 'border-blue-500/30',
    success: 'border-emerald-500/30',
    error: 'border-pink-500/30',
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm z-[9999] px-4 animate-fade-in">
      <div className={`w-full max-w-sm glass-panel p-6 rounded-3xl border-t-4 ${borderColors[type]} shadow-2xl relative`}>
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex flex-col items-center text-center mt-2">
          <div className="mb-4 bg-slate-100 dark:bg-slate-800/80 p-3 rounded-full">
            {icons[type]}
          </div>
          <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-2">
            {type === 'error' ? 'Oops! Algo falló' : type === 'success' ? '¡Excelente!' : 'Mensaje del Sistema'}
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 whitespace-pre-line">
            {message}
          </p>
          <button 
            onClick={onClose} 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/10 active:scale-95 transition text-sm"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
