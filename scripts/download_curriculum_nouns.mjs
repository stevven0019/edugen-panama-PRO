#!/usr/bin/env node
/**
 * ==============================================================================
 * EduGen Panama - Curriculum Nouns Image Downloader
 * ==============================================================================
 * Automatically scans all 14 curriculum JSON files (Pre-K to 12th Grade,
 * 112 scenarios total), extracts all unique nouns from the linguistic competences
 * and recommended vocabulary, searches Google/Bing/Wikimedia/Openverse for
 * authentic transparent PNG images, and downloads them named after each noun.
 *
 * Saves to:
 *   public/assets/nouns/{noun}.png
 *   public/assets/nouns/manifest.json
 *
 * Usage:
 *   node scripts/download_curriculum_nouns.mjs
 *   node scripts/download_curriculum_nouns.mjs --limit 10
 *   node scripts/download_curriculum_nouns.mjs --grade 4
 *   node scripts/download_curriculum_nouns.mjs --grade 12 --scenario 4
 *   node scripts/download_curriculum_nouns.mjs --delay 800
 *   node scripts/download_curriculum_nouns.mjs --dry-run
 *   node scripts/download_curriculum_nouns.mjs --force
 * ==============================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const CURRICULUM_DIR = path.join(ROOT_DIR, 'public', 'curriculums');
const OUTPUT_DIR = path.join(ROOT_DIR, 'public', 'assets', 'nouns');
const MANIFEST_PATH = path.join(OUTPUT_DIR, 'manifest.json');

// --- Helper: Parse CLI Arguments ---
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    limit: null,
    grade: null,
    scenario: null,
    delay: 600,
    force: false,
    dryRun: false,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--force' || arg === '-f') options.force = true;
    else if (arg === '--dry-run' || arg === '-d') options.dryRun = true;
    else if (arg === '--limit' || arg === '-l') options.limit = parseInt(args[++i], 10);
    else if (arg === '--grade' || arg === '-g') options.grade = args[++i];
    else if (arg === '--scenario' || arg === '-s') options.scenario = parseInt(args[++i], 10);
    else if (arg === '--delay') options.delay = parseInt(args[++i], 10);
  }

  return options;
}

// --- Helper: Sanitize Noun to Clean Filename ---
export function sanitizeNoun(noun) {
  if (!noun || typeof noun !== 'string') return '';
  return noun
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/['"“”‘’()[\],;:]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

// --- Helper: Verify PNG Signature ---
function isValidPng(buffer) {
  if (!buffer || buffer.length < 8) return false;
  // PNG signature: 89 50 4E 47 0D 0A 1A 0A
  return (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  );
}

// --- Helper: Sleep ---
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Step 1: Scan All Curriculum JSONs and Collect Nouns ---
export function extractAllCurriculumNouns(filterGrade = null, filterScenario = null) {
  if (!fs.existsSync(CURRICULUM_DIR)) {
    throw new Error(`Curriculum directory not found at: ${CURRICULUM_DIR}`);
  }

  const files = fs.readdirSync(CURRICULUM_DIR).filter((f) => f.endsWith('.json') && f.startsWith('English_Curriculum_'));
  const nounsMap = new Map();

  for (const file of files) {
    const filePath = path.join(CURRICULUM_DIR, file);
    let data;
    try {
      data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      console.warn(`[WARN] Could not parse ${file}: ${e.message}`);
      continue;
    }

    // Resolve Grade Label
    let gradeStr = String(data.grade || data.gradeLevel || '').trim();
    if (!gradeStr) {
      const match = file.match(/Grade_(\d+)/i) || file.match(/Kinder/i) || file.match(/Prekinder/i);
      if (match) gradeStr = match[1] ? `Grade ${match[1]}` : match[0];
      else gradeStr = file;
    }

    // Check grade filter if provided
    if (filterGrade !== null) {
      const target = String(filterGrade).toLowerCase().replace(/^(grade|gr)\s*/, '');
      const current = gradeStr.toLowerCase().replace(/^(grade|gr)\s*/, '');
      const fileLower = file.toLowerCase();

      const match =
        current === target ||
        current.includes(target) ||
        fileLower.includes(`grade_${target}`) ||
        fileLower.includes(target);
      if (!match) continue;
    }

    const scenarios = data.scenarios || [];
    scenarios.forEach((sc, idx) => {
      const scenarioNumber = sc.id || sc.scenarioNum || sc.scenarioNumber || sc.number || idx + 1;
      if (filterScenario !== null && scenarioNumber !== filterScenario) {
        return;
      }

      // Comprehensive vocab source resolution across all 14 curriculum formats
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

      let rawNouns = vocabSource.nouns || vocabSource.noun || [];
      if (typeof rawNouns === 'string') {
        rawNouns = rawNouns.split(',').map((s) => s.trim()).filter(Boolean);
      } else if (!Array.isArray(rawNouns)) {
        rawNouns = [];
      }

      // Also inspect linguistic_competences for parenthetical examples if nouns empty
      if (rawNouns.length === 0 && Array.isArray(sc.linguistic_competences)) {
        for (const comp of sc.linguistic_competences) {
          const match = comp.match(/e\.g\.,?\s*"([^"]+)"/i);
          if (match) {
            const words = match[1].split(/\s+/).filter((w) => w.length > 3);
            rawNouns.push(...words.slice(0, 3));
          }
        }
      }

      const scenarioTitle = sc.title || sc.scenarioName || sc.name || `Scenario ${scenarioNumber}`;

      for (const item of rawNouns) {
        const nounText = String(item).trim();
        const key = sanitizeNoun(nounText);
        if (!key) continue;

        if (!nounsMap.has(key)) {
          nounsMap.set(key, {
            noun: nounText,
            filename: `${key}.png`,
            key,
            occurrences: []
          });
        }

        nounsMap.get(key).occurrences.push({
          grade: gradeStr,
          scenarioId: scenarioNumber,
          scenarioTitle
        });
      }
    });
  }

  return Array.from(nounsMap.values());
}

