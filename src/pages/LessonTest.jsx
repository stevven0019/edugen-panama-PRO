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
  Download
} from 'lucide-react';
import { 
  GRADES_LIST, 
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
  const [sourceMode, setSourceMode] = useState('plan'); // 'plan' | 'competence'
  const [isShowingAnswerKey, setIsShowingAnswerKey] = useState(false);

  // Mode 1: Plan / File
  const [planInputText, setPlanInputText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isReadingFile, setIsReadingFile] = useState(false);

  // Mode 2: Competence & Official MEDUCA Curriculums
  const [selectedGrade, setSelectedGrade] = useState('4th Grade');
  const [curriculumData, setCurriculumData] = useState(null);
  const [scenariosList, setScenariosList] = useState([]);
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [themeType, setThemeType] = useState('receptive'); // 'receptive' | 'interactive'
  const [isLoadingCurriculum, setIsLoadingCurriculum] = useState(false);

  // Extracted/Editable competence fields
  const [compScenario, setCompScenario] = useState('Shopping at the Market (How Much Is the Pineapple?)');
  const [compTheme, setCompTheme] = useState('How Much Is the Pineapple?');
  const [compNumbers, setCompNumbers] = useState('1 to 100 (Prices in USD / Balboas)');
  const [compNouns, setCompNouns] = useState('pineapple, apple, banana, mango, watermelon, market, dollar');
  const [compVerbs, setCompVerbs] = useState('buy, sell, ask, pay, need, want, cost, help');
  const [compAdj, setCompAdj] = useState('fresh, cheap, expensive, delicious, ripe');
  const [compInterr, setCompInterr] = useState('How much...?, How many...?, please, thank you');

  // Test configuration
  const [testType, setTestType] = useState('formative'); // 'formative' | 'summative' | 'quiz' | 'action_rubric'
  const [testScale, setTestScale] = useState('meduca'); // 'meduca' | 'points' | 'percentage'
  const [includeAudioScript, setIncludeAudioScript] = useState(true);
  const [includeRubric, setIncludeRubric] = useState(true);

  // Generated Test State
  const [testData, setTestData] = useState(() => 
    generateAssessmentTest({
      grade: '4th Grade',
      scenario: 'Shopping at the Market',
      theme: 'How Much Is the Pineapple?',
      nouns: ['pineapple', 'apple', 'banana', 'mango', 'watermelon', 'market', 'dollar'],
      verbs: ['buy', 'sell', 'ask', 'pay', 'cost'],
      adjectives: ['fresh', 'cheap', 'ripe', 'delicious'],
      testType: 'formative',
      testScale: 'meduca',
      includeAudioScript: true,
      includeRubric: true
    })
  );

  // Load official curriculum JSON when grade changes in Mode 2
  useEffect(() => {
    const meta = getGradeMeta(selectedGrade);
    if (!meta) return;

    setIsLoadingCurriculum(true);
    fetch(`/curriculums/${meta.file}`)
      .then(res => {
        if (!res.ok) throw new Error(`Error loading ${meta.file}`);
        return res.json();
      })
      .then(data => {
        const scenarios = Array.isArray(data.scenarios) ? data.scenarios : [];
        setCurriculumData(data);
        setScenariosList(scenarios);
        setSelectedScenarioIndex(0);

        if (scenarios.length > 0) {
          applyScenarioData(scenarios[0], themeType, selectedGrade);
        }
      })
      .catch(err => {
        console.warn("Could not load curriculum file:", err);
      })
      .finally(() => {
        setIsLoadingCurriculum(false);
      });
  }, [selectedGrade]);

  // Extract scenario data into the editable fields
  const applyScenarioData = (sc, currentThemeType, currentGrade) => {
    if (!sc) return;
    const normalized = normalizeThemeScenario(sc, currentThemeType);
    const scenName = normalized.scenarioName || sc.scenarioName || sc.title || 'Curricular Scenario';
    const tTitle = currentThemeType === 'receptive' 
      ? (normalized.theme1 || 'Theme 1') 
      : (normalized.theme2 || 'Theme 2');

    setCompScenario(scenName);
    setCompTheme(tTitle);

    // Extract nouns, verbs, adjectives
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

    setCompNouns(nounsArr.slice(0, 12).join(', '));
    setCompVerbs(verbsArr.slice(0, 8).join(', '));
    setCompAdj(adjArr.slice(0, 8).join(', '));

    // Numbers & Currency based on grade
    const meta = getGradeMeta(currentGrade);
    if (meta.cefr.startsWith('Pre-A1')) {
      setCompNumbers('1 to 10 (Quantities & classroom items)');
    } else if (meta.cefr.startsWith('A1')) {
      setCompNumbers('1 to 100 (Prices in USD / Balboas)');
    } else {
      setCompNumbers('1 to 1,000+ (USD / Balboas & technical metrics)');
    }
  };

  const handleScenarioChange = (e) => {
    const idx = Number(e.target.value);
    setSelectedScenarioIndex(idx);
    if (scenariosList[idx]) {
      applyScenarioData(scenariosList[idx], themeType, selectedGrade);
    }
  };

  const handleThemeTypeChange = (newThemeType) => {
    setThemeType(newThemeType);
    if (scenariosList[selectedScenarioIndex]) {
      applyScenarioData(scenariosList[selectedScenarioIndex], newThemeType, selectedGrade);
    }
  };

  // Quick Preset Loaders
  const loadPresetPineapple = () => {
    setPlanInputText(`Grade: 4th Grade
Scenario: Shopping at the Market
Theme: How Much Is the Pineapple?
Skills Focus: Listening & Market Prices
Target Vocabulary: pineapple, apple, banana, mango, watermelon, market, how much, dollar, please, thank you.
Price range: $1.00 to $5.00 USD

Dialogue:
Seller: "Hello! Welcome to the market!"
Buyer: "Hello! How much is the pineapple?"
Seller: "It's three dollars."
Buyer: "Okay. And the apples?"
Seller: "They are one dollar each."
Buyer: "Can I have a banana, please?"
Seller: "Yes, here you go."
Buyer: "Thank you!"

Outcome: Comprehend basic facts about quantities, identify details about prices in talks, and follow shopping directions.`);
    
    setSelectedGrade('4th Grade');
    buildTestFromCurrentState('plan', `Grade: 4th Grade\nScenario: Shopping at the Market\nTheme: How Much Is the Pineapple?`);
    if (onTriggerAlert) onTriggerAlert("🍍 Lección de 4to Grado (Pineapple) cargada con éxito.", "success");
  };

  const loadPresetKinder = () => {
    setPlanInputText(`Grade: Kindergarten
Scenario: Where Is It?
Theme: Where Is Your Book?
Skills Focus: Receptive Listening & Non-Verbal Action (TPR)
Target Vocabulary: book, desk, chair, bag, pencil, crayon, on, under, in, next to.

Instructions & Actions:
- "Put your book under your chair!"
- "Place the pencil in your bag!"
- "Stand next to the desk!"
- "Show me the crayon on the floor!"`);

    setSelectedGrade('Kinder');
    buildTestFromCurrentState('plan', `Grade: Kindergarten\nScenario: Where Is It?\nTheme: Where Is Your Book?`);
    if (onTriggerAlert) onTriggerAlert("📚 Lección de Kínder (Where Is Your Book?) cargada con éxito.", "success");
  };

  const loadPresetCanal = () => {
    setPlanInputText(`Grade: 9th Grade
Scenario: Panama Canal Job Roles & Safety Protocols
Theme: Safe Transit Operations at Miraflores Locks
Skills Focus: Occupational English, Safety Equipment & Radio Communications
Target Vocabulary: locks, tugboat, helmet, safety vest, radio, cargo ship, pilot, inspection, transit.

Dialogue:
Officer: "Welcome to Miraflores Locks control station. What is your team assignment today?"
Technician: "Good morning! We need to inspect the safety tugboats and navigation signals before ship transit."
Officer: "Make sure all technicians wear their safety helmets and high-visibility vests."
Technician: "Understood. The cargo ship arrives at eight o'clock (8:00 AM) through the Pacific locks."
Officer: "Thank you for following the safety protocols. Have a safe operation!"`);

    setSelectedGrade('9th Grade');
    buildTestFromCurrentState('plan', `Grade: 9th Grade\nScenario: Panama Canal Job Roles`);
    if (onTriggerAlert) onTriggerAlert("🚢 Escenario de 9no Grado (Canal de Panamá) cargado con éxito.", "success");
  };

  const loadPresetBocas = () => {
    setPlanInputText(`Grade: 11th Grade
Scenario: Bocas del Toro Ecotourism & Marine Conservation
Theme: Protecting Coral Reefs and Marine Sanctuaries
Skills Focus: Environmental mediation, eco-tourist codes and guided interaction
Target Vocabulary: coral reef, starfish, boat captain, dolphin, plastic pollution, tourist code, sanctuary, guide.

Dialogue:
Guide: "Welcome to Bocas del Toro! Today we are visiting the marine sanctuary and coral reef."
Tourist: "Hello! How much is the boat tour to Starfish Beach, please?"
Guide: "The eco-friendly boat tour is twelve dollars ($12.00) per person, including life vests."
Tourist: "Great! Are we allowed to touch the starfish in the water?"
Guide: "No, please never remove or touch the starfish. We must protect our fragile marine ecosystem."
Tourist: "Understood. Here is twenty dollars ($20.00). Thank you for guiding us!"`);

    setSelectedGrade('11th Grade');
    buildTestFromCurrentState('plan', `Grade: 11th Grade\nScenario: Bocas del Toro Ecotourism`);
    if (onTriggerAlert) onTriggerAlert("🌿 Escenario de 11mo Grado (Bocas del Toro) cargado con éxito.", "success");
  };

  // Upload file handler
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsReadingFile(true);
    setUploadedFileName(file.name);

    try {
      let extractedText = '';
      const ext = file.name.split('.').pop().toLowerCase();

      if (ext === 'docx') {
        const mammoth = await import('mammoth/mammoth.browser');
        const res = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
        extractedText = res.value;
      } else {
        extractedText = await file.text();
      }

      setPlanInputText(extractedText);
      buildTestFromCurrentState('plan', extractedText);
      if (onTriggerAlert) onTriggerAlert(`📄 Archivo "${file.name}" cargado y procesado.`, "success");
    } catch (err) {
      console.error("File upload error:", err);
      if (onTriggerAlert) onTriggerAlert("No se pudo leer el archivo. Intenta con archivo TXT o pega el texto directamente.", "error");
    } finally {
      setIsReadingFile(false);
    }
  };

  // Main Generator Trigger
  const handleGenerateClick = () => {
    buildTestFromCurrentState(sourceMode);
    if (onTriggerAlert) onTriggerAlert("⚡ Prueba oficial generada y lista para imprimir o aplicar.", "success");
  };

  const buildTestFromCurrentState = (mode = sourceMode, explicitPlanText = null) => {
    if (mode === 'plan') {
      const textToUse = explicitPlanText !== null ? explicitPlanText : planInputText;
      const lower = textToUse.toLowerCase();

      let detectedGrade = selectedGrade;
      if (/kinder|pre-?k|inicial|early/i.test(lower)) detectedGrade = 'Kinder';
      else if (/1st|1°|primer/i.test(lower)) detectedGrade = '1st Grade';
      else if (/2nd|2°|segund/i.test(lower)) detectedGrade = '2nd Grade';
      else if (/3rd|3°|tercer/i.test(lower)) detectedGrade = '3rd Grade';
      else if (/4th|4°|cuart/i.test(lower)) detectedGrade = '4th Grade';
      else if (/5th|5°|quint/i.test(lower)) detectedGrade = '5th Grade';
      else if (/6th|6°|sext/i.test(lower)) detectedGrade = '6th Grade';
      else if (/7th|7°|s[eé]ptim/i.test(lower)) detectedGrade = '7th Grade';
      else if (/8th|8°|octav/i.test(lower)) detectedGrade = '8th Grade';
      else if (/9th|9°|noven/i.test(lower)) detectedGrade = '9th Grade';
      else if (/10th|10°|d[eé]cim/i.test(lower)) detectedGrade = '10th Grade';
      else if (/11th|11°|und[eé]cim/i.test(lower)) detectedGrade = '11th Grade';
      else if (/12th|12°|duod[eé]cim/i.test(lower)) detectedGrade = '12th Grade';

      // Detect scenario and theme from plan text
      const scenarioMatch = textToUse.match(/scenario:\s*([^\n\r]+)/i);
      const themeMatch = textToUse.match(/theme:\s*([^\n\r]+)/i);
      const vocabMatch = textToUse.match(/vocabulary:\s*([^\n\r]+)/i);

      const parsedScenario = scenarioMatch ? scenarioMatch[1].trim() : (lower.includes('pineapple') ? 'Shopping at the Market' : 'Classroom Learning Scenario');
      const parsedTheme = themeMatch ? themeMatch[1].trim() : (lower.includes('pineapple') ? 'How Much Is the Pineapple?' : 'Communicative Interaction');
      const parsedNouns = vocabMatch ? vocabMatch[1].split(',') : (lower.includes('pineapple') ? ['pineapple', 'apple', 'banana', 'mango', 'watermelon', 'market', 'dollar'] : ['book', 'desk', 'chair', 'bag', 'pencil']);

      const newTest = generateAssessmentTest({
        grade: detectedGrade,
        scenario: parsedScenario,
        theme: parsedTheme,
        nouns: parsedNouns,
        dialogueText: textToUse,
        testType,
        testScale,
        includeAudioScript,
        includeRubric
      });

      setTestData(newTest);
    } else {
      // Mode 2: Competence from inputs
      const newTest = generateAssessmentTest({
        grade: selectedGrade,
        scenario: compScenario,
        theme: compTheme,
        nouns: compNouns,
        verbs: compVerbs,
        adjectives: compAdj,
        interrogatives: compInterr,
        numbers: compNumbers,
        testType,
        testScale,
        includeAudioScript,
        includeRubric
      });

      setTestData(newTest);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

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
            font-size: 10.5pt !important; 
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
            margin: 10mm 12mm !important;
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
                Lesson Test Studio · AOA MEDUCA
              </h1>
              <span className="bg-amber-400/20 text-amber-300 text-[11px] px-2.5 py-0.5 rounded-full font-bold border border-amber-400/30">
                Oficial MEDUCA Panamá
              </span>
            </div>
            <p className="text-xs text-blue-200 mt-0.5">
              Generador de Evaluaciones Formativas, Sumativas y Quizzes de 2 Páginas por Escenario y Nivel CEFR
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
            onClick={handlePrint} 
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-md transition flex items-center gap-2 active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Prueba / Guardar PDF</span>
          </button>
        </div>
      </header>

      {/* Main Generator Configuration Panel */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-5 no-print">
        
        {/* Source Mode Selector Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs sm:text-sm font-semibold">
          <button 
            onClick={() => { setSourceMode('plan'); }} 
            className={`pb-3 transition flex items-center gap-2 border-b-2 ${
              sourceMode === 'plan' 
                ? 'border-blue-700 text-blue-900 dark:text-blue-400 font-black' 
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Modo 1: A partir de Archivo / Lesson Plan (Texto o Preset)</span>
          </button>
          
          <button 
            onClick={() => { setSourceMode('competence'); }} 
            className={`pb-3 transition flex items-center gap-2 border-b-2 ${
              sourceMode === 'competence' 
                ? 'border-blue-700 text-blue-900 dark:text-blue-400 font-black' 
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Modo 2: A partir de Escenarios y Grados Curriculares Oficiales MEDUCA</span>
          </button>
        </div>

        {/* MODE 1: LESSON PLAN / FILE INPUT */}
        {sourceMode === 'plan' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-xl p-3 text-xs">
              <div className="text-blue-950 dark:text-blue-200">
                <strong>Carga Rápida de Lecciones Preconfiguradas:</strong> Selecciona un ejemplo oficial o sube cualquier plan:
              </div>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={loadPresetPineapple} 
                  className="px-2.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold shadow-xs transition"
                >
                  🍍 4to Grado: "How Much Is the Pineapple?"
                </button>
                <button 
                  onClick={loadPresetKinder} 
                  className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-blue-900 dark:text-blue-300 border border-blue-300 dark:border-slate-600 rounded-lg font-bold transition"
                >
                  📚 Kínder: "Where Is Your Book?"
                </button>
                <button 
                  onClick={loadPresetCanal} 
                  className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-blue-900 dark:text-blue-300 border border-blue-300 dark:border-slate-600 rounded-lg font-bold transition"
                >
                  🚢 9no: Canal de Panamá
                </button>
                <button 
                  onClick={loadPresetBocas} 
                  className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-blue-900 dark:text-blue-300 border border-blue-300 dark:border-slate-600 rounded-lg font-bold transition"
                >
                  🌿 11mo: Bocas del Toro
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
              <div className="lg:col-span-3">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
                  Contenido o Resumen del Lesson Plan (Objetivos, Vocabulario, Diálogo o Instrucciones):
                </label>
                <textarea 
                  value={planInputText} 
                  onChange={(e) => setPlanInputText(e.target.value)} 
                  rows={5} 
                  className="w-full text-xs font-mono p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-600 leading-relaxed text-slate-800 dark:text-slate-100" 
                  placeholder="Pega aquí el texto del Lesson Plan, diálogo o notas de la clase..."
                />
              </div>

              <div className="flex flex-col justify-between border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-3.5 bg-slate-50/60 dark:bg-slate-800/40 text-center space-y-2">
                <div className="space-y-1">
                  <Upload className="w-6 h-6 mx-auto text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Subir Archivo de Lección</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Soporta DOCX o TXT de EduGen</span>
                </div>
                {uploadedFileName && (
                  <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold truncate block">
                    ✓ {uploadedFileName}
                  </span>
                )}
                <label className="cursor-pointer py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition inline-block">
                  <span>Examinar...</span>
                  <input type="file" accept=".docx,.txt,.doc" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: LINGUISTIC COMPETENCE (OFFICIAL CURRICULUM SELECTOR) */}
        {sourceMode === 'competence' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Grado Escolar (14 Niveles MEDUCA):
                </label>
                <select 
                  value={selectedGrade} 
                  onChange={(e) => setSelectedGrade(e.target.value)} 
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-100"
                >
                  {GRADES_LIST.map(g => (
                    <option key={g.id} value={g.name}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Escenario Curricular Oficial:
                </label>
                <select 
                  value={selectedScenarioIndex} 
                  onChange={handleScenarioChange} 
                  disabled={isLoadingCurriculum || scenariosList.length === 0}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-semibold text-slate-800 dark:text-slate-100 disabled:opacity-50"
                >
                  {scenariosList.length === 0 ? (
                    <option value="0">Cargando escenarios...</option>
                  ) : (
                    scenariosList.map((sc, idx) => (
                      <option key={idx} value={idx}>
                        Escenario {sc.scenarioNum || idx + 1}: {sc.scenarioName || sc.title || `Escenario ${idx + 1}`}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Enfoque del Tema (Theme):
                </label>
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => handleThemeTypeChange('receptive')} 
                    className={`flex-1 p-2 rounded-xl text-xs font-bold border transition ${
                      themeType === 'receptive' 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    1. Receptivo
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleThemeTypeChange('interactive')} 
                    className={`flex-1 p-2 rounded-xl text-xs font-bold border transition ${
                      themeType === 'interactive' 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    2. Interactivo
                  </button>
                </div>
              </div>
            </div>

            {/* Editable Competence Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-1">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Sustantivos (Nouns):</label>
                <input 
                  type="text" 
                  value={compNouns} 
                  onChange={(e) => setCompNouns(e.target.value)} 
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono" 
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Verbos de Acción (Verbs):</label>
                <input 
                  type="text" 
                  value={compVerbs} 
                  onChange={(e) => setCompVerbs(e.target.value)} 
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono" 
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Adjetivos (Adjectives):</label>
                <input 
                  type="text" 
                  value={compAdj} 
                  onChange={(e) => setCompAdj(e.target.value)} 
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono" 
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Rango Numérico & Moneda:</label>
                <input 
                  type="text" 
                  value={compNumbers} 
                  onChange={(e) => setCompNumbers(e.target.value)} 
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono" 
                />
              </div>
            </div>
          </div>
        )}

        {/* Test Customization Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Tipo de Evaluación:</label>
            <select 
              value={testType} 
              onChange={(e) => setTestType(e.target.value)} 
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-semibold text-slate-800 dark:text-slate-100"
            >
              <option value="formative">Prueba Formativa AOA (20 Pts · 4 Partes)</option>
              <option value="summative">Prueba Sumativa Parcial (30 Pts · Integral)</option>
              <option value="quiz">Quiz Rápido de Comprensión (10 Pts · 10 min)</option>
              <option value="action_rubric">Rúbrica de Desempeño Oral (Role-Play)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Escala de Calificación:</label>
            <select 
              value={testScale} 
              onChange={(e) => setTestScale(e.target.value)} 
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-semibold text-slate-800 dark:text-slate-100"
            >
              <option value="meduca">Escala Oficial MEDUCA (1.0 a 5.0)</option>
              <option value="points">Puntos Puros ({testData.meta.totalPoints} pts)</option>
              <option value="percentage">Porcentual (0% a 100%)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Secciones a Incluir:</label>
            <div className="flex items-center gap-3 pt-2 font-medium text-slate-700 dark:text-slate-300 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={includeAudioScript} 
                  onChange={(e) => setIncludeAudioScript(e.target.checked)} 
                  className="rounded text-blue-600" 
                /> 
                Guión Docente
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={includeRubric} 
                  onChange={(e) => setIncludeRubric(e.target.checked)} 
                  className="rounded text-blue-600" 
                /> 
                Rúbrica AOA
              </label>
            </div>
          </div>

          <div className="flex items-end">
            <button 
              onClick={handleGenerateClick} 
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generar Prueba Oficial</span>
            </button>
          </div>
        </div>
      </section>

      {/* PRINTABLE TEST PAPER CONTAINER (EXACT 2-PAGE LETTER LAYOUT) */}
      <article className="test-paper-container bg-white text-slate-900 border-2 border-slate-300 rounded-2xl p-6 sm:p-10 shadow-sm max-w-4xl mx-auto space-y-6">

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* PAGE 1 CONTENT: HEADER, AUDIO SCRIPT, PART 1 & PART 2        */}
        {/* ══════════════════════════════════════════════════════════════ */}
        
        {/* Institutional MEDUCA Test Header */}
        <header className="border-b-2 border-blue-950 pb-3 space-y-2">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1">
              <div className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                {testData.header.institution}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-blue-950 tracking-tight leading-tight">
                {testData.header.title}
              </h2>
              <div className="text-xs font-bold text-emerald-700">
                {testData.header.theme}
              </div>
            </div>
            <div className="text-right shrink-0 bg-slate-50 border border-slate-200 rounded-xl p-2.5">
              <div className="text-xs font-black text-blue-900">{testData.meta.grade} ({testData.meta.cefr})</div>
              <div className="text-[10px] text-slate-500 font-bold">{testData.meta.time}</div>
            </div>
          </div>

          {/* Student Credentials Table */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200 text-xs">
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

        {/* TEACHER'S LISTENING AUDIO SCRIPT (TOGGLEABLE) */}
        {testData.audioScript.show && (
          <section className="bg-amber-50/80 border border-amber-300 rounded-xl p-3 space-y-1.5 text-xs avoid-break">
            <div className="flex items-center justify-between text-amber-950 font-bold">
              <span className="uppercase tracking-wide flex items-center gap-1.5 text-[11px]">
                <span>📢</span> {testData.audioScript.instructions}
              </span>
              <span className="text-[10px] bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded font-bold">
                Listening Prompt
              </span>
            </div>
            <div className="bg-white border border-amber-200 rounded-lg p-2.5 font-mono text-[11px] leading-relaxed text-slate-800 space-y-1">
              {testData.audioScript.lines.map((line, lIdx) => (
                <p key={lIdx}>{line}</p>
              ))}
            </div>
          </section>
        )}

        {/* PART 1: LISTENING & IDENTIFICATION */}
        <section className="space-y-2.5 avoid-break">
          <div className="flex items-center justify-between border-b-2 border-slate-200 pb-1">
            <h3 className="text-xs font-black uppercase text-blue-950 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-700 text-white flex items-center justify-center text-[10px]">1</span>
              {testData.part1.title}
            </h3>
            <span className="text-[11px] font-bold text-slate-500">{testData.part1.subtitle}</span>
          </div>
          <p className="text-xs text-slate-600">
            <strong>Instruction:</strong> {testData.part1.instruction}
          </p>

          <div className="space-y-1.5 text-xs">
            {testData.part1.items.map((item, qIdx) => (
              <div key={qIdx} className="p-2 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <p className="font-bold text-slate-800">{item.q}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 pl-2 text-slate-700">
                  {item.options.map((opt, oIdx) => {
                    const letter = oIdx === 0 ? 'a' : oIdx === 1 ? 'b' : 'c';
                    return (
                      <label key={oIdx} className={`cursor-pointer ${opt.key ? 'font-semibold text-blue-950' : ''}`}>
                        {letter}) {opt.text}
                        {opt.key && isShowingAnswerKey && (
                          <span className="ml-1.5 text-[10px] bg-emerald-100 text-emerald-800 px-1 rounded font-bold border border-emerald-300">
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

        {/* PART 2: VOCABULARY REALIA WITH SVG ICONS */}
        <section className="space-y-2.5 avoid-break">
          <div className="flex items-center justify-between border-b-2 border-slate-200 pb-1">
            <h3 className="text-xs font-black uppercase text-blue-950 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-700 text-white flex items-center justify-center text-[10px]">2</span>
              {testData.part2.title}
            </h3>
            <span className="text-[11px] font-bold text-slate-500">{testData.part2.subtitle}</span>
          </div>
          <p className="text-xs text-slate-600">
            <strong>Instruction:</strong> {testData.part2.instruction}
          </p>

          {/* Realia Gallery with SVG vector illustrations */}
          <div className="grid grid-cols-5 gap-2 text-center">
            {testData.part2.gallery.map((gItem, gIdx) => (
              <div key={gIdx} className="border border-slate-200 rounded-xl p-1.5 bg-slate-50 space-y-1 flex flex-col items-center justify-center">
                <div className="w-full h-12 flex items-center justify-center">
                  {gItem.svgCode ? (
                    <div className="h-10 w-10 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: gItem.svgCode }} />
                  ) : gItem.photoUrl ? (
                    <img src={gItem.photoUrl} alt={gItem.name} className="h-10 w-10 object-cover rounded-md" />
                  ) : (
                    <div className="h-10 w-10 bg-blue-100 text-blue-900 font-bold flex items-center justify-center rounded text-xs">
                      {gItem.letter}
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-black text-slate-900 block leading-tight">
                  {gItem.letter}. {gItem.name}
                </span>
              </div>
            ))}
          </div>

          {/* Matching Table */}
          <table className="w-full text-xs border-collapse border border-slate-200 rounded-xl overflow-hidden mt-1">
            <thead className="bg-slate-100 text-slate-700 font-bold text-[11px]">
              <tr>
                <th className="p-1.5 border border-slate-200 w-14 text-center">Match</th>
                <th className="p-1.5 border border-slate-200 text-left">Curricular Description / Audio Dialogue Fact</th>
                <th className="p-1.5 border border-slate-200 w-28 text-center">Key Answer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-[11px]">
              {testData.part2.statements.map((st, sIdx) => (
                <tr key={sIdx}>
                  <td className="p-1.5 text-center font-bold font-mono text-slate-700">[ &nbsp; ]</td>
                  <td className="p-1.5">{st.num}. {st.statement}</td>
                  <td className="p-1.5 text-center font-bold font-mono">
                    {isShowingAnswerKey ? (
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
                        {st.keyLetter} ({st.keyWord})
                      </span>
                    ) : (
                      <span className="text-slate-300 font-normal">_______</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* PAGE BREAK FOR STRICT 2-PAGE LETTER PRINT FORMAT              */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <div className="page-break pt-4 border-t-4 border-double border-slate-200 my-4 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest no-print">
          ── Página 2 de Evaluación ──
        </div>

        {/* Page 2 Mini Header for Print */}
        <div className="hidden print:flex justify-between items-center text-[9.5px] border-b border-slate-300 pb-1 text-slate-500 font-semibold mb-2">
          <span>{testData.header.institution}</span>
          <span>{testData.header.title} · Page 2</span>
          <span>Student: _____________________</span>
        </div>

        {/* PART 3: COMMUNICATIVE DIALOGUE & SENTENCE COMPLETION */}
        <section className="space-y-2.5 avoid-break">
          <div className="flex items-center justify-between border-b-2 border-slate-200 pb-1">
            <h3 className="text-xs font-black uppercase text-blue-950 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-700 text-white flex items-center justify-center text-[10px]">3</span>
              {testData.part3.title}
            </h3>
            <span className="text-[11px] font-bold text-slate-500">{testData.part3.subtitle}</span>
          </div>
          <p className="text-xs text-slate-600">
            <strong>Instruction:</strong> {testData.part3.instruction}
          </p>

          {/* Word Bank */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-2 text-center text-xs font-bold text-blue-950">
            WORD BANK: &nbsp; [ {testData.part3.wordBank.join(' &nbsp; • &nbsp; ')} ]
          </div>

          <div className="space-y-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono leading-relaxed">
            {testData.part3.dialogue.map((dlg, dIdx) => (
              <p key={dIdx}>
                <strong>{dlg.speaker}:</strong> "{dlg.text}"
                {isShowingAnswerKey && (
                  <span className="ml-2 text-[11px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    [{dlg.key}]
                  </span>
                )}
              </p>
            ))}
          </div>
        </section>

        {/* PART 4: AOA ACTION TASK & OBSERVATION RUBRIC */}
        {testData.part4.show && (
          <section className="space-y-2.5 avoid-break">
            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-1">
              <h3 className="text-xs font-black uppercase text-amber-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px]">4</span>
                {testData.part4.title}
              </h3>
              <span className="text-[10.5px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                {testData.part4.badge}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="border border-blue-200 bg-blue-50/50 rounded-xl p-2.5">
                <strong className="text-blue-900 block mb-0.5">{testData.part4.roleA.title}</strong>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  {testData.part4.roleA.desc}
                </p>
              </div>
              <div className="border border-emerald-200 bg-emerald-50/50 rounded-xl p-2.5">
                <strong className="text-emerald-900 block mb-0.5">{testData.part4.roleB.title}</strong>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  {testData.part4.roleB.desc}
                </p>
              </div>
            </div>

            {/* MEDUCA Performance Checklist Table */}
            <table className="w-full text-xs border-collapse border border-slate-200 rounded-xl overflow-hidden mt-1">
              <thead className="bg-amber-50 text-amber-950 font-bold text-[10.5px]">
                <tr>
                  <th className="p-1.5 border border-slate-200 text-left">MEDUCA Observable Criteria</th>
                  <th className="p-1.5 border border-slate-200 text-center w-24">Achieved (1.0)</th>
                  <th className="p-1.5 border border-slate-200 text-center w-24">In Progress (0.5)</th>
                  <th className="p-1.5 border border-slate-200 text-center w-16">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-[11px]">
                {testData.part4.criteria.map((crit) => (
                  <tr key={crit.num}>
                    <td className="p-1.5">
                      <strong>{crit.num}. {crit.title}:</strong> {crit.desc}
                    </td>
                    <td className="p-1.5 text-center text-slate-400">☐</td>
                    <td className="p-1.5 text-center text-slate-400">☐</td>
                    <td className="p-1.5 text-center font-mono font-bold text-slate-700">___ / 1.0</td>
                  </tr>
                ))}
                <tr className="bg-slate-50 font-bold">
                  <td className="p-1.5 text-right" colSpan={3}>TOTAL ACTION TASK SCORE:</td>
                  <td className="p-1.5 text-center font-mono text-blue-950">___ / 4.0</td>
                </tr>
              </tbody>
            </table>
          </section>
        )}

        {/* MEDUCA OFFICIAL SCALE CONVERSION TABLE FOOTER */}
        <footer className="border-t-2 border-slate-300 pt-2.5 text-[11px] text-slate-600 space-y-2 avoid-break">
          <div className="flex flex-wrap justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-200 text-[10.5px]">
            <span className="font-black text-slate-900">📊 Escala Oficial MEDUCA:</span>
            <span><strong>5.0 (Excelente):</strong> {testData.meducaScale.min50} - {testData.meducaScale.max50} pts</span>
            <span><strong>4.0 (Bueno):</strong> {testData.meducaScale.min40} - {testData.meducaScale.max40} pts</span>
            <span><strong>3.0 (Regular):</strong> {testData.meducaScale.min30} - {testData.meducaScale.max30} pts</span>
            <span className="text-rose-700"><strong>Menos de 3.0 (Insuficiente):</strong> 0 - {testData.meducaScale.max29} pts</span>
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 px-1 pt-1">
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
