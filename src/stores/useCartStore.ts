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

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (product, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.id === product.id);

        if (existingItem) {
          set({
            items: currentItems.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
            isOpen: true,
          });
        } else {
          set({
            items: [...currentItems, { ...product, quantity }],
            isOpen: true,
          });
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter(item => item.id !== productId),
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
            get().removeItem(productId);
            return;
        }
        set({
          items: get().items.map(item =>
            item.id === productId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),
      
      setIsOpen: (open) => set({ isOpen: open }),

      total: () => get().items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
    }),
    {
      name: 'picky-cart-storage',
    }
  )
);
