// Linguistic Poster Studio for Panama MEDUCA AOA Curriculum
// Generates high-impact linguistic wall posters with dual-mode illustrations:
// 1) High-definition Realia Photography (curated Unsplash assets)
// 2) Procedural Vector Realia SVGs (zero-dependency, infinite sharpness, zero broken links)
// Format toggle: Letter (8.5x11") & Tabloid (11x17")
// Live JSON editor & preset selector for Pre-K to 12th Grade

import { REALIA_PHOTOS, getRealiaPhoto } from './realiaCatalog.js';

export const NOUN_REALIA_MAP = {
  market: REALIA_PHOTOS.market || 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80',
  price: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
  shopping_list: REALIA_PHOTOS.shopping_list || 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?auto=format&fit=crop&w=600&q=80',
  item: REALIA_PHOTOS.item || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
  store: REALIA_PHOTOS.store || 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=600&q=80',
  cost: REALIA_PHOTOS.cost || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80',
  pineapple: REALIA_PHOTOS.pineapple || 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=600&q=80',
  cashier: REALIA_PHOTOS.cashier || 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=600&q=80',
  money: REALIA_PHOTOS.dollar || 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=600&q=80',
  cassava: REALIA_PHOTOS.yuca || 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80',
  potatoes: REALIA_PHOTOS.potatoes || 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
  
  // Classroom objects
  book: REALIA_PHOTOS.book || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
  desk: REALIA_PHOTOS.desk || 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80',
  chair: REALIA_PHOTOS.chair || 'https://images.unsplash.com/photo-1580481077198-c8075423e3e8?auto=format&fit=crop&w=600&q=80',
  bag: REALIA_PHOTOS.bag || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
  pencil: REALIA_PHOTOS.pencil || 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80',
  crayon: REALIA_PHOTOS.crayon || 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80',

  // Canal & safety objects
  lock: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80',
  tugboat: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=600&q=80',
  helmet: 'https://images.unsplash.com/photo-1578873375969-d71e3c84717f?auto=format&fit=crop&w=600&q=80',
  life_vest: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
  radio: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80',
  ship: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=600&q=80'
};

export function getPosterRealiaUrl(word) {
  if (!word) return null;
  const key = String(word).trim().toLowerCase().replace(/\s+/g, '_');
  if (NOUN_REALIA_MAP[key]) return NOUN_REALIA_MAP[key];
  return getRealiaPhoto(word) || null;
}

/**
 * Builds the complete self-contained HTML for the Linguistic Poster Studio.
 * Includes Tailwind CDN, Google Fonts, full SVG library, real photo fallbacks,
 * interactive JSON editor, preset switcher, and print stylesheets.
 */
