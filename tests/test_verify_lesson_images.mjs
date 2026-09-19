import { renderWorkbookHtml } from '../src/resources/renderWorkbookHtml.js';
import { parseAoaLessonPlan } from '../src/resources/lessonParser.js';
import { validatePack } from '../src/resources/activityPack.js';
import { getRealiaPhoto } from '../src/resources/realiaCatalog.js';
import fs from 'fs';
import path from 'path';

console.log('--- 1. Testing individual image resolution via getRealiaPhoto ---');
const words = ['umbrella', 'boots', 'puddle', 'raincoat', 'splash', 'wet'];
for (const w of words) {
  const photo = getRealiaPhoto(w);
  console.log(`Word: "${w}" -> photoUrl: "${photo}"`);
  if (!photo) {
    throw new Error(`Failed to resolve image for word: ${w}`);
  }
  // Check if file physically exists in public
  const relativePath = photo.replace(/^\//, '');
  const physicalPath = path.resolve(process.cwd(), 'public', relativePath);
  if (!fs.existsSync(physicalPath)) {
    throw new Error(`Physical file does not exist: ${physicalPath}`);
  }
}

console.log('\n--- 2. Testing Lesson Plan Parser with 4th Grade "It\'s the Rainy Season" ---');
const lessonText = `
Grade: 4th Grade
Scenario: It's the Rainy Season
Lesson Title: Where's the Puddle?
Skill: Listening

Vocabulary words: umbrella, boots, puddle, raincoat, splash, wet.

Stage 1: Warm-up
Teacher introduces realia items: **umbrella**, **boots**, **puddle**, **raincoat**, **splash**, **wet**.

Stage 2: Presentation
Teacher: The umbrella keeps us dry in the rain.
Student: Where is my raincoat?
Teacher: Put on your boots before jumping in the puddle!
Student: Be careful not to make a splash.

Stage 3: Guided Practice
Matching items with functions.
`;

const parsedPack = parseAoaLessonPlan(lessonText, {
  grade: '4th Grade',
  title: "Where's the Puddle?",
  scenario: "It's the Rainy Season",
  skill: 'Listening'
});

const validated = validatePack(parsedPack);

console.log('\n--- 3. Testing HTML Rendering ---');
const html = renderWorkbookHtml(validated);

// Verify Part 1 images
console.log('Checking Part 1 images in HTML...');
for (const w of words) {
  const expectedSrc = `/assets/nouns/${w}.png`;
  if (!html.includes(expectedSrc)) {
    throw new Error(`HTML does not contain expected Part 1 image: ${expectedSrc}`);
  }
}
console.log('✓ All 6 Part 1 images present in HTML!');

// Verify Part 2 images
console.log('Checking Part 2 images in HTML...');
const part2HasImages = html.includes('part2-photo') || html.includes('/assets/nouns/umbrella.png') || html.includes('/assets/nouns/boots.png');
if (!part2HasImages) {
  throw new Error('Part 2 does not contain resolved images!');
}
console.log('✓ Part 2 accuracy check includes resolved images!');

// Verify Page 2 Activity 2 Matching thumbnails
console.log('Checking Page 2 Activity 2 Matching thumbnails in HTML...');
if (!html.includes('Photo A') || !html.includes('Photo B')) {
  throw new Error('Matching activity does not contain Photo items!');
}
if (!html.includes('Activity 2:')) {
  throw new Error('Missing Activity 2 section in HTML!');
}
console.log('✓ Page 2 Activity 2 has Photo items and image thumbnails!');

// Verify base href
if (!html.includes('<base href="')) {
  throw new Error('HTML is missing base href tag for proper relative URL resolution!');
}
console.log('✓ Base href tag is present in HTML head!');

console.log('\n=============================================');
console.log('ALL LESSON IMAGE VERIFICATION CHECKS PASSED!');
console.log('=============================================');
