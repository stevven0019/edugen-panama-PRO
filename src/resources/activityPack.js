import { parseAoaLessonPlan, getScenarioOfficialNouns, isValidVocabWord } from './lessonParser.js';
import { getRealiaPhoto } from './realiaCatalog.js';
import {
  buildLessonContract,
  selectActivityPatterns,
  buildAOABlueprint,
  validateActivityPack,
  repairActivityPack,
  normalizeSkill,
  detectSkillFromText
} from './activityEngine.js';

export const ICONS = ['book','bag','desk','chair','pencil','crayon','ball','apple','tree','sun','house','fish','flower','pineapple','banana','orange','watermelon','mango','market','dollar','green','blue','red','yellow','purple','small','big'];

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

export function hydratePackPhotos(pack) {
  if (!pack || typeof pack !== 'object') return;

  if (pack.actionWorksheet) {
    if (Array.isArray(pack.actionWorksheet.part1?.items)) {
      pack.actionWorksheet.part1.items.forEach(item => {
        if (!item.photoUrl) {
          const candidate = item.word || item.item || item.label || '';
          const p = getRealiaPhoto(candidate);
          if (p) item.photoUrl = p;
        }
      });
    }
    if (Array.isArray(pack.actionWorksheet.part2?.items)) {
      pack.actionWorksheet.part2.items.forEach(item => {
        if (!item.photoUrl) {
          const candidate = item.subject || item.item || item.feature || item.label || '';
          const p = getRealiaPhoto(candidate);
          if (p) item.photoUrl = p;
        }
      });
    }
  }

  if (Array.isArray(pack.page1?.wordBank)) {
    pack.page1.wordBank.forEach(item => {
      if (!item.photoUrl) {
        const candidate = item.word || item.item || '';
        const p = getRealiaPhoto(candidate);
        if (p) item.photoUrl = p;
      }
    });
  }

  if (Array.isArray(pack.page2?.activity2?.pairs)) {
    pack.page2.activity2.pairs.forEach(pair => {
      if (!pair.photoUrl) {
        const candidate = pair.item || pair.left || '';
        const p = getRealiaPhoto(candidate);
        if (p) pair.photoUrl = p;
      }
    });
  }

  if (Array.isArray(pack.activities)) {
    pack.activities.forEach(act => {
      if (Array.isArray(act.items)) {
        act.items.forEach(item => {
          if (!item.photoUrl) {
            const candidate = item.label || item.word || item.icon || '';
            const p = getRealiaPhoto(candidate);
            if (p) item.photoUrl = p;
          }
        });
      }
      if (Array.isArray(act.pairs)) {
        act.pairs.forEach(pair => {
          if (!pair.photoUrl) {
            const candidate = pair.left || pair.item || pair.icon || '';
            const p = getRealiaPhoto(candidate);
            if (p) pair.photoUrl = p;
          }
        });
      }
    });
  }
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
          items: (pack.page1.wordBank || []).map(w => ({ label: w.word, icon: w.icon || w.word, photoUrl: w.photoUrl }))
        },
        {
          type: 'matching',
          title: pack.page2.activity2?.title || 'Matching Activity',
          instruction: pack.page2.activity2?.instruction || 'Match items.',
          pairs: (pack.page2.activity2?.pairs || []).map(p => ({ left: p.item, right: p.detail, icon: p.icon, photoUrl: p.photoUrl }))
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
    hydratePackPhotos(pack);
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

  hydratePackPhotos(pack);
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

function repairAndParseJson(raw) {
  if (!raw || typeof raw !== 'string') throw new Error('Empty AI response');
  let clean = raw.trim();
  clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();

  const firstBrace = clean.indexOf('{');
  const lastBrace = clean.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    clean = clean.slice(firstBrace, lastBrace + 1);
  }

  // 1. Try standard JSON.parse
  try {
    return JSON.parse(clean);
  } catch (e1) {
    // 2. Remove trailing commas before } or ]
    clean = clean.replace(/,\s*([}\]])/g, '$1');
    try {
      return JSON.parse(clean);
    } catch (e2) {
      // 3. Attempt to balance unclosed braces and brackets if cut off
      let openBraces = 0;
      let openBrackets = 0;
      let inString = false;
      let escaped = false;
      for (let i = 0; i < clean.length; i++) {
        const c = clean[i];
        if (escaped) {
          escaped = false;
          continue;
        }
        if (c === '\\') {
          escaped = true;
          continue;
        }
        if (c === '"') {
          inString = !inString;
          continue;
        }
        if (!inString) {
          if (c === '{') openBraces++;
          else if (c === '}') openBraces = Math.max(0, openBraces - 1);
          else if (c === '[') openBrackets++;
          else if (c === ']') openBrackets = Math.max(0, openBrackets - 1);
        }
      }
      if (inString) clean += '"';
      while (openBrackets > 0) {
        clean += ']';
        openBrackets--;
      }
      while (openBraces > 0) {
        clean += '}';
        openBraces--;
      }
      return JSON.parse(clean);
    }
  }
}

