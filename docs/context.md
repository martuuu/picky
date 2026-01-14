# Contexto del Proyecto: Picky - Smart In-Store Shopping

## 1. Visión del Proyecto

**Picky** es una Progressive Web Application (PWA) de "Smart Shopping" diseñada para transformar la experiencia de compra en tiendas físicas. El sistema permite a los clientes escanear productos con su dispositivo móvil, crear un carrito virtual sin carga física, pagar online y retirar su pedido preparado.

**Filosofía Core:** "Scan & Go". El cliente navega liviano por la tienda, escanea lo que desea, paga desde el celular y retira todo empaquetado en punto de retiro.

### Estado Actual del Desarrollo

**Fase:** MVP Prototipo Completo (Frontend-First Approach)  
**Progreso:** 100% - 24 páginas funcionales (17 core + 7 adicionales)  
**Servidor:** 🟢 http://localhost:3000

**Objetivo Estratégico:**
- ✅ Simular flujo completo (Cliente Mobile + Picker Desktop + Admin Dashboard)
- ✅ Validar UX/UI con usuarios reales antes de invertir en backend
- ✅ Demo funcional para stakeholders e inversores
- ✅ Arquitectura escalable preparada para integraciones enterprise
- ✅ **COMPLETADO:** Prototipo 100% funcional con mock data
- 🚀 **PRÓXIMO:** Integraciones MercadoPago + Tiendanube + Base de Datos Real

**Arquitectura Futura:** Provider Agnostic (Tiendanube → SAP → VTEX vía Middleware Layer)  
**Approach:** Mobile First (Cliente 100% mobile, Admin/Picker desktop-oriented)  
**Inspiración UI:** PedidosYa, Rappi, Uber Eats (sin usar rojo corporativo)

### Estadísticas del Proyecto

**Páginas Implementadas:** 24 totales
- **Portal Cliente:** 10 páginas (landing, catálogo, producto, escanear, carrito, checkout, confirmación, pedido, perfil, perfil-sucursal)
- **Portal Picker:** 4 páginas (dashboard, detalle orden, retiro, historial)
- **Portal Admin:** 4 páginas (productos, analytics, configuración, analytics)
- **Páginas Adicionales:** 6 páginas "en desarrollo" con roadmaps detallados (ajustes, direcciones, etc.)
- **Páginas Especiales:** 1 página (404 personalizado con quick actions)

**Componentes Construidos:**
- **UI Primitivos:** 18 componentes Shadcn (button, card, badge, input, dialog, sheet, tabs, etc.)
- **Componentes Cliente:** ProductCard, QRScanner, RelatedOffersSheet
- **Componentes Picker:** OrderCard, OrderDetailModal
- **Componentes Comunes:** AnimatedButton, PageTransition
- **Custom Components:** 10+ componentes específicos del dominio

**Stores & State:**
- **Zustand Stores:** 3 (useCartStore, useUserStore, usePickerStore)
- **Persistencia:** localStorage con TTL
- **Mock Data:** 3 archivos JSON (productos, categorías, tiendas)

**Navegación & UX:**
- **Breadcrumbs:** Implementados en admin y picker
- **Profile Access:** Icon en todas las páginas cliente
- **Page Transitions:** Framer Motion en todos los portales
- **Quick Actions:** 6 cards en 404 page

**Build Stats:**
- **Rutas Estáticas:** 12
- **Rutas Dinámicas:** 9
- **Total:** 21 routes compiladas

---

## 2. Stack Tecnológico y Decisiones de Arquitectura

### Frontend Stack (Production-Ready)

**Framework:** Next.js 16.1.1  
- ✅ App Router para rutas tipadas y layouts anidados
- ✅ Turbopack para compilación ultra-rápida en desarrollo
- ✅ Server Components por defecto (Client Components solo donde necesario)
- ✅ Optimización automática de imágenes y fuentes

**Lenguaje:** TypeScript 5+ (Strict Mode)  
- ✅ Types desde día 1 (cero `any` permitido en producción)
- ✅ Interfaces segregadas por dominio (Product, Cart, Order, User, Analytics)
- ✅ Path aliases configurado (`@/*` → `src/*`)
- ✅ JSON imports tipados (mock data con validación de schema)

**UI Layer:** Shadcn/UI + Tailwind CSS 4  
- ✅ 18 componentes primitivos instalados (Radix UI bajo el capó)
- ✅ Sistema de diseño escalable con theme tokens
- ✅ Componentes reutilizables y composables
- ✅ Accesibilidad (WCAG AA) integrada por defecto
- ✅ Dark mode ready (aunque MVP usa solo light mode)

**Componentes Shadcn instalados:**
- `accordion`, `avatar`, `badge`, `button`, `card`, `checkbox`, `dialog`, `dropdown-menu`, `input`, `progress`, `select`, `separator`, `sheet`, `skeleton`, `sonner` (toasts), `tabs`, `textarea`, `label`

**State Management:** Zustand 5 + React Query  
- ✅ Zustand para estado global persistente (Cart, User Session)
- ✅ Middleware `persist` para localStorage sync
- ✅ React Query para data fetching con cache inteligente
- ✅ Optimistic updates preparados para integraciones reales

**QR Technology Stack:**
- ✅ `html5-qrcode` para lectura (cámara device)
- ✅ `qrcode` + `jspdf` para generación masiva (admin panel)
- ✅ Permisos de cámara con fallback a input manual

**Animations & Interactions:** Framer Motion  
- ✅ Transiciones fluidas entre vistas
- ✅ Micro-interactions en botones y cards
- ✅ Confetti animations para celebrar eventos (pedido listo)
- ✅ Skeleton loaders para perceived performance

**Charts & Analytics:** Recharts 3  
- ✅ Line charts (ventas por hora)
- ✅ Bar charts (top productos)
- ✅ Funnel charts (conversión)
- ✅ Responsive y performant

---

### Backend Simulado (MVP Strategy)

**Principio Core:** "Mock todo, pero con estructura de producción"

**Mocking Layer:** Server Actions de Next.js  
```typescript
// Server Actions simulan latencia real
export async function getProducts() {
  'use server';
  await new Promise(resolve => setTimeout(resolve, 500)); // Latencia artificial
  return mockProducts;
}
```

**Persistencia:** localStorage con TTL  
- ✅ Cart persiste 24 horas
- ✅ Session persiste hasta logout manual
- ✅ Orders persisten 7 días (luego auto-archive)

**Mock Data Structure:**
- `src/data/mock-products.json` - 10+ productos con specs completas
- `src/data/mock-categories.json` - Taxonomía de productos
- `src/data/mock-stores.json` - Multi-tenant ready (2 tiendas demo)

**Ventajas del Approach:**
- ✅ Deploy en segundos (Vercel serverless)
- ✅ Costo $0 en infraestructura durante validación
- ✅ Cambios de UI sin migraciones de base de datos
- ✅ Demo instantáneo para stakeholders

---

### Arquitectura de Producción (Post-Validación)

**Middleware Layer (Adapter Pattern)**

El código está preparado para que el frontend **nunca** llame directamente a APIs externas. Siempre consume una capa intermedia "Picky API" que decide el provider.

