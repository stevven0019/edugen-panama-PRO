export const ICONS = ['book','bag','desk','chair','pencil','crayon','ball','apple','tree','sun','house','fish','flower'];

const text = (value, name, max = 600) => {
  if (typeof value !== 'string' || !value.trim()) return '';
  return value.trim().slice(0, max);
};

export function normalizeIcon(icon) {
  if (!icon || typeof icon !== 'string') return 'book';
  let clean = icon.toLowerCase().trim().replace(/s$/, '');
  if (clean === 'pencile') clean = 'pencil';
  if (clean === 'table') return 'desk';
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

  if (!Array.isArray(pack.activities) || pack.activities.length < 2) {
    throw new Error('El cuaderno debe tener al menos 2 actividades.');
  }

  pack.activities = pack.activities.slice(0, 5).map((activity, idx) => {
    activity.title = text(activity.title, 'título', 140) || `Activity ${idx + 1}`;
    activity.instruction = text(activity.instruction, 'instrucción', 280) || 'Follow the instructions.';

    // Default to card_choices if not recognized
    const recognizedTypes = ['card_choices', 'picture_choice', 'table_checklist', 'matching', 'match', 'dialogue_cloze', 'read_answer', 'draw_write'];
    if (!recognizedTypes.includes(activity.type)) {
      activity.type = 'card_choices';
    }
    if (activity.type === 'picture_choice') activity.type = 'card_choices';
    if (activity.type === 'match') activity.type = 'matching';

    // 1. CARD CHOICES / LISTENING SELECTION
    if (activity.type === 'card_choices') {
      if (!Array.isArray(activity.items) || !activity.items.length) {
        activity.items = [
          {
            teacherPrompt: 'Listen and choose the correct option.',
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
        item.options = item.options.slice(0, 3).map((opt, optIdx) => {
          const letter = String.fromCharCode(65 + optIdx);
          const label = text(opt.label || opt.text, 'etiqueta', 100) || `Option ${letter}`;
          const subtext = text(opt.subtext || opt.detail || opt.price, 'subtexto', 80);
          const iconName = opt.icon ? normalizeIcon(opt.icon) : null;
          let pos = (opt.position || 'none').toLowerCase().replace(/\s+/g, '_');
          if (!['none', 'on', 'under', 'in', 'next_to'].includes(pos)) pos = 'none';
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

    // 2. TABLE CHECKLIST / INFORMATION GRID
    if (activity.type === 'table_checklist') {
      if (!Array.isArray(activity.headers) || activity.headers.length < 2) {
        activity.headers = ['Item / Detail', 'Heard in Audio?', 'Quantity / Notes'];
      }
      activity.headers = activity.headers.slice(0, 4).map(h => text(h, 'encabezado', 60));
      if (!Array.isArray(activity.rows) || !activity.rows.length) {
        activity.rows = [
          { col1: 'Target Item 1', col2: '[ ] Yes   [ ] No', col3: '$2.50' },
          { col1: 'Target Item 2', col2: '[ ] Yes   [ ] No', col3: '$1.00' }
        ];
      }
      activity.rows = activity.rows.slice(0, 6).map(r => ({
        col1: text(r.col1 || r.item || r[0], 'col1', 80),
        col2: text(r.col2 || r.status || r[1], 'col2', 80),
        col3: text(r.col3 || r.detail || r[2], 'col3', 80)
      }));
      activity.teacherScript = text(activity.teacherScript, 'guion docente', 400);
    }

    // 3. MATCHING
    if (activity.type === 'matching') {
      if (!Array.isArray(activity.pairs) || activity.pairs.length < 2) {
        activity.pairs = [
          { left: 'Question / Item 1', right: 'Answer / Description 1' },
          { left: 'Question / Item 2', right: 'Answer / Description 2' }
        ];
      }
      activity.pairs = activity.pairs.slice(0, 5).map(p => ({
        left: text(p.left || p.word || p.question, 'columna izquierda', 100),
        right: text(p.right || p.definition || p.answer, 'columna derecha', 100),
        ...(p.icon ? { icon: normalizeIcon(p.icon) } : {})
      }));
    }

    // 4. DIALOGUE CLOZE / FILL IN THE BLANK
    if (activity.type === 'dialogue_cloze') {
      if (!Array.isArray(activity.wordBank) || !activity.wordBank.length) {
        activity.wordBank = ['pineapple', 'dollars', 'market', 'cents'];
      }
      activity.wordBank = activity.wordBank.slice(0, 8).map(w => text(w, 'banco de palabras', 40));
      if (!Array.isArray(activity.lines) || !activity.lines.length) {
        activity.lines = [
          { speaker: 'Vendor', text: 'Good morning! How can I help you?' },
          { speaker: 'Customer', text: 'How much is the _______?' }
        ];
      }
      activity.lines = activity.lines.slice(0, 6).map(l => ({
        speaker: text(l.speaker || 'Person', 'hablante', 30),
        text: text(l.text || l.sentence, 'línea de diálogo', 180)
      }));
      activity.teacherScript = text(activity.teacherScript, 'guion docente', 400);
    }

    // 5. READ & ANSWER
    if (activity.type === 'read_answer') {
      activity.passage = text(activity.passage, 'lectura', 1200) || 'Read the scenario text carefully.';
      if (!Array.isArray(activity.questions) || !activity.questions.length) {
        activity.questions = [{ question: 'What is the main topic discussed?', answer: 'The situation described above.' }];
      }
      activity.questions = activity.questions.slice(0, 4).map((q, qIdx) => ({
        question: text(q.question, 'pregunta', 200) || `Question ${qIdx + 1}`,
        answer: text(q.answer, 'respuesta', 280) || 'Expected answer.'
      }));
    }

    // 6. DRAW & WRITE / SPEAKING TASK
    if (activity.type === 'draw_write') {
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

  // Teacher guide timing
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
Your task is to create a REAL, HIGH-QUALITY, CLASSROOM-READY printable English Activity Workbook and Formative Assessment Rubric based directly on the provided lesson.

CRITICAL INSTRUCTIONS BY GRADE AND REALISTIC SCENARIOS:
1. RELEVANT REAL-WORLD CONTENT:
   - The activities MUST relate 100% to the specific scenario, theme, lesson, and skill provided in the context (e.g., if the topic is "How much is the pineapple?", generate real market/fruit/shopping activities, real prices like $2.50, $1.75, realistic dialogues, shopping lists, and price-matching, NOT abstract wireframe doodles!).
   - Do NOT use generic childish icons unless the grade is explicitly Pre-K or Kinder.

2. ACTIVITY FORMATS TO USE:
   Choose 3 to 4 varied, engaging activities from these supported pedagogical types:
   a) "card_choices" (Listening / Reading selection):
      - 2 to 3 cards per item with realistic options:
        e.g., Option A: label: "Pineapple", subtext: "$2.50"
        Option B: label: "Watermelon", subtext: "$3.75"
        Option C: label: "Banana", subtext: "$0.50"
      - For Listening, include the exact "teacherPrompt" the teacher must read aloud (e.g. "Customer: Good morning! How much is the fresh pineapple? Vendor: The pineapple is two dollars and fifty cents.").
      - Only use "icon" and "position" (on/under/in/next_to) if the grade is Pre-K/Kinder with classroom objects.
   b) "table_checklist" (Listening / Analysis grid):
      - Perfect for shopping lists, daily routines, character actions, survey tables:
        headers: ["Fruit / Item", "Price Heard in Audio", "In Stock? [Yes / No]"]
        rows: [
          { "col1": "Pineapple", "col2": "$2.50", "col3": "[ ] Yes   [ ] No" },
          { "col1": "Papaya", "col2": "$1.50", "col3": "[ ] Yes   [ ] No" },
          { "col1": "Mangoes (bag)", "col2": "$2.00", "col3": "[ ] Yes   [ ] No" }
        ]
        teacherScript: "The full reading passage or dialogue teacher speaks."
   c) "matching" (Connecting pairs):
      - Questions to answers, food items to prices, terms to definitions, or conversational rejoinders.
        pairs: [
          { "left": "How much is the pineapple?", "right": "It is two dollars and fifty cents." },
          { "left": "Where are the ripe bananas?", "right": "They are next to the apples." },
          { "left": "Can I have two papayas?", "right": "Here you go, that is three dollars." }
        ]
   d) "dialogue_cloze" (Fill in the blanks with Word Bank):
      - Real authentic dialogue with a Word Bank box:
        wordBank: ["pineapple", "change", "expensive", "dollars"]
        lines: [
          { "speaker": "Maria", "text": "Excuse me, how much is this _______?" },
          { "speaker": "Vendor", "text": "That one is three _______." }
        ]
        teacherScript: "Complete dialogue for the teacher to read."
   e) "read_answer" (Reading & comprehension questions with lined answer spaces):
      - Authentic scenario passage + 2-3 questions with clear answer keys.
   f) "draw_write" (Task-based production / Role-play / Drawing):
      - For primary/secondary: create a market stall sign, write a short grocery list dialogue, or design a menu with prices.

3. DEDICATED TEACHER SECTION:
   - "timing": Realistic minute breakdown: warmUp (10 min), presentation (8 min), guidedPractice (12 min), performance (10 min), reflection (5 min).
   - Verbatim "Teacher Scripts" with the exact sentences to read out loud.
   - Complete Answer Key.
   - Formative Rubric with 2 to 3 criteria aligned to the Panama AOA curriculum standards for this grade level.

RETURN VALID JSON ONLY matching this structure:
{
  "title": "Clear Catchy Title (e.g., At the Fruit Market: How Much Is the Pineapple?)",
  "grade": "Grade from lesson (e.g., 4th Grade)",
  "skill": "Skill from lesson (e.g., Listening)",
  "lessonTitle": "Theme and Lesson Name",
  "timing": {
    "warmUp": "10 min · Activity description",
    "presentation": "8 min · Activity description",
    "guidedPractice": "12 min · Activity description",
    "performance": "10 min · Activity description",
    "reflection": "5 min · Activity description"
  },
  "activities": [
    ... 3 to 4 activities using the types described above ...
  ],
  "rubric": [
    {
      "criterion": "Listening for Specific Information (Prices & Quantities)",
      "independent": "Identifies prices, fruit items and quantities with 90-100% accuracy.",
      "withSupport": "Identifies target items with 1-2 repetitions or visual cues.",
      "emerging": "Requires direct teacher demonstration and translation support."
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
      temperature: 0.35,
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

    // Automatic retry on temporary 503 high demand or 429 rate limit
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