export async function generateActivityPack(source, signal) {
  const srcText = typeof source === 'string' ? source : (source?.text || '');
  const forceAi = Boolean(source?.forceAi);

  // 1. Build Lesson Contract (generador de actividades.txt)
  // lesson.skill is authoritative. Never assume lesson number = skill.
  const contract = buildLessonContract({
    lesson: typeof source === 'object' ? source : {},
    theme: source?.title || source?.theme,
    scenario: source?.scenario,
    grade: source?.grade,
    cefr: source?.cefr,
    skill: source?.skill,
    lessonNum: source?.lessonNum,
    themeType: source?.themeType,
    project21st: source?.project21st,
    scenarioData: source?.scenarioData || (typeof source === 'object' && source?.scenarioData) || null,
    rawText: srcText
  });
  const patterns = selectActivityPatterns(contract);
  const officialNouns = getScenarioOfficialNouns(contract.scenarioData);
  contract.officialNouns = officialNouns;

  // 2. Direct Extraction first:
  // If the lesson plan has AOA stages, warm-up, presentation, practice, production, or lesson metadata,
  // extract directly! This is instantaneous, reliable, costs 0 tokens, and matches the teacher's exact plan.
  if (!forceAi) {
    const hasStages = /stage\s*[1-6]|lesson\s*planner|warm-?up|presentation|practice|production|specific\s*objective|learning\s*outcomes|theme|scenario/i.test(srcText);
    if (hasStages || source?.isCurrent) {
      try {
        const directPack = parseAoaLessonPlan(srcText, contract);
        if (directPack && directPack.page1 && directPack.page2 && directPack.page3) {
          directPack._usedAi = false;
          const validation = validateActivityPack(directPack, contract);
          const finalPack = validation.pass ? directPack : repairActivityPack(directPack, validation.errors, contract);
          return validatePack(finalPack);
        }
      } catch (err) {
        console.warn('Direct parse not applicable, generating authentic pack via AI:', err);
      }
    }
  }

  // 3. AI Generation with strict 3-Page Pedagogical Blueprint Schema & Activity Contract
  const targetGrade = contract.grade;
  const targetCefr = contract.cefr;
  const targetSkill = contract.skill;

  const prompt = `EDUGEN PRO · MOTOR CURRICULAR AOA MEDUCA PANAMÁ
Eres el Diseñador Curricular Jefe de Inglés para el Ministerio de Educación de Panamá (MEDUCA) integrado en la plataforma EduGen Pro.
Tu tarea es generar o perfeccionar un CUADERNO DE ACTIVIDADES de 3 PÁGINAS bajo el Enfoque Orientado a la Acción (AOA) alineado estrictamente con el Marco Común Europeo de Referencia (CEFR/MCER 2020) y la currícula panameña.

CONTRATO PEDAGÓGICO DE LA LECCIÓN (generador de actividades.txt):
- Grado: ${targetGrade} (CEFR: ${targetCefr})
- Habilidad Foco (AUTHORITATIVE): ${targetSkill}
- Tema / Escenario: ${contract.scenario || contract.theme || 'Contexto Curricular'}
- Patrón Actividad 1: ${patterns.activity1.pattern}
- Patrón Actividad 2: ${patterns.activity2.pattern}
- Sustantivos Curriculares Oficiales del Escenario (OBLIGATORIOS): ${officialNouns.length ? officialNouns.join(', ') : (contract.vocabulary || []).join(', ') || 'pineapple, cassava, potatoes, money, market, price, store, cost, cashier'}
- Evidencia Primaria Requerida: ${contract.constraints.oral_evidence_required ? 'Producción e interacción oral en parejas' : contract.constraints.writing_as_primary_evidence ? 'Producción escrita y etiquetado' : contract.constraints.listening_comprehension_required ? 'Comprensión auditiva con guion de audio verbatim' : contract.constraints.reading_comprehension_required ? 'Decodificación visual y comprensión lectora' : 'Mediación interpersonal y proyecto del siglo XXI'}
${contract.project_21st ? `- Proyecto 21st Century Skills: ${contract.project_21st}` : ''}

REGLAS PEDAGÓGICAS OBLIGATORIAS:
0. COHERENCIA ESTRICTA DE VOCABULARIO (IDÉNTICO AL PÓSTER Y AL CURRÍCULO):
   - Las palabras de vocabulario seleccionadas para Word Bank, Activity 1, Activity 2 y diálogos DEBEN pertenecer exclusivamente a la lista oficial de sustantivos del escenario: [${officialNouns.length ? officialNouns.join(', ') : 'pineapple, cassava, potatoes, money, market, price, store, cost, cashier'}].
   - PROHIBICIÓN ABSOLUTA: JAMÁS utilices palabras abstractas o meta-conceptuales como 'number', 'numbers', 'digit', 'alphabet', 'grammar', 'stage', 'lesson' como si fueran sustantivos de vocabulario. Si el tema involucra números o precios (ej. compras en el mercado), los números se practican en las estructuras o precios (ej. "$2", "five apples"), PERO los sustantivos ilustrados son los productos y conceptos reales (ej. "pineapple", "cassava", "potatoes", "money", "price").

1. ADAPTACIÓN EVOLUTIVA ESTRICTA:
   - Si el grado es Pre-K o Kinder (Pre-A1 Receptivo): CERO lectoescritura forzada ni oraciones complejas. Todo ocurre mediante escucha (Listening), movimientos físicos (TPR), discriminación auditiva y visual, recuadros de pulgar arriba/abajo (👍 / 👎), y encierre en círculos.
   - Si el grado es 1° o 2° (Pre-A1 / A1.1): Reconocimiento de palabras cotidianas, comandos de aula, trazos asistidos.
   - Si el grado es 3° o 4° (A1): Frases fijas, preguntas simples (Where / What / How many), lectura gráfica, interacción guiada en parejas.
   - Si el grado es 5° o 6° (A1+): Descripciones sencillas, rutinas, instrucciones de 2 a 3 pasos, producción de textos breves guiados.
   - Si el grado es 7° a 9° (Pre-Media A2 / A2+): Tareas auténticas situacionales de Panamá (Mercado del Marisco, compras, direcciones, metro de Panamá, oficios técnicos en el Canal, fauna local).
   - Si el grado es 10° a 12° (Media B1 / B1+): Negociación, debate, proyectos sostenibles, manuales técnicos, mediación formal.

2. ESPECIALIZACIÓN DE LA HABILIDAD (${targetSkill.toUpperCase()}):
   - LISTENING: Entrada comprensiva ("Listen & Do", "Listen & Point"), script de audio verbatim del docente, registro de verificación auditiva.
   - READING: Alfabetización visual, avisos reales, menús de fondas, itinerarios de transporte, skimming & scanning.
   - WRITING: Producción escrita social auténtica (desde etiquetado/labeling hasta comandas, recibos, formularios o reportes de campo).
   - SPEAKING: Acción social e interacción oral, tarjetas de juego de rol (Role-play cards) para parejas con brecha de información.
   - MEDIATION: Habilidad clave CEFR 2020. Facilitar la comunicación explicando conceptos o gráficos en inglés sencillo a un compañero o visitante.

3. CONTEXTO PANAMEÑO AUTÉNTICO:
   - Utiliza referencias culturales, geográficas y de la vida real de Panamá (Balboa/USD, Metro de Panamá, Mercado del Marisco, Canal de Panamá, Bocas del Toro, Darién, fauna y flora local).

SCHEMA REQUIREMENT (Return strictly valid JSON):
{
  "title": "Exact Lesson Theme / Title from input",
  "grade": "${targetGrade}",
  "cefr": "${targetCefr}",
  "skill": "${targetSkill}",
  "scenario": "Authentic Scenario Name",
  "objective": "Target Specific Objective from input",
  "stages": [
    { "stage_number": 1, "stage_name": "Warm-up / Pre-task", "time": 10, "teacher_command": "Teacher instruction and verbal cues", "student_action": "Student expected action or TPR", "photo_cue": "visual_item", "differentiation": "Scaffolding note" },
    { "stage_number": 2, "stage_name": "Presentation (Input)", "time": 8, "teacher_command": "Teacher presentation script", "student_action": "Student choral repetition or CCQ response", "photo_cue": "presentation_cue", "differentiation": "Scaffolding note" },
    { "stage_number": 3, "stage_name": "Practice (Guided)", "time": 12, "teacher_command": "Teacher practice instructions", "student_action": "Student guided matching or task", "photo_cue": "practice_cue", "differentiation": "Scaffolding note" },
    { "stage_number": 4, "stage_name": "Production (Action Task)", "time": 10, "teacher_command": "Teacher task prompt", "student_action": "Student tangible deliverable", "photo_cue": "action_cue", "differentiation": "Scaffolding note" },
    { "stage_number": 5, "stage_name": "Assessment (Formative)", "time": 5, "teacher_command": "Teacher assessment questions", "student_action": "Student answers", "photo_cue": "assessment_cue", "differentiation": "Scaffolding note" },
    { "stage_number": 6, "stage_name": "Reflection (Can-Do)", "time": 5, "teacher_command": "Teacher reflection wrap-up", "student_action": "Student self-assessment", "photo_cue": "reflection_cue", "differentiation": "Scaffolding note" }
  ],
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
      "title": "Activity 1: ${patterns.activity1.pattern}",
      "instruction": "${patterns.activity1.instruction}",
      "words": ["word1", "word2", "word3", "word4", "word5", "word6"]
    }
  },
  "page2": {
    "activity2": {
      "title": "Activity 2: Guided Practice",
      "instruction": "Draw a line to match each item with its corresponding detail:",
      "pairs": [
        { "item": "TargetItem1", "detail": "Matching Detail 1", "icon": "tree" }
      ]
    },
    "activity3": {
      "title": "Activity 3: Authentic Communicative Exchange",
      "instruction": "Complete the interaction using words from the Word Bank below:",
      "wordBank": ["word1", "word2", "word3", "word4", "word5"],
      "dialogue": [
        { "speaker": "Role1", "text": "Sentence with or without [ blank ]..." },
        { "speaker": "Role2", "text": "Response..." }
      ]
    },
    "activity4": {
      "title": "Activity 4: Performance Action Task",
      "instruction": "Complete the tangible deliverable based on the lesson scenario:",
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
      "title": "Teacher Read-Aloud Audio Scripts & Resources",
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
          "criterion": "Target Skill Competence & Vocabulary",
          "independent": "Identifies all key concepts accurately and fluently.",
          "withSupport": "Identifies key concepts with occasional teacher prompting.",
          "emerging": "Requires direct modeling and continuous assistance."
        }
      ]
    }
  }
}`;

  let cleanInputText = typeof srcText === 'string' ? srcText : '';
  if (/<[a-z][\s\S]*>/i.test(cleanInputText)) {
    cleanInputText = cleanInputText
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  if (cleanInputText.length > 20000) {
    cleanInputText = cleanInputText.slice(0, 20000);
  }

  const parts = [{ text: cleanInputText || 'Use the attached lesson context.' }];
  if (source.media) parts.push({ inlineData: source.media });

  const payload = {
    contents: [{ parts }],
    systemInstruction: { parts: [{ text: prompt }] },
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.3,
      maxOutputTokens: 8192
    }
  };

  const clientApiKey = getClientApiKey();
  const endpoint = clientApiKey
    ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${clientApiKey}`
    : '/api/gemini';

  let response;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) break;
      if ((response.status === 503 || response.status === 429) && attempt < 3) {
        await new Promise(r => setTimeout(r, attempt * 1200));
        continue;
      }
    } catch (fetchErr) {
      if (attempt === 3) break;
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  let pack = null;
  if (response && response.ok) {
    try {
      const data = await response.json();
      const raw = data.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || '';
      pack = repairAndParseJson(raw);
    } catch (err) {
      console.warn('Failed to parse AI response as JSON, falling back to direct curriculum extraction:', err);
    }
  }

  // Guaranteed Curriculum Fallback: If AI is offline, rate-limited, or returned malformed JSON,
  // extract directly using the authoritative Lesson Parser. Never fail or throw an unexpected format error!
  if (!pack || !pack.page1 || !pack.page2 || !pack.page3) {
    try {
      pack = parseAoaLessonPlan(srcText, contract);
    } catch (fallbackErr) {
      console.error('Fallback parse failed:', fallbackErr);
    }
  }

  // Strict Alignment Validator & Self-Healing Repair
  if (pack) {
    // Sanitize any meta-words like 'number' that might have leaked
    const validReplacements = officialNouns.length ? officialNouns : ['pineapple', 'cassava', 'potatoes', 'money', 'price', 'market'];
    let repIdx = 0;
    if (pack.page1?.wordBank && Array.isArray(pack.page1.wordBank)) {
      pack.page1.wordBank = pack.page1.wordBank.map(wb => {
        const wStr = String(wb.word || '').trim().toLowerCase();
        if (!isValidVocabWord(wStr) || wStr === 'number' || wStr === 'numbers') {
          const replacement = validReplacements[repIdx % validReplacements.length];
          repIdx++;
          return {
            ...wb,
            word: replacement.charAt(0).toUpperCase() + replacement.slice(1),
            icon: replacement.toLowerCase(),
            photoUrl: getRealiaPhoto(replacement)
          };
        }
        return wb;
      });
    }
    if (pack.actionWorksheet?.part1?.items && Array.isArray(pack.actionWorksheet.part1.items)) {
      pack.actionWorksheet.part1.items = pack.actionWorksheet.part1.items.map(it => {
        const wStr = String(it.word || it.label || '').trim().toLowerCase();
        if (!isValidVocabWord(wStr) || wStr === 'number' || wStr === 'numbers') {
          const replacement = validReplacements[repIdx % validReplacements.length];
          repIdx++;
          return {
            ...it,
            word: replacement.toUpperCase(),
            label: replacement.toUpperCase(),
            photoUrl: getRealiaPhoto(replacement)
          };
        }
        return it;
      });
    }

    const validation = validateActivityPack(pack, contract);
    if (!validation.pass) {
      pack = repairActivityPack(pack, validation.errors, contract);
    }
    pack._usedAi = Boolean(response && response.ok && !pack._usedFallback);
    return validatePack(pack);
  }

  throw new Error('No se pudieron estructurar las actividades pedagógicas de la lección.');
}
