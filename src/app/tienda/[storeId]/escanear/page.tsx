'use client';

import { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart, Keyboard, Zap } from 'lucide-react';
import { QRScanner } from '@/components/cliente/QRScanner';
import { useCartStore } from '@/stores/useCartStore';
import { parseProducts } from '@/lib/utils';
import { toast } from 'sonner';
import mockProducts from '@/data/mock-products.json';

export default function EscanearPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;

  const { cart } = useCartStore();
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const scannerStoppedRef = useRef(false);

  const cartItemsCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleScanSuccess = (decodedText: string) => {
    // Prevenir múltiples callbacks
    if (scannerStoppedRef.current) return;
    scannerStoppedRef.current = true;

    const products = parseProducts(mockProducts.products as Record<string, unknown>[]);
    const product = products.find(p => p.sku === decodedText);
    
    if (product) {
      // Vibration feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(200);
      }
      
      router.push(`/tienda/${storeId}/producto/${product.sku}`);
    } else {
      toast.error('Código no reconocido', {
        description: `El código "${decodedText}" no corresponde a ningún producto`,
      });
      // Reset flag para permitir nuevo escaneo si falla
      scannerStoppedRef.current = false;
    }
  };

  const handleScanError = () => {
    // Error silencioso - no molestamos al usuario con errores de cámara constantes
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!manualCode.trim()) {
      toast.error('Ingresá un código', {
        description: 'El campo no puede estar vacío',
      });
      return;
    }

    // Redirect sin validar - acepta cualquier código
    router.push(`/tienda/${storeId}/producto/${manualCode.trim()}`);
  };

  const handleSimulateScan = () => {
    // Simula escaneo de un producto aleatorio
    const products = parseProducts(mockProducts.products as Record<string, unknown>[]);
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    
    toast.success('¡Código escaneado!', {
      description: randomProduct.name,
    });
    
    // Vibration feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(200);
    }
    
    setTimeout(() => {
      router.push(`/tienda/${storeId}/producto/${randomProduct.sku}`);
    }, 500);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-900">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-white hover:bg-gray-800"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </Button>
          
          <h1 className="text-lg font-semibold text-white">Escanear Producto</h1>
          
          <Button
            variant="ghost"
            size="sm"
            className="relative text-white hover:bg-gray-800"
            onClick={() => router.push(`/tienda/${storeId}/carrito`)}
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItemsCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {cartItemsCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* QR Scanner */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          {!showManualInput ? (
            <>
              {/* Scanner Component */}
              <QRScanner
                onScanSuccess={handleScanSuccess}
                onScanError={handleScanError}
              />

              {/* Instructions Card */}
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="pt-4">
                  <div className="space-y-3 text-gray-300">
                    <p className="text-center font-medium text-white">
                      📱 Apuntá la cámara al código QR
                    </p>
                    <ul className="text-sm space-y-2">
                      <li>• Mantené el celular estable</li>
                      <li>• Asegurate de tener buena iluminación</li>
                      <li>• El código se detectará automáticamente</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Demo & Manual Buttons */}
              <div className="space-y-3">
                {/* Simulate Scan Button */}
                <Button
                  variant="outline"
                  className="w-full border-purple-500 text-purple-400 hover:bg-purple-500/10"
                  onClick={handleSimulateScan}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Simular Escaneo (Demo)
                </Button>

                {/* Manual Input Button */}
                <Button
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={() => setShowManualInput(true)}
                >
                  <Keyboard className="w-4 h-4 mr-2" />
                  Ingresar código manualmente
                </Button>

                {/* Catalog Fallback */}
                <Button
                  variant="ghost"
                  className="w-full text-gray-400 hover:text-white hover:bg-gray-800"
                  onClick={() => router.push(`/tienda/${storeId}/catalogo`)}
                >
                  Ver catálogo completo
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Manual Input Form */}
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="pt-6">
                  <form onSubmit={handleManualSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Código del producto
                      </label>
                      <Input
                        value={manualCode}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setManualCode(e.target.value)}
                        placeholder="Ej: OLLA-ACERO-24CM"
                        className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-500"
                        autoFocus
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Ingresá el SKU que aparece en la etiqueta del producto
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                        onClick={() => {
                          setShowManualInput(false);
                          setManualCode('');
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1"
                      >
                        Buscar Producto
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Quick Access Examples */}
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="pt-4">
                  <p className="text-sm font-medium text-gray-300 mb-2">
                    Códigos de ejemplo:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['OLLA-ACERO-24CM', 'JUEGO-PLATOS-18PZ', 'ASPIRADORA-1600W'].map((sku) => (
                      <button
                        key={sku}
                        type="button"
                        onClick={() => setManualCode(sku)}
                        className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
                      >
                        {sku}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
