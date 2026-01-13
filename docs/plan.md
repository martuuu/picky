# 📊 Plan Maestro: Picky - Sistema Scan & Go

**Última Actualización:** 13 Enero 2026  
**MVP Progress:** 🟡 **0% - Documentación Completada**  
**Estado:** 📝 Planning Phase → Ready to Initialize

---

## 📖 RESUMEN EJECUTIVO

**Picky** es una PWA Mobile-First que transforma la experiencia de compra en tiendas físicas (corralones, bazares, ferreterías) mediante un sistema "Scan & Go".

**Modelo de Negocio:** SaaS Multi-Tenant para retail físico  
**Inspiración UX:** PedidosYa (sin color rojo)  
**Estrategia MVP:** Frontend-First con mock data + localStorage  
**Integraciones Futuras:** MercadoPago → Tiendanube → SAP/VTEX

**Total de Pantallas MVP:** 17 pantallas core
- 👤 **Cliente Mobile:** 10 pantallas (incluye Landing Principal + Landing Tienda + Modal Ofertas)
- 📦 **Picker Desktop:** 3 pantallas (Kanban + Modal Detalle + Escaneo QR)
- 📊 **Admin Dashboard:** 4 pantallas (Dashboard + Analytics + Productos/QR + Config)

---

## 🎯 OBJETIVO INMEDIATO

**Completar FRONTEND-ROADMAP.md** (Fases 2.4-2.8 + Phase 3-5)  
**Duración Estimada:** 20-25 días de desarrollo  
**Stack:** Next.js 15 + TypeScript + Shadcn/UI + Zustand + React Query

---

## 📋 ESTRUCTURA DEL PROYECTO

### **Documentación Completada (✅)**

**Archivos Core:**
- ✅ `/docs/context.md` (13,000+ caracteres) - Visión completa del proyecto
- ✅ `/docs/FRONTEND-ROADMAP.md` (20,000+ caracteres) - Phase 1 + 2.1-2.3
- ✅ `/docs/BACKEND-ROADMAP.md` (16,000+ caracteres) - 5 fases post-MVP
- ✅ `/docs/middleware-tiendanube-sap.md` - Arquitectura de integraciones
- ✅ `/docs/pages-prototype.md` - Wireframes y flujos de usuario
- ✅ `/plan.md` - Este archivo (roadmap maestro)

**Archivos de Referencia (Temporal):**
- 📁 Archivos médicos adjuntos (serán eliminados después del setup)

---

## 🗺️ FASES DEL PROYECTO

### ✅ FASE 0: Documentación & Arquitectura (COMPLETADO - 13 Enero 2026)

**Duración:** 1 día  
**Estado:** ✅ 100% Completado

**Logros:**
- Análisis de 8 archivos de referencia (proyecto médico MediCore)
- Definición completa de arquitectura Picky
- TypeScript interfaces (Product, Cart, Order, User, Analytics)
- Mock data structure (50+ productos JSON)
- Zustand stores architecture
- Folder structure mapping
- Integration strategy (Middleware Pattern)

**Entregables:**
- ✅ Vision document (`context.md`)
- ✅ Frontend roadmap Phase 1 + 2.1-2.3
- ✅ Backend roadmap completo (5 fases)
- ✅ User flows (Cliente 8 screens, Picker 3, Admin 4)

---

### ⏳ FASE 1: Setup Inicial (2-3 días)

**Estado:** 🔴 NO INICIADO  
**Prioridad:** 🔴 CRÍTICA

**Tareas:**

#### **1.1 Inicializar Proyecto (1h)**
```bash
npx create-next-app@latest picky --typescript --tailwind --app --use-npm
cd picky
```

#### **1.2 Instalar Dependencias (30min)**
```bash
# UI Components
npx shadcn@latest init
npm install framer-motion lucide-react

# State Management
npm install zustand

# Data Fetching
npm install @tanstack/react-query

# QR Scanner
npm install html5-qrcode react-qr-reader

# Utils
npm install date-fns clsx tailwind-merge qrcode jspdf recharts
```

