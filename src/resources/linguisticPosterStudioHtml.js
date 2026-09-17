// Universal AOA Linguistic Poster Studio for Panama MEDUCA Curriculums (Pre-K to 12th Grade)
// Dynamically extracts linguistic competences, recommended vocabulary (nouns, verbs, adjectives, grammar),
// and realia photos/vectors for ANY grade and scenario chosen by the teacher.

import { REALIA_PHOTOS, getRealiaPhoto } from './realiaCatalog.js';

// Common Spanish translations and IPA phonetics dictionary for MEDUCA curriculum keywords
export const VOCAB_DICTIONARY = {
  // Technology, Robotics & Science (Grades 7 to 12)
  robot: { translation: 'robot', phonetic: '/ˈroʊbɒt/' },
  technology: { translation: 'tecnología', phonetic: '/tɛkˈnɒlədʒi/' },
  automation: { translation: 'automatización', phonetic: '/ˌɔːtəˈmeɪʃən/' },
  industry: { translation: 'industria', phonetic: '/ˈɪndəstri/' },
  agriculture: { translation: 'agricultura', phonetic: '/ˈæɡrɪkʌltʃər/' },
  medicine: { translation: 'medicina', phonetic: '/ˈmɛdɪsɪn/' },
  factory: { translation: 'fábrica', phonetic: '/ˈfæktəri/' },
  machine: { translation: 'máquina', phonetic: '/məˈʃiːn/' },
  program: { translation: 'programa', phonetic: '/ˈproʊɡræm/' },
  control: { translation: 'control', phonetic: '/kənˈtroʊl/' },
  sensor: { translation: 'sensor', phonetic: '/ˈsɛnsər/' },
  repair: { translation: 'reparación', phonetic: '/rɪˈpɛər/' },
  safety: { translation: 'seguridad', phonetic: '/ˈseɪfti/' },
  space: { translation: 'espacio', phonetic: '/speɪs/' },
  astronaut: { translation: 'astronauta', phonetic: '/ˈæstrənɔːt/' },
  satellite: { translation: 'satélite', phonetic: '/ˈsætəlaɪt/' },
  rocket: { translation: 'cohete', phonetic: '/ˈrɒkɪt/' },
  planet: { translation: 'planeta', phonetic: '/ˈplænɪt/' },
  mission: { translation: 'misión', phonetic: '/ˈmɪʃən/' },
  orbit: { translation: 'órbita', phonetic: '/ˈɔːrbɪt/' },
  telescope: { translation: 'telescopio', phonetic: '/ˈtɛlɪskoʊp/' },
  research: { translation: 'investigación', phonetic: '/rɪˈsɜːrtʃ/' },
  gravity: { translation: 'gravedad', phonetic: '/ˈɡrævɪti/' },
  universe: { translation: 'universo', phonetic: '/ˈjuːnɪvɜːrs/' },
  galaxy: { translation: 'galaxia', phonetic: '/ˈɡæləksi/' },
  exploration: { translation: 'exploración', phonetic: '/ˌɛkspləˈreɪʃən/' },
  station: { translation: 'estación', phonetic: '/ˈsteɪʃən/' },
  equipment: { translation: 'equipo', phonetic: '/ɪˈkwɪpmənt/' },

  // Energy & Environment (Grades 6 to 11)
  energy: { translation: 'energía', phonetic: '/ˈɛnərdʒi/' },
  solar: { translation: 'energía solar', phonetic: '/ˈsoʊlər/' },
  wind: { translation: 'viento', phonetic: '/wɪnd/' },
  turbine: { translation: 'turbina', phonetic: '/ˈtɜːrbaɪn/' },
  electricity: { translation: 'electricidad', phonetic: '/ɪˌlɛkˈtrɪsɪti/' },
  recycle: { translation: 'reciclaje', phonetic: '/ˌriːˈsaɪkəl/' },
  recycling: { translation: 'reciclaje', phonetic: '/ˌriːˈsaɪklɪŋ/' },
  waste: { translation: 'residuos', phonetic: '/weɪst/' },
  environment: { translation: 'medio ambiente', phonetic: '/ɪnˈvaɪrənmənt/' },
  pollution: { translation: 'contaminación', phonetic: '/pəˈluːʃən/' },
  water: { translation: 'agua', phonetic: '/ˈwɔːtər/' },
  ocean: { translation: 'océano', phonetic: '/ˈoʊʃən/' },
  coral: { translation: 'coral', phonetic: '/ˈkɔːrəl/' },
  reef: { translation: 'arrecife', phonetic: '/riːf/' },
  wildlife: { translation: 'vida silvestre', phonetic: '/ˈwaɪldlaɪf/' },
  forest: { translation: 'bosque', phonetic: '/ˈfɔːrɪst/' },
  jaguar: { translation: 'jaguar', phonetic: '/ˈdʒæɡwɑːr/' },
  weather: { translation: 'clima', phonetic: '/ˈwɛðər/' },
  cloud: { translation: 'nube', phonetic: '/klaʊd/' },
  rain: { translation: 'lluvia', phonetic: '/reɪn/' },

  // School, Classroom & Foundation (Pre-K to 6th Grade)
  book: { translation: 'libro', phonetic: '/bʊk/' },
  desk: { translation: 'pupitre', phonetic: '/dɛsk/' },
  table: { translation: 'mesa', phonetic: '/ˈteɪbəl/' },
  chair: { translation: 'silla', phonetic: '/tʃɛər/' },
  bag: { translation: 'mochila', phonetic: '/bæɡ/' },
  pencil: { translation: 'lápiz', phonetic: '/ˈpɛnsəl/' },
  pen: { translation: 'bolígrafo', phonetic: '/pɛn/' },
  crayon: { translation: 'crayón', phonetic: '/ˈkreɪɒn/' },
  marker: { translation: 'marcador', phonetic: '/ˈmɑːrkər/' },
  scissors: { translation: 'tijeras', phonetic: '/ˈsɪzərz/' },
  glue: { translation: 'goma/pegamento', phonetic: '/ɡluː/' },
  ruler: { translation: 'regla', phonetic: '/ˈruːlər/' },
  notebook: { translation: 'cuaderno', phonetic: '/ˈnoʊtbʊk/' },
  paper: { translation: 'papel', phonetic: '/ˈpeɪpər/' },
  board: { translation: 'tablero', phonetic: '/bɔːrd/' },
  classroom: { translation: 'aula de clases', phonetic: '/ˈklæsruːm/' },
  school: { translation: 'escuela', phonetic: '/skuːl/' },
  teacher: { translation: 'docente', phonetic: '/ˈtiːtʃər/' },
  student: { translation: 'estudiante', phonetic: '/ˈstjuːdənt/' },
  classmate: { translation: 'compañero/a', phonetic: '/ˈklæsmeɪt/' },
  friend: { translation: 'amigo/a', phonetic: '/frɛnd/' },
  library: { translation: 'biblioteca', phonetic: '/ˈlaɪbrəri/' },
  project: { translation: 'proyecto', phonetic: '/ˈprɒdʒɛkt/' },
  poster: { translation: 'afiche', phonetic: '/ˈpoʊstər/' },

  // Market & Food
  market: { translation: 'mercado', phonetic: '/ˈmɑːrkɪt/' },
  price: { translation: 'precio', phonetic: '/praɪs/' },
  shopping_list: { translation: 'lista de compras', phonetic: '/ˈʃɒpɪŋ lɪst/' },
  'shopping list': { translation: 'lista de compras', phonetic: '/ˈʃɒpɪŋ lɪst/' },
  item: { translation: 'artículo', phonetic: '/ˈaɪtəm/' },
  store: { translation: 'tienda', phonetic: '/stɔːr/' },
  cost: { translation: 'costo', phonetic: '/kɒst/' },
  pineapple: { translation: 'piña', phonetic: '/ˈpaɪnæpəl/' },
  cashier: { translation: 'cajero/a', phonetic: '/kæˈʃɪər/' },
  money: { translation: 'dinero', phonetic: '/ˈmʌni/' },
  dollar: { translation: 'dólar', phonetic: '/ˈdɒlər/' },
  cassava: { translation: 'yuca', phonetic: '/kəˈsɑːvə/' },
  yuca: { translation: 'yuca', phonetic: '/ˈjuːkə/' },
  potatoes: { translation: 'papas', phonetic: '/pəˈteɪtoʊz/' },
  potato: { translation: 'papa', phonetic: '/pəˈteɪtoʊ/' },
  banana: { translation: 'guineo/plátano', phonetic: '/bəˈnænə/' },
  orange: { translation: 'naranja', phonetic: '/ˈɒrɪndʒ/' },
  apple: { translation: 'manzana', phonetic: '/ˈæpəl/' },
  fruit: { translation: 'fruta', phonetic: '/fruːt/' },
  vegetable: { translation: 'vegetal', phonetic: '/ˈvɛdʒtəbəl/' },

  // Panama Canal & Heritage
  canal: { translation: 'Canal de Panamá', phonetic: '/kəˈnæl/' },
  lock: { translation: 'esclusa', phonetic: '/lɒk/' },
  tugboat: { translation: 'remolcador', phonetic: '/ˈtʌɡboʊt/' },
  helmet: { translation: 'casco de seguridad', phonetic: '/ˈhɛlmɪt/' },
  life_vest: { translation: 'chaleco salvavidas', phonetic: '/ˈlaɪf vɛst/' },
  'life vest': { translation: 'chaleco salvavidas', phonetic: '/ˈlaɪf vɛst/' },
  radio: { translation: 'radio comunicador', phonetic: '/ˈreɪdioʊ/' },
  ship: { translation: 'buque', phonetic: '/ʃɪp/' },
  heritage: { translation: 'patrimonio', phonetic: '/ˈhɛrɪtɪdʒ/' },
  monument: { translation: 'monumento', phonetic: '/ˈmɒnjʊmənt/' },
  parade: { translation: 'desfile', phonetic: '/pəˈreɪd/' },
  festival: { translation: 'festival', phonetic: '/ˈfɛstɪvəl/' },
  community: { translation: 'comunidad', phonetic: '/kəˈmjuːnɪti/' }
};

