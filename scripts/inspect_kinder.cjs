const fs = require('fs');
const d = JSON.parse(fs.readFileSync('public/curriculums/English_Curriculum_Kinder.json', 'utf8'));

d.scenarios.forEach((s) => {
  console.log(`\n======================================================`);
  console.log(`SCENARIO ${s.scenario_number}: ${s.scenario_title}`);
  console.log(`Themes:`, s.themes.map(t => `Theme ${t.theme_number}: ${t.theme_title}`).join(' | '));
  const cc = s.communicative_competences || {};
  const ling = cc.linguistic_competences || {};
  const vocab = ling.recommended_vocabulary || {};
  console.log(`Vocabulary Nouns:`, vocab.nouns);
  console.log(`Vocabulary Verbs:`, vocab.verbs);
  console.log(`Vocabulary Adjectives:`, vocab.adjectives);
  console.log(`Grammar:`, ling.recommended_grammatical_features);
  const phon = ling.pronunciation_and_phonemic_awareness || {};
  console.log(`Phonics raw:`, phon);
});
