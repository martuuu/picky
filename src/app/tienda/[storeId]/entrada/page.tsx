'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, QrCode } from 'lucide-react';
import { QRScanner } from '@/components/cliente/QRScanner';
import { toast } from 'sonner';
import mockStores from '@/data/mock-stores.json';

export default function EntradaPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;

  const [scanning, setScanning] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [manualCode, setManualCode] = useState('');

  // Verificar si ya tiene acceso válido
  useEffect(() => {
    const checkExistingAccess = () => {
      const entryKey = `picky_entry_validated_${storeId}`;
      const entryData = localStorage.getItem(entryKey);
      
      if (entryData) {
        const parsed = JSON.parse(entryData);
        const validUntil = new Date(parsed.validUntil);
        
        // Si la entrada aún es válida (24 horas)
        if (validUntil > new Date()) {
          // Redirigir directamente a store landing
          router.push(`/tienda/${storeId}`);
          return;
        } else {
          // Limpiar entrada expirada
          localStorage.removeItem(entryKey);
        }
      }
    };

    checkExistingAccess();
  }, [storeId, router]);

  const handleScanSuccess = (decodedText: string) => {
    try {
      // Intentar parsear QR de entrada
      const qrData = JSON.parse(decodedText);
      
      // Validar que sea un QR de entrada válido
      if (qrData.type === 'STORE_ENTRY' && qrData.storeId === storeId) {
        handleAccessGranted(qrData.entryPoint || 'Entrada Principal');
      } else {
        toast.error('QR inválido', {
          description: 'Este no es un código de entrada válido',
        });
      }
    } catch {
      // Si no es JSON, verificar si es el storeId directo (simulación)
      if (decodedText === storeId || decodedText.includes(storeId)) {
        handleAccessGranted('Entrada Principal');
      } else {
        toast.error('Código no reconocido', {
          description: 'Por favor escaneá el QR de entrada del local',
        });
      }
    }
  };

  const handleAccessGranted = (entryPoint: string) => {
    // Vibration feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }

    // Guardar entrada en localStorage con TTL de 24 horas
    const entryKey = `picky_entry_validated_${storeId}`;
    const validUntil = new Date();
    validUntil.setHours(validUntil.getHours() + 24);

    const entryData = {
      storeId,
      entryPoint,
      timestamp: new Date().toISOString(),
      validUntil: validUntil.toISOString(),
      deviceInfo: navigator.userAgent,
    };

    localStorage.setItem(entryKey, JSON.stringify(entryData));

    // Registrar en analytics (mock)
    const analytics = JSON.parse(localStorage.getItem('picky_analytics') || '[]');
    analytics.push({
      event: 'STORE_ENTRY',
      storeId,
      entryPoint,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('picky_analytics', JSON.stringify(analytics));

    // Mostrar animación de éxito
    setAccessGranted(true);
    toast.success('¡Acceso permitido!', {
      description: `Bienvenido - ${entryPoint}`,
    });

    // Redirigir después de animación
    setTimeout(() => {
      router.push(`/tienda/${storeId}`);
    }, 2000);
  };

  const handleManualEntry = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!manualCode.trim()) {
      toast.error('Ingresá el código de acceso');
      return;
    }

    // Simular validación de código manual
    if (manualCode === storeId || manualCode === 'DEMO' || manualCode === '1234') {
      handleAccessGranted('Entrada Manual');
    } else {
      toast.error('Código incorrecto', {
        description: 'Verificá el código e intentá nuevamente',
      });
    }
  };

  const handleSimulateEntry = () => {
    handleAccessGranted('Entrada Simulada - Demo');
  };

  // Buscar datos de la tienda
  const store = mockStores.stores.find((s: { id: string }) => s.id === storeId);

  if (accessGranted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-green-50 to-blue-50">
        <div className="text-center animate-in fade-in zoom-in duration-500">
          <CheckCircle2 className="w-24 h-24 text-green-600 mx-auto mb-4 animate-bounce" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Acceso Permitido!
          </h1>
          <p className="text-gray-600">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="text-center">
            <QrCode className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h1 className="text-xl font-bold text-white">
              Escaneá el QR de Entrada
            </h1>
            {store && (
              <p className="text-sm text-gray-400 mt-1">
                {store.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Scanner */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            {!scanning ? (
              <div className="text-center space-y-4">
                <div className="bg-gray-700 rounded-lg p-8">
                  <QrCode className="w-16 h-16 text-gray-500 mx-auto" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-white">
                    Bienvenido a {store?.name || 'la tienda'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Escaneá el código QR ubicado en la entrada del local para comenzar tu experiencia Picky
                  </p>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setScanning(true)}
                >
                  <QrCode className="w-5 h-5 mr-2" />
                  Activar Cámara
                </Button>

                {/* Código Manual */}
                <div className="pt-4 border-t border-gray-700">
                  <form onSubmit={handleManualEntry} className="space-y-3">
                    <p className="text-xs text-gray-500 text-center">
                      ¿No funciona el scanner? Ingresá el código manualmente
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value)}
                        placeholder="Código de acceso"
                        className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <Button type="submit" variant="outline">
                        Entrar
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Demo Mode */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="pt-4 border-t border-gray-700">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={handleSimulateEntry}
                    >
                      🎭 Simular Entrada (Demo)
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <QRScanner
                  onScanSuccess={handleScanSuccess}
                  onScanError={() => {}}
                />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setScanning(false)}
                >
                  Cancelar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instrucciones */}
        <div className="mt-6 max-w-md">
          <Card className="bg-blue-900/20 border-blue-800">
            <CardContent className="pt-4">
              <h4 className="font-semibold text-blue-200 mb-2 text-sm">
                💡 ¿Dónde está el QR de entrada?
              </h4>
              <ul className="text-xs text-blue-300 space-y-1">
                <li>• En la puerta principal del local</li>
                <li>• En los carteles de bienvenida</li>
                <li>• Preguntale al personal</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
