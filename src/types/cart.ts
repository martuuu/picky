import { Product, BulkDiscount } from './product';

export interface CartItem {
  id: string;
  productId: string;
  product?: Product; // Denormalizado para UI rápida
  quantity: number;
  observations?: string; // "Sin tornillos, solo tuercas"
  addedAt: Date;
  unitPrice: number;
  totalPrice: number;
  appliedDiscount?: BulkDiscount; // Descuento por volumen aplicado
}

export interface Cart {
  id: string;
  storeId: string;
  sessionId: string;
  items: CartItem[];
  subtotal: number;
  totalDiscount: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartSummary {
  itemsCount: number;
  subtotal: number;
  savings: number;
  total: number;
}

export interface RelatedOffer {
  id: string;
  title: string;
  description: string;
  products: Product[];
  savings: number;
  requiresAllProducts: boolean;
}
