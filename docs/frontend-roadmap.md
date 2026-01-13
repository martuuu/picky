# 🎨 FRONTEND ROADMAP - Picky

**Última Actualización:** 14 Enero 2026 - 02:30 hs  
**Estado:** 🚀 **MVP Prototipo @ 70%** (12/17 pantallas completas)  
**Objetivo:** Sistema Scan & Go para tiendas físicas (Mobile First)

---

## 📊 PROGRESO ACTUAL

### **✅ Fase 1: Setup Inicial (100% Completado)**
- ✅ Proyecto Next.js 16.1.1 con TypeScript
- ✅ Shadcn/UI + 16 componentes instalados
- ✅ Zustand stores (Cart + User con persist)
- ✅ Mock data (20 productos bazar + 6 categorías + 2 tiendas)
- ✅ TypeScript interfaces completas
- ✅ React Query configurado
- ✅ Servidor corriendo en localhost:3000

### **🎉 Fase 2: Cliente Mobile (90% Completado - 9/10 pantallas)**

**✅ Completadas:**
1. **Landing Principal** - Home con selector de portales
2. **Landing Tienda** - Bienvenida + inicialización de sesión
3. **Catálogo** - Grid 2 col, búsqueda, filtros por categoría, badges de stock/descuentos
4. **Escáner QR** - Camera real + simulador demo + input manual (sin validación)
5. **Product Detail Page (PDP)** - Carousel imágenes, specs accordion, ofertas bulk, related products
6. **Carrito** - Edición inline, stepper de progreso, ofertas dinámicas, resumen con descuentos
7. **Checkout & Pago** ✅ - Simulación MercadoPago + validación inline
8. **Estado del Pedido** ✅ - Real-time tracking con auto-transiciones + ofertas del bar 40% OFF + sugerencia playground
9. **Confirmación** ✅ - QR retiro + confetti + download/share

**⏳ Pendiente:**
10. **Modal Ofertas** - Bottom sheet automático

### **⏳ Fase 3: Picker Desktop (0% - No iniciado - NEXT PRIORITY 🎯)**
- Kanban de pedidos
- Modal detalle de pedido
- Escaneo QR retiro

### **⏳ Fase 4: Admin Dashboard (0% - No iniciado)**
- Analytics + Charts (Recharts)
- Generación masiva QR
- Gestión productos
- Configuración tienda

---

## �📋 RESUMEN EJECUTIVO

**Picky** es una PWA de "Smart Shopping" que transforma la experiencia de compra en tiendas físicas. El MVP se divide en **3 experiencias principales**:

1. **👤 Cliente Mobile** (10 pantallas) - 📱 100% Mobile
2. **📦 Picker Desktop** (3 pantallas) - 💻 Desktop-oriented
3. **📊 Admin Dashboard** (4 pantallas) - 💻 Desktop-oriented

**Total:** 17 pantallas core + componentes reutilizables  
**Duración estimada:** 25-30 días de desarrollo  
**Stack:** Next.js 16.1.1 + TypeScript 5 + Shadcn/UI + Zustand + React Query

**Desglose Cliente Mobile (10 pantallas):**
1. ✅ Landing Principal (home con login)
2. ✅ Landing Tienda (bienvenida del local)
3. ✅ Escáner QR (con simulador + input manual)
4. ✅ Catálogo de Productos (búsqueda, filtros, grid)
5. ✅ PDP (Product Detail Page - completa)
6. ✅ Carrito de Compras (gestión completa)
7. ⏳ Checkout & Pago (PRÓXIMO)
8. ⏳ Estado del Pedido (cliente esperando)
9. ⏳ Confirmación de Retiro
10. ⏳ Modal Ofertas Combinadas (popup automático)

---

## 🎯 FASE 1: Setup Inicial (2-3 días)

### **Objetivo:** Crear estructura base del proyecto

### **Tareas:**

#### **1.1 Inicializar Proyecto Next.js (1h)**

```bash
# Crear proyecto
npx create-next-app@latest picky --typescript --tailwind --app --use-npm

# Responder wizard:
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like to use `src/` directory? … Yes
✔ Would you like to use App Router? … Yes
✔ Would you like to customize the default import alias? … No

cd picky
```

#### **1.2 Instalar Dependencias Core (30min)**

```bash
# UI Components
npx shadcn@latest init
npm install framer-motion lucide-react

# State Management
npm install zustand

# Data Fetching (React Query)
npm install @tanstack/react-query

# QR Scanner
npm install html5-qrcode react-qr-reader

# QR Generator (Admin)
npm install qrcode jspdf

# Utils
npm install date-fns clsx tailwind-merge

# Recharts (Admin Analytics)
npm install recharts

# Dev Dependencies
npm install -D @types/qrcode
```

#### **1.3 Configurar Shadcn/UI (1h)**

```bash
# Instalar componentes base
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add badge
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add sheet
npx shadcn@latest add toast
npx shadcn@latest add tabs
npx shadcn@latest add accordion
npx shadcn@latest add select
npx shadcn@latest add checkbox
npx shadcn@latest add separator
npx shadcn@latest add skeleton
npx shadcn@latest add avatar
npx shadcn@latest add progress
```

#### **1.4 Estructura de Carpetas (30min)**

Crear la estructura completa del proyecto:

```bash
mkdir -p src/app/{tienda/[storeId]/{catalogo,escanear,producto/[sku],carrito,checkout,pedido/[orderId],confirmacion},picker/{pedido/[orderId]},admin/{analytics,productos,configuracion}}
mkdir -p src/components/{ui,cliente,picker,admin}
mkdir -p src/lib/{api,adapters}
mkdir -p src/stores
mkdir -p src/hooks
mkdir -p src/types
mkdir -p src/data
mkdir -p public/images
```

#### **1.5 Configurar Tailwind (30min)**

**Archivo:** `tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores principales de Picky (Verde/Azul, NO rojo)
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e', // Verde principal
          600: '#16a34a',
          700: '#15803d',
        },
        secondary: {
          50: '#eff6ff',
          500: '#3b82f6', // Azul secundario
          600: '#2563eb',
        },
        accent: {
          500: '#f59e0b', // Naranja para alertas
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      animation: {
        'scan-pulse': 'scan-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'confetti': 'confetti 0.5s ease-out',
      },
      keyframes: {
        'scan-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'confetti': {
          '0%': { transform: 'scale(0) rotate(0deg)' },
          '100%': { transform: 'scale(1) rotate(360deg)' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

#### **1.6 Definir TypeScript Interfaces (2h)**

**Archivo:** `src/types/product.ts`

```typescript
export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  longDescription?: string;
  price: number; // En centavos
  stock: number;
  minStock?: number;
  category: string;
  imageUrl: string;
  images?: string[];
  unit: string; // "bolsa" | "unidad" | "litro"
  
  // Smart Features
  bulkDiscounts?: BulkDiscount[];
  relatedProducts?: string[]; // IDs de productos
  comparisonGroup?: string;
  
  // Metadata
  location?: string; // Ubicación en depósito
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface BulkDiscount {
  minQty: number;
  discountPercent: number;
  label?: string;
}
```

**Archivo:** `src/types/cart.ts`

```typescript
export interface CartItem {
  productId: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  notes?: string;
  discountApplied?: number;
  addedAt: Date;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discounts: number;
  total: number;
  storeId: string;
  userId?: string;
  sessionId: string;
  updatedAt: Date;
}
```

**Archivo:** `src/types/order.ts`

```typescript
export type OrderStatus = 
  | 'PENDING_PAYMENT'
  | 'PAYMENT_FAILED'
  | 'PAID'
  | 'PREPARING'
  | 'READY_TO_PICKUP'
  | 'DELIVERED'
  | 'CANCELLED';

export interface Order {
  id: string;
  storeId: string;
  
  // Cliente
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  
  // Items
  items: OrderItem[];
  
  // Pricing
  subtotal: number;
  discounts: number;
  total: number;
  
  // Estado
  status: OrderStatus;
  statusHistory: StatusChange[];
  
  // Picking
  pickerId?: string;
  pickingStartedAt?: Date;
  pickingCompletedAt?: Date;
  estimatedPickingTime?: number;
  
  // Retiro
  pickupQRCode: string;
  deliveredAt?: Date;
  deliveredBy?: string;
  
  // Timestamps
  createdAt: Date;
  paidAt?: Date;
  completedAt?: Date;
}

export interface OrderItem {
  productId: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  notes?: string;
  
  // Picking
  isPicked: boolean;
  pickedAt?: Date;
  location?: string;
}

export interface StatusChange {
  from: OrderStatus;
  to: OrderStatus;
  timestamp: Date;
  userId?: string;
  notes?: string;
}
```

**Archivo:** `src/types/user.ts`

```typescript
export type UserRole = 'CUSTOMER' | 'PICKER' | 'ADMIN' | 'OWNER';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  storeId: string;
  isAnonymous: boolean;
  sessionId: string;
  createdAt: Date;
  lastLoginAt: Date;
}
```

**Archivo:** `src/types/analytics.ts`

```typescript
export interface ProductAnalytics {
  productId: string;
  sku: string;
  name: string;
  scans: number;
  addedToCart: number;
  purchased: number;
  scanToCartRate: number;
  cartToPurchaseRate: number;
  comparedWith: string[];
  period: {
    start: Date;
    end: Date;
  };
}

export interface AbandonedCart {
  cartId: string;
  sessionId: string;
  items: CartItem[];
  total: number;
  abandonedAt: Date;
  reason?: 'NO_STOCK' | 'HIGH_PRICE' | 'UNKNOWN';
}
```

#### **1.7 Crear Mock Data (2-3h)**

**Archivo:** `src/data/mock-products.json`

```json
{
  "products": [
    {
      "id": "prod_001",
      "sku": "CEM-PORT-50KG",
      "name": "Cemento Portland 50kg",
      "description": "Cemento gris de alta resistencia",
      "longDescription": "Ideal para obras de construcción, cimientos y columnas. Tiempo de fraguado: 4-6 horas. Resistencia a la compresión: 42.5 MPa.",
      "price": 125000,
      "stock": 150,
      "minStock": 20,
      "category": "Cemento",
      "imageUrl": "/images/cemento-portland.jpg",
      "unit": "bolsa",
      "bulkDiscounts": [
        { "minQty": 10, "discountPercent": 10, "label": "Comprá 10 y ahorrá 10%" },
        { "minQty": 50, "discountPercent": 18, "label": "Comprá 50 y ahorrá 18%" }
      ],
      "relatedProducts": ["prod_002", "prod_025"],
      "location": "Pasillo A, Estante 1",
      "isActive": true
    },
    {
      "id": "prod_002",
      "sku": "TAL-BOSCH-GSB",
      "name": "Taladro Inalámbrico Bosch GSB 18V",
      "description": "Taladro percutor con batería de litio",
      "longDescription": "Taladro inalámbrico profesional con batería de 18V, 2 velocidades, percutor integrado. Incluye maletín, 2 baterías y cargador.",
      "price": 850000,
      "stock": 8,
      "minStock": 3,
      "category": "Herramientas",
      "imageUrl": "/images/taladro-bosch.jpg",
      "unit": "unidad",
      "relatedProducts": ["prod_003", "prod_004"],
      "location": "Pasillo C, Estante 5",
      "isActive": true
    },
    {
      "id": "prod_003",
      "sku": "PIN-LAT-BLN-20L",
      "name": "Pintura Látex Interior Blanco 20L",
      "description": "Pintura lavable de alta cobertura",
      "longDescription": "Pintura látex acrílica para interiores, blanco mate. Rendimiento: 12-14 m²/litro. Secado al tacto: 30 minutos.",
      "price": 450000,
      "stock": 45,
      "minStock": 10,
      "category": "Pintura",
      "imageUrl": "/images/pintura-latex.jpg",
      "unit": "balde",
      "bulkDiscounts": [
        { "minQty": 3, "discountPercent": 5, "label": "Llevá 3 baldes y ahorrá 5%" }
      ],
      "relatedProducts": ["prod_010", "prod_011"],
      "comparisonGroup": "pinturas-latex",
      "location": "Pasillo B, Estante 2",
      "isActive": true
    }
    // ... (47 productos más)
  ]
}
```

**Archivo:** `src/data/mock-categories.json`

```json
{
  "categories": [
    { "id": "cat_001", "name": "Cemento", "icon": "🏗️", "slug": "cemento" },
    { "id": "cat_002", "name": "Herramientas", "icon": "🔨", "slug": "herramientas" },
    { "id": "cat_003", "name": "Pintura", "icon": "🎨", "slug": "pintura" },
    { "id": "cat_004", "name": "Electricidad", "icon": "⚡", "slug": "electricidad" },
    { "id": "cat_005", "name": "Plomería", "icon": "🚰", "slug": "plomeria" }
  ]
}
```

**Archivo:** `src/data/mock-stores.json`

```json
{
  "stores": [
    {
      "id": "store_001",
      "name": "Ferretería El Tornillo",
      "address": "Av. Siempreviva 742, CABA",
      "phone": "+54 11 1234-5678",
      "logo": "/logos/el-tornillo.png",
      "hours": "Lun-Vie: 8:00-19:00, Sáb: 8:00-13:00",
      "isActive": true
    }
  ]
}
```

#### **1.8 Configurar Zustand Stores (1h)**

**Archivo:** `src/stores/useCartStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, CartItem } from '@/types/cart';

interface CartStore {
  cart: Cart | null;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  initCart: (storeId: string, sessionId: string) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      
      initCart: (storeId: string, sessionId: string) => {
        const existingCart = get().cart;
        if (!existingCart) {
          set({
            cart: {
              items: [],
              subtotal: 0,
              discounts: 0,
              total: 0,
              storeId,
              sessionId,
              updatedAt: new Date(),
            },
          });
        }
      },
      
      addItem: (item: CartItem) => {
        const cart = get().cart;
        if (!cart) return;
        
        const existingItemIndex = cart.items.findIndex(
          (i) => i.productId === item.productId
        );
        
        let newItems: CartItem[];
        if (existingItemIndex >= 0) {
          newItems = [...cart.items];
          newItems[existingItemIndex].quantity += item.quantity;
        } else {
          newItems = [...cart.items, item];
        }
        
        const subtotal = newItems.reduce(
          (acc, i) => acc + i.price * i.quantity,
          0
        );
        
        // Calcular descuentos (simplificado)
        const discounts = 0; // TODO: Implementar lógica de descuentos
        
        set({
          cart: {
            ...cart,
            items: newItems,
            subtotal,
            discounts,
            total: subtotal - discounts,
            updatedAt: new Date(),
          },
        });
      },
      
      removeItem: (productId: string) => {
        const cart = get().cart;
        if (!cart) return;
        
        const newItems = cart.items.filter((i) => i.productId !== productId);
        const subtotal = newItems.reduce(
          (acc, i) => acc + i.price * i.quantity,
          0
        );
        
        set({
          cart: {
            ...cart,
            items: newItems,
            subtotal,
            total: subtotal - cart.discounts,
            updatedAt: new Date(),
          },
        });
      },
      
      updateQuantity: (productId: string, quantity: number) => {
        const cart = get().cart;
        if (!cart) return;
        
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        const newItems = cart.items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );
        
        const subtotal = newItems.reduce(
          (acc, i) => acc + i.price * i.quantity,
          0
        );
        
        set({
          cart: {
            ...cart,
            items: newItems,
            subtotal,
            total: subtotal - cart.discounts,
            updatedAt: new Date(),
          },
        });
      },
      
      clearCart: () => {
        set({ cart: null });
      },
    }),
    {
      name: 'picky-cart-storage',
    }
  )
);
```

**Archivo:** `src/stores/useUserStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/user';

