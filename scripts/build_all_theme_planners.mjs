import fs from 'fs';
import path from 'path';

const CURRICULUMS_DIR = path.resolve('public/curriculums');
const OUTPUT_DIR = path.resolve('theme plannings');
const MANIFEST_PATH = path.resolve('public/theme_planners_manifest.json');

// Ensure root output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const gradesConfig = [
  { gradeLabel: 'Pre-K', folder: 'Prekinder', file: 'English_Curriculum_Prekinder.json', cefr: 'Pre-A1.1', hours: 4 },
  { gradeLabel: 'Kinder', folder: 'Kinder', file: 'English_Curriculum_Kinder.json', cefr: 'Pre-A1.2', hours: 4 },
  { gradeLabel: '1st Grade', folder: '1st Grade', file: 'English_Curriculum_Grade_1.json', cefr: 'Pre-A1.3', hours: 5 },
  { gradeLabel: '2nd Grade', folder: '2nd Grade', file: 'English_Curriculum_Grade_2.json', cefr: 'Pre-A1.4', hours: 5 },
  { gradeLabel: '3rd Grade', folder: '3rd Grade', file: 'English_Curriculum_Grade_3.json', cefr: 'A1.1', hours: 5 },
  { gradeLabel: '4th Grade', folder: '4th Grade', file: 'English_Curriculum_Grade_4.json', cefr: 'A1.2', hours: 5 },
  { gradeLabel: '5th Grade', folder: '5th Grade', file: 'English_Curriculum_Grade_5.json', cefr: 'A1.3', hours: 5 },
  { gradeLabel: '6th Grade', folder: '6th Grade', file: 'English_Curriculum_Grade_6.json', cefr: 'A2.1', hours: 5 },
  { gradeLabel: '7th Grade', folder: '7th Grade', file: 'English_Curriculum_Grade_7.json', cefr: 'A2.2', hours: 5 },
  { gradeLabel: '8th Grade', folder: '8th Grade', file: 'English_Curriculum_Grade_8.json', cefr: 'A2.3', hours: 5 },
  { gradeLabel: '9th Grade', folder: '9th Grade', file: 'English_Curriculum_Grade_9.json', cefr: 'A2.4', hours: 5 },
  { gradeLabel: '10th Grade', folder: '10th Grade', file: 'English_Curriculum_Grade_10.json', cefr: 'B1.1', hours: 5 },
  { gradeLabel: '11th Grade', folder: '11th Grade', file: 'English_Curriculum_Grade_11.json', cefr: 'B1.2', hours: 5 },
  { gradeLabel: '12th Grade', folder: '12th Grade', file: 'English_Curriculum_Grade_12.json', cefr: 'B1.3', hours: 5 }
];

