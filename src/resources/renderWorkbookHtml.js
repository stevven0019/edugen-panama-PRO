import { renderRealiaCardHtml, renderSpatialCardHtml, getRealiaPhoto } from './realiaCatalog.js';
import { getIllustrationSvg } from './illustrations.js';

function getScenarioThemeNoun(scenario, title) {
  const text = `${scenario || ''} ${title || ''}`.toLowerCase();
  if (/market|food|fruit|grocery|compras|tienda|comida|supermarket|price|vegetable|piña|yuca|mango/i.test(text)) {
    return 'MARKET & FOOD ITEMS';
  }
  if (/canal|ship|boat|waterway|transporte|mar|esclusa|puerto/i.test(text)) {
    return 'PANAMA CANAL & LOGISTICS ITEMS';
  }
  if (/animal|nature|fauna|wildlife|flora|rainforest|selva|biodiversity|bosque/i.test(text)) {
    return 'PANAMANIAN WILDLIFE & NATURE';
  }
  if (/community|city|neighborhood|barrio|pueblo|places|lugar|ciudad|comunidad/i.test(text)) {
    return 'COMMUNITY & CITY PLACES';
  }
  if (/health|body|doctor|salud|hospital|care|cuerpo/i.test(text)) {
    return 'HEALTH & WELL-BEING CONCEPTS';
  }
  if (/book|desk|chair|pencil|classroom|school|where\s*is|escuela|salon|aula/i.test(text)) {
    return 'CLASSROOM OBJECTS';
  }
  return 'TARGET SCENARIO ITEMS';
}

