import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─────────────────────────────────────────────────────────────────────────────
// Cross-device sync via /api/sync/orders relay (in-memory Map on the server).
// Every mutation pushes the updated order to the relay so any device on the
// same deployment sees live state without Supabase.
//
// TODO (Supabase): Replace syncOrderToRelay / pollOrderRelay with:
//   - Writer: supabase.from('orders').upsert(order) on every mutation
//   - Reader: supabase.channel('orders').on('postgres_changes', ...) subscription
//   This eliminates polling and works across multiple Vercel instances.
// ─────────────────────────────────────────────────────────────────────────────

function syncOrderToRelay(order: PickyOrder) {
  if (typeof window === 'undefined') return;
  fetch('/api/sync/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  }).catch(() => { /* relay unavailable — localStorage-only fallback */ });
}

function syncDeleteAllToRelay() {
  if (typeof window === 'undefined') return;
  fetch('/api/sync/orders', { method: 'DELETE' })
    .catch(() => { /* silent */ });
}

// Order status lifecycle:
// PENDING → order created (payment processing)
// PAYING  → user at payment screen (cross-tab: picker can pre-stage)
// PICKING → picker took the order and is assembling
// READY   → all items collected, waiting for customer pickup
// DELIVERED → customer showed QR, order handed off
// CANCELLED → order cancelled (arrepentimiento / stock issue)
export type OrderStatus = 'PENDING' | 'PAYING' | 'PICKING' | 'READY' | 'DELIVERED' | 'CANCELLED';

export interface PickyOrderItem {
  productId: string;
  sku: string;
  name: string;
  brand?: string;
  image: string;
  zone?: string;       // Aisle/shelf location in store
  quantity: number;
  priceAtPurchase: number; // Price locked at time of purchase (promos may apply)
  picked: boolean;         // Picker has physically retrieved this item
}

export interface PickyOrder {
  id: string;
  status: OrderStatus;
  items: PickyOrderItem[];
  customerName: string;
  customerEmail: string;
  dni: string;
  pickupMethod: string;    // 'counter' | 'locker' | 'picky-car' | 'delivery'
  paymentMethod: string;   // 'mercadopago' | 'cash' | 'debit'
  subtotal: number;
  savings: number;         // Total savings applied (promos + cash discount)
  total: number;           // Final amount paid
  createdAt: string;       // ISO string
  updatedAt: string;       // ISO string
  pickerId?: string;       // Assigned picker identifier (future: link to User table)
  // TODO (Supabase): add storeId, branchId for multi-branch support
}

interface OrderStore {
  orders: PickyOrder[];
  currentOrderId: string | null; // The order ID of the last purchase (for /confirmation)
  createOrder: (data: Omit<PickyOrder, 'id' | 'createdAt' | 'updatedAt'>) => PickyOrder;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  assignPicker: (orderId: string, pickerId: string) => void;
  toggleItemPicked: (orderId: string, productId: string) => void;
  getOrderById: (orderId: string) => PickyOrder | undefined;
  setCurrentOrderId: (id: string | null) => void;
  seedDemoOrders: () => number; // Populate store with sample data; returns count added
  clearAllOrders: () => void;
}

function generateOrderId(): string {
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `PCK-${num}`;
}

// Sample products for demo orders (matches data.ts)
const DEMO_ITEMS_A: PickyOrderItem[] = [
  { productId: 'p-1', sku: 'PIN-LAT-01', name: 'Látex Interior Profesional 20L', brand: 'Alba', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800', zone: 'Pasillo 3 - Estante A', quantity: 2, priceAtPurchase: 45900, picked: false },
  { productId: 'p-2', sku: 'HER-TAL-18V', name: 'Taladro Percutor DeWalt 20V', brand: 'DeWalt', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=800', zone: 'Pasillo 1 - Estante A', quantity: 1, priceAtPurchase: 185000, picked: false },
  { productId: 'p-8', sku: 'ADH-CEG-25KG', name: 'Adhesivo Cementicio Klaukol 25kg', brand: 'Klaukol', image: 'https://images.unsplash.com/photo-1590664863685-a99ef05e9f61?auto=format&fit=crop&q=80&w=800', zone: 'Pasillo 10 - Estante A', quantity: 3, priceAtPurchase: 5400, picked: false },
];

const DEMO_ITEMS_B: PickyOrderItem[] = [
  { productId: 'p-3', sku: 'CON-CEM-50KG', name: 'Cemento Portland Loma Negra 50kg', brand: 'Loma Negra', image: 'https://images.unsplash.com/photo-1518709779341-5d985063854b?auto=format&fit=crop&q=80&w=800', zone: 'Pasillo 12 - Sección Granel', quantity: 10, priceAtPurchase: 9500, picked: true },
  { productId: 'p-7', sku: 'PIV-CER-60X60', name: 'Cerámico Exterior 60x60', brand: 'San Lorenzo', image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01b0?auto=format&fit=crop&q=80&w=800', zone: 'Pasillo 5 - Sección Pisos', quantity: 20, priceAtPurchase: 8900, picked: true },
  { productId: 'p-6', sku: 'ELE-CAB-25', name: 'Cable Unipolar 2.5mm 100m', brand: 'Prysmian', image: 'https://images.unsplash.com/photo-1558210834-473f430c09ac?auto=format&fit=crop&q=80&w=800', zone: 'Pasillo 9 - Estante A', quantity: 2, priceAtPurchase: 32000, picked: false },
];

const DEMO_ITEMS_C: PickyOrderItem[] = [
  { productId: 'p-4', sku: 'GRI-MON-COC', name: 'Grifería Monocomando Cocina FV', brand: 'FV', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800', zone: 'Pasillo 6 - Estante A', quantity: 1, priceAtPurchase: 89000, picked: false },
];

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      currentOrderId: null,

      createOrder: (data) => {
        const now = new Date().toISOString();
        const order: PickyOrder = {
          ...data,
          id: generateOrderId(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ orders: [...state.orders, order], currentOrderId: order.id }));
        syncOrderToRelay(order);
        return order;
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? { ...o, status, updatedAt: new Date().toISOString() }
              : o
          ),
        }));
        const updated = get().orders.find((o) => o.id === orderId);
        if (updated) syncOrderToRelay(updated);
      },

      assignPicker: (orderId, pickerId) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? { ...o, pickerId, status: 'PICKING', updatedAt: new Date().toISOString() }
              : o
          ),
        }));
        const updated = get().orders.find((o) => o.id === orderId);
        if (updated) syncOrderToRelay(updated);
      },

      toggleItemPicked: (orderId, productId) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  items: o.items.map((item) =>
                    item.productId === productId
                      ? { ...item, picked: !item.picked }
                      : item
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : o
          ),
        }));
        const updated = get().orders.find((o) => o.id === orderId);
        if (updated) syncOrderToRelay(updated);
      },

      getOrderById: (orderId) => {
        return get().orders.find((o) => o.id === orderId);
      },

      setCurrentOrderId: (id) => {
        set({ currentOrderId: id });
      },

      seedDemoOrders: () => {
        const now = new Date();
        const before = (minutes: number) =>
          new Date(now.getTime() - minutes * 60 * 1000).toISOString();

        const demoOrders: PickyOrder[] = [
          {
            id: generateOrderId(),
            status: 'PENDING',
            items: DEMO_ITEMS_A.map(i => ({ ...i, picked: false })),
            customerName: 'Juan Pérez',
            customerEmail: 'juan@example.com',
            dni: '35123456',
            pickupMethod: 'counter',
            paymentMethod: 'cash',
            subtotal: 298200,
            savings: 44730,
            total: 253470,
            createdAt: before(8),
            updatedAt: before(8),
          },
          {
            id: generateOrderId(),
            status: 'PENDING',
            items: DEMO_ITEMS_C.map(i => ({ ...i, picked: false })),
            customerName: 'María García',
            customerEmail: 'maria@example.com',
            dni: '29876543',
            pickupMethod: 'locker',
            paymentMethod: 'mercadopago',
            subtotal: 89000,
            savings: 0,
            total: 107690,
            createdAt: before(12),
            updatedAt: before(12),
          },
          {
            id: generateOrderId(),
            status: 'PICKING',
            items: DEMO_ITEMS_B.map(i => ({ ...i, picked: false })),
            customerName: 'Tiago Rex',
            customerEmail: 'tiago@example.com',
            dni: '41555123',
            pickupMethod: 'counter',
            paymentMethod: 'debit',
            subtotal: 391000,
            savings: 0,
            total: 473110,
            createdAt: before(5),
            updatedAt: before(2),
            pickerId: 'picker-204',
          },
        ];

        set((state) => ({ orders: [...state.orders, ...demoOrders] }));
        demoOrders.forEach(syncOrderToRelay);
        return demoOrders.length;
      },

      clearAllOrders: () => {
        set({ orders: [], currentOrderId: null });
        syncDeleteAllToRelay();
      },
    }),
    {
      name: 'picky-orders-storage',
    }
  )
);

