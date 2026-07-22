import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Download, 
  FileText, 
  GraduationCap, 
  Filter, 
  ArrowLeft, 
  CheckCircle,
  FileCode,
  Calendar,
  HardDrive,
  ExternalLink,
  Sparkles,
  School,
  Award,
  Rocket,
  Bookmark
} from 'lucide-react';
import { academicResources, academicCategories, academicGrades } from '../data/academicResources';
import AdBanner from '../components/AdBanner';

export default function AcademicLibrary({ setPublicTab, onLoginClick, isEmbedded = false }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos los Recursos');
  const [selectedGrade, setSelectedGrade] = useState('Todos los Grados');

  const filteredResources = academicResources.filter(res => {
    const matchesCategory = selectedCategory === 'Todos los Recursos' || res.category === selectedCategory;
    const matchesGrade = selectedGrade === 'Todos los Grados' || res.grade === selectedGrade || res.grade === 'Todos los Grados';
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          res.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          res.grade.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesGrade && matchesSearch;
  });

  const handleDownload = (res) => {
    window.open(res.downloadUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-50 to-slate-100 dark:from-blue-950/20 dark:via-slate-950 dark:to-slate-950 text-slate-800 dark:text-slate-200">
      
      {/* Navigation Header (Only if not embedded inside dashboard) */}
      {!isEmbedded && (
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
              <button onClick={() => setPublicTab('academic-library')} className="text-blue-600 dark:text-blue-400 font-extrabold transition">Biblioteca Académica</button>
              <button onClick={() => setPublicTab('blog')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">Blog Educativo</button>
              <button onClick={() => setPublicTab('about')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">Contacto</button>
            </div>

            <button 
              onClick={onLoginClick}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide active:scale-95 transition"
            >
              Ingresar al Portal
            </button>
          </div>
        </nav>
      )}

      {/* Main Content Area */}
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isEmbedded ? 'py-4' : 'py-12'} space-y-8`}>
        
        {/* Title Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[9px] font-black uppercase tracking-widest">
            <Award className="w-3.5 h-3.5" />
            <span>Documentación Oficial MEDUCA y Recursos Curriculares 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight leading-tight">
            Biblioteca Curricular Oficial de Inglés (Pre-K a 12º)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Descarga los programas oficiales de estudio por grado alineados a las competencias MEDUCA y los niveles internacionales del MCER.
          </p>
        </div>

        {/* Direct Google Drive Folder Banner */}
        <div className="glass-panel p-6 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden my-4 group">
          <div className="absolute -right-16 -bottom-16 w-56 h-56 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none"></div>
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 text-[9px] font-black uppercase tracking-widest">
              <BookOpen className="w-3.5 h-3.5" />
              <span>CARPETA GOOGLE DRIVE MEDUCA 2026</span>
            </div>
            <h3 className="text-xl font-extrabold font-display leading-tight">
              Carpeta Completa de Programas Curriculares (Pre-K a 12º)
            </h3>
            <p className="text-xs text-white/85 max-w-2xl leading-relaxed">
              Explora todos los expedientes, programas de estudio y guías didácticas oficiales guardados en la carpeta central de Google Drive.
            </p>
          </div>
          <a
            href="https://drive.google.com/drive/folders/1I3YDntCZsQN1cV1CTXQ-m-9LZycANtAx?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white hover:bg-slate-100 text-blue-950 font-black px-6 py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all flex-shrink-0 relative z-10 cursor-pointer"
          >
            <span>Abrir Carpeta en Google Drive</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Search and Filters Bar */}
        <div className="glass-panel p-5 rounded-3xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          
          {/* Top Row: Search input */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar programas por grado (ej. 6° Grado, Pre-Kinder, A2.1, CEFR...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl glass-input outline-none text-xs"
            />
          </div>

          {/* Bottom Row: Category & Grade Dropdowns / Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Category Select */}
            <div className="space-y-1">
              <label className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Filter className="w-3 h-3 text-blue-500" /> Categoría de Documento
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 outline-none"
              >
                {academicCategories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Grade Select */}
            <div className="space-y-1">
              <label className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-emerald-500" /> Nivel / Grado Académico
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 outline-none"
              >
                {academicGrades.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Resources Grid of Visual Covers */}
        {filteredResources.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl text-center border border-dashed border-slate-300 dark:border-slate-800 space-y-2">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">No se encontraron programas</h4>
            <p className="text-xs text-slate-500">Intenta cambiando el filtro de grado o la palabra clave.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResources.map((res) => (
              <div 
                key={res.id}
                className="glass-panel overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                {/* Visual Cover Header (Designed like Official Curriculum Books) */}
                <div className={`relative p-6 bg-gradient-to-br ${res.coverStyle || 'from-blue-600 to-indigo-800'} text-white flex flex-col justify-between min-h-[220px] overflow-hidden`}>
                  {/* Decorative Background Shapes */}
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="absolute top-2 right-2 opacity-15 pointer-events-none">
                    <School className="w-28 h-28" />
                  </div>

                  {/* Badges Top */}
                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <span className="bg-white/20 backdrop-blur-sm text-white border border-white/30 text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Bookmark className="w-3 h-3 text-amber-300" /> MEDUCA OFICIAL
                    </span>
                    <span className="bg-amber-400 text-slate-950 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md">
                      {res.levelCEFR || 'MCER'}
                    </span>
                  </div>

                  {/* Title & Grade in Book Cover Style */}
                  <div className="relative z-10 space-y-1 my-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-200 block">
                      {res.grade}
                    </span>
                    <h3 className="font-extrabold font-display text-xl sm:text-2xl leading-tight tracking-tight drop-shadow-sm">
                      English Curriculum
                    </h3>
                    <p className="text-[11px] text-white/90 font-bold tracking-wide">
                      Based on Competency Standards
                    </p>
                  </div>

                  {/* Bottom grade tag */}
                  <div className="relative z-10 flex items-center justify-between border-t border-white/20 pt-2 text-[9px] font-extrabold uppercase tracking-wider text-white/80">
                    <span>PANAMÁ 2026</span>
                    <span className="bg-white/15 px-2 py-0.5 rounded-md">{res.grade}</span>
                  </div>
                </div>

                {/* Card Description & Action Body */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-5">
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {res.description}
                  </p>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {res.grade === '6° Grado' ? 'PDF Directo Drive' : 'Acceso Drive'}
                    </div>

                    <button
                      onClick={() => handleDownload(res)}
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-95 transition cursor-pointer"
                    >
                      <span>Abrir PDF de {res.grade}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Ad Placement */}
        {!isEmbedded && (
          <div className="pt-6">
            <AdBanner type="footer" isPremium={false} />
          </div>
        )}

      </main>

      {/* Footer */}
      {!isEmbedded && (
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 py-10 mt-16">
          <div className="max-w-7xl mx-auto px-4 text-center space-y-4 text-[10px] text-slate-400 dark:text-slate-500">
            <div className="flex justify-center space-x-6 font-bold uppercase tracking-wider">
              <button onClick={() => setPublicTab('landing')} className="hover:text-blue-500">Inicio</button>
              <button onClick={() => setPublicTab('academic-library')} className="text-blue-500">Biblioteca Académica</button>
              <button onClick={() => setPublicTab('blog')} className="hover:text-blue-500">Blog</button>
              <button onClick={() => setPublicTab('privacy')} className="hover:text-blue-500">Privacidad</button>
            </div>
            <p>© {new Date().getFullYear()} EduGen Panama. Recursos y Documentación Oficial MEDUCA.</p>
          </div>
        </footer>
      )}

    </div>
  );
}
