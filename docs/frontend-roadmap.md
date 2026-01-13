# 🎨 FRONTEND ROADMAP - Picky

**Última Actualización:** 13 Enero 2026  
**Estado:** 🟡 **MVP Prototipo @ 0%** (Comenzando desde cero)  
**Objetivo:** Sistema Scan & Go para tiendas físicas (Mobile First)

---

## 📋 RESUMEN EJECUTIVO

**Picky** es una PWA de "Smart Shopping" que transforma la experiencia de compra en tiendas físicas. El MVP se divide en **3 experiencias principales**:

1. **👤 Cliente Mobile** (10 pantallas) - 📱 100% Mobile
2. **📦 Picker Desktop** (3 pantallas) - 💻 Desktop-oriented
3. **📊 Admin Dashboard** (4 pantallas) - 💻 Desktop-oriented

**Total:** 17 pantallas core + componentes reutilizables  
**Duración estimada:** 25-30 días de desarrollo  
**Stack:** Next.js 15 + TypeScript + Shadcn/UI + Zustand + React Query

**Desglose Cliente Mobile (10 pantallas):**
1. Landing Principal (home con login)
2. Landing Tienda (bienvenida del local)
3. Escáner QR
4. Catálogo de Productos
5. PDP (Product Detail Page)
6. Modal Ofertas Combinadas (popup automático)
7. Carrito de Compras
8. Checkout & Pago
9. Estado del Pedido (cliente esperando)
10. Confirmación de Retiro

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

### **2.1 Pantalla Landing/Onboarding (1 día)**

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

### **2.2 Pantalla Catálogo de Productos (1.5 días)**

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

**Tareas:**
- ✅ Crear ProductCard reutilizable
- ✅ Implementar búsqueda en tiempo real
- ✅ Tabs de categorías horizontales
- ✅ Mostrar badge de cantidad en carrito
- ✅ Grid responsivo 2 columnas
- ✅ Sticky header y tabs
- ✅ Empty state

---

### **2.3 Pantalla QR Scanner (1 día)**

**Ruta:** `/tienda/[storeId]/escanear/page.tsx`

**Wireframe:**
```
┌─────────────────────────────┐
│          ← Escanear         │
│                             │
│   ┌─────────────────────┐   │
│   │                     │   │
│   │   [CAMERA VIEW]     │   │
│   │                     │   │
│   │   ┌───────────┐     │   │
│   │   │           │     │   │ <- Overlay guía
│   │   │           │     │   │
│   │   └───────────┘     │   │
│   │                     │   │
│   └─────────────────────┘   │
│                             │
│ Apuntá al código QR del     │
│ producto                    │
│                             │
│  [Ver Carrito] 🛒 (3)       │
└─────────────────────────────┘
```

**Componentes a crear:**

1. **`src/components/cliente/QRScanner.tsx`**

```typescript
'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
}

export function QRScanner({ onScanSuccess, onScanError }: QRScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScanning = useRef(false);
  
  useEffect(() => {
    const initScanner = async () => {
      try {
        const scanner = new Html5Qrcode('qr-reader');
        scannerRef.current = scanner;
        
        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            if (!isScanning.current) {
              isScanning.current = true;
              onScanSuccess(decodedText);
              // Reset después de 2 segundos
              setTimeout(() => {
                isScanning.current = false;
              }, 2000);
            }
          },
          (errorMessage) => {
            // Ignorar errores de "QR no encontrado" (muy frecuentes)
            if (!errorMessage.includes('NotFoundException')) {
              console.error(errorMessage);
            }
          }
        );
      } catch (err) {
        const errorMsg = 'No se pudo acceder a la cámara. Verificá los permisos.';
        setError(errorMsg);
        onScanError?.(errorMsg);
      }
    };
    
    initScanner();
    
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [onScanSuccess, onScanError]);
  
  if (error) {
    return (
      <Card className="p-6 bg-red-50 border-red-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900 mb-1">Error de Cámara</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </Card>
    );
  }
  
  return (
    <div className="relative">
      <div id="qr-reader" className="rounded-lg overflow-hidden" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-64 h-64 border-4 border-primary-500 rounded-lg animate-scan-pulse" />
        </div>
      </div>
    </div>
  );
}
```

2. **`src/app/tienda/[storeId]/escanear/page.tsx`**

```typescript
'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { QRScanner } from '@/components/cliente/QRScanner';
import { useCartStore } from '@/stores/useCartStore';
import { toast } from '@/components/ui/use-toast';
import mockProducts from '@/data/mock-products.json';

export default function EscanearPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;
  const { cart } = useCartStore();
  
  const handleScanSuccess = (decodedText: string) => {
    // Buscar producto por SKU
    const product = mockProducts.products.find(p => p.sku === decodedText);
    
    if (product) {
      // Vibrar (si está disponible)
      if ('vibrate' in navigator) {
        navigator.vibrate(200);
      }
      
      // Redirigir a PDP
      router.push(`/tienda/${storeId}/producto/${product.sku}`);
    } else {
      toast({
        title: 'Código no reconocido',
        description: 'El código QR escaneado no corresponde a un producto válido.',
        variant: 'destructive',
      });
    }
  };
  
  const cartItemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Escanear
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="relative text-white hover:bg-white/10"
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
        </div>
      </div>
      
      {/* Scanner */}
      <div className="max-w-md mx-auto px-4 py-8">
        <QRScanner onScanSuccess={handleScanSuccess} />
        
        <div className="text-center mt-6">
          <p className="text-white text-lg font-medium mb-2">
            Apuntá al código QR del producto
          </p>
          <p className="text-gray-400 text-sm">
            El escaneo se realizará automáticamente
          </p>
        </div>
      </div>
    </div>
  );
}
```

**Tareas:**
- ✅ Integrar html5-qrcode
- ✅ Solicitar permisos de cámara
- ✅ Overlay con guías visuales
- ✅ Vibración al escanear (si está disponible)
- ✅ Redirigir a PDP al detectar QR
- ✅ Toast error si QR no válido
- ✅ Background oscuro para mejor contraste

---

### **2.4 Product Detail Page - PDP (2 días)**

**Ruta:** `/tienda/[storeId]/producto/[sku]/page.tsx`

**Wireframe:**
```
┌─────────────────────────────┐
│ ← Cemento Portland  🛒 (3)  │
├─────────────────────────────┤
│  [Imagen Grande Producto]   │
│  ◄  1/4  ►  (carousel)      │
├─────────────────────────────┤
│ Cemento Portland 50kg       │
│ $1,250                      │
│ ✅ Hay stock (23 unidades)  │
│                             │
│ 🏷️ Comprá 10 y ahorrá 15%  │
│                             │
│ Descripción:                │
│ Cemento de alta calidad...  │
│                             │
│ ▼ Especificaciones técnicas │
│   (accordion collapsible)   │
│                             │
│ Cantidad: [-] [2] [+]       │
│                             │
│ Observaciones: (opcional)   │
│ [___________________]       │
│                             │
│ [Agregar al Pedido] 🟢      │
│ [Dejar]             ⚪      │
│                             │
│ 🛍️ También te puede gustar: │
│ [carousel productos]        │
└─────────────────────────────┘
```

**Componentes a crear:**

1. **`src/app/tienda/[storeId]/producto/[sku]/page.tsx`**