#### **1.3 Estructura de Carpetas (30min)**
- Crear 15 carpetas según `/docs/FRONTEND-ROADMAP.md` Phase 1.4

#### **1.4 TypeScript Interfaces (2h)**
- `src/types/product.ts`
- `src/types/cart.ts`
- `src/types/order.ts`
- `src/types/user.ts`
- `src/types/analytics.ts`

#### **1.5 Mock Data (2-3h)**
- `src/data/mock-products.json` (~50 productos)
- `src/data/mock-categories.json`
- `src/data/mock-stores.json`

#### **1.6 Zustand Stores (1h)**
- `useCartStore.ts` con persist middleware
- `useUserStore.ts` con session handling

#### **1.7 React Query Setup (30min)**
- Configurar providers
- Setup de queries con artificial latency

**Criterios de Éxito:**
- ✅ Proyecto Next.js corriendo en `localhost:3000`
- ✅ TypeScript sin errores
- ✅ Mock data cargado correctamente
- ✅ Stores funcionando con localStorage

**Referencia:** `/docs/FRONTEND-ROADMAP.md` - Phase 1 (completo)

---

### ⏳ FASE 2: Experiencia Cliente Mobile (12-15 días)

**Estado:** 🟡 PARCIALMENTE COMPLETADO (30%)  
**Prioridad:** 🔴 CRÍTICA

**Progreso:**
- ✅ Phase 2.1: Landing Principal (Completado en roadmap)
- ✅ Phase 2.2: Landing Tienda/Bienvenida (Completado en roadmap)
- ✅ Phase 2.3: Escáner QR (Completado en roadmap)
- ✅ Phase 2.4: Catálogo de Productos (Completado en roadmap)
- ⏳ Phase 2.5: Product Detail Page (PDP) + Modal Ofertas - **PENDIENTE**
- ⏳ Phase 2.6: Carrito de Compras - **PENDIENTE**
- ⏳ Phase 2.7: Checkout & Pago - **PENDIENTE**
- ⏳ Phase 2.8: Estado del Pedido (Cliente) - **PENDIENTE**
- ⏳ Phase 2.9: Confirmación de Retiro - **PENDIENTE**

#### **2.5 Product Detail Page + Modal Ofertas (2-3 días)**
**Features:**
- Imagen principal + galería (carousel)
- Precio + descuentos por cantidad ("Comprá 10 y ahorrá 15%")
- Selector de cantidad con stock validation
- Especificaciones técnicas (accordion collapsible)
- "Productos combinables" carousel
- Botón "Comparar con similar" (modal con tabla comparativa)
- **Modal Ofertas Combinadas:** Popup bottom-sheet que aparece al agregar al carrito
- Observaciones opcionales del cliente
- Animaciones de transición

#### **2.6 Carrito de Compras (2-3 días)**
**Features:**
- Lista de items con edición inline (thumbnail + selector cantidad)
- Resumen de totales (subtotal, descuentos aplicados destacados en verde "¡Ahorraste!", total a pagar)
- Ofertas dinámicas relacionadas (carousel inferior: "Llevá 2 pinturas más y ahorrá $500")
- Botón "Ir a Pagar" con validación + animación pulse
- Empty state con CTA "Seguir comprando"
- Stepper de progreso visual del flujo
- Persistencia en localStorage

#### **2.7 Checkout & Pago (2-3 días)**
**Features:**
- Resumen final con desglose de precios
- Tiempo estimado de preparación: "Tu pedido estará listo en ~10 minutos"
- Simulación MercadoPago Checkout Pro (mock payment flow)
- Botón con logo y colores oficiales MercadoPago
- **MVP:** Spinner 2 segundos → Pantalla de éxito (sin API real)
- Validación de formularios
- Loading states elegantes

#### **2.8 Estado del Pedido (2 días)**
**Features:**
- Stepper de estados (Pedido Recibido → En Preparación → Listo para Retirar → Entregado)
- Tiempo estimado dinámico: "Estimamos 8 minutos restantes"
- Mensaje amigable: "Tenemos café gratis en la barra mientras esperás ☕"
- Lottie animation de cajas moviéndose
- **QR de retiro** grande en pantalla (contiene orderId)
- **Notificación realtime:** Toast + sonido 🔊 + vibración cuando estado cambia a "Listo"
- Confetti animation 🎉 al pasar a "Listo para Retirar"
- BroadcastChannel API para sync entre tabs

