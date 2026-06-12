import React from 'react';
import { Coins, Sparkles, AlertCircle } from 'lucide-react';

export default function Header({ activeTab, credits, isDemoMode, onAddCredits, isPremium = false, onTogglePremium }) {
  const titles = {
    dashboard: { main: 'Panel de Control', sub: 'Vista general de tus planeaciones, saldo y herramientas rápidas.' },
    aoa: { main: 'Planificador AOA', sub: 'Diseña planeaciones didácticas EFL estructuradas bajo el Action-Oriented Approach.' },
    interdisciplinary: { main: 'Proyecto Interdisciplinario', sub: 'Generador curricular de proyectos conjuntos según formatos de MEDUCA.' },
    'theme-planner': { main: 'Theme Planner', sub: 'Esquematiza planeaciones de unidades temáticas completas basadas en el currículo nacional.' },
    library: { main: 'Mi Biblioteca', sub: 'Gestiona, edita, comparte y exporta a Word tus planeaciones guardadas.' },
  };

  const currentHeader = titles[activeTab] || { main: 'EduGen Panama', sub: 'Sistema Oficial de Planificación AOA.' };

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl bg-white/60 dark:bg-slate-900/60 mb-6">
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          {currentHeader.main}
          {isDemoMode && (
            <span className="bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
              <AlertCircle className="w-3 h-3" /> Modo Demo
            </span>
          )}
        </h2>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
          {currentHeader.sub}
        </p>
      </div>
      
      <div className="flex items-center gap-3 justify-start md:justify-end flex-wrap">
        {/* Plan Status Toggle */}
        <button
          onClick={onTogglePremium}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition flex items-center gap-1.5 border ${
            isPremium
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-amber-600 shadow-amber-500/20'
              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
          }`}
          title="Haz clic para alternar el nivel de suscripción en el Sandbox"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isPremium ? 'text-white' : 'text-amber-500'}`} />
          <span>{isPremium ? 'PRO PREMIUM' : 'GRATUITO (CON ADS)'}</span>
        </button>

        {/* Token Count Badge */}
        <div className="bg-blue-500/10 dark:bg-blue-500/5 text-blue-600 dark:text-blue-400 px-4 py-2.5 rounded-2xl text-xs md:text-sm font-bold border border-blue-500/20 flex items-center gap-2.5">
          <Coins className="w-4 h-4 text-blue-500" />
          <span><strong className="text-base font-display">{credits}</strong> Tokens</span>
        </div>
        
        {/* Recharge Button */}
        <button 
          onClick={onAddCredits} 
          className="bg-slate-800 hover:bg-slate-700 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>RECARGAR</span>
        </button>
      </div>
    </header>
  );
}
