import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  ArrowLeft, 
  Clock, 
  User, 
  Calendar, 
  ArrowRight,
  Share2,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { blogArticles } from '../data/blogArticles';
import AdBanner from '../components/AdBanner';

// Custom lightweight Markdown/Text parser for zero-dependency rendering
function renderContent(text) {
  if (!text) return null;
  const blocks = text.split('\n\n');
  return blocks.map((block, idx) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // Headings
    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={idx} className="text-lg font-extrabold text-slate-800 dark:text-slate-100 mt-6 mb-3 font-display border-l-4 border-blue-500 pl-3 leading-tight">
          {parseInlines(trimmed.substring(4))}
        </h3>
      );
    }
    if (trimmed.startsWith('#### ')) {
      return (
        <h4 key={idx} className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-4 mb-2">
          {parseInlines(trimmed.substring(5))}
        </h4>
      );
    }

    // List items
    if (trimmed.startsWith('* ')) {
      const items = trimmed.split('\n');
      return (
        <ul key={idx} className="list-disc pl-5 my-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
          {items.map((item, i) => (
            <li key={i}>{parseInlines(item.replace(/^\*\s+/, ''))}</li>
          ))}
        </ul>
      );
    }

    // Regular paragraph
    return (
      <p key={idx} className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed text-justify mb-4">
        {parseInlines(trimmed)}
      </p>
    );
  });
}

// Simple parsing for bold **text** and highlights
function parseInlines(line) {
  const parts = line.split('**');
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return <strong key={i} className="font-extrabold text-slate-900 dark:text-slate-100">{part}</strong>;
    }
    return part;
  });
}