/**
 * Extracts and normalizes linguistic data from ANY scenario object (Pre-K to 12th Grade).
 */
export function extractScenarioData(scenario, grade = '7th Grade', scenarioIndex = 0, cefr = '') {
  if (!scenario) return null;

  const scenarioTitle = scenario.title || scenario.scenarioName || scenario.scenario_title || scenario.name || `Scenario ${scenarioIndex + 1}`;
  const scenarioNum = scenario.id || scenario.scenarioNum || scenario.scenario_number || (scenarioIndex + 1);
  const cefrLevel = cefr || scenario.level || scenario.cefr_level || scenario.proficiency_level || (grade.includes('12') ? 'B1+' : grade.includes('7') ? 'A1+ / A2' : 'A1');

  // 1. Linguistic Competences (Grammar Structures & Rules)
  let grammarRules = [];
  if (Array.isArray(scenario.linguistic_competences) && scenario.linguistic_competences.length > 0) {
    grammarRules = scenario.linguistic_competences;
  } else if (scenario.communicative_competences?.linguistic_competences?.recommended_grammatical_features) {
    const gf = scenario.communicative_competences.linguistic_competences.recommended_grammatical_features;
    grammarRules = Array.isArray(gf) ? gf : [gf];
  } else if (Array.isArray(scenario.grammar) && scenario.grammar.length > 0) {
    grammarRules = scenario.grammar;
  } else if (scenario.grammar_focus) {
    grammarRules = Array.isArray(scenario.grammar_focus) ? scenario.grammar_focus : [scenario.grammar_focus];
  }

  // Fallback grammar if missing
  if (!grammarRules.length) {
    grammarRules = [
      "Present Simple for general facts and core descriptions",
      "Imperatives & modals for direct action and collaboration",
      "Action-oriented question forms for peer dialogue"
    ];
  }

  // 2. Recommended Vocabulary
  const vocabSource = scenario.recommended_vocabulary ||
                      scenario.communicative_competences?.linguistic_competences?.recommended_vocabulary ||
                      scenario.communicative_competences?.vocabulary ||
                      scenario.vocabulary || {};

  // Nouns
  let rawNouns = vocabSource.nouns || vocabSource.noun || [];
  if (typeof rawNouns === 'string') {
    rawNouns = rawNouns.split(',').map(s => s.trim()).filter(Boolean);
  } else if (!Array.isArray(rawNouns)) {
    rawNouns = [];
  }

  // Verbs
  let rawVerbs = vocabSource.verbs || vocabSource.verb || [];
  if (typeof rawVerbs === 'string') {
    rawVerbs = rawVerbs.split(',').map(s => s.trim()).filter(Boolean);
  } else if (!Array.isArray(rawVerbs)) {
    rawVerbs = [];
  }

  // Adjectives
  let rawAdjs = vocabSource.adjectives || vocabSource.adjective || [];
  if (typeof rawAdjs === 'string') {
    rawAdjs = rawAdjs.split(',').map(s => s.trim()).filter(Boolean);
  } else if (!Array.isArray(rawAdjs)) {
    rawAdjs = [];
  }

  // Adverbs & Question Words
  let rawAdverbs = vocabSource.adverbs_of_frequency || vocabSource.adverbs || vocabSource.prepositions || vocabSource.discourse_marker || [];
  if (typeof rawAdverbs === 'string') rawAdverbs = rawAdverbs.split(',').map(s => s.trim()).filter(Boolean);
  if (!Array.isArray(rawAdverbs) || !rawAdverbs.length) rawAdverbs = ["always", "often", "carefully", "efficiently"];

  let rawQuestions = vocabSource.question_words || vocabSource.interrogatives || [];
  if (typeof rawQuestions === 'string') rawQuestions = rawQuestions.split(',').map(s => s.trim()).filter(Boolean);
  if (!Array.isArray(rawQuestions) || !rawQuestions.length) rawQuestions = ["What...?", "How...?", "Why...?"];

  // Format Nouns for UI
  const processedNouns = rawNouns.map(n => {
    const word = typeof n === 'object' ? (n.word || '') : String(n).trim();
    const clean = word.toLowerCase();
    const dict = VOCAB_DICTIONARY[clean] || VOCAB_DICTIONARY[clean.replace(/\s+/g, '_')] || {};
    return {
      word: word,
      translation: dict.translation || word,
      phonetic: dict.phonetic || ''
    };
  });

  // Pick top 11-12 target nouns for visual cards
  const targetNouns = processedNouns.length > 0 ? processedNouns.slice(0, 11) : [
    { word: "robot", translation: "robot", phonetic: "/ˈroʊbɒt/" },
    { word: "technology", translation: "tecnología", phonetic: "/tɛkˈnɒlədʒi/" },
    { word: "space", translation: "espacio", phonetic: "/speɪs/" },
    { word: "satellite", translation: "satélite", phonetic: "/ˈsætəlaɪt/" }
  ];

  // Pick verbs and adjectives
  const displayVerbs = rawVerbs.length > 0 ? rawVerbs.slice(0, 12) : ["operate", "program", "launch", "explore", "repair", "control"];
  const displayAdjs = rawAdjs.length > 0 ? rawAdjs.slice(0, 8) : ["automated", "efficient", "modern", "accurate", "reliable"];

  // Numbers range based on grade
  let numberRange = "1 to 100 (Quantities, measurements & change)";
  let numberSubtext = "Applied to counting items, reading data, and collaborative task metrics.";
  if (grade.includes('Pre-K') || grade.includes('Kinder')) {
    numberRange = "1 to 10 (Counting Real Objects)";
    numberSubtext = "Used for fingers, blocks, and classroom objects.";
  } else if (grade.includes('1') || grade.includes('2') || grade.includes('3')) {
    numberRange = "1 to 50 (Cardinal & Ordinal Numbers)";
    numberSubtext = "Used for basic counting, age, and simple prices.";
  } else if (grade.includes('10') || grade.includes('11') || grade.includes('12')) {
    numberRange = "100 to 1,000,000+ (Years, Metrics & Big Data)";
    numberSubtext = "Used for technical measurements, statistical timelines (e.g., By 2030), and precision data.";
  }

  // 3. Dialogue Generation matching target vocabulary & grammar
  const nounSampleA = targetNouns[0]?.word || "topic";
  const nounSampleB = targetNouns[1]?.word || "project";
  const nounSampleC = targetNouns[2]?.word || "system";
  const verbSample = displayVerbs[0] || "analyze";

  // Build authentic dialogue lines reflecting the actual curriculum level
  let dialogueLines = [];
  if (grammarRules.some(g => /future perfect|passive|conditional/i.test(g))) {
    // High school / Advanced scenario (like Grade 12 Robotics)
    dialogueLines = [
      { speaker: "Student A (Researcher / Specialist)", text: `By 2030, how will AI and ${nounSampleA}s have transformed our ${nounSampleB} in Panama?` },
      { speaker: "Student B (Technical Analyst)", text: `Data is collected by advanced ${nounSampleC}s so technicians can ${verbSample} systems with high precision.` },
      { speaker: "Student A", text: `If ${nounSampleA}s are programmed properly, they operate without mechanical failure in challenging environments.` },
      { speaker: "Student B", text: `Exactly! Modern equipment and automated research will have revolutionized science across the region.` }
    ];
  } else if (grade.includes('Pre-K') || grade.includes('Kinder') || grade.includes('1')) {
    // Early childhood / Primary
    dialogueLines = [
      { speaker: "Student A (Partner 1)", text: `Look! Where is the ${nounSampleA}?` },
      { speaker: "Student B (Partner 2)", text: `Here it is! The ${nounSampleA} is next to the ${nounSampleB}.` },
      { speaker: "Student A", text: `Can you ${verbSample} the ${nounSampleC}?` },
      { speaker: "Student B", text: `Yes, I can! Let's work together happily.` }
    ];
  } else {
    // Middle school / General AOA interaction
    dialogueLines = [
      { speaker: "Student A (Team Member)", text: `Good morning! Can we ${verbSample} the ${nounSampleA} and check the ${nounSampleB}?` },
      { speaker: "Student B (Peer Collaborator)", text: `Yes, the ${nounSampleA} is ready and we need to compare the ${nounSampleC}.` },
      { speaker: "Student A", text: `How many items do we need to organize for our classroom presentation?` },
      { speaker: "Student B", text: `We need five items total. Here is the complete list for our team task!` }
    ];
  }

  return {
    metadata: {
      institution: "REPÚBLICA DE PANAMÁ · MINISTERIO DE EDUCACIÓN (MEDUCA)",
      program: `EDUGEN PRO · ENFOQUE AOA (${grade})`,
      grade: grade,
      cefr_level: cefrLevel,
      scenario_number: scenarioNum,
      scenario_title: scenarioTitle
    },
    linguistic_competence: {
      grammar: grammarRules,
      nouns: targetNouns,
      all_nouns_count: rawNouns.length,
      verbs: displayVerbs,
      adjectives: displayAdjs,
      adverbs: rawAdverbs,
      interrogatives: rawQuestions,
      numbers: numberRange,
      numbers_subtext: numberSubtext
    },
    dialogue: dialogueLines
  };
}

