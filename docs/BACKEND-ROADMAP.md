# 🚀 Backend Roadmap - Picky MVP

Este documento técnico detalla el desarrollo backend completo desde el prototipo funcional hasta producción con integraciones reales.

---

## ✅ Fase 0: MVP Prototipo (100% Completo)

### Estado Actual
- **24 páginas funcionales** con mock data
- **3 Zustand stores** (Cart, User, Picker) con persistencia
- **Mock products/stores** en JSON estático
- **TypeScript 5 strict mode** + Next.js 16.1.1 App Router
- **18 Shadcn/UI components** integrados
- **QR Scanner** con html5-qrcode
- **Framer Motion** para transiciones
- **Recharts** para analytics admin

### Arquitectura Actual
```typescript
// Mock Data Pattern
export const mockProducts = [
  {
    id: "1",
    name: "Adorno Decorativo",
    sku: "DECO-001",
    price: 1299,
    category: "decoracion",
    // ... más campos mock
  }
];

// Zustand Store Pattern
interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  // ... más métodos
}
```

**Listo para migrar a backend real.**

---

## 🔄 Fase 1: Integración MercadoPago (Prioridad Alta)

### 1.1 Setup Inicial

#### Instalación
```bash
npm install mercadopago
npm install @types/mercadopago --save-dev
```

#### Configuración
```typescript
// lib/mercadopago/config.ts
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  options: {
    timeout: 5000,
    idempotencyKey: 'your-unique-key'
  }
});

export const payment = new Payment(client);
export const preference = new Preference(client);
```

#### Variables de Entorno
```env
# .env.local
MERCADOPAGO_ACCESS_TOKEN=TEST-XXXXXXXXXXXXXXX
MERCADOPAGO_PUBLIC_KEY=TEST-XXXXXXXXXXXXXXX
MERCADOPAGO_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_MP_PUBLIC_KEY=TEST-XXXXXXXXXXXXXXX
```

### 1.2 Flujo de Pago Completo

#### Crear Preferencia de Pago
```typescript
// app/api/checkout/create-preference/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { preference } from '@/lib/mercadopago/config';

export async function POST(req: NextRequest) {
  try {
    const { items, orderId, storeId } = await req.json();

    const preferenceData = {
      items: items.map((item: any) => ({
        id: item.sku,
        title: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        currency_id: 'ARS',
        picture_url: item.image
      })),
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/tienda/${storeId}/confirmacion?orderId=${orderId}`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/tienda/${storeId}/checkout?error=payment_failed`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/tienda/${storeId}/pedido/${orderId}?status=pending`
      },
      auto_return: 'approved' as const,
      external_reference: orderId,
      notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/mercadopago`,
      metadata: {
        orderId,
        storeId,
        timestamp: new Date().toISOString()
      },
      payer: {
        email: 'cliente@picky.com.ar',
        name: 'Cliente',
        surname: 'Demo'
      },
      statement_descriptor: 'PICKY',
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    const response = await preference.create({ body: preferenceData });

    return NextResponse.json({
      id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point
    });

  } catch (error: any) {
    console.error('Error creando preferencia:', error);
    return NextResponse.json(
      { error: error.message || 'Error al crear preferencia de pago' },
      { status: 500 }
    );
  }
}
```

#### Componente Checkout
```typescript
// components/cliente/MercadoPagoCheckout.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface MercadoPagoCheckoutProps {
  items: any[];
  orderId: string;
  storeId: string;
}

export function MercadoPagoCheckout({ items, orderId, storeId }: MercadoPagoCheckoutProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, orderId, storeId })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Redirigir a MercadoPago Checkout
      window.location.href = data.sandbox_init_point || data.init_point;

    } catch (error: any) {
      console.error('Error:', error);
      alert('Error al iniciar el pago. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleCheckout} 
      disabled={loading}
      className="w-full"
      size="lg"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Procesando...
        </>
      ) : (
        'Pagar con MercadoPago'
      )}
    </Button>
  );
}
```

