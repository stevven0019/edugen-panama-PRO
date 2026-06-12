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
  Maximize2
} from 'lucide-react';
import { databaseService } from '../services/firebase';

export default function Dashboard({ user, credits, setActiveTab, isPremium = false }) {
  const [plansCount, setPlansCount] = useState(0);
  const [recentPlans, setRecentPlans] = useState([]);
  const [selectedInfographic, setSelectedInfographic] = useState(null);

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
  ];

  const tips = [
    { title: "El Núcleo del Enfoque AOA", content: "Recuerda que una clase basada en AOA debe culminar siempre en una 'Tarea de Desempeño' o 'Misión' donde el estudiante resuelva un problema real en el escenario planteado, no solo completar hojas de ejercicios." },
    { title: "Diferenciación Inteligente", content: "MEDUCA exige adaptaciones curriculares. Utiliza el Lesson Delivery generado para apoyar a estudiantes DLN proveyendo guías visuales adicionales en tus clases." },
    { title: "Niveles de Referencia MCER", content: "Asegúrate de alinear las competencias pragmáticas y lingüísticas al nivel CEFR sugerido por MEDUCA: Pre-K a 2do Grado: Pre-A1 (Pre-A1.1 a Pre-A1.4); 3ro a 5to Grado: A1 (A1.1 a A1.3); Premedia (6to a 9no): A2 (A2.1 a A2.4); Media (10mo a 12mo): B1 (B1.1 a B1.3)." }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative glass-panel p-6 md:p-8 rounded-3xl bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-transparent border border-blue-500/10 flex flex-col md:flex-row justify-between items-center gap-6 overflow-hidden">
        <div className="space-y-2 text-center md:text-left z-10">
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            ¡Hola de nuevo, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">Profr!</span>
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
            Bienvenido al portal oficial de EduGen Panama PRO. Todo listo para acelerar tu planeación didáctica con inteligencia artificial alineada a MEDUCA.
          </p>
        </div>
        <div className="flex-shrink-0 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-4 rounded-2xl flex items-center gap-3 shadow-md z-10">
          <div className={`p-3 rounded-xl ${isPremium ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
            {isPremium ? <Sparkles className="w-6.5 h-6.5" /> : <GraduationCap className="w-7 h-7" />}
          </div>
          <div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Plan del Docente</p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {isPremium ? 'EduGen PRO Premium' : 'Plan Gratuito (Con Ads)'}
            </p>
          </div>
        </div>
        
        {/* Subtle Background Art */}
        <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-blue-500/5 blur-3xl pointer-events-none"></div>
      </div>

      {/* Upgrade Callout Banner */}
      {!isPremium && (
        <div 
          onClick={() => window.dispatchEvent(new CustomEvent('show-billing-modal'))}
          className="relative glass-panel p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-500/20 cursor-pointer hover:border-amber-500/40 transition overflow-hidden group shadow-lg"
        >
          {/* Decorative shapes */}
          <div className="absolute -right-10 -top-10 w-36 h-36 bg-amber-500/5 rounded-full blur-2xl group-hover:scale-125 transition-all"></div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 text-center sm:text-left">
            <div className="flex items-center gap-4.5 flex-col sm:flex-row">
              <div className="bg-amber-500/10 p-3.5 rounded-2xl text-amber-500 animate-bounce">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-slate-850 dark:text-slate-100 uppercase tracking-tight">¡Activa EduGen Pro hoy mismo!</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal max-w-xl">
                  Elimina por completo la publicidad, obtén prioridad máxima en servidores y un paquete inicial de 30 tokens Pro. ¡Descuento especial por solo $19.99/trimestre!
                </p>
              </div>
            </div>
            <button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-3 rounded-2xl text-xs tracking-wide shadow-md active:scale-95 transition-all w-full sm:w-auto flex-shrink-0 uppercase">
              Actualizar a PRO
            </button>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Credits Metric Card */}
        <div className="glass-panel p-6 rounded-3xl bg-white/60 dark:bg-slate-900/60 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">CRÉDITOS DISPONIBLES</span>
            <h4 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 flex items-baseline gap-1.5 font-display">
              {credits} <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Tokens</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">1 Token equivale a 1 planeación completa.</p>
          </div>
          <div className="bg-blue-500/10 p-4 rounded-2xl text-blue-500"><Coins className="w-8 h-8" /></div>
        </div>

        {/* Plans Created Metric Card */}
        <div className="glass-panel p-6 rounded-3xl bg-white/60 dark:bg-slate-900/60 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">MI BIBLIOTECA</span>
            <h4 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 flex items-baseline gap-1.5 font-display">
              {plansCount} <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Documentos</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Documentos guardados listos para descargar.</p>
          </div>
          <div className="bg-indigo-500/10 p-4 rounded-2xl text-indigo-500"><FileText className="w-8 h-8" /></div>
        </div>
      </div>

      {/* Main Body Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Quick Actions & Recent Plans */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="font-extrabold font-display text-lg text-slate-800 dark:text-slate-200">¿Qué planearemos hoy?</h3>
          <div className="grid grid-cols-1 gap-4">
            {quickActions.map(action => (
              <button
                key={action.id}
                onClick={() => setActiveTab(action.id)}
                className="w-full text-left glass-panel p-5 rounded-2xl bg-white/40 dark:bg-slate-900/40 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between group active:scale-[0.99] transition-all"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl bg-slate-100 dark:bg-slate-800 ${action.textColor} dark:${action.textColor}`}>
                    {action.icon}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{action.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{action.desc}</p>
                  </div>
                </div>
                <div className="p-2 rounded-full border border-slate-200 dark:border-slate-800 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white dark:group-hover:border-slate-700 group-hover:translate-x-1.5 transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>

          {/* Recent Plans Card */}
          <div className="glass-panel p-6 rounded-3xl bg-white/60 dark:bg-slate-900/60 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/40 pb-3">
              <h4 className="font-extrabold font-display text-sm text-slate-800 dark:text-slate-200">Planeaciones Recientes</h4>
              <button 
                onClick={() => setActiveTab('library')}
                className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 font-bold flex items-center gap-0.5"
              >
                <span>Ver biblioteca</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            
            {recentPlans.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-6">
                Aún no has generado planeaciones en esta sesión. ¡Comienza haciendo una!
              </p>
            ) : (
              <div className="space-y-2">
                {recentPlans.map(plan => (
                  <div 
                    key={plan.id}
                    onClick={() => setActiveTab('library')}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-950/20 cursor-pointer transition text-xs"
                  >
                    <div className="flex items-center space-x-2.5 overflow-hidden">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0 animate-pulse"></div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">{plan.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold flex-shrink-0">
                      {new Date(plan.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Tips Center */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="font-extrabold font-display text-lg text-slate-800 dark:text-slate-200">Guía de Metodología AOA</h3>
          <div className="space-y-4">
            {tips.map((tip, idx) => (
              <div 
                key={idx} 
                className="glass-panel p-5 rounded-2xl bg-white/40 dark:bg-slate-900/40 border-l-4 border-l-indigo-500 border border-slate-200/60 dark:border-slate-800/80 space-y-2"
              >
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <span className="bg-indigo-500/10 text-indigo-500 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black">{idx + 1}</span>
                  {tip.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {tip.content}
                </p>
              </div>
            ))}
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
    </div>
  );
}
