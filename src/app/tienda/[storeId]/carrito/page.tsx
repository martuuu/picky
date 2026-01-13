'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Trash2, ShoppingCart, Minus, Plus, Package, TrendingUp, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import Image from 'next/image';

export default function CarritoPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;

  const { cart, updateItemQuantity, removeItem } = useCartStore();

  // Filter out items without product (shouldn't happen but TypeScript safety)
  const validItems = cart?.items.filter(item => item.product) || [];

  const handleUpdateQuantity = (productId: string, delta: number, maxStock: number) => {
    const currentItem = validItems.find(item => item.product!.id === productId);
    if (!currentItem) return;

    const newQuantity = currentItem.quantity + delta;

    if (newQuantity <= 0) {
      removeItem(productId);
      toast.success('Producto eliminado del carrito');
      return;
    }

    if (newQuantity > maxStock) {
      toast.error('Stock insuficiente', {
        description: `Solo hay ${maxStock} unidades disponibles`,
      });
      return;
    }

    updateItemQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    removeItem(productId);
    toast.success('Producto eliminado', {
      description: productName,
      action: {
        label: 'Deshacer',
        onClick: () => {
          // TODO: Implement undo functionality
          toast.info('Función deshacer no disponible en el prototipo');
        },
      },
    });
  };

  const handleCheckout = () => {
    router.push(`/tienda/${storeId}/checkout`);
  };

  if (!cart || validItems.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/tienda/${storeId}/catalogo`)}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver
            </Button>
            <h1 className="text-lg font-semibold ml-4">Carrito</h1>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Tu carrito está vacío
              </h2>
              <p className="text-gray-600 mb-6">
                Agregá productos para comenzar tu compra
              </p>
              <Button onClick={() => router.push(`/tienda/${storeId}/catalogo`)}>
                Ver catálogo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const totalDiscount = validItems.reduce((sum, item) => {
    const itemDiscount = item.product!.originalPrice
      ? (item.product!.originalPrice - item.product!.price) * item.quantity
      : 0;
    return sum + itemDiscount;
  }, 0);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </Button>
          <h1 className="text-lg font-semibold ml-4">Carrito</h1>
          <Badge className="ml-auto" variant="outline">
            {validItems.length} {validItems.length === 1 ? 'producto' : 'productos'}
          </Badge>
        </div>
      </div>

      {/* Cart Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-4 pb-32">
        {/* Progress Stepper */}
        <Card className="mb-4">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                  1
                </div>
                <span className="font-semibold text-green-600">Carrito</span>
              </div>
              
              <ChevronRight className="w-5 h-5 text-gray-400" />
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold">
                  2
                </div>
                <span className="text-gray-600">Pago</span>
              </div>
              
              <ChevronRight className="w-5 h-5 text-gray-400" />
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold">
                  3
                </div>
                <span className="text-gray-600">Confirmación</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cart Items */}
        <div className="space-y-3 mb-4">
          {validItems.map((item) => {
            const hasDiscount = item.product!.originalPrice && item.product!.originalPrice > item.product!.price;
            const itemTotal = item.product!.price * item.quantity;

            return (
              <Card key={item.product!.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div
                      className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
                      onClick={() => router.push(`/tienda/${storeId}/producto/${item.product!.sku}`)}
                    >
                      <Image
                        src={item.product!.imageUrl}
                        alt={item.product!.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-semibold text-gray-900 line-clamp-2 mb-1 cursor-pointer hover:text-green-600"
                        onClick={() => router.push(`/tienda/${storeId}/producto/${item.product!.sku}`)}
                      >
                        {item.product!.name}
                      </h3>
                      
                      <div className="flex items-baseline gap-2 mb-2">
                        {hasDiscount && (
                          <span className="text-sm text-gray-400 line-through">
                            {formatPrice(item.product!.originalPrice!)}
                          </span>
                        )}
                        <span className="text-lg font-bold text-green-600">
                          {formatPrice(item.product!.price)}
                        </span>
                      </div>

                      {/* Observations */}
                      {item.observations && (
                        <p className="text-sm text-gray-600 mb-2">
                          📝 {item.observations}
                        </p>
                      )}

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.product!.id, -1, item.product!.stock)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          
                          <span className="text-lg font-bold w-10 text-center">
                            {item.quantity}
                          </span>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.product!.id, 1, item.product!.stock)}
                            disabled={item.quantity >= item.product!.stock}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.product!.id, item.product!.name)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(itemTotal)}
                      </p>
                    </div>
                  </div>

                  {/* Applied Discount Badge */}
                  {item.appliedDiscount && (
                    <div className="mt-3 pt-3 border-t">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        💰 {item.appliedDiscount.label}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Dynamic Offers (Placeholder) */}
        <Card className="mb-4 bg-linear-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-purple-900 mb-2">
              <TrendingUp className="w-5 h-5" />
              <h3 className="font-semibold">
                ¡Estás cerca de un descuento!
              </h3>
            </div>
            <p className="text-sm text-purple-700">
              Agregá $5.000 más en productos y obtené 10% de descuento adicional
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Fixed Bottom Summary */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Summary */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(cart.subtotal)}</span>
            </div>
            
            {totalDiscount > 0 && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Ahorrás</span>
                <span>-{formatPrice(totalDiscount)}</span>
              </div>
            )}
            
            <Separator />
            
            <div className="flex justify-between text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>{formatPrice(cart.total)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              className="w-full h-12 text-lg animate-pulse"
              onClick={handleCheckout}
            >
              <Package className="w-5 h-5 mr-2" />
              Ir a Pagar
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push(`/tienda/${storeId}/catalogo`)}
            >
              Seguir comprando
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