```typescript
// Interfaz unificada (agnóstica del backend)
interface IProductProvider {
  getProducts(): Promise<Product[]>;
  getProduct(sku: string): Promise<Product>;
  updateStock(sku: string, quantity: number): Promise<void>;
}

// Implementaciones intercambiables
class MockProvider implements IProductProvider { /* ... */ }
class TiendanubeProvider implements IProductProvider { /* ... */ }
class SAPProvider implements IProductProvider { /* ... */ }
class VTEXProvider implements IProductProvider { /* ... */ }

// El frontend solo conoce la interfaz
const provider = getProvider(); // Switch en runtime
const products = await provider.getProducts();
```

**Beneficios Arquitectura:**
- ✅ Cambiar de Mock → Tiendanube solo requiere config (cero cambios en UI)
- ✅ Multi-tenant: cada tienda puede usar diferente backend
- ✅ A/B testing de providers sin riesgo
- ✅ Rollback instantáneo si un provider falla

**Database Layer (Futuro):**
- PostgreSQL 15+ (Vercel Postgres o Supabase)
- Prisma ORM con migraciones versionadas
- Row Level Security (RLS) para multi-tenancy
- Realtime subscriptions para live updates (Picker → Cliente)

---

## 3. Principios de Desarrollo y Buenas Prácticas

### 🎯 Principios Core

**1. Mobile-First, Always**
- Toda vista de Cliente se diseña para 320px primero
- Desktop es progressive enhancement
- Touch targets mínimos de 44x44px (Apple HIG)
- Scroll natural sin scroll hijacking

**2. Performance Budget**
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Lighthouse Score > 95 en mobile
- Bundle size < 200KB (gzipped)

**3. Accesibilidad No Negociable**
- WCAG 2.1 AA mínimo
- Keyboard navigation completa
- Screen readers tested (VoiceOver, NVDA)
- Color contrast ratio > 4.5:1

**4. TypeScript Estricto**
```typescript
// ❌ NUNCA
const data: any = await fetch('/api');

// ✅ SIEMPRE
const data: Product[] = await getProducts();
```

**5. Component Composition over Props Drilling**
```typescript
// ❌ Evitar
<ProductCard 
  name={name} 
  price={price} 
  stock={stock} 
  onAdd={onAdd} 
  showBadge={true}
  badgeCount={5}
  // ... 20 props más
/>

// ✅ Preferir
<ProductCard product={product}>
  <ProductCard.Image />
  <ProductCard.Info />
  <ProductCard.Actions>
    <AddToCartButton />
  </ProductCard.Actions>
</ProductCard>
```

---

### 🔒 Seguridad (Preparación para Producción)

**1. Nunca exponer credenciales en cliente**
```typescript
// ❌ CRÍTICO: Nunca hacer esto
const API_KEY = 'sk_live_123456789';

// ✅ Usar variables de entorno en Server Actions
export async function createPayment() {
  'use server';
  const apiKey = process.env.MERCADOPAGO_SECRET_KEY;
  // ...
}
```

**2. Input Sanitization**
```typescript
// Observaciones del cliente siempre sanitizadas
const sanitizedObservation = observation
  .trim()
  .slice(0, 200) // Max length
  .replace(/<script>/gi, ''); // Prevent XSS
```

**3. CORS y CSP Headers (Next.js config)**
```typescript
// next.config.ts
const config = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};
```

**4. Rate Limiting (Futuro con Vercel Edge Functions)**
```typescript
// Prevenir abuso de escaneo masivo
const limiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10s'),
});
```

---

### ⚡ Optimización y Performance

**1. Image Optimization**
```tsx
// Next.js optimiza automáticamente
<Image
  src="/products/cemento.jpg"
  alt="Cemento Loma Negra"
  width={400}
  height={400}
  loading="lazy"
  placeholder="blur"
  blurDataURL={blurDataURL}
/>
```

**2. Code Splitting por Ruta**
```typescript
// Lazy load de componentes pesados
const AdminDashboard = dynamic(() => import('@/components/admin/Dashboard'), {
  loading: () => <Skeleton />,
  ssr: false, // Admin no necesita SSR
});
```

**3. Zustand Stores con Selective Subscriptions**
```typescript
// ❌ Re-renderiza todo
const cart = useCartStore();

// ✅ Solo subscribe a lo necesario
const itemsCount = useCartStore(state => state.cart?.items.length || 0);
```

**4. React Query con Smart Cache**
```typescript
const { data: products } = useQuery({
  queryKey: ['products', categoryId],
  queryFn: () => getProducts(categoryId),
  staleTime: 5 * 60 * 1000, // 5 minutos
  cacheTime: 30 * 60 * 1000, // 30 minutos
  refetchOnMount: false,
  refetchOnWindowFocus: false,
});
```

**5. Debounce en Search**
```typescript
// Evitar búsqueda por cada keystroke
const debouncedSearch = useMemo(
  () => debounce((term: string) => setSearchTerm(term), 300),
  []
);
```

---

### 🎨 UX/UI Guidelines

**1. Loading States Siempre Visibles**
- Skeletons para listas (más natural que spinners)
- Progress bars para procesos largos (>3s)
- Optimistic updates cuando es seguro

**2. Error Handling Humano**
```typescript
// ❌ Técnico
"Error: ECONNREFUSED 127.0.0.1:5432"

// ✅ Humano
"No pudimos cargar los productos. Verificá tu conexión e intentá nuevamente."
```

**3. Feedback Inmediato**
- Vibración al escanear QR exitoso
- Sonido (opcional) cuando pedido está listo
- Confetti al completar compra
- Toast notifications para acciones exitosas

**4. Empty States con CTA**
```tsx
// Carrito vacío
<EmptyState
  icon={<ShoppingCart />}
  title="Tu carrito está vacío"
  description="Escaneá productos o explorá el catálogo"
  action={<Button>Ver Catálogo</Button>}
/>
```

**5. Confirmaciones para Acciones Destructivas**
```typescript
// Antes de eliminar carrito completo
<AlertDialog>
  <AlertDialogTitle>¿Vaciar carrito?</AlertDialogTitle>
  <AlertDialogDescription>
    Se eliminarán {itemsCount} productos. Esta acción no se puede deshacer.
  </AlertDialogDescription>
  <AlertDialogAction onClick={clearCart}>Vaciar</AlertDialogAction>
</AlertDialog>
```

---

### 📱 PWA Best Practices