interface UserStore {
  user: User | null;
  sessionId: string | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  initSession: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      sessionId: null,
      
      initSession: () => {
        const sessionId = crypto.randomUUID();
        set({ sessionId });
      },
      
      setUser: (user: User) => {
        set({ user });
      },
      
      clearUser: () => {
        set({ user: null });
      },
    }),
    {
      name: 'picky-user-storage',
    }
  )
);
```

#### **1.9 Configurar React Query (30min)**

**Archivo:** `src/app/providers.tsx`

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minuto
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

**Actualizar:** `src/app/layout.tsx`

```typescript
import { Providers } from './providers';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Picky - Smart In-Store Shopping',
  description: 'Escaneá, comprá y retirá sin cargar',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

#### **1.10 Deploy Inicial a Vercel (30min)**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Seguir wizard:
? Set up and deploy "~/picky"? [Y/n] Y
? Which scope do you want to deploy to? <tu-username>
? Link to existing project? [y/N] N
? What's your project's name? picky
? In which directory is your code located? ./
? Want to override the settings? [y/N] N
```

**Resultado Fase 1:**
- ✅ Proyecto Next.js inicializado
- ✅ Dependencias instaladas
- ✅ Estructura de carpetas creada
- ✅ TypeScript interfaces definidas
- ✅ Mock data creado
- ✅ Zustand stores configurados
- ✅ React Query configurado
- ✅ Deploy inicial funcionando

---

## 🟢 FASE 2: Experiencia Cliente Mobile (7-10 días)

### **Objetivo:** Crear las 8 pantallas del flujo de compra mobile

---

### ✅ **2.1 Pantalla Landing/Onboarding (1 día)** - **COMPLETADO**

**Ruta:** `/tienda/[storeId]/page.tsx`

**Wireframe:**
```
┌─────────────────────────────┐
│     Logo de la Tienda       │
│                             │
│  ¡Hola! Bienvenido a la     │
│  experiencia Picky en       │
│  Ferretería El Tornillo     │
│                             │
│  ┌─────────────────────┐   │
│  │  📸 Iniciar Recorrido │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │  🛒 Ver Mi Carrito   │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │  🔍 Ver Catálogo     │   │
│  └─────────────────────┘   │
│                             │
│  Horario: Lun-Vie 8-19hs   │
└─────────────────────────────┘
```

**Componentes a crear:**

1. **`src/app/tienda/[storeId]/page.tsx`** (Página principal)

```typescript
'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, ShoppingCart, Search } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import { useUserStore } from '@/stores/useUserStore';
import mockStores from '@/data/mock-stores.json';

export default function StoreLandingPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;
  
  const { cart, initCart } = useCartStore();
  const { sessionId, initSession } = useUserStore();
  
  const store = mockStores.stores.find(s => s.id === storeId);
  
  useEffect(() => {
    if (!sessionId) {
      initSession();
    }
    if (!cart && sessionId) {
      initCart(storeId, sessionId);
    }
  }, [sessionId, cart, storeId, initSession, initCart]);
  
  if (!store) {
    return <div>Tienda no encontrada</div>;
  }
  
  const cartItemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header con logo */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-full shadow-lg flex items-center justify-center">
            <span className="text-4xl">🏪</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Hola! Bienvenido a la experiencia Picky en
          </h1>
          <h2 className="text-3xl font-bold text-primary-600 mb-4">
            {store.name}
          </h2>
          <p className="text-gray-600">{store.address}</p>
          <p className="text-sm text-gray-500 mt-2">{store.hours}</p>
        </div>
        
        {/* CTAs principales */}
        <div className="space-y-4">
          <Button
            size="lg"
            className="w-full h-16 text-lg"
            onClick={() => router.push(`/tienda/${storeId}/escanear`)}
          >
            <Camera className="mr-2 h-6 w-6" />
            Iniciar Recorrido
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="w-full h-16 text-lg relative"
            onClick={() => router.push(`/tienda/${storeId}/carrito`)}
          >
            <ShoppingCart className="mr-2 h-6 w-6" />
            Ver Mi Carrito
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                {cartItemCount}
              </span>
            )}
          </Button>
          
          <Button
            size="lg"
            variant="ghost"
            className="w-full h-16 text-lg"
            onClick={() => router.push(`/tienda/${storeId}/catalogo`)}
          >
            <Search className="mr-2 h-6 w-6" />
            Ver Catálogo
          </Button>
        </div>
        
        {/* Info adicional */}
        <Card className="mt-8 p-4 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">
            ¿Cómo funciona Picky?
          </h3>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Escaneá los códigos QR de los productos</li>
            <li>2. Agregá lo que necesitás a tu carrito</li>
            <li>3. Pagá con MercadoPago</li>
            <li>4. Retirá tu pedido preparado ¡Sin cargar nada!</li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
```

**Tareas:**
- ✅ Crear layout base mobile
- ✅ Integrar Zustand para inicializar sesión
- ✅ Detectar storeId de URL
- ✅ Mostrar datos de mock-stores.json
- ✅ Badge de cantidad en botón Carrito
- ✅ Animaciones Framer Motion (opcional)

**Testing:**
- Probar navegación a /escanear, /carrito, /catalogo
- Verificar que sessionId se genera correctamente
- Verificar que badge de carrito muestra cantidad

---

### ✅ **2.2 Pantalla Catálogo de Productos (1.5 días)** - **COMPLETADO**

**Ruta:** `/tienda/[storeId]/catalogo/page.tsx`

**Wireframe:**
```
┌─────────────────────────────┐
│ ← Catálogo      🛒 (3)      │
├─────────────────────────────┤
│ 🔍 Buscar productos...      │
├─────────────────────────────┤
│ 🏗️Cemento 🔨Herram. 🎨Pint.│ <- Tabs horizontales
├─────────────────────────────┤
│ ┌────────┐ ┌────────┐      │
│ │ Imagen │ │ Imagen │      │
│ │Cemento │ │Taladro │      │
│ │$1,250  │ │$8,500  │      │
│ │[+]     │ │[+]     │      │
│ └────────┘ └────────┘      │
│ ┌────────┐ ┌────────┐      │
│ │ ...    │ │ ...    │      │
└─────────────────────────────┘
```

**Componentes a crear:**

1. **`src/components/cliente/ProductCard.tsx`**

```typescript
'use client';

import { Product } from '@/types/product';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  storeId: string;
  inCart?: number; // Cantidad en carrito
}

export function ProductCard({ product, storeId, inCart }: ProductCardProps) {
  const router = useRouter();
  
  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => router.push(`/tienda/${storeId}/producto/${product.sku}`)}
    >
      <div className="relative">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.stock < 10 && (
          <Badge className="absolute top-2 right-2 bg-accent-500">
            Quedan {product.stock}
          </Badge>
        )}
        {inCart && inCart > 0 && (
          <Badge className="absolute top-2 left-2 bg-primary-500">
            {inCart} en carrito
          </Badge>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-1">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-600">
            {formatPrice(product.price)}
          </span>
          <Button size="sm" className="rounded-full">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
```

2. **`src/app/tienda/[storeId]/catalogo/page.tsx`**

```typescript
'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/cliente/ProductCard';
import { ArrowLeft, Search, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import mockProducts from '@/data/mock-products.json';
import mockCategories from '@/data/mock-categories.json';

export default function CatalogoPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;
  const { cart } = useCartStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const filteredProducts = useMemo(() => {
    return mockProducts.products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        product.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory && product.isActive;
    });
  }, [searchQuery, selectedCategory]);
  
  const cartItemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  
  const getProductQuantityInCart = (productId: string) => {
    return cart?.items.find(item => item.productId === productId)?.quantity || 0;
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Catálogo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={() => router.push(`/tienda/${storeId}/carrito`)}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </div>
          
          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>
      
      {/* Tabs de categorías */}
      <div className="bg-white border-b sticky top-[76px] z-10">
        <div className="max-w-md mx-auto px-4 py-2 overflow-x-auto">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="w-full justify-start">
              <TabsTrigger value="all">Todos</TabsTrigger>
              {mockCategories.categories.map((cat) => (
                <TabsTrigger key={cat.id} value={cat.name}>
                  {cat.icon} {cat.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Grid de productos */}
      <div className="max-w-md mx-auto px-4 py-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron productos</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                storeId={storeId}
                inCart={getProductQuantityInCart(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

3. **`src/lib/utils.ts`** (Helper formatPrice)

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(priceInCents / 100);
}
```

#### **1.7 Crear Mock Data (2-3h)**

**Archivo:** `src/data/mock-products.json`

```json
{
  "products": [
    {
      "id": "prod_001",
      "sku": "CEM-PORT-50KG",
      "name": "Cemento Portland 50kg",
      "description": "Cemento gris de alta resistencia",
      "longDescription": "Ideal para obras de construcción, cimientos y columnas. Tiempo de fraguado: 4-6 horas. Resistencia a la compresión: 42.5 MPa.",
      "price": 125000,
      "stock": 150,
      "minStock": 20,
      "category": "Cemento",
      "imageUrl": "/images/cemento-portland.jpg",
      "unit": "bolsa",
      "bulkDiscounts": [
        { "minQty": 10, "discountPercent": 10, "label": "Comprá 10 y ahorrá 10%" },
        { "minQty": 50, "discountPercent": 18, "label": "Comprá 50 y ahorrá 18%" }
      ],
      "relatedProducts": ["prod_002", "prod_025"],
      "location": "Pasillo A, Estante 1",
      "isActive": true
    },
    {
      "id": "prod_002",
      "sku": "TAL-BOSCH-GSB",
      "name": "Taladro Inalámbrico Bosch GSB 18V",
      "description": "Taladro percutor con batería de litio",
      "longDescription": "Taladro inalámbrico profesional con batería de 18V, 2 velocidades, percutor integrado. Incluye maletín, 2 baterías y cargador.",
      "price": 850000,
      "stock": 8,
      "minStock": 3,
      "category": "Herramientas",
      "imageUrl": "/images/taladro-bosch.jpg",
      "unit": "unidad",
      "relatedProducts": ["prod_003", "prod_004"],
      "location": "Pasillo C, Estante 5",
      "isActive": true
    },
    {
      "id": "prod_003",
      "sku": "PIN-LAT-BLN-20L",
      "name": "Pintura Látex Interior Blanco 20L",
      "description": "Pintura lavable de alta cobertura",
      "longDescription": "Pintura látex acrílica para interiores, blanco mate. Rendimiento: 12-14 m²/litro. Secado al tacto: 30 minutos.",
      "price": 450000,
      "stock": 45,
      "minStock": 10,
      "category": "Pintura",
      "imageUrl": "/images/pintura-latex.jpg",
      "unit": "balde",
      "bulkDiscounts": [
        { "minQty": 3, "discountPercent": 5, "label": "Llevá 3 baldes y ahorrá 5%" }
      ],
      "relatedProducts": ["prod_010", "prod_011"],
      "comparisonGroup": "pinturas-latex",
      "location": "Pasillo B, Estante 2",
      "isActive": true
    }
    // ... (47 productos más)
  ]
}
```

**Archivo:** `src/data/mock-categories.json`

```json
{
  "categories": [
    { "id": "cat_001", "name": "Cemento", "icon": "🏗️", "slug": "cemento" },
    { "id": "cat_002", "name": "Herramientas", "icon": "🔨", "slug": "herramientas" },
    { "id": "cat_003", "name": "Pintura", "icon": "🎨", "slug": "pintura" },
    { "id": "cat_004", "name": "Electricidad", "icon": "⚡", "slug": "electricidad" },
    { "id": "cat_005", "name": "Plomería", "icon": "🚰", "slug": "plomeria" }
  ]
}
```

**Archivo:** `src/data/mock-stores.json`

```json
{
  "stores": [
    {
      "id": "store_001",
      "name": "Ferretería El Tornillo",
      "address": "Av. Siempreviva 742, CABA",
      "phone": "+54 11 1234-5678",
      "logo": "/logos/el-tornillo.png",
      "hours": "Lun-Vie: 8:00-19:00, Sáb: 8:00-13:00",
      "isActive": true
    }
  ]
}
```

#### **1.8 Configurar Zustand Stores (1h)**

**Archivo:** `src/stores/useCartStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, CartItem } from '@/types/cart';

interface CartStore {
  cart: Cart | null;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  initCart: (storeId: string, sessionId: string) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      
      initCart: (storeId: string, sessionId: string) => {
        const existingCart = get().cart;
        if (!existingCart) {
          set({
            cart: {
              items: [],
              subtotal: 0,
              discounts: 0,
              total: 0,
              storeId,
              sessionId,
              updatedAt: new Date(),
            },
          });
        }
      },
      
      addItem: (item: CartItem) => {
        const cart = get().cart;
        if (!cart) return;
        
        const existingItemIndex = cart.items.findIndex(
          (i) => i.productId === item.productId
        );
        
        let newItems: CartItem[];
        if (existingItemIndex >= 0) {
          newItems = [...cart.items];
          newItems[existingItemIndex].quantity += item.quantity;
        } else {
          newItems = [...cart.items, item];
        }
        
        const subtotal = newItems.reduce(
          (acc, i) => acc + i.price * i.quantity,
          0
        );
        
        // Calcular descuentos (simplificado)
        const discounts = 0; // TODO: Implementar lógica de descuentos
        
        set({
          cart: {
            ...cart,
            items: newItems,
            subtotal,
            discounts,
            total: subtotal - discounts,
            updatedAt: new Date(),
          },
        });
      },
      
      removeItem: (productId: string) => {
        const cart = get().cart;
        if (!cart) return;
        
        const newItems = cart.items.filter((i) => i.productId !== productId);
        const subtotal = newItems.reduce(
          (acc, i) => acc + i.price * i.quantity,
          0
        );
        
        set({
          cart: {
            ...cart,
            items: newItems,
            subtotal,
            total: subtotal - cart.discounts,
            updatedAt: new Date(),
          },
        });
      },
      
      updateQuantity: (productId: string, quantity: number) => {
        const cart = get().cart;
        if (!cart) return;
        
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        const newItems = cart.items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );
        
        const subtotal = newItems.reduce(
          (acc, i) => acc + i.price * i.quantity,
          0
        );
        
        set({
          cart: {
            ...cart,
            items: newItems,
            subtotal,
            total: subtotal - cart.discounts,
            updatedAt: new Date(),
          },
        });
      },
      
      clearCart: () => {
        set({ cart: null });
      },
    }),
    {
      name: 'picky-cart-storage',
    }
  )
);
```

**Archivo:** `src/stores/useUserStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/user';

interface UserStore {
  user: User | null;
  sessionId: string | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  initSession: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      sessionId: null,
      
      initSession: () => {
        const sessionId = crypto.randomUUID();
        set({ sessionId });
      },
      
      setUser: (user: User) => {
        set({ user });
      },
      
      clearUser: () => {
        set({ user: null });
      },
    }),
    {
      name: 'picky-user-storage',
    }
  )
);
```

#### **1.9 Configurar React Query (30min)**

**Archivo:** `src/app/providers.tsx`

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minuto
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

**Actualizar:** `src/app/layout.tsx`

```typescript
import { Providers } from './providers';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Picky - Smart In-Store Shopping',
  description: 'Escaneá, comprá y retirá sin cargar',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