```typescript
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Minus, Plus, ArrowLeft, ShoppingCart, AlertCircle } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import mockProducts from '@/data/mock-products.json';
import { motion } from 'framer-motion';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem, cart } = useCartStore();
  
  const product = mockProducts.products.find(p => p.sku === params.sku);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [showOffersModal, setShowOffersModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) {
    return <div className="p-4">Producto no encontrado</div>;
  }

  // Calcular descuento por cantidad
  const applicableDiscount = product.bulkDiscounts
    ?.filter(d => quantity >= d.minQty)
    .sort((a, b) => b.discountPercent - a.discountPercent)[0];

  const finalPrice = applicableDiscount
    ? product.price * (1 - applicableDiscount.discountPercent / 100)
    : product.price;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      sku: product.sku,
      name: product.name,
      price: finalPrice,
      quantity,
      imageUrl: product.imageUrl,
      notes,
      discountApplied: applicableDiscount?.discountPercent,
      addedAt: new Date(),
    });

    // Mostrar modal de ofertas si hay productos relacionados
    if (product.relatedProducts && product.relatedProducts.length > 0) {
      setShowOffersModal(true);
    } else {
      router.push(`/tienda/${params.storeId}/carrito`);
    }
  };

  const relatedProducts = mockProducts.products.filter(p =>
    product.relatedProducts?.includes(p.id)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-2">
          <ArrowLeft size={20} />
          <span className="font-medium">{product.name}</span>
        </button>
        <button
          onClick={() => router.push(`/tienda/${params.storeId}/carrito`)}
          className="relative"
        >
          <ShoppingCart size={24} />
          {cart && cart.items.length > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-green-500">
              {cart.items.length}
            </Badge>
          )}
        </button>
      </header>

      {/* Image Carousel */}
      <div className="relative bg-white">
        <img
          src={product.images?.[currentImageIndex] || product.imageUrl}
          alt={product.name}
          className="w-full h-80 object-cover"
        />
        {product.images && product.images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Product Info */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl font-bold text-green-600">
              ${(finalPrice * quantity).toLocaleString()}
            </span>
            {applicableDiscount && (
              <Badge className="bg-orange-500">
                -{applicableDiscount.discountPercent}%
              </Badge>
            )}
          </div>

          {/* Stock Badge */}
          {product.stock > 10 ? (
            <Badge className="bg-green-100 text-green-800">
              ✅ Hay stock ({product.stock} unidades)
            </Badge>
          ) : product.stock > 0 ? (
            <Badge className="bg-orange-100 text-orange-800">
              ⚠️ Últimas {product.stock} unidades
            </Badge>
          ) : (
            <Badge className="bg-red-100 text-red-800">
              ❌ Sin stock
            </Badge>
          )}
        </div>

        {/* Bulk Discount Banner */}
        {product.bulkDiscounts && product.bulkDiscounts.length > 0 && (
          <Card className="p-3 bg-orange-50 border-orange-200">
            <p className="text-sm font-medium text-orange-800">
              🏷️ {product.bulkDiscounts[0].label || 
                   `Comprá ${product.bulkDiscounts[0].minQty} y ahorrá ${product.bulkDiscounts[0].discountPercent}%`}
            </p>
          </Card>
        )}

        {/* Description */}
        <div>
          <h3 className="font-semibold mb-2">Descripción</h3>
          <p className="text-gray-600">{product.description}</p>
        </div>

        {/* Specifications (Accordion) */}
        {product.longDescription && (
          <details className="bg-white p-4 rounded-lg border">
            <summary className="font-semibold cursor-pointer">
              Especificaciones técnicas
            </summary>
            <p className="mt-2 text-sm text-gray-600">{product.longDescription}</p>
          </details>
        )}

        {/* Quantity Selector */}
        <div className="space-y-2">
          <label className="font-semibold">Cantidad</label>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus size={16} />
            </Button>
            <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              disabled={quantity >= product.stock}
            >
              <Plus size={16} />
            </Button>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="font-semibold">Observaciones (opcional)</label>
          <Textarea
            placeholder="Ej: Sin tornillos, solo tuercas"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">🛍️ También te puede gustar</h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {relatedProducts.map((related) => (
                <Card
                  key={related.id}
                  className="min-w-[140px] cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => router.push(`/tienda/${params.storeId}/producto/${related.sku}`)}
                >
                  <img
                    src={related.imageUrl}
                    alt={related.name}
                    className="w-full h-24 object-cover rounded-t-lg"
                  />
                  <div className="p-2">
                    <p className="text-xs font-medium truncate">{related.name}</p>
                    <p className="text-sm font-bold text-green-600">${related.price}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pb-4">
          <Button
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="mr-2" size={20} />
            Agregar al Pedido
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.back()}
          >
            Dejar
          </Button>
        </div>
      </div>

      {/* Modal de Ofertas Combinadas */}
      <Dialog open={showOffersModal} onOpenChange={setShowOffersModal}>
        <DialogContent className="max-w-md">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold">💡 Otros clientes también llevaron...</h2>
            <div className="space-y-3">
              {relatedProducts.slice(0, 3).map((related) => (
                <Card key={related.id} className="p-3 flex gap-3">
                  <img
                    src={related.imageUrl}
                    alt={related.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{related.name}</p>
                    <p className="text-green-600 font-bold">${related.price}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      addItem({
                        productId: related.id,
                        sku: related.sku,
                        name: related.name,
                        price: related.price,
                        quantity: 1,
                        imageUrl: related.imageUrl,
                        addedAt: new Date(),
                      });
                    }}
                  >
                    Agregar
                  </Button>
                </Card>
              ))}
            </div>
            <Button
              className="w-full"
              onClick={() => {
                setShowOffersModal(false);
                router.push(`/tienda/${params.storeId}/carrito`);
              }}
            >
              Ir al Carrito
            </Button>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

**Tareas:**
- ✅ Hero image con carousel (si hay múltiples imágenes)
- ✅ Precio grande destacado + badge de descuento
- ✅ Stock badge con colores (verde/naranja/rojo)
- ✅ Banner de ofertas por cantidad
- ✅ Selector de cantidad con límite de stock
- ✅ Textarea para observaciones del cliente
- ✅ Accordion de especificaciones técnicas
- ✅ Carousel de productos relacionados
- ✅ Modal automático de ofertas al agregar al carrito
- ✅ Animaciones con Framer Motion

---

### **2.5 Carrito de Compras (2 días)**

**Ruta:** `/tienda/[storeId]/carrito/page.tsx`

**Wireframe:**
```
┌─────────────────────────────┐
│ ← Mi Carrito (12 productos) │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │[img] Cemento Portland   │ │
│ │     $1,250 x 2          │ │
│ │     Subtotal: $2,500    │ │
│ │     [-] 2 [+]  [🗑️]    │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │[img] Taladro Bosch      │ │
│ │     $8,500 x 1          │ │
│ │     Subtotal: $8,500    │ │
│ │     [-] 1 [+]  [🗑️]    │ │
│ └─────────────────────────┘ │
│                             │
│ 🎁 Ofertas relacionadas:    │
│ [carousel de productos]     │
│                             │
├─────────────────────────────┤
│ Resumen:                    │
│ Subtotal:       $15,000     │
│ Descuentos:    -$2,500 🟢   │
│ ────────────────────────    │
│ TOTAL A PAGAR:  $12,500     │
│                             │
│ [IR A PAGAR] 🟢 full width  │
│ Seguir comprando            │
└─────────────────────────────┘
```

**Componente principal:**

```typescript
'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import mockProducts from '@/data/mock-products.json';
import { motion } from 'framer-motion';