**1. Manifest.json Completo**
```json
{
  "name": "Picky - Smart Shopping",
  "short_name": "Picky",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#16a34a",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**2. Service Worker para Offline**
```typescript
// Cachear assets críticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('picky-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/globals.css',
        '/mock-products.json',
      ]);
    })
  );
});
```

**3. Add to Home Screen Prompt**
```typescript
// Detectar si puede instalarse
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallButton();
});
```

---

### 🧪 Testing Strategy (Futuro)

**Unit Tests:** Vitest + Testing Library
- Componentes aislados
- Zustand stores
- Utility functions

**Integration Tests:** Playwright
- User flows completos
- Cross-browser (Chrome, Safari, Firefox)
- Mobile viewport testing

**E2E Tests Críticos:**
1. Escanear producto → Agregar a carrito → Checkout → Pago
2. Picker recibe pedido → Prepara items → Marca listo
3. Cliente retira pedido → Validación QR → Confirmación

---

### 📊 Analytics & Monitoring (Post-MVP)

**Events Tracking:**
```typescript
// Eventos críticos del funnel
trackEvent('PRODUCT_SCANNED', { sku, categoryId });
trackEvent('ADD_TO_CART', { productId, quantity });
trackEvent('CHECKOUT_STARTED', { total, itemsCount });
trackEvent('PAYMENT_SUCCESS', { orderId, total, method });
trackEvent('ORDER_COMPLETED', { orderId, prepTime });
```

**Error Monitoring:** Sentry
- Captura de errores en producción
- Source maps para debugging
- User context (sin PII)

---

## 4. User Flows y Arquitectura de Experiencias

El sistema se estructura en **3 experiencias independientes** (pero comunicadas en tiempo real):

### A. Experiencia Cliente (Mobile PWA)

**Target:** Consumidores finales en tienda física  
**Dispositivo:** 100% Mobile (iOS/Android/Mobile Web)  
**Inspiración:** PedidosYa, Rappi, Uber Eats

**Flow Principal (Happy Path):**
```
1. Cliente escanea QR en entrada → Accede a /tienda/{storeId}
2. Ve bienvenida personalizada + info de la tienda
3. Opción A: Escanea productos con cámara → Llega a PDP
   Opción B: Explora catálogo → Busca/filtra → Selecciona producto
4. En PDP: Ajusta cantidad, lee specs, ve ofertas
5. Agrega a carrito → Modal automático con productos relacionados
6. Repite 3-5 hasta completar compra
7. Va a carrito → Revisa items, ajusta cantidades
8. Checkout → Ingresa datos (nombre, teléfono opcional)
9. Paga → Simulación MercadoPago (MVP) / Real (Producción)
10. Espera preparación → Ve tiempo estimado + estado realtime
11. Recibe notificación → "¡Tu pedido está listo! 🎉"
12. Muestra QR en punto de retiro
13. Empleado escanea → Entrega productos
14. Cliente confirma retiro → Rating opcional → Nueva compra
```

**Pantallas Críticas (10 total):**
- ✅ Landing Principal (Portal Selector)
- ✅ Landing Tienda (Bienvenida + Inicialización)
- 🔄 Escáner QR (html5-qrcode)
- 🔄 Catálogo (Grid + Tabs + Search)
- 🔄 PDP (Carousel + Specs + Bulk Discounts)
- 🔄 Modal Ofertas (Bottom Sheet Automático)
- 🔄 Carrito (Lista + Resumen + Ofertas)
- 🔄 Checkout (Form + Payment)
- 🔄 Estado Pedido (Stepper + QR + Notificaciones)
- 🔄 Confirmación (Success + Rating + Nueva Compra)

---

### B. Experiencia Picker (Desktop App)

**Target:** Empleados de depósito/almacén  
**Dispositivo:** Desktop/Tablet con teclado  
**Inspiración:** Trello, Asana, Notion

**Flow Principal:**
```
1. Picker accede a /picker → Ve Kanban de 4 columnas
2. Recibe notificación → Nuevo pedido en "A Preparar"
3. Click en pedido → Modal con detalle completo
4. Inicia preparación → Pedido pasa a "En Proceso"
5. Recorre depósito → Marca checkboxes por item recolectado
6. Verifica productos → Click en item para ver imagen grande
7. Completa todos los items → Botón "LISTO PARA ENTREGAR"
8. Pedido pasa a "Listos" → Cliente recibe push notification
9. Cliente llega a retirar → Muestra QR
10. Picker escanea QR → Valida orden
11. Entrega productos → Confirma entrega
12. Pedido pasa a "Entregados" → Auto-archiva en 2hs
```

**Pantallas (3 total):**
- 🔄 Kanban Board (4 columnas drag & drop)
- 🔄 Modal Detalle (Lista items + Progress bar + Timeline)
- � Escaneo QR Retiro (Validación + Confirmación)

**Features Clave:**
- 🔊 Sonido al recibir nuevo pedido
- ⏱️ Timer automático por pedido (tracking de eficiencia)
- 📍 Items ordenados por ubicación física (pasillo/estante)
- 🚨 Alertas de stock faltante
- 📊 Métricas en tiempo real (pedidos/hora, tiempo promedio)

---

### C. Experiencia Admin (Desktop Dashboard)

**Target:** Dueño/Gerente de tienda  
**Dispositivo:** Desktop (pantalla grande)  
**Inspiración:** Google Analytics, Metabase, Shopify Admin

**Flow Principal:**
```
1. Admin accede a /admin → Dashboard con KPIs
2. Monitorea ventas en tiempo real
3. Analiza embudos de conversión
4. Gestiona catálogo de productos
5. Genera QR codes para imprimir
6. Configura descuentos y ofertas
7. Revisa carritos abandonados
8. Exporta reportes (CSV/PDF)
```

**Pantallas (4 total):**
- 🔄 Dashboard Principal (KPIs + Gráficos + Alertas)
- 🔄 Analytics (Funnel + Carritos Abandonados + Heatmaps)
- 🔄 Gestión Productos (CRUD + QR Generator)
- 🔄 Configuración (Store Settings + Usuarios + Descuentos)

**Gráficos Críticos:**
- 📈 Ventas por hora (line chart comparativo)
- 📊 Top productos (bar chart horizontal)
- 🔥 Heatmap: Escaneos vs Compras
- 🎯 Funnel de conversión (4 etapas)

---

### Comunicación entre Experiencias (Realtime)

**Tecnología (Futuro):**
- WebSockets (Pusher/Ably) para updates en vivo
- BroadcastChannel API para sync entre tabs
- Server-Sent Events (SSE) para notificaciones unidireccionales

**Events Críticos:**
```typescript
// Cliente → Picker
CLIENT_PAID → NOTIFY_PICKER(newOrder)

// Picker → Cliente  
PICKER_STARTED_PREP → UPDATE_CLIENT_STATUS('preparing')
PICKER_COMPLETED → NOTIFY_CLIENT('ready') + CONFETTI + SOUND

