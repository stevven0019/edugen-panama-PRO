import { normalizeThemeScenario } from './themeCurriculum.js';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildThemePlannerHtmlString(rawScenario, grade, cefr = 'A1.2', hours = 5, trimester = '1st', themeNum = 1) {
  const isReceptive = themeNum === 1;
  const themeType = isReceptive ? 'receptive' : 'interactive';
  const scData = normalizeThemeScenario(rawScenario, themeType);

  const sNum = scData.scenarioNum || 1;
  const sTitle = scData.scenarioName || `Scenario ${sNum}`;
  const themeTitle = isReceptive 
    ? (scData.theme1 || `${sTitle} - Foundation`)
    : (scData.theme2 || (sTitle.includes('Colors') ? 'My Favorite Color!' : `${sTitle} - In Action`));

  const focusLabel = isReceptive ? 'Receptive (Listening/Reading focus)' : 'Interactive (Speaking/Writing focus)';

  // 1. Extract Standards
  const stdContainer = rawScenario.standardsAndLearningOutcomes || rawScenario.standards_and_learning_outcomes || rawScenario;
  const skillsList = ['listening', 'reading', 'speaking', 'writing', 'mediation'];
  const standards = {};

  for (const sk of skillsList) {
    const skData = stdContainer[sk] || rawScenario[sk] || {};
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

    standards[sk] = isReceptive ? rec.trim() : act.trim();
  }

  // 2. Grammar
  const grammar = scData.grammar && scData.grammar.length > 0 
    ? scData.grammar 
    : [
        `Present simple affirmative and interrogative related to ${sTitle}`,
        `Demonstratives and descriptive adjectives in context`,
        `Key question forms: "What is your favorite...?", "Do you like...?"`
      ];

  // 3. Vocabulary & Pronunciation
  let vocabHtml = '';
  if (scData.vocabulary && typeof scData.vocabulary === 'object') {
    for (const [k, v] of Object.entries(scData.vocabulary)) {
      const items = Array.isArray(v) ? v.join(', ') : (typeof v === 'string' ? v : JSON.stringify(v));
      vocabHtml += `<p style="margin:2px 0;"><strong>${escapeHtml(k)}:</strong> ${escapeHtml(items)}</p>`;
    }
  } else {
    vocabHtml = `<p style="margin:2px 0;"><strong>core_vocabulary:</strong> ${sTitle.toLowerCase()}, classroom, friend, teacher, activity</p>`;
  }

  const pron = scData.pronunciation || {};
  if (Object.keys(pron).length > 0) {
    vocabHtml += `<p style="margin:4px 0 2px 0;"><strong>Pronunciation and Phonemic Awareness:</strong></p><ul>`;
    for (const [pk, pv] of Object.entries(pron)) {
      const val = typeof pv === 'object' ? JSON.stringify(pv) : String(pv);
      vocabHtml += `<li><b>${escapeHtml(pk)}:</b> ${escapeHtml(val)}</li>`;
    }
    vocabHtml += `</ul>`;
  }

  // 4. Pragmatic & Socio
  let pragSocioHtml = `<p style="margin:2px 0;"><strong>Pragmatic Competences (Communicative Functions):</strong></p><ul>`;
  const prag = scData.pragmatic && scData.pragmatic.length > 0 ? scData.pragmatic : [`Describing preferences: "This is my favorite because..."`, `Asking for and offering simple information in context`];
  prag.forEach(p => {
    pragSocioHtml += `<li>${escapeHtml(typeof p === 'string' ? p : JSON.stringify(p))}</li>`;
  });
  pragSocioHtml += `</ul><p style="margin:4px 0 2px 0;"><strong>Sociolinguistic Competences:</strong></p><ul>`;
  const socio = scData.sociolinguistic && scData.sociolinguistic.length > 0 ? scData.sociolinguistic : [`Using polite greetings and expressions (please, thank you)`, `Respectful interaction during pair work`];
  socio.forEach(s => {
    pragSocioHtml += `<li>${escapeHtml(typeof s === 'string' ? s : JSON.stringify(s))}</li>`;
  });
  pragSocioHtml += `</ul>`;

  // 5. 21st Century Project
  const projectText = scData.project21stCentury && scData.project21stCentury !== 'Not specified in the selected curriculum for this theme.'
    ? scData.project21stCentury
    : `Students prepare a collaborative AOA presentation and poster showcasing their favorite elements of ${sTitle}.`;

  // 6. SMART Objectives
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

  // 7. Materials & DLN
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

  // 8. Learning Sequence
  const sequenceHtml = isReceptive ? `
    <tr>
      <td style="border:1px solid #333; padding:4px 6px; width:20%; vertical-align:top;"><strong>Lesson 1: Listening (Receptive Input)</strong></td>
      <td style="border:1px solid #333; padding:4px 6px; width:20%; vertical-align:top;">Students identify core vocabulary, phonemes, and main ideas in short audio descriptions of "${escapeHtml(themeTitle)}".</td>
      <td style="border:1px solid #333; padding:4px 6px; width:42%; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Engage:</strong> Display the official MEDUCA Anchor Poster for "${escapeHtml(sTitle)}". Teacher points to elements and asks "What do you see?" eliciting initial vocabulary.</p>
        <p style="margin:2px 0;"><strong>Explore:</strong> Play short audio clips or read teacher models. Students point to corresponding images on the poster and repeat key words with clapping rhythms.</p>
        <p style="margin:2px 0;"><strong>Explain:</strong> Clarify target words and model proper pronunciation of core phonemes. Check comprehension through thumbs up/down checks.</p>
        <p style="margin:2px 0;"><strong>Extend:</strong> Students complete an auditory listen-and-circle worksheet, identifying items heard in the audio recordings.</p>
        <p style="margin:2px 0;"><strong>Evaluate:</strong> Formative check: Teacher observes student matching accuracy during the listen-and-point exit task.</p>
      </td>
      <td style="border:1px solid #333; padding:4px 6px; width:18%; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Resources:</strong> Anchor Poster, audio recordings, flashcards, worksheets.</p>
        <p style="margin:2px 0;"><strong>Assessment:</strong> Listening rubric / auditory identification checklist.</p>
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #333; padding:4px 6px; vertical-align:top;"><strong>Lesson 2: Reading (Decoding & Comprehension)</strong></td>
      <td style="border:1px solid #333; padding:4px 6px; vertical-align:top;">Students decode written words and match short descriptive sentences with corresponding visual illustrations.</td>
      <td style="border:1px solid #333; padding:4px 6px; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Engage:</strong> Quick word-matching warm-up: Flash written word cards and have students match them to Anchor Poster details.</p>
        <p style="margin:2px 0;"><strong>Explore:</strong> Guided shared reading of 2-3 short descriptive sentences highlighting "${escapeHtml(themeTitle)}". Students follow along with their fingers.</p>
        <p style="margin:2px 0;"><strong>Explain:</strong> Deconstruct target sentence structures. Guide students to use picture clues to deduce unknown words.</p>
        <p style="margin:2px 0;"><strong>Extend:</strong> In pairs, students read matching cards and pair short sentence strips with the correct scenario illustrations.</p>
        <p style="margin:2px 0;"><strong>Evaluate:</strong> Reading comprehension worksheet: match sentences to pictures and answer simple true/false questions.</p>
      </td>
      <td style="border:1px solid #333; padding:4px 6px; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Resources:</strong> Sentence strips, illustrated reading cards, reading worksheet.</p>
        <p style="margin:2px 0;"><strong>Assessment:</strong> Written comprehension check (85% target accuracy).</p>
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #333; padding:4px 6px; vertical-align:top;"><strong>Lesson 3: Speaking (Oral Reinforcement)</strong></td>
      <td style="border:1px solid #333; padding:4px 6px; vertical-align:top;">Students accurately pronounce target words and express basic preferences using guided sentence frames.</td>
      <td style="border:1px solid #333; padding:4px 6px; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Engage:</strong> Choral chant practicing pronunciation contrasts and target vocabulary with physical gestures (TPR).</p>
        <p style="margin:2px 0;"><strong>Explore:</strong> Teacher models sentence frame: "This is my favorite because...". Students practice repeating in small choral groups.</p>
        <p style="margin:2px 0;"><strong>Explain:</strong> Focus on sentence intonation and stress. Provide positive corrective feedback on vowel and consonant articulation.</p>
        <p style="margin:2px 0;"><strong>Extend:</strong> Pair speaking activity: Student A asks "Which one is your favorite?", Student B points and answers using the frame.</p>
        <p style="margin:2px 0;"><strong>Evaluate:</strong> Observational speaking rubric: teacher circulates and assesses fluency, pronunciation, and frame usage.</p>
      </td>
      <td style="border:1px solid #333; padding:4px 6px; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Resources:</strong> Speaking cue-cards, flashcards, sentence frame board.</p>
        <p style="margin:2px 0;"><strong>Assessment:</strong> Oral fluency & pronunciation observational checklist.</p>
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #333; padding:4px 6px; vertical-align:top;"><strong>Lesson 4: Writing (Guided Production)</strong></td>
      <td style="border:1px solid #333; padding:4px 6px; vertical-align:top;">Students write 2-3 structured sentences describing features of "${escapeHtml(themeTitle)}" using a supportive word bank.</td>
      <td style="border:1px solid #333; padding:4px 6px; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Engage:</strong> Interactive board scramble: organize mixed-up word tiles into a grammatically correct sentence.</p>
        <p style="margin:2px 0;"><strong>Explore:</strong> Graphic organizer: students brainstorm 3 vocabulary words and 1 adjective to describe their chosen scenario feature.</p>
        <p style="margin:2px 0;"><strong>Explain:</strong> Review capital letters at the beginning and periods at the end of sentences. Emphasize connector words (and, because).</p>
        <p style="margin:2px 0;"><strong>Extend:</strong> Individual writing task: complete sentence starters on the activity worksheet and draw a matching illustration.</p>
        <p style="margin:2px 0;"><strong>Evaluate:</strong> Writing rubric: evaluate capital letters, word order, spelling accuracy, and punctuation.</p>
      </td>
      <td style="border:1px solid #333; padding:4px 6px; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Resources:</strong> Graphic organizers, writing sheets, word banks, crayons.</p>
        <p style="margin:2px 0;"><strong>Assessment:</strong> Writing rubric: sentence mechanics and vocabulary use.</p>
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #333; padding:4px 6px; vertical-align:top;"><strong>Lesson 5: Mediation &amp; 21st-Century Project</strong></td>
      <td style="border:1px solid #333; padding:4px 6px; vertical-align:top;">Students mediate visual/written information to peers and present the culminating project.</td>
      <td style="border:1px solid #333; padding:4px 6px; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Engage:</strong> Teacher demonstrates mediation: taking peer drawing and explaining its meaning to the rest of the class in simple words.</p>
        <p style="margin:2px 0;"><strong>Explore:</strong> Pairs finalize their 21st-Century Project posters/displays, combining their written sentences from Lesson 4 with illustrations.</p>
        <p style="margin:2px 0;"><strong>Explain:</strong> Review active listening rules for the audience and presentation tips (eye contact, clear voice).</p>
        <p style="margin:2px 0;"><strong>Extend:</strong> Classroom Gallery Walk: half the students present their posters while the other half rotates, asking questions and learning.</p>
        <p style="margin:2px 0;"><strong>Evaluate:</strong> Summative evaluation rubric assessing project completion, mediation ability, oral delivery, and peer collaboration.</p>
      </td>
      <td style="border:1px solid #333; padding:4px 6px; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Resources:</strong> Student project posters, exhibition space, evaluation rubrics.</p>
        <p style="margin:2px 0;"><strong>Assessment:</strong> Culminating AOA 21st-Century Project & Mediation rubric.</p>
      </td>
    </tr>
  ` : `
    <tr>
      <td style="border:1px solid #333; padding:4px 6px; width:20%; vertical-align:top;"><strong>Lesson 1: Listening (Conversational Immersion)</strong></td>
      <td style="border:1px solid #333; padding:4px 6px; width:20%; vertical-align:top;">Students comprehend conversational dialogues and identify turn-taking cues and questions in "${escapeHtml(themeTitle)}".</td>
      <td style="border:1px solid #333; padding:4px 6px; width:42%; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Engage:</strong> Teacher performs an authentic interactive greeting exchange with a puppet or student volunteer set in "${escapeHtml(sTitle)}".</p>
        <p style="margin:2px 0;"><strong>Explore:</strong> Listen to a recorded dialogue. Students raise hands when they hear question words (What, How much, Do you, Where).</p>
        <p style="margin:2px 0;"><strong>Explain:</strong> Deconstruct conversational markers and polite expressions. Highlight rising intonation in questions.</p>
        <p style="margin:2px 0;"><strong>Extend:</strong> Echo-drill: in split chorus, Group A speaks the question lines, Group B responds with the answer lines.</p>
        <p style="margin:2px 0;"><strong>Evaluate:</strong> Quick auditory check: identify which character asked for help or initiated the exchange.</p>
      </td>
      <td style="border:1px solid #333; padding:4px 6px; width:18%; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Resources:</strong> Audio dialogue, dialogue transcripts, puppet/props.</p>
        <p style="margin:2px 0;"><strong>Assessment:</strong> Interactive listening comprehension check.</p>
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #333; padding:4px 6px; vertical-align:top;"><strong>Lesson 2: Reading (Dialogue & Discourse Analysis)</strong></td>
      <td style="border:1px solid #333; padding:4px 6px; vertical-align:top;">Students read and analyze functional comic strips and roleplay dialogues, recognizing communicative functions.</td>
      <td style="border:1px solid #333; padding:4px 6px; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Engage:</strong> Display comic strip panels with empty speech bubbles. Students predict what the characters are talking about.</p>
        <p style="margin:2px 0;"><strong>Explore:</strong> Guided reading of a 6-line roleplay script set in "${escapeHtml(sTitle)}". Students identify question-and-answer pairs.</p>
        <p style="margin:2px 0;"><strong>Explain:</strong> Focus on grammar in interaction. Highlight polite functional phrases.</p>
        <p style="margin:2px 0;"><strong>Extend:</strong> Dialogue matching puzzle: in pairs, students re-order mixed-up dialogue strips into a logical conversation sequence.</p>
        <p style="margin:2px 0;"><strong>Evaluate:</strong> Reading comprehension check: match question bubbles to the corresponding appropriate response.</p>
      </td>
      <td style="border:1px solid #333; padding:4px 6px; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Resources:</strong> Comic strips, cut-out dialogue strips, matching worksheet.</p>
        <p style="margin:2px 0;"><strong>Assessment:</strong> Discourse structure & dialogue sequence accuracy check.</p>
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #333; padding:4px 6px; vertical-align:top;"><strong>Lesson 3: Speaking (Interactive Roleplay)</strong></td>
      <td style="border:1px solid #333; padding:4px 6px; vertical-align:top;">Students participate in pair roleplays and information-gap tasks, negotiating meaning and exchanging information.</td>
      <td style="border:1px solid #333; padding:4px 6px; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Engage:</strong> Roleplay speed-dating warmup: quick 30-second question-and-answer exchanges rotating with different partners.</p>
        <p style="margin:2px 0;"><strong>Explore:</strong> Information-gap activity: Student A has partial information and must ask Student B to complete their chart.</p>
        <p style="margin:2px 0;"><strong>Explain:</strong> Teacher reviews clarification strategies: "Can you repeat, please?", "Excuse me", "How do you say...?".</p>
        <p style="margin:2px 0;"><strong>Extend:</strong> Pairs perform their 4-line simulated roleplay using scenario props and authentic realia.</p>
        <p style="margin:2px 0;"><strong>Evaluate:</strong> Interactive speaking rubric: evaluate turn-taking, responsiveness, polite forms, and accurate vocabulary usage.</p>
      </td>
      <td style="border:1px solid #333; padding:4px 6px; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Resources:</strong> Info-gap task cards, scenario roleplay props, cue cards.</p>
        <p style="margin:2px 0;"><strong>Assessment:</strong> Interactive oral communication rubric.</p>
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #333; padding:4px 6px; vertical-align:top;"><strong>Lesson 4: Writing (Collaborative Scripting)</strong></td>
      <td style="border:1px solid #333; padding:4px 6px; vertical-align:top;">Students collaboratively draft an original 4-to-6-line roleplay script or questionnaire based on "${escapeHtml(themeTitle)}".</td>
      <td style="border:1px solid #333; padding:4px 6px; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Engage:</strong> Teacher writes a collaborative script opening on the board with student suggestions for character names and scenario settings.</p>
        <p style="margin:2px 0;"><strong>Explore:</strong> In pairs, students plan their interactive dialogue using a scripted template: Person A (Question), Person B (Answer + Follow-up).</p>
        <p style="margin:2px 0;"><strong>Explain:</strong> Highlight dialogue punctuation (quotation marks, question marks, commas) and cohesive connectors.</p>
        <p style="margin:2px 0;"><strong>Extend:</strong> Peer editing exchange: pairs swap drafts and check if all questions have clear answers using an editing checklist.</p>
        <p style="margin:2px 0;"><strong>Evaluate:</strong> Written dialogue assessment rubric: evaluates communicative clarity, grammatical accuracy, and cooperative drafting.</p>
      </td>
      <td style="border:1px solid #333; padding:4px 6px; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Resources:</strong> Script templates, peer editing checklists, markers.</p>
        <p style="margin:2px 0;"><strong>Assessment:</strong> Collaborative dialogue writing rubric.</p>
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #333; padding:4px 6px; vertical-align:top;"><strong>Lesson 5: Mediation &amp; Culminating AOA Showcase</strong></td>
      <td style="border:1px solid #333; padding:4px 6px; vertical-align:top;">Students present their culminating interactive project, mediating meaning and answering audience questions.</td>
      <td style="border:1px solid #333; padding:4px 6px; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Engage:</strong> Warm-up encouragement and role assignment: presenters, moderators, and active audience responders.</p>
        <p style="margin:2px 0;"><strong>Explore:</strong> Pairs/teams present their live interactive showcase, acting out their written dialogues and demonstrating their project visual.</p>
        <p style="margin:2px 0;"><strong>Explain:</strong> Students demonstrate mediation skills by rephrasing peer contributions and explaining their project decisions to the audience.</p>
        <p style="margin:2px 0;"><strong>Extend:</strong> Audience interaction: classmates ask questions and presenters respond.</p>
        <p style="margin:2px 0;"><strong>Evaluate:</strong> Comprehensive project assessment: oral interaction rubric, mediation checklist, self and peer evaluation reflections.</p>
      </td>
      <td style="border:1px solid #333; padding:4px 6px; vertical-align:top;">
        <p style="margin:2px 0;"><strong>Resources:</strong> Project visuals, showcase stage/area, comprehensive rubrics.</p>
        <p style="margin:2px 0;"><strong>Assessment:</strong> Culminating AOA Interactive Project & Mediation scoring rubric.</p>
      </td>
    </tr>
  `;

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
      <tr>
        <td colspan="2" style="border:1px solid #333; padding:4px 6px; width:25%; font-weight:bold; background:#f8fafc;">Listening</td>
        <td colspan="2" style="border:1px solid #333; padding:4px 6px;">${escapeHtml(standards.listening)}</td>
      </tr>
      <tr>
        <td colspan="2" style="border:1px solid #333; padding:4px 6px; width:25%; font-weight:bold; background:#f8fafc;">Reading</td>
        <td colspan="2" style="border:1px solid #333; padding:4px 6px;">${escapeHtml(standards.reading)}</td>
      </tr>
      <tr>
        <td colspan="2" style="border:1px solid #333; padding:4px 6px; width:25%; font-weight:bold; background:#f8fafc;">Speaking</td>
        <td colspan="2" style="border:1px solid #333; padding:4px 6px;">${escapeHtml(standards.speaking)}</td>
      </tr>
      <tr>
        <td colspan="2" style="border:1px solid #333; padding:4px 6px; width:25%; font-weight:bold; background:#f8fafc;">Writing</td>
        <td colspan="2" style="border:1px solid #333; padding:4px 6px;">${escapeHtml(standards.writing)}</td>
      </tr>
      <tr>
        <td colspan="2" style="border:1px solid #333; padding:4px 6px; width:25%; font-weight:bold; background:#f8fafc;">Mediation</td>
        <td colspan="2" style="border:1px solid #333; padding:4px 6px;">${escapeHtml(standards.mediation)}</td>
      </tr>

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
          <ul>
            ${grammar.map(g => `<li>${escapeHtml(typeof g === 'string' ? g : JSON.stringify(g))}</li>`).join('')}
          </ul>
        </td>
        <td style="border:1px solid #333; width:25%; vertical-align:top;">
          ${vocabHtml}
        </td>
        <td style="border:1px solid #333; width:25%; vertical-align:top;">
          ${pragSocioHtml}
        </td>
        <td style="border:1px solid #333; width:25%; vertical-align:top;">
          <p style="margin:2px 0;"><strong>${escapeHtml(projectText)}</strong></p>
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

export function downloadThemePlannerDoc(rawScenario, grade, cefr, hours, trimester, themeNum) {
  const html = buildThemePlannerHtmlString(rawScenario, grade, cefr, hours, trimester, themeNum);
  const blob = new Blob(['\ufeff' + html], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const sNum = rawScenario.scenarioNum || rawScenario.scenario_number || rawScenario.id || 1;
  const isReceptive = themeNum === 1;
  const themeTitle = isReceptive 
    ? (rawScenario.theme1 || rawScenario.themes?.[0] || 'Theme 1')
    : (rawScenario.theme2 || rawScenario.themes?.[1] || 'Theme 2');
  const cleanTitle = (typeof themeTitle === 'string' ? themeTitle : themeTitle?.theme_title || 'Theme').replace(/[\\/:*?"<>|]/g, '').trim().replace(/\.+$/, '');
  
  const filename = `Theme Planner ${themeNum} (${isReceptive ? 'Receptive' : 'Interactive'}) - ${cleanTitle}.doc`;
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return filename;
}

