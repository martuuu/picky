-- ============================================
-- PICKY CORRALÓN — SUPABASE SCHEMA v2
-- Updated to match prisma/schema.prisma + useOrderStore types
-- Execute in Supabase SQL Editor (drops existing tables first)
-- ============================================

-- Cleanup (start fresh to avoid column mismatch errors)
DROP TABLE IF EXISTS "OrderItem"  CASCADE;
DROP TABLE IF EXISTS "Order"      CASCADE;
DROP TABLE IF EXISTS "Product"    CASCADE;
DROP TABLE IF EXISTS "Category"   CASCADE;

DROP TYPE IF EXISTS "OrderStatus"   CASCADE;
DROP TYPE IF EXISTS "PickupMethod"  CASCADE;
DROP TYPE IF EXISTS "PaymentMethod" CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE "OrderStatus" AS ENUM (
  'PENDING',    -- created, payment processing
  'PAYING',     -- user at payment screen
  'PICKING',    -- picker assigned and assembling
  'READY',      -- all items collected, waiting customer
  'DELIVERED',  -- customer showed QR, order handed off
  'CANCELLED'   -- cancelled (customer or stock issue)
);

CREATE TYPE "PickupMethod" AS ENUM (
  'counter',    -- Mostrador
  'locker',     -- Locker automático
  'picky-car',  -- Picky Car (kerbside)
  'delivery'    -- Envío a domicilio
);

CREATE TYPE "PaymentMethod" AS ENUM (
  'mercadopago',
  'cash',
  'debit'
);

