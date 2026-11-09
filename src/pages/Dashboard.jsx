import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  FileText, 
  Coins, 
  ArrowRight, 
  ChevronRight, 
  BookOpen, 
  Layers,
  GraduationCap,
  Eye,
  Download,
  X,
  ChevronLeft,
  Maximize2,
  FileCheck,
  Compass,
  ArrowUpRight,
  Bookmark,
  CheckCircle2,
  TrendingUp,
  Clock,
  Sparkle
} from 'lucide-react';
import { databaseService } from '../services/firebase';

export default function Dashboard({ user, credits, setActiveTab, isPremium = false }) {
  const [plansCount, setPlansCount] = useState(0);
  const [recentPlans, setRecentPlans] = useState([]);
  const [selectedInfographic, setSelectedInfographic] = useState(null);
  const [showPromoPopup, setShowPromoPopup] = useState(false);

  useEffect(() => {
    if (!isPremium) {
      const shown = sessionStorage.getItem('edugen_promo_shown');
      if (!shown) {
        const timer = setTimeout(() => {
          setShowPromoPopup(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [isPremium]);

  const handleClosePromo = () => {
    setShowPromoPopup(false);
    sessionStorage.setItem('edugen_promo_shown', 'true');
  };

  const infographics = [
    {
      id: 'features',
      title: 'Features of the English Curriculum',
      titleEs: 'Características del Currículo de Inglés',
      desc: 'Aspectos fundamentales del programa curricular oficial de inglés de MEDUCA, estructurado bajo un enfoque constructivista y humanista.',
      badge: 'Currículo',
      src: '/images/features-english-curriculum.jpg'
    },
    {
      id: 'competences',
      title: 'Communicative Competences',
      titleEs: 'Competencias Comunicativas',
      desc: 'Detalle de las dimensiones y competencias comunicativas para afianzar el dominio práctico del idioma (pragmática, sociolingüística y lingüística).',
      badge: 'Competencias',
      src: '/images/communicative-competences.jpg'
    },
    {
      id: 'skills',
      title: 'Language Skills',
      titleEs: 'Habilidades del Lenguaje',
      desc: 'Integración didáctica de las habilidades comunicativas fundamentales: comprensión auditiva, expresión oral, comprensión lectora y expresión escrita.',
      badge: 'Habilidades',
      src: '/images/language-skills.jpg'
    },
    {
      id: 'bands',
      title: 'Proficiency Bands',
      titleEs: 'Bandas de Competencia',
      desc: 'Nivelación de expectativas de aprendizaje y bandas de rendimiento sugeridas para los distintos grados académicos.',
      badge: 'Niveles',
      src: '/images/proficiency-bands.jpg'
    },
    {
      id: 'cefr',
      title: 'CEFR Standard-Based',
      titleEs: 'Estándares del Marco Común Europeo',
      desc: 'La correspondencia curricular y operacional del programa de inglés de Panamá con los niveles de referencia A1, A2 y B1 del MCER.',
      badge: 'Estándares',
      src: '/images/cefr-standard-based.jpg'
    }
  ];

  const handlePrev = () => {
    setSelectedInfographic((prev) => (prev === null ? null : (prev - 1 + infographics.length) % infographics.length));
  };

  const handleNext = () => {
    setSelectedInfographic((prev) => (prev === null ? null : (prev + 1) % infographics.length));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedInfographic === null) return;
      if (e.key === 'Escape') setSelectedInfographic(null);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedInfographic]);

  useEffect(() => {
    if (user) {
      databaseService.getSavedPlans(user.uid)
        .then(plans => {
          setPlansCount(plans.length);
          setRecentPlans(plans.slice(-3).reverse()); // Get up to 3 most recent plans
        })
        .catch(err => console.error("Error loading stats:", err));
    }
  }, [user]);

  const quickActions = [
    { 
      id: 'curriculum-hub', 
      title: 'Hub Curricular por Grado', 
      desc: 'Accede a los 8 escenarios, Theme Planners, Lecciones 1-5 y Pósters de aula.', 
      color: 'from-teal-600 to-teal-700 shadow-teal-500/10',
      textColor: 'text-teal-500',
      icon: <Compass className="w-6 h-6" /> 
    },
    { 
      id: 'aoa', 
      title: 'Planificador AOA', 
      desc: 'Crea lecciones dinámicas centradas en la acción.', 
      color: 'from-blue-600 to-blue-700 shadow-blue-500/10',
      textColor: 'text-blue-500',
      icon: <BookOpen className="w-6 h-6" /> 
    },
    { 
      id: 'interdisciplinary', 
      title: 'Proy. Interdisciplinario', 
      desc: 'Genera proyectos conjuntos MEDUCA paso a paso.', 
      color: 'from-violet-600 to-violet-700 shadow-violet-500/10',
      textColor: 'text-violet-500',
      icon: <Sparkles className="w-6 h-6" /> 
    },
    { 
      id: 'theme-planner', 
      title: 'Theme Planner', 
      desc: 'Planeaciones de unidades completas y CEFR.', 
      color: 'from-emerald-600 to-emerald-700 shadow-emerald-500/10',
      textColor: 'text-emerald-500',
      icon: <Layers className="w-6 h-6" /> 
    },
    { 
      id: 'lesson-test', 
      title: 'Lesson Test Studio', 
      desc: 'Pruebas formativas y sumativas AOA (2 páginas máx con clave).', 
      color: 'from-blue-700 to-indigo-800 shadow-blue-600/10',
      textColor: 'text-blue-600 dark:text-blue-400',
      icon: <FileCheck className="w-6 h-6" /> 
    },
  ];

  const tips = [
    { title: "El Núcleo del Enfoque AOA", content: "Recuerda que una clase basada en AOA debe culminar siempre en una 'Tarea de Desempeño' o 'Misión' donde el estudiante resuelva un problema real en el escenario planteado, no solo completar hojas de ejercicios." },
    { title: "Diferenciación Inteligente", content: "MEDUCA exige adaptaciones curriculares. Utiliza el Lesson Delivery generado para apoyar a estudiantes DLN proveyendo guías visuales adicionales en tus clases." },
    { title: "Niveles de Referencia MCER", content: "Asegúrate de alinear las competencias pragmáticas y lingüísticas al nivel CEFR sugerido por MEDUCA: Pre-K a 2do Grado: Pre-A1 (Pre-A1.1 a Pre-A1.4); 3ro a 5to Grado: A1 (A1.1 a A1.3); Premedia (6to a 9no): A2 (A2.1 a A2.4); Media (10mo a 12mo): B1 (B1.1 a B1.3)." }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Hero Banner (Glassmorphism V22) */}
      <div className="relative glass-card-v22 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-cyan-500/10 border border-blue-500/20 flex flex-col md:flex-row justify-between items-center gap-6 overflow-hidden shadow-xl">
        <div className="space-y-3 text-center md:text-left z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
            EduGen Panama AI 2.0 • MEDUCA AOA Standard
          </div>
          <h3 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
            ¡Hola de nuevo, <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-cyan-300">Profesor!</span> 👋
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Tu centro integral de inteligencia didáctica: genera planes AOA, proyectos interdisciplinarios y descarga los cuadernos de trabajo oficiales de 7 páginas en segundos.
          </p>
        </div>

        <div className="flex-shrink-0 glass-card-v22 p-5 rounded-2xl flex items-center gap-4 border border-white/20 dark:border-slate-800 shadow-lg z-10">
          <div className={`p-3.5 rounded-2xl shadow-inner ${isPremium ? 'bg-gradient-to-br from-amber-400 to-yellow-600 text-slate-950 font-black' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>
            {isPremium ? <Sparkles className="w-7 h-7" /> : <GraduationCap className="w-7 h-7" />}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 dark:text-slate-400 font-extrabold uppercase tracking-wider">Membresía</span>
              {isPremium && <span className="px-1.5 py-0.2 bg-amber-400/20 text-amber-500 text-[9px] font-black rounded">ACTIVO</span>}
            </div>
            <p className="text-sm font-black text-slate-900 dark:text-white">
              {isPremium ? 'EduGen PRO Anual' : 'Plan Gratuito'}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Currículo Nacional Oficial</p>
          </div>
        </div>
        
        {/* Subtle Background Art */}
        <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-blue-500/15 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>
      </div>

      {/* Video Tutorial Banner */}
      <div 
        onClick={() => window.dispatchEvent(new CustomEvent('show-tutorial-video'))}
        className="relative glass-card-v22 p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-transparent border border-blue-500/20 cursor-pointer transition overflow-hidden group"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 text-center sm:text-left">
          <div className="flex items-center gap-4 flex-col sm:flex-row">
            <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl text-blue-500 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 justify-center sm:justify-start">
                <span>¿Nuevo en EduGen? Video Tutorial de Inducción Rápida</span>
                <span className="pill-badge-v22">3 min</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal max-w-xl">
                Aprende paso a paso cómo alinear tus clases con el currículo oficial MEDUCA AOA y descargar material en 1 clic.
              </p>
            </div>
          </div>
          <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs tracking-wide shadow-md active:scale-95 transition-all w-full sm:w-auto flex-shrink-0 cursor-pointer flex items-center justify-center gap-1.5">
            <span>Ver Tutorial</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Upgrade Callout Banner */}
      {!isPremium && (
        <div 
          onClick={() => window.dispatchEvent(new CustomEvent('show-billing-modal'))}
          className="relative glass-card-v22 p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/5 to-transparent border border-amber-500/30 cursor-pointer transition overflow-hidden group"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 text-center sm:text-left">
            <div className="flex items-center gap-4 flex-col sm:flex-row">
              <div className="bg-amber-500/15 border border-amber-500/30 p-3 rounded-xl text-amber-500 group-hover:rotate-12 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  ¡Activa EduGen Pro y Libera Descargas Ilimitadas!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal max-w-xl">
                  Sin anuncios, prioridad instantánea en servidores y acceso completo a los 112 workbooks oficiales. Solo $19.99/año.
                </p>
              </div>
            </div>
            <button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs tracking-wide shadow-lg active:scale-95 transition-all w-full sm:w-auto flex-shrink-0">
              Actualizar a PRO ✨
            </button>
          </div>
        </div>
      )}

      {/* Metrics Grid V22 (Stats Cards with Glowing Accents) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Credits */}
        <div className="glass-card-v22 p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-widest">TOKENS IA</span>
              <span className="pill-badge-v22 text-[9px] py-0">Disponibles</span>
            </div>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white font-display">
              {credits} <span className="text-xs font-medium text-slate-400">Tokens</span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Genera planeaciones completas</p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 p-3.5 rounded-2xl text-blue-500">
            <Coins className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: Library count */}
        <div className="glass-card-v22 p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-widest">MI BIBLIOTECA</span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">Docs</span>
            </div>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white font-display">
              {plansCount} <span className="text-xs font-medium text-slate-400">Archivos</span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Planes listos para descargar</p>
          </div>
          <div className="bg-indigo-500/10 border border-indigo-500/20 p-3.5 rounded-2xl text-indigo-500">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: Official Workbooks */}
        <div 
          onClick={() => setActiveTab('curriculum-hub')}
          className="glass-card-v22 p-5 rounded-2xl flex items-center justify-between cursor-pointer group"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-widest">WORKBOOKS CANVA</span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">7 Págs</span>
            </div>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white font-display flex items-center gap-1">
              112 <span className="text-xs font-medium text-emerald-500 group-hover:translate-x-0.5 transition-transform">Libros →</span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Pre-K a 12° Grado con Key</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-2xl text-emerald-500 group-hover:scale-110 transition-transform">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4: Alignment Standard */}
        <div className="glass-card-v22 p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-widest">ESTÁNDAR</span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-teal-500/10 text-teal-500 border border-teal-500/20">AOA</span>
            </div>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white font-display">
              100% <span className="text-xs font-medium text-teal-500">MEDUCA</span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">CEFR Pre-A1 hasta B1.3</p>
          </div>
          <div className="bg-teal-500/10 border border-teal-500/20 p-3.5 rounded-2xl text-teal-500">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Body Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Quick Actions & Recent Plans */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold font-display text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-5 rounded-full bg-blue-600"></span>
              ¿Qué planearemos hoy?
            </h3>
            <span className="text-xs text-slate-400 font-medium">Accesos Rápidos</span>
          </div>
          <div className="grid grid-cols-1 gap-3.5">
            {quickActions.map(action => (
              <button
                key={action.id}
                onClick={() => setActiveTab(action.id)}
                className="w-full text-left glass-card-v22 p-4.5 rounded-2xl flex items-center justify-between group active:scale-[0.99] transition-all cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 ${action.textColor} group-hover:scale-105 transition-transform`}>
                    {action.icon}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                      {action.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{action.desc}</p>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:border-blue-500/30 group-hover:translate-x-1 transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>

          {/* Recent Plans Card */}
          <div className="glass-card-v22 p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
              <h4 className="font-extrabold font-display text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                Planeaciones y Recursos Recientes
              </h4>
              <button 
                onClick={() => setActiveTab('library')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
              >
                <span>Ver biblioteca completa</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            
            {recentPlans.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto">
                  <FileText className="w-5 h-5" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Aún no has generado planeaciones en esta sesión.
                </p>
                <button 
                  onClick={() => setActiveTab('aoa')}
                  className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
                >
                  ¡Crea tu primera planeación AOA aquí!
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {recentPlans.map(plan => (
                  <div 
                    key={plan.id}
                    onClick={() => setActiveTab('library')}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 hover:border-blue-500/30 hover:bg-blue-50/50 dark:hover:bg-slate-800/40 cursor-pointer transition text-xs group"
                  >
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0 group-hover:scale-125 transition-transform"></div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{plan.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold flex-shrink-0 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      {new Date(plan.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Tips & Saved Resources (V22 Style) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold font-display text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-5 rounded-full bg-indigo-600"></span>
              Metodología AOA & Claves
            </h3>
            <span className="text-xs text-slate-400 font-medium">MEDUCA</span>
          </div>

          <div className="space-y-3.5">
            {tips.map((tip, idx) => (
              <div 
                key={idx} 
                className="glass-card-v22 p-5 rounded-2xl border-l-4 border-l-indigo-500 space-y-2"
              >
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="bg-indigo-500/10 text-indigo-500 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border border-indigo-500/20">{idx + 1}</span>
                  {tip.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {tip.content}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Access to 7-Page Canva Workbooks */}
          <div className="glass-card-v22 p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-blue-500/5 to-transparent border border-indigo-500/20 space-y-3">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Cuadernos de 7 Páginas Oficiales</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
              Diseño tipo Canva para imprimir o proyectar: incluye audio scripts, ejercicios guiados y Teacher Guide con Master Answer Key en la página 7.
            </p>
            <button
              onClick={() => setActiveTab('curriculum-hub')}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explorar los 112 Cuadernos</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Centro de Referencia Curricular (MEDUCA) */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800/40 pb-3">
          <div>
            <h3 className="font-extrabold font-display text-lg text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span className="w-2.5 h-6 rounded-md bg-gradient-to-b from-blue-500 to-indigo-500 inline-block"></span>
              📚 Centro de Referencia Curricular MEDUCA
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Infografías pedagógicas oficiales sobre los lineamientos y estándares del currículo de inglés.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {infographics.map((info, idx) => (
            <div
              key={info.id}
              onClick={() => setSelectedInfographic(idx)}
              className="glass-panel overflow-hidden group cursor-pointer hover:border-blue-500/30 dark:hover:border-blue-500/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800"
            >
              {/* Image Preview Container */}
              <div className="relative overflow-hidden aspect-[4/3] bg-slate-100 dark:bg-slate-950/60 flex items-center justify-center border-b border-slate-200 dark:border-slate-800/40">
                <img
                  src={info.src}
                  alt={info.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white backdrop-blur-[2px] gap-2">
                  <div className="bg-white/20 p-2 rounded-full backdrop-blur-md border border-white/20">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider">Ampliar Infografía</span>
                </div>
              </div>

              {/* Card Metadata */}
              <div className="p-4 flex-grow flex flex-col justify-between space-y-2">
                <div>
                  <span className="inline-block text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 mb-2">
                    {info.badge}
                  </span>
                  <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 leading-tight">
                    {info.titleEs}
                  </h4>
                  <p className="text-[9px] text-slate-400 dark:text-slate-500 italic mt-0.5 truncate">
                    {info.title}
                  </p>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {info.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Lightbox Modal */}
      {selectedInfographic !== null && (
        <div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md p-4 sm:p-6 md:p-8 animate-fade-in"
          onClick={() => setSelectedInfographic(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedInfographic(null)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md transition active:scale-95 z-50 cursor-pointer border border-white/10 shadow-lg"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left Arrow Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3.5 rounded-full backdrop-blur-md transition active:scale-95 z-50 cursor-pointer border border-white/10 shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3.5 rounded-full backdrop-blur-md transition active:scale-95 z-50 cursor-pointer border border-white/10 shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image & Description Container */}
          <div 
            className="relative max-w-5xl w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-white/10 bg-slate-900 max-h-[72vh] flex items-center justify-center">
              <img
                src={infographics[selectedInfographic].src}
                alt={infographics[selectedInfographic].title}
                className="max-w-full max-h-[70vh] object-contain select-none transition-all duration-300"
              />
            </div>

            {/* Footer Metadata */}
            <div className="mt-5 w-full text-center text-white space-y-2 max-w-2xl px-4">
              <div className="flex items-center justify-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {infographics[selectedInfographic].badge}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Infografía {selectedInfographic + 1} de {infographics.length}
                </span>
              </div>
              <h3 className="font-extrabold text-lg tracking-tight leading-tight mt-1 text-slate-100 font-display">
                {infographics[selectedInfographic].titleEs}
              </h3>
              <p className="text-xs text-slate-400 italic">
                {infographics[selectedInfographic].title}
              </p>
              <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed mt-2">
                {infographics[selectedInfographic].desc}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3 pt-4">
                <a
                  href={infographics[selectedInfographic].src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 border border-white/15 text-white px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition active:scale-95 flex items-center gap-2"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>Ver Pantalla Completa</span>
                </a>
                <a
                  href={infographics[selectedInfographic].src}
                  download={`EduGen_MEDUCA_${infographics[selectedInfographic].id}.jpg`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition active:scale-95 flex items-center gap-2 shadow-lg shadow-blue-600/30"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Premium Launch Offer Promo Popup Modal */}
      {showPromoPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-md bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl p-6.5 text-center shadow-2xl relative animate-scale-up">
            
            {/* Close Button */}
            <button 
              onClick={handleClosePromo}
              className="absolute top-4.5 right-4.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white p-2 rounded-full transition active:scale-95 z-20 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Glowing Icon */}
            <div className="mx-auto bg-amber-500/10 text-amber-400 border border-amber-500/20 w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/5 mb-5 animate-pulse">
              <Sparkles className="w-8 h-8" />
            </div>

            {/* Title / Badge */}
            <span className="bg-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
              OFERTA DE LANZAMIENTO
            </span>
            <h3 className="text-xl md:text-2xl font-black text-white mt-4 tracking-tight">
              ¡Pásate a EduGen PRO hoy!
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mt-2.5">
              Optimiza tu labor docente sin interrupciones ni publicidad. Accede hoy mismo con nuestra oferta de descuento exclusiva.
            </p>

            {/* Price section */}
            <div className="my-6 bg-slate-900/50 border border-slate-850 p-4.5 rounded-2xl flex items-center justify-between">
              <div className="text-left">
                <p className="text-[9px] text-slate-500 font-bold uppercase">Suscripción Anual</p>
                <p className="text-xs text-slate-400 line-through font-semibold mt-0.5">$24.99 USD</p>
              </div>
              <div className="text-right">
                <span className="text-[9px] bg-rose-500/10 text-rose-400 border border-rose-500/20 font-black px-2 py-0.5 rounded-lg uppercase tracking-wider block w-fit ml-auto">
                  Ahorra 20%
                </span>
                <p className="text-2xl font-black text-amber-400 font-display mt-0.5">
                  $19.99 <span className="text-[10px] text-slate-400 font-medium">USD</span>
                </p>
              </div>
            </div>

            {/* Features summary */}
            <ul className="text-left text-xs text-slate-350 space-y-2.5 mb-6">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold flex-shrink-0 mt-0.5">✓</span>
                <span><strong>Cero publicidad</strong> molesta en toda la aplicación.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold flex-shrink-0 mt-0.5">✓</span>
                <span><strong>30 Tokens de Generación</strong> incluidos de inmediato.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold flex-shrink-0 mt-0.5">✓</span>
                <span>Prioridad máxima en servidores de planeación con IA.</span>
              </li>
            </ul>

            {/* Action buttons */}
            <div className="space-y-3">
              <button 
                onClick={() => {
                  handleClosePromo();
                  window.dispatchEvent(new CustomEvent('show-billing-modal'));
                }}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black py-4 rounded-2xl shadow-lg shadow-amber-500/10 active:scale-98 transition text-xs tracking-wider uppercase cursor-pointer"
              >
                Aprovechar Oferta PRO
              </button>
              <button 
                onClick={handleClosePromo}
                className="w-full text-slate-500 hover:text-slate-400 font-bold py-1 text-xs cursor-pointer active:scale-98 transition"
              >
                Continuar con la versión gratuita
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
