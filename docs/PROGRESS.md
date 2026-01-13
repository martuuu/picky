# 📊 PICKY - Progress Tracker

**Última Actualización:** 14 Enero 2026 - 01:30 hs  
**Estado General:** 🚀 **53% Completado** (9/17 pantallas)  
**Servidor:** 🟢 http://localhost:3000

---

## 🎯 RESUMEN EJECUTIVO

| Fase | Progreso | Pantallas | Estado |
|------|----------|-----------|--------|
| **Setup Inicial** | 100% | - | ✅ Completo |
| **Cliente Mobile** | 90% | 9/10 | 🎉 Casi Completo |
| **Picker Desktop** | 0% | 0/3 | ⏳ Pendiente |
| **Admin Dashboard** | 0% | 0/4 | ⏳ Pendiente |

**Total General:** 9/17 pantallas = **53% completado**ess Tracker

**Última Actualización:** 13 Enero 2026 - 23:00 hs  
**Estado General:** � **53% Completado** (9/17 pantallas)  
**Servidor:** 🟢 http://localhost:3000

---

## 🎯 RESUMEN EJECUTIVO

| Fase | Progreso | Pantallas | Estado |
|------|----------|-----------|--------|
| **Setup Inicial** | 100% | - | ✅ Completo |
| **Cliente Mobile** | 90% | 9/10 | � Casi Completo |
| **Picker Desktop** | 0% | 0/3 | ⏳ Pendiente |
| **Admin Dashboard** | 0% | 0/4 | ⏳ Pendiente |

**Total General:** 9/17 pantallas = **53% completado**

---

## ✅ FASE 1: SETUP INICIAL (100%)

### Infraestructura Base
- ✅ Next.js 16.1.1 con TypeScript 5
- ✅ App Router configurado
- ✅ Tailwind CSS 4 + Shadcn/UI
- ✅ 16 componentes UI instalados (Button, Card, Input, Badge, Dialog, Sheet, Toast, Tabs, Accordion, Select, Checkbox, Separator, Skeleton, Avatar, Progress, Dropdown)

### Estado & Data
- ✅ Zustand stores con persist middleware
  - `useCartStore` - Gestión completa del carrito
  - `useUserStore` - Sesiones anónimas con TTL
- ✅ React Query configurado
- ✅ Mock Data completo:
  - 20 productos bazar (con imágenes locales)
  - 6 categorías (Cocina, Limpieza, Decoración, Organización, Textil, Iluminación)
  - 2 tiendas demo (Bazar Casa Bella, Bazar Don José)

### TypeScript Interfaces
- ✅ `Product`, `BulkDiscount`, `Category`
- ✅ `Cart`, `CartItem`
- ✅ `Order`, `OrderItem`, `OrderStatus`
- ✅ `User`, `Store`, `Session`
- ✅ `Analytics`, `AbandonedCart`

---

## 🟡 FASE 2: CLIENTE MOBILE (60% - 6/10)

### ✅ Pantallas Completadas

#### 1. **Landing Principal** (`/page.tsx`)
**Funcionalidad:**
- Selector de portales (Cliente / Picker / Admin)
- Branding y descripción del proyecto
- Navegación a diferentes experiencias

**Features Implementadas:**
- ✅ Layout responsive mobile-first
- ✅ Botones de navegación con iconos
- ✅ Hero section con descripción

---

#### 2. **Landing Tienda** (`/tienda/[storeId]/page.tsx`)
**Funcionalidad:**
- Bienvenida personalizada por tienda
- Inicialización de sesión + carrito
- Acceso rápido a funciones principales

**Features Implementadas:**
- ✅ Detección de storeId desde URL
- ✅ Carga de datos desde mock-stores.json
- ✅ Inicialización automática de Zustand stores
- ✅ Badge de cantidad de items en carrito
- ✅ Botones: Escanear / Ver Carrito / Ver Catálogo
- ✅ Información de horarios y ubicación
- ✅ Loading state + error handling

---

#### 3. **Catálogo de Productos** (`/tienda/[storeId]/catalogo/page.tsx`)
**Funcionalidad:**
- Búsqueda en tiempo real
- Filtros por categoría
- Grid de productos con información clave

