'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Package, User, Eye } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Order } from '@/types/order';

interface OrderCardProps {
  order: Order;
  onViewDetails: (order: Order) => void;
}

const STATUS_COLORS = {
  PAID: 'bg-blue-500',
  PREPARING: 'bg-yellow-500',
  READY_FOR_PICKUP: 'bg-green-500',
  COMPLETED: 'bg-gray-500',
  CANCELLED: 'bg-red-500',
  PENDING_PAYMENT: 'bg-gray-400',
};

export function OrderCard({ order, onViewDetails }: OrderCardProps) {
  const pickedItems = order.items.filter(item => item.isPicked).length;
  const totalItems = order.items.length;
  const pickingProgress = (pickedItems / totalItems) * 100;

  return (
    <Card className="hover:shadow-lg transition-all cursor-pointer group" onClick={() => onViewDetails(order)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-bold">{order.orderNumber}</CardTitle>
            <p className="text-sm text-gray-500 mt-1">{order.customerName}</p>
          </div>
          <Badge className={STATUS_COLORS[order.status]}>
            {order.status === 'PAID' && 'Nuevo'}
            {order.status === 'PREPARING' && 'En Proceso'}
            {order.status === 'READY_FOR_PICKUP' && 'Listo'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {/* Items Progress */}
          <div className="flex items-center gap-2 text-sm">
            <Package className="h-4 w-4 text-gray-500" />
            <span className="font-medium">{pickedItems}/{totalItems} items</span>
            {order.status === 'PREPARING' && (
              <div className="flex-1 ml-2">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-300"
                    style={{ width: `${pickingProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Time */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>
              {formatDistanceToNow(new Date(order.createdAt), { 
                addSuffix: true,
                locale: es 
              })}
            </span>
          </div>

          {/* Picker Assigned */}
          {order.pickerAssignedTo && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{order.pickerAssignedTo}</span>
            </div>
          )}

          {/* Total */}
          <div className="pt-2 border-t">
            <p className="text-lg font-bold text-green-600">{formatPrice(order.total)}</p>
          </div>

          {/* Action Button */}
          <Button 
            variant="outline" 
            className="w-full group-hover:bg-green-50 group-hover:border-green-500 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(order);
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalle
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
