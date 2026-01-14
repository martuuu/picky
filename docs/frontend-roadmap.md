# 🎨 FRONTEND ROADMAP - Picky

**Última Actualización:** 14 Enero 2026  
**Estado Actual:** ✅ **PROTOTIPO MVP 100% COMPLETO**  
**Próxima Fase:** Integraciones Reales (MercadoPago + Tiendanube)

---

## 📊 ESTADO ACTUAL - PROTOTIPO COMPLETO

### ✅ Completado (100%)

#### 1. **Infraestructura Base**
- ✅ Next.js 16.1.1 + TypeScript 5 (Strict Mode)
- ✅ App Router con rutas dinámicas
- ✅ Shadcn/UI - 18 componentes instalados
- ✅ Zustand Stores (Cart, User, Picker) con persist
- ✅ React Query configurado
- ✅ Framer Motion para animaciones
- ✅ Recharts para gráficos
- ✅ html5-qrcode para escaneo
- ✅ Mock Data completo (20 productos, 6 categorías, 2 tiendas)

#### 2. **Portal Cliente Mobile** (10/10 pantallas)
1. ✅ Landing Principal - Home con selector de portales
2. ✅ Store Landing - Bienvenida + header con perfil
3. ✅ Catálogo - Grid responsive + búsqueda + filtros + header con perfil/carrito
4. ✅ Scanner QR - Camera real + simulador + input manual
5. ✅ Product Detail Page - Carousel, specs, ofertas, relacionados
6. ✅ Carrito - Edición inline + header con perfil + ofertas dinámicas
7. ✅ Checkout - Validación inline + MercadoPago simulado
8. ✅ Estado del Pedido - Real-time tracking + ofertas bar
9. ✅ Confirmación - QR retiro + botones (Perfil/Seguir Comprando)
10. ✅ Modal Ofertas Combinadas - Bottom sheet automático

#### 3. **Portal Picker Desktop** (3/3 pantallas)
1. ✅ Kanban de Pedidos - 3 columnas + breadcrumbs + botón historial
2. ✅ Modal Detalle - Checklist interactivo
3. ✅ Escaneo QR Retiro - Validación y entrega

#### 4. **Panel Admin** (4/4 pantallas)
1. ✅ Dashboard - Stats + pedidos + top productos
2. ✅ Analytics - Charts + embudo de conversión
3. ✅ Productos & QR - 2 vistas + generación QR
4. ✅ Configuración - 5 tabs completos
- ✅ Sidebar con active state y navegación a inicio
- ✅ Breadcrumbs en todas las páginas

#### 5. **Páginas Adicionales (En Desarrollo)**
1. ✅ Perfil Cliente - Stats + roadmap
2. ✅ Ajustes de Cuenta - Mock + roadmap
3. ✅ Direcciones - Mock + roadmap
4. ✅ Perfil de Sucursal - Info completa + roadmap
5. ✅ Historial Picker - Stats + roadmap
6. ✅ 404 Personalizada - 6 accesos rápidos

#### 6. **Navegación & UX**
- ✅ Breadcrumbs en Admin (Inicio / Admin / Página)
- ✅ Breadcrumbs en Picker (Inicio / Portal Picker)
- ✅ Ícono de perfil en todas las páginas cliente
- ✅ Sidebar Admin con estados activos
- ✅ Headers consistentes con navegación intuitiva
- ✅ Botón "Ver Mi Perfil" al final del checkout

---

## 🎯 FASE 1: REFINAMIENTO UX (1-2 semanas)

### Objetivo: Pulir detalles y mejorar navegación

#### 1.1 Navegación y Breadcrumbs
- [ ] Agregar breadcrumbs en todas las páginas cliente
  - Formato: `Inicio / Tienda / Catálogo`
  - Incluir en: Catálogo, PDP, Carrito, Checkout
- [ ] Implementar navegación por gestos (swipe)
- [ ] Agregar animaciones de transición entre páginas mejoradas

#### 1.2 Accesibilidad
- [ ] Implementar focus trap en modales
- [ ] Agregar aria-labels a todos los botones de iconos
- [ ] Mejorar contraste de colores (WCAG AAA)
- [ ] Keyboard navigation completa
- [ ] Screen reader testing

#### 1.3 Performance
- [ ] Lazy loading de imágenes
- [ ] Code splitting por ruta
- [ ] Prefetch de rutas críticas
- [ ] Service Worker para PWA offline
- [ ] Caching estratégico con React Query

#### 1.4 Micro-interactions
- [ ] Haptic feedback en acciones críticas
- [ ] Loading states en botones
- [ ] Skeleton loaders en todas las páginas
- [ ] Toast notifications mejoradas
- [ ] Animaciones de éxito/error consistentes

---

## 🔌 FASE 2: INTEGRACIÓN MERCADOPAGO (2-3 semanas)

### Objetivo: Pagos reales en modo sandbox

#### 2.1 Setup MercadoPago
```bash
npm install mercadopago
```

