'use client';

import { useEffect, useState } from 'react';
import { usePickerStore } from '@/stores/usePickerStore';
import { OrderCard } from '@/components/picker/OrderCard';
import { OrderDetailModal } from '@/components/picker/OrderDetailModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Package, Clock, CheckCircle2, BarChart3, Home } from 'lucide-react';
import type { Order, OrderStatus } from '@/types/order';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PickerPage() {
  const { orders, loadOrders, selectOrder, selectedOrder } = usePickerStore();
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Load orders on mount
    loadOrders();

    // Auto-refresh every 5 seconds
    const interval = setInterval(() => {
      loadOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, [loadOrders]);

  const handleViewDetails = (order: Order) => {
    selectOrder(order);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    selectOrder(null);
  };

  // Group orders by status (Kanban columns)
  const paidOrders = orders.filter(o => o.status === 'PAID');
  const preparingOrders = orders.filter(o => o.status === 'PREPARING');
  const readyOrders = orders.filter(o => o.status === 'READY_FOR_PICKUP');

  const columns: Array<{
    title: string;
    status: OrderStatus;
    orders: Order[];
    color: string;
    icon: typeof Clock;
  }> = [
    {
      title: 'Nuevos',
      status: 'PAID',
      orders: paidOrders,
      color: 'bg-blue-500',
      icon: Clock,
    },
    {
      title: 'En Preparación',
      status: 'PREPARING',
      orders: preparingOrders,
      color: 'bg-yellow-500',
      icon: Package,
    },
    {
      title: 'Listos',
      status: 'READY_FOR_PICKUP',
      orders: readyOrders,
      color: 'bg-green-500',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Link href="/" className="hover:text-blue-600">Inicio</Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">Portal Picker</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Pedidos Activos</h1>
            <p className="text-sm text-gray-500 mt-1">
              {orders.length} pedido{orders.length !== 1 ? 's' : ''} en total
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => router.push('/')}
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Inicio
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/picker/historial')}
              className="gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Historial
            </Button>
            <Button 
              variant="outline" 
              onClick={() => loadOrders()}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {columns.map((col) => (
            <div key={col.status} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <col.icon className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{col.title}</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{col.orders.length}</p>
            </div>
          ))}
        </div>
      </header>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-6 h-full min-w-max">
          {columns.map((col) => (
            <div key={col.status} className="flex flex-col w-96 shrink-0">
              {/* Column Header */}
              <div className="flex items-center gap-2 mb-4">
                <Badge className={`${col.color} text-white`}>
                  {col.orders.length}
                </Badge>
                <h2 className="font-semibold text-lg">{col.title}</h2>
              </div>

              {/* Cards Container */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-2">
                {col.orders.length === 0 ? (
                  <div className="bg-gray-100 rounded-lg p-8 text-center">
                    <col.icon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No hay pedidos</p>
                  </div>
                ) : (
                  col.orders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onViewDetails={handleViewDetails}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        open={modalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
