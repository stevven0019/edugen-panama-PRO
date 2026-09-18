import fs from 'node:fs';
import path from 'node:path';

const files = fs.readdirSync('public/curriculums').filter((f) => f.endsWith('.json') && f.startsWith('English_Curriculum_'));
let grandTotal = 0;
const nounsMap = new Map();

for (const file of files) {
  const data = JSON.parse(fs.readFileSync('public/curriculums/' + file, 'utf8'));
  const grade = data.grade || data.gradeLevel || file;
  let gradeNouns = 0;
  for (const [idx, sc] of (data.scenarios || []).entries()) {
    const vocabSource =
      sc.communicative_competences?.vocabulary?.linguistic_competences ||
      sc.communicativeCompetences?.vocabulary?.linguisticCompetences ||
      sc.communicativeCompetences?.linguistic?.vocabulary ||
      sc.recommended_vocabulary ||
      sc.communicative_competences?.linguistic_competences?.recommended_vocabulary ||
      sc.communicative_competences?.vocabulary ||
      sc.communicative_competences?.linguistic?.vocabulary ||
      sc.vocabulary ||
      {};

    let raw = vocabSource.nouns || vocabSource.noun || [];
    if (typeof raw === 'string') raw = raw.split(',').map((s) => s.trim()).filter(Boolean);
    if (Array.isArray(raw)) {
      for (const n of raw) {
        const clean = n.toLowerCase().trim().replace(/['"()]/g, '');
        if (clean) {
          gradeNouns++;
          if (!nounsMap.has(clean)) nounsMap.set(clean, 0);
          nounsMap.set(clean, nounsMap.get(clean) + 1);
        }
      }
    }
  }
  console.log(`${file} (${grade}): ${gradeNouns} nouns`);
  grandTotal += gradeNouns;
}
console.log('---------------------------------------------');
console.log(`Total raw occurrences across all 14 files: ${grandTotal}`);
console.log(`Total UNIQUE nouns: ${nounsMap.size}`);
