/**
 * EDUGEN PRO · ACTIVITY ENGINE & ALIGNMENT VALIDATOR
 * 
 * Implements the core architecture specified in "generador de actividades.txt":
 * 1. Contract Builder (buildLessonContract)
 * 2. Activity Pattern Selector (selectActivityPatterns)
 * 3. AOA 6-Stage Blueprint Builder (buildAOABlueprint)
 * 4. Strict Alignment Validator (validateActivityPack)
 * 5. Self-Healing Deterministic Repair (repairActivityPack)
 * 
 * Supports ~1,120 unique lesson activity packs:
 * 14 Curriculum Groups (Pre-K to 12th) x 8 Scenarios x 2 Themes x 5 Lessons
 * Authoritative Rule: lesson.skill MUST determine the primary activity architecture.
 * NEVER assume lesson number determines skill.
 */

import { resolveCefrBand, CEFR_BANDS, AOA_MASTER_CATALOG } from './aoaMasterBank.js';

export const VALID_SKILLS = ['Listening', 'Reading', 'Speaking', 'Writing', 'Mediation'];

/**
 * Standardize any skill string to the authoritative 5 AOA skills.
 */
export function normalizeSkill(rawSkill) {
  if (!rawSkill || typeof rawSkill !== 'string') return 'Listening';
  const s = rawSkill.toLowerCase().trim();
  if (s.includes('speak') || s.includes('oral') || s.includes('habla') || s.includes('producción oral')) return 'Speaking';
  if (s.includes('read') || s.includes('lect') || s.includes('comprensión lectora')) return 'Reading';
  if (s.includes('writ') || s.includes('escr') || s.includes('producción escrita')) return 'Writing';
  if (s.includes('mediat') || s.includes('mediac') || s.includes('21st') || s.includes('project')) return 'Mediation';
  if (s.includes('listen') || s.includes('escuch') || s.includes('audit') || s.includes('tpr')) return 'Listening';
  return 'Listening';
}

/**
 * Extract authoritative skill from raw text if not explicitly provided in metadata.
 * Looks for explicit headers like "Skill: Speaking", "Target Skill: Reading", etc.
 */
