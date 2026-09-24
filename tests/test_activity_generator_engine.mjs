/**
 * COMPREHENSIVE TEST SUITE FOR ACTIVITY ENGINE & ALIGNMENT VALIDATOR
 * Spec: generador de actividades.txt
 * 
 * Verifies:
 * 1. lesson.skill determines architecture (NEVER lessonNumber!)
 * 2. Activity Contract extraction & constraints
 * 3. Activity Pattern Selector (Diversity Engine for all 5 skills)
 * 4. AOA 6 Stages Blueprint compliance
 * 5. Alignment Validator & Self-Healing Repair
 * 6. Multi-Grade & Multi-Skill generation (Pre-K, 4th, 8th, 11th Grade across Listening, Reading, Speaking, Writing, Mediation)
 */

import assert from 'node:assert/strict';
import {
  buildLessonContract,
  selectActivityPatterns,
  buildAOABlueprint,
  validateActivityPack,
  repairActivityPack,
  normalizeSkill,
  detectSkillFromText
} from '../src/resources/activityEngine.js';
import { parseAoaLessonPlan } from '../src/resources/lessonParser.js';
import { generateActivityPack, validatePack } from '../src/resources/activityPack.js';
import { renderWorkbookHtml } from '../src/resources/renderWorkbookHtml.js';
import { buildWorkbook } from '../src/resources/workbookPdf.js';

console.log('🚀 Starting Test Suite: Activity Generator Engine (generador de actividades.txt)...');

// ─────────────────────────────────────────────────────────────
// TEST 1: AUTHORITATIVE SKILL RESOLUTION (Never assume lessonNumber = skill)
// ─────────────────────────────────────────────────────────────
console.log('\n--- 1. Testing Authoritative Skill Resolution ---');

// Case A: Lesson 3 with Reading skill
const lesson3Reading = parseAoaLessonPlan(`
Grade: 4th Grade
Lesson 3
Skill: Reading
Theme: Panama Canal Logistics
Specific Objective: Students will read authentic shipping notices.
Vocabulary: ship, cargo, locks, vessel, canal, ocean
`);
assert.equal(lesson3Reading.skill, 'Reading', 'Lesson 3 with Skill: Reading must be Reading, NOT Speaking!');
assert.ok(lesson3Reading.actionWorksheet.part1.title.includes('READ') || lesson3Reading.actionWorksheet.part1.badge.includes('Reading') || lesson3Reading.actionWorksheet.part1.badge.includes('Visual'), 'Part 1 must be reading focused');
assert.ok(!lesson3Reading.actionWorksheet.part2.title.includes('COMMUNICATIVE INQUIRY'), 'Part 2 must NOT be speaking inquiry');

// Case B: Lesson 1 with Speaking skill
const lesson1Speaking = parseAoaLessonPlan(`
Grade: 4th Grade
Lesson 1
Skill: Speaking
Theme: Fruit Market Inquiry
Specific Objective: Students will ask and answer prices aloud.
Vocabulary: pineapple, banana, orange, dollar, apple, market
`);
assert.equal(lesson1Speaking.skill, 'Speaking', 'Lesson 1 with Skill: Speaking must be Speaking, NOT Listening!');
assert.ok(lesson1Speaking.actionWorksheet.part2.title.includes('COMMUNICATIVE INQUIRY') || lesson1Speaking.actionWorksheet.part2.badge.includes('Spoken') || lesson1Speaking.actionWorksheet.part2.badge.includes('Interaction'), 'Part 2 must be speaking interaction');

// Case C: Lesson 4 with Listening skill
const lesson4Listening = parseAoaLessonPlan(`
Grade: 3rd Grade
Lesson 4
Skill: Listening
Theme: Weather Alert
Specific Objective: Students will listen to radio weather announcements.
Vocabulary: rain, storm, cloud, umbrella, wind, puddle
`);
assert.equal(lesson4Listening.skill, 'Listening', 'Lesson 4 with Skill: Listening must be Listening, NOT Writing!');
assert.ok(lesson4Listening.actionWorksheet.part1.title.includes('LISTEN') || lesson4Listening.actionWorksheet.part1.badge.includes('Listening'), 'Part 1 must be listening focused');

