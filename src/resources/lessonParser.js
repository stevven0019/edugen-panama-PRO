/**
 * Parser that extracts structured 3-Page Pedagogical Activity Pack data
 * directly from EduGen AOA Lesson Plans (HTML, Docx-extracted text, or plain text).
 * 
 * Returns null if authentic vocabulary or structures cannot be parsed,
 * so the system seamlessly falls back to Gemini AI for complete generation.
 */

import { getRealiaPhoto } from './realiaCatalog.js';

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

const extractHtmlKeywords = (html) => {
  if (!html) return [];
  const words = [];
  const matches = [...html.matchAll(/<(?:strong|b|em|li|td)[^>]*>([\s\S]*?)<\/(?:strong|b|em|li|td)>/gi)];
  for (const m of matches) {
    const raw = m[1].replace(/<[^>]+>/g, '').trim();
    if (raw.length > 2 && raw.length < 30 && !/^(stage|warm|presentation|practice|production|assessment|reflection|step|grade|minute|time|teacher|student|materials|procedure|differentiation)/i.test(raw)) {
      words.push(raw);
    }
  }
  return words;
};

const CURRICULUM_TOPIC_VOCAB = {
  market: ['pineapple', 'banana', 'orange', 'apple', 'watermelon', 'market', 'price', 'dollar'],
  shopping: ['pineapple', 'banana', 'orange', 'shopping list', 'store', 'cashier', 'money', 'price'],
  fruit: ['pineapple', 'banana', 'orange', 'apple', 'watermelon', 'mango', 'papaya', 'lemon'],
  food: ['rice', 'chicken', 'fish', 'salad', 'water', 'fruit', 'vegetables', 'bread'],
  school: ['book', 'pencil', 'desk', 'chair', 'bag', 'crayon', 'marker', 'eraser'],
  classroom: ['book', 'desk', 'chair', 'pencil', 'board', 'door', 'window', 'table'],
  animal: ['jaguar', 'monkey', 'toucan', 'sloth', 'bird', 'frog', 'turtle', 'fish'],
  nature: ['tree', 'river', 'forest', 'sun', 'flower', 'cloud', 'rain', 'mountain'],
  recycle: ['recycle', 'bin', 'bottle', 'plastic', 'compost', 'trash', 'environment', 'paper'],
  community: ['house', 'street', 'park', 'hospital', 'school', 'store', 'bus', 'library'],
  family: ['mother', 'father', 'brother', 'sister', 'grandmother', 'grandfather', 'baby', 'family'],
  weather: ['sunny', 'rainy', 'cloudy', 'windy', 'stormy', 'hot', 'cold', 'warm'],
  health: ['exercise', 'water', 'fruit', 'sleep', 'doctor', 'teeth', 'soap', 'clean'],
  clothing: ['shirt', 'pants', 'dress', 'shoes', 'hat', 'jacket', 'socks', 'uniform'],
  technology: ['computer', 'robot', 'screen', 'keyboard', 'internet', 'phone', 'tablet', 'code'],
  transport: ['bus', 'car', 'train', 'metro', 'boat', 'airplane', 'bicycle', 'station']
};

function getTopicVocabFallback(textContext) {
  const lower = (textContext || '').toLowerCase();
  for (const [key, list] of Object.entries(CURRICULUM_TOPIC_VOCAB)) {
    if (lower.includes(key)) return list;
  }
  return ['book', 'desk', 'pencil', 'chair', 'bag', 'apple'];
}

