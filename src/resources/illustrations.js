// Vector Illustration & Spatial Scene Catalog for Panama AOA Curricular Workbooks
// Supports both 'color' and 'outline' (monochrome print) modes
// Implements exact spatial relation geometry: 'on', 'under', 'in', 'next_to', 'behind'

export const PALETTES = {
  color: {
    stroke: '#1E293B',
    deskTop: '#FDE68A',
    deskDrawer: '#FEF3C7',
    chairBack: '#93C5FD',
    chairSeat: '#3B82F6',
    bagBody: '#10B981',
    bagPocket: '#059669',
    bookCover: '#EF4444',
    bookBadge: '#FEE2E2',
    pencilBody: '#FACC15',
    pencilEraser: '#F87171',
    crayonBody: '#F97316',
    crayonBand: '#EA580C',
    pineappleBody: '#FEF3C7',
    pineappleLines: '#D97706',
    pineappleDot: '#B45309',
    appleBody: '#FEE2E2',
    appleStroke: '#DC2626',
    appleLeaf: '#BBF7D0',
    bananaBody: '#FEF9C3',
    bananaStroke: '#CA8A04',
    orangeBody: '#FFEDD5',
    orangeStroke: '#EA580C',
    watermelonBody: '#FEE2E2',
    watermelonRind: '#86EFAC',
    watermelonSeeds: '#1E293B',
    mangoBody: '#FEF08A',
    mangoStroke: '#EAB308',
    priceTagBg: '#FEF3C7',
    priceTagStroke: '#D97706'
  },
  outline: {
    stroke: '#0F172A',
    deskTop: '#FFFFFF',
    deskDrawer: '#FFFFFF',
    chairBack: '#FFFFFF',
    chairSeat: '#FFFFFF',
    bagBody: '#FFFFFF',
    bagPocket: '#FFFFFF',
    bookCover: '#FFFFFF',
    bookBadge: '#FFFFFF',
    pencilBody: '#FFFFFF',
    pencilEraser: '#FFFFFF',
    crayonBody: '#FFFFFF',
    crayonBand: '#F8FAFC',
    pineappleBody: '#FFFFFF',
    pineappleLines: '#0F172A',
    pineappleDot: '#0F172A',
    appleBody: '#FFFFFF',
    appleStroke: '#0F172A',
    appleLeaf: '#FFFFFF',
    bananaBody: '#FFFFFF',
    bananaStroke: '#0F172A',
    orangeBody: '#FFFFFF',
    orangeStroke: '#0F172A',
    watermelonBody: '#FFFFFF',
    watermelonRind: '#FFFFFF',
    watermelonSeeds: '#0F172A',
    mangoBody: '#FFFFFF',
    mangoStroke: '#0F172A',
    priceTagBg: '#FFFFFF',
    priceTagStroke: '#0F172A'
  }
};