### 1.3 Webhooks y Notificaciones

#### Endpoint Webhook
```typescript
// app/api/webhooks/mercadopago/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { payment } from '@/lib/mercadopago/config';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-signature');
    const requestId = req.headers.get('x-request-id');

    // Validar firma HMAC-SHA256
    const expectedSignature = crypto
      .createHmac('sha256', process.env.MERCADOPAGO_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const notification = JSON.parse(body);

    // Procesar notificación según tipo
    if (notification.type === 'payment') {
      const paymentId = notification.data.id;
      const paymentInfo = await payment.get({ id: paymentId });

      const orderId = paymentInfo.external_reference;
      const status = paymentInfo.status;

      // Actualizar orden en la base de datos
      switch (status) {
        case 'approved':
          await updateOrderStatus(orderId, 'paid');
          await notifyCustomer(orderId, 'payment_approved');
          await notifyPicker(orderId);
          break;
        case 'pending':
          await updateOrderStatus(orderId, 'payment_pending');
          break;
        case 'rejected':
          await updateOrderStatus(orderId, 'payment_failed');
          await notifyCustomer(orderId, 'payment_rejected');
          break;
        default:
          console.log(`Estado no manejado: ${status}`);
      }
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('Error procesando webhook:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Helper functions (implementar según tu DB)
async function updateOrderStatus(orderId: string, status: string) {
  // TODO: Actualizar en Prisma/DB
  console.log(`Orden ${orderId} → ${status}`);
}

async function notifyCustomer(orderId: string, type: string) {
  // TODO: Enviar email/push notification
  console.log(`Notificar cliente: ${orderId} - ${type}`);
}

async function notifyPicker(orderId: string) {
  // TODO: Notificar picker disponible
  console.log(`Asignar picker para orden: ${orderId}`);
}
```

### 1.4 Testing y Debugging

#### Tarjetas de Prueba
```typescript
// lib/mercadopago/test-cards.ts
export const TEST_CARDS = {
  MASTERCARD_APPROVED: {
    number: '5031 7557 3453 0604',
    cvv: '123',
    expiration: '11/25'
  },
  VISA_APPROVED: {
    number: '4509 9535 6623 3704',
    cvv: '123',
    expiration: '11/25'
  },
  AMEX_APPROVED: {
    number: '3711 803032 57522',
    cvv: '1234',
    expiration: '11/25'
  },
  REJECTED_INSUFFICIENT_FUNDS: {
    number: '5031 4332 1540 6351',
    cvv: '123',
    expiration: '11/25'
  }
};
```

#### Logging y Monitoreo
```typescript
// lib/mercadopago/logger.ts
export function logPaymentEvent(
  event: 'preference_created' | 'payment_approved' | 'payment_failed' | 'webhook_received',
  data: any
) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    data,
    environment: process.env.NODE_ENV
  };

  console.log('[MercadoPago]', JSON.stringify(logEntry, null, 2));

  // TODO: Enviar a servicio de logging (Sentry, LogRocket, etc.)
}
```

### 1.5 Troubleshooting Común

**Error: "Invalid access token"**
- Verificar que `MERCADOPAGO_ACCESS_TOKEN` esté en `.env.local`
- Confirmar que sea token de TEST (empieza con `TEST-`)
- Regenerar token en el panel de MercadoPago si es necesario

**Error: "Webhook signature mismatch"**
- Verificar que `MERCADOPAGO_WEBHOOK_SECRET` coincida con el configurado en el dashboard
- Asegurar que el body del webhook se lea como texto antes de parsear

**Pagos no actualizan estado**
- Verificar que el webhook esté público (no protegido por auth)
- Confirmar URL en MercadoPago dashboard: `https://tu-dominio.com/api/webhooks/mercadopago`
- Usar ngrok en desarrollo: `ngrok http 3000`