// --- Step 2: Contextual Disambiguation & Multi-Engine Image Search ---

export const CONTEXTUAL_SEARCH_OVERRIDES = {
  bat: (occ) => 'baseball bat sports equipment wooden aluminum',
  baseball_bat: () => 'baseball bat sports equipment wooden aluminum',
  current: (occ) => occ?.some((o) => /canal|river|water|ocean|beach/i.test(o.scenarioTitle))
    ? 'water flow river current canal stream wave'
    : 'electric current circuit electricity power',
  water_current: () => 'water flow river current canal stream wave',
  fan: (occ) => occ?.some((o) => /famous|panamanian|celebrity|music|sport|talent/i.test(o.scenarioTitle))
    ? 'cheering sports fans crowd supporters spectator'
    : 'electric cooling desk fan ventilator appliance',
  sports_fan: () => 'cheering sports fans crowd supporters spectator',
  fair: (occ) => 'school community fair carnival booths festival',
  community_fair: () => 'school community fair carnival booths festival',
  spot: (occ) => 'scenic peaceful nature park quiet spot relaxation',
  nature_spot: () => 'scenic peaceful nature park quiet spot relaxation',
  quiet_spot: () => 'scenic peaceful nature park quiet spot relaxation',
  plant: (occ) => occ?.some((o) => /energy|electric|renewable|power/i.test(o.scenarioTitle))
    ? 'clean renewable energy power plant electricity facility'
    : 'green botanical plant leaves garden flower',
  power_plant: () => 'clean renewable energy power plant electricity facility',
  ruler: () => 'measuring ruler school classroom stationer tool',
  board: () => 'classroom blackboard chalkboard green whiteboard',
  chest: (occ) => occ?.some((o) => /body|health|doctor/i.test(o.scenarioTitle))
    ? 'human chest torso medical anatomy'
    : 'treasure chest wooden pirate gold',
  bark: (occ) => occ?.some((o) => /tree|nature|forest/i.test(o.scenarioTitle))
    ? 'tree bark texture wood brown'
    : 'dog barking sound puppy',
  wave: (occ) => occ?.some((o) => /beach|ocean|sea|canal|water/i.test(o.scenarioTitle))
    ? 'ocean sea wave water blue crest'
    : 'hand waving friendly greeting gesture',
  nail: (occ) => occ?.some((o) => /tool|hardware|wood|construction/i.test(o.scenarioTitle))
    ? 'steel iron nail construction hardware tool'
    : 'human fingernail hand hygiene'
};

export function buildContextualSearchQuery(noun, occurrences = []) {
  const clean = sanitizeNoun(noun);
  if (CONTEXTUAL_SEARCH_OVERRIDES[clean]) {
    return CONTEXTUAL_SEARCH_OVERRIDES[clean](occurrences);
  }

  // If word has scenario occurrences, use scenario keywords to give context
  if (occurrences && occurrences.length > 0) {
    const titles = occurrences.map((o) => o.scenarioTitle || '').join(' ').toLowerCase();
    if (/sport|outdoor|game|fun|baseball|soccer/i.test(titles) && !clean.includes('sport')) {
      return `${clean} sports equipment`;
    }
    if (/school|classroom|student|study/i.test(titles) && !clean.includes('school')) {
      return `${clean} classroom school supplies`;
    }
    if (/nature|wildlife|animal|forest|marine|canal/i.test(titles) && !clean.includes('nature')) {
      return `${clean} nature outdoor`;
    }
  }

  return clean;
}

/**
 * Engine 1: Web Image Search (Direct high-res transparent PNGs)
 */
