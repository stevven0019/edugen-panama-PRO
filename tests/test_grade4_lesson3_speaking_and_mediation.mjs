import assert from 'node:assert/strict';
import { parseAoaLessonPlan, sanitizeThemeTitle, isValidVocabWord } from '../src/resources/lessonParser.js';
import { renderWorkbookHtml } from '../src/resources/renderWorkbookHtml.js';
import { buildWorkbook } from '../src/resources/workbookPdf.js';

console.log('--- 1. Testing Title Sanitizer ---');
assert.equal(sanitizeThemeTitle('Planner – Theme # How Much Is the Pineapple? – Lesson # 3'), 'How Much Is the Pineapple?');
assert.equal(sanitizeThemeTitle('Action Worksheet: "Planner – Theme # How Much Is the Pineapple? – Lesson # 3"'), 'How Much Is the Pineapple?');
assert.equal(sanitizeThemeTitle('Planner AOA - Theme # How Much Is the Pineapple? (L3)'), 'How Much Is the Pineapple?');
assert.equal(sanitizeThemeTitle('Theme # 1 - Lesson # 3: Shopping for Groceries'), 'Shopping for Groceries');
assert.equal(sanitizeThemeTitle('EduGen Pro AOA: Visiting the Panama Canal'), 'Visiting the Panama Canal');
console.log('✅ Title sanitization passed.');

console.log('--- 2. Testing Vocabulary Filter Against Teacher Procedural Text ---');
assert.equal(isValidVocabWord('The teacher models the target language for asking about price'), false);
assert.equal(isValidVocabWord('Describing quantity'), false);
assert.equal(isValidVocabWord('Warm-up / Pre-task'), false);
assert.equal(isValidVocabWord('Stage 2 Presentation'), false);
assert.equal(isValidVocabWord('pineapple'), true);
assert.equal(isValidVocabWord('banana'), true);
assert.equal(isValidVocabWord('shopping list'), true);
assert.equal(isValidVocabWord('price'), true);
assert.equal(isValidVocabWord('yuca'), true);
assert.equal(isValidVocabWord('orange'), true);
console.log('✅ Vocabulary filter passed.');

console.log('--- 3. Testing 4th Grade Scenario 3 Lesson 3 Speaking Plan (Exact User Case) ---');
const userLessonHtml = `
<div class="lesson-plan">
  <h1>Planner – Theme # How Much Is the Pineapple? – Lesson # 3</h1>
  <p>Grade: 4th Grade</p>
  <p>Scenario: Shopping at the Market</p>
  <p>Skills Focus: Speaking</p>
  <p>Specific Objective: Students will be able to ask and answer about fruit prices using numbers and simple WH-questions.</p>
  <p>Note for early finishers: Students can practice extra dialogue cards.</p>
  <table>
    <tr>
      <td>Stage 1 Warm-up</td>
      <td>Teacher introduces market fruits: <strong>pineapple</strong>, <strong>banana</strong>, <strong>orange</strong>, <strong>apple</strong>.</td>
    </tr>
    <tr>
      <td>Stage 2 Presentation</td>
      <td><strong>The teacher models the target language for asking about price</strong></td>
      <td><strong>Describing quantity</strong>: "The pineapple is two dollars and fifty cents."</td>
    </tr>
    <tr>
      <td>Stage 3 Guided Practice</td>
      <td>Role-play pairs ask: "How much is the pineapple?" and verify prices.</td>
    </tr>
  </table>
</div>
`;

const parsedSpeakingPack = parseAoaLessonPlan(userLessonHtml, {
  grade: '4th Grade',
  title: 'Planner – Theme # How Much Is the Pineapple? – Lesson # 3',
  scenario: 'Shopping at the Market',
  skill: 'Speaking',
  lessonNum: 3
});

assert.ok(parsedSpeakingPack, 'Speaking pack successfully parsed');
assert.equal(parsedSpeakingPack.title, 'How Much Is the Pineapple?', 'Title is cleanly sanitized');
assert.equal(parsedSpeakingPack.grade, '4th Grade', 'Grade is 4th Grade, NOT Kindergarten!');
assert.equal(parsedSpeakingPack.lessonNum, 3, 'Lesson number is 3');
assert.equal(parsedSpeakingPack.skill, 'Speaking', 'Skill is Speaking');

