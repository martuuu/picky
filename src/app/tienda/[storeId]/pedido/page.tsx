'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  Clock, 
  Coffee, 
  Package, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Order, OrderStatus } from '@/types/order';

const STATUS_STEPS: { status: OrderStatus; label: string; icon: typeof Clock }[] = [
  { status: 'PENDING_PAYMENT', label: 'Pendiente de pago', icon: AlertCircle },
  { status: 'PAID', label: 'Pago confirmado', icon: CheckCircle2 },
  { status: 'PREPARING', label: 'Preparando pedido', icon: Package },
  { status: 'READY_FOR_PICKUP', label: 'Listo para retirar', icon: CheckCircle2 },
];

export default function PedidoTrackingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const orderId = searchParams.get('orderId');
  const storeId = params.storeId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showSurvey, setShowSurvey] = useState(false);
  const [surveyRating, setSurveyRating] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!orderId) {
      router.push(`/tienda/${storeId}`);
      return;
    }

    const loadOrder = () => {
      const orders = JSON.parse(localStorage.getItem('picky_orders') || '[]');
      const foundOrder = orders.find((o: Order) => o.id === orderId);
      
      if (foundOrder) {
        setOrder(foundOrder);
        
        // Show survey after 2 minutes if still waiting
        if (foundOrder.status !== 'READY_FOR_PICKUP' && foundOrder.status !== 'COMPLETED') {
          setTimeout(() => setShowSurvey(true), 120000); // 2 minutes
        }
      } else {
        router.push(`/tienda/${storeId}`);
      }
    };

    loadOrder();

    // Track elapsed seconds for debugging
    const startTime = Date.now();
    
    // Auto-progress order status simulation (for demo) - CASCADE TIMERS
    const timers: NodeJS.Timeout[] = [];
    
    console.log('🚀 [PEDIDO] Iniciando simulación automática de estados...');
    console.log(`📍 Order ID: ${orderId}`);
    console.log(`⏰ Tiempo actual: ${new Date().toLocaleTimeString()}`);
    
    // Timer 1: PENDING_PAYMENT → PAID (after 5 seconds)
    const timer1 = setTimeout(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      console.log(`\n⏱️  [${elapsed}s] Ejecutando Timer 1...`);
      
      const orders = JSON.parse(localStorage.getItem('picky_orders') || '[]');
      const orderIndex = orders.findIndex((o: Order) => o.id === orderId);
      
      if (orderIndex !== -1 && orders[orderIndex].status === 'PENDING_PAYMENT') {
        orders[orderIndex].status = 'PAID';
        orders[orderIndex].updatedAt = new Date().toISOString();
        localStorage.setItem('picky_orders', JSON.stringify(orders));
        
        toast.success('✅ Pago confirmado', {
          description: 'Tu pedido está siendo preparado',
        });
        
        console.log('✅ Status changed: PENDING_PAYMENT → PAID');
      } else if (orderIndex !== -1) {
        console.log(`⚠️  Status actual: ${orders[orderIndex].status} (esperaba PENDING_PAYMENT)`);
      }
    }, 5000); // 5 seconds
    timers.push(timer1);
    
    // Timer 2: PAID → PREPARING (after 12 seconds total)
    const timer2 = setTimeout(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      console.log(`\n⏱️  [${elapsed}s] Ejecutando Timer 2...`);
      
      const orders = JSON.parse(localStorage.getItem('picky_orders') || '[]');
      const orderIndex = orders.findIndex((o: Order) => o.id === orderId);
      
      if (orderIndex !== -1) {
        const currentStatus = orders[orderIndex].status;
        console.log(`📊 Status actual: ${currentStatus}`);
        
        if (currentStatus === 'PAID' || currentStatus === 'PENDING_PAYMENT') {
          orders[orderIndex].status = 'PREPARING';
          orders[orderIndex].updatedAt = new Date().toISOString();
          localStorage.setItem('picky_orders', JSON.stringify(orders));
          
          toast.info('📦 Preparando pedido', {
            description: 'Tu pedido está en preparación',
          });
          
          console.log('📦 Status changed: → PREPARING');
        } else {
          console.log(`⚠️  No se cambió (esperaba PAID, encontró ${currentStatus})`);
        }
      }
    }, 12000); // 12 seconds
    timers.push(timer2);
    
    // Timer 3: PREPARING → READY_FOR_PICKUP (after 20 seconds total)
    const timer3 = setTimeout(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      console.log(`\n⏱️  [${elapsed}s] Ejecutando Timer 3...`);
      
      const orders = JSON.parse(localStorage.getItem('picky_orders') || '[]');
      const orderIndex = orders.findIndex((o: Order) => o.id === orderId);
      
      if (orderIndex !== -1) {
        const currentStatus = orders[orderIndex].status;
        console.log(`📊 Status actual: ${currentStatus}`);
        
        orders[orderIndex].status = 'READY_FOR_PICKUP';
        orders[orderIndex].updatedAt = new Date().toISOString();
        localStorage.setItem('picky_orders', JSON.stringify(orders));
        
        // Vibration feedback
        if ('vibrate' in navigator) {
          navigator.vibrate([200, 100, 200, 100, 200]);
        }
        
        toast.success('🎉 ¡Pedido listo!', {
          description: 'Podés retirarlo en caja con tu código QR',
          duration: 10000,
        });
        
        console.log('🎉 Status changed: → READY_FOR_PICKUP');
      }
    }, 20000); // 20 seconds
    timers.push(timer3);

    // Poll for order updates every 5 seconds
    const interval = setInterval(loadOrder, 5000);
    
    // Update current time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => {
      timers.forEach(timer => clearTimeout(timer));
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, [orderId, router, storeId]);

  const handleSubmitSurvey = () => {
    if (surveyRating) {
      // Save survey to localStorage
      const surveys = JSON.parse(localStorage.getItem('picky_surveys') || '[]');
      surveys.push({
        orderId,
        rating: surveyRating,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('picky_surveys', JSON.stringify(surveys));
      
      setShowSurvey(false);
    }
  };

  const getElapsedTime = () => {
    if (!order) return 0;
    const created = new Date(order.createdAt);
    const diff = currentTime.getTime() - created.getTime();
    return Math.floor(diff / 60000); // minutes
  };

  const getStatusProgress = () => {
    if (!order) return 0;
    const statusIndex = STATUS_STEPS.findIndex(s => s.status === order.status);
    return ((statusIndex + 1) / STATUS_STEPS.length) * 100;
  };

  const getCurrentStatusIndex = () => {
    if (!order) return 0;
    return STATUS_STEPS.findIndex(s => s.status === order.status);
  };

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando pedido...</p>
        </div>
      </div>
    );
  }

  const elapsedMinutes = getElapsedTime();
  const estimatedRemaining = Math.max(0, order.estimatedPrepTime - elapsedMinutes);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/tienda/${storeId}`)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Seguimiento del Pedido</h1>
            <p className="text-sm text-gray-500">{order.orderNumber}</p>
          </div>
          {/* Debug Timer */}
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">
            ⏱️ {elapsedSeconds}s
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-4 pb-24 space-y-4">
        
        {/* Status Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Estado del Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={getStatusProgress()} className="h-2" />
            
            <div className="space-y-3">
              {STATUS_STEPS.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === getCurrentStatusIndex();
                const isCompleted = index < getCurrentStatusIndex();
                
                return (
                  <div key={step.status} className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-green-100 text-green-600' :
                      isCompleted ? 'bg-green-600 text-white' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${isActive ? 'text-green-600' : isCompleted ? 'text-green-700' : 'text-gray-400'}`}>
                        {step.label}
                      </p>
                      {isActive && (
                        <p className="text-xs text-gray-500">En progreso...</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Estimated Time */}
        {order.status !== 'READY_FOR_PICKUP' && order.status !== 'COMPLETED' && (
          <Card className="bg-linear-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-900">
                    {estimatedRemaining > 0 
                      ? `Tiempo estimado: ${estimatedRemaining} minutos` 
                      : 'Tu pedido estará listo pronto'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Tiempo transcurrido: {elapsedMinutes} min
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ready for Pickup */}
        {order.status === 'READY_FOR_PICKUP' && (
          <Card className="bg-green-50 border-green-300 border-2">
            <CardContent className="pt-4">
              <div className="text-center">
                <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-3" />
                <h2 className="text-2xl font-bold text-green-900 mb-2">
                  ¡Tu pedido está listo!
                </h2>
                <p className="text-green-700 mb-4">
                  Podés retirarlo en la caja con tu código QR
                </p>
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => router.push(`/tienda/${storeId}/confirmacion?orderId=${order.id}`)}
                >
                  Ver Código QR para Retiro
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* While You Wait - Special Offers */}
        {order.status !== 'READY_FOR_PICKUP' && order.status !== 'COMPLETED' && (
          <div className="space-y-4">
            {/* Food & Beverage Offers */}
            <Card className="bg-linear-to-br from-orange-50 to-yellow-50 border-orange-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Coffee className="w-5 h-5 text-orange-600" />
                  Mientras esperás...
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-700 font-medium mb-3">
                  ¡Aprovechá estas ofertas especiales!
                </p>
                
                {/* Mock Special Offers */}
                <Card className="border-orange-200">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">☕ Café + Medialunas</p>
                        <p className="text-xs text-gray-600">Combo desayuno</p>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-lg font-bold text-orange-600">
                            {formatPrice(1500)}
                          </span>
                          <Badge className="bg-orange-500">50% OFF</Badge>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-orange-300">
                        Agregar
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-orange-200">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">🥤 Bebida Fría</p>
                        <p className="text-xs text-gray-600">Gaseosa o agua saborizada</p>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-lg font-bold text-orange-600">
                            {formatPrice(800)}
                          </span>
                          <Badge className="bg-orange-500">40% OFF</Badge>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-orange-300">
                        Agregar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Kids Playground Suggestion - Always visible */}
            <Card className="bg-linear-to-br from-pink-50 to-purple-50 border-pink-200">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-pink-100 rounded-full p-3 shrink-0">
                    <Sparkles className="w-6 h-6 text-pink-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">
                      🎈 Zona de Juegos para Niños
                    </p>
                    <p className="text-sm text-gray-700 mb-3">
                      ¿Venís con chicos? Tenemos un espacio seguro con juegos y actividades mientras esperás tu pedido.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span>📍 Planta baja, sector norte</span>
                      <span>•</span>
                      <span>👶 De 3 a 10 años</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="mt-3 border-pink-300 text-pink-700 hover:bg-pink-100"
                      onClick={() => toast.info('Información', {
                        description: 'El playground está ubicado en planta baja, sector norte. Supervisión de adultos requerida.'
                      })}
                    >
                      Ver Ubicación
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Experience Survey */}
        {showSurvey && !surveyRating && (
          <Card className="bg-purple-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                ¿Cómo va tu experiencia?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-700">
                Ayudanos a mejorar. ¿Cómo calificarías tu experiencia hasta ahora?
              </p>
              <div className="flex justify-center gap-3">
                {['😞', '😐', '🙂', '😄', '🤩'].map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => setSurveyRating(index + 1)}
                    className="text-4xl hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              {surveyRating && (
                <Button 
                  className="w-full" 
                  onClick={handleSubmitSurvey}
                >
                  Enviar Calificación
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Detalle del Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">{formatPrice(order.subtotal)}</span>
            </div>
            {order.totalDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Descuentos:</span>
                <span className="font-semibold">-{formatPrice(order.totalDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>TOTAL:</span>
              <span className="text-green-600">{formatPrice(order.total)}</span>
            </div>
            {order.status === 'PENDING_PAYMENT' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                <p className="text-sm text-yellow-800 font-medium">
                  ⚠️ Recordá pagar en caja al retirar tu pedido
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
