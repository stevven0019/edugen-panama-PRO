import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Layers,
  BookOpen,
  FileText,
  Download,
  ExternalLink,
  Printer,
  Eye,
  Sparkles,
  CheckCircle,
  Calendar,
  ChevronRight,
  GraduationCap,
  Search,
  FolderOpen,
  X,
  Award,
  Palette,
  Loader2,
  FileCheck,
  Check,
  Lock
} from 'lucide-react';
import { classroomPosterHtml } from '../resources/classroomPoster';
import { linguisticPosterStudioHtml } from '../resources/linguisticPosterStudioHtml';
import { downloadThemePlannerDoc } from '../services/themePlannerGenerator';
import { getScenarioPosterLinks } from '../data/gradeDrivePosters';
import AdBanner from '../components/AdBanner';

const GRADES = [
  { id: 'Pre-K', label: 'Prekínder', folder: 'Prekinder', file: 'English_Curriculum_Prekinder.json', cefr: 'Pre-A1.1', band: 'Pre-A1' },
  { id: 'Kinder', label: 'Kínder', folder: 'Kinder', file: 'English_Curriculum_Kinder.json', cefr: 'Pre-A1.2', band: 'Pre-A1' },
  { id: '1st Grade', label: '1° Grado', folder: '1st Grade', file: 'English_Curriculum_Grade_1.json', cefr: 'Pre-A1.3', band: 'Pre-A1' },
  { id: '2nd Grade', label: '2° Grado', folder: '2nd Grade', file: 'English_Curriculum_Grade_2.json', cefr: 'Pre-A1.4', band: 'Pre-A1' },
  { id: '3rd Grade', label: '3° Grado', folder: '3rd Grade', file: 'English_Curriculum_Grade_3.json', cefr: 'A1.1', band: 'A1' },
  { id: '4th Grade', label: '4° Grado', folder: '4th Grade', file: 'English_Curriculum_Grade_4.json', cefr: 'A1.2', band: 'A1' },
  { id: '5th Grade', label: '5° Grado', folder: '5th Grade', file: 'English_Curriculum_Grade_5.json', cefr: 'A1.3', band: 'A1' },
  { id: '6th Grade', label: '6° Grado', folder: '6th Grade', file: 'English_Curriculum_Grade_6.json', cefr: 'A2.1', band: 'A2' },
  { id: '7th Grade', label: '7° Grado', folder: '7th Grade', file: 'English_Curriculum_Grade_7.json', cefr: 'A2.2', band: 'A2' },
  { id: '8th Grade', label: '8° Grado', folder: '8th Grade', file: 'English_Curriculum_Grade_8.json', cefr: 'A2.3', band: 'A2' },
  { id: '9th Grade', label: '9° Grado', folder: '9th Grade', file: 'English_Curriculum_Grade_9.json', cefr: 'A2.4', band: 'A2' },
  { id: '10th Grade', label: '10° Grado', folder: '10th Grade', file: 'English_Curriculum_Grade_10.json', cefr: 'B1.1', band: 'B1' },
  { id: '11th Grade', label: '11° Grado', folder: '11th Grade', file: 'English_Curriculum_Grade_11.json', cefr: 'B1.2', band: 'B1' },
  { id: '12th Grade', label: '12° Grado', folder: '12th Grade', file: 'English_Curriculum_Grade_12.json', cefr: 'B1.3', band: 'B1' },
];

