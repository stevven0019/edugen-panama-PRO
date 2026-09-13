import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { normalizeThemeScenario, missingCurriculumData } from '../src/services/themeCurriculum.js';

const directory = new URL('../public/curriculums/', import.meta.url);
for (const filename of fs.readdirSync(directory).filter(name => name.endsWith('.json'))) {
  const curriculum = JSON.parse(fs.readFileSync(new URL(filename, directory), 'utf8'));
  test(`${filename}: every scenario and both themes use the selected source`, () => {
    for (const raw of curriculum.scenarios) {
      const original = JSON.stringify(raw);
      const projects = raw.assessment_ideas?.twenty_first_century_projects || raw.twenty_first_century_projects ||
        raw.projects || raw.century_21_project_ideas?.projects || raw.communicativeCompetences?.assessmentIdeas?.projects ||
        [raw.twenty_first_century_project];
      for (const [themeType, index] of [['receptive', 0], ['interactive', 1]]) {
        const result = normalizeThemeScenario(raw, themeType);
        if (raw.communicative_competences === null) {
          assert.deepEqual(result.grammar, []);
          assert.deepEqual(result.vocabulary, {});
          assert.deepEqual(result.pragmatic, []);
          assert.deepEqual(result.sociolinguistic, []);
          assert.equal(result.project21stCentury, missingCurriculumData);
          continue;
        }
        assert.ok(result.grammar.length > 0, 'grammar is available');
        assert.ok(Object.keys(result.vocabulary).length > 0, 'vocabulary is available');
        assert.equal(result.scenarioNum, raw.scenarioNum || raw.scenario_number || raw.id);
        assert.equal(result.scenarioName, raw.scenarioName || raw.scenario_title || raw.title);
        if (!filename.includes('Grade_6')) {
          assert.ok(result.pragmatic.length > 0, 'pragmatic competencies are available');
          assert.ok(result.sociolinguistic.length > 0, 'sociolinguistic competencies are available');
        } else {
          assert.deepEqual(result.selectedThemeStandards, raw.themes[index].standards);
        }
        const project = projects[index];
        const expected = project && typeof project === 'object'
          ? [project.title || project.name, project.overview || project.description].filter(Boolean).join('\n') : project;
        assert.equal(result.project21stCentury, expected || missingCurriculumData);
        for (const value of result.grammar) assert.ok(original.includes(JSON.stringify(value)), 'grammar copied from current scenario');
        const nestedVocabulary = raw.communicative_competences?.vocabulary?.linguistic_competences;
        if (nestedVocabulary) assert.deepEqual(result.vocabulary, nestedVocabulary, 'only vocabulary categories in lexical column');
      }
      assert.equal(JSON.stringify(raw), original, 'source JSON is unchanged');
    }
  });
}

test('switching grades or themes does not retain a previous selection', () => {
  const first = normalizeThemeScenario({ id: 1, title: 'First', grammar: ['first'], projects: ['A', 'B'] }, 'receptive');
  const second = normalizeThemeScenario({ id: 2, title: 'Second', grammar: ['second'], projects: ['C', 'D'] }, 'interactive');
  assert.deepEqual(first.grammar, ['first']);
  assert.deepEqual(second.grammar, ['second']);
  assert.equal(second.project21stCentury, 'D');
  assert.equal(normalizeThemeScenario({ projects: ['Only one'] }, 'interactive').project21stCentury, missingCurriculumData);
});
