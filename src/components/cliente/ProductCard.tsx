'use client';

import { Product } from '@/types/product';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, ShoppingCart } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/stores/useCartStore';
import { toast } from 'sonner';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  inCart?: number;
}

export function ProductCard({ product, inCart = 0 }: ProductCardProps) {
  const router = useRouter();
  const params = useParams();
  const storeId = params.storeId as string;
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (product.stock <= 0) {
      toast.error('Producto sin stock');
      return;
    }

    addItem(product, 1);
    toast.success(`${product.name} agregado al carrito`, {
      action: {
        label: 'Ver carrito',
        onClick: () => router.push(`/tienda/${storeId}/carrito`),
      },
    });
  };

  const handleCardClick = () => {
    router.push(`/tienda/${storeId}/producto/${product.sku}`);
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col"
      onClick={handleCardClick}
    >
      <div className="relative aspect-square bg-gray-100">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        
        {hasDiscount && (
          <Badge className="absolute top-2 left-2 bg-red-500">
            -{discountPercent}%
          </Badge>
        )}

        {inCart > 0 && (
          <Badge className="absolute top-2 right-2 bg-green-600 flex items-center gap-1">
            <ShoppingCart className="w-3 h-3" />
            {inCart}
          </Badge>
        )}

        {product.stock <= 10 && product.stock > 0 && (
          <Badge variant="outline" className="absolute bottom-2 left-2 bg-white/90">
            Quedan {product.stock}
          </Badge>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive">Sin stock</Badge>
          </div>
        )}
      </div>

      <CardContent className="p-3 flex-1 flex flex-col">
        <p className="text-xs text-gray-500 mb-1">{product.category}</p>
        
        <h3 className="font-semibold text-sm line-clamp-2 mb-2 flex-1">
          {product.name}
        </h3>

        <div className="space-y-2">
          {hasDiscount && (
            <p className="text-xs text-gray-400 line-through">
              {formatPrice(product.originalPrice!)}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-green-600">
              {formatPrice(product.price)}
            </p>

            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="h-8 w-8 p-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {product.bulkDiscounts && product.bulkDiscounts.length > 0 && (
            <p className="text-xs text-blue-600">
              💰 {product.bulkDiscounts[0].label}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
