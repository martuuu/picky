/**
 * /api/sync/orders — In-memory orders relay for cross-device demo
 *
 * Mirrors the full orders array in server RAM so any device on the same
 * deployment (Vercel, localhost) sees the same state without Supabase.
 *
 * Data is lost on server restart — acceptable for demo purposes.
 *
 * TODO (Supabase): Replace this entire route with Supabase Realtime:
 *   - Writer: upsert each order to the `orders` table on every mutation
 *   - Reader: supabase.channel('orders').on('postgres_changes', ...) subscription
 *   - Supports multiple devices, persists across restarts, scales to production.
 *   Ref: https://supabase.com/docs/guides/realtime/postgres-changes
 */

import { NextResponse } from "next/server";
import type { PickyOrder } from "@/stores/useOrderStore";

// TTL: drop orders not touched in 2 hours
const ORDER_TTL_MS = 2 * 60 * 60 * 1000;

declare global {
  // eslint-disable-next-line no-var
  var __pickyOrderRelay: Map<string, PickyOrder> | undefined;
}

const orderRelay: Map<string, PickyOrder> =
  globalThis.__pickyOrderRelay ?? (globalThis.__pickyOrderRelay = new Map());

function pruneExpired() {
  const now = Date.now();
  for (const [id, order] of orderRelay.entries()) {
    if (now - new Date(order.updatedAt).getTime() > ORDER_TTL_MS) {
      orderRelay.delete(id);
    }
  }
}

// ─── GET /api/sync/orders ─────────────────────────────────────────────────────
// Returns all active orders. Polled by picker and consumer.

export async function GET() {
  pruneExpired();
  const orders = Array.from(orderRelay.values());
  return NextResponse.json(orders, {
    headers: { "Cache-Control": "no-store" },
  });
}

// ─── POST /api/sync/orders ────────────────────────────────────────────────────
// Upserts a single order (create or update).
// Body: PickyOrder

export async function POST(request: Request) {
  try {
    const order = (await request.json()) as PickyOrder;
    if (!order?.id) {
      return NextResponse.json({ error: "order.id is required" }, { status: 400 });
    }
    orderRelay.set(order.id, order);
    pruneExpired();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

// ─── DELETE /api/sync/orders ──────────────────────────────────────────────────
// Removes all orders (used by clearAllOrders).

export async function DELETE() {
  orderRelay.clear();
  return NextResponse.json({ ok: true });
}
