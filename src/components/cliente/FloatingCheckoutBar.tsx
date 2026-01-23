'use client';

import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import { formatPrice } from '@/lib/utils';

export function FloatingCheckoutBar() {
  const router = useRouter();
  const params = useParams();
  const storeId = params.storeId as string;
  
  const { cart } = useCartStore();

  if (!cart || cart.items.length === 0) {
    return null;
  }

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 max-w-4xl mx-auto">
      <div className="bg-green-600 text-white rounded-full shadow-2xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-6 h-6" />
          <div className="text-left">
            <p className="text-sm font-medium">
              {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
            </p>
            <p className="text-lg font-bold">{formatPrice(cart.total)}</p>
          </div>
        </div>

        <Button
          size="lg"
          variant="secondary"
          className="rounded-full font-bold"
          onClick={() => router.push(`/tienda/${storeId}/resumen`)}
        >
          IR A PAGAR →
        </Button>
      </div>
    </div>
  );
}
