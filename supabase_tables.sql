-- ═══════════════════════════════════════════════════════
-- TABLES SUPABASE POUR ATTIÉKÉ EXPRESS
-- Exécutez ce script dans : Supabase → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════

-- 1. TABLE PROFILES (infos utilisateurs)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    email TEXT,
    default_address TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'client' CHECK (role IN ('client', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABLE ORDERS (commandes)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    client_email TEXT,
    client_phone TEXT,
    attieke_type TEXT NOT NULL DEFAULT 'simple',
    amount INTEGER NOT NULL DEFAULT 0,
    delivery_fee INTEGER NOT NULL DEFAULT 0,
    total INTEGER NOT NULL DEFAULT 0,
    country TEXT NOT NULL DEFAULT 'Côte d''Ivoire',
    city TEXT NOT NULL DEFAULT 'Bouaké',
    address TEXT,
    desired_date TEXT,
    comment TEXT,
    status TEXT NOT NULL DEFAULT 'en-attente' CHECK (status IN ('en-attente', 'validee', 'en-production', 'en-livraison', 'livree', 'annulee')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLE REVIEWS (avis clients - optionnel)
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS) - Sécurité des données
-- ═══════════════════════════════════════════════════════

-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- PROFILES : chaque utilisateur peut lire/modifier son propre profil
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ORDERS : les utilisateurs voient leurs propres commandes
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders"
    ON orders FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
CREATE POLICY "Users can insert own orders"
    ON orders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ORDERS : accès admin (lecture et mise à jour de TOUTES les commandes)
DROP POLICY IF EXISTS "Admin can view all orders" ON orders;
CREATE POLICY "Admin can view all orders"
    ON orders FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admin can update all orders" ON orders;
CREATE POLICY "Admin can update all orders"
    ON orders FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Pour l'admin local (login admin/admin), on permet aussi l'accès anonyme en lecture
DROP POLICY IF EXISTS "Allow anonymous read for admin panel" ON orders;
CREATE POLICY "Allow anonymous read for admin panel"
    ON orders FOR SELECT
    TO anon
    USING (true);

DROP POLICY IF EXISTS "Allow anonymous update for admin panel" ON orders;
CREATE POLICY "Allow anonymous update for admin panel"
    ON orders FOR UPDATE
    TO anon
    USING (true);

-- REVIEWS
DROP POLICY IF EXISTS "Users can view all reviews" ON reviews;
CREATE POLICY "Users can view all reviews"
    ON reviews FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can insert own reviews" ON reviews;
CREATE POLICY "Users can insert own reviews"
    ON reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════
-- INDEX pour les performances
-- ═══════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_order_id ON reviews(order_id);

-- ═══════════════════════════════════════════════════════
-- ACTIVER LE REALTIME sur la table orders
-- ═══════════════════════════════════════════════════════
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'orders'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE orders;
    END IF;
END $$;
