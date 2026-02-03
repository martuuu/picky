## 🚀 Picky Corralón - Setup Instructions

### Prerequisites
- Node.js 18+
- Supabase Account

### 1. Database Setup (Supabase SQL Editor)

1. Go to your Supabase project Dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the contents of `docs/supabase-schema.sql`
5. Click **Run** to execute

This will:
- Create all tables (Category, Product, Order, OrderItem)
- Set up Row Level Security (RLS) policies
- Seed 7 products across 6 categories
- Create indexes for performance

### 2. Environment Variables

Update your `.env` file with your Supabase credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Prisma Database Connections
DATABASE_URL="postgresql://postgres.your-project:YOUR_PASSWORD@aws-1-sa-east-1.pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@db.your-project.supabase.co:5432/postgres"
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Optional: Create Test Users

In Supabase Dashboard > Authentication > Users, create test accounts:

**Test Customer:**
- Email: `test@picky.com.ar`
- Password: `Picky2025!`

**Admin:**
- Email: `admin@picky.com.ar`
- Password: `Admin2025!`

**Picker:**
- Email: `picker@picky.com.ar`
- Password: `Picker2025!`

### 6. Guest Checkout

Users can also complete purchases without creating an account by selecting "Continuar como Invitado" during checkout.

## 📂 Key Files

- `/docs/supabase-schema.sql` - Complete database schema
- `/src/lib/supabase.ts` - Supabase client & auth helpers
- `/src/lib/mockData.json` - Mock data for analytics, orders, etc.
- `/src/lib/data.ts` - Product catalog (can be replaced with Supabase queries)

## 🔐 Authentication Flow

1. **Registered Users:** Full account with order history
2. **Guest Checkout:** Orders tied to email, no account required
3. **Staff Access:** Admin and Picker roles for internal operations

## 📊 Features

- **Scan & Go:** QR/Barcode scanning for instant catalog access
- **Smart Cart:** Real-time cart with custom alerts
- **Checkout:** Multi-step with guest option
- **Order Tracking:** Live status updates
- **Picker Dashboard:** Order management and picking interface
- **Admin Analytics:** Sales metrics and performance tracking

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **Auth:** Supabase Auth
- **State:** Zustand
- **Animations:** Framer Motion
- **Icons:** Lucide React

## 🚨 Troubleshooting

**Prisma Push Hangs:**
- Always use the SQL Editor for schema changes in Supabase
- The pooler connection can cause timeouts with `db push`

**RLS Errors:**
- Make sure you're signed in when testing authenticated features
- Guest checkout uses the `anon` key which has limited permissions

**Connection Issues:**
- Double-check your `.env` variables
- Ensure your Supabase project is active
- Verify your IP isn't blocked in Supabase settings