#### **1.10 Deploy Inicial a Vercel (30min)**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Seguir wizard:
? Set up and deploy "~/picky"? [Y/n] Y
? Which scope do you want to deploy to? <tu-username>
? Link to existing project? [y/N] N
? What's your project's name? picky
? In which directory is your code located? ./
? Want to override the settings? [y/N] N
```

**Resultado Fase 1:**
- ✅ Proyecto Next.js inicializado
- ✅ Dependencias instaladas
- ✅ Estructura de carpetas creada
- ✅ TypeScript interfaces definidas
- ✅ Mock data creado
- ✅ Zustand stores configurados
- ✅ React Query configurado
- ✅ Deploy inicial funcionando

---

## 🟢 FASE 2: Experiencia Cliente Mobile (7-10 días)

### **Objetivo:** Crear las 8 pantallas del flujo de compra mobile

---

### ✅ **2.1 Pantalla Landing/Onboarding (1 día)** - **COMPLETADO**

**Ruta:** `/tienda/[storeId]/page.tsx`

**Wireframe:**
```
┌─────────────────────────────┐
│     Logo de la Tienda       │
│                             │
│  ¡Hola! Bienvenido a la     │
│  experiencia Picky en       │
│  Ferretería El Tornillo     │
│                             │
│  ┌─────────────────────┐   │
│  │  📸 Iniciar Recorrido │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │  🛒 Ver Mi Carrito   │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │  🔍 Ver Catálogo     │   │
│  └─────────────────────┘   │
│                             │
│  Horario: Lun-Vie 8-19hs   │
└─────────────────────────────┘
```

**Componentes a crear:**

1. **`src/app/tienda/[storeId]/page.tsx`** (Página principal)

```typescript
'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, ShoppingCart, Search } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import { useUserStore } from '@/stores/useUserStore';
import mockStores from '@/data/mock-stores.json';

export default function StoreLandingPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;
  
  const { cart, initCart } = useCartStore();
  const { sessionId, initSession } = useUserStore();
  
  const store = mockStores.stores.find(s => s.id === storeId);
  
  useEffect(() => {
    if (!sessionId) {
      initSession();
    }
    if (!cart && sessionId) {
      initCart(storeId, sessionId);
    }
  }, [sessionId, cart, storeId, initSession, initCart]);
  
  if (!store) {
    return <div>Tienda no encontrada</div>;
  }
  
  const cartItemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header con logo */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-full shadow-lg flex items-center justify-center">
            <span className="text-4xl">🏪</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Hola! Bienvenido a la experiencia Picky en
          </h1>
          <h2 className="text-3xl font-bold text-primary-600 mb-4">
            {store.name}
          </h2>
          <p className="text-gray-600">{store.address}</p>
          <p className="text-sm text-gray-500 mt-2">{store.hours}</p>
        </div>
        
        {/* CTAs principales */}
        <div className="space-y-4">
          <Button
            size="lg"
            className="w-full h-16 text-lg"
            onClick={() => router.push(`/tienda/${storeId}/escanear`)}
          >
            <Camera className="mr-2 h-6 w-6" />
            Iniciar Recorrido
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="w-full h-16 text-lg relative"
            onClick={() => router.push(`/tienda/${storeId}/carrito`)}
          >
            <ShoppingCart className="mr-2 h-6 w-6" />
            Ver Mi Carrito
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                {cartItemCount}
              </span>
            )}
          </Button>
          
          <Button
            size="lg"
            variant="ghost"
            className="w-full h-16 text-lg"
            onClick={() => router.push(`/tienda/${storeId}/catalogo`)}
          >
            <Search className="mr-2 h-6 w-6" />
            Ver Catálogo
          </Button>
        </div>
        
        {/* Info adicional */}
        <Card className="mt-8 p-4 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">
            ¿Cómo funciona Picky?
          </h3>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Escaneá los códigos QR de los productos</li>
            <li>2. Agregá lo que necesitás a tu carrito</li>
            <li>3. Pagá con MercadoPago</li>
            <li>4. Retirá tu pedido preparado ¡Sin cargar nada!</li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
```

**Tareas:**
- ✅ Crear layout base mobile
- ✅ Integrar Zustand para inicializar sesión
- ✅ Detectar storeId de URL
- ✅ Mostrar datos de mock-stores.json
- ✅ Badge de cantidad en botón Carrito
- ✅ Animaciones Framer Motion (opcional)

**Testing:**
- Probar navegación a /escanear, /carrito, /catalogo
- Verificar que sessionId se genera correctamente
- Verificar que badge de carrito muestra cantidad

---

### ✅ **2.2 Pantalla Catálogo de Productos (1.5 días)** - **COMPLETADO**

**Ruta:** `/tienda/[storeId]/catalogo/page.tsx`

**Wireframe:**
```
┌─────────────────────────────┐
│ ← Catálogo      🛒 (3)      │
├─────────────────────────────┤
│ 🔍 Buscar productos...      │
├─────────────────────────────┤
│ 🏗️Cemento 🔨Herram. 🎨Pint.│ <- Tabs horizontales
├─────────────────────────────┤
│ ┌────────┐ ┌────────┐      │
│ │ Imagen │ │ Imagen │      │
│ │Cemento │ │Taladro │      │
│ │$1,250  │ │$8,500  │      │
│ │[+]     │ │[+]     │      │
│ └────────┘ └────────┘      │
│ ┌────────┐ ┌────────┐      │
│ │ ...    │ │ ...    │      │
└─────────────────────────────┘
```

**Componentes a crear:**

1. **`src/components/cliente/ProductCard.tsx`**

```typescript
'use client';

import { Product } from '@/types/product';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  storeId: string;
  inCart?: number; // Cantidad en carrito
}

export function ProductCard({ product, storeId, inCart }: ProductCardProps) {
  const router = useRouter();
  
  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => router.push(`/tienda/${storeId}/producto/${product.sku}`)}
    >
      <div className="relative">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.stock < 10 && (
          <Badge className="absolute top-2 right-2 bg-accent-500">
            Quedan {product.stock}
          </Badge>
        )}
        {inCart && inCart > 0 && (
          <Badge className="absolute top-2 left-2 bg-primary-500">
            {inCart} en carrito
          </Badge>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-1">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-600">
            {formatPrice(product.price)}
          </span>
          <Button size="sm" className="rounded-full">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
```

2. **`src/app/tienda/[storeId]/catalogo/page.tsx`**

```typescript
'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/cliente/ProductCard';
import { ArrowLeft, Search, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import mockProducts from '@/data/mock-products.json';
import mockCategories from '@/data/mock-categories.json';

export default function CatalogoPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;
  const { cart } = useCartStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const filteredProducts = useMemo(() => {
    return mockProducts.products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        product.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory && product.isActive;
    });
  }, [searchQuery, selectedCategory]);
  
  const cartItemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  
  const getProductQuantityInCart = (productId: string) => {
    return cart?.items.find(item => item.productId === productId)?.quantity || 0;
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Catálogo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={() => router.push(`/tienda/${storeId}/carrito`)}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </div>
          
          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>
      
      {/* Tabs de categorías */}
      <div className="bg-white border-b sticky top-[76px] z-10">
        <div className="max-w-md mx-auto px-4 py-2 overflow-x-auto">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="w-full justify-start">
              <TabsTrigger value="all">Todos</TabsTrigger>
              {mockCategories.categories.map((cat) => (
                <TabsTrigger key={cat.id} value={cat.name}>
                  {cat.icon} {cat.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Grid de productos */}
      <div className="max-w-md mx-auto px-4 py-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron productos</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                storeId={storeId}
                inCart={getProductQuantityInCart(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

3. **`src/lib/utils.ts`** (Helper formatPrice)

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(priceInCents / 100);
}
```

#### **1.7 Crear Mock Data (2-3h)**

**Archivo:** `src/data/mock-products.json`

```json
{
  "products": [
    {
      "id": "prod_001",
      "sku": "CEM-PORT-50KG",
      "name": "Cemento Portland 50kg",
      "description": "Cemento gris de alta resistencia",
      "longDescription": "Ideal para obras de construcción, cimientos y columnas. Tiempo de fraguado: 4-6 horas. Resistencia a la compresión: 42.5 MPa.",
      "price": 125000,
      "stock": 150,
      "minStock": 20,
      "category": "Cemento",
      "imageUrl": "/images/cemento-portland.jpg",
      "unit": "bolsa",
      "bulkDiscounts": [
        { "minQty": 10, "discountPercent": 10, "label": "Comprá 10 y ahorrá 10%" },
        { "minQty": 50, "discountPercent": 18, "label": "Comprá 50 y ahorrá 18%" }
      ],
      "relatedProducts": ["prod_002", "prod_025"],
      "location": "Pasillo A, Estante 1",
      "isActive": true
    },
    {
      "id": "prod_002",
      "sku": "TAL-BOSCH-GSB",
      "name": "Taladro Inalámbrico Bosch GSB 18V",
      "description": "Taladro percutor con batería de litio",
      "longDescription": "Taladro inalámbrico profesional con batería de 18V, 2 velocidades, percutor integrado. Incluye maletín, 2 baterías y cargador.",
      "price": 850000,
      "stock": 8,
      "minStock": 3,
      "category": "Herramientas",
      "imageUrl": "/images/taladro-bosch.jpg",
      "unit": "unidad",
      "relatedProducts": ["prod_003", "prod_004"],
      "location": "Pasillo C, Estante 5",
      "isActive": true
    },
    {
      "id": "prod_003",
      "sku": "PIN-LAT-BLN-20L",
      "name": "Pintura Látex Interior Blanco 20L",
      "description": "Pintura lavable de alta cobertura",
      "longDescription": "Pintura látex acrílica para interiores, blanco mate. Rendimiento: 12-14 m²/litro. Secado al tacto: 30 minutos.",
      "price": 450000,
      "stock": 45,
      "minStock": 10,
      "category": "Pintura",
      "imageUrl": "/images/pintura-latex.jpg",
      "unit": "balde",
      "bulkDiscounts": [
        { "minQty": 3, "discountPercent": 5, "label": "Llevá 3 baldes y ahorrá 5%" }
      ],
      "relatedProducts": ["prod_010", "prod_011"],
      "comparisonGroup": "pinturas-latex",
      "location": "Pasillo B, Estante 2",
      "isActive": true
    }
    // ... (47 productos más)
  ]
}
```

**Archivo:** `src/data/mock-categories.json`

```json
{
  "categories": [
    { "id": "cat_001", "name": "Cemento", "icon": "🏗️", "slug": "cemento" },
    { "id": "cat_002", "name": "Herramientas", "icon": "🔨", "slug": "herramientas" },
    { "id": "cat_003", "name": "Pintura", "icon": "🎨", "slug": "pintura" },
    { "id": "cat_004", "name": "Electricidad", "icon": "⚡", "slug": "electricidad" },
    { "id": "cat_005", "name": "Plomería", "icon": "🚰", "slug": "plomeria" }
  ]
}
```

**Archivo:** `src/data/mock-stores.json`

```json
{
  "stores": [
    {
      "id": "store_001",
      "name": "Ferretería El Tornillo",
      "address": "Av. Siempreviva 742, CABA",
      "phone": "+54 11 1234-5678",
      "logo": "/logos/el-tornillo.png",
      "hours": "Lun-Vie: 8:00-19:00, Sáb: 8:00-13:00",
      "isActive": true
    }
  ]
}
```

#### **1.8 Configurar Zustand Stores (1h)**

**Archivo:** `src/stores/useCartStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, CartItem } from '@/types/cart';

interface CartStore {
  cart: Cart | null;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  initCart: (storeId: string, sessionId: string) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      
      initCart: (storeId: string, sessionId: string) => {
        const existingCart = get().cart;
        if (!existingCart) {
          set({
            cart: {
              items: [],
              subtotal: 0,
              discounts: 0,
              total: 0,
              storeId,
              sessionId,
              updatedAt: new Date(),
            },
          });
        }
      },
      
      addItem: (item: CartItem) => {
        const cart = get().cart;
        if (!cart) return;
        
        const existingItemIndex = cart.items.findIndex(
          (i) => i.productId === item.productId
        );
        
        let newItems: CartItem[];
        if (existingItemIndex >= 0) {
          newItems = [...cart.items];
          newItems[existingItemIndex].quantity += item.quantity;
        } else {
          newItems = [...cart.items, item];
        }
        
        const subtotal = newItems.reduce(
          (acc, i) => acc + i.price * i.quantity,
          0
        );
        
        // Calcular descuentos (simplificado)
        const discounts = 0; // TODO: Implementar lógica de descuentos
        
        set({
          cart: {
            ...cart,
            items: newItems,
            subtotal,
            discounts,
            total: subtotal - discounts,
            updatedAt: new Date(),
          },
        });
      },
      
      removeItem: (productId: string) => {
        const cart = get().cart;
        if (!cart) return;
        
        const newItems = cart.items.filter((i) => i.productId !== productId);
        const subtotal = newItems.reduce(
          (acc, i) => acc + i.price * i.quantity,
          0
        );
        
        set({
          cart: {
            ...cart,
            items: newItems,
            subtotal,
            total: subtotal - cart.discounts,
            updatedAt: new Date(),
          },
        });
      },
      
      updateQuantity: (productId: string, quantity: number) => {
        const cart = get().cart;
        if (!cart) return;
        
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        const newItems = cart.items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );
        
        const subtotal = newItems.reduce(
          (acc, i) => acc + i.price * i.quantity,
          0
        );
        
        set({
          cart: {
            ...cart,
            items: newItems,
            subtotal,
            total: subtotal - cart.discounts,
            updatedAt: new Date(),
          },
        });
      },
      
      clearCart: () => {
        set({ cart: null });
      },
    }),
    {
      name: 'picky-cart-storage',
    }
  )
);
```

**Archivo:** `src/stores/useUserStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/user';

interface UserStore {
  user: User | null;
  sessionId: string | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  initSession: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      sessionId: null,
      
      initSession: () => {
        const sessionId = crypto.randomUUID();
        set({ sessionId });
      },
      
      setUser: (user: User) => {
        set({ user });
      },
      
      clearUser: () => {
        set({ user: null });
      },
    }),
    {
      name: 'picky-user-storage',
    }
  )
);
```

#### **1.9 Configurar React Query (30min)**

**Archivo:** `src/app/providers.tsx`

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minuto
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

**Actualizar:** `src/app/layout.tsx`

```typescript
import { Providers } from './providers';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Picky - Smart In-Store Shopping',
  description: 'Escaneá, comprá y retirá sin cargar',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

#### **1.10 Deploy Inicial a Vercel (30min)**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Seguir wizard:
? Set up and deploy "~/picky"? [Y/n] Y
? Which scope do you want to deploy to? <tu-username>
? Link to existing project? [y/N] N
? What's your project's name? picky
? In which directory is your code located? ./
? Want to override the settings? [y/N] N
```

**Resultado Fase 1:**
- ✅ Proyecto Next.js inicializado
- ✅ Dependencias instaladas
- ✅ Estructura de carpetas creada
- ✅ TypeScript interfaces definidas
- ✅ Mock data creado
- ✅ Zustand stores configurados
- ✅ React Query configurado
- ✅ Deploy inicial funcionando

---

## 🟢 FASE 2: Experiencia Cliente Mobile (7-10 días)

### **Objetivo:** Crear las 8 pantallas del flujo de compra mobile

---

### ✅ **2.1 Pantalla Landing/Onboarding (1 día)** - **COMPLETADO**

**Ruta:** `/tienda/[storeId]/page.tsx`

**Wireframe:**
```
┌─────────────────────────────┐
│     Logo de la Tienda       │
│                             │
│  ¡Hola! Bienvenido a la     │
│  experiencia Picky en       │
│  Ferretería El Tornillo     │
│                             │
│  ┌─────────────────────┐   │
│  │  📸 Iniciar Recorrido │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │  🛒 Ver Mi Carrito   │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │  🔍 Ver Catálogo     │   │
│  └─────────────────────┘   │
│                             │
│  Horario: Lun-Vie 8-19hs   │
└─────────────────────────────┘
```

**Componentes a crear:**

1. **`src/app/tienda/[storeId]/page.tsx`** (Página principal)

```typescript
'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, ShoppingCart, Search } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import { useUserStore } from '@/stores/useUserStore';
import mockStores from '@/data/mock-stores.json';

