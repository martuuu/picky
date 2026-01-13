# 🔧 BACKEND ROADMAP - Picky

**Última Actualización:** 13 Enero 2026  
**Estado:** 🟡 **POST-MVP** (Backend real después del prototipo frontend)  
**Estrategia:** Frontend-First con Mock Data → Integración Real → Escalabilidad

---

## 📋 RESUMEN EJECUTIVO

El MVP de **Picky** es **Frontend-First** utilizando:
- Mock data (JSON estáticos)
- LocalStorage para persistencia
- Server Actions simulados con latencia artificial

El backend real se implementará en **fases posteriores** una vez validado el MVP con usuarios reales.

---

## 🎯 FASE 0: MVP Prototipo (Frontend-Only)

### **Estado Actual:** ✅ Arquitectura definida en `docs/context.md`

**Stack Simulado:**
- **Server Actions:** Next.js con `await setTimeout(500)` para simular latencia
- **Persistencia:** `localStorage` (carrito, sesiones, órdenes)
- **Sincronización:** `BroadcastChannel` API para sync entre tabs
- **Mock Data:** Archivos JSON estáticos (`mock-products.json`, `mock-stores.json`)

**Limitaciones del MVP:**
- ⚠️ No hay autenticación real (todos son usuarios anónimos)
- ⚠️ Stock NO se decrementa (solo visual)
- ⚠️ Pagos simulados (no hay MercadoPago real)
- ⚠️ Datos se pierden al limpiar localStorage
- ⚠️ No hay analytics reales (solo simulados)

**Ventajas del MVP:**
- ✅ Deploy ultra rápido (solo frontend estático)
- ✅ Costo $0 de infraestructura
- ✅ Validación de UX/UI sin complejidad backend
- ✅ Cambios rápidos sin migraciones de DB
- ✅ Demo funcional para inversores/clientes

---

## 🟢 FASE 1: Integración MercadoPago Sandbox (3-4 días)

### **Objetivo:** Procesar pagos reales en modo desarrollo

### **Tareas:**

#### **1.1 Setup MercadoPago (1h)**

```bash
npm install mercadopago
```

**Crear cuenta:** [MercadoPago Developers](https://www.mercadopago.com.ar/developers/es/guides/overview)

#### **1.2 Server Action para crear Preferencia (2h)**

**Archivo:** `src/actions/payment-actions.ts`

```typescript
'use server';

import mercadopago from 'mercadopago';

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN!,
});

export async function createPaymentPreference(order: {
  items: Array<{
    title: string;
    quantity: number;
    unit_price: number;
  }>;
  totalAmount: number;
  orderId: string;
  storeId: string;
}) {
  try {
    const preference = await mercadopago.preferences.create({
      items: order.items,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/tienda/${order.storeId}/pedido/${order.orderId}?status=success`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/tienda/${order.storeId}/carrito?status=failure`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/tienda/${order.storeId}/pedido/${order.orderId}?status=pending`,
      },
      auto_return: 'approved',
      external_reference: order.orderId,
      notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/mercadopago`,
    });

    return {
      success: true,
      preferenceId: preference.body.id,
      initPoint: preference.body.init_point,
    };
  } catch (error) {
    console.error('Error creating MP preference:', error);
    return {
      success: false,
      error: 'Error al crear preferencia de pago',
    };
  }
}
```

#### **1.3 Webhook para notificaciones (2h)**

**Archivo:** `src/app/api/webhooks/mercadopago/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import mercadopago from 'mercadopago';

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // MercadoPago envía notificaciones de tipo "payment"
    if (body.type === 'payment') {
      const paymentId = body.data.id;
      
      // Obtener detalles del pago
      const payment = await mercadopago.payment.get(paymentId);
      
      if (payment.body.status === 'approved') {
        const orderId = payment.body.external_reference;
        
        // TODO: Actualizar estado de orden en DB
        // Por ahora, actualizar en localStorage via BroadcastChannel
        
        console.log(`Pago aprobado para orden ${orderId}`);
      }
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
```

#### **1.4 Variables de entorno (10min)**

**Archivo:** `.env.local`

