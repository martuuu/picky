export interface ProductAnalytics {
  productId: string;
  productName: string;
  views: number;
  scans: number;
  addedToCart: number;
  purchased: number;
  conversionRate: number; // %
  averageQuantity: number;
  revenue: number;
}

export interface StoreAnalytics {
  storeId: string;
  storeName: string;
  date: string;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  activeCustomers: number;
  topProducts: ProductAnalytics[];
  peakHours: number[]; // [9, 10, 11, 12, 14, 15, 16, 17]
}

export interface AbandonedCart {
  cartId: string;
  storeId: string;
  sessionId: string;
  items: number;
  totalValue: number;
  lastActivityAt: Date;
  reason?: 'NO_STOCK' | 'HIGH_PRICE' | 'LONG_PREP_TIME' | 'UNKNOWN';
}

export interface DashboardMetrics {
  todayOrders: number;
  todayRevenue: number;
  averagePrepTime: number;
  activeCustomers: number;
  ordersGrowth: number; // % vs yesterday
  revenueGrowth: number; // % vs yesterday
}
