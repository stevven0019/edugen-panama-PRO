import React from 'react';
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
  MessageSquare
} from 'lucide-react';
import AdBanner from '../components/AdBanner';

export default function PublicLanding({ onLoginClick, setPublicTab, setSelectedArticleId }) {
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

  const testimonials = [
    {
      name: 'Profa. María González',
      school: 'C.E.B.G. República de Panamá',
      region: 'Panamá Centro',
      quote: 'EduGen cambió completamente mi rutina semanal. Lo que antes me tomaba todo el fin de semana planificando formatos AOA, ahora lo estructuro en minutos. La alineación con los archivos oficiales es excelente.',
      avatar: 'M'
    },
    {
      name: 'Prof. Carlos Samudio',
      school: 'Colegio Félix Olivares Contreras',
      region: 'Chiriquí',
      quote: 'El generador trimestral (Theme Planner) me permite alinear automáticamente los niveles CEFR que MEDUCA exige para mis grupos de media y premedia. Es una herramienta indispensable hoy en día.',
      avatar: 'C'
    },
    {
      name: 'Profa. Yamileth Samaniego',
      school: 'Escuela Hipólito Pérez Tello',
      region: 'Herrera',
      quote: 'Los proyectos interdisciplinarios que genera vinculando inglés con Ciencias Naturales y Arte han sido un éxito total en mi escuela. Hacen que las clases cobren un sentido real para los estudiantes.',
      avatar: 'Y'
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

      {/* Panama Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold font-display tracking-tight flex items-center justify-center gap-2">
            <MessageSquare className="w-7 h-7 text-blue-600" />
            Lo que dicen los docentes en Panamá
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Testimonios reales de maestros y profesores del sistema escolar oficial y particular que ya utilizan nuestra plataforma.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, index) => (
            <div 
              key={index}
              className="glass-panel p-6 rounded-3xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-6"
            >
              <p className="text-xs text-slate-600 dark:text-slate-350 italic leading-relaxed">
                "{test.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                  {test.avatar}
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-100 leading-tight">{test.name}</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5 leading-snug">
                    {test.school} ({test.region})
                  </p>
                </div>
              </div>
            </div>
          ))}
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
