import { Board, Category, Item } from './types';

// ============================================================
// DEMO BOARD 1: Ski Season Kit (Real products!)
// ============================================================

const skiCategories: Category[] = [
  { id: 's-cat-jacket', board_id: 'demo-ski', name: 'Jacket', sort_order: 0, created_at: '' },
  { id: 's-cat-pants', board_id: 'demo-ski', name: 'Pants', sort_order: 1, created_at: '' },
  { id: 's-cat-helmet', board_id: 'demo-ski', name: 'Helmet', sort_order: 2, created_at: '' },
  { id: 's-cat-goggles', board_id: 'demo-ski', name: 'Goggles', sort_order: 3, created_at: '' },
];

const skiItems: Item[] = [
  // === JACKETS (Flylow) ===
  { id: 's-j1', board_id: 'demo-ski', category_id: 's-cat-jacket', name: 'Domino Gore-Tex 3L - Aurora', image_url: 'https://cdn.shopify.com/s/files/1/1001/9644/files/F25_Domino-Gore-Tex-3L-Jacket_Aurora_A.jpg', image_path: '', brand: 'Flylow', price: 650, currency: 'USD', product_url: 'https://flylowgear.com/products/domino-gore-tex-3l-jacket', is_owned: false, is_locked: false, sort_order: 0, created_at: '', updated_at: '' },
  { id: 's-j2', board_id: 'demo-ski', category_id: 's-cat-jacket', name: 'Domino Gore-Tex 3L - Mist', image_url: 'https://cdn.shopify.com/s/files/1/1001/9644/files/F25_Domino-Gore-Tex-3L-Jacket_Mist_A.jpg', image_path: '', brand: 'Flylow', price: 650, currency: 'USD', product_url: 'https://flylowgear.com/products/domino-gore-tex-3l-jacket', is_owned: false, is_locked: false, sort_order: 1, created_at: '', updated_at: '' },
  { id: 's-j3', board_id: 'demo-ski', category_id: 's-cat-jacket', name: 'Domino Gore-Tex 3L - Ocean', image_url: 'https://cdn.shopify.com/s/files/1/1001/9644/files/F25_Domino-Gore-Tex-3L-Jacket_Ocean_A.jpg', image_path: '', brand: 'Flylow', price: 650, currency: 'USD', product_url: 'https://flylowgear.com/products/domino-gore-tex-3l-jacket', is_owned: false, is_locked: false, sort_order: 2, created_at: '', updated_at: '' },
  { id: 's-j4', board_id: 'demo-ski', category_id: 's-cat-jacket', name: 'Freya Gore-Tex 2L - Aurora/Currant', image_url: 'https://cdn.shopify.com/s/files/1/1001/9644/files/F25_Freya-Gore-Tex-2L-Jacket_Aurora-Currant_A.jpg', image_path: '', brand: 'Flylow', price: 288, currency: 'USD', product_url: 'https://flylowgear.com/products/freya-gore-tex-2l-jacket', is_owned: false, is_locked: false, sort_order: 3, created_at: '', updated_at: '' },
  { id: 's-j5', board_id: 'demo-ski', category_id: 's-cat-jacket', name: 'Freya Gore-Tex 2L - Frozen', image_url: 'https://cdn.shopify.com/s/files/1/1001/9644/files/F25_Freya-Gore-Tex-2L-Jacket_Frozen_A.jpg', image_path: '', brand: 'Flylow', price: 288, currency: 'USD', product_url: 'https://flylowgear.com/products/freya-gore-tex-2l-jacket', is_owned: false, is_locked: false, sort_order: 4, created_at: '', updated_at: '' },
  { id: 's-j6', board_id: 'demo-ski', category_id: 's-cat-jacket', name: 'Mia Jacket - Leaf/Mist', image_url: 'https://cdn.shopify.com/s/files/1/1001/9644/files/F25_Mia-Jacket_Leaf-Mist_A.jpg', image_path: '', brand: 'Flylow', price: 280, currency: 'USD', product_url: 'https://flylowgear.com/products/mia-jacket', is_owned: false, is_locked: false, sort_order: 5, created_at: '', updated_at: '' },
  { id: 's-j7', board_id: 'demo-ski', category_id: 's-cat-jacket', name: 'Mia Jacket - Currant', image_url: 'https://cdn.shopify.com/s/files/1/1001/9644/files/F25_Mia-Jacket_Currant_A.jpg', image_path: '', brand: 'Flylow', price: 280, currency: 'USD', product_url: 'https://flylowgear.com/products/mia-jacket', is_owned: false, is_locked: false, sort_order: 6, created_at: '', updated_at: '' },
  { id: 's-j8', board_id: 'demo-ski', category_id: 's-cat-jacket', name: 'Avery Jacket - Aurora', image_url: 'https://cdn.shopify.com/s/files/1/1001/9644/files/F25_Avery-Jacket_Aurora_A.jpg', image_path: '', brand: 'Flylow', price: 270, currency: 'USD', product_url: 'https://flylowgear.com/products/avery-jacket', is_owned: false, is_locked: false, sort_order: 7, created_at: '', updated_at: '' },
  { id: 's-j9', board_id: 'demo-ski', category_id: 's-cat-jacket', name: 'Billie Coat - Dragonfruit', image_url: 'https://cdn.shopify.com/s/files/1/1001/9644/files/F25_Billie-Coat_Dragonfruit_A.jpg', image_path: '', brand: 'Flylow', price: 264, currency: 'USD', product_url: 'https://flylowgear.com/products/billie-coat', is_owned: false, is_locked: false, sort_order: 8, created_at: '', updated_at: '' },
  { id: 's-j10', board_id: 'demo-ski', category_id: 's-cat-jacket', name: 'Billie Coat - Frozen', image_url: 'https://cdn.shopify.com/s/files/1/1001/9644/files/F25_Billie-Coat_Frozen_A.jpg', image_path: '', brand: 'Flylow', price: 264, currency: 'USD', product_url: 'https://flylowgear.com/products/billie-coat', is_owned: false, is_locked: false, sort_order: 9, created_at: '', updated_at: '' },

  // === PANTS/BIBS (Flylow) ===
  { id: 's-p1', board_id: 'demo-ski', category_id: 's-cat-pants', name: 'Foxy Bib - Tide', image_url: 'https://cdn.shopify.com/s/files/1/1001/9644/files/F25_Foxy-Bib_Tide_A.jpg', image_path: '', brand: 'Flylow', price: 264, currency: 'USD', product_url: 'https://flylowgear.com/products/foxy-bib', is_owned: false, is_locked: false, sort_order: 0, created_at: '', updated_at: '' },
  { id: 's-p2', board_id: 'demo-ski', category_id: 's-cat-pants', name: 'Foxy Bib - Aurora', image_url: 'https://cdn.shopify.com/s/files/1/1001/9644/files/F25_Foxy-Bib_Aurora_A.jpg', image_path: '', brand: 'Flylow', price: 264, currency: 'USD', product_url: 'https://flylowgear.com/products/foxy-bib', is_owned: false, is_locked: false, sort_order: 1, created_at: '', updated_at: '' },
  { id: 's-p3', board_id: 'demo-ski', category_id: 's-cat-pants', name: 'Foxy Bib - Black', image_url: 'https://cdn.shopify.com/s/files/1/1001/9644/files/F24_Foxy-Bib_Black_front.jpg', image_path: '', brand: 'Flylow', price: 264, currency: 'USD', product_url: 'https://flylowgear.com/products/foxy-bib', is_owned: false, is_locked: false, sort_order: 2, created_at: '', updated_at: '' },
  { id: 's-p4', board_id: 'demo-ski', category_id: 's-cat-pants', name: 'Foxy Bib - Dragonfruit', image_url: 'https://cdn.shopify.com/s/files/1/1001/9644/files/F25_Foxy-Bib_Dragonfruit_A.jpg', image_path: '', brand: 'Flylow', price: 264, currency: 'USD', product_url: 'https://flylowgear.com/products/foxy-bib', is_owned: false, is_locked: false, sort_order: 3, created_at: '', updated_at: '' },
  { id: 's-p5', board_id: 'demo-ski', category_id: 's-cat-pants', name: 'Siren Gore-Tex 3L Bib - Ocean', image_url: 'https://cdn.shopify.com/s/files/1/1001/9644/files/F25_Siren-Gore-Tex-3L-Bib_Ocean_A.jpg', image_path: '', brand: 'Flylow', price: 600, currency: 'USD', product_url: 'https://flylowgear.com/products/siren-gore-tex-3l-bib', is_owned: false, is_locked: false, sort_order: 4, created_at: '', updated_at: '' },
  { id: 's-p6', board_id: 'demo-ski', category_id: 's-cat-pants', name: 'Siren Gore-Tex 3L Bib - Bluff', image_url: 'https://cdn.shopify.com/s/files/1/1001/9644/files/F25_Siren-Gore-Tex-3L-Bib_Bluff_A.jpg', image_path: '', brand: 'Flylow', price: 600, currency: 'USD', product_url: 'https://flylowgear.com/products/siren-gore-tex-3l-bib', is_owned: false, is_locked: false, sort_order: 5, created_at: '', updated_at: '' },

  // === HELMETS (Glade) ===
  { id: 's-h1', board_id: 'demo-ski', category_id: 's-cat-helmet', name: 'Boundary MIPS - Coal', image_url: 'https://cdn.shopify.com/s/files/1/1443/1260/files/fw24_boundary_mips_matte_coal_pow_carousel.png', image_path: '', brand: 'Glade', price: 159, currency: 'USD', product_url: 'https://www.shopglade.com/products/boundary-helmet', is_owned: false, is_locked: false, sort_order: 0, created_at: '', updated_at: '' },
  { id: 's-h2', board_id: 'demo-ski', category_id: 's-cat-helmet', name: 'Boundary MIPS - Midnight Navy', image_url: 'https://cdn.shopify.com/s/files/1/1443/1260/files/fw25_boundary_mips_midnight_navy_pow_carousel.png', image_path: '', brand: 'Glade', price: 159, currency: 'USD', product_url: 'https://www.shopglade.com/products/boundary-helmet', is_owned: false, is_locked: false, sort_order: 1, created_at: '', updated_at: '' },
  { id: 's-h3', board_id: 'demo-ski', category_id: 's-cat-helmet', name: 'Boundary MIPS - Ranger', image_url: 'https://cdn.shopify.com/s/files/1/1443/1260/files/fw24_boundary_mips_matte_ranger_pow_carousel.png', image_path: '', brand: 'Glade', price: 159, currency: 'USD', product_url: 'https://www.shopglade.com/products/boundary-helmet', is_owned: false, is_locked: false, sort_order: 2, created_at: '', updated_at: '' },
  { id: 's-h4', board_id: 'demo-ski', category_id: 's-cat-helmet', name: 'Boundary MIPS - Maroon', image_url: 'https://cdn.shopify.com/s/files/1/1443/1260/files/fw25_boundary_mips_maroon_pow_carousel_b0260949-d630-41d3-81f0-a38c802d03e6.png', image_path: '', brand: 'Glade', price: 159, currency: 'USD', product_url: 'https://www.shopglade.com/products/boundary-helmet', is_owned: false, is_locked: false, sort_order: 3, created_at: '', updated_at: '' },
  { id: 's-h5', board_id: 'demo-ski', category_id: 's-cat-helmet', name: 'Boundary MIPS - Olive', image_url: 'https://cdn.shopify.com/s/files/1/1443/1260/files/fw25_boundary_mips_matte_olive_pow_carousel.png', image_path: '', brand: 'Glade', price: 159, currency: 'USD', product_url: 'https://www.shopglade.com/products/boundary-helmet', is_owned: false, is_locked: false, sort_order: 4, created_at: '', updated_at: '' },
  { id: 's-h6', board_id: 'demo-ski', category_id: 's-cat-helmet', name: 'Boundary MIPS - Deep', image_url: 'https://cdn.shopify.com/s/files/1/1443/1260/files/fw24_boundary_mips_matte_deep_pow_carousel.png', image_path: '', brand: 'Glade', price: 159, currency: 'USD', product_url: 'https://www.shopglade.com/products/boundary-helmet', is_owned: false, is_locked: false, sort_order: 5, created_at: '', updated_at: '' },

  // === GOGGLES (Glade) ===
  { id: 's-g1', board_id: 'demo-ski', category_id: 's-cat-goggles', name: 'Adapt 2 - Blue/Black', image_url: 'https://cdn.shopify.com/s/files/1/1443/1260/files/fw25_adapt_2_reveal_4k_blue_black_pow_carousel.png', image_path: '', brand: 'Glade', price: 104, currency: 'USD', product_url: 'https://www.shopglade.com/products/adapt-2-0', is_owned: false, is_locked: false, sort_order: 0, created_at: '', updated_at: '' },
  { id: 's-g2', board_id: 'demo-ski', category_id: 's-cat-goggles', name: 'Adapt 2 - Bronze/Navy', image_url: 'https://cdn.shopify.com/s/files/1/1443/1260/files/fw25_adapt_2_reveal_4k_bronze_midnight_navy_pow_carousel.png', image_path: '', brand: 'Glade', price: 104, currency: 'USD', product_url: 'https://www.shopglade.com/products/adapt-2-0', is_owned: false, is_locked: false, sort_order: 1, created_at: '', updated_at: '' },
  { id: 's-g3', board_id: 'demo-ski', category_id: 's-cat-goggles', name: 'Adapt 2 - Orange/Black', image_url: 'https://cdn.shopify.com/s/files/1/1443/1260/files/new_fw24_adapt_2_reveal_orange_black_pow_carousel_eeb13b3b-21a6-47c1-b1d1-699dccf2620f.png', image_path: '', brand: 'Glade', price: 104, currency: 'USD', product_url: 'https://www.shopglade.com/products/adapt-2-0', is_owned: false, is_locked: false, sort_order: 2, created_at: '', updated_at: '' },
];

