import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildAoaFields, curriculumFilename, lessonSkills } from '../src/services/aoaCurriculum.js';

test('all grades, scenarios, themes and skills map to their own source', () => {
  let checked = 0;
  for (const file of fs.readdirSync(new URL('../public/curriculums/', import.meta.url)).filter(f => f.endsWith('.json'))) {
    const data = JSON.parse(fs.readFileSync(new URL('../public/curriculums/' + file, import.meta.url)));
    for (const raw of data.scenarios) for (const type of ['receptive', 'interactive']) for (const skill of lessonSkills) {
      const fields = buildAoaFields(raw, type, [skill]);
      assert.equal(fields.scenario, raw.scenarioName || raw.scenario_title || raw.title);
      const selectedTheme = type === 'receptive' ? (raw.theme1 || raw.themes?.[0]) : (raw.theme2 || raw.themes?.[1]);
      const expectedTheme = typeof selectedTheme === 'string' ? selectedTheme : selectedTheme?.theme_title || selectedTheme?.title || '';
      assert.equal(fields.theme, expectedTheme, 'missing themes must not borrow another theme');
      assert.ok(!Object.values(fields).some(value => value.includes('[object Object]')));
      if (fields.specificObjective) assert.ok(fields.specificObjective.startsWith(skill + ':'));
      if (fields.learningOutcome) assert.ok(fields.learningOutcome.startsWith(skill + ':'));
      checked++;
    }
  }
  assert.equal(checked, 1120);
});
test('standard selection honors skill and theme; overrides can be based on returned plain strings', () => {
  const raw = { title: 'Source', themes: ['One','Two'], standardsAndLearningOutcomes: {
    listening: {specificStandards:{receptive:'Hear A',interactive:'Respond B'},learningOutcomes:['Hear outcome']},
    writing: {specificStandards:{receptive:'Write A',interactive:'Write B'},learningOutcomes:['Write outcome']}
  }};
  assert.equal(buildAoaFields(raw,'receptive',['Listening']).specificObjective,'Listening: Hear A');
  const next=buildAoaFields(raw,'interactive',['Writing']);
  assert.equal(next.theme,'Two');
  assert.equal(next.specificObjective,'Writing: Write B');
  assert.equal(next.learningOutcome,'Writing: Write outcome');
  assert.equal(buildAoaFields({title:'Empty',themes:['A','B']},'receptive',['Listening']).specificObjective,'');
});
test('grade file mapping includes preschool and rejects invalid grades', () => {
  assert.equal(curriculumFilename('Pre-K'),'English_Curriculum_Prekinder.json');
  assert.equal(curriculumFilename('Kinder'),'English_Curriculum_Kinder.json');
  assert.equal(curriculumFilename('12th Grade'),'English_Curriculum_Grade_12.json');
  assert.throws(()=>curriculumFilename('13th Grade'));
});
