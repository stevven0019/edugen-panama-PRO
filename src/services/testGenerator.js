// EDUGEN PRO · AOA MEDUCA TEST & ASSESSMENT ENGINE
// Generador oficial de pruebas formativas, sumativas, quizzes y rúbricas de desempeño
// Compatible con los 14 grados escolares (Pre-K a 12°), todos los escenarios curriculares
// y enfocado rigurosamente en las 5 macro-habilidades AOA:
// 1. Listening · 2. Reading · 3. Writing · 4. Speaking · 5. Mediation (CEFR 2020)

import { getIllustrationSvg } from '../resources/illustrations.js';
import { getRealiaPhoto } from '../resources/realiaCatalog.js';

export const GRADES_LIST = [
  { id: 'prek', name: 'Pre-K', label: 'Pre-K (Pre-A1 Receptivo / TPR)', cefr: 'Pre-A1', file: 'English_Curriculum_Prekinder.json', time: '30 min' },
  { id: 'kinder', name: 'Kinder', label: 'Kínder (Pre-A1 Receptivo / TPR)', cefr: 'Pre-A1', file: 'English_Curriculum_Kinder.json', time: '35 min' },
  { id: '1st', name: '1st Grade', label: '1° Grado (Pre-A1 / A1.1)', cefr: 'A1.1', file: 'English_Curriculum_Grade_1.json', time: '40 min' },
  { id: '2nd', name: '2nd Grade', label: '2° Grado (A1.1)', cefr: 'A1.1', file: 'English_Curriculum_Grade_2.json', time: '40 min' },
  { id: '3rd', name: '3rd Grade', label: '3° Grado (A1)', cefr: 'A1', file: 'English_Curriculum_Grade_3.json', time: '45 min' },
  { id: '4th', name: '4th Grade', label: '4° Grado (A1)', cefr: 'A1', file: 'English_Curriculum_Grade_4.json', time: '45 min' },
  { id: '5th', name: '5th Grade', label: '5° Grado (A1+)', cefr: 'A1+', file: 'English_Curriculum_Grade_5.json', time: '45 min' },
  { id: '6th', name: '6th Grade', label: '6° Grado (A1+)', cefr: 'A1+', file: 'English_Curriculum_Grade_6.json', time: '45 min' },
  { id: '7th', name: '7th Grade', label: '7° Grado (A2)', cefr: 'A2', file: 'English_Curriculum_Grade_7.json', time: '50 min' },
  { id: '8th', name: '8th Grade', label: '8° Grado (A2)', cefr: 'A2', file: 'English_Curriculum_Grade_8.json', time: '50 min' },
  { id: '9th', name: '9th Grade', label: '9° Grado (A2+)', cefr: 'A2+', file: 'English_Curriculum_Grade_9.json', time: '50 min' },
  { id: '10th', name: '10th Grade', label: '10° Grado (B1)', cefr: 'B1', file: 'English_Curriculum_Grade_10.json', time: '55 min' },
  { id: '11th', name: '11th Grade', label: '11° Grado (B1)', cefr: 'B1', file: 'English_Curriculum_Grade_11.json', time: '55 min' },
  { id: '12th', name: '12th Grade', label: '12° Grado (B1+)', cefr: 'B1+', file: 'English_Curriculum_Grade_12.json', time: '60 min' }
];

export const SKILLS_LIST = [
  { id: 'all', num: 0, label: 'All Skills — Evaluación Integral (5 Macro-Skills)', short: 'Integral' },
  { id: 'Listening', num: 1, label: '1 — Listening (Comprensión Auditiva & Discriminación)', short: 'Listening' },
  { id: 'Reading', num: 2, label: '2 — Reading (Alfabetización Visual & Comprensión Lectora)', short: 'Reading' },
  { id: 'Speaking', num: 3, label: '3 — Speaking (Interacción Oral & Acción Social)', short: 'Speaking' },
  { id: 'Writing', num: 4, label: '4 — Writing (Producción Escrita & Decodificación)', short: 'Writing' },
  { id: 'Mediation', num: 5, label: '5 — Mediation (Mediación Interpersonal & Lingüística CEFR 2020)', short: 'Mediation' }
];