// Verify Part 1 cards
const part1Words = parsedSpeakingPack.actionWorksheet.part1.items.map(i => i.word);
console.log('Part 1 extracted words:', part1Words);
assert.ok(!part1Words.some(w => w.includes('TEACHER') || w.includes('DESCRIBING')), 'Zero teacher procedural words in vocabulary!');
assert.ok(part1Words.includes('PINEAPPLE'), 'Contains PINEAPPLE');
assert.ok(part1Words.includes('BANANA'), 'Contains BANANA');
assert.equal(parsedSpeakingPack.actionWorksheet.part1.badge, 'Spoken Fluency');
assert.equal(parsedSpeakingPack.actionWorksheet.part1.actionCue, '[ Say It Aloud 🗣️ ]');

// Verify Part 2 inquiry items
assert.equal(parsedSpeakingPack.actionWorksheet.part2.badge, 'Interaction Check');
assert.equal(parsedSpeakingPack.actionWorksheet.part2.title, 'PART 2: COMMUNICATIVE INQUIRY · "ASK & ANSWER IN PAIRS!"');
const part2Sentences = parsedSpeakingPack.actionWorksheet.part2.items.map(i => i.sentence);
console.log('Part 2 sentences:', part2Sentences);
assert.ok(!part2Sentences.some(s => s.includes('The the teacher models')), 'Zero junk sentences in Part 2!');
assert.ok(part2Sentences[0].includes('Partner A: "How much is the pineapple?"'), 'Sentence 1 is a natural pair speaking inquiry');

// Verify HTML rendering
const speakingHtml = renderWorkbookHtml(parsedSpeakingPack);
assert.ok(speakingHtml.includes('Action Worksheet: "How Much Is the Pineapple?"'), 'Clean title in Action Worksheet header');
assert.ok(speakingHtml.includes('4th Grade (Primaria Media (A1)) · Skills: Speaking · A1 · Action-Oriented Practice'), 'Exact MEDUCA grade, CEFR, and Speaking skill');
assert.ok(!speakingHtml.includes('Kindergarten (Educación Inicial'), 'Does NOT contain Kindergarten badge!');
assert.ok(speakingHtml.includes('Lesson # 3 · 45-60 min'), 'Lesson number 3 rendered correctly');
assert.ok(speakingHtml.includes('Scenario: "Shopping at the Market"'), 'Scenario name rendered');
assert.ok(speakingHtml.includes('[ Say It Aloud 🗣️ ]'), 'Action cue is Say It Aloud for speaking');
console.log('✅ 4th Grade Lesson 3 Speaking verification passed!');

console.log('--- 4. Testing Lesson 5 Mediation with 21st Century Skills Project ---');
// Theme 1 develops Project 1
const mediationPackTheme1 = parseAoaLessonPlan(userLessonHtml, {
  grade: '4th Grade',
  title: 'How Much Is the Pineapple?',
  scenario: 'Shopping at the Market',
  skill: 'Mediation',
  lessonNum: 5,
  themeType: 'receptive',
  project21st: 'Project 1: Market Shopping Role-Play — Students role-play market transactions, asking "How much is...?" and using numbers up to 100.'
});

assert.equal(mediationPackTheme1.lessonNum, 5);
assert.equal(mediationPackTheme1.skill, 'Mediation');
assert.equal(mediationPackTheme1.actionWorksheet.part1.badge, '21st Century Skills Project');
assert.equal(mediationPackTheme1.actionWorksheet.part1.actionCue, '[ Team Collaboration 🤝 ]');
assert.equal(mediationPackTheme1.actionWorksheet.part2.badge, 'Collaborative Accuracy');
assert.ok(mediationPackTheme1.page2.activity4.title.includes('21st Century Skills Project'));
assert.ok(mediationPackTheme1.page2.activity4.instruction.includes('Project 1: Market Shopping Role-Play'));

const mediationHtml = renderWorkbookHtml(mediationPackTheme1);
assert.ok(mediationHtml.includes('Mediation · 21st Century Project') || mediationHtml.includes('Mediation · 21st Century Skills Project'), 'Mediation 21st Century Project in HTML');
assert.ok(mediationHtml.includes('Lesson # 5 · 45-60 min'), 'Lesson # 5 in header');

console.log('--- 5. Testing PDF Building for Speaking and Mediation ---');
const speakingPdf = buildWorkbook(parsedSpeakingPack);
assert.ok(speakingPdf.getNumberOfPages() >= 3, 'Speaking PDF built with at least 3 pages');

const mediationPdf = buildWorkbook(mediationPackTheme1);
assert.ok(mediationPdf.getNumberOfPages() >= 3, 'Mediation PDF built with at least 3 pages');
console.log('✅ Speaking and Mediation PDF generation verified!');

console.log('🎉 ALL TESTS PASSED SUCCESSFULLY!');