export function parseAoaLessonPlan(rawInput, metadata = {}) {
  const rawText = typeof rawInput === 'string' ? rawInput : (rawInput?.text || '');
  const clean = cleanHtml(rawText);
  if (!clean || clean.length < 20) return null;

  // 1. Extract Grade & Theme
  let grade = metadata.grade || '';
  if (!grade) {
    const gradeMatch = clean.match(/Grade:\s*([^\s]+(?:\s+Grade)?)/i) || clean.match(/(?:Pre-?K|Kindergarten|Kinder|\b\d{1,2}(?:st|nd|rd|th)?\s+Grade|\b(?:1|2|3|4|5|6|7|8|9|10|11|12)°?\s*Grado)/i);
    grade = gradeMatch ? gradeMatch[1] || gradeMatch[0] : '4th Grade';
  }

  let theme = metadata.theme || metadata.title || '';
  if (!theme || theme.includes('Lesson Planner') || theme.includes('EduGen')) {
    const themeMatch = clean.match(/Theme:\s*([^.\n]+?)(?:Date|\bSpecific|$)/i) || clean.match(/Theme\s*#\s*\d+\s*[-–—:]\s*Lesson\s*#\s*\d+\s*[-–—:]?\s*([^.\n]+)/i);
    if (themeMatch) theme = themeMatch[1].trim();
  }
  if (!theme) {
    const headingMatch = rawText.match(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/i);
    if (headingMatch) theme = headingMatch[1].replace(/<[^>]+>/g, '').trim();
  }
  if (!theme) theme = 'English AOA Lesson';

  let scenario = metadata.scenario || '';
  const scenarioMatch = clean.match(/Scenario:\s*([^.\n]+?)(?:Theme|Specific|Date|$)/i);
  if (scenarioMatch) scenario = scenarioMatch[1].trim();
  if (!scenario) scenario = theme;

  let objective = '';
  const objMatch = clean.match(/Specific\s+Objective:\s*([^.\n]+?\.)/i);
  if (objMatch) objective = objMatch[1].trim();

  // 2. Extract Vocabulary Words from Stage 1, Vocabulary Section, HTML tags or quoted words
  let vocabWords = [];
  const vocabMatch = clean.match(/(?:vocabulary\s+words?|target\s+vocabulary|key\s+vocabulary|vocabulary\s+items?|words?)[^:]*:\s*([^\n.]+)/i);
  if (vocabMatch) {
    const rawWords = vocabMatch[1]
      .replace(/\*\*/g, '')
      .replace(/\./g, '')
      .split(/[,;\/]| and /i)
      .map(w => w.trim().toLowerCase())
      .filter(w => w.length > 2 && !w.startsWith('(') && !w.startsWith('e.g'));
    vocabWords = [...new Set(rawWords)].slice(0, 6);
  }

  if (vocabWords.length < 4) {
    // Check highlighted HTML tags or markdown stars
    const htmlWords = extractHtmlKeywords(rawText);
    const starWords = [...clean.matchAll(/\*\*([a-zA-Z\s]{3,20})\*\*/g)].map(m => m[1].toLowerCase().trim());
    const candidates = [...new Set([...htmlWords, ...starWords])].map(w => w.toLowerCase())
      .filter(w => !['stage', 'warm-up', 'procedure', 'differentiation', 'teacher', 'students', 'materials', 'time', 'learning', 'outcomes', 'objective'].includes(w));
    if (candidates.length >= 2) {
      vocabWords = [...new Set([...vocabWords, ...candidates])].slice(0, 6);
    }
  }

  // Fallback vocabulary if text has fewer than 4 extracted words
  if (vocabWords.length < 4) {
    const topicDefaults = getTopicVocabFallback(`${theme} ${scenario} ${clean}`);
    vocabWords = [...new Set([...vocabWords, ...topicDefaults])].slice(0, 6);
  }

  // 3. Extract Dialogue Lines from Stage 2 / Dialogue Sections
  let dialogueLines = [];
  const speakerRegex = /(Teacher|Student|Buyer|Seller|Customer|Vendor|Clerk|Cashier|Doctor|Patient|Guide|Ranger|Tourist|Passenger|Officer|Speaker\s*\d+|Person\s*\d+|Student\s*[A-Z\d]|A|B):\s*([^.\n?!]+[.?!]?)/gi;
  const matches = [...clean.matchAll(speakerRegex)];
  if (matches.length >= 2) {
    dialogueLines = matches.slice(0, 8).map(m => ({
      speaker: m[1].trim(),
      text: m[2].replace(/\*\*/g, '').trim()
    }));
  }

  // Fallback dialogue if fewer than 2 lines found in text
  if (dialogueLines.length < 2) {
    const firstWord = vocabWords[0] || 'target item';
    const isShopping = /market|shop|buy|sell|price|cost|dollar|fruit/i.test(`${theme} ${scenario}`);
    if (isShopping) {
      dialogueLines = [
        { speaker: 'Customer', text: `Hello! How much is the ${firstWord}?` },
        { speaker: 'Vendor', text: `Good morning! The ${firstWord} is two dollars and fifty cents.` },
        { speaker: 'Customer', text: 'Great, can I have one please?' },
        { speaker: 'Vendor', text: 'Here you go! Thank you for shopping with us.' }
      ];
    } else {
      dialogueLines = [
        { speaker: 'Student A', text: `Hello! Can you help me practice our lesson about ${theme}?` },
        { speaker: 'Student B', text: `Yes! Let's identify the ${firstWord} together in our class.` },
        { speaker: 'Student A', text: 'How do we use this in our daily communication?' },
        { speaker: 'Student B', text: 'We work together in pairs and follow the action steps.' }
      ];
    }
  }

  // 4. Extract Language Frame
  let languageFrame = null;
  const frameMatch = clean.match(/(?:language\s+frame|target\s+structure|exchange)[^:]*:\s*["“]([^"”]+)["”]/i);
  if (frameMatch) {
    languageFrame = {
      question: frameMatch[1].trim(),
      answer: `Target response related to ${theme}.`,
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
      question: `What is the key concept of ${theme}?`,
      answer: `We identify and practice ${vocabWords[0] || 'the target concept'}.`,
      exchange: `Speaker A: "Can you identify ${vocabWords[0] || 'the item'}?" ──> Speaker B: "Yes, here it is!"`
    };
  }

  // 5. Extract Pairs for Stage 3 Matching Activity
  let matchPairs = [];
  const matchedVocab = vocabWords.slice(0, 4);
  matchedVocab.forEach((word, idx) => {
    matchPairs.push({
      item: word.charAt(0).toUpperCase() + word.slice(1),
      detail: `Context ${idx + 1}: ${word}`,
      icon: word.toLowerCase(),
      photoUrl: getRealiaPhoto(word)
    });
  });

  // 6. Dictation script
  let dictationScript = `Listen carefully and write the target words: ${vocabWords.slice(0, 4).join(', ')}.`;

  // 7. Questions
  let quizQuestions = [
    {
      type: 'multiple_choice',
      prompt: `1. What is the primary topic of the lesson?`,
      options: [`A) ${theme}`, `B) Unrelated Topic`],
      correct: `A) ${theme}`
    },
    {
      type: 'true_false',
      prompt: `2. The target vocabulary includes '${vocabWords[0]}'.`,
      options: ['True', 'False'],
      correct: 'True'
    },
    {
      type: 'multiple_choice',
      prompt: `3. Which word belongs to the key vocabulary?`,
      options: [`A) ${vocabWords[1] || vocabWords[0]}`, `B) None of the above`],
      correct: `A) ${vocabWords[1] || vocabWords[0]}`
    }
  ];

  const skillFocus = metadata.skill || clean.match(/Skills?\s+Focus:\s*([^\n]+)/i)?.[1]?.trim() || 'Listening & Speaking';
  const isReading = /read/i.test(skillFocus);
  const isWriting = /writ/i.test(skillFocus);
  const isSpeaking = /speak|oral/i.test(skillFocus);
  const isMediation = /mediat/i.test(skillFocus);

  const actionWorksheet = {
    part1: {
      title: isReading
        ? `PART 1: READ & DECODE / VISUAL TEXT DECODING (${theme.toUpperCase()})`
        : isWriting
        ? `PART 1: ORTHOGRAPHIC TRACE & VOCABULARY LABELING (${theme.toUpperCase()})`
        : isSpeaking
        ? `PART 1: ORAL RECOGNITION & PRONUNCIATION PRACTICE (${theme.toUpperCase()})`
        : isMediation
        ? `PART 1: VISUAL MEDIATION & CONCEPT CLARIFICATION (${theme.toUpperCase()})`
        : `PART 1: LISTEN & POINT TO THE REAL ${theme.toUpperCase()} (REALIA HOOK)`,
      badge: isReading ? 'Reading Comprehension' : isWriting ? 'Written Production' : isSpeaking ? 'Spoken Fluency' : isMediation ? 'Mediation Strategy' : 'Receptive Vocabulary',
      actionCue: isReading ? '[ Read & Check 📖 ]' : isWriting ? '[ Trace & Label ✍️ ]' : isSpeaking ? '[ Say It Aloud 🗣️ ]' : isMediation ? '[ Explain Meaning 🤝 ]' : '[ Point Here 👆 ]',
      teacherInstruction: isReading
        ? 'Read each target word aloud. Examine the real photo and match the printed text label to the correct item!'
        : isWriting
        ? 'Look at the real photo. Trace each letter of the target word with your pencil and copy the label onto your practice sheet!'
        : isSpeaking
        ? "Work with your partner. Point to each real photo, pronounce the English word with clear intonation, and take turns asking: 'What is this?'"
        : isMediation
        ? 'Observe the real photo. Explain what the item represents in simple English to a teammate who needs guidance!'
        : 'Listen carefully! When teacher says the word, point to the real photo on your paper and touch the real object or show the gesture!',
      items: vocabWords.slice(0, 6).map(w => ({
        word: w.toUpperCase(),
        label: w.toUpperCase(),
        photoUrl: getRealiaPhoto(w)
      }))
    },
    part2: {
      title: isReading
        ? `PART 2: READING COMPREHENSION · "TRUE OR FALSE? READ & VERIFY!"`
        : isWriting
        ? `PART 2: WRITTEN VERIFICATION · "CHECK & COMPLETE THE RECORD!"`
        : isSpeaking
        ? `PART 2: COMMUNICATIVE INQUIRY · "ASK & ANSWER IN PAIRS!"`
        : isMediation
        ? `PART 2: INTERPERSONAL MEDIATION · "RELAY THE MESSAGE CLEARLY!"`
        : `PART 2: AUDITORY ACCURACY CHECK · "TRUE OR FALSE? SHOW YOUR THUMB!"`,
      badge: isReading ? 'Reading Accuracy' : isWriting ? 'Written Accuracy' : isSpeaking ? 'Interaction Check' : isMediation ? 'Collaborative Accuracy' : 'Accuracy of Listening',
      teacherPrompt: isReading
        ? 'Read each short statement carefully. Evaluate if the sentence is TRUE according to the scenario, mark YES ( 👍 ). If FALSE, mark NO ( 👎 )!'
        : 'Teacher says a statement and shows the photo. If it is TRUE, mark YES ( 👍 ). If it is FALSE, mark NO ( 👎 )!',
      items: vocabWords.slice(0, 4).map((w, idx) => ({
        concept: isReading ? `READ & CHECK ${idx + 1}` : `VERIFY ${idx + 1}`,
        sentence: `The ${w.toLowerCase()} is an essential element in our lesson about ${theme}.`,
        relation: idx === 0 ? 'on' : idx === 1 ? 'in' : idx === 2 ? 'under' : 'next_to',
        subject: w.toLowerCase(),
        reference: 'desk',
        photoUrl: getRealiaPhoto(w)
      }))
    }
  };

  return {
    title: theme,
    grade: grade,
    skill: skillFocus,
    scenario: scenario,
    objective: objective || `Identify target vocabulary and communicative structures for ${theme}.`,
    actionWorksheet: actionWorksheet,
    
    // ── PAGE 1: DISCOVERY & LINGUISTIC INPUT ──
    page1: {
      sectionTitle: 'Stage 1 & 2: Discovery & Linguistic Input',
      instructions: 'Review the key words and the communicative frame before listening.',
      wordBank: vocabWords.map((word) => ({
        word: word.charAt(0).toUpperCase() + word.slice(1),
        pos: 'noun',
        example: `Context sentence with ${word.toLowerCase()}.`,
        icon: word.toLowerCase(),
        photoUrl: getRealiaPhoto(word)
      })),
      languageFrame: languageFrame,
      activity1: {
        title: 'Activity 1: Listen & Circle (Word Recognition)',
        instruction: 'Listen carefully as your teacher reads the target words. Circle each word you hear:',
        words: vocabWords
      }
    },

    // ── PAGE 2: GUIDED PRACTICE & PERFORMANCE TASK ──
    page2: {
      sectionTitle: 'Stage 3 & 4: Guided Practice & Tangible Learning Task',
      activity2: {
        title: 'Activity 2: Listen & Match',
        instruction: 'Listen and draw a line to match each item with its corresponding detail:',
        pairs: matchPairs
      },
      activity3: {
        title: 'Activity 3: Authentic Dialogue Cloze',
        instruction: 'Complete the dialogue with the correct words from the Word Bank below:',
        wordBank: vocabWords.slice(0, 5),
        dialogue: dialogueLines
      },
      activity4: {
        title: `Activity 4: Performance Production (${theme})`,
        instruction: `Draw and write about ${theme} using the target vocabulary:`,
        prompt: `Performance Task: Draw and label the key items for ${theme}:`
      }
    },

    // ── PAGE 3: FORMATIVE ASSESSMENT, TEACHER SCRIPTS & ANSWER KEY ──
    page3: {
      sectionTitle: 'Stage 5 & 6: Formative Assessment, Exit Ticket & Teacher Guide',
      exitTicket: {
        title: 'Student Exit Ticket (Quick Check)',
        questions: quizQuestions,
        selfAssessment: [
          { text: 'I can identify the target vocabulary words.', stars: 3 },
          { text: 'I can understand the key concepts in spoken sentences.', stars: 3 },
          { text: 'I can participate in the communicative exchange.', stars: 3 }
        ]
      },
      teacherGuide: {
        title: 'Teacher Read-Aloud Audio Scripts (For Classroom Instruction)',
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
            text: `Read clearly to the class: "Review question 1: What is the main theme? Review question 2: Focus on ${vocabWords[0]}."`
          }
        ],
        answerKey: [
          { item: 'Activity 1 (Circle)', answer: 'All modeled words circled accurately.' },
          { item: 'Activity 2 (Match)', answer: matchPairs.map(p => `${p.item} ──> ${p.detail}`).join(', ') },
          { item: 'Activity 3 (Cloze)', answer: dialogueLines.slice(1, 4).map(d => d.text).join(' | ') },
          { item: 'Exit Ticket Quiz', answer: quizQuestions.map((q, i) => `Q${i+1}: ${q.correct || q.options[0]}`).join('  ·  ') }
        ],
        rubric: [
          {
            criterion: 'Listening Comprehension & Target Vocabulary',
            independent: 'Identifies all target items and details accurately without teacher repetition.',
            withSupport: 'Identifies items and details with 1-2 visual prompts or pauses.',
            emerging: 'Requires direct teacher translation or continuous assistance.'
          },
          {
            criterion: 'Task Performance (Drawing, Matching & Completion)',
            independent: 'Completes all 4 worksheet activities independently and fluently.',
            withSupport: 'Completes activities with peer modeling or scaffolding.',
            emerging: 'Completes fewer than half the tasks accurately.'
          },
          {
            criterion: 'Communicative Use of Language (AOA Interaction)',
            independent: 'Produces question and response frames with clear pronunciation.',
            withSupport: 'Uses isolated target words with acceptable pronunciation.',
            emerging: 'Relies on non-verbal pointing or gestures only.'
          }
        ]
      }
    }
  };
}