**Tareas:**
- [ ] Crear cuenta en MercadoPago Developers
- [ ] Obtener credenciales de sandbox
- [ ] Configurar variables de entorno
- [ ] Crear Server Actions para preferencias
- [ ] Implementar webhooks para notificaciones

#### 2.2 Checkout Real
- [ ] Reemplazar simulación con Checkout Pro API
- [ ] Crear preferencia de pago con productos del carrito
- [ ] Redirigir a Checkout de MercadoPago
- [ ] Manejar retorno exitoso/fallido
- [ ] Actualizar estado de orden en tiempo real

#### 2.3 Webhooks
```typescript
// src/app/api/webhooks/mercadopago/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { type, data } = body;
  
  if (type === 'payment') {
    const paymentId = data.id;
    // Verificar pago y actualizar orden
  }
}
```

#### 2.4 Testing
- [ ] Probar con tarjetas de prueba
- [ ] Simular pagos exitosos/rechazados
- [ ] Validar flujo completo
- [ ] Testing de webhooks con ngrok

**Tarjetas de Prueba:**
- Aprobada: 5031 7557 3453 0604
- Rechazada: 5031 4332 1540 6351

---

## 🏪 FASE 3: INTEGRACIÓN TIENDANUBE (3-4 semanas)

### Objetivo: Sincronizar catálogo real

#### 3.1 Setup Tiendanube
```bash
npm install axios
```

**Tareas:**
- [ ] Crear app en Tiendanube Partners
- [ ] Implementar OAuth 2.0 flow
- [ ] Obtener credenciales por tienda
- [ ] Crear adapter para API de Tiendanube

#### 3.2 Sincronización de Catálogo
```typescript
// src/lib/adapters/tiendanube.ts
export async function syncProducts(storeId: string) {
  const response = await axios.get(
    `https://api.tiendanube.com/v1/${storeId}/products`,
    {
      headers: {
        'Authentication': `bearer ${accessToken}`,
        'User-Agent': 'Picky App'
      }
    }
  );
  return response.data;
}
```

**Tareas:**
- [ ] Mapear productos de Tiendanube a modelo Picky
- [ ] Sincronizar categorías
- [ ] Sincronizar imágenes
- [ ] Actualizar stock en tiempo real
- [ ] Webhooks para cambios de inventario

#### 3.3 Gestión de Órdenes
- [ ] Crear órdenes en Tiendanube al pagar
- [ ] Sincronizar estados bidireccionales
- [ ] Webhooks de cambios de estado
- [ ] Facturación automática
- [ ] Envío de emails de confirmación

#### 3.4 Multi-Tenant
- [ ] Sistema de onboarding de tiendas
- [ ] Dashboard de configuración por tienda
- [ ] Gestión de credenciales
- [ ] Aislamiento de datos por tenant
- [ ] Billing y suscripciones

---

## 🗄️ FASE 4: BACKEND REAL (4-5 semanas)

### Objetivo: Migrar de localStorage a base de datos

#### 4.1 Stack Backend
```bash
# Opción 1: Next.js API Routes + Prisma
npm install @prisma/client prisma

# Opción 2: NestJS (microservicio separado)
npm install -g @nestjs/cli
nest new picky-api
```

#### 4.2 Base de Datos
**Esquema PostgreSQL:**
```prisma
// prisma/schema.prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  role      UserRole
  sessions  Session[]
  orders    Order[]
}

model Product {
  id           String   @id @default(cuid())
  sku          String   @unique
  name         String
  price        Decimal
  stock        Int
  categoryId   String
  category     Category @relation(fields: [categoryId])
  cartItems    CartItem[]
  orderItems   OrderItem[]
}

model Order {
  id           String      @id @default(cuid())
  orderNumber  String      @unique
  status       OrderStatus
  customerId   String
  customer     User        @relation(fields: [customerId])
  items        OrderItem[]
  total        Decimal
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
}

// ... más modelos
```

**Tareas:**
- [ ] Diseñar schema completo
- [ ] Configurar Prisma ORM
- [ ] Migraciones de base de datos
- [ ] Seeders con datos de prueba
- [ ] Backups automáticos

#### 4.3 Autenticación
```bash
npm install next-auth @auth/prisma-adapter
```

**Tareas:**
- [ ] Implementar NextAuth.js
- [ ] Login con email/password
- [ ] OAuth con Google/Facebook
- [ ] JWT tokens
- [ ] Refresh tokens
- [ ] Roles y permisos (Cliente, Picker, Admin)

#### 4.4 API REST
**Endpoints Principales:**
```typescript
// Products
GET    /api/products
GET    /api/products/:id
POST   /api/products       (Admin)
PUT    /api/products/:id   (Admin)
DELETE /api/products/:id   (Admin)

// Cart
GET    /api/cart
POST   /api/cart/items
PUT    /api/cart/items/:id
DELETE /api/cart/items/:id

