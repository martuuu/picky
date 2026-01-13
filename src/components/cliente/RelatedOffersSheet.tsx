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
import { ShoppingCart, Sparkles, X } from 'lucide-react';
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
  const { addItem, getItemQuantity } = useCartStore();
  
  const relatedProducts = useMemo(() => {
    if (relatedProductIds.length === 0) return [];
    const allProducts = parseProducts(mockProducts.products as Record<string, unknown>[]);
    return allProducts.filter(p => relatedProductIds.includes(p.id));
  }, [relatedProductIds]);

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
    router.push(`/tienda/${storeId}/carrito`);
  };

  const handleContinueShopping = () => {
    onClose();
    router.push(`/tienda/${storeId}/catalogo`);
  };

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <div>
                  <SheetTitle className="text-2xl">
                    ¡Oferta especial!
                  </SheetTitle>
                  <SheetDescription className="text-base">
                    Otros clientes también compraron
                  </SheetDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </SheetHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              {relatedProducts.map((product) => {
                const hasDiscount = product.originalPrice && product.originalPrice > product.price;
                const discountPercent = hasDiscount
                  ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
                  : 0;
                const inCart = getItemQuantity(product.id);

                return (
                  <Card
                    key={product.id}
                    className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push(`/tienda/${storeId}/producto/${product.sku}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                          {hasDiscount && (
                            <Badge className="absolute top-1 left-1 bg-red-500 text-xs px-1.5 py-0.5">
                              -{discountPercent}%
                            </Badge>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                            {product.name}
                          </h3>
                          
                          <div className="flex items-baseline gap-2 mb-2">
                            {hasDiscount && (
                              <span className="text-sm text-gray-400 line-through">
                                {formatPrice(product.originalPrice!)}
                              </span>
                            )}
                            <span className="text-xl font-bold text-green-600">
                              {formatPrice(product.price)}
                            </span>
                          </div>

                          {/* Stock Badge */}
                          {product.stock === 0 ? (
                            <Badge variant="destructive" className="text-xs">
                              Sin stock
                            </Badge>
                          ) : product.stock <= 5 ? (
                            <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                              Últimas unidades
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              En stock
                            </Badge>
                          )}
                        </div>

                        {/* Quick Add Button */}
                        <div className="flex flex-col justify-center">
                          {inCart > 0 ? (
                            <Badge className="bg-green-600 flex items-center gap-1 whitespace-nowrap">
                              <ShoppingCart className="w-3 h-3" />
                              {inCart}
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddRelatedProduct(product);
                              }}
                              disabled={product.stock === 0}
                              className="h-9 px-3"
                            >
                              <ShoppingCart className="w-4 h-4 mr-1" />
                              Agregar
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Bulk Discount Hint */}
                      {product.bulkDiscounts && product.bulkDiscounts.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-xs text-blue-600 font-medium flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {product.bulkDiscounts[0].label}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Fixed Bottom Actions */}
          <div className="border-t bg-white p-4 space-y-3">
            <Button
              className="w-full h-12 text-lg"
              onClick={handleViewCart}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Ir al carrito
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={handleContinueShopping}
            >
              Seguir comprando
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