/**
 * Builds the complete self-contained HTML for the Linguistic Poster Studio.
 * Supports active scenario + all scenarios for the grade in the selector.
 */
export function linguisticPosterStudioHtml(activeScenario = null, grade = '7th Grade', scenarioIndex = 0, cefr = '', allScenarios = []) {
  // Parse active scenario
  const parsedActive = extractScenarioData(activeScenario, grade, scenarioIndex, cefr);

  // Parse all scenarios for the grade selector if provided
  const parsedScenarioList = Array.isArray(allScenarios) && allScenarios.length > 0
    ? allScenarios.map((sc, idx) => extractScenarioData(sc, grade, idx, cefr))
    : [parsedActive];

  const activeJsonStr = JSON.stringify(parsedActive, null, 2);
  const scenarioListJsonStr = JSON.stringify(parsedScenarioList, null, 2);
  const realiaMapJsonStr = JSON.stringify(REALIA_PHOTOS, null, 2);

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AOA MEDUCA: Generador de Posters de Competencia Lingüística</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Google Fonts: Inter & Fira Code -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
    code, pre {
      font-family: 'Fira Code', monospace;
    }
    .poster-outer-frame {
      border: 5px solid #1e3a8a;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    }
    .poster-inner-frame {
      border: 2px solid #f59e0b;
    }
    .realia-img-container {
      position: relative;
      background-color: #f8fafc;
      overflow: hidden;
    }
    .realia-photo {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.25s ease;
    }
    .realia-photo:hover {
      transform: scale(1.06);
    }
    @media print {
      .no-print { display: none !important; }
      body { background: white !important; padding: 0 !important; margin: 0 !important; }
      .print-full-poster {
        box-shadow: none !important;
        border-width: 4px !important;
        max-width: 100% !important;
        width: 100% !important;
        margin: 0 !important;
        page-break-inside: avoid;
      }
      @page {
        margin: 6mm;
        size: letter portrait;
      }
    }
    body.format-tabloid @page {
      size: tabloid portrait;
      margin: 8mm;
    }
  </style>
</head>
<body class="bg-slate-100 text-slate-900 min-h-screen flex flex-col">

<header class="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white shadow-md sticky top-0 z-40 no-print">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
    <div class="flex items-center gap-3">
      <span class="text-3xl" title="República de Panamá">🇵🇦</span>
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-base font-black tracking-tight">AOA Linguistic Poster Studio</h1>
          <span class="bg-amber-400/20 text-amber-300 text-[11px] px-2.5 py-0.5 rounded-full font-bold border border-amber-400/30">
            MEDUCA Panamá · ${escapeXml(grade)}
          </span>
        </div>
        <p class="text-xs text-blue-200">
          Afiches Dinámicos por Escenario · Ilustración Realia & Fórmulas Lingüísticas Curriculares
        </p>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex items-center flex-wrap gap-2">
      <!-- Toggle Visual Mode: Real Photo vs Vector SVG -->
      <button onclick="toggleVisualMode()" id="btn-toggle-visual" class="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-sm transition flex items-center gap-1.5 cursor-pointer">
        <span>📸</span> <span id="visual-mode-label">Fotos Reales</span>
      </button>
      
      <!-- JSON Modal Editor -->
      <button onclick="openJsonModal()" class="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition flex items-center gap-1.5 cursor-pointer">
        <span>⚙️</span> Editar JSON Escenario
      </button>

      <!-- Toggle Format: Letter vs Tabloid -->
      <button onclick="togglePosterFormat()" id="btn-toggle-format" class="px-3 py-1.5 rounded-xl bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold border border-blue-600 transition cursor-pointer">
        Formato: Carta (8.5×11)
      </button>

      <!-- Print Button -->
      <button onclick="window.print()" class="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md transition flex items-center gap-1.5 cursor-pointer">
        🖨️ Imprimir / Guardar PDF
      </button>
    </div>
  </div>
</header>

<!-- Scenario & Grade Selector Bar (All 14 Grades & 112 Scenarios) -->
<section class="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-4 pb-1 no-print">
  <div class="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
    <div class="flex flex-wrap items-center gap-2.5">
      <div class="flex items-center gap-1.5">
        <label class="text-xs font-extrabold uppercase text-slate-700 tracking-wide flex items-center gap-1">
          <span>🎓</span> Grado:
        </label>
        <select id="grade-selector" onchange="onGradeChange(this.value)" class="text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-900 focus:bg-white focus:border-blue-600 outline-none cursor-pointer">
          ${[
            'Pre-K', 'Kinder', '1st Grade', '2nd Grade', '3rd Grade',
            '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade',
            '9th Grade', '10th Grade', '11th Grade', '12th Grade'
          ].map(g => `<option value="${g}" ${g === grade ? 'selected' : ''}>${g}</option>`).join('')}
        </select>
      </div>

      <div class="flex items-center gap-1.5">
        <label class="text-xs font-extrabold uppercase text-slate-700 tracking-wide flex items-center gap-1">
          <span>📚</span> Escenario:
        </label>
        <select id="scenario-selector" onchange="switchScenario(this.value)" class="text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-900 focus:bg-white focus:border-blue-600 outline-none max-w-sm sm:max-w-md truncate cursor-pointer">
          ${parsedScenarioList.map((sc, i) => `
            <option value="${i}" ${i === scenarioIndex ? 'selected' : ''}>
              #${sc.metadata.scenario_number}: ${escapeXml(sc.metadata.scenario_title)}
            </option>
          `).join('')}
        </select>
      </div>
    </div>

    <div class="text-[11px] text-slate-600 font-medium flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
      <span id="visual-mode-description">112 Escenarios oficiales (Pre-K a 12°) · Nouns ilustrados + Textos coloridos AOA</span>
    </div>
  </div>
</section>

<!-- JSON EDIT MODAL -->
<div id="json-modal" class="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 hidden flex items-center justify-center p-4 no-print">
  <div class="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
    <div class="flex justify-between items-center border-b border-slate-100 pb-3">
      <div>
        <h3 class="text-base font-black text-slate-900">Editor de Datos JSON del Escenario</h3>
        <p class="text-xs text-slate-500">Estructura curricular en tiempo real (${escapeXml(grade)})</p>
      </div>
      <button onclick="closeJsonModal()" class="text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer">✕</button>
    </div>

    <textarea id="json-textarea" rows="14" class="w-full text-xs font-mono p-3 bg-slate-900 text-emerald-400 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed"></textarea>

    <div class="flex justify-between items-center pt-2">
      <div id="json-feedback" class="text-xs font-bold text-slate-500">JSON sintácticamente válido</div>
      <div class="flex gap-2">
        <button onclick="closeJsonModal()" class="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer">Cancelar</button>
        <button onclick="applyCustomJson()" class="px-4 py-2 text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white rounded-xl shadow-xs transition cursor-pointer">
          Actualizar Afiche
        </button>
      </div>
    </div>
  </div>
</div>

<!-- POSTER MAIN CONTAINER -->
<main class="flex-1 max-w-5xl w-full mx-auto px-2 sm:px-4 py-4 sm:py-6 flex justify-center">

  <article id="poster-root" class="bg-white poster-outer-frame rounded-2xl p-3 sm:p-5 w-full print-full-poster transition-all duration-200">
    <div class="poster-inner-frame rounded-xl p-3 sm:p-5 space-y-4">

      <!-- Institutional MEDUCA Header -->
      <header class="border-b-2 border-blue-950 pb-3 text-center space-y-1">
        <div class="flex justify-between items-center text-[10px] font-black tracking-widest text-slate-500 uppercase px-1">
          <span id="meta-inst">REPÚBLICA DE PANAMÁ · MINISTERIO DE EDUCACIÓN (MEDUCA)</span>
          <span id="meta-prog">EDUGEN PRO · ENFOQUE AOA</span>
        </div>

        <h2 id="meta-title" class="text-xl sm:text-2xl font-black text-blue-950 tracking-tight leading-tight uppercase">
          SCENARIO #${parsedActive.metadata.scenario_number}: ${escapeXml((parsedActive.metadata.scenario_title || '').toUpperCase())}
        </h2>

        <div class="flex flex-wrap items-center justify-center gap-2 pt-0.5 text-xs font-bold">
          <span id="meta-grade" class="bg-blue-50 text-blue-900 border border-blue-200 px-2.5 py-0.5 rounded-md">
            Grade: ${escapeXml(grade)}
          </span>
          <span id="meta-cefr" class="bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-0.5 rounded-md">
            CEFR: ${escapeXml(parsedActive.metadata.cefr_level)}
          </span>
          <span class="bg-purple-50 text-purple-900 border border-purple-200 px-2.5 py-0.5 rounded-md">
            Master Wall Poster · Linguistic Competence
          </span>
        </div>
      </header>

      <!-- SECTION 1: COLOR ILLUSTRATED / PHOTOGRAPHIC NOUNS -->
      <section class="space-y-2">
        <div class="bg-blue-900 text-white px-3 py-1.5 rounded-lg flex items-center justify-between shadow-xs">
          <div class="flex items-center gap-2">
            <span class="text-sm">🎨</span>
            <h3 class="text-xs font-black uppercase tracking-wider">
              Section 1: Illustrated Target Nouns (Sustantivos Clave en Acción)
            </h3>
          </div>
          <span id="nouns-count-badge" class="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
            ${parsedActive.linguistic_competence.nouns.length} Target Words
          </span>
        </div>

        <!-- Noun Cards Grid -->
        <div id="nouns-grid" class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
          <!-- Rendered dynamically by JavaScript -->
        </div>
      </section>

      <!-- SECTION 2 & 3: ACTION VERBS & DESCRIPTIVE ADJECTIVES -->
      <section class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        
        <!-- Action Verbs Box -->
        <div class="border border-sky-300 bg-sky-50/40 rounded-xl overflow-hidden shadow-2xs">
          <div class="bg-sky-600 text-white px-3 py-1.5 flex items-center justify-between">
            <h3 class="text-xs font-black uppercase tracking-wide flex items-center gap-1.5">
              <span>⚡</span> Action Verbs (Verbos Operativos)
            </h3>
            <span id="verbs-count" class="text-[10px] bg-white/20 px-2 py-0.2 rounded font-bold">Verbs</span>
          </div>
          <div class="p-3">
            <div id="verbs-container" class="flex flex-wrap gap-1.5">
              <!-- Verbs chips -->
            </div>
          </div>
        </div>

        <!-- Descriptive Adjectives Box -->
        <div class="border border-emerald-300 bg-emerald-50/40 rounded-xl overflow-hidden shadow-2xs">
          <div class="bg-emerald-600 text-white px-3 py-1.5 flex items-center justify-between">
            <h3 class="text-xs font-black uppercase tracking-wide flex items-center gap-1.5">
              <span>✨</span> Descriptive Adjectives (Cualidades)
            </h3>
            <span id="adj-count" class="text-[10px] bg-white/20 px-2 py-0.2 rounded font-bold">Adjectives</span>
          </div>
          <div class="p-3">
            <div id="adj-container" class="flex flex-wrap gap-1.5">
              <!-- Adjectives chips -->
            </div>
          </div>
        </div>

      </section>

      <!-- SECTION 4: LINGUISTIC COMPETENCES & GRAMMAR LAB + NUMBERS -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        <!-- Grammar Lab & Formulas (Takes 2 cols on md screens) -->
        <div class="md:col-span-2 border border-indigo-200 bg-indigo-50/40 rounded-xl overflow-hidden shadow-2xs">
          <div class="bg-indigo-800 text-white px-3 py-1.5 text-xs font-black uppercase tracking-wide flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <span>📐</span> Linguistic Competences & Grammatical Features (Fórmulas AOA)
            </div>
            <span class="text-[10px] bg-white/20 px-2 py-0.2 rounded font-bold">Curricular Standard</span>
          </div>
          <div class="p-3 space-y-1.5" id="grammar-container">
            <!-- Grammar rules list -->
          </div>
        </div>

        <!-- Numbers & Question Words (1 col) -->
        <div class="border border-rose-200 bg-rose-50/40 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between">
          <div class="bg-rose-700 text-white px-3 py-1.5 text-xs font-black uppercase tracking-wide flex items-center gap-1.5">
            <span>🔢</span> Numbers, Prices & Question Words
          </div>
          <div class="p-3 text-xs text-slate-800 space-y-2 flex-1">
            <div>
              <div class="font-extrabold text-rose-900" id="num-range-text">Range: 1 to 100</div>
              <p class="text-[11px] text-slate-600 leading-snug" id="num-subtext">
                Applied to counting, measurements, and data collection.
              </p>
            </div>

            <div class="pt-1.5 border-t border-rose-200/60">
              <span class="text-[10px] font-black text-rose-900 uppercase tracking-wider block mb-1">Key Question Prompts:</span>
              <div id="interr-container" class="flex flex-wrap gap-1">
                <!-- Question words chips -->
              </div>
            </div>
          </div>
        </div>

      </section>

      <!-- SECTION 5: AUTHENTIC CLASSROOM ACTION TASK & MINI-DIALOGUE -->
      <section class="border-2 border-dashed border-slate-300 bg-slate-50/70 rounded-xl p-3 text-xs space-y-1.5">
        <div class="flex items-center justify-between">
          <span class="font-black text-blue-950 uppercase tracking-wide flex items-center gap-1.5">
            <span>🗣</span> Authentic Classroom Action Task (AOA Collaborative Interaction):
          </span>
          <span class="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded" id="task-badge">
            Student A & Student B Pair Practice
          </span>
        </div>

        <div id="dialogue-box" class="space-y-1.5 text-[11.5px] font-mono text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 leading-relaxed">
          <!-- Dialogue lines -->
        </div>
      </section>

      <!-- Poster Footer -->
      <footer class="border-t border-slate-200 pt-2 text-[10px] text-slate-400 flex flex-wrap justify-between items-center px-1">
        <span>REPÚBLICA DE PANAMÁ · MEDUCA · DIRECCIÓN NACIONAL DE CURRÍCULO</span>
        <span>AOA WALL POSTER STUDIO · EDUGEN PRO</span>
      </footer>

    </div>
  </article>

</main>

<script>
// Scenario list & active data injected from curriculum
const ALL_SCENARIOS = ${scenarioListJsonStr};
let currentScenarioData = ${activeJsonStr};
const REALIA_PHOTOS = ${realiaMapJsonStr};

let visualMode = 'photo'; // 'photo' | 'vector'
let currentFormatIsTabloid = false;

/**
 * Universal procedural SVG icon generator for any noun:
 * Produces crisp, beautiful vector illustrations with distinct themes.
 */
function getVectorSvgForNoun(word) {
  const w = String(word).toLowerCase().trim();

  // Tech / Robotics
  if (w.includes('robot')) {
    return \`<svg viewBox="0 0 100 80" class="w-full h-full">
      <rect x="25" y="22" width="50" height="42" rx="8" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/>
      <circle cx="40" cy="38" r="6" fill="#f8fafc"/>
      <circle cx="40" cy="38" r="3" fill="#0284c7"/>
      <circle cx="60" cy="38" r="6" fill="#f8fafc"/>
      <circle cx="60" cy="38" r="3" fill="#0284c7"/>
      <line x1="38" y1="52" x2="62" y2="52" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
      <line x1="50" y1="8" x2="50" y2="22" stroke="#1d4ed8" stroke-width="3"/>
      <circle cx="50" cy="8" r="4" fill="#ef4444"/>
      <rect x="18" y="32" width="7" height="18" rx="2" fill="#60a5fa"/>
      <rect x="75" y="32" width="7" height="18" rx="2" fill="#60a5fa"/>
    </svg>\`;
  }
  if (w.includes('space') || w.includes('galaxy') || w.includes('universe')) {
    return \`<svg viewBox="0 0 100 80" class="w-full h-full">
      <rect x="5" y="5" width="90" height="70" rx="8" fill="#0f172a"/>
      <circle cx="25" cy="25" r="2" fill="#ffffff"/>
      <circle cx="75" cy="20" r="1.5" fill="#fef08a"/>
      <circle cx="80" cy="55" r="2" fill="#ffffff"/>
      <circle cx="20" cy="60" r="1.5" fill="#38bdf8"/>
      <circle cx="50" cy="42" r="16" fill="#8b5cf6"/>
      <ellipse cx="50" cy="42" rx="28" ry="7" fill="none" stroke="#e0e7ff" stroke-width="2" transform="rotate(-15 50 42)"/>
    </svg>\`;
  }
  if (w.includes('rocket')) {
    return \`<svg viewBox="0 0 100 80" class="w-full h-full">
      <g transform="translate(50, 38) rotate(35) translate(-50, -38)">
        <polygon points="50,10 62,30 38,30" fill="#ef4444"/>
        <rect x="38" y="30" width="24" height="32" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
        <circle cx="50" cy="42" r="5" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5"/>
        <polygon points="38,48 24,62 38,62" fill="#dc2626"/>
        <polygon points="62,48 76,62 62,62" fill="#dc2626"/>
        <polygon points="42,62 50,75 58,62" fill="#f59e0b"/>
      </g>
    </svg>\`;
  }
  if (w.includes('astronaut')) {
    return \`<svg viewBox="0 0 100 80" class="w-full h-full">
      <circle cx="50" cy="36" r="24" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
      <rect x="32" y="24" width="36" height="24" rx="8" fill="#0f172a" stroke="#d97706" stroke-width="2"/>
      <path d="M36,28 Q44,32 50,28" stroke="#38bdf8" stroke-width="2" fill="none"/>
      <rect x="42" y="60" width="16" height="15" fill="#e2e8f0"/>
    </svg>\`;
  }
  if (w.includes('satellite')) {
    return \`<svg viewBox="0 0 100 80" class="w-full h-full">
      <rect x="38" y="26" width="24" height="28" rx="3" fill="#e2e8f0" stroke="#64748b" stroke-width="1.5"/>
      <rect x="8" y="32" width="26" height="16" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.2"/>
      <rect x="66" y="32" width="26" height="16" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.2"/>
      <circle cx="50" cy="40" r="4" fill="#fbbf24"/>
      <line x1="50" y1="26" x2="50" y2="12" stroke="#64748b" stroke-width="2"/>
      <circle cx="50" cy="12" r="3" fill="#ef4444"/>
    </svg>\`;
  }
  if (w.includes('factory') || w.includes('industry')) {
    return \`<svg viewBox="0 0 100 80" class="w-full h-full">
      <polygon points="15,68 15,35 35,50 35,35 55,50 55,35 75,50 75,68" fill="#475569"/>
      <rect x="75" y="20" width="12" height="48" fill="#334155"/>
      <rect x="25" y="55" width="8" height="13" fill="#fef08a"/>
      <rect x="45" y="55" width="8" height="13" fill="#fef08a"/>
      <circle cx="81" cy="12" r="5" fill="#cbd5e1"/>
    </svg>\`;
  }

  // Science / Nature / Ecology
  if (w.includes('plant') || w.includes('tree') || w.includes('agriculture') || w.includes('leaf')) {
    return \`<svg viewBox="0 0 100 80" class="w-full h-full">
      <path d="M50,70 L50,30" stroke="#78350f" stroke-width="4"/>
      <path d="M50,45 Q70,35 68,20 Q50,25 50,45" fill="#16a34a"/>
      <path d="M50,40 Q30,30 32,15 Q50,20 50,40" fill="#22c55e"/>
    </svg>\`;
  }

  // Generic Modern Academic Badge SVG for any other noun
  const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'];
  const charCode = w.charCodeAt(0) || 65;
  const color = colors[charCode % colors.length];

  return \`<svg viewBox="0 0 100 80" class="w-full h-full">
    <rect x="12" y="10" width="76" height="60" rx="10" fill="\${color}" opacity="0.15" stroke="\${color}" stroke-width="1.8"/>
    <circle cx="50" cy="36" r="18" fill="\${color}"/>
    <text x="50" y="44" font-size="20" font-family="Inter, sans-serif" font-weight="900" fill="#ffffff" text-anchor="middle">
      \${w.charAt(0).toUpperCase()}
    </text>
    <rect x="28" y="58" width="44" height="6" rx="3" fill="\${color}" opacity="0.4"/>
  </svg>\`;
}

function getPhotoUrl(word) {
  if (!word) return null;
  const clean = String(word).trim().toLowerCase().replace(/\\s+/g, '_');
  if (REALIA_PHOTOS[clean]) return REALIA_PHOTOS[clean];
  if (REALIA_PHOTOS[clean.replace(/s$/, '')]) return REALIA_PHOTOS[clean.replace(/s$/, '')];
  return getRealiaPhoto(word);
}

function renderPoster(data) {
  if (!data) return;
  const meta = data.metadata || {};
  const ling = data.linguistic_competence || {};

  // 1. Metadata rendering
  document.getElementById('meta-inst').textContent = meta.institution || "REPÚBLICA DE PANAMÁ · MEDUCA";
  document.getElementById('meta-prog').textContent = meta.program || "EDUGEN PRO · ENFOQUE AOA";
  document.getElementById('meta-title').textContent = \`SCENARIO #\${meta.scenario_number || 1}: \${(meta.scenario_title || '').toUpperCase()}\`;
  document.getElementById('meta-grade').textContent = \`Grade: \${meta.grade || ''}\`;
  document.getElementById('meta-cefr').textContent = \`CEFR: \${meta.cefr_level || ''}\`;

  // 2. Nouns Grid rendering
  const nounsGrid = document.getElementById('nouns-grid');
  nounsGrid.innerHTML = '';

  const nounsList = ling.nouns || [];
  document.getElementById('nouns-count-badge').textContent = \`\${nounsList.length} Target Words\`;

  nounsList.forEach(item => {
    const word = item.word || String(item);
    const trans = item.translation || '';
    const phon = item.phonetic || '';
    const photoUrl = getPhotoUrl(word);
    const svgIcon = getVectorSvgForNoun(word);

    const card = document.createElement('div');
    card.className = "bg-white border-2 border-slate-200 hover:border-blue-500 rounded-xl p-2 flex flex-col items-center text-center shadow-2xs transition group";
    
    let visualHtml = '';
    if (visualMode === 'photo' && photoUrl) {
      visualHtml = \`
        <div class="w-full h-16 sm:h-20 rounded-lg p-0 mb-1.5 flex items-center justify-center overflow-hidden realia-img-container shadow-inner border border-slate-100">
          <img src="\${photoUrl}" alt="\${escapeHtml(word)}" class="realia-photo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
          <div class="w-full h-full p-1 hidden items-center justify-center">
            \${svgIcon}
          </div>
        </div>
      \`;
    } else {
      visualHtml = \`
        <div class="w-full h-16 sm:h-20 bg-slate-50 rounded-lg p-1 mb-1.5 flex items-center justify-center overflow-hidden">
          \${svgIcon}
        </div>
      \`;
    }

    card.innerHTML = \`
      \${visualHtml}
      <div class="text-[11px] sm:text-xs font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-700">
        \${escapeHtml(word)}
      </div>
      <div class="text-[9px] text-slate-500 font-semibold truncate max-w-full">
        \${escapeHtml(trans)} \${phon ? \`<span class="italic text-slate-400 font-normal">\${escapeHtml(phon)}</span>\` : ''}
      </div>
    \`;
    nounsGrid.appendChild(card);
  });

  // Action Goal card if 11 items
  if (nounsList.length === 11) {
    const extraCard = document.createElement('div');
    extraCard.className = "bg-amber-50 border-2 border-dashed border-amber-300 rounded-xl p-2 flex flex-col justify-center items-center text-center shadow-2xs";
    extraCard.innerHTML = \`
      <span class="text-lg mb-0.5">🎯</span>
      <span class="text-[10px] font-black text-amber-950 uppercase tracking-wide">Action Goal</span>
      <span class="text-[9px] text-amber-900 leading-tight">Master and connect all target vocabulary in your final task!</span>
    \`;
    nounsGrid.appendChild(extraCard);
  }

  // 3. Verbs rendering
  const verbsContainer = document.getElementById('verbs-container');
  const verbs = ling.verbs || [];
  document.getElementById('verbs-count').textContent = \`\${verbs.length} Verbs\`;
  verbsContainer.innerHTML = verbs.map(v => \`
    <span class="bg-white border border-sky-300 text-sky-950 text-xs font-bold px-2.5 py-1 rounded-lg shadow-2xs hover:bg-sky-100 transition">
      \${escapeHtml(v)}
    </span>
  \`).join('');

  // 4. Adjectives rendering
  const adjContainer = document.getElementById('adj-container');
  const adjs = ling.adjectives || [];
  document.getElementById('adj-count').textContent = \`\${adjs.length} Adjectives\`;
  adjContainer.innerHTML = adjs.map(a => \`
    <span class="bg-white border border-emerald-300 text-emerald-950 text-xs font-bold px-2.5 py-1 rounded-lg shadow-2xs hover:bg-emerald-100 transition">
      \${escapeHtml(a)}
    </span>
  \`).join('');

  // 5. Grammar Competences rendering
  const grammarContainer = document.getElementById('grammar-container');
  const grammarList = ling.grammar || [];
  grammarContainer.innerHTML = grammarList.map(rule => \`
    <div class="bg-white border border-indigo-200/80 rounded-lg p-2 text-xs text-indigo-950 shadow-2xs flex items-start gap-2">
      <span class="text-indigo-600 font-extrabold mt-0.5">⚡</span>
      <span class="leading-relaxed font-semibold">\${escapeHtml(rule)}</span>
    </div>
  \`).join('');

  // 6. Numbers & Interrogatives rendering
  document.getElementById('num-range-text').textContent = ling.numbers || '1 to 100';
  document.getElementById('num-subtext').textContent = ling.numbers_subtext || '';

  const interrContainer = document.getElementById('interr-container');
  const questions = ling.interrogatives || [];
  interrContainer.innerHTML = questions.map(q => \`
    <span class="bg-white border border-rose-300 text-rose-950 text-[11px] font-bold px-2 py-0.5 rounded-md shadow-2xs">
      \${escapeHtml(q)}
    </span>
  \`).join('');

  // 7. Dialogue rendering
  const dialogueBox = document.getElementById('dialogue-box');
  const dialogue = data.dialogue || [];
  dialogueBox.innerHTML = dialogue.map(d => \`
    <p>
      <strong class="\${d.speaker.includes('A') ? 'text-blue-700' : 'text-emerald-700'} font-sans font-bold">
        \${escapeHtml(d.speaker)}:
      </strong>
      "\${escapeHtml(d.text)}"
    </p>
  \`).join('');
}

// Grade files mapping for live in-browser switching across all 14 grades (112 scenarios)
const GRADE_FILES = {
  'Pre-K': 'English_Curriculum_Prekinder.json',
  'Kinder': 'English_Curriculum_Kinder.json',
  '1st Grade': 'English_Curriculum_Grade_1.json',
  '2nd Grade': 'English_Curriculum_Grade_2.json',
  '3rd Grade': 'English_Curriculum_Grade_3.json',
  '4th Grade': 'English_Curriculum_Grade_4.json',
  '5th Grade': 'English_Curriculum_Grade_5.json',
  '6th Grade': 'English_Curriculum_Grade_6.json',
  '7th Grade': 'English_Curriculum_Grade_7.json',
  '8th Grade': 'English_Curriculum_Grade_8.json',
  '9th Grade': 'English_Curriculum_Grade_9.json',
  '10th Grade': 'English_Curriculum_Grade_10.json',
  '11th Grade': 'English_Curriculum_Grade_11.json',
  '12th Grade': 'English_Curriculum_Grade_12.json'
};

let currentGrade = "${escapeXml(grade)}";
let activeScenariosList = ALL_SCENARIOS;
const gradeScenariosCache = { [currentGrade]: ALL_SCENARIOS };

async function onGradeChange(newGrade) {
  currentGrade = newGrade;
  if (gradeScenariosCache[newGrade]) {
    updateScenarioList(gradeScenariosCache[newGrade], newGrade);
  } else {
    try {
      const resp = await fetch('/curriculums/' + GRADE_FILES[newGrade]);
      if (!resp.ok) throw new Error('Error al cargar currículo');
      const data = await resp.json();
      const rawScenarios = data.scenarios || [];
      const parsedList = rawScenarios.map((sc, i) => clientExtractScenario(sc, newGrade, i, data.proficiency_level));
      gradeScenariosCache[newGrade] = parsedList;
      updateScenarioList(parsedList, newGrade);
    } catch (err) {
      console.warn('Fallback loading grade scenarios:', err);
    }
  }
}

function updateScenarioList(scenarios, gradeLabel) {
  activeScenariosList = scenarios;
  const sel = document.getElementById('scenario-selector');
  sel.innerHTML = scenarios.map((sc, i) => \`
    <option value="\${i}">#\${sc.metadata.scenario_number}: \${escapeHtml(sc.metadata.scenario_title)}</option>
  \`).join('');
  switchScenario(0);
}

function switchScenario(index) {
  const selected = activeScenariosList[Number(index)];
  if (!selected) return;
  currentScenarioData = selected;
  renderPoster(currentScenarioData);
}

function clientExtractScenario(scenario, grade, scenarioIndex, cefr) {
  const scenarioTitle = scenario.title || scenario.scenarioName || scenario.scenario_title || scenario.name || ('Scenario ' + (scenarioIndex + 1));
  const scenarioNum = scenario.id || scenario.scenarioNum || scenario.scenario_number || (scenarioIndex + 1);
  const cefrLevel = cefr || scenario.level || scenario.cefr_level || scenario.proficiency_level || (grade.includes('12') ? 'B1+' : 'A1');

  let grammarRules = [];
  if (Array.isArray(scenario.linguistic_competences) && scenario.linguistic_competences.length > 0) {
    grammarRules = scenario.linguistic_competences;
  } else if (scenario.communicative_competences?.linguistic_competences?.recommended_grammatical_features) {
    const gf = scenario.communicative_competences.linguistic_competences.recommended_grammatical_features;
    grammarRules = Array.isArray(gf) ? gf : [gf];
  } else if (Array.isArray(scenario.grammar) && scenario.grammar.length > 0) {
    grammarRules = scenario.grammar;
  } else if (scenario.grammar_focus) {
    grammarRules = Array.isArray(scenario.grammar_focus) ? scenario.grammar_focus : [scenario.grammar_focus];
  }
  if (!grammarRules.length) {
    grammarRules = ["Present Simple for core communication", "Active listening and response formulas"];
  }

  const vocabSource = scenario.recommended_vocabulary ||
                      scenario.communicative_competences?.linguistic_competences?.recommended_vocabulary ||
                      scenario.communicative_competences?.vocabulary ||
                      scenario.vocabulary || {};

  let rawNouns = vocabSource.nouns || vocabSource.noun || [];
  if (typeof rawNouns === 'string') rawNouns = rawNouns.split(',').map(s => s.trim()).filter(Boolean);

  let rawVerbs = vocabSource.verbs || vocabSource.verb || [];
  if (typeof rawVerbs === 'string') rawVerbs = rawVerbs.split(',').map(s => s.trim()).filter(Boolean);

  let rawAdjs = vocabSource.adjectives || vocabSource.adjective || [];
  if (typeof rawAdjs === 'string') rawAdjs = rawAdjs.split(',').map(s => s.trim()).filter(Boolean);

  let rawAdverbs = vocabSource.adverbs_of_frequency || vocabSource.adverbs || vocabSource.prepositions || ["always", "often", "carefully"];
  if (typeof rawAdverbs === 'string') rawAdverbs = rawAdverbs.split(',').map(s => s.trim()).filter(Boolean);

  let rawQuestions = vocabSource.question_words || vocabSource.interrogatives || ["What...?", "How...?"];
  if (typeof rawQuestions === 'string') rawQuestions = rawQuestions.split(',').map(s => s.trim()).filter(Boolean);

  const processedNouns = rawNouns.map(n => ({
    word: typeof n === 'object' ? (n.word || '') : String(n).trim(),
    translation: typeof n === 'object' ? (n.translation || '') : String(n).trim(),
    phonetic: typeof n === 'object' ? (n.phonetic || '') : ''
  })).slice(0, 11);

  const nounA = processedNouns[0]?.word || "topic";
  const nounB = processedNouns[1]?.word || "project";
  const verbA = rawVerbs[0] || "practice";

  return {
    metadata: {
      institution: "REPÚBLICA DE PANAMÁ · MINISTERIO DE EDUCACIÓN (MEDUCA)",
      program: "EDUGEN PRO · ENFOQUE AOA (" + grade + ")",
      grade: grade,
      cefr_level: cefrLevel,
      scenario_number: scenarioNum,
      scenario_title: scenarioTitle
    },
    linguistic_competence: {
      grammar: grammarRules,
      nouns: processedNouns.length ? processedNouns : [{ word: "project", translation: "proyecto", phonetic: "" }],
      verbs: rawVerbs.slice(0, 12),
      adjectives: rawAdjs.slice(0, 8),
      adverbs: rawAdverbs,
      interrogatives: rawQuestions,
      numbers: grade.includes('Kinder') || grade.includes('Pre-K') ? "1 to 10" : grade.includes('12') ? "100 to 1,000,000+" : "1 to 100",
      numbers_subtext: "Calibrated to " + grade + " curricular standards."
    },
    dialogue: [
      { speaker: "Student A", text: "Can we " + verbA + " the " + nounA + " for our lesson?" },
      { speaker: "Student B", text: "Yes! Let's examine the " + nounB + " together in pairs." },
      { speaker: "Student A", text: "How many items do we need for this task?" },
      { speaker: "Student B", text: "We have all required materials ready to share." }
    ]
  };
}

function toggleVisualMode() {
  visualMode = visualMode === 'photo' ? 'vector' : 'photo';
  const label = document.getElementById('visual-mode-label');
  const desc = document.getElementById('visual-mode-description');
  const btn = document.getElementById('btn-toggle-visual');

  if (visualMode === 'photo') {
    label.textContent = "Fotos Reales";
    desc.textContent = "Fotografía Realia HD con respaldo vectorial SVG inmediato (Cero enlaces rotos)";
    btn.className = "px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-sm transition flex items-center gap-1.5 cursor-pointer";
  } else {
    label.textContent = "Ilustración Vectorial";
    desc.textContent = "Vectores SVG nativos de ultra-precisión institucional (Cero dependencias externas)";
    btn.className = "px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-sm transition flex items-center gap-1.5 cursor-pointer";
  }

  renderPoster(currentScenarioData);
}

function togglePosterFormat() {
  currentFormatIsTabloid = !currentFormatIsTabloid;
  const root = document.getElementById('poster-root');
  const btn = document.getElementById('btn-toggle-format');

  if (currentFormatIsTabloid) {
    root.classList.remove('max-w-5xl');
    root.classList.add('max-w-6xl');
    document.body.classList.add('format-tabloid');
    btn.textContent = "Formato: Tabloide (11×17)";
  } else {
    root.classList.remove('max-w-6xl');
    root.classList.add('max-w-5xl');
    document.body.classList.remove('format-tabloid');
    btn.textContent = "Formato: Carta (8.5×11)";
  }
}

function openJsonModal() {
  document.getElementById('json-textarea').value = JSON.stringify(currentScenarioData, null, 2);
  document.getElementById('json-modal').classList.remove('hidden');
}

function closeJsonModal() {
  document.getElementById('json-modal').classList.add('hidden');
}

function applyCustomJson() {
  const text = document.getElementById('json-textarea').value;
  try {
    const parsed = JSON.parse(text);
    currentScenarioData = parsed;
    renderPoster(currentScenarioData);
    closeJsonModal();
  } catch (err) {
    const fb = document.getElementById('json-feedback');
    fb.textContent = \`Error de sintaxis JSON: \${err.message}\`;
    fb.className = "text-xs font-bold text-red-600";
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

window.addEventListener('DOMContentLoaded', () => {
  renderPoster(currentScenarioData);
});
</script>

</body>
</html>`;
}

function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
