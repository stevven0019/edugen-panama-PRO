import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildAoaFields, curriculumFilename, lessonSkills } from '../src/services/aoaCurriculum.js';
import { generateCurriculumContent } from '../src/services/ai.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Route through production Vercel proxy to avoid free-tier 429 rate limits
delete process.env.VITE_GEMINI_API_KEY;
const origFetch = globalThis.fetch;
globalThis.fetch = async (url, opts) => {
  if (typeof url === 'string' && url.startsWith('/api/gemini')) {
    url = 'https://edugen-panama-pro.vercel.app' + url;
  }
  return origFetch(url, opts);
};

const BASE_DIR = path.join(__dirname, '..', 'lesson plannings');

const GRADE_DIR_MAP = {
  'Pre-K': 'Prekinder',
  'Prekinder': 'Prekinder',
  'Kinder': 'Kinder',
  'Kindergarten': 'Kinder',
  '1st Grade': '1st Grade',
  '2nd Grade': '2nd Grade',
  '3rd Grade': '3rd Grade',
  '4th Grade': '4th Grade',
  '5th Grade': '5th Grade',
  '6th Grade': '6th Grade',
  '7th Grade': '7th Grade',
  '8th Grade': '8th Grade',
  '9th Grade': '9th Grade',
  '10th Grade': '10th Grade',
  '11th Grade': '11th Grade',
  '12th Grade': '12th Grade'
};

function cleanHtml(html) {
  const lastTableIdx = html.lastIndexOf('</table>');
  if (lastTableIdx !== -1) {
    return html.slice(0, lastTableIdx + 8).trim();
  }
  return html.trim();
}