export default function StoreLandingPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;
  
  const { cart, initCart } = useCartStore();
  const { sessionId, initSession } = useUserStore();
  
  const store = mockStores.stores.find(s => s.id === storeId);
  
  useEffect(() => {
    if (!sessionId) {
      initSession();
    }
    if (!cart && sessionId) {
      initCart(storeId, sessionId);
    }
  }, [sessionId, cart, storeId, initSession, initCart]);
  
  if (!store) {
    return <div>Tienda no encontrada</div>;
  }
  
  const cartItemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header con logo */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-full shadow-lg flex items-center justify-center">
            <span className="text-4xl">🏪</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Hola! Bienvenido a la experiencia Picky en
          </h1>
          <h2 className="text-3xl font-bold text-primary-600 mb-4">
            {store.name}
          </h2>
          <p className="text-gray-600">{store.address}</p>
          <p className="text-sm text-gray-500 mt-2">{store.hours}</p>
        </div>
        
        {/* CTAs principales */}
        <div className="space-y-4">
          <Button
            size="lg"
            className="w-full h-16 text-lg"
            onClick={() => router.push(`/tienda/${storeId}/escanear`)}
          >
            <Camera className="mr-2 h-6 w-6" />
            Iniciar Recorrido
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="w-full h-16 text-lg relative"
            onClick={() => router.push(`/tienda/${storeId}/carrito`)}
          >
            <ShoppingCart className="mr-2 h-6 w-6" />
            Ver Mi Carrito
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                {cartItemCount}
              </span>
            )}
          </Button>
          
          <Button
            size="lg"
            variant="ghost"
            className="w-full h-16 text-lg"
            onClick={() => router.push(`/tienda/${storeId}/catalogo`)}
          >
            <Search className="mr-2 h-6 w-6" />
            Ver Catálogo
          </Button>
        </div>
        
        {/* Info adicional */}
        <Card className="mt-8 p-4 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">
            ¿Cómo funciona Picky?
          </h3>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Escaneá los códigos QR de los productos</li>
            <li>2. Agregá lo que necesitás a tu carrito</li>
            <li>3. Pagá con MercadoPago</li>
            <li>4. Retirá tu pedido preparado ¡Sin cargar nada!</li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
```

**Tareas:**
- ✅ Crear layout base mobile
- ✅ Integrar Zustand para inicializar sesión
- ✅ Detectar storeId de URL
- ✅ Mostrar datos de mock-stores.json
- ✅ Badge de cantidad en botón Carrito
- ✅ Animaciones Framer Motion (opcional)

**Testing:**
- Probar navegación a /escanear, /carrito, /catalogo
- Verificar que sessionId se genera correctamente
- Verificar que badge de carrito muestra cantidad

---

### ✅ **2.2 Pantalla Catálogo de Productos (1.5 días)** - **COMPLETADO**

**Ruta:** `/tienda/[storeId]/catalogo/page.tsx`

**Wireframe:**
```
┌─────────────────────────────┐
│ ← Catálogo      🛒 (3)      │
├─────────────────────────────┤
│ 🔍 Buscar productos...      │
├─────────────────────────────┤
│ 🏗️Cemento 🔨Herram. 🎨Pint.│ <- Tabs horizontales
├─────────────────────────────┤
│ ┌────────┐ ┌────────┐      │
│ │ Imagen │ │ Imagen │      │
│ │Cemento │ │Taladro │      │
│ │$1,250  │ │$8,500  │      │
│ │[+]     │ │[+]     │      │
│ └────────┘ └────────┘      │
│ ┌────────┐ ┌────────┐      │
│ │ ...    │ │ ...    │      │
└─────────────────────────────┘
```

**Componentes a crear:**

1. **`src/components/cliente/ProductCard.tsx`**

```typescript
'use client';

import { Product } from '@/types/product';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  storeId: string;
  inCart?: number; // Cantidad en carrito
}

export function ProductCard({ product, storeId, inCart }: ProductCardProps) {
  const router = useRouter();
  
  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => router.push(`/tienda/${storeId}/producto/${product.sku}`)}
    >
      <div className="relative">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.stock < 10 && (
          <Badge className="absolute top-2 right-2 bg-accent-500">
            Quedan {product.stock}
          </Badge>
        )}
        {inCart && inCart > 0 && (
          <Badge className="absolute top-2 left-2 bg-primary-500">
            {inCart} en carrito
          </Badge>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-1">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-600">
            {formatPrice(product.price)}
          </span>
          <Button size="sm" className="rounded-full">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
```

2. **`src/app/tienda/[storeId]/catalogo/page.tsx`**

```typescript
'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/cliente/ProductCard';
import { ArrowLeft, Search, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import mockProducts from '@/data/mock-products.json';
import mockCategories from '@/data/mock-categories.json';

export default function CatalogoPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;
  const { cart } = useCartStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const filteredProducts = useMemo(() => {
    return mockProducts.products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        product.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory && product.isActive;
    });
  }, [searchQuery, selectedCategory]);
  
  const cartItemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  
  const getProductQuantityInCart = (productId: string) => {
    return cart?.items.find(item => item.productId === productId)?.quantity || 0;
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Catálogo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={() => router.push(`/tienda/${storeId}/carrito`)}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </div>
          
          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>
      
      {/* Tabs de categorías */}
      <div className="bg-white border-b sticky top-[76px] z-10">
        <div className="max-w-md mx-auto px-4 py-2 overflow-x-auto">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="w-full justify-start">
              <TabsTrigger value="all">Todos</TabsTrigger>
              {mockCategories.categories.map((cat) => (
                <TabsTrigger key={cat.id} value={cat.name}>
                  {cat.icon} {cat.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Grid de productos */}
      <div className="max-w-md mx-auto px-4 py-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron productos</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                storeId={storeId}
                inCart={getProductQuantityInCart(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

3. **`src/lib/utils.ts`** (Helper formatPrice)

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(priceInCents / 100);
}
```

#### **1.7 Crear Mock Data (2-3h)**

**Archivo:** `src/data/mock-products.json`

```json
{
  "products": [
    {
      "id": "prod_001",
      "sku": "CEM-PORT-50KG",
      "name": "Cemento Portland 50kg",
      "description": "Cemento gris de alta resistencia",
      "longDescription": "Ideal para obras de construcción, cimientos y columnas. Tiempo de fraguado: 4-6 horas. Resistencia a la compresión: 42.5 MPa.",
      "price": 125000,
      "stock": 150,
      "minStock": 20,
      "category": "Cemento",
      "imageUrl": "/images/cemento-portland.jpg",
      "unit": "bolsa",
      "bulkDiscounts": [
        { "minQty": 10, "discountPercent": 10, "label": "Comprá 10 y ahorrá 10%" },
        { "minQty": 50, "discountPercent": 18, "label": "Comprá 50 y ahorrá 18%" }
      ],
      "relatedProducts": ["prod_002", "prod_025"],
      "location": "Pasillo A, Estante 1",
      "isActive": true
    },
    {
      "id": "prod_002",
      "sku": "TAL-BOSCH-GSB",
      "name": "Taladro Inalámbrico Bosch GSB 18V",
      "description": "Taladro percutor con batería de litio",
      "longDescription": "Taladro inalámbrico profesional con batería de 18V, 2 velocidades, percutor integrado. Incluye maletín, 2 baterías y cargador.",
      "price": 850000,
      "stock": 8,
      "minStock": 3,
      "category": "Herramientas",
      "imageUrl": "/images/taladro-bosch.jpg",
      "unit": "unidad",
      "relatedProducts": ["prod_003", "prod_004"],
      "location": "Pasillo C, Estante 5",
      "isActive": true
    },
    {
      "id": "prod_003",
      "sku": "PIN-LAT-BLN-20L",
      "name": "Pintura Látex Interior Blanco 20L",
      "description": "Pintura lavable de alta cobertura",
      "longDescription": "Pintura látex acrílica para interiores, blanco mate. Rendimiento: 12-14 m²/litro. Secado al tacto: 30 minutos.",
      "price": 450000,
      "stock": 45,
      "minStock": 10,
      "category": "Pintura",
      "imageUrl": "/images/pintura-latex.jpg",
      "unit": "balde",
      "bulkDiscounts": [
        { "minQty": 3, "discountPercent": 5, "label": "Llevá 3 baldes y ahorrá 5%" }
      ],
      "relatedProducts": ["prod_010", "prod_011"],
      "comparisonGroup": "pinturas-latex",
      "location": "Pasillo B, Estante 2",
      "isActive": true
    }
    // ... (47 productos más)
  ]
}
```

**Archivo:** `src/data/mock-categories.json`

```json
{
  "categories": [
    { "id": "cat_001", "name": "Cemento", "icon": "🏗️", "slug": "cemento" },
    { "id": "cat_002", "name": "Herramientas", "icon": "🔨", "slug": "herramientas" },
    { "id": "cat_003", "name": "Pintura", "icon": "🎨", "slug": "pintura" },
    { "id": "cat_004", "name": "Electricidad", "icon": "⚡", "slug": "electricidad" },
    { "id": "cat_005", "name": "Plomería", "icon": "🚰", "slug": "plomeria" }
  ]
}
```

**Archivo:** `src/data/mock-stores.json`

```json
{
  "stores": [
    {
      "id": "store_001",
      "name": "Ferretería El Tornillo",
      "address": "Av. Siempreviva 742, CABA",
      "phone": "+54 11 1234-5678",
      "logo": "/logos/el-tornillo.png",
      "hours": "Lun-Vie: 8:00-19:00, Sáb: 8:00-13:00",
      "isActive": true
    }
  ]
}
```

#### **1.8 Configurar Zustand Stores (1h)**

**Archivo:** `src/stores/useCartStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, CartItem } from '@/types/cart';

interface CartStore {
  cart: Cart | null;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  initCart: (storeId: string, sessionId: string) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      
      initCart: (storeId: string, sessionId: string) => {
        const existingCart = get().cart;
        if (!existingCart) {
          set({
            cart: {
              items: [],
              subtotal: 0,
              discounts: 0,
              total: 0,
              storeId,
              sessionId,
              updatedAt: new Date(),
            },
          });
        }
      },
      
      addItem: (item: CartItem) => {
        const cart = get().cart;
        if (!cart) return;
        
        const existingItemIndex = cart.items.findIndex(
          (i) => i.productId === item.productId
        );
        
        let newItems: CartItem[];
        if (existingItemIndex >= 0) {
          newItems = [...cart.items];
          newItems[existingItemIndex].quantity += item.quantity;
        } else {
          newItems = [...cart.items, item];
        }
        
        const subtotal = newItems.reduce(
          (acc, i) => acc + i.price * i.quantity,
          0
        );
        
        // Calcular descuentos (simplificado)
        const discounts = 0; // TODO: Implementar lógica de descuentos
        
        set({
          cart: {
            ...cart,
            items: newItems,
            subtotal,
            discounts,
            total: subtotal - discounts,
            updatedAt: new Date(),
          },
        });
      },
      
      removeItem: (productId: string) => {
        const cart = get().cart;
        if (!cart) return;
        
        const newItems = cart.items.filter((i) => i.productId !== productId);
        const subtotal = newItems.reduce(
          (acc, i) => acc + i.price * i.quantity,
          0
        );
        
        set({
          cart: {
            ...cart,
            items: newItems,
            subtotal,
            total: subtotal - cart.discounts,
            updatedAt: new Date(),
          },
        });
      },
      
      updateQuantity: (productId: string, quantity: number) => {
        const cart = get().cart;
        if (!cart) return;
        
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        const newItems = cart.items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );
        
        const subtotal = newItems.reduce(
          (acc, i) => acc + i.price * i.quantity,
          0
        );
        
        set({
          cart: {
            ...cart,
            items: newItems,
            subtotal,
            total: subtotal - cart.discounts,
            updatedAt: new Date(),
          },
        });
      },
      
      clearCart: () => {
        set({ cart: null });
      },
    }),
    {
      name: 'picky-cart-storage',
    }
  )
);
```

**Archivo:** `src/stores/useUserStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/user';

interface UserStore {
  user: User | null;
  sessionId: string | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  initSession: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      sessionId: null,
      
      initSession: () => {
        const sessionId = crypto.randomUUID();
        set({ sessionId });
      },
      
      setUser: (user: User) => {
        set({ user });
      },
      
      clearUser: () => {
        set({ user: null });
      },
    }),
    {
      name: 'picky-user-storage',
    }
  )
);
```

#### **1.9 Configurar React Query (30min)**

**Archivo:** `src/app/providers.tsx`

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minuto
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

**Actualizar:** `src/app/layout.tsx`

```typescript
import { Providers } from './providers';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Picky - Smart In-Store Shopping',
  description: 'Escaneá, comprá y retirá sin cargar',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

#### **1.10 Deploy Inicial a Vercel (30min)**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Seguir wizard:
? Set up and deploy "~/picky"? [Y/n] Y
? Which scope do you want to deploy to? <tu-username>
? Link to existing project? [y/N] N
? What's your project's name? picky
? In which directory is your code located? ./
? Want to override the settings? [y/N] N
```

**Resultado Fase 1:**
- ✅ Proyecto Next.js inicializado
- ✅ Dependencias instaladas
- ✅ Estructura de carpetas creada
- ✅ TypeScript interfaces definidas
- ✅ Mock data creado
- ✅ Zustand stores configurados
- ✅ React Query configurado
- ✅ Deploy inicial funcionando

---

## 🟢 FASE 2: Experiencia Cliente Mobile (7-10 días)

### **Objetivo:** Crear las 8 pantallas del flujo de compra mobile

---

### ✅ **2.1 Pantalla Landing/Onboarding (1 día)** - **COMPLETADO**

**Ruta:** `/tienda/[storeId]/page.tsx`

**Wireframe:**
```
┌─────────────────────────────┐
│     Logo de la Tienda       │
│                             │
│  ¡Hola! Bienvenido a la     │
│  experiencia Picky en       │
│  Ferretería El Tornillo     │
│                             │
│  ┌─────────────────────┐   │
│  │  📸 Iniciar Recorrido │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │  🛒 Ver Mi Carrito   │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │  🔍 Ver Catálogo     │   │
│  └─────────────────────┘   │
│                             │
│  Horario: Lun-Vie 8-19hs   │
└─────────────────────────────┘
```

**Componentes a crear:**

1. **`src/app/tienda/[storeId]/page.tsx`** (Página principal)

```typescript
'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, ShoppingCart, Search } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import { useUserStore } from '@/stores/useUserStore';
import mockStores from '@/data/mock-stores.json';

