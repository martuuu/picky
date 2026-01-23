'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  ArrowLeft, 
  CreditCard, 
  Wallet, 
  Clock, 
  ShoppingBag,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import { useUserStore } from '@/stores/useUserStore';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import type { Order } from '@/types/order';

type PaymentMethod = 'MERCADOPAGO' | 'CASH_AT_COUNTER' | 'CARD_AT_COUNTER';

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;

  const { cart, clearCart } = useCartStore();
  const { user, updateUser } = useUserStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('MERCADOPAGO');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const hasCheckedCart = useRef(false);

  // Redirect if cart is empty (only on initial load)
  useEffect(() => {
    if (!hasCheckedCart.current) {
      if (!cart || cart.items.length === 0) {
        toast.error('Tu carrito está vacío', {
          description: 'Agregá productos antes de proceder al pago',
        });
        router.push(`/tienda/${storeId}/escanear`);
      }
      hasCheckedCart.current = true;
    }
  }, [cart, router, storeId]);

  // Calculate estimated prep time (2 min per item + 5 min base)
  const estimatedPrepTime = Math.max(10, (cart?.items.length || 0) * 2 + 5);

  const validateForm = (): boolean => {
    const newErrors: { name?: string; phone?: string } = {};

    if (!customerName.trim()) {
      newErrors.name = 'Ingresá tu nombre';
    }

    if (!customerPhone.trim()) {
      newErrors.phone = 'Ingresá tu teléfono';
    } else if (!/^\d{10}$/.test(customerPhone.replace(/\D/g, ''))) {
      newErrors.phone = 'Teléfono inválido (10 dígitos)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      toast.error('Completá todos los campos requeridos');
      return;
    }

    setIsProcessing(true);

    try {
      // Save user data
      updateUser({
        name: customerName,
        phone: customerPhone,
      });

      // Simulate payment processing (500-1500ms)
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

      // Generate order
      const orderId = `ORD-${Date.now()}`;
      const orderNumber = `PK-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;

      // Determinar status según método de pago
      const orderStatus = 
        selectedPaymentMethod === 'MERCADOPAGO' ? 'PAID' : 'PENDING_PAYMENT';

      const order: Order = {
        id: orderId,
        orderNumber,
        storeId,
        storeName: 'Bazar Casa Bella', // TODO: Get from store context
        customerId: user?.id || 'anonymous',
        customerName,
        customerPhone,
        status: orderStatus,
        items: cart!.items.map(item => ({
          id: `item-${item.productId}-${Date.now()}`,
          productId: item.product!.id,
          productName: item.product!.name,
          productImage: item.product!.imageUrl,
          sku: item.product!.sku,
          quantity: item.quantity,
          unitPrice: item.product!.price,
          totalPrice: item.quantity * item.product!.price,
          observations: item.observations,
          isPicked: false,
        })),
        subtotal: cart!.subtotal,
        totalDiscount: cart!.subtotal - cart!.total,
        total: cart!.total,
        paymentMethod: selectedPaymentMethod,
        paymentId: selectedPaymentMethod === 'MERCADOPAGO' ? `MP-${Date.now()}` : undefined,
        estimatedPrepTime,
        statusHistory: [
          {
            from: 'PENDING_PAYMENT' as const,
            to: orderStatus,
            timestamp: new Date(),
            notes: selectedPaymentMethod === 'MERCADOPAGO' 
              ? 'Pago procesado exitosamente'
              : 'Pedido creado - Pago pendiente en caja',
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Store order in localStorage (simulate backend)
      const existingOrders = JSON.parse(localStorage.getItem('picky_orders') || '[]');
      existingOrders.push(order);
      localStorage.setItem('picky_orders', JSON.stringify(existingOrders));

      // Clear cart
      clearCart();

      // Success feedback
      const successMessage = selectedPaymentMethod === 'MERCADOPAGO'
        ? '¡Pago exitoso!'
        : 'Pedido confirmado';
      
      const successDescription = selectedPaymentMethod === 'MERCADOPAGO'
        ? `Pedido ${orderNumber} confirmado`
        : `Pedido ${orderNumber} - Pagá al retirar`;

      toast.success(successMessage, {
        description: successDescription,
        icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
      });

      // Vibrate if available
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }

      // Redirect to order tracking page
      setTimeout(() => {
        router.push(`/tienda/${storeId}/pedido?orderId=${orderId}`);
      }, 1500);

    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Error al procesar el pago', {
        description: 'Intentá nuevamente',
      });
      setIsProcessing(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return null; // Already redirecting
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="flex items-center gap-3 p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            disabled={isProcessing}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Checkout</h1>
            <p className="text-sm text-gray-500">Finalizá tu compra</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 pb-32 space-y-4">
        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-700 font-semibold">1</span>
              </div>
              Datos de contacto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Nombre completo *
              </label>
              <Input
                placeholder="Ej: Juan Pérez"
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                disabled={isProcessing}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Teléfono *
              </label>
              <Input
                type="tel"
                placeholder="Ej: 1123456789"
                value={customerPhone}
                onChange={(e) => {
                  setCustomerPhone(e.target.value);
                  if (errors.phone) setErrors({ ...errors, phone: undefined });
                }}
                disabled={isProcessing}
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.phone}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Te avisaremos cuando tu pedido esté listo
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-700 font-semibold">2</span>
              </div>
              Método de pago
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* MercadoPago Option */}
            <button
              onClick={() => setSelectedPaymentMethod('MERCADOPAGO')}
              disabled={isProcessing}
              className={`w-full p-4 rounded-lg border-2 transition-all flex items-center justify-between ${
                selectedPaymentMethod === 'MERCADOPAGO'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">MercadoPago</p>
                  <p className="text-xs text-gray-500">Tarjeta, débito o efectivo</p>
                </div>
              </div>
              {selectedPaymentMethod === 'MERCADOPAGO' && (
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
              )}
            </button>

            {/* Card at Counter Option */}
            <button
              onClick={() => setSelectedPaymentMethod('CARD_AT_COUNTER')}
              disabled={isProcessing}
              className={`w-full p-4 rounded-lg border-2 transition-all flex items-center justify-between ${
                selectedPaymentMethod === 'CARD_AT_COUNTER'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Tarjeta en Caja</p>
                  <p className="text-xs text-gray-500">Pagá con tarjeta en el mostrador</p>
                </div>
              </div>
              {selectedPaymentMethod === 'CARD_AT_COUNTER' && (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              )}
            </button>

            {/* Cash at Counter Option */}
            <button
              onClick={() => setSelectedPaymentMethod('CASH_AT_COUNTER')}
              disabled={isProcessing}
              className={`w-full p-4 rounded-lg border-2 transition-all flex items-center justify-between ${
                selectedPaymentMethod === 'CASH_AT_COUNTER'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Efectivo en Caja</p>
                  <p className="text-xs text-gray-500">Pagá en efectivo al retirar</p>
                </div>
              </div>
              {selectedPaymentMethod === 'CASH_AT_COUNTER' && (
                <CheckCircle2 className="w-5 h-5 text-orange-600" />
              )}
            </button>

            {selectedPaymentMethod === 'MERCADOPAGO' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-800">
                  <strong>Demo:</strong> El pago será simulado. En producción, serás redirigido al checkout de MercadoPago.
                </p>
              </div>
            )}

            {(selectedPaymentMethod === 'CASH_AT_COUNTER' || selectedPaymentMethod === 'CARD_AT_COUNTER') && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
                <p className="text-xs text-orange-800">
                  <strong>Importante:</strong> Tu pedido será preparado. Realizá el pago al momento de retirarlo en caja.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estimated Time */}
        <Card className="bg-linear-to-r from-green-50 to-blue-50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Tiempo estimado de preparación</p>
              <p className="text-sm text-gray-600">
                Aproximadamente <span className="font-semibold text-green-700">{estimatedPrepTime} minutos</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary (Collapsible) */}
        <Accordion type="single" collapsible defaultValue="summary">
          <AccordionItem value="summary" className="border rounded-lg bg-white">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <p className="font-semibold">Resumen del pedido</p>
                  <p className="text-sm text-gray-500">
                    {cart.items.length} {cart.items.length === 1 ? 'producto' : 'productos'}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-3">
                {cart.items.map((item) => {
                  const itemTotal = item.quantity * item.product!.price;
                  return (
                  <div key={item.productId} className="border-b last:border-0 pb-3 last:pb-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900">
                        {item.product!.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        SKU: {item.product!.sku}
                      </p>
                      
                      {/* Product Details */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.product!.packaging && (
                          <Badge variant="outline" className="text-xs">
                            📦 {item.product!.packaging}
                          </Badge>
                        )}
                        {item.product!.weight && (
                          <Badge variant="outline" className="text-xs">
                            ⚖️ {item.product!.weight * item.quantity} kg
                          </Badge>
                        )}
                        {item.product!.dimensions && (
                          <Badge variant="outline" className="text-xs">
                            📏 {item.product!.dimensions.length}x{item.product!.dimensions.width}x{item.product!.dimensions.height}cm
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm text-gray-600">
                          x{item.quantity} × {formatPrice(item.product!.price)}
                        </p>
                        <p className="font-semibold text-sm text-gray-900">
                          {formatPrice(itemTotal)}
                        </p>
                      </div>
                      
                      {item.observations && (
                        <p className="text-xs text-gray-500 italic mt-2">
                          Obs: {item.observations}
                        </p>
                      )}
                    </div>
                  </div>
                  );
                })}

                <Separator className="my-3" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(cart.subtotal)}</span>
                  </div>
                  {cart.subtotal !== cart.total && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Descuentos</span>
                      <span className="font-medium text-green-600">
                        -{formatPrice(cart.subtotal - cart.total)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>

      {/* Sticky Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-20">
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total a pagar</p>
              <p className="text-2xl font-bold text-gray-900">{formatPrice(cart.total)}</p>
            </div>
            <Button
              size="lg"
              onClick={handlePayment}
              disabled={isProcessing}
              className="min-w-35 bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pagar ahora
                </>
              )}
            </Button>
          </div>

          {isProcessing && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
              <span>Procesando tu pago...</span>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