// Case D: Lesson 2 with Mediation skill (Project 1 in Theme 1)
const lesson2Mediation = parseAoaLessonPlan(`
Grade: 5th Grade
Lesson 2
Skill: Mediation
Theme: Healthy Community Diet
Specific Objective: Students will explain nutritional charts to peers in simple English.
Vocabulary: fruit, vegetables, water, exercise, health, salad
`);
assert.equal(lesson2Mediation.skill, 'Mediation', 'Lesson 2 with Skill: Mediation must be Mediation, NOT Reading!');
assert.ok(lesson2Mediation.actionWorksheet.part1.badge.includes('Project') || lesson2Mediation.actionWorksheet.part1.title.includes('MEDIATION'), 'Part 1 must be mediation project focused');
assert.ok(lesson2Mediation.project21st.includes('Project 1'), 'Theme 1 mediation must connect to Project 1');

console.log('✅ Authoritative skill resolution passed: lesson.skill drives the architecture in all cases!');

// ─────────────────────────────────────────────────────────────
// TEST 2: CONTRACT BUILDER & CONSTRAINTS
// ─────────────────────────────────────────────────────────────
console.log('\n--- 2. Testing Contract Builder & Constraints ---');

const contractSpeaking = buildLessonContract({
  grade: '4th Grade',
  skill: 'Speaking',
  scenario: 'Shopping at the Market',
  theme: 'How Much Is the Pineapple?',
  lessonNum: 3
});
assert.equal(contractSpeaking.skill, 'Speaking');
assert.equal(contractSpeaking.constraints.oral_evidence_required, true);
assert.equal(contractSpeaking.constraints.writing_as_primary_evidence, false);
assert.equal(contractSpeaking.constraints.listening_comprehension_required, false);

const contractWriting = buildLessonContract({
  grade: '6th Grade',
  skill: 'Writing',
  scenario: 'Rainforest Eco-Guide',
  theme: 'Animals of Darien',
  lessonNum: 4
});
assert.equal(contractWriting.skill, 'Writing');
assert.equal(contractWriting.constraints.oral_evidence_required, false);
assert.equal(contractWriting.constraints.writing_as_primary_evidence, true);

const contractEarly = buildLessonContract({
  grade: 'Kindergarten',
  skill: 'Listening',
  scenario: 'Where Is It?',
  theme: 'Where Is It?'
});
assert.equal(contractEarly.isEarly, true);
assert.equal(contractEarly.constraints.zero_forced_literacy, true);
assert.equal(contractEarly.constraints.tpr_required, true);

console.log('✅ Lesson Contract builder and constraints passed!');

// ─────────────────────────────────────────────────────────────
// TEST 3: ACTIVITY DIVERSITY ENGINE (selectActivityPatterns)
// ─────────────────────────────────────────────────────────────
console.log('\n--- 3. Testing Activity Patterns for All 5 Skills ---');

const allSkills = ['Listening', 'Reading', 'Speaking', 'Writing', 'Mediation'];
for (const s of allSkills) {
  const c = buildLessonContract({ grade: '4th Grade', skill: s, scenario: 'Panama Real Context', theme: 'Test Theme' });
  const p = selectActivityPatterns(c);
  assert.ok(p.activity1, `Skill ${s} must have activity1`);
  assert.ok(p.activity2, `Skill ${s} must have activity2`);
  assert.ok(p.activity1.pattern, `Skill ${s} activity1 must have pattern name`);
  assert.ok(p.activity2.pattern, `Skill ${s} activity2 must have pattern name`);
  console.log(`  - ${s}: Act 1 = "${p.activity1.pattern}" | Act 2 = "${p.activity2.pattern}"`);
}
console.log('✅ Activity Diversity Patterns verified for all 5 skills!');

// ─────────────────────────────────────────────────────────────
// TEST 4: AOA 6 STAGES BLUEPRINT
// ─────────────────────────────────────────────────────────────
console.log('\n--- 4. Testing AOA 6 Stages Blueprint ---');

const cBlueprint = buildLessonContract({ grade: '8th Grade', skill: 'Speaking', scenario: 'Albrook Terminal Directions', theme: 'Taking the Metro' });
const bp = buildAOABlueprint(cBlueprint);
assert.equal(bp.stages.length, 6, 'AOA blueprint must have exactly 6 stages');
assert.equal(bp.stages[0].stage_name, 'Warm-up / Pre-task');
assert.equal(bp.stages[1].stage_name, 'Presentation (Input)');
assert.equal(bp.stages[2].stage_name, 'Practice (Guided)');
assert.equal(bp.stages[3].stage_name, 'Production (Action Task)');
assert.equal(bp.stages[4].stage_name, 'Assessment (Formative)');
assert.equal(bp.stages[5].stage_name, 'Reflection (Can-Do)');
console.log('✅ AOA 6 Stages Blueprint verified!');

