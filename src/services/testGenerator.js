// EDUGEN PRO · AOA MEDUCA TEST & ASSESSMENT ENGINE
// Generador oficial de pruebas formativas, sumativas, quizzes y proyectos AOA
// Compatible con los 14 grados escolares (Pre-K a 12°) y todos los escenarios curriculares.
// Estructura oficial MEDUCA:
// - Pruebas evaluativas de aula: Enfocadas en las 4 Core Skills (Listening, Reading, Writing, Speaking).
// - Lección de Mediación: Enfocada en el Proyecto Colaborativo del Siglo XXI (21st Century Skills Project).

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
  { id: 'all_4', num: 0, label: '4 Core Skills — Prueba Evaluativa (Listening, Reading, Writing & Speaking)', short: '4 Skills Test' },
  { id: 'Listening', num: 1, label: '1 — Listening (Comprensión Auditiva & Discriminación)', short: 'Listening' },
  { id: 'Reading', num: 2, label: '2 — Reading (Alfabetización Visual & Comprensión Lectora)', short: 'Reading' },
  { id: 'Speaking', num: 3, label: '3 — Speaking (Interacción Oral & Acción Social)', short: 'Speaking' },
  { id: 'Writing', num: 4, label: '4 — Writing (Producción Escrita Social & Decodificación)', short: 'Writing' },
  { id: 'Mediation', num: 5, label: '5 — Mediation (Proyecto Colaborativo Siglo XXI / 21st Century Project)', short: 'Mediation (Project 21st)' }
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
 * Generate assessment focusing on the 4 core skills (Listening, Reading, Writing, Speaking)
 * Or generates the 21st Century Collaborative Project for the Mediation Lesson.
 */
