import fs from 'fs';
import path from 'path';
import { getRealiaPhoto } from '../src/resources/realiaCatalog.js';
import { getIllustrationSvg } from '../src/resources/illustrations.js';
import { buildAoaLudicKit } from '../src/resources/lessonParser.js';

const curriculumsDir = path.resolve(process.cwd(), 'public', 'curriculums');
const nounsDir = path.resolve(process.cwd(), 'public', 'assets', 'nouns');

const curriculumFiles = fs.readdirSync(curriculumsDir).filter(f => f.endsWith('.json'));

console.log(`Found ${curriculumFiles.length} curriculum files.`);

let totalScenarios = 0;
let missingImages = new Set();
let resolvedWithUnsplash = new Set();
let resolvedWithLocalPng = new Set();
let completelyMissingNouns = new Set();

const allCurriculumNouns = new Map(); // word -> [locations]

for (const file of curriculumFiles) {
  const content = JSON.parse(fs.readFileSync(path.join(curriculumsDir, file), 'utf-8'));
  const grade = content.grade || file;
  const scenarios = content.scenarios || [];

  for (const sc of scenarios) {
    totalScenarios++;
    const scTitle = sc.title || sc.scenario || sc.name;
    const vocabulary = sc.vocabulary || sc.target_vocabulary || sc.words || [];
    const nouns = sc.nouns || sc.target_nouns || [];
    const allWords = [...new Set([...vocabulary, ...nouns])];

    for (const w of allWords) {
      if (typeof w !== 'string') continue;
      const clean = w.toLowerCase().trim();
      if (!clean || clean.length < 2) continue;

      if (!allCurriculumNouns.has(clean)) {
        allCurriculumNouns.set(clean, []);
      }
      allCurriculumNouns.get(clean).push(`${grade} - ${scTitle}`);

      const photo = getRealiaPhoto(clean);
      if (!photo) {
        completelyMissingNouns.add(clean);
      } else if (photo.startsWith('http')) {
        resolvedWithUnsplash.add(clean);
      } else {
        // Local PNG
        const rel = photo.replace(/^\//, '');
        const fullPath = path.resolve(process.cwd(), 'public', rel);
        if (!fs.existsSync(fullPath)) {
          missingImages.add(`${clean} -> points to ${photo} but file does NOT exist`);
        } else {
          resolvedWithLocalPng.add(clean);
        }
      }
    }
  }
}

console.log(`\n=== 1. CURRICULAR NOUNS AUDIT ===`);
console.log(`Total Scenarios: ${totalScenarios}`);
console.log(`Total Unique Words checked: ${allCurriculumNouns.size}`);
console.log(`Resolved with Local PNG: ${resolvedWithLocalPng.size}`);
console.log(`Resolved with Unsplash Photo: ${resolvedWithUnsplash.size}`);
console.log(`Broken Local Paths: ${missingImages.size}`);
console.log(`Completely Missing Images (null): ${completelyMissingNouns.size}`);

if (missingImages.size > 0) {
  console.log('\n--- Broken Local Paths: ---');
  for (const m of Array.from(missingImages).slice(0, 30)) {
    console.log('  ❌', m);
  }
}

if (completelyMissingNouns.size > 0) {
  console.log(`\n--- Top 40 Completely Missing Nouns without Image: ---`);
  const missingArray = Array.from(completelyMissingNouns);
  for (const m of missingArray.slice(0, 40)) {
    console.log(`  ⚠️  "${m}" (used in: ${allCurriculumNouns.get(m)[0]})`);
  }
}

console.log(`\n=== 2. AUDIT LUDIC KIT STAGES FOR INCONSISTENCIES ===`);
// Test scenarios with different skills and domains
const testCases = [
  { grade: '4th Grade', scenario: 'Shopping at the Market', skill: 'Speaking', vocab: ['pineapple', 'cassava', 'potatoes', 'money', 'price', 'market', 'store', 'cost', 'cashier'] },
  { grade: '4th Grade', scenario: 'Shopping at the Market', skill: 'Listening', vocab: ['pineapple', 'cassava', 'potatoes', 'money', 'price', 'market'] },
  { grade: '4th Grade', scenario: 'Shopping at the Market', skill: 'Reading', vocab: ['pineapple', 'cassava', 'potatoes', 'money', 'price', 'market'] },
  { grade: '4th Grade', scenario: 'Shopping at the Market', skill: 'Writing', vocab: ['pineapple', 'cassava', 'potatoes', 'money', 'price', 'market'] },
  { grade: 'Kindergarten', scenario: 'Where is it in the Classroom?', skill: 'Listening', vocab: ['book', 'desk', 'chair', 'bag', 'pencil', 'crayon'] },
  { grade: '7th Grade', scenario: 'Panama Canal Transit', skill: 'Speaking', vocab: ['ship', 'locks', 'waterway', 'cargo', 'pilot', 'tugboat'] },
];

for (const tc of testCases) {
  const lk = buildAoaLudicKit({
    skill: tc.skill,
    grade: tc.grade,
    scenario: tc.scenario,
    cleanTheme: tc.scenario,
    vocabWords: tc.vocab,
    lessonNum: 1
  });

  console.log(`\n--- Test Case: ${tc.grade} | ${tc.scenario} | ${tc.skill} ---`);
  
  // Check Stage 1
  console.log(`Stage 1 Game: ${lk.stage1Game?.gameName}`);
  console.log(`  Rule: ${lk.stage1Game?.rules}`);
  console.log(`  Prompt: ${lk.stage1Game?.prompt}`);

  // Check Stage 2
  console.log(`Stage 2 items (${lk.stage2ListenPoint?.items?.length || 0}):`);
  for (const it of (lk.stage2ListenPoint?.items || [])) {
    console.log(`  [Word: ${it.targetWord}] Photo: ${it.photoUrl ? 'YES' : 'NO/NULL'} | Script: "${it.script}" | Response: "${it.response}"`);
  }

  // Check Stage 3
  console.log(`Stage 3 product cards (${lk.stage3CardGame?.productCards?.length || 0}):`);
  for (const pc of (lk.stage3CardGame?.productCards || [])) {
    console.log(`  [Card: ${pc.name} - ${pc.word}] Photo: ${pc.photoUrl ? 'YES' : 'NO/NULL'} | Price/Tag: "${pc.price || pc.tag}"`);
  }

  // Check Stage 4 Mission
  console.log(`Stage 4 Mission: ${lk.stage4Mission?.title}`);
  if (lk.stage4Mission?.roleA) {
    console.log(`  Role A: ${lk.stage4Mission.roleA.role} | Goal: ${lk.stage4Mission.roleA.goal}`);
  }
  if (lk.stage4Mission?.roleB) {
    console.log(`  Role B: ${lk.stage4Mission.roleB.role} | Prices: ${JSON.stringify(lk.stage4Mission.roleB.prices)}`);
  }
}
