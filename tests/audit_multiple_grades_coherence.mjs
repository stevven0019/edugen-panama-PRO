import fs from 'fs';
import path from 'path';
import { parseAoaLessonPlan } from '../src/resources/lessonParser.js';
import { generateActivityPack, hydratePackPhotos } from '../src/resources/activityPack.js';
import { renderWorkbookHtml } from '../src/resources/renderWorkbookHtml.js';

const testScenarios = [
  {
    grade: 'Kindergarten',
    scenario: 'Where is it in the classroom?',
    skill: 'Listening',
    title: 'Objects in the Classroom',
    rawText: `
      <h2>Objects in the Classroom</h2>
      <b>Scenario: Where is it in the classroom?</b>
      <b>Grade: Kindergarten</b>
      <b>Skill: Listening</b>
      Words like 'book', 'desk', 'chair', 'pencil', 'crayon', 'bag' are introduced with real objects.
      Listen and point to the classroom object.
    `
  },
  {
    grade: '4th Grade',
    scenario: 'Shopping at the Market',
    skill: 'Speaking',
    title: 'Buying Fresh Fruits',
    rawText: `
      <h2>Buying Fresh Fruits</h2>
      <b>Scenario: Shopping at the Market</b>
      <b>Grade: 4th Grade</b>
      <b>Skill: Speaking</b>
      Words like 'pineapple', 'cassava', 'potatoes', 'apple', 'banana', 'orange' are practiced.
      Students role-play asking prices and shopping at the market.
    `
  },
  {
    grade: '7th Grade',
    scenario: 'Panama Canal Transit',
    skill: 'Reading',
    title: 'Canal Navigation and Logistics',
    rawText: `
      <h2>Canal Navigation and Logistics</h2>
      <b>Scenario: Panama Canal Transit</b>
      <b>Grade: 7th Grade</b>
      <b>Skill: Reading</b>
      Target vocabulary includes 'ship', 'locks', 'waterway', 'cargo', 'pilot', 'tugboat'.
      Students read schedules and logistical route descriptions.
    `
  },
  {
    grade: '9th Grade',
    scenario: 'Environmental Protection in Panama',
    skill: 'Writing',
    title: 'Protecting Our Tropical Rainforest',
    rawText: `
      <h2>Protecting Our Tropical Rainforest</h2>
      <b>Scenario: Environmental Protection in Panama</b>
      <b>Grade: 9th Grade</b>
      <b>Skill: Writing</b>
      Target vocabulary: 'forest', 'jaguar', 'tree', 'river', 'conservation', 'biodiversity'.
      Students write an action log with recommendations for forest preservation.
    `
  },
  {
    grade: '12th Grade',
    scenario: "Panama's Role in International Logistics",
    skill: 'Mediation',
    title: 'Global Multimodal Supply Chain',
    rawText: `
      <h2>Global Multimodal Supply Chain</h2>
      <b>Scenario: Panama's Role in International Logistics</b>
      <b>Grade: 12th Grade</b>
      <b>Skill: Mediation</b>
      Words like 'shipping', 'infrastructure', 'efficiency', 'connectivity', 'trade', 'ports'.
      Students collaborate in pairs to design a multimodal transport proposal.
    `
  }
];

let allPassed = true;

for (const tc of testScenarios) {
  console.log(`\n======================================================`);
  console.log(`Auditing: ${tc.grade} · ${tc.scenario} · ${tc.skill}`);
  console.log(`======================================================`);

  const pack = parseAoaLessonPlan(tc.rawText, {
    grade: tc.grade,
    scenario: tc.scenario,
    skill: tc.skill,
    title: tc.title
  });

  hydratePackPhotos(pack);
  const html = renderWorkbookHtml(pack);

  // Check 1: No img tags with src="null" or src=""
  const hasNullImg = /<img[^>]+src=["'](?:null|undefined|)["']/i.test(html);
  const imgMatches = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)];
  console.log(`- Img tags generated: ${imgMatches.length}`);
  console.log(`- Img tags with null/undefined/empty: ${hasNullImg ? 'FAIL ❌' : 'PASS ✅'}`);
  if (hasNullImg) allPassed = false;

  // Check 2: Ludic Kit components
  const lk = pack.ludicKit;
  console.log(`- Stage 1 Game: "${lk.stage1Game?.name}" (GameName alias: "${lk.stage1Game?.gameName}")`);
  console.log(`- Stage 1 Prompt: "${lk.stage1Game?.prompt?.slice(0, 80)}..."`);
  console.log(`- Stage 2 Items count: ${lk.stage2ListenPoint?.items?.length} (All with photos: ${lk.stage2ListenPoint?.items?.every(it => it.photoUrl) ? 'YES ✅' : 'NO ❌'})`);
  if (!lk.stage2ListenPoint?.items?.every(it => it.photoUrl)) allPassed = false;

  console.log(`- Stage 3 Product Cards count: ${lk.stage3CardGame?.productCards?.length} (All with photos: ${lk.stage3CardGame?.productCards?.every(c => c.photoUrl) ? 'YES ✅' : 'NO ❌'})`);
  if (!lk.stage3CardGame?.productCards?.every(c => c.photoUrl)) allPassed = false;

  console.log(`- Stage 4 Mission: "${lk.stage4Mission?.title}"`);
  console.log(`  Role A: ${lk.stage4Mission?.roleA?.role} | Role B: ${lk.stage4Mission?.roleB?.role}`);
  console.log(`- Stage 5 Can-Do Count: ${lk.stage5CanDo?.statements?.length}`);
  if (!lk.stage5CanDo?.statements?.length) allPassed = false;

  // Check 3: Ficha Worksheets Part 1 and Part 2
  const part1Items = pack.actionWorksheet?.part1?.items || [];
  console.log(`- Action Worksheet Part 1 Items: ${part1Items.length} (All with photos: ${part1Items.every(it => it.photoUrl) ? 'YES ✅' : 'NO ❌'})`);
  if (!part1Items.length || !part1Items.every(it => it.photoUrl)) allPassed = false;
}

console.log(`\n======================================================`);
if (allPassed) {
  console.log(`🎉 ALL AUDIT CHECKS PASSED ACROSS ALL GRADES AND SKILLS!`);
} else {
  console.log(`❌ SOME AUDIT CHECKS FAILED! Check logs above.`);
  process.exit(1);
}