export function getGradeMeta(gradeStr) {
  const clean = String(gradeStr || '').toLowerCase().trim();
  const found = GRADES_LIST.find(g => 
    clean.includes(g.id) || 
    clean.includes(g.name.toLowerCase()) || 
    (g.name === '1st Grade' && /1°|primer/i.test(clean)) ||
    (g.name === '2nd Grade' && /2°|segund/i.test(clean)) ||
    (g.name === '3rd Grade' && /3°|tercer/i.test(clean)) ||
    (g.name === '4th Grade' && /4°|cuart/i.test(clean)) ||
    (g.name === '5th Grade' && /5°|quint/i.test(clean)) ||
    (g.name === '6th Grade' && /6°|sext/i.test(clean)) ||
    (g.name === '7th Grade' && /7°|s[eé]ptim/i.test(clean)) ||
    (g.name === '8th Grade' && /8°|octav/i.test(clean)) ||
    (g.name === '9th Grade' && /9°|noven/i.test(clean)) ||
    (g.name === '10th Grade' && /10°|d[eé]cim/i.test(clean)) ||
    (g.name === '11th Grade' && /11°|und[eé]cim/i.test(clean)) ||
    (g.name === '12th Grade' && /12°|duod[eé]cim/i.test(clean)) ||
    (g.name === 'Kinder' && /kinder/i.test(clean)) ||
    (g.name === 'Pre-K' && /pre-?k/i.test(clean))
  );
  return found || GRADES_LIST[5]; // default 4th grade
}