// Admin → All
ADMIN_UPDATED_STOCK → REFRESH_CATALOG()
ADMIN_CREATED_OFFER → SHOW_OFFER_BANNER()
```
* **Cards:** Imagen, nombre, precio, stock badge ("Quedan 5"), botón "Agregar"
* **Búsqueda:** Input con filtro en tiempo real
* **Estado:** Si producto ya está en carrito, mostrar badge "(2)" en card

#### **3. Escaneo de QR (Pantalla 3)**

* **UI:** Cámara fullscreen con overlay de guías (cuadrado central)
* **Funcionamiento:** Al detectar QR válido → Redirige automáticamente a PDP (Product Detail Page)
* **Error Handling:** Si QR no es válido → Toast "Código no reconocido"
* **UX:** Botón flotante "Ver Carrito" (badge con cantidad de items)

#### **4. Product Detail Page - PDP (Pantalla 4)**

* **Hero:** Imagen grande del producto (carousel si hay múltiples)
* **Información:**
  - Nombre del producto
  - Precio unitario (grande, destacado)
  - Stock disponible: Badge "✅ Hay stock (23 unidades)" o "⚠️ Últimas 3 unidades"
  - Descripción corta
  - Especificaciones técnicas (accordion collapsible)
* **Smart Features:**
  - 🏷️ "Ofertas por cantidad": "Comprá 10 y ahorrá 15%"
  - 🛍️ "Productos combinables": Carousel con "Los clientes también llevaron..."
  - 📊 "Comparador": Botón "Comparar con similar" (modal con tabla)
* **Acciones:**
  - Selector de cantidad: [-] [2] [+]
  - Botón primario: "Agregar al Pedido" (verde, full width)
  - Botón secundario: "Dejar" (outline, volver atrás)
* **Observaciones:** Input opcional "Ej: Sin tornillos, solo tuercas"

**Modal Ofertas (Popup):**

Cuando el usuario agrega un producto al carrito, si hay ofertas relacionadas:
* **UI:** Modal bottom sheet con animación slide-up
* **Contenido:** "💡 Otros clientes que compraron esto también llevaron..."
* **Cards:** Mini-cards con productos relacionados + botón "Agregar rápido"

#### **5. Carrito de Compras (Pantalla 5)**

* **Header:** "Mi Carrito (12 productos)"
* **Lista de Items:**
  - Imagen thumbnail + nombre
  - Precio unitario x cantidad
  - Subtotal por item
  - Selector de cantidad inline ([-] [2] [+])
  - Botón "Eliminar" (icono de basurero)
* **Resumen:**
  - Subtotal: $15,000
  - Descuentos aplicados: -$2,500 (verde, destacado "¡Ahorraste!")
  - **Total a Pagar:** $12,500 (grande, negrita)
* **Ofertas Dinámicas:**
  - Carousel inferior: "🎁 Llevá 2 pinturas más y ahorrá $500"
* **CTA:**
  - Botón primario: "Ir a Pagar" (full width, animación pulse)
  - Link secundario: "Seguir comprando"

#### **6. Checkout y Pago (Pantalla 6)**

* **Resumen Final:**
  - Desglose de precios
  - Tiempo estimado de preparación: "🕒 Tu pedido estará listo en ~10 minutos"
* **Método de Pago:**
  - Botón "Pagar con MercadoPago" (logo + colores oficiales)
  - **Simulación MVP:** Al hacer click → Spinner 2 segundos → Pantalla de éxito
* **UI MercadoPago (Futuro):**
  - Modal con iframe de MercadoPago Checkout
  - Métodos: Tarjetas, QR, efectivo (Rapipago/PagoFácil)

#### **7. Estado del Pedido (Pantalla 7)**

**Post-pago:** El cliente es redirigido a esta pantalla automáticamente.

* **Stepper Visual:**
  - ✅ Pedido recibido (check verde)
  - 🔄 En preparación (spinner azul, activo)
  - ⏳ Listo para retirar (gris, pendiente)
  - ✅ Entregado (gris, pendiente)
* **Tiempo Estimado:** "Estimamos 8 minutos restantes"
* **Mensaje:** "Estamos preparando tu pedido. Tenemos café gratis en la barra mientras esperás ☕"
* **Animación:** Lottie animation de cajas moviéndose
* **Notificación Real-time:** Cuando estado cambia a "Listo" → 🔔 Toast + sonido + vibración

**Estado: Listo para Retirar**

* **UI:** Confetti animation 🎉
* **Mensaje:** "¡Tu pedido está listo! 🎊"
* **QR de Retiro:** QR grande en pantalla (contiene `orderId`)
* **Instrucciones:** "Mostrá este código en el check-out"
* **CTA:** Botón "Ya retiré mi pedido" (marca como entregado)

#### **8. Confirmación de Retiro (Pantalla 8)**

**Post-retiro:** Cliente escanea QR en mostrador o hace click en "Ya retiré".

* **UI:** Check animado ✅ con confetti
* **Mensaje:** "¡Gracias por comprar con Picky en Ferretería El Tornillo!"
* **Detalle del Pedido:**
  - Fecha y hora de retiro
  - Botón "Descargar Factura" (PDF)
  - Lista de productos comprados
* **Feedback:**
  - "¿Cómo fue tu experiencia?" (5 estrellas)
  - Input opcional para comentarios
* **CTA:** Botón "Iniciar Nueva Compra"

---

### B. Experiencia Picker (Desktop App)

**Público:** Empleados del depósito/almacén que preparan pedidos  
**Dispositivo:** Desktop/Tablet (teclado + mouse, pantalla grande)  
**Inspiración UI:** Trello/Kanban boards, dashboards operativos

#### **1. Tablero de Pedidos (Pantalla Desktop 1)**

**Layout:** Kanban board con 4 columnas responsivas

**Columnas:**

1. **A Preparar** (rojo/naranja)
   - Pedidos que acaban de ser pagados
   - Badge con cantidad de items del pedido
   - Alerta sonora/visual cuando entra nuevo pedido
   - Orden: Más antiguo arriba

2. **En Proceso** (azul)
   - Pedidos que están siendo armados actualmente
   - Mostrar quién está preparando (avatar del picker)
   - Timer desde que se inició

3. **Listo para Entregar** (verde)
   - Pedidos terminados esperando que el cliente venga
   - Botón "Notificar Cliente" (opcional)

4. **Entregado** (gris)
   - Pedidos ya retirados en las últimas 2 horas
   - Auto-archiva después de 2hs

**Cards de Pedido:**

* **Header:** `#ORD-1234` + timestamp (hace 5 min)
* **Cliente:** Nombre (si está logueado) o "Cliente anónimo"
* **Items:** "12 productos (18 unidades totales)"
* **Total:** $12,500
* **Acciones rápidas:**
  - Botón "Ver Detalle" (abre modal)
  - Botón "Comenzar Preparación" (mueve a "En Proceso")
  - Drag & Drop habilitado (mover entre columnas)

**Notificaciones:**

* 🔔 Badge en header: "3 pedidos nuevos"
* 🔊 Sonido de "ding" cuando entra pedido nuevo
* 💬 Toast: "Nuevo pedido #ORD-1234 de Juan Pérez"

#### **2. Modal de Detalle de Pedido (Pantalla Desktop 2)**

**Trigger:** Click en card del Kanban

**Contenido:**

* **Header:**
  - Número de orden grande: `#ORD-1234`
  - Estado actual: Badge de color
  - Timestamp de cada estado (línea de tiempo vertical)
* **Información del Cliente:**
  - Nombre, teléfono (si está disponible)
  - Notas especiales del pedido (si las hay)
* **Lista de Productos (optimizada para picking):**
  - Ordenada por ubicación en el depósito (simulada por categoría)
  - Checkbox grande para marcar items recolectados
  - Layout: [✅ Checkbox] [Imagen] [Nombre] [Cantidad] [Ubicación: Pasillo A]
  - Barra de progreso: "8/12 items recolectados"
* **Acciones:**
  - Botón "Comenzar Preparación" (si está en "A Preparar")
  - Botón "Marcar como Listo" (si todos los items tienen ✅)
  - Botón "Reportar Problema" (ej: falta stock)
  - Botón "Imprimir Lista de Picking" (PDF)

**Optimización UX:**

* ✅ Checkbox con animación al hacer click
* 🔍 Si hace click en el producto → Modal con imagen grande (verificación visual)
* ⚠️ Si un producto no tiene stock → Badge rojo "Sin stock" + input para cantidad parcial

#### **3. Escaneo de QR de Retiro (Pantalla Desktop 3)**

**Trigger:** Cliente muestra QR en su celular al empleado

**UI:**