// ─────────────────────────────────────────────────────────────────────────────
// Cross-device synchronization via /api/sync/orders relay.
// Polls every 3s and merges relay orders into the local store, so any device
// on the same deployment sees live state.
// Same-tab/same-browser: storage event still triggers an instant rehydrate.
//
// TODO (Supabase): Replace polling with supabase.channel('orders')
//   .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, ...)
//   This eliminates polling and works across all devices at any scale.
// ─────────────────────────────────────────────────────────────────────────────
if (typeof window !== 'undefined') {
  // Same-browser cross-tab sync (instant)
  window.addEventListener('storage', (e) => {
    if (e.key === 'picky-orders-storage') {
      useOrderStore.persist.rehydrate();
    }
  });

  // Cross-device polling via relay
  const syncFromRelay = async () => {
    try {
      const res = await fetch('/api/sync/orders', { cache: 'no-store' });
      if (!res.ok) return;
      const relayOrders: PickyOrder[] = await res.json();
      if (relayOrders.length === 0) return;

      useOrderStore.setState((state) => {
        const localById = new Map(state.orders.map((o) => [o.id, o]));

        for (const relayOrder of relayOrders) {
          const local = localById.get(relayOrder.id);
          // Keep whichever version was updated more recently
          if (!local || new Date(relayOrder.updatedAt) > new Date(local.updatedAt)) {
            localById.set(relayOrder.id, relayOrder);
          }
        }

        return { orders: Array.from(localById.values()) };
      });
    } catch {
      // Relay unavailable — localStorage-only mode, no action needed
    }
  };

  // Initial fetch on load + poll every 3s
  syncFromRelay();
  setInterval(syncFromRelay, 3000);
}