function sanitizeName(str) {
  return (str || '')
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function generateScenarioPackage(gradeName, scenarioIndex) {
  const gradeFolder = GRADE_DIR_MAP[gradeName] || gradeName;
  const currFile = curriculumFilename(gradeName);
  const currPath = path.join(__dirname, '..', 'public', 'curriculums', currFile);

  if (!fs.existsSync(currPath)) {
    throw new Error(`Curriculum file not found: ${currPath}`);
  }

  const currData = JSON.parse(fs.readFileSync(currPath, 'utf8'));
  const scenarios = currData.scenarios || [];
  const rawCefr = currData.proficiency_level || currData.cefrLevel || currData.level || '';

  if (scenarioIndex < 0 || scenarioIndex >= scenarios.length) {
    throw new Error(`Scenario index ${scenarioIndex} out of bounds (Total: ${scenarios.length})`);
  }

  const scenario = scenarios[scenarioIndex];
  const scNum = scenarioIndex + 1;
  const scTitle = scenario.scenarioName || scenario.scenario_title || scenario.title || `Scenario ${scNum}`;
  const scFolderName = `Scenario ${scNum} - ${sanitizeName(scTitle)}`;
  const scFolderPath = path.join(BASE_DIR, gradeFolder, scFolderName);

  console.log('======================================================================');
  console.log(` GRADE: ${gradeFolder} | SCENARIO ${scNum}: "${scTitle}"`);
  console.log(` Target Directory: ${scFolderPath}`);
  console.log('======================================================================');

  // Determine available themes (theme 1: receptive, theme 2: interactive if present)
  const fReceptive = buildAoaFields(scenario, 'receptive', []);
  const fInteractive = buildAoaFields(scenario, 'interactive', []);

  const themesToProcess = [];
  if (fReceptive.theme) {
    themesToProcess.push({ type: 'receptive', num: 1, name: fReceptive.theme });
  } else if (scenario.themes && scenario.themes[0]) {
    themesToProcess.push({ type: 'receptive', num: 1, name: scenario.themes[0] });
  }

  if (fInteractive.theme && fInteractive.theme !== fReceptive.theme) {
    themesToProcess.push({ type: 'interactive', num: 2, name: fInteractive.theme });
  } else if (scenario.themes && scenario.themes[1]) {
    themesToProcess.push({ type: 'interactive', num: 2, name: scenario.themes[1] });
  }

  const generatedFiles = [];

  for (const t of themesToProcess) {
    const themeFolderName = `Theme ${t.num} - ${sanitizeName(t.name)}`;
    const themeFolderPath = path.join(scFolderPath, themeFolderName);
    fs.mkdirSync(themeFolderPath, { recursive: true });

    console.log(`\n📂 [THEME ${t.num}]: "${t.name}" -> ${themeFolderName}/`);

    for (let l = 1; l <= 5; l++) {
      const skill = lessonSkills[l - 1];
      const docTitle = `Planner AOA - ${t.name} (L${l})`;
      const filename = `${sanitizeName(docTitle)}.doc`;
      const filePath = path.join(themeFolderPath, filename);

      if (fs.existsSync(filePath) && fs.statSync(filePath).size > 13000) {
        console.log(`  ⏭️  Already exists (Rich AI): L${l} (${skill}) -> ${filename}`);
        generatedFiles.push({ file: filename, path: filePath, skipped: true });
        continue;
      }

      console.log(`  ⏳ Generating L${l} (${skill})...`);

      const fields = buildAoaFields(scenario, t.type, [skill]);
      const vars = {
        skills: [skill],
        grade: gradeName,
        cefr: rawCefr,
        lessonNum: l,
        scenario: fields.scenario || scTitle,
        theme: fields.theme || t.name,
        objective: fields.specificObjective || '',
        outcome: fields.learningOutcome || '',
        communicativeComp: fields.communicativeComp || '',
        project21st: l === 5 ? (fields.project21st || '') : ''
      };

      let attempts = 0;
      let success = false;
      while (attempts < 5 && !success) {
        try {
          attempts++;
          const rawHtml = await generateCurriculumContent('planner', vars);
          if (rawHtml.length < 13000) {
            console.log(`  ⚠️ Rate limit / fallback detected (${rawHtml.length} chars). Waiting 15s for Gemini quota reset (Attempt ${attempts}/5)...`);
            await new Promise(r => setTimeout(r, 15000));
            continue;
          }

          const cleaned = cleanHtml(rawHtml);
          const docContent = '\ufeff' + cleaned;
          fs.writeFileSync(filePath, docContent, 'utf8');
          console.log(`  ✅ Saved Rich AI: ${filename} (${docContent.length} bytes)`);
          generatedFiles.push({ file: filename, path: filePath, skipped: false });
          success = true;
        } catch (err) {
          console.error(`  ⚠️ Attempt ${attempts} error:`, err.message);
          if (attempts >= 5) throw err;
          await new Promise(r => setTimeout(r, 15000));
        }
      }

      // Fast and reliable pacing with production proxy
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  console.log('\n======================================================================');
  console.log(` SCENARIO ${scNum} COMPLETE! Total lessons verified/saved: ${generatedFiles.length}`);
  console.log('======================================================================\n');

  return {
    grade: gradeFolder,
    scenarioNumber: scNum,
    scenarioTitle: scTitle,
    folder: scFolderPath,
    lessons: generatedFiles
  };
}

// CLI execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  let grade = 'Pre-K';
  let scenarioIdx = null;
  let fromIdx = null;
  let toIdx = null;
  let runAll = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--grade' && args[i+1]) {
      grade = args[i+1];
      i++;
    } else if (args[i] === '--scenario' && args[i+1]) {
      scenarioIdx = parseInt(args[i+1], 10) - 1;
      i++;
    } else if (args[i] === '--from' && args[i+1]) {
      fromIdx = parseInt(args[i+1], 10) - 1;
      i++;
    } else if (args[i] === '--to' && args[i+1]) {
      toIdx = parseInt(args[i+1], 10) - 1;
      i++;
    } else if (args[i] === '--all') {
      runAll = true;
    }
  }

  async function runCLI() {
    const currFile = curriculumFilename(grade);
    const currPath = path.join(__dirname, '..', 'public', 'curriculums', currFile);
    const currData = JSON.parse(fs.readFileSync(currPath, 'utf8'));
    const totalScenarios = currData.scenarios?.length || 0;

    let targetIndices = [];
    if (scenarioIdx !== null) {
      targetIndices = [scenarioIdx];
    } else if (fromIdx !== null || toIdx !== null) {
      const start = fromIdx !== null ? Math.max(0, fromIdx) : 0;
      const end = toIdx !== null ? Math.min(totalScenarios - 1, toIdx) : totalScenarios - 1;
      for (let s = start; s <= end; s++) targetIndices.push(s);
    } else if (runAll) {
      for (let s = 0; s < totalScenarios; s++) targetIndices.push(s);
    } else {
      targetIndices = [0];
    }

    console.log(`Starting generation for Grade "${grade}" (${targetIndices.length} scenarios in batch)...`);

    for (const idx of targetIndices) {
      await generateScenarioPackage(grade, idx);
      // Brief pause between scenarios
      await new Promise(r => setTimeout(r, 1500));
    }

    console.log(`\n🎉 ALL REQUESTED SCENARIOS COMPLETED FOR ${grade}!`);
  }

  runCLI().catch(err => {
    console.error('Execution error:', err);
    process.exit(1);
  });
}
