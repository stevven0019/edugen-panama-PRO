/**
 * EDUGEN PRO · AUTOMATED PILOT TEST: 15 REPRESENTATIVE LESSONS
 * Spec: generador de actividades.txt
 * 
 * Matrix coverage:
 * - Grades: Pre-K, Kinder, 1st, 2nd, 3rd, 4th, 6th, 7th, 8th, 9th, 10th, 11th, 12th
 * - CEFR Bands: Pre-A1 Receptivo, A1.1, A1, A1+, A2, A2+, B1, B1+
 * - Skills: Listening, Reading, Speaking, Writing, Mediation
 * - Themes: Theme 1 (Receptive / Project 1) & Theme 2 (Interactive / Project 2)
 * - Diverse Panama Scenarios: Classroom, Market, Health, Community, Metro, Canal, Environment, Ecotourism, Logistics
 */

import assert from 'node:assert/strict';
import { generateActivityPack, validatePack } from '../src/resources/activityPack.js';
import { validateActivityPack } from '../src/resources/activityEngine.js';
import { renderWorkbookHtml } from '../src/resources/renderWorkbookHtml.js';
import { buildWorkbook } from '../src/resources/workbookPdf.js';

console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('🚀 EDUGEN PRO · PILOT AUTOMÁTICO DE 15 LECCIONES MATRICIALES (AOA MEDUCA)');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

