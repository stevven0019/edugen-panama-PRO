import fs from 'node:fs';
import readline from 'node:readline';

const transcriptPath = 'C:/Users/esteb/.gemini/antigravity-ide/brain/f12e3954-44e0-4515-ade0-11348dca2ccf/.system_generated/logs/transcript_full.jsonl';
const rl = readline.createInterface({
  input: fs.createReadStream(transcriptPath)
});

rl.on('line', (line) => {
  if (line.includes('USER_INPUT') && line.includes('listo... necesito que')) {
    const obj = JSON.parse(line);
    console.log('--- FOUND USER STEP ---');
    console.log('KEYS:', Object.keys(obj));
    for (const k of Object.keys(obj)) {
      if (k !== 'content') console.log(`  ${k}:`, obj[k]);
    }
    // Search content for any file path or data
    const content = obj.content;
    const paths = content.match(/[A-Za-z0-9_\-\/\\]+\.(?:png|jpg|jpeg|webp)/gi);
    console.log('PATHS IN CONTENT:', paths);
  }
});