export default function StoreLandingPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;
  
  const { cart, initCart } = useCartStore();
  const { sessionId, initSession } = useUserStore();
  
  const store = mockStores.stores.find(s => s.id === storeId);
  
  useEffect(() => {
    if (!sessionId) {
      initSession();
    }
    if (!cart && sessionId) {
      initCart(storeId, sessionId);
    }
  }, [sessionId, cart, storeId, initSession, initCart]);
  
  if (!store) {
    return <div>Tienda no encontrada</div>;
  }
  
  const cartItemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header con logo */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-full shadow-lg flex items-center justify-center">
            <span className="text-4xl">🏪</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Hola! Bienvenido a la experiencia Picky en
          </h1>
          <h2 className="text-3xl font-bold text-primary-600 mb-4">
            {store.name}
          </h2>
          <p className="text-gray-600">{store.address}</p>
          <p className="text-sm text-gray-500 mt-2">{store.hours}</p>
        </div>
        
        {/* CTAs principales */}
        <div className="space-y-4">
          <Button
            size="lg"
            className="w-full h-16 text-lg"
            onClick={() => router.push(`/tienda/${storeId}/escanear`)}
          >
            <Camera className="mr-2 h-6 w-6" />
            Iniciar Recorrido
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="w-full h-16 text-lg relative"
            onClick={() => router.push(`/tienda/${storeId}/carrito`)}
          >
            <ShoppingCart className="mr-2 h-6 w-6" />
            Ver Mi Carrito
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                {cartItemCount}
              </span>
            )}
          </Button>
          
          <Button
            size="lg"
            variant="ghost"
            className="w-full h-16 text-lg"
            onClick={() => router.push(`/tienda/${storeId}/catalogo`)}
          >
            <Search className="mr-2 h-6 w-6" />
            Ver Catálogo
          </Button>
        </div>
        
        {/* Info adicional */}
        <Card className="mt-8 p-4 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">
            ¿Cómo funciona Picky?
          </h3>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Escaneá los códigos QR de los productos</li>
            <li>2. Agregá lo que necesitás a tu carrito</li>
            <li>3. Pagá con MercadoPago</li>
            <li>4. Retirá tu pedido preparado ¡Sin cargar nada!</li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
```

**Tareas:**
- ✅ Crear layout base mobile
- ✅ Integrar Zustand para inicializar sesión
- ✅ Detectar storeId de URL
- ✅ Mostrar datos de mock-stores.json
- ✅ Badge de cantidad en botón Carrito
- ✅ Animaciones Framer Motion (opcional)

**Testing:**
- Probar navegación a /escanear, /carrito, /catalogo
- Verificar que sessionId se genera correctamente
- Verificar que badge de carrito muestra cantidad

---

### ✅ **2.2 Pantalla Catálogo de Productos (1.5 días)** - **COMPLETADO**

**Ruta:** `/tienda/[storeId]/catalogo/page.tsx`

**Wireframe:**
```
┌─────────────────────────────┐
│ ← Catálogo      🛒 (3)      │
├─────────────────────────────┤
│ 🔍 Buscar productos...      │
├─────────────────────────────┤
│ 🏗️Cemento 🔨Herram. 🎨Pint.│ <- Tabs horizontales
├─────────────────────────────┤
│ ┌────────┐ ┌────────┐      │
│ │ Imagen │ │ Imagen │      │
│ │Cemento │ │Taladro │      │
│ │$1,250  │ │$8,500  │      │
│ │[+]     │ │[+]     │      │
│ └────────┘ └────────┘      │
│ ┌────────┐ ┌────────┐      │
│ │ ...    │ │ ...    │      │
└─────────────────────────────┘
```

**Componentes a crear:**

1. **`src/components/cliente/ProductCard.tsx`**

```typescript
'use client';

import { Product } from '@/types/product';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  storeId: string;
  inCart?: number; // Cantidad en carrito
}

export function ProductCard({ product, storeId, inCart }: ProductCardProps) {
  const router = useRouter();
  
  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => router.push(`/tienda/${storeId}/producto/${product.sku}`)}
    >
      <div className="relative">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.stock < 10 && (
          <Badge className="absolute top-2 right-2 bg-accent-500">
            Quedan {product.stock}
          </Badge>
        )}
        {inCart && inCart > 0 && (
          <Badge className="absolute top-2 left-2 bg-primary-500">
            {inCart} en carrito
          </Badge>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-1">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-600">
            {formatPrice(product.price)}
          </span>
          <Button size="sm" className="rounded-full">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
```

2. **`src/app/tienda/[storeId]/catalogo/page.tsx`**

```typescript
'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/cliente/ProductCard';
import { ArrowLeft, Search, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import mockProducts from '@/data/mock-products.json';
import mockCategories from '@/data/mock-categories.json';

export default function CatalogoPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;
  const { cart } = useCartStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const filteredProducts = useMemo(() => {
    return mockProducts.products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        product.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory && product.isActive;
    });
  }, [searchQuery, selectedCategory]);
  
  const cartItemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  
  const getProductQuantityInCart = (productId: string) => {
    return cart?.items.find(item => item.productId === productId)?.quantity || 0;
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Catálogo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={() => router.push(`/tienda/${storeId}/carrito`)}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </div>
          
          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>
      
      {/* Tabs de categorías */}
      <div className="bg-white border-b sticky top-[76px] z-10">
        <div className="max-w-md mx-auto px-4 py-2 overflow-x-auto">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="w-full justify-start">
              <TabsTrigger value="all">Todos</TabsTrigger>
              {mockCategories.categories.map((cat) => (
                <TabsTrigger key={cat.id} value={cat.name}>
                  {cat.icon} {cat.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Grid de productos */}
      <div className="max-w-md mx-auto px-4 py-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron productos</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                storeId={storeId}
                inCart={getProductQuantityInCart(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

3. **`src/lib/utils.ts`** (Helper formatPrice)

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(priceInCents / 100);
}
```

#### **1.7 Crear Mock Data (2-3h)**

**Archivo:** `src/data/mock-products.json`

```json
{
  "products": [
    {
      "id": "prod_001",
      "sku": "CEM-PORT-50KG",
      "name": "Cemento Portland 50kg",
      "description": "Cemento gris de alta resistencia",
      "longDescription": "Ideal para obras de construcción, cimientos y columnas. Tiempo de fraguado: 4-6 horas. Resistencia a la compresión: 42.5 MPa.",
      "price": 125000,
      "stock": 150,
      "minStock": 20,
      "category": "Cemento",
      "imageUrl": "/images/cemento-portland.jpg",
      "unit": "bolsa",
      "bulkDiscounts": [
        { "minQty": 10, "discountPercent": 10, "label": "Comprá 10 y ahorrá 10%" },
        { "minQty": 50, "discountPercent": 18, "label": "Comprá 50 y ahorrá 18%" }
      ],
      "relatedProducts": ["prod_002", "prod_025"],
      "location": "Pasillo A, Estante 1",
      "isActive": true
    },
    {
      "id": "prod_002",
      "sku": "TAL-BOSCH-GSB",
      "name": "Taladro Inalámbrico Bosch GSB 18V",
      "description": "Taladro percutor con batería de litio",
      "longDescription": "Taladro inalámbrico profesional con batería de 18V, 2 velocidades, percutor integrado. Incluye maletín, 2 baterías y cargador.",
      "price": 850000,
      "stock": 8,
      "minStock": 3,
      "category": "Herramientas",
      "imageUrl": "/images/taladro-bosch.jpg",
      "unit": "unidad",
      "relatedProducts": ["prod_003", "prod_004"],
      "location": "Pasillo C, Estante 5",
      "isActive": true
    },
    {
      "id": "prod_003",
      "sku": "PIN-LAT-BLN-20L",
      "name": "Pintura Látex Interior Blanco 20L",
      "description": "Pintura lavable de alta cobertura",
      "longDescription": "Pintura látex acrílica para interiores, blanco mate. Rendimiento: 12-14 m²/litro. Secado al tacto: 30 minutos.",
      "price": 450000,
      "stock": 45,
      "minStock": 10,
      "category": "Pintura",
      "imageUrl": "/images/pintura-latex.jpg",
      "unit": "balde",
      "bulkDiscounts": [
        { "minQty": 3, "discountPercent": 5, "label": "Llevá 3 baldes y ahorrá 5%" }
      ],
      "relatedProducts": ["prod_010", "prod_011"],
      "comparisonGroup": "pinturas-latex",
      "location": "Pasillo B, Estante 2",
      "isActive": true
    }
    // ... (47 productos más)
  ]
}
```

**Archivo:** `src/data/mock-categories.json`

```json
{
  "categories": [
    { "id": "cat_001", "name": "Cemento", "icon": "🏗️", "slug": "cemento" },
    { "id": "cat_002", "name": "Herramientas", "icon": "🔨", "slug": "herramientas" },
    { "id": "cat_003", "name": "Pintura", "icon": "🎨", "slug": "pintura" },
    { "id": "cat_004", "name": "Electricidad", "icon": "⚡", "slug": "electricidad" },
    { "id": "cat_005", "name": "Plomería", "icon": "🚰", "slug": "plomeria" }
  ]
}
```

**Archivo:** `src/data/mock-stores.json`

```json
{
  "stores": [
    {
      "id": "store_001",
      "name": "Ferretería El Tornillo",
      "address": "Av. Siempreviva 742, CABA",
      "phone": "+54 11 1234-5678",
      "logo": "/logos/el-tornillo.png",
      "hours": "Lun-Vie: 8:00-19:00, Sáb: 8:00-13:00",
      "isActive": true
    }
  ]
}
```

#### **1.8 Configurar Zustand Stores (1h)**

**Archivo:** `src/stores/useCartStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, CartItem } from '@/types/cart';

interface CartStore {
  cart: Cart | null;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  initCart: (storeId: string, sessionId: string) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      
      initCart: (storeId: string, sessionId: string) => {
        const existingCart = get().cart;
        if (!existingCart) {
          set({
            cart: {
              items: [],
              subtotal: 0,
              discounts: 0,
              total: 0,
              storeId,
              sessionId,
              updatedAt: new Date(),
            },
          });
        }
      },
      
      addItem: (item: CartItem) => {
        const cart = get().cart;
        if (!cart) return;
        
        const existingItemIndex = cart.items.findIndex(
          (i) => i.productId === item.productId
        );
        
        let newItems: CartItem[];
        if (existingItemIndex >= 0) {
          newItems = [...cart.items];
          newItems[existingItemIndex].quantity += item.quantity;
        } else {
          newItems = [...cart.items, item];
        }
        
        const subtotal = newItems.reduce(
          (acc, i) => acc + i.price * i.quantity,
          0
        );
        
        // Calcular descuentos (simplificado)
        const discounts = 0; // TODO: Implementar lógica de descuentos
        
        set({
          cart: {
            ...cart,
            items: newItems,
            subtotal,
            discounts,
            total: subtotal - discounts,
            updatedAt: new Date(),
          },
        });
      },
      
      removeItem: (productId: string) => {
        const cart = get().cart;
        if (!cart) return;
        
        const newItems = cart.items.filter((i) => i.productId !== productId);
        const subtotal = newItems.reduce(
          (acc, i) => acc + i.price * i.quantity,
          0
        );
        
        set({
          cart: {
            ...cart,
            items: newItems,
            subtotal,
            total: subtotal - cart.discounts,
            updatedAt: new Date(),
          },
        });
      },
      
      updateQuantity: (productId: string, quantity: number) => {
        const cart = get().cart;
        if (!cart) return;
        
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        const newItems = cart.items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );
        
        const subtotal = newItems.reduce(
          (acc, i) => acc + i.price * i.quantity,
          0
        );
        
        set({
          cart: {
            ...cart,
            items: newItems,
            subtotal,
            total: subtotal - cart.discounts,
            updatedAt: new Date(),
          },
        });
      },
      
      clearCart: () => {
        set({ cart: null });
      },
    }),
    {
      name: 'picky-cart-storage',
    }
  )
);
```

**Archivo:** `src/stores/useUserStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/user';

interface UserStore {
  user: User | null;
  sessionId: string | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  initSession: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      sessionId: null,
      
      initSession: () => {
        const sessionId = crypto.randomUUID();
        set({ sessionId });
      },
      
      setUser: (user: User) => {
        set({ user });
      },
      
      clearUser: () => {
        set({ user: null });
      },
    }),
    {
      name: 'picky-user-storage',
    }
  )
);
```

#### **1.9 Configurar React Query (30min)**

**Archivo:** `src/app/providers.tsx`

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minuto
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

**Actualizar:** `src/app/layout.tsx`

```typescript
import { Providers } from './providers';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Picky - Smart In-Store Shopping',
  description: 'Escaneá, comprá y retirá sin cargar',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

#### **1.10 Deploy Inicial a Vercel (30min)**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Seguir wizard:
? Set up and deploy "~/picky"? [Y/n] Y
? Which scope do you want to deploy to? <tu-username>
? Link to existing project? [y/N] N
? What's your project's name? picky
? In which directory is your code located? ./
? Want to override the settings? [y/N] N
```

**Resultado Fase 1:**
- ✅ Proyecto Next.js inicializado
- ✅ Dependencias instaladas
- ✅ Estructura de carpetas creada
- ✅ TypeScript interfaces definidas
- ✅ Mock data creado
- ✅ Zustand stores configurados
- ✅ React Query configurado
- ✅ Deploy inicial funcionando

---

## 🟢 FASE 2: Experiencia Cliente Mobile (7-10 días)

### **Objetivo:** Crear las 8 pantallas del flujo de compra mobile

---

### ✅ **2.1 Pantalla Landing/Onboarding (1 día)** - **COMPLETADO**

**Ruta:** `/tienda/[storeId]/page.tsx`

**Wireframe:**
```
┌─────────────────────────────┐
│     Logo de la Tienda       │
│                             │
│  ¡Hola! Bienvenido a la     │
│  experiencia Picky en       │
│  Ferretería El Tornillo     │
│                             │
│  ┌─────────────────────┐   │
│  │  📸 Iniciar Recorrido │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │  🛒 Ver Mi Carrito   │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │  🔍 Ver Catálogo     │   │
│  └─────────────────────┘   │
│                             │
│  Horario: Lun-Vie 8-19hs   │
└─────────────────────────────┘
```

**Componentes a crear:**

1. **`src/app/tienda/[storeId]/page.tsx`** (Página principal)

```typescript
'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, ShoppingCart, Search } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import { useUserStore } from '@/stores/useUserStore';
import mockStores from '@/data/mock-stores.json';

export default function StoreLandingPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;
  
  const { cart, initCart } = useCartStore();
  const { sessionId, initSession } = useUserStore();
  
  const store = mockStores.stores.find(s => s.id === storeId);
  
  useEffect(() => {
    if (!sessionId) {
      initSession();
    }
    if (!cart && sessionId) {
      initCart(storeId, sessionId);
    }
  }, [sessionId, cart, storeId, initSession, initCart]);
  
  if (!store) {
    return <div>Tienda no encontrada</div>;
  }
  
  const cartItemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header con logo */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-full shadow-lg flex items-center justify-center">
            <span className="text-4xl">🏪</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Hola! Bienvenido a la experiencia Picky en
          </h1>
          <h2 className="text-3xl font-bold text-primary-600 mb-4">
            {store.name}
          </h2>
          <p className="text-gray-600">{store.address}</p>
          <p className="text-sm text-gray-500 mt-2">{store.hours}</p>
        </div>
        
        {/* CTAs principales */}
        <div className="space-y-4">
          <Button
            size="lg"
            className="w-full h-16 text-lg"
            onClick={() => router.push(`/tienda/${storeId}/escanear`)}
          >
            <Camera className="mr-2 h-6 w-6" />
            Iniciar Recorrido
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="w-full h-16 text-lg relative"
            onClick={() => router.push(`/tienda/${storeId}/carrito`)}
          >
            <ShoppingCart className="mr-2 h-6 w-6" />
            Ver Mi Carrito
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                {cartItemCount}
              </span>
            )}
          </Button>
          
          <Button
            size="lg"
            variant="ghost"
            className="w-full h-16 text-lg"
            onClick={() => router.push(`/tienda/${storeId}/catalogo`)}
          >
            <Search className="mr-2 h-6 w-6" />
            Ver Catálogo
          </Button>
        </div>
        
        {/* Info adicional */}
        <Card className="mt-8 p-4 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">
            ¿Cómo funciona Picky?
          </h3>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Escaneá los códigos QR de los productos</li>
            <li>2. Agregá lo que necesitás a tu carrito</li>
            <li>3. Pagá con MercadoPago</li>
            <li>4. Retirá tu pedido preparado ¡Sin cargar nada!</li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