* Modal fullscreen con cámara (escáner de código)
* **O** Input manual para ingresar código de orden (`#ORD-1234`)
* **Validación:**
  - Si el QR es válido y el pedido está en "Listo" → ✅ Permitir entrega
  - Si el pedido NO está listo → ⚠️ "Este pedido aún está en preparación"
* **Confirmación:**
  - Mostrar foto del cliente (si está disponible) para validación
  - Checkbox: "Cliente retiró todos los productos"
  - Botón "Confirmar Entrega"
* **Post-entrega:**
  - El pedido se mueve automáticamente a "Entregado"
  - Toast: "Pedido #ORD-1234 entregado correctamente"

---

### C. Experiencia Admin (Desktop Dashboard)

**Público:** Dueño/gerente de la tienda  
**Dispositivo:** Desktop (pantalla grande, múltiples ventanas)  
**Inspiración UI:** Dashboards analíticos (Google Analytics, Metabase)

#### **1. Dashboard Principal (Pantalla Desktop 1)**

**Layout:** Grid de widgets con KPIs en tiempo real

**KPIs Superiores (Cards grandes):**

* 📊 **Pedidos Hoy:** 47 pedidos (+12% vs ayer)
* 💰 **Ventas Hoy:** $342,500 (+8% vs ayer)
* ⏱️ **Tiempo Promedio de Preparación:** 9.5 minutos (-15% vs ayer)
* 🛒 **Carrito Promedio:** $7,287

**Gráficos:**

1. **Pedidos por Hora** (Line chart)
   - Eje X: Horas del día (09:00, 10:00, ..., 19:00)
   - Eje Y: Cantidad de pedidos
   - Línea: Hoy (azul) vs Promedio semanal (gris punteada)

2. **Top 10 Productos Más Vendidos** (Bar chart horizontal)
   - Productos ordenados por unidades vendidas
   - Color: Verde si subió en ranking, rojo si bajó

3. **Mapa de Calor: Escaneos vs Compras** (Heatmap)
   - Eje X: Productos
   - Eje Y: Acción (Escaneado / Agregado al carrito / Comprado)
   - Color: Verde intenso (muchas conversiones) → Rojo (muchos escaneos, pocas compras)
   - **Insight:** Detectar productos que se miran pero no se compran

**Widgets Adicionales:**

* 🚨 **Alertas:** "5 productos con stock bajo"
* 👥 **Clientes Activos Ahora:** 12 clientes escaneando en este momento
* 📦 **Pedidos en Preparación:** 3 pedidos (link a vista Picker)

#### **2. Analytics Avanzado (Pantalla Desktop 2)**

**Tabs:**

**Tab 1: Embudo de Conversión**

* **Visualización:** Funnel chart
* **Stages:**
  1. Productos escaneados: 450 escaneos
  2. Agregados al carrito: 280 (62% conversión)
  3. Llegaron al checkout: 220 (79% conversión)
  4. Pagaron: 180 (82% conversión)
* **Filtros:** Por fecha, categoría, hora del día

**Tab 2: Carritos Abandonados**

* **Tabla:** Lista de carritos que no llegaron al pago
* **Columnas:**
  - Cliente (anónimo o identificado)
  - Items en carrito (lista)
  - Total del carrito
  - Tiempo desde abandono
  - Razón (si se capturó: "Sin stock", "Precio alto", etc.)
* **Acciones:**
  - Botón "Enviar recordatorio" (si tiene email/WhatsApp)
  - Exportar CSV

**Tab 3: Productos Comparados**
* **Tabla:** Productos que se compararon entre sí
* **Insight:** "El 60% de los clientes compararon Cemento A vs Cemento B → Elegían B"
* **UX:** Ayuda a optimizar ofertas y stock

**Tab 4: Eficiencia del Personal**
* **Tabla:** Empleados (pickers) con métricas
* **Columnas:**
  - Nombre del empleado
  - Pedidos completados hoy
  - Tiempo promedio de picking
  - Rating del cliente (si se captura feedback)

#### **3. Gestión de Productos (Pantalla Desktop 3)**

**Tabla de Productos:**
* **Columnas:**
  - SKU
  - Nombre
  - Categoría
  - Precio
  - Stock actual
  - Stock mínimo (alerta si está por debajo)
  - Acciones: [Editar] [Ver QR] [Desactivar]

**Funcionalidades:**
* **Búsqueda y filtros:** Por categoría, stock, precio
* **Generación de QRs:**
  - Botón "Generar QRs para imprimir"
  - Modal: Seleccionar productos → Generar PDF con grid de QRs (4x4 por hoja)
  - Cada QR contiene SKU + nombre del producto (texto debajo)
* **Edición masiva:**
  - Checkbox múltiple → "Aplicar descuento 10% a seleccionados"
  - Importar/Exportar CSV

#### **4. Configuración del Sistema (Pantalla Desktop 4)**

**Secciones:**

1. **Datos de la Tienda:**
   - Nombre del local
   - Logo (para QR de bienvenida)
   - Dirección, teléfono

2. **Horarios de Atención:**
   - Configurar días/horarios (para estimaciones de preparación)

3. **Integración con Tiendanube:**
   - API Key (input password)
   - Botón "Sincronizar Catálogo Ahora"
   - Última sincronización: 13/01/2026 14:30

4. **Integración con MercadoPago:**
   - Public Key / Access Token (simulado en MVP)
   - Modo: Sandbox / Producción (toggle)

5. **Notificaciones:**
   - Sonido al recibir pedidos (toggle)
   - Email de resumen diario (input)

---

## 5. Roadmap de Integración Post-MVP

### Fase 1: Validación con Usuarios Reales (Actual - MVP)
**Duración:** 3-4 semanas  
**Objetivo:** Validar UX/UI con 2-3 clientes pilot

**Entregables:**
- ✅ 17 pantallas funcionando con mock data
- ✅ Demo deployado en Vercel
- ✅ Métricas de uso capturadas (Analytics simulados)
- ✅ Feedback de usuarios recopilado

---

### Fase 2: Integración MercadoPago (3-4 días)
**Objetivo:** Procesar pagos reales en Sandbox

**Tasks:**
- Implementar Server Actions para crear preferencias
- Webhook handler para notificaciones de pago
- Testing con tarjetas de prueba
- UI de estados de pago (approved, pending, rejected)

**Referencia:** `/docs/backend-roadmap.md` - Phase 1

---

### Fase 3: Integración Tiendanube Dev API (4-5 días)
**Objetivo:** Sincronizar catálogo real desde Tiendanube

**Tasks:**
- TiendanubeAdapter class (Adapter Pattern)
- Sync bidireccional (Picky → Tiendanube, Tiendanube → Picky)
- Webhook listener para cambios de stock
- UI de configuración en Admin Panel

**Referencia:** `/docs/backend-roadmap.md` - Phase 2

---

### Fase 4: PostgreSQL + Prisma (5-7 días)
**Objetivo:** Reemplazar localStorage por DB persistente

**Tasks:**
- Schema completo (Store, Product, User, Order, Analytics)
- Migrations versionadas
- Row Level Security para multi-tenant
- Server Actions con Prisma

**Referencia:** `/docs/backend-roadmap.md` - Phase 3

---

### Fase 5: Realtime con WebSockets (3-4 días)
**Objetivo:** Updates en vivo entre experiencias

