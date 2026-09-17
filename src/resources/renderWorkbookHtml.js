import { renderRealiaCardHtml, renderSpatialCardHtml, getRealiaPhoto } from './realiaCatalog.js';
import { getIllustrationSvg } from './illustrations.js';

export function renderWorkbookHtml(pack) {
  const isKinder = /kinder|pre-?k|early/i.test(pack.grade || '');
  const title = pack.title || 'Where Is Your Book?';
  const cleanTitle = title.replace(/^Action Worksheet:\s*/i, '').replace(/["']/g, '');
  const grade = pack.grade || (isKinder ? 'Kindergarten' : '4th Grade');
  const skill = pack.skill || 'Listening';
  const lessonNumber = pack.lessonNum || pack.lessonNumber || 1;
  const scenario = pack.scenario || pack.lessonTitle || (isKinder ? 'Where Is It?' : cleanTitle);
  const objective = pack.objective || 'Identify target vocabulary and communicative structures in real context.';

  // Fallbacks & data structures
  const page1 = pack.page1 || {};
  const page2 = pack.page2 || {};
  const page3 = pack.page3 || {};

  // Extract or synthesize Part 1 Realia Items (6 cards)
  let realiaItems = [];
  if (pack.actionWorksheet?.part1?.items?.length) {
    realiaItems = pack.actionWorksheet.part1.items.map(it => ({
      word: it.word || it.label,
      label: it.label || it.word,
      photoUrl: it.photoUrl || null
    }));
  } else if (page1.wordBank?.length) {
    realiaItems = page1.wordBank.map(it => ({
      word: it.word || it.label,
      label: it.label || it.word,
      photoUrl: it.photoUrl || null
    }));
  }

  // Default to the authentic Classroom Realia from Image 1 if Kinder / Classroom topic or words are missing
  const defaultClassroomWords = [
    { word: 'BOOK', label: 'BOOK' },
    { word: 'DESK', label: 'DESK' },
    { word: 'CHAIR', label: 'CHAIR' },
    { word: 'BAG', label: 'BAG' },
    { word: 'PENCIL', label: 'PENCIL' },
    { word: 'CRAYON', label: 'CRAYON' }
  ];

  if (!realiaItems.length || (isKinder && realiaItems[0]?.word?.toLowerCase() === 'word 1')) {
    realiaItems = defaultClassroomWords;
  }
  while (realiaItems.length < 6) {
    realiaItems.push(defaultClassroomWords[realiaItems.length] || { word: `ITEM ${realiaItems.length + 1}` });
  }
  realiaItems = realiaItems.slice(0, 6);

  // Extract or synthesize Part 2 Spatial / Concept Items (4 cards)
  let prepositionItems = [];
  if (pack.actionWorksheet?.part2?.items?.length) {
    prepositionItems = pack.actionWorksheet.part2.items;
  }

  const defaultSpatialItems = [
    { concept: 'ON', relation: 'on', sentence: 'The book is ON the desk.', subject: 'book', reference: 'desk' },
    { concept: 'UNDER', relation: 'under', sentence: 'The bag is UNDER the chair.', subject: 'bag', reference: 'chair' },
    { concept: 'IN', relation: 'in', sentence: 'The pencil is IN the bag.', subject: 'pencil', reference: 'bag' },
    { concept: 'NEXT TO', relation: 'next_to', sentence: 'The crayon is NEXT TO the book.', subject: 'crayon', reference: 'book' }
  ];

  if (!prepositionItems.length) {
    if (isKinder || /where|book|chair|desk|preposition/i.test(cleanTitle)) {
      prepositionItems = defaultSpatialItems;
    } else {
      // Synthesize 4 authentic concept checks from vocabulary
      const w0 = realiaItems[0]?.word || 'item';
      const w1 = realiaItems[1]?.word || 'item';
      const w2 = realiaItems[2]?.word || 'item';
      const w3 = realiaItems[3]?.word || 'item';
      prepositionItems = [
        { concept: 'CHECK 1', relation: 'on', sentence: `The ${w0.toLowerCase()} is available in the scenario.`, subject: w0, reference: 'desk' },
        { concept: 'CHECK 2', relation: 'under', sentence: `We identify the ${w1.toLowerCase()} in the lesson.`, subject: w1, reference: 'chair' },
        { concept: 'CHECK 3', relation: 'in', sentence: `The customer asks about the ${w2.toLowerCase()}.`, subject: w2, reference: 'bag' },
        { concept: 'CHECK 4', relation: 'next_to', sentence: `We compare the ${w3.toLowerCase()} with others.`, subject: w3, reference: 'book' }
      ];
    }
  }

  // Teacher Guides & Page 2/3 Data
  const activity3 = page2.activity3 || {
    title: 'Activity 3: Authentic Communicative Exchange',
    instruction: 'Complete the interaction using words from the Word Bank below:',
    wordBank: realiaItems.slice(0, 4).map(w => w.word),
    dialogue: [
      { speaker: 'Teacher / Speaker 1', text: `Hello class! Look around. Where is your ${realiaItems[0]?.word || 'book'}?` },
      { speaker: 'Student / Speaker 2', text: `It is right here on my desk!` },
      { speaker: 'Teacher / Speaker 1', text: `Great job! Now point to your ${realiaItems[3]?.word || 'bag'}.` },
      { speaker: 'Student / Speaker 2', text: `My bag is ready for our lesson today.` }
    ]
  };

  const activity4 = page2.activity4 || {
    title: `Activity 4: Performance Action Task (${cleanTitle})`,
    instruction: 'Listen to the prompt. Draw your favorite object and trace its name below:'
  };

  const exitTicket = page3.exitTicket || {
    title: 'Student Exit Ticket (Quick Check)',
    questions: [
      { prompt: `1. What is the target scenario of today's lesson?`, options: [`A) ${cleanTitle}`, 'B) Unrelated Topic'], correct: `A) ${cleanTitle}` },
      { prompt: `2. We practiced identifying objects in ${scenario}.`, options: ['True', 'False'], correct: 'True' },
      { prompt: `3. Which item was highlighted in the activity?`, options: [`A) ${realiaItems[0]?.word || 'Book'}`, 'B) None'], correct: `A) ${realiaItems[0]?.word || 'Book'}` }
    ]
  };

  const teacherGuide = page3.teacherGuide || {
    title: 'Teacher Read-Aloud Audio Scripts (For Classroom Instruction)',
    scripts: [
      { stage: 'Stage 1 Realia Hook Audio', text: `Teacher commands: "Students, look at your paper! Point to the photo of the ${realiaItems[0]?.word || 'book'}. Now touch the real one in our classroom!"` },
      { stage: 'Stage 2 Preposition Check Script', text: `Teacher says clearly: "Number 1: The book is ON the desk. Show me your thumbs: YES (👍) or NO (👎)!"` },
      { stage: 'Stage 4 Performance Task Dictation', text: `Listen carefully: "In our scenario ${scenario}, we use our classroom objects every day. Draw your favorite item and show your partner."` }
    ],
    answerKey: [
      { item: 'Part 1 Realia Recognition', answer: realiaItems.map((w, i) => `${i + 1}. ${w.word}`).join('  ·  ') },
      { item: 'Part 2 Preposition Check', answer: 'Item 1: YES (👍)  ·  Item 2: YES (👍)  ·  Item 3: YES (👍)  ·  Item 4: YES (👍)' },
      { item: 'Activity 3 Exchange Cloze', answer: realiaItems.slice(0, 4).map(w => w.word).join(', ') },
      { item: 'Exit Ticket Quiz', answer: '1. A (Scenario)  ·  2. True  ·  3. A (Target Concept)' }
    ],
    rubric: pack.rubric || [
      {
        criterion: `Receptive Listening & Non-Verbal Action (TPR)`,
        independent: 'Points to correct real photo and performs physical action immediately without hesitation.',
        withSupport: 'Points to target items with 1-2 teacher prompts or peer modeling.',
        emerging: 'Requires direct physical guidance and continuous repetition.'
      },
      {
        criterion: 'Spatial Concept & Preposition Discrimination',
        independent: 'Accurately discriminates ON, UNDER, IN, NEXT TO with 90-100% precision.',
        withSupport: 'Discriminates spatial relations with visual gesture assistance.',
        emerging: 'Identifies fewer than half the spatial relations.'
      },
      {
        criterion: 'Active Social Engagement (AOA Panama)',
        independent: 'Participates actively in classroom routine, showing thumbs and handling realia.',
        withSupport: 'Participates with encouragement from teacher.',
        emerging: 'Remains passive during physical actions.'
      }
    ]
  };

  // Grade badge labels
  const gradeLevelCategory = isKinder ? 'Pre-Media Inicial' : 'Primaria Media';
  const skillsDetail = isKinder ? 'Receptive Listening & Non-Verbal Action (TPR)' : `${skill} & Communicative Practice`;
  const skillPill = isKinder ? 'Listening & TPR' : `${skill} · AOA`;

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
  // PAGE 1: THE ACTION WORKSHEET (FICHA CONCRETA DE TRABAJO - IMAGE 1)
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

      <!-- PART 1: LISTEN & POINT TO THE REAL CLASSROOM OBJECTS (REALIA HOOK) -->
      <section class="mt-2 mb-4">
        <div class="flex items-center justify-between gap-2 mb-1">
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
              A
            </span>
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-900">
              PART 1: LISTEN & POINT TO THE REAL CLASSROOM OBJECTS (REALIA HOOK)
            </h3>
          </div>
          <span class="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700">
            Receptive Vocabulary
          </span>
        </div>

        <p class="text-[10.5px] text-slate-600 italic mb-2.5 font-medium leading-tight">
          <strong>Teacher instruction:</strong> "Listen carefully! When teacher says the word, point to the real photo on your paper and touch the real object in the classroom!"
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
              <span class="mt-1 text-[9px] font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-md px-1 py-0.5 w-full">
                [ Point Here 👆 ]
              </span>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- PART 2: VISUAL PREPOSITION CHECK · "TRUE OR FALSE? SHOW YOUR THUMB!" -->
      <section class="mt-3">
        <div class="flex items-center justify-between gap-2 mb-1">
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
              B
            </span>
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-900">
              PART 2: VISUAL PREPOSITION CHECK · "TRUE OR FALSE? SHOW YOUR THUMB!"
            </h3>
          </div>
          <span class="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
            Accuracy of Listening
          </span>
        </div>

        <p class="text-[10.5px] text-slate-600 italic mb-2.5 font-medium leading-tight">
          <strong>Teacher prompt:</strong> "Teacher says a statement and shows the photo. If it is TRUE, mark YES ( 👍 ). If it is FALSE, mark NO ( 👎 )!"
        </p>

        <!-- 4 Preposition / Concept Cards Grid -->
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
                Item ${idx + 1}: [ ${String(item.concept || item.relation || 'ON').toUpperCase()} ]
              </div>
              <p class="text-[10px] italic text-slate-600 mb-2 leading-tight line-clamp-2">
                "${item.sentence || `The item is in context.`}"
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
        <span>Page 1 · Action Worksheet</span>
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

      <!-- Activity 2: Listen & Match with Realia Icons -->
      <section class="mt-3">
        <div class="flex items-center gap-2 mb-1">
          <span class="w-5 h-5 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">1</span>
          <h3 class="text-xs font-black uppercase tracking-wider text-slate-900">Activity 2: Listen & Match the Classroom Objects</h3>
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

      <!-- Activity 4: Performance Action Task (Drawing Space) -->
      <section class="mt-4">
        <div class="flex items-center gap-2 mb-1">
          <span class="w-5 h-5 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">3</span>
          <h3 class="text-xs font-black uppercase tracking-wider text-slate-900">${activity4.title}</h3>
        </div>
        <p class="text-xs text-slate-600 mb-1.5 font-medium">${activity4.instruction}</p>

        <div class="border-2 border-dashed border-slate-400 rounded-2xl p-4 bg-slate-50/50 min-h-[140px] flex flex-col justify-between items-center text-center">
          <span class="text-xs font-bold text-slate-400">🎨 Draw your classroom object here (e.g. My Favorite Book / Bag / Desk)</span>
          <div class="w-full pt-4 border-t border-slate-300 flex justify-between items-center text-xs font-bold text-slate-600">
            <span>Label: _______________________</span>
            <span>Where is it? It is _______________________</span>
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
