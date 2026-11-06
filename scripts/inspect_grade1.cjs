const fs = require('fs');
const d = JSON.parse(fs.readFileSync('public/curriculums/English_Curriculum_Grade_1.json', 'utf8'));

d.scenarios.forEach((s) => {
  console.log(`\n======================================================`);
  console.log(`SCENARIO ${s.scenario_number}: ${s.scenario_title}`);
  console.log(`Themes:`, s.themes.map(t => `Theme ${t.theme_number}: ${t.theme_title}`).join(' | '));
  const cc = s.communicative_competences || {};
  const ling = cc.linguistic || {};
  const vocab = ling.vocabulary || {};
  console.log(`Nouns:`, vocab.nouns);
  console.log(`Adjectives:`, vocab.adjectives);
  console.log(`Verbs:`, vocab.verbs);
  console.log(`Grammar:`, ling.grammatical_features);
  console.log(`Phonics:`, ling.pronunciation_and_phonemic_awareness);
});