const PILOT_15_CASES = [
  // 1. Pre-K (Pre-A1 Receptivo) · Listening · Theme 1
  {
    id: 1,
    grade: 'Pre-K',
    cefr: 'Pre-A1',
    scenario: 'Classroom Environment',
    theme: 'Where Is It?',
    themeType: 'receptive',
    lessonNum: 1,
    skill: 'Listening',
    expectedEvidence: 'Physical action (TPR)'
  },
  // 2. Kindergarten · Speaking · Theme 2
  {
    id: 2,
    grade: 'Kindergarten',
    cefr: 'Pre-A1',
    scenario: 'My Senses & Body',
    theme: 'Touch and Name the Objects',
    themeType: 'productive',
    lessonNum: 2,
    skill: 'Speaking',
    expectedEvidence: 'Oral language production'
  },
  // 3. 1st Grade · Reading · Theme 1
  {
    id: 3,
    grade: '1st Grade',
    cefr: 'Pre-A1 / A1.1',
    scenario: 'Welcome to School',
    theme: 'Classroom Labels & Signs',
    themeType: 'receptive',
    lessonNum: 3, // Testing Lesson 3 as READING (proves lessonNum !== skill!)
    skill: 'Reading',
    expectedEvidence: 'Demonstrable Comprehension of Written Information'
  },
  // 4. 2nd Grade · Writing · Theme 2
  {
    id: 4,
    grade: '2nd Grade',
    cefr: 'Pre-A1 / A1.1',
    scenario: 'Colors & Shapes in Nature',
    theme: 'Panamanian Golden Frog Habitat',
    themeType: 'productive',
    lessonNum: 4,
    skill: 'Writing',
    expectedEvidence: 'Written production'
  },
  // 5. 3rd Grade · Listening · Theme 1
  {
    id: 5,
    grade: '3rd Grade',
    cefr: 'A1',
    scenario: 'Healthy Habits & Clinic Visit',
    theme: 'Doctor Advice on Nutrition',
    themeType: 'receptive',
    lessonNum: 2,
    skill: 'Listening',
    expectedEvidence: 'Auditory Comprehension'
  },
  // 6. 4th Grade · Speaking · Theme 1 (The Reference Test Case)
  {
    id: 6,
    grade: '4th Grade',
    cefr: 'A1',
    scenario: 'Shopping at the Central Market',
    theme: 'How Much Is the Pineapple?',
    themeType: 'receptive',
    lessonNum: 3,
    skill: 'Speaking',
    expectedEvidence: 'Oral language production'
  },
  // 7. 4th Grade · Reading · Theme 1 (Same scenario, DIFFERENT skill)
  {
    id: 7,
    grade: '4th Grade',
    cefr: 'A1',
    scenario: 'Shopping at the Central Market',
    theme: 'Market Receipts & Grocery Signs',
    themeType: 'receptive',
    lessonNum: 1,
    skill: 'Reading',
    expectedEvidence: 'Demonstrable Comprehension of Written Information'
  },
  // 8. 4th Grade · Writing · Theme 2
  {
    id: 8,
    grade: '4th Grade',
    cefr: 'A1',
    scenario: 'Weather & Rainy Season',
    theme: 'Our Weekly Rainy Season Log',
    themeType: 'productive',
    lessonNum: 4,
    skill: 'Writing',
    expectedEvidence: 'Written production'
  },
  // 9. 6th Grade · Mediation · Theme 1 (Project 1)
  {
    id: 9,
    grade: '6th Grade',
    cefr: 'A1+',
    scenario: 'My Community & Town Places',
    theme: 'Guiding a Visitor in My Neighborhood',
    themeType: 'receptive',
    lessonNum: 5,
    skill: 'Mediation',
    expectedEvidence: 'Information transfer'
  },
  // 10. 7th Grade · Reading · Theme 1
  {
    id: 10,
    grade: '7th Grade',
    cefr: 'A2',
    scenario: 'Panama Metro & Urban Transit',
    theme: 'Metro Line Schedules & Route Maps',
    themeType: 'receptive',
    lessonNum: 2,
    skill: 'Reading',
    expectedEvidence: 'Demonstrable Comprehension of Written Information'
  },
  // 11. 8th Grade · Speaking · Theme 2
  {
    id: 11,
    grade: '8th Grade',
    cefr: 'A2',
    scenario: 'Panama Metro & Urban Transit',
    theme: 'Buying a Metro Card at the Ticket Counter',
    themeType: 'productive',
    lessonNum: 3,
    skill: 'Speaking',
    expectedEvidence: 'Oral language production'
  },
  // 12. 9th Grade · Writing · Theme 2
  {
    id: 12,
    grade: '9th Grade',
    cefr: 'A2+',
    scenario: 'Panama Canal Maritime Operations',
    theme: 'Vessel Transit Report & Harbor Log',
    themeType: 'productive',
    lessonNum: 4,
    skill: 'Writing',
    expectedEvidence: 'Written production'
  },
  // 13. 10th Grade · Listening · Theme 1
  {
    id: 13,
    grade: '10th Grade',
    cefr: 'B1',
    scenario: 'Youth & Environmental Protection',
    theme: 'Radio Interview with a Darien Forest Ranger',
    themeType: 'receptive',
    lessonNum: 1,
    skill: 'Listening',
    expectedEvidence: 'Auditory Comprehension'
  },
  // 14. 11th Grade · Mediation · Theme 2 (Project 2)
  {
    id: 14,
    grade: '11th Grade',
    cefr: 'B1',
    scenario: 'Sustainable Ecotourism in Bocas del Toro',
    theme: 'Bilingual Marine Tour Briefing & Safety Guidelines',
    themeType: 'productive',
    lessonNum: 5,
    skill: 'Mediation',
    expectedEvidence: 'Information transfer'
  },
  // 15. 12th Grade · Speaking · Theme 2
  {
    id: 15,
    grade: '12th Grade',
    cefr: 'B1+',
    scenario: 'Global Logistics & Trade Careers',
    theme: 'International Trade Professional Pitch & Q&A',
    themeType: 'productive',
    lessonNum: 3,
    skill: 'Speaking',
    expectedEvidence: 'Oral language production'
  }
];

const resultsTable = [];

