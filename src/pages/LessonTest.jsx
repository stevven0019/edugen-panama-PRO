import React, { useState, useEffect, useRef } from 'react';
import { 
  FileCheck, 
  Printer, 
  Key, 
  Eye, 
  EyeOff, 
  Upload, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  BookOpen,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Headphones,
  BookMarked,
  Mic,
  PenTool,
  Users2,
  FileText
} from 'lucide-react';
import { 
  GRADES_LIST, 
  SKILLS_LIST,
  getGradeMeta, 
  generateAssessmentTest 
} from '../services/testGenerator';
import { normalizeThemeScenario } from '../services/themeCurriculum';
import AdBanner from '../components/AdBanner';

export default function LessonTest({ 
  user, 
  credits, 
  onTriggerAlert, 
  isPremium = false, 
  downloadsLeft = 3,
  triggerInterstitialAd,
  triggerRewardedAd
}) {
  // Navigation mode
  const [sourceMode, setSourceMode] = useState('curriculum'); // 'curriculum' | 'upload'
  const [isShowingAnswerKey, setIsShowingAnswerKey] = useState(false);

  // Exact Selectors from the User's Specification
  const [grade, setGrade] = useState('5th Grade');
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [themeType, setThemeType] = useState('receptive'); // 'receptive' (Theme 1) | 'interactive' (Theme 2)
  const [selectedSkill, setSelectedSkill] = useState('all'); // 'all' | 'Listening' | 'Reading' | 'Speaking' | 'Writing' | 'Mediation'
  
  // Details accordion state
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Curriculum Data State
  const [curriculumState, setCurriculumState] = useState({
    grade: '5th Grade',
    scenarios: [],
    error: '',
    loading: false
  });

  // Detailed fields
  const [scenarioName, setScenarioName] = useState('');
  const [themeTitle, setThemeTitle] = useState('');
  const [compNouns, setCompNouns] = useState('notebook, paper, scissors, glue, desk');
  const [compVerbs, setCompVerbs] = useState('cut, fold, paste, write, listen');
  const [compAdj, setCompAdj] = useState('careful, neat, clean, creative');
  const [compNumbers, setCompNumbers] = useState('1 to 100 (USD / Balboas)');
  const [compInterr, setCompInterr] = useState('What step is next?, How much...?');

  // File Upload / Lesson Plan Input
  const [planInputText, setPlanInputText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Test configuration
  const [testType, setTestType] = useState('formative'); // 'formative' | 'summative' | 'quiz' | 'action_rubric'
  const [testScale, setTestScale] = useState('meduca'); // 'meduca' | 'points' | 'percentage'
  const [includeAudioScript, setIncludeAudioScript] = useState(true);
  const [includeRubric, setIncludeRubric] = useState(true);

  // Generated Test State
  const [testData, setTestData] = useState(() => 
    generateAssessmentTest({
      grade: '5th Grade',
      scenario: 'Following Instructions at School',
      theme: 'First, I Cut the Paper.',
      skillFocus: 'all',
      nouns: ['paper', 'scissors', 'glue', 'pencil', 'desk'],
      verbs: ['cut', 'fold', 'paste', 'follow'],
      adjectives: ['careful', 'neat', 'first', 'next'],
      testType: 'formative',
      testScale: 'meduca',
      includeAudioScript: true,
      includeRubric: true
    })
  );

  // Fetch official MEDUCA curriculum whenever grade changes
  useEffect(() => {
    const meta = getGradeMeta(grade);
    if (!meta) return;

    setCurriculumState(prev => ({ ...prev, loading: true, error: '' }));

    fetch(`/curriculums/${meta.file}`)
      .then(res => {
        if (!res.ok) throw new Error(`No se pudo cargar ${meta.file}`);
        return res.json();
      })
      .then(data => {
        const scs = Array.isArray(data.scenarios) ? data.scenarios : [];
        setCurriculumState({
          grade,
          scenarios: scs,
          error: '',
          loading: false
        });
        setScenarioIndex(0);
        if (scs.length > 0) {
          applyScenario(scs[0], themeType, grade);
        }
      })
      .catch(err => {
        setCurriculumState(prev => ({
          ...prev,
          loading: false,
          error: 'No se pudo conectar con el currículo oficial. Puedes ingresar los datos manualmente.'
        }));
      });
  }, [grade]);

  // Apply scenario data to fields
  const applyScenario = (sc, tType, currentGrade) => {
    if (!sc) return;
    const normalized = normalizeThemeScenario(sc, tType);
    const sName = normalized.scenarioName || sc.scenarioName || sc.title || `Escenario ${scenarioIndex + 1}`;
    const tName = tType === 'receptive' ? (normalized.theme1 || 'Theme 1') : (normalized.theme2 || 'Theme 2');

    setScenarioName(sName);
    setThemeTitle(tName);

    // Extract vocabulary
    const vocab = normalized.vocabulary || {};
    let nounsArr = vocab.nouns || vocab.noun || [];
    let verbsArr = vocab.verbs || vocab.verb || [];
    let adjArr = vocab.adjectives || vocab.adjective || [];

    if (typeof nounsArr === 'string') nounsArr = nounsArr.split(',').map(s => s.trim());
    if (typeof verbsArr === 'string') verbsArr = verbsArr.split(',').map(s => s.trim());
    if (typeof adjArr === 'string') adjArr = adjArr.split(',').map(s => s.trim());

    if (!Array.isArray(nounsArr) || nounsArr.length === 0) {
      if (typeof vocab === 'object' && !Array.isArray(vocab)) {
        nounsArr = Object.keys(vocab).slice(0, 8);
      }
    }

    setCompNouns(nounsArr.slice(0, 10).join(', '));
    setCompVerbs(verbsArr.slice(0, 6).join(', '));
    setCompAdj(adjArr.slice(0, 6).join(', '));

    const meta = getGradeMeta(currentGrade);
    if (meta.cefr.startsWith('Pre-A1')) {
      setCompNumbers('1 to 10 (Classroom objects)');
    } else if (meta.cefr.startsWith('A1')) {
      setCompNumbers('1 to 100 (USD / Balboas & Steps)');
    } else {
      setCompNumbers('1 to 1,000+ (Technical metrics & Currency)');
    }
  };

  const handleScenarioChange = (e) => {
    const idx = Number(e.target.value);
    setScenarioIndex(idx);
    if (curriculumState.scenarios[idx]) {
      applyScenario(curriculumState.scenarios[idx], themeType, grade);
    }
  };

  const handleThemeChange = (e) => {
    const tVal = e.target.value;
    setThemeType(tVal);
    if (curriculumState.scenarios[scenarioIndex]) {
      applyScenario(curriculumState.scenarios[scenarioIndex], tVal, grade);
    }
  };

  // Upload handler (supporting DOCX, TXT, PDF)
  const processUploadedFile = async (file) => {
    if (!file) return;
    setIsReadingFile(true);
    setUploadedFileName(file.name);

    try {
      let text = '';
      const ext = file.name.split('.').pop().toLowerCase();
      if (ext === 'docx') {
        const mammoth = await import('mammoth/mammoth.browser');
        const res = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
        text = res.value;
      } else {
        text = await file.text();
      }

      setPlanInputText(text);

      // Extract details if present
      const lower = text.toLowerCase();
      let detectedGrade = grade;
      if (/kinder|pre-?k/i.test(lower)) detectedGrade = 'Kinder';
      else if (/4th|4°|cuart/i.test(lower)) detectedGrade = '4th Grade';
      else if (/5th|5°|quint/i.test(lower)) detectedGrade = '5th Grade';
      else if (/7th|7°|s[eé]ptim/i.test(lower)) detectedGrade = '7th Grade';
      else if (/9th|9°|noven/i.test(lower)) detectedGrade = '9th Grade';
      else if (/11th|11°/i.test(lower)) detectedGrade = '11th Grade';

      setGrade(detectedGrade);
      buildTest({ customGrade: detectedGrade, customDialogue: text });
      if (onTriggerAlert) onTriggerAlert(`📄 Lección "${file.name}" cargada y sincronizada.`, "success");
    } catch (err) {
      console.error("Error reading file:", err);
      if (onTriggerAlert) onTriggerAlert("No se pudo procesar el archivo. Pega el texto directamente.", "error");
    } finally {
      setIsReadingFile(false);
    }
  };

  // Quick Preset Handlers
  const loadPreset = (presetKey) => {
    if (presetKey === 'pineapple') {
      setGrade('4th Grade');
      setScenarioName('Shopping at the Market');
      setThemeTitle('How Much Is the Pineapple?');
      setCompNouns('pineapple, apple, banana, mango, watermelon, market, dollar');
      setCompVerbs('buy, sell, ask, pay, cost');
      setPlanInputText(`Grade: 4th Grade\nScenario: Shopping at the Market\nTheme: How Much Is the Pineapple?\nDialogue:\nSeller: "Hello! Welcome to the market!"\nBuyer: "Hello! How much is the pineapple?"\nSeller: "It's three dollars."\nBuyer: "Can I have an apple, please?"\nSeller: "They are one dollar each."\nBuyer: "Thank you!"`);
      buildTest({ customGrade: '4th Grade', customScenario: 'Shopping at the Market', customTheme: 'How Much Is the Pineapple?' });
    } else if (presetKey === 'kinder') {
      setGrade('Kinder');
      setScenarioName('Where Is It?');
      setThemeTitle('Where Is Your Book?');
      setCompNouns('book, desk, chair, bag, pencil, crayon');
      setCompVerbs('look, put, point, touch');
      setPlanInputText(`Grade: Kindergarten\nScenario: Where Is It?\nTheme: Where Is Your Book?\nCommands:\n- Put your book on the desk!\n- Put your bag under your chair!\n- Touch your pencil!`);
      buildTest({ customGrade: 'Kinder', customScenario: 'Where Is It?', customTheme: 'Where Is Your Book?' });
    } else if (presetKey === 'canal') {
      setGrade('9th Grade');
      setScenarioName('Panama Canal Operations');
      setThemeTitle('Safe Transit at Miraflores Locks');
      setCompNouns('locks, tugboat, helmet, safety vest, cargo ship, pilot');
      setCompVerbs('operate, inspect, transit, wear');
      buildTest({ customGrade: '9th Grade', customScenario: 'Panama Canal Operations', customTheme: 'Safe Transit at Miraflores Locks' });
    } else if (presetKey === 'bocas') {
      setGrade('11th Grade');
      setScenarioName('Bocas del Toro Ecotourism');
      setThemeTitle('Protecting Marine Coral Reefs');
      setCompNouns('coral reef, starfish, boat captain, dolphin, tourist code');
      setCompVerbs('protect, conserve, avoid, respect');
      buildTest({ customGrade: '11th Grade', customScenario: 'Bocas del Toro Ecotourism', customTheme: 'Protecting Marine Coral Reefs' });
    }
  };

  // Main Generator Function
  const buildTest = (overrides = {}) => {
    const finalGrade = overrides.customGrade || grade;
    const finalScenario = overrides.customScenario || scenarioName || 'Curricular Scenario';
    const finalTheme = overrides.customTheme || themeTitle || 'Theme Focus';
    const finalDialogue = overrides.customDialogue || (sourceMode === 'upload' ? planInputText : '');

    const generated = generateAssessmentTest({
      grade: finalGrade,
      scenario: finalScenario,
      theme: finalTheme,
      skillFocus: selectedSkill,
      nouns: compNouns,
      verbs: compVerbs,
      adjectives: compAdj,
      interrogatives: compInterr,
      numbers: compNumbers,
      dialogueText: finalDialogue,
      testType,
      testScale,
      includeAudioScript,
      includeRubric
    });

    setTestData(generated);
  };

  const currentScenarioObj = curriculumState.scenarios[scenarioIndex];

  return (
    <div className="space-y-6 pb-12">
      {/* CSS Styles for 2-Page Letter Printing */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { 
            background: white !important; 
            color: black !important; 
            padding: 0 !important; 
            margin: 0 !important; 
            font-size: 10pt !important; 
          }
          .test-paper-container {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
          }
          .page-break { 
            page-break-before: always !important; 
            break-before: always !important; 
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .avoid-break { 
            break-inside: avoid !important; 
            page-break-inside: avoid !important; 
          }
          @page {
            margin: 9mm 12mm !important;
            size: letter portrait;
          }
          * { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
          }
        }
      `}</style>

      {/* Top Header Bar */}
      <header className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white shadow-lg rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 no-print border border-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-3xl" title="República de Panamá">🇵🇦</span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-400" />
                AOA MEDUCA: Generador de Pruebas & Evaluaciones
              </h1>
              <span className="bg-amber-400/20 text-amber-300 text-[11px] px-2.5 py-0.5 rounded-full font-bold border border-amber-400/30">
                5 Macro-Skills (2 Páginas Máx)
              </span>
            </div>
            <p className="text-xs text-blue-200 mt-0.5">
              Listening · Reading · Speaking · Writing · Mediation (CEFR 2020) · Clave Docente & Rúbrica
            </p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => setIsShowingAnswerKey(!isShowingAnswerKey)} 
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 shadow-xs ${
              isShowingAnswerKey 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            {isShowingAnswerKey ? <EyeOff className="w-4 h-4" /> : <Key className="w-4 h-4" />}
            <span>{isShowingAnswerKey ? 'Ocultar Clave Docente' : 'Ver Clave Docente'}</span>
          </button>
          
          <button 
            onClick={() => window.print()} 
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-md transition flex items-center gap-2 active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Prueba / Guardar PDF</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start no-print">

        {/* LEFT COLUMN: THE EXACT SELECTOR CARD SPECIFIED BY THE USER */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Exact Card matching the screenshot provided */}
          <div className="bg-[#0b132b] text-slate-100 rounded-3xl p-5 border border-slate-800 shadow-xl space-y-4">
            
            {/* Grado Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">Grado</label>
              <select 
                value={grade} 
                onChange={e => setGrade(e.target.value)} 
                className="w-full bg-[#1c2541] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 transition"
              >
                {GRADES_LIST.map(g => (
                  <option key={g.id} value={g.name}>{g.name}</option>
                ))}
              </select>
            </div>

            {/* Escenario Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">Escenario</label>
              <select 
                value={scenarioIndex} 
                onChange={handleScenarioChange}
                disabled={curriculumState.loading || curriculumState.scenarios.length === 0}
                className="w-full bg-[#1c2541] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 transition disabled:opacity-50"
              >
                {curriculumState.loading ? (
                  <option>Cargando currículo...</option>
                ) : curriculumState.scenarios.length === 0 ? (
                  <option>Sin escenarios disponibles</option>
                ) : (
                  curriculumState.scenarios.map((sc, idx) => (
                    <option key={idx} value={idx}>
                      {idx + 1}. {sc.scenarioName || sc.scenario_title || sc.title || `Escenario ${idx + 1}`}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Tema Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">Tema</label>
              <select 
                value={themeType} 
                onChange={handleThemeChange} 
                disabled={!currentScenarioObj}
                className="w-full bg-[#1c2541] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 transition disabled:opacity-50"
              >
                <option value="receptive">
                  Theme 1 — {currentScenarioObj ? (normalizeThemeScenario(currentScenarioObj, 'receptive').theme1 || 'Receptive Theme') : 'Theme 1'}
                </option>
                <option value="interactive">
                  Theme 2 — {currentScenarioObj ? (normalizeThemeScenario(currentScenarioObj, 'interactive').theme2 || 'Interactive Theme') : 'Theme 2'}
                </option>
              </select>
            </div>

            {/* Lección (5 Macro-Skills Focus) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">Lección (Macro-Habilidad)</label>
              <select 
                value={selectedSkill} 
                onChange={e => setSelectedSkill(e.target.value)} 
                className="w-full bg-[#1c2541] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 transition"
              >
                {SKILLS_LIST.map(sk => (
                  <option key={sk.id} value={sk.id}>{sk.label}</option>
                ))}
              </select>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pt-1">
              Los datos se completan con el currículo seleccionado. Puedes ajustar la habilidad y los detalles antes de generar.
            </p>

            {/* Collapsible: Ver o ajustar detalles */}
            <div className="border-t border-slate-800 pt-3">
              <button 
                type="button" 
                onClick={() => setDetailsOpen(!detailsOpen)} 
                className="flex items-center gap-1.5 text-xs font-bold text-white hover:text-blue-400 transition"
              >
                {detailsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <span>Ver o ajustar detalles</span>
              </button>

              {detailsOpen && (
                <div className="mt-3 space-y-3 p-3.5 bg-[#141d36] rounded-2xl border border-slate-800 text-xs">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Nombre del Escenario:</label>
                    <input 
                      type="text" 
                      value={scenarioName} 
                      onChange={e => setScenarioName(e.target.value)} 
                      className="w-full bg-[#0b132b] border border-slate-700 rounded-lg p-2 text-white text-xs" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Tema / Contenido:</label>
                    <input 
                      type="text" 
                      value={themeTitle} 
                      onChange={e => setThemeTitle(e.target.value)} 
                      className="w-full bg-[#0b132b] border border-slate-700 rounded-lg p-2 text-white text-xs" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Sustantivos (Nouns):</label>
                      <input 
                        type="text" 
                        value={compNouns} 
                        onChange={e => setCompNouns(e.target.value)} 
                        className="w-full bg-[#0b132b] border border-slate-700 rounded-lg p-2 text-white text-xs" 
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Verbos (Action):</label>
                      <input 
                        type="text" 
                        value={compVerbs} 
                        onChange={e => setCompVerbs(e.target.value)} 
                        className="w-full bg-[#0b132b] border border-slate-700 rounded-lg p-2 text-white text-xs" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Adjetivos (Adj):</label>
                      <input 
                        type="text" 
                        value={compAdj} 
                        onChange={e => setCompAdj(e.target.value)} 
                        className="w-full bg-[#0b132b] border border-slate-700 rounded-lg p-2 text-white text-xs" 
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Moneda / Números:</label>
                      <input 
                        type="text" 
                        value={compNumbers} 
                        onChange={e => setCompNumbers(e.target.value)} 
                        className="w-full bg-[#0b132b] border border-slate-700 rounded-lg p-2 text-white text-xs" 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Test Configuration Badges */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
              <div>
                <label className="block font-semibold text-slate-400 mb-1">Tipo de Evaluación:</label>
                <select 
                  value={testType} 
                  onChange={e => setTestType(e.target.value)} 
                  className="w-full bg-[#1c2541] border border-slate-700 text-white rounded-xl p-2 text-xs"
                >
                  <option value="formative">Formativa (20 pts · 5 Skills)</option>
                  <option value="summative">Sumativa (30 pts · 5 Skills)</option>
                  <option value="quiz">Quiz Rápido (10 pts)</option>
                  <option value="action_rubric">Rúbrica de Desempeño</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Escala de Calificación:</label>
                <select 
                  value={testScale} 
                  onChange={e => setTestScale(e.target.value)} 
                  className="w-full bg-[#1c2541] border border-slate-700 text-white rounded-xl p-2 text-xs"
                >
                  <option value="meduca">Escala MEDUCA (1.0 a 5.0)</option>
                  <option value="points">Puntos Puros ({testData.meta.totalPoints} pts)</option>
                  <option value="percentage">Porcentual (0-100%)</option>
                </select>
              </div>
            </div>

            {/* Trigger Button */}
            <button 
              onClick={() => buildTest()} 
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs rounded-2xl shadow-lg transition flex items-center justify-center gap-2 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>⚡ Generar Prueba Oficial (5 Skills)</span>
            </button>

          </div>
        </div>

        {/* RIGHT COLUMN: DEDICATED FILE UPLOAD & LESSON PRESETS AREA */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                  Área para Subir Archivos de Lesson Plan & Lecciones
                </h3>
              </div>
              <span className="text-[11px] bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold px-2 py-0.5 rounded-full">
                Soporta DOCX, TXT, PDF
              </span>
            </div>

            {/* Drag and Drop Zone */}
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                if (e.dataTransfer.files?.[0]) processUploadedFile(e.dataTransfer.files[0]);
              }}
              className={`border-2 border-dashed rounded-2xl p-4 text-center transition ${
                isDragOver 
                  ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40' 
                  : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40'
              }`}
            >
              <div className="space-y-1.5">
                <FileText className="w-8 h-8 mx-auto text-blue-600 dark:text-blue-400" />
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Arrastra aquí tu Lesson Plan o haz clic para seleccionarlo
                </p>
                <p className="text-[10px] text-slate-500">
                  EduGen extraerá el diálogo, vocabulario y creará el test enfocado en las 5 skills
                </p>
                {uploadedFileName && (
                  <span className="inline-block mt-1 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    ✓ {uploadedFileName}
                  </span>
                )}
              </div>
              <label className="cursor-pointer inline-block mt-3 py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-xs">
                <span>Examinar archivo...</span>
                <input type="file" accept=".docx,.txt,.doc" onChange={e => processUploadedFile(e.target.files?.[0])} className="hidden" />
              </label>
            </div>

            {/* Quick Preset Buttons */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                O carga una lección preconfigurada con 1 clic:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button 
                  onClick={() => loadPreset('pineapple')} 
                  className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 hover:bg-amber-100 text-amber-950 dark:text-amber-200 font-bold text-left transition"
                >
                  🍍 4to: Pineapple (Market)
                </button>
                <button 
                  onClick={() => loadPreset('kinder')} 
                  className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-800 hover:bg-blue-100 text-blue-950 dark:text-blue-200 font-bold text-left transition"
                >
                  📚 Kínder: Where Is Your Book?
                </button>
                <button 
                  onClick={() => loadPreset('canal')} 
                  className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-300 dark:border-indigo-800 hover:bg-indigo-100 text-indigo-950 dark:text-indigo-200 font-bold text-left transition"
                >
                  🚢 9no: Canal Operations
                </button>
                <button 
                  onClick={() => loadPreset('bocas')} 
                  className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 text-emerald-950 dark:text-emerald-200 font-bold text-left transition"
                >
                  🌿 11mo: Bocas Ecotourism
                </button>
              </div>
            </div>

            {/* Textarea for Direct Paste */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Texto de la Lección / Diálogo o Instrucciones:
              </label>
              <textarea 
                rows={3} 
                value={planInputText} 
                onChange={e => setPlanInputText(e.target.value)} 
                className="w-full p-2.5 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500" 
                placeholder="Pega aquí el contenido de la lección para sintetizar el examen..."
              />
            </div>

          </div>

          {/* 5-Skills Legend Indicators */}
          <div className="grid grid-cols-5 gap-2 text-center text-xs font-bold">
            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl p-2 text-blue-900 dark:text-blue-300 flex flex-col items-center gap-1">
              <Headphones className="w-4 h-4 text-blue-600" />
              <span>1. Listening</span>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-2 text-emerald-900 dark:text-emerald-300 flex flex-col items-center gap-1">
              <BookMarked className="w-4 h-4 text-emerald-600" />
              <span>2. Reading</span>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl p-2 text-indigo-900 dark:text-indigo-300 flex flex-col items-center gap-1">
              <PenTool className="w-4 h-4 text-indigo-600" />
              <span>3. Writing</span>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-2 text-amber-900 dark:text-amber-300 flex flex-col items-center gap-1">
              <Mic className="w-4 h-4 text-amber-600" />
              <span>4. Speaking</span>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-xl p-2 text-purple-900 dark:text-purple-300 flex flex-col items-center gap-1">
              <Users2 className="w-4 h-4 text-purple-600" />
              <span>5. Mediation</span>
            </div>
          </div>

        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* PRINTABLE TEST PAPER CONTAINER (STRICT 2-PAGE LETTER FORMAT)   */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <article className="test-paper-container bg-white text-slate-900 border-2 border-slate-300 rounded-2xl p-6 sm:p-9 shadow-sm max-w-4xl mx-auto space-y-4">

        {/* ────────────────────────────────────────────────────────── */}
        {/* PAGE 1: HEADER, AUDIO SCRIPT, SKILL 1 & SKILL 2            */}
        {/* ────────────────────────────────────────────────────────── */}
        
        {/* Official Header */}
        <header className="border-b-2 border-blue-950 pb-2.5 space-y-1.5">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-0.5">
              <div className="text-[9.5px] font-black tracking-widest text-slate-500 uppercase">
                {testData.header.institution}
              </div>
              <h2 className="text-lg sm:text-xl font-black text-blue-950 tracking-tight leading-tight">
                {testData.header.title}
              </h2>
              <div className="text-xs font-bold text-emerald-700">
                {testData.header.theme}
              </div>
            </div>
            <div className="text-right shrink-0 bg-slate-50 border border-slate-200 rounded-xl p-2">
              <div className="text-xs font-black text-blue-900">{testData.meta.grade} · {testData.meta.cefr}</div>
              <div className="text-[10px] text-slate-500 font-bold">{testData.meta.time}</div>
            </div>
          </div>

          {/* Student Credentials Table */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1.5 border-t border-slate-200 text-xs">
            <div className="sm:col-span-2">
              <strong>Student's Name:</strong> _____________________________________
            </div>
            <div>
              <strong>Date:</strong> _________________
            </div>
            <div className="border-l border-slate-300 pl-2">
              <strong>Score:</strong> <span className="font-bold text-blue-950">_____ / {testData.meta.totalPoints} pts</span>
              <span className="block text-[10px] text-slate-500 font-semibold">Grade (1.0 - 5.0): _____</span>
            </div>
          </div>
        </header>

        {/* TEACHER'S LISTENING AUDIO SCRIPT */}
        {testData.audioScript.show && (
          <section className="bg-amber-50/80 border border-amber-300 rounded-xl p-2.5 space-y-1 text-xs avoid-break">
            <div className="flex items-center justify-between text-amber-950 font-bold">
              <span className="uppercase tracking-wide flex items-center gap-1.5 text-[10.5px]">
                <span>📢</span> {testData.audioScript.instructions}
              </span>
              <span className="text-[9.5px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                Spoken Input
              </span>
            </div>
            <div className="bg-white border border-amber-200 rounded-lg p-2 font-mono text-[10.5px] leading-relaxed text-slate-800 space-y-0.5">
              {testData.audioScript.lines.map((line, lIdx) => (
                <p key={lIdx}>{line}</p>
              ))}
            </div>
          </section>
        )}

        {/* SKILL 1: LISTENING COMPREHENSION */}
        <section className="space-y-2 avoid-break">
          <div className="flex items-center justify-between border-b-2 border-slate-200 pb-1">
            <h3 className="text-xs font-black uppercase text-blue-950 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-700 text-white flex items-center justify-center text-[10px]">1</span>
              {testData.skill1Listening.title}
            </h3>
            <span className="text-[10px] font-bold text-slate-500">Macro-Skill 1</span>
          </div>
          <p className="text-xs text-slate-600">
            <strong>Instruction:</strong> {testData.skill1Listening.instruction}
          </p>

          <div className="space-y-1 text-xs">
            {testData.skill1Listening.items.map((item, qIdx) => (
              <div key={qIdx} className="p-1.5 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
                <p className="font-bold text-slate-800 text-[11px]">{item.q}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 pl-2 text-slate-700 text-[10.5px]">
                  {item.options.map((opt, oIdx) => {
                    const letter = oIdx === 0 ? 'a' : oIdx === 1 ? 'b' : 'c';
                    return (
                      <label key={oIdx} className={`cursor-pointer ${opt.key ? 'font-semibold text-blue-950' : ''}`}>
                        {letter}) {opt.text}
                        {opt.key && isShowingAnswerKey && (
                          <span className="ml-1 text-[9.5px] bg-emerald-100 text-emerald-800 px-1 rounded font-bold border border-emerald-300">
                            ✓ Clave
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SKILL 2: READING COMPREHENSION & REALIA LITERACY */}
        <section className="space-y-2 avoid-break">
          <div className="flex items-center justify-between border-b-2 border-slate-200 pb-1">
            <h3 className="text-xs font-black uppercase text-emerald-950 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px]">2</span>
              {testData.skill2Reading.title}
            </h3>
            <span className="text-[10px] font-bold text-slate-500">Macro-Skill 2</span>
          </div>
          <p className="text-xs text-slate-600">
            <strong>Instruction:</strong> {testData.skill2Reading.instruction}
          </p>

          {/* Reading Stimulus Box */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-2 font-mono text-[11px] text-slate-800">
            <p className="whitespace-pre-line">{testData.skill2Reading.passage}</p>
          </div>

          {/* Realia 4-item visual gallery */}
          <div className="grid grid-cols-4 gap-2 text-center pt-1">
            {testData.skill2Reading.gallery.map((gItem, gIdx) => (
              <div key={gIdx} className="border border-slate-200 rounded-xl p-1 bg-slate-50 space-y-0.5 flex flex-col items-center justify-center">
                <div className="h-10 w-10 flex items-center justify-center">
                  {gItem.svgCode ? (
                    <div className="h-9 w-9 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: gItem.svgCode }} />
                  ) : gItem.photoUrl ? (
                    <img src={gItem.photoUrl} alt={gItem.name} className="h-9 w-9 object-cover rounded" />
                  ) : (
                    <div className="h-8 w-8 bg-blue-100 text-blue-900 font-bold rounded flex items-center justify-center text-xs">
                      {gItem.letter}
                    </div>
                  )}
                </div>
                <span className="text-[9.5px] font-black text-slate-800 leading-none">
                  {gItem.letter}. {gItem.name}
                </span>
              </div>
            ))}
          </div>

          {/* Reading Statements */}
          <div className="space-y-1 text-[11px] pt-1">
            {testData.skill2Reading.statements.map((st, sIdx) => (
              <div key={sIdx} className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-2">
                <span><strong>{st.num}.</strong> {st.text}</span>
                <span className="font-mono text-slate-400">
                  {isShowingAnswerKey ? (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold border border-emerald-300">
                      [{st.key}]
                    </span>
                  ) : (
                    '____________'
                  )}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ────────────────────────────────────────────────────────── */}
        {/* PAGE BREAK (PAGE 2 BEGINS HERE)                            */}
        {/* ────────────────────────────────────────────────────────── */}
        <div className="page-break pt-3 border-t-2 border-dashed border-slate-300 my-3 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest no-print">
          ── Salto a Página 2 (Writing · Speaking · Mediation · Rúbrica) ──
        </div>

        {/* Mini Header for Page 2 Print */}
        <div className="hidden print:flex justify-between items-center text-[9px] border-b border-slate-300 pb-1 text-slate-500 font-semibold mb-2">
          <span>{testData.header.institution}</span>
          <span>{testData.header.title} · Page 2</span>
          <span>Student: _____________________</span>
        </div>

        {/* SKILL 3: WRITING PRODUCTION & WORD BANK */}
        <section className="space-y-2 avoid-break">
          <div className="flex items-center justify-between border-b-2 border-slate-200 pb-1">
            <h3 className="text-xs font-black uppercase text-indigo-950 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-700 text-white flex items-center justify-center text-[10px]">3</span>
              {testData.skill3Writing.title}
            </h3>
            <span className="text-[10px] font-bold text-slate-500">Macro-Skill 3</span>
          </div>
          <p className="text-xs text-slate-600">
            <strong>Instruction:</strong> {testData.skill3Writing.instruction}
          </p>

          {/* Word Bank */}
          <div className="bg-indigo-50/80 border border-indigo-200 rounded-xl p-1.5 text-center text-[11px] font-bold text-indigo-950">
            WORD BANK: &nbsp; [ {testData.skill3Writing.wordBank.join(' &nbsp; • &nbsp; ')} ]
          </div>

          <div className="space-y-1 text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono leading-relaxed">
            {testData.skill3Writing.items.map((it, wIdx) => (
              <p key={wIdx}>
                {it.prompt}
                {isShowingAnswerKey && (
                  <span className="ml-2 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200">
                    [{it.key}]
                  </span>
                )}
              </p>
            ))}
          </div>
        </section>

        {/* SKILL 4: SPEAKING · PAIR INTERACTION */}
        <section className="space-y-2 avoid-break">
          <div className="flex items-center justify-between border-b-2 border-slate-200 pb-1">
            <h3 className="text-xs font-black uppercase text-amber-950 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px]">4</span>
              {testData.skill4Speaking.title}
            </h3>
            <span className="text-[10px] font-bold text-slate-500">Macro-Skill 4</span>
          </div>
          <p className="text-xs text-slate-600">
            <strong>Instruction:</strong> {testData.skill4Speaking.instruction}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="border border-blue-200 bg-blue-50/50 rounded-xl p-2">
              <strong className="text-blue-900 block mb-0.5 text-[11px]">{testData.skill4Speaking.roleA.title}</strong>
              <p className="text-slate-700 text-[10.5px] leading-relaxed">
                {testData.skill4Speaking.roleA.instruction}
              </p>
            </div>
            <div className="border border-emerald-200 bg-emerald-50/50 rounded-xl p-2">
              <strong className="text-emerald-900 block mb-0.5 text-[11px]">{testData.skill4Speaking.roleB.title}</strong>
              <p className="text-slate-700 text-[10.5px] leading-relaxed">
                {testData.skill4Speaking.roleB.instruction}
              </p>
            </div>
          </div>
        </section>

        {/* SKILL 5: MEDIATION · INTERPERSONAL BRIDGE (CEFR 2020) */}
        <section className="space-y-2 avoid-break">
          <div className="flex items-center justify-between border-b-2 border-slate-200 pb-1">
            <h3 className="text-xs font-black uppercase text-purple-950 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-purple-700 text-white flex items-center justify-center text-[10px]">5</span>
              {testData.skill5Mediation.title}
            </h3>
            <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-1.5 py-0.5 rounded">
              CEFR 2020 Companion
            </span>
          </div>
          <p className="text-xs text-slate-600">
            <strong>Instruction:</strong> {testData.skill5Mediation.instruction}
          </p>

          <div className="border border-purple-200 bg-purple-50/50 rounded-xl p-2.5 text-xs space-y-1">
            <p className="text-purple-950 font-bold">
              <span>🤝 Situación: </span> {testData.skill5Mediation.challenge}
            </p>
            <p className="text-slate-700 text-[11px]">
              <span>🎯 Acción Mediadora: </span> {testData.skill5Mediation.task}
            </p>
            <div className="pt-1">
              <span className="font-semibold text-slate-800 text-[10.5px]">{testData.skill5Mediation.prompt}</span>
              <div className="mt-1 border-b border-dotted border-slate-400 h-4"></div>
            </div>
          </div>
        </section>

        {/* MEDUCA OBSERVATION CHECKLIST & CONVERSION SCALE */}
        {testData.rubric.show && (
          <section className="space-y-1.5 avoid-break pt-1">
            <table className="w-full text-xs border-collapse border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-800 font-bold text-[10px]">
                <tr>
                  <th className="p-1 border border-slate-200 text-left">MEDUCA 5-Skill Criteria</th>
                  <th className="p-1 border border-slate-200 text-center w-20">Achieved (1.0)</th>
                  <th className="p-1 border border-slate-200 text-center w-20">In Progress (0.5)</th>
                  <th className="p-1 border border-slate-200 text-center w-16">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-[10.5px]">
                {testData.rubric.criteria.map((cr, cIdx) => (
                  <tr key={cIdx}>
                    <td className="p-1"><strong>{cr.skill}:</strong> {cr.desc}</td>
                    <td className="p-1 text-center text-slate-400">☐</td>
                    <td className="p-1 text-center text-slate-400">☐</td>
                    <td className="p-1 text-center font-mono font-semibold">{cr.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* FOOTER SCALE & SIGNATURES */}
        <footer className="border-t-2 border-slate-300 pt-2 text-[10px] text-slate-600 space-y-1.5 avoid-break">
          <div className="flex flex-wrap justify-between items-center bg-slate-50 p-1.5 rounded-xl border border-slate-200 text-[9.5px]">
            <span className="font-black text-slate-900">📊 Escala Oficial MEDUCA:</span>
            <span><strong>5.0 (Excelente):</strong> {testData.meducaScale.min50} - {testData.meducaScale.max50} pts</span>
            <span><strong>4.0 (Bueno):</strong> {testData.meducaScale.min40} - {testData.meducaScale.max40} pts</span>
            <span><strong>3.0 (Regular):</strong> {testData.meducaScale.min30} - {testData.meducaScale.max30} pts</span>
            <span className="text-rose-700"><strong>Menos de 3.0:</strong> 0 - {testData.meducaScale.max29} pts</span>
          </div>
          <div className="flex justify-between text-[9.5px] text-slate-500 px-1">
            <span>{testData.signatures.teacher}</span>
            <span>{testData.signatures.parent}</span>
          </div>
        </footer>

      </article>

      {/* Footer Banner */}
      <AdBanner type="footer" isPremium={isPremium} />
    </div>
  );
}