async function searchWebTransparentPng(noun, contextualQuery = '') {
  try {
    const effectiveQuery = contextualQuery || noun;
    const query = `${effectiveQuery} transparent png clipart`;
    const searchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&qft=+filterui:photo-transparent`;
    const res = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      signal: AbortSignal.timeout(6000)
    });

    if (!res.ok) return [];
    const html = await res.text();
    // Extract media urls
    const matches = [...html.matchAll(/murl&quot;:&quot;([^&]+?\.(?:png|PNG)[^&]*?)&quot;/g)].map((m) => m[1]);
    return matches.slice(0, 5);
  } catch {
    return [];
  }
}

/**
 * Engine 2: Wikimedia Commons API (Educational, Public Domain & Creative Commons PNGs)
 */
async function searchWikimediaCommonsPng(noun, contextualQuery = '') {
  try {
    const effectiveQuery = contextualQuery || noun;
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
      effectiveQuery + ' png'
    )}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url|mime|thumburl&iiurlwidth=600&format=json`;

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'EduGenCurriculumDownloader/1.0 (info@edugen.pa)'
      },
      signal: AbortSignal.timeout(6000)
    });

    if (!res.ok) return [];
    const data = await res.json();
    const pages = Object.values(data.query?.pages || {});
    const urls = [];

    for (const p of pages) {
      const info = p.imageinfo?.[0];
      if (!info) continue;
      // Prefer direct PNG or SVG rendered thumbnail (which is a crisp transparent PNG)
      if (info.mime === 'image/png' || info.url?.toLowerCase().endsWith('.png')) {
        urls.push(info.thumburl || info.url);
      } else if (info.mime === 'image/svg+xml' && info.thumburl) {
        urls.push(info.thumburl);
      }
    }
    return urls;
  } catch {
    return [];
  }
}

/**
 * Engine 3: Openverse API (Creative Commons Open Access Images)
 */
