import { getIllustrationSvg } from './illustrations.js';

export function renderWorkbookHtml(pack) {
  const isKinder = /kinder|pre-?k|early/i.test(pack.grade || '');
  const isListening = /listen/i.test(pack.skill || '');

  // Helper for SVG rendering with fallback badge
  const renderItemVisual = (name, label = '') => {
    const svg = getIllustrationSvg(name) || getIllustrationSvg(label);
    if (svg) {
      return `<div class="w-20 h-20 mx-auto mb-2 flex items-center justify-center">${svg}</div>`;
    }
    // Fallback: Elegant price tag or topic badge
    if (/\$|\d+\.\d+/.test(label)) {
      return `<div class="w-16 h-16 mx-auto mb-2 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-center justify-center font-bold text-amber-700 text-xl font-mono shadow-sm">$</div>`;
    }
    return '';
  };

  let pagesHtml = '';
  let pageNumber = 1;

  const renderHeaderFooter = (sectionTitle, mainTitle, subtitle) => `
    <header class="border-b-2 border-slate-200 pb-3 mb-6 flex justify-between items-baseline">
      <div>
        <span class="text-xs font-bold tracking-wider text-indigo-600 uppercase block">${sectionTitle || (pack.title || 'ENGLISH ACTIVITY PACK')}</span>
        <h1 class="text-2xl font-black text-slate-800 tracking-tight">${mainTitle}</h1>
        ${subtitle ? `<p class="text-sm font-medium text-slate-600 mt-0.5">${subtitle}</p>` : ''}
      </div>
      <div class="text-right">
        <span class="text-xs font-extrabold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">${pack.grade || ''} · ${pack.skill || ''}</span>
      </div>
    </header>
  `;

  const renderFooter = (adultNote = '') => `
    <footer class="mt-auto pt-4 border-t border-slate-200 flex justify-between items-center text-xs text-slate-400">
      <span>${adultNote ? `<strong class="text-slate-600">Note:</strong> ${adultNote}` : (isKinder ? 'Listen · Point · Move · Play' : 'MEDUCA English Curriculum · Action-Oriented Approach (AOA)')}</span>
      <span class="font-bold text-slate-500">${pageNumber++}</span>
    </footer>
  `;

  // ═══════════════════════════════════════
  // PAGE 1: COVER PAGE
  // ═══════════════════════════════════════
  pagesHtml += `
    <section class="workbook-page bg-white p-12 min-h-[1050px] flex flex-col justify-between border border-slate-200 shadow-xl rounded-2xl mb-8 print:border-none print:shadow-none print:m-0 print:p-8">
      <header class="flex justify-between items-center border-b-2 border-slate-200 pb-4">
        <span class="text-xs font-black tracking-widest text-indigo-600 uppercase">MEDUCA PANAMÁ · ENFOQUE AOA</span>
        <span class="text-xs font-bold uppercase px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">${pack.grade} · ${pack.skill}</span>
      </header>

      <div class="my-auto text-center space-y-6">
        <div class="inline-block p-4 rounded-3xl bg-indigo-50/70 border border-indigo-100 mb-2">
          <div class="w-24 h-24 mx-auto flex items-center justify-center">
            ${getIllustrationSvg('book') || getIllustrationSvg('shopping_basket') || `<div class="text-5xl">📘</div>`}
          </div>
        </div>
        
        <div>
          <span class="text-sm font-black uppercase tracking-widest text-indigo-600">My English Activity Workbook</span>
          <h1 class="text-4xl font-black text-slate-900 mt-2 tracking-tight">${pack.title}</h1>
          <p class="text-lg text-slate-600 mt-3 max-w-lg mx-auto font-medium">${pack.lessonTitle || pack.title}</p>
        </div>

        <div class="max-w-md mx-auto bg-slate-50 p-6 rounded-2xl border-2 border-slate-200/80 text-left space-y-4 shadow-sm">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Student Name</label>
            <div class="border-b-2 border-slate-300 h-8"></div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Date</label>
              <div class="border-b-2 border-slate-300 h-8"></div>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Group / Grade</label>
              <div class="border-b-2 border-slate-300 h-8"></div>
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Teacher</label>
            <div class="border-b-2 border-slate-300 h-8"></div>
          </div>
        </div>
      </div>

      ${renderFooter(isKinder ? 'Adult support: Read instructions aloud. No student reading required.' : '')}
    </section>
  `;

  // ═══════════════════════════════════════
  // ACTIVITIES PAGES
  // ═══════════════════════════════════════
  (pack.activities || []).forEach((act, actIdx) => {
    const actNumber = actIdx + 1;
    let actContent = '';

    // ── A. CARD CHOICES ──
    if (act.type === 'card_choices') {
      const items = act.items || [];
      actContent = `
        <div class="space-y-6 my-auto">
          ${items.map((item, i) => `
            <div class="bg-slate-50/60 p-4 rounded-2xl border-2 border-slate-200">
              <div class="flex items-center gap-2 mb-3">
                <span class="w-7 h-7 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs">${i + 1}</span>
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Listen & choose the correct card:</span>
              </div>
              
              <div class="grid grid-cols-${item.options.length === 3 ? '3' : '2'} gap-4">
                ${item.options.map((opt, j) => `
                  <div class="relative bg-white p-5 rounded-2xl border-2 border-slate-300 hover:border-indigo-400 transition shadow-sm text-center flex flex-col justify-between min-h-[140px]">
                    <div class="flex justify-between items-center w-full">
                      <span class="w-6 h-6 rounded-lg bg-slate-100 font-bold text-slate-700 text-xs flex items-center justify-center border border-slate-200">${opt.letter || String.fromCharCode(65 + j)}</span>
                      <div class="w-5 h-5 rounded-full border-2 border-slate-400"></div>
                    </div>
                    
                    <div class="my-2">
                      ${renderItemVisual(opt.icon, opt.label)}
                      <div class="font-extrabold text-slate-800 text-base leading-tight">${opt.label || ''}</div>
                      ${opt.subtext ? `<div class="text-xs font-bold text-indigo-600 mt-1 bg-indigo-50 px-2 py-0.5 rounded-full inline-block">${opt.subtext}</div>` : ''}
                    </div>

                    <div class="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Circle or check [✓]</div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    // ── B. TABLE CHECKLIST ──
    else if (act.type === 'table_checklist') {
      const headers = act.headers || ['Item', 'Heard in Audio?', 'Detail / Price'];
      actContent = `
        <div class="my-auto">
          <div class="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 mb-6 flex items-center gap-3">
            <span class="text-2xl">📋</span>
            <p class="text-xs font-medium text-indigo-900 leading-relaxed">Listen carefully to the audio read aloud by your teacher. Mark whether each item is mentioned and complete the missing information in each row.</p>
          </div>

          <div class="border-2 border-slate-300 rounded-2xl overflow-hidden shadow-sm">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-100 border-b-2 border-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider">
                  ${headers.map((h, hi) => `<th class="p-3.5 ${hi === 0 ? 'w-5/12' : 'w-auto'}">${h}</th>`).join('')}
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 text-sm">
                ${(act.rows || []).map((row, ri) => `
                  <tr class="${ri % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}">
                    <td class="p-4 font-bold text-slate-800 flex items-center gap-3">
                      <span class="w-5 h-5 rounded-full bg-slate-200 text-slate-600 text-xs flex items-center justify-center">${ri + 1}</span>
                      ${row.col1}
                    </td>
                    <td class="p-4 text-slate-600 font-medium">
                      <span class="inline-flex items-center gap-3 border border-slate-300 rounded-lg px-3 py-1.5 bg-white">
                        <label class="flex items-center gap-1.5 cursor-pointer"><span class="w-4 h-4 rounded border-2 border-slate-400 inline-block"></span> Yes</label>
                        <span class="text-slate-300">|</span>
                        <label class="flex items-center gap-1.5 cursor-pointer"><span class="w-4 h-4 rounded border-2 border-slate-400 inline-block"></span> No</label>
                      </span>
                    </td>
                    <td class="p-4 text-slate-600 font-bold border-b border-dashed border-slate-300">${row.col3 || '________________'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    // ── C. MATCHING ──
    else if (act.type === 'matching') {
      const pairs = act.pairs || [];
      actContent = `
        <div class="my-auto space-y-4">
          <p class="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Draw a line to match each item on the left to its pair on the right:</p>
          ${pairs.map((p, pi) => `
            <div class="flex items-center justify-between gap-4">
              <!-- Left Card -->
              <div class="flex-1 bg-white p-4 rounded-2xl border-2 border-slate-300 flex items-center justify-between shadow-sm">
                <div class="flex items-center gap-3">
                  <span class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">${pi + 1}</span>
                  <span class="font-extrabold text-slate-800 text-base">${p.left}</span>
                </div>
                <div class="w-3.5 h-3.5 rounded-full bg-indigo-600 border-2 border-white shadow"></div>
              </div>

              <!-- Connecting guideline -->
              <div class="w-8 border-t-2 border-dashed border-slate-300"></div>

              <!-- Right Card -->
              <div class="flex-1 bg-slate-50 p-4 rounded-2xl border-2 border-slate-300 flex items-center justify-between shadow-sm">
                <div class="w-3.5 h-3.5 rounded-full bg-indigo-600 border-2 border-white shadow"></div>
                <span class="font-bold text-slate-700 text-base text-right">${p.right}</span>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    // ── D. DIALOGUE CLOZE ──
    else if (act.type === 'dialogue_cloze') {
      actContent = `
        <div class="my-auto space-y-6">
          <!-- Word Bank Box -->
          <div class="bg-indigo-50 border-2 border-dashed border-indigo-300 p-4 rounded-2xl text-center">
            <span class="text-xs font-black uppercase tracking-widest text-indigo-700 block mb-2">Word Bank</span>
            <div class="flex flex-wrap justify-center gap-2">
              ${(act.wordBank || []).map(w => `<span class="bg-white border-2 border-indigo-200 text-slate-800 font-bold px-3 py-1 rounded-xl text-sm shadow-sm">${w}</span>`).join('')}
            </div>
          </div>

          <!-- Dialogue Lines -->
          <div class="space-y-4">
            ${(act.lines || []).map(line => `
              <div class="bg-white p-4 rounded-2xl border-2 border-slate-200 flex items-start gap-4 shadow-sm">
                <span class="px-3 py-1 rounded-xl bg-slate-100 font-extrabold text-slate-700 text-xs uppercase border border-slate-300 shrink-0">${line.speaker || 'Person'}</span>
                <p class="text-base text-slate-800 font-medium leading-relaxed">${line.text.replace(/_{3,}/g, '<span class="inline-block border-b-2 border-slate-800 w-28 mx-1"></span>')}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // ── E. READ & ANSWER ──
    else if (act.type === 'read_answer') {
      actContent = `
        <div class="my-auto space-y-6">
          <div class="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200 text-slate-800 font-medium leading-relaxed shadow-sm">
            ${act.passage}
          </div>

          <div class="space-y-4">
            ${(act.questions || []).map((q, qi) => `
              <div class="bg-white p-4 rounded-2xl border border-slate-200">
                <div class="font-bold text-slate-900 text-sm mb-2">${qi + 1}. ${q.question}</div>
                <div class="border-b-2 border-slate-300 h-6"></div>
                <div class="border-b border-dashed border-slate-200 h-6 mt-1"></div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // ── F. DRAW & WRITE ──
    else if (act.type === 'draw_write') {
      actContent = `
        <div class="my-auto space-y-4">
          <div class="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 text-slate-800 font-bold text-sm">
            ${act.prompt}
          </div>

          <div class="w-full h-64 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 font-bold text-xs uppercase tracking-wider">
            [ Drawing & Design Workspace ]
          </div>

          <div class="space-y-2 pt-2">
            <div class="border-b-2 border-slate-300 h-6"></div>
            <div class="border-b-2 border-slate-300 h-6"></div>
            <div class="border-b border-dashed border-slate-200 h-6"></div>
          </div>
        </div>
      `;
    }

    pagesHtml += `
      <section class="workbook-page bg-white p-12 min-h-[1050px] flex flex-col justify-between border border-slate-200 shadow-xl rounded-2xl mb-8 print:border-none print:shadow-none print:m-0 print:p-8">
        ${renderHeaderFooter(`ACTIVITY ${actNumber}`, act.title, act.instruction)}
        ${actContent}
        ${renderFooter(isListening ? 'Teacher reads aloud the corresponding script. Students respond individually.' : '')}
      </section>
    `;
  });

  // ═══════════════════════════════════════
  // KINDER REFLECTION (if Pre-K/Kinder)
  // ═══════════════════════════════════════
  if (isKinder) {
    pagesHtml += `
      <section class="workbook-page bg-white p-12 min-h-[1050px] flex flex-col justify-between border border-slate-200 shadow-xl rounded-2xl mb-8 print:border-none print:shadow-none print:m-0 print:p-8">
        ${renderHeaderFooter('SELF-REFLECTION', 'How did I feel today?', 'Point to a face. Tell or show your teacher.')}
        
        <div class="my-auto space-y-8 text-center">
          <div class="grid grid-cols-2 gap-8 max-w-md mx-auto">
            <div class="bg-emerald-50 border-2 border-emerald-300 p-6 rounded-3xl cursor-pointer">
              <div class="text-6xl mb-2">😊</div>
              <span class="font-extrabold text-emerald-800 text-lg">I enjoyed it!</span>
            </div>
            <div class="bg-amber-50 border-2 border-amber-300 p-6 rounded-3xl cursor-pointer">
              <div class="text-6xl mb-2">😐</div>
              <span class="font-extrabold text-amber-800 text-lg">I want help.</span>
            </div>
          </div>

          <div class="text-left">
            <h3 class="font-bold text-slate-800 text-base mb-2">Draw your favourite object or thing from today's lesson:</h3>
            <div class="w-full h-64 border-2 border-dashed border-slate-300 rounded-3xl bg-slate-50"></div>
          </div>
        </div>

        ${renderFooter('Neither choice is a grade. Support emotional awareness in early language learning.')}
      </section>
    `;
  }

  // ═══════════════════════════════════════
  // TEACHER GUIDE & TIMING
  // ═══════════════════════════════════════
  const timing = pack.timing || {};
  pagesHtml += `
    <section class="workbook-page bg-white p-12 min-h-[1050px] flex flex-col justify-between border border-slate-200 shadow-xl rounded-2xl mb-8 print:border-none print:shadow-none print:m-0 print:p-8">
      ${renderHeaderFooter('TEACHER SECTION', 'Teacher Guide & Lesson Timing', 'Pedagogical flow and timing based on Panama MEDUCA AOA framework.')}
      
      <div class="my-auto space-y-4">
        ${[
          { name: '1. Warm-up & Contextualization', desc: timing.warmUp || '10 min · Activate prior knowledge and introduce scenario' },
          { name: '2. Language Presentation & Modeling', desc: timing.presentation || '8 min · Model target vocabulary and key sentences' },
          { name: '3. Guided Practice & Workbook', desc: timing.guidedPractice || '12 min · Supervised student activities with pair check' },
          { name: '4. Communicative Performance', desc: timing.performance || '10 min · Student oral or written task execution' },
          { name: '5. Formative Reflection & Wrap-up', desc: timing.reflection || '5 min · Review answers and self-assessment' }
        ].map(st => `
          <div class="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 flex items-start gap-4">
            <div class="w-2.5 h-12 bg-indigo-600 rounded-full shrink-0"></div>
            <div>
              <h3 class="font-black text-slate-900 text-base">${st.name}</h3>
              <p class="text-sm font-medium text-slate-600 mt-1">${st.desc}</p>
            </div>
          </div>
        `).join('')}

        <div class="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl mt-4 text-xs text-indigo-900 leading-relaxed font-medium">
          <strong>AOA Teacher Tip:</strong> Use real objects or flashcards during the warm-up. Ensure students repeat phrases in context before writing or circling independently.
        </div>
      </div>

      ${renderFooter('Teacher Guide and Curricular Execution')}
    </section>
  `;

  // ═══════════════════════════════════════
  // TEACHER SCRIPTS (READ ALOUD) & ANSWERS
  // ═══════════════════════════════════════
  pagesHtml += `
    <section class="workbook-page bg-white p-12 min-h-[1050px] flex flex-col justify-between border border-slate-200 shadow-xl rounded-2xl mb-8 print:border-none print:shadow-none print:m-0 print:p-8">
      ${renderHeaderFooter('TEACHER SECTION', isListening ? 'Teacher Read-Aloud Scripts' : 'Answer Key & Teacher Prompts', 'Read aloud clearly with natural pacing. Repeat each item once.')}
      
      <div class="my-auto space-y-6">
        ${(pack.activities || []).map((act, ai) => `
          <div class="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-2">
            <h3 class="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <span class="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">${ai + 1}</span>
              ${act.title}
            </h3>

            ${act.type === 'card_choices' ? `
              <div class="space-y-2 pl-8 text-xs">
                ${(act.items || []).map((it, ii) => `
                  <div>
                    <span class="font-bold text-slate-800">Item ${ii + 1} — Say:</span>
                    <span class="italic text-slate-700">"${it.teacherPrompt}"</span>
                    <div class="text-indigo-700 font-bold mt-0.5">Answer: [ ${String.fromCharCode(65 + it.answerIndex)} ] ${it.options[it.answerIndex]?.label || ''}</div>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${act.type === 'table_checklist' ? `
              <div class="pl-8 text-xs space-y-1">
                ${act.teacherScript ? `<div class="font-medium text-slate-800 mb-1"><strong class="text-slate-900">Script:</strong> "${act.teacherScript}"</div>` : ''}
                ${(act.rows || []).map(r => `<div class="text-slate-600">• ${r.col1} -> <strong>${r.col2}</strong> (${r.col3})</div>`).join('')}
              </div>
            ` : ''}

            ${act.type === 'matching' ? `
              <div class="pl-8 text-xs space-y-1 text-slate-700">
                ${(act.pairs || []).map(p => `<div>• <strong>${p.left}</strong> matches with <em>"${p.right}"</em></div>`).join('')}
              </div>
            ` : ''}

            ${act.type === 'dialogue_cloze' ? `
              <div class="pl-8 text-xs space-y-1 text-slate-700">
                ${act.teacherScript ? `<div class="font-medium text-slate-800 mb-1"><strong>Script:</strong> "${act.teacherScript}"</div>` : ''}
                <div class="text-indigo-700 font-bold">Solutions: ${(act.wordBank || []).join(', ')}</div>
              </div>
            ` : ''}

            ${act.type === 'read_answer' ? `
              <div class="pl-8 text-xs space-y-1 text-slate-700">
                ${(act.questions || []).map((q, qi) => `<div>Q${qi + 1} Answer: <strong>${q.answer}</strong></div>`).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>

      ${renderFooter('Keep this page with the teacher during listening sessions.')}
    </section>
  `;

  // ═══════════════════════════════════════
  // FORMATIVE ASSESSMENT RUBRIC & CHECKLIST
  // ═══════════════════════════════════════
  pagesHtml += `
    <section class="workbook-page bg-white p-12 min-h-[1050px] flex flex-col justify-between border border-slate-200 shadow-xl rounded-2xl mb-8 print:border-none print:shadow-none print:m-0 print:p-8">
      ${renderHeaderFooter('EVALUATION', 'Formative Observation Rubric', 'Assessment matrix aligned with MEDUCA Panama AOA performance levels.')}
      
      <div class="my-auto space-y-6">
        ${(pack.rubric || []).map((row, ri) => `
          <div class="border-2 border-slate-300 rounded-2xl p-5 bg-slate-50/50 space-y-3">
            <h3 class="font-black text-slate-900 text-sm flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs">${ri + 1}</span>
              ${row.criterion}
            </h3>

            <div class="grid grid-cols-3 gap-3 text-xs">
              <div class="bg-white p-3 rounded-xl border border-slate-200">
                <div class="flex items-center gap-1.5 font-bold text-emerald-700 mb-1">
                  <span class="w-3.5 h-3.5 rounded border border-emerald-400 inline-block"></span> Independent
                </div>
                <p class="text-slate-600">${row.independent}</p>
              </div>

              <div class="bg-white p-3 rounded-xl border border-slate-200">
                <div class="flex items-center gap-1.5 font-bold text-amber-700 mb-1">
                  <span class="w-3.5 h-3.5 rounded border border-amber-400 inline-block"></span> With Support
                </div>
                <p class="text-slate-600">${row.withSupport}</p>
              </div>

              <div class="bg-white p-3 rounded-xl border border-slate-200">
                <div class="flex items-center gap-1.5 font-bold text-rose-700 mb-1">
                  <span class="w-3.5 h-3.5 rounded border border-rose-400 inline-block"></span> Emerging
                </div>
                <p class="text-slate-600">${row.emerging}</p>
              </div>
            </div>
          </div>
        `).join('')}

        <!-- Observation Notes Box -->
        <div class="border-2 border-dashed border-slate-300 p-4 rounded-2xl">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Teacher Observations & Support Notes:</span>
          <div class="border-b border-slate-200 h-6"></div>
          <div class="border-b border-slate-200 h-6"></div>
          <div class="border-b border-slate-200 h-6"></div>
        </div>
      </div>

      ${renderFooter('Formative evaluation evidence for teacher portfolio.')}
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
        body { font-family: 'Outfit', sans-serif; background-color: #0F172A; }
        .workbook-page {
          width: 210mm;
          min-height: 297mm;
          margin-left: auto;
          margin-right: auto;
          box-sizing: border-box;
        }
        @media print {
          body { background-color: white !important; }
          .workbook-page {
            width: 100% !important;
            min-height: auto !important;
            page-break-after: always !important;
            break-after: page !important;
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 15mm 15mm !important;
          }
          .no-print { display: none !important; }
        }
      </style>
    </head>
    <body class="p-6">
      <div class="max-w-[215mm] mx-auto">
        ${pagesHtml}
      </div>
    </body>
    </html>
  `;
}
