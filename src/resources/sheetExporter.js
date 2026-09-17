/**
 * EduGen Pro - Google Sheets & CSV Curriculum Exporter
 * Implements Section 4 of "Arquitectura Modular EduGen Pro AOA"
 * 
 * Generates standardized multi-table CSV with BOM (\ufeff) for direct
 * import into Google Sheets / Microsoft Excel:
 *   - Table 1: Curriculum_Index (Metadatos Generales)
 *   - Table 2: Lesson_Stages_Detail (Contenido de los 6 Pasos AOA)
 *   - Table 3: Assessment_Checklist (Rúbricas Formativas MEDUCA)
 */

export function getGradeCode(grade = '') {
  const g = String(grade).toLowerCase();
  if (g.includes('pre-k') || g.includes('prek') || g.includes('prekinder')) return 'PRK';
  if (g.includes('kinder')) return 'KND';
  const num = g.match(/([0-9]+)/)?.[1];
  if (num) return `${num.padStart(2, '0')}G`;
  return 'GEN';
}

export function getCefrByGrade(grade = '') {
  const g = String(grade).toLowerCase();
  if (g.includes('pre-k') || g.includes('kinder')) return 'Pre-A1';
  if (g.includes('1st') || g.includes('2nd') || g.includes('1°') || g.includes('2°')) return 'Pre-A1 / A1.1';
  if (g.includes('3rd') || g.includes('4th') || g.includes('3°') || g.includes('4°')) return 'A1';
  if (g.includes('5th') || g.includes('6th') || g.includes('5°') || g.includes('6°')) return 'A1+';
  if (g.includes('7th') || g.includes('8th') || g.includes('7°') || g.includes('8°')) return 'A2';
  if (g.includes('9th') || g.includes('9°')) return 'A2+';
  if (g.includes('10th') || g.includes('11th') || g.includes('10°') || g.includes('11°')) return 'B1';
  if (g.includes('12th') || g.includes('12°')) return 'B1+';
  return 'A1';
}

