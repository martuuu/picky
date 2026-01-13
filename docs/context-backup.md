# Contexto del Proyecto: Picky - Smart In-Store Shopping## 1. Visión del Proyecto**Picky** es una PWA de "Smart Shopping" diseñada para transformar la experiencia de compra en tiendas físicas (Corralones, Bazares, Ferreterías, Mayoristas). El cliente escanea productos con su celular - puede comprar desde catalogo tambine -, crea un carrito virtual sin carga física, paga online y retira su pedido preparado.**Filosofía:** "Scan & Go". El cliente navega liviano, escanea lo que quiere, paga desde el celular y retira todo empaquetado.**Estado Actual:*** 🟡 **Fase:** MVP Prototipo (Frontend-First)* 🎯 **Objetivo:** Simular flujo completo (Cliente Mobile + Picking Desktop + Admin Dashboard) con Mock Data + LocalStorage para validar UX/UI antes de integrar backend real* 🏗 **Arquitectura Futura:** Provider Agnostic (Tiendanube → SAP → VTEX vía Middleware)* 📱 **Mobile First:** Cliente 100% mobile, Admin/Picker desktop-oriented* 🎨 **Inspiración UI:** PedidosYa (sin rojo), colores a definir (ej: verde/azul moderno)---## 2. Stack Tecnológico (MVP Prototipo)**Frontend (PWA - Mobile First):*** **Framework:** Next.js 15+ (App Router, Turbopack)* **Lenguaje:** TypeScript 5+ (Estricto, types desde día 1)* **UI Kit:** Shadcn/UI + Tailwind CSS + Lucide Icons* **State Management:** Zustand (carrito global, sesión usuario) + React Query (mocking de APIs)* **Escaneo QR:** `html5-qrcode` o `react-qr-reader` (permisos de cámara)* **Animaciones:** Framer Motion (transiciones, modals)* **Diseño:** Inspirado en PedidosYa (cards, categorías, colores modernos)**Backend (Simulado en Prototipo):*** **Mocking:** Server Actions de Next.js con `await new Promise(resolve => setTimeout(resolve, 500))` para simular latencia* **Persistencia:** `localStorage` para carrito, usuario, órdenes activas (se pierde al cerrar navegador, no hay DB real)* **Mock Data:** Archivo `src/data/mock-products.json` con ~50 productos (nombre, SKU, precio, imagen, stock, categoría)* **Integraciones Futuras:** MercadoPago Sandbox + Tiendanube Dev API (post-MVP)**Arquitectura de Producción (Post-Prototipo):*** **Middleware:** Node.js / Vercel Serverless Functions (Adapter Pattern)* **Database:** PostgreSQL (para órdenes, usuarios, analytics)* **Integraciones:** Tiendanube REST API → SAP Service Layer → VTEX API (según cliente)* **Pagos:** MercadoPago Production API---## 3. Arquitectura del Sistema (Middleware Pattern)Aunque el MVP sea solo frontend, el código debe respetar la estructura de integración futura.**Patrón de Adaptador (Adapter Pattern):**El Frontend **nunca** llama a Tiendanube/SAP directamente. Siempre llama a una capa intermedia "Picky API Layer" que decide a qué provider consultar.```typescript// Interfaz Unificada (consumida por Frontend)interface IProduct {  id: string;  sku: string;  name: string;  price: number;  stock: number;  imageUrl: string;  category: string;}// El Frontend consume:useProduct(sku) -> PickyMiddleware -> (Switch Provider) -> Tiendanube/SAP/Mock```**Estrategia MVP (Prototipo):**El "Picky Middleware" devolverá datos de `src/data/mock-products.json` en lugar de llamar a APIs reales, pero la estructura de la llamada será idéntica a la versión de producción.**Ventajas:**- ✅ Cambiar de Mock → Tiendanube solo requiere modificar el middleware, frontend intacto- ✅ Escalable: Agregar SAP/VTEX solo suma un nuevo "adapter" en el middleware- ✅ Seguridad: Credenciales de APIs nunca expuestas en el cliente---## 4. User Flows y MódulosEl sistema se divide en **3 experiencias (Roles)** dentro de la misma WebApp:### A. Experiencia Cliente (Mobile App)**Público:** Consumidores finales que visitan la tienda física  **Dispositivo:** 100% Mobile (iOS/Android/Mobile Web)  **Inspiración UI:** PedidosYa (cards, categorías, scroll fluido)#### **1. Onboarding/Landing (Pantalla 1)*** **Entrada:** Cliente escanea QR en la entrada del local **O** ingresa manualmente a `picky.app/tienda/{id}`* **UI:** Landing con bienvenida: "¡Hola! Bienvenido a la experiencia Picky en **Ferretería El Tornillo**"* **CTAs:**  - 🎯 Botón principal: "Iniciar Recorrido" (activa cámara para escanear)  - 🛒 Botón secundario: "Ver Mi Carrito" (si ya tiene items guardados)  - 🔍 Botón terciario: "Ver Catálogo" (lista completa de productos)#### **2. Catálogo de Productos (Pantalla 2)*** **UI:** Lista/Grid de productos estilo PedidosYa* **Categorías:** Tabs horizontales (Cemento, Herramientas, Pintura, etc.)* **Cards:** Imagen, nombre, precio, stock badge ("Quedan 5"), botón "Agregar"* **Búsqueda:** Input con filtro en tiempo real* **Estado:** Si producto ya está en carrito, mostrar badge "(2)" en card#### **3. Escaneo de QR (Pantalla 3)*** **UI:** Cámara fullscreen con overlay de guías (cuadrado central)* **Funcionamiento:** Al detectar QR válido → Redirige automáticamente a PDP (Product Detail Page)* **Error Handling:** Si QR no es válido → Toast "Código no reconocido"* **UX:** Botón flotante "Ver Carrito" (badge con cantidad de items)#### **4. Product Detail Page - PDP (Pantalla 4)*** **Hero:** Imagen grande del producto (carousel si hay múltiples)* **Información:**  - Nombre del producto  - Precio unitario (grande, destacado)  - Stock disponible: Badge "✅ Hay stock (23 unidades)" o "⚠️ Últimas 3 unidades"  - Descripción corta  - Especificaciones técnicas (accordion collapsible)* **Smart Features:**  - 🏷️ "Ofertas por cantidad": "Comprá 10 y ahorrá 15%"  - 🛍️ "Productos combinables": Carousel con "Los clientes también llevaron..."  - 📊 "Comparador": Botón "Comparar con similar" (modal con tabla)* **Acciones:**  - Selector de cantidad: [-] [2] [+]  - Botón primario: "Agregar al Pedido" (verde, full width)  - Botón secundario: "Dejar" (outline, volver atrás)* **Observaciones:** Input opcional "Ej: Sin tornillos, solo tuercas"**Modal Ofertas (Popup):**Cuando el usuario agrega un producto al carrito, si hay ofertas relacionadas:* **UI:** Modal bottom sheet con animación slide-up* **Contenido:** "💡 Otros clientes que compraron esto también llevaron..."* **Cards:** Mini-cards con productos relacionados + botón "Agregar rápido"#### **5. Carrito de Compras (Pantalla 5)*** **Header:** "Mi Carrito (12 productos)"* **Lista de Items:**  - Imagen thumbnail + nombre  - Precio unitario x cantidad  - Subtotal por item  - Selector de cantidad inline ([-] [2] [+])  - Botón "Eliminar" (icono de basurero)* **Resumen:**  - Subtotal: $15,000  - Descuentos aplicados: -$2,500 (verde, destacado "¡Ahorraste!")  - **Total a Pagar:** $12,500 (grande, negrita)* **Ofertas Dinámicas:**  - Carousel inferior: "🎁 Llevá 2 pinturas más y ahorrá $500"* **CTA:**  - Botón primario: "Ir a Pagar" (full width, animación pulse)  - Link secundario: "Seguir comprando"#### **6. Checkout y Pago (Pantalla 6)*** **Resumen Final:**  - Desglose de precios  - Tiempo estimado de preparación: "🕒 Tu pedido estará listo en ~10 minutos"* **Método de Pago:**  - Botón "Pagar con MercadoPago" (logo + colores oficiales)  - **Simulación MVP:** Al hacer click → Spinner 2 segundos → Pantalla de éxito* **UI MercadoPago (Futuro):**  - Modal con iframe de MercadoPago Checkout  - Métodos: Tarjetas, QR, efectivo (Rapipago/PagoFácil)#### **7. Estado del Pedido (Pantalla 7)****Post-pago:** El cliente es redirigido a esta pantalla automáticamente.* **Stepper Visual:**  - ✅ Pedido recibido (check verde)  - 🔄 En preparación (spinner azul, activo)  - ⏳ Listo para retirar (gris, pendiente)  - ✅ Entregado (gris, pendiente)* **Tiempo Estimado:** "Estimamos 8 minutos restantes"* **Mensaje:** "Estamos preparando tu pedido. Tenemos café gratis en la barra mientras esperás ☕"* **Animación:** Lottie animation de cajas moviéndose* **Notificación Real-time:** Cuando estado cambia a "Listo" → 🔔 Toast + sonido + vibración**Estado: Listo para Retirar*** **UI:** Confetti animation 🎉* **Mensaje:** "¡Tu pedido está listo! 🎊"* **QR de Retiro:** QR grande en pantalla (contiene `orderId`)* **Instrucciones:** "Mostrá este código en el check-out"* **CTA:** Botón "Ya retiré mi pedido" (marca como entregado)#### **8. Confirmación de Retiro (Pantalla 8)****Post-retiro:** Cliente escanea QR en mostrador o hace click en "Ya retiré".* **UI:** Check animado ✅ con confetti* **Mensaje:** "¡Gracias por comprar con Picky en Ferretería El Tornillo!"* **Detalle del Pedido:**  - Fecha y hora de retiro  - Botón "Descargar Factura" (PDF)  - Lista de productos comprados* **Feedback:**  - "¿Cómo fue tu experiencia?" (5 estrellas)  - Input opcional para comentarios* **CTA:** Botón "Iniciar Nueva Compra"---### B. Experiencia Picker (Desktop App)**Público:** Empleados del depósito/almacén que preparan pedidos  **Dispositivo:** Desktop/Tablet (teclado + mouse, pantalla grande)  **Inspiración UI:** Trello/Kanban boards, dashboards operativos#### **1. Tablero de Pedidos (Pantalla Desktop 1)****Layout:** Kanban board con 4 columnas responsivas**Columnas:**1. **A Preparar** (rojo/naranja)   - Pedidos que acaban de ser pagados   - Badge con cantidad de items del pedido   - Alerta sonora/visual cuando entra nuevo pedido   - Orden: Más antiguo arriba2. **En Proceso** (azul)   - Pedidos que están siendo armados actualmente   - Mostrar quién está preparando (avatar del picker)   - Timer desde que se inició3. **Listo para Entregar** (verde)   - Pedidos terminados esperando que el cliente venga   - Botón "Notificar Cliente" (opcional)4. **Entregado** (gris)   - Pedidos ya retirados en las últimas 2 horas   - Auto-archiva después de 2hs**Cards de Pedido:*** **Header:** `#ORD-1234` + timestamp (hace 5 min)* **Cliente:** Nombre (si está logueado) o "Cliente anónimo"* **Items:** "12 productos (18 unidades totales)"* **Total:** $12,500* **Acciones rápidas:**  - Botón "Ver Detalle" (abre modal)  - Botón "Comenzar Preparación" (mueve a "En Proceso")  - Drag & Drop habilitado (mover entre columnas)**Notificaciones:*** 🔔 Badge en header: "3 pedidos nuevos"* 🔊 Sonido de "ding" cuando entra pedido nuevo* 💬 Toast: "Nuevo pedido #ORD-1234 de Juan Pérez"#### **2. Modal de Detalle de Pedido (Pantalla Desktop 2)**

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

## 5. Estructura de Carpetas del Proyecto

```text
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