**Tasks:**
- Integración Pusher/Ably
- Events: ORDER_CREATED, ORDER_READY, STOCK_UPDATED
- BroadcastChannel para sync multi-tab
- Reconexión automática

---

### Fase 6: Analytics Real + Dashboard (3-4 días)
**Objetivo:** Tracking de eventos y reportes

**Tasks:**
- Event tracking (Mixpanel/Amplitude)
- Funnel analysis
- Reportes exportables (CSV/PDF)
- Scheduled jobs para reportes diarios

**Referencia:** `/docs/backend-roadmap.md` - Phase 4

---

### Fase 7: SAP/VTEX Adapters (Enterprise - Futuro)
**Objetivo:** Soportar clientes enterprise

**Tasks:**
- SAPAdapter (Service Layer)
- VTEXAdapter (REST API)
- Multi-provider per store (config-driven)
- A/B testing de providers

**Referencia:** `/docs/middleware-tiendanube-sap.md`

---

## 6. Deployment Strategy

### MVP (Actual)
**Platform:** Vercel (Hobby Plan - Free)  
**Deploy:** Push to main → Auto deploy  
**URL:** https://picky-app.vercel.app (o custom domain)  
**Performance:** Edge Functions (ultra-fast cold starts)

### Production (Futuro)
**Platform:** Vercel Pro ($20/month)  
**Database:** Vercel Postgres ($20/month) o Supabase  
**Realtime:** Pusher Channels ($49/month)  
**Monitoring:** Sentry ($26/month)  
**Total:** ~$115/month para 1,000 pedidos/día

---

## 7. KPIs de Éxito del MVP

### UX Metrics
- ✅ Time to First Scan < 30 segundos
- ✅ Add to Cart Success Rate > 90%
- ✅ Checkout Completion Rate > 75%
- ✅ Average Order Value > $5,000 ARS

### Technical Metrics
- ✅ Lighthouse Score > 95 (Mobile)
- ✅ First Contentful Paint < 1.5s
- ✅ Time to Interactive < 3s
- ✅ Zero critical accessibility issues

### Business Metrics
- ✅ Customer Satisfaction > 4.5/5 stars
- ✅ Picker Efficiency > 3 pedidos/hora
- ✅ Stock Accuracy > 98%
- ✅ Return Customer Rate > 40%

---

## 8. Documentos Relacionados

### Para Developers
- 📄 **`/docs/plan.md`** - Roadmap maestro con progreso actualizado
- 📄 **`/docs/frontend-roadmap.md`** - Fases detalladas de desarrollo frontend
- 📄 **`/docs/backend-roadmap.md`** - Integraciones post-MVP (5 fases)
- 📄 **`README.md`** - Quick start guide y arquitectura

### Para Stakeholders
- 📄 **`/docs/pages-prototype.md`** - Wireframes y flujos de usuario
- 📄 **`/docs/middleware-tiendanube-sap.md`** - Arquitectura de integraciones enterprise

---

## 9. Contacto y Equipo

**Desarrollador Senior:** Responsable de arquitectura y desarrollo frontend  
**Stack:** Next.js 16, TypeScript 5, Shadcn/UI, Zustand, React Query  
**Metodología:** Agile con sprints de 1 semana  
**Testing:** Manual en MVP, automatizado en producción  

**Última Actualización:** 13 Enero 2026 - 19:00 hs  
**Versión:** 0.1.0 (MVP en desarrollo)  
**Servidor:** 🟢 http://localhost:3000

---

## 10. Notas Técnicas para IA Assistants

Este documento sirve como **contexto completo** para asistentes de IA que trabajen en el proyecto Picky.

**Principios de desarrollo:**
1. TypeScript estricto (cero `any`)
2. Mobile-first approach
3. Component composition sobre props drilling
4. Performance budget: < 200KB bundle
5. Accesibilidad no negociable (WCAG AA)

**Estructura de archivos:**
- `src/app/` - Next.js App Router
- `src/components/ui/` - Shadcn primitives (DO NOT EDIT)
- `src/components/{cliente,picker,admin}/` - Custom components
- `src/stores/` - Zustand global state
- `src/types/` - TypeScript interfaces
- `src/data/` - Mock JSON data

**Comandos útiles:**
```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run lint      # Run ESLint
```

**Cuando agregues features:**
1. Actualizar interfaces TypeScript primero
2. Crear mock data si es necesario
3. Implementar UI component
4. Actualizar `/docs/plan.md` con progreso
5. Testing manual antes de commit

**Prohibido en el código:**
- ❌ `any` types
- ❌ Inline styles (usar Tailwind)
- ❌ Console.logs en producción
- ❌ Hardcoded API keys
- ❌ Magic numbers (usar constants)

**Preferido:**
- ✅ Functional components
- ✅ TypeScript interfaces exportadas
- ✅ Reusable utility functions
- ✅ Semantic HTML
- ✅ Descriptive variable names

---

**FIN DEL DOCUMENTO**

Para comenzar a desarrollar, ejecutar:
```bash
cd /Users/martinnavarro/Documents/picky
npm run dev
```