#### **2.9 Confirmación de Retiro (1 día)**
**Features:**
- Check animado ✅ con confetti
- Mensaje: "¡Gracias por comprar con Picky en [nombre comercio]!"
- Detalles del pedido (fecha/hora retiro, lista productos)
- Botón "Descargar Factura" (PDF)
- **QR de validación** obligatorio mostrado
- Feedback de experiencia (5 estrellas + input comentarios opcional)
- CTA: "Iniciar Nueva Compra"
- Animación de éxito (confetti)

**Criterios de Éxito:**
- ✅ 10 pantallas Cliente Mobile funcionando (+ modal ofertas)
- ✅ Flujo completo de compra (landing → scan → catálogo → PDP → carrito → pago → estado → confirmación)
- ✅ Mock data simulando latencia realista (500ms)
- ✅ Animaciones fluidas (Framer Motion: confetti, slide-up, pulse)
- ✅ Responsive design perfecto (320px → 768px)
- ✅ QR de retiro obligatorio implementado
- ✅ Notificaciones con sonido 🔊 cuando pedido listo
- ✅ Modal ofertas combinadas automático

**Referencia:** `/docs/FRONTEND-ROADMAP.md` - Phase 2 (parcialmente completo)

---

### ⏳ FASE 3: Experiencia Picker Desktop (3-4 días)

**Estado:** 🔴 NO INICIADO  
**Prioridad:** 🟡 MEDIA

**Pantallas:**

#### **3.1 Kanban de Pedidos (2 días)**
- **Layout:** 4 columnas drag & drop (A Preparar / En Proceso / Listo para Entregar / Entregado)
- **Columna "A Preparar":** 
  - Pedidos que fueron pagados (Pedido 1 - PREPARAR, Pedido 2 - PREPARAR)
  - Badge con cantidad de items del pedido
  - Alerta sonora/visual cuando entra nuevo pedido 🔊
  - Orden: Más antiguo arriba
- **Columna "En Proceso":**
  - Avatar del picker que está preparando
  - Timer desde que se inició
- **Columna "Listo para Entregar":**
  - Pedidos terminados esperando retiro del cliente
  - Botón opcional "Notificar Cliente"
- **Columna "Entregado":**
  - Últimas 2 horas de pedidos retirados
  - Auto-archiva después
- Cards con info resumida: #ORD-1234, nombre cliente, cantidad items, total
- Filtros por prioridad/tiempo
- Notificaciones: Badge "3 pedidos nuevos" + sonido "ding" + Toast

#### **3.2 Modal de Detalle de Picking (1 día)**
- **Trigger:** Click en botón "PREPARAR" del pedido en Kanban
- **Header:** Número de orden grande + Badge de estado + Timeline de estados
- **Info Cliente:** Nombre, teléfono, notas especiales del pedido
- **Lista de Productos ordenada por ubicación física** (pasillo/estante)
  - Layout: [✅ Checkbox] [Imagen] [Nombre] [Cantidad] [Ubicación: "Pasillo 3 - Estante B"]
  - Barra de progreso: "8/12 items recolectados"
  - Click en producto → Modal con imagen grande (verificación visual)
- **Botones:**
  - "Comenzar Preparación" (si está en "A Preparar")
  - "LISTO PARA ENTREGAR" (cuando todos los checkboxes marcados) → **Notifica al cliente con ruidito 🔊**
  - "Reportar Problema" (ej: falta stock)
  - "Imprimir Lista de Picking" (PDF)
- **Acción:** Al finalizar → Pedido pasa a columna "Listos para Entregar"

#### **3.3 Escaneo QR de Retiro (1 día)**
- **URL:** `/picker/retiro`
- **Componentes:** Lector QR desktop + Input manual para código de orden
- **Validación:**
  - Si QR válido y pedido en "Listo" → ✅ Permitir entrega
  - Si pedido NO está listo → ⚠️ "Este pedido aún está en preparación"