export default function CurriculumHub({ user, credits, onTriggerAlert, isPremium = false, setActiveTab }) {
  const [selectedGradeId, setSelectedGradeId] = useState('4th Grade');
  const [loading, setLoading] = useState(false);
  const [scenarios, setScenarios] = useState([]);
  const [allGradeScenarios, setAllGradeScenarios] = useState([]);
  const [themeManifest, setThemeManifest] = useState([]);
  const [lessonManifest, setLessonManifest] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  // Scenario detail modal
  const [activeScenario, setActiveScenario] = useState(null);
  const [activeModalTab, setActiveModalTab] = useState('themes'); // 'themes' | 'lessons' | 'poster' | 'canva'
  const [selectedThemeForLessons, setSelectedThemeForLessons] = useState(1); // 1 or 2
  const [posterMode, setPosterMode] = useState('classroom'); // 'classroom' | 'linguistic'

  const posterIframeRef = useRef(null);

  const currentGradeConfig = GRADES.find(g => g.id === selectedGradeId) || GRADES[5];

  // Load manifests on initial mount
  useEffect(() => {
    fetch('/theme_planners_manifest.json')
      .then(res => res.json())
      .then(data => setThemeManifest(data))
      .catch(err => console.warn('Could not load theme manifest:', err));

    fetch('/lesson_plannings_manifest.json')
      .then(res => res.json())
      .then(data => setLessonManifest(data))
      .catch(err => console.warn('Could not load lesson manifest:', err));
  }, []);

  // Load scenarios when selected grade changes
  useEffect(() => {
    setLoading(true);
    fetch(`/curriculums/${currentGradeConfig.file}`)
      .then(res => {
        if (!res.ok) throw new Error('Currículo no disponible');
        return res.json();
      })
      .then(data => {
        const rawScenarios = data.scenarios || [];
        setAllGradeScenarios(rawScenarios);

        // Normalize scenarios
        const parsed = rawScenarios.map((sc, idx) => {
          const sNum = sc.scenarioNum || sc.scenario_number || sc.id || (idx + 1);
          const sTitle = sc.scenarioName || sc.scenario_title || sc.title || `Scenario ${sNum}`;
          
          let t1 = sc.theme1;
          let t2 = sc.theme2;
          if (sc.themes && Array.isArray(sc.themes)) {
            if (typeof sc.themes[0] === 'string') {
              if (!t1) t1 = sc.themes[0];
              if (!t2 && sc.themes[1]) t2 = sc.themes[1];
            } else if (typeof sc.themes[0] === 'object') {
              if (!t1) t1 = sc.themes[0]?.theme_title || sc.themes[0]?.title || sc.themes[0]?.name;
              if (!t2 && sc.themes[1]) t2 = sc.themes[1]?.theme_title || sc.themes[1]?.title || sc.themes[1]?.name;
            }
          }
          if (!t1) t1 = `${sTitle} - Foundation`;
          if (!t2) t2 = sTitle.includes('Colors') ? 'My Favorite Color!' : `${t1} - In Action`;

          const trimester = sNum <= 3 ? '1er Trimestre' : (sNum <= 6 ? '2do Trimestre' : '3er Trimestre');

          return {
            index: idx,
            scenarioNum: sNum,
            scenarioTitle: sTitle,
            theme1: t1,
            theme2: t2,
            trimester,
            raw: sc
          };
        });

        setScenarios(parsed);
      })
      .catch(err => {
        console.error('Failed to load curriculum:', err);
        if (onTriggerAlert) onTriggerAlert('No se pudo cargar el currículo del grado.', 'error');
      })
      .finally(() => setLoading(false));
  }, [selectedGradeId]);

  // Find theme planner paths for a scenario
  const getThemePlannerInfo = (scNum) => {
    const item = themeManifest.find(m => 
      (m.grade === currentGradeConfig.id || m.gradeFolder === currentGradeConfig.folder) && 
      Number(m.scenarioNum) === Number(scNum)
    );
    if (!item || !item.themes) return null;
    return item;
  };

  // Find lesson planner files for a scenario and theme
  const getLessonPlanners = (scTitle, themeNum, themeTitle) => {
    const cleanScTitle = scTitle.replace(/[\\/:*?"<>|]/g, '').trim().replace(/\.+$/, '');
    const cleanThemeTitle = (themeTitle || '').replace(/[\\/:*?"<>|]/g, '').trim().replace(/\.+$/, '');
    
    // Look for matching key in manifest
    const gradeFolder = currentGradeConfig.folder;
    const searchPattern = `${gradeFolder}/Scenario ${activeScenario?.scenarioNum} - ${cleanScTitle}/Theme ${themeNum}`;
    
    const matchedKey = Object.keys(lessonManifest).find(k => 
      k.toLowerCase().includes(searchPattern.toLowerCase()) ||
      (k.toLowerCase().includes(gradeFolder.toLowerCase()) && k.toLowerCase().includes(cleanScTitle.toLowerCase()) && k.toLowerCase().includes(`theme ${themeNum}`))
    );

    if (matchedKey && lessonManifest[matchedKey]) {
      return lessonManifest[matchedKey];
    }

    // Fallback: build default 5 lesson files structure
    return [1, 2, 3, 4, 5].map(lessonNum => {
      const lessonSkill = ['Listening', 'Reading', 'Speaking', 'Writing', 'Mediation & Project'][lessonNum - 1];
      const filename = `Planner AOA - ${cleanThemeTitle} (L${lessonNum}).doc`;
      const url = `/lesson_plannings/${encodeURIComponent(gradeFolder)}/Scenario%20${activeScenario?.scenarioNum}%20-%20${encodeURIComponent(cleanScTitle)}/Theme%20${themeNum}%20-%20${encodeURIComponent(cleanThemeTitle)}/${encodeURIComponent(filename)}`;
      return {
        filename,
        skill: lessonSkill,
        lessonNum,
        url
      };
    });
  };

  const downloadFile = (url, fallbackFilename) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = fallbackFilename || url.split('/').pop() || 'document.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (onTriggerAlert) onTriggerAlert(`Descargando ${fallbackFilename}...`, 'success');
  };

  const handlePrintPoster = () => {
    if (posterIframeRef.current?.contentWindow) {
      posterIframeRef.current.contentWindow.focus();
      posterIframeRef.current.contentWindow.print();
    }
  };

  const handleOpenPosterInTab = (htmlContent) => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  // Generate poster HTML for active scenario
  const getPosterHtml = () => {
    if (!activeScenario || !activeScenario.raw) return '';
    try {
      if (posterMode === 'classroom') {
        return classroomPosterHtml(activeScenario.raw, currentGradeConfig.id, activeScenario.index, currentGradeConfig.cefr);
      } else {
        return linguisticPosterStudioHtml(activeScenario.raw, currentGradeConfig.id, activeScenario.index, currentGradeConfig.cefr, allGradeScenarios);
      }
    } catch (e) {
      return `<div style="padding: 20px; font-family: sans-serif; color: #b91c1c;">Error al generar el póster: ${e.message}</div>`;
    }
  };

  const filteredScenarios = scenarios.filter(sc => 
    sc.scenarioTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sc.theme1.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sc.theme2.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `escenario ${sc.scenarioNum}`.includes(searchQuery.toLowerCase())
  );

  const handleDownloadTheme = (themeNumber) => {
    try {
      const filename = downloadThemePlannerDoc(
        activeScenario.raw,
        currentGradeConfig.id,
        currentGradeConfig.cefr,
        currentGradeConfig.hours || 5,
        activeScenario.trimester,
        themeNumber
      );
      if (onTriggerAlert) onTriggerAlert(`¡${filename} generado y descargado con éxito!`, 'success');
    } catch (err) {
      console.error('Error generating Theme Planner:', err);
      if (onTriggerAlert) onTriggerAlert('Error al generar el Theme Planner. Inténtalo de nuevo.', 'error');
    }
  };

  const downloadLessonDoc = async (url, filename) => {
    try {
      if (onTriggerAlert) onTriggerAlert(`Preparando descarga de ${filename}...`, 'info');
      const resp = await fetch(url);
      const contentType = resp.headers.get('content-type') || '';
      if (!resp.ok || contentType.includes('text/html')) {
        // If static fetch returns HTML or 404, fallback to download
        window.open(url, '_blank');
        return;
      }
      const blob = await resp.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      if (onTriggerAlert) onTriggerAlert(`¡${filename} descargado con éxito!`, 'success');
    } catch (e) {
      window.open(url, '_blank');
    }
  };

  // Lock Screen for Non-Premium Members
  if (!isPremium) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
        <div className="max-w-xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Exclusivo para Miembros EduGen PRO</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
              Hub Curricular por Grado AOA
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              El Hub Curricular con acceso a los <b>224 Theme Planners oficiales</b>, <b>1,116 Lesson Planners diarios</b>, <b>Pósters de Aula</b> y <b>Cuadernos Canva</b> de Pre-K a 12° Grado está reservado para docentes con membresía PRO activa.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 text-left space-y-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span><b>224 Theme Planners oficiales</b> en Word (.doc) con márgenes estrechos.</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span><b>1,116 Lesson Planners diarios</b> (Lecciones 1 al 5) por escenario y tema.</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span><b>Pósters didácticos de aula</b> interactivos listos para imprimir a color.</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span><b>Cuadernos de actividades Canva AOA</b> y exportación ilimitada.</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('show-billing-modal'))}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black py-3.5 px-6 rounded-2xl text-xs sm:text-sm shadow-xl shadow-amber-500/20 active:scale-95 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>DESBLOQUEAR ACCESO PRO ($19.99/año o $2.99/mes)</span>
            </button>
            <p className="text-[11px] text-slate-400">
              Activación inmediata con tarjeta de crédito o Yappy / Transferencia Panamá
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Hero / Header */}
      <div className="relative glass-panel p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-600/10 via-blue-600/10 to-indigo-600/10 border border-teal-500/20 shadow-sm overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/30 text-[10px] font-black uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>Plataforma Curricular Centralizada MEDUCA 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-slate-900 dark:text-white">
              Hub Curricular por Grado — Inglés AOA
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Selecciona tu grado para acceder de forma instantánea a los <b>8 escenarios oficiales</b>: descarga tus <b>Theme Planners</b> oficiales en Word, <b>Lesson Planners 1–5</b>, visualiza los <b>Pósters de Aula</b> interactivos y accede a los <b>Cuadernos Canva AOA</b>.
            </p>
          </div>

          <div className="flex-shrink-0 flex items-center gap-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Grado Activo</div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                {currentGradeConfig.label}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-500/30 font-black">
                  {currentGradeConfig.cefr}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grade Selector Carousel / Pills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-teal-600" />
            <span>Selecciona el Grado de Estudio:</span>
          </label>
          <span className="text-[11px] font-semibold text-slate-400">
            14 Niveles Oficiales (Pre-K a 12°)
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          {GRADES.map(grade => {
            const isSelected = selectedGradeId === grade.id;
            return (
              <button
                key={grade.id}
                onClick={() => setSelectedGradeId(grade.id)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex flex-col items-center gap-1 cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-r from-teal-600 to-blue-600 text-white border-transparent shadow-md shadow-teal-500/25 scale-105'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-500 hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
              >
                <span className="whitespace-nowrap">{grade.label}</span>
                <span className={`text-[9px] px-2 py-0.2 rounded-full font-black ${
                  isSelected 
                    ? 'bg-white/20 text-white' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}>
                  {grade.cefr}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grade Stats & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300 font-semibold">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-bold border border-teal-500/20">
            <CheckCircle className="w-3.5 h-3.5" /> 8 Escenarios
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold border border-blue-500/20">
            <Layers className="w-3.5 h-3.5" /> 16 Theme Planners
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-500/20">
            <BookOpen className="w-3.5 h-3.5" /> 80 Lesson Planners
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/20">
            <Palette className="w-3.5 h-3.5" /> 8 Pósters & Fichas AOA
          </span>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por escenario o tema..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Scenarios Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
          <p className="text-xs font-bold text-slate-500">Cargando escenarios y recursos para {currentGradeConfig.label}...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredScenarios.map((sc) => {
            const themeInfo = getThemePlannerInfo(sc.scenarioNum);
            return (
              <div
                key={sc.scenarioNum}
                className="group relative bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:border-teal-400 dark:hover:border-teal-500 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-500/20">
                      Escenario {sc.scenarioNum}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400">
                      {sc.trimester}
                    </span>
                  </div>

                  {/* Scenario Title */}
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-snug line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {sc.scenarioTitle}
                  </h3>

                  {/* Themes preview */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800/80 text-[11px]">
                    <div className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300">
                      <span className="text-blue-500 font-bold shrink-0">🎧 T1:</span>
                      <span className="font-semibold line-clamp-1">{sc.theme1}</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300">
                      <span className="text-emerald-500 font-bold shrink-0">💬 T2:</span>
                      <span className="font-semibold line-clamp-1">{sc.theme2}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setActiveScenario(sc);
                        setActiveModalTab('themes');
                      }}
                      className="px-2.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-700 dark:text-blue-300 text-[10px] font-black flex items-center justify-center gap-1 transition"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Themes 1-2</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveScenario(sc);
                        setActiveModalTab('lessons');
                      }}
                      className="px-2.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-[10px] font-black flex items-center justify-center gap-1 transition"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Lessons 1-5</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setActiveScenario(sc);
                        setActiveModalTab('poster');
                      }}
                      className="px-2.5 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 text-teal-700 dark:text-teal-300 text-[10px] font-black flex items-center justify-center gap-1 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Póster Aula</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveScenario(sc);
                        setActiveModalTab('canva');
                      }}
                      className="px-2.5 py-2 rounded-xl bg-violet-50 dark:bg-violet-950/40 hover:bg-violet-100 text-violet-700 dark:text-violet-300 text-[10px] font-black flex items-center justify-center gap-1 transition"
                    >
                      <Palette className="w-3.5 h-3.5" />
                      <span>Cuaderno AOA</span>
                    </button>
                  </div>

                  {/* Individual Exclusive Google Drive Poster Links */}
                  {(() => {
                    const scLinks = getScenarioPosterLinks(currentGradeConfig.id, sc.index + 1);
                    if (!scLinks?.pdf && !scLinks?.png) return null;
                    return (
                      <div className="pt-1.5 pb-0.5 px-1 flex items-center justify-between gap-1 border-t border-slate-100 dark:border-slate-800 text-[9px]">
                        <span className="font-extrabold text-slate-400 dark:text-slate-500">Póster en Drive:</span>
                        <div className="flex items-center gap-1.5">
                          {scLinks?.pdf && (
                            <a
                              href={scLinks.pdf.viewUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              title={`Abrir PDF exclusivo de ${sc.title} en Google Drive`}
                              className="px-2 py-0.5 rounded-lg bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-600 dark:text-red-400 font-black flex items-center gap-1 transition cursor-pointer"
                            >
                              <span>PDF</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                            </a>
                          )}
                          {scLinks?.png && (
                            <a
                              href={scLinks.png.viewUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              title={`Abrir imagen PNG 4K exclusiva de ${sc.title} en Google Drive`}
                              className="px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-600 dark:text-amber-400 font-black flex items-center gap-1 transition cursor-pointer"
                            >
                              <span>PNG</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  <button
                    onClick={() => {
                      setActiveScenario(sc);
                      setActiveModalTab('themes');
                    }}
                    className="w-full mt-1 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white py-2.5 rounded-xl font-bold text-xs transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span>Explorar Recursos del Escenario</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* INTERACTIVE SCENARIO RESOURCE MODAL */}
      {activeScenario && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-4xl max-h-[92vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-500/20">
                    {currentGradeConfig.label} ({currentGradeConfig.cefr})
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    Escenario {activeScenario.scenarioNum} · {activeScenario.trimester}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  {activeScenario.scenarioTitle}
                </h2>
              </div>

              <button
                onClick={() => setActiveScenario(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="px-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveModalTab('themes')}
                className={`py-3 px-4 font-extrabold text-xs border-b-2 flex items-center gap-2 transition ${
                  activeModalTab === 'themes'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>📘 Theme Planners (1 y 2)</span>
              </button>

              <button
                onClick={() => setActiveModalTab('lessons')}
                className={`py-3 px-4 font-extrabold text-xs border-b-2 flex items-center gap-2 transition ${
                  activeModalTab === 'lessons'
                    ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>📗 Lesson Planners (1 al 5)</span>
              </button>

              <button
                onClick={() => setActiveModalTab('poster')}
                className={`py-3 px-4 font-extrabold text-xs border-b-2 flex items-center gap-2 transition ${
                  activeModalTab === 'poster'
                    ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>🖼️ Póster de Aula (0 Tokens)</span>
              </button>

              <button
                onClick={() => setActiveModalTab('canva')}
                className={`py-3 px-4 font-extrabold text-xs border-b-2 flex items-center gap-2 transition ${
                  activeModalTab === 'canva'
                    ? 'border-violet-600 text-violet-600 dark:text-violet-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>🎨 Cuaderno AOA & Canva</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">

              {/* TAB 1: THEME PLANNERS */}
              {activeModalTab === 'themes' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200">
                    <p className="font-bold flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span>Formato Oficial MEDUCA de 6 Secciones con Márgenes Estrechos (0.4 in)</span>
                    </p>
                    <p className="text-[11px] opacity-90">
                      Ambos Theme Planners comparten las mismas competencias comunicativas oficiales (Gramática, Vocabulario y Fonética) del escenario, diferenciándose didácticamente en el enfoque receptivo (Theme 1) vs interactivo (Theme 2).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Theme 1 Card */}
                    <div className="p-5 rounded-2xl border-2 border-blue-500/30 bg-white dark:bg-slate-850 flex flex-col justify-between space-y-4 shadow-sm">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-[10px] font-black uppercase">
                          Theme 1 · Receptivo (Listening & Reading)
                        </div>
                        <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                          {activeScenario.theme1}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          Enfoque en descodificación auditiva y textual, comprensión de ideas principales con el Póster de Aula y respuestas de selección guiada.
                        </p>
                        <div className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                          ✓ Incluye las 6 secciones oficiales MEDUCA<br />
                          ✓ Objetivos SMART con meta de 80%–85%<br />
                          ✓ Secuencia de 5 lecciones AOA (Engage–Evaluate)
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                        <button
                          onClick={() => handleDownloadTheme(1)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          <span>Descargar Theme Planner 1 (.doc)</span>
                        </button>
                      </div>
                    </div>

                    {/* Theme 2 Card */}
                    <div className="p-5 rounded-2xl border-2 border-emerald-500/30 bg-white dark:bg-slate-850 flex flex-col justify-between space-y-4 shadow-sm">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase">
                          Theme 2 · Interactivo (Speaking & Writing)
                        </div>
                        <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                          {activeScenario.theme2}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          Enfoque en interacción oral en parejas, redacción de diálogos funcionales, negociación de significado y presentación del proyecto AOA.
                        </p>
                        <div className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                          ✓ Idénticas competencias lingüísticas (Grammar/Vocab)<br />
                          ✓ Rúbricas de fluidez y roleplay interactivo<br />
                          ✓ Culmina en presentación colaborativa AOA
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                        <button
                          onClick={() => handleDownloadTheme(2)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          <span>Descargar Theme Planner 2 (.doc)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: LESSON PLANNERS (1 to 5) */}
              {activeModalTab === 'lessons' && (
                <div className="space-y-6">
                  {/* Theme Switcher for Lessons */}
                  <div className="flex items-center gap-3 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                    <button
                      onClick={() => setSelectedThemeForLessons(1)}
                      className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${
                        selectedThemeForLessons === 1
                          ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span>🎧 Theme 1 (Receptivo):</span>
                      <span className="truncate max-w-[200px]">{activeScenario.theme1}</span>
                    </button>

                    <button
                      onClick={() => setSelectedThemeForLessons(2)}
                      className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${
                        selectedThemeForLessons === 2
                          ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span>💬 Theme 2 (Interactivo):</span>
                      <span className="truncate max-w-[200px]">{activeScenario.theme2}</span>
                    </button>
                  </div>

                  {/* 5 Lessons List */}
                  <div className="space-y-3">
                    {getLessonPlanners(
                      activeScenario.scenarioTitle,
                      selectedThemeForLessons,
                      selectedThemeForLessons === 1 ? activeScenario.theme1 : activeScenario.theme2
                    ).map((lesson, idx) => {
                      const lessonTitles = [
                        'Lesson 1: Listening Comprehension',
                        'Lesson 2: Reading & Textual Decoding',
                        'Lesson 3: Speaking & Pronunciation Practice',
                        'Lesson 4: Guided Writing & Sentence Frames',
                        'Lesson 5: Mediation & Culminating 21st-Century Project'
                      ];
                      const lessonTitle = lessonTitles[idx] || `Lesson ${idx + 1}`;

                      return (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4 hover:border-emerald-500 transition shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-extrabold flex items-center justify-center text-xs">
                              L{idx + 1}
                            </div>
                            <div>
                              <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                                {lessonTitle}
                              </h5>
                              <p className="text-[11px] text-slate-400 truncate max-w-md">
                                {lesson.filename || `Planner AOA - ${activeScenario.theme1} (L${idx + 1}).doc`}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => downloadLessonDoc(lesson.url, lesson.filename)}
                            className="bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-300 p-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Descargar .doc</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: CLASSROOM ANCHOR POSTER */}
              {activeModalTab === 'poster' && (
                <div className="space-y-4">
                  {/* Poster Mode Switcher */}
                  <div className="flex items-center justify-between flex-wrap gap-3 p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPosterMode('classroom')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                          posterMode === 'classroom'
                            ? 'bg-teal-600 text-white shadow-sm'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        🖼️ Lámina de Aula (AOA Classroom)
                      </button>
                      <button
                        onClick={() => setPosterMode('linguistic')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                          posterMode === 'linguistic'
                            ? 'bg-teal-600 text-white shadow-sm'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        📐 Estudio Lingüístico
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {(() => {
                        const scLinks = getScenarioPosterLinks(currentGradeConfig.id, activeScenario.index + 1);
                        return (
                          <>
                            {scLinks?.pdf && (
                              <a
                                href={scLinks.pdf.viewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                                title={`Abrir ${scLinks.pdf.filename} en Google Drive`}
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>PDF en Drive</span>
                                <ExternalLink className="w-3 h-3 opacity-90" />
                              </a>
                            )}

                            {scLinks?.png && (
                              <a
                                href={scLinks.png.viewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                                title={`Abrir ${scLinks.png.filename} (PNG 4K) en Google Drive`}
                              >
                                <Palette className="w-3.5 h-3.5" />
                                <span>PNG 4K</span>
                                <ExternalLink className="w-3 h-3 opacity-90" />
                              </a>
                            )}
                          </>
                        );
                      })()}

                      <button
                        onClick={handlePrintPoster}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shadow-sm"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Imprimir</span>
                      </button>

                      <button
                        onClick={() => handleOpenPosterInTab(getPosterHtml())}
                        className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Pantalla Completa</span>
                      </button>
                    </div>
                  </div>

                  {/* Individual Poster Notification Bar */}
                  {(() => {
                    const scLinks = getScenarioPosterLinks(currentGradeConfig.id, activeScenario.index + 1);
                    if (!scLinks) return null;
                    return (
                      <div className="flex items-center justify-between flex-wrap gap-2 px-3.5 py-2 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/40 dark:to-emerald-950/40 rounded-xl border border-teal-500/20 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-teal-800 dark:text-teal-300">Archivo Exclusivo del Escenario {activeScenario.index + 1}:</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">"{scLinks.title}"</span>
                        </div>
                        <div className="flex items-center gap-3">
                          {scLinks.pdf && (
                            <a
                              href={scLinks.pdf.viewUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-extrabold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                            >
                              <span>Ver {scLinks.pdf.filename}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Embedded Poster Iframe */}
                  <div className="w-full h-[520px] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white shadow-inner">
                    <iframe
                      ref={posterIframeRef}
                      title="Scenario Poster Preview"
                      srcDoc={getPosterHtml()}
                      className="w-full h-full border-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: CANVA & CUADERNO AOA */}
              {activeModalTab === 'canva' && (
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-600/10 via-purple-600/10 to-indigo-600/10 border border-violet-500/20 space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-300 text-[10px] font-black uppercase">
                      <Sparkles className="w-3 h-3 text-violet-600" />
                      <span>Integración Canva & Cuadernos Pedagógicos AOA</span>
                    </div>
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                      Cuaderno de Actividades por Fases AOA
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Cada lección cuenta con su paquete estructurado de fichas pedagógicas divididas en: <b>Engage</b> (activación auditiva/visual), <b>Explore</b> (ejercitación guiada) y <b>Extend/Evaluate</b> (producción personal y autoevaluación).
                    </p>
                  </div>

                  {/* Individual Scenario Exclusive Poster & Canva Resources */}
                  {(() => {
                    const scLinks = getScenarioPosterLinks(currentGradeConfig.id, activeScenario.index + 1);
                    return (
                      <div className="space-y-3">
                        {/* 1. Exclusive PDF Poster */}
                        {scLinks?.pdf && (
                          <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 shadow-sm hover:border-red-400/50 transition">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-extrabold flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="text-[10px] font-black uppercase tracking-wider text-red-600 dark:text-red-400">
                                  Póster Oficial en PDF · Escenario {activeScenario.index + 1}
                                </div>
                                <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                                  {scLinks.pdf.filename}
                                </h5>
                                <p className="text-[11px] text-slate-400">
                                  Formato vectorial de imprenta listo para imprimir o proyectar en pantalla
                                </p>
                              </div>
                            </div>

                            <a
                              href={scLinks.pdf.viewUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shrink-0 cursor-pointer shadow-sm"
                            >
                              <span>Abrir PDF</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        )}

                        {/* 2. Exclusive 4K PNG Graphic Poster */}
                        {scLinks?.png && (
                          <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 shadow-sm hover:border-amber-400/50 transition">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-extrabold flex items-center justify-center shrink-0">
                                <Palette className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                                  Lámina Gráfica 4K (PNG) · Escenario {activeScenario.index + 1}
                                </div>
                                <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                                  {scLinks.png.filename}
                                </h5>
                                <p className="text-[11px] text-slate-400">
                                  Imagen en ultra alta resolución con vocabulario clave, gramática y misiones
                                </p>
                              </div>
                            </div>

                            <a
                              href={scLinks.png.viewUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shrink-0 cursor-pointer shadow-sm"
                            >
                              <span>Ver PNG 4K</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        )}

                        {/* 3. Sample Canva Workbooks when Grade 4 */}
                        {currentGradeConfig.id === '4th Grade' && activeScenario.index === 0 && (
                          <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 shadow-sm hover:border-violet-400/50 transition">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 font-extrabold flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="text-[10px] font-black uppercase tracking-wider text-violet-600 dark:text-violet-400">
                                  Cuaderno Editorial Canva (7 Páginas)
                                </div>
                                <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                                  Canva 7-Pages Cohesive Workbook — 4th Grade
                                </h5>
                                <p className="text-[11px] text-slate-400">
                                  Fichas estructuradas de trabajo con diseño editorial para el Escenario 1
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={() => downloadFile('/Canva_7Pages_Cohesive_Workbook_Grade4.pdf', 'Canva_7Pages_Cohesive_Workbook_Grade4.pdf')}
                              className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shrink-0 cursor-pointer shadow-sm"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Descargar PDF</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
                    <Palette className="w-8 h-8 text-violet-600 mx-auto" />
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                      ¿Deseas personalizar las fichas con IA o generar nuevas hojas de trabajo?
                    </h5>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Puedes acceder al estudio completo del <b>Cuaderno de Actividades</b> para generar actividades fonéticas, sopas de letras o proyectos en parejas adaptados a este escenario.
                    </p>
                    <button
                      onClick={() => {
                        setActiveScenario(null);
                        if (setActiveTab) setActiveTab('activities');
                      }}
                      className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-md cursor-pointer"
                    >
                      Ir a Cuaderno de Actividades AOA
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Ad Banner for Free Users */}
      {!isPremium && <AdBanner className="mt-8" />}
    </div>
  );
}