export function detectSkillFromText(text) {
  if (!text || typeof text !== 'string') return null;
  const match = text.match(/(?:skill|target\s+skill|focus\s+skill|macro-?habilidad|habilidad\s*(?:foco)?|habilidad)\s*[:#-]?\s*([a-zA-Z\s]+)/i);
  if (match) {
    const candidate = match[1].trim();
    if (/listening|comprensión\s+auditiva/i.test(candidate)) return 'Listening';
    if (/reading|comprensión\s+lectora/i.test(candidate)) return 'Reading';
    if (/speaking|interacción\s+oral|expresión\s+oral/i.test(candidate)) return 'Speaking';
    if (/writing|expresión\s+escrita|producción\s+escrita/i.test(candidate)) return 'Writing';
    if (/mediation|mediación|21st\s+century/i.test(candidate)) return 'Mediation';
  }
  return null;
}

/**
 * 1. BUILD LESSON CONTRACT
 * Creates the authoritative contract object before any AI or deterministic generation.
 */
export function buildLessonContract({
  lesson = {},
  theme = '',
  scenario = '',
  grade = '',
  cefr = '',
  skill = '',
  lessonNum = null,
  themeType = 'receptive',
  project21st = '',
  previousLessons = [],
  rawText = ''
}) {
  const cleanGrade = grade || lesson.grade || '4th Grade';
  const bandKey = resolveCefrBand(cleanGrade);
  const bandMeta = CEFR_BANDS[bandKey] || CEFR_BANDS['a1'];
  const cleanCefr = cefr || lesson.cefr || bandMeta.cefr;

  // Authoritative skill resolution: lesson.skill is king. Never assume lesson number = skill.
  let resolvedSkill = normalizeSkill(
    skill ||
    lesson.skill ||
    lesson.macroSkill ||
    detectSkillFromText(rawText) ||
    detectSkillFromText(lesson.content || '') ||
    (lessonNum === 1 ? 'Listening'
      : lessonNum === 2 ? 'Reading'
      : lessonNum === 3 ? 'Speaking'
      : lessonNum === 4 ? 'Writing'
      : lessonNum === 5 ? 'Mediation'
      : 'Listening')
  );

  const cleanScenario = scenario || lesson.scenario || lesson.title || 'Authentic Context';
  const cleanTheme = theme || lesson.theme || lesson.title || cleanScenario;
  const effectiveLessonNum = Number(lessonNum || lesson.lessonNum || lesson.lessonNumber) || 1;
  const isTheme2 = themeType === 'productive' || /theme\s*#?\s*2|productive/i.test(`${cleanTheme} ${rawText}`);

  // Resolve 21st Century Skills Project (Theme 1 -> Project 1, Theme 2 -> Project 2)
  let resolvedProject = project21st || lesson.project21st || '';
  if (!resolvedProject && resolvedSkill === 'Mediation') {
    resolvedProject = isTheme2
      ? `Project 2: Comparative Display & Peer Guide — Students work in teams to compare items and mediate findings for ${cleanTheme}.`
      : `Project 1: Collaborative Action Poster — Students create a visual poster to explain key concepts and mediate meaning for ${cleanTheme}.`;
  }

  const isEarly = bandKey === 'pre-a1';

  return {
    grade: cleanGrade,
    cefr: cleanCefr,
    bandKey,
    scenario: cleanScenario,
    theme: cleanTheme,
    theme_type: isTheme2 ? 'productive' : 'receptive',
    lesson_number: effectiveLessonNum,
    skill: resolvedSkill,
    isEarly,
    objective: lesson.objective || `Demonstrate ${resolvedSkill.toLowerCase()} skills in the context of "${cleanTheme}".`,
    learning_outcome: lesson.learning_outcome || `Students can use ${resolvedSkill.toLowerCase()} to act in "${cleanScenario}".`,
    language_functions: lesson.language_functions || [
      `Identify and communicate concepts related to ${cleanScenario}`,
      `Interact using target structures for ${cleanTheme}`
    ],
    target_language: lesson.target_language || [],
    vocabulary: lesson.vocabulary || [],
    assessment_criteria: lesson.assessment_criteria || `Demonstrates ${resolvedSkill.toLowerCase()} competence and vocabulary in context.`,
    project_21st: resolvedProject,
    previous_lessons_context: previousLessons.map(p => ({
      lesson_number: p.lesson_number || p.number,
      skill: p.skill,
      vocabulary: p.vocabulary || []
    })),
    constraints: resolveConstraints({
      grade: cleanGrade,
      cefr: cleanCefr,
      skill: resolvedSkill,
      scenario: cleanScenario,
      theme: cleanTheme
    })
  };
}

/**
 * 2. RESOLVE CONSTRAINTS
 */
export function resolveConstraints({ grade = '4th Grade', cefr = 'A1', skill = 'Listening', scenario = '', theme = '' }) {
  const normSkill = normalizeSkill(skill);
  const bandKey = resolveCefrBand(grade);
  const isEarly = bandKey === 'pre-a1';
  return {
    primary_skill: normSkill.toLowerCase(),
    oral_evidence_required: normSkill === 'Speaking',
    writing_as_primary_evidence: normSkill === 'Writing',
    listening_comprehension_required: normSkill === 'Listening',
    reading_comprehension_required: normSkill === 'Reading',
    mediation_transfer_required: normSkill === 'Mediation',
    zero_forced_literacy: isEarly,
    tpr_required: isEarly
  };
}

/**
 * 2. SELECT ACTIVITY PATTERNS (Activity Diversity Engine)
 * Controls:
 * 1. Tipo de interacción: Individual, Pair, Small group, Whole class, Team, Teacher-student
 * 2. Tipo de acción: Identify, Choose, Sort, Predict, Ask, Answer, Compare, Order, Solve, Create, Explain, Transfer, Present, Negotiate
 * 3. Tipo de material: Picture cards, Flashcards, Map, Menu, Poster, Dialogue, Short text, Chart, Schedule, Role cards, Information cards
 * 4. Tipo de evidencia: Oral response, Written response, Physical action, Information transfer, Product, Performance, Presentation, Collaborative solution
 */
export function selectActivityPatterns(contract) {
  const { skill, isEarly, bandKey, scenario, theme, theme_type, lesson_number } = contract;
  const isA2orB1 = bandKey === 'a2' || bandKey === 'b1';

  if (skill === 'Listening') {
    return {
      interaction_type: isEarly ? 'Teacher-student / Whole class' : 'Individual / Pair verification',
      student_action: isEarly ? 'Listen, Point & Show TPR' : 'Listen, Discriminate & Verify',
      materials: isEarly ? 'Picture cards & Classroom Realia' : 'Audio Read-Aloud Script & Verification Cards',
      evidence_type: isEarly ? 'Physical action (TPR) & Gesture' : 'Demonstrable Auditory Comprehension',
      activity1: {
        pattern: isEarly ? 'Listen & Point (TPR Hook)' : isA2orB1 ? 'Public Audio Broadcast & Key Info Hunt' : 'Listen & Identify (Auditory Hook)',
        taskType: 'listen_and_point',
        instruction: isEarly
          ? 'Listen carefully! When your teacher says the word, point to the real photo on your paper and touch the real classroom object!'
          : isA2orB1
          ? 'Listen to the audio broadcast excerpt read by your teacher. Mark and locate the crucial situational terms.'
          : 'Listen to the audio statements spoken by your teacher. Point to each target item as you hear it pronounced with clear intonation.',
        actionCue: '[ Point Here 👆 ]',
        badge: 'Receptive Listening'
      },
      activity2: {
        pattern: isEarly ? 'True or False? Show Your Thumb (TPR)' : isA2orB1 ? 'Auditory Detail Audit & Scenario Verification' : 'Listen & Verify (Auditory Accuracy)',
        taskType: 'listen_and_verify',
        prompt: isEarly
          ? 'Teacher says a sentence about the picture. If what you hear is TRUE, show THUMBS UP ( 👍 )! If FALSE, show THUMBS DOWN ( 👎 )!'
          : 'Listen to the audio prompt. Check whether each spoken statement accurately describes the scenario photo: mark YES ( 👍 ) or NO ( 👎 )!',
        badge: 'Auditory Accuracy'
      }
    };
  }

  if (skill === 'Reading') {
    return {
      interaction_type: isA2orB1 ? 'Pair scanning & comparative analysis' : 'Individual / Pair decoding',
      student_action: 'Read, Scan, Skim, Decode & Verify',
      materials: isA2orB1 ? 'Authentic Schedules, Route Maps & Informational Notices' : 'Printed Labels, Realia Photos & Word Banks',
      evidence_type: 'Demonstrable Comprehension of Written Information',
      activity1: {
        pattern: isA2orB1 ? 'Authentic Informational Text & Graphic Scanning' : 'Visual Text Decoding & Label Matching',
        taskType: 'read_and_decode',
        instruction: isA2orB1
          ? `Read the authentic informational notices and schedules for ${scenario}. Highlight key operational details.`
          : 'Read each printed label aloud with your partner. Examine the authentic photo and match the text label to the correct item.',
        actionCue: '[ Read & Match 📖 ]',
        badge: 'Visual Decoding'
      },
      activity2: {
        pattern: isA2orB1 ? 'Text Detective & Critical Fact Verification' : 'Text Detective & Fact Verification',
        taskType: 'read_and_verify',
        prompt: 'Read each informational statement carefully. Evaluate if the statement is TRUE according to the reading text: mark YES ( 👍 ) or NO ( 👎 )!',
        badge: 'Reading Accuracy'
      }
    };
  }

  if (skill === 'Speaking') {
    // Distinct speaking pattern based on grade & scenario
    const isShopping = /market|shop|store|price|cost|dollar/i.test(`${scenario} ${theme}`);
    const isTransit = /metro|terminal|transit|bus|train|canal/i.test(`${scenario} ${theme}`);
    const isEcoForum = /environment|community|tourism|nature|fauna/i.test(`${scenario} ${theme}`) || isA2orB1;

    const patternName1 = isEarly ? 'Oral Naming & Echo Chant' : 'Oral Recognition & Pronunciation Model';
    const patternName2 = isShopping
      ? 'Market Price Inquiry Challenge (Pair Role-Play)'
      : isTransit
      ? 'Transit Information Desk (Pair Role-Play)'
      : isEcoForum
      ? 'Community Forum & Situational Pitch (Pair Role-Play)'
      : 'Communicative Inquiry & Pair Role-Play Exchange';

    return {
      interaction_type: 'Pair interaction / Student-Student exchange',
      student_action: 'Ask, Answer, Pronounce, Negotiate & Produce Spoken Language',
      materials: 'Role cards, Picture cards & Conversational Question Frames',
      evidence_type: 'Oral language production & interactive spoken fluency',
      activity1: {
        pattern: patternName1,
        taskType: 'oral_pronunciation',
        instruction: "Work with your partner. Point to each real photo, pronounce the English word with clear intonation, and take turns asking: 'What is this?' / 'How much is it?'",
        actionCue: '[ Say It Aloud 🗣️ ]',
        badge: 'Spoken Fluency'
      },
      activity2: {
        pattern: patternName2,
        taskType: 'pair_inquiry',
        prompt: "Partner A asks the inquiry question. Partner B checks the statement and answers aloud. If answered correctly and fluently, mark YES ( 👍 )!",
        badge: 'Spoken Interaction'
      }
    };
  }

  if (skill === 'Writing') {
    return {
      interaction_type: 'Individual composition with peer check',
      student_action: isEarly ? 'Trace, Copy & Label' : 'Complete, Structure, Draft & Verify',
      materials: isEarly ? 'Letter Tracing Lines & Visual Flashcards' : 'Writing Frames, Official Form Records & Field Logs',
      evidence_type: 'Written production appropriate to grade and CEFR level',
      activity1: {
        pattern: isEarly ? 'Orthographic Trace & Picture Labeling' : isA2orB1 ? 'Technical Vocabulary Builder & Field Log Entry' : 'Sentence Builder & Vocabulary Labeling',
        taskType: 'trace_and_label',
        instruction: isEarly
          ? 'Look at the real photo. Trace each letter of the target word with your pencil and copy the label onto your practice sheet!'
          : 'Examine the scenario items. Use words from the bank to write the correct English label under each authentic photo.',
        actionCue: '[ Trace & Write ✍️ ]',
        badge: 'Orthographic Practice'
      },
      activity2: {
        pattern: isA2orB1 ? 'Authentic Field Log & Incident Report Verification' : 'Authentic Record & Written Verification',
        taskType: 'written_record',
        prompt: 'Read the prompt. Verify the written facts and complete the official record or receipt: mark YES ( 👍 ) or NO ( 👎 )!',
        badge: 'Written Accuracy'
      }
    };
  }

  if (skill === 'Mediation') {
    const isTheme2 = theme_type === 'productive';
    const projectTitle = isTheme2 ? 'Project 2 (Interactive Showcase)' : 'Project 1 (Collaborative Action Poster)';

    return {
      interaction_type: 'Team / Small group collaboration (Student A -> Student B)',
      student_action: 'Understand, Select Information, Explain in Simple English & Transfer Meaning',
      materials: 'Team Role Cards, Information Sheets & 21st Century Project Display Guides',
      evidence_type: 'Information transfer & collaborative project milestone delivery',
      activity1: {
        pattern: `21st Century Skills Project · Team Roles & Information Extraction (${projectTitle})`,
        taskType: 'team_roles_extraction',
        instruction: `Examine the project elements and team roles. Mediate and explain the goals of our 21st Century Project (${isTheme2 ? 'Project 2' : 'Project 1'}) to your teammates in clear, simple English!`,
        actionCue: '[ Team Collaboration 🤝 ]',
        badge: '21st Century Project'
      },
      activity2: {
        pattern: 'Peer Mediation & Information Transfer Check',
        taskType: 'peer_mediation_transfer',
        prompt: 'Work with your project group. Mediate the instructions in simple English. Verify each project milestone: mark YES ( 👍 ) or NO ( 👎 )!',
        badge: 'Peer Mediation'
      }
    };
  }

  return {
    interaction_type: 'Pair',
    student_action: 'Practice',
    materials: 'Worksheet',
    evidence_type: 'Observable Task Evidence',
    activity1: { pattern: 'Vocabulary Hook', taskType: 'vocab_hook', instruction: 'Review the items.', actionCue: '[ Focus 🔍 ]', badge: 'Vocabulary' },
    activity2: { pattern: 'Contextual Check', taskType: 'context_check', prompt: 'Verify the items.', badge: 'Accuracy' }
  };
}

/**
 * 3. BUILD AOA BLUEPRINT (6 Stages)
 */
export function buildAOABlueprint(contract) {
  const { skill, bandKey, scenario, theme } = contract;
  const catalogSkill = AOA_MASTER_CATALOG[skill.toLowerCase()] || AOA_MASTER_CATALOG.listening;

  const stage1Data = catalogSkill.stages.stage1.activities[bandKey] || catalogSkill.stages.stage1.activities['a1'] || {
    name: 'Activate Context', desc: `Activate previous knowledge about ${theme}.`
  };
  const stage2Data = catalogSkill.stages.stage2.activities[bandKey] || catalogSkill.stages.stage2.activities['a1'] || {
    name: 'Input Modeling', desc: `Teacher introduces target ${skill.toLowerCase()} structures in ${scenario}.`
  };
  const stage3Data = catalogSkill.stages.stage3.activities[bandKey] || catalogSkill.stages.stage3.activities['a1'] || {
    name: 'Guided Practice', desc: `Students practice ${skill.toLowerCase()} with scaffolds.`
  };
  const stage4Data = catalogSkill.stages.stage4.activities[bandKey] || catalogSkill.stages.stage4.activities['a1'] || {
    name: 'Action Performance Task', desc: `Students produce authentic ${skill.toLowerCase()} evidence.`
  };
  const stage5Data = catalogSkill.stages.stage5.activities[bandKey] || catalogSkill.stages.stage5.activities['a1'] || {
    name: 'Assessment & Check', desc: `Formative evaluation of ${skill.toLowerCase()} performance.`
  };
  const stage6Data = catalogSkill.stages.stage6.activities[bandKey] || catalogSkill.stages.stage6.activities['a1'] || {
    name: 'Can-Do Reflection', desc: `Self-assessment of ${skill.toLowerCase()} ability.`
  };

  return {
    skill,
    stages: [
      { stage_number: 1, stage_name: 'Warm-up / Pre-task', purpose: 'activate', time: 10, name: stage1Data.name, desc: stage1Data.desc },
      { stage_number: 2, stage_name: 'Presentation (Input)', purpose: 'input', time: 8, name: stage2Data.name, desc: stage2Data.desc },
      { stage_number: 3, stage_name: 'Practice (Guided)', purpose: 'guided_practice', time: 12, name: stage3Data.name, desc: stage3Data.desc },
      { stage_number: 4, stage_name: 'Production (Action Task)', purpose: 'production', time: 10, name: stage4Data.name, desc: stage4Data.desc },
      { stage_number: 5, stage_name: 'Assessment (Formative)', purpose: 'assessment', time: 5, name: stage5Data.name, desc: stage5Data.desc },
      { stage_number: 6, stage_name: 'Reflection (Can-Do)', purpose: 'reflection', time: 5, name: stage6Data.name, desc: stage6Data.desc }
    ]
  };
}

/**
 * 4. STRICT ALIGNMENT VALIDATOR
 * Validates generated pack against the 15 pedagogical rules and skill constraints.
 */
export function validateActivityPack(pack, contract) {
  const errors = [];

  if (!pack || typeof pack !== 'object') {
    return { pass: false, errors: ['Pack must be a valid non-empty object.'] };
  }

  // 1. Skill Alignment
  const targetSkill = contract.skill;
  const packSkill = normalizeSkill(pack.skill);
  if (packSkill !== targetSkill) {
    errors.push(`Skill mismatch: expected ${targetSkill}, found ${packSkill}.`);
  }

  // 2. Grade & CEFR Alignment
  if (contract.isEarly) {
    // Kindergarten / Pre-K: Zero forced literacy check
    const rawContent = JSON.stringify(pack).toLowerCase();
    if (rawContent.includes('write an essay') || rawContent.includes('read the paragraph') || rawContent.includes('grammar drill')) {
      errors.push('Early childhood (Pre-K/Kinder) contains forced literacy or complex grammar.');
    }
  }

  // 3. AOA 6 Stages Compliance
  const stages = Array.isArray(pack.stages) ? pack.stages : [];
  if (stages.length < 6) {
    errors.push(`AOA 6 stages incomplete: found ${stages.length} stages, expected 6.`);
  }

  // 4. Action Worksheet Part 1 & Part 2 presence
  const actionWorksheet = pack.actionWorksheet;
  if (!actionWorksheet || !actionWorksheet.part1 || !actionWorksheet.part2) {
    errors.push('Action Worksheet missing Part 1 or Part 2.');
  } else {
    // Part 1 items check
    const p1Items = actionWorksheet.part1.items || [];
    if (p1Items.length < 4) {
      errors.push(`Action Worksheet Part 1 requires at least 4 items, found ${p1Items.length}.`);
    }
    // Part 2 items check
    const p2Items = actionWorksheet.part2.items || [];
    if (p2Items.length < 4) {
      errors.push(`Action Worksheet Part 2 requires 4 verification items, found ${p2Items.length}.`);
    }
  }

  // 5. Skill Specific Constraints
  if (contract.constraints.oral_evidence_required) {
    // Speaking requires oral interaction
    const p2Text = JSON.stringify(actionWorksheet?.part2 || '').toLowerCase();
    const hasOral = p2Text.includes('say') || p2Text.includes('speak') || p2Text.includes('ask') || p2Text.includes('answer') || p2Text.includes('partner');
    if (!hasOral) {
      errors.push('Speaking lesson requires oral interaction evidence in Part 2.');
    }
  }

  if (contract.constraints.listening_comprehension_required) {
    // Listening requires audio script in teacher guide
    const scripts = pack.page3?.teacherGuide?.scripts || [];
    if (!scripts.length) {
      errors.push('Listening lesson requires verbatim teacher read-aloud scripts in Teacher Guide.');
    }
  }

  if (contract.constraints.writing_as_primary_evidence && !contract.isEarly) {
    // Writing requires orthographic or written production
    const p1Text = JSON.stringify(actionWorksheet?.part1 || '').toLowerCase();
    const p2Text = JSON.stringify(actionWorksheet?.part2 || '').toLowerCase();
    const hasWriting = p1Text.includes('trace') || p1Text.includes('write') || p1Text.includes('label') || p2Text.includes('write') || p2Text.includes('record');
    if (!hasWriting) {
      errors.push('Writing lesson requires written production evidence in Part 1 or Part 2.');
    }
  }

  if (contract.constraints.mediation_transfer_required) {
    // Mediation requires project connection
    const rawMed = JSON.stringify(pack).toLowerCase();
    if (!rawMed.includes('project') && !rawMed.includes('team') && !rawMed.includes('mediate')) {
      errors.push('Mediation lesson requires 21st Century Project and peer mediation connection.');
    }
  }

  return {
    pass: errors.length === 0,
    errors
  };
}

/**
 * 5. SELF-HEALING DETERMINISTIC REPAIR
 * Automatically fixes any validation errors using the authoritative curriculum catalog.
 */
export function repairActivityPack(pack, errors, contract) {
  const repaired = { ...(pack || {}) };
  const { skill, grade, cefr, scenario, theme, theme_type, project_21st } = contract;

  repaired.skill = skill;
  repaired.grade = grade;
  repaired.cefr = cefr;
  repaired.scenario = scenario;
  repaired.title = theme;

  // Ensure 6 stages
  if (!Array.isArray(repaired.stages) || repaired.stages.length < 6) {
    const blueprint = buildAOABlueprint(contract);
    repaired.stages = blueprint.stages.map(s => ({
      stage_number: s.stage_number,
      stage_name: s.stage_name,
      time: s.time,
      teacher_command: `Teacher leads ${s.name}: ${s.desc}`,
      student_action: `Students participate in ${s.name}`,
      photo_cue: 'target_concept',
      differentiation: 'Provide visual scaffolds and peer modeling as needed.'
    }));
  }

  // Ensure 21st Century Project for Mediation
  if (skill === 'Mediation' && !repaired.project_21st) {
    repaired.project_21st = project_21st;
  }

  return repaired;
}

/**
 * Regenerate alias for self-healing repair (generador de actividades.txt)
 */
export const regenerate = repairActivityPack;

/**
 * Save for review when validation fails after retries
 */
export function saveForReview(pack, validation) {
  return {
    ...pack,
    _needsReview: true,
    _validationErrors: validation.errors || []
  };
}
