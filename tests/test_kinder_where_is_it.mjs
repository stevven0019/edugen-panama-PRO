import { parseAoaLessonPlan, isValidVocabWord } from '../src/resources/lessonParser.js';
import { renderWorkbookHtml } from '../src/resources/renderWorkbookHtml.js';
import { renderSpatialCardHtml, getRealiaPhoto } from '../src/resources/realiaCatalog.js';

console.log('🧪 Testing Kindergarten "Where Is It?" Lesson Plan & Poster Rendering...\n');

// 1. Verify prepositions are excluded from vocabulary
console.log('1. Checking isValidVocabWord for prepositions...');
const preps = ['in', 'on', 'under', 'next to', 'next_to', 'behind', 'between'];
for (const p of preps) {
  if (isValidVocabWord(p)) {
    throw new Error(`FAIL: Preposition "${p}" should NOT be considered a valid vocabulary word!`);
  }
}
console.log('✅ Prepositions correctly rejected as vocabulary items.');

// 2. Parse Kindergarten Lesson 3 (Speaking) input
console.log('\n2. Testing parseAoaLessonPlan for Kinder Scenario "Where Is It?" (Lesson 3 Speaking)...');
const kinderInput = `
Grade: Kindergarten (Educación Inicial)
Scenario: Where Is It?
Theme: Where Is Your Book?
Lesson # 3
Skills: Speaking (Spoken Fluency)
Target Vocabulary: on, in, under, book, pencil, bag, chair, desk, crayon
Commands:
- Put your book on the desk!
- Put your bag under the chair!
- Put your pencil in the bag!
- Put your crayon next to the book!
`;

const pack = parseAoaLessonPlan(kinderInput, {
  grade: 'Kindergarten',
  scenario: 'Where Is It?',
  title: 'Where Is It?',
  skill: 'Speaking'
});

console.log('Parsed Title:', pack.title);
console.log('Parsed Grade:', pack.grade);
console.log('Parsed Skill:', pack.skill);

const part1Items = pack.actionWorksheet.part1.items;
console.log('\nPart 1 Items:');
part1Items.forEach((it, idx) => console.log(`  ${idx + 1}. ${it.word}`));

// Verify Part 1 has NO prepositions
for (const it of part1Items) {
  const w = it.word.toLowerCase();
  if (['on', 'in', 'under', 'next to'].includes(w)) {
    throw new Error(`FAIL: Part 1 contains preposition "${w}"!`);
  }
}
console.log('✅ Part 1 contains classroom objects and NO prepositions!');

const part2Items = pack.actionWorksheet.part2.items;
console.log('\nPart 2 Preposition Items:');
part2Items.forEach((it, idx) => {
  console.log(`  Item ${idx + 1}: [${it.concept}] "${it.sentence}" (rel: ${it.relation}, sub: ${it.subject}, ref: ${it.reference})`);
});

if (part2Items.length !== 4) {
  throw new Error(`FAIL: Expected 4 Part 2 items, got ${part2Items.length}`);
}

const expectedConcepts = ['ON', 'UNDER', 'IN', 'NEXT TO'];
part2Items.forEach((it, idx) => {
  if (it.concept !== expectedConcepts[idx]) {
    throw new Error(`FAIL: Item ${idx + 1} expected concept ${expectedConcepts[idx]}, got ${it.concept}`);
  }
});
console.log('✅ Part 2 has all 4 exact prepositions of place: ON, UNDER, IN, NEXT TO!');

// 3. Render HTML and verify SVG spatial scenes
console.log('\n3. Testing renderWorkbookHtml output...');
const html = renderWorkbookHtml(pack);

// Check that no plain text boxes like "UNDER CHAIR" or "PREPOSITION NEXT TO" exist
if (html.includes('UNDER CHAIR')) {
  throw new Error('FAIL: Found plain text "UNDER CHAIR" box in rendered HTML!');
}
if (html.includes('PREPOSITION NEXT TO') || html.includes('Preposition')) {
  // ensure it is not the old text box
  if (html.includes('text-blue-200">Preposition</span>')) {
    throw new Error('FAIL: Found old text box "Preposition NEXT TO" in rendered HTML!');
  }
}
console.log('✅ Zero unstyled text placeholder boxes in Part 2!');

// Check that SVG vector scenes are present
const svgMatches = [...html.matchAll(/<svg viewBox="0 0 170 130"/g)];
console.log(`Found ${svgMatches.length} spatial scene SVGs in HTML.`);
if (svgMatches.length < 4) {
  throw new Error(`FAIL: Expected 4 spatial scene SVGs in Part 2, found ${svgMatches.length}`);
}
console.log('✅ All 4 preposition cards have complete vector spatial scene SVGs!');

// 4. Test renderSpatialCardHtml directly for all 4 relations
console.log('\n4. Testing renderSpatialCardHtml directly for the 4 core relations:');
const s1 = renderSpatialCardHtml({ relation: 'on', subject: 'book', reference: 'desk' });
const s2 = renderSpatialCardHtml({ relation: 'under', subject: 'bag', reference: 'chair' });
const s3 = renderSpatialCardHtml({ relation: 'in', subject: 'pencil', reference: 'bag' });
const s4 = renderSpatialCardHtml({ relation: 'next_to', subject: 'crayon', reference: 'book' });

if (!s1.includes('<svg') || !s1.includes('rect')) throw new Error('Scene 1 ON failed');
if (!s2.includes('<svg') || !/chair/i.test(s2)) throw new Error('Scene 2 UNDER failed');
if (!s3.includes('<svg') || !/pencil|pocket/i.test(s3)) throw new Error('Scene 3 IN failed');
if (!s4.includes('<svg') || !/crayon/i.test(s4)) throw new Error('Scene 4 NEXT TO failed');

console.log('  Scene 1 [ON]: Book on desk SVG generated successfully.');
console.log('  Scene 2 [UNDER]: Bag under chair SVG generated successfully.');
console.log('  Scene 3 [IN]: Pencil in bag SVG generated successfully.');
console.log('  Scene 4 [NEXT TO]: Crayon next to book SVG generated successfully.');

console.log('\n🎉 ALL KINDERGARTEN "WHERE IS IT?" TESTS PASSED PERFECTLY!');
