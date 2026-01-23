export type OrderStatus = 
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Order {
  id: string;
  orderNumber: string; // "PK-001234"
  storeId: string;
  storeName: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  totalDiscount: number;
  total: number;
  paymentMethod: 'MERCADOPAGO' | 'CASH_AT_COUNTER' | 'CARD_AT_COUNTER';
  paymentId?: string;
  estimatedPrepTime: number; // minutos
  actualPrepTime?: number;
  qrCode?: string; // QR para validar retiro
  pickerAssignedTo?: string;
  pickerStartedAt?: Date;
  statusHistory: StatusChange[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  observations?: string;
  isPicked: boolean;
  pickedAt?: Date;
  location?: string; // "Pasillo 3, Estante B"
}

export interface StatusChange {
  from: OrderStatus;
  to: OrderStatus;
  timestamp: Date;
  notes?: string;
}

export interface PickingTask {
  orderId: string;
  orderNumber: string;
  customerName: string;
  totalItems: number;
  pickedItems: number;
  priority: 'HIGH' | 'NORMAL' | 'LOW';
  estimatedTime: number;
  items: OrderItem[];
}
