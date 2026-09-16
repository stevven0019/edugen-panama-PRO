// Vector Illustration & Spatial Scene Catalog for Panama AOA Curricular Workbooks
// Supports both 'color' and 'outline' (monochrome print) modes
// Implements exact spatial relation geometry: 'on', 'under', 'in', 'next_to', 'behind'

export const PALETTES = {
  color: {
    stroke: '#1E293B',
    deskTop: '#F1F5F9',
    deskDrawer: '#FFFFFF',
    chairBack: '#F1F5F9',
    chairSeat: '#E2E8F0',
    bagBody: '#EFF6FF',
    bagPocket: '#DBEAFE',
    bookCover: '#EFF6FF',
    bookBadge: '#DBEAFE',
    pencilBody: '#FEF08A',
    pencilEraser: '#FCA5A5',
    crayonBody: '#C7D2FE',
    crayonBand: '#818CF8',
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
    </svg>`
  };

  if (clean === 'pencile') return items.pencil;
  if (clean === 'table') return items.desk;
  if (clean === 'backpack') return items.bag;
  if (clean === 'price' || clean === 'how much') return items.dollar;
  if (clean === 'store' || clean === 'shop') return items.market;

  if (items[clean]) return items[clean];

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
export function renderSpatialSceneSvg({ subject = 'book', reference = 'desk', relation = 'on', mode = 'outline' }) {
  const p = PALETTES[mode] || PALETTES.outline;
  const sub = String(subject).toLowerCase().replace(/s$/, '');
  const ref = String(reference).toLowerCase().replace(/s$/, '');

  // Dimensions of canvas: 160 x 130
  let subjectSvg = '';
  let referenceSvg = '';
  let foregroundSvg = '';

  // Base Reference Drawing
  if (ref === 'desk' || ref === 'table') {
    referenceSvg = `
      <!-- Desktop Table -->
      <rect x="25" y="52" width="110" height="12" rx="2" fill="${p.deskTop}" stroke="${p.stroke}" stroke-width="3" />
      <rect x="60" y="64" width="40" height="16" rx="1" fill="${p.deskDrawer}" stroke="${p.stroke}" stroke-width="2.5" />
      <line x1="74" y1="72" x2="86" y2="72" stroke="${p.stroke}" stroke-width="3" />
      <line x1="36" y1="64" x2="36" y2="114" stroke="${p.stroke}" stroke-width="3.5" />
      <line x1="124" y1="64" x2="124" y2="114" stroke="${p.stroke}" stroke-width="3.5" />
    `;
  } else if (ref === 'chair') {
    referenceSvg = `
      <!-- Chair Backrest -->
      <rect x="46" y="24" width="68" height="38" rx="3" fill="${p.chairBack}" stroke="${p.stroke}" stroke-width="3" />
      <line x1="56" y1="36" x2="104" y2="36" stroke="${p.stroke}" stroke-width="2" />
      <line x1="56" y1="48" x2="104" y2="48" stroke="${p.stroke}" stroke-width="2" />
      <!-- Chair Seat -->
      <rect x="40" y="62" width="80" height="12" rx="2" fill="${p.chairSeat}" stroke="${p.stroke}" stroke-width="3" />
      <!-- Chair Legs -->
      <line x1="48" y1="74" x2="48" y2="116" stroke="${p.stroke}" stroke-width="3.5" />
      <line x1="112" y1="74" x2="112" y2="116" stroke="${p.stroke}" stroke-width="3.5" />
    `;
  } else if (ref === 'bag' || ref === 'box') {
    referenceSvg = `
      <!-- Backpack base -->
      <path d="M60 30 C60 20 100 20 100 30" stroke="${p.stroke}" stroke-width="3" fill="none" />
      <rect x="42" y="30" width="76" height="84" rx="14" fill="${p.bagBody}" stroke="${p.stroke}" stroke-width="3" />
    `;
    foregroundSvg = `
      <!-- Front pocket covering in/behind -->
      <rect x="52" y="68" width="56" height="38" rx="6" fill="${p.bagPocket}" stroke="${p.stroke}" stroke-width="3" />
      <line x1="52" y1="62" x2="108" y2="62" stroke="${p.stroke}" stroke-width="2.5" />
    `;
  }

  // Calculate Subject Position (sx, sy, scale)
  let sx = 66, sy = 24, sw = 28, sh = 28;

  if (relation === 'on') {
    if (ref === 'desk' || ref === 'table') { sx = 66; sy = 25; }
    else if (ref === 'chair') { sx = 66; sy = 34; }
    else { sx = 66; sy = 12; }
  } else if (relation === 'under') {
    if (ref === 'desk' || ref === 'table') { sx = 66; sy = 78; }
    else if (ref === 'chair') { sx = 66; sy = 82; }
    else { sx = 66; sy = 92; }
  } else if (relation === 'next_to') {
    if (ref === 'desk' || ref === 'table') { sx = 138; sy = 68; }
    else if (ref === 'chair') { sx = 126; sy = 70; }
    else { sx = 122; sy = 65; }
  } else if (relation === 'behind') {
    if (ref === 'desk' || ref === 'table') { sx = 66; sy = 40; }
    else if (ref === 'chair') { sx = 66; sy = 50; }
    else { sx = 66; sy = 22; }
  } else if (relation === 'in') {
    sx = 66; sy = 38;
  }

  // Mini Subject SVG (book, pencil, crayon, apple, pineapple)
  if (sub === 'book') {
    subjectSvg = `
      <g transform="translate(${sx}, ${sy})">
        <rect x="0" y="0" width="${sw}" height="${sh * 0.9}" rx="2" fill="${p.bookCover}" stroke="${p.stroke}" stroke-width="2.5" />
        <line x1="${sw / 2}" y1="0" x2="${sw / 2}" y2="${sh * 0.9}" stroke="${p.stroke}" stroke-width="2" />
        <rect x="${sw * 0.2}" y="${sh * 0.2}" width="${sw * 0.25}" height="${sh * 0.4}" fill="${p.bookBadge}" stroke="${p.stroke}" stroke-width="1.5" />
      </g>
    `;
  } else if (sub === 'pencil') {
    subjectSvg = `
      <g transform="translate(${sx}, ${sy})">
        <rect x="8" y="0" width="10" height="28" fill="${p.pencilBody}" stroke="${p.stroke}" stroke-width="2" />
        <polygon points="8,28 18,28 13,38" fill="${p.pencilBody}" stroke="${p.stroke}" stroke-width="2" />
        <polygon points="10,33 16,33 13,38" fill="${p.stroke}" />
      </g>
    `;
  } else if (sub === 'crayon') {
    subjectSvg = `
      <g transform="translate(${sx}, ${sy})">
        <rect x="6" y="8" width="14" height="28" rx="2" fill="${p.crayonBody}" stroke="${p.stroke}" stroke-width="2" />
        <polygon points="6,8 20,8 13,0" fill="${p.stroke}" stroke="${p.stroke}" stroke-width="2" />
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
  if (relation === 'behind') {
    layers = `${subjectSvg} ${referenceSvg} ${foregroundSvg}`;
  } else if (relation === 'in') {
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
