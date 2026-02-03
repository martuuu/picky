-- Comprehensive SQL Schema for Picky Corralón (PostgreSQL/Supabase compatible)

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS "Category" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT UNIQUE NOT NULL
);

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS "Product" (
    "id" TEXT PRIMARY KEY,
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
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Orders Table (Prototype Reference)
CREATE TABLE IF NOT EXISTS "Order" (
    "id" TEXT PRIMARY KEY,
    "customerEmail" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, PREPARING, READY, DELIVERED
    "total" DOUBLE PRECISION NOT NULL,
    "pickupMethod" TEXT NOT NULL, -- COUNTER, LOCKER
    "paymentMethod" TEXT NOT NULL, -- MERCADOPAGO, CASH
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Order Items Table
CREATE TABLE IF NOT EXISTS "OrderItem" (
    "id" TEXT PRIMARY KEY,
    "orderId" TEXT NOT NULL REFERENCES "Order"("id") ON DELETE CASCADE,
    "productId" TEXT NOT NULL REFERENCES "Product"("id"),
    "quantity" INTEGER NOT NULL,
    "priceAtPurchase" DOUBLE PRECISION NOT NULL
);
