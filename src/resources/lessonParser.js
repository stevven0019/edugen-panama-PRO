/**
 * Parser that extracts structured 3-Page Pedagogical Activity Pack data
 * directly from EduGen AOA Lesson Plans (HTML, Docx-extracted text, or plain text).
 * 
 * Supports Pre-K to 12th Grade · 8 Scenarios · 5 Lessons per Scenario:
 * Lesson 1: Listening
 * Lesson 2: Reading
 * Lesson 3: Speaking
 * Lesson 4: Writing
 * Lesson 5: Mediation (21st Century Skills Project: Theme 1 -> Project 1, Theme 2 -> Project 2)
 */

import { getRealiaPhoto } from './realiaCatalog.js';
import {
  buildLessonContract,
  selectActivityPatterns,
  buildAOABlueprint,
  detectSkillFromText,
  normalizeSkill
} from './activityEngine.js';

export function sanitizeThemeTitle(rawTitle) {
  if (!rawTitle || typeof rawTitle !== 'string') return 'English AOA Lesson';
  let t = rawTitle
    .replace(/^Action Worksheet:\s*/i, '')
    .replace(/["'“”]/g, '')
    .replace(/^Action Worksheet:\s*/i, '')
    .replace(/^Planner\s*(?:AOA\s*)?[-–—:]\s*/i, '')
    .replace(/^Theme\s*#?\s*\d*\s*[-–—:]\s*/i, '')
    .replace(/^Theme\s*#?\s*/i, '')
    .replace(/[-–—:]\s*Lesson\s*#?\s*\d+.*$/i, '')
    .replace(/\(L\d+\)/gi, '')
    .replace(/^EduGen\s*(?:Pro\s*)?(?:AOA\s*)?[:\-–—]?\s*/i, '')
    .trim();
  t = t.replace(/^Planner\s*(?:AOA\s*)?[-–—:]?\s*/i, '')
       .replace(/^Theme\s*#?\s*\d*[-–—:]?\s*/i, '')
       .replace(/^Theme\s*#?\s*/i, '')
       .replace(/^Lesson\s*#?\s*\d*[-–—:]?\s*/i, '')
       .replace(/[-–—:]\s*Lesson\s*#?\s*\d+.*$/i, '')
       .replace(/^[:\-–—\s]+/, '')
       .replace(/[:\-–—\s]+$/, '')
       .trim();
  return t || 'English AOA Lesson';
}

const cleanHtml = (html) => {
  if (!html) return '';
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#128221;/g, '📝')
    .replace(/&#128202;/g, '📊')
    .replace(/&#128172;/g, '💬')
    .replace(/\s+/g, ' ')
    .trim();
};

const INVALID_VOCAB_REGEX = /^(?:the\s+teacher|the\s+student|teacher|student|model|models|modeling|describing|asking|explaining|identifying|practicing|evaluating|speaking|writing|reading|listening|stage|warm|warm-up|presentation|practice|production|assessment|reflection|step|grade|minute|time|materials|procedure|differentiation|learning|outcome|objective|check|dialogue|instructions?|rubric|performance|task|essential|target|language|comprehension|accuracy|fluency|inquiry|strategy|concept|detail|focus|context|element|statement|question|answer|true|false|yes|no|what|who|where|when|why|how|which|whose|this|that|these|those|is|are|was|were|do|does|did|have|has|had|can|could|would|should|will|different|different\s+weather|weather|clima|item|words?|pronunciation|initial\s+sounds?|sound|sounds?)/i;

const PREPOSITIONS_SET = new Set([
  'in', 'on', 'under', 'next to', 'next_to', 'behind', 'in front of', 'between', 'near', 'over', 'above', 'below', 'at', 'by', 'to', 'from', 'with', 'into', 'onto'
]);

export function isValidVocabWord(word) {
  if (!word || typeof word !== 'string') return false;
  const clean = word.replace(/^[#*_\s]+|[#*_\s]+$/g, '').trim();
  if (clean.length < 2 || clean.length > 22) return false;
  if (clean.split(/\s+/).length > 2) return false;
  if (/[.,;?!:()"'\[\]{}<>\/\\#*]/.test(clean)) return false;
  if (/\d/.test(clean)) return false;
  if (INVALID_VOCAB_REGEX.test(clean)) return false;
  if (/^the\s+/i.test(clean) && clean.split(/\s+/).length > 1) return false;
  if (PREPOSITIONS_SET.has(clean.toLowerCase())) return false;
  return true;
}

const extractHtmlKeywords = (html) => {
  if (!html) return [];
  const words = [];
  const matches = [...html.matchAll(/<(?:strong|b|em|li)[^>]*>([\s\S]*?)<\/(?:strong|b|em|li)>/gi)];
  for (const m of matches) {
    const raw = m[1].replace(/<[^>]+>/g, '').trim().toLowerCase();
    if (isValidVocabWord(raw)) {
      words.push(raw);
    }
  }
  return words;
};

export const CURRICULUM_TOPIC_VOCAB = {
  rain: ['puddle', 'umbrella', 'raincoat', 'boots', 'storm', 'cloud', 'sky', 'rain'],
  weather: ['puddle', 'umbrella', 'raincoat', 'boots', 'storm', 'cloud', 'sky', 'rain'],
  market: ['pineapple', 'banana', 'orange', 'apple', 'watermelon', 'market', 'price', 'dollar'],
  shopping: ['pineapple', 'banana', 'orange', 'shopping list', 'store', 'cashier', 'money', 'price'],
  fruit: ['pineapple', 'banana', 'orange', 'apple', 'watermelon', 'mango', 'papaya', 'lemon'],
  food: ['rice', 'chicken', 'fish', 'salad', 'water', 'fruit', 'vegetables', 'bread'],
  garden: ['tomato', 'plant', 'flower', 'seed', 'soil', 'water', 'sun', 'leaf'],
  neighborhood: ['park', 'library', 'store', 'school', 'playground', 'street', 'house', 'tree'],
  canal: ['canal', 'ship', 'boat', 'ocean', 'bridge', 'vessel', 'locks', 'goods'],
  beach: ['beach', 'towel', 'sand', 'shell', 'wave', 'picnic', 'sun', 'umbrella'],
  mola: ['mola', 'fabric', 'color', 'turtle', 'butterfly', 'jaguar', 'art', 'pattern'],
  clothing: ['pollera', 'dress', 'shirt', 'pants', 'shoes', 'hat', 'uniform', 'costume'],
  school: ['book', 'pencil', 'chair', 'desk', 'bag', 'crayon'],
  animal: ['jaguar', 'monkey', 'toucan', 'sloth', 'bird', 'frog', 'turtle', 'fish'],
  nature: ['tree', 'river', 'forest', 'sun', 'flower', 'cloud', 'rain', 'mountain'],
  recycle: ['recycle', 'bin', 'bottle', 'plastic', 'compost', 'trash', 'environment', 'paper'],
  community: ['house', 'street', 'park', 'hospital', 'school', 'store', 'bus', 'library'],
  family: ['mother', 'father', 'brother', 'sister', 'grandmother', 'grandfather', 'baby', 'family'],
  health: ['exercise', 'water', 'fruit', 'sleep', 'doctor', 'teeth', 'soap', 'clean'],
  technology: ['computer', 'robot', 'screen', 'keyboard', 'internet', 'phone', 'tablet', 'code'],
  transport: ['bus', 'car', 'train', 'metro', 'boat', 'airplane', 'bicycle', 'station'],
  project: ['poster', 'chart', 'guide', 'presentation', 'team', 'display', 'research', 'card'],
  colors: ['green', 'blue', 'red', 'yellow', 'purple', 'orange', 'small', 'big']
};

export function detectScenarioDomain(scenario = '', theme = '', textContext = '') {
  const combined = `${scenario} ${theme} ${textContext}`.toLowerCase();
  if (/color|colores|red|blue|green|yellow|purple|orange|small|big|tama[ñn]o|palette|paint|draw|arte|craft/i.test(combined)) return 'colors';
  if (/rain|weather|puddle|umbrella|storm|cloud|lightning|thunder|clima|lluvia|temporal|estaci[oó]n\s+lluviosa/i.test(combined)) return 'weather';
  if (/garden|plant|seed|soil|flower|vegetable|watering|huerto|jard[ií]n/i.test(combined)) return 'garden';
  if (/market|shopping|fruit|price|dollar|cost|supermercado|mercado|compra/i.test(combined)) return 'market';
  if (/canal|ship|boat|ocean|locks|vessel|puente de las am[eé]ricas/i.test(combined)) return 'canal';
  if (/animal|wildlife|bird|toucan|jaguar|sloth|monkey|fauna|selva/i.test(combined)) return 'animals';
  if (/classroom|school|desk|pencil|backpack|book|sal[oó]n|escuela/i.test(combined)) return 'classroom';
  if (/health|doctor|exercise|hygiene|salud/i.test(combined)) return 'health';
  if (/community|neighborhood|city|town|park|street|comunidad/i.test(combined)) return 'community';
  return 'general';
}

export function getTopicVocabFallback(textContext) {
  const domain = detectScenarioDomain('', '', textContext);
  if (domain === 'colors') return CURRICULUM_TOPIC_VOCAB.colors;
  if (domain === 'weather') return CURRICULUM_TOPIC_VOCAB.weather;
  if (domain === 'garden') return CURRICULUM_TOPIC_VOCAB.garden;
  if (domain === 'market') return CURRICULUM_TOPIC_VOCAB.market;
  if (domain === 'canal') return CURRICULUM_TOPIC_VOCAB.canal;
  if (domain === 'animals') return CURRICULUM_TOPIC_VOCAB.animal;
  if (domain === 'classroom') return CURRICULUM_TOPIC_VOCAB.school;
  if (domain === 'health') return CURRICULUM_TOPIC_VOCAB.health;
  if (domain === 'community') return CURRICULUM_TOPIC_VOCAB.community;

  const lower = (textContext || '').toLowerCase();
  for (const [key, list] of Object.entries(CURRICULUM_TOPIC_VOCAB)) {
    if (lower.includes(key)) return list;
  }
  return ['book', 'desk', 'pencil', 'chair', 'bag', 'apple'];
}

export function buildPart2Items({
  skill = 'Listening',
  scenario = '',
  cleanTheme = '',
  vocabWords = [],
  grade = '4th Grade'
}) {
  const normSkill = normalizeSkill(skill);
  const domain = detectScenarioDomain(scenario, cleanTheme, vocabWords.join(' '));
  const w0 = vocabWords[0] || 'item';
  const w1 = vocabWords[1] || 'item';
  const w2 = vocabWords[2] || 'item';
  const w3 = vocabWords[3] || 'item';

  if (normSkill === 'Listening') {
    if (domain === 'weather') {
      return [
        {
          concept: 'LISTEN & VERIFY 1',
          sentence: `The teacher introduces the lesson by asking about the weather and pointing to the ${w0}.`,
          subject: w0,
          photoUrl: getRealiaPhoto(w0)
        },
        {
          concept: 'LISTEN & VERIFY 2',
          sentence: `The speaker in the audio dialogue specifically mentions the ${w1} in the rain.`,
          subject: w1,
          photoUrl: getRealiaPhoto(w1)
        },
        {
          concept: 'LISTEN & VERIFY 3',
          sentence: `We heard the story character talk about the ${w2} during the rainy season.`,
          subject: w2,
          photoUrl: getRealiaPhoto(w2)
        },
        {
          concept: 'LISTEN & VERIFY 4',
          sentence: `The audio prompt instructs the student to identify the ${w3} on the worksheet.`,
          subject: w3,
          photoUrl: getRealiaPhoto(w3)
        }
      ];
    }
    if (domain === 'garden') {
      return [
        {
          concept: 'LISTEN & VERIFY 1',
          sentence: `The teacher asks the students to observe the green ${w0} growing in the garden.`,
          subject: w0,
          photoUrl: getRealiaPhoto(w0)
        },
        {
          concept: 'LISTEN & VERIFY 2',
          sentence: `We heard the gardener say that seeds need water and sunlight to sprout in the soil.`,
          subject: w1,
          photoUrl: getRealiaPhoto(w1)
        },
        {
          concept: 'LISTEN & VERIFY 3',
          sentence: `The student in the recording points to the fresh ${w2} on the plant.`,
          subject: w2,
          photoUrl: getRealiaPhoto(w2)
        },
        {
          concept: 'LISTEN & VERIFY 4',
          sentence: `The audio prompt instructs the class to identify the ${w3} on the table.`,
          subject: w3,
          photoUrl: getRealiaPhoto(w3)
        }
      ];
    }
    if (domain === 'market') {
      return [
        {
          concept: 'LISTEN & VERIFY 1',
          sentence: `The customer in the audio dialogue asks for the price of the fresh ${w0}.`,
          subject: w0,
          photoUrl: getRealiaPhoto(w0)
        },
        {
          concept: 'LISTEN & VERIFY 2',
          sentence: `We heard the market vendor confirm that the ${w1} is fresh and ready for purchase.`,
          subject: w1,
          photoUrl: getRealiaPhoto(w1)
        },
        {
          concept: 'LISTEN & VERIFY 3',
          sentence: `The shopper in the recording asks how many ${w2}s they can buy for two dollars.`,
          subject: w2,
          photoUrl: getRealiaPhoto(w2)
        },
        {
          concept: 'LISTEN & VERIFY 4',
          sentence: `The audio prompt instructs the student to identify the ${w3} on the grocery counter.`,
          subject: w3,
          photoUrl: getRealiaPhoto(w3)
        }
      ];
    }
    if (domain === 'animals') {
      return [
        {
          concept: 'LISTEN & VERIFY 1',
          sentence: `The park guide in the recording describes the colorful ${w0} living in Panama.`,
          subject: w0,
          photoUrl: getRealiaPhoto(w0)
        },
        {
          concept: 'LISTEN & VERIFY 2',
          sentence: `We heard the speaker mention that the ${w1} moves quickly through the green trees.`,
          subject: w1,
          photoUrl: getRealiaPhoto(w1)
        },
        {
          concept: 'LISTEN & VERIFY 3',
          sentence: `The audio dialogue confirms that the ${w2} is protected in the national park.`,
          subject: w2,
          photoUrl: getRealiaPhoto(w2)
        },
        {
          concept: 'LISTEN & VERIFY 4',
          sentence: `The audio prompt instructs the student to listen carefully and identify the ${w3}.`,
          subject: w3,
          photoUrl: getRealiaPhoto(w3)
        }
      ];
    }
    if (domain === 'canal') {
      return [
        {
          concept: 'LISTEN & VERIFY 1',
          sentence: `The guide explains how the cargo ship moves smoothly through the canal locks.`,
          subject: w0,
          photoUrl: getRealiaPhoto(w0)
        },
        {
          concept: 'LISTEN & VERIFY 2',
          sentence: `We heard the narrator describe the large vessel crossing from ocean to ocean.`,
          subject: w1,
          photoUrl: getRealiaPhoto(w1)
        },
        {
          concept: 'LISTEN & VERIFY 3',
          sentence: `The audio mentions the tugboats guiding the ship under the bridge.`,
          subject: w2,
          photoUrl: getRealiaPhoto(w2)
        },
        {
          concept: 'LISTEN & VERIFY 4',
          sentence: `The audio prompt asks students to identify the water current in the channel.`,
          subject: w3,
          photoUrl: getRealiaPhoto(w3)
        }
      ];
    }
    return [
      {
        concept: 'LISTEN & VERIFY 1',
        sentence: `The speaker in the audio dialogue specifically introduces the ${w0}.`,
        subject: w0,
        photoUrl: getRealiaPhoto(w0)
      },
      {
        concept: 'LISTEN & VERIFY 2',
        sentence: `We heard the audio prompt highlight the key features of the ${w1}.`,
        subject: w1,
        photoUrl: getRealiaPhoto(w1)
      },
      {
        concept: 'LISTEN & VERIFY 3',
        sentence: `The teacher in the recording models how to use the word ${w2} in our lesson.`,
        subject: w2,
        photoUrl: getRealiaPhoto(w2)
      },
      {
        concept: 'LISTEN & VERIFY 4',
        sentence: `The audio prompt instructs the student to identify the ${w3} in the scenario.`,
        subject: w3,
        photoUrl: getRealiaPhoto(w3)
      }
    ];
  }

  if (normSkill === 'Reading') {
    if (domain === 'weather') {
      return [
        {
          concept: 'READ & CHECK 1',
          sentence: `The weather forecast in the story announces heavy rain throughout the afternoon.`,
          subject: w0,
          photoUrl: getRealiaPhoto(w0)
        },
        {
          concept: 'READ & CHECK 2',
          sentence: `According to our reading, the boy holds an umbrella to protect himself from the rain.`,
          subject: w1,
          photoUrl: getRealiaPhoto(w1)
        },
        {
          concept: 'READ & CHECK 3',
          sentence: `The informational text notes that children wear boots to splash safely in the puddle.`,
          subject: w2,
          photoUrl: getRealiaPhoto(w2)
        },
        {
          concept: 'READ & CHECK 4',
          sentence: `The short story describes dark clouds gathering in the sky before the storm begins.`,
          subject: w3,
          photoUrl: getRealiaPhoto(w3)
        }
      ];
    }
    if (domain === 'garden') {
      return [
        {
          concept: 'READ & CHECK 1',
          sentence: `The garden guide explains that green plants absorb water through their roots.`,
          subject: w0,
          photoUrl: getRealiaPhoto(w0)
        },
        {
          concept: 'READ & CHECK 2',
          sentence: `According to our reading, seeds sprout best in rich, moist soil.`,
          subject: w1,
          photoUrl: getRealiaPhoto(w1)
        },
        {
          concept: 'READ & CHECK 3',
          sentence: `The text states that flowers need bright sunlight to bloom successfully.`,
          subject: w2,
          photoUrl: getRealiaPhoto(w2)
        },
        {
          concept: 'READ & CHECK 4',
          sentence: `The informational sheet reminds students to care for the garden every morning.`,
          subject: w3,
          photoUrl: getRealiaPhoto(w3)
        }
      ];
    }
    if (domain === 'market') {
      return [
        {
          concept: 'READ & CHECK 1',
          sentence: `The store sign clearly displays the price of the fresh ${w0}.`,
          subject: w0,
          photoUrl: getRealiaPhoto(w0)
        },
        {
          concept: 'READ & CHECK 2',
          sentence: `According to our scenario reading, shoppers can choose the ${w1} at the stand.`,
          subject: w1,
          photoUrl: getRealiaPhoto(w1)
        },
        {
          concept: 'READ & CHECK 3',
          sentence: `The shopping receipt lists the quantities of ${w2} purchased today.`,
          subject: w2,
          photoUrl: getRealiaPhoto(w2)
        },
        {
          concept: 'READ & CHECK 4',
          sentence: `The informational text confirms that ${w3} is available at the market.`,
          subject: w3,
          photoUrl: getRealiaPhoto(w3)
        }
      ];
    }
    return [
      {
        concept: 'READ & CHECK 1',
        sentence: `The text clearly describes the importance of the ${w0} in our ${cleanTheme} lesson.`,
        subject: w0,
        photoUrl: getRealiaPhoto(w0)
      },
      {
        concept: 'READ & CHECK 2',
        sentence: `According to the scenario reading, students can examine the ${w1} in context.`,
        subject: w1,
        photoUrl: getRealiaPhoto(w1)
      },
      {
        concept: 'READ & CHECK 3',
        sentence: `The reading passage explains how the ${w2} relates to our communicative goal.`,
        subject: w2,
        photoUrl: getRealiaPhoto(w2)
      },
      {
        concept: 'READ & CHECK 4',
        sentence: `The informational passage confirms key facts and details about the ${w3}.`,
        subject: w3,
        photoUrl: getRealiaPhoto(w3)
      }
    ];
  }

  if (normSkill === 'Speaking') {
    if (domain === 'weather') {
      return [
        {
          concept: 'ORAL EXCHANGE 1',
          sentence: `Partner A: "What is the weather like today?" ──> Partner B: "It is rainy! Look at the big puddle on the ground."`,
          subject: w0,
          photoUrl: getRealiaPhoto(w0)
        },
        {
          concept: 'ORAL EXCHANGE 2',
          sentence: `Partner A: "What do you need when it rains?" ──> Partner B: "I need a warm raincoat and my boots."`,
          subject: w1,
          photoUrl: getRealiaPhoto(w1)
        },
        {
          concept: 'ORAL EXCHANGE 3',
          sentence: `Partner A: "Do you have an umbrella?" ──> Partner B: "Yes, I hold my umbrella so I do not get wet."`,
          subject: w2,
          photoUrl: getRealiaPhoto(w2)
        },
        {
          concept: 'ORAL EXCHANGE 4',
          sentence: `Partner A: "Can you hear the storm outside?" ──> Partner B: "Yes, the dark clouds bring plenty of rain."`,
          subject: w3,
          photoUrl: getRealiaPhoto(w3)
        }
      ];
    }
    if (domain === 'market') {
      return [
        {
          concept: 'INQUIRY 1',
          sentence: `Partner A: "How much is the ${w0}?" ──> Partner B: "The fresh ${w0} is two dollars and fifty cents."`,
          subject: w0,
          photoUrl: getRealiaPhoto(w0)
        },
        {
          concept: 'INQUIRY 2',
          sentence: `Partner A: "How many ${w1}s do you need?" ──> Partner B: "I need four ${w1}s for my family."`,
          subject: w1,
          photoUrl: getRealiaPhoto(w1)
        },
        {
          concept: 'INQUIRY 3',
          sentence: `Partner A: "Can you show me the ${w2}?" ──> Partner B: "Yes, the ${w2} is fresh and ready."`,
          subject: w2,
          photoUrl: getRealiaPhoto(w2)
        },
        {
          concept: 'INQUIRY 4',
          sentence: `Partner A: "What is the price of the ${w3}?" ──> Partner B: "The ${w3} costs one dollar each."`,
          subject: w3,
          photoUrl: getRealiaPhoto(w3)
        }
      ];
    }
    return [
      {
        concept: 'ORAL EXCHANGE 1',
        sentence: `Partner A: "What can you tell me about the ${w0}?" ──> Partner B: "The ${w0} is an important part of our ${cleanTheme} lesson."`,
        subject: w0,
        photoUrl: getRealiaPhoto(w0)
      },
      {
        concept: 'ORAL EXCHANGE 2',
        sentence: `Partner A: "How do we use the ${w1} in this situation?" ──> Partner B: "We observe and practice with the ${w1} together."`,
        subject: w1,
        photoUrl: getRealiaPhoto(w1)
      },
      {
        concept: 'ORAL EXCHANGE 3',
        sentence: `Partner A: "Can you show me the ${w2}?" ──> Partner B: "Yes, here is the ${w2} in our activity."`,
        subject: w2,
        photoUrl: getRealiaPhoto(w2)
      },
      {
        concept: 'ORAL EXCHANGE 4',
        sentence: `Partner A: "Why do we need the ${w3}?" ──> Partner B: "We need the ${w3} to complete our communicative task."`,
        subject: w3,
        photoUrl: getRealiaPhoto(w3)
      }
    ];
  }

  if (normSkill === 'Writing') {
    if (domain === 'weather') {
      return [
        {
          concept: 'WRITING CHECK 1',
          sentence: `Write the word 'rain' and label the weather elements in your daily observation chart.`,
          subject: w0,
          photoUrl: getRealiaPhoto(w0)
        },
        {
          concept: 'WRITING CHECK 2',
          sentence: `Complete the sentence: "I wear my boots and carry an umbrella when it rains."`,
          subject: w1,
          photoUrl: getRealiaPhoto(w1)
        },
        {
          concept: 'WRITING CHECK 3',
          sentence: `Write a short sentence describing the puddle forming on the ground.`,
          subject: w2,
          photoUrl: getRealiaPhoto(w2)
        },
        {
          concept: 'WRITING CHECK 4',
          sentence: `Verify the spelling of weather words like storm, cloud, and raincoat on your sheet.`,
          subject: w3,
          photoUrl: getRealiaPhoto(w3)
        }
      ];
    }
    return [
      {
        concept: 'WRITING CHECK 1',
        sentence: `Write the correct English label for ${w0} on your activity sheet.`,
        subject: w0,
        photoUrl: getRealiaPhoto(w0)
      },
      {
        concept: 'WRITING CHECK 2',
        sentence: `Complete the descriptive sentence about the ${w1} using clear handwriting.`,
        subject: w1,
        photoUrl: getRealiaPhoto(w1)
      },
      {
        concept: 'WRITING CHECK 3',
        sentence: `Write a complete sentence explaining how the ${w2} is used in ${scenario}.`,
        subject: w2,
        photoUrl: getRealiaPhoto(w2)
      },
      {
        concept: 'WRITING CHECK 4',
        sentence: `Verify the spelling and punctuation of the sentence describing the ${w3}.`,
        subject: w3,
        photoUrl: getRealiaPhoto(w3)
      }
    ];
  }

  // Mediation (21st Century Skills Project)
  return [
    {
      concept: 'TEAM ROLE 1',
      sentence: `Role 1 (Leader): Explain the main objective of our ${cleanTheme} project to the group.`,
      subject: w0 || 'project',
      photoUrl: getRealiaPhoto(w0 || 'project')
    },
    {
      concept: 'TEAM ROLE 2',
      sentence: `Role 2 (Researcher): Clarify and check key terms like ${w1} for peers in simple English.`,
      subject: w1 || 'poster',
      photoUrl: getRealiaPhoto(w1 || 'poster')
    },
    {
      concept: 'TEAM ROLE 3',
      sentence: `Role 3 (Designer): Organize visual realia and pictures of ${w2} on the display.`,
      subject: w2 || 'display',
      photoUrl: getRealiaPhoto(w2 || 'display')
    },
    {
      concept: 'TEAM ROLE 4',
      sentence: `Role 4 (Speaker): Mediate and present the team's project deliverable to another group.`,
      subject: w3 || 'presentation',
      photoUrl: getRealiaPhoto(w3 || 'presentation')
    }
  ];
}

export function buildAoaLudicKit({
  skill,
  grade,
  scenario,
  cleanTheme,
  vocabWords = [],
  lessonNum = 1,
  isMediation = false,
  isTheme2 = false,
  languageFrame = {},
  project21st = ''
}) {
  const normSkill = normalizeSkill(skill || 'Listening');
  const domain = detectScenarioDomain(scenario, cleanTheme);
  const words = (vocabWords && vocabWords.length >= 4) ? vocabWords.slice(0, 6) : ['apple', 'pineapple', 'banana', 'potato'];

  // 1. Tangible Concept Cards with Domain Attributes
  const items = words.map((w, i) => {
    let tag = '';
    let price = '';
    let sub = '';
    if (domain === 'market') {
      price = `$${(i % 4) + 1}`;
      tag = price;
      sub = 'Fresh Market Item';
    } else if (domain === 'weather') {
      tag = i % 2 === 0 ? '🌧️ Wet' : '⚡ Forecast';
      sub = 'Rainy Season Gear';
    } else if (domain === 'animals') {
      tag = i % 2 === 0 ? '🐾 Forest' : '🌿 Native';
      sub = 'Panama Wildlife';
    } else if (domain === 'canal') {
      tag = i % 2 === 0 ? '🚢 Transit' : '🌊 Locks';
      sub = 'Canal Navigation';
    } else if (domain === 'classroom') {
      tag = i % 2 === 0 ? '🎒 Desk' : '✏️ Station';
      sub = 'Classroom Tool';
    } else if (domain === 'garden') {
      tag = i % 2 === 0 ? '🌱 Garden' : '🍅 Fresh';
      sub = 'School Garden Care';
    } else if (domain === 'colors') {
      price = `$${(i % 3) + 1}`;
      tag = i < 6 ? `🎨 ${w.toUpperCase()}` : `📏 ${w.toUpperCase()}`;
      sub = 'Art & Color Studio';
    } else {
      tag = `🏷️ Item ${i + 1}`;
      sub = cleanTheme;
    }
    return {
      id: `card_${i + 1}`,
      word: w.toUpperCase(),
      name: w.charAt(0).toUpperCase() + w.slice(1),
      photoUrl: getRealiaPhoto(w),
      tag,
      price,
      sub
    };
  });

  // 2. Stage 1: Detective Flash Game (SEE & SAY)
  let stage1GameName = 'Mystery Flash!';
  let stage1Prompt = `Teacher flashes photo card for 2 seconds: "What is this?" ──> Class responds: "A ${words[0]}!"`;
  let stage1Rules = 'Raise the card quickly. Students must speak the correct target phrase before the card disappears into the mystery envelope!';
  if (normSkill === 'Speaking' && domain === 'market') {
    stage1GameName = 'Fast Market Detective!';
    stage1Prompt = `Teacher shows 🍍 $2: "How much is the pineapple?" ──> Class shouts: "Two dollars!"`;
  } else if (normSkill === 'Speaking' && domain === 'weather') {
    stage1GameName = 'Weather Radar Flash!';
    stage1Prompt = `Teacher shows ☔: "What do you need when it rains?" ──> Class shouts: "I need an umbrella!"`;
  } else if (normSkill === 'Speaking' && domain === 'colors') {
    stage1GameName = 'Rainbow Color & Size Detective!';
    stage1Prompt = `Teacher flashes 🟢 / 🔴: "What color is this? Is it big or small?" ──> Class shouts: "It is a big red card!"`;
  } else if (normSkill === 'Listening') {
    stage1GameName = 'Acoustic Sound Detective!';
    stage1Prompt = `Teacher gives oral cue: "Touch the ${words[0]}!" ──> Students point instantly!`;
  } else if (normSkill === 'Reading') {
    stage1GameName = 'Speed Signpost Decoder!';
    stage1Prompt = `Teacher flashes word tag for 3 seconds: "Decode and read aloud!" ──> Class reads in unison.`;
  } else if (normSkill === 'Writing') {
    stage1GameName = 'Flash Spell & Letter Detective!';
    stage1Prompt = `Teacher reveals missing letter card: "${words[0].slice(0, 2)}__" ──> Students spell aloud!`;
  } else if (normSkill === 'Mediation') {
    stage1GameName = 'Team Radar & Role Call!';
    stage1Prompt = `Teacher flashes role badge: "Who is the team speaker?" ──> Designated student responds!`;
  }

  // 3. Stage 2: Listen, Point & Say (AUDITORY TO ORAL BRIDGE)
  const listenPointItems = words.slice(0, 4).map((w, i) => {
    let script = '';
    let response = '';
    if (domain === 'market') {
      script = `Teacher prompt: "I need ${i + 1} ${w}."`;
      response = `Student points and speaks: "Here are ${i + 1} ${w}s."`;
    } else if (domain === 'weather') {
      script = `Teacher prompt: "It is raining outside! Find the ${w}."`;
      response = `Student points and speaks: "I have the ${w} ready!"`;
    } else if (domain === 'colors') {
      script = `Teacher prompt: "Show me the ${w} card on your desk."`;
      response = `Student points and speaks: "This is ${w}!"`;
    } else {
      script = `Teacher prompt: "Listen for '${w}' and locate the real photo."`;
      response = `Student points to ${w} and articulates: "This is the ${w}."`;
    }
    return {
      num: i + 1,
      targetWord: w,
      photoUrl: getRealiaPhoto(w),
      script,
      response
    };
  });

  // 4. Stage 3: Cut-Out Pair Card Game (PLAY)
  const productCards = items.slice(0, 4);
  const numberCards = [
    { value: '1', label: 'ONE', icon: '1️⃣', cue: 'Single item' },
    { value: '2', label: 'TWO', icon: '2️⃣', cue: 'Pair of items' },
    { value: '3', label: 'THREE', icon: '3️⃣', cue: 'Small bundle' },
    { value: '5', label: 'FIVE', icon: '5️⃣', cue: 'Family pack' }
  ];

  let cardGameRules = [];
  if (domain === 'market') {
    cardGameRules = [
      { step: 1, title: 'Shuffle & Deal', text: 'Place Product Cards and Number Cards face down between Partner A and Partner B.' },
      { step: 2, title: 'Draw & Ask', text: 'Partner A flips 1 Product (e.g. 🍎) + 1 Number (e.g. 3) and says: "I need three apples."' },
      { step: 3, title: 'Inquire Price', text: 'Partner A asks: "How much is the apple?" ──> Partner B checks the card and answers: "It is two dollars."' },
      { step: 4, title: 'Hand Over & Switch', text: 'Partner B delivers the card: "Here you are!" Switch roles for Round 2.' }
    ];
  } else if (domain === 'weather') {
    cardGameRules = [
      { step: 1, title: 'Shuffle & Deal', text: 'Place Weather Cards and Number Cards face down between partners.' },
      { step: 2, title: 'Draw & Ask', text: 'Partner A flips 1 Weather Gear Card + 1 Number and says: "We have two umbrellas in the rain."' },
      { step: 3, title: 'Inquire Condition', text: 'Partner A asks: "What do we wear for the storm?" ──> Partner B answers: "We wear our raincoats and boots."' },
      { step: 4, title: 'Hand Over & Switch', text: 'Partner B awards the badge: "You are storm-ready!" Switch roles for Round 2.' }
    ];
  } else if (domain === 'colors') {
    cardGameRules = [
      { step: 1, title: 'Shuffle & Deal', text: 'Place Color Cards (🟢, 🔵, 🔴, 🟡) and Number/Size Cards face down.' },
      { step: 2, title: 'Draw & Announce', text: 'Partner A flips 1 Color Card + 1 Size Card and says: "I have a big green circle!"' },
      { step: 3, title: 'Inquire & Show', text: 'Partner A asks: "What color is this?" ──> Partner B answers: "It is green and it is big!"' },
      { step: 4, title: 'Switch Roles', text: 'Partner B takes a turn. Score 1 star for each correct color and size call!' }
    ];
  } else {
    cardGameRules = [
      { step: 1, title: 'Shuffle & Deal', text: 'Place Concept Cards and Number Cards face down in front of you.' },
      { step: 2, title: 'Draw & Announce', text: `Partner A draws 1 Concept Card and says: "Can you identify the ${words[0]}?"` },
      { step: 3, title: 'Verify & Explain', text: `Partner B checks the photo and answers: "Yes, this is the ${words[0]} for our lesson."` },
      { step: 4, title: 'Switch Roles', text: 'Switch roles and play the next round with a new card combination!' }
    ];
  }

  // 5. Stage 4: Communicative Role-Play Mission (INTERACT & PERFORM)
  let mission = {};
  if (domain === 'market') {
    mission = {
      title: 'Communicative Action Mission: "Build Your Market!"',
      roleA: {
        role: '🛒 SHOPPER CARD',
        name: 'Student A (The Customer)',
        goal: `Shopping List: 1 ${words[0] || 'pineapple'}, 2 ${words[1] || 'apples'}, 3 ${words[2] || 'bananas'}.`,
        tokens: ['💵 $1', '💵 $2', '💵 $2', '💵 $5'],
        budgetNote: 'Pretend budget: $10. Pay the vendor for each completed purchase!'
      },
      roleB: {
        role: '🏪 VENDOR STAND CARD',
        name: 'Student B (The Stall Owner)',
        standName: `Panama Fresh Market · Stand #${lessonNum || 1}`,
        prices: [
          { item: words[0] || 'pineapple', price: '$2 each' },
          { item: words[1] || 'apple', price: '$1 each' },
          { item: words[2] || 'banana', price: '$1 each' },
          { item: words[3] || 'potato', price: '$3 a bag' }
        ],
        vendorCue: 'Keep the stand organized. Check currency and say: "Here you are!"'
      },
      dialogueBubbles: [
        { speaker: 'Shopper', text: 'Excuse me! How much is the pineapple?' },
        { speaker: 'Vendor', text: 'It is two dollars.' },
        { speaker: 'Shopper', text: 'I need one pineapple, please.' },
        { speaker: 'Vendor', text: 'Here you are! That is two dollars.' },
        { speaker: 'Shopper', text: 'Thank you! Goodbye.' }
      ]
    };
  } else if (domain === 'weather') {
    mission = {
      title: 'Communicative Action Mission: "Rainy Season Forecast Station!"',
      roleA: {
        role: '🎒 STUDENT ON THE WAY CARD',
        name: 'Student A (Traveler)',
        goal: `Mission: Prepare gear for school in the storm: 1 ${words[0] || 'umbrella'}, 1 pair of ${words[1] || 'boots'}, 1 ${words[2] || 'raincoat'}.`,
        tokens: ['⭐ Prepared', '⭐ Dry', '⭐ Safe'],
        budgetNote: 'Check off each piece of gear before stepping outside!'
      },
      roleB: {
        role: '🎙️ METEOROLOGIST FORECASTER CARD',
        name: 'Student B (Weather Station)',
        standName: `Panama Rain Watch · Station #${lessonNum || 1}`,
        prices: [
          { item: words[0] || 'umbrella', price: 'High Storm Alert' },
          { item: words[1] || 'boots', price: 'Deep Puddle Warning' },
          { item: words[2] || 'raincoat', price: 'Heavy Downpour' },
          { item: words[3] || 'storm', price: 'Thunder Forecast' }
        ],
        vendorCue: 'Advise your partner on what gear to wear in the rain!'
      },
      dialogueBubbles: [
        { speaker: 'Traveler', text: 'Good morning! What is the weather like today?' },
        { speaker: 'Forecaster', text: 'It is raining heavily! Dark storm clouds are here.' },
        { speaker: 'Traveler', text: 'What do I need for the puddle on the street?' },
        { speaker: 'Forecaster', text: 'You need your boots and an umbrella.' },
        { speaker: 'Traveler', text: 'Thank you! I am ready for the rain.' }
      ]
    };
  } else if (domain === 'colors') {
    mission = {
      title: 'Communicative Action Mission: "The Bilingual Color & Art Studio!"',
      roleA: {
        role: '🎨 ARTIST CARD',
        name: 'Student A (The Artist)',
        goal: 'Collect color pigments and tools: green, blue, red, yellow, small, big.',
        tokens: ['💵 $1', '💵 $2', '💵 $2', '💵 $5'],
        budgetNote: 'Deliver currency tokens for each color and size tool you purchase!'
      },
      roleB: {
        role: '🖌️ ART STUDIO STAND',
        name: 'Student B (Studio Assistant)',
        standName: `Panama Art Workshop · Studio #${lessonNum || 1}`,
        prices: [
          { item: 'green card', price: '$1 each' },
          { item: 'blue card', price: '$2 each' },
          { item: 'red card', price: '$2 each' },
          { item: 'yellow card', price: '$1 each' }
        ],
        vendorCue: 'Deliver the requested color: "Here is your color! What else do you need?"'
      },
      dialogueBubbles: [
        { speaker: 'Artist', text: 'Good morning! I need green and blue colors for my painting.' },
        { speaker: 'Studio', text: 'Here is the green color. Do you need a big or a small brush?' },
        { speaker: 'Artist', text: 'I need a small brush and a red card, please.' },
        { speaker: 'Studio', text: 'Here they are! That is three dollars, please.' },
        { speaker: 'Artist', text: 'Thank you! My Panama painting is complete.' }
      ]
    };
  } else {
    mission = {
      title: `Communicative Action Mission: "The ${cleanTheme} Inquiry!"`,
      roleA: {
        role: '🔍 INQUIRER CARD',
        name: 'Student A (Investigator)',
        goal: `Collect facts about ${words[0] || 'item 1'} and ${words[1] || 'item 2'}.`,
        tokens: ['⭐ Fact 1', '⭐ Fact 2', '⭐ Verified'],
        budgetNote: 'Ask questions and record peer answers on your mission badge.'
      },
      roleB: {
        role: '📋 EXPERT DISPATCH CARD',
        name: 'Student B (Scenario Specialist)',
        standName: `${cleanTheme} Field Base`,
        prices: [
          { item: words[0] || 'item 1', price: 'Key Concept' },
          { item: words[1] || 'item 2', price: 'Core Feature' },
          { item: words[2] || 'item 3', price: 'Evidence Detail' },
          { item: words[3] || 'item 4', price: 'Target Outcome' }
        ],
        vendorCue: 'Explain target structures with clear pronunciation and gestures.'
      },
      dialogueBubbles: [
        { speaker: 'Investigator', text: `Can you explain the main idea of ${cleanTheme}?` },
        { speaker: 'Specialist', text: `Yes! We observe ${words[0] || 'the target concept'} in our community.` },
        { speaker: 'Investigator', text: `How do we use this in our daily action?` },
        { speaker: 'Specialist', text: `We practice together and complete our project.` },
        { speaker: 'Investigator', text: 'Excellent! Mission accomplished.' }
      ]
    };
  }

  // 6. Stage 5: Observable Can-Do Mission Checklist (Assessment)
  let canDoStatements = [];
  if (normSkill === 'Speaking') {
    canDoStatements = [
      { icon: '🗣️', text: `I can ask target inquiry questions (e.g., 'How much is...?' or 'What is this?').` },
      { icon: '🗣️', text: `I can state quantities and numbers accurately (e.g., 'three apples', 'two dollars').` },
      { icon: '🗣️', text: `I can express needs and offers politely (e.g., 'I need..., please' / 'Here you are').` },
      { icon: '🛒', text: `I can actively participate and complete the interactive pair mission.` }
    ];
  } else if (normSkill === 'Listening') {
    canDoStatements = [
      { icon: '👂', text: `I can identify target keywords when spoken slowly and clearly.` },
      { icon: '👂', text: `I can match oral descriptions to the correct realia photo without hesitation.` },
      { icon: '👆', text: `I can perform physical actions (TPR) in response to verbal teacher prompts.` },
      { icon: '🎧', text: `I can discriminate the key sounds and phonemes of today's lesson.` }
    ];
  } else if (normSkill === 'Reading') {
    canDoStatements = [
      { icon: '📖', text: `I can decode target words using letter-sound associations and phonemic awareness.` },
      { icon: '🔍', text: `I can scan short authentic signs, receipts, or menus to find specific details.` },
      { icon: '👍', text: `I can verify whether factual statements about the text are True or False.` },
      { icon: '📑', text: `I can read and follow 2-step printed instructions for classroom tasks.` }
    ];
  } else if (normSkill === 'Writing') {
    canDoStatements = [
      { icon: '✍️', text: `I can spell the key scenario vocabulary words with legible orthography.` },
      { icon: '✍️', text: `I can trace and write complete descriptive sentences following the language frame.` },
      { icon: '📝', text: `I can complete an authentic receipt, report, or log accurately.` },
      { icon: '✏️', text: `I can apply basic punctuation (capital letter and period) to my sentences.` }
    ];
  } else {
    // Mediation
    canDoStatements = [
      { icon: '🤝', text: `I can explain key project concepts to peers using simple English and gestures.` },
      { icon: '🤝', text: `I can actively fulfill my designated team role (Leader/Researcher/Designer/Speaker).` },
      { icon: '🤝', text: `I can collaborate to build our tangible 21st century project deliverable.` },
      { icon: '🌟', text: `I can present our group findings respectfully to another team.` }
    ];
  }

  // 7. Stage 6: Exit Speak / Action
  const exitSpeak = {
    title: normSkill === 'Speaking' ? '🎤 EXIT SPEAK' : normSkill === 'Listening' ? '👂 EXIT LISTEN' : normSkill === 'Writing' ? '✍️ EXIT WRITE' : normSkill === 'Reading' ? '📖 EXIT READ' : '🤝 EXIT SHARE',
    prompt: normSkill === 'Speaking'
      ? `Pick 1 card from your deck. Say your phrase clearly to your teacher or peer before packing up:`
      : `Complete the final 30-second check on your lesson badge:`,
    sampleCardPrompts: [
      { word: words[0], sentence: domain === 'market' ? `"How much is the ${words[0]}?"` : domain === 'colors' ? `The card is ${words[0]}.` : `I observe the ${words[0]}.` },
      { word: words[1], sentence: domain === 'market' ? `"I need three ${words[1]}s."` : domain === 'colors' ? `I see a ${words[1]} card.` : `We have a ${words[1]} ready.` },
      { word: words[2], sentence: domain === 'market' ? `"It is two dollars."` : domain === 'colors' ? `This is a big ${words[2]} shape.` : `The ${words[2]} is important today.` }
    ],
    emojis: [
      { label: 'I can do it!', icon: '😀', sub: 'Strong & clear' },
      { label: 'With a little help', icon: '😐', sub: 'Almost there' },
      { label: 'Need more practice', icon: '😟', sub: 'Keep trying' }
    ]
  };

  // 8. Detailed Teacher Facilitator Guide & Scripts
  const teacherGuideSpecific = {
    pacingPlan: [
      { stage: 'Stage 1 · SEE & SAY', name: stage1GameName, time: '5 min', goal: 'Fast visual-auditory retrieval before paper work' },
      { stage: 'Stage 2 · LISTEN & POINT', name: 'Listen, Point & Say', time: '7 min', goal: 'Auditory-to-oral bridging with desk tokens' },
      { stage: 'Stage 3 · PLAY', name: 'Pair Card Game (Cut-Outs)', time: '12 min', goal: 'Gamified turn-taking practice with hands-on cards' },
      { stage: 'Stage 4 · PERFORM', name: mission.title, time: '15 min', goal: 'Real role-play mission with currency & stands' },
      { stage: 'Stage 5 & 6 · REFLECT', name: 'Can-Do Check & Exit Speak', time: '6 min', goal: 'Observable formative check & oral exit' }
    ],
    verbatimScripts: [
      {
        stage: 'Stage 1 Detective Script',
        instruction: 'Hold flashcards face down. Show each card for exactly 2 seconds, then conceal it.',
        teacherSpeech: `"Attention, detectives! Look at my card. (Flash 🍍 $2). What is this? ... How much is it? Speak before it disappears!"`,
        expectedStudent: `"Pineapple! ... Two dollars!" (Encourage high energy choral and individual responses).`
      },
      {
        stage: 'Stage 2 Listen & Point Script',
        instruction: 'Students place index fingers on their desk tokens. Read each prompt slowly and clearly twice.',
        teacherSpeech: `"Listen carefully. Touch and repeat: 'I need three fresh ${words[0]}s.' Ready, point and say!"`,
        expectedStudent: `Students point to ${words[0]} token and say: "I need three fresh ${words[0]}s."`
      },
      {
        stage: 'Stage 3 Card Game Facilitation',
        instruction: 'Direct pairs to cut their cards along dotted lines. Distribute cards evenly.',
        teacherSpeech: `"Pairs, shuffle your Product and Number cards! Player A draws and speaks; Player B checks the price and answers. Play 4 rounds!"`,
        expectedStudent: `Student A: "How much is the ${words[1]}?" ──> Student B: "It is one dollar. Here you are!"`
      },
      {
        stage: 'Stage 4 Mission Facilitation',
        instruction: 'Hand out Shopper cards with $10 play money to Student A and Vendor stands to Student B.',
        teacherSpeech: `"Market opens! Shoppers, take your $10 and complete your shopping lists. Vendors, greet politely and state exact prices!"`,
        expectedStudent: `Full interactive role-play dialogues using target frames.`
      }
    ],
    answerKeyDetailed: [
      { component: 'Stage 1 Vocabulary Flash', key: words.map(w => w.toUpperCase()).join(' · ') },
      { component: 'Stage 2 Point & Say Prompts', key: listenPointItems.map(l => `${l.num}. ${l.targetWord}`).join(' · ') },
      { component: 'Stage 3 Number & Product Combos', key: '1 to 5 units matching target prices' },
      { component: 'Stage 4 Mission Target Exchange', key: mission.dialogueBubbles.map(b => `${b.speaker}: "${b.text}"`).join(' | ') },
      { component: 'Stage 6 Exit Speak Benchmarks', key: 'Student articulates 1 complete sentence with clear CEFR A1/A2 intonation.' }
    ],
    formativeRubric: [
      {
        level: '🌱 With Help',
        criteria: 'Requires continuous teacher modeling, points with hesitation, and produces isolated words rather than complete sentence frames.'
      },
      {
        level: '🌿 Almost Independently',
        criteria: 'Asks and answers with 1 prompt, uses target prices/quantities correctly, and participates actively in the card game with minor pronunciation slips.'
      },
      {
        level: '🌳 Independently',
        criteria: 'Initiates inquiries fluently, handles play money and mission goals autonomously, and uses natural intonation and polite social conventions.'
      }
    ]
  };

  return {
    stage1Game: {
      name: stage1GameName,
      prompt: stage1Prompt,
      rules: stage1Rules,
      cards: items.slice(0, 4)
    },
    stage2ListenPoint: {
      name: 'Listen, Point & Say',
      items: listenPointItems
    },
    stage3CardGame: {
      name: 'Pair Card Game Station',
      productCards: productCards,
      numberCards: numberCards,
      rules: cardGameRules
    },
    stage4Mission: mission,
    stage5CanDo: {
      statements: canDoStatements,
      scale: ['🌱 With help', '🌿 Almost independently', '🌳 Independently']
    },
    stage6Exit: exitSpeak,
    teacherGuideSpecific: teacherGuideSpecific
  };
}

export function parseAoaLessonPlan(rawInput, metadata = {}) {
  let rawText = typeof rawInput === 'string' ? rawInput : (rawInput?.text || '');
  let clean = cleanHtml(rawText);
  if (!clean || clean.length < 10) {
    if (metadata?.title || metadata?.scenario || metadata?.theme) {
      rawText = `Theme: ${metadata.title || metadata.scenario || metadata.theme}\nGrade: ${metadata.grade || '4th Grade'}\nSkill: ${metadata.skill || 'Listening'}\nScenario: ${metadata.scenario || metadata.title || 'AOA Context'}`;
      clean = cleanHtml(rawText);
    } else {
      return null;
    }
  }

  // 1. Grade Resolution
  let grade = '';
  const textGradeMatch = clean.match(/Grade:\s*([^\s\n\t(<]+(?:\s+Grade)?)/i);
  if (textGradeMatch && textGradeMatch[1].trim().length > 2) {
    grade = textGradeMatch[1].trim();
  } else if (metadata.grade) {
    grade = metadata.grade;
  } else {
    const generalGradeMatch = clean.match(/(?:Pre-?K|Kindergarten|Kinder\b|\b\d{1,2}(?:st|nd|rd|th)?\s+Grade|\b(?:1|2|3|4|5|6|7|8|9|10|11|12)°?\s*Grado)/i);
    grade = generalGradeMatch ? generalGradeMatch[0].trim() : '4th Grade';
  }

  // 2. Title & Theme Resolution (Text has authoritative priority over stale metadata)
  let rawTheme = '';
  const textThemeMatch = clean.match(/(?:Theme|Tema)\s*#?\s*[:#-]?\s*([^\n\t.]+?)(?:Date|\bSpecific|\bLesson|$)/i) ||
    clean.match(/Theme\s*#\s*([^–—:\n\t]+?)(?:–|—|-|Lesson|$)/i) ||
    clean.match(/(?:Title|Topic):\s*([^\n\t.]+)/i);
  if (textThemeMatch && textThemeMatch[1].trim().length > 2 && !textThemeMatch[1].toLowerCase().includes('planner')) {
    rawTheme = textThemeMatch[1].trim();
  } else if (metadata.title || metadata.theme) {
    rawTheme = metadata.title || metadata.theme;
  }
  if (!rawTheme || rawTheme.includes('Lesson Planner') || rawTheme.includes('EduGen') || rawTheme.includes('Secuencia AOA')) {
    const headingMatch = rawText.match(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/i);
    if (headingMatch) rawTheme = headingMatch[1].replace(/<[^>]+>/g, '').trim();
  }
  const cleanTheme = sanitizeThemeTitle(rawTheme || 'English AOA Lesson');

  // 3. Scenario Resolution (Text has authoritative priority over stale metadata)
  let scenario = '';
  const textScenarioMatch = clean.match(/(?:Scenario|Escenario)\s*[:#-]?\s*([^.\n\t]+?)(?:Skills?|Theme|Specific|Date|Learning|$)/i);
  if (textScenarioMatch && textScenarioMatch[1].trim().length > 3 && !textScenarioMatch[1].toLowerCase().includes('planner')) {
    scenario = textScenarioMatch[1].trim();
  } else if (metadata.scenario && !metadata.scenario.toLowerCase().includes('planner')) {
    scenario = metadata.scenario;
  }
  if (!scenario || scenario.includes('Planner') || scenario.length > 50) {
    scenario = cleanTheme;
  }

  // 4. Authoritative Skill Resolution (generador de actividades.txt)
  // lesson.skill MUST determine the primary activity architecture. NEVER assume lesson number = skill.
  let lessonNum = Number(metadata.lessonNum || metadata.lessonNumber) || null;
  if (!lessonNum) {
    const numMatch = clean.match(/Lesson\s*(?:#|No\.?|Number)?\s*[:#-]?\s*(\d)/i) || rawText.match(/Lesson\s*(?:#|No\.?|Number)?\s*[:#-]?\s*(\d)/i);
    lessonNum = numMatch ? parseInt(numMatch[1], 10) : 1;
  }

  let skillFocus = detectSkillFromText(clean) || (metadata.skill ? normalizeSkill(metadata.skill) : null) || detectSkillFromText(rawText);

  if (!skillFocus) {
    skillFocus = lessonNum === 2 ? 'Reading'
      : lessonNum === 3 ? 'Speaking'
      : lessonNum === 4 ? 'Writing'
      : lessonNum === 5 ? 'Mediation'
      : 'Listening';
  } else {
    skillFocus = normalizeSkill(skillFocus);
  }

  const isReading = skillFocus === 'Reading';
  const isSpeaking = skillFocus === 'Speaking';
  const isWriting = skillFocus === 'Writing';
  const isMediation = skillFocus === 'Mediation';
  const isListening = skillFocus === 'Listening';

  let objective = metadata.objective || '';
  if (!objective) {
    const objMatch = clean.match(/Specific\s+Objective:\s*([^.\n]+?\.)/i);
    if (objMatch) objective = objMatch[1].trim();
    else objective = `Demonstrate ${skillFocus.toLowerCase()} skills in the context of "${cleanTheme}".`;
  }

  // 5. Authentic Vocabulary Extraction (Filtered Strictly Against Procedural Sentences)
  let vocabWords = [];
  const vocabMatch = clean.match(/(?:vocabulary\s+words?|target\s+vocabulary|key\s+vocabulary|vocabulary\s+items?|words?)[^:]*:\s*([^\n.]+)/i);
  if (vocabMatch) {
    const rawWords = vocabMatch[1]
      .replace(/\*\*/g, '')
      .replace(/\./g, '')
      .split(/[,;\/]| and /i)
      .map(w => w.trim().toLowerCase())
      .filter(w => isValidVocabWord(w));
    vocabWords = [...new Set(rawWords)].slice(0, 6);
  }

  // Extract from narrative visuals/realia (e.g., "visuals (flashcards/realia) of raincoats, boots, and umbrellas")
  if (vocabWords.length < 6) {
    const visualsMatches = [...clean.matchAll(/(?:visuals|flashcards|realia)(?:\s*\([^)]*\))?\s*of\s*([^\n.]+)/gi)];
    for (const m of visualsMatches) {
      const vWords = m[1]
        .replace(/and/gi, ',')
        .split(/[,;]/)
        .map(w => w.trim().toLowerCase().replace(/s$/, ''))
        .filter(w => isValidVocabWord(w));
      vocabWords = [...new Set([...vocabWords, ...vWords])];
    }
  }

  // Extract from key vocabulary mentions (e.g., "key vocabulary like 'puddle' /pʌdl/ and 'rain' /reɪn/")
  if (vocabWords.length < 6) {
    const keyVocabMatches = [...clean.matchAll(/(?:key\s+vocabulary\s+like|vocabulary\s+like|pronunciation\s+of\s+key\s+vocabulary\s+like|pronunciation\s+of)\s*([^\n.]+)/gi)];
    for (const m of keyVocabMatches) {
      const wordsWithPhonetics = m[1]
        .replace(/\/[^/]+\//g, ' ')
        .replace(/['"`]/g, ' ')
        .replace(/and/gi, ',')
        .split(/[,;]/)
        .map(w => w.trim().toLowerCase().replace(/s$/, ''))
        .filter(w => isValidVocabWord(w));
      vocabWords = [...new Set([...vocabWords, ...wordsWithPhonetics])];
    }
  }

  // Extract from HTML markup and quotes in Modeling / Warm-up
  if (vocabWords.length < 4) {
    const htmlWords = extractHtmlKeywords(rawText);
    const starMatches = [...clean.matchAll(/\*\*([a-zA-Z\s]{3,22})\*\*/g)].map(m => m[1].toLowerCase().trim());
    const quotedMatches = [...clean.matchAll(/['"]([a-zA-Z]{3,15})['"]/g)].map(m => m[1].toLowerCase().trim());
    const candidates = [...new Set([...htmlWords, ...starMatches, ...quotedMatches])].filter(w => isValidVocabWord(w));
    if (candidates.length > 0) {
      vocabWords = [...new Set([...vocabWords, ...candidates])].filter(w => isValidVocabWord(w)).slice(0, 6);
    }
  }

  const normalizeNoun = (w) => {
    let s = (w || '').trim().toLowerCase();
    if (s === 'boot' || s === 'boots' || s === 'rain boots' || s === 'rubber boots') return 'boots';
    if (s === 'raincoat' || s === 'raincoats') return 'raincoat';
    if (s === 'umbrella' || s === 'umbrellas') return 'umbrella';
    if (s === 'puddle' || s === 'puddles') return 'puddle';
    if (s === 'tomato' || s === 'tomatoes') return 'tomato';
    if (s === 'potato' || s === 'potatoes') return 'potato';
    return s;
  };

  vocabWords = vocabWords.map(normalizeNoun).filter(w => isValidVocabWord(w));
  vocabWords = [...new Set(vocabWords)];

  // Fallback to rich authentic scenario vocabulary if fewer than 6 valid words found
  if (vocabWords.length < 6) {
    const topicDefaults = getTopicVocabFallback(`${cleanTheme} ${scenario} ${clean}`);
    vocabWords = [...new Set([...vocabWords, ...topicDefaults.map(normalizeNoun)])].filter(w => isValidVocabWord(w)).slice(0, 6);
  }

  const isKinderGrade = /(?:^|[^a-z])(?:pre-?k|kindergarten|kinder\b)/i.test(grade);
  const isKinderClassroomContext = isKinderGrade && /classroom|preposition|school|where\s*is\s*it/i.test(`${cleanTheme} ${scenario} ${clean}`);

  if (isKinderClassroomContext) {
    const classroomNouns = new Set(['book', 'pencil', 'chair', 'desk', 'bag', 'crayon', 'ruler', 'eraser', 'notebook']);
    const hasEnoughClassroom = vocabWords.filter(w => classroomNouns.has(w.toLowerCase().replace(/^(?:red|yellow|blue|green|orange|purple)\s+/i, ''))).length >= 4;
    if (!hasEnoughClassroom || vocabWords.length < 6) {
      vocabWords = ['red book', 'yellow pencil', 'blue chair', 'desk', 'green bag', 'orange crayon'];
    }
  }

  // 6. Dialogue Extraction
  let dialogueLines = [];
  const speakerRegex = /(Teacher|Student|Buyer|Seller|Customer|Vendor|Clerk|Cashier|Doctor|Patient|Guide|Ranger|Tourist|Passenger|Officer|Student\s*[A-Z\d]|Partner\s*[A-Z]|Speaker\s*[A-Z\d]|A|B):\s*([^.\n?!]+[.?!]?)/gi;
  const matches = [...clean.matchAll(speakerRegex)];
  if (matches.length >= 2) {
    dialogueLines = matches.slice(0, 8).map(m => ({
      speaker: m[1].trim(),
      text: m[2].replace(/\*\*/g, '').trim()
    }));
  }

  if (dialogueLines.length < 2) {
    const firstWord = vocabWords[0] || 'pineapple';
    const secondWord = vocabWords[1] || 'banana';
    const isShopping = /market|shop|buy|sell|price|cost|dollar|fruit/i.test(`${cleanTheme} ${scenario}`);
    if (isShopping) {
      dialogueLines = [
        { speaker: 'Customer', text: `Hello! How much is the ${firstWord}?` },
        { speaker: 'Vendor', text: `Good morning! The ${firstWord} is two dollars and fifty cents.` },
        { speaker: 'Customer', text: `Can I have one ${firstWord} and two ${secondWord}s, please?` },
        { speaker: 'Vendor', text: 'Here you go! Thank you for shopping with us today.' }
      ];
    } else {
      dialogueLines = [
        { speaker: 'Partner A', text: `Hello! Can you help me practice our lesson about ${cleanTheme}?` },
        { speaker: 'Partner B', text: `Yes! Let's examine the ${firstWord} together in our pair activity.` },
        { speaker: 'Partner A', text: `How do we use the ${secondWord} to communicate clearly?` },
        { speaker: 'Partner B', text: 'We practice the question frame and share our ideas with the class.' }
      ];
    }
  }

  // 7. Language Frame
  let languageFrame = null;
  const frameMatch = clean.match(/(?:language\s+frame|target\s+structure|exchange)[^:]*:\s*["“]([^"”]+)["”]/i);
  if (frameMatch) {
    languageFrame = {
      question: frameMatch[1].trim(),
      answer: `Target response related to ${cleanTheme}.`,
      exchange: `A: "${frameMatch[1].trim()}"`
    };
  } else if (dialogueLines.length >= 2) {
    languageFrame = {
      question: dialogueLines[0].text,
      answer: dialogueLines[1].text,
      exchange: `${dialogueLines[0].speaker}: "${dialogueLines[0].text}" ──> ${dialogueLines[1].speaker}: "${dialogueLines[1].text}"`
    };
  } else {
    languageFrame = {
      question: `What is the key concept of ${cleanTheme}?`,
      answer: `We identify and practice ${vocabWords[0] || 'the target concept'}.`,
      exchange: `Partner A: "Can you identify the ${vocabWords[0] || 'item'}?" ──> Partner B: "Yes, here it is!"`
    };
  }

  // 8. 21st Century Skills Project Context for Lesson 5 (Mediation)
  // Theme 1 develops Project 1; Theme 2 develops Project 2
  const isTheme2 = metadata.themeType === 'productive' || metadata.theme_type === 'productive' || /theme\s*#?\s*2|productive/i.test(clean);
  let project21st = metadata.project21st || metadata.project_21st || '';
  if (!project21st && isMediation) {
    if (metadata.scenarioData?.communicativeCompetences?.assessmentIdeas?.projects) {
      const projs = metadata.scenarioData.communicativeCompetences.assessmentIdeas.projects;
      project21st = isTheme2 ? (projs[1] || projs[0]) : projs[0];
    } else {
      project21st = isTheme2
        ? `Project 2: Comparative Display & Peer Guide — Students work in teams to compare items and mediate findings for ${cleanTheme}.`
        : `Project 1: Collaborative Action Poster — Students create a visual poster to explain key concepts and mediate meaning for ${cleanTheme}.`;
    }
  }

  // 9. Activity Contract, Blueprint & Diversity Patterns (generador de actividades.txt)
  const contract = buildLessonContract({
    lesson: { grade, scenario, theme: cleanTheme, skill: skillFocus, lessonNum, objective, vocabulary: vocabWords },
    theme: cleanTheme,
    scenario,
    grade,
    skill: skillFocus,
    lessonNum,
    themeType: isTheme2 ? 'productive' : 'receptive',
    project21st,
    rawText: clean
  });
  const patterns = selectActivityPatterns(contract);
  const blueprint = buildAOABlueprint(contract);

  // Structured Action Worksheet (Ficha Concreta de Trabajo)
  let part1Title = `PART 1: ${patterns.activity1.pattern.toUpperCase()} (${cleanTheme.toUpperCase()})`;
  let part1Badge = patterns.activity1.badge;
  let part1ActionCue = patterns.activity1.actionCue;
  let part1Instruction = patterns.activity1.instruction;

  let part2Title = `PART 2: ${patterns.activity2.pattern.toUpperCase()}`;
  let part2Badge = patterns.activity2.badge;
  let part2Prompt = patterns.activity2.prompt;

  let part2Items = [];

  if (isSpeaking && isKinderClassroomContext) {
    part1Title = `PART 1: ORAL RECOGNITION & PRONUNCIATION PRACTICE (CLASSROOM OBJECTS)`;
    part1Badge = 'Spoken Fluency';
    part1ActionCue = '[ Say It Aloud 🗣️ ]';
    part1Instruction = "Work with your partner. Point to each real photo, pronounce the English word with clear intonation, and take turns asking: 'What is this?'";

    part2Title = `PART 2: COMMUNICATIVE INQUIRY · "ASK & ANSWER IN PAIRS!"`;
    part2Badge = 'Interaction Check';
    part2Prompt = "Partner A asks the inquiry question. Partner B checks the statement and answers aloud. If answered correctly and fluently, mark YES ( 👍 )!";

    part2Items = [
      { concept: 'ON', relation: 'on', sentence: 'The book is ON the desk.', subject: 'book', reference: 'desk', photoUrl: getRealiaPhoto('book') },
      { concept: 'UNDER', relation: 'under', sentence: 'The bag is UNDER the chair.', subject: 'bag', reference: 'chair', photoUrl: getRealiaPhoto('bag') },
      { concept: 'IN', relation: 'in', sentence: 'The pencil is IN the bag.', subject: 'pencil', reference: 'bag', photoUrl: getRealiaPhoto('pencil') },
      { concept: 'NEXT TO', relation: 'next_to', sentence: 'The crayon is NEXT TO the book.', subject: 'crayon', reference: 'book', photoUrl: getRealiaPhoto('crayon') }
    ];
  } else if (isReading) {
    part1Title = `PART 1: READ & DECODE / VISUAL TEXT DECODING (${cleanTheme.toUpperCase()})`;
    part1Badge = 'Reading Comprehension';
    part1ActionCue = '[ Read & Check 📖 ]';
    part1Instruction = 'Read each target word aloud. Examine the real photo and match the printed text label to the correct item!';

    part2Title = `PART 2: READING COMPREHENSION · "TRUE OR FALSE? READ & VERIFY!"`;
    part2Badge = 'Reading Accuracy';
    part2Prompt = 'Read each short statement carefully. Evaluate if the sentence is TRUE according to the scenario, mark YES ( 👍 ). If FALSE, mark NO ( 👎 )!';

    part2Items = buildPart2Items({ skill: 'Reading', scenario, cleanTheme, vocabWords, grade });
  } else if (isWriting) {
    part1Title = `PART 1: ORTHOGRAPHIC TRACE & VOCABULARY LABELING (${cleanTheme.toUpperCase()})`;
    part1Badge = 'Written Production';
    part1ActionCue = '[ Trace & Label ✍️ ]';
    part1Instruction = 'Look at the real photo. Trace each letter of the target word with your pencil and copy the label onto your practice sheet!';

    part2Title = `PART 2: WRITTEN VERIFICATION · "CHECK & COMPLETE THE RECORD!"`;
    part2Badge = 'Written Accuracy';
    part2Prompt = 'Read the statement carefully. Verify the written facts and mark YES ( 👍 ) or NO ( 👎 ) on your report!';

    part2Items = buildPart2Items({ skill: 'Writing', scenario, cleanTheme, vocabWords, grade });
  } else if (isMediation) {
    part1Title = `PART 1: 21ST CENTURY PROJECT · TEAM ROLES & MEDIATION (${cleanTheme.toUpperCase()})`;
    part1Badge = '21st Century Skills Project';
    part1ActionCue = '[ Team Collaboration 🤝 ]';
    part1Instruction = `Examine the project elements and team roles. Mediate and explain the goals of our 21st Century Project (${isTheme2 ? 'Project 2' : 'Project 1'}) to your teammates in clear, simple English!`;

    part2Title = `PART 2: PEER MEDIATION & PROJECT VERIFICATION · "CHECK TEAM GOALS!"`;
    part2Badge = 'Collaborative Accuracy';
    part2Prompt = 'Work with your project group. Mediate the instructions in simple English. Verify each project milestone: mark YES ( 👍 ) or NO ( 👎 )!';

    part2Items = buildPart2Items({ skill: 'Mediation', scenario, cleanTheme, vocabWords, grade });
  } else if (isSpeaking) {
    part1Title = `PART 1: ORAL RECOGNITION & PRONUNCIATION PRACTICE (${cleanTheme.toUpperCase()})`;
    part1Badge = 'Spoken Fluency';
    part1ActionCue = '[ Say It Aloud 🗣️ ]';
    part1Instruction = "Work with your partner. Point to each real photo, pronounce the English word with clear intonation, and take turns asking and answering!";

    part2Title = `PART 2: COMMUNICATIVE INQUIRY · "ASK & ANSWER IN PAIRS!"`;
    part2Badge = 'Interaction Check';
    part2Prompt = "Partner A asks the inquiry question. Partner B checks the statement and answers aloud. If answered correctly and fluently, mark YES ( 👍 )!";

    part2Items = buildPart2Items({ skill: 'Speaking', scenario, cleanTheme, vocabWords, grade });
  } else {
    // Listening default
    part2Items = buildPart2Items({ skill: 'Listening', scenario, cleanTheme, vocabWords, grade });
  }

  const actionWorksheet = {
    part1: {
      title: part1Title,
      badge: part1Badge,
      actionCue: part1ActionCue,
      teacherInstruction: part1Instruction,
      items: vocabWords.slice(0, 6).map(w => ({
        word: w.toUpperCase(),
        label: w.toUpperCase(),
        photoUrl: getRealiaPhoto(w)
      }))
    },
    part2: {
      title: part2Title,
      badge: part2Badge,
      teacherPrompt: part2Prompt,
      items: part2Items
    }
  };

  const matchPairs = vocabWords.slice(0, 4).map((word, idx) => ({
    item: word.charAt(0).toUpperCase() + word.slice(1),
    detail: `Context ${idx + 1}: ${word}`,
    icon: word.toLowerCase(),
    photoUrl: getRealiaPhoto(word)
  }));

  const dictationScript = `Listen carefully and write the target words: ${vocabWords.slice(0, 4).join(', ')}.`;

  const quizQuestions = [
    {
      type: 'multiple_choice',
      prompt: `1. What is the primary scenario of the lesson?`,
      options: [`A) ${cleanTheme}`, `B) Unrelated Topic`],
      correct: `A) ${cleanTheme}`
    },
    {
      type: 'true_false',
      prompt: `2. The target vocabulary includes '${vocabWords[0] || 'target item'}'.`,
      options: ['True', 'False'],
      correct: 'True'
    },
    {
      type: 'multiple_choice',
      prompt: `3. Which word belongs to the key scenario vocabulary?`,
      options: [`A) ${vocabWords[1] || vocabWords[0]}`, `B) None of the above`],
      correct: `A) ${vocabWords[1] || vocabWords[0]}`
    }
  ];

  const ludicKit = buildAoaLudicKit({
    skill: skillFocus,
    grade,
    scenario,
    cleanTheme,
    vocabWords,
    lessonNum,
    isMediation,
    isTheme2,
    languageFrame,
    project21st
  });

  return {
    title: cleanTheme,
    rawTitle: rawTheme,
    grade: grade,
    skill: skillFocus,
    lessonNum: lessonNum,
    scenario: scenario,
    objective: objective,
    project21st: project21st,
    contract: contract,
    stages: blueprint.stages,
    actionWorksheet: actionWorksheet,
    ludicKit: ludicKit,

    // ── PAGE 1: DISCOVERY & LINGUISTIC INPUT ──
    page1: {
      sectionTitle: `Stage 1 & 2: Discovery & Linguistic Input (${skillFocus})`,
      instructions: `Review the key words and the communicative frame for ${cleanTheme}.`,
      wordBank: vocabWords.map((word) => ({
        word: word.charAt(0).toUpperCase() + word.slice(1),
        pos: 'noun',
        example: `Context sentence with ${word.toLowerCase()}.`,
        icon: word.toLowerCase(),
        photoUrl: getRealiaPhoto(word)
      })),
      languageFrame: languageFrame,
      activity1: {
        title: `Activity 1: ${isSpeaking ? 'Pronounce & Circle' : isWriting ? 'Trace & Identify' : isMediation ? 'Clarify & Circle' : 'Listen & Circle'}`,
        instruction: `Review the target words with your teacher. Circle each word accurately:`,
        words: vocabWords
      }
    },

    // ── PAGE 2: GUIDED PRACTICE & PERFORMANCE TASK ──
    page2: {
      sectionTitle: `Stage 3 & 4: Guided Practice & Tangible Learning Task (${skillFocus})`,
      activity2: {
        title: 'Activity 2: Visual & Concept Matching',
        instruction: 'Draw a line to match each target word with its corresponding detail:',
        pairs: matchPairs
      },
      activity3: {
        title: `Activity 3: Authentic Exchange Cloze (${skillFocus})`,
        instruction: 'Complete the dialogue with the correct words from the Word Bank below:',
        wordBank: vocabWords.slice(0, 5),
        dialogue: dialogueLines
      },
      activity4: {
        title: isMediation
          ? `Activity 4: 21st Century Skills Project Task (${isTheme2 ? 'Project 2' : 'Project 1'})`
          : `Activity 4: Performance Action Task (${cleanTheme})`,
        instruction: isMediation
          ? (project21st || `Collaborate in teams to create the tangible project deliverable for ${cleanTheme}.`)
          : `Apply your ${skillFocus.toLowerCase()} skills to complete the tangible deliverable for ${cleanTheme}:`,
        prompt: isMediation
          ? `Project Deliverable: Work in teams of 3-4. Assign roles (Leader, Researcher, Designer, Speaker) and build your project presentation for ${cleanTheme}.`
          : `Performance Deliverable: Complete your action task using the target language structures.`
      }
    },

    // ── PAGE 3: FORMATIVE ASSESSMENT, TEACHER SCRIPTS & ANSWER KEY ──
    page3: {
      sectionTitle: `Stage 5 & 6: Formative Assessment, Exit Ticket & Teacher Guide (${skillFocus})`,
      exitTicket: {
        title: 'Student Exit Ticket (Quick Check)',
        questions: quizQuestions,
        selfAssessment: [
          { text: `I can identify the target vocabulary words for ${cleanTheme}.`, stars: 3 },
          { text: `I can apply the communicative structures in ${skillFocus.toLowerCase()} tasks.`, stars: 3 },
          { text: isMediation ? 'I can collaborate with my team on the 21st century project.' : 'I can participate in the communicative exchange with peers.', stars: 3 }
        ]
      },
      teacherGuide: {
        title: `Teacher Audio Scripts & Pedagogical Guide (${skillFocus} · Lesson ${lessonNum})`,
        scripts: [
          {
            stage: 'Stage 2 Presentation Audio',
            text: dialogueLines.map(d => `${d.speaker}: "${d.text}"`).join('  ·  ')
          },
          {
            stage: 'Stage 4 Performance Dictation',
            text: dictationScript
          },
          {
            stage: 'Stage 5 Assessment Quiz Script',
            text: `Read clearly to the class: "Question 1: What is the main scenario? Question 2: Focus on ${vocabWords[0] || 'the target concept'}."`
          }
        ],
        answerKey: [
          { item: 'Activity 1 (Circle)', answer: 'All modeled words circled accurately.' },
          { item: 'Activity 2 (Match)', answer: matchPairs.map(p => `${p.item} ──> ${p.detail}`).join(', ') },
          { item: 'Activity 3 (Cloze)', answer: dialogueLines.slice(1, 4).map(d => d.text).join(' | ') },
          { item: 'Exit Ticket Quiz', answer: quizQuestions.map((q, i) => `Q${i + 1}: ${q.correct || q.options[0]}`).join('  ·  ') }
        ],
        rubric: [
          {
            criterion: isMediation ? '21st Century Skills & Peer Mediation' : `${skillFocus} Competence & Target Vocabulary`,
            independent: isMediation
              ? 'Facilitates communication effectively, explains concepts in simple English, and fulfills team role with full autonomy.'
              : 'Demonstrates target communicative competence and vocabulary fluency without teacher prompts.',
            withSupport: isMediation
              ? 'Participates in team project with 1-2 prompts and assists peers using gestures or visual realia.'
              : 'Completes communicative tasks with occasional prompts and repetitions.',
            emerging: isMediation
              ? 'Requires continuous teacher facilitation and direct guidance to participate in team project.'
              : 'Requires direct modeling and continuous assistance.'
          },
          {
            criterion: 'Task Accuracy & Deliverable Quality',
            independent: 'Completes all worksheet activities and the action deliverable with 90-100% accuracy.',
            withSupport: 'Completes activities with peer modeling or scaffolding (70-89% accuracy).',
            emerging: 'Completes fewer than half the tasks accurately.'
          },
          {
            criterion: 'Action-Oriented Communication (AOA Panama)',
            independent: 'Produces appropriate question and response frames with natural intonation and collaborative engagement.',
            withSupport: 'Uses isolated target words with acceptable pronunciation.',
            emerging: 'Relies on non-verbal pointing or gestures only.'
          }
        ]
      }
    }
  };
}