```bash
# MercadoPago (Sandbox)
MP_ACCESS_TOKEN=TEST-1234567890-123456-abcdef1234567890abcdef1234567890-123456789
MP_PUBLIC_KEY=TEST-abcdef12-3456-7890-abcd-ef1234567890

# Base URL (para webhooks)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Archivo:** `.env.example`

```bash
# MercadoPago
MP_ACCESS_TOKEN=your_access_token_here
MP_PUBLIC_KEY=your_public_key_here
NEXT_PUBLIC_BASE_URL=https://picky.app
```

#### **1.5 Testing (1-2h)**

- ✅ Crear orden de prueba
- ✅ Generar preferencia de pago
- ✅ Abrir Checkout de MercadoPago
- ✅ Pagar con tarjeta de prueba
- ✅ Verificar que webhook recibe notificación
- ✅ Verificar que orden se marca como "PAID"

**Tarjetas de prueba:** [Tarjetas de Prueba MP](https://www.mercadopago.com.ar/developers/es/docs/checkout-api/testing)

---

## 🟡 FASE 2: Integración Tiendanube Dev API (4-5 días)

### **Objetivo:** Sincronizar catálogo real desde Tiendanube

### **Tareas:**

#### **2.1 Setup Tiendanube (1h)**

**Crear app:** [Tiendanube Partners](https://www.tiendanube.com/partners)

```bash
npm install axios
```

#### **2.2 Server Actions para Tiendanube (3h)**

**Archivo:** `src/lib/adapters/tiendanube.ts`

```typescript
import axios from 'axios';

const TIENDANUBE_API_URL = 'https://api.tiendanube.com/v1';

export class TiendanubeAdapter {
  private accessToken: string;
  private storeId: string;

  constructor(accessToken: string, storeId: string) {
    this.accessToken = accessToken;
    this.storeId = storeId;
  }

  private get headers() {
    return {
      'Authentication': `bearer ${this.accessToken}`,
      'User-Agent': 'Picky (martin@picky.app)',
      'Content-Type': 'application/json',
    };
  }

  async getProducts(params?: {
    page?: number;
    per_page?: number;
    published?: boolean;
  }) {
    const response = await axios.get(
      `${TIENDANUBE_API_URL}/${this.storeId}/products`,
      {
        headers: this.headers,
        params: {
          per_page: 50,
          published: true,
          ...params,
        },
      }
    );

    return response.data.map(this.normalizeProduct);
  }

  async getProduct(productId: string) {
    const response = await axios.get(
      `${TIENDANUBE_API_URL}/${this.storeId}/products/${productId}`,
      {
        headers: this.headers,
      }
    );

    return this.normalizeProduct(response.data);
  }

  async createOrder(order: {
    customer: {
      name: string;
      email?: string;
      phone?: string;
    };
    products: Array<{
      variant_id: string;
      quantity: number;
    }>;
    payment_status: string;
    shipping_pickup: boolean;
  }) {
    const response = await axios.post(
      `${TIENDANUBE_API_URL}/${this.storeId}/orders`,
      order,
      {
        headers: this.headers,
      }
    );

    return response.data;
  }

  // Normalizar producto de Tiendanube a formato Picky
  private normalizeProduct(tnProduct: any) {
    return {
      id: tnProduct.id.toString(),
      sku: tnProduct.sku || `TN-${tnProduct.id}`,
      name: tnProduct.name.es || tnProduct.name,
      description: tnProduct.description?.es || tnProduct.description || '',
      price: Math.round(tnProduct.variants[0].price * 100), // Convertir a centavos
      stock: tnProduct.variants[0].stock || 0,
      category: tnProduct.categories?.[0]?.name?.es || 'General',
      imageUrl: tnProduct.images?.[0]?.src || '/placeholder.jpg',
      images: tnProduct.images?.map((img: any) => img.src) || [],
      unit: 'unidad',
      isActive: tnProduct.published,
      createdAt: new Date(tnProduct.created_at),
      updatedAt: new Date(tnProduct.updated_at),
    };
  }
}
```

**Archivo:** `src/actions/tiendanube-actions.ts`

```typescript
'use server';

import { TiendanubeAdapter } from '@/lib/adapters/tiendanube';

export async function syncTiendanubeProducts(storeConfig: {
  accessToken: string;
  storeId: string;
}) {
  try {
    const adapter = new TiendanubeAdapter(
      storeConfig.accessToken,
      storeConfig.storeId
    );

    const products = await adapter.getProducts();

    // TODO: Guardar en DB real
    // Por ahora, retornar productos para guardar en localStorage

    return {
      success: true,
      products,
      count: products.length,
    };
  } catch (error) {
    console.error('Error syncing Tiendanube:', error);
    return {
      success: false,
      error: 'Error al sincronizar con Tiendanube',
    };
  }
}