export function extractCleanWords(vocabInput) {
  if (!vocabInput) return [];
  if (Array.isArray(vocabInput)) {
    return vocabInput
      .map(w => typeof w === 'string' ? w.replace(/['"()]/g, '').trim() : '')
      .filter(w => w && w.length > 1);
  }
  if (typeof vocabInput === 'string') {
    return vocabInput
      .split(/[,;\n•]+/)
      .map(w => w.replace(/['"()]/g, '').trim())
      .filter(w => w && w.length > 1);
  }
  return [];
}

/**
 * Generate assessment focusing on all 5 Macro-Skills (Listening, Reading, Writing, Speaking, Mediation)
 */
export function generateAssessmentTest({
  grade = '4th Grade',
  scenario = 'Shopping at the Market',
  theme = 'How Much Is the Pineapple?',
  skillFocus = 'all', // 'all' | 'Listening' | 'Reading' | 'Speaking' | 'Writing' | 'Mediation'
  cefr = 'A1',
  nouns = [],
  verbs = [],
  adjectives = [],
  interrogatives = '',
  numbers = '1 to 100 (USD / Balboas)',
  dialogueText = '',
  testType = 'formative', // 'formative' (20 pts) | 'summative' (30 pts) | 'quiz' (10 pts) | 'action_rubric'
  testScale = 'meduca', // 'meduca' | 'points' | 'percentage'
  includeAudioScript = true,
  includeRubric = true
}) {
  const gradeMeta = getGradeMeta(grade);
  const isEarlyChildhood = gradeMeta.cefr.startsWith('Pre-A1');
  const isPrimary = gradeMeta.cefr.startsWith('A1');
  const isPreMedia = gradeMeta.cefr.startsWith('A2');
  const isMedia = gradeMeta.cefr.startsWith('B1');

  const cleanNouns = extractCleanWords(nouns);
  const cleanVerbs = extractCleanWords(verbs);
  const cleanAdj = extractCleanWords(adjectives);

  const sampleNouns = cleanNouns.length >= 4 ? cleanNouns : 
    (isEarlyChildhood 
      ? ['book', 'desk', 'chair', 'bag', 'pencil', 'crayon']
      : ['pineapple', 'apple', 'banana', 'watermelon', 'mango', 'market', 'dollar']);
  
  const sampleVerbs = cleanVerbs.length >= 2 ? cleanVerbs : 
    (isEarlyChildhood ? ['look', 'put', 'point', 'touch'] : ['buy', 'cost', 'pay', 'help', 'ask']);

  const sampleAdj = cleanAdj.length >= 2 ? cleanAdj : 
    (isEarlyChildhood ? ['big', 'small', 'red', 'yellow'] : ['fresh', 'ripe', 'sweet', 'cheap', 'delicious']);

  // Total points determination
  // Standard Formative: 20 pts (4 pts per skill x 5 skills = 20 pts)
  // Summative: 30 pts (6 pts per skill x 5 skills = 30 pts)
  // Quiz: 10 pts
  let totalPoints = 20;
  let ptsPerSkill = 4;

  if (testType === 'summative') {
    totalPoints = 30;
    ptsPerSkill = 6;
  } else if (testType === 'quiz') {
    totalPoints = 10;
    ptsPerSkill = 2;
  } else if (testType === 'action_rubric') {
    totalPoints = 20;
    ptsPerSkill = 4;
  }

  // 1. Title & Header Info
  const typeLabel = testType === 'formative' ? 'FORMATIVE EVALUATION · 5 MACRO-SKILLS' :
    testType === 'summative' ? 'SUMMATIVE UNIT ASSESSMENT · 5 MACRO-SKILLS' :
    testType === 'quiz' ? `SKILL FOCUS QUIZ · ${skillFocus.toUpperCase()}` : 'AOA PERFORMANCE RUBRIC (SPEAKING & MEDIATION)';

  const testTitle = `ENGLISH ${typeLabel} · SCENARIO: ${scenario.toUpperCase()}`;
  const skillSubtitle = skillFocus === 'all' 
    ? 'Comprehensive Assessment: Listening, Reading, Writing, Speaking & Mediation' 
    : `Primary Focus: ${skillFocus} Focus Assessment`;
  const testTheme = `Theme: "${theme}" · ${skillSubtitle}`;

  // ════════════════════════════════════════════════════════════════════
  // SKILL 1: LISTENING (COMPRENSIÓN AUDITIVA)
  // ════════════════════════════════════════════════════════════════════
  let audioScriptLines = [];
  if (dialogueText && dialogueText.trim().length > 30) {
    audioScriptLines = dialogueText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.toLowerCase().startsWith('dialogue:') && !line.toLowerCase().startsWith('theme:') && !line.toLowerCase().startsWith('scenario:') && !line.toLowerCase().startsWith('grade:'))
      .slice(0, 6);
  } else if (isEarlyChildhood) {
    audioScriptLines = [
      `Teacher: "Good morning class! Listen carefully to my instructions."`,
      `Teacher: "Command 1: Touch your ${sampleNouns[0] || 'book'} on your ${sampleNouns[1] || 'desk'}."`,
      `Teacher: "Command 2: Put your ${sampleNouns[4] || 'pencil'} in your ${sampleNouns[3] || 'bag'}."`,
      `Teacher: "Command 3: Point to the ${sampleNouns[2] || 'chair'}."`,
      `Teacher: "Where is the ${sampleNouns[0] || 'book'}? It is on the ${sampleNouns[1] || 'desk'}! Excellent."`
    ];
  } else if (scenario.toLowerCase().includes('canal') || scenario.toLowerCase().includes('locks')) {
    audioScriptLines = [
      `Officer: "Welcome to Miraflores Locks control station. What is your team assignment today?"`,
      `Technician: "Good morning! We need to inspect the safety tugboats and navigation signals."`,
      `Officer: "Make sure all technicians wear their safety helmets and high-visibility vests."`,
      `Technician: "Understood. The cargo ship arrives at eight o'clock (8:00 AM) through the Pacific locks."`,
      `Officer: "Thank you for following the safety protocols. Have a safe operation!"`
    ];
  } else if (scenario.toLowerCase().includes('bocas') || scenario.toLowerCase().includes('eco')) {
    audioScriptLines = [
      `Guide: "Welcome to Bocas del Toro! Today we are visiting the marine sanctuary and coral reef."`,
      `Tourist: "Hello! How much is the boat tour to Starfish Beach, please?"`,
      `Guide: "The eco-friendly boat tour is twelve dollars ($12.00) per person, including life vests."`,
      `Tourist: "Understood. Are visitors allowed to touch or lift the starfish?"`,
      `Guide: "No, please never remove or touch the starfish to protect our delicate marine ecosystem."`
    ];
  } else {
    // Default Market / Shopping Dialogue
    const itemA = sampleNouns[0] || 'pineapple';
    const itemB = sampleNouns[1] || 'apple';
    const itemC = sampleNouns[2] || 'banana';
    audioScriptLines = [
      `Seller: "Good morning! Welcome to the market stall. We have fresh tropical fruits today."`,
      `Buyer: "Good morning! How much is the ripe ${itemA}, please?"`,
      `Seller: "The ${itemA} is three dollars ($3.00), and the ${itemB}s are one dollar ($1.00) each."`,
      `Buyer: "Can I have one ${itemA} and two ${itemC}s, please?"`,
      `Seller: "The ${itemC}s are one dollar ($1.00) for both. That is four dollars ($4.00) total."`,
      `Buyer: "Here is five dollars ($5.00). Thank you very much!"`
    ];
  }

  // Listening questions (4 items for standard formative)
  const listeningItems = [];
  if (isEarlyChildhood) {
    listeningItems.push(
      { q: `1. Where did the teacher tell students to put the ${sampleNouns[0] || 'book'}?`, options: [{ text: 'Under the chair', key: false }, { text: `On the ${sampleNouns[1] || 'desk'}`, key: true }, { text: 'Outside the room', key: false }] },
      { q: `2. Where should students place the ${sampleNouns[4] || 'pencil'}?`, options: [{ text: `In the ${sampleNouns[3] || 'bag'}`, key: true }, { text: 'On the floor', key: false }, { text: 'In the box', key: false }] },
      { q: `3. What object did the teacher tell students to point to?`, options: [{ text: 'The window', key: false }, { text: `The ${sampleNouns[2] || 'chair'}`, key: true }, { text: 'The door', key: false }] },
      { q: `4. Are these classroom objects in our English class?`, options: [{ text: 'Yes, classroom realia', key: true }, { text: 'No, farm animals', key: false }, { text: 'No, rockets', key: false }] }
    );
  } else {
    const item1 = sampleNouns[0] || 'pineapple';
    const item2 = sampleNouns[1] || 'apple';
    listeningItems.push(
      { q: '1. Where does the spoken conversation take place?', options: [{ text: 'At a hospital', key: false }, { text: 'At the local scenario venue', key: true }, { text: 'At a train station', key: false }] },
      { q: `2. What primary item did the customer/speaker ask for first?`, options: [{ text: `The ${item1}`, key: true }, { text: `The ${item2}`, key: false }, { text: 'A ticket only', key: false }] },
      { q: `3. What polite formula was used during the interaction?`, options: [{ text: '"Hurry up"', key: false }, { text: '"Please" and "Thank you"', key: true }, { text: '"Later"', key: false }] },
      { q: '4. What was the main numerical or price detail mentioned?', options: [{ text: '$1.00 / 8:00 AM', key: false }, { text: '$3.00 / Target detail', key: true }, { text: '$100.00', key: false }] }
    );
  }

  // ════════════════════════════════════════════════════════════════════
  // SKILL 2: READING (COMPRENSIÓN LECTORA & ALFABETIZACIÓN VISUAL)
  // ════════════════════════════════════════════════════════════════════
  // Reading Stimulus Text (Authentic store notice, schedule, sign or descriptive passage)
  let readingPassage = '';
  if (isEarlyChildhood) {
    readingPassage = `CLASSROOM VISUAL NOTICE:\n"Look at the picture symbols. We keep our ${sampleNouns[0] || 'books'} on our ${sampleNouns[1] || 'desks'}. Pencils stay in our ${sampleNouns[3] || 'bags'}."`;
  } else if (scenario.toLowerCase().includes('canal')) {
    readingPassage = `MIRAFLORES OPERATIONAL NOTICE:\n"Notice to Transit Crew: Cargo Ship Pacific Star arrives at Lock Chamber 2. Tugboat Echo assists at 8:00 AM. Helmets mandatory."`;
  } else {
    readingPassage = `LOCAL COMMUNITY NOTICE & PRICE LIST:\n"Fresh tropical fruits today at Stall #4: Sweet pineapples ($3.00), crisp apples ($1.00 each), and ripe bananas (2 for $1.00). Open 7:00 AM - 4:00 PM."`;
  }

  // 4 Realia visual gallery items with SVGs
  const readingGallery = sampleNouns.slice(0, 4).map((word, idx) => {
    const letter = ['A', 'B', 'C', 'D'][idx];
    const cleanWord = word.toLowerCase().trim();
    return {
      letter,
      name: word.toUpperCase(),
      cleanWord,
      svgCode: getIllustrationSvg(cleanWord, 'color'),
      photoUrl: getRealiaPhoto(cleanWord)
    };
  });

  const readingStatements = [
    { num: 1, text: `Read the notice: What is the main topic or venue described?`, key: `The ${scenario}` },
    { num: 2, text: `Identify item A (${readingGallery[0]?.name}): How much or where is it?`, key: isEarlyChildhood ? 'On the desk' : '$3.00 / Available' },
    { num: 3, text: `Identify item B (${readingGallery[1]?.name}): What detail is true?`, key: isEarlyChildhood ? 'In the bag' : '$1.00 each / Fresh' },
    { num: 4, text: `True or False: The notice provides clear instructions for readers.`, key: 'True' }
  ];

  // ════════════════════════════════════════════════════════════════════
  // SKILL 3: WRITING (PRODUCCIÓN ESCRITA SOCIAL & WORD BANK)
  // ════════════════════════════════════════════════════════════════════
  const wordBank = isEarlyChildhood 
    ? ['book', 'desk', 'on', 'chair']
    : ['How much', 'dollars', 'please', 'thank you'];

  const writingItems = isEarlyChildhood ? [
    { prompt: '1. I read my (1) _______________________ in English class.', key: 'book' },
    { prompt: '2. I put the book (2) _______________________ the desk.', key: 'on' },
    { prompt: '3. The notebook is on the wooden (3) _______________________.', key: 'desk' },
    { prompt: '4. I sit down on my classroom (4) _______________________.', key: 'chair' }
  ] : [
    { prompt: '1. Customer: "(1) _______________________ is the ripe pineapple?"', key: 'How much' },
    { prompt: '2. Cashier: "It costs three (2) _______________________ ($3.00)."', key: 'dollars' },
    { prompt: '3. Customer: "Can I have two items, (3) _______________________?"', key: 'please' },
    { prompt: '4. Customer: "(4) _______________________ very much! Have a nice day!"', key: 'thank you' }
  ];

  // ════════════════════════════════════════════════════════════════════
  // SKILL 4: SPEAKING (INTERACCIÓN ORAL & SOCIAL ACTION SIMULATION)
  // ════════════════════════════════════════════════════════════════════
  const speakingRoleA = isEarlyChildhood ? {
    title: '👦 Pair Role A: Instruction Leader',
    instruction: `Say aloud to your peer: "Show me the ${sampleNouns[0] || 'book'} on the ${sampleNouns[1] || 'desk'}!" Use a clear voice.`
  } : {
    title: '👤 Pair Role A: Inquirer / Customer',
    instruction: `Greet your peer, ask the price/detail of 2 items using "How much is...?", and use polite markers ("please", "thank you").`
  };

  const speakingRoleB = isEarlyChildhood ? {
    title: '👧 Pair Role B: Active Performer',
    instruction: `Listen carefully to your partner, execute the physical action or point to the object, and say "Here it is!".`
  } : {
    title: '👨‍🍳 Pair Role B: Provider / Vendor',
    instruction: `Welcome your peer, state the prices clearly ($3.00, $1.00), calculate the total, and conclude politely.`
  };

  // ════════════════════════════════════════════════════════════════════
  // SKILL 5: MEDIATION (MEDIACIÓN INTERPERSONAL & LINGÜÍSTICA CEFR 2020)
  // ════════════════════════════════════════════════════════════════════
  const mediationScenario = isEarlyChildhood ? {
    challenge: 'A new classmate does not speak English and feels confused about what to do with the materials.',
    task: `Guide your classmate with gentle gestures and point to the ${sampleNouns[0] || 'book'} on the ${sampleNouns[1] || 'desk'} to show them how to follow the teacher's instructions.`,
    promptQuestion: 'How did you help your friend understand without speaking Spanish?'
  } : {
    challenge: 'A foreign tourist / visitor cannot understand the local sign or needs help ordering their food/ticket.',
    task: `Act as a bilingual mediator: Explain the prices ($3.00 / $1.00) or directions to the visitor in simple, clear English so they can make a successful choice.`,
    promptQuestion: 'Write or say the 1 essential sentence you used to explain the situation clearly to the visitor:'
  };

  // ════════════════════════════════════════════════════════════════════
  // OBSERVATION RUBRIC & MEDUCA CONVERSION SCALE
  // ════════════════════════════════════════════════════════════════════
  const rubricCriteria = [
    { skill: '1. Listening', desc: 'Comprehended spoken cues and details without freezing.', pts: '___ / 1.0' },
    { skill: '2. Reading', desc: 'Identified key facts and symbols in the authentic stimulus.', pts: '___ / 1.0' },
    { skill: '3. Writing', desc: 'Completed sentence blanks accurately using target lexicon.', pts: '___ / 1.0' },
    { skill: '4. Speaking', desc: 'Maintained communicative turn-taking and politeness.', pts: '___ / 1.0' },
    { skill: '5. Mediation', desc: 'Acted as an empathetic communication bridge for a peer.', pts: '___ / 1.0' }
  ];

  const meducaScale = {
    max50: totalPoints,
    min50: Math.round(totalPoints * 0.90),
    max40: Math.round(totalPoints * 0.89),
    min40: Math.round(totalPoints * 0.75),
    max30: Math.round(totalPoints * 0.74),
    min30: Math.round(totalPoints * 0.60),
    max29: Math.round(totalPoints * 0.59)
  };

  return {
    meta: {
      grade: gradeMeta.name,
      gradeLabel: gradeMeta.label,
      cefr: gradeMeta.cefr,
      time: gradeMeta.time,
      scenario,
      theme,
      skillFocus,
      testType,
      typeLabel,
      totalPoints,
      testScale,
      ptsPerSkill
    },
    header: {
      institution: 'REPÚBLICA DE PANAMÁ · MINISTERIO DE EDUCACIÓN (MEDUCA)',
      title: testTitle,
      theme: testTheme
    },
    audioScript: {
      show: includeAudioScript,
      instructions: 'Teacher\'s Spoken Audio Script (Read aloud 2 times to the class clearly):',
      lines: audioScriptLines
    },
    // The 5 Macro-Skills Sections
    skill1Listening: {
      title: `Skill 1: Listening Comprehension · Fact & Detail Check (${ptsPerSkill} Pts)`,
      instruction: 'Listen carefully to the teacher reading the spoken prompt. Circle the correct option (a, b, or c):',
      items: listeningItems.slice(0, ptsPerSkill)
    },
    skill2Reading: {
      title: `Skill 2: Reading Comprehension & Realia Literacy (${ptsPerSkill} Pts)`,
      instruction: 'Read the authentic community notice and observe the illustrations below. Answer the questions:',
      passage: readingPassage,
      gallery: readingGallery,
      statements: readingStatements.slice(0, ptsPerSkill)
    },
    skill3Writing: {
      title: `Skill 3: Writing Production & Word Bank (${ptsPerSkill} Pts)`,
      instruction: 'Complete the dialogue blanks using the appropriate words from the Word Bank:',
      wordBank,
      items: writingItems.slice(0, ptsPerSkill)
    },
    skill4Speaking: {
      title: `Skill 4: Speaking · Pair Interaction & Action Task (${ptsPerSkill} Pts)`,
      instruction: 'Work in pairs. Act out the communicative scenario following your assigned role:',
      roleA: speakingRoleA,
      roleB: speakingRoleB
    },
    skill5Mediation: {
      title: `Skill 5: Mediation · Interpersonal Communication Bridge (${ptsPerSkill} Pts)`,
      instruction: 'CEFR 2020 Action Challenge: Help a classmate or visitor understand the situation:',
      challenge: mediationScenario.challenge,
      task: mediationScenario.task,
      prompt: mediationScenario.promptQuestion
    },
    rubric: {
      show: includeRubric,
      title: 'MEDUCA 5-Skill Observational Rubric',
      criteria: rubricCriteria
    },
    meducaScale,
    signatures: {
      teacher: 'Docente Evaluador: _____________________________________',
      parent: 'Firma de Padre / Acudiente: ___________________________'
    }
  };
}
