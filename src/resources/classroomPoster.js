import { normalizeThemeScenario } from '../services/themeCurriculum.js';
import { vocabularyWords } from './illustratedPoster.js';
import { getIllustrationSvg } from './illustrations.js';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const flatten=value=>Array.isArray(value)?value.map(flatten).join('\n'):value&&typeof value==='object'?Object.values(value).map(flatten).join('\n'):String(value||'');
const svg=body=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="#334155" stroke-width="3">${body}</svg>`;
const extra={
  cassava:svg('<path d="M18 70 Q35 28 80 25 Q75 65 30 84Z" fill="#b77940"/><ellipse cx="26" cy="75" rx="15" ry="10" fill="#fff3d2"/><path d="M44 47l8 8m6-17l8 8"/>'),
  potatoes:svg('<ellipse cx="35" cy="58" rx="27" ry="20" fill="#d8b279"/><ellipse cx="68" cy="42" rx="24" ry="20" fill="#e7c18c"/><path d="M25 56h3m14 10h3m18-25h3m7 9h3"/>'),
  money:svg('<rect x="8" y="24" width="75" height="42" rx="4" fill="#86efac"/><circle cx="45" cy="45" r="14" fill="#dcfce7"/><circle cx="74" cy="72" r="15" fill="#fcd34d"/>'),
  'shopping list':svg('<rect x="20" y="10" width="60" height="80" rx="4" fill="#fff"/><path d="M30 28h8m8 0h23M30 45h8m8 0h23M30 62h8m8 0h23M30 79h8m8 0h23"/>'),
  market:svg('<path d="M10 39l10-23h60l10 23Z" fill="#fbbf24"/><path d="M15 39v49h70V39" fill="#bfdbfe"/><path d="M30 17l-4 22m24-22v22m20-22l4 22" stroke="#f43f5e" stroke-width="10"/><rect x="40" y="54" width="22" height="34" fill="#fff"/>')
};
function illustration(word){return extra[word.toLowerCase()]||getIllustrationSvg(word)||null;}
export function mapClassroomPoster(raw,grade,index,cefr='') {
  const data=normalizeThemeScenario(raw,'receptive');
  const vocab=Object.fromEntries(Object.entries(data.vocabulary).map(([key,value])=>[key,[...new Set(vocabularyWords(value))]]));
  const nouns=vocab.nouns||vocab.noun||[];
  const preferred=nouns.filter(word=>illustration(word));
  const gallery=[...preferred,...nouns.filter(word=>!preferred.includes(word))].slice(0,5);
  const market=/market|shopping|shop\b/i.test(data.scenarioName) && (vocab.interrogatives||[]).some(q=>/how much/i.test(q));
  const questions=(vocab.interrogatives||vocab.questions||[]).slice(0,2);
  const corpus=[...data.grammar,...data.pragmatic].map(flatten).join('\n');
  const quoted=[...corpus.matchAll(/["']([^"'\n]{5,100}\?)["']/g)].map(m=>m[1]);
  const comparisons=Array.from({length:2},(_,i)=>{
    const q=questions[i]||quoted[i]||['Ask about the scenario','Ask for clarification'][i];
    const examples=quoted.filter(e=>e.toLowerCase().includes(q.toLowerCase())).slice(0,2);
    if(!examples.length&&market)examples.push(i===0?'How much is it?':'How many do you need?');
    return {title:q,function:market?(i===0?'Price / uncountable amounts':'Number / countable items'):'Practice question',examples};
  });
  const dialogue=market?{a:'Customer · Student A',b:'Seller · Student B',left:['Excuse me, how much is it?','I would like ___, please.','Thank you.'],right:['It costs ___ dollars.','How many do you need?','You are welcome.']}:{a:'Student A',b:'Student B',left:['Let’s talk about '+data.scenarioName+'.','What can you tell me about ___?','Could you explain that, please?'],right:['I can tell you about ___.','For example, ___.','Let’s try together.']};
  return {title:data.scenarioName,grade,cefr,index,gallery,vocab,comparisons,dialogue,grammar:data.grammar.map(flatten),social:flatten(data.sociolinguistic)};
}
export function classroomPosterHtml(raw,grade,index,cefr='') {
  const m=mapClassroomPoster(raw,grade,index,cefr);
  const chips=items=>(items||[]).map(item=>`<span class="chip">${esc(item)}</span>`).join('')||'<span>Not specified in curriculum</span>';
  const rest=Object.entries(m.vocab).filter(([key])=>!['verbs','adjectives','adverbs','interrogatives','numbers'].includes(key));
  const gallery=Array.from({length:5},(_,i)=>{const word=m.gallery[i];if(!word)return '<td class="produce-card">—</td>';const drawing=illustration(word);return `<td class="produce-card">${drawing||svg('<path d="M12 15h76v55H50L28 88V70H12Z" fill="#e0f2fe"/><path d="M30 34h40M30 48h30"/>')}<strong>${esc(word)}</strong><small>${drawing?'Name & use':'Discuss this word'}</small></td>`;}).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(m.title)}</title><style>
  @page{size:letter portrait;margin:10mm;background-color:#f8fafc}*,*::before,*::after{box-sizing:border-box}html,body{height:100%;margin:0;padding:0;font-family:'Century Gothic',Arial,sans-serif;color:#0f172a;line-height:1.25}html{width:195.9mm;height:259.4mm}body{--font:8.2pt;font-size:var(--font)}.poster-canvas{height:100%;border:3.5px solid #0284c7;border-radius:14px;background-color:#fff;padding:10px 12px;box-shadow:inset 0 0 0 2px #bae6fd;display:flex;flex-direction:column;justify-content:space-between;gap:6px}.poster-canvas>*{flex-shrink:0}h1,h2,p{margin:0}header{background:linear-gradient(135deg,#0284c7,#0369a1);color:white;border-radius:10px;padding:9px 14px;display:flex;align-items:center;justify-content:space-between;gap:8px}h1{font-size:19pt;line-height:1.1;text-transform:uppercase}header small{color:#bae6fd}.badge{background:#f59e0b;border-radius:20px;padding:5px 12px;font-weight:bold;white-space:nowrap}.tag{display:inline-block;background:#0284c7;color:white;padding:3px 10px;border-radius:5px;font-weight:bold;margin-bottom:5px}table{width:100%;table-layout:fixed;border-collapse:separate;border-spacing:6px 0}td{vertical-align:top;overflow-wrap:anywhere}.produce-card{width:20%;border:2px solid #cbd5e1;border-radius:10px;background:#f8fafc;text-align:center;padding:8px 3px 6px}.produce-card svg{height:52px;width:100%;display:block;margin:0 auto 5px}.produce-card strong{display:block}.produce-card small{display:inline-block;background:#fef3c7;color:#92400e;border-radius:4px;padding:2px 5px;margin-top:4px}.cat{border:1.5px solid;border-radius:8px;padding:7px 9px}.verbs{width:34%;background:#f0fdf4;border-color:#86efac}.modifiers{width:33%;background:#fefce8;border-color:#fde047}.things{width:33%;background:#eff6ff;border-color:#93c5fd}h2{font-size:1.08em;margin-bottom:5px}.chip{display:inline-block;background:#fff9;border:1px solid #cbd5e1;padding:2px 5px;border-radius:5px;margin:1.5px;font-weight:bold}.label{display:block;margin:4px 0 2px}.q{width:50%;padding:8px 10px;border:2px solid;border-radius:8px}.q:first-child{border-color:#f43f5e;background:#fff1f2}.q:last-child{border-color:#a855f7;background:#faf5ff}.q p{margin-top:4px}.scaffold{border:2px solid #0d9488;border-radius:8px;background:linear-gradient(to right,#f0fdfa,#f8fafc);padding:8px 12px}.scaffold p{margin:4px 0}.note{font-size:.9em;color:#475569}footer{display:flex;justify-content:space-between;border-top:1.5px dashed #cbd5e1;padding-top:4px;color:#64748b;font-size:7.5pt}footer b{color:#0284c7}@media print{*{print-color-adjust:exact;-webkit-print-color-adjust:exact}}
  </style></head><body><main class="poster-canvas"><header><div><h1>${esc(m.title)}</h1><small>English in action · classroom poster</small></div><b class="badge">${esc(m.grade)}${m.cefr?' · '+esc(m.cefr):''}</b></header><section><div class="tag">Visual vocabulary · name it and use it</div><table><tr>${gallery}</tr></table></section><section><table><tr><td class="cat verbs"><h2>Action Verbs</h2>${chips(m.vocab.verbs)}</td><td class="cat modifiers"><h2>Describing Words</h2><b class="label">Adjectives</b>${chips(m.vocab.adjectives)}<b class="label">Adverbs</b>${chips(m.vocab.adverbs)}</td><td class="cat things"><h2>Places, Things & Numbers</h2>${rest.map(([key,items])=>`<b class="label">${esc(key.replaceAll('_',' '))}</b>${chips(items)}`).join('')}<b class="label">Numbers</b>${chips(m.vocab.numbers)}</td></tr></table></section><section><table><tr>${m.comparisons.map(q=>`<td class="q"><h2>${esc(q.title)}</h2><b>${esc(q.function)}</b>${q.examples.map(e=>`<p>${esc(e)}</p>`).join('')}${!q.examples.length?'<p>Use the scenario to ask your own question.</p>':''}</td>`).join('')}</tr></table><p class="note">${esc((m.vocab.interrogatives||[]).join(' · '))}</p></section><section class="scaffold"><h2>Pair talk · practice scaffold</h2><p class="note">Classroom practice examples. Complete the blanks.</p><table><tr><td><b>${esc(m.dialogue.a)}</b>${m.dialogue.left.map((line,i)=>`<p>${i+1}. ${esc(line)}</p>`).join('')}</td><td><b>${esc(m.dialogue.b)}</b>${m.dialogue.right.map((line,i)=>`<p>${i+1}. ${esc(line)}</p>`).join('')}</td></tr></table><p class="note">${esc(m.social||'Take turns and listen to your partner.')}</p></section><footer><b>EduGen PRO</b><span>Scenario #${m.index+1} of 8 · MEDUCA Curriculum</span></footer></main></body></html>`;
}

export async function fitClassroomPoster(doc) {
  await doc.fonts.ready;
  const canvas=doc.querySelector('.poster-canvas');
  for(let font=8.2;font>=6.9;font-=.1){
    doc.body.style.setProperty('--font',font+'pt');
    if(canvas.scrollHeight<=canvas.clientHeight+1 && [...doc.querySelectorAll('td')].every(td=>td.scrollWidth<=td.clientWidth+1))return true;
  }
  return false;
}
