import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Mail, 
  Send, 
  MapPin, 
  Phone, 
  CheckCircle,
  School,
  ArrowLeft
} from 'lucide-react';
import AdBanner from '../components/AdBanner';

export default function LegalPages({ defaultTab = 'privacy', setPublicTab, onLoginClick }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  // Contact Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-50 to-slate-100 dark:from-blue-950/20 dark:via-slate-950 dark:to-slate-950 text-slate-800 dark:text-slate-200">
      
      {/* Navigation Header */}
      <nav className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/60 dark:border-slate-800/40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setPublicTab('landing')}>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 w-9 h-9 rounded-xl text-white flex items-center justify-center">
              <School className="w-5 h-5" />
            </div>
            <span className="font-extrabold font-display text-sm tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
              EduGen Panama
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            <button onClick={() => setPublicTab('landing')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">Inicio</button>
            <button onClick={() => setPublicTab('blog')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">Blog Educativo</button>
            <button onClick={() => setPublicTab('about')} className="text-blue-600 dark:text-blue-400 transition">Quiénes Somos / Contacto</button>
          </div>

          <button 
            onClick={onLoginClick}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide active:scale-95 transition"
          >
            Ingresar
          </button>
        </div>
      </nav>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Tab navigation Menu */}
        <aside className="lg:col-span-3 space-y-4">
          <button 
            onClick={() => setPublicTab('landing')}
            className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1.5 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al Inicio</span>
          </button>
          
          <div className="glass-panel p-3 rounded-2xl bg-white/40 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800/60 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible">
            <button 
              onClick={() => setActiveTab('privacy')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 flex-shrink-0 transition active:scale-98 ${
                activeTab === 'privacy' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Política de Privacidad</span>
            </button>
            <button 
              onClick={() => setActiveTab('terms')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 flex-shrink-0 transition active:scale-98 ${
                activeTab === 'terms' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Términos y Condiciones</span>
            </button>
            <button 
              onClick={() => setActiveTab('about')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 flex-shrink-0 transition active:scale-98 ${
                activeTab === 'about' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Quiénes Somos / Contacto</span>
            </button>
          </div>

          {/* Ad banner in sidebar */}
          <div className="hidden lg:block">
            <AdBanner type="sidebar" isPremium={false} />
          </div>
        </aside>

        {/* Right Detail Pane */}
        <section className="lg:col-span-9 glass-panel p-6 sm:p-10 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-xl min-h-[60vh]">
          
          {activeTab === 'privacy' && (
            <div className="space-y-6 text-xs text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 border-b border-slate-200/60 dark:border-slate-800/60 pb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-500" />
                Política de Privacidad
              </h2>
              <p>Última actualización: 8 de Junio, 2026.</p>
              
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-4">1. Recopilación de Información</h3>
              <p>
                En **EduGen Panama**, nos comprometemos a proteger su privacidad. Recopilamos información únicamente cuando se registra en nuestro portal docente o utiliza el sistema, incluyendo su dirección de correo electrónico, nombre de usuario y los parámetros didácticos que introduce en los planificadores didácticos.
              </p>

              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-4">2. Cookies y Tecnologías de Publicidad de Terceros (AdSense)</h3>
              <p>
                Este sitio utiliza **Google AdSense** para mostrar anuncios a los usuarios de la versión gratuita. Google, como proveedor externo, utiliza cookies para publicar anuncios en nuestro sitio. El uso de la cookie **DoubleClick (DART)** permite a Google y a sus socios mostrar anuncios basados en sus visitas a este y otros sitios web en Internet.
              </p>
              <p>
                Los usuarios pueden optar por no recibir la publicidad personalizada de Google visitando la página de configuración de anuncios de Google. Asimismo, sus navegadores le permiten inhabilitar el uso de cookies de terceros para la publicidad personalizada visitando **www.aboutads.info**.
              </p>

              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-4">3. Uso de la Información</h3>
              <p>
                La información de su perfil se utiliza únicamente para el control de créditos de generación de documentos, la personalización de las carátulas oficiales de planificación didáctica del MEDUCA y la sincronización entre dispositivos. No vendemos, intercambiamos ni transferimos sus datos personales a terceros sin su consentimiento explícito.
              </p>

              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-4">4. Seguridad de los Datos</h3>
              <p>
                Implementamos cifrado SSL estándar en todas las comunicaciones del portal y almacenamos la información en bases de datos seguras gestionadas a través de servicios de infraestructura líderes como Google Firebase.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-6 text-xs text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 border-b border-slate-200/60 dark:border-slate-800/60 pb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Términos y Condiciones de Uso
              </h2>
              <p>Última actualización: 8 de Junio, 2026.</p>

              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-4">1. Aceptación de los Términos</h3>
              <p>
                Al registrarse y hacer uso del portal **EduGen Panama**, usted acepta cumplir y estar sujeto a estos términos y condiciones. Si no está de acuerdo con alguna parte de estos términos, no debe acceder al servicio.
              </p>

              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-4">2. Uso de Créditos y Licencias</h3>
              <p>
                La plataforma ofrece un sistema de tokens/créditos para la generación automatizada de lecciones mediante IA. Cada cuenta gratuita tiene un límite de créditos asignado que se decrementa con cada uso. Los usuarios Premium (PRO) gozan de una navegación libre de anuncios y créditos extendidos. La recarga de tokens y la suscripción a planes son personales e intransferibles.
              </p>

              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-4">3. Descargo de Responsabilidad de Contenidos Generados</h3>
              <p>
                Los planes didácticos, secuencias de aprendizaje, rúbricas y materiales complementarios generados por el portal son producidos mediante técnicas de Inteligencia Artificial. **EduGen Panama no es afiliado oficial del Ministerio de Educación de Panamá (MEDUCA)**. 
              </p>
              <p>
                El docente de aula asume la plena responsabilidad de revisar, modificar y avalar el contenido generado para verificar que se ajuste a los objetivos específicos del centro escolar y a las mallas curriculares vigentes antes de presentarlos a supervisores de zona o directores.
              </p>

              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-4">4. Restricciones de Uso</h3>
              <p>
                Queda estrictamente prohibido utilizar técnicas de Web Scraping, minería de datos o ingeniería inversa en la plataforma. También se prohíbe el uso de scripts automatizados para la generación masiva de contenido de forma no autorizada.
              </p>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-8 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <div className="space-y-4 text-justify">
                <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 border-b border-slate-200/60 dark:border-slate-800/60 pb-3 flex items-center gap-2">
                  <School className="w-5 h-5 text-blue-500" />
                  Quiénes Somos
                </h2>
                <p>
                  **EduGen Panama** es un proyecto independiente impulsado por un equipo multidisciplinario de docentes de inglés panameños e ingenieros de software. Nuestro objetivo primordial es reducir la sobrecarga de papeleo administrativo que aqueja al magisterio docente, dotándoles de herramientas tecnológicas avanzadas adaptadas 100% a la realidad pedagógica y directrices de nuestro país.
                </p>
                <p>
                  Creemos firmemente en el poder del Enfoque Orientado a la Acción (AOA) y la educación bilingüe para dotar a los estudiantes de mejores oportunidades profesionales, y queremos facilitar que los maestros se enfoquen en lo verdaderamente importante: la interacción humana dentro del aula.
                </p>
              </div>

              {/* Contact Area */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-t border-slate-200/60 dark:border-slate-800/60 pt-8">
                
                {/* Form column */}
                <div className="md:col-span-7 space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Envíanos un Mensaje</h3>
                  
                  {sent ? (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-extrabold text-xs">¡Mensaje Enviado con Éxito!</h4>
                        <p className="text-[10px] mt-1 leading-snug">Gracias por escribirnos. Nuestro equipo de soporte responderá a tu correo electrónico en un lapso de 24 a 48 horas.</p>
                        <button onClick={() => setSent(false)} className="text-[10px] underline font-bold mt-2 hover:text-emerald-555">Enviar otro mensaje</button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase">Nombre Completo</label>
                          <input 
                            type="text" 
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Tu nombre" 
                            className="w-full px-3 py-2 rounded-xl glass-input text-[11px] outline-none" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase">Correo Electrónico</label>
                          <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="correo@ejemplo.com" 
                            className="w-full px-3 py-2 rounded-xl glass-input text-[11px] outline-none" 
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Asunto</label>
                        <input 
                          type="text"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="Motivo del contacto" 
                          className="w-full px-3 py-2 rounded-xl glass-input text-[11px] outline-none" 
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Mensaje</label>
                        <textarea 
                          rows="4" 
                          required
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Escribe tu duda, consulta o sugerencia sobre la plataforma..." 
                          className="w-full px-3 py-2 rounded-xl glass-input text-[11px] outline-none resize-none" 
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800/40 text-white px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide active:scale-95 transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer"
                      >
                        <span>{loading ? 'Enviando...' : 'Enviar Mensaje'}</span>
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  )}
                </div>

                {/* Direct info column */}
                <div className="md:col-span-5 space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Información Directa</h3>
                  <div className="space-y-3.5 pt-1 text-slate-500 dark:text-slate-400">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-extrabold text-[10px] text-slate-700 dark:text-slate-350">Ubicación</p>
                        <p className="text-[10px]">Ciudad de Panamá, República de Panamá</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Mail className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-extrabold text-[10px] text-slate-700 dark:text-slate-350">Soporte Correo</p>
                        <p className="text-[10px]">soporte@edugenpanama.com</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </section>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4 text-[10px] text-slate-400 dark:text-slate-500">
          <div className="flex justify-center space-x-6 font-bold uppercase tracking-wider">
            <button onClick={() => setPublicTab('landing')} className="hover:text-blue-500">Inicio</button>
            <button onClick={() => setPublicTab('blog')} className="hover:text-blue-500">Blog</button>
            <button onClick={() => setPublicTab('about')} className="hover:text-blue-500">Contacto</button>
          </div>
          <p>© {new Date().getFullYear()} EduGen Panama. Todos los derechos reservados.</p>
        </div>
      </footer>

    </div>
  );
}
