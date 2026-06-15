import React, { useState, useEffect } from 'react';
import { 
  School, 
  ArrowRight, 
  BookOpen, 
  Layers, 
  Sparkles, 
  GraduationCap, 
  ShieldCheck, 
  Award, 
  Globe, 
  CheckCircle,
  MessageSquare,
  Send,
  User,
  MapPin,
  BarChart3,
  Plus
} from 'lucide-react';
import AdBanner from '../components/AdBanner';
import { databaseService } from '../services/firebase';

export default function PublicLanding({ onLoginClick, setPublicTab, setSelectedArticleId }) {
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  
  // Comment form state
  const [commName, setCommName] = useState('');
  const [commSchool, setCommSchool] = useState('');
  const [commRegion, setCommRegion] = useState('');
  const [commText, setCommText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Poll state
  const [pollResults, setPollResults] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [submittingVote, setSubmittingVote] = useState(false);

  useEffect(() => {
    // Load comments
    databaseService.getPublicComments()
      .then(data => {
        setComments(data);
        setLoadingComments(false);
      })
      .catch(err => {
        console.error("Error loading comments:", err);
        setLoadingComments(false);
      });

    // Load poll
    databaseService.getSurveyResults()
      .then(data => {
        setPollResults(data);
      })
      .catch(err => {
        console.error("Error loading survey results:", err);
      });

    // Check if user has already voted
    const voted = localStorage.getItem('edugen_survey_voted');
    if (voted === 'true') {
      setHasVoted(true);
    }
  }, []);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commName || !commSchool || !commRegion || !commText) {
      alert("Por favor completa todos los campos para enviar tu comentario.");
      return;
    }
    setSubmittingComment(true);
    try {
      await databaseService.submitPublicComment(commName, commSchool, commRegion, commText);
      // Reload comments
      const updated = await databaseService.getPublicComments();
      setComments(updated);
      // Reset form
      setCommName('');
      setCommSchool('');
      setCommRegion('');
      setCommText('');
      alert("¡Gracias por tu comentario! Se ha añadido al muro de la comunidad.");
    } catch (err) {
      console.error(err);
      alert("Hubo un error al enviar tu comentario. Intenta de nuevo.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleVote = async (optionId) => {
    if (hasVoted) return;
    setSubmittingVote(true);
    try {
      const updated = await databaseService.submitSurveyVote(optionId);
      setPollResults(updated);
      setHasVoted(true);
      localStorage.setItem('edugen_survey_voted', 'true');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingVote(false);
    }
  };

  const getPercentage = (optionCount) => {
    if (!pollResults || !pollResults.total) return '0%';
    const pct = ((optionCount / pollResults.total) * 100).toFixed(1);
    return `${pct}%`;
  };

  const features = [
    {
      title: 'Planificador AOA',
      desc: 'Crea secuencias didácticas basadas en tareas y misiones de acción reales con andamiaje lingüístico completo.',
      icon: <BookOpen className="w-6 h-6 text-blue-500" />,
      badge: 'Orientado a la Acción'
    },
    {
      title: 'Theme Planner Trimestral',
      desc: 'Genera planificaciones didácticas de unidades completas alineadas a los programas oficiales de MEDUCA de Pre-K a 12vo grado.',
      icon: <Layers className="w-6 h-6 text-emerald-500" />,
      badge: 'Unidades y Trimestres'
    },
    {
      title: 'Proyectos Interdisciplinarios',
      desc: 'Vincula la asignatura de inglés de forma orgánica con Ciencias Naturales, Estudios Sociales o Arte según las directrices oficiales.',
      icon: <Sparkles className="w-6 h-6 text-purple-500" />,
      badge: 'Aprendizaje Basado en Proyectos'
    }
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-50 to-slate-100 dark:from-blue-950/20 dark:via-slate-950 dark:to-slate-950 text-slate-800 dark:text-slate-200 selection:bg-blue-500/20">
      
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/60 dark:border-slate-800/40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setPublicTab('landing')}>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 w-9 h-9 rounded-xl text-white flex items-center justify-center shadow-md shadow-blue-500/10">
              <School className="w-5 h-5" />
            </div>
            <span className="font-extrabold font-display text-sm tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
              EduGen Panama
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            <button onClick={() => setPublicTab('landing')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">Inicio</button>
            <button onClick={() => setPublicTab('blog')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">Blog Educativo</button>
            <button onClick={() => setPublicTab('about')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">Quiénes Somos / Contacto</button>
          </div>

          <button 
            onClick={onLoginClick}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide shadow-md hover:shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span>Ingresar al Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20 pb-12 text-center space-y-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest animate-pulse">
          <Award className="w-3.5 h-3.5" />
          <span>ALINEADO A LA METODOLOGÍA OFICIAL DE MEDUCA</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-display tracking-tight leading-tight max-w-4xl mx-auto">
          Planificaciones Didácticas de Inglés con <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">Inteligencia Artificial</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Diseña secuencias didácticas basadas en el Enfoque Orientado a la Acción (AOA), alinea automáticamente los niveles de referencia CEFR y crea proyectos interdisciplinarios oficiales en minutos.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button 
            onClick={onLoginClick}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl text-xs font-bold tracking-wide shadow-xl shadow-blue-500/25 active:scale-98 transition flex items-center justify-center gap-2"
          >
            <span>Comenzar Gratis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setPublicTab('blog')}
            className="w-full sm:w-auto glass-panel hover:bg-slate-100/50 dark:hover:bg-slate-800/50 px-8 py-3.5 rounded-2xl text-xs font-bold tracking-wide transition border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2"
          >
            <span>Ver Blog Educativo</span>
          </button>
        </div>

        {/* Visual Mockup Dashboard Container */}
        <div className="pt-12 max-w-5xl mx-auto animate-fade-in relative z-10">
          <div className="glass-panel p-3 sm:p-4 rounded-3xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden aspect-[16/9] flex items-center justify-center">
            {/* Visual simulation of planning matrix */}
            <div className="w-full h-full rounded-2xl bg-slate-950/5 dark:bg-slate-950/20 border border-slate-200/40 dark:border-slate-800/40 p-4 text-left overflow-y-auto space-y-4 font-mono text-[9px] text-slate-400 relative">
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/40 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                  <span className="ml-2 text-[10px] font-bold font-display text-slate-700 dark:text-slate-300">Vista Previa - Secuencia Didáctica AOA</span>
                </div>
                <span className="text-[8px] font-black bg-blue-500/10 text-blue-500 border border-blue-500/25 px-2 py-0.5 rounded-full uppercase">MODO DEMO</span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-blue-500/5 p-3 rounded-xl border border-blue-500/10 space-y-1">
                  <div className="font-bold text-blue-500 uppercase text-[8px]">Habilidades Enfoque</div>
                  <div className="text-slate-700 dark:text-slate-300">Listening & Speaking</div>
                </div>
                <div className="bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10 space-y-1">
                  <div className="font-bold text-emerald-500 uppercase text-[8px]">Nivel CEFR</div>
                  <div className="text-slate-700 dark:text-slate-300">A1.3 (5th Grade)</div>
                </div>
                <div className="bg-violet-500/5 p-3 rounded-xl border border-violet-500/10 space-y-1">
                  <div className="font-bold text-violet-500 uppercase text-[8px]">Escenario MEDUCA</div>
                  <div className="text-slate-700 dark:text-slate-300">Exploring Our Ecosystem</div>
                </div>
                <div className="bg-rose-500/5 p-3 rounded-xl border border-rose-500/10 space-y-1">
                  <div className="font-bold text-rose-500 uppercase text-[8px]">Misión (Task)</div>
                  <div className="text-slate-700 dark:text-slate-300">Econoticias Broadcast</div>
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-4 bg-slate-300/20 rounded w-1/3"></div>
                <div className="h-2 bg-slate-300/10 rounded w-full"></div>
                <div className="h-2 bg-slate-300/10 rounded w-5/6"></div>
                <div className="h-2 bg-slate-300/10 rounded w-4/5"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Ad Placement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <AdBanner type="footer" isPremium={false} />
      </div>

      {/* Product Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold font-display tracking-tight">Planifica según los Lineamientos MEDUCA</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Nuestras herramientas integran de forma nativa la dosificación curricular del Ministerio de Educación de Panamá para el área de inglés.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat, index) => (
            <div 
              key={index}
              className="glass-panel p-6 rounded-3xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-blue-500/20 hover:scale-[1.01] transition-all duration-300 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl w-max">{feat.icon}</div>
                <div>
                  <span className="text-[8px] font-black uppercase bg-blue-500/10 text-blue-500 border border-blue-500/25 px-2 py-0.5 rounded-full tracking-wider">{feat.badge}</span>
                  <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 mt-2.5">{feat.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2">{feat.desc}</p>
                </div>
              </div>
              <button 
                onClick={onLoginClick}
                className="text-xs text-blue-500 dark:text-blue-400 font-bold flex items-center gap-1 hover:gap-1.5 transition-all pt-4"
              >
                <span>Usar herramienta</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Curriculum reference alignment section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-blue-600/5 dark:bg-blue-900/10 rounded-[3rem] border border-blue-500/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-5 px-6 py-4 md:px-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[9px] font-black tracking-widest uppercase">
            <Globe className="w-3.5 h-3.5" />
            <span>Estándares del MCER</span>
          </div>
          <h2 className="text-3xl font-extrabold font-display tracking-tight leading-tight">
            Alineación Inteligente a las Bandas de Competencia de Panamá
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            EduGen Panama mapea automáticamente el grado académico con las bandas oficiales indicadas en el currículo: desde **Pre-A1** para primaria inicial (`Pre-K` a `2do grado`), **A1** para primaria intermedia (`3ro` a `5to grado`), **A2** para premedia (`6to` a `9no grado`), hasta **B1** para educación media (`10mo` a `12mo grado`). Esto garantiza la rigurosidad pedagógica que exigen los supervisores nacionales.
          </p>
          <ul className="space-y-2.5 pt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <li className="flex items-center gap-2"><CheckCircle className="w-4.5 h-4.5 text-blue-500 flex-shrink-0" /> Mapeo automático de sub-bandas oficiales (Pre-A1.1 a B1.3).</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4.5 h-4.5 text-blue-500 flex-shrink-0" /> Vocabulario y gramática contextualizados según programas del MEDUCA.</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4.5 h-4.5 text-blue-500 flex-shrink-0" /> Descargas directas en PDF y formatos aptos para imprimir sin publicidad.</li>
          </ul>
        </div>
        <div className="lg:col-span-5 px-6 pb-6 lg:pb-0 flex justify-center">
          <div className="glass-panel p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl max-w-sm w-full space-y-4">
            <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5"><GraduationCap className="w-5 h-5 text-blue-500" /> Niveles Curriculares</h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800">
                <span className="font-bold">Pre-K a 2do</span>
                <span className="bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-md font-black text-[9px]">Pre-A1 (&lt;A1)</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800">
                <span className="font-bold">3ro a 5to</span>
                <span className="bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-md font-black text-[9px]">A1 (Beginner)</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800">
                <span className="font-bold">6to a 9no</span>
                <span className="bg-violet-500/10 text-violet-500 px-2 py-0.5 rounded-md font-black text-[9px]">A2 (Premedia)</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800">
                <span className="font-bold">10mo a 12mo</span>
                <span className="bg-pink-500/10 text-pink-500 px-2 py-0.5 rounded-md font-black text-[9px]">B1 (Media)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN: GUÍA DE USO DE PLANIFICADORES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-12 border-t border-slate-200/40 dark:border-slate-800/20">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Guía Práctica del Docente</span>
          </div>
          <h2 className="text-3xl font-extrabold font-display tracking-tight text-slate-850 dark:text-slate-100">
            ¿Cómo usar nuestros Planificadores Inteligentes?
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Estructura tus planes de forma sencilla siguiendo estos pasos diseñados para agilizar tu labor administrativa y pedagógica.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tarjeta: Lesson Planner AOA */}
          <div className="glass-panel p-6 rounded-3xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-5 flex flex-col justify-between hover:border-blue-500/30 transition-all duration-300">
            <div className="space-y-4">
              <div className="bg-blue-500/10 text-blue-500 p-3.5 rounded-2xl w-max">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-850 dark:text-slate-100">
                Lesson Planner AOA (Diario)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Genera secuencias didácticas diarias para afianzar las 5 habilidades lingüísticas bajo el enfoque pedagógico AOA exigido por MEDUCA.
              </p>
              <ul className="text-xs text-slate-600 dark:text-slate-350 space-y-2 border-t border-slate-200/50 dark:border-slate-800/40 pt-3">
                <li className="flex items-start gap-1.5">
                  <span className="bg-blue-500/10 text-blue-500 font-bold px-1.5 py-0.5 rounded text-[10px]">1</span>
                  <span>Ten a mano las <strong>Competencias Comunicativas</strong>.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="bg-blue-500/10 text-blue-500 font-bold px-1.5 py-0.5 rounded text-[10px]">2</span>
                  <span>Pégalas dentro del recuadro del formulario.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="bg-blue-500/10 text-blue-500 font-bold px-1.5 py-0.5 rounded text-[10px]">3</span>
                  <span>Ingresa los datos personales del grupo y listo.</span>
                </li>
              </ul>
              <div className="bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 p-3.5 rounded-2xl text-[11px] text-slate-650 dark:text-slate-300">
                💡 <strong>Extras:</strong> Genera automáticamente la secuencia de dictado <strong>Lesson Delivery</strong> y un área de <strong>Resources</strong> con actividades y rúbricas.
              </div>
            </div>
          </div>

          {/* Tarjeta: Theme Planner */}
          <div className="glass-panel p-6 rounded-3xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-5 flex flex-col justify-between hover:border-emerald-500/30 transition-all duration-300">
            <div className="space-y-4">
              <div className="bg-emerald-500/10 text-emerald-500 p-3.5 rounded-2xl w-max">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-850 dark:text-slate-100">
                Theme Planner (Trimestral)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Diseña unidades completas organizando la dosificación y contenidos trimestrales oficiales de MEDUCA.
              </p>
              <ul className="text-xs text-slate-600 dark:text-slate-350 space-y-2 border-t border-slate-200/50 dark:border-slate-800/40 pt-3">
                <li className="flex items-start gap-1.5">
                  <span className="bg-emerald-500/10 text-emerald-500 font-bold px-1.5 py-0.5 rounded text-[10px]">1</span>
                  <span>Selecciona el grado y trimestre correspondiente.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="bg-emerald-500/10 text-emerald-500 font-bold px-1.5 py-0.5 rounded text-[10px]">2</span>
                  <span>Ingresa los datos necesarios para dosificar los contenidos.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="bg-emerald-500/10 text-emerald-500 font-bold px-1.5 py-0.5 rounded text-[10px]">Nota</span>
                  <span>Por el momento, está disponible para <strong>Kinder, Primer Grado y Cuarto Grado</strong>.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Tarjeta: Proyecto Interdisciplinario */}
          <div className="glass-panel p-6 rounded-3xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-5 flex flex-col justify-between hover:border-purple-500/30 transition-all duration-300">
            <div className="space-y-4">
              <div className="bg-purple-500/10 text-purple-500 p-3.5 rounded-2xl w-max">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-850 dark:text-slate-100">
                Proyecto Interdisciplinario
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Vincula el inglés de forma transversal con otras asignaturas (Ciencias Naturales, Estudios Sociales, Arte).
              </p>
              <ul className="text-xs text-slate-600 dark:text-slate-350 space-y-2 border-t border-slate-200/50 dark:border-slate-800/40 pt-3">
                <li className="flex items-start gap-1.5">
                  <span className="bg-purple-500/10 text-purple-500 font-bold px-1.5 py-0.5 rounded text-[10px]">1</span>
                  <span>Si no tienes un tema de proyecto, la IA te ayuda a <strong>generar una propuesta de tema</strong>.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="bg-purple-500/10 text-purple-500 font-bold px-1.5 py-0.5 rounded text-[10px]">2</span>
                  <span>Con la información obtenida, el sistema autocompleta el formulario oficial.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="bg-purple-500/10 text-purple-500 font-bold px-1.5 py-0.5 rounded text-[10px]">3</span>
                  <span>Descarga tu planeación interdisciplinaria terminada.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Highlight Box */}
        <div className="glass-panel p-6 rounded-[2rem] bg-gradient-to-r from-blue-600/5 to-indigo-600/5 border border-blue-500/15 text-center max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="bg-blue-600/10 text-blue-500 p-3 rounded-full flex-shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed text-left">
            <strong>¡Flexibilidad total para el docente!</strong> Todas las planificaciones generadas en el portal son <strong>100% editables y listas para imprimir</strong> de manera sencilla. Realiza ajustes, añade notas o adapta las rúbricas antes de exportar.
          </p>
        </div>
      </section>

      {/* SECCIÓN: COMUNIDAD Y ENCUESTA DE INTERÉS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-12 border-t border-slate-200/40 dark:border-slate-800/20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LADO IZQUIERDO: Encuesta de Interés (5 columnas) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-[2rem] bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-transparent border border-slate-250 dark:border-slate-800 shadow-xl space-y-6">
              <div className="space-y-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[9px] font-black uppercase tracking-wider">
                  <BarChart3 className="w-3.5 h-3.5" />
                  Encuesta de la Comunidad
                </span>
                <h3 className="font-extrabold text-xl text-slate-850 dark:text-slate-100 leading-tight">
                  ¿Te interesaría adquirir una suscripción Premium en EduGen Panama PRO para planificar sin límites?
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Tu opinión nos ayuda a definir nuevas herramientas de planificación para los docentes de Panamá.
                </p>
              </div>

              {/* Contenido de la Encuesta */}
              {!hasVoted ? (
                <div className="space-y-3">
                  <button 
                    onClick={() => handleVote('opt1')}
                    disabled={submittingVote}
                    className="w-full text-left p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-850 hover:border-blue-500/35 dark:hover:border-blue-500/20 active:scale-[0.99] transition text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer flex justify-between items-center"
                  >
                    <span>Sí, definitivamente (Me ahorraría mucho tiempo)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button 
                    onClick={() => handleVote('opt2')}
                    disabled={submittingVote}
                    className="w-full text-left p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-850 hover:border-blue-500/35 dark:hover:border-blue-500/20 active:scale-[0.99] transition text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer flex justify-between items-center"
                  >
                    <span>Sí, pero me gustaría ver más características</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button 
                    onClick={() => handleVote('opt3')}
                    disabled={submittingVote}
                    className="w-full text-left p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-850 hover:border-blue-500/35 dark:hover:border-blue-500/20 active:scale-[0.99] transition text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer flex justify-between items-center"
                  >
                    <span>Tal vez en el futuro</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button 
                    onClick={() => handleVote('opt4')}
                    disabled={submittingVote}
                    className="w-full text-left p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-850 hover:border-blue-500/35 dark:hover:border-blue-500/20 active:scale-[0.99] transition text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer flex justify-between items-center"
                  >
                    <span>No por el momento</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in bg-white/40 dark:bg-slate-955/20 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-850/40">
                  <h4 className="text-xs font-black uppercase text-indigo-500 dark:text-indigo-400 tracking-wider">Resultados en tiempo real</h4>
                  
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                      <span>Sí, definitivamente</span>
                      <span className="text-indigo-500">{pollResults ? getPercentage(pollResults.opt1) : '45%'}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000"
                        style={{ width: pollResults ? getPercentage(pollResults.opt1) : '45%' }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                      <span>Sí, pero con más características</span>
                      <span className="text-indigo-500">{pollResults ? getPercentage(pollResults.opt2) : '28%'}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000"
                        style={{ width: pollResults ? getPercentage(pollResults.opt2) : '28%' }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                      <span>Tal vez en el futuro</span>
                      <span className="text-indigo-500">{pollResults ? getPercentage(pollResults.opt3) : '18%'}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000"
                        style={{ width: pollResults ? getPercentage(pollResults.opt3) : '18%' }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                      <span>No por el momento</span>
                      <span className="text-indigo-500">{pollResults ? getPercentage(pollResults.opt4) : '9%'}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000"
                        style={{ width: pollResults ? getPercentage(pollResults.opt4) : '9%' }}
                      ></div>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 dark:text-slate-500 text-center pt-2 border-t border-slate-200/50 dark:border-slate-800/40 mt-3 font-semibold">
                    Votos registrados: {pollResults?.total || 100} • ¡Gracias por votar!
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* LADO DERECHO: Comentarios interactivos (7 columnas) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-850 dark:text-slate-100 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-blue-600" />
                Muro de Comentarios Docentes
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Comparte tu experiencia, deja sugerencias o escribe tus preguntas sobre la metodología AOA y el uso de los planificadores didácticos.
              </p>
            </div>

            {/* Formulario de Comentarios */}
            <form onSubmit={handleCommentSubmit} className="glass-panel p-5 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-4">
              <h4 className="text-xs font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider flex items-center gap-1.5 font-display">
                <Plus className="w-4 h-4" /> Dejar un comentario
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Tu Nombre / Título</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      placeholder="Ej. Profa. Ana B."
                      value={commName}
                      onChange={(e) => setCommName(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-750 dark:text-slate-300 outline-none focus:ring-1 focus:ring-blue-500/30"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Escuela / C.E.B.G.</label>
                  <div className="relative">
                    <School className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      placeholder="Ej. C.E.B.G. Bilingüe"
                      value={commSchool}
                      onChange={(e) => setCommSchool(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-750 dark:text-slate-300 outline-none focus:ring-1 focus:ring-blue-500/30"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Región Educativa</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                    <select
                      required
                      value={commRegion}
                      onChange={(e) => setCommRegion(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-750 dark:text-slate-300 outline-none focus:ring-1 focus:ring-blue-500/30 appearance-none"
                    >
                      <option value="">Selecciona Región</option>
                      <option value="Bocas del Toro">Bocas del Toro</option>
                      <option value="Coclé">Coclé</option>
                      <option value="Colón">Colón</option>
                      <option value="Chiriquí">Chiriquí</option>
                      <option value="Darién">Darién</option>
                      <option value="Herrera">Herrera</option>
                      <option value="Los Santos">Los Santos</option>
                      <option value="Panamá Centro">Panamá Centro</option>
                      <option value="Panamá Este">Panamá Este</option>
                      <option value="Panamá Norte">Panamá Norte</option>
                      <option value="Panamá Oeste">Panamá Oeste</option>
                      <option value="San Miguelito">San Miguelito</option>
                      <option value="Veraguas">Veraguas</option>
                      <option value="Guna Yala">Guna Yala</option>
                      <option value="Ngäbe-Buglé">Ngäbe-Buglé</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Comentario / Mensaje</label>
                <textarea
                  required
                  rows="3"
                  maxLength="400"
                  placeholder="Escribe tu mensaje aquí (máx. 400 caracteres)..."
                  value={commText}
                  onChange={(e) => setCommText(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-750 dark:text-slate-300 outline-none focus:ring-1 focus:ring-blue-500/30 resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingComment}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-xl text-xs active:scale-95 transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/10 disabled:opacity-60"
                >
                  {submittingComment ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Enviar Comentario</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Listado de comentarios */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {loadingComments ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
                  Cargando comentarios...
                </div>
              ) : comments.length === 0 ? (
                <p className="text-center text-xs text-slate-450 italic py-6 bg-slate-50 dark:bg-slate-900/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  Aún no hay comentarios. ¡Sé el primero en dejar uno!
                </p>
              ) : (
                [...comments].reverse().map((comm) => (
                  <div 
                    key={comm.id}
                    className="glass-panel p-4.5 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-blue-500/15 dark:hover:border-blue-500/10 hover:scale-[1.005] transition-all duration-300 space-y-3 flex flex-col justify-between"
                  >
                    <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                      "{comm.text}"
                    </p>
                    <div className="flex items-center gap-3 border-t border-slate-200/40 dark:border-slate-800/40 pt-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-sm uppercase">
                        {comm.name ? comm.name.charAt(0) : 'D'}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-[11px] text-slate-800 dark:text-slate-100 leading-tight">
                          {comm.name}
                        </h4>
                        <p className="text-[9px] text-slate-450 dark:text-slate-500 font-semibold mt-0.5 leading-snug">
                          {comm.school} • <span className="text-blue-550 dark:text-blue-400 font-bold">{comm.region}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
        </div>
      </section>

      {/* CTA Final Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="p-8 md:p-12 rounded-[3rem] bg-gradient-to-r from-blue-600 to-indigo-700 text-white relative overflow-hidden space-y-6 shadow-2xl">
          {/* Decorative shapes */}
          <div className="absolute -right-24 -bottom-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-24 -top-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

          <h2 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight relative z-10">
            ¿Listo para acelerar tu labor pedagógica?
          </h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto leading-relaxed relative z-10">
            Únete a cientos de docentes en Panamá que ya planifican de manera inteligente con EduGen. Ahorra tiempo administrativo y enfócate en el aula.
          </p>
          <div className="pt-4 relative z-10">
            <button 
              onClick={onLoginClick}
              className="bg-white text-blue-900 px-8 py-3.5 rounded-2xl text-xs font-extrabold tracking-wide hover:bg-slate-50 transition active:scale-95 shadow-md flex items-center justify-center gap-2 mx-auto"
            >
              <span>Comenzar gratis hoy</span>
              <ArrowRight className="w-4 h-4 text-blue-900" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer Area */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 w-8 h-8 rounded-lg text-white flex items-center justify-center">
                <School className="w-4 h-4" />
              </div>
              <span className="font-extrabold font-display text-sm tracking-tight">EduGen Panama PRO</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto md:mx-0">
              Portal independiente de planeación curricular para la enseñanza del inglés, alineado al Enfoque Orientado a la Acción de MEDUCA.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Publicaciones y Guías</h4>
            <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
              <li><button onClick={() => setPublicTab('blog')} className="hover:text-blue-500 transition">Blog Educativo</button></li>
              <li><button onClick={() => setPublicTab('landing')} className="hover:text-blue-500 transition">Estándares del Currículo</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Enlaces Legales</h4>
            <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
              <li><button onClick={() => setPublicTab('privacy')} className="hover:text-blue-500 transition">Política de Privacidad</button></li>
              <li><button onClick={() => setPublicTab('terms')} className="hover:text-blue-500 transition">Términos de Servicio</button></li>
              <li><button onClick={() => setPublicTab('about')} className="hover:text-blue-500 transition">Quiénes Somos / Contacto</button></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-slate-200/50 dark:border-slate-800/20 text-center text-[10px] text-slate-400 dark:text-slate-500">
          <p>© {new Date().getFullYear()} EduGen Panama. Todos los derechos reservados. No afiliado oficialmente con el Ministerio de Educación de Panamá.</p>
        </div>
      </footer>

    </div>
  );
}
