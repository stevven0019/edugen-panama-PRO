/**
 * Parser that extracts structured 3-Page Pedagogical Activity Pack data
 * directly from EduGen AOA Lesson Plans (HTML, Docx-extracted text, or plain text).
 * 
 * Supports Pre-K to 12th Grade · 8 Scenarios · 5 Lessons per Scenario:
 * Lesson 1: Listening
 * Lesson 2: Reading
 * Lesson 3: Speaking
 * Lesson 4: Writing
 * Lesson 5: Mediation (21st Century Skills Project: Theme 1 -> Project 1, Theme 2 -> Project 2)
 */

import { getRealiaPhoto } from './realiaCatalog.js';
import {
  buildLessonContract,
  selectActivityPatterns,
  buildAOABlueprint,
  detectSkillFromText,
  normalizeSkill
} from './activityEngine.js';

export function sanitizeThemeTitle(rawTitle) {
  if (!rawTitle || typeof rawTitle !== 'string') return 'English AOA Lesson';
  let t = rawTitle
    .replace(/^Action Worksheet:\s*/i, '')
    .replace(/["'“”]/g, '')
    .replace(/^Action Worksheet:\s*/i, '')
    .replace(/^Planner\s*(?:AOA\s*)?[-–—:]\s*/i, '')
    .replace(/^Theme\s*#?\s*\d*\s*[-–—:]\s*/i, '')
    .replace(/^Theme\s*#?\s*/i, '')
    .replace(/[-–—:]\s*Lesson\s*#?\s*\d+.*$/i, '')
    .replace(/\(L\d+\)/gi, '')
    .replace(/^EduGen\s*(?:Pro\s*)?(?:AOA\s*)?[:\-–—]?\s*/i, '')
    .trim();
  t = t.replace(/^Planner\s*(?:AOA\s*)?[-–—:]?\s*/i, '')
       .replace(/^Theme\s*#?\s*\d*[-–—:]?\s*/i, '')
       .replace(/^Theme\s*#?\s*/i, '')
       .replace(/^Lesson\s*#?\s*\d*[-–—:]?\s*/i, '')
       .replace(/[-–—:]\s*Lesson\s*#?\s*\d+.*$/i, '')
       .replace(/^[:\-–—\s]+/, '')
       .trim();
  return t || 'English AOA Lesson';
}

const cleanHtml = (html) => {
  if (!html) return '';
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#128221;/g, '📝')
    .replace(/&#128202;/g, '📊')
    .replace(/&#128172;/g, '💬')
    .replace(/\s+/g, ' ')
    .trim();
};

const INVALID_VOCAB_REGEX = /^(?:the\s+teacher|the\s+student|teacher|student|model|models|modeling|describing|asking|explaining|identifying|practicing|evaluating|speaking|writing|reading|listening|stage|warm|warm-up|presentation|practice|production|assessment|reflection|step|grade|minute|time|materials|procedure|differentiation|learning|outcome|objective|check|dialogue|instructions?|rubric|performance|task|essential|target|language|comprehension|production|accuracy|fluency|inquiry|strategy|concept|detail|focus|context|element|statement|question|answer|true|false|yes|no)/i;

const PREPOSITIONS_SET = new Set([
  'in', 'on', 'under', 'next to', 'next_to', 'behind', 'in front of', 'between', 'near', 'over', 'above', 'below', 'at', 'by', 'to', 'from', 'with', 'into', 'onto'
]);

export function isValidVocabWord(word) {
  if (!word || typeof word !== 'string') return false;
  const clean = word.replace(/^[#*_\s]+|[#*_\s]+$/g, '').trim();
  if (clean.length < 2 || clean.length > 22) return false;
  if (clean.split(/\s+/).length > 2) return false;
  if (/[.,;?!:()"'\[\]{}<>\/\\#*]/.test(clean)) return false;
  if (/\d/.test(clean)) return false;
  if (INVALID_VOCAB_REGEX.test(clean)) return false;
  if (/^the\s+/i.test(clean) && clean.split(/\s+/).length > 1) return false;
  if (PREPOSITIONS_SET.has(clean.toLowerCase())) return false;
  return true;
}

const extractHtmlKeywords = (html) => {
  if (!html) return [];
  const words = [];
  const matches = [...html.matchAll(/<(?:strong|b|em|li)[^>]*>([\s\S]*?)<\/(?:strong|b|em|li)>/gi)];
  for (const m of matches) {
    const raw = m[1].replace(/<[^>]+>/g, '').trim().toLowerCase();
    if (isValidVocabWord(raw)) {
      words.push(raw);
    }
  }
  return words;
};

export const CURRICULUM_TOPIC_VOCAB = {
  market: ['pineapple', 'banana', 'orange', 'apple', 'watermelon', 'market', 'price', 'dollar'],
  shopping: ['pineapple', 'banana', 'orange', 'shopping list', 'store', 'cashier', 'money', 'price'],
  fruit: ['pineapple', 'banana', 'orange', 'apple', 'watermelon', 'mango', 'papaya', 'lemon'],
  food: ['rice', 'chicken', 'fish', 'salad', 'water', 'fruit', 'vegetables', 'bread'],
  garden: ['tomato', 'plant', 'flower', 'seed', 'soil', 'water', 'sun', 'leaf'],
  neighborhood: ['park', 'library', 'store', 'school', 'playground', 'street', 'house', 'tree'],
  canal: ['canal', 'ship', 'boat', 'ocean', 'bridge', 'vessel', 'locks', 'goods'],
  beach: ['beach', 'towel', 'sand', 'shell', 'wave', 'picnic', 'sun', 'umbrella'],
  rain: ['puddle', 'umbrella', 'raincoat', 'boots', 'storm', 'cloud', 'sky', 'rain'],
  weather: ['sunny', 'rainy', 'cloudy', 'windy', 'stormy', 'hot', 'cold', 'warm'],
  mola: ['mola', 'fabric', 'color', 'turtle', 'butterfly', 'jaguar', 'art', 'pattern'],
  clothing: ['pollera', 'dress', 'shirt', 'pants', 'shoes', 'hat', 'uniform', 'costume'],
  'where is it': ['red book', 'yellow pencil', 'blue chair', 'desk', 'green bag', 'orange crayon'],
  preposition: ['red book', 'yellow pencil', 'blue chair', 'desk', 'green bag', 'orange crayon'],
  school: ['book', 'pencil', 'chair', 'desk', 'bag', 'crayon'],
  classroom: ['red book', 'yellow pencil', 'blue chair', 'desk', 'green bag', 'orange crayon'],
  animal: ['jaguar', 'monkey', 'toucan', 'sloth', 'bird', 'frog', 'turtle', 'fish'],
  nature: ['tree', 'river', 'forest', 'sun', 'flower', 'cloud', 'rain', 'mountain'],
  recycle: ['recycle', 'bin', 'bottle', 'plastic', 'compost', 'trash', 'environment', 'paper'],
  community: ['house', 'street', 'park', 'hospital', 'school', 'store', 'bus', 'library'],
  family: ['mother', 'father', 'brother', 'sister', 'grandmother', 'grandfather', 'baby', 'family'],
  health: ['exercise', 'water', 'fruit', 'sleep', 'doctor', 'teeth', 'soap', 'clean'],
  technology: ['computer', 'robot', 'screen', 'keyboard', 'internet', 'phone', 'tablet', 'code'],
  transport: ['bus', 'car', 'train', 'metro', 'boat', 'airplane', 'bicycle', 'station'],
  project: ['poster', 'chart', 'guide', 'presentation', 'team', 'display', 'research', 'card']
};

export function getTopicVocabFallback(textContext) {
  const lower = (textContext || '').toLowerCase();
  for (const [key, list] of Object.entries(CURRICULUM_TOPIC_VOCAB)) {
    if (lower.includes(key)) return list;
  }
  return ['book', 'desk', 'pencil', 'chair', 'bag', 'apple'];
}

export function parseAoaLessonPlan(rawInput, metadata = {}) {
  let rawText = typeof rawInput === 'string' ? rawInput : (rawInput?.text || '');
  let clean = cleanHtml(rawText);
  if (!clean || clean.length < 10) {
    if (metadata?.title || metadata?.scenario || metadata?.theme) {
      rawText = `Theme: ${metadata.title || metadata.scenario || metadata.theme}\nGrade: ${metadata.grade || '4th Grade'}\nSkill: ${metadata.skill || 'Listening'}\nScenario: ${metadata.scenario || metadata.title || 'AOA Context'}`;
      clean = cleanHtml(rawText);
    } else {
      return null;
    }
  }

  // 1. Grade Resolution (Strictly avoid /early/ matching Kindergarten!)
  let grade = metadata.grade || '';
  if (!grade) {
    const gradeMatch = clean.match(/Grade:\s*([^\s\n]+(?:\s+Grade)?)/i) ||
      clean.match(/(?:Pre-?K|Kindergarten|Kinder\b|\b\d{1,2}(?:st|nd|rd|th)?\s+Grade|\b(?:1|2|3|4|5|6|7|8|9|10|11|12)°?\s*Grado)/i);
    grade = gradeMatch ? (gradeMatch[1] || gradeMatch[0]).trim() : '4th Grade';
  }

  // 2. Title & Theme Resolution
  let rawTheme = metadata.title || metadata.theme || '';
  if (!rawTheme || rawTheme.includes('Lesson Planner') || rawTheme.includes('EduGen') || rawTheme.includes('Secuencia AOA')) {
    const themeMatch = clean.match(/Theme:\s*([^.\n]+?)(?:Date|\bSpecific|$)/i) ||
      clean.match(/Theme\s*#\s*\d*\s*[-–—:]\s*Lesson\s*#\s*\d*\s*[-–—:]?\s*([^.\n]+)/i);
    if (themeMatch) rawTheme = themeMatch[1].trim();
  }
  if (!rawTheme) {
    const headingMatch = rawText.match(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/i);
    if (headingMatch) rawTheme = headingMatch[1].replace(/<[^>]+>/g, '').trim();
  }
  const cleanTheme = sanitizeThemeTitle(rawTheme || 'English AOA Lesson');

  // 3. Scenario Resolution
  let scenario = metadata.scenario || '';
  if (!scenario) {
    const scenarioMatch = clean.match(/Scenario:\s*([^.\n]+?)(?:Skills?|Theme|Specific|Date|Learning|$)/i);
    if (scenarioMatch) scenario = scenarioMatch[1].trim();
  }
  if (!scenario || scenario.includes('Planner') || scenario.length > 50) {
    scenario = cleanTheme;
  }



  // 4. Authoritative Skill Resolution (generador de actividades.txt)
  // lesson.skill MUST determine the primary activity architecture. NEVER assume lesson number = skill.
  let lessonNum = Number(metadata.lessonNum || metadata.lessonNumber) || null;
  if (!lessonNum) {
    const numMatch = clean.match(/Lesson\s*(?:#|No\.?|Number)?\s*(\d)/i) || rawText.match(/Lesson\s*(?:#|No\.?|Number)?\s*(\d)/i);
    lessonNum = numMatch ? parseInt(numMatch[1], 10) : 1;
  }

  let skillFocus = metadata.skill
    ? normalizeSkill(metadata.skill)
    : (detectSkillFromText(clean) || detectSkillFromText(rawText));

  if (!skillFocus) {
    skillFocus = lessonNum === 2 ? 'Reading'
      : lessonNum === 3 ? 'Speaking'
      : lessonNum === 4 ? 'Writing'
      : lessonNum === 5 ? 'Mediation'
      : 'Listening';
  } else {
    skillFocus = normalizeSkill(skillFocus);
  }

  const isReading = skillFocus === 'Reading';
  const isSpeaking = skillFocus === 'Speaking';
  const isWriting = skillFocus === 'Writing';
  const isMediation = skillFocus === 'Mediation';
  const isListening = skillFocus === 'Listening';

  let objective = metadata.objective || '';
  if (!objective) {
    const objMatch = clean.match(/Specific\s+Objective:\s*([^.\n]+?\.)/i);
    if (objMatch) objective = objMatch[1].trim();
    else objective = `Demonstrate ${skillFocus.toLowerCase()} skills in the context of "${cleanTheme}".`;
  }

  // 5. Authentic Vocabulary Extraction (Filtered Strictly Against Procedural Sentences)
  let vocabWords = [];
  const vocabMatch = clean.match(/(?:vocabulary\s+words?|target\s+vocabulary|key\s+vocabulary|vocabulary\s+items?|words?)[^:]*:\s*([^\n.]+)/i);
  if (vocabMatch) {
    const rawWords = vocabMatch[1]
      .replace(/\*\*/g, '')
      .replace(/\./g, '')
      .split(/[,;\/]| and /i)
      .map(w => w.trim().toLowerCase())
      .filter(w => isValidVocabWord(w));
    vocabWords = [...new Set(rawWords)].slice(0, 6);
  }

  if (vocabWords.length < 4) {
    const htmlWords = extractHtmlKeywords(rawText);
    const starMatches = [...clean.matchAll(/\*\*([a-zA-Z\s]{3,22})\*\*/g)].map(m => m[1].toLowerCase().trim());
    const validStarWords = starMatches.filter(w => isValidVocabWord(w));
    const candidates = [...new Set([...htmlWords, ...validStarWords])];
    if (candidates.length > 0) {
      vocabWords = [...new Set([...vocabWords, ...candidates])].filter(w => isValidVocabWord(w)).slice(0, 6);
    }
  }

  // Fallback to rich authentic scenario vocabulary if fewer than 4 valid words found
  if (vocabWords.length < 4) {
    const topicDefaults = getTopicVocabFallback(`${cleanTheme} ${scenario} ${clean}`);
    vocabWords = [...new Set([...vocabWords, ...topicDefaults])].filter(w => isValidVocabWord(w)).slice(0, 6);
  }

  const isKinderGrade = /(?:^|[^a-z])(?:pre-?k|kindergarten|kinder\b)/i.test(grade);
  const isWhereIsItContext = /where\s*is|preposition/i.test(`${cleanTheme} ${scenario} ${clean}`);

  if (isKinderGrade || isWhereIsItContext) {
    const classroomNouns = new Set(['book', 'pencil', 'chair', 'desk', 'bag', 'crayon', 'ruler', 'eraser', 'notebook']);
    const hasEnoughClassroom = vocabWords.filter(w => classroomNouns.has(w.toLowerCase().replace(/^(?:red|yellow|blue|green|orange|purple)\s+/i, ''))).length >= 4;
    if (!hasEnoughClassroom || vocabWords.length < 6) {
      vocabWords = ['red book', 'yellow pencil', 'blue chair', 'desk', 'green bag', 'orange crayon'];
    }
  }

  // 6. Dialogue Extraction
  let dialogueLines = [];
  const speakerRegex = /(Teacher|Student|Buyer|Seller|Customer|Vendor|Clerk|Cashier|Doctor|Patient|Guide|Ranger|Tourist|Passenger|Officer|Student\s*[A-Z\d]|Partner\s*[A-Z]|Speaker\s*[A-Z\d]|A|B):\s*([^.\n?!]+[.?!]?)/gi;
  const matches = [...clean.matchAll(speakerRegex)];
  if (matches.length >= 2) {
    dialogueLines = matches.slice(0, 8).map(m => ({
      speaker: m[1].trim(),
      text: m[2].replace(/\*\*/g, '').trim()
    }));
  }

  if (dialogueLines.length < 2) {
    const firstWord = vocabWords[0] || 'pineapple';
    const secondWord = vocabWords[1] || 'banana';
    const isShopping = /market|shop|buy|sell|price|cost|dollar|fruit/i.test(`${cleanTheme} ${scenario}`);
    if (isShopping) {
      dialogueLines = [
        { speaker: 'Customer', text: `Hello! How much is the ${firstWord}?` },
        { speaker: 'Vendor', text: `Good morning! The ${firstWord} is two dollars and fifty cents.` },
        { speaker: 'Customer', text: `Can I have one ${firstWord} and two ${secondWord}s, please?` },
        { speaker: 'Vendor', text: 'Here you go! Thank you for shopping with us today.' }
      ];
    } else {
      dialogueLines = [
        { speaker: 'Partner A', text: `Hello! Can you help me practice our lesson about ${cleanTheme}?` },
        { speaker: 'Partner B', text: `Yes! Let's examine the ${firstWord} together in our pair activity.` },
        { speaker: 'Partner A', text: `How do we use the ${secondWord} to communicate clearly?` },
        { speaker: 'Partner B', text: 'We practice the question frame and share our ideas with the class.' }
      ];
    }
  }

  // 7. Language Frame
  let languageFrame = null;
  const frameMatch = clean.match(/(?:language\s+frame|target\s+structure|exchange)[^:]*:\s*["“]([^"”]+)["”]/i);
  if (frameMatch) {
    languageFrame = {
      question: frameMatch[1].trim(),
      answer: `Target response related to ${cleanTheme}.`,
      exchange: `A: "${frameMatch[1].trim()}"`
    };
  } else if (dialogueLines.length >= 2) {
    languageFrame = {
      question: dialogueLines[0].text,
      answer: dialogueLines[1].text,
      exchange: `${dialogueLines[0].speaker}: "${dialogueLines[0].text}" ──> ${dialogueLines[1].speaker}: "${dialogueLines[1].text}"`
    };
  } else {
    languageFrame = {
      question: `What is the key concept of ${cleanTheme}?`,
      answer: `We identify and practice ${vocabWords[0] || 'the target concept'}.`,
      exchange: `Partner A: "Can you identify the ${vocabWords[0] || 'item'}?" ──> Partner B: "Yes, here it is!"`
    };
  }

  // 8. 21st Century Skills Project Context for Lesson 5 (Mediation)
  // Theme 1 develops Project 1; Theme 2 develops Project 2
  const isTheme2 = metadata.themeType === 'productive' || /theme\s*#?\s*2|productive/i.test(clean);
  let project21st = metadata.project21st || '';
  if (!project21st && isMediation) {
    if (metadata.scenarioData?.communicativeCompetences?.assessmentIdeas?.projects) {
      const projs = metadata.scenarioData.communicativeCompetences.assessmentIdeas.projects;
      project21st = isTheme2 ? (projs[1] || projs[0]) : projs[0];
    } else {
      project21st = isTheme2
        ? `Project 2: Comparative Display & Peer Guide — Students work in teams to compare items and mediate findings for ${cleanTheme}.`
        : `Project 1: Collaborative Action Poster — Students create a visual poster to explain key concepts and mediate meaning for ${cleanTheme}.`;
    }
  }

  // 9. Activity Contract, Blueprint & Diversity Patterns (generador de actividades.txt)
  const contract = buildLessonContract({
    lesson: { grade, scenario, theme: cleanTheme, skill: skillFocus, lessonNum, objective, vocabulary: vocabWords },
    theme: cleanTheme,
    scenario,
    grade,
    skill: skillFocus,
    lessonNum,
    themeType: isTheme2 ? 'productive' : 'receptive',
    project21st,
    rawText: clean
  });
  const patterns = selectActivityPatterns(contract);
  const blueprint = buildAOABlueprint(contract);

  // Structured Action Worksheet (Ficha Concreta de Trabajo)
  let part1Title = `PART 1: ${patterns.activity1.pattern.toUpperCase()} (${cleanTheme.toUpperCase()})`;
  let part1Badge = patterns.activity1.badge;
  let part1ActionCue = patterns.activity1.actionCue;
  let part1Instruction = patterns.activity1.instruction;

  let part2Title = `PART 2: ${patterns.activity2.pattern.toUpperCase()}`;
  let part2Badge = patterns.activity2.badge;
  let part2Prompt = patterns.activity2.prompt;

  let part2Items = [];

  if (isSpeaking) {
    if (isKinderGrade || isWhereIsItContext) {
      part1Title = `PART 1: ORAL RECOGNITION & PRONUNCIATION PRACTICE (CLASSROOM OBJECTS)`;
      part1Badge = 'Spoken Fluency';
      part1ActionCue = '[ Say It Aloud 🗣️ ]';
      part1Instruction = "Work with your partner. Point to each real photo, pronounce the English word with clear intonation, and take turns asking: 'What is this?'";

      part2Title = `PART 2: COMMUNICATIVE INQUIRY · "ASK & ANSWER IN PAIRS!"`;
      part2Badge = 'Interaction Check';
      part2Prompt = "Partner A asks the inquiry question. Partner B checks the statement and answers aloud. If answered correctly and fluently, mark YES ( 👍 )!";

      part2Items = [
        {
          concept: 'ON',
          relation: 'on',
          sentence: 'The book is ON the desk.',
          subject: 'book',
          reference: 'desk',
          photoUrl: getRealiaPhoto('book')
        },
        {
          concept: 'UNDER',
          relation: 'under',
          sentence: 'The bag is UNDER the chair.',
          subject: 'bag',
          reference: 'chair',
          photoUrl: getRealiaPhoto('bag')
        },
        {
          concept: 'IN',
          relation: 'in',
          sentence: 'The pencil is IN the bag.',
          subject: 'pencil',
          reference: 'bag',
          photoUrl: getRealiaPhoto('pencil')
        },
        {
          concept: 'NEXT TO',
          relation: 'next_to',
          sentence: 'The crayon is NEXT TO the book.',
          subject: 'crayon',
          reference: 'book',
          photoUrl: getRealiaPhoto('crayon')
        }
      ];
    } else {
      part1Title = `PART 1: ORAL RECOGNITION & PRONUNCIATION PRACTICE (${cleanTheme.toUpperCase()})`;
      part1Badge = 'Spoken Fluency';
      part1ActionCue = '[ Say It Aloud 🗣️ ]';
      part1Instruction = "Work with your partner. Point to each real photo, pronounce the English word with clear intonation, and take turns asking: 'What is this?' / 'How much is it?'";

      part2Title = `PART 2: COMMUNICATIVE INQUIRY · "ASK & ANSWER IN PAIRS!"`;
      part2Badge = 'Interaction Check';
      part2Prompt = "Partner A asks the inquiry question. Partner B checks the statement and answers aloud. If answered correctly and fluently, mark YES ( 👍 )!";

      part2Items = [
        {
          concept: 'INQUIRY 1',
          sentence: `Partner A: "How much is the ${vocabWords[0] || 'pineapple'}?" ──> Partner B: "The fresh ${vocabWords[0] || 'pineapple'} is two dollars and fifty cents."`,
          subject: vocabWords[0] || 'pineapple',
          photoUrl: getRealiaPhoto(vocabWords[0] || 'pineapple')
        },
        {
          concept: 'INQUIRY 2',
          sentence: `Partner A: "How many ${vocabWords[1] || 'banana'}s do you need?" ──> Partner B: "I need four ${vocabWords[1] || 'banana'}s for my family."`,
          subject: vocabWords[1] || 'banana',
          photoUrl: getRealiaPhoto(vocabWords[1] || 'banana')
        },
        {
          concept: 'INQUIRY 3',
          sentence: `Partner A: "Can you identify the ${vocabWords[2] || 'orange'}?" ──> Partner B: "Yes, the ${vocabWords[2] || 'orange'} is fresh and ripe."`,
          subject: vocabWords[2] || 'orange',
          photoUrl: getRealiaPhoto(vocabWords[2] || 'orange')
        },
        {
          concept: 'INQUIRY 4',
          sentence: `Partner A: "What is the price of the ${vocabWords[3] || 'apple'}?" ──> Partner B: "The ${vocabWords[3] || 'apple'} costs one dollar each."`,
          subject: vocabWords[3] || 'apple',
          photoUrl: getRealiaPhoto(vocabWords[3] || 'apple')
        }
      ];
    }
  } else if (isReading) {
    part1Title = `PART 1: READ & DECODE / VISUAL TEXT DECODING (${cleanTheme.toUpperCase()})`;
    part1Badge = 'Reading Comprehension';
    part1ActionCue = '[ Read & Check 📖 ]';
    part1Instruction = 'Read each target word aloud. Examine the real photo and match the printed text label to the correct item!';

    part2Title = `PART 2: READING COMPREHENSION · "TRUE OR FALSE? READ & VERIFY!"`;
    part2Badge = 'Reading Accuracy';
    part2Prompt = 'Read each short statement carefully. Evaluate if the sentence is TRUE according to the scenario, mark YES ( 👍 ). If FALSE, mark NO ( 👎 )!';

    part2Items = [
      {
        concept: 'READ & CHECK 1',
        sentence: `The store sign clearly displays the price of the fresh ${vocabWords[0] || 'pineapple'}.`,
        subject: vocabWords[0] || 'pineapple',
        photoUrl: getRealiaPhoto(vocabWords[0] || 'pineapple')
      },
      {
        concept: 'READ & CHECK 2',
        sentence: `According to our scenario reading, customers can choose the ${vocabWords[1] || 'banana'} at the stand.`,
        subject: vocabWords[1] || 'banana',
        photoUrl: getRealiaPhoto(vocabWords[1] || 'banana')
      },
      {
        concept: 'READ & CHECK 3',
        sentence: `The shopping receipt lists two units of ${vocabWords[2] || 'orange'} purchased today.`,
        subject: vocabWords[2] || 'orange',
        photoUrl: getRealiaPhoto(vocabWords[2] || 'orange')
      },
      {
        concept: 'READ & CHECK 4',
        sentence: `The informational text confirms that ${vocabWords[3] || 'apple'} is available at the market.`,
        subject: vocabWords[3] || 'apple',
        photoUrl: getRealiaPhoto(vocabWords[3] || 'apple')
      }
    ];
  } else if (isWriting) {
    part1Title = `PART 1: ORTHOGRAPHIC TRACE & VOCABULARY LABELING (${cleanTheme.toUpperCase()})`;
    part1Badge = 'Written Production';
    part1ActionCue = '[ Trace & Label ✍️ ]';
    part1Instruction = 'Look at the real photo. Trace each letter of the target word with your pencil and copy the label onto your practice sheet!';

    part2Title = `PART 2: WRITTEN VERIFICATION · "CHECK & COMPLETE THE RECORD!"`;
    part2Badge = 'Written Accuracy';
    part2Prompt = 'Read the statement carefully. Verify the written facts and mark YES ( 👍 ) or NO ( 👎 ) on your report!';

    part2Items = [
      {
        concept: 'WRITING CHECK 1',
        sentence: `Write the correct English name for ${vocabWords[0] || 'item'} on the official inventory record.`,
        subject: vocabWords[0] || 'item',
        photoUrl: getRealiaPhoto(vocabWords[0] || 'item')
      },
      {
        concept: 'WRITING CHECK 2',
        sentence: `The written grocery list includes ${vocabWords[1] || 'item'} with the correct quantity specified.`,
        subject: vocabWords[1] || 'item',
        photoUrl: getRealiaPhoto(vocabWords[1] || 'item')
      },
      {
        concept: 'WRITING CHECK 3',
        sentence: `Complete the sentence by writing the price of the ${vocabWords[2] || 'item'} in words.`,
        subject: vocabWords[2] || 'item',
        photoUrl: getRealiaPhoto(vocabWords[2] || 'item')
      },
      {
        concept: 'WRITING CHECK 4',
        sentence: `Verify the spelling and punctuation of the sentence describing the ${vocabWords[3] || 'item'}.`,
        subject: vocabWords[3] || 'item',
        photoUrl: getRealiaPhoto(vocabWords[3] || 'item')
      }
    ];
  } else if (isMediation) {
    part1Title = `PART 1: 21ST CENTURY PROJECT · TEAM ROLES & MEDIATION (${cleanTheme.toUpperCase()})`;
    part1Badge = '21st Century Skills Project';
    part1ActionCue = '[ Team Collaboration 🤝 ]';
    part1Instruction = `Examine the project elements and team roles. Mediate and explain the goals of our 21st Century Project (${isTheme2 ? 'Project 2' : 'Project 1'}) to your teammates in clear, simple English!`;

    part2Title = `PART 2: PEER MEDIATION & PROJECT VERIFICATION · "CHECK TEAM GOALS!"`;
    part2Badge = 'Collaborative Accuracy';
    part2Prompt = 'Work with your project group. Mediate the instructions in simple English. Verify each project milestone: mark YES ( 👍 ) or NO ( 👎 )!';

    part2Items = [
      {
        concept: 'TEAM ROLE 1',
        sentence: `Role 1 (Leader): Explain the main objective of our ${cleanTheme} project to the group.`,
        subject: vocabWords[0] || 'project',
        photoUrl: getRealiaPhoto(vocabWords[0] || 'project')
      },
      {
        concept: 'TEAM ROLE 2',
        sentence: `Role 2 (Researcher): Clarify and check key vocabulary terms like ${vocabWords[1] || 'market'} for peers.`,
        subject: vocabWords[1] || 'market',
        photoUrl: getRealiaPhoto(vocabWords[1] || 'market')
      },
      {
        concept: 'TEAM ROLE 3',
        sentence: `Role 3 (Designer): Organize visual realia and pictures of ${vocabWords[2] || 'pineapple'} on the display.`,
        subject: vocabWords[2] || 'pineapple',
        photoUrl: getRealiaPhoto(vocabWords[2] || 'pineapple')
      },
      {
        concept: 'TEAM ROLE 4',
        sentence: `Role 4 (Speaker): Mediate and present the team's project deliverable to another group.`,
        subject: vocabWords[3] || 'presentation',
        photoUrl: getRealiaPhoto(vocabWords[3] || 'presentation')
      }
    ];
  } else {
    // Listening default
    part2Items = [
      {
        concept: 'LISTEN & VERIFY 1',
        sentence: `The speaker in the audio dialogue specifically mentioned the fresh ${vocabWords[0] || 'pineapple'}.`,
        subject: vocabWords[0] || 'pineapple',
        photoUrl: getRealiaPhoto(vocabWords[0] || 'pineapple')
      },
      {
        concept: 'LISTEN & VERIFY 2',
        sentence: `We heard the vendor confirm that the ${vocabWords[1] || 'banana'} is ready for purchase.`,
        subject: vocabWords[1] || 'banana',
        photoUrl: getRealiaPhoto(vocabWords[1] || 'banana')
      },
      {
        concept: 'LISTEN & VERIFY 3',
        sentence: `The customer in the recording asked for the price of the ${vocabWords[2] || 'orange'}.`,
        subject: vocabWords[2] || 'orange',
        photoUrl: getRealiaPhoto(vocabWords[2] || 'orange')
      },
      {
        concept: 'LISTEN & VERIFY 4',
        sentence: `The audio prompt instructs the student to identify the ${vocabWords[3] || 'apple'} on the table.`,
        subject: vocabWords[3] || 'apple',
        photoUrl: getRealiaPhoto(vocabWords[3] || 'apple')
      }
    ];
  }

  const actionWorksheet = {
    part1: {
      title: part1Title,
      badge: part1Badge,
      actionCue: part1ActionCue,
      teacherInstruction: part1Instruction,
      items: vocabWords.slice(0, 6).map(w => ({
        word: w.toUpperCase(),
        label: w.toUpperCase(),
        photoUrl: getRealiaPhoto(w)
      }))
    },
    part2: {
      title: part2Title,
      badge: part2Badge,
      teacherPrompt: part2Prompt,
      items: part2Items
    }
  };

  const matchPairs = vocabWords.slice(0, 4).map((word, idx) => ({
    item: word.charAt(0).toUpperCase() + word.slice(1),
    detail: `Context ${idx + 1}: ${word}`,
    icon: word.toLowerCase(),
    photoUrl: getRealiaPhoto(word)
  }));

  const dictationScript = `Listen carefully and write the target words: ${vocabWords.slice(0, 4).join(', ')}.`;

  const quizQuestions = [
    {
      type: 'multiple_choice',
      prompt: `1. What is the primary scenario of the lesson?`,
      options: [`A) ${cleanTheme}`, `B) Unrelated Topic`],
      correct: `A) ${cleanTheme}`
    },
    {
      type: 'true_false',
      prompt: `2. The target vocabulary includes '${vocabWords[0] || 'target item'}'.`,
      options: ['True', 'False'],
      correct: 'True'
    },
    {
      type: 'multiple_choice',
      prompt: `3. Which word belongs to the key scenario vocabulary?`,
      options: [`A) ${vocabWords[1] || vocabWords[0]}`, `B) None of the above`],
      correct: `A) ${vocabWords[1] || vocabWords[0]}`
    }
  ];

  return {
    title: cleanTheme,
    rawTitle: rawTheme,
    grade: grade,
    skill: skillFocus,
    lessonNum: lessonNum,
    scenario: scenario,
    objective: objective,
    project21st: project21st,
    contract: contract,
    stages: blueprint.stages,
    actionWorksheet: actionWorksheet,

    // ── PAGE 1: DISCOVERY & LINGUISTIC INPUT ──
    page1: {
      sectionTitle: `Stage 1 & 2: Discovery & Linguistic Input (${skillFocus})`,
      instructions: `Review the key words and the communicative frame for ${cleanTheme}.`,
      wordBank: vocabWords.map((word) => ({
        word: word.charAt(0).toUpperCase() + word.slice(1),
        pos: 'noun',
        example: `Context sentence with ${word.toLowerCase()}.`,
        icon: word.toLowerCase(),
        photoUrl: getRealiaPhoto(word)
      })),
      languageFrame: languageFrame,
      activity1: {
        title: `Activity 1: ${isSpeaking ? 'Pronounce & Circle' : isWriting ? 'Trace & Identify' : isMediation ? 'Clarify & Circle' : 'Listen & Circle'}`,
        instruction: `Review the target words with your teacher. Circle each word accurately:`,
        words: vocabWords
      }
    },

    // ── PAGE 2: GUIDED PRACTICE & PERFORMANCE TASK ──
    page2: {
      sectionTitle: `Stage 3 & 4: Guided Practice & Tangible Learning Task (${skillFocus})`,
      activity2: {
        title: 'Activity 2: Visual & Concept Matching',
        instruction: 'Draw a line to match each target word with its corresponding detail:',
        pairs: matchPairs
      },
      activity3: {
        title: `Activity 3: Authentic Exchange Cloze (${skillFocus})`,
        instruction: 'Complete the dialogue with the correct words from the Word Bank below:',
        wordBank: vocabWords.slice(0, 5),
        dialogue: dialogueLines
      },
      activity4: {
        title: isMediation
          ? `Activity 4: 21st Century Skills Project Task (${isTheme2 ? 'Project 2' : 'Project 1'})`
          : `Activity 4: Performance Action Task (${cleanTheme})`,
        instruction: isMediation
          ? (project21st || `Collaborate in teams to create the tangible project deliverable for ${cleanTheme}.`)
          : `Apply your ${skillFocus.toLowerCase()} skills to complete the tangible deliverable for ${cleanTheme}:`,
        prompt: isMediation
          ? `Project Deliverable: Work in teams of 3-4. Assign roles (Leader, Researcher, Designer, Speaker) and build your project presentation for ${cleanTheme}.`
          : `Performance Deliverable: Complete your action task using the target language structures.`
      }
    },

    // ── PAGE 3: FORMATIVE ASSESSMENT, TEACHER SCRIPTS & ANSWER KEY ──
    page3: {
      sectionTitle: `Stage 5 & 6: Formative Assessment, Exit Ticket & Teacher Guide (${skillFocus})`,
      exitTicket: {
        title: 'Student Exit Ticket (Quick Check)',
        questions: quizQuestions,
        selfAssessment: [
          { text: `I can identify the target vocabulary words for ${cleanTheme}.`, stars: 3 },
          { text: `I can apply the communicative structures in ${skillFocus.toLowerCase()} tasks.`, stars: 3 },
          { text: isMediation ? 'I can collaborate with my team on the 21st century project.' : 'I can participate in the communicative exchange with peers.', stars: 3 }
        ]
      },
      teacherGuide: {
        title: `Teacher Audio Scripts & Pedagogical Guide (${skillFocus} · Lesson ${lessonNum})`,
        scripts: [
          {
            stage: 'Stage 2 Presentation Audio',
            text: dialogueLines.map(d => `${d.speaker}: "${d.text}"`).join('  ·  ')
          },
          {
            stage: 'Stage 4 Performance Dictation',
            text: dictationScript
          },
          {
            stage: 'Stage 5 Assessment Quiz Script',
            text: `Read clearly to the class: "Question 1: What is the main scenario? Question 2: Focus on ${vocabWords[0] || 'the target concept'}."`
          }
        ],
        answerKey: [
          { item: 'Activity 1 (Circle)', answer: 'All modeled words circled accurately.' },
          { item: 'Activity 2 (Match)', answer: matchPairs.map(p => `${p.item} ──> ${p.detail}`).join(', ') },
          { item: 'Activity 3 (Cloze)', answer: dialogueLines.slice(1, 4).map(d => d.text).join(' | ') },
          { item: 'Exit Ticket Quiz', answer: quizQuestions.map((q, i) => `Q${i + 1}: ${q.correct || q.options[0]}`).join('  ·  ') }
        ],
        rubric: [
          {
            criterion: isMediation ? '21st Century Skills & Peer Mediation' : `${skillFocus} Competence & Target Vocabulary`,
            independent: isMediation
              ? 'Facilitates communication effectively, explains concepts in simple English, and fulfills team role with full autonomy.'
              : 'Demonstrates target communicative competence and vocabulary fluency without teacher prompts.',
            withSupport: isMediation
              ? 'Participates in team project with 1-2 prompts and assists peers using gestures or visual realia.'
              : 'Completes communicative tasks with occasional prompts and repetitions.',
            emerging: isMediation
              ? 'Requires continuous teacher facilitation and direct guidance to participate in team project.'
              : 'Requires direct modeling and continuous assistance.'
          },
          {
            criterion: 'Task Accuracy & Deliverable Quality',
            independent: 'Completes all worksheet activities and the action deliverable with 90-100% accuracy.',
            withSupport: 'Completes activities with peer modeling or scaffolding (70-89% accuracy).',
            emerging: 'Completes fewer than half the tasks accurately.'
          },
          {
            criterion: 'Action-Oriented Communication (AOA Panama)',
            independent: 'Produces appropriate question and response frames with natural intonation and collaborative engagement.',
            withSupport: 'Uses isolated target words with acceptable pronunciation.',
            emerging: 'Relies on non-verbal pointing or gestures only.'
          }
        ]
      }
    }
  };
}
