import fs from 'fs';
import path from 'path';
import { parseAoaLessonPlan } from '../src/resources/lessonParser.js';
import { generateActivityPack } from '../src/resources/activityPack.js';
import { renderWorkbookHtml } from '../src/resources/renderWorkbookHtml.js';
import { getRealiaPhoto } from '../src/resources/realiaCatalog.js';

const posterNouns = [
  'panama canal',
  'operation',
  'traffic',
  'congestion',
  'routes',
  'shipping',
  'trade',
  'infrastructure',
  'efficiency',
  'costs',
  'delays'
];

console.log('=== 1. AUDITORÍA DE IMÁGENES DE LOS 11 SUSTANTIVOS DEL PÓSTER ===');
for (const noun of posterNouns) {
  const photo = getRealiaPhoto(noun);
  let localExists = false;
  if (photo && !photo.startsWith('http')) {
    const rel = photo.replace(/^\//, '');
    localExists = fs.existsSync(path.resolve('public', rel));
  }
  console.log(`- "${noun}": photoUrl = ${photo} | Local file exists: ${localExists ? 'YES' : (photo?.startsWith('http') ? 'UNSPLASH' : 'NO/NULL')}`);
}

const lessonPlanText = `
Lesson Planner – Theme # 1 – Lesson # 1
Lesson #: 1
Skills Focus: Listening
Grade: 11th Grade (CEFR: B1.2)
Scenario: Panama's Role in the World
Theme: The Importance of Panama in Global Trade
Specific Objective: Listening: Receptive: Evaluate spoken information from radio or television. Interactive: Engage in role-play scenarios to resolve everyday conflicts.
Learning Outcome: Listening: Can comprehend and evaluate information from a news broadcast on a local issue (e.g., "After evaluating the news broadcast, it's clear that the proposed improvements to the Panama Canal's infrastructure are designed to ease congestion and enhance global trade efficiency.") Can role-play resolving a disagreement over environmental concerns vs. economic growth.

STAGE 1 — Warm-up / Pre-task
The teacher begins by showing images and short video clips of the Panama Canal's daily operations (e.g., large ships navigating the locks, busy ports). Words like 'congestion,' 'efficiency,' 'investments,' 'environmental,' 'global,' 'impactful,' 'operate,' 'manage,' 'shipping,' 'trade' are written on the board. The teacher models their pronunciation, paying close attention to the long vowel sound /oʊ/ in 'global,' 'local,' and the alternation of full and reduced vowels in 'environmental' /ɪnˌvaɪ.rənˈmen.təl/ and 'impactful' /ɪmˈpækt.fəl/.

STAGE 2 — Presentation
An authentic short news broadcast segment (audio only, approx. 2-3 minutes) from a local Panamanian radio station discussing recent developments or challenges related to the Panama Canal's operation, global trade, and environmental concerns. Mentions of 'investments,' 'infrastructure,' 'traffic,' 'delays,' 'environmental groups,' and 'efficiency,' as well as examples of passive voice and conditionals.

STAGE 3 — Preparation / Practice
Focusing on listening for specific grammar structures (Passive voice, Second and third conditionals, Present Perfect Continuous) and target vocabulary in context to understand nuanced meanings and arguments.

STAGE 4 — Performance / Production
Role-play simulation. Students engage in a role-play scenario to resolve a disagreement. Groups of three: Community Leader, ACP Representative, and Environmental Group Activist about a proposed expansion project for the Canal that would involve 'significant investments' but also impact local 'ecosystems' and increase 'traffic'.

STAGE 5 — Assessment / Post-task
Teacher observation checklist focusing on listening comprehension during interaction and use of target language. Exit ticket prompts.

STAGE 6 — Reflection
Student self-reflection and teacher reflection.
`;

console.log('\n=== 2. PARSEANDO LESSON PLAN CON EL PARSER Y GENERANDO PACK ===');
const pack = parseAoaLessonPlan(lessonPlanText, {
  grade: '11th Grade',
  skill: 'Listening',
  scenario: "Panama's Role in the World",
  title: 'The Importance of Panama in Global Trade',
  lessonNum: 1
});

console.log('Title:', pack.title);
console.log('Grade:', pack.grade);
console.log('Skill:', pack.skill);
console.log('Extracted vocabWords:', pack.page1?.wordBank?.map(w => w.word));
console.log('ActionWorksheet Part 1 items:', pack.actionWorksheet?.part1?.items?.map(it => `${it.word} (${it.photoUrl ? 'HAS PHOTO' : 'NO PHOTO'})`));

console.log('\n--- AUDITORÍA DE ETAPAS (LUDIC KIT) ---');
const lk = pack.ludicKit;
if (lk) {
  console.log('Stage 1:', lk.stage1Game?.name, '| Prompt:', lk.stage1Game?.prompt);
  console.log('Stage 2 Items:');
  for (const it of (lk.stage2ListenPoint?.items || [])) {
    console.log(`  [${it.targetWord}] Script: "${it.script}" | Resp: "${it.response}" | Photo: ${it.photoUrl ? 'YES' : 'NO/NULL'}`);
  }
  console.log('Stage 3 Product Cards:');
  for (const pc of (lk.stage3CardGame?.productCards || [])) {
    console.log(`  [${pc.name} - ${pc.word}] Tag/Price: "${pc.price || pc.tag}" | Photo: ${pc.photoUrl ? 'YES' : 'NO/NULL'}`);
  }
  console.log('Stage 3 Number Cards:', lk.stage3CardGame?.numberCards?.map(n => n.label));
  console.log('Stage 4 Mission Title:', lk.stage4Mission?.title);
  console.log('  Role A:', lk.stage4Mission?.roleA?.role, '| Name:', lk.stage4Mission?.roleA?.name);
  console.log('  Role B:', lk.stage4Mission?.roleB?.role, '| Name:', lk.stage4Mission?.roleB?.name);
  console.log('  Dialogue Bubbles:');
  for (const d of (lk.stage4Mission?.dialogueBubbles || [])) {
    console.log(`    ${d.speaker}: "${d.text}"`);
  }
  console.log('Stage 5 Can-Do Statements:', lk.stage5CanDo?.statements?.map(s => s.text));
}

console.log('\n=== 3. AUDITORÍA DEL HTML RENDERIZADO (renderWorkbookHtml) ===');
const html = renderWorkbookHtml(pack);
const missingInHtml = posterNouns.filter(n => !html.toLowerCase().includes(n));
console.log('Poster nouns not found in HTML:', missingInHtml);
console.log('Has null in img src?:', html.includes('src="null"') || html.includes("src='null'"));
console.log('Total img tags in HTML:', (html.match(/<img[\s>]/gi) || []).length);
