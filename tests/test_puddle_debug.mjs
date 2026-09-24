import { parseAoaLessonPlan, getTopicVocabFallback } from '../src/resources/lessonParser.js';
import { renderWorkbookHtml } from '../src/resources/renderWorkbookHtml.js';

const text = `Lesson Planner – Theme # Where's the Puddle? – Lesson # 1
Complete this planner five times per theme, once per lesson (Lesson 1 through Lesson 5).

Lesson #: 1	Skills Focus: Listening
Grade: 4th Grade (CEFR: A1.2)	Scenario: It's the Rainy Season	Theme: Where's the Puddle?
Date(s): From ___ to ___	Learning Sequence Time: 45–50 min

Specific Objective: Listening: Identify the setting and characters in audio storybooks.

Learning Outcome: Listening: Can identify the setting and characters in simple audio stories about rain (e.g., 'The story is about a boy with an umbrella.'). Can join in simple exchanges about rainy days (e.g., 'What do you wear in the rain?' 'I wear boots.'). Can answer questions about rainy day items (e.g., 'What do you need?' 'I need an umbrella.').

The Six Action-Oriented Approach (AOA) Lesson Stages

STAGE 1 — Warm-up / Pre-task
Warm-up: The teacher begins by asking, "What's the weather like today?" and shows flashcards of different weather. The teacher then focuses on "rainy" weather, asking, "Is it raining today?" The teacher uses TPR to act out 'splashing in a puddle' and makes rain sounds. Students repeat the action and sound. The teacher introduces visuals (flashcards/realia) of raincoats, boots, and umbrellas.

Modeling: The teacher holds up an umbrella and says clearly, "This is an umbrella. I need an umbrella when it rains." The teacher models the pronunciation of key vocabulary like 'puddle' /pʌdl/ and 'rain' /reɪn/, emphasizing the initial sounds /p/ and /r/. Students listen and repeat chorally. The teacher then models simple sentences: "It is raining. I wear my boots. I like puddle-jumping." while showing related actions or pictures.
`;

const pack = parseAoaLessonPlan(text);
console.log('Title:', pack.title);
console.log('Scenario:', pack.scenario);
console.log('Skill:', pack.skill);
console.log('Part 1 Items:', pack.actionWorksheet.part1.items.map(i => i.word));
console.log('Part 2 Items:', pack.actionWorksheet.part2.items.map(i => i.sentence));

const html = renderWorkbookHtml(pack);
console.log('HTML contains tomato?:', html.includes('TOMATO') || html.includes('tomato'));
console.log('HTML contains vendor?:', html.includes('vendor'));
console.log('HTML contains puddle?:', html.includes('PUDDLE') || html.includes('puddle'));
console.log('HTML contains umbrella?:', html.includes('UMBRELLA') || html.includes('umbrella'));
console.log('HTML contains raincoat?:', html.includes('RAINCOAT') || html.includes('raincoat'));
console.log('HTML contains boots?:', html.includes('BOOTS') || html.includes('boots'));

// Stale metadata test: UI state has 'Helping in the Garden', but document text has 'It's the Rainy Season'
const stalePack = parseAoaLessonPlan(text, {
  scenario: 'Helping in the Garden',
  title: 'Helping in the Garden',
  skill: 'Listening',
  grade: '4th Grade'
});
console.log('\n--- Stale Metadata Override Test ---');
console.log('Stale Pack Scenario (should be It\'s the Rainy Season):', stalePack.scenario);
console.log('Stale Pack Title (should be Wheres the Puddle?):', stalePack.title);
console.log('Stale Pack Part 1 Items (should NOT contain tomato):', stalePack.actionWorksheet.part1.items.map(i => i.word));
console.log('Stale Pack Part 1 contains TOMATO?:', stalePack.actionWorksheet.part1.items.some(i => i.word === 'TOMATO'));


