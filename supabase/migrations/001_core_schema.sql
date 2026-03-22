-- DressMe Core Schema
-- =============================================================

-- Utility: updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================
-- PROFILES (extends Supabase auth.users)
-- =============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================================
-- BOARDS (occasions / outfit projects)
-- =============================================================
CREATE TABLE IF NOT EXISTS boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  share_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE boards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can do everything with their boards"
  ON boards FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public boards are viewable"
  ON boards FOR SELECT USING (is_public = true);

CREATE INDEX idx_boards_user ON boards(user_id);
CREATE INDEX idx_boards_share_token ON boards(share_token);

CREATE TRIGGER update_boards_updated_at
  BEFORE UPDATE ON boards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================
-- CATEGORIES (flexible slots per board)
-- =============================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories follow board owner access"
  ON categories FOR ALL USING (
    board_id IN (SELECT id FROM boards WHERE user_id = auth.uid())
  );

CREATE POLICY "Categories on public boards are viewable"
  ON categories FOR SELECT USING (
    board_id IN (SELECT id FROM boards WHERE is_public = true)
  );

CREATE INDEX idx_categories_board ON categories(board_id, sort_order);

-- =============================================================
-- ITEMS (wardrobe pieces)
-- =============================================================
CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT,
  image_url TEXT NOT NULL,
  image_path TEXT NOT NULL,
  brand TEXT,
  price DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  product_url TEXT,
  is_owned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Items follow board owner access"
  ON items FOR ALL USING (
    board_id IN (SELECT id FROM boards WHERE user_id = auth.uid())
  );

CREATE POLICY "Items on public boards are viewable"
  ON items FOR SELECT USING (
    board_id IN (SELECT id FROM boards WHERE is_public = true)
  );

CREATE INDEX idx_items_board ON items(board_id);
CREATE INDEX idx_items_category ON items(category_id, sort_order);

CREATE TRIGGER update_items_updated_at
  BEFORE UPDATE ON items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================
-- OUTFITS (saved combinations)
-- =============================================================
CREATE TABLE IF NOT EXISTS outfits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  name TEXT,
  is_favorite BOOLEAN DEFAULT false,
  is_winner BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE outfits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Outfits follow board owner access"
  ON outfits FOR ALL USING (
    board_id IN (SELECT id FROM boards WHERE user_id = auth.uid())
  );

CREATE POLICY "Outfits on public boards are viewable"
  ON outfits FOR SELECT USING (
    board_id IN (SELECT id FROM boards WHERE is_public = true)
  );

CREATE INDEX idx_outfits_board ON outfits(board_id);

-- =============================================================
-- OUTFIT_ITEMS (junction: which item fills which slot)
-- =============================================================
CREATE TABLE IF NOT EXISTS outfit_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outfit_id UUID NOT NULL REFERENCES outfits(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  UNIQUE(outfit_id, category_id)
);

ALTER TABLE outfit_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Outfit items follow outfit board owner access"
  ON outfit_items FOR ALL USING (
    outfit_id IN (
      SELECT o.id FROM outfits o
      JOIN boards b ON b.id = o.board_id
      WHERE b.user_id = auth.uid()
    )
  );

CREATE POLICY "Outfit items on public boards are viewable"
  ON outfit_items FOR SELECT USING (
    outfit_id IN (
      SELECT o.id FROM outfits o
      JOIN boards b ON b.id = o.board_id
      WHERE b.is_public = true
    )
  );

CREATE INDEX idx_outfit_items_outfit ON outfit_items(outfit_id);

-- =============================================================
-- TOURNAMENTS (bracket comparisons)
-- =============================================================
CREATE TABLE IF NOT EXISTS tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  name TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  winner_outfit_id UUID REFERENCES outfits(id),
  current_round INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tournaments follow board owner access"
  ON tournaments FOR ALL USING (
    board_id IN (SELECT id FROM boards WHERE user_id = auth.uid())
  );

CREATE POLICY "Tournaments on public boards are viewable"
  ON tournaments FOR SELECT USING (
    board_id IN (SELECT id FROM boards WHERE is_public = true)
  );

CREATE TRIGGER update_tournaments_updated_at
  BEFORE UPDATE ON tournaments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================
-- TOURNAMENT_MATCHUPS
-- =============================================================
CREATE TABLE IF NOT EXISTS tournament_matchups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  round INTEGER NOT NULL,
  match_index INTEGER NOT NULL,
  outfit_a_id UUID NOT NULL REFERENCES outfits(id),
  outfit_b_id UUID NOT NULL REFERENCES outfits(id),
  winner_id UUID REFERENCES outfits(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE tournament_matchups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Matchups follow tournament board owner access"
  ON tournament_matchups FOR ALL USING (
    tournament_id IN (
      SELECT t.id FROM tournaments t
      JOIN boards b ON b.id = t.board_id
      WHERE b.user_id = auth.uid()
    )
  );

CREATE POLICY "Matchups on public boards are viewable"
  ON tournament_matchups FOR SELECT USING (
    tournament_id IN (
      SELECT t.id FROM tournaments t
      JOIN boards b ON b.id = t.board_id
      WHERE b.is_public = true
    )
  );

CREATE INDEX idx_matchups_tournament ON tournament_matchups(tournament_id, round);

-- =============================================================
-- STORAGE BUCKET for item images
-- =============================================================
-- Run this in Supabase Dashboard > Storage:
-- 1. Create bucket named "items" with public access
-- 2. Or run these policies after creating the bucket:

-- INSERT INTO storage.buckets (id, name, public) VALUES ('items', 'items', true);

-- CREATE POLICY "Users can upload their own items" ON storage.objects
--   FOR INSERT WITH CHECK (
--     bucket_id = 'items' AND
--     auth.uid()::text = (storage.foldername(name))[1]
--   );

-- CREATE POLICY "Users can update their own items" ON storage.objects
--   FOR UPDATE USING (
--     bucket_id = 'items' AND
--     auth.uid()::text = (storage.foldername(name))[1]
--   );

-- CREATE POLICY "Users can delete their own items" ON storage.objects
--   FOR DELETE USING (
--     bucket_id = 'items' AND
--     auth.uid()::text = (storage.foldername(name))[1]
--   );

-- CREATE POLICY "Items are publicly viewable" ON storage.objects
--   FOR SELECT USING (bucket_id = 'items');