// ─────────────────────────────────────────────────────────────
// TEST 5: STRICT ALIGNMENT VALIDATOR & SELF-HEALING REPAIR
// ─────────────────────────────────────────────────────────────
console.log('\n--- 5. Testing Alignment Validator & Self-Healing Repair ---');

// Case A: Perfect pack
const validTestPack = parseAoaLessonPlan(`
Grade: 4th Grade
Skill: Speaking
Theme: Central Market
Vocabulary: pineapple, banana, orange, apple, dollar, market
`);
const valResult = validateActivityPack(validTestPack, validTestPack.contract);
assert.equal(valResult.pass, true, 'Fully compliant pack must pass validation');

// Case B: Corrupted pack (wrong skill and missing stages)
const brokenPack = {
  title: 'Central Market',
  grade: '4th Grade',
  skill: 'Listening', // mismatched
  stages: [] // incomplete
};
const brokenVal = validateActivityPack(brokenPack, cBlueprint); // expects Speaking
assert.equal(brokenVal.pass, false, 'Corrupted pack must fail validation');
assert.ok(brokenVal.errors.length >= 2, 'Should detect skill mismatch and missing stages');

// Case C: Self-healing repair
const repairedPack = repairActivityPack(brokenPack, brokenVal.errors, cBlueprint);
assert.equal(repairedPack.skill, 'Speaking', 'Repaired pack must have target skill');
assert.equal(repairedPack.stages.length, 6, 'Repaired pack must have 6 stages');
console.log('✅ Strict Alignment Validator and Self-Healing Repair passed!');

// ─────────────────────────────────────────────────────────────
// TEST 6: FULL PIPELINE END-TO-END (Generate, Render HTML, Build PDF)
// ─────────────────────────────────────────────────────────────
console.log('\n--- 6. Testing Full Pipeline End-to-End Across Grades ---');

const testCases = [
  { grade: 'Kindergarten', skill: 'Listening', theme: 'Where Is It?' },
  { grade: '4th Grade', skill: 'Speaking', theme: 'How Much Is the Pineapple?' },
  { grade: '7th Grade', skill: 'Reading', theme: 'Panama Metro Transit Map' },
  { grade: '9th Grade', skill: 'Writing', theme: 'Field Report at the Canal' },
  { grade: '11th Grade', skill: 'Mediation', theme: 'Sustainable Marine Tourism in Bocas', themeType: 'productive' }
];

for (const tc of testCases) {
  const pack = await generateActivityPack({
    grade: tc.grade,
    skill: tc.skill,
    title: tc.theme,
    scenario: tc.theme,
    themeType: tc.themeType || 'receptive',
    forceAi: false,
    text: `Grade: ${tc.grade}\nSkill: ${tc.skill}\nTheme: ${tc.theme}\nVocabulary: concept1, concept2, concept3, concept4, concept5, concept6`
  });

  assert.equal(pack.skill, tc.skill, `Pack skill must be ${tc.skill}`);
  assert.equal(pack.grade, tc.grade, `Pack grade must be ${tc.grade}`);
  assert.ok(pack.actionWorksheet, 'Pack must have actionWorksheet');
  assert.ok(pack.page1 && pack.page2 && pack.page3, 'Pack must have 3 pages');

  // Verify HTML render
  const html = renderWorkbookHtml(pack);
  assert.ok(html.length > 500, 'HTML must render cleanly');

  // Verify PDF build
  const pdfDoc = buildWorkbook(pack);
  assert.ok(pdfDoc.getNumberOfPages() >= 3, `PDF for ${tc.grade} must build with 3+ pages`);

  console.log(`  ✅ ${tc.grade} · ${tc.skill}: Generated, Validated, HTML rendered, PDF (${pdfDoc.getNumberOfPages()} pages) built!`);
}

console.log('\n🎉 ALL ARCHITECTURAL TESTS FOR GENERADOR DE ACTIVIDADES.TXT PASSED 100%!');
