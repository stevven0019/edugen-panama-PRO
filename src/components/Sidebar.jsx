import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Layers, 
  LayoutDashboard, 
  FolderOpen, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  LogOut,
  Sparkles,
  School,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, userEmail, onLogout, showPWAInstallBtn = false, onPWAInstall, isAdmin = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check local preferences
    const isDark = localStorage.getItem('theme') === 'dark' || 
                   (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'aoa', label: 'Planificador AOA', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'interdisciplinary', label: 'Proy. Interdisciplinario', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'theme-planner', label: 'Theme Planner', icon: <Layers className="w-5 h-5" /> },
    { id: 'library', label: 'Mi Biblioteca', icon: <FolderOpen className="w-5 h-5" /> },
  ];

  const getActiveStyles = (itemId) => {
    if (activeTab === itemId) {
      if (itemId === 'aoa') return 'bg-blue-600 text-white dark:bg-blue-600 shadow-md shadow-blue-500/20';
      if (itemId === 'interdisciplinary') return 'bg-violet-600 text-white dark:bg-violet-600 shadow-md shadow-violet-500/20';
      if (itemId === 'theme-planner') return 'bg-emerald-600 text-white dark:bg-emerald-600 shadow-md shadow-emerald-500/20';
      if (itemId === 'admin-payments') return 'bg-rose-600 text-white dark:bg-rose-600 shadow-md shadow-rose-500/20';
      return 'bg-indigo-600 text-white dark:bg-indigo-600 shadow-md shadow-indigo-500/20';
    }
    return 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white';
  };

  const handleTabSelect = (tabId) => {
    setActiveTab(tabId);
    setIsOpen(false); // Close mobile drawer
  };

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 glass-panel border-b sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80">
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl text-white">
            <School className="w-5 h-5" />
          </div>
          <span className="font-extrabold font-display text-lg tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
            EduGen Panama
          </span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 active:scale-95 transition"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 bottom-0 z-50 w-72 glass-panel border-r bg-white/70 dark:bg-slate-950/70 p-6 flex flex-col justify-between
        transform lg:transform-none transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="space-y-8">
          {/* Logo & Brand Header */}
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-200/60 dark:border-slate-800/40">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-500/20">
              <School className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold font-display text-xl tracking-tight leading-none bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                EduGen Panama
              </h1>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-1">
                SaaS & PWA Edition v4.0
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <span className="px-3 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">
              MENÚ PRINCIPAL
            </span>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabSelect(item.id)}
                className={`
                  w-full flex items-center space-x-3.5 px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 active:scale-[0.98]
                  ${getActiveStyles(item.id)}
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}

            {isAdmin && (
              <>
                <span className="px-3 text-[10px] font-black text-rose-500 dark:text-rose-400 uppercase tracking-widest block mb-2 pt-4">
                  ADMINISTRACIÓN
                </span>
                <button
                  onClick={() => handleTabSelect('admin-payments')}
                  className={`
                    w-full flex items-center space-x-3.5 px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 active:scale-[0.98]
                    ${getActiveStyles('admin-payments')}
                  `}
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>Aprobar Pagos</span>
                </button>
              </>
            )}

            <span className="px-3 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2 pt-4">
              RECURSOS Y SOPORTE
            </span>
            
            <button
              onClick={() => handleTabSelect('blog')}
              className={`
                w-full flex items-center space-x-3.5 px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 active:scale-[0.98]
                ${getActiveStyles('blog')}
              `}
            >
              <BookOpen className="w-5 h-5" />
              <span>Blog Educativo</span>
            </button>

            <button
              onClick={() => handleTabSelect('privacy')}
              className={`
                w-full flex items-center space-x-3.5 px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 active:scale-[0.98]
                ${getActiveStyles('privacy')}
              `}
            >
              <School className="w-5 h-5" />
              <span>Términos y Privacidad</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="space-y-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/40">
          {/* PWA Install Button */}
          {showPWAInstallBtn && (
            <button
              onClick={onPWAInstall}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-700 text-white text-[11px] font-black tracking-wide shadow-md shadow-blue-500/10 hover:scale-[1.01] active:scale-[0.99] transition cursor-pointer animate-pulse"
            >
              📲 Instalar EduGen Pro
            </button>
          )}

          {/* Premium Nudge Callout (Banner) */}
          <div 
            onClick={() => window.dispatchEvent(new CustomEvent('show-billing-modal'))}
            className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-500/20 cursor-pointer hover:border-amber-500/40 transition group relative overflow-hidden"
          >
            <div className="absolute -right-6 -bottom-6 w-14 h-14 bg-amber-500/5 rounded-full blur-xl group-hover:scale-150 transition-all"></div>
            <div className="flex items-start gap-2.5 relative z-10">
              <Sparkles className="w-4.5 h-4.5 text-amber-500 flex-shrink-0 animate-pulse mt-0.5" />
              <div>
                <h4 className="text-[11px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">Plan sin anuncios</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                  Genera sin interrupciones y obtén acceso total.
                </p>
                <span className="text-[9px] font-bold text-amber-500 hover:underline block mt-2">Hazte PRO por $19.99 →</span>
              </div>
            </div>
          </div>

          {/* Theme Toggler Card */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/40">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Modo Oscuro</span>
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-sm hover:scale-105 active:scale-95 transition"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>
          </div>

          {/* User Profile Card */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden pr-2">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                {userEmail ? userEmail.substring(0, 2).toUpperCase() : 'US'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-black text-slate-700 dark:text-slate-300 truncate">Docente</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate" title={userEmail}>
                  {userEmail || 'demo@edugen.pro'}
                </p>
              </div>
            </div>
            {onLogout && (
              <button 
                onClick={onLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-950/20 active:scale-95 transition flex-shrink-0"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