**Features Implementadas:**
- ✅ Search bar con debounce + clear button
- ✅ Tabs horizontales por categoría (scroll horizontal)
- ✅ Grid responsivo 2 columnas mobile
- ✅ **ProductCard component** completo:
  - Imagen con aspect ratio 1:1
  - Badge de descuento (% OFF)
  - Badge de cantidad en carrito
  - Badge de stock bajo ("Quedan X")
  - Overlay "Sin stock" cuando stock = 0
  - Bulk discount label ("💰 Comprá 10 y ahorrá 15%")
  - Botón "+" para agregar rápido al carrito
  - Click en card → Navega a PDP
- ✅ Toast notification al agregar (con action "Ver carrito")
- ✅ Floating cart button con badge
- ✅ Empty state cuando no hay resultados
- ✅ Loading skeleton con delay artificial
- ✅ Helper `parseProducts()` para parsear fechas del JSON

---

#### 4. **Escáner QR** (`/tienda/[storeId]/escanear/page.tsx`)
**Funcionalidad:**
- Escaneo de códigos QR con cámara
- Modo simulación para demos
- Input manual para testing

**Features Implementadas:**
- ✅ Scanner real con `html5-qrcode`
- ✅ Permisos de cámara con manejo de errores
- ✅ ⚡ **Botón "Simular Escaneo"** (producto random para demos)
- ✅ ⌨️ **Input manual de código** (acepta cualquier SKU sin validación)
- ✅ Fallback: botón "Ver catálogo completo"
- ✅ Vibración + toast al escanear exitoso
- ✅ Quick access buttons con SKUs de ejemplo
- ✅ Manejo silencioso de errores de cámara
- ✅ Redirección automática a PDP tras escaneo

**EXTRAS:**
- 🎁 Modo demo sin necesidad de QR físicos
- 🎁 Input manual para desarrolladores
- 🎁 Quick access con productos populares

---

#### 5. **Product Detail Page (PDP)** (`/tienda/[storeId]/producto/[sku]/page.tsx`)
**Funcionalidad:**
- Vista completa del producto
- Selector de cantidad con validación
- Ofertas y productos relacionados

**Features Implementadas:**
- ✅ Carousel de imágenes con dots indicator
- ✅ Precio destacado + badge de descuento
- ✅ Selector de cantidad con validación de stock
- ✅ Accordion de especificaciones técnicas
- ✅ Campo de observaciones del cliente (textarea)
- ✅ Related products carousel clickeable
- ✅ Ofertas por cantidad (bulkDiscounts) con cards verdes
- ✅ Integración completa con carrito Zustand
- ✅ Animación al agregar al carrito
- ✅ Toast success con vibración
- ✅ Navegación a carrito o continuar comprando
- ✅ Loading state mientras carga producto
- ✅ Error handling si SKU no existe

---

#### 6. **Carrito de Compras** (`/tienda/[storeId]/carrito/page.tsx`)
**Funcionalidad:**
- Gestión completa del carrito
- Edición de cantidades
- Resumen de compra

**Features Implementadas:**
- ✅ Lista de items con thumbnails + nombre + precio
- ✅ Edición inline de cantidades con stepper (+/-)
- ✅ Eliminación de items con undo toast (3 segundos)
- ✅ Validación de productos válidos (filter)
- ✅ Resumen de totales:
  - Subtotal
  - Descuentos aplicados (en verde)
  - Badge "¡Ahorraste $X!"
  - Total a pagar (destacado)
- ✅ Ofertas dinámicas relacionadas (carousel inferior)
- ✅ Stepper de progreso (Carrito → Pago → Confirmación)
- ✅ Botón "Ir a Pagar" con animación pulse
- ✅ Empty state con ilustración + CTA al catálogo
- ✅ Floating header con resumen
- ✅ Responsive mobile-first

---

### ✅ Pantallas Completadas (NUEVAS)

#### 7. **Checkout & Pago** (`/tienda/[storeId]/checkout/page.tsx`) ✅
**Funcionalidad:**
- Formulario de datos del cliente con validación inline
- Selección de método de pago (MercadoPago / Tarjeta)
- Resumen colapsable del pedido
- Procesamiento simulado de pago

**Features Implementadas:**
- ✅ **Sección 1: Datos de Contacto**
  - Input nombre con validación (requerido)
  - Input teléfono con validación (10 dígitos)
  - Error messages inline con ícono AlertCircle
  - Auto-save en useUserStore
