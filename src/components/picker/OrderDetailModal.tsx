'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Package, 
  User, 
  Clock, 
  Phone, 
  ChevronRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Order } from '@/types/order';
import { usePickerStore } from '@/stores/usePickerStore';
import { toast } from 'sonner';
import Image from 'next/image';

interface OrderDetailModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}

const STATUS_CONFIG = {
  PAID: { label: 'Nuevo Pedido', color: 'bg-blue-500' },
  PREPARING: { label: 'En Preparación', color: 'bg-yellow-500' },
  READY_FOR_PICKUP: { label: 'Listo para Retiro', color: 'bg-green-500' },
  COMPLETED: { label: 'Completado', color: 'bg-gray-500' },
  CANCELLED: { label: 'Cancelado', color: 'bg-red-500' },
  PENDING_PAYMENT: { label: 'Pago Pendiente', color: 'bg-gray-400' },
};

export function OrderDetailModal({ order, open, onClose }: OrderDetailModalProps) {
  const { toggleItemPicked, updateOrderStatus, assignPicker } = usePickerStore();

  if (!order) return null;

  const pickedItems = order.items.filter(item => item.isPicked).length;
  const totalItems = order.items.length;
  const allItemsPicked = pickedItems === totalItems;

  const handleStartPicking = () => {
    if (!order.pickerAssignedTo) {
      assignPicker(order.id, 'Juan Pérez'); // TODO: Get from auth
    }
    updateOrderStatus(order.id, 'PREPARING', 'Inicio de preparación');
    toast.success('Pedido en preparación');
  };

  const handleMarkReady = () => {
    if (!allItemsPicked) {
      toast.error('Debes marcar todos los items como preparados');
      return;
    }
    updateOrderStatus(order.id, 'READY_FOR_PICKUP', 'Pedido listo para retiro');
    toast.success('¡Pedido listo para retirar!');
    onClose();
  };

  const handleComplete = () => {
    updateOrderStatus(order.id, 'COMPLETED', 'Pedido entregado al cliente');
    toast.success('Pedido completado');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <span>{order.orderNumber}</span>
            <Badge className={STATUS_CONFIG[order.status].color}>
              {STATUS_CONFIG[order.status].label}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Creado {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true, locale: es })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-600" />
              <span className="font-medium">{order.customerName}</span>
            </div>
            {order.customerPhone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">{order.customerPhone}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">
                Tiempo estimado: {order.estimatedPrepTime} min
              </span>
            </div>
          </div>

          {/* Picker Info */}
          {order.pickerAssignedTo && (
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline">
                Preparando: {order.pickerAssignedTo}
              </Badge>
            </div>
          )}

          <Separator />

          {/* Items List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Package className="h-5 w-5" />
                Items del Pedido ({pickedItems}/{totalItems})
              </h3>
              {allItemsPicked && (
                <Badge className="bg-green-500">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Completo
                </Badge>
              )}
            </div>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div 
                  key={item.id} 
                  className={`flex items-start gap-4 p-3 rounded-lg border transition-all ${
                    item.isPicked ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                  }`}
                >
                  {/* Checkbox */}
                  <Checkbox
                    checked={item.isPicked}
                    onCheckedChange={() => toggleItemPicked(order.id, item.id)}
                    className="mt-1"
                    disabled={order.status !== 'PREPARING'}
                  />

                  {/* Image */}
                  <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0">
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.productName}</h4>
                    <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                    {item.location && (
                      <p className="text-xs text-blue-600 mt-1">📍 {item.location}</p>
                    )}
                    {item.observations && (
                      <p className="text-xs text-gray-600 mt-1 italic">
                        &ldquo;{item.observations}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Quantity & Price */}
                  <div className="text-right shrink-0">
                    <p className="font-medium">x{item.quantity}</p>
                    <p className="text-sm text-gray-600">{formatPrice(item.totalPrice)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.totalDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Descuentos</span>
                <span>-{formatPrice(order.totalDiscount)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-green-600">{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {order.status === 'PAID' && (
              <Button 
                className="flex-1" 
                size="lg"
                onClick={handleStartPicking}
              >
                <Package className="h-4 w-4 mr-2" />
                Iniciar Preparación
              </Button>
            )}

            {order.status === 'PREPARING' && (
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700" 
                size="lg"
                onClick={handleMarkReady}
                disabled={!allItemsPicked}
              >
                {allItemsPicked ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Marcar como Listo
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Completa todos los items
                  </>
                )}
              </Button>
            )}

            {order.status === 'READY_FOR_PICKUP' && (
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-700" 
                size="lg"
                onClick={handleComplete}
              >
                <ChevronRight className="h-4 w-4 mr-2" />
                Marcar como Entregado
              </Button>
            )}

            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