function sanitizeFilename(name) {
  if (!name) return 'Untitled';
  return name
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\.+$/, '');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function extractScenarioData(raw, scenarioIndex) {
  const sNum = raw.scenarioNum || raw.scenario_number || raw.id || (scenarioIndex + 1);
  const sTitle = raw.scenarioName || raw.scenario_title || raw.title || `Scenario ${sNum}`;

  // Extract Theme Titles
  let t1 = '';
  let t2 = '';
  if (raw.theme1) t1 = raw.theme1;
  if (raw.theme2) t2 = raw.theme2;

  if (raw.themes && Array.isArray(raw.themes)) {
    if (typeof raw.themes[0] === 'string') {
      if (!t1) t1 = raw.themes[0];
      if (!t2 && raw.themes[1]) t2 = raw.themes[1];
    } else if (typeof raw.themes[0] === 'object') {
      if (!t1) t1 = raw.themes[0]?.theme_title || raw.themes[0]?.title || raw.themes[0]?.name || '';
      if (!t2 && raw.themes[1]) t2 = raw.themes[1]?.theme_title || raw.themes[1]?.title || raw.themes[1]?.name || '';
    }
  }

  // Fallbacks if only 1 theme exists or missing
  if (!t1) t1 = `${sTitle} - Foundation`;
  if (!t2) {
    if (sTitle.includes('Colors')) {
      t2 = 'My Favorite Color!';
    } else {
      t2 = `${t1} - In Action`;
    }
  }

  // Extract Standards for Listening, Reading, Speaking, Writing, Mediation
  const standards = {
    listening: { receptive: '', interactive: '' },
    reading: { receptive: '', interactive: '' },
    speaking: { receptive: '', interactive: '' },
    writing: { receptive: '', interactive: '' },
    mediation: { receptive: '', interactive: '' }
  };

  const stdContainer = raw.standardsAndLearningOutcomes || raw.standards_and_learning_outcomes || raw;
  const skillsList = ['listening', 'reading', 'speaking', 'writing', 'mediation'];

  for (const sk of skillsList) {
    const skData = stdContainer[sk] || raw[sk] || {};
    let rec = '';
    let act = '';

    if (skData.specificStandards) {
      if (typeof skData.specificStandards === 'object' && !Array.isArray(skData.specificStandards)) {
        rec = skData.specificStandards.receptive || '';
        act = skData.specificStandards.interactive || '';
      } else if (Array.isArray(skData.specificStandards)) {
        skData.specificStandards.forEach(item => {
          const str = String(item);
          if (str.toLowerCase().startsWith('receptive')) rec = str.replace(/^receptive[:\s-]*/i, '');
          else if (str.toLowerCase().startsWith('interactive')) act = str.replace(/^interactive[:\s-]*/i, '');
          else if (!rec) rec = str;
          else if (!act) act = str;
        });
      }
    } else if (skData.specific_standards) {
      if (typeof skData.specific_standards === 'object' && !Array.isArray(skData.specific_standards)) {
        rec = skData.specific_standards.receptive || '';
        act = skData.specific_standards.interactive || '';
      } else if (Array.isArray(skData.specific_standards)) {
        skData.specific_standards.forEach(item => {
          const str = String(item);
          if (str.toLowerCase().startsWith('receptive')) rec = str.replace(/^receptive[:\s-]*/i, '');
          else if (str.toLowerCase().startsWith('interactive')) act = str.replace(/^interactive[:\s-]*/i, '');
          else if (!rec) rec = str;
          else if (!act) act = str;
        });
      }
    } else if (skData.specific_standard) {
      const str = String(skData.specific_standard);
      if (str.toLowerCase().startsWith('receptive')) rec = str.replace(/^receptive[:\s-]*/i, '');
      else if (str.toLowerCase().startsWith('interactive')) act = str.replace(/^interactive[:\s-]*/i, '');
      else rec = str;
    }

    const gen = skData.generalStandard || skData.general_standard || '';
    if (!rec) rec = gen || `Identify main ideas, vocabulary and language structures related to ${sTitle}.`;
    if (!act) act = gen || `Participate in interactions, respond to prompts and communicate about ${sTitle}.`;

    standards[sk] = { receptive: rec.trim(), interactive: act.trim() };
  }

  // Extract Communicative Competences (Grammar, Vocabulary, Pragmatic, Sociolinguistic, Pronunciation)
  const cc = raw.communicativeCompetences || raw.communicative_competences || raw;
  const ling = cc.linguistic || cc.linguistic_competences || raw.linguistic_competences || {};

  // 1. Grammar
  let grammar = [];
  const rawGrammar = ling.grammaticalFeatures || ling.recommended_grammatical_features ||
    ling.grammatical_features || cc.grammatical_features || raw.grammar || raw.grammar_focus ||
    (Array.isArray(raw.linguistic_competences) ? raw.linguistic_competences : []);
  if (Array.isArray(rawGrammar)) {
    grammar = rawGrammar.map(g => typeof g === 'string' ? g : JSON.stringify(g));
  } else if (typeof rawGrammar === 'object' && rawGrammar !== null) {
    grammar = Object.entries(rawGrammar).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`);
  } else if (typeof rawGrammar === 'string' && rawGrammar) {
    grammar = [rawGrammar];
  }
  if (grammar.length === 0) {
    grammar = [
      `Present simple affirmative and interrogative related to ${sTitle}`,
      `Demonstratives and descriptive adjectives in context`,
      `Key question forms: "What is your favorite...?", "Do you like...?"`
    ];
  }

  // 2. Vocabulary
  let vocab = {};
  const rawVocab = ling.vocabulary || ling.recommended_vocabulary || raw.recommended_vocabulary ||
    raw.vocabulary || raw.vocabulary_focus || cc.vocabulary || {};
  if (typeof rawVocab === 'object' && rawVocab !== null && !Array.isArray(rawVocab)) {
    for (const [k, v] of Object.entries(rawVocab)) {
      if (Array.isArray(v)) vocab[k] = v.join(', ');
      else if (typeof v === 'string') vocab[k] = v;
      else if (typeof v === 'object' && v !== null) vocab[k] = Object.entries(v).map(([subK, subV]) => `${subK}: ${Array.isArray(subV) ? subV.join(', ') : subV}`).join('; ');
    }
  } else if (Array.isArray(rawVocab)) {
    vocab['core_vocabulary'] = rawVocab.join(', ');
  } else if (typeof rawVocab === 'string') {
    vocab['core_vocabulary'] = rawVocab;
  }
  if (Object.keys(vocab).length === 0) {
    vocab['nouns'] = `${sTitle.toLowerCase()}, place, friend, classroom, object, activity`;
    vocab['verbs'] = `see, explore, practice, say, write, read, share, participate`;
    vocab['adjectives'] = `favorite, great, interesting, new, clean, safe, helpful`;
  }

  // 3. Pronunciation & Phonemic Awareness
  let pronunciation = {};
  const rawPron = ling.pronunciationAndPhonemicAwareness || ling.pronunciation_and_phonemic_awareness ||
    ling.pronunciation || raw.pronunciation || {};
  if (typeof rawPron === 'object' && rawPron !== null) {
    if (rawPron.sounds) pronunciation['sounds'] = Array.isArray(rawPron.sounds) ? rawPron.sounds.join(', ') : rawPron.sounds;
    if (rawPron.phonemicAwareness || rawPron.phonemic_awareness) pronunciation['phonemicAwareness'] = rawPron.phonemicAwareness || rawPron.phonemic_awareness;
    if (rawPron.minimalPairs || rawPron.minimal_pairs) pronunciation['minimalPairs'] = Array.isArray(rawPron.minimalPairs || rawPron.minimal_pairs) ? (rawPron.minimalPairs || rawPron.minimal_pairs).join(', ') : (rawPron.minimalPairs || rawPron.minimal_pairs);
    if (Object.keys(pronunciation).length === 0 && Object.keys(rawPron).length > 0) {
      for (const [pk, pv] of Object.entries(rawPron)) {
        pronunciation[pk] = typeof pv === 'object' ? JSON.stringify(pv) : String(pv);
      }
    }
  } else if (typeof rawPron === 'string') {
    pronunciation['sounds'] = rawPron;
  }
  if (raw.phonemic_awareness && !pronunciation['phonemicAwareness']) {
    pronunciation['phonemicAwareness'] = typeof raw.phonemic_awareness === 'string' ? raw.phonemic_awareness : JSON.stringify(raw.phonemic_awareness);
  }
  if (Object.keys(pronunciation).length === 0) {
    pronunciation['sounds'] = `/s/, /t/, /d/ clear enunciation in core vocabulary`;
    pronunciation['phonemicAwareness'] = `Onset and rime recognition and blending in simple target words`;
  }

  // 4. Pragmatic
  let pragmatic = [];
  const rawPrag = cc.pragmatic || cc.pragmatic_competences || ling.pragmatic || raw.pragmatic_competences || raw.pragmatic || [];
  if (Array.isArray(rawPrag)) {
    pragmatic = rawPrag.map(p => typeof p === 'string' ? p : (p.function || p.title || JSON.stringify(p)));
  } else if (typeof rawPrag === 'object' && rawPrag !== null) {
    if (rawPrag.functions && Array.isArray(rawPrag.functions)) pragmatic = rawPrag.functions;
    else pragmatic = Object.entries(rawPrag).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`);
  } else if (typeof rawPrag === 'string') {
    pragmatic = [rawPrag];
  }
  if (pragmatic.length === 0) {
    pragmatic = [
      `Describing preferences and features: "This is my favorite because..."`,
      `Asking for and offering simple information in the classroom context`,
      `Discourse markers: and, but, because`
    ];
  }

  // 5. Sociolinguistic
  let socio = [];
  const rawSocio = cc.sociolinguistic || cc.sociolinguistic_competences || ling.sociolinguistic ||
    raw.sociolinguistic_competences || raw.sociolinguistic || [];
  if (Array.isArray(rawSocio)) {
    socio = rawSocio.map(s => typeof s === 'string' ? s : (s.element || s.title || JSON.stringify(s)));
  } else if (typeof rawSocio === 'object' && rawSocio !== null) {
    if (rawSocio.elements && Array.isArray(rawSocio.elements)) socio = rawSocio.elements;
    else socio = Object.entries(rawSocio).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`);
  } else if (typeof rawSocio === 'string') {
    socio = [rawSocio];
  }
  if (socio.length === 0) {
    socio = [
      `Using polite greetings and expressions (please, thank you, excuse me)`,
      `Respectful peer interaction during collaborative group work`
    ];
  }

  // 6. 21st-Century Projects
  let project1 = { title: 'Classroom Scenario Exhibition', overview: 'Students create illustrated posters showcasing their favorite elements of the scenario and explain their choices using target structures.' };
  let project2 = { title: 'Collaborative Community Showcase', overview: 'In teams, students prepare an interactive dialogue, roleplay or multimedia presentation sharing perspectives on the scenario.' };

  const projectsRaw = raw.assessment_ideas?.twenty_first_century_projects ||
    raw.twenty_first_century_projects || raw.projects || raw.century_21_project_ideas?.projects ||
    cc.assessmentIdeas?.projects || cc.twenty_first_century_projects;

  if (Array.isArray(projectsRaw) && projectsRaw.length > 0) {
    if (projectsRaw[0]) {
      const p0 = projectsRaw[0];
      project1 = {
        title: typeof p0 === 'string' ? p0 : (p0.title || p0.name || 'Project 1'),
        overview: typeof p0 === 'string' ? p0 : (p0.overview || p0.description || p0.task || 'Hands-on collaborative AOA project.')
      };
    }
    if (projectsRaw[1]) {
      const p1 = projectsRaw[1];
      project2 = {
        title: typeof p1 === 'string' ? p1 : (p1.title || p1.name || 'Project 2'),
        overview: typeof p1 === 'string' ? p1 : (p1.overview || p1.description || p1.task || 'Interactive communicative presentation.')
      };
    } else {
      project2 = {
        title: `${project1.title} (Interactive Presentation)`,
        overview: `Students present their ${project1.title.toLowerCase()} orally to classmates with roleplay and peer feedback.`
      };
    }
  }

  return {
    sNum,
    sTitle,
    t1,
    t2,
    standards,
    grammar,
    vocab,
    pronunciation,
    pragmatic,
    socio,
    project1,
    project2
  };
}

function buildThemePlannerHtml(params) {
  const {
    grade,
    cefr,
    hours,
    trimester,
    sNum,
    sTitle,
    themeTitle,
    themeType, // 'receptive' | 'interactive'
    standards,
    grammar,
    vocab,
    pronunciation,
    pragmatic,
    socio,
    project
  } = params;

  const isReceptive = themeType === 'receptive';
  const themeNum = isReceptive ? 1 : 2;
  const focusLabel = isReceptive ? 'Receptive (Listening/Reading focus)' : 'Interactive (Speaking/Writing focus)';

  // Build Section 2 Standards rows
  const stdRows = [
    { skill: 'Listening', text: isReceptive ? standards.listening.receptive : standards.listening.interactive },
    { skill: 'Reading', text: isReceptive ? standards.reading.receptive : standards.reading.interactive },
    { skill: 'Speaking', text: isReceptive ? standards.speaking.receptive : standards.speaking.interactive },
    { skill: 'Writing', text: isReceptive ? standards.writing.receptive : standards.writing.interactive },
    { skill: 'Mediation', text: isReceptive ? standards.mediation.receptive : standards.mediation.interactive }
  ];

  const standardsHtml = stdRows.map(r => `
    <tr>
      <td colspan="2" style="border:1px solid #333; padding:5px 8px; width:25%; font-weight:bold; background:#f8fafc;">${escapeHtml(r.skill)}</td>
      <td colspan="2" style="border:1px solid #333; padding:5px 8px;">${escapeHtml(r.text)}</td>
    </tr>
  `).join('');

  // Grammar HTML
  const grammarHtml = `
    <ul>
      ${grammar.map(g => `<li>${escapeHtml(g)}</li>`).join('')}
    </ul>
  `;

  // Vocabulary HTML
  let vocabHtml = '';
  for (const [k, v] of Object.entries(vocab)) {
    vocabHtml += `<p style="margin:2px 0;"><strong>${escapeHtml(k)}:</strong> ${escapeHtml(v)}</p>`;
  }
  if (Object.keys(pronunciation).length > 0) {
    vocabHtml += `<p style="margin:4px 0 2px 0;"><strong>Pronunciation and Phonemic Awareness:</strong></p><ul>`;
    for (const [pk, pv] of Object.entries(pronunciation)) {
      vocabHtml += `<li><b>${escapeHtml(pk)}:</b> ${escapeHtml(pv)}</li>`;
    }
    vocabHtml += `</ul>`;
  }

  // Pragmatic / Socio HTML
  let pragSocioHtml = `<p style="margin:2px 0;"><strong>Pragmatic Competences (Communicative Functions):</strong></p><ul>`;
  pragmatic.forEach(p => {
    pragSocioHtml += `<li>${escapeHtml(p)}</li>`;
  });
  pragSocioHtml += `</ul><p style="margin:4px 0 2px 0;"><strong>Sociolinguistic Competences:</strong></p><ul>`;
  socio.forEach(s => {
    pragSocioHtml += `<li>${escapeHtml(s)}</li>`;
  });
  pragSocioHtml += `</ul>`;

  // Project HTML
  const projectHtml = `
    <p style="margin:2px 0;"><strong>${escapeHtml(project.title)}</strong></p>
    <p style="margin:2px 0; font-size:10.5px; color:#334155;">${escapeHtml(project.overview)}</p>
  `;

  // Section 4 SMART Objectives
  const smartObjectivesHtml = isReceptive ? `
    <ul>
      <li><strong>Listening:</strong> By the end of the lessons, students will be able to identify at least three key ideas, vocabulary items, and auditory cues in short spoken texts about "${escapeHtml(themeTitle)}" with 80% accuracy.</li>
      <li><strong>Reading:</strong> By the end of the lessons, students will be able to read short, illustrated texts and match descriptive sentences about "${escapeHtml(sTitle)}" with corresponding visual representations with 85% accuracy.</li>
      <li><strong>Speaking:</strong> By the end of the lessons, students will be able to orally name target objects, state simple preferences, and answer guided questions about "${escapeHtml(themeTitle)}" during choral and pair drills.</li>
      <li><strong>Writing:</strong> By the end of the lessons, students will be able to complete sentence starters, label diagrams, and write two to three simple sentences about "${escapeHtml(themeTitle)}" using a provided word bank.</li>
      <li><strong>Mediation:</strong> By the end of the lessons, students will be able to convey key information about a visual poster or peer explanation to another student using simplified English or visual pointing.</li>
    </ul>
  ` : `
    <ul>
      <li><strong>Listening:</strong> By the end of the lessons, students will be able to comprehend communicative exchanges, questions, and instructions in authentic dialogues related to "${escapeHtml(themeTitle)}" with 85% accuracy.</li>
      <li><strong>Reading:</strong> By the end of the lessons, students will be able to interpret functional dialogues, roleplay scripts, and comic strips set in "${escapeHtml(sTitle)}" identifying questions, answers, and polite formulas.</li>
      <li><strong>Speaking:</strong> By the end of the lessons, students will be able to participate in interactive pair roleplays, asking and answering questions to negotiate meaning and complete communicative tasks in "${escapeHtml(themeTitle)}".</li>
      <li><strong>Writing:</strong> By the end of the lessons, students will be able to collaboratively write a 4-to-6-line functional dialogue, survey card, or short invitation message reflecting the interactive theme.</li>
      <li><strong>Mediation:</strong> By the end of the lessons, students will be able to act as facilitators, summarizing peer statements, resolving differences in pair work, and co-presenting the culminating 21st-century project.</li>
    </ul>
  `;

  // Section 5 Materials & DLN
  const materialsHtml = `
    <strong>Materials:</strong>
    <ul>
      <li>Official MEDUCA Classroom Anchor Poster for Scenario ${sNum} ("${escapeHtml(sTitle)}")</li>
      <li>Flashcards and picture cards with target vocabulary</li>
      <li>Audio recordings of contextual dialogues and songs</li>
      <li>Interactive AOA student worksheets and graphic organizers</li>
      <li>Real-world realia and classroom objects related to the theme</li>
      <li>Sentence strips, word banks, and speaking prompt cards</li>
      <li>Whiteboard, markers, colored pencils, and construction paper</li>
      <li>Canva / AOA digital resources and presentation projector</li>
    </ul>
  `;

  const dlnHtml = `
    <strong>Differentiation for Learning Needs (DLN):</strong>
    <ul>
      <li><strong>Visual Learners:</strong> Heavy reliance on the Scenario Anchor Poster, flashcards, color-coded sentence frames, and realia.</li>
      <li><strong>Auditory Learners:</strong> Authentic audio models, choral pronunciation drills, rhythmic chants, and pair repetitions.</li>
      <li><strong>Kinesthetic Learners:</strong> Total Physical Response (TPR), gesture matching, interactive roleplay movements, and hands-on poster crafting.</li>
      <li><strong>Scaffolding for Emergent Learners:</strong> Guided sentence frames, word banks with icon cues, bilingual support when necessary, and peer buddy system.</li>
      <li><strong>Extension for Advanced Learners:</strong> Open-ended conversational prompts, creating extended dialogues, and leading peer group discussions.</li>
      <li><strong>Collaborative Grouping:</strong> Mixed-ability pairs and small teams ensuring active communicative participation.</li>
    </ul>
  `;

  // Section 6 Learning Sequence (5 Lessons with Engage, Explore, Explain, Extend, Evaluate)
  const sequenceHtml = isReceptive ? `
    <tr>
      <td style="border:1px solid #333; padding:5px 8px; width:20%; vertical-align:top;"><strong>Lesson 1: Listening (Receptive Input)</strong></td>
      <td style="border:1px solid #333; padding:5px 8px; width:20%; vertical-align:top;">Students identify core vocabulary, phonemes, and main ideas in short audio descriptions of "${escapeHtml(themeTitle)}".</td>
      <td style="border:1px solid #333; padding:5px 8px; width:42%; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Engage:</strong> Display the official MEDUCA Anchor Poster for "${escapeHtml(sTitle)}". Teacher points to elements and asks "What do you see?" eliciting initial vocabulary.</p>
        <p style="margin:2px 0;"><strong>Explore:</strong> Play short audio clips or read teacher models. Students point to corresponding images on the poster and repeat key words with clapping rhythms.</p>
        <p style="margin:2px 0;"><strong>Explain:</strong> Clarify target words and model proper pronunciation of core phonemes (${escapeHtml(pronunciation.sounds || '/s/, /t/')}). Check comprehension through thumbs up/down checks.</p>
        <p style="margin:2px 0;"><strong>Extend:</strong> Students complete an auditory listen-and-circle worksheet, identifying items heard in the audio recordings.</p>
        <p style="margin:2px 0;"><strong>Evaluate:</strong> Formative check: Teacher observes student matching accuracy during the listen-and-point exit task.</p>
      </td>
      <td style="border:1px solid #333; padding:5px 8px; width:18%; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Resources:</strong> Anchor Poster, audio recordings, flashcards, worksheets.</p>
        <p style="margin:2px 0;"><strong>Assessment:</strong> Listening rubric / auditory identification checklist.</p>
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #333; padding:5px 8px; vertical-align:top;"><strong>Lesson 2: Reading (Decoding & Comprehension)</strong></td>
      <td style="border:1px solid #333; padding:5px 8px; vertical-align:top;">Students decode written words and match short descriptive sentences with corresponding visual illustrations.</td>
      <td style="border:1px solid #333; padding:5px 8px; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Engage:</strong> Quick word-matching warm-up: Flash written word cards and have students match them to Anchor Poster details.</p>
        <p style="margin:2px 0;"><strong>Explore:</strong> Guided shared reading of 2-3 short descriptive sentences highlighting "${escapeHtml(themeTitle)}". Students follow along with their fingers.</p>
        <p style="margin:2px 0;"><strong>Explain:</strong> Deconstruct target sentence structures (${escapeHtml(grammar[0] || 'Present simple')}). Guide students to use picture clues to deduce unknown words.</p>
        <p style="margin:2px 0;"><strong>Extend:</strong> In pairs, students read matching cards and pair short sentence strips with the correct scenario illustrations.</p>
        <p style="margin:2px 0;"><strong>Evaluate:</strong> Reading comprehension worksheet: match sentences to pictures and answer simple true/false questions.</p>
      </td>
      <td style="border:1px solid #333; padding:5px 8px; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Resources:</strong> Sentence strips, illustrated reading cards, reading worksheet.</p>
        <p style="margin:2px 0;"><strong>Assessment:</strong> Written comprehension check (85% target accuracy).</p>
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #333; padding:5px 8px; vertical-align:top;"><strong>Lesson 3: Speaking (Oral Reinforcement)</strong></td>
      <td style="border:1px solid #333; padding:5px 8px; vertical-align:top;">Students accurately pronounce target words and express basic preferences using guided sentence frames.</td>
      <td style="border:1px solid #333; padding:5px 8px; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Engage:</strong> Choral chant practicing pronunciation contrasts and target vocabulary with physical gestures (TPR).</p>
        <p style="margin:2px 0;"><strong>Explore:</strong> Teacher models sentence frame: "This is my favorite because...". Students practice repeating in small choral groups.</p>
        <p style="margin:2px 0;"><strong>Explain:</strong> Focus on sentence intonation and stress. Provide positive corrective feedback on vowel and consonant articulation.</p>
        <p style="margin:2px 0;"><strong>Extend:</strong> Pair speaking activity: Student A asks "Which one is your favorite?", Student B points and answers using the frame.</p>
        <p style="margin:2px 0;"><strong>Evaluate:</strong> Observational speaking rubric: teacher circulates and assesses fluency, pronunciation, and frame usage.</p>
      </td>
      <td style="border:1px solid #333; padding:5px 8px; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Resources:</strong> Speaking cue-cards, flashcards, sentence frame board.</p>
        <p style="margin:2px 0;"><strong>Assessment:</strong> Oral fluency & pronunciation observational checklist.</p>
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #333; padding:5px 8px; vertical-align:top;"><strong>Lesson 4: Writing (Guided Production)</strong></td>
      <td style="border:1px solid #333; padding:5px 8px; vertical-align:top;">Students write 2-3 structured sentences describing features of "${escapeHtml(themeTitle)}" using a supportive word bank.</td>
      <td style="border:1px solid #333; padding:5px 8px; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Engage:</strong> Interactive board scramble: organize mixed-up word tiles into a grammatically correct sentence.</p>
        <p style="margin:2px 0;"><strong>Explore:</strong> Graphic organizer: students brainstorm 3 vocabulary words and 1 adjective to describe their chosen scenario feature.</p>
        <p style="margin:2px 0;"><strong>Explain:</strong> Review capital letters at the beginning and periods at the end of sentences. Emphasize connector words (and, because).</p>
        <p style="margin:2px 0;"><strong>Extend:</strong> Individual writing task: complete sentence starters on the activity worksheet and draw a matching illustration.</p>
        <p style="margin:2px 0;"><strong>Evaluate:</strong> Writing rubric: evaluate capital letters, word order, spelling accuracy, and punctuation.</p>
      </td>
      <td style="border:1px solid #333; padding:5px 8px; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Resources:</strong> Graphic organizers, writing sheets, word banks, crayons.</p>
        <p style="margin:2px 0;"><strong>Assessment:</strong> Writing rubric: sentence mechanics and vocabulary use.</p>
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #333; padding:5px 8px; vertical-align:top;"><strong>Lesson 5: Mediation &amp; 21st-Century Project</strong></td>
      <td style="border:1px solid #333; padding:5px 8px; vertical-align:top;">Students mediate visual/written information to peers and present the culminating project: "${escapeHtml(project.title)}".</td>
      <td style="border:1px solid #333; padding:5px 8px; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Engage:</strong> Teacher demonstrates mediation: taking peer drawing and explaining its meaning to the rest of the class in simple words.</p>
        <p style="margin:2px 0;"><strong>Explore:</strong> Pairs finalize their 21st-Century Project posters/displays, combining their written sentences from Lesson 4 with illustrations.</p>
        <p style="margin:2px 0;"><strong>Explain:</strong> Review active listening rules for the audience and presentation tips (eye contact, clear voice).</p>
        <p style="margin:2px 0;"><strong>Extend:</strong> Classroom Gallery Walk: half the students present their posters while the other half rotates, asking questions and learning.</p>
        <p style="margin:2px 0;"><strong>Evaluate:</strong> Summative evaluation rubric assessing project completion, mediation ability, oral delivery, and peer collaboration.</p>
      </td>
      <td style="border:1px solid #333; padding:5px 8px; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Resources:</strong> Student project posters, exhibition space, evaluation rubrics.</p>
        <p style="margin:2px 0;"><strong>Assessment:</strong> Culminating AOA 21st-Century Project & Mediation rubric.</p>
      </td>
    </tr>
  ` : `
    <tr>
      <td style="border:1px solid #333; padding:5px 8px; width:20%; vertical-align:top;"><strong>Lesson 1: Listening (Conversational Immersion)</strong></td>
      <td style="border:1px solid #333; padding:5px 8px; width:20%; vertical-align:top;">Students comprehend conversational dialogues and identify turn-taking cues and questions in "${escapeHtml(themeTitle)}".</td>
      <td style="border:1px solid #333; padding:5px 8px; width:42%; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Engage:</strong> Teacher performs an authentic interactive greeting exchange with a puppet or student volunteer set in "${escapeHtml(sTitle)}".</p>
        <p style="margin:2px 0;"><strong>Explore:</strong> Listen to a recorded dialogue. Students raise hands when they hear question words (What, How much, Do you, Where).</p>
        <p style="margin:2px 0;"><strong>Explain:</strong> Deconstruct conversational markers and polite expressions (${escapeHtml(socio[0] || 'polite expressions')}). Highlight rising intonation in questions.</p>
        <p style="margin:2px 0;"><strong>Extend:</strong> Echo-drill: in split chorus, Group A speaks the question lines, Group B responds with the answer lines.</p>
        <p style="margin:2px 0;"><strong>Evaluate:</strong> Quick auditory check: identify which character asked for help or initiated the exchange.</p>
      </td>
      <td style="border:1px solid #333; padding:5px 8px; width:18%; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Resources:</strong> Audio dialogue, dialogue transcripts, puppet/props.</p>
        <p style="margin:2px 0;"><strong>Assessment:</strong> Interactive listening comprehension check.</p>
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #333; padding:5px 8px; vertical-align:top;"><strong>Lesson 2: Reading (Dialogue & Discourse Analysis)</strong></td>
      <td style="border:1px solid #333; padding:5px 8px; vertical-align:top;">Students read and analyze functional comic strips and roleplay dialogues, recognizing communicative functions.</td>
      <td style="border:1px solid #333; padding:5px 8px; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Engage:</strong> Display comic strip panels with empty speech bubbles. Students predict what the characters are talking about.</p>
        <p style="margin:2px 0;"><strong>Explore:</strong> Guided reading of a 6-line roleplay script set in "${escapeHtml(sTitle)}". Students identify question-and-answer pairs.</p>
        <p style="margin:2px 0;"><strong>Explain:</strong> Focus on grammar in interaction (${escapeHtml(grammar[0] || 'Question forms')}). Highlight polite functional phrases.</p>
        <p style="margin:2px 0;"><strong>Extend:</strong> Dialogue matching puzzle: in pairs, students re-order mixed-up dialogue strips into a logical conversation sequence.</p>
        <p style="margin:2px 0;"><strong>Evaluate:</strong> Reading comprehension check: match question bubbles to the corresponding appropriate response.</p>
      </td>
      <td style="border:1px solid #333; padding:5px 8px; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Resources:</strong> Comic strips, cut-out dialogue strips, matching worksheet.</p>
        <p style="margin:2px 0;"><strong>Assessment:</strong> Discourse structure & dialogue sequence accuracy check.</p>
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #333; padding:5px 8px; vertical-align:top;"><strong>Lesson 3: Speaking (Interactive Roleplay)</strong></td>
      <td style="border:1px solid #333; padding:5px 8px; vertical-align:top;">Students participate in pair roleplays and information-gap tasks, negotiating meaning and exchanging information.</td>
      <td style="border:1px solid #333; padding:5px 8px; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Engage:</strong> Roleplay speed-dating warmup: quick 30-second question-and-answer exchanges rotating with different partners.</p>
        <p style="margin:2px 0;"><strong>Explore:</strong> Information-gap activity: Student A has partial information (e.g., items, times, preferences) and must ask Student B to complete their chart.</p>
        <p style="margin:2px 0;"><strong>Explain:</strong> Teacher reviews clarification strategies: "Can you repeat, please?", "Excuse me", "How do you say...?".</p>
        <p style="margin:2px 0;"><strong>Extend:</strong> Pairs perform their 4-line simulated roleplay using scenario props and authentic realia.</p>
        <p style="margin:2px 0;"><strong>Evaluate:</strong> Interactive speaking rubric: evaluate turn-taking, responsiveness, polite forms, and accurate vocabulary usage.</p>
      </td>
      <td style="border:1px solid #333; padding:5px 8px; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Resources:</strong> Info-gap task cards, scenario roleplay props, cue cards.</p>
        <p style="margin:2px 0;"><strong>Assessment:</strong> Interactive oral communication rubric (turn-taking & fluency).</p>
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #333; padding:5px 8px; vertical-align:top;"><strong>Lesson 4: Writing (Collaborative Scripting)</strong></td>
      <td style="border:1px solid #333; padding:5px 8px; vertical-align:top;">Students collaboratively draft an original 4-to-6-line roleplay script or questionnaire based on "${escapeHtml(themeTitle)}".</td>
      <td style="border:1px solid #333; padding:5px 8px; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Engage:</strong> Teacher writes a collaborative script opening on the board with student suggestions for character names and scenario settings.</p>
        <p style="margin:2px 0;"><strong>Explore:</strong> In pairs, students plan their interactive dialogue using a scripted template: Person A (Question), Person B (Answer + Follow-up).</p>
        <p style="margin:2px 0;"><strong>Explain:</strong> Highlight dialogue punctuation (quotation marks, question marks, commas) and cohesive connectors.</p>
        <p style="margin:2px 0;"><strong>Extend:</strong> Peer editing exchange: pairs swap drafts and check if all questions have clear answers using an editing checklist.</p>
        <p style="margin:2px 0;"><strong>Evaluate:</strong> Written dialogue assessment rubric: evaluates communicative clarity, grammatical accuracy, and cooperative drafting.</p>
      </td>
      <td style="border:1px solid #333; padding:5px 8px; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Resources:</strong> Script templates, peer editing checklists, markers.</p>
        <p style="margin:2px 0;"><strong>Assessment:</strong> Collaborative dialogue writing rubric.</p>
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #333; padding:5px 8px; vertical-align:top;"><strong>Lesson 5: Mediation &amp; Culminating AOA Showcase</strong></td>
      <td style="border:1px solid #333; padding:5px 8px; vertical-align:top;">Students present their culminating interactive project: "${escapeHtml(project.title)}", mediating meaning and answering audience questions.</td>
      <td style="border:1px solid #333; padding:5px 8px; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Engage:</strong> Warm-up encouragement and role assignment: presenters, moderators, and active audience responders.</p>
        <p style="margin:2px 0;"><strong>Explore:</strong> Pairs/teams present their live interactive showcase, acting out their written dialogues and demonstrating their project visual.</p>
        <p style="margin:2px 0;"><strong>Explain:</strong> Students demonstrate mediation skills by rephrasing peer contributions and explaining their project decisions to the audience.</p>
        <p style="margin:2px 0;"><strong>Extend:</strong> Audience interaction: classmates ask questions ("Why did you choose...?", "How does this work?") and presenters respond.</p>
        <p style="margin:2px 0;"><strong>Evaluate:</strong> Comprehensive project assessment: oral interaction rubric, mediation checklist, self and peer evaluation reflections.</p>
      </td>
      <td style="border:1px solid #333; padding:5px 8px; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Resources:</strong> Project visuals, showcase stage/area, comprehensive rubrics.</p>
        <p style="margin:2px 0;"><strong>Assessment:</strong> Culminating AOA Interactive Project & Mediation scoring rubric.</p>
      </td>
    </tr>
  `;

  // Narrow Margins HTML Document Layout
  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="UTF-8">
  <title>Theme Planner - ${escapeHtml(grade)} - Scenario ${sNum} - Theme ${themeNum}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page Section1 {
      size: 8.5in 11.0in;
      margin: 0.4in 0.4in 0.4in 0.4in;
      mso-header-margin: 0.2in;
      mso-footer-margin: 0.2in;
      mso-paper-source: 0;
    }
    div.Section1 {
      page: Section1;
    }
    body {
      font-family: Arial, sans-serif;
      font-size: 11px;
      color: #1e293b;
      line-height: 1.35;
      margin: 0;
      padding: 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 6px;
      font-family: Arial, sans-serif;
      font-size: 11px;
      mso-table-layout-alt: fixed;
    }
    th, td {
      border: 1px solid #333333;
      padding: 4px 6px;
      vertical-align: top;
      font-size: 11px;
    }
    .section-title {
      background: #1a3a5c !important;
      color: #ffffff !important;
      font-weight: bold;
      border: 1px solid #333333;
      padding: 5px 8px;
    }
    p {
      margin: 2px 0;
    }
    ul {
      margin: 2px 0;
      padding-left: 18px;
    }
    li {
      margin-bottom: 2px;
    }
    b, strong {
      color: #0f172a;
    }
    .section-title strong {
      color: #ffffff !important;
    }
  </style>
</head>
<body>
<div class="Section1">
  <table style="width:100%; border-collapse:collapse; font-family:Arial; font-size:11px;">
    <tbody>
      <tr>
        <td colspan="4" style="border:1px solid #333; padding:6px 10px; text-align:center;">
          <p style="font-size:12px; margin:1px 0;"><strong>MINISTRY OF EDUCATION</strong></p>
          <p style="font-size:11px; margin:1px 0;"><strong>REGIONAL EDUCATION DIRECTORATE OF PANAMÁ</strong></p>
          <p style="font-size:11px; margin:1px 0;"><strong>OFICIAL MEDUCA SCHOOL</strong></p>
          <p style="font-size:12px; margin:2px 0; color:#1a3a5c;"><strong>Theme Planner #${themeNum} — Action-Oriented Approach (AOA)</strong></p>
        </td>
      </tr>
    </tbody>
    <tbody>
      <!-- 1. GENERAL INFORMATION -->
      <tr>
        <td colspan="4" class="section-title">1. GENERAL INFORMATION</td>
      </tr>
      <tr>
        <td style="border:1px solid #333; width:25%;"><strong>Teacher:</strong> Docente de Inglés MEDUCA</td>
        <td style="border:1px solid #333; width:25%;"><strong>Grade:</strong> ${escapeHtml(grade)}</td>
        <td style="border:1px solid #333; width:25%;"><strong>CEFR Level:</strong> ${escapeHtml(cefr)}</td>
        <td style="border:1px solid #333; width:25%;"><strong>Trimester:</strong> ${escapeHtml(trimester)}</td>
      </tr>
      <tr>
        <td style="border:1px solid #333;"><strong>Weekly Hours:</strong> ${hours}</td>
        <td style="border:1px solid #333;"><strong>Weeks:</strong> 2</td>
        <td style="border:1px solid #333;"><strong>Scenario:</strong> ${escapeHtml(sTitle)}</td>
        <td style="border:1px solid #333;"><strong>Theme:</strong> ${escapeHtml(themeTitle)}</td>
      </tr>
      <tr>
        <td style="border:1px solid #333;"><strong>Focus Type:</strong> ${escapeHtml(focusLabel)}</td>
        <td colspan="3" style="border:1px solid #333;"><strong>Target Skills:</strong> Listening, Reading, Speaking, Mediation, Writing</td>
      </tr>

      <!-- 2. STANDARDS & LEARNING OUTCOMES -->
      <tr>
        <td colspan="4" class="section-title">2. STANDARDS &amp; LEARNING OUTCOMES</td>
      </tr>
      <tr>
        <td colspan="2" style="border:1px solid #333; background:#e2e8f0; font-weight:bold;">Focus Skills</td>
        <td colspan="2" style="border:1px solid #333; background:#e2e8f0; font-weight:bold;">Specific Standards</td>
      </tr>
      ${standardsHtml}

      <!-- 3. COMMUNICATIVE COMPETENCES (Exact 4 Columns) -->
      <tr>
        <td colspan="4" class="section-title">3. COMMUNICATIVE COMPETENCES</td>
      </tr>
      <tr>
        <td style="border:1px solid #333; width:25%; background:#e2e8f0; font-weight:bold; vertical-align:top;">GRAMMATICAL COMPETENCES</td>
        <td style="border:1px solid #333; width:25%; background:#e2e8f0; font-weight:bold; vertical-align:top;">LEXICAL/SEMANTIC COMPETENCES</td>
        <td style="border:1px solid #333; width:25%; background:#e2e8f0; font-weight:bold; vertical-align:top;">PRAGMATIC/DISCURSIVE COMPETENCES</td>
        <td style="border:1px solid #333; width:25%; background:#e2e8f0; font-weight:bold; vertical-align:top;">21ST CENTURY PROJECT</td>
      </tr>
      <tr>
        <td style="border:1px solid #333; width:25%; vertical-align:top;">
          ${grammarHtml}
        </td>
        <td style="border:1px solid #333; width:25%; vertical-align:top;">
          ${vocabHtml}
        </td>
        <td style="border:1px solid #333; width:25%; vertical-align:top;">
          ${pragSocioHtml}
        </td>
        <td style="border:1px solid #333; width:25%; vertical-align:top;">
          ${projectHtml}
        </td>
      </tr>

      <!-- 4. SPECIFIC OBJECTIVES (SMART) -->
      <tr>
        <td colspan="4" class="section-title">4. SPECIFIC OBJECTIVES (SMART)</td>
      </tr>
      <tr>
        <td colspan="4" style="border:1px solid #333; padding:6px 8px;">
          ${smartObjectivesHtml}
        </td>
      </tr>

      <!-- 5. MATERIALS & DIFFERENTIATION -->
      <tr>
        <td colspan="4" class="section-title">5. MATERIALS &amp; DIFFERENTIATION</td>
      </tr>
      <tr>
        <td colspan="2" style="border:1px solid #333; width:50%; vertical-align:top;">
          ${materialsHtml}
        </td>
        <td colspan="2" style="border:1px solid #333; width:50%; vertical-align:top;">
          ${dlnHtml}
        </td>
      </tr>

      <!-- 6. LEARNING SEQUENCE (AOA 5 Phases) -->
      <tr>
        <td colspan="4" class="section-title">6. LEARNING SEQUENCE</td>
      </tr>
      <tr>
        <td style="border:1px solid #333; width:20%; background:#e2e8f0; font-weight:bold; vertical-align:top;">Lesson Focus</td>
        <td style="border:1px solid #333; width:20%; background:#e2e8f0; font-weight:bold; vertical-align:top;">Specific Objective(s)</td>
        <td style="border:1px solid #333; width:42%; background:#e2e8f0; font-weight:bold; vertical-align:top;">Activities (AOA - Engage, Explore, Explain, Extend, Evaluate)</td>
        <td style="border:1px solid #333; width:18%; background:#e2e8f0; font-weight:bold; vertical-align:top;">Resources &amp; Assessment</td>
      </tr>
      ${sequenceHtml}
    </tbody>
  </table>
</div>
</body>
</html>`;
}

