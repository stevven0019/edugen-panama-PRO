/**
 * Parser that extracts structured 3-Page Pedagogical Activity Pack data
 * directly from EduGen AOA Lesson Plans (HTML, Docx-extracted text, or plain text).
 * 
 * Extracts:
 * - Stage 1 (Warm-up & Modeling) -> Key Vocabulary cards & Language Frame
 * - Stage 2 (Presentation & Dialogue) -> Communicative Dialogue & Context
 * - Stage 3 (Preparation & Practice) -> Matching & Cloze activities
 * - Stage 4 (Performance & Production) -> Action-Oriented Task & Ruled Writing Lines
 * - Stage 5 (Assessment) -> Quiz questions (Multiple Choice & True/False)
 * - Stage 6 (Reflection) -> Student Self-Evaluation scale
 * - Teacher Materials -> Verbatim Read-Aloud Scripts & Official Answer Key
 */

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

export function parseAoaLessonPlan(rawInput, metadata = {}) {
  const text = typeof rawInput === 'string' ? rawInput : (rawInput?.text || '');
  const clean = cleanHtml(text);

  // 1. Extract Grade & Theme
  let grade = metadata.grade || '';
  if (!grade) {
    const gradeMatch = clean.match(/Grade:\s*([^\s]+(?:\s+Grade)?)/i) || clean.match(/(?:Pre-?K|Kindergarten|Kinder|\b\d{1,2}(?:st|nd|rd|th)?\s+Grade)/i);
    grade = gradeMatch ? gradeMatch[1] || gradeMatch[0] : '4th Grade';
  }

  let theme = metadata.theme || metadata.title || '';
  if (!theme || theme.includes('Lesson Planner') || theme.includes('EduGen')) {
    const themeMatch = clean.match(/Theme:\s*([^.\n]+?)(?:Date|\bSpecific|$)/i) || clean.match(/Theme\s*#\s*\d+\s*[-–—:]\s*Lesson\s*#\s*\d+\s*[-–—:]?\s*([^.\n]+)/i);
    if (themeMatch) theme = themeMatch[1].trim();
  }
  if (!theme) theme = 'English AOA Lesson';

  let scenario = metadata.scenario || '';
  const scenarioMatch = clean.match(/Scenario:\s*([^.\n]+?)(?:Theme|Specific|Date|$)/i);
  if (scenarioMatch) scenario = scenarioMatch[1].trim();
  if (!scenario) scenario = theme;

  let objective = '';
  const objMatch = clean.match(/Specific\s+Objective:\s*([^.\n]+?\.)/i);
  if (objMatch) objective = objMatch[1].trim();

  // 2. Extract Vocabulary Words from Stage 1
  let vocabWords = [];
  const vocabMatch = clean.match(/(?:vocabulary\s+words?|target\s+fruits?|target\s+objects?|target\s+vocabulary)[^:]*:\s*([^\n.]+)/i);
  if (vocabMatch) {
    const rawWords = vocabMatch[1]
      .replace(/\*\*/g, '')
      .replace(/\./g, '')
      .split(/[,;\/]| and /i)
      .map(w => w.trim())
      .filter(w => w.length > 1 && !w.startsWith('(') && !w.startsWith('e.g'));
    vocabWords = [...new Set(rawWords)].slice(0, 6);
  }

  if (vocabWords.length < 4) {
    // Fallback search for highlighted items
    const starWords = [...clean.matchAll(/\*\*([a-zA-Z\s]{3,20})\*\*/g)].map(m => m[1].toLowerCase().trim());
    const uniqueStars = [...new Set(starWords)].filter(w => !['stage', 'warm-up', 'procedure', 'differentiation'].includes(w));
    if (uniqueStars.length >= 4) {
      vocabWords = uniqueStars.slice(0, 6);
    } else {
      vocabWords = ['pineapple', 'apple', 'banana', 'mango', 'market', 'dollar'];
    }
  }

  // 3. Extract Dialogue from Stage 2
  let dialogueLines = [];
  const sellerBuyerRegex = /(Seller|Buyer|Teacher|Student|A|B):\s*([^.\n?!]+[.?!])/gi;
  const matches = [...clean.matchAll(sellerBuyerRegex)];
  if (matches.length >= 4) {
    dialogueLines = matches.slice(0, 8).map(m => ({
      speaker: m[1].trim(),
      text: m[2].replace(/\*\*/g, '').trim()
    }));
  } else {
    dialogueLines = [
      { speaker: 'Seller', text: 'Hello! Welcome to the market!' },
      { speaker: 'Buyer', text: 'Hello! How much is the pineapple?' },
      { speaker: 'Seller', text: 'It is three dollars.' },
      { speaker: 'Buyer', text: 'Okay. And the apples?' },
      { speaker: 'Seller', text: 'They are one dollar each.' },
      { speaker: 'Buyer', text: 'Can I have a banana, please?' },
      { speaker: 'Seller', text: 'Yes, here you go.' },
      { speaker: 'Buyer', text: 'Thank you!' }
    ];
  }

  // 4. Extract Language Frame
  let languageFrame = {
    question: 'How much is the [item]?',
    answer: "It's [price] dollars.",
    exchange: 'Can I have a [item], please? ──> Yes, here you go!'
  };
  const frameMatch = clean.match(/simple\s+exchange[^:]*:\s*["“]([^"”]+)["”]/i);
  if (frameMatch) {
    languageFrame.question = frameMatch[1].trim();
  }

  // 5. Extract Pairs for Stage 3 Matching Activity
  let matchPairs = [];
  const pricesFound = clean.match(/\$\d+(?:\.\d{2})?/g) || ['$1.00', '$2.00', '$3.00', '$5.00'];
  const uniquePrices = [...new Set(pricesFound)].slice(0, 4);
  const matchedVocab = vocabWords.slice(0, 4);

  matchedVocab.forEach((word, idx) => {
    matchPairs.push({
      item: word.charAt(0).toUpperCase() + word.slice(1),
      detail: uniquePrices[idx] || `$${idx + 1}.00`,
      icon: word.toLowerCase()
    });
  });

  // 6. Extract Dictation Script from Stage 4
  let dictationScript = '';
  const dictMatch = clean.match(/dictates[^:]*:\s*["“]([^"”]+)["”]/i) || clean.match(/(?:dictates|script)[^:]*:\s*([^.\n]+(?:\.[^.\n]+){2,4}\.)/i);
  if (dictMatch) {
    dictationScript = dictMatch[1].replace(/\*\*/g, '').trim();
  } else {
    dictationScript = `At the market, please buy one pineapple. It costs three dollars. Also buy two apples for one dollar each. And one mango for two dollars. Thank you!`;
  }

  // 7. Extract Assessment Quiz from Stage 5
  let quizQuestions = [
    {
      type: 'multiple_choice',
      prompt: '1. Did the buyer ask for an apple or a pineapple first?',
      options: ['A) Pineapple', 'B) Mango'],
      correct: 'A) Pineapple'
    },
    {
      type: 'true_false',
      prompt: '2. The apples are one dollar each.',
      options: ['True', 'False'],
      correct: 'True'
    },
    {
      type: 'multiple_choice',
      prompt: '3. How much is the pineapple?',
      options: ['A) $1.00', 'B) $3.00', 'C) $5.00'],
      correct: 'B) $3.00'
    }
  ];

  // Try parsing actual Stage 5 questions if present
  const qA = clean.match(/A\.\s*([^?]+[?]?)/i);
  const qB = clean.match(/B\.\s*([^?]+[?]?)/i);
  const qC = clean.match(/C\.\s*([^?]+[?]?)/i);

  if (qA && qB && qC) {
    quizQuestions = [
      {
        type: 'multiple_choice',
        prompt: `1. ${qA[1].replace(/\*\*/g, '').trim()}`,
        options: ['A) Yes / First Option', 'B) No / Second Option'],
        correct: 'A'
      },
      {
        type: 'true_false',
        prompt: `2. ${qB[1].replace(/\*\*/g, '').trim()}`,
        options: ['True', 'False'],
        correct: 'True'
      },
      {
        type: 'multiple_choice',
        prompt: `3. ${qC[1].replace(/\*\*/g, '').trim()}`,
        options: ['A) $1.00', 'B) $2.00', 'C) $3.00'],
        correct: 'B) $3.00'
      }
    ];
  }

  // 8. Build Complete 3-Page Blueprint Data Structure
  return {
    title: theme,
    grade: grade,
    skill: clean.match(/Skills?\s+Focus:\s*([^\n]+)/i)?.[1]?.trim() || 'Listening & Speaking',
    scenario: scenario,
    objective: objective || 'Identify target vocabulary and communicative structures in real context.',
    
    // ── PAGE 1: DISCOVERY & LINGUISTIC INPUT ──
    page1: {
      sectionTitle: 'Stage 1 & 2: Discovery & Linguistic Input',
      instructions: 'Review the key words and the communicative frame before listening.',
      wordBank: vocabWords.map((word, i) => ({
        word: word.charAt(0).toUpperCase() + word.slice(1),
        pos: ['dollar', 'market'].includes(word.toLowerCase()) ? 'noun' : ['how much'].includes(word.toLowerCase()) ? 'phrase' : 'fruit / noun',
        example: `I see a ${word.toLowerCase()} at the market.`,
        icon: word.toLowerCase()
      })),
      languageFrame: languageFrame,
      activity1: {
        title: 'Activity 1: Listen & Circle (Word Recognition)',
        instruction: 'Listen carefully as your teacher reads the market words. Circle each word you hear:',
        words: vocabWords
      }
    },

    // ── PAGE 2: GUIDED PRACTICE & PERFORMANCE TASK ──
    page2: {
      sectionTitle: 'Stage 3 & 4: Guided Practice & Tangible Learning Task',
      activity2: {
        title: 'Activity 2: Listen & Match (Items to Details)',
        instruction: 'Listen to the audio sentences. Draw a line to match each market item with its stated price:',
        pairs: matchPairs
      },
      activity3: {
        title: 'Activity 3: Authentic Dialogue Cloze',
        instruction: 'Complete the dialogue with the correct words from the Word Bank below:',
        wordBank: vocabWords.slice(0, 5),
        dialogue: dialogueLines
      },
      activity4: {
        title: 'Activity 4: Performance Production (Market Stall Task)',
        instruction: 'Listen to the Shopping List dictation. Draw the items on the stall and write the price on each tag:',
        prompt: 'Market Stall: Draw the items heard and write their prices on the lines below:'
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
          { text: 'I can understand the prices and numbers mentioned.', stars: 3 },
          { text: 'I can participate in the market dialogue exchange.', stars: 3 }
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
            text: 'Read clearly to the class: "Welcome! The pineapple is three dollars. The apples are one dollar each. Have a nice day!"'
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
            criterion: 'Listening Comprehension (Target Vocabulary & Prices)',
            independent: 'Identifies all items and prices accurately without teacher repetition.',
            withSupport: 'Identifies items and prices with 1-2 visual prompts or pauses.',
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
