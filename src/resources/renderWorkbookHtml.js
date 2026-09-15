import { getIllustrationSvg, renderSpatialSceneSvg } from './illustrations.js';

export function renderWorkbookHtml(pack) {
  const isKinder = /kinder|pre-?k|early/i.test(pack.grade || '');
  const isListening = /listen/i.test(pack.skill || '');
  const colorPolicy = pack.color_policy || 'vocabulary_only'; // 'vocabulary_only' | 'all_color' | 'monochrome'

  let pagesHtml = '';
  let pageNumber = 1;

  const renderHeader = (sectionTitle, mainTitle, subtitle) => `
    <header class="border-b-2 border-slate-200 pb-3 mb-6 flex justify-between items-baseline">
      <div>
        <span class="text-xs font-bold tracking-wider text-slate-500 uppercase block">${sectionTitle || (pack.title || 'ENGLISH ACTIVITY PACK')}</span>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight">${mainTitle}</h1>
        ${subtitle ? `<p class="text-sm font-medium text-slate-600 mt-1">${subtitle}</p>` : ''}
      </div>
      <div class="text-right">
        <span class="text-xs font-extrabold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">${pack.grade || ''} · ${pack.skill || ''}</span>
      </div>
    </header>
  `;

  const renderFooter = (adultNote = '') => `
    <footer class="mt-auto pt-4 border-t border-slate-200 flex justify-between items-center text-xs text-slate-400">
      <span>${adultNote ? `<strong class="text-slate-600">Adult:</strong> ${adultNote}` : (isKinder ? 'Listen · Point · Move · Play' : 'MEDUCA English Curriculum · Action-Oriented Approach (AOA)')}</span>
      <span class="font-bold text-slate-500">${pageNumber++}</span>
    </footer>
  `;

  // ═══════════════════════════════════════
  // PAGE 1: COVER PAGE
  // ═══════════════════════════════════════
  pagesHtml += `
    <section class="workbook-page bg-white p-12 min-h-[1050px] flex flex-col justify-between border border-slate-200 shadow-xl rounded-2xl mb-8 print:border-none print:shadow-none print:m-0 print:p-8">
      <header class="flex justify-between items-center border-b-2 border-slate-200 pb-4">
        <span class="text-xs font-black tracking-widest text-slate-600 uppercase">MEDUCA PANAMÁ · ENFOQUE AOA</span>
        <span class="text-xs font-bold uppercase px-3 py-1 bg-slate-100 text-slate-800 rounded-full border border-slate-300">${pack.grade} · ${pack.skill}</span>
      </header>

      <div class="my-auto text-center space-y-6">
        <div class="inline-block p-5 rounded-3xl bg-slate-50 border-2 border-slate-200 mb-2">
          <div class="w-28 h-28 mx-auto flex items-center justify-center">
            ${getIllustrationSvg('book', 'color') || getIllustrationSvg('pineapple', 'color') || `<div class="text-5xl">📘</div>`}
          </div>
        </div>
        
        <div>
          <span class="text-xs font-black uppercase tracking-widest text-slate-500">My English Activity Workbook</span>
          <h1 class="text-4xl font-black text-slate-900 mt-2 tracking-tight">${pack.title}</h1>
          <p class="text-base text-slate-600 mt-3 max-w-lg mx-auto font-medium">${pack.lessonTitle || pack.title}</p>
        </div>

        <div class="max-w-md mx-auto bg-slate-50/80 p-6 rounded-2xl border-2 border-slate-300 text-left space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">This book belongs to:</label>
            <div class="border-b-2 border-slate-400 h-8"></div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Date</label>
              <div class="border-b-2 border-slate-300 h-8"></div>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Grade & Group</label>
              <div class="border-b-2 border-slate-300 h-8"></div>
            </div>
          </div>
        </div>
      </div>

      ${renderFooter(isKinder ? 'name each object. Labels are support for the adult; children do not need to read.' : '')}
    </section>
  `;

  // ═══════════════════════════════════════
  // ACTIVITIES PAGES
  // ═══════════════════════════════════════
  (pack.activities || []).forEach((act, actIdx) => {
    const actNumber = actIdx + 1;
    // Determine color mode for this page:
    // If color_policy is 'vocabulary_only', only 'vocabulary_cards' get color, all others are outline.
    const isVocabPage = act.type === 'vocabulary_cards';
    const pageMode = colorPolicy === 'all_color' || (colorPolicy === 'vocabulary_only' && isVocabPage) ? 'color' : 'outline';

    let actContent = '';

    // ── 1. VOCABULARY CARDS ──
    if (act.type === 'vocabulary_cards') {
      const items = act.items || [
        { label: 'book', icon: 'book' },
        { label: 'desk', icon: 'desk' },
        { label: 'chair', icon: 'chair' },
        { label: 'bag', icon: 'bag' },
        { label: 'pencil', icon: 'pencil' },
        { label: 'crayon', icon: 'crayon' }
      ];

      actContent = `
        <div class="grid grid-cols-2 gap-6 my-auto max-w-lg mx-auto">
          ${items.map(it => `
            <div class="bg-white p-5 rounded-3xl border-2 border-slate-800 text-center flex flex-col justify-between items-center h-48 shadow-sm">
              <div class="w-24 h-24 flex items-center justify-center">
                ${getIllustrationSvg(it.icon || it.label, pageMode) || `<div class="text-3xl font-bold">${it.label}</div>`}
              </div>
              <span class="text-xl font-bold text-slate-900 tracking-wide">${it.label}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    // ── 2. MATCH PICTURE TO WORD ──
    else if (act.type === 'match_picture_word') {
      const pairs = act.pairs || [
        { left: 'book', icon: 'book', right: 'desk' },
        { left: 'chair', icon: 'chair', right: 'chair' },
        { left: 'pencil', icon: 'pencil', right: 'pencil' }
      ];

      actContent = `
        <div class="my-auto space-y-6 max-w-lg mx-auto">
          <p class="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Listen to each word. Join each picture to its word:</p>
          ${pairs.map(p => `
            <div class="flex items-center justify-between gap-6">
              <!-- Left Picture Box -->
              <div class="w-44 h-28 bg-white rounded-2xl border-2 border-slate-800 p-3 flex items-center justify-center relative shadow-sm">
                <div class="w-16 h-16 flex items-center justify-center">
                  ${getIllustrationSvg(p.icon || p.left, pageMode) || `<span class="font-bold">${p.left}</span>`}
                </div>
                <div class="w-3.5 h-3.5 rounded-full bg-slate-800 absolute -right-2"></div>
              </div>

              <div class="flex-1 border-t-2 border-dashed border-slate-300"></div>

              <!-- Right Word Box -->
              <div class="w-44 h-28 bg-white rounded-2xl border-2 border-slate-800 p-4 flex items-center justify-center relative shadow-sm">
                <div class="w-3.5 h-3.5 rounded-full bg-slate-800 absolute -left-2"></div>
                <span class="text-2xl font-bold text-slate-900">${p.right}</span>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    // ── 3. MATCH LOCATION WORD (Spatial Scenes) ──
    else if (act.type === 'match_location_word') {
      const items = act.items || [
        { subject: 'book', reference: 'bag', relation: 'in', word: 'in' },
        { subject: 'book', reference: 'desk', relation: 'on', word: 'on' },
        { subject: 'book', reference: 'desk', relation: 'under', word: 'under' }
      ];

      actContent = `
        <div class="my-auto space-y-6 max-w-xl mx-auto">
          ${items.map(it => `
            <div class="flex items-center justify-between gap-6">
              <!-- Spatial Scene Box -->
              <div class="w-56 h-36 bg-white rounded-2xl border-2 border-slate-800 p-2 flex items-center justify-center relative shadow-sm">
                ${renderSpatialSceneSvg({ subject: it.subject, reference: it.reference, relation: it.relation, mode: pageMode })}
                <div class="w-3.5 h-3.5 rounded-full bg-slate-800 absolute -right-2"></div>
              </div>

              <div class="flex-1 border-t-2 border-dashed border-slate-300"></div>

              <!-- Word Box -->
              <div class="w-44 h-36 bg-white rounded-2xl border-2 border-slate-800 p-4 flex items-center justify-center relative shadow-sm">
                <div class="w-3.5 h-3.5 rounded-full bg-slate-800 absolute -left-2"></div>
                <span class="text-3xl font-extrabold text-slate-900">${it.word}</span>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    // ── 4. LISTEN & CHOOSE PICTURE (Rows of choices) ──
    else if (act.type === 'listen_choose_picture' || act.type === 'card_choices') {
      const items = act.items || [];
      actContent = `
        <div class="space-y-6 my-auto">
          ${items.map((item, i) => `
            <div class="space-y-2">
              <div class="flex items-center gap-3">
                <span class="text-xl font-bold text-slate-900">${i + 1}</span>
                <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Listen and circle one picture:</span>
              </div>

              <div class="grid grid-cols-${item.options?.length === 4 ? '4' : item.options?.length === 3 ? '3' : '2'} gap-4">
                ${(item.options || []).map((opt, j) => `
                  <div class="bg-white p-4 rounded-3xl border-2 border-slate-800 text-center flex flex-col justify-between items-center min-h-[160px] relative shadow-sm hover:border-indigo-600 transition">
                    <span class="absolute top-3 left-4 text-xs font-bold text-slate-400">${opt.letter || String.fromCharCode(65 + j)}</span>
                    <div class="w-full h-28 flex items-center justify-center my-auto">
                      ${opt.position && opt.position !== 'none'
                        ? renderSpatialSceneSvg({ subject: opt.icon || 'book', reference: opt.anchor || 'desk', relation: opt.position, mode: pageMode })
                        : (getIllustrationSvg(opt.icon || opt.label, pageMode) || `<div class="font-bold text-xl">${opt.label || ''}</div>`)}
                    </div>
                    ${opt.subtext ? `<span class="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full mt-1">${opt.subtext}</span>` : ''}
                    ${!isKinder && opt.label ? `<span class="text-sm font-bold text-slate-800">${opt.label}</span>` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    // ── 5. LISTEN & MATCH PRICE (Market Fruit Lesson) ──
    else if (act.type === 'listen_match_price' || act.type === 'matching') {
      const pairs = act.pairs || [
        { left: 'Pineapple', icon: 'pineapple', right: '$2.50' },
        { left: 'Apple', icon: 'apple', right: '$1.00' },
        { left: 'Bananas', icon: 'banana', right: '$0.50' },
        { left: 'Orange', icon: 'orange', right: '$0.75' }
      ];

      actContent = `
        <div class="my-auto space-y-4 max-w-xl mx-auto">
          <p class="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Listen to the market prices. Draw a line to match each fruit to its price:</p>
          ${pairs.map((p, pi) => `
            <div class="flex items-center justify-between gap-6">
              <!-- Left Fruit Card -->
              <div class="flex-1 bg-white p-4 rounded-2xl border-2 border-slate-800 flex items-center justify-between shadow-sm">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 flex items-center justify-center">
                    ${getIllustrationSvg(p.icon || p.left, pageMode) || '🍎'}
                  </div>
                  <span class="font-extrabold text-slate-900 text-lg">${p.left}</span>
                </div>
                <div class="w-3.5 h-3.5 rounded-full bg-slate-800"></div>
              </div>

              <!-- Dashed connection line -->
              <div class="w-8 border-t-2 border-dashed border-slate-300"></div>

              <!-- Right Price Card -->
              <div class="w-40 bg-white p-4 rounded-2xl border-2 border-slate-800 flex items-center justify-between shadow-sm">
                <div class="w-3.5 h-3.5 rounded-full bg-slate-800"></div>
                <span class="text-2xl font-black text-slate-900 font-mono">${p.right}</span>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    // ── 6. SHARED READING PAGE (Kinder Story Time) ──
    else if (act.type === 'shared_reading_page') {
      const scenes = act.scenes || [
        { num: 1, text: 'Look on the desk.', subject: 'book', reference: 'desk', relation: 'on' },
        { num: 2, text: 'Look under the chair.', subject: 'book', reference: 'chair', relation: 'under' },
        { num: 3, text: 'Look in the bag.', subject: 'book', reference: 'bag', relation: 'in' }
      ];

      actContent = `
        <div class="my-auto space-y-6">
          ${scenes.map(sc => `
            <div class="bg-white p-6 rounded-3xl border-2 border-slate-800 flex items-center gap-8 shadow-sm">
              <span class="text-2xl font-black text-slate-900 shrink-0 w-8">${sc.num}</span>
              <div class="w-48 h-28 flex items-center justify-center shrink-0">
                ${renderSpatialSceneSvg({ subject: sc.subject || 'book', reference: sc.reference || 'desk', relation: sc.relation || 'on', mode: pageMode })}
              </div>
              <p class="text-3xl font-black text-slate-900 tracking-tight">${sc.text}</p>
            </div>
          `).join('')}
        </div>
      `;
    }

    // ── 7. TABLE CHECKLIST (Shopping List / Information Grid) ──
    else if (act.type === 'table_checklist') {
      const headers = act.headers || ['Fruit / Item', 'Heard in Audio?', 'Price'];
      actContent = `
        <div class="my-auto">
          <div class="border-2 border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-100 border-b-2 border-slate-800 text-slate-900 text-sm font-black uppercase tracking-wider">
                  ${headers.map((h, hi) => `<th class="p-4 ${hi === 0 ? 'w-5/12' : 'w-auto'}">${h}</th>`).join('')}
                </tr>
              </thead>
              <tbody class="divide-y-2 divide-slate-200 text-base">
                ${(act.rows || []).map((row, ri) => `
                  <tr class="${ri % 2 === 0 ? 'bg-white' : 'bg-slate-50'}">
                    <td class="p-4 font-bold text-slate-900 flex items-center gap-3">
                      <div class="w-10 h-10 flex items-center justify-center shrink-0">
                        ${getIllustrationSvg(row.col1, pageMode) || '🍎'}
                      </div>
                      ${row.col1}
                    </td>
                    <td class="p-4 text-slate-700 font-medium">
                      <span class="inline-flex items-center gap-4 border-2 border-slate-300 rounded-xl px-3 py-1.5 bg-white">
                        <label class="flex items-center gap-1.5 cursor-pointer"><span class="w-4 h-4 rounded border-2 border-slate-500 inline-block"></span> Yes</label>
                        <span class="text-slate-300">|</span>
                        <label class="flex items-center gap-1.5 cursor-pointer"><span class="w-4 h-4 rounded border-2 border-slate-500 inline-block"></span> No</label>
                      </span>
                    </td>
                    <td class="p-4 text-slate-900 font-black font-mono text-lg">${row.col3 || '_______'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    // ── 8. OPEN DRAWING (Draw & Tell / TPR) ──
    else if (act.type === 'open_drawing' || act.type === 'draw_write') {
      actContent = `
        <div class="my-auto space-y-6">
          <div class="bg-slate-50 p-6 rounded-2xl border-2 border-slate-800 text-slate-900 font-bold text-base">
            ${act.prompt || 'Listen to your teacher. Draw your response in the box below.'}
          </div>

          <div class="w-full h-80 border-2 border-slate-800 rounded-3xl bg-white p-6 relative flex items-center justify-center">
            ${act.referenceScene ? renderSpatialSceneSvg({ subject: 'book', reference: 'desk', relation: 'under', mode: 'outline' }) : ''}
          </div>

          <div class="space-y-3 pt-2">
            <div class="border-b-2 border-slate-300 h-6"></div>
            <div class="border-b-2 border-slate-300 h-6"></div>
          </div>
        </div>
      `;
    }

    pagesHtml += `
      <section class="workbook-page bg-white p-12 min-h-[1050px] flex flex-col justify-between border border-slate-200 shadow-xl rounded-2xl mb-8 print:border-none print:shadow-none print:m-0 print:p-8">
        ${renderHeader(act.section ? act.section.toUpperCase() : `ACTIVITY ${actNumber}`, act.title, act.instruction)}
        ${actContent}
        ${renderFooter(act.teacher_note || (isKinder ? 'Adult: Children may point instead of circling.' : ''))}
      </section>
    `;
  });

  // ═══════════════════════════════════════
  // REFLECTION PAGE (for Kinder)
  // ═══════════════════════════════════════
  if (isKinder) {
    pagesHtml += `
      <section class="workbook-page bg-white p-12 min-h-[1050px] flex flex-col justify-between border border-slate-200 shadow-xl rounded-2xl mb-8 print:border-none print:shadow-none print:m-0 print:p-8">
        ${renderHeader('REFLECT', 'How did I feel?', 'Point to a face. Tell or show your teacher.')}
        
        <div class="my-auto space-y-8 text-center">
          <div class="grid grid-cols-2 gap-12 max-w-md mx-auto">
            <!-- Face 1: Happy -->
            <div class="p-6 rounded-3xl border-2 border-slate-800">
              <svg viewBox="0 0 100 100" class="w-32 h-32 mx-auto" fill="none" stroke="#0F172A" stroke-width="3">
                <circle cx="50" cy="50" r="42" fill="#FFFFFF" />
                <circle cx="36" cy="42" r="3.5" fill="#0F172A" />
                <circle cx="64" cy="42" r="3.5" fill="#0F172A" />
                <path d="M30 58 C38 74 62 74 70 58" stroke-linecap="round" />
              </svg>
              <div class="text-xl font-black text-slate-900 mt-4">I enjoyed it.</div>
            </div>

            <!-- Face 2: Want Help -->
            <div class="p-6 rounded-3xl border-2 border-slate-800">
              <svg viewBox="0 0 100 100" class="w-32 h-32 mx-auto" fill="none" stroke="#0F172A" stroke-width="3">
                <circle cx="50" cy="50" r="42" fill="#FFFFFF" />
                <circle cx="36" cy="42" r="3.5" fill="#0F172A" />
                <circle cx="64" cy="42" r="3.5" fill="#0F172A" />
                <line x1="34" y1="64" x2="66" y2="64" stroke-linecap="round" stroke-width="3.5" />
              </svg>
              <div class="text-xl font-black text-slate-900 mt-4">I want help.</div>
            </div>
          </div>

          <div class="text-left max-w-xl mx-auto">
            <h3 class="font-bold text-slate-900 text-lg mb-2">Draw your favourite classroom object:</h3>
            <div class="w-full h-56 border-2 border-slate-800 rounded-3xl bg-white"></div>
          </div>
        </div>

        ${renderFooter('Read the labels aloud. Neither choice is a grade. The child may tell you a different feeling.')}
      </section>
    `;
  }

  // ═══════════════════════════════════════
  // TEACHER GUIDE (With timings & steps)
  // ═══════════════════════════════════════
  const timing = pack.timing || {};
  pagesHtml += `
    <section class="workbook-page bg-white p-12 min-h-[1050px] flex flex-col justify-between border border-slate-200 shadow-xl rounded-2xl mb-8 print:border-none print:shadow-none print:m-0 print:p-8">
      ${renderHeader('ADULTS ONLY · TEACHER GUIDE', 'Teacher guide', 'Main aim: follow short classroom instructions with visual support.')}
      
      <div class="my-auto space-y-4">
        ${[
          { name: 'Warm-up and modelling · 10 min', desc: timing.warmUp || 'Show objects or picture cards. Model vocabulary with real objects in the classroom.' },
          { name: 'Presentation · 8 min', desc: timing.presentation || 'Use the three-scene story. Children point and listen to the target dialogue.' },
          { name: 'Guided listening · 12 min', desc: timing.guidedPractice || 'Choose activities 1 and 2. Repeat slowly. Use gestures, real objects and movement.' },
          { name: 'Performance · 10 min', desc: timing.performance || 'Give one command at a time, allow time to act and give positive, specific feedback.' },
          { name: 'Listening check · 5 min', desc: timing.check || 'Observe a small group; spread individual observations across sessions if needed.' },
          { name: 'Reflection · 5 min', desc: timing.reflection || 'Children point to a feeling face and draw or name their favourite object.' }
        ].map(st => `
          <div class="border-b border-slate-200 pb-3">
            <h3 class="font-black text-slate-900 text-base">${st.name}</h3>
            <p class="text-sm text-slate-600 mt-0.5">${st.desc}</p>
          </div>
        `).join('')}

        <div class="p-4 bg-slate-50 border-2 border-slate-300 rounded-2xl text-xs text-slate-600 leading-relaxed mt-4">
          <strong>AOA Teacher Tip:</strong> Total 50 minutes, including movement. This is a resource bank: do not require every page in one lesson. No independent reading is needed. Use a clear teacher voice; no screen or internet is required.
        </div>
      </div>

      ${renderFooter('Teacher Guide and Curricular Execution')}
    </section>
  `;

  // ═══════════════════════════════════════
  // TEACHER SCRIPTS (READ ALOUD)
  // ═══════════════════════════════════════
  pagesHtml += `
    <section class="workbook-page bg-white p-12 min-h-[1050px] flex flex-col justify-between border border-slate-200 shadow-xl rounded-2xl mb-8 print:border-none print:shadow-none print:m-0 print:p-8">
      ${renderHeader('ADULTS ONLY · READ ALOUD', 'Teacher scripts', 'Say one short sentence at a time. Wait for the child to respond.')}
      
      <div class="my-auto space-y-6">
        ${(pack.activities || []).map((act, ai) => `
          <div class="border-b border-slate-200 pb-4">
            <h3 class="font-black text-slate-900 text-sm mb-2 uppercase tracking-wide">
              Activity ${ai + 1} · ${act.title}
            </h3>

            ${act.type === 'listen_choose_picture' || act.type === 'card_choices' ? `
              <div class="space-y-1.5 text-sm pl-4">
                ${(act.items || []).map((it, ii) => `
                  <div>
                    <span class="font-bold text-slate-900">${ii + 1}.</span>
                    <span class="italic text-slate-800">"${it.teacherPrompt || ''}"</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${act.type === 'listen_match_price' || act.type === 'matching' ? `
              <div class="text-sm pl-4 italic text-slate-800">
                ${act.teacherScript ? `"${act.teacherScript}"` : 'Teacher reads each item name and its corresponding price clearly.'}
              </div>
            ` : ''}

            ${act.type === 'shared_reading_page' ? `
              <div class="text-sm pl-4 italic text-slate-800">
                "Where is my book? Look on the desk. No book! Look under the chair. No book! Look in the bag. There it is! My book is in the bag. Thank you for helping!"
              </div>
            ` : ''}

            ${act.type === 'table_checklist' ? `
              <div class="text-sm pl-4 italic text-slate-800">
                ${act.teacherScript || 'Read each item and price distinctly. Allow students 15 seconds to mark Yes/No.'}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>

      ${renderFooter('Scripts are oral input for the adult. Retain object picture cues during checks.')}
    </section>
  `;

  // ═══════════════════════════════════════
  // OBSERVATION AND SUPPORT RUBRIC
  // ═══════════════════════════════════════
  pagesHtml += `
    <section class="workbook-page bg-white p-12 min-h-[1050px] flex flex-col justify-between border border-slate-200 shadow-xl rounded-2xl mb-8 print:border-none print:shadow-none print:m-0 print:p-8">
      ${renderHeader('ADULTS ONLY · KEEP WITH THE TEACHER', 'Observation and support', 'Record what the child understands and what support helps.')}
      
      <div class="my-auto space-y-6">
        <div>
          <label class="font-bold text-slate-900 text-sm">Child / Student Name:</label>
          <div class="border-b-2 border-slate-400 h-8"></div>
        </div>

        <div class="border-2 border-slate-800 rounded-2xl overflow-hidden">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b-2 border-slate-800 bg-slate-100 text-xs font-black uppercase text-slate-900">
                <th class="p-3 w-6/12">Command / Skill Target</th>
                <th class="p-3 text-center w-3/12">Independent</th>
                <th class="p-3 text-center w-3/12">With support</th>
              </tr>
            </thead>
            <tbody class="divide-y-2 divide-slate-200 text-sm">
              ${(pack.rubric || [
                { criterion: 'Book on desk' },
                { criterion: 'Crayon in bag' },
                { criterion: 'Pencil under chair' },
                { criterion: 'Book next to bag' }
              ]).map(r => `
                <tr>
                  <td class="p-3.5 font-bold text-slate-900">${r.criterion}</td>
                  <td class="p-3.5 text-center"><span class="w-5 h-5 border-2 border-slate-800 rounded inline-block"></span></td>
                  <td class="p-3.5 text-center"><span class="w-5 h-5 border-2 border-slate-800 rounded inline-block"></span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="space-y-2">
          <label class="font-bold text-slate-900 text-sm">Support used / next step:</label>
          <div class="border-b border-slate-300 h-6"></div>
          <div class="border-b border-slate-300 h-6"></div>
        </div>

        <div class="grid grid-cols-2 gap-6 pt-2 text-xs text-slate-600">
          <div class="border border-slate-300 p-4 rounded-xl">
            <h4 class="font-bold text-slate-900 mb-1">Make it accessible</h4>
            <p>Offer two choices, repeat slowly and use gestures or larger pictures. Seated pointing and paper-object placement are valid alternatives.</p>
          </div>
          <div class="border border-slate-300 p-4 rounded-xl">
            <h4 class="font-bold text-slate-900 mb-1">Extend gently</h4>
            <p>After one-step success, try two short steps or let a child help a partner by pointing. Avoid speed competitions or requiring full sentences.</p>
          </div>
        </div>
      </div>

      ${renderFooter('Formative observation record · MEDUCA Panama AOA')}
    </section>
  `;

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>${pack.title || 'Workbook'} - EduGen Panama</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
      <style>
        body { font-family: 'Outfit', sans-serif; background-color: #0F172A; margin: 0; padding: 20px; }
        .workbook-page {
          width: 210mm;
          min-height: 297mm;
          margin-left: auto;
          margin-right: auto;
          box-sizing: border-box;
        }
        @media print {
          body { background-color: white !important; padding: 0 !important; }
          .workbook-page {
            width: 100% !important;
            min-height: auto !important;
            page-break-after: always !important;
            break-after: page !important;
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 14mm 14mm !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="max-w-[215mm] mx-auto">
        ${pagesHtml}
      </div>
    </body>
    </html>
  `;
}