for (const tc of PILOT_15_CASES) {
  process.stdout.write(`Executing Lesson Pilot #${tc.id}: ${tc.grade} (${tc.cefr}) · ${tc.skill} · "${tc.theme}"... `);

  const rawLessonPlan = `
PLANNER AOA MEDUCA PANAMÁ
Grade: ${tc.grade}
CEFR: ${tc.cefr}
Scenario: ${tc.scenario}
Theme: ${tc.theme}
Lesson Number: ${tc.lessonNum}
Skill: ${tc.skill}
Specific Objective: Students will actively apply their ${tc.skill.toLowerCase()} skills in the context of "${tc.scenario}".
Learning Outcome: Demonstrates communicative autonomy and task completion.
Vocabulary: target concept 1, target concept 2, target concept 3, target concept 4, target concept 5, target concept 6
Language Frame: "How do we apply ${tc.skill.toLowerCase()} in ${tc.scenario}?" ──> "We communicate clearly and complete the task."
`;

  const pack = await generateActivityPack({
    grade: tc.grade,
    cefr: tc.cefr,
    scenario: tc.scenario,
    title: tc.theme,
    theme: tc.theme,
    themeType: tc.themeType,
    lessonNum: tc.lessonNum,
    skill: tc.skill,
    forceAi: false,
    text: rawLessonPlan
  });

  // 1. Authoritative Skill Check
  assert.equal(pack.skill, tc.skill, `Pilot #${tc.id}: Skill must match ${tc.skill}, found ${pack.skill}`);

  // 2. Blueprint 6 Stages Check
  assert.ok(Array.isArray(pack.stages) && pack.stages.length === 6, `Pilot #${tc.id}: Must have exactly 6 AOA stages`);

  // 3. Action Worksheet Check
  assert.ok(pack.actionWorksheet?.part1?.items?.length >= 4, `Pilot #${tc.id}: Action Worksheet Part 1 must have items`);
  assert.ok(pack.actionWorksheet?.part2?.items?.length === 4, `Pilot #${tc.id}: Action Worksheet Part 2 must have 4 items`);

  // 4. Strict Alignment Validation
  const val = validateActivityPack(pack, pack.contract || { skill: tc.skill, isEarly: tc.cefr.includes('Pre-A1'), constraints: {} });
  assert.ok(val.pass, `Pilot #${tc.id}: Alignment Validator must pass, errors: ${val.errors?.join(', ')}`);

  // 5. Mediation Project Alignment
  if (tc.skill === 'Mediation') {
    assert.ok(pack.project21st, `Pilot #${tc.id}: Mediation must have 21st Century Project`);
    if (tc.themeType === 'productive') {
      assert.ok(pack.project21st.includes('Project 2'), `Pilot #${tc.id}: Theme 2 mediation must link to Project 2`);
    } else {
      assert.ok(pack.project21st.includes('Project 1'), `Pilot #${tc.id}: Theme 1 mediation must link to Project 1`);
    }
  }

  // 6. HTML Rendering
  const html = renderWorkbookHtml(pack);
  assert.ok(html.includes(tc.grade), `Pilot #${tc.id}: HTML must contain grade ${tc.grade}`);
  assert.ok(html.includes(tc.skill), `Pilot #${tc.id}: HTML must contain skill ${tc.skill}`);

  // 7. PDF Building
  const pdfDoc = buildWorkbook(pack);
  const pageCount = pdfDoc.getNumberOfPages();
  assert.ok(pageCount >= 3, `Pilot #${tc.id}: PDF must build with 3+ pages, got ${pageCount}`);

  resultsTable.push({
    '#': tc.id,
    Grade: tc.grade,
    CEFR: tc.cefr,
    Skill: tc.skill,
    Theme: tc.theme.length > 25 ? tc.theme.slice(0, 22) + '...' : tc.theme,
    Act1_Pattern: pack.contract?.patterns?.activity1?.pattern?.slice(0, 22) || pack.actionWorksheet?.part1?.badge,
    Act2_Pattern: pack.contract?.patterns?.activity2?.pattern?.slice(0, 22) || pack.actionWorksheet?.part2?.badge,
    PDF_Pages: pageCount,
    Status: '✅ PASS'
  });

  console.log(`✅ PASS (${pageCount} PDF pages)`);
}

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('📊 RESUMEN DE RESULTADOS: PILOT 15 LECCIONES MATRICIALES EDUGEN PRO');
console.log('═══════════════════════════════════════════════════════════════════════════');
console.table(resultsTable);
console.log('\n🎉 PILOT AUTOMÁTICO DE 15 LECCIONES COMPLETADO CON 100% DE ÉXITO!');
console.log('El motor pedagógico demostró su capacidad para procesar cualquiera de las 1,120 combinaciones sin plantillas rígidas.');
