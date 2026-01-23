'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  Download,
  Share2,
  QrCode as QrCodeIcon,
  Clock,
  MapPin,
  AlertCircle,
  CreditCard
} from 'lucide-react';
import QRCode from 'qrcode';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import type { Order } from '@/types/order';

export default function ConfirmacionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const orderId = searchParams.get('orderId');
  const storeId = params.storeId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }

    const loadOrder = async () => {
      const orders = JSON.parse(localStorage.getItem('picky_orders') || '[]');
      const foundOrder = orders.find((o: Order) => o.id === orderId);
      
      if (foundOrder) {
        setOrder(foundOrder);
        
        // Generate QR Code
        const qrData = JSON.stringify({
          type: 'PICKUP',
          orderId: foundOrder.id,
          orderNumber: foundOrder.orderNumber,
          customerId: foundOrder.customerId,
          total: foundOrder.total,
          storeId: foundOrder.storeId,
        });

        try {
          const url = await QRCode.toDataURL(qrData, {
            width: 400,
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
    link.download = `Picky-Pedido-${order.orderNumber}.png`;
    link.href = qrDataUrl;
    link.click();
    
    toast.success('QR descargado', {
      description: 'Guardá el código en tu galería',
    });
  };

  const handleShareQR = async () => {
    if (!order) return;

    const shareData = {
      title: `Pedido Picky ${order.orderNumber}`,
      text: `Pedido confirmado - Total: ${formatPrice(order.total)}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled
      }
    } else {
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

  const isPendingPayment = order.status === 'PENDING_PAYMENT';

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-br from-green-50 to-blue-50 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(30)].map((_, i) => {
            const left = (i * 3.33) % 100;
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
      <main className="flex-1 p-4 pb-32 pt-8 max-w-2xl mx-auto w-full">
        {/* Success Header */}
        <div className="text-center mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CheckCircle2 className="w-20 h-20 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isPendingPayment ? '¡Pedido Confirmado!' : '¡Pago Exitoso!'}
          </h1>
          <p className="text-lg text-gray-600">
            Pedido <span className="font-mono font-bold">{order.orderNumber}</span>
          </p>
        </div>

        {/* Payment Pending Alert */}
        {isPendingPayment && (
          <Card className="mb-6 border-orange-200 bg-orange-50 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-orange-900 mb-1">
                    Pago Pendiente
                  </p>
                  <p className="text-sm text-orange-800">
                    Realizá el pago en caja al momento de retirar tu pedido.
                  </p>
                  <p className="text-lg font-bold text-orange-900 mt-2">
                    Total a pagar: {formatPrice(order.total)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* QR Code Card - DESTACADO */}
        <Card className="mb-6 border-2 border-green-600 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <CardHeader className="text-center bg-green-50 border-b-2 border-green-200">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <QrCodeIcon className="w-7 h-7" />
              Código de Retiro
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {qrDataUrl ? (
              <div className="space-y-6">
                {/* QR Code Image - Grande */}
                <div className="bg-white p-6 rounded-lg border-4 border-gray-200 mx-auto" style={{ width: 'fit-content' }}>
                  <img
                    src={qrDataUrl}
                    alt={`QR Pedido ${order.orderNumber}`}
                    className="w-full h-auto"
                    style={{ maxWidth: '350px' }}
                  />
                </div>

                {/* Order Details */}
                <div className="text-center space-y-2 pt-4 border-t">
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="default" className="text-lg px-4 py-2 font-mono">
                      {order.orderNumber}
                    </Badge>
                  </div>
                  <p className="text-gray-600">
                    {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
                  </p>
                  {!isPendingPayment && (
                    <p className="text-2xl font-bold text-green-600">
                      {formatPrice(order.total)}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleDownloadQR}
                    className="h-12"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Descargar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleShareQR}
                    className="h-12"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Compartir
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto" />
                <p className="mt-4 text-gray-600">Generando código QR...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* How to Pickup - DESTACADO */}
        <Card className="mb-6 border-2 border-blue-600 bg-blue-50 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-blue-900">
              <MapPin className="w-6 h-6" />
              Cómo Retirar tu Pedido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                  1
                </div>
                <div>
                  <p className="font-semibold text-blue-900">Esperá la notificación</p>
                  <p className="text-sm text-blue-800">
                    Te avisaremos cuando tu pedido esté listo para retirar
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                  2
                </div>
                <div>
                  <p className="font-semibold text-blue-900">Dirigite al punto de retiro</p>
                  <p className="text-sm text-blue-800">
                    Buscá el sector &quot;Retiro Picky&quot; o preguntale al personal
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                  3
                </div>
                <div>
                  <p className="font-semibold text-blue-900">Mostrá el código QR</p>
                  <p className="text-sm text-blue-800">
                    El personal escaneará tu código y te entregará el pedido
                  </p>
                </div>
              </div>

              {isPendingPayment && (
                <div className="flex items-start gap-3 pt-3 border-t border-blue-300">
                  <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold shrink-0">
                    4
                  </div>
                  <div>
                    <p className="font-semibold text-orange-900">Realizá el pago</p>
                    <p className="text-sm text-orange-800">
                      Pagá en caja antes de retirar: {formatPrice(order.total)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Time Stats */}
            <div className="bg-white rounded-lg p-4 border border-blue-200 space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-blue-600 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Duración total de tu compra</p>
                  <p className="text-xl font-bold text-gray-900">
                    {(() => {
                      const now = new Date();
                      const created = new Date(order.createdAt);
                      const diffMinutes = Math.floor((now.getTime() - created.getTime()) / 60000);
                      return `${diffMinutes} ${diffMinutes === 1 ? 'minuto' : 'minutos'}`;
                    })()}
                  </p>
                </div>
              </div>
              
              <div className="border-t border-blue-100 pt-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Tiempo de espera para retiro</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ~{order.estimatedPrepTime} minutos
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="pt-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700 space-y-1">
                <p>• Guardá este código QR hasta retirar tu pedido</p>
                <p>• Podés descargar la imagen para tenerla offline</p>
                <p>• Si tenés problemas, mostrá el número de pedido: <span className="font-mono font-bold">{order.orderNumber}</span></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Bottom Action */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
        <div className="max-w-2xl mx-auto">
          <Button
            className="w-full h-14 text-lg"
            onClick={() => router.push(`/tienda/${storeId}/escanear`)}
          >
            Seguir Comprando
          </Button>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotateZ(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotateZ(360deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </div>
  );
}