- ✅ **Sección 2: Método de Pago**
  - Opción MercadoPago (simulado)
  - Opción Tarjeta de Crédito/Débito
  - Selección visual con checkbox verde/azul
  - Banner informativo de "Demo Mode"
- ✅ **Tiempo Estimado de Preparación**
  - Cálculo dinámico (2 min/producto + 5 min base)
  - Card con gradiente verde-azul
  - Ícono de reloj
- ✅ **Resumen de Orden Colapsable**
  - Accordion con lista de productos
  - Thumbnails + nombre + qty × precio
  - Observaciones del cliente
  - Subtotal + Descuentos + Total
- ✅ **Sticky Footer con Total**
  - Total destacado en grande
  - Botón "Pagar ahora" verde con animación
  - Loading state con spinner
  - Texto "Procesando tu pago..." animado
- ✅ **Lógica de Pago Simulado**
  - Validación de form antes de proceder
  - Delay artificial 800-1500ms
  - Generación de Order con orderNumber (PK-XXXXXX)
  - Guardado en localStorage ('picky_orders')
  - Clear cart después de pago exitoso
  - Toast success + vibración
  - Redirección automática a Estado del Pedido (1.5s)
- ✅ **Edge Cases:**
  - Redirect si carrito vacío
  - Disabled state durante procesamiento
  - Error handling con toast

---

#### 8. **Estado del Pedido** (`/tienda/[storeId]/pedido/[orderId]/page.tsx`) ✅
**Funcionalidad:**
- Real-time tracking del estado del pedido
- Progreso visual con animaciones
- Historial de cambios de estado
- Detalles completos del pedido
- **✨ NUEVO: Ofertas del Bar y Sugerencias para Familias**

**Features Implementadas:**
- ✅ **Sistema de Estados**
  - PAID → PREPARING → READY_FOR_PICKUP → COMPLETED
  - Cada estado con ícono + color + descripción custom
  - Badge con color dinámico según status
- ✅ **Auto-Transiciones (Demo)**
  - PAID → PREPARING después de 3 segundos
  - PREPARING → READY después de **40 segundos** (extendido para mostrar ofertas)
  - Polling cada 3 segundos
  - Actualización de localStorage en tiempo real
- ✅ **Progress Bar Animado**
  - 0% → 33% → 66% → 100% según estado
  - Animación suave con interval
- ✅ **Status Card Destacada**
  - Ícono circular con color según estado
  - Título + descripción
  - Progress bar cuando está "PREPARING"
  - CTA "Ver QR de retiro" cuando está "READY"
  - Border verde pulsante cuando está listo
- ✅ **✨ NUEVO: Ofertas del Bar (40% OFF)**
  - Card con gradiente amber/orange durante estado PREPARING
  - **Combo 1:** Café + Medialunas - $1.500 (antes $2.500) - 40% OFF
  - **Combo 2:** Capuccino + Brownie - $1.920 (antes $3.200) - 40% OFF
  - Grid 2 columnas responsive
  - Instrucciones: "Mostrá este pedido en el bar para aplicar el descuento"
  - Badges visuales con porcentaje de descuento
  - Precios tachados vs precio final en verde
- ✅ **✨ NUEVO: Sugerencia de Playground para Niños**
  - Card separada con gradiente blue/cyan
  - Ícono Sparkles para llamar la atención
  - Texto: "¿Venís con niños? Visitá nuestro Patio de Recreación con juegos y área segura"
  - Ubicación: "📍 Planta baja - Sector izquierdo"
  - Diseño family-friendly
- ✅ **Información de la Tienda**
  - Dirección con ícono MapPin
  - Teléfono con ícono Phone
  - Instrucciones de retiro
- ✅ **Detalle del Pedido**
  - Lista completa de productos
  - Thumbnails + cantidad + precio unitario
  - Observaciones del cliente
  - Subtotal + Descuentos + Total destacado
- ✅ **Historial de Estados (Timeline)**
  - Vertical timeline con checkmarks verdes
  - Cada cambio de estado con timestamp
  - Notas adicionales si existen
- ✅ **Footer Condicional**
  - "Seguir comprando" cuando no está listo
  - Oculto cuando está READY (para ver CTA del QR)
- ✅ **Feedback Háptico**
  - Vibración fuerte cuando pedido está listo
  - Pattern: [200, 100, 200, 100, 200]
- ✅ **Loading & Error States**
  - Loader mientras carga orden
  - Empty state si no encuentra orden
  - Botón de fallback al catálogo