- **Confirmación:**
  - Mostrar foto del cliente (si disponible) para validación
  - Checkbox: "Cliente retiró todos los productos"
  - Botón "Confirmar Entrega"
- **Acción:** Pedido pasa de "Listos para Entregar" a "Pedidos Entregados" (columna 4 del Kanban)

**Criterios de Éxito:**
- ✅ Kanban funcional con drag & drop
- ✅ Flujo picker completo (preparar → notificar)
- ✅ Desktop-oriented (sidebar + content)
- ✅ Realtime updates simulados

**Referencia:** `/docs/FRONTEND-ROADMAP.md` - Phase 3 (pendiente de documentar)

---

### ⏳ FASE 4: Experiencia Admin Desktop (4-5 días)

**Estado:** 🔴 NO INICIADO  
**Prioridad:** 🟡 MEDIA

**Pantallas:**

#### **4.1 Dashboard Principal - Vista Realtime (2 días)**
- **KPIs Cards superiores:**
  - 📊 Pedidos Hoy: 47 pedidos (+12% vs ayer)
  - 💰 Ventas Hoy: $342,500 (+8% vs ayer)
  - ⏱️ Tiempo Promedio de Preparación: 9.5 minutos
  - 🛒 Carrito Promedio: $7,287
- **Gráficos Recharts:**
  - Pedidos por Hora (line chart: Hoy vs Promedio semanal)
  - Top 10 Productos Más Vendidos (bar chart horizontal con colores por ranking)
  - Mapa de Calor: Escaneos vs Compras (heatmap para detectar productos mirados pero no comprados)
- **Widgets:**
  - 🚨 Alertas: "5 productos con stock bajo"
  - 👥 Clientes Activos Ahora: 12 clientes escaneando en tiempo real
  - 📦 Pedidos en Preparación: 3 pedidos (link directo a vista Picker)
- **Vista Realtime de TODOS los pedidos** (montón de pedidos activos)
- **Rol Superadmin:** Puede ver pedidos de TODOS los locales

#### **4.2 Analytics Avanzado (1 día)**
- **Tab 1: Embudo de Conversión** (Funnel chart)
  - Stage 1: Productos escaneados (450 escaneos)
  - Stage 2: Agregados al carrito (280 - 62% conversión)
  - Stage 3: Llegaron al checkout (220 - 79% conversión)
  - Stage 4: Pagaron (180 - 82% conversión)
  - Filtros por fecha, categoría, hora del día
- **Tab 2: Carritos Abandonados**
  - Tabla con carritos que no llegaron al pago
  - Razones: NO_STOCK, HIGH_PRICE, UNKNOWN
  - Top productos abandonados
- **Tab 3: Heatmap de Productos**
  - Productos más escaneados vs productos más comprados
  - Insight: Detectar fricciones en el funnel
- **Export:** CSV/PDF de reportes

#### **4.3 Gestión de Productos + QR Generator (1 día)**
- **CRUD completo de productos** (mock data en MVP)
- **Generación masiva de QR codes:**
  - Biblioteca `qrcode` para generar códigos
  - **Análisis de implementación:** Cómo se generan los QR en base al stock del sitio
  - Los QR deben contener: SKU del producto + storeId
  - **Export PDF para impresión** (jspdf)
    - Láminas con grid de QR + nombre producto + SKU
    - Formato listo para imprimir y pegar en productos de muestra
- **Búsqueda y filtros avanzados**
- **Nota crítica:** Los QR son impresos y pegados físicamente en productos

#### **4.4 Configuración del Sistema (1 día)**
- **Datos del local:**
  - Nombre, dirección, logo, colores de marca
  - Horarios de atención (Lun-Vie 8-19hs)
  - Días no laborables (holidays)
- **Configuración de descuentos:**
  - Descuentos por cantidad bulk (ej: "Comprá 10 y ahorrá 15%")
  - Ofertas combinadas automáticas
- **Gestión de usuarios (mock):**
  - Lista de Pickers y Admins
  - Roles y permisos (simulados)
- **Multi-tenant:** Cada local tiene configuración aislada por storeId

