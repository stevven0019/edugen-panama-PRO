import { getIllustrationSvg, renderSpatialSceneSvg } from './illustrations.js';

export function renderWorkbookHtml(pack) {
  const isKinder = /kinder|pre-?k|early/i.test(pack.grade || '');
  const title = pack.title || 'English Activity Workbook';
  const grade = pack.grade || '4th Grade';
  const skill = pack.skill || 'Listening & Speaking';
  const scenario = pack.scenario || pack.lessonTitle || title;
  const objective = pack.objective || 'Identify target vocabulary and communicative structures in real context.';

  // Fallbacks if structured page properties are missing (e.g. older packs)
  const page1 = pack.page1 || {};
  const page2 = pack.page2 || {};
  const page3 = pack.page3 || {};

  const wordBank = (page1.wordBank || pack.activities?.[0]?.items || [
    { word: 'Word 1', pos: 'noun', example: `Target word for ${title}`, icon: 'tree' },
    { word: 'Word 2', pos: 'noun', example: `Target word for ${title}`, icon: 'sun' },
    { word: 'Word 3', pos: 'noun', example: `Target word for ${title}`, icon: 'book' },
    { word: 'Word 4', pos: 'noun', example: `Target word for ${title}`, icon: 'star' }
  ]).map(it => ({
    word: it.word || it.label || 'Item',
    pos: it.pos || 'noun',
    example: it.example || `Target word in context: ${it.word || it.label}`,
    icon: it.icon || it.label || it.word
  }));

  const languageFrame = page1.languageFrame || {
    question: `Key question pattern for ${title}?`,
    answer: `Target response structure for ${scenario}.`,
    exchange: `Speaker A: "..." ──> Speaker B: "..."`
  };

  const activity1 = page1.activity1 || {
    title: 'Activity 1: Listen & Circle (Word Recognition)',
    instruction: 'Listen carefully as your teacher reads the target words. Circle each word you hear:',
    words: wordBank.map(w => w.word)
  };

  const activity2 = page2.activity2 || {
    title: 'Activity 2: Listen & Match',
    instruction: 'Listen to the audio sentences. Draw a line to match each item with its corresponding detail:',
    pairs: wordBank.slice(0, 4).map((w, i) => ({
      item: w.word,
      detail: `Detail for ${w.word}`,
      icon: w.icon
    }))
  };

  const activity3 = page2.activity3 || {
    title: 'Activity 3: Authentic Dialogue Cloze',
    instruction: 'Complete the dialogue using words from the Word Bank below:',
    wordBank: wordBank.slice(0, 5).map(w => w.word),
    dialogue: [
      { speaker: 'Speaker 1', text: `Hello! Today we are learning about ${title}.` },
      { speaker: 'Speaker 2', text: `That sounds interesting! What should we look for?` },
      { speaker: 'Speaker 1', text: `We need to identify the key concepts and take notes.` },
      { speaker: 'Speaker 2', text: `Great, let's complete the task together!` }
    ]
  };

  const activity4 = page2.activity4 || {
    title: `Activity 4: Performance Production (${title})`,
    instruction: 'Listen to the dictation. Illustrate the concept and write your responses on the lines below:'
  };

  const exitTicket = page3.exitTicket || {
    title: 'Student Exit Ticket (Quick Check)',
    questions: [
      { prompt: `1. What is the central theme of today's lesson?`, options: [`A) ${title}`, 'B) Unrelated Topic'], correct: `A) ${title}` },
      { prompt: `2. We practiced vocabulary related to ${scenario}.`, options: ['True', 'False'], correct: 'True' },
      { prompt: `3. Which concept was highlighted in the activity?`, options: [`A) ${wordBank[0]?.word || 'Concept'}`, 'B) None'], correct: `A) ${wordBank[0]?.word || 'Concept'}` }
    ],
    selfAssessment: [
      { text: 'I can identify the target vocabulary words.', stars: 3 },
      { text: 'I can understand the key concepts in spoken audio.', stars: 3 },
      { text: 'I can participate in the communicative exchange.', stars: 3 }
    ]
  };

  const teacherGuide = page3.teacherGuide || {
    title: 'Teacher Read-Aloud Audio Scripts (For Classroom Instruction)',
    scripts: [
      { stage: 'Stage 2 Presentation Audio', text: activity3.dialogue?.map(d => `${d.speaker}: "${d.text}"`).join('  ·  ') || `Teacher models the target dialogue for ${title}.` },
      { stage: 'Stage 4 Performance Dictation', text: `Listen carefully: "In our lesson about ${scenario}, we explore ${wordBank.slice(0, 3).map(w => w.word).join(', ')}. Complete your drawing and write the key features."` },
      { stage: 'Stage 5 Assessment Quiz Script', text: `Teacher reads: "Question 1: Listen to the description and choose the correct answer about ${title}. Pay close attention to the target vocabulary."` }
    ],
    answerKey: [
      { item: 'Activity 1 (Circle)', answer: wordBank.map(w => w.word).join(', ') },
      { item: 'Activity 2 (Match)', answer: (activity2.pairs || []).map(p => `${p.item || p.left} ──> ${p.detail || p.right}`).join(', ') },
      { item: 'Activity 3 (Cloze)', answer: activity3.wordBank ? activity3.wordBank.join(', ') : wordBank.slice(0, 4).map(w => w.word).join(', ') },
      { item: 'Exit Ticket Quiz', answer: '1. A (Theme)  ·  2. True  ·  3. A (Target Concept)' }
    ],
    rubric: pack.rubric || [
      {
        criterion: `Listening Comprehension (${title} Target Vocabulary)`,
        independent: 'Identifies all key terms and concept details accurately without teacher repetition.',
        withSupport: 'Identifies target concepts with 1-2 visual prompts or pauses.',
        emerging: 'Requires direct teacher assistance or continuous modeling.'
      },
      {
        criterion: 'Task Performance (Drawing, Matching & Completion)',
        independent: 'Completes all worksheet activities independently and fluently.',
        withSupport: 'Completes activities with peer modeling or scaffolding.',
        emerging: 'Completes fewer than half the tasks accurately.'
      },
      {
        criterion: 'Communicative Use of Language (AOA Interaction)',
        independent: 'Produces question and response frames with clear pronunciation.',
        withSupport: 'Uses isolated target words with acceptable pronunciation.',
        emerging: 'Relies on non-verbal pointing or gestures only.'
      }
    ]
  };

  // ══════════════════════════════════════════════════════════════════
  // PAGE 1: DISCOVERY & LINGUISTIC INPUT (STAGES 1 & 2)
  // ══════════════════════════════════════════════════════════════════
  const page1Html = `
    <div class="workbook-page bg-white p-7 flex flex-col justify-between border border-slate-300 shadow-xl rounded-2xl print:border-none print:shadow-none print:p-0 print:m-0 print:rounded-none">
      <!-- Institutional Top Header -->
      <header class="border-b-2 border-slate-800 pb-3">
        <div class="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1.5">
          <span>REPÚBLICA DE PANAMÁ · MEDUCA · DIRECCIÓN NACIONAL DE CURRÍCULO</span>
          <span class="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold">${grade} · ${skill}</span>
        </div>
        
        <!-- Student Fill-in Info Bar -->
        <div class="bg-slate-50 border border-slate-300 rounded-xl p-2.5 grid grid-cols-12 gap-2 text-xs font-semibold text-slate-800">
          <div class="col-span-5 flex items-center gap-1.5">
            <span class="text-slate-500 font-bold uppercase text-[10px]">Student:</span>
            <span class="border-b border-slate-400 flex-1 h-5"></span>
          </div>
          <div class="col-span-3 flex items-center gap-1.5">
            <span class="text-slate-500 font-bold uppercase text-[10px]">Date:</span>
            <span class="border-b border-slate-400 flex-1 h-5"></span>
          </div>
          <div class="col-span-2 flex items-center gap-1.5">
            <span class="text-slate-500 font-bold uppercase text-[10px]">Group:</span>
            <span class="border-b border-slate-400 flex-1 h-5"></span>
          </div>
          <div class="col-span-2 bg-white border-2 border-indigo-600 rounded-lg flex items-center justify-center font-black text-indigo-900 text-xs py-0.5">
            Score: &nbsp;&nbsp;&nbsp;&nbsp;/20
          </div>
        </div>

        <!-- Lesson Title & Scenario Banner -->
        <div class="mt-2.5 flex items-baseline justify-between">
          <div>
            <span class="text-[10px] font-black uppercase tracking-widest text-indigo-600">PAGE 1 · DISCOVERY & LINGUISTIC INPUT (STAGES 1 & 2)</span>
            <h1 class="text-xl font-black text-slate-900 tracking-tight leading-tight">${title}</h1>
            <p class="text-xs font-medium text-slate-600"><strong>Scenario:</strong> ${scenario} &nbsp;·&nbsp; <strong>Objective:</strong> ${objective}</p>
          </div>
        </div>
      </header>

      <!-- Section A: Illustrated Key Vocabulary Word Bank -->
      <section class="mt-3">
        <div class="flex items-center gap-2 mb-2">
          <span class="w-5 h-5 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">1</span>
          <h2 class="text-xs font-black uppercase tracking-wider text-slate-900">Key Vocabulary & Concept Input (Stage 1 Warm-up)</h2>
          <span class="text-[10px] text-slate-500 font-medium ml-auto">Listen, look at the visual cards, and repeat.</span>
        </div>

        <div class="grid grid-cols-3 gap-2.5">
          ${wordBank.slice(0, 6).map(w => `
            <div class="border-2 border-slate-800 rounded-xl p-2 bg-slate-50/50 flex items-center gap-2.5 shadow-sm">
              <div class="w-12 h-12 shrink-0 flex items-center justify-center bg-white rounded-lg border border-slate-300 p-1">
                ${getIllustrationSvg(w.icon || w.word, 'color')}
              </div>
              <div class="min-w-0">
                <div class="flex items-baseline gap-1.5">
                  <span class="text-sm font-black text-slate-900 truncate">${w.word}</span>
                  <span class="text-[9px] font-bold text-slate-500 uppercase">(${w.pos || 'n.'})</span>
                </div>
                <p class="text-[10px] text-slate-600 leading-tight line-clamp-2 mt-0.5 italic font-medium">"${w.example}"</p>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Section B: Communicative Language Frame (Model Pattern) -->
      <section class="mt-3 bg-indigo-50/60 border-2 border-indigo-500/40 rounded-xl p-3">
        <div class="flex items-center gap-2 mb-1.5">
          <span class="text-xs font-black uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
            <span>💬</span> Communicative Language Frame (AOA Target Structure)
          </span>
        </div>
        <div class="grid grid-cols-2 gap-3 text-xs">
          <div class="bg-white border border-indigo-200 rounded-lg p-2 font-semibold text-slate-800">
            <span class="text-[10px] font-black uppercase text-indigo-600 block mb-0.5">Target Question / Inquiry:</span>
            <p class="text-xs font-extrabold text-slate-900">"${languageFrame.question || 'Target question structure'}"</p>
          </div>
          <div class="bg-white border border-indigo-200 rounded-lg p-2 font-semibold text-slate-800">
            <span class="text-[10px] font-black uppercase text-indigo-600 block mb-0.5">Target Response / Exchange:</span>
            <p class="text-xs font-extrabold text-slate-900">"${languageFrame.answer || 'Target response structure'}" ${languageFrame.exchange ? `&nbsp;·&nbsp; "${languageFrame.exchange}"` : ''}</p>
          </div>
        </div>
      </section>

      <!-- Section C: Activity 1 (Tangible Exercise: Listen & Circle / Identify) -->
      <section class="mt-3">
        <div class="flex items-center gap-2 mb-1.5">
          <span class="w-5 h-5 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">2</span>
          <h2 class="text-xs font-black uppercase tracking-wider text-slate-900">${activity1.title}</h2>
        </div>
        <p class="text-xs text-slate-600 mb-2 font-medium">${activity1.instruction}</p>

        <div class="border-2 border-slate-800 rounded-xl p-3 bg-white grid grid-cols-6 gap-2 text-center">
          ${(activity1.words || wordBank.map(w => w.word)).slice(0, 6).map((word, i) => `
            <div class="border-2 border-dashed border-slate-300 rounded-lg p-2 hover:border-slate-800 flex flex-col items-center justify-between">
              <span class="w-4 h-4 rounded-full border border-slate-400 text-[10px] flex items-center justify-center font-bold text-slate-400 mb-1">${i + 1}</span>
              <span class="text-xs font-black text-slate-800">${word}</span>
              <span class="w-4 h-4 rounded-full border-2 border-slate-800 mt-1.5"></span>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Page 1 Footer -->
      <footer class="mt-auto pt-2 border-t border-slate-300 flex justify-between items-center text-[10px] text-slate-500 font-bold">
        <span>EduGen Panama · Action-Oriented Approach Curriculum · MEDUCA</span>
        <span>Page 1 of 3</span>
      </footer>
    </div>
  `;

  // ══════════════════════════════════════════════════════════════════
  // PAGE 2: GUIDED PRACTICE & PERFORMANCE TASK (STAGES 3 & 4)
  // ══════════════════════════════════════════════════════════════════
  const page2Html = `
    <div class="workbook-page bg-white p-7 flex flex-col justify-between border border-slate-300 shadow-xl rounded-2xl print:border-none print:shadow-none print:p-0 print:m-0 print:rounded-none">
      <!-- Top Running Header -->
      <header class="border-b-2 border-slate-800 pb-2.5 flex justify-between items-baseline">
        <div>
          <span class="text-[10px] font-black uppercase tracking-widest text-indigo-600">PAGE 2 · GUIDED PRACTICE & PERFORMANCE TASK (STAGES 3 & 4)</span>
          <h1 class="text-lg font-black text-slate-900 tracking-tight">${title}</h1>
        </div>
        <div class="text-right text-xs font-extrabold text-slate-700">
          <span class="px-2.5 py-0.5 rounded bg-slate-100 border border-slate-300">${grade} · Student Practice Sheet</span>
        </div>
      </header>

      <!-- Activity 2: Listen & Match (Connecting Items to Prices/Descriptions) -->
      <section class="mt-3">
        <div class="flex items-center gap-2 mb-1.5">
          <span class="w-5 h-5 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">3</span>
          <h2 class="text-xs font-black uppercase tracking-wider text-slate-900">${activity2.title}</h2>
        </div>
        <p class="text-xs text-slate-600 mb-2 font-medium">${activity2.instruction}</p>

        <div class="space-y-1.5 max-w-xl mx-auto">
          ${(activity2.pairs || []).slice(0, 4).map((p, idx) => `
            <div class="flex items-center justify-between gap-3">
              <!-- Item card -->
              <div class="flex-1 bg-white border-2 border-slate-800 rounded-xl p-1.5 px-3 flex items-center justify-between shadow-sm">
                <div class="flex items-center gap-2.5">
                  <div class="w-7 h-7 flex items-center justify-center">
                    ${getIllustrationSvg(p.icon || p.item, 'color')}
                  </div>
                  <span class="text-xs font-black text-slate-900">${p.item || p.left}</span>
                </div>
                <div class="w-3 h-3 rounded-full bg-slate-800"></div>
              </div>

              <div class="w-8 border-t-2 border-dashed border-slate-400"></div>

              <!-- Detail / Match card -->
              <div class="flex-1 bg-white border-2 border-slate-800 rounded-xl p-1.5 px-3 flex items-center justify-between shadow-sm">
                <div class="w-3 h-3 rounded-full bg-slate-800"></div>
                <span class="text-xs font-black text-slate-900">${p.detail || p.right || `Item ${idx + 1}`}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Activity 3: Authentic Dialogue Cloze (Stage 2 & 3 Input) -->
      <section class="mt-3">
        <div class="flex items-center gap-2 mb-1.5">
          <span class="w-5 h-5 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">4</span>
          <h2 class="text-xs font-black uppercase tracking-wider text-slate-900">${activity3.title}</h2>
        </div>
        <p class="text-xs text-slate-600 mb-1.5 font-medium">${activity3.instruction}</p>

        <!-- Word Bank for Cloze -->
        <div class="bg-indigo-50/50 border border-indigo-200 rounded-lg p-1.5 px-3 mb-2 flex items-center gap-2 text-xs font-bold text-indigo-950">
          <span class="text-[10px] uppercase font-black text-indigo-600">Word Bank:</span>
          ${(activity3.wordBank || wordBank.slice(0, 5).map(w => w.word)).map(w => `
            <span class="bg-white px-2 py-0.5 rounded border border-indigo-200 text-xs">${w}</span>
          `).join('')}
        </div>

        <div class="border-2 border-slate-800 rounded-xl p-3 bg-slate-50/40 space-y-1.5 text-xs">
          ${(activity3.dialogue || []).slice(0, 6).map((line, li) => {
            const isTargetLine = li === 1 || li === 2 || li === 4 || li === 5;
            return `
              <div class="flex items-baseline gap-2">
                <span class="font-black text-indigo-700 w-20 shrink-0">${line.speaker || 'Speaker'}:</span>
                <span class="font-semibold text-slate-800 flex-1">
                  ${isTargetLine
                    ? line.text.replace(new RegExp(`(${wordBank.map(w => w.word).join('|')})`, 'gi'), '<span class="inline-block border-b-2 border-slate-600 w-28 text-center text-slate-400 font-mono text-[10px]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>')
                    : line.text
                  }
                </span>
              </div>
            `;
          }).join('')}
        </div>
      </section>

      <!-- Activity 4: Performance Task (Stage 4 Communicative Mission) -->
      <section class="mt-3">
        <div class="flex items-center gap-2 mb-1.5">
          <span class="w-5 h-5 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">5</span>
          <h2 class="text-xs font-black uppercase tracking-wider text-slate-900">${activity4.title}</h2>
        </div>
        <p class="text-xs text-slate-600 mb-1.5 font-medium">${activity4.instruction}</p>

        <!-- Drawing & Writing Performance Box -->
        <div class="border-2 border-slate-800 rounded-xl p-3 bg-white grid grid-cols-12 gap-3">
          <div class="col-span-5 border-2 border-dashed border-slate-300 rounded-lg p-2 flex flex-col justify-between items-center text-center bg-slate-50 min-h-[110px]">
            <span class="text-[10px] font-bold text-slate-500 uppercase">Performance Drawing Canvas</span>
            <div class="my-auto w-12 h-12 flex items-center justify-center opacity-40">
              ${getIllustrationSvg('book', 'outline')}
            </div>
            <span class="text-[9px] text-slate-400">Illustrate target concept</span>
          </div>

          <div class="col-span-7 space-y-2.5 flex flex-col justify-center">
            <span class="text-[10px] font-black text-slate-700 uppercase block">Student Written Response & Notes:</span>
            <div class="space-y-3 text-xs">
              <div class="flex items-center gap-2">
                <span class="font-black text-slate-700">1.</span>
                <span class="border-b border-slate-400 flex-1 h-5"></span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-black text-slate-700">2.</span>
                <span class="border-b border-slate-400 flex-1 h-5"></span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-black text-slate-700">3.</span>
                <span class="border-b border-slate-400 flex-1 h-5"></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Page 2 Footer -->
      <footer class="mt-auto pt-2 border-t border-slate-300 flex justify-between items-center text-[10px] text-slate-500 font-bold">
        <span>EduGen Panama · Action-Oriented Approach Curriculum · MEDUCA</span>
        <span>Page 2 of 3</span>
      </footer>
    </div>
  `;

  // ══════════════════════════════════════════════════════════════════
  // PAGE 3: ASSESSMENT, TEACHER SCRIPTS & ANSWER KEY (STAGES 5 & 6)
  // ══════════════════════════════════════════════════════════════════
  const page3Html = `
    <div class="workbook-page bg-white p-7 flex flex-col justify-between border border-slate-300 shadow-xl rounded-2xl print:border-none print:shadow-none print:p-0 print:m-0 print:rounded-none">
      <!-- Top Running Header -->
      <header class="border-b-2 border-slate-800 pb-2.5 flex justify-between items-baseline">
        <div>
          <span class="text-[10px] font-black uppercase tracking-widest text-emerald-600">PAGE 3 · FORMATIVE ASSESSMENT & TEACHER GUIDE (STAGES 5 & 6)</span>
          <h1 class="text-lg font-black text-slate-900 tracking-tight">${title}</h1>
        </div>
        <div class="text-right text-xs font-extrabold text-slate-700">
          <span class="px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-300 text-emerald-800">Teacher & Evaluation Guide</span>
        </div>
      </header>

      <!-- Section 1: Student Exit Ticket & Market Quiz (Stage 5 & 6) -->
      <section class="mt-2.5">
        <div class="flex items-center justify-between mb-1.5">
          <div class="flex items-center gap-2">
            <span class="w-5 h-5 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">6</span>
            <h2 class="text-xs font-black uppercase tracking-wider text-slate-900">${exitTicket.title}</h2>
          </div>
          <span class="text-[10px] font-bold text-slate-500 uppercase">Student Post-Task Check</span>
        </div>

        <div class="border-2 border-slate-800 rounded-xl p-3 bg-slate-50 grid grid-cols-12 gap-3 text-xs">
          <!-- 3 Quiz Questions -->
          <div class="col-span-8 space-y-2 border-r border-slate-300 pr-3">
            ${(exitTicket.questions || []).map((q, qi) => `
              <div>
                <p class="font-bold text-slate-900 mb-0.5">${q.prompt}</p>
                <div class="flex gap-4 text-xs font-semibold text-slate-700">
                  ${(q.options || ['Option A', 'Option B']).map(opt => `
                    <label class="flex items-center gap-1 cursor-pointer">
                      <span class="w-3.5 h-3.5 rounded-full border border-slate-600 inline-block"></span>
                      <span>${opt}</span>
                    </label>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Student Self-Assessment Scale (Stage 6 Reflection) -->
          <div class="col-span-4 flex flex-col justify-between pl-1">
            <span class="text-[10px] font-black uppercase tracking-wider text-slate-700 block">Self-Assessment:</span>
            ${(exitTicket.selfAssessment || [
              { text: 'I can name the words.', stars: 3 },
              { text: 'I understand prices.', stars: 3 },
              { text: 'I can ask how much.', stars: 3 }
            ]).map(sa => `
              <div class="text-[10px] font-medium text-slate-700">
                <p class="truncate leading-tight">${sa.text}</p>
                <div class="text-amber-500 font-bold text-xs tracking-widest">★ ★ ★</div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Section 2: Teacher Read-Aloud Scripts (Verbatim text for the teacher) -->
      <section class="mt-2.5">
        <div class="bg-indigo-950 text-white rounded-xl p-3 shadow-sm">
          <div class="flex items-center justify-between border-b border-indigo-800 pb-1 mb-2">
            <span class="text-xs font-black uppercase tracking-widest text-indigo-300 flex items-center gap-1.5">
              <span>🎙️</span> Teacher Read-Aloud Audio Scripts (Guión Textual para el Docente)
            </span>
            <span class="text-[9px] bg-indigo-800 px-2 py-0.5 rounded text-indigo-200 font-bold">Read aloud in class</span>
          </div>

          <div class="space-y-1.5 text-[11px] leading-relaxed">
            ${(teacherGuide.scripts || []).map(sc => `
              <div>
                <strong class="text-amber-400 font-bold uppercase text-[10px] block">${sc.stage}:</strong>
                <p class="text-indigo-100 font-mono italic text-[10.5px]">"${sc.text}"</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Section 3: Official Answer Key (Solucionario Oficial) -->
      <section class="mt-2.5">
        <div class="border-2 border-emerald-800 bg-emerald-50/50 rounded-xl p-2.5">
          <div class="flex items-center justify-between border-b border-emerald-200 pb-1 mb-1.5">
            <span class="text-[11px] font-black uppercase tracking-wider text-emerald-950 flex items-center gap-1">
              <span>✅</span> Official Teacher Answer Key (Solucionario Rápido)
            </span>
            <span class="text-[9px] text-emerald-700 font-bold">100% Pedagogical Alignment</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-[10.5px]">
            ${(teacherGuide.answerKey || []).map(ak => `
              <div class="bg-white border border-emerald-200 rounded p-1.5">
                <span class="font-black text-emerald-900 block text-[10px] uppercase">${ak.item}:</span>
                <span class="font-bold text-slate-800 font-mono text-[10px]">${ak.answer}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Section 4: Official MEDUCA 3-Level Evaluation Rubric -->
      <section class="mt-2.5">
        <div class="border-2 border-slate-800 rounded-xl overflow-hidden">
          <table class="w-full text-left border-collapse text-[10px]">
            <thead>
              <tr class="bg-slate-100 border-b-2 border-slate-800 text-slate-900 font-black uppercase tracking-wider">
                <th class="p-1.5 w-4/12">MEDUCA AOA Learning Criterion</th>
                <th class="p-1.5 w-3/12 text-emerald-800">Independent (3 pts)</th>
                <th class="p-1.5 w-3/12 text-blue-800">With Support (2 pts)</th>
                <th class="p-1.5 w-2/12 text-amber-800">Emerging (1 pt)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-300 font-medium text-slate-800 bg-white">
              ${(teacherGuide.rubric || []).slice(0, 3).map(r => `
                <tr>
                  <td class="p-1.5 font-bold text-slate-900">${r.criterion}</td>
                  <td class="p-1.5 text-slate-700">${r.independent}</td>
                  <td class="p-1.5 text-slate-700">${r.withSupport}</td>
                  <td class="p-1.5 text-slate-700">${r.emerging}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>

      <!-- Page 3 Footer -->
      <footer class="mt-auto pt-2 border-t border-slate-300 flex justify-between items-center text-[10px] text-slate-500 font-bold">
        <span>EduGen Panama · Action-Oriented Approach Curriculum · MEDUCA</span>
        <span>Page 3 of 3 (Complete Activity Pack & Teacher Guide)</span>
      </footer>
    </div>
  `;

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>${title} - Cuaderno Pedagógico AOA</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
      <style>
        @page {
          size: A4 portrait;
          margin: 6mm;
        }
        body {
          font-family: 'Outfit', sans-serif;
          background-color: #0F172A;
          margin: 0;
          padding: 16px;
        }
        .workbook-page {
          width: 210mm;
          min-height: 297mm;
          max-height: 297mm;
          margin-left: auto;
          margin-right: auto;
          margin-bottom: 24px;
          box-sizing: border-box;
          page-break-after: always;
          break-after: page;
          overflow: hidden;
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
            max-height: 100vh !important;
            margin: 0 !important;
            margin-bottom: 0 !important;
            padding: 6mm !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            page-break-after: always !important;
            break-after: page !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="max-w-[215mm] mx-auto">
        ${page1Html}
        ${page2Html}
        ${page3Html}
      </div>
    </body>
    </html>
  `;
}