// Orders
GET    /api/orders
GET    /api/orders/:id
POST   /api/orders
PATCH  /api/orders/:id/status

// Users
GET    /api/users/profile
PUT    /api/users/profile
GET    /api/users/orders
```

#### 4.5 Real-Time con WebSockets
```bash
npm install socket.io socket.io-client
```

**Tareas:**
- [ ] Configurar Socket.IO server
- [ ] Real-time updates de órdenes (Picker)
- [ ] Notificaciones push para clientes
- [ ] Chat de soporte en vivo
- [ ] Presencia de pickers online

---

## 📱 FASE 5: PWA AVANZADO (2-3 semanas)

### Objetivo: App nativa-like experience

#### 5.1 Service Worker
```typescript
// public/sw.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('picky-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/offline',
        '/manifest.json'
      ]);
    })
  );
});
```

**Tareas:**
- [ ] Estrategia de caching (Network First + Cache Fallback)
- [ ] Offline mode completo
- [ ] Background sync para órdenes
- [ ] Pre-caching de assets críticos
- [ ] Update prompt cuando hay nueva versión

#### 5.2 Push Notifications
```bash
npm install web-push
```

**Tareas:**
- [ ] Configurar VAPID keys
- [ ] Solicitar permisos de notificaciones
- [ ] Enviar notificaciones desde backend
- [ ] Tipos de notificaciones:
  - Pedido en preparación
  - Pedido listo para retiro
  - Ofertas personalizadas
  - Productos de nuevo en stock

#### 5.3 Instalación
- [ ] Manifest.json completo con íconos
- [ ] Splash screens por plataforma
- [ ] Instalar como app standalone
- [ ] Detectar si ya está instalado
- [ ] Prompt de instalación contextual

---

## 🎨 FASE 6: FEATURES ADICIONALES (Según demanda)

### 6.1 Sistema de Reseñas
- [ ] Rating de productos (1-5 estrellas)
- [ ] Comentarios de clientes
- [ ] Fotos subidas por usuarios
- [ ] Moderación de contenido
- [ ] Helpful votes en reseñas

### 6.2 Wishlist/Favoritos
- [ ] Agregar productos a favoritos
- [ ] Lista persistente en perfil
- [ ] Compartir wishlist
- [ ] Notificaciones de ofertas en favoritos
- [ ] Recomendaciones basadas en favoritos

### 6.3 Búsqueda Avanzada
- [ ] Filtros múltiples (precio, marca, rating)
- [ ] Ordenamiento (relevancia, precio, popularidad)
- [ ] Búsqueda por voz
- [ ] Búsqueda por imagen (AI)
- [ ] Sugerencias inteligentes

### 6.4 Programa de Fidelidad
- [ ] Sistema de puntos por compra
- [ ] Niveles (Bronze, Silver, Gold, Platinum)
- [ ] Beneficios exclusivos por nivel
- [ ] Cupones de descuento
- [ ] Referral program

### 6.5 Geolocalización
- [ ] Detección de tienda más cercana
- [ ] Mapa de tiendas
- [ ] Navegación con Waze/Google Maps
- [ ] Check-in automático en tienda
- [ ] Ofertas basadas en ubicación

---

## 📈 MÉTRICAS DE ÉXITO

### KPIs a Trackear:
- **Conversión:** % de carritos que completan checkout
- **Tiempo de Preparación:** Avg time (picker)
- **Satisfacción:** NPS score post-retiro
- **Engagement:** DAU/MAU ratio
- **Revenue:** GMV (Gross Merchandise Value)
- **Eficiencia:** Pedidos/hora por picker
- **Retención:** % clientes que recompran en 30 días

### Herramientas:
- Google Analytics 4
- Mixpanel (eventos custom)
- Hotjar (heatmaps + recordings)
- Sentry (error tracking)
- LogRocket (session replay)

---

## 🚀 DESPLIEGUE Y DEVOPS

### Staging Environment
- **Frontend:** Vercel Preview Deployments
- **Backend:** Railway/Render staging
- **Database:** PostgreSQL staging
- **Testing:** Playwright E2E tests en CI/CD

### Production Environment
- **Frontend:** Vercel Production (CDN global)
- **Backend:** Railway/Render production
- **Database:** PostgreSQL con backups diarios
- **Monitoring:** Datadog/New Relic
- **CDN Imágenes:** Cloudinary
- **Logs:** Better Stack

### CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm run test
      - run: npm run build
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: vercel/deploy@v1
```

---

## 📝 DOCUMENTACIÓN PENDIENTE

- [ ] API Reference (Swagger/OpenAPI)
- [ ] Component Library (Storybook)
- [ ] User Manual (para clientes)
- [ ] Admin Guide (para dueños de tienda)
- [ ] Picker Training (para empleados)
- [ ] Developer Onboarding
- [ ] Architecture Decision Records (ADRs)

---

**Última Actualización:** 14 Enero 2026  
**Próxima Revisión:** Al completar Fase 1 (Refinamiento UX)