export default function Blog({ selectedArticleId, setSelectedArticleId, setPublicTab, onLoginClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [scrollProgress, setScrollProgress] = useState(0);

  // Sync scroll reading progress bar
  useEffect(() => {
    if (selectedArticleId === null) return;
    
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedArticleId]);

  // Reset scroll progress and scroll to top when changing articles
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setScrollProgress(0);
  }, [selectedArticleId]);

  const categories = [
    'Todos', 
    'Metodología AOA', 
    'MEDUCA', 
    'Estándares MCER', 
    'Proyectos', 
    'IA en Educación', 
    'Inclusión', 
    'Recursos'
  ];

  const filteredArticles = blogArticles.filter(art => {
    const matchesCategory = selectedCategory === 'Todos' || art.category === selectedCategory;
    const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          art.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          art.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeArticle = blogArticles.find(art => art.id === selectedArticleId);
  const relatedArticles = activeArticle 
    ? blogArticles.filter(art => art.category === activeArticle.category && art.id !== activeArticle.id).slice(0, 3)
    : [];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: activeArticle.title,
        text: activeArticle.summary,
        url: window.location.href
      }).catch(err => console.log(err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('¡Enlace de artículo copiado al portapapeles!');
    }
  };

  // ── Render Full Article View ──
  if (activeArticle) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
        
        {/* Scroll Progress Bar */}
        <div 
          className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 z-50 transition-all duration-100" 
          style={{ width: `${scrollProgress}%` }}
        ></div>

        {/* Public Header */}
        <nav className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/60 dark:border-slate-800/40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => {
              setSelectedArticleId(null);
              setPublicTab('landing');
            }}>
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 w-9 h-9 rounded-xl text-white flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-extrabold font-display text-sm tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                EduGen Panama
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSelectedArticleId(null)}
                className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-500 transition flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver al Blog</span>
              </button>
              <button 
                onClick={onLoginClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md active:scale-95 transition"
              >
                Ingresar
              </button>
            </div>
          </div>
        </nav>

        {/* Read Layout Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Article Core Content Pane */}
          <article className="lg:col-span-8 space-y-6">
            <button 
              onClick={() => setSelectedArticleId(null)}
              className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Regresar a publicaciones</span>
            </button>

            {/* Title Block */}
            <div className="space-y-4">
              <span className="inline-block text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                {activeArticle.category}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display leading-tight tracking-tight text-slate-900 dark:text-slate-50">
                {activeArticle.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200/60 dark:border-slate-800/40 pb-4">
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-slate-500" /> {activeArticle.author}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-500" /> {activeArticle.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-500" /> {activeArticle.readTime}</span>
                <button onClick={handleShare} className="ml-auto flex items-center gap-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500 px-2.5 py-1 rounded-lg transition">
                  <Share2 className="w-3 h-3" />
                  Compartir
                </button>
              </div>
            </div>

            {/* Cover image */}
            <div className="rounded-3xl overflow-hidden aspect-[21/9] bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <img src={activeArticle.coverImage} alt={activeArticle.title} className="w-full h-full object-cover" />
            </div>

            {/* Article Body */}
            <div className="prose prose-slate dark:prose-invert max-w-none pt-4">
              {renderContent(activeArticle.content)}
            </div>

            {/* Ad placement inside content */}
            <div className="py-6 border-t border-slate-200/60 dark:border-slate-800/40">
              <AdBanner type="footer" isPremium={false} />
            </div>

          </article>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Call to action card */}
            <div className="glass-panel p-6 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white space-y-4 shadow-xl relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-28 h-28 bg-white/10 rounded-full blur-2xl"></div>
              <div className="space-y-2 relative z-10">
                <h4 className="font-extrabold text-sm tracking-tight leading-tight">¿Eres docente en Panamá?</h4>
                <p className="text-[10px] text-white/80 leading-relaxed">
                  Crea planificaciones didácticas oficiales y proyectos AOA completos en menos de 2 minutos con EduGen.
                </p>
              </div>
              <button 
                onClick={onLoginClick}
                className="w-full bg-white text-blue-900 py-2.5 rounded-xl text-xs font-black tracking-wide text-center flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition"
              >
                <span>Planificar Gratis</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-900" />
              </button>
            </div>

            {/* Related articles */}
            {relatedArticles.length > 0 && (
              <div className="glass-panel p-5 rounded-3xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-4">
                <h4 className="font-extrabold font-display text-xs text-slate-800 dark:text-slate-200 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800/60 pb-2">
                  Artículos Relacionados
                </h4>
                <div className="space-y-3">
                  {relatedArticles.map(art => (
                    <div 
                      key={art.id}
                      onClick={() => setSelectedArticleId(art.id)}
                      className="group cursor-pointer space-y-1 block border-b border-slate-100 dark:border-slate-800/40 pb-2.5 last:border-b-0 last:pb-0"
                    >
                      <span className="text-[8px] font-bold text-blue-500 uppercase tracking-wider">{art.category}</span>
                      <h5 className="font-extrabold text-[11px] leading-tight text-slate-700 dark:text-slate-350 group-hover:text-blue-500 transition line-clamp-2">
                        {art.title}
                      </h5>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Banner Ad */}
            <AdBanner type="sidebar" isPremium={false} />

          </aside>
        </main>

        {/* Simple Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center space-y-4 text-[10px] text-slate-400 dark:text-slate-500">
            <div className="flex justify-center space-x-6">
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

  // ── Render Blog Grid List View ──
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-50 to-slate-100 dark:from-blue-950/20 dark:via-slate-950 dark:to-slate-950 text-slate-800 dark:text-slate-200">
      
      {/* Navigation Header */}
      <nav className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/60 dark:border-slate-800/40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setPublicTab('landing')}>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 w-9 h-9 rounded-xl text-white flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-extrabold font-display text-sm tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
              EduGen Panama
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            <button onClick={() => setPublicTab('landing')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">Inicio</button>
            <button onClick={() => setPublicTab('blog')} className="text-blue-600 dark:text-blue-400 transition">Blog Educativo</button>
            <button onClick={() => setPublicTab('about')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">Quiénes Somos / Contacto</button>
          </div>

          <button 
            onClick={onLoginClick}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide active:scale-95 transition"
          >
            Ingresar
          </button>
        </div>
      </nav>

      {/* Main Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        
        {/* Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-500 border border-blue-500/25 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>Recursos y Formación Docente</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight leading-tight">
            Blog de Planificación y Metodología AOA
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Explora guías detalladas, análisis del currículo MEDUCA, lineamientos del MCER y mejores prácticas para la enseñanza del inglés en Panamá.
          </p>
        </div>

        {/* Controls Layout (Search & Filters) */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/40 dark:bg-slate-900/30 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm">
            
            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar artículos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs outline-none bg-slate-100/60 dark:bg-slate-950/60 border border-slate-200/40 dark:border-slate-800/40 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Category Select (Visible on Mobile) */}
            <div className="sm:hidden w-full">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs outline-none bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Category filters list (Desktop) */}
            <div className="hidden sm:flex flex-wrap gap-2">
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition active:scale-95 ${
                    selectedCategory === c 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Articles Grid list */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12 space-y-2 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl">
            <p className="text-sm text-slate-400 dark:text-slate-500 font-bold">No se encontraron artículos</p>
            <p className="text-xs text-slate-500">Prueba cambiando la palabra clave o el filtro de categoría.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map(art => (
              <div 
                key={art.id}
                onClick={() => setSelectedArticleId(art.id)}
                className="glass-panel overflow-hidden group cursor-pointer hover:border-blue-500/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800"
              >
                {/* Image Cover */}
                <div className="relative overflow-hidden aspect-[16/10] bg-slate-100 dark:bg-slate-950 border-b border-slate-200/60 dark:border-slate-800/40">
                  <img src={art.coverImage} alt={art.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <span className="absolute top-3 left-3 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-600/90 text-white shadow-sm">
                    {art.category}
                  </span>
                </div>

                {/* Info Block */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 group-hover:text-blue-550 transition leading-tight line-clamp-2">
                      {art.title}
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {art.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[8px] text-slate-400 font-black uppercase tracking-wider border-t border-slate-100 dark:border-slate-800/40 pt-3">
                    <span className="truncate max-w-[120px]">{art.author}</span>
                    <span className="flex items-center gap-0.5 flex-shrink-0">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {art.readTime}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Ad Placement */}
        <AdBanner type="footer" isPremium={false} />

      </main>

      {/* Footer Area */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4 text-[10px] text-slate-400 dark:text-slate-500">
          <div className="flex justify-center space-x-6 font-bold uppercase tracking-wider">
            <button onClick={() => setPublicTab('landing')} className="hover:text-blue-500">Inicio</button>
            <button onClick={() => setPublicTab('blog')} className="hover:text-blue-500 text-blue-500">Blog</button>
            <button onClick={() => setPublicTab('about')} className="hover:text-blue-500">Quiénes Somos / Contacto</button>
            <button onClick={() => setPublicTab('privacy')} className="hover:text-blue-500">Privacidad</button>
          </div>
          <p>© {new Date().getFullYear()} EduGen Panama. Todos los derechos reservados.</p>
        </div>
      </footer>

    </div>
  );
}