**Criterios de Éxito:**
- ✅ Dashboard con datos en tiempo real (simulados)
- ✅ Generación de QR codes funcional
- ✅ Charts interactivos
- ✅ UI profesional desktop-first

**Referencia:** `/docs/FRONTEND-ROADMAP.md` - Phase 4 (pendiente de documentar)

---

### ⏳ FASE 5: Polish & Testing (2-3 días)

**Estado:** 🔴 NO INICIADO  
**Prioridad:** 🟡 BAJA

**Tareas:**
- Animaciones finales (micro-interactions)
- Loading skeletons
- Error boundaries
- Responsive testing en 5+ dispositivos
- Performance optimization
- Lighthouse audit (95+ score)
- Accesibilidad (WCAG AA)

---

### ⏳ FASE 6: Integración MercadoPago (3-4 días)

**Estado:** 🔴 NO INICIADO  
**Prioridad:** 🟢 POST-MVP

**Tareas:**
- Server Actions para payment preferences
- Webhook handler
- Testing con Sandbox
- UI de estados de pago

**Referencia:** `/docs/BACKEND-ROADMAP.md` - Phase 1

---

### ⏳ FASE 7: Integración Tiendanube (4-5 días)

**Estado:** 🔴 NO INICIADO  
**Prioridad:** 🟢 POST-MVP

**Tareas:**
- TiendanubeAdapter class
- Sync de catálogo
- Creación de órdenes
- UI de configuración

**Referencia:** `/docs/BACKEND-ROADMAP.md` - Phase 2

---

### ⏳ FASE 8: PostgreSQL + Prisma (5-7 días)

**Estado:** 🔴 NO INICIADO  
**Prioridad:** 🟢 POST-MVP

**Tareas:**
- Schema completo (Store, Product, User, Order)
- Migrations
- Reemplazar localStorage por DB
- Server Actions con Prisma

**Referencia:** `/docs/BACKEND-ROADMAP.md` - Phase 3

---

### ⏳ FASE 9: Analytics & Tracking (3-4 días)

**Estado:** 🔴 NO INICIADO  
**Prioridad:** 🟢 FUTURO

**Tareas:**
- Event tracking (SCAN, ADD_TO_CART, PURCHASE)
- Dashboard real con Recharts
- Reportes exportables

**Referencia:** `/docs/BACKEND-ROADMAP.md` - Phase 4

---

### ⏳ FASE 10: SAP/VTEX Adapters (Futuro)

**Estado:** 🔴 NO INICIADO  
**Prioridad:** 🟢 ENTERPRISE

**Tareas:**
- Factory Pattern para adapters
- SAP Service Layer integration
- VTEX API integration

**Referencia:** `/docs/BACKEND-ROADMAP.md` - Phase 5

---

## � ESTADO ACTUAL (13 Enero 2026)

### ✅ Completado
- Documentación completa (context, roadmaps)
- Arquitectura definida
- TypeScript interfaces diseñadas
- Mock data structure
- Integration strategy

### ⏳ En Progreso
- **NADA** - Esperando inicio de Fase 1

### 🔴 Bloqueadores
- **NINGUNO** - Ready to start

---

## 🎯 PRÓXIMOS PASOS INMEDIATOS

### **Acción 1: Completar FRONTEND-ROADMAP.md** (Estimado: 2-3h)
**Prioridad:** 🔴 ALTA

Escribir las fases faltantes:
- Phase 2.4: PDP con código React completo
- Phase 2.5: Carrito con ofertas dinámicas
- Phase 2.6: Checkout & Pago con MercadoPago mock
- Phase 2.7: Estado del Pedido con stepper
- Phase 2.8: Confirmación con QR y confetti
- Phase 3: Picker Desktop (3 pantallas)
- Phase 4: Admin Dashboard (4 pantallas)
- Phase 5: Polish & Testing

**Resultado:** Roadmap frontend 100% completo para copy-paste development

---

### **Acción 2: Inicializar Proyecto Next.js** (Estimado: 3-4h)

Una vez completado FRONTEND-ROADMAP.md:

