'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, ShoppingCart, Search, ArrowLeft, Store as StoreIcon } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import { useUserStore } from '@/stores/useUserStore';
import { Store } from '@/types/user';
import mockStores from '@/data/mock-stores.json';

export default function StoreLandingPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;
  
  const { cart, initCart } = useCartStore();
  const { session, initSession } = useUserStore();
  
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Inicializar sesión solo una vez
    if (storeId) {
      initSession(storeId);
    }
  }, [storeId, initSession]);

  useEffect(() => {
    // Inicializar carrito cuando tengamos sesión
    if (storeId && session) {
      initCart(storeId, session.id);
    }
  }, [storeId, session, initCart]);

  useEffect(() => {
    // Simular carga de datos de la tienda
    const loadStore = async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const foundStore = mockStores.stores.find((s: Store) => s.id === storeId);
      setStore(foundStore || null);
      setLoading(false);
    };

    if (storeId) {
      loadStore();
    }
  }, [storeId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <StoreIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Tienda no encontrada
            </h2>
            <p className="text-gray-600 mb-6">
              No pudimos encontrar la tienda que buscas.
            </p>
            <Button onClick={() => router.push('/')} variant="default">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const cartItemsCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Picky</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Store Logo/Icon */}
          <div className="text-center">
            <div className="w-24 h-24 bg-white rounded-full shadow-lg mx-auto mb-4 flex items-center justify-center">
              <StoreIcon className="w-12 h-12 text-green-600" />
            </div>
          </div>

          {/* Welcome Message */}
          <Card className="shadow-xl">
            <CardContent className="pt-6 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                ¡Hola!
              </h2>
              <p className="text-lg text-gray-700 mb-1">
                Bienvenido a la experiencia Picky en
              </p>
              <p className="text-2xl font-bold text-green-600 mb-4">
                {store.name}
              </p>
              <p className="text-sm text-gray-600">
                {store.welcomeMessage}
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Primary CTA */}
            <Button
              className="w-full h-14 text-lg shadow-lg"
              size="lg"
              onClick={() => router.push(`/tienda/${storeId}/escanear`)}
            >
              <Camera className="w-6 h-6 mr-2" />
              Iniciar Recorrido
            </Button>

            {/* Secondary Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-12"
                onClick={() => router.push(`/tienda/${storeId}/carrito`)}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Mi Carrito
                {cartItemsCount > 0 && (
                  <Badge className="ml-2" variant="default">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>

              <Button
                variant="outline"
                className="h-12"
                onClick={() => router.push(`/tienda/${storeId}/catalogo`)}
              >
                <Search className="w-5 h-5 mr-2" />
                Ver Catálogo
              </Button>
            </div>
          </div>

          {/* Store Info */}
          <Card className="bg-white/50">
            <CardContent className="pt-4 text-center text-sm text-gray-600">
              <p>{store.address}</p>
              <p className="mt-1">{store.phone}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