```

**Tareas:**
- ✅ Crear layout base mobile
- ✅ Integrar Zustand para inicializar sesión
- ✅ Detectar storeId de URL
- ✅ Mostrar datos de mock-stores.json
- ✅ Badge de cantidad en botón Carrito
- ✅ Animaciones Framer Motion (opcional)

**Testing:**
- Probar navegación a /escanear, /carrito, /catalogo
- Verificar que sessionId se genera correctamente
- Verificar que badge de carrito muestra cantidad

---

### ✅ **2.2 Pantalla Catálogo de Productos (1.5 días)** - **COMPLETADO**

**Ruta:** `/tienda/[storeId]/catalogo/page.tsx`

**Wireframe:**
```
┌─────────────────────────────┐
│ ← Catálogo      🛒 (3)      │
├─────────────────────────────┤
│ 🔍 Buscar productos...      │
├─────────────────────────────┤
│ 🏗️Cemento 🔨Herram. 🎨Pint.│ <- Tabs horizontales
├─────────────────────────────┤
│ ┌────────┐ ┌────────┐      │
│ │ Imagen │ │ Imagen │      │
│ │Cemento │ │Taladro │      │
│ │$1,250  │ │$8,500  │      │
│ │[+]     │ │[+]     │      │
│ └────────┘ └────────┘      │
│ ┌────────┐ ┌────────┐      │
│ │ ...    │ │ ...    │      │
└─────────────────────────────┘
```

**Componentes a crear:**

1. **`src/components/cliente/ProductCard.tsx`**

```typescript
'use client';

import { Product } from '@/types/product';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  storeId: string;
  inCart?: number; // Cantidad en carrito
}

export function ProductCard({ product, storeId, inCart }: ProductCardProps) {
  const router = useRouter();
  
  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => router.push(`/tienda/${storeId}/producto/${product.sku}`)}
    >
      <div className="relative">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.stock < 10 && (
          <Badge className="absolute top-2 right-2 bg-accent-500">
            Quedan {product.stock}
          </Badge>
        )}
        {inCart && inCart > 0 && (
          <Badge className="absolute top-2 left-2 bg-primary-500">
            {inCart} en carrito
          </Badge>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-1">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-600">
            {formatPrice(product.price)}
          </span>
          <Button size="sm" className="rounded-full">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
```

2. **`src/app/tienda/[storeId]/catalogo/page.tsx`**

```typescript
'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/cliente/ProductCard';
import { ArrowLeft, Search, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import mockProducts from '@/data/mock-products.json';
import mockCategories from '@/data/mock-categories.json';

export default function CatalogoPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;
  const { cart } = useCartStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const filteredProducts = useMemo(() => {
    return mockProducts.products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        product.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory && product.isActive;
    });
  }, [searchQuery, selectedCategory]);
  
  const cartItemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  
  const getProductQuantityInCart = (productId: string) => {
    return cart?.items.find(item => item.productId === productId)?.quantity || 0;
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Catálogo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={() => router.push(`/tienda/${storeId}/carrito`)}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </div>
          
          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>
      
      {/* Tabs de categorías */}
      <div className="bg-white border-b sticky top-[76px] z-10">
        <div className="max-w-md mx-auto px-4 py-2 overflow-x-auto">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="w-full justify-start">
              <TabsTrigger value="all">Todos</TabsTrigger>
              {mockCategories.categories.map((cat) => (
                <TabsTrigger key={cat.id} value={cat.name}>
                  {cat.icon} {cat.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Grid de productos */}
      <div className="max-w-md mx-auto px-4 py-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron productos</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                storeId={storeId}
                inCart={getProductQuantityInCart(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

3. **`src/lib/utils.ts`** (Helper formatPrice)

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(priceInCents / 100);
}
```

#### **1.7 Crear Mock Data (2-3h)**

**Archivo:** `src/data/mock-products.json`

```json
{
  "products": [
    {
      "id": "prod_001",
      "sku": "CEM-PORT-50KG",
      "name": "Cemento Portland 50kg",
      "description": "Cemento gris de alta resistencia",
      "longDescription": "Ideal para obras de construcción, cimientos y columnas. Tiempo de fraguado: 4-6 horas. Resistencia a la compresión: 42.5 MPa.",
      "price": 125000,
      "stock": 150,
      "minStock": 20,
      "category": "Cemento",
      "imageUrl": "/images/cemento-portland.jpg",
      "unit": "bolsa",
      "bulkDiscounts": [
        { "minQty": 10, "discountPercent": 10, "label": "Comprá 10 y ahorrá 10%" },
        { "minQty": 50, "discountPercent": 18, "label": "Comprá 50 y ahorrá 18%" }
      ],
      "relatedProducts": ["prod_002", "prod_025"],
      "location": "Pasillo A, Estante 1",
      "isActive": true
    },
    {
      "id": "prod_002",
      "sku": "TAL-BOSCH-GSB",
      "name": "Taladro Inalámbrico Bosch GSB 18V",
      "description": "Taladro percutor con batería de litio",
      "longDescription": "Taladro inalámbrico profesional con batería de 18V, 2 velocidades, percutor integrado. Incluye maletín, 2 baterías y cargador.",
      "price": 850000,
      "stock": 8,
      "minStock": 3,
      "category": "Herramientas",
      "imageUrl": "/images/taladro-bosch.jpg",
      "unit": "unidad",
      "relatedProducts": ["prod_003", "prod_004"],
      "location": "Pasillo C, Estante 5",
      "isActive": true
    },
    {
      "id": "prod_003",
      "sku": "PIN-LAT-BLN-20L",
      "name": "Pintura Látex Interior Blanco 20L",
      "description": "Pintura lavable de alta cobertura",
      "longDescription": "Pintura látex acrílica para interiores, blanco mate. Rendimiento: 12-14 m²/litro. Secado al tacto: 30 minutos.",
      "price": 450000,
      "stock": 45,
      "minStock": 10,
      "category": "Pintura",
      "imageUrl": "/images/pintura-latex.jpg",
      "unit": "balde",
      "bulkDiscounts": [
        { "minQty": 3, "discountPercent": 5, "label": "Llevá 3 baldes y ahorrá 5%" }
      ],
      "relatedProducts": ["prod_010", "prod_011"],
      "comparisonGroup": "pinturas-latex",
      "location": "Pasillo B, Estante 2",
      "isActive": true
    }
    // ... (47 productos más)
  ]
}
```

**Archivo:** `src/data/mock-categories.json`

```json
{
  "categories": [
    { "id": "cat_001", "name": "Cemento", "icon": "🏗️", "slug": "cemento" },
    { "id": "cat_002", "name": "Herramientas", "icon": "🔨", "slug": "herramientas" },
    { "id": "cat_003", "name": "Pintura", "icon": "🎨", "slug": "pintura" },
    { "id": "cat_004", "name": "Electricidad", "icon": "⚡", "slug": "electricidad" },
    { "id": "cat_005", "name": "Plomería", "icon": "🚰", "slug": "plomeria" }
  ]
}
```

**Archivo:** `src/data/mock-stores.json`

```json
{
  "stores": [
    {
      "id": "store_001",
      "name": "Ferretería El Tornillo",
      "address": "Av. Siempreviva 742, CABA",
      "phone": "+54 11 1234-5678",
      "logo": "/logos/el-tornillo.png",
      "hours": "Lun-Vie: 8:00-19:00, Sáb: 8:00-13:00",
      "isActive": true
    }
  ]
}
```

#### **1.8 Configurar Zustand Stores (1h)**

**Archivo:** `src/stores/useCartStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, CartItem } from '@/types/cart';

interface CartStore {
  cart: Cart | null;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  initCart: (storeId: string, sessionId: string) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      
      initCart: (storeId: string, sessionId: string) => {
        const existingCart = get().cart;
        if (!existingCart) {
          set({
            cart: {
              items: [],
              subtotal: 0,
              discounts: 0,
              total: 0,
              storeId,
              sessionId,
              updatedAt: new Date(),
            },
          });
        }
      },
      
      addItem: (item: CartItem) => {
        const cart = get().cart;
        if (!cart) return;
        
        const existingItemIndex = cart.items.findIndex(
          (i) => i.productId === item.productId
        );
        
        let newItems: CartItem[];
        if (existingItemIndex >= 0) {
          newItems = [...cart.items];
          newItems[existingItemIndex].quantity += item.quantity;
        } else {
          newItems = [...cart.items, item];
        }
        
        const subtotal = newItems.reduce(
          (acc, i) => acc + i.price * i.quantity,
          0
        );
        
        // Calcular descuentos (simplificado)
        const discounts = 0; // TODO: Implementar lógica de descuentos
        
        set({
          cart: {
            ...cart,
            items: newItems,
            subtotal,
            discounts,
            total: subtotal - discounts,
            updatedAt: new Date(),
          },
        });
      },
      
      removeItem: (productId: string) => {
        const cart = get().cart;
        if (!cart) return;
        
        const newItems = cart.items.filter((i) => i.productId !== productId);
        const subtotal = newItems.reduce(
          (acc, i) => acc + i.price * i.quantity,
          0
        );
        
        set({
          cart: {
            ...cart,
            items: newItems,
            subtotal,
            total: subtotal - cart.discounts,
            updatedAt: new Date(),
          },
        });
      },
      
      updateQuantity: (productId: string, quantity: number) => {
        const cart = get().cart;
        if (!cart) return;
        
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        const newItems = cart.items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );
        
        const subtotal = newItems.reduce(
          (acc, i) => acc + i.price * i.quantity,
          0
        );
        
        set({
          cart: {
            ...cart,
            items: newItems,
            subtotal,
            total: subtotal - cart.discounts,
            updatedAt: new Date(),
          },
        });
      },
      
      clearCart: () => {
        set({ cart: null });
      },
    }),
    {
      name: 'picky-cart-storage',
    }
  )
);
```

**Archivo:** `src/stores/useUserStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/user';

interface UserStore {
  user: User | null;
  sessionId: string | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  initSession: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      sessionId: null,
      
      initSession: () => {
        const sessionId = crypto.randomUUID();
        set({ sessionId });
      },
      
      setUser: (user: User) => {
        set({ user });
      },
      
      clearUser: () => {
        set({ user: null });
      },
    }),
    {
      name: 'picky-user-storage',
    }
  )
);
```

#### **1.9 Configurar React Query (30min)**

**Archivo:** `src/app/providers.tsx`

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minuto
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

**Actualizar:** `src/app/layout.tsx`

```typescript
import { Providers } from './providers';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Picky - Smart In-Store Shopping',
  description: 'Escaneá, comprá y retirá sin cargar',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

#### **1.10 Deploy Inicial a Vercel (30min)**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Seguir wizard:
? Set up and deploy "~/picky"? [Y/n] Y
? Which scope do you want to deploy to? <tu-username>
? Link to existing project? [y/N] N
? What's your project's name? picky
? In which directory is your code located? ./
? Want to override the settings? [y/N] N
```

**Resultado Fase 1:**
- ✅ Proyecto Next.js inicializado
- ✅ Dependencias instaladas
- ✅ Estructura de carpetas creada
- ✅ TypeScript interfaces definidas
- ✅ Mock data creado
- ✅ Zustand stores configurados
- ✅ React Query configurado
- ✅ Deploy inicial funcionando

---

## 🟢 FASE 2: Experiencia Cliente Mobile (7-10 días)

### **Objetivo:** Crear las 8 pantallas del flujo de compra mobile

---

### ✅ **2.1 Pantalla Landing/Onboarding (1 día)** - **COMPLETADO**

**Ruta:** `/tienda/[storeId]/page.tsx`

**Wireframe:**
```
┌─────────────────────────────┐
│     Logo de la Tienda       │
│                             │
│  ¡Hola! Bienvenido a la     │
│  experiencia Picky en       │
│  Ferretería El Tornillo     │
│                             │
│  ┌─────────────────────┐   │
│  │  📸 Iniciar Recorrido │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │  🛒 Ver Mi Carrito   │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │  🔍 Ver Catálogo     │   │
│  └─────────────────────┘   │
│                             │
│  Horario: Lun-Vie 8-19hs   │
└─────────────────────────────┘
```

**Componentes a crear:**

1. **`src/app/tienda/[storeId]/page.tsx`** (Página principal)

```typescript
'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, ShoppingCart, Search } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import { useUserStore } from '@/stores/useUserStore';
import mockStores from '@/data/mock-stores.json';

export default function StoreLandingPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;
  
  const { cart, initCart } = useCartStore();
  const { sessionId, initSession } = useUserStore();
  
  const store = mockStores.stores.find(s => s.id === storeId);
  
  useEffect(() => {
    if (!sessionId) {
      initSession();
    }
    if (!cart && sessionId) {
      initCart(storeId, sessionId);
    }
  }, [sessionId, cart, storeId, initSession, initCart]);
  
  if (!store) {
    return <div>Tienda no encontrada</div>;
  }
  
  const cartItemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header con logo */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-full shadow-lg flex items-center justify-center">
            <span className="text-4xl">🏪</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Hola! Bienvenido a la experiencia Picky en
          </h1>
          <h2 className="text-3xl font-bold text-primary-600 mb-4">
            {store.name}
          </h2>
          <p className="text-gray-600">{store.address}</p>
          <p className="text-sm text-gray-500 mt-2">{store.hours}</p>
        </div>
        
        {/* CTAs principales */}
        <div className="space-y-4">
          <Button
            size="lg"
            className="w-full h-16 text-lg"
            onClick={() => router.push(`/tienda/${storeId}/escanear`)}
          >
            <Camera className="mr-2 h-6 w-6" />
            Iniciar Recorrido
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="w-full h-16 text-lg relative"
            onClick={() => router.push(`/tienda/${storeId}/carrito`)}
          >
            <ShoppingCart className="mr-2 h-6 w-6" />
            Ver Mi Carrito
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                {cartItemCount}
              </span>
            )}
          </Button>
          
          <Button
            size="lg"
            variant="ghost"
            className="w-full h-16 text-lg"
            onClick={() => router.push(`/tienda/${storeId}/catalogo`)}
          >
            <Search className="mr-2 h-6 w-6" />
            Ver Catálogo
          </Button>
        </div>
        
        {/* Info adicional */}
        <Card className="mt-8 p-4 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">
            ¿Cómo funciona Picky?
          </h3>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Escaneá los códigos QR de los productos</li>
            <li>2. Agregá lo que necesitás a tu carrito</li>
            <li>3. Pagá con MercadoPago</li>
            <li>4. Retirá tu pedido preparado ¡Sin cargar nada!</li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
```

**Tareas:**
- ✅ Crear layout base mobile
- ✅ Integrar Zustand para inicializar sesión
- ✅ Detectar storeId de URL
- ✅ Mostrar datos de mock-stores.json
- ✅ Badge de cantidad en botón Carrito
- ✅ Animaciones Framer Motion (opcional)

**Testing:**
- Probar navegación a /escanear, /carrito, /catalogo
- Verificar que sessionId se genera correctamente
- Verificar que badge de carrito muestra cantidad

---

### ✅ **2.2 Pantalla Catálogo de Productos (1.5 días)** - **COMPLETADO**

**Ruta:** `/tienda/[storeId]/catalogo/page.tsx`

**Wireframe:**
```
┌─────────────────────────────┐
│ ← Catálogo      🛒 (3)      │
├─────────────────────────────┤
│ 🔍 Buscar productos...      │
├─────────────────────────────┤
│ 🏗️Cemento 🔨Herram. 🎨Pint.│ <- Tabs horizontales
├─────────────────────────────┤
│ ┌────────┐ ┌────────┐      │
│ │ Imagen │ │ Imagen │      │
│ │Cemento │ │Taladro │      │
│ │$1,250  │ │$8,500  │      │
│ │[+]     │ │[+]     │      │
│ └────────┘ └────────┘      │
│ ┌────────┐ ┌────────┐      │
│ │ ...    │ │ ...    │      │
└─────────────────────────────┘
```

**Componentes a crear:**

1. **`src/components/cliente/ProductCard.tsx`**

```typescript
'use client';