---

## 🏪 Fase 2: Integración Tiendanube (Prioridad Alta)

### 2.1 Setup OAuth2

#### Instalación
```bash
npm install axios
```

#### Configuración
```typescript
// lib/tiendanube/config.ts
export const TIENDANUBE_CONFIG = {
  clientId: process.env.TIENDANUBE_CLIENT_ID!,
  clientSecret: process.env.TIENDANUBE_CLIENT_SECRET!,
  redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/tiendanube/callback`,
  authUrl: 'https://www.tiendanube.com/apps/authorize/token',
  apiUrl: 'https://api.tiendanube.com/v1'
};

export function getAuthorizationUrl(storeId: string) {
  const params = new URLSearchParams({
    client_id: TIENDANUBE_CONFIG.clientId,
    redirect_uri: TIENDANUBE_CONFIG.redirectUri,
    state: storeId // Para identificar la tienda después
  });

  return `https://www.tiendanube.com/apps/authorize/token?${params}`;
}
```

#### Variables de Entorno
```env
TIENDANUBE_CLIENT_ID=your_client_id
TIENDANUBE_CLIENT_SECRET=your_client_secret
TIENDANUBE_WEBHOOK_SECRET=your_webhook_secret
```

### 2.2 Flujo de Autenticación

#### Iniciar OAuth
```typescript
// app/api/auth/tiendanube/authorize/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuthorizationUrl } from '@/lib/tiendanube/config';

export async function GET(req: NextRequest) {
  const storeId = req.nextUrl.searchParams.get('storeId');

  if (!storeId) {
    return NextResponse.json({ error: 'storeId requerido' }, { status: 400 });
  }

  const authUrl = getAuthorizationUrl(storeId);
  return NextResponse.redirect(authUrl);
}
```

#### Callback OAuth
```typescript
// app/api/auth/tiendanube/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { TIENDANUBE_CONFIG } from '@/lib/tiendanube/config';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state'); // storeId

  if (!code || !state) {
    return NextResponse.redirect('/admin/configuracion?error=auth_failed');
  }

  try {
    // Intercambiar código por access token
    const response = await axios.post(TIENDANUBE_CONFIG.authUrl, {
      client_id: TIENDANUBE_CONFIG.clientId,
      client_secret: TIENDANUBE_CONFIG.clientSecret,
      grant_type: 'authorization_code',
      code
    });

    const { access_token, user_id } = response.data;

    // Guardar en base de datos
    await saveStoreCredentials(state, {
      tiendanubeUserId: user_id,
      accessToken: access_token,
      connectedAt: new Date()
    });

    return NextResponse.redirect('/admin/configuracion?success=tiendanube_connected');

  } catch (error: any) {
    console.error('Error en OAuth callback:', error);
    return NextResponse.redirect('/admin/configuracion?error=auth_failed');
  }
}

async function saveStoreCredentials(storeId: string, credentials: any) {
  // TODO: Guardar en Prisma
  console.log(`Credenciales guardadas para tienda ${storeId}`);
}
```

### 2.3 Sincronización de Productos

#### Cliente API Tiendanube
```typescript
// lib/tiendanube/client.ts
import axios, { AxiosInstance } from 'axios';
import { TIENDANUBE_CONFIG } from './config';

export class TiendanubeClient {
  private client: AxiosInstance;

  constructor(private userId: string, private accessToken: string) {
    this.client = axios.create({
      baseURL: `${TIENDANUBE_CONFIG.apiUrl}/${userId}`,
      headers: {
        'Authentication': `bearer ${accessToken}`,
        'User-Agent': 'Picky App (martin@picky.com.ar)'
      }
    });
  }

