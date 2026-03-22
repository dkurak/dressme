import { Board, Category, Item } from './types';

// Generate a simple colored placeholder image as a data URI
function placeholderImage(color: string, label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
    <rect width="300" height="300" fill="${color}" rx="8"/>
    <text x="150" y="140" text-anchor="middle" fill="white" font-family="Arial" font-size="16" font-weight="bold">${label}</text>
    <text x="150" y="165" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-family="Arial" font-size="12">Sample Item</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// ============================================================
// DEMO BOARD 1: Wedding Guest
// ============================================================

const weddingCategories: Category[] = [
  { id: 'w-cat-dress', board_id: 'demo-wedding', name: 'Dress', sort_order: 0, created_at: '' },
  { id: 'w-cat-shoes', board_id: 'demo-wedding', name: 'Shoes', sort_order: 1, created_at: '' },
  { id: 'w-cat-earrings', board_id: 'demo-wedding', name: 'Earrings', sort_order: 2, created_at: '' },
  { id: 'w-cat-clutch', board_id: 'demo-wedding', name: 'Clutch', sort_order: 3, created_at: '' },
];

const weddingItems: Item[] = [
  // Dresses
  { id: 'w-d1', board_id: 'demo-wedding', category_id: 'w-cat-dress', name: 'Navy Ruffle Midi', image_url: placeholderImage('#1e3a5f', 'Navy Ruffle Midi'), image_path: '', brand: 'Anthropologie', price: 228, currency: 'USD', product_url: null, is_owned: false, is_locked: false, sort_order: 0, created_at: '', updated_at: '' },
  { id: 'w-d2', board_id: 'demo-wedding', category_id: 'w-cat-dress', name: 'Emerald Satin Slip', image_url: placeholderImage('#065f46', 'Emerald Satin Slip'), image_path: '', brand: 'Reformation', price: 278, currency: 'USD', product_url: null, is_owned: false, is_locked: false, sort_order: 1, created_at: '', updated_at: '' },
  { id: 'w-d3', board_id: 'demo-wedding', category_id: 'w-cat-dress', name: 'Blush Floral Maxi', image_url: placeholderImage('#be185d', 'Blush Floral Maxi'), image_path: '', brand: 'ASTR the Label', price: 148, currency: 'USD', product_url: null, is_owned: true, is_locked: false, sort_order: 2, created_at: '', updated_at: '' },

  // Shoes
  { id: 'w-s1', board_id: 'demo-wedding', category_id: 'w-cat-shoes', name: 'Gold Strappy Heels', image_url: placeholderImage('#b45309', 'Gold Strappy Heels'), image_path: '', brand: 'Sam Edelman', price: 130, currency: 'USD', product_url: null, is_owned: false, is_locked: false, sort_order: 0, created_at: '', updated_at: '' },
  { id: 'w-s2', board_id: 'demo-wedding', category_id: 'w-cat-shoes', name: 'Nude Block Heels', image_url: placeholderImage('#d4a574', 'Nude Block Heels'), image_path: '', brand: 'Steve Madden', price: 89, currency: 'USD', product_url: null, is_owned: true, is_locked: false, sort_order: 1, created_at: '', updated_at: '' },
  { id: 'w-s3', board_id: 'demo-wedding', category_id: 'w-cat-shoes', name: 'Silver Kitten Heels', image_url: placeholderImage('#6b7280', 'Silver Kitten Heels'), image_path: '', brand: 'Manolo Blahnik', price: 695, currency: 'USD', product_url: null, is_owned: false, is_locked: false, sort_order: 2, created_at: '', updated_at: '' },
  { id: 'w-s4', board_id: 'demo-wedding', category_id: 'w-cat-shoes', name: 'Floral Bow Mules', image_url: placeholderImage('#7c3aed', 'Floral Bow Mules'), image_path: '', brand: 'Loeffler Randall', price: 350, currency: 'USD', product_url: null, is_owned: false, is_locked: false, sort_order: 3, created_at: '', updated_at: '' },

  // Earrings
  { id: 'w-e1', board_id: 'demo-wedding', category_id: 'w-cat-earrings', name: 'Crystal Drop Earrings', image_url: placeholderImage('#0ea5e9', 'Crystal Drops'), image_path: '', brand: 'Swarovski', price: 89, currency: 'USD', product_url: null, is_owned: true, is_locked: false, sort_order: 0, created_at: '', updated_at: '' },
  { id: 'w-e2', board_id: 'demo-wedding', category_id: 'w-cat-earrings', name: 'Gold Hoop Earrings', image_url: placeholderImage('#ca8a04', 'Gold Hoops'), image_path: '', brand: 'Mejuri', price: 68, currency: 'USD', product_url: null, is_owned: false, is_locked: false, sort_order: 1, created_at: '', updated_at: '' },
  { id: 'w-e3', board_id: 'demo-wedding', category_id: 'w-cat-earrings', name: 'Floral Statement Hoops', image_url: placeholderImage('#dc2626', 'Floral Hoops'), image_path: '', brand: 'BaubleBar', price: 42, currency: 'USD', product_url: null, is_owned: false, is_locked: false, sort_order: 2, created_at: '', updated_at: '' },

  // Clutches
  { id: 'w-c1', board_id: 'demo-wedding', category_id: 'w-cat-clutch', name: 'Pearl Box Clutch', image_url: placeholderImage('#f5f5f4', 'Pearl Box Clutch').replace('fill="white"', 'fill="#333"').replace('fill="rgba(255,255,255,0.7)"', 'fill="#666"'), image_path: '', brand: 'Cult Gaia', price: 298, currency: 'USD', product_url: null, is_owned: false, is_locked: false, sort_order: 0, created_at: '', updated_at: '' },
  { id: 'w-c2', board_id: 'demo-wedding', category_id: 'w-cat-clutch', name: 'Velvet Envelope Clutch', image_url: placeholderImage('#581c87', 'Velvet Envelope'), image_path: '', brand: 'Reiss', price: 125, currency: 'USD', product_url: null, is_owned: false, is_locked: false, sort_order: 1, created_at: '', updated_at: '' },
];

// ============================================================
// DEMO BOARD 2: Ski Trip
// ============================================================

const skiCategories: Category[] = [
  { id: 's-cat-jacket', board_id: 'demo-ski', name: 'Jacket', sort_order: 0, created_at: '' },
  { id: 's-cat-pants', board_id: 'demo-ski', name: 'Pants', sort_order: 1, created_at: '' },
  { id: 's-cat-helmet', board_id: 'demo-ski', name: 'Helmet', sort_order: 2, created_at: '' },
  { id: 's-cat-goggles', board_id: 'demo-ski', name: 'Goggles', sort_order: 3, created_at: '' },
];

const skiItems: Item[] = [
  // Jackets
  { id: 's-j1', board_id: 'demo-ski', category_id: 's-cat-jacket', name: 'Rose Pink Shell', image_url: placeholderImage('#e8a0bf', 'Rose Pink Shell').replace('fill="white"', 'fill="#333"'), image_path: '', brand: 'Patagonia', price: 349, currency: 'USD', product_url: null, is_owned: false, is_locked: false, sort_order: 0, created_at: '', updated_at: '' },
  { id: 's-j2', board_id: 'demo-ski', category_id: 's-cat-jacket', name: 'Sage Green Insulated', image_url: placeholderImage('#6b8f71', 'Sage Insulated'), image_path: '', brand: 'Arc\'teryx', price: 550, currency: 'USD', product_url: null, is_owned: false, is_locked: false, sort_order: 1, created_at: '', updated_at: '' },
  { id: 's-j3', board_id: 'demo-ski', category_id: 's-cat-jacket', name: 'Cream Puffer', image_url: placeholderImage('#f5f0e8', 'Cream Puffer').replace('fill="white"', 'fill="#333"').replace('fill="rgba(255,255,255,0.7)"', 'fill="#666"'), image_path: '', brand: 'Mammut', price: 425, currency: 'USD', product_url: null, is_owned: false, is_locked: false, sort_order: 2, created_at: '', updated_at: '' },

  // Pants
  { id: 's-p1', board_id: 'demo-ski', category_id: 's-cat-pants', name: 'Dusty Rose Bibs', image_url: placeholderImage('#c9a0a0', 'Dusty Rose Bibs'), image_path: '', brand: 'Burton', price: 280, currency: 'USD', product_url: null, is_owned: false, is_locked: false, sort_order: 0, created_at: '', updated_at: '' },
  { id: 's-p2', board_id: 'demo-ski', category_id: 's-cat-pants', name: 'Mauve Cargo Pants', image_url: placeholderImage('#9f6b8a', 'Mauve Cargos'), image_path: '', brand: 'Flylow', price: 300, currency: 'USD', product_url: null, is_owned: false, is_locked: false, sort_order: 1, created_at: '', updated_at: '' },

  // Helmets
  { id: 's-h1', board_id: 'demo-ski', category_id: 's-cat-helmet', name: 'Matte Rose Helmet', image_url: placeholderImage('#c98da0', 'Matte Rose'), image_path: '', brand: 'Smith', price: 180, currency: 'USD', product_url: null, is_owned: false, is_locked: false, sort_order: 0, created_at: '', updated_at: '' },
  { id: 's-h2', board_id: 'demo-ski', category_id: 's-cat-helmet', name: 'White Helmet', image_url: placeholderImage('#e8e8e8', 'White').replace('fill="white"', 'fill="#333"').replace('fill="rgba(255,255,255,0.7)"', 'fill="#666"'), image_path: '', brand: 'Smith', price: 200, currency: 'USD', product_url: null, is_owned: true, is_locked: false, sort_order: 1, created_at: '', updated_at: '' },

  // Goggles
  { id: 's-g1', board_id: 'demo-ski', category_id: 's-cat-goggles', name: 'Rose Gold Lens', image_url: placeholderImage('#b87850', 'Rose Gold Lens'), image_path: '', brand: 'Smith', price: 230, currency: 'USD', product_url: null, is_owned: false, is_locked: false, sort_order: 0, created_at: '', updated_at: '' },
  { id: 's-g2', board_id: 'demo-ski', category_id: 's-cat-goggles', name: 'Mirror Chrome Lens', image_url: placeholderImage('#94a3b8', 'Chrome Mirror'), image_path: '', brand: 'Oakley', price: 190, currency: 'USD', product_url: null, is_owned: true, is_locked: false, sort_order: 1, created_at: '', updated_at: '' },
];

// ============================================================
// DEMO BOARD 3: Date Night
// ============================================================

const dateCategories: Category[] = [
  { id: 'dn-cat-top', board_id: 'demo-date', name: 'Top', sort_order: 0, created_at: '' },
  { id: 'dn-cat-bottoms', board_id: 'demo-date', name: 'Bottoms', sort_order: 1, created_at: '' },
  { id: 'dn-cat-shoes', board_id: 'demo-date', name: 'Shoes', sort_order: 2, created_at: '' },
];

const dateItems: Item[] = [
  // Tops
  { id: 'dn-t1', board_id: 'demo-date', category_id: 'dn-cat-top', name: 'Black Silk Cami', image_url: placeholderImage('#1a1a2e', 'Black Silk Cami'), image_path: '', brand: 'Vince', price: 195, currency: 'USD', product_url: null, is_owned: true, is_locked: false, sort_order: 0, created_at: '', updated_at: '' },
  { id: 'dn-t2', board_id: 'demo-date', category_id: 'dn-cat-top', name: 'Red Wrap Blouse', image_url: placeholderImage('#991b1b', 'Red Wrap Blouse'), image_path: '', brand: 'Sézane', price: 145, currency: 'USD', product_url: null, is_owned: false, is_locked: false, sort_order: 1, created_at: '', updated_at: '' },

  // Bottoms
  { id: 'dn-b1', board_id: 'demo-date', category_id: 'dn-cat-bottoms', name: 'Leather Mini Skirt', image_url: placeholderImage('#292524', 'Leather Mini'), image_path: '', brand: 'AllSaints', price: 199, currency: 'USD', product_url: null, is_owned: true, is_locked: false, sort_order: 0, created_at: '', updated_at: '' },
  { id: 'dn-b2', board_id: 'demo-date', category_id: 'dn-cat-bottoms', name: 'Wide Leg Trousers', image_url: placeholderImage('#44403c', 'Wide Leg Trousers'), image_path: '', brand: 'COS', price: 135, currency: 'USD', product_url: null, is_owned: false, is_locked: false, sort_order: 1, created_at: '', updated_at: '' },

  // Shoes
  { id: 'dn-sh1', board_id: 'demo-date', category_id: 'dn-cat-shoes', name: 'Black Pointed Pumps', image_url: placeholderImage('#0f0f0f', 'Black Pumps'), image_path: '', brand: 'Stuart Weitzman', price: 375, currency: 'USD', product_url: null, is_owned: true, is_locked: false, sort_order: 0, created_at: '', updated_at: '' },
  { id: 'dn-sh2', board_id: 'demo-date', category_id: 'dn-cat-shoes', name: 'Strappy Red Heels', image_url: placeholderImage('#b91c1c', 'Red Strappy Heels'), image_path: '', brand: 'Schutz', price: 158, currency: 'USD', product_url: null, is_owned: false, is_locked: false, sort_order: 1, created_at: '', updated_at: '' },
];

// ============================================================
// Export all demo data
// ============================================================

export interface DemoBoard {
  board: Board;
  categories: Category[];
  items: Item[];
}

export const DEMO_BOARDS: DemoBoard[] = [
  {
    board: {
      id: 'demo-wedding',
      user_id: 'demo',
      title: 'Summer Wedding Guest',
      description: 'Sarah & Jake\'s wedding in June. Garden party vibes, semi-formal.',
      cover_image_url: null,
      share_token: 'demo-wedding',
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    categories: weddingCategories,
    items: weddingItems,
  },
  {
    board: {
      id: 'demo-ski',
      user_id: 'demo',
      title: 'Ski Season Kit',
      description: 'New gear for Crested Butte. Going for a cohesive pink/sage color palette.',
      cover_image_url: null,
      share_token: 'demo-ski',
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    categories: skiCategories,
    items: skiItems,
  },
  {
    board: {
      id: 'demo-date',
      user_id: 'demo',
      title: 'Date Night',
      description: 'Anniversary dinner downtown. Something chic but not overdone.',
      cover_image_url: null,
      share_token: 'demo-date',
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    categories: dateCategories,
    items: dateItems,
  },
];