export async function createTiendanubeOrder(
  storeConfig: {
    accessToken: string;
    storeId: string;
  },
  order: {
    customerName: string;
    customerEmail?: string;
    customerPhone?: string;
    items: Array<{
      productId: string;
      variantId: string;
      quantity: number;
    }>;
  }
) {
  try {
    const adapter = new TiendanubeAdapter(
      storeConfig.accessToken,
      storeConfig.storeId
    );

    const tnOrder = await adapter.createOrder({
      customer: {
        name: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone,
      },
      products: order.items.map((item) => ({
        variant_id: item.variantId,
        quantity: item.quantity,
      })),
      payment_status: 'paid',
      shipping_pickup: true,
    });

    return {
      success: true,
      orderId: tnOrder.id,
    };
  } catch (error) {
    console.error('Error creating TN order:', error);
    return {
      success: false,
      error: 'Error al crear orden en Tiendanube',
    };
  }
}
```

#### **2.3 UI de Configuración (2h)**

**Archivo:** `src/app/admin/configuracion/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { syncTiendanubeProducts } from '@/actions/tiendanube-actions';
import { toast } from '@/components/ui/use-toast';

export default function ConfiguracionPage() {
  const [config, setConfig] = useState({
    accessToken: '',
    storeId: '',
  });
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await syncTiendanubeProducts(config);
      if (result.success) {
        toast({
          title: 'Sincronización exitosa',
          description: `Se sincronizaron ${result.count} productos`,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Configuración</h1>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          Integración con Tiendanube
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Store ID
            </label>
            <Input
              type="text"
              value={config.storeId}
              onChange={(e) =>
                setConfig({ ...config, storeId: e.target.value })
              }
              placeholder="123456"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Access Token
            </label>
            <Input
              type="password"
              value={config.accessToken}
              onChange={(e) =>
                setConfig({ ...config, accessToken: e.target.value })
              }
              placeholder="abcd1234..."
            />
          </div>

          <Button
            onClick={handleSync}
            disabled={syncing || !config.storeId || !config.accessToken}
            className="w-full"
          >
            {syncing ? 'Sincronizando...' : 'Sincronizar Catálogo Ahora'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
```

#### **2.4 Testing (1-2h)**

- ✅ Conectar tienda de prueba Tiendanube
- ✅ Sincronizar catálogo
- ✅ Verificar que productos se mapean correctamente
- ✅ Crear orden en Tiendanube al pagar en Picky
- ✅ Verificar que orden aparece en panel Tiendanube

---

## 🔴 FASE 3: Database Real con PostgreSQL (5-7 días)

### **Objetivo:** Reemplazar localStorage por DB persistente

### **Stack:**
- **Database:** PostgreSQL (Vercel Postgres o Supabase)
- **ORM:** Prisma
- **Auth:** NextAuth.js (opcional, para multi-tenant)

### **Tareas:**

#### **3.1 Setup Prisma (2h)**

```bash
npm install @prisma/client
npm install -D prisma

npx prisma init
```

#### **3.2 Definir Schema (3h)**

**Archivo:** `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Store {
  id        String   @id @default(cuid())
  name      String
  address   String?
  phone     String?
  logo      String?
  hours     String?
  isActive  Boolean  @default(true)
  
  // Integración
  tnStoreId     String?   @map("tiendanube_store_id")
  tnAccessToken String?   @map("tiendanube_access_token")
  
  products  Product[]
  orders    Order[]
  users     User[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("stores")
}

model Product {
  id          String   @id @default(cuid())
  sku         String   @unique
  name        String
  description String
  price       Int      // En centavos
  stock       Int      @default(0)
  minStock    Int?
  category    String
  imageUrl    String
  images      String[] // Array de URLs
  unit        String   @default("unidad")
  location    String?  // Ubicación en depósito
  isActive    Boolean  @default(true)
  
  storeId     String
  store       Store    @relation(fields: [storeId], references: [id])
  
  // Smart features
  bulkDiscounts Json?    // Array de {minQty, discountPercent}
  relatedProducts String[] // Array de IDs
  
  orderItems  OrderItem[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([storeId])
  @@index([category])
  @@map("products")
}

model User {
  id          String   @id @default(cuid())
  sessionId   String   @unique
  name        String?
  email       String?
  phone       String?
  role        String   @default("CUSTOMER") // CUSTOMER | PICKER | ADMIN
  isAnonymous Boolean  @default(true)
  
  storeId     String
  store       Store    @relation(fields: [storeId], references: [id])
  
  orders      Order[]
  
  createdAt   DateTime @default(now())
  lastLoginAt DateTime @default(now())
  
  @@index([storeId])
  @@index([sessionId])
  @@map("users")
}

enum OrderStatus {
  PENDING_PAYMENT
  PAYMENT_FAILED
  PAID
  PREPARING
  READY_TO_PICKUP
  DELIVERED
  CANCELLED
}

model Order {
  id          String      @id @default(cuid())
  orderNumber String      @unique // ORD-1234
  status      OrderStatus @default(PENDING_PAYMENT)
  
  // Cliente
  customerId   String?
  customer     User?       @relation(fields: [customerId], references: [id])
  customerName String?
  
  // Pricing
  subtotal    Int
  discounts   Int         @default(0)
  total       Int
  
  // Items
  items       OrderItem[]
  
  // Picking
  pickerId         String?
  pickingStartedAt DateTime?
  pickingCompletedAt DateTime?
  
  // Retiro
  pickupQRCode String   @unique
  deliveredAt  DateTime?
  deliveredBy  String?
  
  // Pago
  mpPreferenceId String?
  mpPaymentId    String?
  paidAt         DateTime?
  
  storeId     String
  store       Store    @relation(fields: [storeId], references: [id])
  
  statusHistory Json[]  // Array de {from, to, timestamp, userId}
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([storeId])
  @@index([status])
  @@index([orderNumber])
  @@map("orders")
}

model OrderItem {
  id          String  @id @default(cuid())
  
  productId   String
  product     Product @relation(fields: [productId], references: [id])
  
  orderId     String
  order       Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  sku         String
  name        String
  price       Int     // Precio al momento de la compra
  quantity    Int
  imageUrl    String
  notes       String?
  
  // Picking
  isPicked    Boolean  @default(false)
  pickedAt    DateTime?
  location    String?
  
  @@index([orderId])
  @@index([productId])
  @@map("order_items")
}

model Analytics {
  id          String   @id @default(cuid())
  
  eventType   String   // SCAN | ADD_TO_CART | REMOVE_FROM_CART | PURCHASE | COMPARE
  productId   String?
  productSku  String?
  sessionId   String
  storeId     String
  
  metadata    Json?    // Datos adicionales del evento
  
  createdAt   DateTime @default(now())
  
  @@index([eventType])
  @@index([productId])
  @@index([storeId])
  @@index([createdAt])
  @@map("analytics")
}
```

#### **3.3 Migraciones (1h)**

```bash
npx prisma migrate dev --name init
npx prisma generate
```

#### **3.4 Server Actions para DB (4-6h)**

**Archivo:** `src/actions/product-actions.ts`

```typescript
'use server';

import { prisma } from '@/lib/prisma';

export async function getProducts(storeId: string, filters?: {
  category?: string;
  search?: string;
}) {
  return await prisma.product.findMany({
    where: {
      storeId,
      isActive: true,
      ...(filters?.category && { category: filters.category }),
      ...(filters?.search && {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
    },
    orderBy: {
      name: 'asc',
    },
  });
}

export async function getProductBySku(sku: string) {
  return await prisma.product.findUnique({
    where: { sku },
  });
}

// ... más acciones
```

**Archivo:** `src/lib/prisma.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

#### **3.5 Migrar de localStorage a DB (2-3h)**

- Reemplazar hooks que leen de localStorage
- Usar React Query para caché
- Mantener Zustand solo para UI state

---

## 🟣 FASE 4: Analytics Real (3-4 días)

### **Objetivo:** Track de eventos para insights

### **Eventos a trackear:**

1. **SCAN** - Producto escaneado
2. **ADD_TO_CART** - Producto agregado al carrito
3. **REMOVE_FROM_CART** - Producto eliminado
4. **PURCHASE** - Compra completada
5. **COMPARE** - Productos comparados
6. **CART_ABANDONED** - Carrito abandonado (>30min sin pagar)

### **Implementación:**

**Archivo:** `src/actions/analytics-actions.ts`

```typescript
'use server';

import { prisma } from '@/lib/prisma';

export async function trackEvent(event: {
  eventType: string;
  productId?: string;
  productSku?: string;
  sessionId: string;
  storeId: string;
  metadata?: Record<string, any>;
}) {
  await prisma.analytics.create({
    data: event,
  });
}

export async function getProductAnalytics(storeId: string, dateRange: {
  start: Date;
  end: Date;
}) {
  const events = await prisma.analytics.groupBy({
    by: ['productId', 'eventType'],
    where: {
      storeId,
      createdAt: {
        gte: dateRange.start,
        lte: dateRange.end,
      },
      productId: { not: null },
    },
    _count: true,
  });

  // Procesar y retornar métricas
  return events;
}
```

---

## 🔵 FASE 5: Integraciones SAP/VTEX (Futuro)

### **Objetivo:** Escalabilidad para clientes enterprise

**Arquitectura:**

```typescript
// src/lib/adapters/index.ts
export interface IProductAdapter {
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product>;
  createOrder(order: OrderInput): Promise<string>;
}

// Implementaciones:
// - TiendanubeAdapter (✅ FASE 2)
// - SAPAdapter (⏳ Futuro)
// - VTEXAdapter (⏳ Futuro)

// src/lib/adapters/factory.ts
export function getAdapter(storeConfig: StoreConfig): IProductAdapter {
  switch (storeConfig.provider) {
    case 'TIENDANUBE':
      return new TiendanubeAdapter(storeConfig);
    case 'SAP':
      return new SAPAdapter(storeConfig);
    case 'VTEX':
      return new VTEXAdapter(storeConfig);
    default:
      throw new Error('Provider not supported');
  }
}
```

**Ver:** `docs/middleware-tiendanube-sap.md` para detalles

---

## 📊 RESUMEN DE FASES

| Fase | Objetivo | Duración | Prioridad |
|------|----------|----------|-----------|
| FASE 0 | MVP Frontend-Only | ✅ Completo | 🔴 CRÍTICO |
| FASE 1 | MercadoPago Sandbox | 3-4 días | 🔴 ALTA |
| FASE 2 | Tiendanube Dev API | 4-5 días | 🟡 MEDIA |
| FASE 3 | PostgreSQL + Prisma | 5-7 días | 🟡 MEDIA |
| FASE 4 | Analytics Real | 3-4 días | 🟢 BAJA |
| FASE 5 | SAP/VTEX | TBD | 🟢 FUTURO |

**Total Backend:** ~15-20 días (post-MVP frontend)

---

## 🚀 Estrategia de Deploy

### **MVP (FASE 0):**
```
Vercel (Frontend) → localStorage → Mock Data
Costo: $0/mes
```

### **POST-MVP (FASE 1-2):**
```
Vercel (Frontend + Server Actions)
  ↓
MercadoPago Sandbox
  ↓
Tiendanube Dev API
Costo: $0/mes (sandbox)
```

### **PRODUCCIÓN (FASE 3-4):**
```
Vercel (Frontend + Server Actions)
  ↓
Vercel Postgres ($20/mes)
  ↓
MercadoPago Production
  ↓
Tiendanube/SAP/VTEX
Costo: ~$40-60/mes
```

---

## 📝 Variables de Entorno

**Archivo:** `.env.local`

```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/picky"

# MercadoPago
MP_ACCESS_TOKEN="TEST-xxx"
MP_PUBLIC_KEY="TEST-xxx"

# Tiendanube
TN_CLIENT_ID="xxx"
TN_CLIENT_SECRET="xxx"

# App
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NODE_ENV="development"

# Analytics (opcional)
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

---

## ✅ Checklist Pre-Producción

### **Seguridad:**
- [ ] Variables sensibles en `.env` (nunca en código)
- [ ] CORS configurado correctamente
- [ ] Rate limiting en API routes
- [ ] Validación de inputs (Zod)
- [ ] Sanitización de datos de usuario

### **Performance:**
- [ ] Índices DB en columnas frecuentes
- [ ] Caché con React Query (staleTime)
- [ ] Imágenes optimizadas (Next/Image)
- [ ] Bundle size < 200KB (first load)

### **Monitoring:**
- [ ] Logs centralizados (Vercel Logs)
- [ ] Error tracking (Sentry)
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Analytics dashboard funcionando

### **Testing:**
- [ ] Tests E2E flujo completo (Playwright)
- [ ] Load testing (k6)
- [ ] Testing webhooks MP
- [ ] Testing sincronización TN

---

**Última Actualización:** 13 Enero 2026  
**Autor:** Tech Lead Backend Senior  
**Status:** 📝 Roadmap definido, listo para post-MVP