  // Obtener productos
  async getProducts(page = 1, perPage = 50) {
    try {
      const response = await this.client.get('/products', {
        params: { page, per_page: perPage }
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo productos:', error);
      throw error;
    }
  }

  // Obtener producto por ID
  async getProduct(productId: string) {
    const response = await this.client.get(`/products/${productId}`);
    return response.data;
  }

  // Actualizar stock
  async updateStock(variantId: string, stock: number) {
    const response = await this.client.put(`/products/variants/${variantId}`, {
      stock
    });
    return response.data;
  }

  // Crear orden
  async createOrder(orderData: any) {
    const response = await this.client.post('/orders', orderData);
    return response.data;
  }

  // Actualizar estado de orden
  async updateOrderStatus(orderId: string, status: string) {
    const response = await this.client.put(`/orders/${orderId}`, {
      status
    });
    return response.data;
  }
}
```

#### Sync Endpoint
```typescript
// app/api/sync/tiendanube/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { TiendanubeClient } from '@/lib/tiendanube/client';

export async function POST(req: NextRequest) {
  try {
    const { storeId } = await req.json();

    // Obtener credenciales de la DB
    const store = await getStoreById(storeId);
    if (!store || !store.tiendanubeAccessToken) {
      return NextResponse.json({ error: 'Tienda no conectada' }, { status: 400 });
    }

    const client = new TiendanubeClient(
      store.tiendanubeUserId,
      store.tiendanubeAccessToken
    );

    // Sincronizar productos
    const products = await client.getProducts();

    // Transformar y guardar en DB local
    for (const product of products) {
      await upsertProduct({
        id: product.id.toString(),
        name: product.name.es || product.name,
        sku: product.sku || `TN-${product.id}`,
        price: parseFloat(product.price),
        description: product.description.es || product.description,
        images: product.images.map((img: any) => img.src),
        category: product.categories?.[0]?.name.es || 'Sin categoría',
        stock: product.variants.reduce((sum: number, v: any) => sum + v.stock, 0),
        storeId,
        tiendanubeId: product.id
      });
    }

    return NextResponse.json({
      success: true,
      synced: products.length,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error sincronizando productos:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function getStoreById(storeId: string) {
  // TODO: Implementar con Prisma
  return null;
}

async function upsertProduct(product: any) {
  // TODO: Implementar con Prisma
  console.log('Producto guardado:', product.name);
}
```

### 2.4 Webhooks Tiendanube

#### Registrar Webhooks
```typescript
// lib/tiendanube/webhooks.ts
import { TiendanubeClient } from './client';

export async function registerWebhooks(client: TiendanubeClient) {
  const webhooks = [
    { event: 'order/created', url: '/api/webhooks/tiendanube/order-created' },
    { event: 'order/updated', url: '/api/webhooks/tiendanube/order-updated' },
    { event: 'product/created', url: '/api/webhooks/tiendanube/product-created' },
    { event: 'product/updated', url: '/api/webhooks/tiendanube/product-updated' }
  ];

  for (const webhook of webhooks) {
    await client.client.post('/webhooks', {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}${webhook.url}`,
      event: webhook.event
    });
  }
}
```

#### Procesar Webhooks
```typescript
// app/api/webhooks/tiendanube/product-updated/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-tiendanube-signature');

    // Validar HMAC
    const expectedSignature = crypto
      .createHmac('sha256', process.env.TIENDANUBE_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);

    // Actualizar producto en DB local
    await updateProductFromTiendanube(event.id, event);

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('Error procesando webhook:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function updateProductFromTiendanube(productId: string, data: any) {
  // TODO: Actualizar en Prisma
  console.log(`Producto ${productId} actualizado desde Tiendanube`);
}
```

### 2.5 Multi-Tenant Architecture

```typescript
// lib/tiendanube/multi-tenant.ts
import { TiendanubeClient } from './client';

export class MultiTenantManager {
  private clients: Map<string, TiendanubeClient> = new Map();

  async getClient(storeId: string): Promise<TiendanubeClient> {
    if (this.clients.has(storeId)) {
      return this.clients.get(storeId)!;
    }

    // Cargar credenciales de la DB
    const store = await this.loadStoreCredentials(storeId);
    if (!store) {
      throw new Error(`Tienda ${storeId} no encontrada o no conectada`);
    }

    const client = new TiendanubeClient(
      store.tiendanubeUserId,
      store.tiendanubeAccessToken
    );

    this.clients.set(storeId, client);
    return client;
  }

  private async loadStoreCredentials(storeId: string) {
    // TODO: Cargar desde Prisma
    return null;
  }

  clearCache(storeId?: string) {
    if (storeId) {
      this.clients.delete(storeId);
    } else {
      this.clients.clear();
    }
  }
}

export const multiTenantManager = new MultiTenantManager();
```

---

## 🗄️ Fase 3: Base de Datos Real con Prisma

### 3.1 Setup Prisma + PostgreSQL

#### Instalación
```bash
npm install @prisma/client
npm install prisma --save-dev
npx prisma init
```

#### Schema Completo
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Store {
  id                    String    @id @default(cuid())
  name                  String
  slug                  String    @unique
  address               String
  phone                 String?
  email                 String?
  rating                Float     @default(0)
  
  // Tiendanube Integration
  tiendanubeUserId      String?   @unique
  tiendanubeAccessToken String?
  connectedAt           DateTime?
  
  products              Product[]
  orders                Order[]
  users                 User[]
  
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  
  @@index([slug])
}

model Product {
  id              String      @id @default(cuid())
  sku             String      @unique
  name            String
  description     String?
  price           Float
  compareAtPrice  Float?
  images          String[]
  category        String
  stock           Int         @default(0)
  featured        Boolean     @default(false)
  
  // Tiendanube
  tiendanubeId    String?     @unique
  
  storeId         String
  store           Store       @relation(fields: [storeId], references: [id], onDelete: Cascade)
  
  cartItems       CartItem[]
  orderItems      OrderItem[]
  
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  @@index([storeId, category])
  @@index([sku])
}

model User {
  id              String      @id @default(cuid())
  email           String      @unique
  name            String
  phone           String?
  role            UserRole    @default(CUSTOMER)
  
  // Customer fields
  level           String?     // Gold, Platinum, etc.
  totalOrders     Int         @default(0)
  totalSpent      Float       @default(0)
  
  // Picker fields
  pickerStats     Json?       // { ordersCompleted, avgTime, rating }
  
  storeId         String?
  store           Store?      @relation(fields: [storeId], references: [id])
  
  orders          Order[]
  pickedOrders    Order[]     @relation("PickerOrders")
  cart            Cart?
  
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  @@index([email])
  @@index([storeId, role])
}

enum UserRole {
  CUSTOMER
  PICKER
  ADMIN
}

model Cart {
  id        String     @id @default(cuid())
  userId    String     @unique
  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  items     CartItem[]
  
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

model CartItem {
  id        String   @id @default(cuid())
  quantity  Int
  
  cartId    String
  cart      Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)
  
  productId String
  product   Product  @relation(fields: [productId], references: [id])
  
  @@unique([cartId, productId])
}

model Order {
  id              String       @id @default(cuid())
  orderNumber     String       @unique
  status          OrderStatus  @default(PENDING)
  total           Float
  
  // Payment
  paymentStatus   PaymentStatus @default(PENDING)
  paymentMethod   String?
  mercadopagoId   String?       @unique
  
  // Picking
  pickerId        String?
  picker          User?         @relation("PickerOrders", fields: [pickerId], references: [id])
  pickedAt        DateTime?
  
  // Customer
  customerId      String
  customer        User          @relation(fields: [customerId], references: [id])
  
  // Store
  storeId         String
  store           Store         @relation(fields: [storeId], references: [id])
  
  items           OrderItem[]
  
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  @@index([customerId])
  @@index([pickerId])
  @@index([storeId, status])
  @@index([orderNumber])
}

enum OrderStatus {
  PENDING
  PAYMENT_PENDING
  PAID
  PICKING
  READY
  COMPLETED
  CANCELLED
}

enum PaymentStatus {
  PENDING
  APPROVED
  REJECTED
  REFUNDED
}

model OrderItem {
  id        String  @id @default(cuid())
  quantity  Int
  price     Float   // Precio al momento de la compra
  
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  productId String
  product   Product @relation(fields: [productId], references: [id])
  
  @@unique([orderId, productId])
}
```

### 3.2 Migraciones y Seed

#### Crear migración
```bash
npx prisma migrate dev --name init
```

#### Seed inicial
```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Crear tienda demo
  const store = await prisma.store.create({
    data: {
      name: 'Deco Home Demo',
      slug: 'demo',
      address: 'Av. Corrientes 1234, CABA',
      phone: '+54 11 4567-8900',
      email: 'contacto@decohome.com.ar',
      rating: 4.8
    }
  });

  // Crear productos demo
  await prisma.product.createMany({
    data: [
      {
        sku: 'DECO-001',
        name: 'Adorno Decorativo',
        description: 'Hermoso adorno para decorar tu hogar',
        price: 1299,
        images: ['/images/productos/adorno-deco.jpg'],
        category: 'decoracion',
        stock: 15,
        featured: true,
        storeId: store.id
      },
      // ... más productos
    ]
  });

  console.log('✅ Seed completado');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

```json
// package.json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

### 3.3 Cliente Prisma Singleton

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### 3.4 Migrar Stores de Mock a Prisma

#### Antes (Mock)
```typescript
// stores/useCartStore.ts con mock
const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity) => set((state) => ({
        items: [...state.items, { ...product, quantity }]
      }))
    }),
    { name: 'cart-storage' }
  )
);
```

#### Después (Con DB)
```typescript
// stores/useCartStore.ts con Prisma
import { prisma } from '@/lib/prisma';

export async function addToCart(userId: string, productId: string, quantity: number) {
  const cart = await prisma.cart.upsert({
    where: { userId },
    create: {
      userId,
      items: {
        create: { productId, quantity }
      }
    },
    update: {
      items: {
        upsert: {
          where: {
            cartId_productId: {
              cartId: (await prisma.cart.findUnique({ where: { userId } }))!.id,
              productId
            }
          },
          create: { productId, quantity },
          update: { quantity: { increment: quantity } }
        }
      }
    },
    include: {
      items: {
        include: { product: true }
      }
    }
  });

  return cart;
}
```

---

## 🔐 Fase 4: Autenticación con NextAuth.js

### 4.1 Setup

```bash
npm install next-auth@beta
npm install @auth/prisma-adapter
```

### 4.2 Configuración

```typescript
// auth.ts
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials) => {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });

        if (!user) return null;

        // TODO: Verificar password con bcrypt
        return user;
      }
    })
  ],
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        role: user.role
      }
    })
  }
});
```

### 4.3 Proteger Rutas

```typescript
// middleware.ts
import { auth } from '@/auth';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user?.role === 'ADMIN';

  if (req.nextUrl.pathname.startsWith('/admin') && !isAdmin) {
    return Response.redirect(new URL('/login', req.url));
  }

  if (req.nextUrl.pathname.startsWith('/picker') && !isLoggedIn) {
    return Response.redirect(new URL('/login', req.url));
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
```

---

## 🚀 Fase 5: Requerimientos de Cliente

### 5.1 Notificaciones Push (PWA)

```typescript
// lib/push-notifications.ts
export async function subscribeUserToPush() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    });

    // Guardar subscription en DB
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription)
    });
  }
}
```

### 5.2 Sistema de Reseñas

```prisma
model Review {
  id          String   @id @default(cuid())
  rating      Int      // 1-5
  comment     String?
  
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  
  createdAt   DateTime @default(now())
  
  @@unique([userId, productId])
}
```

### 5.3 Programa de Fidelidad

```prisma
model LoyaltyPoints {
  id          String   @id @default(cuid())
  points      Int      @default(0)
  level       String   @default("Bronze") // Bronze, Silver, Gold, Platinum
  
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id])
  
  transactions LoyaltyTransaction[]
}

