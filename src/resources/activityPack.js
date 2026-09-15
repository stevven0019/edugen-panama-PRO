export const ICONS = ['book','bag','desk','chair','pencil','crayon','ball','apple','tree','sun','house','fish','flower'];

const text = (value, name, max = 500) => {
  if (typeof value !== 'string' || !value.trim()) return '';
  return value.trim().slice(0, max);
};

export function normalizeIcon(icon) {
  if (!icon || typeof icon !== 'string') return 'book';
  let clean = icon.toLowerCase().trim().replace(/s$/, ''); // singularize
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
  pack.lessonTitle = text(pack.lessonTitle, 'lessonTitle', 140) || pack.title;

  if (!Array.isArray(pack.activities) || pack.activities.length < 2) {
    throw new Error('El cuaderno debe tener al menos 2 actividades.');
  }

  // Sanitize and normalize activities
  pack.activities = pack.activities.slice(0, 6).map((activity, idx) => {
    activity.title = text(activity.title, 'título', 120) || `Activity ${idx + 1}`;
    activity.instruction = text(activity.instruction, 'instrucción', 250) || 'Follow the instructions.';

    if (!['picture_choice', 'match', 'read_answer', 'draw_write', 'listening_script_choice'].includes(activity.type)) {
      activity.type = 'read_answer';
    }

    if (activity.type === 'picture_choice') {
      if (!Array.isArray(activity.items) || !activity.items.length) {
        activity.items = [{ teacherPrompt: 'Listen and choose.', options: [{ icon: 'book', label: 'Book' }, { icon: 'pencil', label: 'Pencil' }], answerIndex: 0 }];
      }
      activity.items = activity.items.slice(0, 4).map((item, itemIdx) => {
        item.teacherPrompt = text(item.teacherPrompt, 'guion', 260) || `Item ${itemIdx + 1}: Listen carefully.`;
        if (!Array.isArray(item.options) || item.options.length < 2) {
          item.options = [{ icon: 'book', label: 'Option A' }, { icon: 'pencil', label: 'Option B' }];
        }
        item.options = item.options.slice(0, 3).map((opt) => {
          const icon = normalizeIcon(opt.icon);
          let pos = (opt.position || 'none').toLowerCase().replace(/\s+/g, '_');
          if (!['none', 'on', 'under', 'in', 'next_to'].includes(pos)) pos = 'none';
          const anchor = pos !== 'none' ? normalizeAnchor(opt.anchor, pos, item.teacherPrompt + ' ' + (opt.label || '')) : undefined;
          return {
            icon,
            position: pos,
            ...(anchor ? { anchor } : {}),
            label: text(opt.label, 'descripción', 100) || icon
          };
        });
        if (!Number.isInteger(item.answerIndex) || item.answerIndex < 0 || item.answerIndex >= item.options.length) {
          item.answerIndex = 0;
        }
        return item;
      });
    }

    if (activity.type === 'match') {
      if (!Array.isArray(activity.items) || activity.items.length < 2) {
        activity.items = [{ icon: 'book', word: 'book' }, { icon: 'pencil', word: 'pencil' }];
      }
      activity.items = activity.items.slice(0, 4).map(item => ({
        icon: normalizeIcon(item.icon),
        word: text(item.word, 'palabra', 50) || 'item'
      }));
    }

    if (activity.type === 'read_answer') {
      activity.passage = text(activity.passage, 'lectura', 1200) || 'Read the text and answer the questions.';
      if (!Array.isArray(activity.questions) || !activity.questions.length) {
        activity.questions = [{ question: 'What is the main topic?', answer: 'The topic described in the text.' }];
      }
      activity.questions = activity.questions.slice(0, 4).map((q, qIdx) => ({
        question: text(q.question, 'pregunta', 180) || `Question ${qIdx + 1}`,
        answer: text(q.answer, 'respuesta', 260) || 'Sample response.'
      }));
    }

    if (activity.type === 'draw_write') {
      activity.prompt = text(activity.prompt, 'consigna', 300) || 'Draw and write your response.';
      activity.teacherGuide = text(activity.teacherGuide, 'orientación docente', 600) || 'Guide students through this activity.';
    }

    return activity;
  });

  if (!Array.isArray(pack.rubric) || !pack.rubric.length) {
    pack.rubric = [
      { criterion: 'Demonstrates target skill', independent: 'Completes tasks with ease and precision.', withSupport: 'Completes tasks with occasional prompts.', emerging: 'Needs continuous guidance.' }
    ];
  }
  pack.rubric = pack.rubric.slice(0, 4).map(row => ({
    criterion: text(row.criterion, 'criterio', 140) || 'Target Objective',
    independent: text(row.independent, 'independiente', 160) || 'Shows complete understanding.',
    withSupport: text(row.withSupport, 'con apoyo', 160) || 'Shows understanding with teacher guidance.',
    emerging: text(row.emerging, 'en desarrollo', 160) || 'Developing initial understanding.'
  }));

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
  const prompt = `You are an expert curriculum designer and materials writer for the Panama MEDUCA English curriculum (Action-Oriented Approach / AOA).
Create a complete, classroom-ready English printable Activity Pack and Assessment Rubric grounded strictly in the provided AOA lesson context.

CRITICAL INSTRUCTIONS BY SKILL AND GRADE:
1. IDENTIFY THE SKILL:
   - If the lesson skill is LISTENING: All student activities MUST be authentic listening comprehension tasks.
     * Every listening item MUST include an explicit "teacherPrompt" (the exact spoken sentence, dialogue, or command the teacher will read out loud in class).
     * The student workbook must only show the options/cues to circle, number, match, or point to (NEVER reveal the answer text or spoken sentence to the student).
     * Include TPR ("Listen and do / move"), sequential numbering, or circling pictures.
   - If the lesson skill is SPEAKING: Focus on oral production, partner talk, guided role-play dialogues, pronunciation chants, and picture description.
   - If the lesson skill is READING: Leveled texts, reading comprehension questions, sequencing story events, and contextual vocabulary.
   - If the lesson skill is WRITING: Guided sentence building, tracing (for early years), fill-in-the-blanks, graphic organizers, and paragraph composition.

2. GRADE-LEVEL PEDAGOGY:
   - Pre-K and Kinder: NEVER require reading or writing from the student! Use visual choices, pointing, circling, gestures, and drawing. Use icons from the supported list: ${ICONS.join(', ')}. Supported positions: on, under, in, next_to (with anchors: desk, chair, bag).
   - 1st to 6th Grade: Word banks, illustrated prompts, sentence completion, matching, short passages.
   - 7th to 12th Grade: Authentic scenarios, contextualized texts, analytical questions, debate topics, formal rubrics.

3. SCHEMA REQUIREMENT (Return strictly valid JSON, no markdown outside):
{
  "title": "Short catchy title (e.g., Where Is Your Book?)",
  "grade": "e.g., Kinder, 5th Grade, 10th Grade",
  "skill": "e.g., Listening, Speaking, Reading, Writing",
  "lessonTitle": "Lesson and Theme title",
  "activities": [
    {
      "type": "picture_choice",
      "title": "Activity Title",
      "instruction": "Student instruction (e.g. Listen and circle the picture)",
      "items": [
        {
          "teacherPrompt": "The sentence/prompt teacher reads aloud (e.g., The book is under the chair. Where is the book?)",
          "options": [
            { "icon": "book", "position": "under", "anchor": "chair", "label": "Book under the chair" },
            { "icon": "book", "position": "on", "anchor": "chair", "label": "Book on the chair" }
          ],
          "answerIndex": 0
        }
      ]
    },
    {
      "type": "match",
      "title": "Activity Title",
      "instruction": "Match each picture with its word",
      "items": [
        { "icon": "pencil", "word": "pencil" },
        { "icon": "bag", "word": "bag" }
      ]
    },
    {
      "type": "read_answer",
      "title": "Activity Title",
      "instruction": "Read and answer the questions",
      "passage": "Short reading passage or transcript...",
      "questions": [
        { "question": "Where did Anna put her notebook?", "answer": "Inside her school bag." }
      ]
    },
    {
      "type": "draw_write",
      "title": "Activity Title",
      "instruction": "Draw or write your response",
      "prompt": "Prompt for the student",
      "teacherGuide": "Teacher observation instructions and expected student response."
    }
  ],
  "rubric": [
    {
      "criterion": "Target Skill Performance (e.g. Listening Comprehension)",
      "independent": "Identifies target language with 90-100% accuracy without support.",
      "withSupport": "Identifies target language with visual cues or repetition.",
      "emerging": "Requires direct demonstration and modeling."
    }
  ]
}

Provide 3 to 4 varied, age-appropriate activity pages aligned specifically to the target skill.`;

  const parts = [{ text: source.text || 'Use the attached lesson context.' }];
  if (source.media) parts.push({ inlineData: source.media });

  const clientApiKey = getClientApiKey();
  let response;

  const payload = {
    contents: [{ parts }],
    systemInstruction: { parts: [{ text: prompt }] },
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.3,
      maxOutputTokens: 12000
    }
  };

  if (clientApiKey) {
    // Direct call in local development mode
    response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${clientApiKey}`, {
      method: 'POST',
      signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } else {
    // Vercel serverless proxy in production
    response = await fetch('/api/gemini', {
      method: 'POST',
      signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
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
