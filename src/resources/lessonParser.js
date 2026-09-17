/**
 * Parser that extracts structured 3-Page Pedagogical Activity Pack data
 * directly from EduGen AOA Lesson Plans (HTML, Docx-extracted text, or plain text).
 * 
 * Returns null if authentic vocabulary or structures cannot be parsed,
 * so the system seamlessly falls back to Gemini AI for complete generation.
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
  if (!clean || clean.length < 50) return null;

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

  // 2. Extract Vocabulary Words from Stage 1 or Vocabulary Section
  let vocabWords = [];
  const vocabMatch = clean.match(/(?:vocabulary\s+words?|target\s+vocabulary|key\s+vocabulary|vocabulary\s+items?|words?)[^:]*:\s*([^\n.]+)/i);
  if (vocabMatch) {
    const rawWords = vocabMatch[1]
      .replace(/\*\*/g, '')
      .replace(/\./g, '')
      .split(/[,;\/]| and /i)
      .map(w => w.trim())
      .filter(w => w.length > 2 && !w.startsWith('(') && !w.startsWith('e.g'));
    vocabWords = [...new Set(rawWords)].slice(0, 6);
  }

  if (vocabWords.length < 4) {
    // Search for bolded keywords in Stage 1 / Warm-up
    const stage1Snippet = clean.match(/Stage\s*1[\s\S]*?(?=Stage\s*2|$)/i)?.[0] || '';
    if (stage1Snippet) {
      const starWords = [...stage1Snippet.matchAll(/\*\*([a-zA-Z\s]{3,20})\*\*/g)].map(m => m[1].toLowerCase().trim());
      const filtered = [...new Set(starWords)].filter(w => !['stage', 'warm-up', 'procedure', 'differentiation', 'teacher', 'students', 'materials', 'time'].includes(w));
      if (filtered.length >= 4) {
        vocabWords = filtered.slice(0, 6);
      }
    }
  }

  // If we could not extract genuine, theme-specific vocabulary, DO NOT guess or fallback to fruit/market.
  // Return null so Gemini AI generates authentic activities!
  if (vocabWords.length < 4) {
    return null;
  }

  // 3. Extract Dialogue Lines from Stage 2
  let dialogueLines = [];
  const speakerRegex = /(Teacher|Student|A|B|Guide|Ranger|Speaker\s*1|Speaker\s*2|Person\s*1|Person\s*2):\s*([^.\n?!]+[.?!])/gi;
  const matches = [...clean.matchAll(speakerRegex)];
  if (matches.length >= 4) {
    dialogueLines = matches.slice(0, 8).map(m => ({
      speaker: m[1].trim(),
      text: m[2].replace(/\*\*/g, '').trim()
    }));
  }

  // If dialogue could not be extracted from text, let AI handle it
  if (dialogueLines.length < 3) {
    return null;
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
  } else {
    // Try to find Q&A in dialogue
    if (dialogueLines.length >= 2) {
      languageFrame = {
        question: dialogueLines[0].text,
        answer: dialogueLines[1].text,
        exchange: `${dialogueLines[0].speaker}: "${dialogueLines[0].text}" ──> ${dialogueLines[1].speaker}: "${dialogueLines[1].text}"`
      };
    }
  }

  if (!languageFrame) {
    return null;
  }

  // 5. Extract Pairs for Stage 3 Matching Activity
  let matchPairs = [];
  const matchedVocab = vocabWords.slice(0, 4);
  matchedVocab.forEach((word, idx) => {
    matchPairs.push({
      item: word.charAt(0).toUpperCase() + word.slice(1),
      detail: `Context ${idx + 1}: ${word}`,
      icon: word.toLowerCase()
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

  return {
    title: theme,
    grade: grade,
    skill: clean.match(/Skills?\s+Focus:\s*([^\n]+)/i)?.[1]?.trim() || 'Listening & Speaking',
    scenario: scenario,
    objective: objective || `Identify target vocabulary and communicative structures for ${theme}.`,
    
    // ── PAGE 1: DISCOVERY & LINGUISTIC INPUT ──
    page1: {
      sectionTitle: 'Stage 1 & 2: Discovery & Linguistic Input',
      instructions: 'Review the key words and the communicative frame before listening.',
      wordBank: vocabWords.map((word) => ({
        word: word.charAt(0).toUpperCase() + word.slice(1),
        pos: 'noun',
        example: `Context sentence with ${word.toLowerCase()}.`,
        icon: word.toLowerCase()
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
