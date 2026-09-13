const asList = value => value == null || value === '' ? [] : (Array.isArray(value) ? value : [value]);
export const missingCurriculumData = 'Not specified in the selected curriculum for this theme.';

// Normalize only the selected scenario; never borrow content from another grade.
export function normalizeThemeScenario(raw, themeType) {
  const index = themeType === 'receptive' ? 0 : 1;
  const cc = raw.communicative_competences || raw.communicativeCompetences || {};
  const linguistic = cc.linguistic_competences || cc.linguistic || {};
  const vocabContainer = cc.vocabulary || {};
  const vocabulary = linguistic.recommended_vocabulary || linguistic.vocabulary ||
    vocabContainer.linguistic_competences || raw.recommended_vocabulary || raw.vocabulary ||
    raw.vocabulary_focus || cc.vocabulary || {};
  const grammar = linguistic.recommended_grammatical_features || linguistic.grammatical_features ||
    linguistic.grammaticalFeatures || cc.grammatical_features || raw.grammar ||
    raw.grammar_focus || (Array.isArray(raw.linguistic_competences) ? raw.linguistic_competences : []);
  const pragmatic = cc.pragmatic_competences || cc.pragmatic?.functions || cc.pragmatic ||
    vocabContainer.pragmatic_competences || raw.pragmatic_competences || raw.pragmatic;
  const socio = cc.sociolinguistic_competences || cc.sociolinguistic?.elements || cc.sociolinguistic ||
    vocabContainer.sociolinguistic_competences || raw.sociolinguistic_competences || raw.sociolinguistic;
  const pronunciation = linguistic.pronunciation_and_phonemic_awareness || linguistic.pronunciation ||
    vocabContainer.pronunciation_and_phonemic_awareness || {
      ...(raw.pronunciation ? { pronunciation: raw.pronunciation } : {}),
      ...(raw.phonemic_awareness ? { phonemic_awareness: raw.phonemic_awareness } : {})
    };
  const projects = raw.assessment_ideas?.twenty_first_century_projects ||
    raw.twenty_first_century_projects || raw.projects || raw.century_21_project_ideas?.projects ||
    cc.assessmentIdeas?.projects;
  const singleProject = raw.twenty_first_century_project || raw.project21stCentury || linguistic.project21stCentury;
  const project = Array.isArray(projects) ? projects[index] : asList(singleProject)[index];
  const projectText = project && typeof project === 'object'
    ? [project.title || project.name, project.overview || project.description].filter(Boolean).join('\n')
    : project;
  const themeTitle = theme => typeof theme === 'string' ? theme : theme?.theme_title || theme?.title || '';
  return {
    ...raw,
    scenarioNum: raw.scenarioNum || raw.scenario_number || raw.id,
    scenarioName: raw.scenarioName || raw.scenario_title || raw.title || '',
    theme1: raw.theme1 || themeTitle(raw.themes?.[0]),
    theme2: raw.theme2 || themeTitle(raw.themes?.[1]),
    grammar: asList(grammar),
    vocabulary: Array.isArray(vocabulary) ? { vocabulary } : vocabulary,
    pragmatic: asList(pragmatic),
    sociolinguistic: asList(socio),
    pronunciation,
    selectedThemeStandards: raw.themes?.[index]?.standards || [],
    project21stCentury: projectText || missingCurriculumData
  };
}
