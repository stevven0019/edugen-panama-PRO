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
  FileText,
  Lightbulb,
  Award
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
  // Navigation & View Mode
  const [sourceMode, setSourceMode] = useState('curriculum'); // 'curriculum' | 'upload'
  const [isShowingAnswerKey, setIsShowingAnswerKey] = useState(false);

  // Exact Selectors from the User's Screenshot
  const [grade, setGrade] = useState('5th Grade');
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [themeType, setThemeType] = useState('receptive'); // 'receptive' (Theme 1) | 'interactive' (Theme 2)
  const [selectedSkill, setSelectedSkill] = useState('all_4'); // 'all_4' (4 core skills) | 'Listening' | 'Reading' | 'Speaking' | 'Writing' | 'Mediation'
  
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
  const [project21stText, setProject21stText] = useState('');
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
      skillFocus: 'all_4',
      nouns: ['paper', 'scissors', 'glue', 'pencil', 'desk'],
      verbs: ['cut', 'fold', 'paste', 'follow'],
      adjectives: ['careful', 'neat', 'first', 'next'],
      project21st: 'Students create a School Craft Exhibition and explain steps in simple English.',
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
    const proj21st = normalized.project21stCentury || sc.project21stCentury || '';

    setScenarioName(sName);
    setThemeTitle(tName);
    setProject21stText(proj21st);

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
      setProject21stText('Market Price Guide & Fruit Stall Simulation');
      setPlanInputText(`Grade: 4th Grade\nScenario: Shopping at the Market\nTheme: How Much Is the Pineapple?\nDialogue:\nSeller: "Hello! Welcome to the market!"\nBuyer: "Hello! How much is the pineapple?"\nSeller: "It's three dollars."\nBuyer: "Can I have an apple, please?"\nSeller: "They are one dollar each."\nBuyer: "Thank you!"`);
      buildTest({ customGrade: '4th Grade', customScenario: 'Shopping at the Market', customTheme: 'How Much Is the Pineapple?' });
    } else if (presetKey === 'kinder') {
      setGrade('Kinder');
      setScenarioName('Where Is It?');
      setThemeTitle('Where Is Your Book?');
      setCompNouns('book, desk, chair, bag, pencil, crayon');
      setCompVerbs('look, put, point, touch');
      setProject21stText('Classroom Realia Spatial Map & Helper Team');
      setPlanInputText(`Grade: Kindergarten\nScenario: Where Is It?\nTheme: Where Is Your Book?\nCommands:\n- Put your book on the desk!\n- Put your bag under your chair!\n- Touch your pencil!`);
      buildTest({ customGrade: 'Kinder', customScenario: 'Where Is It?', customTheme: 'Where Is Your Book?' });
    } else if (presetKey === 'canal') {
      setGrade('9th Grade');
      setScenarioName('Panama Canal Operations');
      setThemeTitle('Safe Transit at Miraflores Locks');
      setCompNouns('locks, tugboat, helmet, safety vest, cargo ship, pilot');
      setCompVerbs('operate, inspect, transit, wear');
      setProject21stText('Canal Safety Protocols Interactive Poster & Simulation');
      buildTest({ customGrade: '9th Grade', customScenario: 'Panama Canal Operations', customTheme: 'Safe Transit at Miraflores Locks' });
    } else if (presetKey === 'bocas') {
      setGrade('11th Grade');
      setScenarioName('Bocas del Toro Ecotourism');
      setThemeTitle('Protecting Marine Coral Reefs');
      setCompNouns('coral reef, starfish, boat captain, dolphin, tourist code');
      setCompVerbs('protect, conserve, avoid, respect');
      setProject21stText('Marine Conservation Code of Conduct for Tourists in Bocas');
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
      project21st: project21stText,
      testType: selectedSkill === 'Mediation' ? 'mediation_project' : testType,
      testScale,
      includeAudioScript,
      includeRubric
    });

    setTestData(generated);
  };

  const currentScenarioObj = curriculumState.scenarios[scenarioIndex];

  return (
    <div className="space-y-6 pb-12">
      {/* Scoped CSS for Perfect 2-Page Letter Printing */}
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
                AOA MEDUCA: Generador de Pruebas & Proyectos Siglo XXI
              </h1>
              <span className="bg-amber-400/20 text-amber-300 text-[11px] px-2.5 py-0.5 rounded-full font-bold border border-amber-400/30">
                4 Core Skills (Pruebas) · Mediación (Proyecto 21st)
              </span>
            </div>
            <p className="text-xs text-blue-200 mt-0.5">
              Listening · Reading · Writing · Speaking (Pruebas Escritas 2 Pág) · Lección 5 Mediación (Proyecto Colaborativo)
            </p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2.5">
          {!testData.isMediationProject && (
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
          )}
          
          <button 
            onClick={() => window.print()} 
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-md transition flex items-center gap-2 active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Evaluación / Guardar PDF</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start no-print">

        {/* LEFT COLUMN: THE EXACT SELECTOR CARD MATCHING THE SCREENSHOT */}
        <div className="lg:col-span-5 space-y-4">
          
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

            {/* Lección Selector (Focus on 4 core skills for tests, or 5th Mediation for 21st Century Project) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">Lección</label>
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

            {/* Note about Mediation being the 21st Century Project */}
            {selectedSkill === 'Mediation' && (
              <div className="bg-purple-950/60 border border-purple-800 rounded-xl p-2.5 text-xs text-purple-200 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Lección de Mediación:</strong> Generará la <em>Ficha de Proyecto del Siglo XXI y Rúbrica de Mediación</em> para trabajo colaborativo en equipo, tal como lo establece el marco curricular AOA de MEDUCA.
                </p>
              </div>
            )}

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
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Proyecto del Siglo XXI (Lección de Mediación):</label>
                    <input 
                      type="text" 
                      value={project21stText} 
                      onChange={e => setProject21stText(e.target.value)} 
                      placeholder="Nombre o descripción del proyecto..."
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
                  <option value="formative">Formativa (20 pts · 4 Skills)</option>
                  <option value="summative">Sumativa (30 pts · 4 Skills)</option>
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
              <span>
                {selectedSkill === 'Mediation' 
                  ? '⚡ Generar Proyecto Siglo XXI (Lección de Mediación)' 
                  : '⚡ Generar Prueba Oficial (Listening, Reading, Writing, Speaking)'}
              </span>
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
                  Área para Subir Archivos de Lección & Lesson Plans
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
                  Arrastra aquí el archivo de tu Lesson Plan o haz clic para subirlo
                </p>
                <p className="text-[10px] text-slate-500">
                  EduGen extraerá el diálogo, vocabulario y creará la prueba de las 4 skills o el proyecto de mediación
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
                Carga instantánea de lecciones curriculares modelo:
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
                placeholder="Pega aquí el contenido de la lección para sintetizar la evaluación..."
              />
            </div>

          </div>

          {/* Curriculum Structure Guide Bar */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-2xl p-3 space-y-1">
              <strong className="text-blue-950 dark:text-blue-200 font-black flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <span>Pruebas Escritas & Orales (2 Páginas Máx)</span>
              </strong>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Evalúan las <strong>4 Core Skills</strong>: Listening (guión docente), Reading (textos y realia), Writing (Word Bank) y Speaking (Role-play en parejas).
              </p>
            </div>

            <div className="bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 rounded-2xl p-3 space-y-1">
              <strong className="text-purple-950 dark:text-purple-200 font-black flex items-center gap-1.5">
                <Users2 className="w-4 h-4 text-purple-600" />
                <span>Lección de Mediación (Proyecto Siglo XXI)</span>
              </strong>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                La mediación se trabaja en clase mediante el <strong>Proyecto Colaborativo del Siglo XXI</strong> con trabajo en equipo, pensamiento crítico y empatía cultural.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* CASE A: MEDIATION 21ST CENTURY COLLABORATIVE PROJECT GUIDE     */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {testData.isMediationProject ? (
        <article className="test-paper-container bg-white text-slate-900 border-2 border-purple-300 rounded-2xl p-6 sm:p-9 shadow-sm max-w-4xl mx-auto space-y-5">
          
          <header className="border-b-2 border-purple-950 pb-3 space-y-1">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-0.5">
                <div className="text-[9.5px] font-black tracking-widest text-slate-500 uppercase">
                  {testData.header.institution}
                </div>
                <h2 className="text-lg sm:text-xl font-black text-purple-950 tracking-tight leading-tight">
                  {testData.header.title}
                </h2>
                <div className="text-xs font-bold text-purple-800">
                  {testData.header.theme}
                </div>
              </div>
              <div className="text-right shrink-0 bg-purple-50 border border-purple-200 rounded-xl p-2">
                <div className="text-xs font-black text-purple-900">{testData.meta.grade} · {testData.meta.cefr}</div>
                <div className="text-[10px] text-slate-500 font-bold">Lección 5 · Proyecto Colaborativo</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-purple-200 text-xs">
              <div><strong>Team / Student:</strong> ___________________________</div>
              <div><strong>Date:</strong> _________________</div>
              <div className="border-l border-purple-300 pl-2">
                <strong>Project Score:</strong> <span className="font-bold text-purple-950">_____ / 20 pts</span>
              </div>
            </div>
          </header>

          {/* Project Title & Overview */}
          <section className="bg-purple-50/80 border border-purple-200 rounded-xl p-3.5 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-purple-950 font-black text-sm">
              <Award className="w-5 h-5 text-purple-700" />
              <span>{testData.projectDetails.title}</span>
            </div>
            <p className="text-slate-700 text-[11.5px] leading-relaxed">
              {testData.projectDetails.description}
            </p>
          </section>

          {/* 4 Pillars of 21st Century Skills */}
          <section className="space-y-2">
            <h3 className="text-xs font-black uppercase text-purple-950">
              Pilares de Habilidades del Siglo XXI en Acción
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {testData.projectDetails.targetPillars.map((p, idx) => (
                <div key={idx} className="border border-purple-200 rounded-xl p-2.5 bg-slate-50 space-y-1">
                  <strong className="text-purple-900 block text-[11px]">{p.name}</strong>
                  <p className="text-[10.5px] text-slate-600 leading-tight">{p.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 4 Stages Guide for Students */}
          <section className="space-y-2">
            <h3 className="text-xs font-black uppercase text-purple-950">
              Guía de Etapas para el Equipo de Estudiantes
            </h3>
            <div className="space-y-1.5 text-xs">
              {testData.projectDetails.stages.map((st) => (
                <div key={st.step} className="p-2 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-purple-700 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {st.step}
                  </span>
                  <div>
                    <strong className="text-slate-800 text-[11px] block">{st.title}</strong>
                    <p className="text-[10.5px] text-slate-600">{st.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Project Evaluation Rubric */}
          <section className="space-y-2 pt-2 border-t border-purple-200">
            <h3 className="text-xs font-black uppercase text-purple-950">
              {testData.rubric.title}
            </h3>
            <table className="w-full text-xs border-collapse border border-purple-200 rounded-xl overflow-hidden">
              <thead className="bg-purple-100 text-purple-950 font-bold text-[10.5px]">
                <tr>
                  <th className="p-1.5 border border-purple-200 text-left">Criterio Observado</th>
                  <th className="p-1.5 border border-purple-200 text-center w-24">Excelente (5.0)</th>
                  <th className="p-1.5 border border-purple-200 text-center w-24">Bueno (4.0)</th>
                  <th className="p-1.5 border border-purple-200 text-center w-24">Regular (3.0)</th>
                  <th className="p-1.5 border border-purple-200 text-center w-16">Puntaje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-200 text-[11px]">
                {testData.rubric.criteria.map((cr, idx) => (
                  <tr key={idx}>
                    <td className="p-1.5">
                      <strong>{cr.name}:</strong> {cr.desc}
                    </td>
                    <td className="p-1.5 text-center text-slate-400">☐</td>
                    <td className="p-1.5 text-center text-slate-400">☐</td>
                    <td className="p-1.5 text-center text-slate-400">☐</td>
                    <td className="p-1.5 text-center font-mono font-bold text-purple-900">{cr.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Scale & Signatures */}
          <footer className="border-t-2 border-purple-300 pt-2 text-[10px] text-slate-600 space-y-1.5">
            <div className="flex flex-wrap justify-between items-center bg-purple-50 p-2 rounded-xl border border-purple-200 text-[10px]">
              <span className="font-black text-purple-950">📊 Escala Oficial MEDUCA:</span>
              <span><strong>5.0 (Excelente):</strong> 19 - 20 pts</span>
              <span><strong>4.0 (Bueno):</strong> 15 - 18 pts</span>
              <span><strong>3.0 (Regular):</strong> 12 - 14 pts</span>
              <span className="text-rose-700"><strong>Menos de 3.0:</strong> 0 - 11 pts</span>
            </div>
            <div className="flex justify-between text-[9.5px] text-slate-500 px-1 pt-1">
              <span>{testData.signatures.teacher}</span>
              <span>{testData.signatures.parent}</span>
            </div>
          </footer>

        </article>
      ) : (
        /* ══════════════════════════════════════════════════════════════ */
        /* CASE B: STANDARD 4 CORE SKILLS TEST (MAXIMUM 2 PAGES EXACT)  */
        /* ══════════════════════════════════════════════════════════════ */
        <article className="test-paper-container bg-white text-slate-900 border-2 border-slate-300 rounded-2xl p-6 sm:p-9 shadow-sm max-w-4xl mx-auto space-y-4">

          {/* ────────────────────────────────────────────────────────── */}
          {/* PAGE 1: HEADER, AUDIO SCRIPT, PART 1 & PART 2              */}
          {/* ────────────────────────────────────────────────────────── */}
          
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
                  Listening Prompt
                </span>
              </div>
              <div className="bg-white border border-amber-200 rounded-lg p-2 font-mono text-[10.5px] leading-relaxed text-slate-800 space-y-0.5">
                {testData.audioScript.lines.map((line, lIdx) => (
                  <p key={lIdx}>{line}</p>
                ))}
              </div>
            </section>
          )}

          {/* PART 1: LISTENING COMPREHENSION */}
          <section className="space-y-2 avoid-break">
            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-1">
              <h3 className="text-xs font-black uppercase text-blue-950 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-700 text-white flex items-center justify-center text-[10px]">1</span>
                {testData.part1Listening.title}
              </h3>
              <span className="text-[10px] font-bold text-slate-500">Core Skill: Listening</span>
            </div>
            <p className="text-xs text-slate-600">
              <strong>Instruction:</strong> {testData.part1Listening.instruction}
            </p>

            <div className="space-y-1 text-xs">
              {testData.part1Listening.items.map((item, qIdx) => (
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

          {/* PART 2: READING COMPREHENSION & REALIA LITERACY */}
          <section className="space-y-2 avoid-break">
            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-1">
              <h3 className="text-xs font-black uppercase text-emerald-950 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px]">2</span>
                {testData.part2Reading.title}
              </h3>
              <span className="text-[10px] font-bold text-slate-500">Core Skill: Reading</span>
            </div>
            <p className="text-xs text-slate-600">
              <strong>Instruction:</strong> {testData.part2Reading.instruction}
            </p>

            {/* Reading Stimulus Box */}
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-2 font-mono text-[11px] text-slate-800">
              <p className="whitespace-pre-line">{testData.part2Reading.passage}</p>
            </div>

            {/* Realia 5-item visual gallery with SVG Vector illustrations */}
            <div className="grid grid-cols-5 gap-1.5 text-center pt-1">
              {testData.part2Reading.gallery.map((gItem, gIdx) => (
                <div key={gIdx} className="border border-slate-200 rounded-xl p-1 bg-slate-50 space-y-0.5 flex flex-col items-center justify-center">
                  <div className="h-9 w-9 flex items-center justify-center">
                    {gItem.svgCode ? (
                      <div className="h-8 w-8 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: gItem.svgCode }} />
                    ) : gItem.photoUrl ? (
                      <img src={gItem.photoUrl} alt={gItem.name} className="h-8 w-8 object-cover rounded" />
                    ) : (
                      <div className="h-7 w-7 bg-blue-100 text-blue-900 font-bold rounded flex items-center justify-center text-xs">
                        {gItem.letter}
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] font-black text-slate-800 leading-none">
                    {gItem.letter}. {gItem.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Reading Statements */}
            <div className="space-y-1 text-[11px] pt-1">
              {testData.part2Reading.statements.map((st, sIdx) => (
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
            ── Salto a Página 2 (Writing & Speaking Core Skills) ──
          </div>

          {/* Mini Header for Page 2 Print */}
          <div className="hidden print:flex justify-between items-center text-[9px] border-b border-slate-300 pb-1 text-slate-500 font-semibold mb-2">
            <span>{testData.header.institution}</span>
            <span>{testData.header.title} · Page 2</span>
            <span>Student: _____________________</span>
          </div>

          {/* PART 3: WRITING PRODUCTION & WORD BANK */}
          <section className="space-y-2 avoid-break">
            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-1">
              <h3 className="text-xs font-black uppercase text-indigo-950 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-700 text-white flex items-center justify-center text-[10px]">3</span>
                {testData.part3Writing.title}
              </h3>
              <span className="text-[10px] font-bold text-slate-500">Core Skill: Writing</span>
            </div>
            <p className="text-xs text-slate-600">
              <strong>Instruction:</strong> {testData.part3Writing.instruction}
            </p>

            {/* Word Bank */}
            <div className="bg-indigo-50/80 border border-indigo-200 rounded-xl p-1.5 text-center text-[11px] font-bold text-indigo-950">
              WORD BANK: &nbsp; [ {testData.part3Writing.wordBank.join(' &nbsp; • &nbsp; ')} ]
            </div>

            <div className="space-y-1 text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono leading-relaxed">
              {testData.part3Writing.items.map((it, wIdx) => (
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

          {/* PART 4: SPEAKING PAIR INTERACTION */}
          <section className="space-y-2 avoid-break">
            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-1">
              <h3 className="text-xs font-black uppercase text-amber-950 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px]">4</span>
                {testData.part4Speaking.title}
              </h3>
              <span className="text-[10px] font-bold text-slate-500">Core Skill: Speaking</span>
            </div>
            <p className="text-xs text-slate-600">
              <strong>Instruction:</strong> {testData.part4Speaking.instruction}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="border border-blue-200 bg-blue-50/50 rounded-xl p-2">
                <strong className="text-blue-900 block mb-0.5 text-[11px]">{testData.part4Speaking.roleA.title}</strong>
                <p className="text-slate-700 text-[10.5px] leading-relaxed">
                  {testData.part4Speaking.roleA.instruction}
                </p>
              </div>
              <div className="border border-emerald-200 bg-emerald-50/50 rounded-xl p-2">
                <strong className="text-emerald-900 block mb-0.5 text-[11px]">{testData.part4Speaking.roleB.title}</strong>
                <p className="text-slate-700 text-[10.5px] leading-relaxed">
                  {testData.part4Speaking.roleB.instruction}
                </p>
              </div>
            </div>
          </section>

          {/* MEDUCA 4 CORE SKILLS OBSERVATION CHECKLIST */}
          {testData.rubric.show && (
            <section className="space-y-1.5 avoid-break pt-1">
              <table className="w-full text-xs border-collapse border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-800 font-bold text-[10px]">
                  <tr>
                    <th className="p-1 border border-slate-200 text-left">MEDUCA 4-Core Skills Criteria</th>
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
      )}

      {/* Footer Banner */}
      <AdBanner type="footer" isPremium={isPremium} />
    </div>
  );
}