// ============================================================
// DEMO BOARD 2: Wedding Guest (placeholder for now)
// ============================================================

function placeholderImage(color: string, label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
    <rect width="300" height="300" fill="${color}" rx="8"/>
    <text x="150" y="140" text-anchor="middle" fill="white" font-family="Arial" font-size="16" font-weight="bold">${label}</text>
    <text x="150" y="165" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-family="Arial" font-size="12">Sample Item</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

const weddingCategories: Category[] = [
  { id: 'w-cat-dress', board_id: 'demo-wedding', name: 'Dress', sort_order: 0, created_at: '' },
  { id: 'w-cat-shoes', board_id: 'demo-wedding', name: 'Shoes', sort_order: 1, created_at: '' },
  { id: 'w-cat-earrings', board_id: 'demo-wedding', name: 'Earrings', sort_order: 2, created_at: '' },
  { id: 'w-cat-clutch', board_id: 'demo-wedding', name: 'Clutch', sort_order: 3, created_at: '' },
];

const weddingItems: Item[] = [
  { id: 'w-d1', board_id: 'demo-wedding', category_id: 'w-cat-dress', name: 'Navy Ruffle Midi', image_url: placeholderImage('#1e3a5f', 'Navy Ruffle Midi'), image_path: '', brand: 'Anthropologie', price: 228, currency: 'USD', product_url: null, is_owned: false, is_locked: false, sort_order: 0, created_at: '', updated_at: '' },
  { id: 'w-d2', board_id: 'demo-wedding', category_id: 'w-cat-dress', name: 'Emerald Satin Slip', image_url: placeholderImage('#065f46', 'Emerald Satin Slip'), image_path: '', brand: 'Reformation', price: 278, currency: 'USD', product_url: null, is_owned: false, is_locked: false, sort_order: 1, created_at: '', updated_at: '' },
  { id: 'w-d3', board_id: 'demo-wedding', category_id: 'w-cat-dress', name: 'Blush Floral Maxi', image_url: placeholderImage('#be185d', 'Blush Floral Maxi'), image_path: '', brand: 'ASTR the Label', price: 148, currency: 'USD', product_url: null, is_owned: true, is_locked: false, sort_order: 2, created_at: '', updated_at: '' },
  { id: 'w-s1', board_id: 'demo-wedding', category_id: 'w-cat-shoes', name: 'Gold Strappy Heels', image_url: placeholderImage('#b45309', 'Gold Strappy Heels'), image_path: '', brand: 'Sam Edelman', price: 130, currency: 'USD', product_url: null, is_owned: false, is_locked: false, sort_order: 0, created_at: '', updated_at: '' },
  { id: 'w-s2', board_id: 'demo-wedding', category_id: 'w-cat-shoes', name: 'Nude Block Heels', image_url: placeholderImage('#d4a574', 'Nude Block Heels'), image_path: '', brand: 'Steve Madden', price: 89, currency: 'USD', product_url: null, is_owned: true, is_locked: false, sort_order: 1, created_at: '', updated_at: '' },
  { id: 'w-s3', board_id: 'demo-wedding', category_id: 'w-cat-shoes', name: 'Silver Kitten Heels', image_url: placeholderImage('#6b7280', 'Silver Kitten Heels'), image_path: '', brand: 'Manolo Blahnik', price: 695, currency: 'USD', product_url: null, is_owned: false, is_locked: false, sort_order: 2, created_at: '', updated_at: '' },
  { id: 'w-e1', board_id: 'demo-wedding', category_id: 'w-cat-earrings', name: 'Crystal Drops', image_url: placeholderImage('#0ea5e9', 'Crystal Drops'), image_path: '', brand: 'Swarovski', price: 89, currency: 'USD', product_url: null, is_owned: true, is_locked: false, sort_order: 0, created_at: '', updated_at: '' },
  { id: 'w-e2', board_id: 'demo-wedding', category_id: 'w-cat-earrings', name: 'Gold Hoops', image_url: placeholderImage('#ca8a04', 'Gold Hoops'), image_path: '', brand: 'Mejuri', price: 68, currency: 'USD', product_url: null, is_owned: false, is_locked: false, sort_order: 1, created_at: '', updated_at: '' },
  { id: 'w-c1', board_id: 'demo-wedding', category_id: 'w-cat-clutch', name: 'Pearl Box Clutch', image_url: placeholderImage('#a8a29e', 'Pearl Box Clutch'), image_path: '', brand: 'Cult Gaia', price: 298, currency: 'USD', product_url: null, is_owned: false, is_locked: false, sort_order: 0, created_at: '', updated_at: '' },
  { id: 'w-c2', board_id: 'demo-wedding', category_id: 'w-cat-clutch', name: 'Velvet Envelope', image_url: placeholderImage('#581c87', 'Velvet Envelope'), image_path: '', brand: 'Reiss', price: 125, currency: 'USD', product_url: null, is_owned: false, is_locked: false, sort_order: 1, created_at: '', updated_at: '' },
];

// ============================================================
// Export
// ============================================================

export interface DemoBoard {
  board: Board;
  categories: Category[];
  items: Item[];
}

export const DEMO_BOARDS: DemoBoard[] = [
  {
    board: {
      id: 'demo-ski',
      user_id: 'demo',
      title: 'Ski Season Kit',
      description: 'Mix & match Flylow jackets and bibs with Glade helmets and goggles. Real products, real prices.',
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
      id: 'demo-wedding',
      user_id: 'demo',
      title: 'Summer Wedding Guest',
      description: 'Garden party wedding. Semi-formal. Still deciding on everything.',
      cover_image_url: null,
      share_token: 'demo-wedding',
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    categories: weddingCategories,
    items: weddingItems,
  },
];