export function renderWorkbookHtml(pack) {
  const title = pack.title || 'English Activity Lesson';
  const cleanTitle = title.replace(/^Action Worksheet:\s*/i, '').replace(/["']/g, '');
  const isKinder = /kinder|pre-?k|early|inicial/i.test(pack.grade || '');
  const grade = pack.grade || (isKinder ? 'Kindergarten' : '4th Grade');
  const lessonNumber = pack.lessonNum || pack.lessonNumber || (pack.skill === 'Reading' ? 2 : pack.skill === 'Writing' ? 3 : pack.skill === 'Speaking' ? 4 : pack.skill === 'Mediation' ? 5 : 1);

  // Skill determination (1: Listening, 2: Reading, 3: Writing, 4: Speaking, 5: Mediation)
  let rawSkill = String(pack.skill || '').trim();
  if (!rawSkill || rawSkill === 'English' || rawSkill === 'AOA') {
    rawSkill = lessonNumber === 2 ? 'Reading' : lessonNumber === 3 ? 'Writing' : lessonNumber === 4 ? 'Speaking' : lessonNumber === 5 ? 'Mediation' : 'Listening';
  }
  const isReading = /read/i.test(rawSkill);
  const isWriting = /writ/i.test(rawSkill);
  const isSpeaking = /speak|oral/i.test(rawSkill);
  const isMediation = /mediat/i.test(rawSkill);
  const isListening = !isReading && !isWriting && !isSpeaking && !isMediation;
  const skillName = isReading ? 'Reading' : isWriting ? 'Writing' : isSpeaking ? 'Speaking' : isMediation ? 'Mediation' : 'Listening';

  const scenario = pack.scenario || pack.lessonTitle || (isKinder ? 'Where Is It?' : cleanTitle);
  const objective = pack.objective || 'Identify target vocabulary and communicative structures in real context.';

  // Fallbacks & data structures
  const page1 = pack.page1 || {};
  const page2 = pack.page2 || {};
  const page3 = pack.page3 || {};

  // Contextual theme noun
  const scenarioNoun = getScenarioThemeNoun(scenario, cleanTitle);

  // 1. Extract or synthesize Part 1 Realia Items (6 cards)
  let realiaItems = [];
  if (pack.actionWorksheet?.part1?.items?.length) {
    realiaItems = pack.actionWorksheet.part1.items.map(it => ({
      word: it.word || it.label,
      label: it.label || it.word,
      photoUrl: it.photoUrl || null
    }));
  } else if (page1.wordBank?.length && page1.wordBank[0]?.word?.toLowerCase() !== 'word 1') {
    realiaItems = page1.wordBank.map(it => ({
      word: it.word || it.label,
      label: it.label || it.word,
      photoUrl: it.photoUrl || null
    }));
  }

  // Authentic thematic fallback lists if empty
  const defaultClassroomWords = [
    { word: 'BOOK', label: 'BOOK' },
    { word: 'DESK', label: 'DESK' },
    { word: 'CHAIR', label: 'CHAIR' },
    { word: 'BAG', label: 'BAG' },
    { word: 'PENCIL', label: 'PENCIL' },
    { word: 'CRAYON', label: 'CRAYON' }
  ];

  const defaultMarketWords = [
    { word: 'PINEAPPLE', label: 'PINEAPPLE' },
    { word: 'YUCA', label: 'YUCA' },
    { word: 'MANGO', label: 'MANGO' },
    { word: 'DOLLAR', label: 'DOLLAR' },
    { word: 'PRICE', label: 'PRICE' },
    { word: 'MARKET', label: 'MARKET' }
  ];

  if (!realiaItems.length) {
    if (scenarioNoun.includes('MARKET')) {
      realiaItems = defaultMarketWords;
    } else if (isKinder || scenarioNoun.includes('CLASSROOM')) {
      realiaItems = defaultClassroomWords;
    } else {
      realiaItems = defaultMarketWords;
    }
  }
  while (realiaItems.length < 6) {
    realiaItems.push({ word: `ITEM ${realiaItems.length + 1}` });
  }
  realiaItems = realiaItems.slice(0, 6);

  // 2. Skill-Specific Part 1 Configuration
  let part1Title = `PART 1: LISTEN & POINT TO THE REAL ${scenarioNoun} (REALIA HOOK)`;
  let part1Badge = 'Receptive Vocabulary';
  let part1ActionCue = '[ Point Here 👆 ]';
  let part1Instruction = 'Listen carefully! When teacher says the word, point to the real photo on your paper and touch the real object or show the gesture!';

  if (isReading) {
    part1Title = `PART 1: READ & DECODE / VISUAL TEXT DECODING (${scenarioNoun})`;
    part1Badge = 'Reading Comprehension';
    part1ActionCue = '[ Read & Check 📖 ]';
    part1Instruction = 'Read each target word aloud. Examine the real photo and match the printed text label to the correct item in the scenario!';
  } else if (isWriting) {
    part1Title = `PART 1: ORTHOGRAPHIC TRACE & VOCABULARY LABELING (${scenarioNoun})`;
    part1Badge = 'Written Production';
    part1ActionCue = '[ Trace & Label ✍️ ]';
    part1Instruction = 'Look at the real photo. Trace each letter of the target word with your pencil and copy the label onto your practice sheet!';
  } else if (isSpeaking) {
    part1Title = `PART 1: ORAL RECOGNITION & PRONUNCIATION PRACTICE (${scenarioNoun})`;
    part1Badge = 'Spoken Fluency';
    part1ActionCue = '[ Say It Aloud 🗣️ ]';
    part1Instruction = "Work with your partner. Point to each real photo, pronounce the English word with clear intonation, and take turns asking: 'What is this?'";
  } else if (isMediation) {
    part1Title = `PART 1: VISUAL MEDIATION & CONCEPT CLARIFICATION (${scenarioNoun})`;
    part1Badge = 'Mediation Strategy';
    part1ActionCue = '[ Explain Meaning 🤝 ]';
    part1Instruction = 'Observe the real photo. Explain what the item represents in simple English to a teammate or visitor who needs guidance!';
  }

  // Override with AI custom instructions if present
  if (pack.actionWorksheet?.part1?.title) part1Title = pack.actionWorksheet.part1.title;
  if (pack.actionWorksheet?.part1?.badge) part1Badge = pack.actionWorksheet.part1.badge;
  if (pack.actionWorksheet?.part1?.actionCue) part1ActionCue = pack.actionWorksheet.part1.actionCue;
  if (pack.actionWorksheet?.part1?.teacherInstruction) part1Instruction = pack.actionWorksheet.part1.teacherInstruction;

  // 3. Skill-Specific Part 2 Configuration & Items
  let part2Title = `PART 2: AUDITORY ACCURACY CHECK · "TRUE OR FALSE? SHOW YOUR THUMB!"`;
  let part2Badge = 'Accuracy of Listening';
  let part2Prompt = 'Teacher reads a statement about the photo. If what you hear matches the picture, mark YES ( 👍 ). If FALSE, mark NO ( 👎 )!';

  if (isReading) {
    part2Title = `PART 2: READING COMPREHENSION · "TRUE OR FALSE? READ & VERIFY!"`;
    part2Badge = 'Reading Accuracy';
    part2Prompt = 'Read each short sentence carefully. Compare the text with the photo. If the sentence is TRUE according to the scenario, mark YES ( 👍 ). If FALSE, mark NO ( 👎 )!';
  } else if (isWriting) {
    part2Title = `PART 2: WRITTEN VERIFICATION · "CHECK & COMPLETE THE RECORD!"`;
    part2Badge = 'Written Accuracy';
    part2Prompt = 'Read the statement and inspect the photo. Verify the written information and mark YES ( 👍 ) or NO ( 👎 ) on your report!';
  } else if (isSpeaking) {
    part2Title = `PART 2: COMMUNICATIVE INQUIRY · "ASK & ANSWER IN PAIRS!"`;
    part2Badge = 'Interaction Check';
    part2Prompt = "Partner A asks the inquiry question. Partner B looks at the card and answers. If answered correctly and fluently, mark YES ( 👍 )!";
  } else if (isMediation) {
    part2Title = `PART 2: INTERPERSONAL MEDIATION · "RELAY THE MESSAGE CLEARLY!"`;
    part2Badge = 'Collaborative Accuracy';
    part2Prompt = 'Read the situation. Mediate the information in simple English for your peer. Verify if the explanation was understood: mark YES ( 👍 ) or NO ( 👎 )!';
  } else if (isKinder || /preposition|where\s*is/i.test(`${scenario} ${cleanTitle}`)) {
    part2Title = `PART 2: VISUAL PREPOSITION CHECK · "TRUE OR FALSE? SHOW YOUR THUMB!"`;
    part2Prompt = 'Teacher says a statement and shows the photo. If it is TRUE, mark YES ( 👍 ). If it is FALSE, mark NO ( 👎 )!';
  }

  if (pack.actionWorksheet?.part2?.title) part2Title = pack.actionWorksheet.part2.title;
  if (pack.actionWorksheet?.part2?.badge) part2Badge = pack.actionWorksheet.part2.badge;
  if (pack.actionWorksheet?.part2?.teacherPrompt) part2Prompt = pack.actionWorksheet.part2.teacherPrompt;

  // Extract or synthesize Part 2 Items (4 cards)
  let prepositionItems = [];
  if (pack.actionWorksheet?.part2?.items?.length) {
    prepositionItems = pack.actionWorksheet.part2.items;
  } else {
    if (isKinder || /where\s*is|preposition/i.test(`${scenario} ${cleanTitle}`)) {
      prepositionItems = [
        { concept: 'ON', relation: 'on', sentence: 'The book is ON the desk.', subject: 'book', reference: 'desk' },
        { concept: 'UNDER', relation: 'under', sentence: 'The bag is UNDER the chair.', subject: 'bag', reference: 'chair' },
        { concept: 'IN', relation: 'in', sentence: 'The pencil is IN the bag.', subject: 'pencil', reference: 'bag' },
        { concept: 'NEXT TO', relation: 'next_to', sentence: 'The crayon is NEXT TO the book.', subject: 'crayon', reference: 'book' }
      ];
    } else if (scenarioNoun.includes('MARKET')) {
      prepositionItems = [
        { concept: 'PRICE CHECK', relation: 'on', sentence: 'The fresh pineapple costs two dollars and fifty cents.', subject: 'pineapple', reference: 'market' },
        { concept: 'ROOT VEGETABLE', relation: 'in', sentence: 'Yuca is a fresh root vegetable sold at the market stand.', subject: 'yuca', reference: 'market' },
        { concept: 'TROPICAL FRUIT', relation: 'on', sentence: 'The yellow mango is ripe, sweet, and ready to eat.', subject: 'mango', reference: 'market' },
        { concept: 'CURRENCY', relation: 'next_to', sentence: 'We use dollars and cents to pay the grocery vendor.', subject: 'dollar', reference: 'market' }
      ];
    } else {
      const w0 = realiaItems[0]?.word || 'item';
      const w1 = realiaItems[1]?.word || 'item';
      const w2 = realiaItems[2]?.word || 'item';
      const w3 = realiaItems[3]?.word || 'item';
      prepositionItems = [
        { concept: isReading ? 'READ & CHECK' : 'FEATURE 1', relation: 'on', sentence: `The ${w0.toLowerCase()} is clearly identified in our ${scenario}.`, subject: w0, reference: 'desk' },
        { concept: isReading ? 'READ & CHECK' : 'FEATURE 2', relation: 'in', sentence: `We explore the features of the ${w1.toLowerCase()} in the lesson.`, subject: w1, reference: 'desk' },
        { concept: isReading ? 'READ & CHECK' : 'FEATURE 3', relation: 'under', sentence: `The ${w2.toLowerCase()} is an essential part of today's task.`, subject: w2, reference: 'desk' },
        { concept: isReading ? 'READ & CHECK' : 'FEATURE 4', relation: 'next_to', sentence: `We use the ${w3.toLowerCase()} to complete our communicative goal.`, subject: w3, reference: 'desk' }
      ];
    }
  }

  // Teacher Guides & Page 2/3 Data
  const activity3 = page2.activity3 || {
    title: `Activity 3: Authentic Communicative Exchange (${skillName})`,
    instruction: 'Complete the interaction using words from the Word Bank below:',
    wordBank: realiaItems.slice(0, 4).map(w => w.word),
    dialogue: [
      { speaker: 'Role 1', text: `Hello! Today in our lesson about ${scenario}, we focus on ${realiaItems[0]?.word || 'our topic'}.` },
      { speaker: 'Role 2', text: `That is great! How do we use ${realiaItems[1]?.word || 'this item'} in real context?` },
      { speaker: 'Role 1', text: `We examine the key details and share our ideas with the class.` },
      { speaker: 'Role 2', text: `Excellent, let's complete the task together!` }
    ]
  };

  const activity4 = page2.activity4 || {
    title: `Activity 4: Performance Action Task (${cleanTitle})`,
    instruction: isReading
      ? 'Read the scenario prompt below. Highlight key items and answer the comprehension prompt:'
      : isWriting
      ? 'Write short sentences about the items in the scenario using the provided lines:'
      : 'Listen to the prompt. Draw your favorite item and write its name below:'
  };

  const exitTicket = page3.exitTicket || {
    title: 'Student Exit Ticket (Quick Check)',
    questions: [
      { prompt: `1. What is the target scenario of today's lesson?`, options: [`A) ${cleanTitle}`, 'B) Unrelated Topic'], correct: `A) ${cleanTitle}` },
      { prompt: `2. We practiced ${skillName.toLowerCase()} skills in ${scenario}.`, options: ['True', 'False'], correct: 'True' },
      { prompt: `3. Which item was highlighted in the activity?`, options: [`A) ${realiaItems[0]?.word || 'Concept'}`, 'B) None'], correct: `A) ${realiaItems[0]?.word || 'Concept'}` }
    ]
  };

  const teacherGuide = page3.teacherGuide || {
    title: 'Teacher Audio Scripts & Pedagogical Guide (MEDUCA AOA)',
    scripts: [
      { stage: `Stage 1 ${skillName} Hook`, text: `Teacher prompts: "Class, look at your worksheet! Focus on ${realiaItems[0]?.word || 'the first item'}. ${part1Instruction}"` },
      { stage: `Stage 2 ${skillName} Presentation`, text: `Teacher guides students through the target sentence: "${prepositionItems[0]?.sentence || 'Linguistic input modeling'}"` },
      { stage: 'Stage 4 Performance Action Task', text: `Teacher instructions: "In our scenario ${scenario}, apply your ${skillName.toLowerCase()} skills to complete the tangible deliverable."` }
    ],
    answerKey: [
      { item: `Part 1 (${skillName})`, answer: realiaItems.map((w, i) => `${i + 1}. ${w.word}`).join('  ·  ') },
      { item: `Part 2 (${skillName} Check)`, answer: prepositionItems.slice(0, 4).map((it, i) => `Item ${i + 1}: YES (👍)`).join('  ·  ') },
      { item: 'Activity 3 Exchange Cloze', answer: realiaItems.slice(0, 4).map(w => w.word).join(', ') },
      { item: 'Exit Ticket Quiz', answer: '1. A (Scenario)  ·  2. True  ·  3. A (Target Concept)' }
    ],
    rubric: pack.rubric || [
      {
        criterion: `${skillName} Competence & Target Vocabulary`,
        independent: 'Demonstrates complete comprehension and fluency without teacher prompts.',
        withSupport: 'Completes tasks with 1-2 prompts or visual cues.',
        emerging: 'Requires continuous modeling and direct assistance.'
      },
      {
        criterion: 'Task Accuracy & Contextual Verification',
        independent: 'Accurately discriminates target words and verification statements (90-100%).',
        withSupport: 'Completes verification with peer modeling or hints.',
        emerging: 'Identifies fewer than half the items correctly.'
      },
      {
        criterion: 'Action-Oriented Engagement (AOA Panama)',
        independent: 'Actively fulfills student role and completes the deliverable with autonomy.',
        withSupport: 'Participates with teacher encouragement.',
        emerging: 'Requires direct step-by-step supervision.'
      }
    ]
  };

  // Grade badge labels
  const gradeLevelCategory = isKinder
    ? 'Educación Inicial'
    : /1|2/i.test(grade)
    ? 'Primaria Baja'
    : /3|4/i.test(grade)
    ? 'Primaria Media'
    : /5|6/i.test(grade)
    ? 'Primaria Alta'
    : /7|8|9/i.test(grade)
    ? 'Pre-Media'
    : 'Educación Media';

  const skillsDetail = isKinder
    ? 'Receptive Listening & Non-Verbal Action (TPR)'
    : `${skillName} & Communicative Practice`;

  const skillPill = isKinder ? 'Listening & TPR' : `${skillName} · AOA`;

  // ══════════════════════════════════════════════════════════════════
  // TOP BAR & ALERT (Matching Image 1 exact preview aesthetics)
  // ══════════════════════════════════════════════════════════════════
  const topNavHtml = `
    <header class="bg-[#0b1329] text-white px-5 sm:px-8 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 print:hidden sticky top-0 z-50 shadow-lg">
      <div class="flex items-center gap-3.5">
        <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-base shadow-md select-none shrink-0">
          PA
        </div>
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <h1 class="text-sm sm:text-base font-extrabold text-white tracking-tight">
              AOA MEDUCA: "${cleanTitle}" (${grade} · Lesson ${lessonNumber})
            </h1>
            <span class="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 font-bold border border-emerald-500/40">
              ${skillPill}
            </span>
          </div>
          <p class="text-[11px] text-slate-400 mt-0.5 font-medium">
            Transformación curricular de Lesson Plan a Google Sheets & Fichas con Fotos Reales
          </p>
        </div>
      </div>
      <button onclick="window.print()" class="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition shadow-md shadow-blue-600/30 active:scale-95 cursor-pointer">
        <span>🖨️</span> Imprimir Ficha de Actividades (PDF)
      </button>
    </header>
  `;

  const alertBannerHtml = `
    <div class="max-w-[215mm] mx-auto mt-4 px-3 print:hidden">
      <div class="bg-[#edf5ff] border border-blue-200 text-slate-800 rounded-2xl p-3 sm:p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div class="flex items-center gap-3">
          <span class="text-xl shrink-0">🖨️</span>
          <p class="text-xs font-medium text-slate-700 leading-snug">
            Esta es la <strong>Ficha Concreta de Trabajo</strong> generada a partir de los datos del plan. Puedes imprimirla o guardarla como PDF en tamaño Carta con el botón superior.
          </p>
        </div>
        <button onclick="window.print()" class="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl whitespace-nowrap transition shadow-sm self-end sm:self-auto cursor-pointer">
          Imprimir Ficha
        </button>
      </div>
    </div>
  `;

  // ══════════════════════════════════════════════════════════════════
  // PAGE 1: THE ACTION WORKSHEET (FICHA CONCRETA DE TRABAJO)
  // ══════════════════════════════════════════════════════════════════
  const page1Html = `
    <div class="workbook-page bg-white p-7 sm:p-9 border border-slate-200 shadow-2xl rounded-3xl print:border-none print:shadow-none print:p-0 print:m-0 print:rounded-none max-w-[215mm] mx-auto text-slate-900 my-4">
      
      <!-- Institutional Top Header -->
      <div class="flex items-start justify-between gap-4 border-b border-slate-200 pb-3.5">
        <div>
          <div class="text-[10.5px] font-black uppercase tracking-wider text-slate-500 mb-1">
            REPÚBLICA DE PANAMÁ · MINISTERIO DE EDUCACIÓN (MEDUCA)
          </div>
          <h2 class="text-2xl sm:text-[26px] font-black text-slate-900 tracking-tight leading-snug">
            Action Worksheet: "${cleanTitle}"
          </h2>
          <p class="text-xs font-bold text-emerald-700 mt-1">
            ${grade} (${gradeLevelCategory}) · Skills: ${skillsDetail}
          </p>
        </div>

        <!-- Rounded Lesson & Scenario Box -->
        <div class="rounded-2xl bg-slate-50 border border-slate-200/90 px-4 py-2.5 text-right shrink-0">
          <div class="text-xs font-black text-slate-800">
            Lesson # ${lessonNumber} · 45-60 min
          </div>
          <div class="text-[11px] font-medium text-slate-500 mt-0.5">
            Scenario: "${scenario}"
          </div>
        </div>
      </div>

      <!-- Student Fill-in Info Bar -->
      <div class="py-2.5 flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-slate-800 border-b border-slate-200 mb-3">
        <div class="flex items-center gap-2 flex-1 min-w-[220px]">
          <span class="text-slate-600 font-extrabold uppercase text-[10.5px]">Student's Name:</span>
          <span class="border-b border-slate-400 flex-1 h-5"></span>
        </div>
        <div class="flex items-center gap-2 w-48">
          <span class="text-slate-600 font-extrabold uppercase text-[10.5px]">Date:</span>
          <span class="border-b border-slate-400 flex-1 h-5"></span>
        </div>
        <div class="flex items-center gap-1.5 shrink-0">
          <span class="text-slate-600 font-extrabold uppercase text-[10.5px]">Star Score:</span>
          <span class="text-amber-400 text-sm tracking-wider">⭐ ⭐ ⭐ ⭐ ⭐</span>
        </div>
      </div>

      <!-- PART 1: REALIA VOCABULARY HOOK (SKILL-ADAPTIVE) -->
      <section class="mt-2 mb-4">
        <div class="flex items-center justify-between gap-2 mb-1">
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
              A
            </span>
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-900">
              ${part1Title}
            </h3>
          </div>
          <span class="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700">
            ${part1Badge}
          </span>
        </div>

        <p class="text-[10.5px] text-slate-600 italic mb-2.5 font-medium leading-tight">
          <strong>Teacher instruction:</strong> "${part1Instruction}"
        </p>

        <!-- 6 Realia Photo Cards Grid -->
        <div class="grid grid-cols-6 gap-2">
          ${realiaItems.map((item, idx) => `
            <div class="border border-slate-200 rounded-2xl p-1.5 bg-white flex flex-col items-center justify-between text-center shadow-sm">
              <div class="w-full aspect-square rounded-xl overflow-hidden bg-slate-100 mb-1.5 flex items-center justify-center relative">
                ${renderRealiaCardHtml({
                  word: item.word,
                  label: item.label || item.word,
                  photoUrl: item.photoUrl
                })}
              </div>
              <span class="text-[11px] font-black text-slate-900 uppercase truncate w-full">
                ${idx + 1}. ${item.word}
              </span>
              <span class="mt-1 text-[9px] font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-md px-1 py-0.5 w-full">
                ${part1ActionCue}
              </span>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- PART 2: ACCURACY & COMPREHENSION CHECK (SKILL-ADAPTIVE) -->
      <section class="mt-3">
        <div class="flex items-center justify-between gap-2 mb-1">
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
              B
            </span>
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-900">
              ${part2Title}
            </h3>
          </div>
          <span class="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
            ${part2Badge}
          </span>
        </div>

        <p class="text-[10.5px] text-slate-600 italic mb-2.5 font-medium leading-tight">
          <strong>Teacher prompt:</strong> "${part2Prompt}"
        </p>

        <!-- 4 Concept Verification Cards Grid -->
        <div class="grid grid-cols-4 gap-2.5">
          ${prepositionItems.slice(0, 4).map((item, idx) => `
            <div class="border border-slate-200 rounded-2xl p-2 bg-white flex flex-col justify-between shadow-sm">
              <div class="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 mb-1.5 flex items-center justify-center relative">
                ${renderSpatialCardHtml({
                  relation: item.relation || item.concept || 'on',
                  subject: item.subject || 'book',
                  reference: item.reference || 'desk',
                  photoUrl: item.photoUrl
                })}
              </div>
              <div class="text-[10.5px] font-black text-indigo-900 mb-0.5">
                Item ${idx + 1}: [ ${String(item.concept || item.relation || 'CHECK').toUpperCase()} ]
              </div>
              <p class="text-[10px] italic text-slate-600 mb-2 leading-tight line-clamp-2">
                "${item.sentence || `The item is verified in the scenario.`}"
              </p>
              <div class="grid grid-cols-2 gap-1 text-[11px] font-extrabold">
                <div class="py-1 px-1 rounded-lg border border-emerald-500 bg-emerald-50 text-emerald-700 flex items-center justify-center gap-1 select-none">
                  👍 YES
                </div>
                <div class="py-1 px-1 rounded-lg border border-slate-300 bg-white text-slate-600 flex items-center justify-center gap-1 select-none">
                  👎 NO
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Footer -->
      <div class="mt-4 pt-2 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 font-bold">
        <span>EduGen Panama · Action-Oriented Approach Curriculum · MEDUCA</span>
        <span>Page 1 · Action Worksheet (${skillName})</span>
      </div>
    </div>
  `;

  // ══════════════════════════════════════════════════════════════════
  // PAGE 2: GUIDED PRACTICE & PERFORMANCE TASK (STAGES 3 & 4)
  // ══════════════════════════════════════════════════════════════════
  const page2Html = `
    <div class="workbook-page bg-white p-7 sm:p-9 border border-slate-200 shadow-2xl rounded-3xl print:border-none print:shadow-none print:p-0 print:m-0 print:rounded-none max-w-[215mm] mx-auto text-slate-900 my-6">
      <header class="border-b-2 border-slate-800 pb-2 flex justify-between items-baseline">
        <div>
          <span class="text-[10px] font-black uppercase tracking-widest text-indigo-600">PAGE 2 · GUIDED PRACTICE & PERFORMANCE TASK (STAGES 3 & 4)</span>
          <h2 class="text-lg font-black text-slate-900 tracking-tight">${cleanTitle}</h2>
        </div>
        <div class="text-right text-xs font-extrabold text-slate-700">
          <span class="px-2.5 py-0.5 rounded bg-slate-100 border border-slate-300">${grade} · Student Practice Sheet</span>
        </div>
      </header>

      <!-- Activity 2: Match with Realia Photos -->
      <section class="mt-3">
        <div class="flex items-center gap-2 mb-1">
          <span class="w-5 h-5 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">1</span>
          <h3 class="text-xs font-black uppercase tracking-wider text-slate-900">Activity 2: ${isReading ? 'Read & Match the Words to Realia' : 'Listen & Match the Target Items'}</h3>
        </div>
        <p class="text-xs text-slate-600 mb-2 font-medium">Draw a straight line to connect each photo with its matching English word:</p>

        <div class="space-y-2 max-w-lg mx-auto">
          ${realiaItems.slice(0, 4).map((it, idx) => `
            <div class="flex items-center justify-between gap-3">
              <div class="flex-1 bg-white border-2 border-slate-800 rounded-xl p-1.5 px-3 flex items-center justify-between shadow-sm">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                    ${renderRealiaCardHtml({ word: it.word, label: it.label || it.word, photoUrl: it.photoUrl })}
                  </div>
                  <span class="text-xs font-black text-slate-900">${it.word}</span>
                </div>
                <div class="w-3 h-3 rounded-full bg-slate-800"></div>
              </div>
              <div class="w-8 border-t-2 border-dashed border-slate-400"></div>
              <div class="flex-1 bg-white border-2 border-slate-800 rounded-xl p-1.5 px-3 flex items-center justify-between shadow-sm">
                <div class="w-3 h-3 rounded-full bg-slate-800"></div>
                <span class="text-xs font-black text-slate-900">${it.word.toLowerCase()}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Activity 3: Authentic Exchange -->
      <section class="mt-4">
        <div class="flex items-center gap-2 mb-1">
          <span class="w-5 h-5 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">2</span>
          <h3 class="text-xs font-black uppercase tracking-wider text-slate-900">${activity3.title}</h3>
        </div>
        <p class="text-xs text-slate-600 mb-2 font-medium">${activity3.instruction}</p>

        <div class="border border-indigo-200 bg-indigo-50/40 rounded-xl p-3 space-y-2">
          ${(activity3.dialogue || []).map((d, i) => `
            <div class="flex items-start gap-2.5 text-xs">
              <span class="px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 font-extrabold shrink-0">${d.speaker}:</span>
              <p class="text-slate-800 font-medium">${d.text}</p>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Activity 4: Performance Action Task (Drawing & Writing Space) -->
      <section class="mt-4">
        <div class="flex items-center gap-2 mb-1">
          <span class="w-5 h-5 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">3</span>
          <h3 class="text-xs font-black uppercase tracking-wider text-slate-900">${activity4.title}</h3>
        </div>
        <p class="text-xs text-slate-600 mb-1.5 font-medium">${activity4.instruction}</p>

        <div class="border-2 border-dashed border-slate-400 rounded-2xl p-4 bg-slate-50/50 min-h-[140px] flex flex-col justify-between items-center text-center">
          <span class="text-xs font-bold text-slate-400">🎨 Tangible Learning Task (${scenarioNoun})</span>
          <div class="w-full pt-4 border-t border-slate-300 flex justify-between items-center text-xs font-bold text-slate-600">
            <span>Item: _______________________</span>
            <span>Notes / Description: _______________________</span>
          </div>
        </div>
      </section>

      <footer class="mt-6 pt-2 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 font-bold">
        <span>EduGen Panama · Action-Oriented Approach Curriculum · MEDUCA</span>
        <span>Page 2 · Guided Practice</span>
      </footer>
    </div>
  `;

  // ══════════════════════════════════════════════════════════════════
  // PAGE 3: TEACHER AUDIO GUIDE, ANSWER KEY & MEDUCA RUBRIC
  // ══════════════════════════════════════════════════════════════════
  const page3Html = `
    <div class="workbook-page bg-white p-7 sm:p-9 border border-slate-200 shadow-2xl rounded-3xl print:border-none print:shadow-none print:p-0 print:m-0 print:rounded-none max-w-[215mm] mx-auto text-slate-900 my-6">
      <header class="border-b-2 border-slate-800 pb-2 flex justify-between items-baseline">
        <div>
          <span class="text-[10px] font-black uppercase tracking-widest text-indigo-600">PAGE 3 · ASSESSMENT & TEACHER AUDIO GUIDE (STAGES 5 & 6)</span>
          <h2 class="text-lg font-black text-slate-900 tracking-tight">${cleanTitle}</h2>
        </div>
        <div class="text-right text-xs font-extrabold text-slate-700">
          <span class="px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-300 text-emerald-800">Teacher Audio & Rubric Sheet</span>
        </div>
      </header>

      <!-- Teacher Read-Aloud Scripts -->
      <section class="mt-3">
        <div class="flex items-center gap-2 mb-1.5">
          <span class="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <span>🎙️</span> ${teacherGuide.title}
          </span>
        </div>
        <div class="space-y-2">
          ${(teacherGuide.scripts || []).map(sc => `
            <div class="border border-slate-300 bg-slate-50/70 rounded-xl p-2.5 text-xs">
              <span class="text-[10.5px] font-black text-indigo-700 uppercase block mb-0.5">${sc.stage}</span>
              <p class="text-slate-800 font-medium italic">"${sc.text}"</p>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Answer Key -->
      <section class="mt-3">
        <div class="border-2 border-emerald-700 bg-emerald-50/40 rounded-2xl p-3">
          <div class="flex items-center justify-between border-b border-emerald-200 pb-1 mb-1.5">
            <span class="text-xs font-black uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
              <span>✅</span> Official Teacher Answer Key (Solucionario Rápido)
            </span>
            <span class="text-[10px] text-emerald-700 font-bold">100% Pedagogical Alignment</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            ${(teacherGuide.answerKey || []).map(ak => `
              <div class="bg-white border border-emerald-200 rounded-lg p-1.5">
                <span class="font-black text-emerald-900 block text-[10px] uppercase">${ak.item}:</span>
                <span class="font-bold text-slate-800 text-[11px]">${ak.answer}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- MEDUCA Rubric -->
      <section class="mt-3">
        <div class="border-2 border-slate-800 rounded-2xl overflow-hidden">
          <table class="w-full text-left border-collapse text-[10px]">
            <thead>
              <tr class="bg-slate-100 border-b-2 border-slate-800 text-slate-900 font-black uppercase tracking-wider">
                <th class="p-2 w-4/12">MEDUCA AOA Learning Criterion</th>
                <th class="p-2 w-3/12 text-emerald-800">Independent (3 pts)</th>
                <th class="p-2 w-3/12 text-blue-800">With Support (2 pts)</th>
                <th class="p-2 w-2/12 text-amber-800">Emerging (1 pt)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-300 font-medium text-slate-800 bg-white">
              ${(teacherGuide.rubric || []).slice(0, 3).map(r => `
                <tr>
                  <td class="p-2 font-bold text-slate-900">${r.criterion}</td>
                  <td class="p-2 text-slate-700">${r.independent}</td>
                  <td class="p-2 text-slate-700">${r.withSupport}</td>
                  <td class="p-2 text-slate-700">${r.emerging}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>

      <footer class="mt-4 pt-2 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 font-bold">
        <span>EduGen Panama · Action-Oriented Approach Curriculum · MEDUCA</span>
        <span>Page 3 · Complete Activity Pack & Rubric</span>
      </footer>
    </div>
  `;

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Action Worksheet: "${cleanTitle}" - AOA MEDUCA</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
      <style>
        @page {
          size: letter portrait;
          margin: 6mm;
        }
        body {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
          background-color: #0b1329;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .workbook-page {
          box-sizing: border-box;
          page-break-after: always;
          break-after: page;
        }
        @media print {
          body {
            background-color: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .workbook-page {
            width: 100% !important;
            min-height: 100vh !important;
            margin: 0 !important;
            padding: 4mm !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            page-break-after: always !important;
            break-after: page !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      </style>
    </head>
    <body class="min-h-screen text-slate-900 pb-12">
      ${topNavHtml}
      ${alertBannerHtml}
      <div class="px-3">
        ${page1Html}
        ${page2Html}
        ${page3Html}
      </div>
    </body>
    </html>
  `;
}
