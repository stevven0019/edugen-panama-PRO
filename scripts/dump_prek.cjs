const fs = require('fs');
const d = JSON.parse(fs.readFileSync('public/curriculums/English_Curriculum_Prekinder.json', 'utf8'));
d.scenarios.forEach((s) => {
  console.log(`\n=== SCENARIO ${s.id}: ${s.title} ===`);
  console.log('Themes:', s.themes.join(' | '));
  console.log('Vocabulary:', s.recommended_vocabulary);
  console.log('Linguistic Competences:', s.linguistic_competences);
  console.log('Phonics:', s.phonemic_awareness || s.pronunciation);
});