import { Product } from '@/types/product';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  storeId: string;
  inCart?: number; // Cantidad en carrito
}

export function ProductCard({ product, storeId, inCart }: ProductCardProps) {
  const router = useRouter();
  
  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => router.push(`/tienda/${storeId}/producto/${product.sku}`)}
    >
      <div className="relative">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.stock < 10 && (
          <Badge className="absolute top-2 right-2 bg-accent-500">
            Quedan {product.stock}
          </Badge>
        )}
        {inCart && inCart > 0 && (
          <Badge className="absolute top-2 left-2 bg-primary-500">
            {inCart} en carrito
          </Badge>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-1">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-600">
            {formatPrice(product.price)}
          </span>
          <Button size="sm" className="rounded-full">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
```

2. **`src/app/tienda/[storeId]/catalogo/page.tsx`**

```typescript
'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/cliente/ProductCard';
import { ArrowLeft, Search, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import mockProducts from '@/data/mock-products.json';
import mockCategories from '@/data/mock-categories.json';

export default function CatalogoPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;
  const { cart } = useCartStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const filteredProducts = useMemo(() => {
    return mockProducts.products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        product.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory && product.isActive;
    });
  }, [searchQuery, selectedCategory]);
  
  const cartItemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  
  const getProductQuantityInCart = (productId: string) => {
    return cart?.items.find(item => item.productId === productId)?.quantity || 0;
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Catálogo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={() => router.push(`/tienda/${storeId}/carrito`)}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </div>
          
          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>
      
      {/* Tabs de categorías */}
      <div className="bg-white border-b sticky top-[76px] z-10">
        <div className="max-w-md mx-auto px-4 py-2 overflow-x-auto">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="w-full justify-start">
              <TabsTrigger value="all">Todos</TabsTrigger>
              {mockCategories.categories.map((cat) => (
                <TabsTrigger key={cat.id} value={cat.name}>
                  {cat.icon} {cat.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Grid de productos */}
      <div className="max-w-md mx-auto px-4 py-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron productos</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                storeId={storeId}
                inCart={getProductQuantityInCart(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

3. **`src/lib/utils.ts`** (Helper formatPrice)

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(priceInCents / 100);
}
```

#### **1.7 Crear Mock Data (2-3h)**

**Archivo:** `src/data/mock-products.json`

```json
{
  "products": [
    {
      "id": "prod_001",
      "sku": "CEM-PORT-50KG",
      "name": "Cemento Portland 50kg",
      "description": "Cemento gris de alta resistencia",
      "longDescription": "Ideal para obras de construcción, cimientos y columnas. Tiempo de fraguado: 4-6 horas. Resistencia a la compresión: 42.5 MPa.",
      "price": 125000,
      "stock": 150,
      "minStock": 20,
      "category": "Cemento",
      "imageUrl": "/images/cemento-portland.jpg",
      "unit": "bolsa",
      "bulkDiscounts": [
        { "minQty": 10, "discountPercent": 10, "label": "Comprá 10 y ahorrá 10%" },
        { "minQty": 50, "discountPercent": 18, "label": "Comprá 50 y ahorrá 18%" }
      ],
      "relatedProducts": ["prod_002", "prod_025"],
      "location": "Pasillo A, Estante 1",
      "isActive": true
    },
    {
      "id": "prod_002",
      "sku": "TAL-BOSCH-GSB",
      "name": "Taladro Inalámbrico Bosch GSB 18V",
      "description": "Taladro percutor con batería de litio",
      "longDescription": "Taladro inalámbrico profesional con batería de 18V, 2 velocidades, percutor integrado. Incluye maletín, 2 baterías y cargador.",
      "price": 850000,
      "stock": 8,
      "minStock": 3,
      "category": "Herramientas",
      "imageUrl": "/images/taladro-bosch.jpg",
      "unit": "unidad",
      "relatedProducts": ["prod_003", "prod_004"],
      "location": "Pasillo C, Estante 5",
      "isActive": true
    },
    {
      "id": "prod_003",
      "sku": "PIN-LAT-BLN-20L",
      "name": "Pintura Látex Interior Blanco 20L",
      "description": "Pintura lavable de alta cobertura",
      "longDescription": "Pintura látex acrílica para interiores, blanco mate. Rendimiento: 12-14 m²/litro. Secado al tacto: 30 minutos.",
      "price": 450000,
      "stock": 45,
      "minStock": 10,
      "category": "Pintura",
      "imageUrl": "/images/pintura-latex.jpg",
      "unit": "balde",
      "bulkDiscounts": [
        { "minQty": 3, "discountPercent": 5, "label": "Llevá 3 baldes y ahorrá 5%" }
      ],
      "relatedProducts": ["prod_010", "prod_011"],
      "comparisonGroup": "pinturas-latex",
      "location": "Pasillo B, Estante 2",
      "isActive": true
    }
    // ... (47 productos más)
  ]
}
```

**Archivo:** `src/data/mock-categories.json`

```json
{
  "categories": [
    { "id": "cat_001", "name": "Cemento", "icon": "🏗️", "slug": "cemento" },
    { "id": "cat_002", "name": "Herramientas", "icon": "🔨", "slug": "herramientas" },
    { "id": "cat_003", "name": "Pintura", "icon": "🎨", "slug": "pintura" },
    { "id": "cat_004", "name": "Electricidad", "icon": "⚡", "slug": "electricidad" },
    { "id": "cat_005", "name": "Plomería", "icon": "🚰", "slug": "plomeria" }
  ]
}
```

**Archivo:** `src/data/mock-stores.json`

```json
{
  "stores": [
    {
      "id": "store_001",
      "name": "Ferretería El Tornillo",
      "address": "Av. Siempreviva 742, CABA",
      "phone": "+54 11 1234-5678",
      "logo": "/logos/el-tornillo.png",
      "hours": "Lun-Vie: 8:00-19:00, Sáb: 8:00-13:00",
      "isActive": true
    }
  ]
}
```

#### **1.8 Configurar Zustand Stores (1h)**

**Archivo:** `src/stores/useCartStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, CartItem } from '@/types/cart';

interface CartStore {
  cart: Cart | null;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  initCart: (storeId: string, sessionId: string) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      
      initCart: (storeId: string, sessionId: string) => {
        const existingCart = get().cart;
        if (!existingCart) {
          set({
            cart: {
              items: [],
              subtotal: 0,
              discounts: 0,
              total: 0,
              storeId,
              sessionId,
              updatedAt: new Date(),
            },
          });
        }
      },
      
      addItem: (item: CartItem) => {
        const cart = get().cart;
        if (!cart) return;
        
        const existingItemIndex = cart.items.findIndex(
          (i) => i.productId === item.productId
        );
        
        let newItems: CartItem[];
        if (existingItemIndex >= 0) {
          newItems = [...cart.items];
          newItems[existingItemIndex].quantity += item.quantity;
        } else {
          newItems = [...cart.items, item];
        }
        
        const subtotal = newItems.reduce(
          (acc, i) => acc + i.price * i.quantity,
          0
        );
        
        // Calcular descuentos (simplificado)
        const discounts = 0; // TODO: Implementar lógica de descuentos
        
        set({
          cart: {
            ...cart,
            items: newItems,
            subtotal,
            discounts,
            total: subtotal - discounts,
            updatedAt: new Date(),
          },
        });
      },
      
      removeItem: (productId: string) => {
        const cart = get().cart;
        if (!cart) return;
        
        const newItems = cart.items.filter((i) => i.productId !== productId);
        const subtotal = newItems.reduce(
          (acc, i) => acc + i.price * i.quantity,
          0
        );
        
        set({
          cart: {
            ...cart,
            items: newItems,
            subtotal,
            total: subtotal - cart.discounts,
            updatedAt: new Date(),
          },
        });
      },
      
      updateQuantity: (productId: string, quantity: number) => {
        const cart = get().cart;
        if (!cart) return;
        
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        const newItems = cart.items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );
        
        const subtotal = newItems.reduce(
          (acc, i) => acc + i.price * i.quantity,
          0
        );
        
        set({
          cart: {
            ...cart,
            items: newItems,
            subtotal,
            total: subtotal - cart.discounts,
            updatedAt: new Date(),
          },
        });
      },
      
      clearCart: () => {
        set({ cart: null });
      },
    }),
    {
      name: 'picky-cart-storage',
    }
  )
);
```

**Archivo:** `src/stores/useUserStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/user';

interface UserStore {
  user: User | null;
  sessionId: string | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  initSession: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      sessionId: null,
      
      initSession: () => {
        const sessionId = crypto.randomUUID();
        set({ sessionId });
      },
      
      setUser: (user: User) => {
        set({ user });
      },
      
      clearUser: () => {
        set({ user: null });
      },
    }),
    {
      name: 'picky-user-storage',
    }
  )
);
```

#### **1.9 Configurar React Query (30min)**

**Archivo:** `src/app/providers.tsx`

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minuto
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

**Actualizar:** `src/app/layout.tsx`

```typescript
import { Providers } from './providers';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Picky - Smart In-Store Shopping',
  description: 'Escaneá, comprá y retirá sin cargar',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

#### **1.10 Deploy Inicial a Vercel (30min)**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Seguir wizard:
? Set up and deploy "~/picky"? [Y/n] Y
? Which scope do you want to deploy to? <tu-username>
? Link to existing project? [y/N] N
? What's your project's name? picky
? In which directory is your code located? ./
? Want to override the settings? [y/N] N
```

**Resultado Fase 1:**
- ✅ Proyecto Next.js inicializado
- ✅ Dependencias instaladas
- ✅ Estructura de carpetas creada
- ✅ TypeScript interfaces definidas
- ✅ Mock data creado
- ✅ Zustand stores configurados
- ✅ React Query configurado
- ✅ Deploy inicial funcionando

---

## 🟢 FASE 2: Experiencia Cliente Mobile (7-10 días)

### **Objetivo:** Crear las 8 pantallas del flujo de compra mobile

---

### ✅ **2.1 Pantalla Landing/Onboarding (1 día)** - **COMPLETADO**

**Ruta:** `/tienda/[storeId]/page.tsx`

**Wireframe:**
```
┌─────────────────────────────┐
│     Logo de la Tienda       │
│                             │
│  ¡Hola! Bienvenido a la     │
│  experiencia Picky en       │
│  Ferretería El Tornillo     │
│                             │
│  ┌─────────────────────┐   │
│  │  📸 Iniciar Recorrido │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │  🛒 Ver Mi Carrito   │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │  🔍 Ver Catálogo     │   │
│  └─────────────────────┘   │
│                             │
│  Horario: Lun-Vie 8-19hs   │
└─────────────────────────────┘
```

**Componentes a crear:**

1. **`src/app/tienda/[storeId]/page.tsx`** (Página principal)

```typescript
'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, ShoppingCart, Search } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import { useUserStore } from '@/stores/useUserStore';
import mockStores from '@/data/mock-stores.json';

export default function StoreLandingPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;
  
  const { cart, initCart } = useCartStore();
  const { sessionId, initSession } = useUserStore();
  
  const store = mockStores.stores.find(s => s.id === storeId);
  
  useEffect(() => {
    if (!sessionId) {
      initSession();
    }
    if (!cart && sessionId) {
      initCart(storeId, sessionId);
    }
  }, [sessionId, cart, storeId, initSession, initCart]);
  
  if (!store) {
    return <div>Tienda no encontrada</div>;
  }
  
  const cartItemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header con logo */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-full shadow-lg flex items-center justify-center">
            <span className="text-4xl">🏪</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Hola! Bienvenido a la experiencia Picky en
          </h1>
          <h2 className="text-3xl font-bold text-primary-600 mb-4">
            {store.name}
          </h2>
          <p className="text-gray-600">{store.address}</p>
          <p className="text-sm text-gray-500 mt-2">{store.hours}</p>
        </div>
        
        {/* CTAs principales */}
        <div className="space-y-4">
          <Button
            size="lg"
            className="w-full h-16 text-lg"
            onClick={() => router.push(`/tienda/${storeId}/escanear`)}
          >
            <Camera className="mr-2 h-6 w-6" />
            Iniciar Recorrido
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="w-full h-16 text-lg relative"
            onClick={() => router.push(`/tienda/${storeId}/carrito`)}
          >
            <ShoppingCart className="mr-2 h-6 w-6" />
            Ver Mi Carrito
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                {cartItemCount}
              </span>
            )}
          </Button>
          
          <Button
            size="lg"
            variant="ghost"
            className="w-full h-16 text-lg"
            onClick={() => router.push(`/tienda/${storeId}/catalogo`)}
          >
            <Search className="mr-2 h-6 w-6" />
            Ver Catálogo
          </Button>
        </div>
        
        {/* Info adicional */}
        <Card className="mt-8 p-4 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">
            ¿Cómo funciona Picky?
          </h3>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Escaneá los códigos QR de los productos</li>
            <li>2. Agregá lo que necesitás a tu carrito</li>
            <li>3. Pagá con MercadoPago</li>
            <li>4. Retirá tu pedido preparado ¡Sin cargar nada!</li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
```

**Tareas:**
- ✅ Crear layout base mobile
- ✅ Integrar Zustand para inicializar sesión
- ✅ Detectar storeId de URL
- ✅ Mostrar datos de mock-stores.json
- ✅ Badge de cantidad en botón Carrito
- ✅ Animaciones Framer Motion (opcional)

**Testing:**
- Probar navegación a /escanear, /carrito, /catalogo
- Verificar que sessionId se genera correctamente
- Verificar que badge de carrito muestra cantidad

---

### ✅ **2.2 Pantalla Catálogo de Productos (1.5 días)** - **COMPLETADO**

**Ruta:** `/tienda/[storeId]/catalogo/page.tsx`

**Wireframe:**
```
┌─────────────────────────────┐
│ ← Catálogo      🛒 (3)      │
├─────────────────────────────┤
│ 🔍 Buscar productos...      │
├─────────────────────────────┤
│ 🏗️Cemento 🔨Herram. 🎨Pint.│ <- Tabs horizontales
├─────────────────────────────┤
│ ┌────────┐ ┌────────┐      │
│ │ Imagen │ │ Imagen │      │
│ │Cemento │ │Taladro │      │
│ │$1,250  │ │$8,500  │      │
│ │[+]     │ │[+]     │      │
│ └────────┘ └────────┘      │
│ ┌────────┐ ┌────────┐      │
│ │ ...    │ │ ...    │      │
└─────────────────────────────┘
```

**Componentes a crear:**

1. **`src/components/cliente/ProductCard.tsx`**

```typescript
'use client';

import { Product } from '@/types/product';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  storeId: string;
  inCart?: number; // Cantidad en carrito
}