Luego abrir http://localhost:3000 para ver el progreso actual.text
/picky
├── /src
│   ├── /app                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout (PWA manifest, fonts)
│   │   ├── page.tsx                  # Landing pública (marketing)
│   │   │
│   │   ├── /tienda/[storeId]         # 🛒 EXPERIENCIA CLIENTE (Mobile)
│   │   │   ├── page.tsx              # Onboarding/Landing del local
│   │   │   ├── /catalogo
│   │   │   │   └── page.tsx          # Lista/Grid de productos
│   │   │   ├── /escanear
│   │   │   │   └── page.tsx          # Cámara QR scanner
│   │   │   ├── /producto/[sku]
│   │   │   │   └── page.tsx          # Product Detail Page
│   │   │   ├── /carrito
│   │   │   │   └── page.tsx          # Carrito de compras
│   │   │   ├── /checkout
│   │   │   │   └── page.tsx          # Pago (MercadoPago)
│   │   │   ├── /pedido/[orderId]
│   │   │   │   └── page.tsx          # Estado del pedido
│   │   │   └── /confirmacion
│   │   │       └── page.tsx          # Pedido entregado
│   │   │
│   │   ├── /picker                   # 📦 EXPERIENCIA PICKER (Desktop)
│   │   │   ├── layout.tsx            # Layout con sidebar
│   │   │   ├── page.tsx              # Kanban de pedidos
│   │   │   └── /pedido/[orderId]
│   │   │       └── page.tsx          # Detalle de picking
│   │   │
│   │   └── /admin                    # 📊 EXPERIENCIA ADMIN (Desktop)
│   │       ├── layout.tsx            # Admin layout con nav
│   │       ├── page.tsx              # Dashboard principal
│   │       ├── /analytics
│   │       │   └── page.tsx          # Analytics avanzado
│   │       ├── /productos
│   │       │   └── page.tsx          # Gestión de productos
│   │       └── /configuracion
│   │           └── page.tsx          # Settings
│   │
│   ├── /components
│   │   ├── /ui                       # Shadcn/UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── modal.tsx
│   │   │   └── ...
│   │   ├── /cliente                  # Componentes del cliente mobile
│   │   │   ├── ProductCard.tsx
│   │   │   ├── CartItem.tsx
│   │   │   ├── QRScanner.tsx
│   │   │   ├── OrderStatusStepper.tsx
│   │   │   └── OffersCarousel.tsx
│   │   ├── /picker                   # Componentes del picker
│   │   │   ├── KanbanBoard.tsx
│   │   │   ├── OrderCard.tsx
│   │   │   ├── PickingList.tsx
│   │   │   └── QRRetirar.tsx
│   │   └── /admin                    # Componentes del admin
│   │       ├── KPICard.tsx
│   │       ├── SalesChart.tsx
│   │       ├── HeatMap.tsx
│   │       ├── ProductTable.tsx
│   │       └── QRGenerator.tsx
│   │
│   ├── /lib
│   │   ├── /api                      # Simulación de APIs (Middleware)
│   │   │   ├── products.ts           # getProducts(), getProductBySku()
│   │   │   ├── orders.ts             # createOrder(), updateOrderStatus()
│   │   │   ├── cart.ts               # addToCart(), removeFromCart()
│   │   │   └── payments.ts           # simulateMercadoPagoPayment()
│   │   ├── /adapters                 # Futuros adapters (post-MVP)
│   │   │   ├── tiendanube.ts
│   │   │   ├── sap.ts
│   │   │   └── vtex.ts
│   │   ├── utils.ts                  # Funciones helper (formatPrice, etc)
│   │   └── constants.ts              # Constantes globales
│   │
│   ├── /stores                       # Zustand stores
│   │   ├── useCartStore.ts           # Estado global del carrito
│   │   ├── useUserStore.ts           # Sesión del usuario (nombre, storeId)
│   │   └── useOrderStore.ts          # Estado de órdenes activas
│   │
│   ├── /hooks                        # Custom hooks
│   │   ├── useProducts.ts            # React Query: fetching de productos
│   │   ├── useCart.ts                # Hook del carrito (sync con localStorage)
│   │   ├── useOrders.ts              # React Query: órdenes
│   │   └── useQRScanner.ts           # Hook para cámara/escaneo
│   │
│   ├── /types                        # TypeScript interfaces
│   │   ├── product.ts
│   │   ├── order.ts
│   │   ├── cart.ts
│   │   └── user.ts
│   │
│   └── /data                         # Mock data (JSON estáticos)
│       ├── mock-products.json        # 50+ productos con SKUs
│       ├── mock-categories.json      # Categorías de productos
│       └── mock-stores.json          # Info de tiendas demo
│
├── /public
│   ├── /images                       # Imágenes de productos
│   │   ├── cemento-portland.jpg
│   │   ├── taladro-bosch.jpg
│   │   └── ...
│   ├── /qr                           # QRs generados (opcional)
│   └── picky-logo.svg
│
├── /docs                             # Documentación del proyecto
│   ├── context.md                    # Este archivo
│   ├── FRONTEND-ROADMAP.md           # Plan de desarrollo frontend
│   ├── BACKEND-ROADMAP.md            # Plan de integración backend
│   ├── pages-prototype.md            # Especificaciones de UX/UI
│   └── middleware-tiendanube-sap.md  # Arquitectura de integración
│
├── .env.local                        # Variables de entorno (API keys)
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

---

## 6. Definición de Datos (TypeScript Interfaces)

