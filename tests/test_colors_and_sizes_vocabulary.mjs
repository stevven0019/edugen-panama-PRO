/**
 * EDUGEN PRO · TEST SUITE: Colors & Sizes Vocabulary Integration
 * Tests:
 * 1. Assets on disk (public/assets/nouns/)
 * 2. availableNouns.js registration (hasNounImage, getNounImagePath)
 * 3. realiaCatalog.js (getRealiaPhoto, REALIA_PHOTOS)
 * 4. illustrations.js (getIllustrationSvg)
 * 5. linguisticPosterStudioHtml.js (VOCAB_DICTIONARY, displayAdjs)
 * 6. lessonParser.js (CURRICULUM_TOPIC_VOCAB, detectScenarioDomain, buildAoaLudicKit)
 * 7. renderWorkbookHtml.js (4-page HTML compilation with colors)
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { AVAILABLE_NOUNS, hasNounImage, getNounImagePath } from '../src/resources/availableNouns.js';
import { getRealiaPhoto, REALIA_PHOTOS } from '../src/resources/realiaCatalog.js';
import { getIllustrationSvg } from '../src/resources/illustrations.js';
import { VOCAB_DICTIONARY } from '../src/resources/linguisticPosterStudioHtml.js';
import { ICONS } from '../src/resources/activityPack.js';
import {
  CURRICULUM_TOPIC_VOCAB,
  detectScenarioDomain,
  getTopicVocabFallback,
  parseAoaLessonPlan
} from '../src/resources/lessonParser.js';
import { renderWorkbookHtml } from '../src/resources/renderWorkbookHtml.js';

console.log('🚀 Running Colors & Sizes Vocabulary Integration Tests...\n');

const TARGET_WORDS = ['green', 'blue', 'red', 'yellow', 'purple', 'orange', 'small', 'big'];

// 1. Check availability in availableNouns and disk existence
console.log('--- 1. Testing Assets & Registration ---');
for (const word of TARGET_WORDS) {
  assert.ok(hasNounImage(word), `Word "${word}" must be registered in availableNouns`);
  const imgPath = getNounImagePath(word);
  assert.ok(imgPath.startsWith('/assets/nouns/'), `Word "${word}" image path must start with /assets/nouns/`);
  
  const diskPath = path.join(process.cwd(), 'public', 'assets', 'nouns', `${word}.png`);
  assert.ok(fs.existsSync(diskPath), `Physical PNG asset for "${word}" must exist at ${diskPath}`);
  console.log(`  ✓ "${word}" registered in availableNouns and exists on disk (${imgPath})`);
}

// 2. Check realia photo and SVG illustrations
console.log('\n--- 2. Testing Photo & SVG Fallbacks ---');
for (const word of TARGET_WORDS) {
  const photo = getRealiaPhoto(word);
  assert.ok(photo, `getRealiaPhoto("${word}") must return a valid URL or asset path`);
  
  const svg = getIllustrationSvg(word, 'color');
  assert.ok(svg && svg.includes('<svg'), `getIllustrationSvg("${word}") must return a valid SVG`);
  console.log(`  ✓ "${word}" resolves photo: ${photo.slice(0, 35)}... and SVG length: ${svg.length} chars`);
}

// 3. Check VOCAB_DICTIONARY for translation & phonetics
console.log('\n--- 3. Testing Linguistic Poster Dictionary ---');
for (const word of TARGET_WORDS) {
  const entry = VOCAB_DICTIONARY[word];
  assert.ok(entry, `Word "${word}" must exist in VOCAB_DICTIONARY`);
  assert.ok(entry.translation, `Word "${word}" must have a Spanish translation (found: ${entry.translation})`);
  assert.ok(entry.phonetic, `Word "${word}" must have an IPA phonetic transcription (found: ${entry.phonetic})`);
  console.log(`  ✓ "${word}" -> ${entry.translation} [${entry.phonetic}]`);
}

// 4. Check ICONS in activityPack.js
console.log('\n--- 4. Testing ICONS set in activityPack ---');
for (const word of TARGET_WORDS) {
  assert.ok(ICONS.includes(word), `ICONS array in activityPack.js must include "${word}"`);
}
console.log('  ✓ All 8 words present in activityPack ICONS!');

// 5. Check Curriculum Domain & Topic Fallback
console.log('\n--- 5. Testing Curriculum Domain & Detection ---');
assert.ok(Array.isArray(CURRICULUM_TOPIC_VOCAB.colors), 'CURRICULUM_TOPIC_VOCAB.colors must be defined');
for (const word of TARGET_WORDS) {
  assert.ok(CURRICULUM_TOPIC_VOCAB.colors.includes(word), `CURRICULUM_TOPIC_VOCAB.colors must include "${word}"`);
}

const colorDomain = detectScenarioDomain('My Senses and Nature', 'Exploring Colors in Panama');
assert.equal(colorDomain, 'colors', 'Scenario with "Colors" must resolve to "colors" domain');
const fallback = getTopicVocabFallback('We identify colors in the classroom');
assert.deepEqual(fallback, CURRICULUM_TOPIC_VOCAB.colors, 'getTopicVocabFallback must return colors vocab');
console.log('  ✓ Domain detection and curriculum topic fallback verified!');

// 6. Test End-to-End Lesson Plan & HTML Action Kit
console.log('\n--- 6. Testing End-to-End Lesson Plan & 4-Page Action Kit Rendering ---');
const rawLessonPlan = `
PLANNER AOA MEDUCA PANAMÁ
Grade: 1st Grade (CEFR: Pre-A1 / A1.1)
Scenario: Colors and Shapes in Panama
Theme: Exploring Colors and Sizes
Lesson Number: 2
Skill: Speaking
Specific Objective: Students will actively name colors and compare sizes in pairs.
Vocabulary: green, blue, red, yellow, purple, orange, small, big
Language Frame: "What color is this?" ──> "It is green. It is a big circle."
`;

const pack = parseAoaLessonPlan(rawLessonPlan, {
  grade: '1st Grade',
  scenario: 'Colors and Shapes in Panama',
  title: 'Exploring Colors and Sizes',
  skill: 'Speaking',
  lessonNum: 2
});

assert.ok(pack.ludicKit, 'Pack must include ludicKit');
assert.equal(pack.ludicKit.stage1Game.name, 'Rainbow Color & Size Detective!');
assert.ok(pack.ludicKit.stage1Game.prompt.includes('What color is this?'));
assert.equal(pack.ludicKit.stage4Mission.title, 'Communicative Action Mission: "The Bilingual Color & Art Studio!"');
assert.ok(pack.ludicKit.stage4Mission.roleA.role.includes('ARTIST'));

const html = renderWorkbookHtml(pack);
assert.ok(html.includes('green'), 'Rendered HTML must contain green');
assert.ok(html.includes('blue'), 'Rendered HTML must contain blue');
assert.ok(html.includes('red'), 'Rendered HTML must contain red');
assert.ok(html.includes('yellow'), 'Rendered HTML must contain yellow');
assert.ok(html.includes('Rainbow Color & Size Detective!'), 'Rendered HTML must contain color game');
assert.ok(html.includes('The Bilingual Color & Art Studio!'), 'Rendered HTML must contain artist mission');

console.log('  ✓ 4-Page Action Kit HTML with Colors & Sizes verified!');

console.log('\n======================================================');
console.log('🎉 ALL COLORS & SIZES VOCABULARY INTEGRATION TESTS PASSED 100%!');
console.log('======================================================');