**UX Enhancements:**
- 🎁 Tiempo extendido en PREPARING (40s) para dar más visibilidad a las ofertas
- 🎁 Cross-sell estratégico con productos del bar
- 🎁 Atención a familias con niños (playground suggestion)
- 🎁 Diseño llamativo con gradientes diferenciados por tipo de sugerencia

---

#### 9. **Confirmación de Retiro** (`/tienda/[storeId]/confirmacion/page.tsx`) ✅
**Funcionalidad:**
- QR Code para validar retiro
- Resumen final del pedido
- Instrucciones de retiro
- Opciones de descarga/compartir

**Features Implementadas:**
- ✅ **Animación de Confetti**
  - 30 partículas de colores aleatorios
  - Animación de caída desde top
  - Duración 3 segundos
  - Rotación y fade out
  - Pure render (sin Math.random en render)
- ✅ **Success Header**
  - CheckCircle animado con scale pulse
  - Título "¡Pedido confirmado!"
  - Badge destacado con orderNumber
  - Border verde
- ✅ **QR Code Dinámico**
  - Generado con librería `qrcode`
  - Datos JSON: orderId + orderNumber + customerId + total
  - 300x300px con margin
  - Shadow y border elegante
  - Card centrada con padding
- ✅ **Botones de Acción QR**
  - Descargar QR (download as PNG)
  - Compartir QR (Web Share API con fallback a clipboard)
  - Toast feedback en cada acción
- ✅ **Resumen del Pedido**
  - Cliente + Teléfono
  - Cantidad de productos
  - Método de pago formateado
  - Total pagado en verde destacado
- ✅ **Instrucciones de Retiro**
  - Card azul con ícono Sparkles
  - Lista numerada paso a paso
  - Tipografía clara y legible
- ✅ **Punto de Retiro**
  - Nombre de tienda
  - Dirección completa
  - Horarios de atención
- ✅ **Sticky Footer**
  - Botón "Volver al inicio" verde
  - Redirección al catálogo de la tienda
  - Reminder de guardar QR
- ✅ **Animaciones CSS Inline**
  - @keyframes para confetti
  - @keyframes para scale del ícono
  - Smooth transitions
- ✅ **Edge Cases:**
  - Redirect si no hay orderId en query params
  - Loading state mientras genera QR
  - Manejo de error en QR generation

---

### ⏳ Pantallas Pendientes

#### 10. **Modal Ofertas Combinadas** (FALTA 1 PANTALLA CLIENTE)
**Estimación:** 4-6 horas

**Features a Implementar:**
- Stepper de estados (Recibido → En Preparación → Listo → Entregado)
- Tiempo estimado dinámico
- QR de retiro (grande, prominente)
- Notificación realtime cuando cambia a "Listo"
- Sonido 🔊 + vibración
- Confetti animation 🎉
- BroadcastChannel API para sync entre tabs
- Mensaje amigable de espera

---

#### 9. **Confirmación de Retiro**
**Estimación:** 1 día

**Features a Implementar:**
- Check animado ✅ con confetti
- Mensaje de agradecimiento
- Detalles del pedido completo
- QR de validación obligatorio
- Botón "Descargar Factura" (PDF)
- Feedback de experiencia (5 estrellas)
- Input comentarios opcional
- CTA "Iniciar Nueva Compra"

---

#### 10. **Modal Ofertas Combinadas**
**Estimación:** 1 día

**Features a Implementar:**
- Bottom sheet automático tras agregar al carrito
- Carousel de productos combinables
- Quick-add buttons
- Cierre manual o automático tras 5s
- Animación slide-up

---

## ⏳ FASE 3: PICKER DESKTOP (0% - 0/3)

### Pantallas Pendientes

#### 1. **Kanban de Pedidos**
- Columnas: A Preparar / En Preparación / Listos
- Drag & drop entre columnas
- Filtros por estado/fecha
- Contador de items por pedido

#### 2. **Modal Detalle de Pedido**
- Lista de items con ubicación en depósito
- Checkbox por item ("Pickeado")
- Timer de tiempo transcurrido
- Botón "Marcar como Listo"

#### 3. **Escaneo QR Retiro**
- Scanner para validar retiro
- Búsqueda manual por ID
- Confirmación de entrega
- Actualización realtime del estado

---

## ⏳ FASE 4: ADMIN DASHBOARD (0% - 0/4)

