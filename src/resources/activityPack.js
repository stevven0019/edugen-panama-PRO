export const ICONS = ['book','bag','desk','chair','pencil','crayon','ball','apple','tree','sun','house','fish','flower','pineapple','banana','orange','watermelon','mango'];

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
  return ICONS.includes(clean) ? clean : 'book';
}

export function normalizeAnchor(anchor, position = 'none', contextText = '') {
  if (anchor && typeof anchor === 'string') {
    let clean = anchor.toLowerCase().trim();
    if (clean === 'table') clean = 'desk';
    if (clean === 'box') clean = 'bag';
    if (['desk', 'bag', 'chair'].includes(clean)) return clean;
  }
  if (position === 'in') return 'bag';
  if ((contextText || '').toLowerCase().includes('chair')) return 'chair';
  return 'desk';
}

export function validatePack(pack) {
  if (!pack || typeof pack !== 'object') throw new Error('No se recibió un cuaderno válido.');
  
  pack.title = text(pack.title, 'title', 140) || 'Activity Workbook';
  pack.grade = text(pack.grade, 'grade', 60) || 'Grade';
  pack.skill = text(pack.skill, 'skill', 60) || 'English';
  pack.lessonTitle = text(pack.lessonTitle, 'lessonTitle', 160) || pack.title;
  pack.color_policy = pack.color_policy || 'vocabulary_only';

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
  const prompt = `You are an elite educational materials author for the Panama MEDUCA English curriculum under the Action-Oriented Approach (AOA).
Create a REAL, HIGH-QUALITY, CLASSROOM-READY printable English Activity Workbook and Formative Assessment Rubric based directly on the provided lesson.

CRITICAL INSTRUCTIONS BASED ON THE SPECIFICATION ARCHITECTURE:

1. FOR PRE-K & KINDER (e.g. "Where Is Your Book?"):
   - Primary Skill: Listening / Shared Reading.
   - Do NOT require independent reading or writing from the student!
   - Color Policy: "vocabulary_only" (Page 2 vocabulary is in color; all activity pages are in clean monochrome outline for easy school photocopying).
   - Use these exact templates:
     * Activity 1: "vocabulary_cards" (6 target objects: book, desk, chair, bag, pencil, crayon).
     * Activity 2: "listen_choose_picture" (3 rows of 2 spatial choices: e.g. book on desk vs under desk, pencil in bag vs next to bag).
     * Activity 3: "shared_reading_page" (3 illustrated scenes: 1. Look on the desk. 2. Look under the chair. 3. Look in the bag.).
     * Activity 4: "open_drawing" (Listen and draw a book under the desk).
   - Include teacher timing (50 min total: Warm-up 10m, Presentation 8m, Guided 12m, Performance 10m, Check 5m, Reflection 5m).
   - Verbatim Teacher Scripts (Read Aloud) and observation rubric checklist.

2. FOR PRIMARY & SECONDARY (e.g. 4th Grade "How Much Is the Pineapple?"):
   - Primary Skill: Listening / Vocabulary / Speaking.
   - Real-world authentic content: market fruits (pineapple, apple, banana, orange, watermelon), real consistent prices in USD ($2.50, $1.00, $0.50, $0.75).
   - Use these exact templates:
     * Activity 1: "listen_match_price" (fruits matching with price cards).
     * Activity 2: "table_checklist" (Shopping list with Fruit, Heard in Audio [Yes/No], and Price).
     * Activity 3: "dialogue_cloze" or "card_choices" (Market dialogue between Vendor and Customer with exact Teacher Script).
   - Provide verbatim teacher read-aloud dialogue script with exact pricing and quantities.

3. SCHEMA REQUIREMENT (Return strictly valid JSON, no markdown outside):
{
  "title": "Title of the Workbook",
  "grade": "e.g., Kinder or 4th Grade",
  "skill": "e.g., Listening",
  "lessonTitle": "Theme and Lesson Name",
  "color_policy": "vocabulary_only",
  "timing": {
    "warmUp": "10 min · Activity description",
    "presentation": "8 min · Activity description",
    "guidedPractice": "12 min · Activity description",
    "performance": "10 min · Activity description",
    "reflection": "5 min · Activity description"
  },
  "activities": [
    ... 3 to 4 activities matching the template library above ...
  ],
  "rubric": [
    {
      "criterion": "Target Skill Performance Criterion",
      "independent": "Mastery description without support",
      "withSupport": "Description with verbal/visual scaffolding",
      "emerging": "Beginning to recognize target language"
    }
  ]
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
  return validatePack(pack);
}
