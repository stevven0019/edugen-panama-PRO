import { normalizeThemeScenario } from './themeCurriculum.js';

export const lessonSkills = ['Listening', 'Reading', 'Speaking', 'Writing', 'Mediation'];
export function curriculumFilename(grade) {
  if (grade === 'Pre-K') return 'English_Curriculum_Prekinder.json';
  if (grade === 'Kinder') return 'English_Curriculum_Kinder.json';
  const number = Number(grade.match(/^([0-9]+)/)?.[1]);
  if (number < 1 || number > 12 || !number) throw new Error('Grado no válido.');
  return 'English_Curriculum_Grade_' + number + '.json';
}
function text(value) {
  if (value == null) return '';
  if (Array.isArray(value)) return value.map(text).filter(Boolean).join('\n');
  if (typeof value === 'object') return Object.entries(value).map(([key, item]) => key + ': ' + text(item)).join('\n');
  return String(value);
}
function focused(value, themeType) {
  if (value && !Array.isArray(value) && typeof value === 'object' && value[themeType]) return text(value[themeType]);
  return text(value);
}
export function buildAoaFields(raw, themeType, skills) {
  const normalized = normalizeThemeScenario(raw, themeType);
  const standards = raw.standards_and_learning_outcomes || raw.standardsAndLearningOutcomes;
  const objectives = [], outcomes = [];
  for (const skill of skills) {
    const key = skill.toLowerCase();
    const entry = (Array.isArray(standards) ? standards.find(item => item.skill?.toLowerCase() === key) : standards?.[key]) || raw[key];
    let objective = focused(entry?.specific_standards || entry?.specificStandards || entry?.specific_standard, themeType);
    if (!objective && normalized.selectedThemeStandards?.length) {
      const patterns = { Listening: /listen/i, Reading: /read/i, Speaking: /speak|oral|describe|ask|interview|present|report/i, Writing: /writ/i, Mediation: /mediat|summar|relay|explain/i };
      objective = normalized.selectedThemeStandards.filter(item => patterns[skill]?.test(item)).join('\n');
    }
    if (objective) objectives.push(skill + ': ' + objective);
    const outcome = text(entry?.learning_outcomes || entry?.learningOutcomes);
    if (outcome) outcomes.push(skill + ': ' + outcome);
  }
  const sections = [
    ['Grammar', normalized.grammar], ['Vocabulary', normalized.vocabulary],
    ['Pronunciation', normalized.pronunciation], ['Pragmatic', normalized.pragmatic],
    ['Sociolinguistic', normalized.sociolinguistic]
  ].map(([label, value]) => text(value) ? label + ':\n' + text(value) : '').filter(Boolean);
  return {
    scenario: normalized.scenarioName,
    theme: themeType === 'receptive' ? normalized.theme1 : normalized.theme2,
    communicativeComp: sections.join('\n\n'),
    specificObjective: objectives.join('\n\n'),
    learningOutcome: outcomes.join('\n\n'),
    project21st: normalized.project21stCentury
  };
}
