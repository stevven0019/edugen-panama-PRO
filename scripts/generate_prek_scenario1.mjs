import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildAoaFields, lessonSkills } from '../src/services/aoaCurriculum.js';
import { generateCurriculumContent } from '../src/services/ai.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.env.VITE_GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY || '';

const TARGET_DIR = path.join(__dirname, '..', 'lesson plannings', 'Prekinder');
fs.mkdirSync(TARGET_DIR, { recursive: true });

const currPath = path.join(__dirname, '..', 'public', 'curriculums', 'English_Curriculum_Prekinder.json');
const currData = JSON.parse(fs.readFileSync(currPath, 'utf8'));

const scenario = currData.scenarios[0]; // Scenario 1: Meeting My Friends
const rawCefr = currData.proficiency_level || 'Pre A1.1 Foundational Learner';

function cleanHtml(html) {
  const lastTableIdx = html.lastIndexOf('</table>');
  if (lastTableIdx !== -1) {
    return html.slice(0, lastTableIdx + 8).trim();
  }
  return html.trim();
}

async function generateLesson(themeType, themeIdx, lessonNum) {
  const skill = lessonSkills[lessonNum - 1];
  const fields = buildAoaFields(scenario, themeType, [skill]);

  const vars = {
    skills: [skill],
    grade: 'Pre-K',
    cefr: rawCefr,
    lessonNum: lessonNum,
    scenario: fields.scenario || 'Meeting My Friends',
    theme: fields.theme || (themeIdx === 1 ? 'Meeting My Friends' : 'Saying Please and Thank You'),
    objective: fields.specificObjective || '',
    outcome: fields.learningOutcome || '',
    communicativeComp: fields.communicativeComp || '',
    project21st: lessonNum === 5 ? (fields.project21st || '') : ''
  };

  const docTitle = `Planner AOA - ${vars.theme} (L${lessonNum})`;
  const filename = `${docTitle.replace(/[<>:"/\\|?*]/g, '_')}.doc`;
  const filePath = path.join(TARGET_DIR, filename);

  console.log(`\nGenerating Theme ${themeIdx} (${vars.theme}) - Lesson ${lessonNum} (${skill})...`);
  
  let attempts = 0;
  while (attempts < 3) {
    try {
      attempts++;
      const rawHtml = await generateCurriculumContent('planner', vars);
      const cleaned = cleanHtml(rawHtml);
      const docContent = '\ufeff' + cleaned;
      fs.writeFileSync(filePath, docContent, 'utf8');
      console.log(` Saved: ${filename} (${docContent.length} bytes)`);
      return { success: true, title: docTitle, file: filename };
    } catch (err) {
      console.error(` Attempt ${attempts} failed:`, err.message);
      if (attempts >= 3) throw err;
      await new Promise(r => setTimeout(r, 2000 * attempts));
    }
  }
}

async function main() {
  console.log('===============================================================');
  console.log(' EDUGEN PANAMA PRO • AOA LESSON PLANNER GENERATOR');
  console.log(' Grade: Prekinder | Scenario 1: Meeting My Friends');
  console.log(' Themes: 1. Meeting My Friends | 2. Saying Please and Thank You');
  console.log(' Output folder:', TARGET_DIR);
  console.log('===============================================================');

  const themes = [
    { type: 'receptive', index: 1, name: 'Meeting My Friends' },
    { type: 'interactive', index: 2, name: 'Saying Please and Thank You' }
  ];

  const results = [];

  for (const t of themes) {
    console.log(`\n>>> STARTING THEME ${t.index}: "${t.name}" (5 Sequential Lessons)`);
    for (let l = 1; l <= 5; l++) {
      const res = await generateLesson(t.type, t.index, l);
      results.push(res);
      // Small pause between generations
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  console.log('\n===============================================================');
  console.log(` GENERATION COMPLETE! Total lessons generated: ${results.length}`);
  console.log(' Files saved in:', TARGET_DIR);
  console.log('===============================================================');
}

main().catch(err => {
  console.error('Fatal error during batch generation:', err);
  process.exit(1);
});
