import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, CartItem } from '@/types/cart';
import { Product } from '@/types/product';

interface CartStore {
  cart: Cart | null;
  
  // Actions
  initCart: (storeId: string, sessionId: string) => void;
  addItem: (product: Product, quantity: number, observations?: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,

      initCart: (storeId: string, sessionId: string) => {
        const existingCart = get().cart;
        
        if (!existingCart || existingCart.storeId !== storeId) {
          set({
            cart: {
              id: `cart-${Date.now()}`,
              storeId,
              sessionId,
              items: [],
              subtotal: 0,
              totalDiscount: 0,
              total: 0,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
        }
      },

      addItem: (product: Product, quantity: number, observations?: string) => {
        const cart = get().cart;
        if (!cart) return;

        const existingItemIndex = cart.items.findIndex(
          (item) => item.productId === product.id
        );

        let updatedItems: CartItem[];

        if (existingItemIndex >= 0) {
          // Update existing item
          updatedItems = cart.items.map((item, index) =>
            index === existingItemIndex
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                  observations: observations || item.observations,
                  totalPrice: (item.quantity + quantity) * item.unitPrice,
                }
              : item
          );
        } else {
          // Add new item
          const newItem: CartItem = {
            id: `item-${Date.now()}-${Math.random()}`,
            productId: product.id,
            product,
            quantity,
            observations,
            addedAt: new Date(),
            unitPrice: product.price,
            totalPrice: product.price * quantity,
          };
          updatedItems = [...cart.items, newItem];
        }

        // Calculate totals
        const subtotal = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
        const totalDiscount = 0; // TODO: Calculate discounts
        const total = subtotal - totalDiscount;

        set({
          cart: {
            ...cart,
            items: updatedItems,
            subtotal,
            totalDiscount,
            total,
            updatedAt: new Date(),
          },
        });
      },

      updateItemQuantity: (itemId: string, quantity: number) => {
        const cart = get().cart;
        if (!cart) return;

        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        const updatedItems = cart.items.map((item) =>
          item.id === itemId
            ? {
                ...item,
                quantity,
                totalPrice: quantity * item.unitPrice,
              }
            : item
        );

        const subtotal = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
        const totalDiscount = 0;
        const total = subtotal - totalDiscount;

        set({
          cart: {
            ...cart,
            items: updatedItems,
            subtotal,
            totalDiscount,
            total,
            updatedAt: new Date(),
          },
        });
      },

      removeItem: (itemId: string) => {
        const cart = get().cart;
        if (!cart) return;

        const updatedItems = cart.items.filter((item) => item.id !== itemId);

        const subtotal = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
        const totalDiscount = 0;
        const total = subtotal - totalDiscount;

        set({
          cart: {
            ...cart,
            items: updatedItems,
            subtotal,
            totalDiscount,
            total,
            updatedAt: new Date(),
          },
        });
      },

      clearCart: () => {
        const cart = get().cart;
        if (!cart) return;

        set({
          cart: {
            ...cart,
            items: [],
            subtotal: 0,
            totalDiscount: 0,
            total: 0,
            updatedAt: new Date(),
          },
        });
      },

      getItemQuantity: (productId: string) => {
        const cart = get().cart;
        if (!cart) return 0;

        const item = cart.items.find((item) => item.productId === productId);
        return item?.quantity || 0;
      },
    }),
    {
      name: 'picky-cart-storage',
    }
  )
);
