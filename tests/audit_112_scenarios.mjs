import fs from 'fs';
import path from 'path';
import { getScenarioOfficialNouns } from '../src/resources/lessonParser.js';
import { getRealiaPhoto } from '../src/resources/realiaCatalog.js';

const curriculumsDir = path.resolve('public', 'curriculums');
const files = fs.readdirSync(curriculumsDir).filter(f => f.endsWith('.json'));

let totalNouns = 0;
let missing = [];
let foundCount = 0;
let scenariosWithoutNouns = [];

for (const file of files) {
  const content = JSON.parse(fs.readFileSync(path.join(curriculumsDir, file), 'utf-8'));
  for (const sc of content.scenarios || []) {
    const title = sc.title || sc.scenario_title || sc.scenarioName || 'Unnamed';
    const nouns = getScenarioOfficialNouns(sc);
    if (!nouns || nouns.length === 0) {
      scenariosWithoutNouns.push(`${file} -> ${title}`);
      continue;
    }
    for (const w of nouns) {
      totalNouns++;
      const photo = getRealiaPhoto(w);
      if (!photo) {
        missing.push({ word: w, sc: title, file });
      } else {
        foundCount++;
      }
    }
  }
}

console.log('Total scenarios scanned across 14 files');
console.log('Scenarios where getScenarioOfficialNouns found nouns:', 112 - scenariosWithoutNouns.length);
console.log('Scenarios without nouns extracted:', scenariosWithoutNouns.length);
if (scenariosWithoutNouns.length > 0) {
  console.log('Examples of scenarios without nouns:', scenariosWithoutNouns.slice(0, 10));
}
console.log('Total nouns scanned:', totalNouns);
console.log('Nouns with photo found:', foundCount);
console.log('Missing photo count:', missing.length);
const uniqueMissing = [...new Set(missing.map(m => m.word))];
console.log('Unique missing words count:', uniqueMissing.length);
console.log('Missing words list (first 100):', uniqueMissing.sort().slice(0, 100));
