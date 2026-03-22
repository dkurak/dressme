// Full-body avatar silhouettes as inline SVGs
// These serve as mannequins that items are arranged around
// Eventually users will upload their own photos

export interface Avatar {
  id: string;
  name: string;
  description: string;
  svg: string;
}

function createAvatar(
  id: string,
  name: string,
  description: string,
  skinColor: string,
  hairColor: string,
  bodyPath: string,
  hairPath: string,
  headCx: number,
  headCy: number,
  headRx: number,
  headRy: number,
): Avatar {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 500" width="200" height="500">
    <!-- Body -->
    <path d="${bodyPath}" fill="${skinColor}" />
    <!-- Head -->
    <ellipse cx="${headCx}" cy="${headCy}" rx="${headRx}" ry="${headRy}" fill="${skinColor}" />
    <!-- Hair -->
    <path d="${hairPath}" fill="${hairColor}" />
    <!-- Face features -->
    <ellipse cx="${headCx - 8}" cy="${headCy - 2}" rx="2" ry="2.5" fill="${hairColor}" opacity="0.4" />
    <ellipse cx="${headCx + 8}" cy="${headCy - 2}" rx="2" ry="2.5" fill="${hairColor}" opacity="0.4" />
    <path d="M${headCx - 4} ${headCy + 8} Q${headCx} ${headCy + 13} ${headCx + 4} ${headCy + 8}" fill="none" stroke="${hairColor}" stroke-width="1.5" opacity="0.3" />
  </svg>`;

  return { id, name, description, svg: `data:image/svg+xml;base64,${btoa(svg)}` };
}

// Body paths for different silhouettes
// All are standing, front-facing, roughly centered at x=100

const AVATARS: Avatar[] = [
  createAvatar(
    'avatar-1', 'Classic', 'Balanced silhouette',
    '#f0c8a0', '#3d2b1f',
    // Body: neck, shoulders, torso, waist, hips, legs
    'M92 90 L88 105 L60 115 L55 120 L55 135 L60 140 L65 200 L72 260 L68 265 L65 340 L60 420 L58 460 L70 465 L75 465 L80 420 L88 340 L95 290 L100 285 L105 290 L112 340 L120 420 L125 465 L130 465 L142 460 L140 420 L135 340 L128 265 L132 260 L135 200 L140 140 L145 135 L145 120 L140 115 L112 105 L108 90 Z',
    // Hair
    'M75 40 Q72 20 85 10 Q100 0 115 10 Q128 20 125 40 L125 55 Q115 50 100 50 Q85 50 75 55 Z',
    100, 58, 22, 26,
  ),
  createAvatar(
    'avatar-2', 'Tall', 'Longer proportions',
    '#d4a574', '#1a1a2e',
    'M93 92 L89 108 L63 118 L58 123 L58 136 L62 140 L66 205 L70 268 L66 272 L62 355 L58 435 L56 470 L68 475 L73 475 L78 435 L86 355 L94 295 L100 290 L106 295 L114 355 L122 435 L127 475 L132 475 L144 470 L142 435 L138 355 L130 272 L134 268 L134 205 L138 140 L142 136 L142 123 L137 118 L111 108 L107 92 Z',
    'M76 38 Q74 15 88 6 Q100 -2 112 6 Q126 15 124 38 L124 58 Q114 52 100 52 Q86 52 76 58 Z',
    100, 58, 21, 27,
  ),
  createAvatar(
    'avatar-3', 'Curvy', 'Fuller figure',
    '#f0c8a0', '#8b4513',
    'M90 90 L86 106 L58 116 L52 122 L50 138 L55 145 L58 200 L64 250 L60 260 L52 275 L55 345 L52 425 L50 462 L64 467 L70 467 L76 425 L84 345 L92 290 L100 285 L108 290 L116 345 L124 425 L130 467 L136 467 L150 462 L148 425 L145 345 L148 275 L140 260 L136 250 L142 200 L145 145 L150 138 L148 122 L142 116 L114 106 L110 90 Z',
    'M74 36 Q70 15 84 5 Q100 -5 116 5 Q130 15 126 36 L128 65 Q118 55 100 55 Q82 55 72 65 Z',
    100, 56, 24, 28,
  ),
  createAvatar(
    'avatar-4', 'Petite', 'Compact frame',
    '#e8b88a', '#2d1b00',
    'M92 88 L88 100 L64 110 L60 114 L60 126 L64 130 L68 185 L74 240 L70 244 L66 320 L62 395 L60 435 L72 440 L76 440 L80 395 L88 320 L95 270 L100 266 L105 270 L112 320 L120 395 L124 440 L128 440 L140 435 L138 395 L134 320 L126 244 L130 240 L132 185 L136 130 L140 126 L140 114 L136 110 L112 100 L108 88 Z',
    'M78 38 Q76 20 88 12 Q100 4 112 12 Q124 20 122 38 L122 52 Q114 48 100 48 Q86 48 78 52 Z',
    100, 55, 20, 24,
  ),
  createAvatar(
    'avatar-5', 'Athletic', 'Toned build',
    '#c68c53', '#0a0a0a',
    'M91 90 L87 105 L58 116 L53 122 L52 138 L58 144 L64 200 L70 258 L66 263 L62 340 L58 420 L56 460 L68 465 L74 465 L80 420 L88 340 L96 288 L100 284 L104 288 L112 340 L120 420 L126 465 L132 465 L144 460 L142 420 L138 340 L130 263 L134 258 L136 200 L142 144 L148 138 L148 122 L142 116 L113 105 L109 90 Z',
    'M80 42 Q78 25 90 15 Q100 8 110 15 Q122 25 120 42 L120 50 Q112 47 100 47 Q88 47 80 50 Z',
    100, 57, 22, 25,
  ),
  createAvatar(
    'avatar-6', 'Elegant', 'Long and lean',
    '#f5d5b8', '#614b3a',
    'M93 90 L90 106 L64 115 L59 120 L58 134 L62 139 L65 202 L70 265 L67 270 L63 350 L59 432 L57 468 L69 473 L74 473 L78 432 L86 350 L94 292 L100 288 L106 292 L114 350 L122 432 L126 473 L131 473 L143 468 L141 432 L137 350 L130 270 L133 265 L135 202 L138 139 L142 134 L142 120 L136 115 L110 106 L107 90 Z',
    'M76 35 Q72 12 87 4 Q100 -4 113 4 Q128 12 124 35 L126 60 Q118 70 100 72 Q82 70 74 60 Z',
    100, 56, 21, 27,
  ),
];

export default AVATARS;

// Slot positions on the avatar for different clothing categories
// These define where items should be positioned relative to the avatar
export interface SlotPosition {
  top: string;    // CSS top position (percentage)
  left: string;   // CSS left position (percentage)
  width: string;  // CSS width
  height: string; // CSS height
}

export const SLOT_POSITIONS: Record<string, SlotPosition> = {
  // Head area
  'Helmet': { top: '0%', left: '25%', width: '50%', height: '14%' },
  'Hat': { top: '0%', left: '25%', width: '50%', height: '12%' },
  'Goggles': { top: '8%', left: '25%', width: '50%', height: '8%' },

  // Ear area
  'Earrings': { top: '10%', left: '10%', width: '80%', height: '8%' },

  // Neck area
  'Necklace': { top: '16%', left: '20%', width: '60%', height: '8%' },

  // Upper body
  'Dress': { top: '18%', left: '15%', width: '70%', height: '45%' },
  'Top': { top: '18%', left: '15%', width: '70%', height: '25%' },
  'Blazer': { top: '18%', left: '12%', width: '76%', height: '28%' },
  'Jacket': { top: '16%', left: '12%', width: '76%', height: '30%' },

  // Lower body
  'Bottoms': { top: '42%', left: '18%', width: '64%', height: '30%' },
  'Pants': { top: '42%', left: '18%', width: '64%', height: '38%' },
  'Skirt': { top: '42%', left: '18%', width: '64%', height: '22%' },

  // Feet
  'Shoes': { top: '82%', left: '15%', width: '70%', height: '16%' },
  'Gloves': { top: '38%', left: '5%', width: '90%', height: '10%' },

  // Accessories
  'Clutch': { top: '50%', left: '65%', width: '30%', height: '12%' },
  'Bag': { top: '45%', left: '65%', width: '30%', height: '15%' },
  'Accessories': { top: '35%', left: '60%', width: '35%', height: '10%' },

  // Default fallback
  '_default': { top: '35%', left: '20%', width: '60%', height: '20%' },
};

export function getSlotPosition(categoryName: string): SlotPosition {
  return SLOT_POSITIONS[categoryName] || SLOT_POSITIONS['_default'];
}
