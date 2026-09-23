import fs from 'fs';
import assert from 'node:assert/strict';
import { extractScenarioData, linguisticPosterStudioHtml } from '../src/resources/linguisticPosterStudioHtml.js';

const gradeFiles = [
  { grade: 'Pre-K', file: 'English_Curriculum_Prekinder.json' },
  { grade: 'Kinder', file: 'English_Curriculum_Kinder.json' },
  { grade: '1st Grade', file: 'English_Curriculum_Grade_1.json' },
  { grade: '2nd Grade', file: 'English_Curriculum_Grade_2.json' },
  { grade: '3rd Grade', file: 'English_Curriculum_Grade_3.json' },
  { grade: '4th Grade', file: 'English_Curriculum_Grade_4.json' },
  { grade: '5th Grade', file: 'English_Curriculum_Grade_5.json' },
  { grade: '6th Grade', file: 'English_Curriculum_Grade_6.json' },
  { grade: '7th Grade', file: 'English_Curriculum_Grade_7.json' },
  { grade: '8th Grade', file: 'English_Curriculum_Grade_8.json' },
  { grade: '9th Grade', file: 'English_Curriculum_Grade_9.json' },
  { grade: '10th Grade', file: 'English_Curriculum_Grade_10.json' },
  { grade: '11th Grade', file: 'English_Curriculum_Grade_11.json' },
  { grade: '12th Grade', file: 'English_Curriculum_Grade_12.json' }
];

let count = 0;
for (const { grade, file } of gradeFiles) {
  const content = JSON.parse(fs.readFileSync('public/curriculums/' + file, 'utf8'));
  const scenarios = content.scenarios || [];
  assert.equal(scenarios.length, 8, `${grade} should have exactly 8 scenarios`);

  scenarios.forEach((sc, idx) => {
    const data = extractScenarioData(sc, grade, idx, content.proficiency_level);
    assert.ok(data.metadata.scenario_title, `Scenario ${idx+1} in ${grade} must have a title`);
    assert.ok(data.linguistic_competence.nouns.length > 0, `Scenario ${idx+1} in ${grade} must have nouns`);
    assert.ok(data.linguistic_competence.verbs.length > 0, `Scenario ${idx+1} in ${grade} must have verbs`);
    assert.ok(data.linguistic_competence.grammar.length > 0, `Scenario ${idx+1} in ${grade} must have grammar`);

    // Verify Pronunciation and Phonemic Awareness
    assert.ok(data.phonetics, `Scenario ${idx+1} in ${grade} must have phonetics`);
    assert.ok(data.phonetics.pronunciation && data.phonetics.pronunciation.length > 0, `Scenario ${idx+1} in ${grade} must have pronunciation`);
    assert.ok(data.phonetics.phonemic_awareness && data.phonetics.phonemic_awareness.length > 0, `Scenario ${idx+1} in ${grade} must have phonemic awareness`);

    // Verify HTML renders
    const html = linguisticPosterStudioHtml(sc, grade, idx, content.proficiency_level, scenarios);
    assert.ok(html.includes(`Grade: ${grade}`));
    assert.ok(html.includes(`SCENARIO #${data.metadata.scenario_number}`));
    assert.ok(html.includes('Section 5: Pronunciation & Phonemic Awareness'), 'Poster must include Section 5 Phonetics');
    assert.ok(html.includes('poster-pronunciation'), 'Poster must include poster-pronunciation element');
    assert.ok(html.includes('poster-phonemic'), 'Poster must include poster-phonemic element');

    // Specific check for Grade 6 Scenario 3 requested by user
    if (grade === '6th Grade' && idx === 2) {
      assert.ok(data.phonetics.pronunciation.includes('Practice intonation for yes/no questions using modals'), 'G6 Sc3 pronunciation matches user request');
      assert.ok(data.phonetics.phonemic_awareness.includes('Identifying short and long vowel sounds'), 'G6 Sc3 phonemic awareness matches user request');
    }

    count++;
  });
}

console.log(`SUCCESS: All ${count} / 112 posters successfully extracted and verified with authentic Pronunciation & Phonemic Awareness across all 14 grades!`);
