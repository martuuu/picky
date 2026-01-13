'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle2, 
  Clock, 
  Package, 
  Coffee,
  Sparkles,
  MapPin,
  Phone,
  QrCode,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { formatDate } from 'date-fns';
import Image from 'next/image';
import type { Order, OrderStatus } from '@/types/order';

const STATUS_CONFIG = {
  PAID: {
    label: 'Pago confirmado',
    color: 'bg-blue-500',
    icon: CheckCircle2,
    description: 'Estamos recibiendo tu pedido',
  },
  PREPARING: {
    label: 'En preparación',
    color: 'bg-yellow-500',
    icon: Package,
    description: 'Nuestro equipo está preparando tu pedido',
  },
  READY_FOR_PICKUP: {
    label: 'Listo para retirar',
    color: 'bg-green-500',
    icon: CheckCircle2,
    description: '¡Tu pedido está listo! Pasá a retirarlo',
  },
  COMPLETED: {
    label: 'Completado',
    color: 'bg-gray-500',
    icon: CheckCircle2,
    description: 'Pedido entregado exitosamente',
  },
  CANCELLED: {
    label: 'Cancelado',
    color: 'bg-red-500',
    icon: CheckCircle2,
    description: 'El pedido fue cancelado',
  },
  PENDING_PAYMENT: {
    label: 'Pendiente de pago',
    color: 'bg-gray-400',
    icon: Clock,
    description: 'Esperando confirmación de pago',
  },
};

