import React, { useState } from 'react';
import { MessageCircle, X, Sparkles, Send } from 'lucide-react';

export default function WhatsAppButton({ phoneNumber = '50760000000', defaultMessage = '¡Hola! Me gustaría recibir información sobre la suscripción EduGen Pro para docentes.' }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleWhatsAppRedirect = () => {
    const encoded = encodeURIComponent(defaultMessage);
    const url = `https://wa.me/${phoneNumber}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      {/* Interactive Tooltip Card */}
      {showTooltip && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-3.5 max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-200 text-slate-800 dark:text-slate-200">
          <div className="flex items-center justify-between gap-3 mb-1.5 pb-1 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Soporte EduGen Panamá
            </div>
            <button 
              onClick={() => setShowTooltip(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
            ¿Tienes dudas con tus Lesson Planners AOA o el pago de tu plan? Escríbenos directamente por WhatsApp.
          </p>
          <button
            onClick={handleWhatsAppRedirect}
            className="w-full mt-2.5 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Send className="w-3 h-3" /> Chatear en Vivo
          </button>
        </div>
      )}

      {/* Main WhatsApp Floating Button */}
      <div className="relative group">
        <button
          onClick={handleWhatsAppRedirect}
          onMouseEnter={() => setShowTooltip(true)}
          className="w-13 h-13 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          title="Contactar por WhatsApp"
          aria-label="Contactar por WhatsApp a EduGen Panamá"
        >
          <MessageCircle className="w-7 h-7 fill-white/10 stroke-[2.2]" />
          
          {/* Notification Badge */}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full flex items-center justify-center text-[9px] font-black text-white">
            1
          </span>
        </button>
      </div>
    </div>
  );
}