```typescript
// ===========================
// src/types/product.ts
// ===========================

export interface Product {
  id: string;                    // UUID generado
  sku: string;                   // SKU único del producto (ej: "CEM-PORT-50KG")
  name: string;                  // "Cemento Portland 50kg"
  description: string;           // Descripción corta
  longDescription?: string;      // Descripción larga (especificaciones)
  price: number;                 // Precio unitario en centavos (ej: 1250 = $12.50)
  stock: number;                 // Stock disponible (ej: 150)
  minStock?: number;             // Stock mínimo (alerta en admin)
  category: string;              // "Cemento" | "Herramientas" | "Pintura"
  imageUrl: string;              // URL de la imagen principal
  images?: string[];             // Galería de imágenes adicionales
  unit: string;                  // "bolsa" | "unidad" | "litro" | "metro"
  
  // Features inteligentes
  bulkDiscounts?: BulkDiscount[];     // Ofertas por cantidad
  relatedProducts?: string[];         // IDs de productos combinables
  comparisonGroup?: string;           // Grupo de comparación (ej: "cementos")
  
  // Metadata
  location?: string;                  // Ubicación en depósito (ej: "Pasillo A, Estante 3")
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;                  // Si está visible en el catálogo
}

export interface BulkDiscount {
  minQty: number;                // Cantidad mínima (ej: 10)
  discountPercent: number;       // Descuento (ej: 15 = 15%)
  label?: string;                // "Comprá 10 y ahorrá 15%"
}

// ===========================
// src/types/cart.ts
// ===========================

export interface CartItem {
  productId: string;
  sku: string;
  name: string;
  price: number;                 // Precio al momento de agregarlo
  quantity: number;
  imageUrl: string;
  notes?: string;                // Observaciones del cliente
  discountApplied?: number;      // Descuento por cantidad (en %)
  
  addedAt: Date;                 // Para analytics de tiempo
}

export interface Cart {
  items: CartItem[];
  subtotal: number;              // Suma de items sin descuento
  discounts: number;             // Total ahorrado
  total: number;                 // Subtotal - discounts
  
  // Metadata
  storeId: string;               // ID de la tienda
  userId?: string;               // ID del usuario (si está logueado)
  sessionId: string;             // UUID de sesión anónima
  updatedAt: Date;
}

// ===========================
// src/types/order.ts
// ===========================

export type OrderStatus = 
  | 'PENDING_PAYMENT'        // Carrito creado, no pagado
  | 'PAYMENT_FAILED'         // Pago rechazado
  | 'PAID'                   // Pagado, esperando preparación
  | 'PREPARING'              // En proceso de picking
  | 'READY_TO_PICKUP'        // Listo para retirar
  | 'DELIVERED'              // Entregado al cliente
  | 'CANCELLED';             // Cancelado

export interface Order {
  id: string;                    // UUID (ej: "ORD-1234")
  storeId: string;
  
  // Cliente
  customerId?: string;           // Si está logueado
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
  statusHistory: StatusChange[];  // Log de cambios de estado
  
  // Picking
  pickerId?: string;             // ID del empleado preparando
  pickingStartedAt?: Date;
  pickingCompletedAt?: Date;
  estimatedPickingTime?: number; // Minutos
  
  // Retiro
  pickupQRCode: string;          // QR único para retiro
  deliveredAt?: Date;
  deliveredBy?: string;          // ID del empleado que entregó
  
  // Timestamps
  createdAt: Date;
  paidAt?: Date;
  completedAt?: Date;
}

export interface OrderItem {
  productId: string;
  sku: string;
  name: string;
  price: number;                 // Precio al momento de la compra
  quantity: number;
  imageUrl: string;
  notes?: string;
  
  // Picking
  isPicked: boolean;             // Marcado por picker
  pickedAt?: Date;
  location?: string;             // Ubicación en depósito
}

export interface StatusChange {
  from: OrderStatus;
  to: OrderStatus;
  timestamp: Date;
  userId?: string;               // Quién hizo el cambio
  notes?: string;
}

// ===========================
// src/types/user.ts
// ===========================

export type UserRole = 'CUSTOMER' | 'PICKER' | 'ADMIN' | 'OWNER';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  storeId: string;               // A qué tienda pertenece
  
  // Session
  isAnonymous: boolean;          // Si es sesión anónima
  sessionId: string;
  
  // Metadata
  createdAt: Date;
  lastLoginAt: Date;
}

// ===========================
// src/types/analytics.ts
// ===========================

export interface ProductAnalytics {
  productId: string;
  sku: string;
  name: string;
  
  // Métricas
  scans: number;                 // Cuántas veces se escaneó
  addedToCart: number;           // Cuántas veces se agregó al carrito
  purchased: number;             // Cuántas veces se compró
  
  // Conversión
  scanToCartRate: number;        // % de escaneos que terminaron en carrito
  cartToPurchaseRate: number;    // % de carritos que terminaron en compra
  
  // Comparaciones
  comparedWith: string[];        // IDs de productos con los que se comparó
  
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

---

## 7. Requerimientos Funcionales del MVP

### 7.1 Simulación de Hardware

#### **Cámara para QR:**
- ✅ Solicitar permisos de cámara en navegador (iOS Safari, Chrome Android)
- ✅ Funcionar en HTTP local (desarrollo) y HTTPS (producción)
- ✅ Mostrar overlay de guías visuales (cuadrado de escaneo)
- ✅ Feedback visual al detectar QR (vibración, sonido, animación)
- ✅ Error handling: QR inválido, permisos denegados, cámara no disponible

#### **Generación de QRs Imprimibles:**
- ✅ Botón en Admin "Generar QRs para Imprimir"
- ✅ Modal con selector de productos (checkbox múltiple o "Todos")
- ✅ Generar PDF con grid 4x4 por hoja A4
- ✅ Cada QR contiene: SKU del producto + nombre debajo
- ✅ Librería sugerida: `qrcode` (npm) + `jspdf` para PDF

### 7.2 Simulación de Backend (LocalStorage)

#### **Persistencia Local:**
- ✅ Al agregar producto al carrito → Guardar en `localStorage.setItem('picky_cart', JSON.stringify(cart))`
- ✅ Al pagar → Crear orden en `localStorage.setItem('picky_orders', JSON.stringify(orders))`
- ✅ Al cambiar estado de orden → Actualizar array en localStorage
- ✅ Al cerrar navegador → Datos persisten (hasta que se borren manualmente)

#### **Sincronización entre Pantallas:**
- ✅ Usar `BroadcastChannel` API para sync entre tabs (ej: Admin ve pedidos en tiempo real)
- ✅ O alternativamente: Polling cada 5 segundos en pantalla Picker/Admin

#### **Limitaciones del MVP:**
- ⚠️ No hay usuarios reales (todos los clientes son "anónimos" con sessionId)
- ⚠️ No hay autenticación (Picker/Admin accesibles sin login)
- ⚠️ Stock NO se decrementa automáticamente (solo visual)
- ⚠️ Pagos simulados (no hay integración real con MercadoPago)

### 7.3 Mock Data Inicial

**Ver `FRONTEND-ROADMAP.md` para la estructura completa del archivo `mock-products.json`**

---

## 8. Estrategia de Integración Futura

### 8.1 Tiendanube API (Post-MVP)

**Objetivo:** Sincronizar catálogo real de la tienda del cliente con Picky.

**Endpoints Clave:**
- `GET /products` → Traer productos de Tiendanube
- `GET /products/{id}` → Detalle de producto
- `POST /orders` → Crear orden en Tiendanube cuando se paga en Picky

**Documentación:** [Tiendanube API Docs](https://dev.nuvemshop.com.br/)

### 8.2 MercadoPago API (Post-MVP)

**Objetivo:** Procesar pagos reales con tarjeta/QR/efectivo.

**Documentación:** [MercadoPago Checkout Pro](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/landing)

### 8.3 SAP Business One (Futuro)

**Objetivo:** Integrar con ERP de clientes corporativos (corralones grandes).

**Documentación:** [SAP Business One Service Layer](https://help.sap.com/docs/SAP_BUSINESS_ONE_SERVICE_LAYER)

---

## 9. Consideraciones de Seguridad

### 9.1 CORS y API Keys

**Problema:** Si el Frontend llama directamente a Tiendanube/SAP desde el navegador → CORS errors + exposición de credenciales.

**Solución (Middleware):**
- Todo el Frontend llama a `/api/*` (Server Actions de Next.js)
- Server Actions tienen las API Keys en `.env` (nunca expuestas al cliente)
- Server Actions llaman a Tiendanube/SAP/MercadoPago y devuelven datos limpios

---

## 10. Plan de Fases (Resumen)

### **FASE 1: Setup Inicial (2-3 días)** 🔵
- ✅ Crear proyecto Next.js 15 + TypeScript
- ✅ Instalar Shadcn/UI + Tailwind
- ✅ Configurar Zustand + React Query
- ✅ Crear estructura de carpetas
- ✅ Definir interfaces TypeScript
- ✅ Crear mock data (JSON)
- ✅ Deploy inicial a Vercel

### **FASE 2: Experiencia Cliente Mobile (7-10 días)** 🟢
Ver `FRONTEND-ROADMAP.md` para el desglose detallado

### **FASE 3: Experiencia Picker Desktop (5-7 días)** 🟡
Ver `FRONTEND-ROADMAP.md` para el desglose detallado

### **FASE 4: Experiencia Admin Desktop (5-7 días)** 🟠
Ver `FRONTEND-ROADMAP.md` para el desglose detallado

### **FASE 5: Polish y Testing (3-4 días)** 🟣
Ver `FRONTEND-ROADMAP.md` para el desglose detallado

**Total MVP: ~25-30 días de desarrollo**

---

## 11. Criterios de Éxito del MVP

### **Métricas de UX:**
- ✅ Tiempo de escaneo de producto < 2 segundos
- ✅ Agregar item al carrito < 3 segundos
- ✅ Completar compra (scan → pago) < 3 minutos
- ✅ Tiempo de preparación promedio < 10 minutos

### **Métricas Técnicas:**
- ✅ First Contentful Paint < 1.5s
- ✅ Time to Interactive < 3s
- ✅ Lighthouse Score > 90 (Performance, Accessibility, Best Practices)
- ✅ 0 errores TypeScript
- ✅ Build sin warnings

### **Funcionalidades Core:**
- ✅ Cliente puede escanear → agregar → pagar → retirar (flujo completo)
- ✅ Picker ve pedidos en tiempo real y puede marcar estados
- ✅ Admin ve KPIs y puede generar QRs
- ✅ Todo funciona sin backend real (localStorage + mock data)

---

## 12. Próximos Pasos Inmediatos

1. ✅ **Leer `docs/FRONTEND-ROADMAP.md`** → Plan detallado de pantallas
2. ✅ **Leer `docs/pages-prototype.md`** → Specs de UX/UI por página
3. ✅ **Inicializar proyecto Next.js**
4. ✅ **Crear mock data JSON**
5. ✅ **Definir interfaces TypeScript**
6. ✅ **Crear primera pantalla:** Landing del cliente

---

**Última Actualización:** 13 Enero 2026  
**Autor:** Tech Lead Fullstack Senior  
**Status:** 🟢 Listo para comenzar desarrollo
