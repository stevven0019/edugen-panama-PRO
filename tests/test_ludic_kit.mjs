import { parseAoaLessonPlan } from '../src/resources/lessonParser.js';

const marketLesson = `
Lesson #: 3  Skills Focus: Speaking
Grade: 4th Grade (CEFR: A1.2)  Scenario: Shopping at the Market  Theme: How Much Is the Pineapple?
Key vocabulary: pineapple, apple, banana, potatoes, price, dollar.
`;

const pack = parseAoaLessonPlan(marketLesson);
console.log('Skill:', pack.skill);
console.log('LudicKit Game Name:', pack.ludicKit?.stage1Game?.name);
console.log('LudicKit Stage 1 Prompt:', pack.ludicKit?.stage1Game?.prompt);
console.log('LudicKit Product Cards:', pack.ludicKit?.stage3CardGame?.productCards?.map(c => c.name + ' ' + c.price));
console.log('LudicKit Mission Role A:', pack.ludicKit?.stage4Mission?.roleA?.role, '| tokens:', pack.ludicKit?.stage4Mission?.roleA?.tokens);
console.log('LudicKit Can-Do Statements:', pack.ludicKit?.stage5CanDo?.statements?.length);
console.log('LudicKit Teacher Guide Pacing:', pack.ludicKit?.teacherGuideSpecific?.pacingPlan?.length);
