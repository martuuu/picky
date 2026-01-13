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
  relatedProducts?: string[]; // IDs de productos relacionados
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
