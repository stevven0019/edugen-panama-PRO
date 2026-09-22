// EDUGEN PRO · AOA MEDUCA TEST & ASSESSMENT ENGINE
// Generador oficial de pruebas formativas, sumativas, quizzes y rúbricas de desempeño
// Compatible con los 14 grados escolares (Pre-K a 12°) y todos los escenarios curriculares

import { getIllustrationSvg } from '../resources/illustrations.js';
import { getRealiaPhoto } from '../resources/realiaCatalog.js';

export const GRADES_LIST = [
  { id: 'prek', name: 'Pre-K', label: 'Pre-K (Pre-A1 Receptivo / TPR)', cefr: 'Pre-A1', file: 'English_Curriculum_Prekinder.json', time: '30 min', defaultItems: 4 },
  { id: 'kinder', name: 'Kinder', label: 'Kínder (Pre-A1 Receptivo / TPR)', cefr: 'Pre-A1', file: 'English_Curriculum_Kinder.json', time: '35 min', defaultItems: 4 },
  { id: '1st', name: '1st Grade', label: '1° Grado (Pre-A1 / A1.1)', cefr: 'A1.1', file: 'English_Curriculum_Grade_1.json', time: '40 min', defaultItems: 5 },
  { id: '2nd', name: '2nd Grade', label: '2° Grado (A1.1)', cefr: 'A1.1', file: 'English_Curriculum_Grade_2.json', time: '40 min', defaultItems: 5 },
  { id: '3rd', name: '3rd Grade', label: '3° Grado (A1)', cefr: 'A1', file: 'English_Curriculum_Grade_3.json', time: '45 min', defaultItems: 5 },
  { id: '4th', name: '4th Grade', label: '4° Grado (A1)', cefr: 'A1', file: 'English_Curriculum_Grade_4.json', time: '45 min', defaultItems: 6 },
  { id: '5th', name: '5th Grade', label: '5° Grado (A1+)', cefr: 'A1+', file: 'English_Curriculum_Grade_5.json', time: '45 min', defaultItems: 6 },
  { id: '6th', name: '6th Grade', label: '6° Grado (A1+)', cefr: 'A1+', file: 'English_Curriculum_Grade_6.json', time: '45 min', defaultItems: 6 },
  { id: '7th', name: '7th Grade', label: '7° Grado (A2)', cefr: 'A2', file: 'English_Curriculum_Grade_7.json', time: '50 min', defaultItems: 6 },
  { id: '8th', name: '8th Grade', label: '8° Grado (A2)', cefr: 'A2', file: 'English_Curriculum_Grade_8.json', time: '50 min', defaultItems: 6 },
  { id: '9th', name: '9th Grade', label: '9° Grado (A2+)', cefr: 'A2+', file: 'English_Curriculum_Grade_9.json', time: '50 min', defaultItems: 6 },
  { id: '10th', name: '10th Grade', label: '10° Grado (B1)', cefr: 'B1', file: 'English_Curriculum_Grade_10.json', time: '55 min', defaultItems: 6 },
  { id: '11th', name: '11th Grade', label: '11° Grado (B1)', cefr: 'B1', file: 'English_Curriculum_Grade_11.json', time: '55 min', defaultItems: 6 },
  { id: '12th', name: '12th Grade', label: '12° Grado (B1+)', cefr: 'B1+', file: 'English_Curriculum_Grade_12.json', time: '60 min', defaultItems: 6 }
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

// Clean and normalize vocabulary words into simple array
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
 * Generate an authentic evaluation tailored to the given curriculum scenario or lesson plan
 */
export function generateAssessmentTest({
  grade = '4th Grade',
  scenario = 'Shopping at the Market',
  theme = 'How Much Is the Pineapple?',
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

  // Fallback defaults if vocabulary list is sparse
  const sampleNouns = cleanNouns.length >= 4 ? cleanNouns : 
    (isEarlyChildhood 
      ? ['book', 'desk', 'chair', 'bag', 'pencil', 'crayon']
      : ['pineapple', 'apple', 'banana', 'watermelon', 'mango', 'market', 'dollar']);
  
  const sampleVerbs = cleanVerbs.length >= 2 ? cleanVerbs : 
    (isEarlyChildhood ? ['look', 'put', 'point', 'touch'] : ['buy', 'cost', 'pay', 'help', 'ask']);

  const sampleAdj = cleanAdj.length >= 2 ? cleanAdj : 
    (isEarlyChildhood ? ['big', 'small', 'red', 'yellow'] : ['fresh', 'ripe', 'sweet', 'cheap', 'delicious']);

  // Total points determination
  let totalPoints = 20;
  let part1Pts = 6;
  let part2Pts = 5;
  let part3Pts = 5;
  let part4Pts = 4;
  let part5Pts = 0;

  if (testType === 'summative') {
    totalPoints = 30;
    part1Pts = 8;
    part2Pts = 6;
    part3Pts = 6;
    part4Pts = 5;
    part5Pts = 5;
  } else if (testType === 'quiz') {
    totalPoints = 10;
    part1Pts = 5;
    part2Pts = 5;
    part3Pts = 0;
    part4Pts = 0;
  } else if (testType === 'action_rubric') {
    totalPoints = 20;
    part1Pts = 0;
    part2Pts = 0;
    part3Pts = 0;
    part4Pts = 20;
  }

  // 1. Build Title & Badges
  const typeLabel = testType === 'formative' ? 'FORMATIVE EVALUATION' :
    testType === 'summative' ? 'SUMMATIVE UNIT TEST' :
    testType === 'quiz' ? 'QUICK CHECK QUIZ' : 'ORAL PERFORMANCE RUBRIC';

  const testTitle = `ENGLISH ${typeLabel} · SCENARIO: ${scenario.toUpperCase()}`;
  const testTheme = `Theme: "${theme}" · ${isEarlyChildhood ? 'Receptive Listening & Non-Verbal TPR Action' : 'Communicative Interaction & Task Achievement'}`;

  // 2. Build Audio Script for Teacher (Listening Prompt)
  let audioScriptLines = [];
  if (dialogueText && dialogueText.trim().length > 30) {
    // Use user-provided dialogue lines
    audioScriptLines = dialogueText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.toLowerCase().startsWith('dialogue:') && !line.toLowerCase().startsWith('theme:') && !line.toLowerCase().startsWith('scenario:'))
      .slice(0, 7);
  } else if (isEarlyChildhood) {
    // Kindergarten / Pre-K TPR Commands
    audioScriptLines = [
      `Teacher: "Good morning class! Look at our classroom today."`,
      `Teacher: "Command 1: Touch your ${sampleNouns[0] || 'book'} on your ${sampleNouns[1] || 'desk'}."`,
      `Teacher: "Command 2: Put your ${sampleNouns[4] || 'pencil'} in your ${sampleNouns[3] || 'bag'}."`,
      `Teacher: "Command 3: Point to the ${sampleNouns[2] || 'chair'}."`,
      `Teacher: "Where is the ${sampleNouns[0] || 'book'}? It is on the ${sampleNouns[1] || 'desk'}! Excellent job."`
    ];
  } else if (scenario.toLowerCase().includes('canal') || scenario.toLowerCase().includes('job') || scenario.toLowerCase().includes('transit')) {
    audioScriptLines = [
      `Officer: "Welcome to Miraflores Locks control station. What is your team assignment today?"`,
      `Technician: "Good morning! We need to inspect the safety tugboats and navigation signals before ship transit."`,
      `Officer: "Make sure all technicians wear their safety helmets and high-visibility vests."`,
      `Technician: "Understood. The cargo ship arrives at eight o'clock (8:00 AM) through the Pacific locks."`,
      `Officer: "Thank you for following the safety protocols. Have a safe operation!"`
    ];
  } else if (scenario.toLowerCase().includes('bocas') || scenario.toLowerCase().includes('tour') || scenario.toLowerCase().includes('reef')) {
    audioScriptLines = [
      `Guide: "Welcome to Bocas del Toro! Today we are visiting the marine sanctuary and coral reef."`,
      `Tourist: "Hello! How much is the boat tour to Starfish Beach, please?"`,
      `Guide: "The eco-friendly boat tour is twelve dollars ($12.00) per person, including life vests."`,
      `Tourist: "Great! Are we allowed to touch the starfish in the water?"`,
      `Guide: "No, please never remove or touch the starfish. We must protect our fragile marine ecosystem."`,
      `Tourist: "Understood. Here is twenty dollars ($20.00). Thank you for guiding us!"`
    ];
  } else {
    // Default Market / Shopping / Everyday Dialogue
    const itemA = sampleNouns[0] || 'pineapple';
    const itemB = sampleNouns[1] || 'apple';
    const itemC = sampleNouns[2] || 'banana';
    audioScriptLines = [
      `Seller: "Good morning! Welcome to our local stall. We have fresh tropical items today."`,
      `Buyer: "Good morning! How much is the ripe ${itemA}, please?"`,
      `Seller: "The ${itemA} is three dollars ($3.00), and the ${itemB}s are one dollar ($1.00) each."`,
      `Buyer: "Can I have one ${itemA} and two ${itemC}s, please?"`,
      `Seller: "Of course! The ${itemC}s are one dollar ($1.00) for both. That is four dollars ($4.00) total."`,
      `Buyer: "Here is five dollars ($5.00). Thank you very much!"`,
      `Seller: "Here is one dollar ($1.00) in change. Have a wonderful day!"`
    ];
  }

  // 3. Build Part 1: Listening Questions
  const part1Items = [];
  if (isEarlyChildhood) {
    part1Items.push({
      q: `1. Where does the teacher say the ${sampleNouns[0] || 'book'} is?`,
      options: [
        { text: 'Under the chair', key: false },
        { text: `On the ${sampleNouns[1] || 'desk'}`, key: true },
        { text: 'Outside the room', key: false }
      ]
    });
    part1Items.push({
      q: `2. Where should students place the ${sampleNouns[4] || 'pencil'}?`,
      options: [
        { text: `In the ${sampleNouns[3] || 'bag'}`, key: true },
        { text: 'On the floor', key: false },
        { text: 'In the trash', key: false }
      ]
    });
    part1Items.push({
      q: `3. What object did the teacher tell students to point to?`,
      options: [
        { text: 'The window', key: false },
        { text: `The ${sampleNouns[2] || 'chair'}`, key: true },
        { text: 'The door', key: false }
      ]
    });
    part1Items.push({
      q: `4. Is the instruction about English classroom objects?`,
      options: [
        { text: 'Yes, classroom realia', key: true },
        { text: 'No, wild jungle', key: false },
        { text: 'No, space rockets', key: false }
      ]
    });
  } else if (scenario.toLowerCase().includes('canal')) {
    part1Items.push(
      { q: '1. Where does this conversation take place?', options: [{ text: 'At a supermarket', key: false }, { text: 'At Miraflores Locks control station', key: true }, { text: 'At the airport', key: false }] },
      { q: '2. What equipment must all technicians wear for safety?', options: [{ text: 'Safety helmets and vests', key: true }, { text: 'Party hats', key: false }, { text: 'Sunglasses only', key: false }] },
      { q: '3. What time does the cargo ship arrive at the locks?', options: [{ text: '8:00 AM', key: true }, { text: '12:00 PM', key: false }, { text: '6:00 PM', key: false }] },
      { q: '4. What are the technicians inspecting before the transit?', options: [{ text: 'Tugboats and signals', key: true }, { text: 'Souvenirs', key: false }, { text: 'Tourist buses', key: false }] },
      { q: '5. Which locks are mentioned in the spoken dialogue?', options: [{ text: 'Pacific locks', key: true }, { text: 'Atlantic beach', key: false }, { text: 'Mountain locks', key: false }] },
      { q: '6. What is the main purpose of following the protocol?', options: [{ text: 'Safe canal operation', key: true }, { text: 'Going home early', key: false }, { text: 'Buying lunch', key: false }] }
    );
  } else if (scenario.toLowerCase().includes('bocas')) {
    part1Items.push(
      { q: '1. Where does this conversation take place?', options: [{ text: 'In Panama City metro', key: false }, { text: 'In Bocas del Toro marine sanctuary', key: true }, { text: 'In a mountain farm', key: false }] },
      { q: '2. How much is the eco-boat tour per person?', options: [{ text: '$5.00', key: false }, { text: '$12.00', key: true }, { text: '$50.00', key: false }] },
      { q: '3. Are visitors allowed to touch or lift the starfish?', options: [{ text: 'No, never touch them', key: true }, { text: 'Yes, to take photos', key: false }, { text: 'Yes, to take them home', key: false }] },
      { q: '4. What safety equipment is included in the tour?', options: [{ text: 'Life vests', key: true }, { text: 'Winter coats', key: false }, { text: 'Fishing nets', key: false }] },
      { q: '5. What polite words were exchanged during the booking?', options: [{ text: '"Please" and "Thank you"', key: true }, { text: '"Hurry up"', key: false }, { text: '"Goodbye only"', key: false }] },
      { q: '6. How much money did the tourist give the guide?', options: [{ text: '$20.00', key: true }, { text: '$10.00', key: false }, { text: '$100.00', key: false }] }
    );
  } else {
    // Default Market / Dialogue Questions
    const item1 = sampleNouns[0] || 'pineapple';
    const item2 = sampleNouns[1] || 'apple';
    part1Items.push(
      { q: '1. Where does the spoken conversation take place?', options: [{ text: 'At the hospital', key: false }, { text: 'At the local market stall', key: true }, { text: 'At the train station', key: false }] },
      { q: `2. How much does the ripe ${item1} cost?`, options: [{ text: '$1.00', key: false }, { text: '$2.00', key: false }, { text: '$3.00', key: true }] },
      { q: `3. How much are the ${item2}s each?`, options: [{ text: '$1.00 dollar', key: true }, { text: '$4.00 dollars', key: false }, { text: 'Free', key: false }] },
      { q: `4. Did the buyer ask for a ${item1} first?`, options: [{ text: `Yes, the ripe ${item1}`, key: true }, { text: 'No, vegetables', key: false }, { text: 'No, meat', key: false }] },
      { q: '5. What polite word did the customer use when ordering?', options: [{ text: 'Hurry up', key: false }, { text: 'Please', key: true }, { text: 'Later', key: false }] },
      { q: '6. What was the total cost calculated by the cashier?', options: [{ text: '$2.00', key: false }, { text: '$4.00', key: true }, { text: '$10.00', key: false }] }
    );
  }

  // Slice to targeted items
  const finalPart1 = part1Items.slice(0, Math.min(part1Pts, part1Items.length));

  // 4. Build Part 2: Realia Items & Matching Table (5 items max for 2-page fit)
  const realiaGallery = [];
  const matchingStatements = [];
  const galleryKeys = ['A', 'B', 'C', 'D', 'E'];
  const galleryItems = sampleNouns.slice(0, 5);

  galleryItems.forEach((word, idx) => {
    const letter = galleryKeys[idx] || `${idx + 1}`;
    const cleanWord = word.toLowerCase().trim();
    const svgCode = getIllustrationSvg(cleanWord, 'color');
    const photo = getRealiaPhoto(cleanWord);

    realiaGallery.push({
      letter,
      name: word.toUpperCase(),
      cleanWord,
      svgCode,
      photoUrl: photo
    });

    let desc = `Item related to ${word} in the curriculum context.`;
    if (cleanWord === 'pineapple') desc = `"Costs three dollars ($3.00), sweet and has spiky green leaves."`;
    else if (cleanWord === 'apple') desc = `"Costs one dollar ($1.00) each, crisp red tropical/imported fruit."`;
    else if (cleanWord === 'banana') desc = `"Yellow curved fruit, sold two for one dollar ($1.00)."`;
    else if (cleanWord === 'watermelon') desc = `"Large fruit with green rind and sweet red slices inside."`;
    else if (cleanWord === 'mango') desc = `"Orange juicy tropical fruit that costs two dollars ($2.00)."`;
    else if (cleanWord === 'book') desc = `"Educational object opened and placed ON the desk."`;
    else if (cleanWord === 'desk') desc = `"Classroom furniture where students write and place their books."`;
    else if (cleanWord === 'chair') desc = `"Furniture students sit on during English class."`;
    else if (cleanWord === 'bag') desc = `"Carries school supplies; students put pencils inside it."`;
    else if (cleanWord === 'pencil') desc = `"Writing utensil used to write and draw on paper."`;
    else if (cleanWord === 'crayon') desc = `"Coloring wax stick used for art and drawing."`;
    else if (cleanWord === 'locks' || cleanWord === 'ship') desc = `"Canal infrastructure where cargo ships transit between oceans."`;
    else if (cleanWord === 'coral' || cleanWord === 'reef') desc = `"Delicate marine habitat protected in Bocas del Toro."`;
    else {
      desc = `"Key vocabulary word: ${word}. Used frequently in the scenario context."`;
    }

    matchingStatements.push({
      num: idx + 1,
      statement: desc,
      keyLetter: letter,
      keyWord: word
    });
  });

  // 5. Build Part 3: Communicative Dialogue with Word Bank
  const wordBankWords = isEarlyChildhood 
    ? ['book', 'desk', 'on', 'under', 'chair']
    : (scenario.toLowerCase().includes('canal') 
      ? ['safety', 'helmet', 'transit', 'locks', 'please']
      : ['How much', 'please', 'dollars', 'Thank you', 'change']);

  let dialogueBlanks = [];
  if (isEarlyChildhood) {
    dialogueBlanks = [
      { speaker: 'Teacher', text: 'Hello! Please open your (1) _______________________.', key: 'book' },
      { speaker: 'Student', text: 'Yes, teacher! I put it (2) _______________________ my desk.', key: 'on' },
      { speaker: 'Teacher', text: 'Very good! Now look under your (3) _______________________.', key: 'chair' },
      { speaker: 'Student', text: 'I see my bag under my (4) _______________________.', key: 'chair' },
      { speaker: 'Teacher', text: 'Super work! (5) _______________________ very much!', key: 'Thank you' }
    ];
  } else if (scenario.toLowerCase().includes('canal')) {
    dialogueBlanks = [
      { speaker: 'Coordinator', text: 'Good morning! Is the (1) _______________________ inspection completed?', key: 'safety' },
      { speaker: 'Technician', text: 'Yes! Every worker is wearing a safety (2) _______________________.', key: 'helmet' },
      { speaker: 'Coordinator', text: 'What is the schedule for the ship (3) _______________________ today?', key: 'transit' },
      { speaker: 'Technician', text: 'The vessel is entering the Pacific (4) _______________________ at 8:00 AM.', key: 'locks' },
      { speaker: 'Coordinator', text: 'Radio the captain with confirmation, (5) _______________________.', key: 'please' }
    ];
  } else {
    // Default Market Dialogue
    dialogueBlanks = [
      { speaker: 'Customer', text: 'Good afternoon! (1) _______________________ is the ripe pineapple?', key: 'How much' },
      { speaker: 'Cashier', text: 'It costs three (2) _______________________ ($3.00).', key: 'dollars' },
      { speaker: 'Customer', text: 'Can I also have one apple, (3) _______________________?', key: 'please' },
      { speaker: 'Cashier', text: 'Sure! That is $4.00. You gave me $5.00, so here is $1.00 in (4) _______________________.', key: 'change' },
      { speaker: 'Customer', text: '(5) _______________________ very much! Have a wonderful day!', key: 'Thank you' }
    ];
  }

  // 6. Build Part 4: AOA Action Task & MEDUCA Observation Rubric
  let roleA = {
    title: '👤 Pair Role A: Customer / Student',
    desc: 'Ask questions using targeted structures, use polite words ("please", "thank you"), and interact naturally.'
  };
  let roleB = {
    title: '👨‍🍳 Pair Role B: Vendor / Partner',
    desc: 'Respond to your partner, provide prices or locations clearly, and conclude the communicative task.'
  };

  if (isEarlyChildhood) {
    roleA = {
      title: '🧒 Pair Role A: Simon / Leader',
      desc: 'Give simple TPR commands to your peer (e.g. "Put the book on the desk", "Show me the pencil").'
    };
    roleB = {
      title: '👧 Pair Role B: Active Responder',
      desc: 'Listen attentively and execute the physical motion immediately without speaking, demonstrating comprehension.'
    };
  } else if (scenario.toLowerCase().includes('canal')) {
    roleA = {
      title: '👷 Pair Role A: Canal Transit Coordinator',
      desc: 'Confirm the arrival time, verify safety gear (helmet, vest), and give authorization for locks transit.'
    };
    roleB = {
      title: '🚢 Pair Role B: Vessel Tugboat Pilot',
      desc: 'Report vessel dimensions, confirm tugboat position, and confirm safety protocol readiness over radio.'
    };
  }

  const rubricCriteria = [
    { num: 1, title: 'Task Completion', desc: 'Successfully achieved the communicative goal within the simulated scenario.', max: 1.0 },
    { num: 2, title: 'Linguistic Accuracy', desc: `Used target vocabulary (${sampleNouns.slice(0, 3).join(', ')}) and structures appropriately.`, max: 1.0 },
    { num: 3, title: 'Socio-pragmatic Politeness', desc: 'Used polite markers ("please", "thank you", "excuse me") and appropriate register.', max: 1.0 },
    { num: 4, title: 'Active Listening & Turn-taking', desc: 'Maintained conversational flow without freezing or needing Spanish translation.', max: 1.0 }
  ];

  // 7. Official MEDUCA Grading Scale Breakdown
  const meducaScale = {
    max50: totalPoints,
    min50: Math.round(totalPoints * 0.92),
    max40: Math.round(totalPoints * 0.91),
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
      testType,
      typeLabel,
      totalPoints,
      testScale,
      numbers
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
    part1: {
      title: `Part I: Listening Comprehension · Fact & Detail Check (${part1Pts} Points)`,
      subtitle: `${finalPart1.length} Items · 1 pt each`,
      instruction: 'Listen carefully to the dialogue read aloud by the teacher. Circle the correct letter (a, b, or c) according to what you hear.',
      points: part1Pts,
      items: finalPart1
    },
    part2: {
      title: `Part II: Vocabulary Realia & Matching (${part2Pts} Points)`,
      subtitle: `${matchingStatements.length} Items · 1 pt each`,
      instruction: 'Look at the realia illustrations below. Write the letter of the correct item inside the bracket [ ] matching each description from the audio.',
      points: part2Pts,
      gallery: realiaGallery,
      statements: matchingStatements
    },
    part3: {
      title: `Part III: Communicative Dialogue & Sentence Completion (${part3Pts} Points)`,
      subtitle: `${dialogueBlanks.length} Items · 1 pt each`,
      instruction: 'Complete the missing blanks in the dialogue using the words from the Word Bank:',
      points: part3Pts,
      wordBank: wordBankWords,
      dialogue: dialogueBlanks
    },
    part4: {
      show: includeRubric,
      title: `Part IV: Action Task · Social Interaction & Observation Rubric (${part4Pts} Points)`,
      badge: 'Social Agent Action Task',
      points: part4Pts,
      roleA,
      roleB,
      criteria: rubricCriteria
    },
    meducaScale,
    signatures: {
      teacher: 'Docente Evaluador: _____________________________________',
      parent: 'Firma de Padre / Acudiente: ___________________________'
    }
  };
}
