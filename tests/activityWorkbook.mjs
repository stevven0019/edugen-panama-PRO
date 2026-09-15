import assert from 'node:assert/strict';
import { buildWorkbook } from '../src/resources/workbookPdf.js';
import { validatePack, latestAoa } from '../src/resources/activityPack.js';

// 1. Selector logic for latest AOA lesson
assert.equal(latestAoa([{ type: 'resources', createdAt: '2026-09-15' }, { id: 'correct', type: 'planner', createdAt: '2026-09-14' }]).id, 'correct');

// 2. Validation failures for missing critical structure
assert.throws(() => validatePack(null));
assert.throws(() => validatePack({ activities: [] }));

// 3. Test 4th Grade "How much is the pineapple?" (The exact scenario from the user's screenshot)
const pineapplePack = {
  title: 'At the Market: How Much Is the Pineapple?',
  grade: '4th Grade',
  skill: 'Listening',
  lessonTitle: 'Unit 2: Food & Shopping at the Central Market',
  timing: {
    warmUp: '10 min · Review fruits & grocery flashcards',
    presentation: '8 min · Model asking prices: "How much is...?"',
    guidedPractice: '12 min · Guided listening with audio dialogue cards',
    performance: '10 min · Pair shopping dialogue and table completion',
    reflection: '5 min · Self-assessment and price review'
  },
  activities: [
    {
      type: 'card_choices',
      title: 'Activity 1: Listen and Identify the Price',
      instruction: 'Listen to the customer and vendor. Check [ ] the card with the correct fruit and price mentioned.',
      items: [
        {
          teacherPrompt: 'Customer: Hello! How much is the sweet pineapple? Vendor: The pineapple is two dollars and fifty cents.',
          options: [
            { letter: 'A', label: 'Pineapple', subtext: '$2.50' },
            { letter: 'B', label: 'Watermelon', subtext: '$3.00' }
          ],
          answerIndex: 0
        },
        {
          teacherPrompt: 'Customer: How much are the yellow bananas? Vendor: The bunch of bananas is one dollar.',
          options: [
            { letter: 'A', label: 'Oranges', subtext: '$1.50' },
            { letter: 'B', label: 'Bananas', subtext: '$1.00' }
          ],
          answerIndex: 1
        }
      ]
    },
    {
      type: 'table_checklist',
      title: 'Activity 2: Shopping List Checklist',
      instruction: 'Listen to Maria at the market. Check if each item was heard and write the price.',
      headers: ['Market Fruit', 'Heard in Audio?', 'Price'],
      rows: [
        { col1: 'Fresh Pineapple', col2: '[ ] Yes   [ ] No', col3: '$2.50' },
        { col1: 'Ripe Papaya', col2: '[ ] Yes   [ ] No', col3: '$1.25' },
        { col1: 'Green Apples (bag)', col2: '[ ] Yes   [ ] No', col3: '$2.00' }
      ],
      teacherScript: 'Maria bought a fresh pineapple for $2.50, ripe papayas for $1.25, and a bag of green apples for $2.00.'
    },
    {
      type: 'dialogue_cloze',
      title: 'Activity 3: Complete the Market Dialogue',
      instruction: 'Listen to the conversation and fill in the blanks using the Word Bank.',
      wordBank: ['pineapple', 'dollars', 'market', 'change'],
      lines: [
        { speaker: 'Vendor', text: 'Good morning! Welcome to our fruit _______.' },
        { speaker: 'Customer', text: 'Excuse me, how much is this big _______?' },
        { speaker: 'Vendor', text: 'That one is two _______ and fifty cents.' },
        { speaker: 'Customer', text: 'Here is a five-dollar bill. Keep the _______.' }
      ],
      teacherScript: 'Vendor: Good morning! Welcome to our fruit market. Customer: Excuse me, how much is this big pineapple? Vendor: That one is two dollars and fifty cents. Customer: Here is a five-dollar bill. Keep the change.'
    }
  ],
  rubric: [
    {
      criterion: 'Listening for Specific Information (Prices & Items)',
      independent: 'Identifies prices and fruit items with 90-100% accuracy without prompts.',
      withSupport: 'Identifies items and numbers with 1-2 audio repetitions or visual support.',
      emerging: 'Requires direct teacher translation and step-by-step assistance.'
    }
  ]
};

const pineappleDoc = buildWorkbook(pineapplePack);
assert.ok(pineappleDoc.getNumberOfPages() >= 6, '4th Grade Workbook has 6+ pages');
console.log(`4th Grade "How much is the pineapple?" PDF built with ${pineappleDoc.getNumberOfPages()} pages.`);

// 4. Test Kinder listening workbook
const kinderPack = {
  title: 'Where Is Your Book?',
  grade: 'Kinder',
  skill: 'Listening',
  lessonTitle: 'Classroom objects and locations',
  activities: [
    {
      type: 'card_choices',
      title: 'Listen and Point',
      instruction: 'Listen to your teacher. Point to or circle the picture.',
      items: [
        {
          teacherPrompt: 'The book is on the desk.',
          options: [
            { icon: 'book', position: 'on', anchor: 'desk', label: 'On the desk' },
            { icon: 'book', position: 'under', anchor: 'desk', label: 'Under the desk' }
          ],
          answerIndex: 0
        }
      ]
    },
    {
      type: 'matching',
      title: 'Match the Objects',
      instruction: 'With your teacher, match each picture to its word.',
      pairs: [
        { left: 'Book', right: 'book' },
        { left: 'Chair', right: 'chair' }
      ]
    }
  ],
  rubric: [
    {
      criterion: 'Understands on and under',
      independent: 'Points to correct location independently.',
      withSupport: 'Points with gesture support.',
      emerging: 'Needs continuous demonstration.'
    }
  ]
};

const kinderDoc = buildWorkbook(kinderPack);
assert.ok(kinderDoc.getNumberOfPages() >= 5, 'Kinder PDF has 5+ pages');
console.log(`Kinder PDF built with ${kinderDoc.getNumberOfPages()} pages.`);

console.log('All multi-grade and authentic activity PDF checks passed!');
