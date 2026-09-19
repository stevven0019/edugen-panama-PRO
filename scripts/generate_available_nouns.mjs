import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const NOUNS_DIR = path.join(ROOT_DIR, 'public', 'assets', 'nouns');
const TARGET_FILE = path.join(ROOT_DIR, 'src', 'resources', 'availableNouns.js');

const files = fs
  .readdirSync(NOUNS_DIR)
  .filter(f => f.endsWith('.png'))
  .map(f => f.replace('.png', ''))
  .sort();

const content = `// Auto-generated set of all available curriculum noun PNG assets in /assets/nouns/
// Total assets: ${files.length}

export const AVAILABLE_NOUNS = new Set(${JSON.stringify(files, null, 2)});

/**
 * Returns true if a noun image exists in /assets/nouns/
 */
export function hasNounImage(noun) {
  if (!noun || typeof noun !== 'string') return false;
  const clean = noun
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  if (AVAILABLE_NOUNS.has(clean)) return true;
  const singular = clean.replace(/s$/, '');
  if (AVAILABLE_NOUNS.has(singular)) return true;
  const plural = clean + 's';
  if (AVAILABLE_NOUNS.has(plural)) return true;
  return false;
}

/**
 * Returns the exact public asset path (e.g. /assets/nouns/umbrella.png) or null
 */
export function getNounImagePath(noun) {
  if (!noun || typeof noun !== 'string') return null;
  const clean = noun
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  if (AVAILABLE_NOUNS.has(clean)) return \`/assets/nouns/\${clean}.png\`;
  const singular = clean.replace(/s$/, '');
  if (AVAILABLE_NOUNS.has(singular)) return \`/assets/nouns/\${singular}.png\`;
  const plural = clean + 's';
  if (AVAILABLE_NOUNS.has(plural)) return \`/assets/nouns/\${plural}.png\`;
  return null;
}
`;

fs.writeFileSync(TARGET_FILE, content, 'utf8');
console.log(`Successfully generated ${TARGET_FILE} with ${files.length} nouns!`);
