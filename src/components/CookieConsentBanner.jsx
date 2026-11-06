import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, Check, X } from 'lucide-react';

export default function CookieConsentBanner({ onOpenPrivacy }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('edugen_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('edugen_cookie_consent', 'accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('edugen_cookie_consent', 'essential_only');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-5 text-slate-800 dark:text-slate-200">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200/50 dark:border-blue-800/50">
            <Cookie className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              Valoramos tu privacidad <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              Utilizamos cookies esenciales y analíticas para optimizar tu experiencia docente, guardar tus planificaciones AOA y ofrecer contenido publicitario relevante.
            </p>
            {onOpenPrivacy && (
              <button 
                onClick={onOpenPrivacy}
                className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline mt-1.5 inline-block"
              >
                Leer Política de Cookies y Privacidad
              </button>
            )}
            
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={handleAccept}
                className="flex-1 py-2 px-3 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" /> Aceptar Todas
              </button>
              <button
                onClick={handleDecline}
                className="py-2 px-3 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                Solo Esenciales
              </button>
            </div>
          </div>
          <button 
            onClick={handleDecline}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 -mr-2 -mt-2 transition-colors cursor-pointer"
            title="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

