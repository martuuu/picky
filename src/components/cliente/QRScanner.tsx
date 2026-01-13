'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
}

export function QRScanner({ onScanSuccess, onScanError }: QRScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Evitar doble inicialización
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const startScanner = async () => {
      try {
        // Crear instancia del scanner
        const scanner = new Html5Qrcode('qr-reader');
        scannerRef.current = scanner;

        // Configuración del scanner
        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        };

        // Iniciar scanner
        await scanner.start(
          { facingMode: 'environment' }, // Cámara trasera
          config,
          (decodedText) => {
            // Success callback
            if (navigator.vibrate) {
              navigator.vibrate(200); // Vibración al escanear
            }
            
            // Detener scanner después de escaneo exitoso
            scanner.stop().then(() => {
              scanner.clear();
              setIsScanning(false);
              onScanSuccess(decodedText);
            }).catch((err) => {
              console.error('Error stopping scanner after success:', err);
              onScanSuccess(decodedText); // Ejecutar callback aunque falle el stop
            });
          },
          () => {
            // Error callback (se ejecuta constantemente mientras escanea)
            // No hacer nada aquí para evitar spam de errores
          }
        );

        setIsScanning(true);
        setError(null);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error al acceder a la cámara';
        setError(errorMsg);
        if (onScanError) {
          onScanError(errorMsg);
        }
      }
    };

    startScanner();

    // Cleanup
    return () => {
      if (scannerRef.current && isScanning) {
        scannerRef.current
          .stop()
          .then(() => {
            scannerRef.current?.clear();
          })
          .catch((err) => {
            console.error('Error stopping scanner:', err);
          });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar una vez al montar

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="pt-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="font-semibold text-red-900 mb-2">
            No se pudo acceder a la cámara
          </h3>
          <p className="text-sm text-red-700 mb-4">
            {error}
          </p>
          <p className="text-xs text-red-600">
            Asegurate de permitir el acceso a la cámara en la configuración de tu navegador.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative">
      {/* Contenedor del scanner */}
      <div id="qr-reader" className="rounded-lg overflow-hidden shadow-2xl" />
      
      {/* Overlay con instrucciones */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
        Apuntá al código QR del producto
      </div>
    </div>
  );
}