export default function CarritoPage() {
  const params = useParams();
  const router = useRouter();
  const { cart, updateQuantity, removeItem } = useCartStore();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <ShoppingCart size={64} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-bold mb-2">Tu carrito está vacío</h2>
        <p className="text-gray-600 mb-6 text-center">
          ¡Comenzá a agregar productos para crear tu pedido!
        </p>
        <Button
          onClick={() => router.push(`/tienda/${params.storeId}/catalogo`)}
          className="bg-green-600 hover:bg-green-700"
        >
          Ver Catálogo
        </Button>
      </div>
    );
  }

  // Productos relacionados (sugerencias basadas en el carrito)
  const suggestedProducts = mockProducts.products
    .filter(p => !cart.items.some(item => item.productId === p.id))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold">
          Mi Carrito ({cart.items.reduce((sum, item) => sum + item.quantity, 0)} productos)
        </h1>
      </header>

      <div className="p-4 space-y-4">
        {/* Cart Items */}
        <div className="space-y-3">
          {cart.items.map((item, index) => (
            <motion.div
              key={item.productId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4">
                <div className="flex gap-3">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      ${item.price.toLocaleString()} x {item.quantity}
                    </p>
                    {item.discountApplied && (
                      <Badge className="bg-orange-500 text-xs mt-1">
                        -{item.discountApplied}% aplicado
                      </Badge>
                    )}
                    {item.notes && (
                      <p className="text-xs text-gray-500 mt-1">
                        Nota: {item.notes}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-2 border rounded">
                        <button
                          className="p-1 hover:bg-gray-100"
                          onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-bold w-8 text-center">{item.quantity}</span>
                        <button
                          className="p-1 hover:bg-gray-100"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      ${(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Suggested Products */}
        {suggestedProducts.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">🎁 Llevá también estos productos</h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {suggestedProducts.map((product) => (
                <Card
                  key={product.id}
                  className="min-w-[140px] cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => router.push(`/tienda/${params.storeId}/producto/${product.sku}`)}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-24 object-cover rounded-t-lg"
                  />
                  <div className="p-2">
                    <p className="text-xs font-medium truncate">{product.name}</p>
                    <p className="text-sm font-bold text-green-600">${product.price}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Summary (Fixed) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>${cart.subtotal.toLocaleString()}</span>
          </div>
          {cart.discounts > 0 && (
            <div className="flex justify-between text-sm text-green-600 font-semibold">
              <span>Descuentos:</span>
              <span>-${cart.discounts.toLocaleString()} ¡Ahorraste!</span>
            </div>
          )}
          <div className="flex justify-between text-xl font-bold pt-2 border-t">
            <span>TOTAL A PAGAR:</span>
            <span className="text-green-600">${cart.total.toLocaleString()}</span>
          </div>
        </div>
        <Button
          className="w-full bg-green-600 hover:bg-green-700 animate-pulse"
          size="lg"
          onClick={() => router.push(`/tienda/${params.storeId}/checkout`)}
        >
          IR A PAGAR
        </Button>
        <button
          className="w-full text-center text-sm text-gray-600 mt-2"
          onClick={() => router.push(`/tienda/${params.storeId}/catalogo`)}
        >
          Seguir comprando
        </button>
      </div>
    </div>
  );
}
```

**Tareas:**
- ✅ Empty state con CTA "Ver Catálogo"
- ✅ Lista de items con thumbnail + selector cantidad inline
- ✅ Botón eliminar item con confirmación visual
- ✅ Badge de descuento aplicado por item
- ✅ Carousel de productos sugeridos
- ✅ Resumen fixed en bottom (subtotal, descuentos destacados en verde, total)
- ✅ Botón "IR A PAGAR" con animación pulse
- ✅ Link "Seguir comprando"
- ✅ Animaciones staggered con Framer Motion

---

### **2.6 Checkout & Pago (2 días)**

**Ruta:** `/tienda/[storeId]/checkout/page.tsx`

**Wireframe:**
```
┌─────────────────────────────┐
│ ← Finalizar Compra          │
├─────────────────────────────┤
│ ●━━○━━○  (Stepper 3 pasos)  │
│                             │
│ 📦 Resumen del Pedido       │
│ ┌─────────────────────────┐ │
│ │ 12 productos             │ │
│ │ Total: $12,500           │ │
│ │ Tiempo estimado: ~10 min │ │
│ └─────────────────────────┘ │
│                             │
│ 💳 Método de Pago           │
│ ┌─────────────────────────┐ │
│ │ [Logo MP]               │ │
│ │ Pagar con MercadoPago   │ │
│ └─────────────────────────┘ │
│                             │
│ [CONFIRMAR PAGO] 🟢         │
└─────────────────────────────┘
```

**Componente:**

```typescript
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Package, CreditCard, Clock } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import { useOrderStore } from '@/stores/useOrderStore';
import { motion } from 'framer-motion';

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const { cart, clearCart } = useCartStore();
  const { createOrder } = useOrderStore();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!cart || cart.items.length === 0) {
    router.push(`/tienda/${params.storeId}/carrito`);
    return null;
  }

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulación de pago con MercadoPago
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Crear orden
    const orderId = `ORD-${Date.now()}`;
    const order = {
      id: orderId,
      storeId: params.storeId as string,
      items: cart.items.map(item => ({
        productId: item.productId,
        sku: item.sku,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
        notes: item.notes,
        isPicked: false,
      })),
      subtotal: cart.subtotal,
      discounts: cart.discounts,
      total: cart.total,
      status: 'PAID' as const,
      statusHistory: [{
        from: 'PENDING_PAYMENT' as const,
        to: 'PAID' as const,
        timestamp: new Date(),
      }],
      pickupQRCode: `QR-${orderId}`,
      createdAt: new Date(),
      paidAt: new Date(),
    };

    createOrder(order);
    clearCart();

    // Redirigir a estado del pedido
    router.push(`/tienda/${params.storeId}/pedido/${orderId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold">Finalizar Compra</h1>
      </header>

      {/* Stepper */}
      <div className="bg-white p-4 border-b">
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
              1
            </div>
            <div className="w-16 h-1 bg-green-600"></div>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
              2
            </div>
            <div className="w-16 h-1 bg-gray-300"></div>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold">
            3
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-2">
          <span>Carrito</span>
          <span className="font-semibold">Pago</span>
          <span>Confirmación</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Resumen del Pedido */}
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <Package size={20} />
            <span>Resumen del Pedido</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>{cart.items.reduce((sum, item) => sum + item.quantity, 0)} productos</span>
              <span className="font-bold">${cart.total.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={16} />
              <span>Tiempo estimado de preparación: ~10 minutos</span>
            </div>
          </div>
        </Card>

        {/* Método de Pago */}
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <CreditCard size={20} />
            <span>Método de Pago</span>
          </div>
          <div className="border-2 border-blue-500 rounded-lg p-4 flex items-center gap-3 bg-blue-50">
            <img
              src="/mercadopago-logo.png"
              alt="MercadoPago"
              className="h-8"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div>
              <p className="font-semibold">MercadoPago</p>
              <p className="text-xs text-gray-600">Tarjetas, QR, Efectivo</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            🔒 Simulación MVP: Al confirmar, se procesará un pago de prueba
          </p>
        </Card>

        {/* Detalles de Items (Collapsible) */}
        <details className="bg-white border rounded-lg">
          <summary className="p-4 cursor-pointer font-semibold">
            Ver detalle de productos ({cart.items.length})
          </summary>
          <div className="px-4 pb-4 space-y-2">
            {cart.items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span>{item.name} x{item.quantity}</span>
                <span className="font-semibold">${(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </details>

        {/* Botón Confirmar */}
        <Button
          className="w-full bg-green-600 hover:bg-green-700"
          size="lg"
          onClick={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            >
              ⏳
            </motion.div>
          ) : (
            'CONFIRMAR PAGO'
          )}
        </Button>

        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-gray-600"
          >
            Procesando pago...
          </motion.div>
        )}
      </div>
    </div>
  );
}
```

**Tareas:**
- ✅ Stepper visual (3 pasos: Carrito → Pago → Confirmación)
- ✅ Card resumen con tiempo estimado de preparación
- ✅ Card método de pago con logo MercadoPago
- ✅ Detalles collapsible de productos
- ✅ Simulación de pago (spinner 2 segundos)
- ✅ Loading state con animación
- ✅ Crear orden en orderStore
- ✅ Clear cart después de pago exitoso
- ✅ Redirección automática a estado del pedido

---

**CONTINÚA EN SIGUIENTE SECCIÓN (2.7-2.9 + Phase 3-5)...**

---

## 📊 RESUMEN DE PROGRESO

| Fase | Estado | Duración | Progreso |
|------|--------|----------|----------|
| FASE 1: Setup | ⏳ Pendiente | 2-3 días | 0% (Documentado) |
| FASE 2: Cliente Mobile | ⏳ Pendiente | 12-15 días | 100% (Documentado) |
| FASE 3: Picker Desktop | ⏳ Pendiente | 3-4 días | 100% (Documentado) |
| FASE 4: Admin Desktop | ⏳ Pendiente | 4-5 días | 100% (Documentado) |
| FASE 5: Polish & Testing | ⏳ Pendiente | 2-3 días | 100% (Documentado) |

**Total Estimado:** 25-30 días de desarrollo

---

### **2.7 Estado del Pedido - Cliente (2 días)**

**Ruta:** `/tienda/[storeId]/pedido/[orderId]/page.tsx`

**Objetivo:** Mostrar progreso del pedido en tiempo real con notificaciones

**Wireframe:**
```
┌─────────────────────────────┐
│    Estado de tu Pedido      │
│        #ORD-123456          │
├─────────────────────────────┤
│                             │
│  ✅ Pedido recibido         │
│   │                         │
│   ●  En preparación         │
│   │  (spinner animado)      │
│   ○  Listo para retirar     │
│   │                         │
│   ○  Entregado              │
│                             │
│ ⏱️ Estimamos 8 minutos      │
│                             │
│ ┌─────────────────────────┐ │
│ │ Estamos preparando tu   │ │
│ │ pedido. Tenemos café    │ │
│ │ gratis en la barra      │ │
│ │ mientras esperás ☕      │ │
│ │                         │ │
│ │ [Animación cajas]       │ │
│ └─────────────────────────┘ │
│                             │
│ [Ver Detalle del Pedido]    │
└─────────────────────────────┘
```

**Componente completo:**

```typescript
'use client';

import { useParams, useRouter } from 'next/parameter';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, Package, PartyPopper } from 'lucide-react';
import { useOrderStore } from '@/stores/useOrderStore';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const ORDER_STATUS_STEPS = [
  { status: 'PAID', label: 'Pedido recibido', icon: Check },
  { status: 'PREPARING', label: 'En preparación', icon: Package },
  { status: 'READY_TO_PICKUP', label: 'Listo para retirar', icon: PartyPopper },
  { status: 'DELIVERED', label: 'Entregado', icon: Check },
];

export default function EstadoPedidoPage() {
  const params = useParams();
  const router = useRouter();
  const { orders, updateOrderStatus } = useOrderStore();
  const [showQR, setShowQR] = useState(false);
  
  const order = orders.find(o => o.id === params.orderId);

  // Simular cambio de estado (en producción vendría del backend)
  useEffect(() => {
    if (!order) return;

    if (order.status === 'PAID') {
      // Después de 3 segundos, cambiar a PREPARING
      setTimeout(() => {
        updateOrderStatus(order.id, 'PREPARING');
      }, 3000);
    } else if (order.status === 'PREPARING') {
      // Después de 10 segundos, cambiar a READY_TO_PICKUP
      setTimeout(() => {
        updateOrderStatus(order.id, 'READY_TO_PICKUP');
        
        // Mostrar confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        // Vibración y sonido
        if ('vibrate' in navigator) {
          navigator.vibrate([200, 100, 200]);
        }

        // Mostrar notificación
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('¡Tu pedido está listo! 🎉', {
            body: 'Podés pasar a retirarlo por el check-out',
            icon: '/picky-logo.png',
          });
        }

        setShowQR(true);
      }, 10000);
    }
  }, [order?.status]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="p-6 text-center">
          <p className="text-lg font-semibold mb-2">Pedido no encontrado</p>
          <Button onClick={() => router.push(`/tienda/${params.storeId}`)}>
            Volver al inicio
          </Button>
        </Card>
      </div>
    );
  }

  const currentStepIndex = ORDER_STATUS_STEPS.findIndex(s => s.status === order.status);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3 text-center">
        <h1 className="text-lg font-bold">Estado de tu Pedido</h1>
        <p className="text-sm text-gray-600">#{order.id}</p>
      </header>

      <div className="p-4 space-y-6">
        {/* Status Stepper */}
        <Card className="p-6">
          <div className="space-y-4">
            {ORDER_STATUS_STEPS.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const Icon = step.icon;

              return (
                <div key={step.status} className="flex items-start gap-3">
                  <div className="relative">
                    <motion.div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted || isCurrent
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                      animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      {isCurrent && step.status === 'PREPARING' ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                        >
                          <Package size={20} />
                        </motion.div>
                      ) : (
                        <Icon size={20} />
                      )}
                    </motion.div>
                    {index < ORDER_STATUS_STEPS.length - 1 && (
                      <div
                        className={`absolute left-5 top-10 w-0.5 h-8 ${
                          isCompleted ? 'bg-green-600' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 pt-2">
                    <p className={`font-semibold ${isCurrent ? 'text-green-600' : ''}`}>
                      {step.label}
                    </p>
                    {isCurrent && step.status === 'PREPARING' && (
                      <p className="text-sm text-gray-600">Estimamos 8 minutos</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Message based on status */}
        <AnimatePresence mode="wait">
          {order.status === 'PREPARING' && (
            <motion.div
              key="preparing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-6 text-center bg-blue-50 border-blue-200">
                <Clock size={48} className="mx-auto mb-3 text-blue-600" />
                <h3 className="text-lg font-bold mb-2">Estamos preparando tu pedido</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Tenemos café gratis en la barra mientras esperás ☕
                </p>
                <div className="w-24 h-24 mx-auto">
                  {/* Aquí iría una Lottie animation de cajas moviéndose */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-4xl"
                  >
                    📦
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          )}

          {order.status === 'READY_TO_PICKUP' && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="p-6 text-center bg-green-50 border-green-200">
                <PartyPopper size={48} className="mx-auto mb-3 text-green-600" />
                <h3 className="text-2xl font-bold mb-2">¡Tu pedido está listo! 🎊</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Mostrá este código en el check-out
                </p>

                {/* QR Code */}
                <div className="bg-white p-4 rounded-lg inline-block">
                  <div className="w-48 h-48 bg-gray-100 flex items-center justify-center text-6xl">
                    {/* Aquí iría el QR real generado con `qrcode` */}
                    QR
                  </div>
                  <p className="mt-2 font-mono text-sm">{order.pickupQRCode}</p>
                </div>

                <Button
                  className="mt-4 w-full"
                  onClick={() => router.push(`/tienda/${params.storeId}/confirmacion`)}
                >
                  Ya retiré mi pedido
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order Details (Collapsible) */}
        <details className="bg-white border rounded-lg">
          <summary className="p-4 cursor-pointer font-semibold">
            Ver detalle del pedido ({order.items.length} productos)
          </summary>
          <div className="px-4 pb-4 space-y-2">
            {order.items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span>{item.name} x{item.quantity}</span>
                <span className="font-semibold">${(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="pt-2 border-t flex justify-between font-bold">
              <span>TOTAL:</span>
              <span>${order.total.toLocaleString()}</span>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
```

**Tareas:**
- ✅ Stepper visual con 4 estados (iconos + líneas conectoras)
- ✅ Animación spinner en estado "En preparación"
- ✅ Simulación de cambio de estado (setTimeout)
- ✅ Confetti animation al pasar a "Listo" (canvas-confetti)
- ✅ Vibración del dispositivo (navigator.vibrate)
- ✅ Notificación push del navegador
- ✅ QR code grande para retiro (placeholder para qrcode library)
- ✅ Lottie animation de cajas (placeholder con emoji animado)
- ✅ Detalles collapsible del pedido
- ✅ Botón "Ya retiré mi pedido"

---

### **2.8 Confirmación de Retiro (1 día)**

**Ruta:** `/tienda/[storeId]/confirmacion/page.tsx`

**Wireframe:**
```
┌─────────────────────────────┐
│                             │
│         ✅ (animado)        │
│                             │
│  ¡Gracias por comprar con   │
│  Picky en Ferretería        │
│  El Tornillo!               │
│                             │
│ ┌─────────────────────────┐ │
│ │ Pedido #ORD-123456      │ │
│ │ Retirado: 13/01 15:30   │ │
│ │                         │ │
│ │ 12 productos            │ │
│ │ Total: $12,500          │ │
│ │                         │ │
│ │ [Descargar Factura]     │ │
│ └─────────────────────────┘ │
│                             │
│ ¿Cómo fue tu experiencia?   │
│ ⭐⭐⭐⭐⭐                    │
│                             │
│ Comentarios (opcional):     │
│ [___________________]       │
│                             │
│ [Iniciar Nueva Compra]      │
└─────────────────────────────┘
```

**Componente:**

```typescript
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Download, Star } from 'lucide-react';
import { useOrderStore } from '@/stores/useOrderStore';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function ConfirmacionPage() {
  const params = useParams();
  const router = useRouter();
  const { orders } = useOrderStore();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // En producción, orderId vendría de la URL o del último pedido
  const lastOrder = orders[orders.length - 1];

  useState(() => {
    // Confetti al cargar la página
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.4 }
    });
  });

  const handleSubmitFeedback = () => {
    // Simular envío de feedback
    setSubmitted(true);
    console.log('Feedback:', { rating, feedback, orderId: lastOrder?.id });
  };

  const handleDownloadInvoice = () => {
    // Simular descarga de factura (en producción generaría PDF)
    alert('Descargando factura... (simulado)');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="mb-6"
      >
        <CheckCircle size={80} className="text-green-600" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-center mb-2"
      >
        ¡Gracias por comprar con Picky!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-600 text-center mb-6"
      >
        en Ferretería El Tornillo
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-md space-y-4"
      >
        {/* Order Summary */}
        {lastOrder && (
          <Card className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Pedido #{lastOrder.id}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadInvoice}
                >
                  <Download size={16} className="mr-2" />
                  Factura
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                Retirado: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
              </p>
              <div className="pt-2 border-t space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>{lastOrder.items.reduce((sum, item) => sum + item.quantity, 0)} productos</span>
                  <span className="font-bold text-green-600">${lastOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Feedback Section */}
        {!submitted ? (
          <Card className="p-4 space-y-4">
            <h3 className="font-semibold text-center">¿Cómo fue tu experiencia?</h3>
            
            {/* Star Rating */}
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                </button>
              ))}
            </div>

            {/* Optional Comment */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Comentarios (opcional)</label>
              <Textarea
                placeholder="Contanos tu experiencia..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
              />
            </div>

            <Button
              className="w-full"
              onClick={handleSubmitFeedback}
              disabled={rating === 0}
            >
              Enviar Opinión
            </Button>
          </Card>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="p-6 text-center bg-green-50 border-green-200">
              <CheckCircle size={48} className="mx-auto mb-3 text-green-600" />
              <p className="font-semibold mb-2">¡Gracias por tu opinión!</p>
              <p className="text-sm text-gray-600">
                Nos ayuda a mejorar cada día
              </p>
            </Card>
          </motion.div>
        )}

        {/* CTA */}
        <Button
          className="w-full bg-green-600 hover:bg-green-700"
          size="lg"
          onClick={() => router.push(`/tienda/${params.storeId}`)}
        >
          Iniciar Nueva Compra
        </Button>
      </motion.div>
    </div>
  );
}
```

**Tareas:**
- ✅ Check animado grande con Framer Motion
- ✅ Confetti animation al cargar (canvas-confetti)
- ✅ Card resumen del pedido (número, fecha/hora, total)
- ✅ Botón "Descargar Factura" (simulado, en producción generaría PDF con jspdf)
- ✅ Rating de 5 estrellas interactivo
- ✅ Textarea para comentarios opcionales
- ✅ Animación de "Gracias por tu opinión" después de enviar
- ✅ CTA "Iniciar Nueva Compra"

---

## 🟡 FASE 3: Experiencia Picker Desktop (3-4 días)

### **Objetivo:** Panel operativo para preparar pedidos con eficiencia

---

### **3.1 Kanban de Pedidos (2 días)**

**Ruta:** `/picker/page.tsx`

**Wireframe Desktop:**
```
┌──────────────────────────────────────────────────────────────┐
│  Picker Dashboard  |  Juan Pérez  |  🔔 3 pedidos nuevos    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  A PREPARAR     │  EN PROCESO  │  LISTOS      │  ENTREGADOS │
│  (🔴 rojo)     │  (🔵 azul)   │  (🟢 verde)  │  (⚪ gris) │
│  ─────────────  │  ───────────  │  ──────────  │  ────────── │
│  ┌───────────┐  │  ┌──────────┐ │  ┌─────────┐ │  ┌────────┐│
│  │#ORD-1234  │  │  │#ORD-1230 │ │  │#ORD-1228│ │  │#ORD-122││
│  │hace 5 min │  │  │ Pedro G. │ │  │María L. │ │  │Cliente ││
│  │Cliente A. │  │  │⏱️ 8 min  │ │  │12 items │ │  │Anónimo ││
│  │12 items   │  │  │Picker: X │ │  │$12,500  │ │  │$5,200  ││
│  │$12,500    │  │  └──────────┘ │  └─────────┘ │  └────────┘││
│  │[VER] [▶]  │  │               │              │             │
│  └───────────┘  │               │              │             │
│                │               │              │             │
│  (drag & drop) │               │              │             │
└──────────────────────────────────────────────────────────────┘
```

**Componente:**

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Package, Clock, User, Bell } from 'lucide-react';
import { useOrderStore } from '@/stores/useOrderStore';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { motion } from 'framer-motion';

export default function PickerKanbanPage() {
  const { orders, updateOrderStatus } = useOrderStore();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [newOrdersCount, setNewOrdersCount] = useState(0);

  // Agrupar órdenes por estado
  const ordersByStatus = {
    'A_PREPARAR': orders.filter(o => o.status === 'PAID'),
    'EN_PROCESO': orders.filter(o => o.status === 'PREPARING'),
    'LISTOS': orders.filter(o => o.status === 'READY_TO_PICKUP'),
    'ENTREGADOS': orders.filter(o => o.status === 'DELIVERED'),
  };

  // Simular notificación de nuevos pedidos
  useEffect(() => {
    const interval = setInterval(() => {
      const newCount = ordersByStatus['A_PREPARAR'].length;
      if (newCount > newOrdersCount) {
        // Sonido de notificación
        const audio = new Audio('/notification-ding.mp3');
        audio.play().catch(() => {}); // Ignorar error si no hay audio

        // Toast notification
        alert(`Nuevo pedido recibido!`);
      }
      setNewOrdersCount(newCount);
    }, 5000);

    return () => clearInterval(interval);
  }, [ordersByStatus]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const orderId = active.id as string;
    const newStatus = over.id as string;

    // Mapear columnas a estados
    const statusMap: Record<string, any> = {
      'A_PREPARAR': 'PAID',
      'EN_PROCESO': 'PREPARING',
      'LISTOS': 'READY_TO_PICKUP',
      'ENTREGADOS': 'DELIVERED',
    };

    updateOrderStatus(orderId, statusMap[newStatus]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package size={24} />
          <h1 className="text-xl font-bold">Picker Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-blue-600">
            <User size={14} className="mr-1" />
            Juan Pérez
          </Badge>
          {newOrdersCount > 0 && (
            <Badge className="bg-red-600 animate-pulse">
              <Bell size={14} className="mr-1" />
              {newOrdersCount} pedidos nuevos
            </Badge>
          )}
        </div>
      </header>

      {/* Kanban Board */}
      <DndContext onDragEnd={handleDragEnd}>
        <div className="p-6 grid grid-cols-4 gap-4">
          {Object.entries(ordersByStatus).map(([columnKey, columnOrders]) => {
            const columnConfig = {
              'A_PREPARAR': { title: 'A Preparar', color: 'red', icon: '🔴' },
              'EN_PROCESO': { title: 'En Proceso', color: 'blue', icon: '🔵' },
              'LISTOS': { title: 'Listos', color: 'green', icon: '🟢' },
              'ENTREGADOS': { title: 'Entregados', color: 'gray', icon: '⚪' },
            }[columnKey];

            return (
              <div key={columnKey} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-lg flex items-center gap-2">
                    <span>{columnConfig?.icon}</span>
                    {columnConfig?.title}
                  </h2>
                  <Badge>{columnOrders.length}</Badge>
                </div>

                <div className="space-y-2 min-h-[500px] bg-gray-100 rounded-lg p-2">
                  {columnOrders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      draggable
                    >
                      <Card className="p-3 cursor-move hover:shadow-lg transition-shadow">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <span className="font-mono text-sm font-bold">
                              #{order.id.slice(-6)}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              hace {Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000)} min
                            </Badge>
                          </div>

                          <div className="text-sm space-y-1">
                            <p className="font-medium">
                              {order.customerName || 'Cliente Anónimo'}
                            </p>
                            <p className="text-gray-600">
                              {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                            </p>
                            <p className="font-bold text-green-600">
                              ${order.total.toLocaleString()}
                            </p>
                          </div>

                          {order.pickerId && (
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <User size={12} />
                              <span>Picker: {order.pickerId}</span>
                            </div>
                          )}

                          {order.status === 'PREPARING' && order.pickingStartedAt && (
                            <div className="flex items-center gap-1 text-xs text-blue-600">
                              <Clock size={12} />
                              <span>
                                ⏱️ {Math.floor((Date.now() - new Date(order.pickingStartedAt).getTime()) / 60000)} min
                              </span>
                            </div>
                          )}

                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => setSelectedOrder(order.id)}
                            >
                              VER
                            </Button>
                            {order.status === 'PAID' && (
                              <Button
                                size="sm"
                                className="flex-1"
                                onClick={() => {
                                  updateOrderStatus(order.id, 'PREPARING');
                                  // Asignar picker actual
                                }}
                              >
                                ▶ INICIAR
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </DndContext>

      {/* Modal de Detalle (se abre al hacer click en VER) */}
      {selectedOrder && (
        <OrderDetailModal
          orderId={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
```

**Tareas:**
- ✅ Layout con 4 columnas (A Preparar / En Proceso / Listos / Entregados)
- ✅ Cards de pedidos con info resumida
- ✅ Drag & drop entre columnas (dnd-kit)
- ✅ Badge de tiempo transcurrido ("hace 5 min")
- ✅ Badge de picker asignado en columna "En Proceso"
- ✅ Notificación sonora cuando entra nuevo pedido 🔊
- ✅ Badge animado "X pedidos nuevos" en header
- ✅ Botón "VER" abre modal de detalle
- ✅ Botón "INICIAR" mueve de "A Preparar" → "En Proceso"

---

### **3.2 Modal de Detalle de Picking (1 día)**

**Componente OrderDetailModal:**

```typescript
function OrderDetailModal({ orderId, onClose }: { orderId: string; onClose: () => void }) {
  const { orders, updateOrderStatus, updateItemPicked } = useOrderStore();
  const order = orders.find(o => o.id === orderId);

  if (!order) return null;

  const handleMarkAsReady = () => {
    updateOrderStatus(order.id, 'READY_TO_PICKUP');
    onClose();

    // Notificar al cliente (simulado)
    if ('Notification' in window) {
      new Notification(`Pedido ${order.id} listo para retirar`);
    }
  };

  const pickedItems = order.items.filter(item => item.isPicked).length;
  const totalItems = order.items.length;
  const progress = (pickedItems / totalItems) * 100;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="space-y-4">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold">Pedido #{order.id}</h2>
            <div className="flex gap-2 mt-2">
              <Badge>{order.status}</Badge>
              {order.customerName && (
                <Badge variant="outline">{order.customerName}</Badge>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progreso: {pickedItems}/{totalItems} items</span>
              <span className="font-bold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-green-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Items List (ordenada por ubicación) */}
          <div className="space-y-2">
            <h3 className="font-semibold">Lista de Picking</h3>
            {order.items
              .sort((a, b) => (a.location || '').localeCompare(b.location || ''))
              .map((item) => (
                <Card
                  key={item.productId}
                  className={`p-3 ${item.isPicked ? 'bg-green-50 border-green-200' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={item.isPicked}
                      onChange={() => updateItemPicked(order.id, item.productId, !item.isPicked)}
                      className="w-5 h-5"
                    />
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Cantidad: {item.quantity} | {item.location || 'Sin ubicación'}
                      </p>
                      {item.notes && (
                        <p className="text-xs text-orange-600">
                          📝 Nota: {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => window.print()}
            >
              🖨️ Imprimir Lista
            </Button>
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={pickedItems < totalItems}
              onClick={handleMarkAsReady}
            >
              ✅ LISTO PARA ENTREGAR
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

**Tareas:**
- ✅ Header con número de pedido + badges
- ✅ Barra de progreso animada (X/Y items recolectados)
- ✅ Lista ordenada por ubicación física
- ✅ Checkboxes grandes por item
- ✅ Mostrar notas del cliente en naranja
- ✅ Botón "Imprimir Lista" (window.print())
- ✅ Botón "LISTO PARA ENTREGAR" (disabled hasta completar todos)
- ✅ Notificación al cliente cuando se marca como listo 🔊

---

### **3.3 Escaneo QR de Retiro (1 día)**

**Ruta:** `/picker/retiro/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { QrReader } from 'react-qr-reader';
import { useOrderStore } from '@/stores/useOrderStore';
import { CheckCircle, AlertCircle, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RetirarPedidoPage() {
  const { orders, updateOrderStatus } = useOrderStore();
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleScan = (qrCode: string) => {
    // Buscar orden por QR code
    const order = orders.find(o => o.pickupQRCode === qrCode);

    if (!order) {
      setResult({ success: false, message: 'Código QR no reconocido' });
      return;
    }

    if (order.status !== 'READY_TO_PICKUP') {
      setResult({
        success: false,
        message: `Este pedido aún está en estado: ${order.status}`
      });
      return;
    }

    // Marcar como entregado
    updateOrderStatus(order.id, 'DELIVERED');
    setResult({
      success: true,
      message: `Pedido #${order.id} entregado correctamente`
    });

    setScanning(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card className="max-w-2xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center">Escanear QR de Retiro</h1>

        {/* Scanner */}
        {scanning ? (
          <div className="space-y-4">
            <QrReader
              onResult={(result) => {
                if (result) {
                  handleScan(result.getText());
                }
              }}
              constraints={{ facingMode: 'environment' }}
              className="w-full"
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setScanning(false)}
            >
              Cancelar
            </Button>
          </div>
        ) : (
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
            onClick={() => setScanning(true)}
          >
            <Camera className="mr-2" size={20} />
            Activar Cámara
          </Button>
        )}

        {/* Manual Input */}
        <div className="space-y-2">
          <p className="text-sm text-gray-600 text-center">
            O ingresá el código manualmente:
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="QR-ORD-123456"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
            />
            <Button onClick={() => handleScan(manualCode)}>
              Validar
            </Button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card
              className={`p-4 ${
                result.success
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center gap-3">
                {result.success ? (
                  <CheckCircle size={32} className="text-green-600" />
                ) : (
                  <AlertCircle size={32} className="text-red-600" />
                )}
                <p className={result.success ? 'text-green-800' : 'text-red-800'}>
                  {result.message}
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </Card>
    </div>
  );
}
```

**Tareas:**
- ✅ QR Reader con react-qr-reader
- ✅ Botón "Activar Cámara" para iniciar escaneo
- ✅ Input manual para código de orden
- ✅ Validación: QR válido + pedido en estado "READY_TO_PICKUP"
- ✅ Mensaje de error si QR inválido o pedido no listo
- ✅ Mensaje de éxito con animación
- ✅ Actualizar estado a "DELIVERED"

---

---

## 🟣 FASE 4: Experiencia Admin Desktop (4-5 días)

### **Objetivo:** Dashboard analítico y gestión completa del sistema

---

### **4.1 Dashboard Principal - Vista Realtime (2 días)**

**Ruta:** `/admin/page.tsx`

**Wireframe Desktop:**
```
┌──────────────────────────────────────────────────────────────┐
│  Admin Dashboard         |  Superadmin: Ana López           │
│  Ferretería El Tornillo  |  📅 13 Enero 2025                │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  📊 KPIs                                                     │
│  ┌──────────┬──────────┬──────────┬──────────┐             │
│  │ Pedidos  │  Ventas  │  Tiempo  │ Carrito  │             │
│  │   Hoy    │   Hoy    │   Prep   │  Prom    │             │
│  │   125    │ $152,000 │  12 min  │ $8,500   │             │
│  │  +15%    │   +22%   │   -8%    │   +5%    │             │
│  └──────────┴──────────┴──────────┴──────────┘             │
│                                                              │
│  📈 Pedidos por Hora (Hoy)          📦 Top 10 Productos     │
│  ┌────────────────────────┐         ┌─────────────────────┐ │
│  │ [Gráfico de línea]     │         │ [Gráfico de barras] │ │
│  │                        │         │                     │ │
│  └────────────────────────┘         └─────────────────────┘ │
│                                                              │
│  🔥 Heatmap: Escaneos vs Compras    ⚠️ Alertas             │
│  ┌────────────────────────┐         ┌─────────────────────┐ │
│  │ [Matriz calor]         │         │ 5 productos bajo    │ │
│  │                        │         │   stock             │ │
│  └────────────────────────┘         │ 3 carritos          │ │
│                                     │   abandonados       │ │
│  👥 Clientes Activos Ahora          └─────────────────────┘ │
│  ┌────────────────────────┐                                 │
│  │ 8 clientes navegando   │                                 │
│  │ 3 en checkout          │                                 │
│  └────────────────────────┘                                 │
└──────────────────────────────────────────────────────────────┘
```

**Componente:**

```typescript
'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Clock, ShoppingCart, Package, AlertCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useOrderStore } from '@/stores/useOrderStore';
import { useEffect, useState } from 'react';

export default function AdminDashboardPage() {
  const { orders } = useOrderStore();
  const [kpis, setKpis] = useState({
    ordersToday: 0,
    salesToday: 0,
    avgPrepTime: 0,
    avgCartValue: 0,
    ordersGrowth: 0,
    salesGrowth: 0,
  });

  useEffect(() => {
    // Calcular KPIs (en producción vendría del backend)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = orders.filter(
      o => new Date(o.createdAt) >= today
    );

    const salesToday = todayOrders.reduce((sum, o) => sum + o.total, 0);
    const avgCartValue = salesToday / todayOrders.length || 0;

    // Simular crecimiento comparado con ayer
    const ordersGrowth = 15;
    const salesGrowth = 22;

    setKpis({
      ordersToday: todayOrders.length,
      salesToday,
      avgPrepTime: 12,
      avgCartValue,
      ordersGrowth,
      salesGrowth,
    });
  }, [orders]);

  // Mock data para gráficos
  const hourlyOrdersData = [
    { hour: '9am', pedidos: 5 },
    { hour: '10am', pedidos: 12 },
    { hour: '11am', pedidos: 18 },
    { hour: '12pm', pedidos: 25 },
    { hour: '1pm', pedidos: 20 },
    { hour: '2pm', pedidos: 15 },
    { hour: '3pm', pedidos: 22 },
    { hour: '4pm', pedidos: 30 },
  ];

  const topProductsData = [
    { name: 'Tornillo M8', ventas: 45 },
    { name: 'Pintura Blanca', ventas: 38 },
    { name: 'Cemento', ventas: 32 },
    { name: 'Taladro', ventas: 28 },
    { name: 'Brocha', ventas: 25 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">Ferretería El Tornillo</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline">
            📅 {new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </Badge>
          <Badge>Superadmin: Ana López</Badge>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Pedidos Hoy</span>
              <Package size={20} className="text-blue-600" />
            </div>
            <p className="text-3xl font-bold">{kpis.ordersToday}</p>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp size={14} />
              <span>+{kpis.ordersGrowth}% vs ayer</span>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Ventas Hoy</span>
              <ShoppingCart size={20} className="text-green-600" />
            </div>
            <p className="text-3xl font-bold">${(kpis.salesToday / 1000).toFixed(0)}k</p>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp size={14} />
              <span>+{kpis.salesGrowth}% vs ayer</span>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Tiempo Prep.</span>
              <Clock size={20} className="text-orange-600" />
            </div>
            <p className="text-3xl font-bold">{kpis.avgPrepTime} min</p>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingDown size={14} />
              <span>-8% vs ayer</span>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Carrito Prom.</span>
              <ShoppingCart size={20} className="text-purple-600" />
            </div>
            <p className="text-3xl font-bold">${(kpis.avgCartValue / 1000).toFixed(1)}k</p>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp size={14} />
              <span>+5% vs ayer</span>
            </div>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-2 gap-4">
          {/* Pedidos por Hora */}
          <Card className="p-4">
            <h3 className="font-bold mb-4">📈 Pedidos por Hora (Hoy)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={hourlyOrdersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="pedidos" stroke="#22c55e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Top 10 Productos */}
          <Card className="p-4">
            <h3 className="font-bold mb-4">📦 Top 5 Productos</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topProductsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="ventas" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-3 gap-4">
          {/* Heatmap */}
          <Card className="p-4 col-span-2">
            <h3 className="font-bold mb-4">🔥 Heatmap: Escaneos vs Compras</h3>
            <div className="grid grid-cols-5 gap-2">
              {[...Array(25)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded"
                  style={{
                    backgroundColor: `rgba(34, 197, 94, ${Math.random() * 0.8 + 0.2})`
                  }}
                />
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Productos más escaneados pero menos comprados (oportunidad de optimización)
            </p>
          </Card>

          {/* Alertas */}
          <Card className="p-4">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="text-red-600" />
              Alertas
            </h3>
            <div className="space-y-3">
              <div className="p-2 bg-red-50 border border-red-200 rounded">
                <p className="text-sm font-semibold">5 productos bajo stock</p>
                <p className="text-xs text-gray-600">Tornillo M8, Cemento...</p>
              </div>
              <div className="p-2 bg-orange-50 border border-orange-200 rounded">
                <p className="text-sm font-semibold">3 carritos abandonados</p>
                <p className="text-xs text-gray-600">Último: hace 15 min</p>
              </div>
              <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm font-semibold">8 clientes activos ahora</p>
                <p className="text-xs text-gray-600">3 en checkout</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Vista Realtime de Pedidos */}
        <Card className="p-4">
          <h3 className="font-bold mb-4">🔴 Pedidos en Tiempo Real</h3>
          <div className="space-y-2">
            {orders.filter(o => o.status !== 'DELIVERED').slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <div className="flex items-center gap-3">
                  <Badge>{order.status}</Badge>
                  <span className="font-mono text-sm">#{order.id.slice(-6)}</span>
                  <span className="text-sm">{order.customerName || 'Cliente'}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                  </span>
                  <span className="font-bold">${order.total.toLocaleString()}</span>
                  <span className="text-xs text-gray-500">
                    {Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000)} min
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
```

**Tareas:**
- ✅ 4 KPI cards con indicadores de crecimiento (flechas up/down)
- ✅ Gráfico de línea: Pedidos por hora (Recharts)
- ✅ Gráfico de barras: Top 10 productos (Recharts)
- ✅ Heatmap de productos escaneados vs comprados
- ✅ Widget de alertas (stock bajo, carritos abandonados, clientes activos)
- ✅ Lista realtime de pedidos en preparación
- ✅ **Vista superadmin:** Ver pedidos de todos los locales (filtro por storeId)

---

### **4.2 Analytics Avanzado (1 día)**

**Ruta:** `/admin/analytics/page.tsx`

```typescript
'use client';

import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FunnelChart, Funnel, LabelList } from 'recharts';
import { Download } from 'lucide-react';

export default function AnalyticsPage() {
  // Mock data
  const funnelData = [
    { stage: 'Visitantes', value: 1000, fill: '#3b82f6' },
    { stage: 'Escanearon QR', value: 650, fill: '#22c55e' },
    { stage: 'Agregaron al carrito', value: 420, fill: '#f59e0b' },
    { stage: 'Iniciaron checkout', value: 280, fill: '#ef4444' },
    { stage: 'Completaron compra', value: 180, fill: '#8b5cf6' },
  ];

  const abandonedCarts = [
    { cliente: 'Juan P.', items: 5, total: 12500, razon: 'Precio alto', hace: '15 min' },
    { cliente: 'María L.', items: 3, total: 8200, razon: 'Sin stock', hace: '32 min' },
    { cliente: 'Pedro G.', items: 8, total: 22000, razon: 'Indecisión', hace: '1 hr' },
  ];

  const handleExportCSV = () => {
    alert('Exportando datos a CSV... (simulado)');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Analytics Avanzado</h1>
          <Button onClick={handleExportCSV}>
            <Download size={16} className="mr-2" />
            Exportar CSV
          </Button>
        </div>

        <Tabs defaultValue="funnel">
          <TabsList>
            <TabsTrigger value="funnel">Embudo de Conversión</TabsTrigger>
            <TabsTrigger value="abandoned">Carritos Abandonados</TabsTrigger>
            <TabsTrigger value="heatmap">Heatmap Productos</TabsTrigger>
            <TabsTrigger value="efficiency">Eficiencia Personal</TabsTrigger>
          </TabsList>

          {/* Tab 1: Funnel */}
          <TabsContent value="funnel">
            <Card className="p-6">
              <h3 className="font-bold mb-4">Embudo de Conversión</h3>
              <div className="w-full h-[400px]">
                {/* Placeholder - Recharts FunnelChart */}
                <div className="space-y-2">
                  {funnelData.map((stage, i) => (
                    <div key={stage.stage} className="flex items-center gap-4">
                      <div
                        className="h-16 rounded flex items-center justify-center text-white font-bold"
                        style={{
                          width: `${(stage.value / funnelData[0].value) * 100}%`,
                          backgroundColor: stage.fill
                        }}
                      >
                        {stage.stage}: {stage.value}
                      </div>
                      <span className="text-sm text-gray-600">
                        {((stage.value / funnelData[0].value) * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Tasa de conversión final: 18% (180/1000)
              </p>
            </Card>
          </TabsContent>

          {/* Tab 2: Abandoned Carts */}
          <TabsContent value="abandoned">
            <Card className="p-6">
              <h3 className="font-bold mb-4">Carritos Abandonados</h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Cliente</th>
                    <th className="text-left p-2">Items</th>
                    <th className="text-left p-2">Total</th>
                    <th className="text-left p-2">Razón</th>
                    <th className="text-left p-2">Hace</th>
                  </tr>
                </thead>
                <tbody>
                  {abandonedCarts.map((cart, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="p-2">{cart.cliente}</td>
                      <td className="p-2">{cart.items}</td>
                      <td className="p-2 font-bold">${cart.total.toLocaleString()}</td>
                      <td className="p-2">
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                          {cart.razon}
                        </span>
                      </td>
                      <td className="p-2 text-sm text-gray-600">{cart.hace}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </TabsContent>

          {/* Tab 3: Heatmap */}
          <TabsContent value="heatmap">
            <Card className="p-6">
              <h3 className="font-bold mb-4">Heatmap de Productos</h3>
              <p className="text-sm text-gray-600 mb-4">
                Productos más vistos pero menos comprados (oportunidades de mejora)
              </p>
              <div className="grid grid-cols-8 gap-2">
                {[...Array(64)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded cursor-pointer hover:scale-110 transition-transform"
                    style={{
                      backgroundColor: `rgba(239, 68, 68, ${Math.random() * 0.8 + 0.2})`
                    }}
                    title={`Producto ${i + 1}`}
                  />
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Tab 4: Efficiency */}
          <TabsContent value="efficiency">
            <Card className="p-6">
              <h3 className="font-bold mb-4">Eficiencia del Personal (Pickers)</h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Picker</th>
                    <th className="text-left p-2">Pedidos Hoy</th>
                    <th className="text-left p-2">Tiempo Promedio</th>
                    <th className="text-left p-2">Eficiencia</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">Juan Pérez</td>
                    <td className="p-2">28</td>
                    <td className="p-2">9.5 min</td>
                    <td className="p-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        Excelente
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">María López</td>
                    <td className="p-2">22</td>
                    <td className="p-2">12.3 min</td>
                    <td className="p-2">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                        Bueno
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
```

**Tareas:**
- ✅ Tabs component con 4 pestañas
- ✅ Tab 1: Funnel chart de conversión (Recharts)
- ✅ Tab 2: Tabla de carritos abandonados con razones
- ✅ Tab 3: Heatmap interactivo de productos
- ✅ Tab 4: Tabla de eficiencia de pickers
- ✅ Botón "Exportar CSV" (simula descarga)

---

### **4.3 Gestión de Productos + QR Generator (1 día)**

**Ruta:** `/admin/productos/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Plus, QrCode, Download } from 'lucide-react';
import { useProductStore } from '@/stores/useProductStore';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';

export default function ProductosPage() {
  const { products } = useProductStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGenerateQRs = async () => {
    const pdf = new jsPDF();
    let x = 20;
    let y = 20;
    const qrSize = 40;
    const gap = 10;

    for (const productId of selectedProducts) {
      const product = products.find(p => p.id === productId);
      if (!product) continue;

      // Generar QR
      const qrDataURL = await QRCode.toDataURL(`PICKY-PRODUCT-${product.id}`);

      // Agregar al PDF (grid 4x4)
      pdf.addImage(qrDataURL, 'PNG', x, y, qrSize, qrSize);
      pdf.setFontSize(8);
      pdf.text(product.name, x, y + qrSize + 5, { maxWidth: qrSize });
      pdf.text(`SKU: ${product.sku}`, x, y + qrSize + 10, { maxWidth: qrSize });

      x += qrSize + gap;
      if (x > 160) {
        x = 20;
        y += qrSize + gap + 15;
      }

      if (y > 260) {
        pdf.addPage();
        x = 20;
        y = 20;
      }
    }

    pdf.save('qr-codes-productos.pdf');
    setShowQRModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Gestión de Productos</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowQRModal(true)}
              disabled={selectedProducts.length === 0}
            >
              <QrCode size={16} className="mr-2" />
              Generar QRs ({selectedProducts.length})
            </Button>
            <Button>
              <Plus size={16} className="mr-2" />
              Nuevo Producto
            </Button>
          </div>
        </div>

        {/* Search */}
        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Buscar productos..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </Card>

        {/* Products Table */}
        <Card>
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-4">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProducts(filteredProducts.map(p => p.id));
                      } else {
                        setSelectedProducts([]);
                      }
                    }}
                  />
                </th>
                <th className="text-left p-4">Imagen</th>
                <th className="text-left p-4">Nombre</th>
                <th className="text-left p-4">SKU</th>
                <th className="text-left p-4">Precio</th>
                <th className="text-left p-4">Stock</th>
                <th className="text-left p-4">Ubicación</th>
                <th className="text-left p-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProducts([...selectedProducts, product.id]);
                        } else {
                          setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                        }
                      }}
                    />
                  </td>
                  <td className="p-4">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4 font-mono text-sm">{product.sku}</td>
                  <td className="p-4">${product.price.toLocaleString()}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        product.stock > 20
                          ? 'bg-green-100 text-green-800'
                          : product.stock > 5
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.stock} unidades
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{product.location}</td>
                  <td className="p-4">
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* QR Generator Modal */}
      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generar QR Codes para Imprimir</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Se generarán {selectedProducts.length} códigos QR en formato PDF (grid 4x4)
            </p>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm font-semibold mb-2">Análisis de Implementación:</p>
              <ul className="text-xs space-y-1 text-gray-700">
                <li>• Cada QR contendrá: `PICKY-PRODUCT-{product.id}`</li>
                <li>• Layout: Grid 4x4 (16 QRs por página)</li>
                <li>• Incluye nombre + SKU debajo de cada QR</li>
                <li>• Formato: PDF listo para imprimir en A4</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowQRModal(false)}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1"
                onClick={handleGenerateQRs}
              >
                <Download size={16} className="mr-2" />
                Generar PDF
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

**Tareas:**
- ✅ Tabla de productos con búsqueda
- ✅ Checkboxes para selección múltiple
- ✅ Botón "Generar QRs" (disabled si ninguno seleccionado)
- ✅ Modal con preview de QR generation
- ✅ **Generación masiva con qrcode + jspdf:**
  - Grid 4x4 (16 QRs por página)
  - Incluye nombre + SKU
  - Export PDF para imprimir
- ✅ Badge de stock con colores (verde/naranja/rojo)
- ✅ Columna "Ubicación" (Pasillo/Estante)

---

### **4.4 Configuración (1 día)**

**Ruta:** `/admin/config/page.tsx`

```typescript
'use client';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Store, Users, Percent, Save } from 'lucide-react';

export default function ConfigPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Configuración</h1>

        {/* Datos del Local */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Store size={20} />
            <h2 className="text-lg font-bold">Datos del Local</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre del local</label>
              <Input placeholder="Ferretería El Tornillo" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Logo URL</label>
              <Input placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Dirección</label>
              <Input placeholder="Av. Principal 123" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Teléfono</label>
              <Input placeholder="+54 11 1234-5678" />
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium">Horarios</label>
              <Textarea placeholder="Lun-Vie: 8:00-18:00&#10;Sáb: 9:00-13:00" rows={3} />
            </div>
          </div>
        </Card>

        {/* Descuentos */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Percent size={20} />
            <h2 className="text-lg font-bold">Configuración de Descuentos</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Descuento por cantidad (min 5 unidades)</label>
              <Input type="number" placeholder="10" />
              <span className="text-xs text-gray-600">%</span>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Descuento por cantidad (min 10 unidades)</label>
              <Input type="number" placeholder="15" />
              <span className="text-xs text-gray-600">%</span>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Descuento primera compra</label>
              <Input type="number" placeholder="5" />
              <span className="text-xs text-gray-600">%</span>
            </div>
          </div>
        </Card>

        {/* Usuarios */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Users size={20} />
            <h2 className="text-lg font-bold">Gestión de Usuarios (Mock)</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Nombre</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Rol</th>
                <th className="text-left p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2">Ana López</td>
                <td className="p-2">ana@example.com</td>
                <td className="p-2">Superadmin</td>
                <td className="p-2">
                  <Button variant="outline" size="sm">Editar</Button>
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Juan Pérez</td>
                <td className="p-2">juan@example.com</td>
                <td className="p-2">Picker</td>
                <td className="p-2">
                  <Button variant="outline" size="sm">Editar</Button>
                </td>
              </tr>
            </tbody>
          </table>
          <Button variant="outline">
            <Users size={16} className="mr-2" />
            Agregar Usuario
          </Button>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button size="lg" className="bg-green-600 hover:bg-green-700">
            <Save size={16} className="mr-2" />
            Guardar Cambios
          </Button>
        </div>
      </div>
    </div>
  );
}
```

**Tareas:**
- ✅ Formulario de datos del local (nombre, logo, dirección, teléfono, horarios)
- ✅ Configuración de descuentos por cantidad
- ✅ Tabla de usuarios mock (admin/picker)
- ✅ Botón "Agregar Usuario" (placeholder)
- ✅ Multi-tenant: Config aislada por storeId (en stores de Zustand)

---

## 🎨 FASE 5: Polish & Testing (2-3 días)

### **Objetivo:** Refinamiento, performance y accesibilidad

---

### **5.1 Animaciones y Micro-interactions (1 día)**

**Checklist:**
- ✅ **Scan Pulse Animation** en QR Scanner (keyframe CSS)
- ✅ **Slide-up Modals** con Framer Motion
- ✅ **Confetti Effect** en confirmación de pedido (canvas-confetti)
- ✅ **Stagger Animations** en listas de productos (Framer Motion)
- ✅ **Hover Effects** en cards (scale, shadow)
- ✅ **Loading Spinners** personalizados (Lucide Icons)
- ✅ **Toast Notifications** con animaciones (Sonner library)
- ✅ **Skeleton Loaders** para estados de carga
- ✅ **Button Pulse** en CTAs principales
- ✅ **Badge Bounce** en notificaciones nuevas

**Implementación Ejemplo - Confetti Button:**

```typescript
// components/ConfettiButton.tsx
import confetti from 'canvas-confetti';
import { Button } from './ui/button';

export function ConfettiButton({ children, ...props }: any) {
  const handleClick = (e: React.MouseEvent) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      }
    });
    props.onClick?.(e);
  };

  return (
    <Button {...props} onClick={handleClick}>
      {children}
    </Button>
  );
}
```

---

### **5.2 Loading States & Error Boundaries (1 día)**

**Tareas:**

1. **Loading Skeletons para todas las pantallas:**

```typescript
// components/ProductSkeleton.tsx
export function ProductSkeleton() {
  return (
    <Card className="p-4 animate-pulse">
      <div className="w-full h-48 bg-gray-200 rounded mb-3" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
    </Card>
  );
}
```

2. **Error Boundary Global:**

```typescript
// components/ErrorBoundary.tsx
'use client';

import { Component, ReactNode } from 'react';
import { Button } from './ui/button';

export class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Algo salió mal 😔</h1>
            <Button onClick={() => window.location.reload()}>
              Recargar Página
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

3. **Network Error Handling en React Query:**

```typescript
// lib/react-query.tsx
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
      onError: (error) => {
        toast.error('Error al cargar datos. Reintentando...');
      },
    },
  },
});
```

---

### **5.3 Responsive Testing (1 día)**

**Breakpoints a testear:**
- **320px** - iPhone SE (móvil mínimo)
- **375px** - iPhone X (móvil estándar)
- **768px** - iPad (tablet vertical)
- **1024px** - iPad Pro (tablet horizontal)
- **1920px** - Desktop HD

**Checklist:**
- ✅ Todos los textos legibles (min 14px en móvil)
- ✅ Botones touch-friendly (min 44x44px)
- ✅ Imágenes responsive (srcset para múltiples tamaños)
- ✅ Modales no se cortan en móviles pequeños (max-h-[80vh] + overflow-y-auto)
- ✅ Navegación hamburger en móvil
- ✅ Carrito fijo bottom no tapa contenido
- ✅ QR Scanner viewport completo en móvil

---

### **5.4 Performance Optimization (1 día)**

**Técnicas:**

1. **Code Splitting con Next.js dynamic imports:**

```typescript
import dynamic from 'next/dynamic';

const QRScanner = dynamic(() => import('@/components/QRScanner'), {
  ssr: false,
  loading: () => <div>Cargando escáner...</div>
});
```

2. **Image Optimization:**

```typescript
import Image from 'next/image';

<Image
  src={product.imageUrl}
  alt={product.name}
  width={300}
  height={300}
  placeholder="blur"
  blurDataURL="/placeholder.jpg"
/>
```

3. **React Query Cache Strategy:**
- staleTime: 5 minutos para productos
- refetchOnWindowFocus: false para carritos

4. **Virtual Scrolling para listas largas:**
```bash
npm install react-virtual
```

---

### **5.5 Accesibilidad WCAG AA (1 día)**

**Checklist:**
- ✅ Contraste mínimo 4.5:1 (usar herramienta de contraste)
- ✅ Todos los botones tienen aria-label
- ✅ Imágenes tienen alt text descriptivo
- ✅ Navegación por teclado funciona (Tab, Enter, Escape)
- ✅ Focus visible en todos los elementos interactivos
- ✅ Screen reader compatible (testar con VoiceOver/NVDA)
- ✅ Forms tienen labels asociados
- ✅ Errores de validación accesibles (aria-invalid)

---

### **5.6 PWA Configuration (1 día)**

**Archivos a crear:**

1. **public/manifest.json:**

```json
{
  "name": "Picky - Scan & Go",
  "short_name": "Picky",
  "description": "Escanea, compra y retira sin filas",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#22c55e",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

2. **Service Worker (Next.js plugin):**

```bash
npm install next-pwa
```

```typescript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  // ...config
});
```

---

### **5.7 Lighthouse Audit & Fixes (1 día)**

**Objetivos:**
- Performance: 95+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

**Pasos:**
1. Correr Lighthouse en Chrome DevTools
2. Optimizar imágenes (WebP, lazy loading)
3. Reducir JS bundle (tree shaking)
4. Agregar meta tags SEO
5. Implementar sitemap.xml

---

## ✅ CHECKLIST FINAL

### **Cliente Mobile (10 pantallas):**
- ✅ 2.1 Landing Principal
- ✅ 2.2 Landing Tienda
- ✅ 2.3 Catálogo de Productos
- ✅ 2.4 QR Scanner
- ✅ 2.5 Product Detail Page (PDP)
- ✅ 2.6 Modal Ofertas
- ✅ 2.7 Carrito de Compras
- ✅ 2.8 Checkout & Pago
- ✅ 2.9 Estado del Pedido
- ✅ 2.10 Confirmación de Retiro

### **Picker Desktop (3 pantallas):**
- ✅ 3.1 Kanban de Pedidos (4 columnas)
- ✅ 3.2 Modal Detalle de Picking
- ✅ 3.3 Escaneo QR de Retiro

### **Admin Desktop (4 pantallas):**
- ✅ 4.1 Dashboard Principal + Vista Realtime
- ✅ 4.2 Analytics Avanzado
- ✅ 4.3 Gestión Productos + QR Generator
- ✅ 4.4 Configuración

### **Polish & Testing:**
- ✅ 5.1 Animaciones y Micro-interactions
- ✅ 5.2 Loading States & Error Boundaries
- ✅ 5.3 Responsive Testing (320px → 1920px)
- ✅ 5.4 Performance Optimization
- ✅ 5.5 Accesibilidad WCAG AA
- ✅ 5.6 PWA Configuration
- ✅ 5.7 Lighthouse Audit & Fixes

---

## 🚀 PRÓXIMOS PASOS (Post-MVP)

Una vez completado el MVP frontend-only, consultar **BACKEND-ROADMAP.md** para:

1. **Phase 6:** Integración MercadoPago Sandbox
2. **Phase 7:** Conexión con Tiendanube Dev API
3. **Phase 8:** Migración a PostgreSQL + Prisma
4. **Phase 9:** Analytics Tracking Events
5. **Phase 10:** Adapters para SAP/VTEX (Enterprise)

---

**Última Actualización:** 13 Enero 2025
**Versión del Documento:** 2.0 (Frontend Roadmap Completo - 17 Pantallas)
**Estado:** ✅ DOCUMENTACIÓN COMPLETA - LISTO PARA INICIAR DESARROLLO

---
| FASE 3: Picker Desktop | ⏳ Pendiente | 5-7 días | 0% |
| FASE 4: Admin Dashboard | ⏳ Pendiente | 5-7 días | 0% |
| FASE 5: Polish & Testing | ⏳ Pendiente | 3-4 días | 0% |

**Total:** 0% completado | ~25-30 días restantes

---

**Última Actualización:** 13 Enero 2026  
**Autor:** Tech Lead Fullstack Senior  
**Status:** 📝 Roadmap completo listo para ejecución
