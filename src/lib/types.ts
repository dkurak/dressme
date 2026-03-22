// ============================================================
// Database types for DressMe
// ============================================================

export interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Board {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  share_token: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  board_id: string;
  name: string;
  sort_order: number;
  created_at: string;
}

export interface Item {
  id: string;
  board_id: string;
  category_id: string;
  name: string | null;
  image_url: string;
  image_path: string;
  brand: string | null;
  price: number | null;
  currency: string;
  product_url: string | null;
  is_owned: boolean;
  is_locked: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Outfit {
  id: string;
  board_id: string;
  name: string | null;
  is_favorite: boolean;
  is_winner: boolean;
  created_at: string;
}

export interface OutfitItem {
  id: string;
  outfit_id: string;
  item_id: string;
  category_id: string;
}

export interface Tournament {
  id: string;
  board_id: string;
  name: string | null;
  status: 'active' | 'completed';
  winner_outfit_id: string | null;
  current_round: number;
  created_at: string;
  updated_at: string;
}

export interface TournamentMatchup {
  id: string;
  tournament_id: string;
  round: number;
  match_index: number;
  outfit_a_id: string;
  outfit_b_id: string;
  winner_id: string | null;
  created_at: string;
}

export interface BoardShare {
  id: string;
  board_id: string;
  user_id: string | null;
  email: string | null;
  role: 'viewer' | 'commenter';
  created_at: string;
}

// ============================================================
// Extended types (with joins)
// ============================================================

export interface BoardWithCategories extends Board {
  categories: Category[];
}

export interface CategoryWithItems extends Category {
  items: Item[];
}

export interface OutfitWithItems extends Outfit {
  outfit_items: (OutfitItem & { item: Item })[];
}

export interface TournamentWithMatchups extends Tournament {
  tournament_matchups: TournamentMatchup[];
}

// ============================================================
// Category presets
// ============================================================

export const CATEGORY_PRESETS: Record<string, string[]> = {
  'Wedding / Formal': ['Dress', 'Shoes', 'Earrings', 'Necklace', 'Clutch'],
  'Casual Outfit': ['Top', 'Bottoms', 'Shoes', 'Bag', 'Accessories'],
  'Ski / Snowboard': ['Jacket', 'Pants', 'Helmet', 'Goggles', 'Gloves'],
  'Date Night': ['Dress', 'Shoes', 'Earrings', 'Bag'],
  'Work / Office': ['Blazer', 'Top', 'Bottoms', 'Shoes', 'Bag'],
  'Custom': [],
};
