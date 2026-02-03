-- ============================================
-- PICKY CORRALÓN - CLEAN SETUP FOR SUPABASE
-- Execute this directly in Supabase SQL Editor
-- ============================================

-- 18:25:00 - CLEANUP (Start fresh to avoid column mismatch errors)
DROP TABLE IF EXISTS "OrderItem" CASCADE;
DROP TABLE IF EXISTS "Order" CASCADE;
DROP TABLE IF EXISTS "Product" CASCADE;
DROP TABLE IF EXISTS "Category" CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. CATEGORIES TABLE
-- ============================================
CREATE TABLE "Category" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "name" TEXT UNIQUE NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. PRODUCTS TABLE
-- ============================================
CREATE TABLE "Product" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "sku" TEXT UNIQUE NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "originalPrice" DOUBLE PRECISION,
    "wholesalePrice" DOUBLE PRECISION,
    "wholesaleMinQuantity" INTEGER DEFAULT 1,
    "image" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "categoryId" TEXT NOT NULL REFERENCES "Category"("id") ON DELETE CASCADE,
    "variants" JSONB,
    "specs" JSONB,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. ORDERS TABLE
-- ============================================
CREATE TABLE "Order" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "userId" UUID REFERENCES auth.users(id),
    "guestEmail" TEXT,
    "customerEmail" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "total" DOUBLE PRECISION NOT NULL,
    "pickupMethod" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. ORDER ITEMS TABLE
-- ============================================
CREATE TABLE "OrderItem" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "orderId" TEXT NOT NULL REFERENCES "Order"("id") ON DELETE CASCADE,
    "productId" TEXT NOT NULL REFERENCES "Product"("id"),
    "quantity" INTEGER NOT NULL,
    "priceAtPurchase" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. INDEXES for Performance
-- ============================================
CREATE INDEX idx_product_category ON "Product"("categoryId");
CREATE INDEX idx_order_user ON "Order"("userId");

-- ============================================
-- 6. SEED DATA
-- ============================================

-- Categories
INSERT INTO "Category" (id, name) VALUES 
('cat-1', 'Herramientas'),
('cat-2', 'Construcción'),
('cat-3', 'Pinturas'),
('cat-4', 'Grifería'),
('cat-5', 'Electricidad'),
('cat-6', 'Pisos y Revestimientos');

-- Products
INSERT INTO "Product" (id, sku, name, description, price, "originalPrice", image, stock, "categoryId", "wholesalePrice", "wholesaleMinQuantity", variants, specs) VALUES 
('p-1', 'PIN-LAT-01', 'Látex Interior Profesional 20L', 'Pintura al látex de alta calidad...', 45900, 52000, 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800', 42, 'cat-3', 38500, 10, '[{"label": "Tamaño", "type": "chip", "options": ["4L", "10L", "20L"]}]'::jsonb, '[{"label": "Rendimiento", "value": "12 m2 por litro"}]'::jsonb),
('p-2', 'HER-TAL-18V', 'Taladro DeWalt 20V', 'Taladro percutor Brushless...', 185000, NULL, 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=800', 15, 'cat-1', 165000, 3, NULL, NULL),
('p-3', 'CON-CEM-50KG', 'Cemento Loma Negra 50kg', 'Cemento uso general...', 9500, NULL, 'https://images.unsplash.com/photo-1518709779341-5d985063854b?auto=format&fit=crop&q=80&w=800', 500, 'cat-2', 8900, 50, NULL, NULL);

-- ============================================
-- 7. RLS POLICIES
-- ============================================

ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;

-- Public read for products
CREATE POLICY "Allow public read access to categories" ON "Category" FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read access to products" ON "Product" FOR SELECT TO public USING (true);

-- Order protection (Corrected mapping)
CREATE POLICY "Users can view their own orders" ON "Order" FOR SELECT TO authenticated USING (auth.uid() = "userId");
CREATE POLICY "Guests can view by email" ON "Order" FOR SELECT TO anon USING ("guestEmail" IS NOT NULL);
CREATE POLICY "Anyone can create orders" ON "Order" FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can create items" ON "OrderItem" FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Success message
DO $$ BEGIN RAISE NOTICE '✅ Picky Database Clean and Initialized!'; END $$;
