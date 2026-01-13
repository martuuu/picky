import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order, OrderStatus } from '@/types/order';

interface PickerStore {
  orders: Order[];
  selectedOrder: Order | null;
  filterStatus: OrderStatus | 'ALL';
  
  // Actions
  loadOrders: () => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, notes?: string) => void;
  toggleItemPicked: (orderId: string, itemId: string) => void;
  selectOrder: (order: Order | null) => void;
  setFilterStatus: (status: OrderStatus | 'ALL') => void;
  assignPicker: (orderId: string, pickerName: string) => void;
  getOrdersByStatus: (status: OrderStatus) => Order[];
}

export const usePickerStore = create<PickerStore>()(
  persist(
    (set, get) => ({
      orders: [],
      selectedOrder: null,
      filterStatus: 'ALL',

      loadOrders: () => {
        // Load from localStorage (simula backend)
        const orders = JSON.parse(localStorage.getItem('picky_orders') || '[]');
        set({ orders });
      },

      updateOrderStatus: (orderId: string, newStatus: OrderStatus, notes?: string) => {
        const orders = get().orders.map(order => {
          if (order.id === orderId) {
            const updatedOrder = {
              ...order,
              status: newStatus,
              statusHistory: [
                ...order.statusHistory,
                {
                  from: order.status,
                  to: newStatus,
                  timestamp: new Date(),
                  notes,
                },
              ],
              updatedAt: new Date(),
              ...(newStatus === 'COMPLETED' && { completedAt: new Date() }),
            };
            
            // Update localStorage
            const allOrders = JSON.parse(localStorage.getItem('picky_orders') || '[]');
            const index = allOrders.findIndex((o: Order) => o.id === orderId);
            if (index !== -1) {
              allOrders[index] = updatedOrder;
              localStorage.setItem('picky_orders', JSON.stringify(allOrders));
            }
            
            return updatedOrder;
          }
          return order;
        });
        
        set({ orders });
        
        // Update selected order if it's the one being modified
        const selected = get().selectedOrder;
        if (selected && selected.id === orderId) {
          const updated = orders.find(o => o.id === orderId);
          set({ selectedOrder: updated || null });
        }
      },

      toggleItemPicked: (orderId: string, itemId: string) => {
        const orders = get().orders.map(order => {
          if (order.id === orderId) {
            const updatedOrder = {
              ...order,
              items: order.items.map(item => {
                if (item.id === itemId) {
                  return {
                    ...item,
                    isPicked: !item.isPicked,
                    pickedAt: !item.isPicked ? new Date() : undefined,
                  };
                }
                return item;
              }),
              updatedAt: new Date(),
            };
            
            // Update localStorage
            const allOrders = JSON.parse(localStorage.getItem('picky_orders') || '[]');
            const index = allOrders.findIndex((o: Order) => o.id === orderId);
            if (index !== -1) {
              allOrders[index] = updatedOrder;
              localStorage.setItem('picky_orders', JSON.stringify(allOrders));
            }
            
            return updatedOrder;
          }
          return order;
        });
        
        set({ orders });
        
        // Update selected order if it's the one being modified
        const selected = get().selectedOrder;
        if (selected && selected.id === orderId) {
          const updated = orders.find(o => o.id === orderId);
          set({ selectedOrder: updated || null });
        }
      },

      selectOrder: (order: Order | null) => {
        set({ selectedOrder: order });
      },

      setFilterStatus: (status: OrderStatus | 'ALL') => {
        set({ filterStatus: status });
      },

      assignPicker: (orderId: string, pickerName: string) => {
        const orders = get().orders.map(order => {
          if (order.id === orderId) {
            const updatedOrder = {
              ...order,
              pickerAssignedTo: pickerName,
              pickerStartedAt: new Date(),
              updatedAt: new Date(),
            };
            
            // Update localStorage
            const allOrders = JSON.parse(localStorage.getItem('picky_orders') || '[]');
            const index = allOrders.findIndex((o: Order) => o.id === orderId);
            if (index !== -1) {
              allOrders[index] = updatedOrder;
              localStorage.setItem('picky_orders', JSON.stringify(allOrders));
            }
            
            return updatedOrder;
          }
          return order;
        });
        
        set({ orders });
      },

      getOrdersByStatus: (status: OrderStatus) => {
        return get().orders.filter(order => order.status === status);
      },
    }),
    {
      name: 'picky-picker-storage',
    }
  )
);