export function linguisticPosterStudioHtml(activeScenario = null, grade = '7th Grade', scenarioIndex = 0, cefr = 'A1+') {
  // Construct default scenario payload if active scenario provided
  const scenarioTitle = activeScenario?.scenarioName || activeScenario?.scenario_title || activeScenario?.title || 'At the Local Market: Buying Fresh Food';
  const scenarioNum = activeScenario?.scenarioNum || activeScenario?.scenarioNumber || (scenarioIndex + 1);

  // Extract vocabulary if available from active scenario
  let initialNouns = null;
  let initialVerbs = null;
  let initialAdjs = null;

  if (activeScenario) {
    const vocab = activeScenario.vocabulary || activeScenario.linguistic_competence?.nouns;
    if (Array.isArray(vocab) && vocab.length > 0) {
      initialNouns = vocab.map(v => typeof v === 'object' ? v : { word: String(v), translation: '', phonetic: '' });
    }
    const verbs = activeScenario.verbs || activeScenario.linguistic_competence?.verbs;
    if (Array.isArray(verbs) && verbs.length > 0) initialVerbs = verbs;
    const adjs = activeScenario.adjectives || activeScenario.linguistic_competence?.adjectives;
    if (Array.isArray(adjs) && adjs.length > 0) initialAdjs = adjs;
  }

  const dynamicInitialPayload = {
    metadata: {
      institution: "REPÚBLICA DE PANAMÁ · MINISTERIO DE EDUCACIÓN (MEDUCA)",
      program: "EDUGEN PRO · ENFOQUE AOA",
      grade: grade,
      cefr_level: cefr || "A1+ / A2",
      scenario_number: scenarioNum,
      scenario_title: scenarioTitle
    },
    linguistic_competence: {
      nouns: initialNouns || [
        { word: "market", translation: "mercado", phonetic: "/ˈmɑːrkɪt/" },
        { word: "price", translation: "precio", phonetic: "/praɪs/" },
        { word: "shopping list", translation: "lista de compras", phonetic: "/ˈʃɒpɪŋ lɪst/" },
        { word: "item", translation: "artículo", phonetic: "/ˈaɪtəm/" },
        { word: "store", translation: "tienda", phonetic: "/stɔːr/" },
        { word: "cost", translation: "costo", phonetic: "/kɒst/" },
        { word: "pineapple", translation: "piña", phonetic: "/ˈpaɪnæpəl/" },
        { word: "cashier", translation: "cajero/a", phonetic: "/kæˈʃɪər/" },
        { word: "money", translation: "dinero", phonetic: "/ˈmʌni/" },
        { word: "cassava", translation: "yuca", phonetic: "/kəˈsɑːvə/" },
        { word: "potatoes", translation: "papas", phonetic: "/pəˈteɪtoʊz/" }
      ],
      verbs: initialVerbs || ["buy", "sell", "ask", "pay", "choose", "compare", "need", "want", "get", "cost", "help"],
      adjectives: initialAdjs || ["cheap", "fresh", "expensive", "delicious", "ripe"],
      adverbs: ["quickly", "easily", "often"],
      interrogatives: ["How much...?", "How many...?"],
      numbers: "1 to 100 (Counting, Prices & Change in USD / Balboas)"
    }
  };

  const initialJsonStr = JSON.stringify(dynamicInitialPayload, null, 2);
  const realiaMapJsonStr = JSON.stringify(NOUN_REALIA_MAP, null, 2);

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
    /* Institutional poster border */
    .poster-outer-frame {
      border: 5px solid #1e3a8a;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    }
    .poster-inner-frame {
      border: 2px solid #f59e0b;
    }
    /* Realia image styling */
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
    /* Print-specific layout rules for wall posters */
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
            MEDUCA Panamá
          </span>
        </div>
        <p class="text-xs text-blue-200">
          Afiches de Competencia Lingüística · Fotos Reales y Vectores en área de Sustantivos
        </p>
      </div>
    </div>

    <!-- Quick action controls -->
    <div class="flex items-center flex-wrap gap-2">
      <!-- Real Photo vs Vector SVG Toggle -->
      <button onclick="toggleVisualMode()" id="btn-toggle-visual" class="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-sm transition flex items-center gap-1.5">
        <span>📸</span> <span id="visual-mode-label">Fotos Reales</span>
      </button>
      
      <!-- JSON Modal -->
      <button onclick="openJsonModal()" class="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition flex items-center gap-1.5">
        <span>⚙️</span> Editar JSON Escenario
      </button>

      <!-- Format Toggle: Letter vs Tabloid -->
      <button onclick="togglePosterFormat()" id="btn-toggle-format" class="px-3 py-1.5 rounded-xl bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold border border-blue-600 transition">
        Formato: Carta (8.5×11)
      </button>

      <!-- Print Button -->
      <button onclick="window.print()" class="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md transition flex items-center gap-1.5 cursor-pointer">
        🖨️ Imprimir / Guardar PDF
      </button>
    </div>
  </div>
</header>

<section class="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-4 pb-1 no-print">
  <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
    <div class="flex flex-wrap items-center gap-3">
      <label class="text-xs font-extrabold uppercase text-slate-600 tracking-wide flex items-center gap-1.5">
        <span>📚</span> Seleccionar Escenario Curricular:
      </label>
      <select id="scenario-selector" onchange="loadScenarioPreset(this.value)" class="text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:border-blue-600 outline-none">
        <option value="active" selected>🎯 Escenario Activo · ${escapeXml(scenarioTitle)} (${grade})</option>
        <option value="market_7th">7mo Grado · Escenario #3: At the Local Market (Mercado, Frutas & Precios)</option>
        <option value="classroom_kinder">Kindergarten · Escenario #1: Where Is It? (Objetos de Aula & Preposiciones)</option>
        <option value="canal_9th">9no Grado · Escenario #4: Panama Canal Technical Safety & Equipment</option>
      </select>
    </div>

    <div class="text-[11px] text-slate-600 font-medium flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
      <span id="visual-mode-description">Fotografía Realia HD con respaldo vectorial SVG inmediato (Cero enlaces rotos)</span>
    </div>
  </div>
</section>

<!-- JSON EDIT MODAL -->
<div id="json-modal" class="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 hidden flex items-center justify-center p-4 no-print">
  <div class="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
    <div class="flex justify-between items-center border-b border-slate-100 pb-3">
      <div>
        <h3 class="text-base font-black text-slate-900">Editor de Datos JSON del Escenario</h3>
        <p class="text-xs text-slate-500">Pega o modifica la estructura curricular de cualquier grado (Pre-K a 12°)</p>
      </div>
      <button onclick="closeJsonModal()" class="text-slate-400 hover:text-slate-700 text-lg font-bold">✕</button>
    </div>

    <textarea id="json-textarea" rows="14" class="w-full text-xs font-mono p-3 bg-slate-900 text-emerald-400 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed"></textarea>

    <div class="flex justify-between items-center pt-2">
      <div id="json-feedback" class="text-xs font-bold text-slate-500">JSON sintácticamente válido</div>
      <div class="flex gap-2">
        <button onclick="closeJsonModal()" class="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition">Cancelar</button>
        <button onclick="applyCustomJson()" class="px-4 py-2 text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white rounded-xl shadow-xs transition">
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
          SCENARIO #${scenarioNum}: ${escapeXml(scenarioTitle)}
        </h2>

        <div class="flex flex-wrap items-center justify-center gap-2 pt-0.5 text-xs font-bold">
          <span id="meta-grade" class="bg-blue-50 text-blue-900 border border-blue-200 px-2.5 py-0.5 rounded-md">
            Grade: ${escapeXml(grade)}
          </span>
          <span id="meta-cefr" class="bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-0.5 rounded-md">
            CEFR: ${escapeXml(cefr || 'A1+ / A2')}
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
              Section 1: Illustrated Nouns (Sustantivos en Acción) · Realia & Target Words
            </h3>
          </div>
          <span id="nouns-count-badge" class="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
            11 Target Words
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
            <span id="verbs-count" class="text-[10px] bg-white/20 px-2 py-0.2 rounded font-bold">11 Verbs</span>
          </div>
          <div class="p-3">
            <div id="verbs-container" class="flex flex-wrap gap-1.5">
              <!-- Verbs chips inserted here -->
            </div>
          </div>
        </div>

        <!-- Descriptive Adjectives Box -->
        <div class="border border-emerald-300 bg-emerald-50/40 rounded-xl overflow-hidden shadow-2xs">
          <div class="bg-emerald-600 text-white px-3 py-1.5 flex items-center justify-between">
            <h3 class="text-xs font-black uppercase tracking-wide flex items-center gap-1.5">
              <span>✨</span> Descriptive Adjectives (Cualidades)
            </h3>
            <span id="adj-count" class="text-[10px] bg-white/20 px-2 py-0.2 rounded font-bold">5 Adjectives</span>
          </div>
          <div class="p-3">
            <div id="adj-container" class="flex flex-wrap gap-1.5">
              <!-- Adjectives chips inserted here -->
            </div>
          </div>
        </div>

      </section>

      <!-- SECTION 4: ADVERBS, INTERROGATIVES & NUMERICAL RANGE -->
      <section class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        <!-- Adverbs -->
        <div class="border border-purple-200 bg-purple-50/40 rounded-xl overflow-hidden shadow-2xs">
          <div class="bg-purple-700 text-white px-3 py-1 text-xs font-black uppercase tracking-wide flex items-center gap-1.5">
            <span>⏱</span> Adverbs of Frequency & Manner
          </div>
          <div class="p-2.5">
            <div id="adverbs-container" class="flex flex-wrap gap-1.5">
              <!-- Adverbs chips -->
            </div>
          </div>
        </div>

        <!-- Key Interrogatives -->
        <div class="border border-amber-200 bg-amber-50/40 rounded-xl overflow-hidden shadow-2xs">
          <div class="bg-amber-600 text-white px-3 py-1 text-xs font-black uppercase tracking-wide flex items-center gap-1.5">
            <span>❓</span> Interrogatives (Preguntas Clave)
          </div>
          <div class="p-2.5 space-y-1 text-xs text-amber-950 font-bold" id="interr-container">
            <!-- Interrogatives lines -->
          </div>
        </div>

        <!-- Numbers & Prices -->
        <div class="border border-rose-200 bg-rose-50/40 rounded-xl overflow-hidden shadow-2xs">
          <div class="bg-rose-700 text-white px-3 py-1 text-xs font-black uppercase tracking-wide flex items-center gap-1.5">
            <span>🔢</span> Numbers & Prices
          </div>
          <div class="p-2.5 text-xs text-slate-800 space-y-1">
            <div class="font-extrabold text-rose-900" id="num-range-text">Range: 1 to 100</div>
            <p class="text-[11px] text-slate-600 leading-snug" id="num-subtext">
              Used for counting pounds, asking unit costs, and receiving change in Balboas / USD ($).
            </p>
          </div>
        </div>

      </section>

      <!-- SECTION 5: AUTHENTIC CLASSROOM ACTION TASK & MINI-DIALOGUE -->
      <section class="border-2 border-dashed border-slate-300 bg-slate-50/70 rounded-xl p-3 text-xs space-y-1.5">
        <div class="flex items-center justify-between">
          <span class="font-black text-blue-950 uppercase tracking-wide flex items-center gap-1.5">
            <span>🗣</span> Authentic Classroom Action Task (AOA Role-Play Practice):
          </span>
          <span class="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded" id="task-badge">
            Pair Dialogue & Realia Interaction
          </span>
        </div>

        <div id="dialogue-box" class="space-y-1 text-[11.5px] font-mono text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 leading-relaxed">
          <p><strong class="text-blue-700 font-sans font-bold">Student A (Customer / Traveler):</strong> "Good morning! How much is the ripe pineapple and the fresh cassava?"</p>
          <p><strong class="text-emerald-700 font-sans font-bold">Student B (Cashier / Clerk):</strong> "The pineapple costs $2.00 and the cassava is $1.50 per pound. How many items do you need?"</p>
          <p><strong class="text-blue-700 font-sans font-bold">Student A:</strong> "I want two pineapples and three pounds of potatoes, please. Can I pay quickly in cash?"</p>
          <p><strong class="text-emerald-700 font-sans font-bold">Student B:</strong> "Of course! That will be $8.50 total. Here is your receipt and change. Have a nice day!"</p>
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
/**
 * Procedural SVG Illustration Engine for Nouns:
 * Zero external dependencies, infinite scaling, sharp on any projector or printed paper.
 */
const NOUN_SVGS = {
  market: \`
    <svg viewBox="0 0 100 80" class="w-full h-full">
      <!-- Wooden Stall Counter -->
      <rect x="12" y="42" width="76" height="30" rx="3" fill="#b45309" stroke="#78350f" stroke-width="1.5"/>
      <rect x="16" y="46" width="68" height="22" fill="#d97706"/>
      <line x1="16" y1="57" x2="84" y2="57" stroke="#92400e" stroke-width="1.5"/>
      <!-- Fruit Baskets -->
      <circle cx="28" cy="40" r="7" fill="#f97316" stroke="#c2410c" stroke-width="1"/>
      <circle cx="38" cy="38" r="6" fill="#ea580c" stroke="#c2410c" stroke-width="1"/>
      <circle cx="50" cy="39" r="6.5" fill="#ef4444" stroke="#b91c1c" stroke-width="1"/>
      <circle cx="62" cy="38" r="6" fill="#eab308" stroke="#a16207" stroke-width="1"/>
      <circle cx="72" cy="40" r="7" fill="#f97316" stroke="#c2410c" stroke-width="1"/>
      <!-- Support Poles -->
      <rect x="14" y="20" width="4" height="24" fill="#78350f"/>
      <rect x="82" y="20" width="4" height="24" fill="#78350f"/>
      <!-- Striped Red & White Canopy -->
      <polygon points="8,10 92,10 96,24 4,24" fill="#dc2626"/>
      <polygon points="19,10 30,10 28,24 17,24" fill="#ffffff"/>
      <polygon points="41,10 52,10 50,24 39,24" fill="#ffffff"/>
      <polygon points="63,10 74,10 72,24 61,24" fill="#ffffff"/>
      <polygon points="85,10 92,10 96,24 83,24" fill="#ffffff"/>
      <!-- Wavy Valance -->
      <path d="M4,24 Q10,29 16,24 Q22,29 28,24 Q34,29 40,24 Q46,29 52,24 Q58,29 64,24 Q70,29 76,24 Q82,29 88,24 Q93,29 96,24" fill="none" stroke="#b91c1c" stroke-width="2"/>
    </svg>
  \`,
  price: \`
    <svg viewBox="0 0 100 80" class="w-full h-full">
      <!-- Twine String -->
      <path d="M25,10 C45,6 55,24 35,26" fill="none" stroke="#b45309" stroke-width="2"/>
      <!-- Hanging Price Tag -->
      <polygon points="28,24 78,24 88,40 88,70 28,70" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
      <!-- Eyelet -->
      <circle cx="36" cy="47" r="6" fill="#ffffff" stroke="#a16207" stroke-width="1.5"/>
      <circle cx="36" cy="47" r="2.5" fill="#78350f"/>
      <!-- Tag Text -->
      <text x="50" y="48" font-size="16" font-family="Inter, sans-serif" font-weight="900" fill="#15803d">$</text>
      <text x="61" y="48" font-size="16" font-family="Inter, sans-serif" font-weight="900" fill="#166534">2.50</text>
      <rect x="47" y="54" width="34" height="10" rx="2" fill="#dc2626"/>
      <text x="50" y="62" font-size="6.5" font-family="Inter, sans-serif" font-weight="900" fill="#ffffff">OFFER</text>
    </svg>
  \`,
  shopping_list: \`
    <svg viewBox="0 0 100 80" class="w-full h-full">
      <!-- Notepad Sheet -->
      <rect x="18" y="8" width="54" height="66" rx="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
      <!-- Blue Notepad Header -->
      <rect x="18" y="8" width="54" height="12" rx="3" fill="#3b82f6"/>
      <!-- Checkbox Rows -->
      <rect x="24" y="26" width="7" height="7" rx="1.5" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
      <path d="M25,30 L27,32 L30,27" fill="none" stroke="#16a34a" stroke-width="1.5"/>
      <line x1="35" y1="30" x2="64" y2="30" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
      <rect x="24" y="38" width="7" height="7" rx="1.5" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
      <path d="M25,42 L27,44 L30,39" fill="none" stroke="#16a34a" stroke-width="1.5"/>
      <line x1="35" y1="42" x2="60" y2="42" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
      <rect x="24" y="50" width="7" height="7" rx="1.5" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
      <path d="M25,54 L27,56 L30,51" fill="none" stroke="#16a34a" stroke-width="1.5"/>
      <line x1="35" y1="54" x2="63" y2="54" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
      <!-- Pencil -->
      <g transform="translate(68, 16) rotate(32)">
        <polygon points="0,0 6,0 6,32 0,32" fill="#f59e0b" stroke="#b45309" stroke-width="0.8"/>
        <polygon points="0,32 6,32 3,38" fill="#fed7aa"/>
        <polygon points="2,36 4,36 3,38" fill="#0f172a"/>
        <rect x="0" y="-5" width="6" height="5" rx="1" fill="#f472b6"/>
      </g>
    </svg>
  \`,
  item: \`
    <svg viewBox="0 0 100 80" class="w-full h-full">
      <!-- Items inside basket -->
      <rect x="26" y="16" width="12" height="30" rx="2" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.2"/>
      <circle cx="48" cy="28" r="11" fill="#eab308" stroke="#a16207" stroke-width="1.2"/>
      <rect x="62" y="14" width="13" height="32" rx="2" fill="#ef4444" stroke="#b91c1c" stroke-width="1.2"/>
      <!-- Grocery Basket Body -->
      <polygon points="14,36 86,36 78,72 22,72" fill="#dc2626" stroke="#b91c1c" stroke-width="2"/>
      <line x1="28" y1="36" x2="33" y2="72" stroke="#fecaca" stroke-width="1.5"/>
      <line x1="42" y1="36" x2="44" y2="72" stroke="#fecaca" stroke-width="1.5"/>
      <line x1="58" y1="36" x2="56" y2="72" stroke="#fecaca" stroke-width="1.5"/>
      <line x1="72" y1="36" x2="67" y2="72" stroke="#fecaca" stroke-width="1.5"/>
      <line x1="18" y1="52" x2="82" y2="52" stroke="#fecaca" stroke-width="1.5"/>
      <!-- Silver Metal Handle -->
      <path d="M22,36 C22,12 78,12 78,36" fill="none" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  \`,
  store: \`
    <svg viewBox="0 0 100 80" class="w-full h-full">
      <!-- Building Main Wall -->
      <rect x="14" y="16" width="72" height="58" rx="3" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5"/>
      <!-- Green Marquee Awning -->
      <rect x="10" y="12" width="80" height="18" rx="3" fill="#10b981" stroke="#059669" stroke-width="1.5"/>
      <text x="28" y="25" font-size="10" font-family="Inter, sans-serif" font-weight="900" fill="#ffffff" letter-spacing="2">STORE</text>
      <!-- Glass Display Windows -->
      <rect x="19" y="36" width="18" height="26" rx="2" fill="#e0f2fe" stroke="#38bdf8" stroke-width="1.2"/>
      <line x1="19" y1="49" x2="37" y2="49" stroke="#bae6fd" stroke-width="1"/>
      <rect x="63" y="36" width="18" height="26" rx="2" fill="#e0f2fe" stroke="#38bdf8" stroke-width="1.2"/>
      <line x1="63" y1="49" x2="81" y2="49" stroke="#bae6fd" stroke-width="1"/>
      <!-- Double Glass Entrance Door -->
      <rect x="41" y="38" width="18" height="36" rx="1.5" fill="#bae6fd" stroke="#0284c7" stroke-width="1.5"/>
      <line x1="50" y1="38" x2="50" y2="74" stroke="#0284c7" stroke-width="1.5"/>
      <circle cx="47" cy="56" r="1.5" fill="#d97706"/>
      <circle cx="53" cy="56" r="1.5" fill="#d97706"/>
    </svg>
  \`,
  cost: \`
    <svg viewBox="0 0 100 80" class="w-full h-full">
      <!-- Paper Receipt Slip -->
      <rect x="16" y="10" width="46" height="62" rx="2" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
      <line x1="22" y1="18" x2="56" y2="18" stroke="#94a3b8" stroke-width="1.5"/>
      <line x1="22" y1="26" x2="50" y2="26" stroke="#94a3b8" stroke-width="1.5"/>
      <line x1="22" y1="34" x2="56" y2="34" stroke="#94a3b8" stroke-width="1.5"/>
      <line x1="22" y1="42" x2="48" y2="42" stroke="#94a3b8" stroke-width="1.5"/>
      <line x1="20" y1="48" x2="58" y2="48" stroke="#dc2626" stroke-width="1.5"/>
      <text x="22" y="58" font-size="7" font-family="Inter, sans-serif" font-weight="900" fill="#dc2626">TOTAL</text>
      <text x="22" y="66" font-size="7" font-family="Inter, sans-serif" font-weight="900" fill="#15803d">$14.50</text>
      <!-- Stack of Gold Coins -->
      <ellipse cx="76" cy="62" rx="14" ry="6" fill="#d97706"/>
      <ellipse cx="76" cy="59" rx="14" ry="5.5" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <ellipse cx="76" cy="53" rx="14" ry="6" fill="#d97706"/>
      <ellipse cx="76" cy="50" rx="14" ry="5.5" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <ellipse cx="76" cy="44" rx="14" ry="6" fill="#d97706"/>
      <ellipse cx="76" cy="41" rx="14" ry="5.5" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <text x="73" y="44" font-size="7" font-family="Inter, sans-serif" font-weight="900" fill="#b45309">$</text>
    </svg>
  \`,
  pineapple: \`
    <svg viewBox="0 0 100 80" class="w-full h-full">
      <!-- Spiky Green Crown Leaves -->
      <polygon points="50,6 40,24 45,22 34,14 42,28 58,28 66,14 55,22 60,24" fill="#16a34a" stroke="#15803d" stroke-width="1"/>
      <!-- Oval Golden Pineapple Body -->
      <ellipse cx="50" cy="50" rx="22" ry="24" fill="#f59e0b" stroke="#b45309" stroke-width="1.8"/>
      <!-- Crosshatch Textured Scales -->
      <path d="M35,36 L65,64 M35,64 L65,36 M30,48 L70,48 M50,28 L50,72" stroke="#d97706" stroke-width="1.5"/>
      <circle cx="43" cy="42" r="1.5" fill="#b45309"/>
      <circle cx="57" cy="42" r="1.5" fill="#b45309"/>
      <circle cx="50" cy="50" r="1.8" fill="#b45309"/>
      <circle cx="43" cy="58" r="1.5" fill="#b45309"/>
      <circle cx="57" cy="58" r="1.5" fill="#b45309"/>
    </svg>
  \`,
  cashier: \`
    <svg viewBox="0 0 100 80" class="w-full h-full">
      <!-- Cashier Person -->
      <circle cx="38" cy="22" r="12" fill="#fed7aa" stroke="#d97706" stroke-width="1.2"/>
      <path d="M26,18 C26,8 50,8 50,18" fill="#4c1d95"/>
      <circle cx="34" cy="21" r="1.3" fill="#1e293b"/>
      <circle cx="42" cy="21" r="1.3" fill="#1e293b"/>
      <path d="M35,26 Q38,29 41,26" fill="none" stroke="#b91c1c" stroke-width="1"/>
      <polygon points="26,34 50,34 54,64 22,64" fill="#2563eb" stroke="#1d4ed8" stroke-width="1.2"/>
      <rect x="33" y="38" width="10" height="8" fill="#ffffff" rx="1"/>
      <rect x="10" y="54" width="80" height="22" rx="2" fill="#475569"/>
      <rect x="52" y="36" width="34" height="24" rx="2" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5"/>
      <rect x="56" y="40" width="26" height="9" rx="1" fill="#10b981"/>
      <text x="59" y="47" font-size="6" font-family="monospace" font-weight="900" fill="#ffffff">$4.50</text>
      <rect x="57" y="52" width="5" height="4" fill="#64748b" rx="0.5"/>
      <rect x="64" y="52" width="5" height="4" fill="#64748b" rx="0.5"/>
      <rect x="71" y="52" width="5" height="4" fill="#64748b" rx="0.5"/>
    </svg>
  \`,
  money: \`
    <svg viewBox="0 0 100 80" class="w-full h-full">
      <g transform="translate(48,34) rotate(-14) translate(-48,-34)">
        <rect x="12" y="16" width="62" height="34" rx="3" fill="#bbf7d0" stroke="#22c55e" stroke-width="1.5"/>
      </g>
      <rect x="14" y="24" width="66" height="36" rx="3" fill="#dcfce7" stroke="#16a34a" stroke-width="1.8"/>
      <rect x="18" y="28" width="58" height="28" rx="2" fill="none" stroke="#4ade80" stroke-width="1"/>
      <circle cx="47" cy="42" r="9" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.2"/>
      <text x="44" y="46" font-size="12" font-family="Inter, sans-serif" font-weight="900" fill="#15803d">$</text>
      <text x="21" y="36" font-size="7" font-family="Inter, sans-serif" font-weight="900" fill="#15803d">20</text>
      <text x="64" y="53" font-size="7" font-family="Inter, sans-serif" font-weight="900" fill="#15803d">20</text>
      <circle cx="76" cy="52" r="14" fill="#fbbf24" stroke="#d97706" stroke-width="1.8"/>
      <circle cx="76" cy="52" r="10" fill="none" stroke="#f59e0b" stroke-width="1"/>
      <text x="72" y="56" font-size="11" font-family="Inter, sans-serif" font-weight="900" fill="#b45309">1</text>
    </svg>
  \`,
  cassava: \`
    <svg viewBox="0 0 100 80" class="w-full h-full">
      <path d="M12,46 Q24,34 56,36 Q84,40 88,52 Q76,64 48,60 Q22,60 12,46 Z" fill="#78350f" stroke="#451a03" stroke-width="1.8"/>
      <path d="M26,40 Q29,46 25,52 M42,38 Q45,45 40,54 M60,40 Q63,47 58,54" stroke="#b45309" stroke-width="1.5" stroke-linecap="round"/>
      <ellipse cx="74" cy="48" rx="14" ry="17" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
      <ellipse cx="74" cy="48" rx="11" ry="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
      <circle cx="74" cy="48" r="2.5" fill="#cbd5e1"/>
      <line x1="74" y1="44" x2="74" y2="52" stroke="#94a3b8" stroke-width="1"/>
    </svg>
  \`,
  potatoes: \`
    <svg viewBox="0 0 100 80" class="w-full h-full">
      <ellipse cx="32" cy="46" rx="20" ry="16" fill="#d97706" stroke="#92400e" stroke-width="1.5"/>
      <path d="M24,42 Q28,45 25,47" stroke="#78350f" stroke-width="1.5" stroke-linecap="round"/>
      <ellipse cx="68" cy="42" rx="22" ry="17" fill="#f59e0b" stroke="#b45309" stroke-width="1.5"/>
      <ellipse cx="50" cy="54" rx="24" ry="18" fill="#fbbf24" stroke="#b45309" stroke-width="1.8"/>
      <path d="M42,48 Q46,51 43,53" stroke="#92400e" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M58,52 Q62,55 59,57" stroke="#92400e" stroke-width="1.8" stroke-linecap="round"/>
    </svg>
  \`,
  // Kindergarten classroom objects
  book: \`
    <svg viewBox="0 0 100 80" class="w-full h-full">
      <path d="M15,22 Q50,30 85,22 L85,62 Q50,70 15,62 Z" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.8"/>
      <path d="M50,28 L50,68" stroke="#1e293b" stroke-width="2"/>
      <path d="M18,25 Q50,32 50,32 L50,66 Q18,60 18,25 Z" fill="#ffffff"/>
      <path d="M82,25 Q50,32 50,32 L50,66 Q82,60 82,25 Z" fill="#f8fafc"/>
      <line x1="24" y1="36" x2="44" y2="38" stroke="#94a3b8" stroke-width="1.5"/>
      <line x1="24" y1="44" x2="44" y2="46" stroke="#94a3b8" stroke-width="1.5"/>
      <line x1="56" y1="38" x2="76" y2="36" stroke="#94a3b8" stroke-width="1.5"/>
    </svg>
  \`,
  desk: \`
    <svg viewBox="0 0 100 80" class="w-full h-full">
      <polygon points="15,35 85,35 75,25 25,25" fill="#d97706" stroke="#92400e" stroke-width="1.5"/>
      <rect x="18" y="35" width="64" height="8" fill="#b45309"/>
      <rect x="22" y="43" width="6" height="30" fill="#475569"/>
      <rect x="72" y="43" width="6" height="30" fill="#475569"/>
      <rect x="30" y="43" width="40" height="18" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1"/>
    </svg>
  \`,
  chair: \`
    <svg viewBox="0 0 100 80" class="w-full h-full">
      <rect x="30" y="15" width="40" height="30" rx="3" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5"/>
      <polygon points="25,45 75,45 70,55 30,55" fill="#2563eb"/>
      <rect x="28" y="55" width="5" height="22" fill="#64748b"/>
      <rect x="67" y="55" width="5" height="22" fill="#64748b"/>
    </svg>
  \`,
  bag: \`
    <svg viewBox="0 0 100 80" class="w-full h-full">
      <path d="M38,20 C38,10 62,10 62,20" fill="none" stroke="#dc2626" stroke-width="3"/>
      <rect x="25" y="20" width="50" height="52" rx="10" fill="#ef4444" stroke="#b91c1c" stroke-width="1.8"/>
      <rect x="33" y="42" width="34" height="22" rx="4" fill="#dc2626" stroke="#991b1b" stroke-width="1.2"/>
      <line x1="42" y1="42" x2="58" y2="42" stroke="#fbbf24" stroke-width="2"/>
    </svg>
  \`,
  pencil: \`
    <svg viewBox="0 0 100 80" class="w-full h-full">
      <g transform="translate(15, 40) rotate(-35)">
        <polygon points="0,0 60,0 60,12 0,12" fill="#f59e0b" stroke="#b45309" stroke-width="1.2"/>
        <polygon points="60,0 72,6 60,12" fill="#fed7aa"/>
        <polygon points="68,4 72,6 68,8" fill="#0f172a"/>
        <rect x="-10" y="0" width="10" height="12" rx="2" fill="#f472b6"/>
        <line x1="10" y1="4" x2="50" y2="4" stroke="#fbbf24" stroke-width="1.5"/>
      </g>
    </svg>
  \`,
  crayon: \`
    <svg viewBox="0 0 100 80" class="w-full h-full">
      <g transform="translate(20, 45) rotate(-30)">
        <rect x="0" y="0" width="55" height="16" rx="2" fill="#8b5cf6" stroke="#6d28d9" stroke-width="1.2"/>
        <polygon points="55,0 70,8 55,16" fill="#7c3aed"/>
        <rect x="15" y="0" width="25" height="16" fill="#1e1b4b"/>
        <circle cx="27" cy="8" r="4" fill="#a78bfa"/>
      </g>
    </svg>
  \`,
  // Canal safety objects
  lock: \`
    <svg viewBox="0 0 100 80" class="w-full h-full">
      <rect x="10" y="20" width="20" height="50" fill="#475569" stroke="#1e293b" stroke-width="1.5"/>
      <rect x="70" y="20" width="20" height="50" fill="#475569" stroke="#1e293b" stroke-width="1.5"/>
      <rect x="30" y="45" width="40" height="25" fill="#0284c7"/>
      <polygon points="30,30 50,45 50,65 30,50" fill="#b91c1c"/>
      <polygon points="70,30 50,45 50,65 70,50" fill="#991b1b"/>
    </svg>
  \`,
  tugboat: \`
    <svg viewBox="0 0 100 80" class="w-full h-full">
      <path d="M15,50 Q20,68 50,68 Q80,68 85,50 Z" fill="#dc2626" stroke="#991b1b" stroke-width="1.5"/>
      <rect x="30" y="32" width="30" height="18" rx="2" fill="#f8fafc" stroke="#64748b" stroke-width="1.2"/>
      <rect x="52" y="22" width="6" height="10" fill="#1e293b"/>
      <rect x="35" y="36" width="6" height="6" fill="#38bdf8"/>
      <rect x="45" y="36" width="6" height="6" fill="#38bdf8"/>
    </svg>
  \`,
  helmet: \`
    <svg viewBox="0 0 100 80" class="w-full h-full">
      <path d="M22,50 C22,25 78,25 78,50 Z" fill="#eab308" stroke="#ca8a04" stroke-width="2"/>
      <path d="M16,50 L84,50 Q84,56 50,56 Q16,56 16,50 Z" fill="#ca8a04"/>
      <rect x="46" y="26" width="8" height="24" rx="2" fill="#fef08a"/>
    </svg>
  \`,
  life_vest: \`
    <svg viewBox="0 0 100 80" class="w-full h-full">
      <polygon points="25,18 42,18 45,65 20,65" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/>
      <polygon points="75,18 58,18 55,65 80,65" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/>
      <line x1="43" y1="36" x2="57" y2="36" stroke="#1e293b" stroke-width="3"/>
      <line x1="44" y1="48" x2="56" y2="48" stroke="#1e293b" stroke-width="3"/>
      <rect x="25" y="28" width="17" height="6" fill="#ffffff"/>
      <rect x="58" y="28" width="17" height="6" fill="#ffffff"/>
    </svg>
  \`,
  radio: \`
    <svg viewBox="0 0 100 80" class="w-full h-full">
      <rect x="30" y="24" width="40" height="48" rx="4" fill="#334155" stroke="#0f172a" stroke-width="1.8"/>
      <rect x="38" y="8" width="5" height="16" fill="#1e293b"/>
      <rect x="36" y="32" width="28" height="14" rx="2" fill="#10b981"/>
      <circle cx="50" cy="58" r="8" fill="#1e293b"/>
      <line x1="45" y1="58" x2="55" y2="58" stroke="#64748b" stroke-width="1.5"/>
    </svg>
  \`,
  ship: \`
    <svg viewBox="0 0 100 80" class="w-full h-full">
      <polygon points="10,50 90,50 82,68 18,68" fill="#1e293b" stroke="#0f172a" stroke-width="1.5"/>
      <rect x="25" y="34" width="14" height="16" fill="#dc2626"/>
      <rect x="42" y="34" width="14" height="16" fill="#2563eb"/>
      <rect x="59" y="34" width="14" height="16" fill="#16a34a"/>
      <rect x="65" y="22" width="16" height="28" fill="#f8fafc" stroke="#94a3b8" stroke-width="1"/>
      <line x1="6" y1="62" x2="94" y2="62" stroke="#38bdf8" stroke-width="2"/>
    </svg>
  \`
};

// Curated Realia Photography dictionary
const REALIA_PHOTOS = ${realiaMapJsonStr};

const SCENARIO_PRESETS = {
  active: ${initialJsonStr},
  market_7th: {
    metadata: {
      institution: "REPÚBLICA DE PANAMÁ · MINISTERIO DE EDUCACIÓN (MEDUCA)",
      program: "EDUGEN PRO · ENFOQUE AOA",
      grade: "7th Grade (Pre-Media)",
      cefr_level: "A1+ / A2",
      scenario_number: 3,
      scenario_title: "At the Local Market: Buying Fresh Food"
    },
    linguistic_competence: {
      nouns: [
        { word: "market", translation: "mercado", phonetic: "/ˈmɑːrkɪt/" },
        { word: "price", translation: "precio", phonetic: "/praɪs/" },
        { word: "shopping list", translation: "lista de compras", phonetic: "/ˈʃɒpɪŋ lɪst/" },
        { word: "item", translation: "artículo", phonetic: "/ˈaɪtəm/" },
        { word: "store", translation: "tienda", phonetic: "/stɔːr/" },
        { word: "cost", translation: "costo", phonetic: "/kɒst/" },
        { word: "pineapple", translation: "piña", phonetic: "/ˈpaɪnæpəl/" },
        { word: "cashier", translation: "cajero/a", phonetic: "/kæˈʃɪər/" },
        { word: "money", translation: "dinero", phonetic: "/ˈmʌni/" },
        { word: "cassava", translation: "yuca", phonetic: "/kəˈsɑːvə/" },
        { word: "potatoes", translation: "papas", phonetic: "/pəˈteɪtoʊz/" }
      ],
      verbs: ["buy", "sell", "ask", "pay", "choose", "compare", "need", "want", "get", "cost", "help"],
      adjectives: ["cheap", "fresh", "expensive", "delicious", "ripe"],
      adverbs: ["quickly", "easily", "often"],
      interrogatives: ["How much...?", "How many...?"],
      numbers: "1 to 100 (Counting, Prices & Change in USD / Balboas)"
    }
  },
  classroom_kinder: {
    metadata: {
      institution: "REPÚBLICA DE PANAMÁ · MINISTERIO DE EDUCACIÓN (MEDUCA)",
      program: "EDUGEN PRO · ENFOQUE AOA INICIAL",
      grade: "Kindergarten (Inicial)",
      cefr_level: "Pre-A1 Receptivo",
      scenario_number: 1,
      scenario_title: "Where Is It? My Classroom Objects"
    },
    linguistic_competence: {
      nouns: [
        { word: "book", translation: "libro", phonetic: "/bʊk/" },
        { word: "desk", translation: "pupitre/mesa", phonetic: "/dɛsk/" },
        { word: "chair", translation: "silla", phonetic: "/tʃɛər/" },
        { word: "bag", translation: "mochila", phonetic: "/bæɡ/" },
        { word: "pencil", translation: "lápiz", phonetic: "/ˈpɛnsəl/" },
        { word: "crayon", translation: "crayón", phonetic: "/ˈkreɪɒn/" }
      ],
      verbs: ["point", "touch", "look", "listen", "show", "open", "find"],
      adjectives: ["big", "small", "clean", "red", "blue", "yellow"],
      adverbs: ["here", "there", "slowly"],
      interrogatives: ["Where is...?", "What color...?"],
      numbers: "1 to 10 (Counting classroom objects)"
    }
  },
  canal_9th: {
    metadata: {
      institution: "REPÚBLICA DE PANAMÁ · MINISTERIO DE EDUCACIÓN (MEDUCA)",
      program: "EDUGEN PRO · ENFOQUE AOA TÉCNICO",
      grade: "9th Grade (Pre-Media)",
      cefr_level: "A2+",
      scenario_number: 4,
      scenario_title: "Panama Canal Operations & Technical Safety"
    },
    linguistic_competence: {
      nouns: [
        { word: "lock", translation: "esclusa", phonetic: "/lɒk/" },
        { word: "tugboat", translation: "remolcador", phonetic: "/ˈtʌɡboʊt/" },
        { word: "helmet", translation: "casco protector", phonetic: "/ˈhɛlmɪt/" },
        { word: "life vest", translation: "chaleco salvavidas", phonetic: "/ˈlaɪf vɛst/" },
        { word: "radio", translation: "radio transmisor", phonetic: "/ˈreɪdioʊ/" },
        { word: "ship", translation: "buque de carga", phonetic: "/ʃɪp/" }
      ],
      verbs: ["operate", "inspect", "navigate", "secure", "coordinate", "monitor", "report"],
      adjectives: ["safe", "heavy", "deep", "protective", "maritime", "operational"],
      adverbs: ["carefully", "safely", "constantly"],
      interrogatives: ["Which route...?", "What protocol...?"],
      numbers: "100 to 50,000 (Tonnage & Channel Dimensions)"
    }
  }
};

let currentScenarioData = JSON.parse(JSON.stringify(SCENARIO_PRESETS.active));
let visualMode = 'photo'; // 'photo' | 'vector'
let currentFormatIsTabloid = false;

function getRealiaPhotoUrl(word) {
  if (!word) return null;
  const key = String(word).trim().toLowerCase().replace(/\\s+/g, '_');
  if (REALIA_PHOTOS[key]) return REALIA_PHOTOS[key];
  if (key === 'yuca') return REALIA_PHOTOS.cassava;
  if (key === 'potato') return REALIA_PHOTOS.potatoes;
  if (key === 'shopping_list' || key === 'shopping list') return REALIA_PHOTOS.shopping_list;
  return null;
}

function renderPoster(data) {
  const meta = data.metadata || {};
  const ling = data.linguistic_competence || {};

  // 1. Metadata rendering
  document.getElementById('meta-inst').textContent = meta.institution || "REPÚBLICA DE PANAMÁ · MINISTERIO DE EDUCACIÓN (MEDUCA)";
  document.getElementById('meta-prog').textContent = meta.program || "EDUGEN PRO · ENFOQUE AOA";
  document.getElementById('meta-title').textContent = \`SCENARIO #\${meta.scenario_number || 1}: \${(meta.scenario_title || 'COMMUNICATION').toUpperCase()}\`;
  document.getElementById('meta-grade').textContent = \`Grade: \${meta.grade || '7th Grade'}\`;
  document.getElementById('meta-cefr').textContent = \`CEFR: \${meta.cefr_level || 'A1 / A2'}\`;

  // 2. Illustrated Nouns rendering
  const nounsGrid = document.getElementById('nouns-grid');
  nounsGrid.innerHTML = '';

  const nounsList = ling.nouns || [];
  document.getElementById('nouns-count-badge').textContent = \`\${nounsList.length} Target Words\`;

  nounsList.forEach(noun => {
    const word = typeof noun === 'object' ? (noun.word || '') : String(noun);
    const trans = typeof noun === 'object' ? (noun.translation || '') : '';
    const phon = typeof noun === 'object' ? (noun.phonetic || '') : '';

    const key = word.trim().toLowerCase().replace(/\\s+/g, '_');
    const svgIcon = NOUN_SVGS[key] || NOUN_SVGS.item || \`<svg viewBox="0 0 100 80"><circle cx="50" cy="40" r="20" fill="#3b82f6"/></svg>\`;
    const photoUrl = getRealiaPhotoUrl(word);

    const card = document.createElement('div');
    card.className = "bg-white border-2 border-slate-200 hover:border-blue-500 rounded-xl p-2 flex flex-col items-center text-center shadow-2xs transition group";
    
    let visualHtml = '';
    if (visualMode === 'photo' && photoUrl) {
      // Photo with SVG fallback on error
      visualHtml = \`
        <div class="w-full h-16 sm:h-20 rounded-lg p-0 mb-1.5 flex items-center justify-center overflow-hidden realia-img-container shadow-inner border border-slate-100">
          <img src="\${photoUrl}" alt="\${escapeHtml(word)}" class="realia-photo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
          <div class="w-full h-full p-1 hidden items-center justify-center">
            \${svgIcon}
          </div>
        </div>
      \`;
    } else {
      // Vector SVG
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

  // Action reinforcement badge if 11 items to balance the grid
  if (nounsList.length === 11) {
    const extraCard = document.createElement('div');
    extraCard.className = "bg-amber-50 border-2 border-dashed border-amber-300 rounded-xl p-2 flex flex-col justify-center items-center text-center shadow-2xs";
    extraCard.innerHTML = \`
      <span class="text-lg mb-0.5">🎯</span>
      <span class="text-[10px] font-black text-amber-950 uppercase tracking-wide">Action Goal</span>
      <span class="text-[9px] text-amber-900 leading-tight">Order all items within a $15.00 classroom budget!</span>
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

  // 5. Adverbs rendering
  const advContainer = document.getElementById('adverbs-container');
  const advs = ling.adverbs || [];
  advContainer.innerHTML = advs.map(adv => \`
    <span class="bg-white border border-purple-300 text-purple-950 text-xs font-bold px-2.5 py-1 rounded-lg shadow-2xs">
      \${escapeHtml(adv)}
    </span>
  \`).join('');

  // 6. Interrogatives rendering
  const interrContainer = document.getElementById('interr-container');
  const interrs = ling.interrogatives || [];
  interrContainer.innerHTML = interrs.map(q => \`
    <div class="flex items-center gap-1.5">
      <span class="text-amber-600 font-extrabold">•</span>
      <span>\${escapeHtml(q)}</span>
    </div>
  \`).join('');

  // 7. Numbers rendering
  const numRange = ling.numbers || "1 to 100";
  document.getElementById('num-range-text').textContent = \`Range: \${numRange}\`;
}

function toggleVisualMode() {
  visualMode = visualMode === 'photo' ? 'vector' : 'photo';
  const label = document.getElementById('visual-mode-label');
  const desc = document.getElementById('visual-mode-description');
  const btn = document.getElementById('btn-toggle-visual');

  if (visualMode === 'photo') {
    label.textContent = "Fotos Reales";
    desc.textContent = "Fotografía Realia HD con respaldo vectorial SVG inmediato (Cero enlaces rotos)";
    btn.className = "px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-sm transition flex items-center gap-1.5";
  } else {
    label.textContent = "Ilustración Vectorial";
    desc.textContent = "Vectores SVG nativos de ultra-precisión institucional (Cero dependencias externas)";
    btn.className = "px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-sm transition flex items-center gap-1.5";
  }

  renderPoster(currentScenarioData);
}

function loadScenarioPreset(key) {
  const preset = SCENARIO_PRESETS[key];
  if (!preset) return;
  currentScenarioData = JSON.parse(JSON.stringify(preset));
  renderPoster(currentScenarioData);
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

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Initial hydration
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
