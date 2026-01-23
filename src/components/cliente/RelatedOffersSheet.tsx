'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Sparkles, CheckCircle2 } from 'lucide-react';
import { Product } from '@/types/product';
import { useCartStore } from '@/stores/useCartStore';
import { formatPrice, parseProducts } from '@/lib/utils';
import { toast } from 'sonner';
import Image from 'next/image';
import mockProducts from '@/data/mock-products.json';

interface RelatedOffersSheetProps {
  isOpen: boolean;
  onClose: () => void;
  relatedProductIds: string[];
  storeId: string;
}

export function RelatedOffersSheet({
  isOpen,
  onClose,
  relatedProductIds,
  storeId,
}: RelatedOffersSheetProps) {
  const router = useRouter();
  const { cart, addItem } = useCartStore();
  
  const relatedProducts = useMemo(() => {
    if (relatedProductIds.length === 0) return [];
    const allProducts = parseProducts(mockProducts.products as Record<string, unknown>[]);
    return allProducts.filter(p => relatedProductIds.includes(p.id));
  }, [relatedProductIds]);

  const validItems = useMemo(() => {
    return cart?.items.filter(item => item.product) || [];
  }, [cart?.items]);

  const cartTotal = useMemo(() => {
    if (!cart) return 0;
    return cart.items.reduce((sum, item) => {
      if (!item.product) return sum;
      return sum + (item.product.price * item.quantity);
    }, 0);
  }, [cart]);
  
  const totalDiscount = useMemo(() => {
    return validItems.reduce((sum, item) => {
      if (!item.product) return sum;
      const itemDiscount = item.product.originalPrice
        ? (item.product.originalPrice - item.product.price) * item.quantity
        : 0;
      return sum + itemDiscount;
    }, 0);
  }, [validItems]);

  const handleAddRelatedProduct = (product: Product) => {
    if (product.stock === 0) {
      toast.error('Sin stock', {
        description: 'Este producto no está disponible',
      });
      return;
    }

    addItem(product, 1);
    toast.success('Producto agregado', {
      description: `${product.name} agregado al carrito`,
    });
  };

  const handleViewCart = () => {
    onClose();
    router.push(`/tienda/${storeId}/resumen`);
  };

  const handleContinueShopping = () => {
    onClose();
    router.push(`/tienda/${storeId}/escanear`);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0">
        <div className="flex flex-col h-full">
          {/* Success Header */}
          <SheetHeader className="px-6 pt-6 pb-4 bg-linear-to-b from-green-50 to-white border-b">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 rounded-full p-3">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex-1">
                <SheetTitle className="text-2xl text-gray-900">
                  ¡Producto agregado!
                </SheetTitle>
                <SheetDescription className="text-base text-gray-600">
                  {validItems.length} {validItems.length === 1 ? 'producto' : 'productos'} en tu carrito
                </SheetDescription>
              </div>
            </div>

            {/* Total Summary */}
            <Card className="bg-white border-2 border-green-200">
              <CardContent className="py-3 px-4">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Total de tu compra</p>
                    <div className="flex items-baseline gap-2">
                      {totalDiscount > 0 && (
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(cartTotal + totalDiscount)}
                        </span>
                      )}
                      <span className="text-2xl font-bold text-green-600">
                        {formatPrice(cartTotal)}
                      </span>
                    </div>
                    {totalDiscount > 0 && (
                      <p className="text-xs text-green-600 font-medium mt-1">
                        ¡Ahorrás {formatPrice(totalDiscount)}!
                      </p>
                    )}
                  </div>
                  <Badge variant="default" className="text-sm px-3 py-1.5">
                    {validItems.length} {validItems.length === 1 ? 'ítem' : 'ítems'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </SheetHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {/* Cart Items */}
            {validItems.length > 0 && (
              <div className="space-y-2 mb-6">
                {validItems.map((item) => {
                  if (!item.product) return null;
                  
                  return (
                    <div key={item.product.id} className="border-b last:border-b-0 pb-3 last:pb-0">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 line-clamp-2 text-sm">
                            {item.product.name}
                          </h4>
                          
                          {/* Product Details Badges */}
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {item.product.packaging && (
                              <Badge variant="outline" className="text-xs">
                                📦 {item.product.packaging}
                              </Badge>
                            )}
                            {item.product.weight && (
                              <Badge variant="outline" className="text-xs">
                                ⚖️ {item.product.weight * item.quantity} kg
                              </Badge>
                            )}
                            {item.product.dimensions && (
                              <Badge variant="outline" className="text-xs">
                                📏 {item.product.dimensions.length}×{item.product.dimensions.width}×{item.product.dimensions.height}cm
                              </Badge>
                            )}
                          </div>
                          
                          {/* Quantity and Price */}
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-600">
                              x{item.quantity}
                            </span>
                            <span className="font-semibold text-gray-900">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                          </div>

                          {/* Observations */}
                          {item.observations && (
                            <p className="text-xs text-gray-500 mt-2 italic">
                              💬 {item.observations}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Related Offers - Subtle */}
            {relatedProducts.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <h3 className="font-semibold text-gray-900 text-sm">
                    También te puede interesar
                  </h3>
                </div>
                <div className="space-y-2">
                  {relatedProducts.slice(0, 2).map((product) => {
                    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
                    const discountPercent = hasDiscount
                      ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
                      : 0;

                    return (
                      <div
                        key={product.id}
                        className="bg-purple-50 rounded-lg p-3 border border-purple-100 hover:border-purple-200 transition-colors cursor-pointer"
                        onClick={() => {
                          onClose();
                          router.push(`/tienda/${storeId}/producto/${product.sku}`);
                        }}
                      >
                        <div className="flex gap-3">
                          <div className="relative w-16 h-16 shrink-0 rounded overflow-hidden bg-white">
                            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                            {hasDiscount && (
                              <Badge className="absolute top-1 left-1 bg-red-500 text-xs px-1 py-0">
                                -{discountPercent}%
                              </Badge>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                              {product.name}
                            </h4>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-baseline gap-1">
                                {hasDiscount && (
                                  <span className="text-xs text-gray-400 line-through">
                                    {formatPrice(product.originalPrice!)}
                                  </span>
                                )}
                                <span className="text-base font-bold text-green-600">
                                  {formatPrice(product.price)}
                                </span>
                              </div>

                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddRelatedProduct(product);
                                }}
                                disabled={product.stock === 0}
                                className="h-7 px-2 text-xs"
                              >
                                + Agregar
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Fixed Bottom Actions */}
          <div className="border-t bg-white p-4 space-y-2">
            <Button 
              className="w-full h-12 text-base font-semibold" 
              onClick={handleViewCart}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Ir al Carrito
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full h-10"
              onClick={handleContinueShopping}
            >
              Seguir Comprando
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