export function ProductCard({ product, storeId, inCart }: ProductCardProps) {
  const router = useRouter();
  
  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => router.push(`/tienda/${storeId}/producto/${product.sku}`)}
    >
      <div className="relative">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.stock < 10 && (
          <Badge className="absolute top-2 right-2 bg-accent-500">
            Quedan {product.stock}
          </Badge>
        )}
        {inCart && inCart > 0 && (
          <Badge className="absolute top-2 left-2 bg-primary-500">
            {inCart} en carrito
          </Badge>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-1">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-600">
            {formatPrice(product.price)}
          </span>
          <Button size="sm" className="rounded-full">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
```

2. **`src/app/tienda/[storeId]/catalogo/page.tsx`**

```typescript
'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/cliente/ProductCard';
import { ArrowLeft, Search, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import mockProducts from '@/data/mock-products.json';
import mockCategories from '@/data/mock-categories.json';

export default function CatalogoPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;
  const { cart } = useCartStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const filteredProducts = useMemo(() => {
    return mockProducts.products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        product.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory && product.isActive;
    });
  }, [searchQuery, selectedCategory]);
  
  const cartItemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  
  const getProductQuantityInCart = (productId: string) => {
    return cart?.items.find(item => item.productId === productId)?.quantity || 0;
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Catálogo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={() => router.push(`/tienda/${storeId}/carrito`)}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </div>
          
          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>
      
      {/* Tabs de categorías */}
      <div className="bg-white border-b sticky top-[76px] z-10">
        <div className="max-w-md mx-auto px-4 py-2 overflow-x-auto">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="w-full justify-start">
              <TabsTrigger value="all">Todos</TabsTrigger>
              {mockCategories.categories.map((cat) => (
                <TabsTrigger key={cat.id} value={cat.name}>
                  {cat.icon} {cat.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Grid de productos */}
      <div className="max-w-md mx-auto px-4 py-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron productos</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                storeId={storeId}
                inCart={getProductQuantityInCart(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

3. **`src/lib/utils.ts`** (Helper formatPrice)

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(priceInCents / 100);
}
```

#### **1.7 Crear Mock Data (2-3h)**

**Archivo:** `src/data/mock-products.json`

```json
{
  "products": [
    {
      "id": "prod_001",
      "sku": "CEM-PORT-50KG",
      "name": "Cemento Portland 50kg",
      "description": "Cemento gris de alta resistencia",
      "longDescription": "Ideal para obras de construcción, cimientos y columnas. Tiempo de fraguado: 4-6 horas. Resistencia a la compresión: 42.5 MPa.",
      "price": 125000,
      "stock": 150,
      "minStock": 20,
      "category": "Cemento",
      "imageUrl": "/images/cemento-portland.jpg",
      "unit": "bolsa",
      "bulkDiscounts": [
        { "minQty": 10, "discountPercent": 10, "label": "Comprá 10 y ahorrá 10%" },
        { "minQty": 50, "discountPercent": 18, "label": "Comprá 50 y ahorrá 18%" }
      ],
      "relatedProducts": ["prod_002", "prod_025"],
      "location": "Pasillo A, Estante 1",
      "isActive": true
    },
    {
      "id": "prod_002",
      "sku": "TAL-BOSCH-GSB",
      "name": "Taladro Inalámbrico Bosch GSB 18V",
      "description": "Taladro percutor con batería de litio",
      "longDescription": "Taladro inalámbrico profesional con batería de 18V, 2 velocidades, percutor integrado. Incluye maletín, 2 baterías y cargador.",
      "price": 850000,
      "stock": 8,
      "minStock": 3,
      "category": "Herramientas",
      "imageUrl": "/images/taladro-bosch.jpg",
      "unit": "unidad",
      "relatedProducts": ["prod_003", "prod_004"],
      "location": "Pasillo C, Estante 5",
      "isActive": true
    },
    {
      "id": "prod_003",
      "sku": "PIN-LAT-BLN-20L",
      "name": "Pintura Látex Interior Blanco 20L",
      "description": "Pintura lavable de alta cobertura",
      "longDescription": "Pintura látex acrílica para interiores, blanco mate. Rendimiento: 12-14 m²/litro. Secado al tacto: 30 minutos.",
      "price": 450000,
      "stock": 45,
      "minStock": 10,
      "category": "Pintura",
      "imageUrl": "/images/pintura-latex.jpg",
      "unit": "balde",
      "bulkDiscounts": [
        { "minQty": 3, "discountPercent": 5, "label": "Llevá 3 baldes y ahorrá 5%" }
      ],
      "relatedProducts": ["prod_010", "prod_011"],
      "comparisonGroup": "pinturas-latex",
      "location": "Pasillo B, Estante 2",
      "isActive": true
    }
    // ... (47 productos más)
  ]
}
```

**Archivo:** `src/data/mock-categories.json`

```json
{
  "categories": [
    { "id": "cat_001", "name": "Cemento", "icon": "🏗️", "slug": "cemento" },
    { "id": "cat_002", "name": "Herramientas", "icon": "🔨", "slug": "herramientas" },
    { "id": "cat_003", "name": "Pintura", "icon": "🎨", "slug": "pintura" },
    { "id": "cat_004", "name": "Electricidad", "icon": "⚡", "slug": "electricidad" },
    { "id": "cat_005", "name": "Plomería", "icon": "🚰", "slug": "plomeria" }
  ]
}
```

**Archivo:** `src/data/mock-stores.json`

```json
{
  "stores": [
    {
      "id": "store_001",
      "name": "Ferretería El Tornillo",
      "address": "Av. Siempreviva 742, CABA",
      "phone": "+54 11 1234-5678",
      "logo": "/logos/el-tornillo.png",
      "hours": "Lun-Vie: 8:00-19:00, Sáb: 8:00-13:00",
      "isActive": true
    }
  ]
}
```

#### **1.8 Configurar Zustand Stores (1h)**

**Archivo:** `src/stores/useCartStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, CartItem } from '@/types/cart';

interface CartStore {
  cart: Cart | null;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  initCart: (storeId: string, sessionId: string) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      
      initCart: (storeId: string, sessionId: string) => {
        const existingCart = get().cart;
        if (!existingCart) {
          set({
            cart: {
              items: [],
              subtotal: 0,
              discounts: 0,
              total: 0,
              storeId,
              sessionId,
              updatedAt: new Date(),
            },
          });
        }
      },
      
      addItem: (item: CartItem) => {
        const cart = get().cart;
        if (!cart) return;
        
        const existingItemIndex = cart.items.findIndex(
          (i) => i.productId === item.productId
        );
        
        let newItems: CartItem[];
        if (existingItemIndex >= 0) {
          newItems = [...cart.items];
          newItems[existingItemIndex].quantity += item.quantity;
        } else {
          newItems = [...cart.items, item];
        }
        
        const subtotal = newItems.reduce(
          (acc, i) => acc + i.price * i.quantity,
          0
        );
        
        // Calcular descuentos (simplificado)
        const discounts = 0; // TODO: Implementar lógica de descuentos
        
        set({
          cart: {
            ...cart,
            items: newItems,
            subtotal,
            discounts,
            total: subtotal - discounts,
            updatedAt: new Date(),
          },
        });
      },
      
      removeItem: (productId: string) => {
        const cart = get().cart;
        if (!cart) return;
        
        const newItems = cart.items.filter((i) => i.productId !== productId);
        const subtotal = newItems.reduce(
          (acc, i) => acc + i.price * i.quantity,
          0
        );
        
        set({
          cart: {
            ...cart,
            items: newItems,
            subtotal,
            total: subtotal - cart.discounts,
            updatedAt: new Date(),
          },
        });
      },
      
      updateQuantity: (productId: string, quantity: number) => {
        const cart = get().cart;
        if (!cart) return;
        
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        const newItems = cart.items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );
        
        const subtotal = newItems.reduce(
          (acc, i) => acc + i.price * i.quantity,
          0
        );
        
        set({
          cart: {
            ...cart,
            items: newItems,
            subtotal,
            total: subtotal - cart.discounts,
            updatedAt: new Date(),
          },
        });
      },
      
      clearCart: () => {
        set({ cart: null });
      },
    }),
    {
      name: 'picky-cart-storage',
    }
  )
);
```

**Archivo:** `src/stores/useUserStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/user';

interface UserStore {
  user: User | null;
  sessionId: string | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  initSession: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      sessionId: null,
      
      initSession: () => {
        const sessionId = crypto.randomUUID();
        set({ sessionId });
      },
      
      setUser: (user: User) => {
        set({ user });
      },
      
      clearUser: () => {
        set({ user: null });
      },
    }),
    {
      name: 'picky-user-storage',
    }
  )
);
```

#### **1.9 Configurar React Query (30min)**

**Archivo:** `src/app/providers.tsx`

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minuto
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

**Actualizar:** `src/app/layout.tsx`

```typescript
import { Providers } from './providers';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Picky - Smart In-Store Shopping',
  description: 'Escaneá, comprá y retirá sin cargar',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

#### **1.10 Deploy Inicial a Vercel (30min)**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Seguir wizard:
? Set up and deploy "~/picky"? [Y/n] Y
? Which scope do you want to deploy to? <tu-username>
? Link to existing project? [y/N] N
? What's your project's name? picky
? In which directory is your code located? ./
? Want to override the settings? [y/N] N
```

**Resultado Fase 1:**
- ✅ Proyecto Next.js inicializado
- ✅ Dependencias instaladas
- ✅ Estructura de carpetas creada
- ✅ TypeScript interfaces definidas
- ✅ Mock data creado
- ✅ Zustand stores configurados
- ✅ React Query configurado
- ✅ Deploy inicial funcionando

---

## 🟢 FASE 2: Experiencia Cliente Mobile (7-10 días)

### **Objetivo:** Crear las 8 pantallas del flujo de compra mobile

---

### ✅ **2.1 Pantalla Landing/Onboarding (1 día)** - **COMPLETADO**

**Ruta:** `/tienda/[storeId]/page.tsx`

**Wireframe:**
```
┌─────────────────────────────┐
│     Logo de la Tienda       │
│                             │
│  ¡Hola! Bienvenido a la     │
│  experiencia Picky en       │
│  Ferretería El Tornillo     │
│                             │
│  ┌─────────────────────┐   │
│  │  📸 Iniciar Recorrido │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │  🛒 Ver Mi Carrito   │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │  🔍 Ver Catálogo     │   │
│  └─────────────────────┘   │
│                             │
│  Horario: Lun-Vie 8-19hs   │
└─────────────────────────────┘
```

**Componentes a crear:**

1. **`src/app/tienda/[storeId]/page.tsx`** (Página principal)

```typescript
'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, ShoppingCart, Search } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import { useUserStore } from '@/stores/useUserStore';
import mockStores from '@/data/mock-stores.json';

export default function StoreLandingPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;
  
  const { cart, initCart } = useCartStore();
  const { sessionId, initSession } = useUserStore();
  
  const store = mockStores.stores.find(s => s.id === storeId);
  
  useEffect(() => {
    if (!sessionId) {
      initSession();
    }
    if (!cart && sessionId) {
      initCart(storeId, sessionId);
    }
  }, [sessionId, cart, storeId, initSession, initCart]);
  
  if (!store) {
    return <div>Tienda no encontrada</div>;
  }
  
  const cartItemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header con logo */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-full shadow-lg flex items-center justify-center">
            <span className="text-4xl">🏪</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Hola! Bienvenido a la experiencia Picky en
          </h1>
          <h2 className="text-3xl font-bold text-primary-600 mb-4">
            {store.name}
          </h2>
          <p className="text-gray-600">{store.address}</p>
          <p className="text-sm text-gray-500 mt-2">{store.hours}</p>
        </div>
        
        {/* CTAs principales */}
        <div className="space-y-4">
          <Button
            size="lg"
            className="w-full h-16 text-lg"
            onClick={() => router.push(`/tienda/${storeId}/escanear`)}
          >
            <Camera className="mr-2 h-6 w-6" />
            Iniciar Recorrido
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="w-full h-16 text-lg relative"
            onClick={() => router.push(`/tienda/${storeId}/carrito`)}
          >
            <ShoppingCart className="mr-2 h-6 w-6" />
            Ver Mi Carrito
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                {cartItemCount}
              </span>
            )}
          </Button>
          
          <Button
            size="lg"
            variant="ghost"
            className="w-full h-16 text-lg"
            onClick={() => router.push(`/tienda/${storeId}/catalogo`)}
          >
            <Search className="mr-2 h-6 w-6" />
            Ver Catálogo
          </Button>
        </div>
        
        {/* Info adicional */}
        <Card className="mt-8 p-4 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">
            ¿Cómo funciona Picky?
          </h3>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Escaneá los códigos QR de los productos</li>
            <li>2. Agregá lo que necesitás a tu carrito</li>
            <li>3. Pagá con MercadoPago</li>
            <li>4. Retirá tu pedido preparado ¡Sin cargar nada!</li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
```

**Tareas:**
- ✅ Crear layout base mobile
- ✅ Integrar Zustand para inicializar sesión
- ✅ Detectar storeId de URL
- ✅ Mostrar datos de mock-stores.json
- ✅ Badge de cantidad en botón Carrito
- ✅ Animaciones Framer Motion (opcional)

**Testing:**
- Probar navegación a /escanear, /carrito, /catalogo
- Verificar que sessionId se genera correctamente
- Verificar que badge de carrito muestra cantidad

---

### ✅ **2.2 Pantalla Catálogo de Productos (1.5 días)** - **COMPLETADO**

**Ruta:** `/tienda/[storeId]/catalogo/page.tsx`

**Wireframe:**
```
┌─────────────────────────────┐
│ ← Catálogo      🛒 (3)      │
├─────────────────────────────┤
│ 🔍 Buscar productos...      │
├─────────────────────────────┤
│ 🏗️Cemento 🔨Herram. 🎨Pint.│ <- Tabs horizontales
├─────────────────────────────┤
│ ┌────────┐ ┌────────┐      │
│ │ Imagen │ │ Imagen │      │
│ │Cemento │ │Taladro │      │
│ │$1,250  │ │$8,500  │      │
│ │[+]     │ │[+]     │      │
│ └────────┘ └────────┘      │
│ ┌────────┐ ┌────────┐      │
│ │ ...    │ │ ...    │      │
└─────────────────────────────┘
```

**Componentes a crear:**

1. **`src/components/cliente/ProductCard.tsx`**

```typescript
'use client';

import { Product } from '@/types/product';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  storeId: string;
  inCart?: number; // Cantidad en carrito
}

export function ProductCard({ product, storeId, inCart }: ProductCardProps) {
  const router = useRouter();
  
  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => router.push(`/tienda/${storeId}/producto/${product.sku}`)}
    >
      <div className="relative">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.stock < 10 && (
          <Badge className="absolute top-2 right-2 bg-accent-500">
            Quedan {product.stock}
          </Badge>
        )}
        {inCart && inCart > 0 && (
          <Badge className="absolute top-2 left-2 bg-primary-500">
            {inCart} en carrito
          </Badge>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-1">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-600">
            {formatPrice(product.price)}
          </span>
          <Button size="sm" className="rounded-full">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
```

2. **`src/app/tienda/[storeId]/catalogo/page.tsx`**

```typescript
'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/cliente/ProductCard';
import { ArrowLeft, Search, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import mockProducts from '@/data/mock-products.json';
import mockCategories from '@/data/mock-categories.json';

export default function CatalogoPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;
  const { cart } = useCartStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const filteredProducts = useMemo(() => {
    return mockProducts.products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        product.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory && product.isActive;
    });
  }, [searchQuery, selectedCategory]);
  
  const cartItemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  
  const getProductQuantityInCart = (productId: string) => {
    return cart?.items.find(item => item.productId === productId)?.quantity || 0;
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Catálogo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={() => router.push(`/tienda/${storeId}/carrito`)}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
               