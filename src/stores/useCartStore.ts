import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/lib/data';

export interface CartItem extends Product {
  quantity: number;
}

export function getItemPricing(item: CartItem) {
  const qty = item.quantity;

  if (item.originalPrice) {
    return {
      effectivePrice: item.price,
      originalPrice: item.originalPrice,
      savingPerItem: item.originalPrice - item.price,
      promoLabel: "Promo Especial"
    };
  }

  if (item.wholesalePrice && qty >= (item.wholesaleMinQuantity ?? 10)) {
    return {
      effectivePrice: item.wholesalePrice,
      originalPrice: item.price,
      savingPerItem: item.price - item.wholesalePrice,
      promoLabel: "Precio Mayorista"
    };
  }

  if (qty >= 10) {
    const saving = Math.round(item.price * 0.15);
    return {
      effectivePrice: item.price - saving,
      originalPrice: item.price,
      savingPerItem: saving,
      promoLabel: "15% OFF"
    };
  }

  if (qty >= 5) {
    const saving = Math.round(item.price * 0.10);
    return {
      effectivePrice: item.price - saving,
      originalPrice: item.price,
      savingPerItem: saving,
      promoLabel: "10% OFF"
    };
  }

  return {
    effectivePrice: item.price,
    originalPrice: item.price,
    savingPerItem: 0,
    promoLabel: null
  };
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  total: () => number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Cross-device sync via /api/sync/cart relay (in-memory Map on the server).
// The consumer's cart is pushed to the API on every mutation, so the picker
// can see it from any device on the same deployment without Supabase.
//
// TODO (Supabase): Replace syncCartToRelay with Supabase Realtime:
//   1. Upsert cart items to a `carts` table on every mutation
//   2. Picker subscribes: supabase.channel('carts').on('postgres_changes', ...)
//   3. Handles unlimited concurrent shoppers, persists across restarts,
//      and works correctly on serverless/edge deployments.
//   Ref: https://supabase.com/docs/guides/realtime/postgres-changes
// ─────────────────────────────────────────────────────────────────────────────

/** Stable session ID for this browser session (generated once, stored in localStorage). */
function getSessionId(): string {
  if (typeof window === 'undefined') return 'ssr';
  const key = 'picky-session-id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

function syncCartToRelay(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  const sessionId = getSessionId();
  // Fire-and-forget — no await, no error blocking the UI
  fetch('/api/sync/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId,
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        image: i.image,
        price: i.price,
        quantity: i.quantity,
        sku: i.sku,
        brand: i.brand,
      })),
    }),
  }).catch(() => {
    // Relay unavailable — falls back to localStorage-only mode silently
  });
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.id === product.id);
        let newItems: CartItem[];

        if (existingItem) {
          newItems = currentItems.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          newItems = [...currentItems, { ...product, quantity }];
        }

        set({ items: newItems, isOpen: true });
        syncCartToRelay(newItems);
      },

      removeItem: (productId) => {
        const newItems = get().items.filter(item => item.id !== productId);
        set({ items: newItems });
        syncCartToRelay(newItems);
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        const newItems = get().items.map(item =>
          item.id === productId ? { ...item, quantity } : item
        );
        set({ items: newItems });
        syncCartToRelay(newItems);
      },

      clearCart: () => {
        set({ items: [] });
        syncCartToRelay([]);
      },

      setIsOpen: (open) => set({ isOpen: open }),

      total: () => get().items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
    }),
    {
      name: 'picky-cart-storage',
    }
  )
);
