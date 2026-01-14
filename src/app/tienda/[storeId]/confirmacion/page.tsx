'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  Download,
  Share2,
  Sparkles,
  Home,
  User
} from 'lucide-react';
import QRCode from 'qrcode';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import type { Order } from '@/types/order';

export default function ConfirmacionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<Order | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }

    // Load order asynchronously
    const loadOrder = async () => {
      const orders = JSON.parse(localStorage.getItem('picky_orders') || '[]');
      const foundOrder = orders.find((o: Order) => o.id === orderId);
      
      if (foundOrder) {
        setOrder(foundOrder);
        
        // Generate QR Code
        const qrData = JSON.stringify({
          orderId: foundOrder.id,
          orderNumber: foundOrder.orderNumber,
          customerId: foundOrder.customerId,
          total: foundOrder.total,
        });

        try {
          const url = await QRCode.toDataURL(qrData, {
            width: 300,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF',
            },
          });
          setQrDataUrl(url);
        } catch (err) {
          console.error('QR generation error:', err);
        }

        // Show confetti animation
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    };

    loadOrder();
  }, [orderId, router]);

  const handleDownloadQR = () => {
    if (!qrDataUrl || !order) return;

    const link = document.createElement('a');
    link.download = `Picky-${order.orderNumber}.png`;
    link.href = qrDataUrl;
    link.click();
    
    toast.success('QR descargado', {
      description: 'Guardá el código para retirar tu pedido',
    });
  };

  const handleShareQR = async () => {
    if (!order) return;

    const shareData = {
      title: `Pedido ${order.orderNumber}`,
      text: `Mi pedido de Picky está listo. Total: ${formatPrice(order.total)}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success('Compartido exitosamente');
      } catch {
        // User cancelled
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Enlace copiado al portapapeles');
    }
  };

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-br from-green-50 to-blue-50 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(30)].map((_, i) => {
            // Pre-calculate random values to avoid calling Math.random during render
            const left = (i * 3.33) % 100; // Evenly distribute across width
            const animationDelay = (i % 10) * 0.2;
            const animationDuration = 2 + (i % 4) * 0.5;
            const colorIndex = i % 5;
            const rotation = (i * 36) % 360;
            
            return (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${left}%`,
                top: `-10px`,
                animationDelay: `${animationDelay}s`,
                animationDuration: `${animationDuration}s`,
              }}
            >
              <div
                className={`w-2 h-2 ${
                  ['bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500'][
                    colorIndex
                  ]
                }`}
                style={{
                  transform: `rotate(${rotation}deg)`,
                }}
              />
            </div>
            );
          })}
        </div>
      )}

      {/* Content */}
      <main className="flex-1 p-4 space-y-4 pb-24 pt-4">
        {/* Success Header */}
        <Card className="border-2 border-green-500 bg-white">
          <CardContent className="p-6 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-green-100 mx-auto flex items-center justify-center animate-scale">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">¡Pedido confirmado!</h2>
              <p className="text-gray-600 mt-1">
                Tu pedido está listo para retirar
              </p>
            </div>
            <Badge className="bg-green-600 text-white text-base px-4 py-1">
              Pedido #{order.orderNumber}
            </Badge>
          </CardContent>
        </Card>

        {/* QR Code Card */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="text-center">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Tu código de retiro
              </h3>
              <p className="text-sm text-gray-600">
                Mostrá este QR en el punto de retiro
              </p>
            </div>

            {qrDataUrl && (
              <div className="flex justify-center">
                <div className="p-4 bg-white rounded-xl shadow-lg border-2 border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrDataUrl}
                    alt="QR Code"
                    className="w-64 h-64"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleDownloadQR}
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleShareQR}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartir
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-gray-900">Resumen del pedido</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Cliente</span>
                <span className="font-medium">{order.customerName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Teléfono</span>
                <span className="font-medium">{order.customerPhone}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Productos</span>
                <span className="font-medium">
                  {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Método de pago</span>
                <span className="font-medium">
                  {order.paymentMethod === 'MERCADOPAGO' ? 'MercadoPago' : 
                   order.paymentMethod === 'CARD' ? 'Tarjeta' : 'Efectivo'}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-semibold text-gray-900">Total pagado</span>
                <span className="font-bold text-lg text-green-600">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">¿Cómo retirar tu pedido?</h3>
                <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                  <li>Dirigite al punto de retiro de la tienda</li>
                  <li>Mostrá tu código QR al personal</li>
                  <li>Verificá que tu pedido esté completo</li>
                  <li>¡Listo! Disfrutá tus productos</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Store Location */}
        <Card>
          <CardContent className="p-4 space-y-2">
            <h3 className="font-semibold text-gray-900">Punto de retiro</h3>
            <p className="text-sm text-gray-700 font-medium">{order.storeName}</p>
            <p className="text-sm text-gray-600">Av. Corrientes 1234, CABA</p>
            <p className="text-sm text-gray-600">
              Horario: Lun-Vie 9:00-20:00 | Sáb 10:00-18:00
            </p>
          </CardContent>
        </Card>
      </main>

      {/* Bottom Action */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 space-y-2">
        <div className="grid grid-cols-2 gap-3">
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              const storeId = order.storeId;
              router.push(`/tienda/${storeId}/perfil`);
            }}
          >
            <User className="w-5 h-5 mr-2" />
            Ver Mi Perfil
          </Button>
          <Button
            size="lg"
            className="bg-green-600 hover:bg-green-700"
            onClick={() => {
              const storeId = order.storeId;
              router.push(`/tienda/${storeId}/catalogo`);
            }}
          >
            <Home className="w-5 h-5 mr-2" />
            Seguir Comprando
          </Button>
        </div>
        <p className="text-xs text-center text-gray-500">
          Guardá este QR para retirar tu pedido
        </p>
      </footer>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        .animate-confetti {
          animation: confetti linear forwards;
        }

        @keyframes scale {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .animate-scale {
          animation: scale 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