async function searchOpenversePng(noun, contextualQuery = '') {
  try {
    const effectiveQuery = contextualQuery || noun;
    const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(effectiveQuery)}&extension=png&page_size=5`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'EduGenCurriculumDownloader/1.0 (info@edugen.pa)'
      },
      signal: AbortSignal.timeout(6000)
    });

    if (!res.ok) return [];
    const data = await res.json();
    const results = data.results || [];
    return results.map((r) => r.url).filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * Try to download image buffer from a candidate URL and verify it is a valid PNG
 */
async function downloadAndValidate(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'image/png,image/*;q=0.8'
      },
      signal: AbortSignal.timeout(8000)
    });

    if (!res.ok) return null;
    const arrayBuf = await res.arrayBuffer();
    const buf = Buffer.from(arrayBuf);

    if (isValidPng(buf)) {
      return buf;
    }
  } catch {
    // try next candidate
  }
  return null;
}

/**
 * Search and download a PNG for a single noun using multi-engine fallback with linguistic context
 */
async function fetchNounPng(noun, occurrences = []) {
  const contextualQuery = buildContextualSearchQuery(noun, occurrences);
  const candidateUrls = [];

  // 1. Web Transparent PNG search with context
  const webUrls = await searchWebTransparentPng(noun, contextualQuery);
  candidateUrls.push(...webUrls);

  // 2. Wikimedia Commons File search with context
  const wikiUrls = await searchWikimediaCommonsPng(noun, contextualQuery);
  candidateUrls.push(...wikiUrls);

  // 3. Openverse Search with context
  if (candidateUrls.length < 3) {
    const openverseUrls = await searchOpenversePng(noun, contextualQuery);
    candidateUrls.push(...openverseUrls);
  }

  // Deduplicate URLs
  const uniqueUrls = Array.from(new Set(candidateUrls));

  // Try downloading candidate URLs in order until a valid PNG is obtained
  for (const url of uniqueUrls) {
    const buf = await downloadAndValidate(url);
    if (buf) {
      return { buffer: buf, sourceUrl: url, contextualQuery };
    }
  }

  return null;
}

// --- Step 3: Main Execution Flow ---
export async function main() {
  const options = parseArgs();

  if (options.help) {
    console.log(`
EduGen Panama - Curriculum Nouns Image Downloader
=================================================
Scans all 14 curriculum files (112 scenarios) and downloads transparent PNG images
for each unique noun, saving them to public/assets/nouns/{noun}.png.

Options:
  --limit, -l <N>       Limit the number of nouns to process in this run
  --grade, -g <grade>   Filter by grade (e.g., 4, 12, kinder, "Pre-K")
  --scenario, -s <num>  Filter by scenario number (1 to 8)
  --delay <ms>          Delay between downloads in milliseconds (default: 600ms)
  --force, -f           Re-download even if the file already exists
  --dry-run, -d         Preview nouns without downloading
  --help, -h            Show this help message
`);
    return;
  }

  console.log('🔍 Scanning curriculum JSON files in public/curriculums/...');
  const allNouns = extractAllCurriculumNouns(options.grade, options.scenario);

  console.log(`📋 Found ${allNouns.length} unique nouns in target curriculum selection.`);
  if (options.grade) console.log(`   (Filtered by grade: ${options.grade})`);
  if (options.scenario) console.log(`   (Filtered by scenario: ${options.scenario})`);

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Load existing manifest if present
  let manifest = {};
  if (fs.existsSync(MANIFEST_PATH)) {
    try {
      manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    } catch {
      manifest = {};
    }
  }

  const targetList = options.limit ? allNouns.slice(0, options.limit) : allNouns;

  if (options.dryRun) {
    console.log('\n--- DRY RUN PREVIEW ---');
    targetList.forEach((item, idx) => {
      const dest = path.join(OUTPUT_DIR, item.filename);
      const exists = fs.existsSync(dest);
      console.log(`[${idx + 1}/${targetList.length}] "${item.noun}" -> ${item.filename} (Status: ${exists ? 'EXISTS' : 'PENDING'})`);
    });
    console.log(`\nDry run completed. Processed ${targetList.length} nouns.`);
    return;
  }

  let downloadedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;
  const startTime = Date.now();

  console.log(`\n🚀 Starting download pipeline for ${targetList.length} nouns...`);
  console.log(`📁 Destination: ${OUTPUT_DIR}\n`);

  for (let i = 0; i < targetList.length; i++) {
    const item = targetList[i];
    const destPath = path.join(OUTPUT_DIR, item.filename);
    const exists = fs.existsSync(destPath) && fs.statSync(destPath).size > 0;

    // Check if already downloaded
    if (exists && !options.force) {
      skippedCount++;
      const sizeKb = (fs.statSync(destPath).size / 1024).toFixed(1);
      console.log(`[${i + 1}/${targetList.length}] ⏭️  Skipped (already exists): "${item.noun}" -> ${item.filename} (${sizeKb} KB)`);

      // Ensure manifest record exists
      manifest[item.key] = {
        noun: item.noun,
        filename: item.filename,
        path: `/assets/nouns/${item.filename}`,
        grades: Array.from(new Set(item.occurrences.map((o) => o.grade))),
        scenarios: item.occurrences.map((o) => ({ grade: o.grade, scenario: o.scenarioId, title: o.scenarioTitle })),
        downloaded: true,
        sizeBytes: fs.statSync(destPath).size,
        updatedAt: manifest[item.key]?.updatedAt || new Date().toISOString()
      };
      continue;
    }

    process.stdout.write(`[${i + 1}/${targetList.length}] 🌐 Searching & Downloading: "${item.noun}"... `);

    try {
      const result = await fetchNounPng(item.noun, item.occurrences);

      if (result && result.buffer) {
        fs.writeFileSync(destPath, result.buffer);
        const sizeKb = (result.buffer.length / 1024).toFixed(1);
        downloadedCount++;
        console.log(`✅ OK (${sizeKb} KB) -> ${item.filename}`);

        manifest[item.key] = {
          noun: item.noun,
          filename: item.filename,
          path: `/assets/nouns/${item.filename}`,
          grades: Array.from(new Set(item.occurrences.map((o) => o.grade))),
          scenarios: item.occurrences.map((o) => ({ grade: o.grade, scenario: o.scenarioId, title: o.scenarioTitle })),
          downloaded: true,
          sizeBytes: result.buffer.length,
          sourceUrl: result.sourceUrl,
          updatedAt: new Date().toISOString()
        };
      } else {
        failedCount++;
        console.log(`❌ Not found (no valid PNG returned)`);
        manifest[item.key] = {
          noun: item.noun,
          filename: item.filename,
          grades: Array.from(new Set(item.occurrences.map((o) => o.grade))),
          downloaded: false,
          updatedAt: new Date().toISOString()
        };
      }
    } catch (err) {
      failedCount++;
      console.log(`❌ Error: ${err.message}`);
    }

    // Save manifest periodically every 10 downloads or at end
    if ((i + 1) % 10 === 0 || i === targetList.length - 1) {
      fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
    }

    // Polite delay between requests
    if (i < targetList.length - 1 && options.delay > 0) {
      await sleep(options.delay);
    }
  }

  // Final manifest save
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`
=================================================
🎉 DOWNLOAD BATCH COMPLETED in ${elapsed}s
=================================================
✅ Newly Downloaded: ${downloadedCount}
⏭️  Skipped (Existing): ${skippedCount}
❌ Failed / Not Found: ${failedCount}
📦 Total Target Nouns: ${targetList.length}
📄 Manifest Updated:  ${MANIFEST_PATH}
=================================================
`);
}

// Execute if run directly from CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error('Fatal error in download script:', err);
    process.exit(1);
  });
}