```bash
# Seguir instrucciones exactas de /docs/FRONTEND-ROADMAP.md Phase 1
npx create-next-app@latest picky
npm install [todas las dependencias]
# Crear estructura de carpetas
# Copiar TypeScript interfaces
# Crear mock data
# Setup Zustand stores
```

**Resultado:** Proyecto corriendo en localhost:3000

---

### **Acción 3: Implementar Cliente Mobile** (Estimado: 12-15 días)

Seguir `/docs/FRONTEND-ROADMAP.md` Phase 2 al pie de la letra:
- Copiar componentes React completos
- Adaptar rutas Next.js
- Conectar con mock data
- Testear en mobile real

**Resultado:** 8 pantallas Cliente funcionando end-to-end

---

## 📝 NOTAS TÉCNICAS

### **Stack Tecnológico**
- **Framework:** Next.js 15+ (App Router, Turbopack)
- **Language:** TypeScript 5+ (strict mode)
- **UI Library:** Shadcn/UI + Tailwind CSS
- **State:** Zustand (global) + React Query (API simulation)
- **Animations:** Framer Motion
- **QR:** html5-qrcode / react-qr-reader
- **Charts:** Recharts (admin)
- **PDF:** jspdf + qrcode (QR generator)

### **Design System**
- **Colors:** Green primary (#22c55e), Blue secondary (#3b82f6), Orange accent (#f59e0b)
- **NO RED** (diferenciación de PedidosYa)
- **Mobile-First:** Todos los breakpoints desde 320px
- **Animations:** scan-pulse, slide-up, confetti

### **Persistencia MVP**
- **localStorage** para cart, orders, user sessions
- **BroadcastChannel** para sync entre tabs
- **No backend real** hasta Fase 6+

### **Integraciones Futuras**
1. MercadoPago Sandbox (Fase 6)
2. Tiendanube Dev API (Fase 7)
3. PostgreSQL + Prisma (Fase 8)
4. SAP Service Layer (Fase 10 - Enterprise)
5. VTEX API (Fase 10 - Enterprise)

---

## � CRITERIOS DE ÉXITO MVP

### **UX Metrics**
- ⏱️ Tiempo scan → carrito: < 5 segundos
- ⏱️ Tiempo checkout completo: < 2 minutos
- 📱 Mobile usability score: 95+
- ⭐ User satisfaction (mock): 4.5+/5

### **Technical Benchmarks**
- 🚀 Lighthouse Performance: 95+
- ♿ Accessibility Score: 90+
- 📦 Bundle size: < 500KB (initial)
- 📶 PWA installable: ✅

### **Business Validation**
- 🎯 Complete customer journey working
- 🎯 Picker workflow validated
- 🎯 Admin dashboard functional
- 🎯 Mock data realistic (50+ products)

---

## 📚 REFERENCIAS CLAVE

**Documentos Principales:**
- 📖 `/docs/context.md` - Visión y arquitectura completa
- 📖 `/docs/FRONTEND-ROADMAP.md` - Guía de implementación frontend
- 📖 `/docs/BACKEND-ROADMAP.md` - Estrategia de integraciones
- 📖 `/docs/middleware-tiendanube-sap.md` - Patrón de adaptadores
- 📖 `/docs/pages-prototype.md` - User flows detallados

**Inspiración:**
- 🎨 PedidosYa (UX/UI sin color rojo)
- 🏗️ MediCore (arquitectura profesional de referencia)

---

## ✨ VISIÓN A LARGO PLAZO

**Q1 2026 (MVP):**
- Frontend-First funcional
- Mock data realistic
- Demo para inversores/clientes

**Q2 2026 (Production):**
- Integraciones reales (MercadoPago + Tiendanube)
- PostgreSQL + Analytics
- 5-10 clientes piloto

**Q3-Q4 2026 (Scale):**
- SAP/VTEX adapters (Enterprise)
- Multi-tenant production
- 50+ clientes activos

---

**🎯 FOCO INMEDIATO:** Completar `/docs/FRONTEND-ROADMAP.md` (Phases 2.4-5) para tener roadmap 100% completo antes de inicializar proyecto.
- Multi-tenant isolation tests
- RLS verification

### **4. UI Polish (3-4h)** 🟡 MEDIA
- Chat typing indicator
- Loading states
- Empty states
- Error boundaries

### **5. Performance (3-4h)** 🟡 MEDIA
- Lighthouse audit
- Bundle optimization
- Accessibility scan

**Total FASE 4:** 20-25 horas (~3-4 días)

---

## 🚀 FASE 5: POST-MVP (Opcional)

### **Comunicaciones Externas (10-12h)**
- Email (Resend)
- WhatsApp (Twilio)
- SMS (Twilio)
- Recordatorios automáticos (Vercel Cron)

### **Suscripciones SaaS (20-30h)**
- Panel Owner (/owner/*)
- Panel Subscriber (/subscriber/*)
- Stripe integration
- Usage tracking
- Plans management

### **Features Adicionales**
- Telemedicina (video calls)
- Integración laboratorios
- App móvil (React Native)
- Reportes avanzados (BI)

---

## 📊 RESUMEN DE FASES

| Fase | Estado | Tiempo | Progreso |
|------|--------|--------|----------|
| **FASE 1** - Setup | ✅ Completo | - | 100% |
| **FASE 2** - Core Features | ✅ Completo | - | 100% |
| **FASE 3** - Advanced Features | ✅ Completo | - | 100% |
| **FASE 4** - MVP Final | ⏳ En Progreso | 20-25h | 0% |
| **FASE 5** - Post-MVP | ⏳ Planeado | 30-40h | 0% |

---

## 🎯 DECISIONES TÉCNICAS CLAVE

### **Multi-Tenant Strategy**
- ✅ Application-level filtering (implementado)
- ✅ React Query cache isolation (implementado)
- ⏳ RLS Policies (planeado FASE 4)
- ❌ NO usar set_config (problemas: PgBouncer, latencia, memory)

### **Seguridad**
- ✅ NextAuth v5 con roles
- ✅ Unique constraints: `@@unique([dni, customerId])`
- ✅ Email normalizado (toLowerCase)
- ⏳ RLS doble capa (FASE 4)

### **Performance**
- ✅ Prisma singleton client
- ✅ React Query (5min stale time)
- ✅ Índices DB optimizados
- ✅ Compatible PgBouncer

---

**Paneles:**
- ⏳ `/owner/*` - Panel de Owner (dashboard, customers, subscriptions)
- ⏳ `/subscriber/*` - Panel de Subscriber (dashboard, users, billing)
- ⏳ `/perfil/[id]` - Perfiles diferenciados por rol
- ⏳ `/configuracion` - Acceso restringido a SUBSCRIBER/ADMIN
- ⏳ `/roles` - Gestión de usuarios (límite por plan)

**Server Actions:**
- ⏳ subscription-actions.ts (get, update, cancel, applyCoupon)
- ⏳ owner-actions.ts (getAllCustomers, suspendCustomer, createTester, stats)
- ⏳ notification-actions.ts (infraestructura)
- ⏳ chat-actions.ts (infraestructura)
- ⏳ communication-actions.ts (infraestructura)

**Infraestructura de Módulos (Schema Ready):**
- ⏳ Notificaciones (Realtime + Push)
- ⏳ Chat Interno (ChatRoom, ChatMessage, ChatMember)
- ⏳ Comunicaciones (WhatsApp, Email, SMS con templates)
- ⏳ Recordatorios (ReminderRule, ScheduledReminder)
- ⏳ Reportes (Report, AnalyticsSnapshot)

**Componentes UI:**
- ⏳ ModuleGuard (bloquear módulos por plan)
- ⏳ PlanBadge (indicador visual de plan)
- ⏳ UsageLimits (barra de progreso usuarios/storage)
- ⏳ UpgradePrompt (CTA para upgrade)

**Testing:**
- ⏳ Crear cuenta tester completa
- ⏳ E2E: Panel Owner
- ⏳ E2E: Panel Subscriber
- ⏳ E2E: Módulos bloqueados
- ⏳ E2E: Límites de usuarios

**Objetivo Final:** Cliente tester con acceso multi-tenant funcional (4 roles) antes de fin de año
