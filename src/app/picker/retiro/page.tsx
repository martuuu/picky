'use client';

import { useState, useRef, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { QrCode, Camera, CameraOff, Package, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { usePickerStore } from '@/stores/usePickerStore';
import { formatPrice } from '@/lib/utils';
import type { Order } from '@/types/order';

export default function RetiroPage() {
  const { orders, loadOrders, updateOrderStatus } = usePickerStore();
  const [scanning, setScanning] = useState(false);
  const [manualOrderNumber, setManualOrderNumber] = useState('');
  const [validatedOrder, setValidatedOrder] = useState<Order | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const videoRef = useRef<boolean>(false);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const startScanning = async () => {
    try {
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;
      videoRef.current = true;

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleQRSuccess(decodedText);
        },
        () => {
          // Error callback (silent)
        }
      );

      setScanning(true);
    } catch (err) {
      console.error('Error starting camera:', err);
      toast.error('No se pudo acceder a la cámara');
    }
  };

  const stopScanning = () => {
    if (scannerRef.current && videoRef.current) {
      scannerRef.current
        .stop()
        .then(() => {
          scannerRef.current?.clear();
          videoRef.current = false;
          setScanning(false);
        })
        .catch((err) => {
          console.error('Error stopping camera:', err);
        });
    }
  };

  const handleQRSuccess = (orderNumber: string) => {
    stopScanning();
    validateOrder(orderNumber);
  };

  const handleManualValidation = () => {
    if (!manualOrderNumber.trim()) {
      toast.error('Ingresá el número de pedido');
      return;
    }
    validateOrder(manualOrderNumber);
  };

  const validateOrder = (orderNumber: string) => {
    loadOrders(); // Refresh orders
    
    const order = orders.find(
      (o) => o.orderNumber.toUpperCase() === orderNumber.toUpperCase()
    );

    if (!order) {
      toast.error('Pedido no encontrado');
      setValidatedOrder(null);
      return;
    }

    if (order.status !== 'READY_FOR_PICKUP') {
      toast.error(`Este pedido está en estado: ${order.status}`);
      setValidatedOrder(null);
      return;
    }

    setValidatedOrder(order);
    toast.success('¡Pedido validado!');
    
    // Vibrate on success
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  };

  const handleDeliverOrder = () => {
    if (!validatedOrder) return;

    updateOrderStatus(validatedOrder.id, 'COMPLETED', 'Pedido entregado al cliente');
    toast.success('¡Pedido entregado exitosamente!');
    
    // Reset
    setValidatedOrder(null);
    setManualOrderNumber('');
  };

  const handleCancelValidation = () => {
    setValidatedOrder(null);
    setManualOrderNumber('');
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Escanear Retiro</h1>
        <p className="text-gray-600">
          Validá el código QR del pedido para confirmar la entrega al cliente
        </p>
      </div>

      {!validatedOrder ? (
        <div className="grid md:grid-cols-2 gap-6">
          {/* QR Scanner */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Escanear QR
              </CardTitle>
              <CardDescription>
                Pedí al cliente que muestre el código QR de su pedido
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Video Preview */}
                <div
                  id="qr-reader"
                  className={`w-full aspect-square bg-gray-900 rounded-lg overflow-hidden ${
                    scanning ? '' : 'hidden'
                  }`}
                />

                {!scanning && (
                  <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-500">
                        Iniciá el escaneo para activar la cámara
                      </p>
                    </div>
                  </div>
                )}

                {/* Controls */}
                <Button
                  onClick={scanning ? stopScanning : startScanning}
                  className="w-full"
                  size="lg"
                  variant={scanning ? 'destructive' : 'default'}
                >
                  {scanning ? (
                    <>
                      <CameraOff className="h-5 w-5 mr-2" />
                      Detener Escaneo
                    </>
                  ) : (
                    <>
                      <Camera className="h-5 w-5 mr-2" />
                      Iniciar Escaneo
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Manual Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Ingreso Manual
              </CardTitle>
              <CardDescription>
                O ingresá el número de pedido manualmente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Número de Pedido
                  </label>
                  <Input
                    placeholder="PK-001234"
                    value={manualOrderNumber}
                    onChange={(e) => setManualOrderNumber(e.target.value.toUpperCase())}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleManualValidation();
                      }
                    }}
                    className="text-lg font-mono"
                  />
                </div>

                <Button onClick={handleManualValidation} className="w-full" size="lg">
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Validar Pedido
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Validated Order Details */
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
                Pedido Validado
              </CardTitle>
              <Badge className="bg-green-600 text-white text-lg py-2 px-4">
                {validatedOrder.orderNumber}
              </Badge>
            </div>
            <CardDescription className="text-base">
              Confirmá la entrega al cliente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Datos del Cliente</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nombre:</span>
                    <span className="font-medium">{validatedOrder.customerName}</span>
                  </div>
                  {validatedOrder.customerPhone && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Teléfono:</span>
                      <span className="font-medium">{validatedOrder.customerPhone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Items Summary */}
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Resumen del Pedido</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total de items:</span>
                    <span className="font-medium">{validatedOrder.items.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-bold text-green-600 text-xl">
                      {formatPrice(validatedOrder.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleDeliverOrder}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Confirmar Entrega
                </Button>
                <Button
                  onClick={handleCancelValidation}
                  variant="outline"
                  size="lg"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ready Orders List */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Pedidos Listos para Retirar</CardTitle>
          <CardDescription>
            {orders.filter((o) => o.status === 'READY_FOR_PICKUP').length} pedido(s) esperando
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {orders
              .filter((o) => o.status === 'READY_FOR_PICKUP')
              .map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-sm text-gray-600">{order.customerName}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setManualOrderNumber(order.orderNumber);
                      validateOrder(order.orderNumber);
                    }}
                  >
                    Validar
                  </Button>
                </div>
              ))}

            {orders.filter((o) => o.status === 'READY_FOR_PICKUP').length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No hay pedidos listos para retirar
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