export function generateAssessmentTest({
  grade = '4th Grade',
  scenario = 'Shopping at the Market',
  theme = 'How Much Is the Pineapple?',
  skillFocus = 'all_4', // 'all_4' | 'Listening' | 'Reading' | 'Speaking' | 'Writing' | 'Mediation'
  cefr = 'A1',
  nouns = [],
  verbs = [],
  adjectives = [],
  interrogatives = '',
  numbers = '1 to 100 (USD / Balboas)',
  dialogueText = '',
  project21st = '',
  testType = 'formative', // 'formative' (20 pts) | 'summative' (30 pts) | 'quiz' (10 pts) | 'action_rubric' | 'mediation_project'
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

  const isMediationLessonMode = skillFocus === 'Mediation' || testType === 'mediation_project';

  // ════════════════════════════════════════════════════════════════════
  // 1. IF MEDIATION LESSON: 21ST CENTURY PROJECT & ASSESSMENT GUIDE
  // ════════════════════════════════════════════════════════════════════
  if (isMediationLessonMode) {
    const defaultProjectTitle = `${scenario} Collaborative 21st Century Showcase`;
    const defaultProjectDesc = project21st && project21st.length > 15 
      ? project21st 
      : `Students work in collaborative teams to create a visual and communicative guide for ${scenario}. They apply critical thinking and cultural mediation to solve a community challenge and present their findings in simple English.`;

    const totalPoints = 20;

    return {
      isMediationProject: true,
      meta: {
        grade: gradeMeta.name,
        gradeLabel: gradeMeta.label,
        cefr: gradeMeta.cefr,
        time: gradeMeta.time,
        scenario,
        theme,
        skillFocus: 'Mediation',
        testType: 'mediation_project',
        typeLabel: 'AOA 21ST CENTURY PROJECT & MEDIATION GUIDE',
        totalPoints,
        testScale
      },
      header: {
        institution: 'REPÚBLICA DE PANAMÁ · MINISTERIO DE EDUCACIÓN (MEDUCA)',
        title: `LECCIÓN 5: MEDIACIÓN · PROYECTO DEL SIGLO XXI (21ST CENTURY SKILLS)`,
        theme: `Escenario: "${scenario.toUpperCase()}" · ${theme}`
      },
      projectDetails: {
        title: defaultProjectTitle,
        description: defaultProjectDesc,
        targetPillars: [
          { name: 'Critical Thinking', desc: 'Analyzing the problem and deciding team roles.' },
          { name: 'Collaboration', desc: 'Working in peer teams with respect and empathy.' },
          { name: 'Communication', desc: 'Using target English vocabulary to express ideas.' },
          { name: 'Cultural Mediation', desc: 'Acting as an empathetic bridge to help others understand.' }
        ],
        stages: [
          { step: 1, title: 'Step 1: Ideation & Role Assignment', action: `Teams of 3 students select their focus within ${scenario} and assign tasks (Researcher, Designer, Spokesperson).` },
          { step: 2, title: 'Step 2: Collaborative Production', action: `Drafting the team artifact (poster, mini-guide, or simulation script) using target lexicon (${sampleNouns.slice(0, 4).join(', ')}).` },
          { step: 3, title: 'Step 3: Peer Mediation Presentation', action: 'Teams present their solution and mediate questions from classmates in simple, respectful English.' },
          { step: 4, title: 'Step 4: Can-Do Reflection', action: 'Self-assessment on how effectively the team cooperated and communicated without switching entirely to Spanish.' }
        ]
      },
      rubric: {
        show: true,
        title: 'Rúbrica Oficial MEDUCA de Proyecto Colaborativo y Mediación (20 Pts)',
        criteria: [
          { name: '1. Colaboración & Trabajo en Equipo', desc: 'Participó activamente en el equipo, respetando los turnos y apoyando a los compañeros.', pts: '___ / 5.0' },
          { name: '2. Uso del Inglés & Mediación', desc: 'Utilizó el vocabulario clave del escenario y simplificó ideas para facilitar la comprensión.', pts: '___ / 5.0' },
          { name: '3. Calidad del Artefacto / Producto', desc: 'El producto final (afiche, guía o diálogo) presenta información clara, ordenada y creativa.', pts: '___ / 5.0' },
          { name: '4. Presentación & Acción Social', desc: 'Sustentó el proyecto con volumen audible, gestos de apoyo y seguridad comunicativa.', pts: '___ / 5.0' }
        ]
      },
      meducaScale: {
        max50: 20, min50: 19,
        max40: 18, min40: 15,
        max30: 14, min30: 12,
        max29: 11
      },
      signatures: {
        teacher: 'Docente Evaluador: _____________________________________',
        parent: 'Firma de Padre / Acudiente: ___________________________'
      }
    };
  }

  // ════════════════════════════════════════════════════════════════════
  // 2. STANDARD 4 CORE SKILLS TEST (LISTENING, READING, WRITING, SPEAKING)
  // ════════════════════════════════════════════════════════════════════
  
  // Point allocation strictly across the 4 core skills:
  // Formative: 20 pts (5 pts per skill x 4 skills = 20 pts)
  // Summative: 30 pts (Part 1: 8 pts, Part 2: 8 pts, Part 3: 7 pts, Part 4: 7 pts = 30 pts)
  // Quiz: 10 pts (2.5 pts per skill or 5 pts on 2 skills)
  let totalPoints = 20;
  let part1Pts = 5;
  let part2Pts = 5;
  let part3Pts = 5;
  let part4Pts = 5;

  if (testType === 'summative') {
    totalPoints = 30;
    part1Pts = 8;
    part2Pts = 8;
    part3Pts = 7;
    part4Pts = 7;
  } else if (testType === 'quiz') {
    totalPoints = 10;
    part1Pts = 3;
    part2Pts = 3;
    part3Pts = 2;
    part4Pts = 2;
  }

  const typeLabel = testType === 'formative' ? 'FORMATIVE EVALUATION · 4 CORE SKILLS' :
    testType === 'summative' ? 'SUMMATIVE UNIT ASSESSMENT · 4 CORE SKILLS' :
    testType === 'quiz' ? `QUICK CHECK QUIZ · 4 SKILLS` : 'AOA PERFORMANCE RUBRIC (ORAL & WRITTEN)';

  const testTitle = `ENGLISH ${typeLabel} · SCENARIO: ${scenario.toUpperCase()}`;
  const testTheme = `Theme: "${theme}" · Listening, Reading, Writing & Speaking (AOA Framework)`;

  // ── PART 1: LISTENING ──
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
      `Seller: "Good morning! Welcome to the market stall. We have fresh tropical items today."`,
      `Buyer: "Good morning! How much is the ripe ${itemA}, please?"`,
      `Seller: "The ${itemA} is three dollars ($3.00), and the ${itemB}s are one dollar ($1.00) each."`,
      `Buyer: "Can I have one ${itemA} and two ${itemC}s, please?"`,
      `Seller: "The ${itemC}s are one dollar ($1.00) for both. That is four dollars ($4.00) total."`,
      `Buyer: "Here is five dollars ($5.00). Thank you very much!"`
    ];
  }

  const listeningItems = [];
  if (isEarlyChildhood) {
    listeningItems.push(
      { q: `1. Where did the teacher tell students to put the ${sampleNouns[0] || 'book'}?`, options: [{ text: 'Under the chair', key: false }, { text: `On the ${sampleNouns[1] || 'desk'}`, key: true }, { text: 'Outside the room', key: false }] },
      { q: `2. Where should students place the ${sampleNouns[4] || 'pencil'}?`, options: [{ text: `In the ${sampleNouns[3] || 'bag'}`, key: true }, { text: 'On the floor', key: false }, { text: 'In the box', key: false }] },
      { q: `3. What object did the teacher tell students to point to?`, options: [{ text: 'The window', key: false }, { text: `The ${sampleNouns[2] || 'chair'}`, key: true }, { text: 'The door', key: false }] },
      { q: `4. Are these classroom objects in our English class?`, options: [{ text: 'Yes, classroom realia', key: true }, { text: 'No, farm animals', key: false }, { text: 'No, rockets', key: false }] },
      { q: `5. Did the teacher say "Good morning" to the class?`, options: [{ text: 'Yes, polite greeting', key: true }, { text: 'No, goodbye', key: false }, { text: 'No, silence', key: false }] }
    );
  } else {
    const item1 = sampleNouns[0] || 'pineapple';
    const item2 = sampleNouns[1] || 'apple';
    listeningItems.push(
      { q: '1. Where does the spoken conversation take place?', options: [{ text: 'At a hospital', key: false }, { text: 'At the local scenario venue', key: true }, { text: 'At a train station', key: false }] },
      { q: `2. What primary item did the customer/speaker ask for first?`, options: [{ text: `The ${item1}`, key: true }, { text: `The ${item2}`, key: false }, { text: 'A ticket only', key: false }] },
      { q: `3. What polite formula was used during the interaction?`, options: [{ text: '"Hurry up"', key: false }, { text: '"Please" and "Thank you"', key: true }, { text: '"Later"', key: false }] },
      { q: '4. What was the main numerical or price detail mentioned?', options: [{ text: '$1.00 / 8:00 AM', key: false }, { text: '$3.00 / Target detail', key: true }, { text: '$100.00', key: false }] },
      { q: '5. Did the speaker conclude the conversation courteously?', options: [{ text: 'Yes, with thanks and politeness', key: true }, { text: 'No, with anger', key: false }, { text: 'No, without speaking', key: false }] }
    );
  }

  // ── PART 2: READING & REALIA MATCHING ──
  let readingPassage = '';
  if (isEarlyChildhood) {
    readingPassage = `CLASSROOM VISUAL NOTICE:\n"Look at the picture symbols. We keep our ${sampleNouns[0] || 'books'} on our ${sampleNouns[1] || 'desks'}. Pencils stay in our ${sampleNouns[3] || 'bags'}."`;
  } else if (scenario.toLowerCase().includes('canal')) {
    readingPassage = `MIRAFLORES OPERATIONAL NOTICE:\n"Notice to Transit Crew: Cargo Ship Pacific Star arrives at Lock Chamber 2. Tugboat Echo assists at 8:00 AM. Helmets mandatory."`;
  } else {
    readingPassage = `LOCAL COMMUNITY NOTICE & PRICE LIST:\n"Fresh tropical fruits today at Stall #4: Sweet pineapples ($3.00), crisp apples ($1.00 each), and ripe bananas (2 for $1.00). Open 7:00 AM - 4:00 PM."`;
  }

  const readingGallery = sampleNouns.slice(0, 5).map((word, idx) => {
    const letter = ['A', 'B', 'C', 'D', 'E'][idx];
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
    { num: 1, text: `Read the notice: What is the main venue or location described?`, key: `The ${scenario}` },
    { num: 2, text: `Identify item A (${readingGallery[0]?.name}): What detail or price matches?`, key: isEarlyChildhood ? 'On the desk' : '$3.00 / Available' },
    { num: 3, text: `Identify item B (${readingGallery[1]?.name}): What detail is verified?`, key: isEarlyChildhood ? 'In the bag' : '$1.00 each / Fresh' },
    { num: 4, text: `Identify item C (${readingGallery[2]?.name}): What does the text state?`, key: isEarlyChildhood ? 'Classroom chair' : 'Yellow / 2 for $1.00' },
    { num: 5, text: `True or False: The text provides clear factual details.`, key: 'True' }
  ];

  // ── PART 3: WRITING PRODUCTION & WORD BANK ──
  const wordBank = isEarlyChildhood 
    ? ['book', 'desk', 'on', 'under', 'chair']
    : ['How much', 'dollars', 'please', 'thank you', 'change'];

  const writingItems = isEarlyChildhood ? [
    { prompt: '1. I read my (1) _______________________ in English class.', key: 'book' },
    { prompt: '2. I put the book (2) _______________________ the desk.', key: 'on' },
    { prompt: '3. The notebook is on the wooden (3) _______________________.', key: 'desk' },
    { prompt: '4. I sit down on my classroom (4) _______________________.', key: 'chair' },
    { prompt: '5. My bag is placed (5) _______________________ the chair.', key: 'under' }
  ] : [
    { prompt: '1. Customer: "(1) _______________________ is the ripe pineapple?"', key: 'How much' },
    { prompt: '2. Cashier: "It costs three (2) _______________________ ($3.00)."', key: 'dollars' },
    { prompt: '3. Customer: "Can I have two items, (3) _______________________?"', key: 'please' },
    { prompt: '4. Cashier: "You gave me $5.00, here is your $1.00 (4) _______________________."', key: 'change' },
    { prompt: '5. Customer: "(5) _______________________ very much! Have a nice day!"', key: 'thank you' }
  ];

  // ── PART 4: SPEAKING PAIR INTERACTION ──
  const speakingRoleA = isEarlyChildhood ? {
    title: '👦 Pair Role A: Instruction Leader',
    instruction: `Say aloud to your peer: "Show me the ${sampleNouns[0] || 'book'} on the ${sampleNouns[1] || 'desk'}!" Use a clear, audible voice.`
  } : {
    title: '👤 Pair Role A: Inquirer / Customer',
    instruction: `Greet your peer, ask the price/detail of 2 items using "How much is...?", and use polite words ("please", "thank you").`
  };

  const speakingRoleB = isEarlyChildhood ? {
    title: '👧 Pair Role B: Active Performer',
    instruction: `Listen carefully to your partner, execute the action or point to the realia object, and say "Here it is!".`
  } : {
    title: '👨‍🍳 Pair Role B: Provider / Vendor',
    instruction: `Welcome your peer, state the prices clearly ($3.00, $1.00), calculate the total amount, and hand over the change.`
  };

  // ── 4-SKILL OBSERVATION RUBRIC ──
  const rubricCriteria = [
    { skill: '1. Listening', desc: 'Comprehended spoken cues and details from the teacher prompt.', pts: `___ / ${Math.round(totalPoints / 4)}.0` },
    { skill: '2. Reading', desc: 'Extracted key information and matched realia visual symbols.', pts: `___ / ${Math.round(totalPoints / 4)}.0` },
    { skill: '3. Writing', desc: 'Completed written blanks accurately using target vocabulary.', pts: `___ / ${Math.round(totalPoints / 4)}.0` },
    { skill: '4. Speaking', desc: 'Engaged in communicative turn-taking and spoken role-play.', pts: `___ / ${Math.round(totalPoints / 4)}.0` }
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
    isMediationProject: false,
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
      ptsPerSkill: Math.round(totalPoints / 4)
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
    // The 4 Core Skills
    part1Listening: {
      title: `Part I: Listening Comprehension · Fact & Detail Check (${part1Pts} Points)`,
      instruction: 'Listen carefully to the teacher reading the spoken prompt. Circle the correct option (a, b, or c):',
      points: part1Pts,
      items: listeningItems.slice(0, part1Pts)
    },
    part2Reading: {
      title: `Part II: Reading Comprehension & Realia Literacy (${part2Pts} Points)`,
      instruction: 'Read the authentic community notice and observe the illustrations below. Answer the questions:',
      points: part2Pts,
      passage: readingPassage,
      gallery: readingGallery,
      statements: readingStatements.slice(0, part2Pts)
    },
    part3Writing: {
      title: `Part III: Writing Production & Word Bank (${part3Pts} Points)`,
      instruction: 'Complete the dialogue blanks using the appropriate words from the Word Bank:',
      points: part3Pts,
      wordBank,
      items: writingItems.slice(0, part3Pts)
    },
    part4Speaking: {
      title: `Part IV: Speaking · Pair Interaction & Action Task (${part4Pts} Points)`,
      instruction: 'Work in pairs. Act out the communicative scenario following your assigned role:',
      points: part4Pts,
      roleA: speakingRoleA,
      roleB: speakingRoleB
    },
    rubric: {
      show: includeRubric,
      title: 'MEDUCA 4-Core Skills Observational Rubric',
      criteria: rubricCriteria
    },
    meducaScale,
    signatures: {
      teacher: 'Docente Evaluador: _____________________________________',
      parent: 'Firma de Padre / Acudiente: ___________________________'
    }
  };
}