-- ============================================
-- 1. CATEGORIES
-- ============================================
CREATE TABLE "Category" (
  "id"        TEXT        PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "name"      TEXT        UNIQUE NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 2. PRODUCTS
-- ============================================
CREATE TABLE "Product" (
  "id"                   TEXT           PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "sku"                  TEXT           UNIQUE NOT NULL,
  "name"                 TEXT           NOT NULL,
  "description"          TEXT           NOT NULL DEFAULT '',
  "brand"                TEXT,
  "zone"                 TEXT,           -- Store location: "Pasillo 4 - Estante 2"
  "price"                DOUBLE PRECISION NOT NULL,
  "originalPrice"        DOUBLE PRECISION,
  "wholesalePrice"       DOUBLE PRECISION,
  "wholesaleMinQuantity" INTEGER        DEFAULT 1,
  "image"                TEXT           NOT NULL DEFAULT '',
  "images"               TEXT[]         DEFAULT '{}',
  "stock"                INTEGER        NOT NULL DEFAULT 0,
  "categoryId"           TEXT           NOT NULL REFERENCES "Category"("id") ON DELETE CASCADE,
  "tiendaNubeId"         INTEGER        UNIQUE,   -- external ID for sync
  "variants"             JSONB,
  "specs"                JSONB,
  "reviews"              JSONB,
  "createdAt"            TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  "updatedAt"            TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- ============================================
-- 3. ORDERS
-- ============================================
CREATE TABLE "Order" (
  "id"            TEXT            PRIMARY KEY,  -- PCK-NNNN format from client
  "userId"        UUID            REFERENCES auth.users(id),
  "customerName"  TEXT            NOT NULL,
  "customerEmail" TEXT            NOT NULL,
  "dni"           TEXT            NOT NULL,
  "status"        "OrderStatus"   NOT NULL DEFAULT 'PENDING',
  "pickupMethod"  "PickupMethod"  NOT NULL DEFAULT 'counter',
  "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'mercadopago',
  "subtotal"      DOUBLE PRECISION NOT NULL DEFAULT 0,
  "savings"       DOUBLE PRECISION NOT NULL DEFAULT 0,
  "total"         DOUBLE PRECISION NOT NULL,
  "pickerId"      TEXT,           -- Future: reference to staff Users table
  "createdAt"     TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  "updatedAt"     TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ============================================
-- 4. ORDER ITEMS
-- ============================================
CREATE TABLE "OrderItem" (
  "id"              TEXT             PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "orderId"         TEXT             NOT NULL REFERENCES "Order"("id") ON DELETE CASCADE,
  "productId"       TEXT             NOT NULL REFERENCES "Product"("id"),
  "sku"             TEXT             NOT NULL,  -- denormalized for history
  "name"            TEXT             NOT NULL,  -- denormalized (product may change)
  "brand"           TEXT,
  "image"           TEXT             NOT NULL DEFAULT '',
  "zone"            TEXT,
  "quantity"        INTEGER          NOT NULL,
  "priceAtPurchase" DOUBLE PRECISION NOT NULL,  -- price locked at time of purchase
  "picked"          BOOLEAN          NOT NULL DEFAULT false,
  "createdAt"       TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

-- ============================================
-- 5. INDEXES
-- ============================================
CREATE INDEX idx_product_category   ON "Product"("categoryId");
CREATE INDEX idx_product_tiendanube ON "Product"("tiendaNubeId");
CREATE INDEX idx_order_user         ON "Order"("userId");
CREATE INDEX idx_order_status       ON "Order"("status");
CREATE INDEX idx_order_picker       ON "Order"("pickerId");
CREATE INDEX idx_orderitem_order    ON "OrderItem"("orderId");

-- ============================================
-- 6. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE "Category"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;

-- Public catalogue read
CREATE POLICY "Public: read categories" ON "Category"
  FOR SELECT TO public USING (true);

CREATE POLICY "Public: read products" ON "Product"
  FOR SELECT TO public USING (true);

-- Orders: customers see their own; pickers (authenticated) see all
CREATE POLICY "Customers: view own orders" ON "Order"
  FOR SELECT TO authenticated
  USING (auth.uid() = "userId");

CREATE POLICY "Staff: view all orders" ON "Order"
  FOR SELECT TO authenticated
  USING (
    -- TODO: replace with a proper `staff_role` check once auth roles are set up
    auth.jwt() ->> 'role' IN ('picker', 'admin')
  );

CREATE POLICY "Anyone: create orders" ON "Order"
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Staff: update order status" ON "Order"
  FOR UPDATE TO authenticated
  USING (auth.jwt() ->> 'role' IN ('picker', 'admin'));

CREATE POLICY "Anyone: read order items" ON "OrderItem"
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Anyone: create order items" ON "OrderItem"
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Staff: update order items" ON "OrderItem"
  FOR UPDATE TO authenticated
  USING (auth.jwt() ->> 'role' IN ('picker', 'admin'));

-- ============================================
-- 7. REALTIME (enable for cross-tab/device sync)
-- ============================================
-- Run these in the Supabase dashboard → Table Editor → Replication:
--   ALTER PUBLICATION supabase_realtime ADD TABLE "Order";
--   ALTER PUBLICATION supabase_realtime ADD TABLE "OrderItem";
--
-- Then subscribe in the app:
--   supabase.channel('orders').on('postgres_changes', { event: '*', schema: 'public', table: 'Order' }, handler).subscribe();

-- ============================================
-- 8. SEED DATA
-- ============================================

INSERT INTO "Category" (id, name) VALUES
  ('cat-1', 'Herramientas'),
  ('cat-2', 'Construcción'),
  ('cat-3', 'Pinturas'),
  ('cat-4', 'Grifería'),
  ('cat-5', 'Electricidad'),
  ('cat-6', 'Pisos y Revestimientos'),
  ('cat-7', 'Adhesivos y Mezclas'),
  ('cat-8', 'Seguridad');

INSERT INTO "Product" (id, sku, name, description, brand, zone, price, "originalPrice", image, stock, "categoryId", "wholesalePrice", "wholesaleMinQuantity", variants, specs) VALUES
  ('p-1', 'PIN-LAT-01',   'Látex Interior Profesional 20L', 'Pintura al látex de alta cobertura para interiores.',    'Alba',       'Pasillo 3 - Estante A', 45900, 52000,  'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800', 42,  'cat-3', 38500, 10, '[{"label":"Tamaño","type":"chip","options":["4L","10L","20L"]}]'::jsonb, '[{"label":"Rendimiento","value":"12 m2 por litro"}]'::jsonb),
  ('p-2', 'HER-TAL-18V',  'Taladro Percutor DeWalt 20V',   'Taladro Brushless con batería y maletín incluidos.',      'DeWalt',     'Pasillo 1 - Estante A', 185000, NULL,  'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=800', 15,  'cat-1', 165000, 3, NULL, NULL),
  ('p-3', 'CON-CEM-50KG', 'Cemento Portland Loma Negra 50kg', 'Cemento de uso general, alta resistencia.',            'Loma Negra', 'Pasillo 12 - Sección Granel', 9500, NULL, 'https://images.unsplash.com/photo-1518709779341-5d985063854b?auto=format&fit=crop&q=80&w=800', 500, 'cat-2', 8900, 50, NULL, NULL),
  ('p-4', 'GRI-MON-COC',  'Grifería Monocomando Cocina FV','Monocomando de cocina con filtro incluido.',              'FV',         'Pasillo 6 - Estante A', 89000, NULL,  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800', 18,  'cat-4', NULL, 1, NULL, NULL),
  ('p-6', 'ELE-CAB-25',   'Cable Unipolar 2.5mm 100m',     'Rollo de cable unipolar IRAM certificado.',               'Prysmian',   'Pasillo 9 - Estante A', 32000, NULL,  'https://images.unsplash.com/photo-1558210834-473f430c09ac?auto=format&fit=crop&q=80&w=800', 60,  'cat-5', 28000, 5, NULL, NULL),
  ('p-7', 'PIV-CER-60X60','Cerámico Exterior 60x60',        'Porcellanato rectificado para exteriores, antideslizante.','San Lorenzo','Pasillo 5 - Sección Pisos', 8900, NULL,'https://images.unsplash.com/photo-1615971677499-5467cbab01b0?auto=format&fit=crop&q=80&w=800', 320, 'cat-6', 7500, 20, NULL, NULL),
  ('p-8', 'ADH-CEG-25KG', 'Adhesivo Cementicio Klaukol 25kg','Adhesivo para cerámica y porcellanato, interior/exterior.','Klaukol',  'Pasillo 10 - Estante A', 5400, NULL,  'https://images.unsplash.com/photo-1590664863685-a99ef05e9f61?auto=format&fit=crop&q=80&w=800', 200, 'cat-7', 4800, 20, NULL, NULL);

-- Success
DO $$ BEGIN RAISE NOTICE '✅ Picky v2 Database Initialized!'; END $$;
