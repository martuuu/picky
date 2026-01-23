export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // Precio sin descuento
  stock: number;
  imageUrl: string;
  images?: string[]; // Múltiples imágenes para carousel
  category: string;
  categoryId: string;
  specifications?: ProductSpecification[];
  bulkDiscounts?: BulkDiscount[];
  volumeDiscounts?: VolumeDiscount[]; // Descuentos por volumen mayorista
  relatedProducts?: string[]; // IDs de productos relacionados
  // Campos mayoristas
  bulkType?: 'small' | 'medium' | 'large' | 'extra-large';
  packaging?: string; // "Caja x 24 unid."
  weight?: number; // kg
  dimensions?: {
    length: number; // cm
    width: number;
    height: number;
  };
  unitType?: 'unit' | 'box' | 'meter' | 'kg' | 'liter'; // Tipo de venta
  unitsPerPackage?: number; // Unidades por paquete/caja
  observations?: string[]; // Observaciones especiales del producto
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface BulkDiscount {
  minQty: number;
  discountPercent: number;
  label?: string; // "Comprá 10 y ahorrá 15%"
}

export interface VolumeDiscount {
  minQuantity: number; // Cantidad mínima
  pricePerUnit: number; // Precio por unidad con descuento
  label?: string; // "Llevá 6 → 15% OFF"
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  productsCount: number;
}

export interface ProductComparison {
  productA: Product;
  productB: Product;
  differences: ComparisonItem[];
}

export interface ComparisonItem {
  attribute: string;
  valueA: string;
  valueB: string;
  isBetter: 'A' | 'B' | 'EQUAL';
}
