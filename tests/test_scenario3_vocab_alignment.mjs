import assert from 'node:assert/strict';
import { parseAoaLessonPlan, getScenarioOfficialNouns, isValidVocabWord, sanitizeThemeTitle } from '../src/resources/lessonParser.js';
import { generateActivityPack } from '../src/resources/activityPack.js';
import fs from 'node:fs';

console.log('--- 1. Testing Official Scenario Nouns Extraction from Curriculum JSON ---');
const grade4Curriculum = JSON.parse(fs.readFileSync('public/curriculums/English_Curriculum_Grade_4.json', 'utf8'));
const scenario3 = grade4Curriculum.scenarios.find(s => s.scenarioNum === 3);
assert.ok(scenario3, 'Grade 4 Scenario 3 exists');

const officialNouns = getScenarioOfficialNouns(scenario3);
console.log('Official Scenario 3 nouns:', officialNouns);
assert.ok(officialNouns.includes('pineapple'), 'Includes pineapple');
assert.ok(officialNouns.includes('cassava'), 'Includes cassava');
assert.ok(officialNouns.includes('potatoes'), 'Includes potatoes');
assert.ok(officialNouns.includes('market'), 'Includes market');
assert.ok(officialNouns.includes('price'), 'Includes price');
assert.ok(officialNouns.includes('money'), 'Includes money');
assert.ok(!officialNouns.includes('number'), '"number" is NOT an official noun!');
assert.ok(!officialNouns.includes('numbers'), '"numbers" is NOT an official noun!');

console.log('--- 2. Testing Blocked Meta and Structural Vocabulary ---');
assert.equal(isValidVocabWord('number'), false, 'number is rejected');
assert.equal(isValidVocabWord('numbers'), false, 'numbers is rejected');
assert.equal(isValidVocabWord('numeral'), false, 'numeral is rejected');
assert.equal(isValidVocabWord('digit'), false, 'digit is rejected');
assert.equal(isValidVocabWord('alphabet'), false, 'alphabet is rejected');
assert.equal(isValidVocabWord('grammar'), false, 'grammar is rejected');
assert.equal(isValidVocabWord('pineapple'), true, 'pineapple is valid');
assert.equal(isValidVocabWord('cassava'), true, 'cassava is valid');
assert.equal(isValidVocabWord('potatoes'), true, 'potatoes is valid');

console.log('--- 3. Testing 4th Grade Scenario 3 Theme 1 Lesson 3 Speaking Pack Generation ---');
// Simulating the user scenario with text that mentions numbers and fruits
const lessonText = `
<div class="lesson-plan">
  <h1>Planner – Theme # How Much Is the Pineapple? – Lesson # 3</h1>
  <p>Grade: 4th Grade</p>
  <p>Scenario: Shopping at the Market</p>
  <p>Skills Focus: Speaking</p>
  <p>Specific Objective: Students practice speaking about prices using numbers up to 100 and buying fruits at the market.</p>
  <p>Teacher introduces key vocabulary: pineapple, cassava, potatoes, money.</p>
</div>
`;

const pack = parseAoaLessonPlan(lessonText, {
  grade: '4th Grade',
  title: 'How Much Is the Pineapple?',
  scenario: 'Shopping at the Market',
  skill: 'Speaking',
  lessonNum: 3,
  scenarioData: scenario3
});

assert.ok(pack, 'Pack generated successfully');
assert.ok(pack.actionWorksheet, 'Action worksheet exists');
const part1Items = pack.actionWorksheet.part1.items;
const part1Words = part1Items.map(i => i.word.toLowerCase());
console.log('Part 1 extracted words:', part1Words);

// Verify 'number' NEVER appears
assert.ok(!part1Words.includes('number'), 'CRITICAL: "number" NEVER appears in Part 1 items!');
assert.ok(!part1Words.includes('numbers'), 'CRITICAL: "numbers" NEVER appears in Part 1 items!');

// Verify words match the scenario nouns
assert.ok(part1Words.includes('pineapple'), 'Contains pineapple');
assert.ok(part1Words.includes('cassava'), 'Contains cassava');
assert.ok(part1Words.includes('potatoes'), 'Contains potatoes');
assert.ok(part1Words.includes('money'), 'Contains money');

// Verify Ludic Kit also contains zero 'number'
assert.ok(pack.ludicKit, 'Ludic kit exists');
const productCards = pack.ludicKit?.stage3CardGame?.productCards || [];
const ludicWords = productCards.map(i => (i.name || i.word || '').toLowerCase());
console.log('Ludic kit cards:', ludicWords);
assert.ok(!ludicWords.includes('number'), 'CRITICAL: "number" NEVER appears in Ludic Kit cards!');

console.log('--- 4. Testing generateActivityPack in Automated Mode ---');
const autoPack = await generateActivityPack({
  text: lessonText,
  grade: '4th Grade',
  title: 'How Much Is the Pineapple?',
  scenario: 'Shopping at the Market',
  skill: 'Speaking',
  lessonNum: 3,
  scenarioData: scenario3,
  forceAi: false
});

assert.ok(autoPack, 'Auto pack returned');
assert.equal(autoPack._usedAi, false, '_usedAi is false for automated mode');
const autoWords = autoPack.actionWorksheet.part1.items.map(i => i.word.toLowerCase());
console.log('Automated mode Part 1 words:', autoWords);
assert.ok(!autoWords.includes('number'), 'Automated pack contains zero "number" cards');
assert.ok(autoWords.includes('pineapple'), 'Contains pineapple');

console.log('🎉 ALL SCENARIO 3 VOCABULARY ALIGNMENT CHECKS PASSED!');
