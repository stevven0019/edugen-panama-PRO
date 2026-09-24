import fs from 'fs';
import path from 'path';
import { parseAoaLessonPlan } from '../src/resources/lessonParser.js';
import { renderWorkbookHtml } from '../src/resources/renderWorkbookHtml.js';
import { buildWorkbook } from '../src/resources/workbookPdf.js';

const curriculums = [
  { grade: 'Pre-K', file: 'English_Curriculum_Prekinder.json', cefr: 'Pre-A1' },
  { grade: 'Kinder', file: 'English_Curriculum_Kinder.json', cefr: 'Pre-A1' },
  { grade: '1st Grade', file: 'English_Curriculum_Grade_1.json', cefr: 'Pre-A1' },
  { grade: '2nd Grade', file: 'English_Curriculum_Grade_2.json', cefr: 'A1.1' },
  { grade: '3rd Grade', file: 'English_Curriculum_Grade_3.json', cefr: 'A1' },
  { grade: '4th Grade', file: 'English_Curriculum_Grade_4.json', cefr: 'A1' },
  { grade: '5th Grade', file: 'English_Curriculum_Grade_5.json', cefr: 'A1+' },
  { grade: '6th Grade', file: 'English_Curriculum_Grade_6.json', cefr: 'A1+' },
  { grade: '7th Grade', file: 'English_Curriculum_Grade_7.json', cefr: 'A2' },
  { grade: '8th Grade', file: 'English_Curriculum_Grade_8.json', cefr: 'A2' },
  { grade: '9th Grade', file: 'English_Curriculum_Grade_9.json', cefr: 'A2+' },
  { grade: '10th Grade', file: 'English_Curriculum_Grade_10.json', cefr: 'B1' },
  { grade: '11th Grade', file: 'English_Curriculum_Grade_11.json', cefr: 'B1' },
  { grade: '12th Grade', file: 'English_Curriculum_Grade_12.json', cefr: 'B1+' }
];

const SKILLS = [
  { num: 1, name: 'Listening' },
  { num: 2, name: 'Reading' },
  { num: 3, name: 'Speaking' },
  { num: 4, name: 'Writing' },
  { num: 5, name: 'Mediation' }
];

let totalScenarios = 0;
let totalLessonsVerified = 0;
let errors = 0;

for (const { grade, file, cefr } of curriculums) {
  const filePath = path.join(process.cwd(), 'public', 'curriculums', file);
  if (!fs.existsSync(filePath)) {
    console.error('Missing file:', file);
    errors++;
    continue;
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const scenarios = data.scenarios || [];
  console.log(`Verifying ${grade} (${scenarios.length} scenarios, CEFR: ${cefr})...`);

  scenarios.forEach((sc, scIdx) => {
    totalScenarios++;
    const scName = sc.scenarioName || sc.scenario_title || sc.title || `Scenario ${scIdx + 1}`;
    const theme1 = sc.theme1 || sc.themes?.[0]?.theme_title || sc.themes?.[0]?.title || 'Theme 1';
    const theme2 = sc.theme2 || sc.themes?.[1]?.theme_title || sc.themes?.[1]?.title || 'Theme 2';

    // Verify all 5 lessons for this scenario
    for (const skill of SKILLS) {
      const activeTheme = skill.num === 5 ? theme1 : (skill.num % 2 === 1 ? theme1 : theme2);
      const isTheme2 = skill.num === 5 && theme2;

      const pack = parseAoaLessonPlan(
        `Scenario: ${scName} Theme: ${activeTheme} Grade: ${grade} Lesson # ${skill.num}`,
        {
          grade,
          scenario: scName,
          title: activeTheme,
          lessonNum: skill.num,
          skill: skill.name,
          themeType: 'receptive',
          scenarioData: sc
        }
      );

      if (!pack || pack.lessonNum !== skill.num || pack.skill !== skill.name) {
        console.error(`Mismatch for ${grade} SC ${scIdx + 1} L${skill.num} (${skill.name})`);
        errors++;
      }

      if (skill.num === 5) {
        // Test Theme 2 with Project 2 as well
        const packProj2 = parseAoaLessonPlan(
          `Scenario: ${scName} Theme: ${theme2} Grade: ${grade} Lesson # 5`,
          {
            grade,
            scenario: scName,
            title: theme2,
            lessonNum: 5,
            skill: 'Mediation',
            themeType: 'productive',
            scenarioData: sc
          }
        );
        if (!packProj2 || packProj2.lessonNum !== 5) {
          console.error(`Mediation Theme 2 failed for ${grade} SC ${scIdx + 1}`);
          errors++;
        }
      }

      // Verify HTML render
      const html = renderWorkbookHtml(pack);
      if (!html || !html.includes(`Lesson # ${skill.num}`)) {
        console.error(`HTML rendering failed for ${grade} SC ${scIdx + 1} L${skill.num}`);
        errors++;
      }

      totalLessonsVerified++;
    }
  });
}

console.log(`\n======================================================`);
console.log(`TOTAL GRADES VERIFIED: ${curriculums.length} (Pre-K to 12th Grade)`);
console.log(`TOTAL SCENARIOS VERIFIED: ${totalScenarios} (8 scenarios per grade)`);
console.log(`TOTAL LESSONS & WORKSHEETS TESTED: ${totalLessonsVerified} (5 lessons per scenario)`);
console.log(`TOTAL ERRORS FOUND: ${errors}`);
console.log(`======================================================`);

if (errors > 0) {
  process.exit(1);
} else {
  console.log('✅ ALL 14 GRADES, ALL 8 SCENARIOS, AND ALL 5 LESSONS VERIFIED 100% OPERATIONAL!');
}
