'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ShoppingCart, Minus, Plus, Trash2, Package, Sparkles } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

export default function ResumenPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;

  const { cart, updateItemQuantity, removeItem } = useCartStore();
  const [expandedItems, setExpandedItems] = useState(false);

  const validItems = cart?.items.filter(item => item.product) || [];

  const handleUpdateQuantity = (productId: string, delta: number, maxStock: number) => {
    const currentItem = validItems.find(item => item.product!.id === productId);
    if (!currentItem) return;

    const newQuantity = currentItem.quantity + delta;

    if (newQuantity <= 0) {
      handleRemoveItem(productId, currentItem.product!.name);
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
    });
  };

  if (!cart || validItems.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/tienda/${storeId}/escanear`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <h1 className="text-lg font-semibold">Resumen</h1>
            <div className="w-20"></div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Tu pedido está vacío
              </h2>
              <p className="text-gray-600 mb-6">
                Escaneá productos para comenzar tu compra
              </p>
              <Button
                className="w-full"
                onClick={() => router.push(`/tienda/${storeId}/escanear`)}
              >
                Escanear Productos
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
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/tienda/${storeId}/escanear`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-lg font-semibold">Resumen de tu Pedido</h1>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-4 pb-40">
        {/* Summary Card */}
        <Card className="mb-4 border-2 border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <span className="text-gray-700">Total de tu compra</span>
              <Badge variant="default" className="text-base px-3 py-1">
                {validItems.length} {validItems.length === 1 ? 'producto' : 'productos'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-base">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">{formatPrice(cart.subtotal)}</span>
            </div>
            
            {totalDiscount > 0 && (
              <div className="flex justify-between text-base text-green-600">
                <span>Descuentos:</span>
                <span className="font-semibold">-{formatPrice(totalDiscount)}</span>
              </div>
            )}
            
            <Separator />
            
            <div className="flex justify-between text-2xl font-bold text-gray-900 pt-2">
              <span>TOTAL:</span>
              <span className="text-green-600">{formatPrice(cart.total)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Items List */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Productos</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedItems(!expandedItems)}
              >
                {expandedItems ? 'Ocultar detalles' : 'Modificar cantidades'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {validItems.map((item) => (
              <div key={item.id} className="border-b last:border-b-0 pb-3 last:pb-0">
                <div className="flex items-start gap-3">
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 line-clamp-2 text-sm">
                      {item.product!.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      SKU: {item.product!.sku}
                    </p>
                    
                    {/* Product Details (packaging, weight) */}
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
                    
                    {/* Quantity and Price */}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-600">
                        x{item.quantity}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {formatPrice(item.product!.price * item.quantity)}
                      </span>
                    </div>

                    {/* Expanded Controls */}
                    {expandedItems && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleUpdateQuantity(item.product!.id, -1, item.product!.stock)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleUpdateQuantity(item.product!.id, 1, item.product!.stock)}
                            disabled={item.quantity >= item.product!.stock}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-auto text-red-600 hover:text-red-700"
                          onClick={() => handleRemoveItem(item.product!.id, item.product!.name)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}

                    {/* Observations */}
                    {item.observations && (
                      <p className="text-xs text-gray-500 mt-2 italic">
                        Nota: {item.observations}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Price Comparator Suggestion */}
        <Card className="mt-4 bg-purple-50 border-purple-200">
          <CardContent className="pt-4">
            <div className="flex gap-3">
              <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-purple-900 mb-1">
                  💰 ¿Querés ahorrar más?
                </p>
                <p className="text-sm text-purple-700 mb-3">
                  Comparamos precios de productos similares de otras marcas para que encuentres la mejor oferta
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-purple-300 text-purple-700 hover:bg-purple-100"
                  onClick={() => {
                    toast.info('Comparador de Precios', {
                      description: 'Funcionalidad disponible próximamente',
                    });
                  }}
                >
                  📊 Ver Comparador de Precios
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-4 bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex gap-3">
              <Package className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">¿Querés modificar algo?</p>
                <p className="text-xs text-blue-700">
                  Podés cambiar cantidades o eliminar productos haciendo click en &quot;Modificar cantidades&quot;
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 space-y-2">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Total a pagar:</span>
            <span className="text-green-600 text-2xl">{formatPrice(cart.total)}</span>
          </div>
          
          <Button
            className="w-full h-14 text-lg"
            onClick={() => router.push(`/tienda/${storeId}/checkout`)}
          >
            Continuar a Pago
          </Button>
          
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push(`/tienda/${storeId}/escanear`)}
          >
            Agregar más productos
          </Button>
        </div>
      </div>
    </div>
  );
}
