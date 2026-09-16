import { parseAoaLessonPlan } from './lessonParser.js';

export const ICONS = ['book','bag','desk','chair','pencil','crayon','ball','apple','tree','sun','house','fish','flower','pineapple','banana','orange','watermelon','mango','market','dollar'];

const text = (value, name, max = 600) => {
  if (typeof value !== 'string' || !value.trim()) return '';
  return value.trim().slice(0, max);
};

export function normalizeIcon(icon) {
  if (!icon || typeof icon !== 'string') return 'book';
  let clean = icon.toLowerCase().trim().replace(/s$/, '');
  if (clean === 'pencile') clean = 'pencil';
  if (clean === 'table') return 'desk';
  if (clean === 'backpack') return 'bag';
  return clean;
}

export function normalizeAnchor(anchor, position = 'none', contextText = '') {
  if (anchor && typeof anchor === 'string') {
    let clean = anchor.toLowerCase().trim();
    if (clean === 'table') return 'desk';
    if (clean === 'box') return 'bag';
    if (['desk', 'bag', 'chair'].includes(clean)) return clean;
  }
  if (position === 'in') return 'bag';
  if ((contextText || '').toLowerCase().includes('chair')) return 'chair';
  return 'desk';
}

export function validatePack(pack) {
  if (!pack || typeof pack !== 'object') throw new Error('No se recibió un cuaderno válido.');

  if (!pack.activities && !pack.page1 && pack.title) {
    pack = parseAoaLessonPlan(pack);
  }
  
  pack.title = text(pack.title, 'title', 140) || 'Activity Workbook';
  pack.grade = text(pack.grade, 'grade', 60) || 'Grade';
  pack.skill = text(pack.skill, 'skill', 60) || 'English';
  pack.lessonTitle = text(pack.lessonTitle, 'lessonTitle', 160) || pack.title;
  pack.color_policy = pack.color_policy || 'vocabulary_only';

  // Support modern 3-Page Pedagogical Blueprint
  if (pack.page1 && pack.page2 && pack.page3) {
    if (!Array.isArray(pack.activities)) {
      pack.activities = [
        {
          type: 'vocabulary_cards',
          title: pack.page1.activity1?.title || 'Vocabulary Input',
          instruction: pack.page1.activity1?.instruction || 'Review the target words.',
          items: (pack.page1.wordBank || []).map(w => ({ label: w.word, icon: w.icon || w.word }))
        },
        {
          type: 'matching',
          title: pack.page2.activity2?.title || 'Matching Activity',
          instruction: pack.page2.activity2?.instruction || 'Match items.',
          pairs: (pack.page2.activity2?.pairs || []).map(p => ({ left: p.item, right: p.detail, icon: p.icon }))
        },
        {
          type: 'dialogue_cloze',
          title: pack.page2.activity3?.title || 'Dialogue Practice',
          instruction: pack.page2.activity3?.instruction || 'Complete the dialogue.'
        },
        {
          type: 'draw_write',
          title: pack.page2.activity4?.title || 'Performance Task',
          instruction: pack.page2.activity4?.instruction || 'Complete the task.'
        }
      ];
    }
    if (!Array.isArray(pack.rubric)) {
      pack.rubric = pack.page3.teacherGuide?.rubric || [
        { criterion: 'Demonstrates target skill in context', independent: 'Completes tasks accurately and fluently without support.', withSupport: 'Completes tasks with occasional prompts and repetitions.', emerging: 'Requires continuous modeling and direct teacher assistance.' }
      ];
    }
    return pack;
  }

  if (!Array.isArray(pack.activities) || pack.activities.length < 2) {
    throw new Error('El cuaderno debe tener al menos 2 actividades.');
  }

  const recognizedTypes = [
    'vocabulary_cards',
    'match_picture_word',
    'match_location_word',
    'listen_choose_picture',
    'listen_match_price',
    'shared_reading_page',
    'card_choices',
    'table_checklist',
    'matching',
    'dialogue_cloze',
    'read_answer',
    'draw_write',
    'open_drawing'
  ];

  pack.activities = pack.activities.slice(0, 6).map((activity, idx) => {
    activity.title = text(activity.title, 'título', 140) || `Activity ${idx + 1}`;
    activity.instruction = text(activity.instruction, 'instrucción', 280) || 'Follow the instructions.';

    if (activity.type === 'picture_choice') activity.type = 'listen_choose_picture';
    if (activity.type === 'match') activity.type = 'match_picture_word';

    if (!recognizedTypes.includes(activity.type)) {
      activity.type = 'card_choices';
    }

    // 1. VOCABULARY CARDS
    if (activity.type === 'vocabulary_cards') {
      if (!Array.isArray(activity.items) || !activity.items.length) {
        activity.items = [
          { label: 'book', icon: 'book' },
          { label: 'desk', icon: 'desk' },
          { label: 'chair', icon: 'chair' },
          { label: 'bag', icon: 'bag' },
          { label: 'pencil', icon: 'pencil' },
          { label: 'crayon', icon: 'crayon' }
        ];
      }
      activity.items = activity.items.slice(0, 6).map(it => ({
        label: text(it.label || it.word, 'etiqueta', 50) || 'item',
        icon: normalizeIcon(it.icon || it.label)
      }));
    }

    // 2. MATCH PICTURE TO WORD
    else if (activity.type === 'match_picture_word') {
      if (!Array.isArray(activity.pairs) || !activity.pairs.length) {
        activity.pairs = [
          { left: 'book', icon: 'book', right: 'book' },
          { left: 'chair', icon: 'chair', right: 'chair' }
        ];
      }
      activity.pairs = activity.pairs.slice(0, 5).map(p => ({
        left: text(p.left || p.word, 'izquierda', 50),
        icon: normalizeIcon(p.icon || p.left),
        right: text(p.right || p.word, 'derecha', 50)
      }));
    }

    // 3. MATCH LOCATION WORD (Spatial relations)
    else if (activity.type === 'match_location_word') {
      if (!Array.isArray(activity.items) || !activity.items.length) {
        activity.items = [
          { subject: 'book', reference: 'bag', relation: 'in', word: 'in' },
          { subject: 'book', reference: 'desk', relation: 'on', word: 'on' },
          { subject: 'book', reference: 'desk', relation: 'under', word: 'under' }
        ];
      }
      activity.items = activity.items.slice(0, 4).map(it => ({
        subject: normalizeIcon(it.subject || 'book'),
        reference: normalizeAnchor(it.reference, it.relation),
        relation: ['on', 'under', 'in', 'next_to', 'behind'].includes(it.relation) ? it.relation : 'on',
        word: text(it.word || it.relation, 'palabra', 30)
      }));
    }

    // 4. LISTEN & CHOOSE PICTURE
    else if (activity.type === 'listen_choose_picture' || activity.type === 'card_choices') {
      if (!Array.isArray(activity.items) || !activity.items.length) {
        activity.items = [
          {
            teacherPrompt: 'Listen and choose the correct picture.',
            options: [{ label: 'Option A' }, { label: 'Option B' }],
            answerIndex: 0
          }
        ];
      }
      activity.items = activity.items.slice(0, 4).map((item, itemIdx) => {
        item.teacherPrompt = text(item.teacherPrompt, 'guion', 300) || `Item ${itemIdx + 1}: Listen to the audio prompt.`;
        if (!Array.isArray(item.options) || item.options.length < 2) {
          item.options = [{ label: 'Option A' }, { label: 'Option B' }];
        }
        item.options = item.options.slice(0, 4).map((opt, optIdx) => {
          const letter = String.fromCharCode(65 + optIdx);
          const label = text(opt.label || opt.text, 'etiqueta', 100) || `Option ${letter}`;
          const subtext = text(opt.subtext || opt.detail || opt.price, 'subtexto', 80);
          const iconName = opt.icon ? normalizeIcon(opt.icon) : null;
          let pos = (opt.position || 'none').toLowerCase().replace(/\s+/g, '_');
          if (!['none', 'on', 'under', 'in', 'next_to', 'behind'].includes(pos)) pos = 'none';
          const anchor = pos !== 'none' ? normalizeAnchor(opt.anchor, pos, item.teacherPrompt + ' ' + label) : undefined;

          return {
            letter,
            label,
            ...(subtext ? { subtext } : {}),
            ...(iconName ? { icon: iconName } : {}),
            ...(pos !== 'none' ? { position: pos, anchor } : {})
          };
        });
        if (!Number.isInteger(item.answerIndex) || item.answerIndex < 0 || item.answerIndex >= item.options.length) {
          item.answerIndex = 0;
        }
        return item;
      });
    }

    // 5. LISTEN & MATCH PRICE
    else if (activity.type === 'listen_match_price' || activity.type === 'matching') {
      if (!Array.isArray(activity.pairs) || activity.pairs.length < 2) {
        activity.pairs = [
          { left: 'Pineapple', icon: 'pineapple', right: '$2.50' },
          { left: 'Apple', icon: 'apple', right: '$1.00' }
        ];
      }
      activity.pairs = activity.pairs.slice(0, 5).map(p => ({
        left: text(p.left || p.fruit || p.item, 'columna izquierda', 60),
        right: text(p.right || p.price, 'precio', 30),
        icon: normalizeIcon(p.icon || p.left)
      }));
      activity.teacherScript = text(activity.teacherScript, 'guion docente', 400);
    }

    // 6. SHARED READING PAGE
    else if (activity.type === 'shared_reading_page') {
      if (!Array.isArray(activity.scenes) || !activity.scenes.length) {
        activity.scenes = [
          { num: 1, text: 'Look on the desk.', subject: 'book', reference: 'desk', relation: 'on' },
          { num: 2, text: 'Look under the chair.', subject: 'book', reference: 'chair', relation: 'under' },
          { num: 3, text: 'Look in the bag.', subject: 'book', reference: 'bag', relation: 'in' }
        ];
      }
      activity.scenes = activity.scenes.slice(0, 3).map((sc, sci) => ({
        num: sci + 1,
        text: text(sc.text, 'texto', 140) || 'Look carefully.',
        subject: normalizeIcon(sc.subject || 'book'),
        reference: normalizeAnchor(sc.reference, sc.relation),
        relation: ['on', 'under', 'in', 'next_to', 'behind'].includes(sc.relation) ? sc.relation : 'on'
      }));
    }

    // 7. TABLE CHECKLIST
    else if (activity.type === 'table_checklist') {
      if (!Array.isArray(activity.headers) || activity.headers.length < 2) {
        activity.headers = ['Fruit / Item', 'Heard in Audio?', 'Price'];
      }
      activity.headers = activity.headers.slice(0, 4).map(h => text(h, 'encabezado', 60));
      if (!Array.isArray(activity.rows) || !activity.rows.length) {
        activity.rows = [
          { col1: 'Pineapple', col2: '[ ] Yes   [ ] No', col3: '$2.50' },
          { col1: 'Apple', col2: '[ ] Yes   [ ] No', col3: '$1.00' }
        ];
      }
      activity.rows = activity.rows.slice(0, 6).map(r => ({
        col1: text(r.col1 || r.item || r[0], 'col1', 80),
        col2: text(r.col2 || r.status || r[1], 'col2', 80),
        col3: text(r.col3 || r.detail || r[2], 'col3', 80)
      }));
      activity.teacherScript = text(activity.teacherScript, 'guion docente', 400);
    }

    // 8. OPEN DRAWING
    else if (activity.type === 'open_drawing' || activity.type === 'draw_write') {
      activity.prompt = text(activity.prompt, 'consigna', 320) || 'Draw or write your response.';
      activity.teacherGuide = text(activity.teacherGuide, 'orientación docente', 600) || 'Observe student participation and provide scaffolding.';
    }

    return activity;
  });

  // Rubric
  if (!Array.isArray(pack.rubric) || !pack.rubric.length) {
    pack.rubric = [
      { criterion: 'Demonstrates target skill in context', independent: 'Completes tasks accurately and fluently without support.', withSupport: 'Completes tasks with occasional prompts and repetitions.', emerging: 'Requires continuous modeling and direct teacher assistance.' }
    ];
  }
  pack.rubric = pack.rubric.slice(0, 4).map(row => ({
    criterion: text(row.criterion, 'criterio', 160) || 'Target Learning Objective',
    independent: text(row.independent, 'independiente', 160) || '90-100% accuracy and independence.',
    withSupport: text(row.withSupport, 'con apoyo', 160) || 'Achieves objective with verbal/visual scaffolding.',
    emerging: text(row.emerging, 'en desarrollo', 160) || 'Beginning to recognize target structures.'
  }));

  // Timing
  if (!pack.timing) {
    pack.timing = {
      warmUp: '10 min · Vocabulary review & context setting',
      presentation: '8 min · Target language demonstration & modeling',
      guidedPractice: '12 min · Guided student activities with peer support',
      performance: '10 min · Individual/pair performance task',
      reflection: '5 min · Formative check and self-evaluation'
    };
  }

  return pack;
}

