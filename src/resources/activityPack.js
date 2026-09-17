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
          { left: 'Concept A', icon: 'book', right: 'Definition A' },
          { left: 'Concept B', icon: 'star', right: 'Definition B' }
        ];
      }
      activity.pairs = activity.pairs.slice(0, 5).map(p => ({
        left: text(p.left || p.item, 'columna izquierda', 60),
        right: text(p.right || p.detail || p.description, 'detalle', 60),
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
        activity.headers = ['Target Concept', 'Observed in Context', 'Key Feature'];
      }
      activity.headers = activity.headers.slice(0, 4).map(h => text(h, 'encabezado', 60));
      if (!Array.isArray(activity.rows) || !activity.rows.length) {
        activity.rows = [
          { col1: 'Item 1', col2: '[ ] Yes   [ ] No', col3: 'Feature 1' },
          { col1: 'Item 2', col2: '[ ] Yes   [ ] No', col3: 'Feature 2' }
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
  const isFileUpload = Boolean(source?.isFile || source?.media || source?.forceAi);

  // 1. Direct Extraction only for locally formatted EduGen plans (never for custom uploads, which require AI):
  if (!isFileUpload) {
    const hasStages = /stage\s*[1-6]|lesson\s*planner|warm-?up|specific\s*objective|learning\s*outcomes/i.test(srcText);
    if (hasStages) {
      try {
        const directPack = parseAoaLessonPlan(srcText, {
          grade: source?.grade,
          title: source?.title,
          scenario: source?.scenario
        });
        if (directPack && directPack.page1 && directPack.page2 && directPack.page3) {
          return validatePack(directPack);
        }
      } catch (err) {
        console.warn('Direct parse not applicable, generating authentic pack via AI:', err);
      }
    }
  }

  // 2. AI Generation with strict 3-Page Pedagogical Blueprint Schema
  const prompt = `You are an elite educational materials designer for the Panama MEDUCA English curriculum under the Action-Oriented Approach (AOA).
Analyze the provided lesson thoroughly. Extract its exact grade, unit topic, scenario, and target competencies, and generate an authentic, classroom-ready 3-PAGE Activity Workbook.

CRITICAL PEDAGOGICAL RULES:
1. STRICT THEMATIC ALIGNMENT:
   - All activities, vocabulary words, dialogues, listening scripts, and questions MUST be 100% strictly aligned with the exact topic and scenario of the provided lesson.
   - NEVER default to fruit, market, shopping, or prices unless the uploaded lesson is explicitly and solely about buying food in a market.
   - For example, if the lesson is about "The Habitat of Wildlife" (Panama's Wildlife, 7th Grade), you MUST use wild animals (e.g. jaguar, harpy eagle, sloth, toucan), ecosystems (rainforest, canopy, ocean, mangrove), conservation concepts, and relevant communicative exchanges (e.g. asking where animals live or describing habitats).

2. 3-PAGE BLUEPRINT STRUCTURE:
   - PAGE 1: Discovery & Linguistic Input (Stage 1 Warm-up Key Vocabulary Word Bank of 6 authentic words with part of speech and example; Target Communicative Language Frame Q&A relevant to this lesson; Activity 1: Listen & Circle / Identify the target words).
   - PAGE 2: Guided Practice & Task Performance (Stage 3 Guided Practice Activity 2: Listen & Match 4 concept pairs e.g. Animal -> Habitat, Object -> Function, Term -> Description; Activity 3: Dialogue Cloze roleplay with 6-8 lines between two natural speakers appropriate for the topic; Activity 4: Performance Task with drawing area and ruled lines).
   - PAGE 3: Formative Assessment & Teacher Resource (Stage 5 Student Exit Ticket Quiz with 3 questions, Stage 6 Self-Assessment Scale, Teacher Read-Aloud Scripts for class, Official Answer Key, and MEDUCA 3-Level Rubric).

SCHEMA REQUIREMENT (Return strictly valid JSON):
{
  "title": "Exact Lesson Theme / Title from input",
  "grade": "Exact Grade from input (e.g., 7th Grade, 4th Grade)",
  "skill": "Target Skill Focus (e.g., Listening & Speaking, Reading & Writing)",
  "scenario": "Authentic Scenario from input",
  "objective": "Target Specific Objective from input",
  "page1": {
    "wordBank": [
      { "word": "TargetWord", "pos": "noun/verb/adj", "example": "Authentic context sentence using the word.", "icon": "tree/bird/animal/sun/book/etc" }
    ],
    "languageFrame": {
      "question": "Authentic target question pattern for this topic?",
      "answer": "Authentic target response pattern for this topic.",
      "exchange": "Speaker A: '...' ──> Speaker B: '...'"
    },
    "activity1": {
      "title": "Activity 1: Listen & Circle (Word Recognition)",
      "instruction": "Listen carefully as your teacher reads the target words. Circle each word you hear:",
      "words": ["word1", "word2", "word3", "word4", "word5", "word6"]
    }
  },
  "page2": {
    "activity2": {
      "title": "Activity 2: Listen & Match",
      "instruction": "Listen to the audio statements. Draw a line to match each item with its corresponding detail:",
      "pairs": [
        { "item": "TargetItem1", "detail": "Matching Detail 1", "icon": "tree" }
      ]
    },
    "activity3": {
      "title": "Activity 3: Authentic Dialogue Cloze",
      "instruction": "Complete the dialogue using words from the Word Bank below:",
      "wordBank": ["word1", "word2", "word3", "word4", "word5"],
      "dialogue": [
        { "speaker": "Role1", "text": "Sentence with or without [ blank ]..." },
        { "speaker": "Role2", "text": "Response..." }
      ]
    },
    "activity4": {
      "title": "Activity 4: Performance Production Task",
      "instruction": "Draw and complete the task based on the lesson topic:",
      "prompt": "Task Prompt..."
    }
  },
  "page3": {
    "exitTicket": {
      "title": "Student Exit Ticket (Quick Check)",
      "questions": [
        { "prompt": "1. Comprehension question?", "options": ["A) Option 1", "B) Option 2"], "correct": "A) Option 1" }
      ],
      "selfAssessment": [
        { "text": "I can identify the target vocabulary.", "stars": 3 }
      ]
    },
    "teacherGuide": {
      "title": "Teacher Read-Aloud Scripts & Resources",
      "scripts": [
        { "stage": "Stage 2 Presentation Audio", "text": "Verbatim audio script..." },
        { "stage": "Stage 4 Performance Dictation", "text": "Verbatim dictation script..." },
        { "stage": "Stage 5 Assessment Quiz Script", "text": "Verbatim quiz script..." }
      ],
      "answerKey": [
        { "item": "Activity 1", "answer": "Expected answers" },
        { "item": "Activity 2", "answer": "Matching pairs" },
        { "item": "Activity 3", "answer": "Cloze blanks" },
        { "item": "Exit Ticket Quiz", "answer": "Q1: A, Q2: True, Q3: B" }
      ],
      "rubric": [
        {
          "criterion": "Listening Comprehension & Target Vocabulary",
          "independent": "Identifies all key concepts accurately and fluently.",
          "withSupport": "Identifies key concepts with occasional teacher prompting.",
          "emerging": "Requires direct modeling and continuous assistance."
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
    let clean = raw.trim();
    const firstBrace = clean.indexOf('{');
    const lastBrace = clean.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      clean = clean.slice(firstBrace, lastBrace + 1);
    } else {
      clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
    }
    pack = JSON.parse(clean);
  } catch (err) {
    console.error('Failed to parse AI response as JSON:', err, raw);
    throw new Error('La IA devolvió una respuesta incompleta o en formato inesperado. Por favor intenta de nuevo.');
  }

  if (pack.error) throw new Error(String(pack.error).slice(0, 250));
  pack._usedAi = true;
  return validatePack(pack);
}