export default function PedidoPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Load order from localStorage
    const loadOrder = () => {
      const orders = JSON.parse(localStorage.getItem('picky_orders') || '[]');
      const foundOrder = orders.find((o: Order) => o.id === orderId);
      
      if (foundOrder) {
        setOrder(foundOrder);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  // Simulate order status progression
  useEffect(() => {
    if (!order || order.status === 'READY_FOR_PICKUP' || order.status === 'COMPLETED') return;

    const interval = setInterval(() => {
      const orders = JSON.parse(localStorage.getItem('picky_orders') || '[]');
      const orderIndex = orders.findIndex((o: Order) => o.id === orderId);
      
      if (orderIndex === -1) return;

      const currentOrder = orders[orderIndex];

      // Auto-transition: PAID → PREPARING after 3 seconds
      if (currentOrder.status === 'PAID') {
        currentOrder.status = 'PREPARING';
        currentOrder.statusHistory.push({
          from: 'PAID' as OrderStatus,
          to: 'PREPARING' as OrderStatus,
          timestamp: new Date(),
          notes: 'Pedido en preparación',
        });
        currentOrder.updatedAt = new Date();
        orders[orderIndex] = currentOrder;
        localStorage.setItem('picky_orders', JSON.stringify(orders));
        setOrder(currentOrder);
      }

      // Auto-transition: PREPARING → READY_FOR_PICKUP after estimated time
      if (currentOrder.status === 'PREPARING') {
        const prepStartTime = currentOrder.statusHistory.find(
          (h: { to: string }) => h.to === 'PREPARING'
        )?.timestamp;
        
        if (prepStartTime) {
          const elapsedMinutes = (new Date().getTime() - new Date(prepStartTime).getTime()) / 60000;
          
          // For demo: 40 seconds instead of real minutes (más tiempo para mostrar ofertas)
          if (elapsedMinutes > 0.66) {
            currentOrder.status = 'READY_FOR_PICKUP';
            currentOrder.statusHistory.push({
              from: 'PREPARING' as OrderStatus,
              to: 'READY_FOR_PICKUP' as OrderStatus,
              timestamp: new Date(),
              notes: 'Pedido listo para retirar',
            });
            currentOrder.updatedAt = new Date();
            orders[orderIndex] = currentOrder;
            localStorage.setItem('picky_orders', JSON.stringify(orders));
            setOrder(currentOrder);

            // Vibrate on ready
            if ('vibrate' in navigator) {
              navigator.vibrate([200, 100, 200, 100, 200]);
            }
          }
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [order, orderId]);

  // Progress bar animation
  useEffect(() => {
    if (!order) return;

    const targetProgress = 
      order.status === 'PAID' ? 33 :
      order.status === 'PREPARING' ? 66 :
      order.status === 'READY_FOR_PICKUP' ? 100 :
      order.status === 'COMPLETED' ? 100 : 0;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < targetProgress) {
          return Math.min(prev + 2, targetProgress);
        }
        return prev;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [order]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center space-y-4">
          <Package className="w-16 h-16 text-gray-400 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-900">Pedido no encontrado</h2>
          <p className="text-gray-600">No pudimos encontrar este pedido</p>
          <Button onClick={() => router.push(`/tienda/${storeId}/catalogo`)}>
            Volver al catálogo
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[order.status];
  const StatusIcon = statusConfig.icon;
  const isReady = order.status === 'READY_FOR_PICKUP';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">Pedido {order.orderNumber}</h1>
              <p className="text-sm text-gray-500">
                {formatDate(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
              </p>
            </div>
            <Badge className={`${statusConfig.color} text-white`}>
              {statusConfig.label}
            </Badge>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 space-y-4">
        {/* Status Card */}
        <Card className={isReady ? 'border-2 border-green-500 bg-green-50' : ''}>
          <CardContent className="p-6 text-center space-y-4">
            <div className={`w-16 h-16 rounded-full ${statusConfig.color} mx-auto flex items-center justify-center`}>
              <StatusIcon className="w-8 h-8 text-white" />
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-900">{statusConfig.label}</h2>
              <p className="text-gray-600 mt-1">{statusConfig.description}</p>
            </div>

            {order.status === 'PREPARING' && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-gray-500">
                  Tiempo estimado: {order.estimatedPrepTime} minutos
                </p>
              </div>
            )}

            {isReady && (
              <div className="pt-2">
                <Button 
                  size="lg" 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => router.push(`/tienda/${storeId}/confirmacion?orderId=${order.id}`)}
                >
                  <QrCode className="w-5 h-5 mr-2" />
                  Ver QR de retiro
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Waiting Suggestion */}
        {order.status === 'PREPARING' && (
          <>
            {/* Coffee & Bar Offers */}
            <Card className="bg-linear-to-r from-amber-50 to-orange-50 border-amber-200">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0">
                    <Coffee className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">¿Querés un café mientras esperás?</p>
                    <p className="text-sm text-gray-600">Aprovechá estas ofertas del Bar - 40% OFF</p>
                  </div>
                </div>

                {/* Bar Offers */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3 border border-amber-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Coffee className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-semibold text-amber-700">40% OFF</span>
                    </div>
                    <p className="font-semibold text-sm text-gray-900">Café + Medialunas</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 line-through">$2.500</span>
                      <span className="text-base font-bold text-green-600">$1.500</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-amber-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Coffee className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-semibold text-amber-700">40% OFF</span>
                    </div>
                    <p className="font-semibold text-sm text-gray-900">Capuccino + Brownie</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 line-through">$3.200</span>
                      <span className="text-base font-bold text-green-600">$1.920</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-center text-gray-600">
                  Mostrá este pedido en el bar para aplicar el descuento
                </p>
              </CardContent>
            </Card>

            {/* Kids Playground Suggestion */}
            <Card className="bg-linear-to-r from-blue-50 to-cyan-50 border-blue-200">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">¿Venís con niños?</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Visitá nuestro <span className="font-semibold text-blue-700">Patio de Recreación</span> con juegos y área segura
                  </p>
                  <p className="text-xs text-blue-600 mt-2">📍 Planta baja - Sector izquierdo</p>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Store Info */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-gray-900">Información de la tienda</h3>
            
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">{order.storeName}</p>
                <p className="text-sm text-gray-600">Av. Corrientes 1234, CABA</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-500 shrink-0" />
              <p className="text-sm text-gray-600">+54 11 4567-8900</p>
            </div>

            <Separator className="my-2" />

            <p className="text-xs text-gray-500">
              Presentá tu QR en el punto de retiro cuando tu pedido esté listo
            </p>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Detalle del pedido</h3>
              <span className="text-sm text-gray-500">
                {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
              </span>
            </div>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900">{item.productName}</p>
                    <p className="text-xs text-gray-500">
                      {item.quantity} × {formatPrice(item.unitPrice)}
                    </p>
                    {item.observations && (
                      <p className="text-xs text-gray-500 italic mt-1">
                        Obs: {item.observations}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{formatPrice(item.totalPrice)}</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-3" />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(order.subtotal)}</span>
              </div>
              {order.totalDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Descuentos</span>
                  <span className="font-medium text-green-600">
                    -{formatPrice(order.totalDiscount)}
                  </span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-lg text-gray-900">{formatPrice(order.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Timeline */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-gray-900">Historial del pedido</h3>
            
            <div className="space-y-3">
              {order.statusHistory.map((status, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                    {index < order.statusHistory.length - 1 && (
                      <div className="w-0.5 h-8 bg-gray-200 my-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-3">
                    <p className="font-medium text-sm text-gray-900">
                      {STATUS_CONFIG[status.to].label}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(new Date(status.timestamp), 'dd/MM/yyyy HH:mm')}
                    </p>
                    {status.notes && (
                      <p className="text-xs text-gray-600 mt-1">{status.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Bottom Action */}
      {!isReady && (
        <footer className="sticky bottom-0 bg-white border-t p-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push(`/tienda/${storeId}/catalogo`)}
          >
            <ChevronRight className="w-4 h-4 mr-2" />
            Seguir comprando
          </Button>
        </footer>
      )}
    </div>
  );
}