export function getIllustrationSvg(name, mode = 'color') {
  if (!name) return null;
  const p = PALETTES[mode] || PALETTES.color;
  const clean = String(name).toLowerCase().trim().replace(/s$/, '');

  const items = {
    // ── FRUITS & MARKET ITEMS ──
    pineapple: `<svg viewBox="0 0 100 100" class="w-full h-full" fill="none" stroke="${p.stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M50 38 C40 25 35 12 42 6 C48 16 50 26 50 38" />
      <path d="M50 38 C50 20 50 8 55 5 C56 16 54 26 50 38" />
      <path d="M50 38 C60 25 65 12 58 6 C52 16 50 26 50 38" />
      <path d="M46 36 C32 28 22 22 26 16 C34 22 42 30 46 36" />
      <path d="M54 36 C68 28 78 22 74 16 C66 22 58 30 54 36" />
      <ellipse cx="50" cy="65" rx="28" ry="30" fill="${p.pineappleBody}" stroke="${p.stroke}" stroke-width="3" />
      <path d="M30 50 L70 80 M30 80 L70 50 M25 65 L75 65 M50 36 L50 95" stroke="${p.pineappleLines}" stroke-width="2" />
      <circle cx="50" cy="55" r="1.5" fill="${p.pineappleDot}" />
      <circle cx="40" cy="65" r="1.5" fill="${p.pineappleDot}" />
      <circle cx="60" cy="65" r="1.5" fill="${p.pineappleDot}" />
      <circle cx="50" cy="75" r="1.5" fill="${p.pineappleDot}" />
    </svg>`,

    apple: `<svg viewBox="0 0 100 100" class="w-full h-full" fill="none" stroke="${p.stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M50 28 C50 18 55 12 60 8" stroke="${p.stroke}" stroke-width="3" />
      <path d="M54 18 C64 16 70 20 68 26 C60 26 56 22 54 18 Z" fill="${p.appleLeaf}" stroke="${p.stroke}" stroke-width="2" />
      <path d="M50 34 C40 25 20 28 18 50 C16 72 32 90 50 88 C68 90 84 72 82 50 C80 28 60 25 50 34 Z" fill="${p.appleBody}" stroke="${p.appleStroke}" stroke-width="3" />
      <path d="M30 42 C26 48 26 58 30 64" stroke="${p.stroke}" stroke-width="2" stroke-linecap="round" />
    </svg>`,

    banana: `<svg viewBox="0 0 100 100" class="w-full h-full" fill="none" stroke="${p.stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 22 L28 28" stroke="${p.stroke}" stroke-width="4" />
      <path d="M26 26 C36 40 50 78 86 78 C65 72 42 55 30 28 Z" fill="${p.bananaBody}" stroke="${p.bananaStroke}" stroke-width="3" />
      <path d="M28 28 C40 48 55 72 84 77" stroke="${p.bananaStroke}" stroke-width="2" />
    </svg>`,

    orange: `<svg viewBox="0 0 100 100" class="w-full h-full" fill="none" stroke="${p.stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M50 22 L50 14" stroke="${p.stroke}" stroke-width="3" />
      <path d="M50 16 C60 12 68 18 64 24 C56 24 52 20 50 16 Z" fill="${p.appleLeaf}" stroke="${p.stroke}" stroke-width="2" />
      <circle cx="50" cy="56" r="32" fill="${p.orangeBody}" stroke="${p.orangeStroke}" stroke-width="3" />
      <circle cx="42" cy="50" r="1.5" fill="${p.stroke}" />
      <circle cx="58" cy="52" r="1.5" fill="${p.stroke}" />
      <circle cx="50" cy="62" r="1.5" fill="${p.stroke}" />
    </svg>`,

    watermelon: `<svg viewBox="0 0 100 100" class="w-full h-full" fill="none" stroke="${p.stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 40 C28 85 72 85 88 40 Z" fill="${p.watermelonBody}" stroke="${p.stroke}" stroke-width="3" />
      <path d="M10 40 C26 88 74 88 90 40" stroke="${p.stroke}" stroke-width="5" fill="none" />
      <ellipse cx="35" cy="52" rx="2" ry="3" fill="${p.watermelonSeeds}" />
      <ellipse cx="50" cy="58" rx="2" ry="3" fill="${p.watermelonSeeds}" />
      <ellipse cx="65" cy="52" rx="2" ry="3" fill="${p.watermelonSeeds}" />
    </svg>`,

    mango: `<svg viewBox="0 0 100 100" class="w-full h-full" fill="none" stroke="${p.stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M50 20 L50 14" stroke="${p.stroke}" stroke-width="3" />
      <path d="M50 22 C34 22 24 38 28 58 C32 78 50 86 64 82 C78 76 80 50 72 34 C66 24 58 22 50 22 Z" fill="${p.mangoBody}" stroke="${p.mangoStroke}" stroke-width="3" />
    </svg>`,

    // ── CLASSROOM OBJECTS ──
    book: `<svg viewBox="0 0 100 100" class="w-full h-full" fill="none" stroke="${p.stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="22" y="24" width="56" height="52" rx="3" fill="${p.bookCover}" stroke="${p.stroke}" stroke-width="3" />
      <line x1="50" y1="24" x2="50" y2="76" stroke="${p.stroke}" stroke-width="2.5" />
      <rect x="30" y="34" width="14" height="20" rx="1" fill="${p.bookBadge}" stroke="${p.stroke}" stroke-width="1.5" />
      <line x1="30" y1="62" x2="44" y2="62" stroke="${p.stroke}" stroke-width="2" />
      <line x1="30" y1="68" x2="40" y2="68" stroke="${p.stroke}" stroke-width="2" />
    </svg>`,

    desk: `<svg viewBox="0 0 100 100" class="w-full h-full" fill="none" stroke="${p.stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="15" y="38" width="70" height="10" rx="2" fill="${p.deskTop}" stroke="${p.stroke}" stroke-width="3" />
      <rect x="36" y="48" width="28" height="14" rx="1" fill="${p.deskDrawer}" stroke="${p.stroke}" stroke-width="2.5" />
      <line x1="46" y1="55" x2="54" y2="55" stroke="${p.stroke}" stroke-width="3" />
      <line x1="22" y1="48" x2="22" y2="84" stroke="${p.stroke}" stroke-width="3.5" />
      <line x1="78" y1="48" x2="78" y2="84" stroke="${p.stroke}" stroke-width="3.5" />
    </svg>`,

    chair: `<svg viewBox="0 0 100 100" class="w-full h-full" fill="none" stroke="${p.stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="28" y="20" width="44" height="28" rx="2" fill="${p.chairBack}" stroke="${p.stroke}" stroke-width="3" />
      <line x1="36" y1="28" x2="64" y2="28" stroke="${p.stroke}" stroke-width="2" />
      <line x1="36" y1="36" x2="64" y2="36" stroke="${p.stroke}" stroke-width="2" />
      <rect x="24" y="48" width="52" height="8" rx="2" fill="${p.chairSeat}" stroke="${p.stroke}" stroke-width="3" />
      <line x1="30" y1="56" x2="30" y2="86" stroke="${p.stroke}" stroke-width="3.5" />
      <line x1="70" y1="56" x2="70" y2="86" stroke="${p.stroke}" stroke-width="3.5" />
    </svg>`,

    bag: `<svg viewBox="0 0 100 100" class="w-full h-full" fill="none" stroke="${p.stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M40 24 C40 16 60 16 60 24" stroke="${p.stroke}" stroke-width="3" fill="none" />
      <rect x="26" y="24" width="48" height="56" rx="10" fill="${p.bagBody}" stroke="${p.stroke}" stroke-width="3" />
      <rect x="34" y="48" width="32" height="24" rx="4" fill="${p.bagPocket}" stroke="${p.stroke}" stroke-width="2.5" />
      <line x1="34" y1="44" x2="66" y2="44" stroke="${p.stroke}" stroke-width="2" />
    </svg>`,

    pencil: `<svg viewBox="0 0 100 100" class="w-full h-full" fill="none" stroke="${p.stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="42" y="16" width="16" height="52" fill="${p.pencilBody}" stroke="${p.stroke}" stroke-width="3" />
      <line x1="50" y1="16" x2="50" y2="68" stroke="${p.stroke}" stroke-width="1.5" />
      <rect x="42" y="12" width="16" height="8" fill="${p.pencilEraser}" stroke="${p.stroke}" stroke-width="2" />
      <polygon points="42,68 58,68 50,88" fill="${p.pencilBody}" stroke="${p.stroke}" stroke-width="2.5" />
      <polygon points="47,80 53,80 50,88" fill="${p.stroke}" />
    </svg>`,

    crayon: `<svg viewBox="0 0 100 100" class="w-full h-full" fill="none" stroke="${p.stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="40" y="22" width="20" height="48" rx="2" fill="${p.crayonBody}" stroke="${p.stroke}" stroke-width="3" />
      <rect x="40" y="34" width="20" height="24" fill="${p.crayonBand}" stroke="${p.stroke}" stroke-width="2" />
      <polygon points="40,22 60,22 50,8" fill="${p.stroke}" stroke="${p.stroke}" stroke-width="2.5" />
    </svg>`,

    // ── MARKET ACCESSORIES & GENERAL ICONS ──
    price_tag: `<svg viewBox="0 0 100 100" class="w-full h-full" fill="none" stroke="${p.stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 50 L52 20 L84 20 L84 52 L54 82 L22 50 Z" fill="${p.priceTagBg || '#FEF3C7'}" stroke="${p.priceTagStroke || '#D97706'}" stroke-width="3" />
      <circle cx="70" cy="34" r="4" fill="#FFFFFF" stroke="${p.priceTagStroke || '#D97706'}" stroke-width="2" />
      <text x="44" y="58" font-family="sans-serif" font-weight="bold" font-size="16" fill="${p.stroke}">$</text>
    </svg>`,

    market: `<svg viewBox="0 0 100 100" class="w-full h-full" fill="none" stroke="${p.stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M15 40 L85 40 L80 82 L20 82 Z" fill="${mode === 'color' ? '#F1F5F9' : '#FFFFFF'}" />
      <path d="M12 40 C12 25 25 18 50 18 C75 18 88 25 88 40 Z" fill="${mode === 'color' ? '#DBEAFE' : '#FFFFFF'}" stroke="${p.stroke}" stroke-width="3" />
      <line x1="32" y1="19" x2="28" y2="40" stroke="${p.stroke}" stroke-width="2" />
      <line x1="50" y1="18" x2="50" y2="40" stroke="${p.stroke}" stroke-width="2" />
      <line x1="68" y1="19" x2="72" y2="40" stroke="${p.stroke}" stroke-width="2" />
      <rect x="35" y="55" width="30" height="27" fill="${mode === 'color' ? '#E2E8F0' : '#FFFFFF'}" stroke="${p.stroke}" stroke-width="2.5" />
    </svg>`,

    dollar: `<svg viewBox="0 0 100 100" class="w-full h-full" fill="none" stroke="${p.stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="50" cy="50" r="38" fill="${mode === 'color' ? '#ECFDF5' : '#FFFFFF'}" stroke="${p.stroke}" stroke-width="3" />
      <text x="50" y="65" font-family="'Outfit', sans-serif" font-weight="900" font-size="44" fill="${p.stroke}" text-anchor="middle">$</text>
    </svg>`,

    house: `<svg viewBox="0 0 100 100" class="w-full h-full" fill="none" stroke="${p.stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 45 L50 20 L80 45 L80 82 L20 82 Z" fill="${mode === 'color' ? '#FEF3C7' : '#FFFFFF'}" stroke="${p.stroke}" stroke-width="3" />
      <rect x="42" y="58" width="16" height="24" fill="${mode === 'color' ? '#D97706' : '#FFFFFF'}" stroke="${p.stroke}" stroke-width="2" />
    </svg>`,

    tree: `<svg viewBox="0 0 100 100" class="w-full h-full" fill="none" stroke="${p.stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="44" y="60" width="12" height="30" fill="${mode === 'color' ? '#92400E' : '#FFFFFF'}" stroke="${p.stroke}" stroke-width="2.5" />
      <circle cx="50" cy="42" r="28" fill="${mode === 'color' ? '#DCFCE7' : '#FFFFFF'}" stroke="${p.stroke}" stroke-width="3" />
    </svg>`,

    sun: `<svg viewBox="0 0 100 100" class="w-full h-full" fill="none" stroke="${p.stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="50" cy="50" r="22" fill="${mode === 'color' ? '#FEF08A' : '#FFFFFF'}" stroke="${p.stroke}" stroke-width="3" />
      <path d="M50 14 L50 22 M50 78 L50 86 M14 50 L22 50 M78 50 L86 50 M24 24 L30 30 M70 70 L76 76 M24 76 L30 70 M70 30 L76 24" stroke="${p.stroke}" stroke-width="3" stroke-linecap="round" />
    </svg>`,

    leaf: `<svg viewBox="0 0 100 100" class="w-full h-full" fill="none" stroke="${p.stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M25 75 C25 35 45 20 80 20 C80 55 65 75 25 75 Z" fill="${mode === 'color' ? '#BBF7D0' : '#FFFFFF'}" stroke="${p.stroke}" stroke-width="3" />
      <path d="M25 75 L60 40 M42 58 L52 64 M50 48 L62 54" stroke="${p.stroke}" stroke-width="2.5" />
    </svg>`,

    bird: `<svg viewBox="0 0 100 100" class="w-full h-full" fill="none" stroke="${p.stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 50 C30 30 55 35 70 45 C80 40 85 42 90 48 C85 52 78 52 75 56 C70 70 50 75 35 68 L20 75 Z" fill="${mode === 'color' ? '#E0E7FF' : '#FFFFFF'}" stroke="${p.stroke}" stroke-width="3" />
      <circle cx="78" cy="46" r="2" fill="${p.stroke}" />
      <path d="M45 50 C55 40 65 45 60 60" stroke="${p.stroke}" stroke-width="2" />
    </svg>`,

    animal: `<svg viewBox="0 0 100 100" class="w-full h-full" fill="none" stroke="${p.stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <ellipse cx="50" cy="58" rx="22" ry="18" fill="${mode === 'color' ? '#FED7AA' : '#FFFFFF'}" stroke="${p.stroke}" stroke-width="3" />
      <circle cx="36" cy="42" r="7" fill="${mode === 'color' ? '#FDBA74' : '#FFFFFF'}" stroke="${p.stroke}" stroke-width="2" />
      <circle cx="64" cy="42" r="7" fill="${mode === 'color' ? '#FDBA74' : '#FFFFFF'}" stroke="${p.stroke}" stroke-width="2" />
      <circle cx="43" cy="54" r="2.5" fill="${p.stroke}" />
      <circle cx="57" cy="54" r="2.5" fill="${p.stroke}" />
      <ellipse cx="50" cy="62" rx="4" ry="3" fill="${p.stroke}" />
      <path d="M46 66 Q50 70 54 66" stroke="${p.stroke}" stroke-width="2" />
    </svg>`,

    fish: `<svg viewBox="0 0 100 100" class="w-full h-full" fill="none" stroke="${p.stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 35 C40 50 65 30 85 50 C65 70 40 50 20 65 Z" fill="${mode === 'color' ? '#BAE6FD' : '#FFFFFF'}" stroke="${p.stroke}" stroke-width="3" />
      <circle cx="72" cy="48" r="2" fill="${p.stroke}" />
      <path d="M50 44 C48 50 48 56 50 62" stroke="${p.stroke}" stroke-width="2" />
    </svg>`,

    flower: `<svg viewBox="0 0 100 100" class="w-full h-full" fill="none" stroke="${p.stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="50" cy="50" r="12" fill="${mode === 'color' ? '#FEF08A' : '#FFFFFF'}" stroke="${p.stroke}" stroke-width="2.5" />
      <circle cx="50" cy="28" r="10" fill="${mode === 'color' ? '#FBCFE8' : '#FFFFFF'}" stroke="${p.stroke}" stroke-width="2" />
      <circle cx="50" cy="72" r="10" fill="${mode === 'color' ? '#FBCFE8' : '#FFFFFF'}" stroke="${p.stroke}" stroke-width="2" />
      <circle cx="28" cy="50" r="10" fill="${mode === 'color' ? '#FBCFE8' : '#FFFFFF'}" stroke="${p.stroke}" stroke-width="2" />
      <circle cx="72" cy="50" r="10" fill="${mode === 'color' ? '#FBCFE8' : '#FFFFFF'}" stroke="${p.stroke}" stroke-width="2" />
    </svg>`,

    mountain: `<svg viewBox="0 0 100 100" class="w-full h-full" fill="none" stroke="${p.stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="15,80 50,25 85,80" fill="${mode === 'color' ? '#E2E8F0' : '#FFFFFF'}" stroke="${p.stroke}" stroke-width="3" />
      <polygon points="40,42 50,25 60,42 54,38 50,44 46,38" fill="${mode === 'color' ? '#FFFFFF' : '#FFFFFF'}" stroke="${p.stroke}" stroke-width="2" />
    </svg>`,

    water: `<svg viewBox="0 0 100 100" class="w-full h-full" fill="none" stroke="${p.stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M15 45 Q32 35 50 45 T85 45" stroke="${mode === 'color' ? '#38BDF8' : p.stroke}" stroke-width="4" fill="none" />
      <path d="M15 60 Q32 50 50 60 T85 60" stroke="${mode === 'color' ? '#0284C7' : p.stroke}" stroke-width="4" fill="none" />
      <path d="M15 75 Q32 65 50 75 T85 75" stroke="${mode === 'color' ? '#0369A1' : p.stroke}" stroke-width="4" fill="none" />
    </svg>`
  };

  if (clean === 'pencile') return items.pencil;
  if (clean === 'table') return items.desk;
  if (clean === 'backpack') return items.bag;
  if (clean === 'price' || clean === 'how much') return items.dollar;
  if (clean === 'store' || clean === 'shop') return items.market;

  if (items[clean]) return items[clean];

  // Strip color prefix if present (e.g., 'red book' -> 'book', 'yellow pencil' -> 'pencil')
  const withoutColor = clean.replace(/^(?:red|yellow|blue|green|orange|purple|pink|brown|black|white|warm)\s+/i, '').trim();
  if (withoutColor && withoutColor !== clean) {
    if (items[withoutColor]) return items[withoutColor];
    if (withoutColor === 'pencile') return items.pencil;
    if (withoutColor === 'table') return items.desk;
    if (withoutColor === 'backpack') return items.bag;
  }

  // Universal Vector Editorial Badge for any word
  const initial = clean.charAt(0).toUpperCase() || '★';
  const labelText = clean.length > 9 ? clean.slice(0, 8) + '.' : clean;
  return `<svg viewBox="0 0 100 100" class="w-full h-full" fill="none" stroke="${p.stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="15" y="15" width="70" height="70" rx="18" fill="${mode === 'color' ? '#EEF2FF' : '#FFFFFF'}" stroke="${p.stroke}" stroke-width="3" />
    <circle cx="50" cy="46" r="20" fill="${mode === 'color' ? '#C7D2FE' : '#F8FAFC'}" stroke="${p.stroke}" stroke-width="2" />
    <text x="50" y="54" font-family="'Outfit', sans-serif" font-weight="900" font-size="22" fill="${p.stroke}" text-anchor="middle">${initial}</text>
    <text x="50" y="78" font-family="'Outfit', sans-serif" font-weight="700" font-size="11" fill="${p.stroke}" text-anchor="middle">${labelText}</text>
  </svg>`;
}