model LoyaltyTransaction {
  id          String   @id @default(cuid())
  points      Int
  type        String   // earned, redeemed
  description String
  
  loyaltyId   String
  loyalty     LoyaltyPoints @relation(fields: [loyaltyId], references: [id])
  
  createdAt   DateTime @default(now())
}
```

### 5.4 Geolocalización de Tiendas

```typescript
// lib/geolocation.ts
export async function findNearestStores(lat: number, lng: number, radius = 5000) {
  const stores = await prisma.store.findMany();

  return stores
    .map(store => ({
      ...store,
      distance: calculateDistance(lat, lng, store.latitude, store.longitude)
    }))
    .filter(store => store.distance <= radius)
    .sort((a, b) => a.distance - b.distance);
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // Radio de la Tierra en metros
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
```

### 5.5 Analytics Avanzado

```prisma
model AnalyticsEvent {
  id          String   @id @default(cuid())
  event       String   // product_view, add_to_cart, purchase, etc.
  properties  Json
  
  userId      String?
  storeId     String
  
  createdAt   DateTime @default(now())
  
  @@index([storeId, event, createdAt])
}
```

```typescript
// lib/analytics.ts
export async function trackEvent(
  event: string,
  properties: Record<string, any>,
  userId?: string,
  storeId?: string
) {
  await prisma.analyticsEvent.create({
    data: {
      event,
      properties,
      userId,
      storeId
    }
  });
}
```

---

## 📋 Checklist de Implementación

### Fase 1: MercadoPago
- [ ] Configurar credenciales TEST
- [ ] Implementar API crear preferencia
- [ ] Integrar componente checkout
- [ ] Configurar webhook
- [ ] Validar firmas HMAC
- [ ] Implementar manejo de estados (approved/pending/rejected)
- [ ] Testing con tarjetas de prueba
- [ ] Migrar a producción con credenciales reales

### Fase 2: Tiendanube
- [ ] Crear app en Tiendanube Partners
- [ ] Implementar flujo OAuth2
- [ ] Desarrollar cliente API
- [ ] Sincronizar productos (inicial)
- [ ] Configurar webhooks (product/order)
- [ ] Implementar actualización de stock bidireccional
- [ ] Testing multi-tenant
- [ ] Documentar para clientes

### Fase 3: Base de Datos
- [ ] Setup PostgreSQL (Supabase/Railway/Vercel Postgres)
- [ ] Definir schema Prisma completo
- [ ] Crear migraciones
- [ ] Implementar seed con datos demo
- [ ] Migrar stores de Zustand a DB
- [ ] Implementar caching (Redis/Upstash)
- [ ] Setup backups automáticos

### Fase 4: Autenticación
- [ ] Configurar NextAuth.js
- [ ] Implementar login/registro
- [ ] Proteger rutas admin/picker
- [ ] Roles y permisos
- [ ] Session management
- [ ] Password reset flow

### Fase 5: Features Adicionales
- [ ] Sistema de reseñas
- [ ] Programa de fidelidad
- [ ] Notificaciones push
- [ ] Geolocalización
- [ ] Analytics avanzado
- [ ] Búsqueda con filtros
- [ ] Wishlist/Favoritos

---

## 🎯 Métricas de Éxito

- **Pagos**: 95%+ tasa de aprobación MercadoPago
- **Sync**: <5min latencia Tiendanube webhooks
- **Performance**: <200ms query time promedio DB
- **Uptime**: 99.9% availability
- **UX**: <3seg tiempo carga páginas

---

**Última actualización:** Enero 2025  
**Mantenedor:** Martín Navarro  
**Email:** martin@picky.com.ar
