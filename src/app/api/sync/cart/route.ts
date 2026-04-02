/**
 * /api/sync/cart — In-memory cart relay for cross-device demo
 *
 * Stores the consumer's active cart in a server-side Map so the picker
 * can see it from any device on the same deployment (Vercel, localhost, etc.)
 * without needing Supabase.
 *
 * This is intentionally simple: one "active cart" per session ID, held in RAM.
 * Data is lost on server restart — perfectly fine for a demo.
 *
 * TODO (Supabase): Replace this entire route with Supabase Realtime:
 *   - Consumer: upsert cart to `carts` table on every cart change
 *   - Picker: supabase.channel('carts').on('postgres_changes', ...) subscription
 *   - Supports unlimited concurrent shoppers, persists across restarts,
 *     works across multiple Vercel instances (serverless edge).
 *   Ref: https://supabase.com/docs/guides/realtime/postgres-changes
 */

import { NextResponse } from "next/server";

// ─── In-memory store ──────────────────────────────────────────────────────────
// Global persists between requests in a single Node.js process.
// On Vercel, each serverless function instance has its own memory — this is
// acceptable for demo purposes (single-instance deployments or local dev).

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  sku: string;
  brand?: string;
}

interface CartSnapshot {
  sessionId: string;
  items: CartItem[];
  updatedAt: string;
}

// TTL: clear carts not updated in 30 minutes (prevents stale data in demo)
const CART_TTL_MS = 30 * 60 * 1000;

declare global {
  // eslint-disable-next-line no-var
  var __pickyCartRelay: Map<string, CartSnapshot> | undefined;
}

// Use globalThis to survive hot-reload in Next.js dev mode
const cartRelay: Map<string, CartSnapshot> =
  globalThis.__pickyCartRelay ?? (globalThis.__pickyCartRelay = new Map());

function pruneExpired() {
  const now = Date.now();
  for (const [key, snapshot] of cartRelay.entries()) {
    if (now - new Date(snapshot.updatedAt).getTime() > CART_TTL_MS) {
      cartRelay.delete(key);
    }
  }
}

// ─── GET /api/sync/cart ───────────────────────────────────────────────────────
// Returns all active (non-expired) cart snapshots.
// The picker polls this to show "Carritos en Vivo".

export async function GET() {
  pruneExpired();
  const snapshots = Array.from(cartRelay.values());
  return NextResponse.json(snapshots, {
    headers: { "Cache-Control": "no-store" },
  });
}

// ─── POST /api/sync/cart ──────────────────────────────────────────────────────
// Consumer pushes their current cart snapshot.
// Body: { sessionId: string, items: CartItem[] }

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, items } = body as { sessionId: string; items: CartItem[] };

    if (!sessionId || !Array.isArray(items)) {
      return NextResponse.json({ error: "sessionId and items are required" }, { status: 400 });
    }

    if (items.length === 0) {
      // Cart cleared — remove the session
      cartRelay.delete(sessionId);
    } else {
      cartRelay.set(sessionId, {
        sessionId,
        items,
        updatedAt: new Date().toISOString(),
      });
    }

    pruneExpired();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