function escapeCsv(val) {
  if (val == null) return '""';
  const str = String(val).replace(/"/g, '""').replace(/\r?\n/g, ' ');
  return `"${str}"`;
}

export function generateAoaCsv(pack) {
  const gradeCode = getGradeCode(pack.grade);
  const cefr = pack.cefr || getCefrByGrade(pack.grade);
  const scenarioNum = pack.scenarioIndex != null ? Number(pack.scenarioIndex) + 1 : 1;
  const scenarioId = `SC${String(scenarioNum).padStart(2, '0')}`;
  const scenarioName = pack.scenario || pack.title || 'Official Scenario';
  const lessonNum = pack.lessonNum || 1;
  const lessonType = pack.skill || 'Listening';
  const lessonUid = `${gradeCode}_${scenarioId}_L${lessonNum}`;

  const stages = Array.isArray(pack.stages) && pack.stages.length === 6 ? pack.stages : [
    {
      stage_number: 1,
      stage_name: 'Warm-up / Pre-task',
      time: 10,
      teacher_command: 'Model the key vocabulary and activate schema with visual cues.',
      student_action: 'Listen, point to cards, repeat target words.',
      photo_cue: pack.page1?.wordBank?.[0]?.word || 'flashcard/vocabulary',
      differentiation: 'Provide visual cards and peer modeling for emerging students.'
    },
    {
      stage_number: 2,
      stage_name: 'Presentation (Input)',
      time: 8,
      teacher_command: 'Demonstrate target communicative language frame in context.',
      student_action: 'Participate in choral repetition and answer checking questions (CCQs).',
      photo_cue: 'dialogue/scenario',
      differentiation: 'Repeat with gestures and slower rate of speech.'
    },
    {
      stage_number: 3,
      stage_name: 'Practice (Guided)',
      time: 12,
      teacher_command: 'Guide students through the matching and recognition activity.',
      student_action: 'Draw matching lines, complete cloze items or circle targets.',
      photo_cue: 'activity/matching',
      differentiation: 'Pair emerging students with independent peer buddies.'
    },
    {
      stage_number: 4,
      stage_name: 'Production (Action Task)',
      time: 10,
      teacher_command: 'Assign the social action task and monitor student performance.',
      student_action: 'Complete deliverable (roleplay, drawing, order, receipt, field note).',
      photo_cue: 'production/deliverable',
      differentiation: 'Provide sentence frames or simplified role cards.'
    },
    {
      stage_number: 5,
      stage_name: 'Assessment (Formative)',
      time: 5,
      teacher_command: 'Read assessment quiz prompts clearly and observe student responses.',
      student_action: 'Answer 3 exit ticket questions individually.',
      photo_cue: 'assessment/quiz',
      differentiation: 'Read questions aloud twice with visual cues.'
    },
    {
      stage_number: 6,
      stage_name: 'Reflection (Can-Do)',
      time: 5,
      teacher_command: 'Guide metacognitive self-check and praise communicative effort.',
      student_action: 'Rate confidence with 1-3 stars on Can-Do statements.',
      photo_cue: 'reflection/stars',
      differentiation: 'Celebrate all communicative attempts and progress.'
    }
  ];

  const rubric = Array.isArray(pack.page3?.teacherGuide?.rubric) && pack.page3.teacherGuide.rubric.length
    ? pack.page3.teacherGuide.rubric
    : (pack.rubric || [
        { criterion: 'Listening Comprehension & Target Vocabulary', independent: 'Identifies all key terms and details accurately.', withSupport: 'Identifies terms with 1-2 prompts.', emerging: 'Requires continuous modeling.' },
        { criterion: 'Task Completion (Action-Oriented Deliverable)', independent: 'Completes deliverable fluently and independently.', withSupport: 'Completes with peer assistance.', emerging: 'Incomplete deliverable.' },
        { criterion: 'Communicative Interaction & AOA Frames', independent: 'Produces target frames with clear pronunciation.', withSupport: 'Uses isolated target words.', emerging: 'Relies on non-verbal gestures.' }
      ]);

  const weights = ['40%', '35%', '25%'];

  const lines = [
    '# ==============================================================================',
    '# EDUTER & MEDUCA PANAMÁ · ARQUITECTURA MODULAR EDUGEN PRO AOA',
    '# HOJA CURRICULAR SINCRONIZADA (EXPORTACIÓN OFICIAL GOOGLE SHEETS / EXCEL)',
    '# ==============================================================================',
    '',
    '# TABLA 1: CURRICULUM_INDEX (METADATOS GENERALES)',
    'Grade_Code,CEFR_Level,Scenario_ID,Scenario_Name,Lesson_Type,Lesson_Title,Lesson_UID',
    [
      escapeCsv(gradeCode),
      escapeCsv(cefr),
      escapeCsv(scenarioId),
      escapeCsv(scenarioName),
      escapeCsv(lessonType),
      escapeCsv(pack.title || 'Official Lesson'),
      escapeCsv(lessonUid)
    ].join(','),
    '',
    '# TABLA 2: LESSON_STAGES_DETAIL (CONTENIDO DE LAS 6 ETAPAS AOA)',
    'Lesson_UID,Stage_Number,Stage_Title,Time_Minutes,Teacher_Verbal_Command,Expected_Student_Action,Photo_Asset_URL,Differentiation_Note',
    ...stages.map((st, i) => [
      escapeCsv(lessonUid),
      escapeCsv(st.stage_number || i + 1),
      escapeCsv(st.stage_name || `Stage ${i + 1}`),
      escapeCsv(st.time || (i === 0 ? 10 : i === 1 ? 8 : i === 2 ? 12 : i === 3 ? 10 : 5)),
      escapeCsv(st.teacher_command || st.teacher_instructions || 'Guide the activity.'),
      escapeCsv(st.student_action || st.student_action_tpr || 'Participate actively.'),
      escapeCsv(st.photo_cue || st.photo_asset_url || 'asset_default.png'),
      escapeCsv(st.differentiation || st.differentiation_struggling || 'Scaffold as needed.')
    ].join(',')),
    '',
    '# TABLA 3: ASSESSMENT_CHECKLIST (RÚBRICAS FORMATIVAS MEDUCA)',
    'Lesson_UID,Criterion_Name,Independent_Descriptor,With_Support_Descriptor,Emerging_Descriptor,Weight_Percentage',
    ...rubric.slice(0, 3).map((r, idx) => [
      escapeCsv(lessonUid),
      escapeCsv(r.criterion || `Criterion ${idx + 1}`),
      escapeCsv(r.independent || 'High mastery.'),
      escapeCsv(r.withSupport || 'Moderate support.'),
      escapeCsv(r.emerging || 'Emerging mastery.'),
      escapeCsv(weights[idx] || '33%')
    ].join(','))
  ];

  return lines.join('\r\n');
}

export function downloadAoaSheetsCsv(pack) {
  const csvText = generateAoaCsv(pack);
  // Add UTF-8 BOM so Excel & Google Sheets automatically detect accents and encoding
  const blob = new Blob(['\ufeff', csvText], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeTitle = (pack.title || 'AOA_Curriculum').replace(/[^a-z0-9_-]/gi, '_');
  a.href = url;
  a.download = `${safeTitle}_GoogleSheets_AOA.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
