import assert from 'node:assert/strict';
import { buildWorkbook } from '../src/resources/workbookPdf.js';
import { validatePack, latestAoa } from '../src/resources/activityPack.js';

const pack = {
  title: 'Where Is Your Book?',
  grade: 'Kinder',
  skill: 'Listening',
  lessonTitle: 'Classroom objects and locations',
  activities: [
    {
      type: 'picture_choice',
      title: 'Listen and circle',
      instruction: 'Listen to your teacher. Circle the picture.',
      items: [
        {
          teacherPrompt: 'The book is under the chair. Where is the book?',
          options: [
            { icon: 'book', position: 'under', anchor: 'chair', label: 'Book under the chair' },
            { icon: 'book', position: 'on', anchor: 'chair', label: 'Book on the chair' }
          ],
          answerIndex: 0
        },
        {
          teacherPrompt: 'Show me the bag.',
          options: [
            { icon: 'bag', label: 'Bag' },
            { icon: 'chair', label: 'Chair' }
          ],
          answerIndex: 0
        }
      ]
    },
    {
      type: 'match',
      title: 'Find the classroom objects',
      instruction: 'With your teacher, match each picture to its word.',
      items: [
        { icon: 'book', word: 'book' },
        { icon: 'bag', word: 'bag' },
        { icon: 'chair', word: 'chair' }
      ]
    },
    {
      type: 'draw_write',
      title: 'Draw and tell',
      instruction: 'Draw your classroom.',
      prompt: 'Draw a book on a desk. Point and tell your teacher.',
      teacherGuide: 'Accept a drawing with a book on the desk. Ask the child to point to the book.'
    }
  ],
  rubric: [
    {
      criterion: 'Recognizes classroom objects',
      independent: 'Points to the named object independently.',
      withSupport: 'Points after a repeated prompt.',
      emerging: 'Needs a model and guided practice.'
    },
    {
      criterion: 'Understands on and under',
      independent: 'Chooses the correct location.',
      withSupport: 'Chooses with gesture support.',
      emerging: 'Needs demonstration.'
    }
  ]
};

// 1. Selector logic for latest AOA lesson
assert.equal(latestAoa([{ type: 'resources', createdAt: '2026-09-15' }, { id: 'correct', type: 'planner', createdAt: '2026-09-14' }]).id, 'correct');

// 2. Validation failures for missing critical structure
assert.throws(() => validatePack(null));
assert.throws(() => validatePack({ ...pack, activities: [] }));

// 3. Auto-recovery and normalization without crashing
const recovered = structuredClone(pack);
recovered.activities[0].items[0].options[0].anchor = undefined; // anchor omitted by AI
recovered.activities[0].items[0].answerIndex = 99; // out of bounds
const validated = validatePack(recovered);
assert.equal(validated.activities[0].items[0].answerIndex, 0);
assert.ok(validated.activities[0].items[0].options[0].anchor, 'Auto-assigned anchor');

// 4. Kinder PDF builds with cover, activities, emotion reflection, teacher scripts & rubric
const kinderDoc = buildWorkbook(validated);
assert.ok(kinderDoc.getNumberOfPages() >= 7, 'Kinder PDF has 7+ pages');
console.log(`Kinder PDF successfully built with ${kinderDoc.getNumberOfPages()} pages.`);

// 5. Older grade (12th Grade Reading/Writing)
const secondaryPack = structuredClone(pack);
secondaryPack.grade = '12th Grade';
secondaryPack.skill = 'Reading & Writing';
secondaryPack.activities = [
  {
    type: 'read_answer',
    title: 'Reading Comprehension',
    instruction: 'Read the article about environmental conservation in Panama.',
    passage: 'Panama is home to rich biodiversity. Sustainable initiatives in schools help students understand waste reduction and reforestation efforts in their local communities.',
    questions: [
      { question: 'What is the main purpose of the school initiative?', answer: 'To educate students on waste reduction and reforestation.' }
    ]
  },
  pack.activities[2]
];

const secondaryDoc = buildWorkbook(secondaryPack);
assert.ok(secondaryDoc.getNumberOfPages() >= 5, 'Secondary PDF has 5+ pages');
console.log(`Secondary PDF successfully built with ${secondaryDoc.getNumberOfPages()} pages.`);
console.log('All workbook and multi-grade tests passed successfully.');