export function latestAoa(plans) {
  return plans.filter(plan => plan.type === 'planner' || plan.type === 'lessonplanner').sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))[0] || null;
}

const getClientApiKey = () => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) {
      const k = import.meta.env.VITE_GEMINI_API_KEY;
      if (k && k !== 'your_gemini_api_key' && k.trim()) return k;
    }
  } catch {}
  return null;
};

export async function generateActivityPack(source, signal) {
  const srcText = typeof source === 'string' ? source : (source?.text || '');

  // 1. Zero-Token Direct Extraction:
  // If the input has lesson planning indicators (e.g. EduGen Lesson Planner HTML or docx text),
  // parse it directly into tangible 3-page activities according to the stages!
  const hasStages = /stage\s*[1-6]|lesson\s*planner|warm-?up|specific\s*objective|learning\s*outcomes/i.test(srcText);
  if (hasStages && !source.forceAi) {
    try {
      const directPack = parseAoaLessonPlan(srcText, {
        grade: source.grade,
        title: source.title,
        scenario: source.scenario
      });
      if (directPack && directPack.page1 && directPack.page2 && directPack.page3) {
        return validatePack(directPack);
      }
    } catch (err) {
      console.warn('Direct parse failed, falling back to AI:', err);
    }
  }

  // 2. AI Fallback with strict 3-Page Pedagogical Blueprint Schema
  const prompt = `You are an elite educational materials author for the Panama MEDUCA English curriculum under the Action-Oriented Approach (AOA).
Based directly on the provided lesson, extract and generate a tangible, classroom-ready 3-PAGE Activity Workbook according to each stage of the lesson:

- PAGE 1: Discovery & Linguistic Input (Stage 1 Warm-up, Key Vocabulary Word Bank, Target Communicative Language Frame, Activity 1: Listen & Circle / Identify).
- PAGE 2: Guided Practice & Task Performance (Stage 3 Guided Practice Activity 2: Listen & Match items to prices/details, Activity 3: Dialogue Cloze with Word Bank, Activity 4: Performance Task with drawing/ruled writing lines).
- PAGE 3: Formative Assessment & Teacher Resource (Stage 5 Student Exit Ticket Quiz, Stage 6 Self-Assessment Scale, Teacher Read-Aloud Scripts for class, Official Answer Key, and MEDUCA 3-Level Rubric).

SCHEMA REQUIREMENT (Return strictly valid JSON):
{
  "title": "Lesson Theme / Title",
  "grade": "e.g., 4th Grade",
  "skill": "e.g., Listening & Speaking",
  "scenario": "Authentic context",
  "objective": "Target specific objective",
  "page1": {
    "wordBank": [
      { "word": "Pineapple", "pos": "noun", "example": "How much is the pineapple?", "icon": "pineapple" }
    ],
    "languageFrame": {
      "question": "How much is the [item]?",
      "answer": "It's [price] dollars."
    },
    "activity1": {
      "title": "Activity 1: Listen & Circle",
      "instruction": "Listen and circle the words heard:",
      "words": ["pineapple", "apple", "banana", "mango", "market", "dollar"]
    }
  },
  "page2": {
    "activity2": {
      "title": "Activity 2: Listen & Match",
      "instruction": "Draw a line to match each item with its price:",
      "pairs": [
        { "item": "Pineapple", "detail": "$3.00", "icon": "pineapple" }
      ]
    },
    "activity3": {
      "title": "Activity 3: Dialogue Cloze",
      "instruction": "Complete the dialogue using the word bank:",
      "wordBank": ["pineapple", "three", "dollar", "banana", "please"],
      "dialogue": [
        { "speaker": "Seller", "text": "Hello! Welcome to the market!" },
        { "speaker": "Buyer", "text": "How much is the pineapple?" }
      ]
    },
    "activity4": {
      "title": "Activity 4: Performance Production Task",
      "instruction": "Listen to the dictation and draw/write the items and prices:"
    }
  },
  "page3": {
    "exitTicket": {
      "title": "Student Exit Ticket",
      "questions": [
        { "prompt": "1. Question text?", "options": ["A", "B"], "correct": "A" }
      ],
      "selfAssessment": [
        { "text": "I can identify the target words.", "stars": 3 }
      ]
    },
    "teacherGuide": {
      "title": "Teacher Read-Aloud Scripts & Resources",
      "scripts": [
        { "stage": "Stage 2 Presentation Audio", "text": "Exact verbatim dialogue transcript..." },
        { "stage": "Stage 4 Performance Dictation", "text": "Exact dictation script..." },
        { "stage": "Stage 5 Assessment Quiz Script", "text": "Exact quiz script..." }
      ],
      "answerKey": [
        { "item": "Activity 1", "answer": "All target words circled." },
        { "item": "Activity 2", "answer": "Pineapple -> $3.00, Apple -> $1.00" },
        { "item": "Activity 3", "answer": "1. pineapple  2. three" },
        { "item": "Exit Ticket Quiz", "answer": "1. A  2. True  3. B" }
      ],
      "rubric": [
        {
          "criterion": "Listening Comprehension",
          "independent": "Identifies all items and prices accurately without support.",
          "withSupport": "Identifies items with 1-2 prompts.",
          "emerging": "Requires direct teacher assistance."
        }
      ]
    }
  }
}`;

  const parts = [{ text: source.text || 'Use the attached lesson context.' }];
  if (source.media) parts.push({ inlineData: source.media });

  const payload = {
    contents: [{ parts }],
    systemInstruction: { parts: [{ text: prompt }] },
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.3,
      maxOutputTokens: 14000
    }
  };

  const clientApiKey = getClientApiKey();
  const endpoint = clientApiKey
    ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${clientApiKey}`
    : '/api/gemini';

  let response;
  for (let attempt = 1; attempt <= 3; attempt++) {
    response = await fetch(endpoint, {
      method: 'POST',
      signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) break;

    // Retry on temporary 503 high demand or 429 rate limit
    if ((response.status === 503 || response.status === 429) && attempt < 3) {
      await new Promise(r => setTimeout(r, attempt * 1200));
      continue;
    }
    break;
  }

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`No se pudieron generar los recursos (${response.status}): ${errText || 'Error de conexión'}`);
  }

  const data = await response.json();
  const raw = data.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || '';
  let pack;
  try {
    pack = JSON.parse(raw.replace(/^```(?:json)?\s*|```$/g, ''));
  } catch {
    throw new Error('La IA devolvió una respuesta incompleta. Por favor intenta de nuevo.');
  }

  if (pack.error) throw new Error(String(pack.error).slice(0, 250));
  pack._usedAi = true;
  return validatePack(pack);
}