### Pantallas Pendientes

#### 1. **Dashboard / Analytics**
- KPIs principales (ventas, pedidos, conversión)
- Charts (Recharts):
  - Line: Ventas por hora
  - Bar: Top 10 productos
  - Funnel: Conversión scan → cart → purchase
- Filtros por fecha

#### 2. **Gestión de Productos**
- Tabla con búsqueda y filtros
- Edición inline de stock
- Toggle activar/desactivar
- Indicador de stock bajo

#### 3. **Generación de QR**
- Generación masiva de códigos QR
- PDF descargable con qrcode + jspdf
- Layout para imprimir (A4, múltiples QR por hoja)
- Preview antes de descargar

#### 4. **Configuración**
- Datos de la tienda
- Horarios de atención
- Integración con Tiendanube (futuro)
- API tokens

---

## 📈 MÉTRICAS DE PROGRESO

### Por Fase
```
Setup:    ████████████████████ 100% (Completo)
Cliente:  ████████████░░░░░░░░  60% (6/10 pantallas)
Picker:   ░░░░░░░░░░░░░░░░░░░░   0% (0/3 pantallas)
Admin:    ░░░░░░░░░░░░░░░░░░░░   0% (0/4 pantallas)
```

### General
```
Total:    ███████░░░░░░░░░░░░░  35% (6/17 pantallas)
```

---

## 🎯 SIGUIENTE PASO

**PRIORIDAD 1:** Completar Checkout & Pago  
**Ruta:** `/tienda/[storeId]/checkout/page.tsx`  
**Tiempo Estimado:** 2-3 días

**Features Clave:**
1. Form con validación (nombre, teléfono requeridos)
2. Resumen final de compra
3. Simulación MercadoPago (spinner 2s → éxito)
4. Creación de orden
5. Redirección a Estado del Pedido

**Archivos a Crear:**
- `src/app/tienda/[storeId]/checkout/page.tsx`
- `src/types/order.ts` (ampliar interfaces)
- `src/stores/useOrderStore.ts` (nuevo store)

---

## 🛠️ STACK TECNOLÓGICO ACTUAL

### Frontend
- **Framework:** Next.js 16.1.1
- **Lenguaje:** TypeScript 5
- **Styling:** Tailwind CSS 4 + Shadcn/UI
- **State:** Zustand 5 (con persist middleware)
- **Data Fetching:** React Query (sin usar aún, preparado)
- **Animations:** Framer Motion (listo para usar)
- **QR:** html5-qrcode

### Herramientas
- **Icons:** Lucide React
- **Toasts:** Sonner
- **Date Handling:** date-fns
- **Utils:** clsx, tailwind-merge

### Data Layer (Actual)
- **Persistencia:** localStorage vía Zustand persist
- **Mock Data:** JSON estáticos
- **Latencia Simulada:** setTimeout(500ms)

---

## 📝 NOTAS TÉCNICAS

### Decisiones de Arquitectura
1. **Mobile-First:** Todas las vistas Cliente diseñadas para 320px primero
2. **Imágenes Locales:** Cambiadas de Unsplash a `/public/images/productos/`
3. **Scanner con Fallbacks:** 3 modos (real, simulado, manual)
4. **Mock Data Realista:** 20 productos con specs completas
5. **TypeScript Estricto:** Cero `any` en producción

### Cambios Recientes
- ✅ Transformación de ferretería → bazar (13 Enero)
- ✅ Imágenes locales en lugar de Unsplash URLs
- ✅ Scanner con modo simulación + input manual
- ✅ Carrito con validación de items válidos

### Issues Resueltos
- ✅ Error de hostname Unsplash en next/image → Cambiado a imágenes locales
- ✅ Imports corruptos en escanear/page.tsx → Recreado archivo
- ✅ CartItem.product opcional → Agregado validItems filter
- ✅ Puerto 3000 bloqueado → Kill process + restart

---

## 🎉 HITOS ALCANZADOS

- ✅ **13 Enero 2026 - 18:00:** Setup completo + 2 pantallas
- ✅ **13 Enero 2026 - 20:00:** Catálogo completado
- ✅ **13 Enero 2026 - 21:00:** Scanner + PDP + Carrito completados
- ✅ **13 Enero 2026 - 21:30:** Imágenes locales funcionando + Docs actualizadas

---

**Próxima Actualización:** Tras completar Checkout & Pago