// ══════════════════════════════════════════════════════════════════
// SPATIAL SCENE RENDERER (Clean geometric composite scenes)
// Relations: 'on' | 'under' | 'in' | 'next_to' | 'behind'
// ══════════════════════════════════════════════════════════════════
export function renderSpatialSceneSvg({ subject = 'book', reference = 'desk', relation = 'on', mode = 'color' }) {
  const p = PALETTES[mode] || PALETTES.color;
  const sub = String(subject).toLowerCase().replace(/s$/, '').replace(/^(?:the|a|an|red|yellow|blue|green|orange|purple)\s+/i, '').trim();
  const ref = String(reference).toLowerCase().replace(/s$/, '').replace(/^(?:the|a|an|red|yellow|blue|green|orange|purple)\s+/i, '').trim();
  const rel = String(relation).toLowerCase().trim().replace(/\s+/g, '_');

  // Dimensions of canvas: 170 x 130
  let subjectSvg = '';
  let referenceSvg = '';
  let foregroundSvg = '';

  // ── BASE REFERENCE DRAWINGS ──
  if (ref === 'desk' || ref === 'table') {
    referenceSvg = `
      <!-- Desktop Table -->
      <line x1="12" y1="116" x2="158" y2="116" stroke="#E2E8F0" stroke-width="2" stroke-linecap="round" />
      <rect x="24" y="54" width="116" height="12" rx="3" fill="${p.deskTop}" stroke="${p.stroke}" stroke-width="3" />
      <rect x="62" y="66" width="40" height="15" rx="1.5" fill="${p.deskDrawer}" stroke="${p.stroke}" stroke-width="2.5" />
      <line x1="76" y1="73" x2="88" y2="73" stroke="${p.stroke}" stroke-width="3" stroke-linecap="round" />
      <line x1="36" y1="66" x2="36" y2="116" stroke="${p.stroke}" stroke-width="3.5" stroke-linecap="round" />
      <line x1="128" y1="66" x2="128" y2="116" stroke="${p.stroke}" stroke-width="3.5" stroke-linecap="round" />
    `;
  } else if (ref === 'chair') {
    referenceSvg = `
      <!-- Chair Backrest -->
      <line x1="20" y1="116" x2="150" y2="116" stroke="#E2E8F0" stroke-width="2" stroke-linecap="round" />
      <rect x="46" y="20" width="70" height="40" rx="4" fill="${p.chairBack}" stroke="${p.stroke}" stroke-width="3" />
      <line x1="58" y1="32" x2="104" y2="32" stroke="${p.stroke}" stroke-width="2" />
      <line x1="58" y1="44" x2="104" y2="44" stroke="${p.stroke}" stroke-width="2" />
      <!-- Chair Seat -->
      <rect x="38" y="60" width="86" height="13" rx="3" fill="${p.chairSeat}" stroke="${p.stroke}" stroke-width="3" />
      <!-- Chair Legs -->
      <line x1="48" y1="73" x2="48" y2="116" stroke="${p.stroke}" stroke-width="3.5" stroke-linecap="round" />
      <line x1="114" y1="73" x2="114" y2="116" stroke="${p.stroke}" stroke-width="3.5" stroke-linecap="round" />
    `;
  } else if (ref === 'bag' || ref === 'box' || ref === 'backpack') {
    referenceSvg = `
      <!-- Backpack Base in Center -->
      <line x1="20" y1="116" x2="150" y2="116" stroke="#E2E8F0" stroke-width="2" stroke-linecap="round" />
      <path d="M64 26 C64 14 96 14 96 26" stroke="${p.stroke}" stroke-width="3.5" fill="none" />
      <rect x="44" y="26" width="72" height="88" rx="14" fill="${p.bagBody}" stroke="${p.stroke}" stroke-width="3" />
    `;
    foregroundSvg = `
      <!-- Front pocket layered on top of subject for 'in' effect -->
      <rect x="52" y="66" width="56" height="42" rx="7" fill="${p.bagPocket}" stroke="${p.stroke}" stroke-width="2.5" />
      <line x1="52" y1="62" x2="108" y2="62" stroke="${p.stroke}" stroke-width="2.5" />
      <circle cx="80" cy="84" r="5" fill="#FEF08A" stroke="${p.stroke}" stroke-width="1.5" />
    `;
  } else if (ref === 'book') {
    referenceSvg = `
      <!-- Big Reference Book on Left -->
      <line x1="14" y1="116" x2="156" y2="116" stroke="#E2E8F0" stroke-width="2" stroke-linecap="round" />
      <rect x="22" y="32" width="70" height="82" rx="4" fill="${p.bookCover}" stroke="${p.stroke}" stroke-width="3" />
      <line x1="28" y1="32" x2="28" y2="114" stroke="${p.stroke}" stroke-width="2" />
      <rect x="36" y="46" width="42" height="30" rx="2" fill="${p.bookBadge}" stroke="${p.stroke}" stroke-width="1.8" />
      <text x="57" y="66" font-family="'Outfit', sans-serif" font-weight="900" font-size="14" fill="${p.stroke}" text-anchor="middle">ABC</text>
    `;
  }

  // ── CALCULATE SUBJECT POSITION ──
  let sx = 66, sy = 24, sw = 32, sh = 32;

  if (rel === 'on') {
    if (ref === 'desk' || ref === 'table') { sx = 64; sy = 24; }
    else if (ref === 'chair') { sx = 64; sy = 30; }
    else { sx = 64; sy = 12; }
  } else if (rel === 'under') {
    if (ref === 'chair') { sx = 65; sy = 76; }
    else if (ref === 'desk' || ref === 'table') { sx = 65; sy = 76; }
    else { sx = 65; sy = 86; }
  } else if (rel === 'next_to' || rel === 'next to') {
    if (ref === 'book') { sx = 108; sy = 40; }
    else if (ref === 'desk' || ref === 'table') { sx = 142; sy = 62; }
    else if (ref === 'chair') { sx = 130; sy = 68; }
    else { sx = 120; sy = 60; }
  } else if (rel === 'behind') {
    if (ref === 'desk' || ref === 'table') { sx = 64; sy = 38; }
    else if (ref === 'chair') { sx = 64; sy = 48; }
    else { sx = 64; sy = 20; }
  } else if (rel === 'in') {
    sx = 74; sy = 16;
  }

  // ── MINI SUBJECT DRAWINGS ──
  if (sub === 'book') {
    subjectSvg = `
      <!-- Book Subject -->
      <g transform="translate(${sx}, ${sy})">
        <rect x="0" y="0" width="36" height="28" rx="2" fill="${p.bookCover}" stroke="${p.stroke}" stroke-width="2.5" />
        <line x1="18" y1="0" x2="18" y2="28" stroke="${p.stroke}" stroke-width="2" />
        <rect x="4" y="4" width="9" height="14" rx="1" fill="${p.bookBadge}" stroke="${p.stroke}" stroke-width="1.2" />
        <line x1="4" y1="21" x2="14" y2="21" stroke="${p.stroke}" stroke-width="1.5" />
      </g>
    `;
  } else if (sub === 'bag' || sub === 'backpack') {
    subjectSvg = `
      <!-- Bag Subject -->
      <g transform="translate(${sx}, ${sy})">
        <path d="M12 4 C12 0 24 0 24 4" stroke="${p.stroke}" stroke-width="2.2" fill="none" />
        <rect x="3" y="4" width="30" height="36" rx="7" fill="${p.bagBody}" stroke="${p.stroke}" stroke-width="2.5" />
        <rect x="7" y="18" width="22" height="18" rx="4" fill="${p.bagPocket}" stroke="${p.stroke}" stroke-width="2" />
        <line x1="7" y1="15" x2="29" y2="15" stroke="${p.stroke}" stroke-width="1.5" />
      </g>
    `;
  } else if (sub === 'pencil') {
    subjectSvg = `
      <!-- Pencil Subject -->
      <g transform="translate(${sx}, ${sy})">
        <rect x="3" y="8" width="13" height="46" fill="${p.pencilBody}" stroke="${p.stroke}" stroke-width="2" />
        <line x1="9" y1="8" x2="9" y2="54" stroke="${p.stroke}" stroke-width="1" />
        <rect x="3" y="2" width="13" height="6" rx="1" fill="${p.pencilEraser}" stroke="${p.stroke}" stroke-width="1.5" />
        <polygon points="3,54 16,54 9.5,70" fill="${p.pencilBody}" stroke="${p.stroke}" stroke-width="2" />
        <polygon points="6,62 13,62 9.5,70" fill="${p.stroke}" />
      </g>
    `;
  } else if (sub === 'crayon') {
    subjectSvg = `
      <!-- Crayon Subject -->
      <g transform="translate(${sx}, ${sy})">
        <rect x="3" y="16" width="20" height="56" rx="2" fill="${p.crayonBody}" stroke="${p.stroke}" stroke-width="2.5" />
        <rect x="3" y="28" width="20" height="24" fill="${p.crayonBand}" stroke="${p.stroke}" stroke-width="2" />
        <line x1="3" y1="36" x2="23" y2="36" stroke="${p.stroke}" stroke-width="1.5" />
        <polygon points="3,16 23,16 13,0" fill="${p.crayonBody}" stroke="${p.stroke}" stroke-width="2.5" />
        <polygon points="8,12 18,12 13,0" fill="${p.stroke}" fill-opacity="0.3" />
      </g>
    `;
  } else if (sub === 'pineapple') {
    subjectSvg = `
      <g transform="translate(${sx - 4}, ${sy}) scale(0.35)">
        <ellipse cx="50" cy="65" rx="28" ry="30" fill="${p.pineappleBody}" stroke="${p.stroke}" stroke-width="3" />
        <path d="M30 50 L70 80 M30 80 L70 50" stroke="${p.pineappleLines}" stroke-width="2" />
      </g>
    `;
  } else {
    // Default circle / apple
    subjectSvg = `
      <g transform="translate(${sx}, ${sy})">
        <circle cx="14" cy="14" r="12" fill="${p.appleBody}" stroke="${p.stroke}" stroke-width="2.5" />
        <line x1="14" y1="2" x2="18" y2="-2" stroke="${p.stroke}" stroke-width="2" />
      </g>
    `;
  }

  // Layer ordering according to relation
  let layers = '';
  if (rel === 'behind') {
    layers = `${subjectSvg} ${referenceSvg} ${foregroundSvg}`;
  } else if (rel === 'in') {
    layers = `${referenceSvg} ${subjectSvg} ${foregroundSvg}`;
  } else {
    // on, under, next_to: reference first, subject on top
    layers = `${referenceSvg} ${subjectSvg} ${foregroundSvg}`;
  }

  return `
    <svg viewBox="0 0 170 130" class="w-full h-full max-h-48" fill="none" stroke-linecap="round" stroke-linejoin="round">
      ${layers}
    </svg>
  `;
}