function safeWriteFileSync(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (err) {
    if (err.code === 'EBUSY') {
      console.warn(`⚠️ Archivo abierto actualmente en Word: ${path.basename(filePath)}. Se guardó como .updated.doc`);
      try {
        fs.writeFileSync(filePath.replace(/\.doc$/, '.updated.doc'), content, 'utf8');
      } catch (e) {}
      return true;
    }
    throw err;
  }
}

// -------------------------------------------------------------
// MAIN BATCH BUILDER EXECUTION
// -------------------------------------------------------------
console.log('🚀 Iniciando Generación de los 224 Theme Planners Oficiales MEDUCA (Estructura Completa de 6 Secciones y Márgenes Estrechos)...\n');

let totalGenerated = 0;
const manifest = [];

gradesConfig.forEach(cfg => {
  const filePath = path.join(CURRICULUMS_DIR, cfg.file);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Archivo no encontrado: ${cfg.file}`);
    return;
  }

  const rawJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const scenarios = rawJson.scenarios || [];

  console.log(`📚 Procesando Grado: ${cfg.gradeLabel} (${scenarios.length} escenarios)`);

  const gradeDir = path.join(OUTPUT_DIR, cfg.folder);
  if (!fs.existsSync(gradeDir)) {
    fs.mkdirSync(gradeDir, { recursive: true });
  }

  scenarios.forEach((scRaw, sIdx) => {
    const scData = extractScenarioData(scRaw, sIdx);
    const cleanScenarioFolder = sanitizeFilename(`Scenario ${scData.sNum} - ${scData.sTitle}`);
    const scenarioDir = path.join(gradeDir, cleanScenarioFolder);

    if (!fs.existsSync(scenarioDir)) {
      fs.mkdirSync(scenarioDir, { recursive: true });
    }

    const trimester = scData.sNum <= 3 ? '1st' : (scData.sNum <= 6 ? '2nd' : '3rd');

    // 1. Theme 1 (Receptive)
    const t1Html = buildThemePlannerHtml({
      grade: cfg.gradeLabel,
      cefr: cfg.cefr,
      hours: cfg.hours,
      trimester,
      sNum: scData.sNum,
      sTitle: scData.sTitle,
      themeTitle: scData.t1,
      themeType: 'receptive',
      standards: scData.standards,
      grammar: scData.grammar,
      vocab: scData.vocab,
      pronunciation: scData.pronunciation,
      pragmatic: scData.pragmatic,
      socio: scData.socio,
      project: scData.project1
    });

    const t1Filename = sanitizeFilename(`Theme Planner 1 (Receptive) - ${scData.t1}`) + '.doc';
    const t1Path = path.join(scenarioDir, t1Filename);
    safeWriteFileSync(t1Path, '\ufeff' + t1Html);
    totalGenerated++;

    // 2. Theme 2 (Interactive)
    const t2Html = buildThemePlannerHtml({
      grade: cfg.gradeLabel,
      cefr: cfg.cefr,
      hours: cfg.hours,
      trimester,
      sNum: scData.sNum,
      sTitle: scData.sTitle,
      themeTitle: scData.t2,
      themeType: 'interactive',
      standards: scData.standards,
      grammar: scData.grammar,
      vocab: scData.vocab,
      pronunciation: scData.pronunciation,
      pragmatic: scData.pragmatic,
      socio: scData.socio,
      project: scData.project2
    });

    const t2Filename = sanitizeFilename(`Theme Planner 2 (Interactive) - ${scData.t2}`) + '.doc';
    const t2Path = path.join(scenarioDir, t2Filename);
    safeWriteFileSync(t2Path, '\ufeff' + t2Html);
    totalGenerated++;

    manifest.push({
      grade: cfg.gradeLabel,
      gradeFolder: cfg.folder,
      cefr: cfg.cefr,
      scenarioNum: scData.sNum,
      scenarioTitle: scData.sTitle,
      trimester: `${trimester} Trimester`,
      themes: [
        {
          themeNumber: 1,
          themeType: 'receptive',
          title: scData.t1,
          filename: t1Filename,
          relativePath: `theme plannings/${cfg.folder}/${cleanScenarioFolder}/${t1Filename}`
        },
        {
          themeNumber: 2,
          themeType: 'interactive',
          title: scData.t2,
          filename: t2Filename,
          relativePath: `theme plannings/${cfg.folder}/${cleanScenarioFolder}/${t2Filename}`
        }
      ]
    });
  });
});

fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');

console.log(`\n🎉 ¡GENERACIÓN COMPLETADA CON ÉXITO!`);
console.log(`✅ Total Theme Planners generados: ${totalGenerated} de 224 esperados.`);
console.log(`✅ Formato oficial de 6 secciones MEDUCA aplicado.`);
console.log(`✅ Márgenes estrechos (0.4in) y optimización de espacio en Word aplicados.`);
console.log(`✅ Archivos guardados organizados en: ${OUTPUT_DIR}`);
console.log(`✅ Manifiesto actualizado en: ${MANIFEST_PATH}`);
