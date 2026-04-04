# Plan y Estado de la Plataforma — Picky (Abril 2026)

Este documento centraliza todos los hitos completados y los próximos pasos hacia la versión productiva.

---

## ✅ Completado — Sesiones 1–3 (Setup, Branding, Consumer Flow)

### Fundamentos
- Next.js 16 App Router + Tailwind CSS v4 + TypeScript
- Dark mode forzado en el cliente (`forcedTheme="dark"`)
- Zustand con `persist` para cart y orders en localStorage
- Branding de 3 colores: Violeta `#8b5cf6`, Rosa `#ec4899`, Naranja `#f59e0b`
- Más de 12 combinaciones de gradientes custom en Tailwind config

### Consumer Flow (Mobile)
- **`/`** — Home/landing con animación de orbes
- **`/scan`** — Scanner con ZXing (`@zxing/browser`): lectura real de QR via cámara + strip horizontal scrollable para selección táctil
- **`/product/[id]`** — Detalle enriquecido: galería, variantes, specs, reviews, cross-sell "Antes de Comprar", comparativa con competidores
- **`/checkout`** — Form 2 pasos (entrega + pago). Métodos: Mostrador, Locker, Picky Car, Envío + MercadoPago, Efectivo (−15%), Débito
- **`/confirmation`** — Polling de estado + QR gigante al llegar a READY

### Auth
- Flujo de login social (Google, Apple) con modales y estados unificados

---

## ✅ Completado — Sesión 4 (Picker + Admin + QR)

### Picker Flow
- **`/picker`** — Kanban 3 columnas: Pendientes / En Proceso / Listos
  - Cards con prioridad (A Tiempo / Urgente / Riesgo de Atraso)
  - Animación de vuelo de cards entre columnas (`layoutId` + `LayoutGroup`)
  - `AnimatePresence initial={false}` — elimina flash de rehidratación de Zustand
  - Board siempre renderizado (empty state interno) — sin flashes al navegar
  - Sync cross-tab via `storage` event → `persist.rehydrate()`
- **`/picker/[orderId]`** — Checklist de items: imagen, nombre, SKU, zona en tienda, toggle picked
- **`/picker/history`** — Historial DELIVERED/CANCELLED: búsqueda, filtros, sort por fecha/total, paginación (10/pág), stats bar

### Admin
- **`/admin`** — Dashboard analytics
- **`/admin/qrs`** — Grilla A4 4×4 de QR labels (`picky://product/<SKU>`) para impresión física. Toggle TiendaNube para usar productos reales.
- **`/store`** — Inventario con toggle TiendaNube, filtros, QR modal por producto, KPIs

### Infraestructura
- `docs/supabase-schema.sql` v2: enums PostgreSQL, RLS policies, Realtime notes, seed data
- `.env.example` con todas las variables necesarias

---

## ✅ Completado — Sesión 5 (Bugfixes + Payment + Cross-Device Sync)

### Bugfixes
- **`useMemo` en `/store`** — `products` faltaba en el array de deps; TiendaNube no actualizaba la tabla al cargar
- **`TiendaNubeProduct` types** — `tiendanube.ts` importa el tipo desde `tiendanubeMapper.ts` (una sola fuente de verdad, error TS eliminado)
- **`seedDemoOrders`** — Genera IDs aleatorios frescos en cada llamada (re-seed funciona siempre, incluso tras DELIVERED). Retorna count → toast "N Órdenes Cargadas"

### Pasarela de Pagos Simulada
- **`/checkout/processing`** — Pantalla fullscreen animada entre checkout y confirmation
  - MercadoPago: 4 pasos (Verificando datos → Procesando → Autenticación 3DS → Aprobado)
  - Efectivo: 3 pasos (Verificando → Generando código → Reserva confirmada)
  - Débito: 4 pasos (Verificando → Conectando POS → Esperando NFC → Aprobado)
  - Animación spring en icono, spinner ring, barra de progreso, dots
  - Orden creada en `PAYING` → processing la avanza a `PENDING` al finalizar
  - `// TODO (TiendaNube):` con pasos para integrar TN Checkout API real

### Cross-Device Sync — API Relay
- **`/api/sync/cart`** (GET/POST) — Relay de carritos en memoria
  - Consumer pushea snapshot en cada mutación (fire-and-forget)
  - Session ID estable por browser (`picky-session-id` en localStorage)
  - TTL 30 min por sesión
- **`/api/sync/orders`** (GET/POST/DELETE) — Relay de órdenes en memoria
  - Cada mutación del store pushea la orden actualizada
  - Picker y consumer pollan cada 2-3s y mergean por `updatedAt` más reciente
  - TTL 2 horas por orden
- `globalThis.__pickyCartRelay` / `__pickyOrderRelay` — sobrevive hot-reload en dev
- `// TODO (Supabase):` en cada relay con instrucciones exactas de migración

### Carritos en Vivo
- **`/picker/carts`** — Página dedicada de Órdenes Inteligentes pre-compra
  - Tabla expandible: sesión, cantidad de items, thumbnails, total, tiempo desde última act.
  - Fila expandida: detalle completo con imagen, SKU, marca, cantidad, precio unitario, subtotal
  - KPIs: carritos activos, total unidades en curso, valor estimado acumulado
  - Ordenamiento por Hora / Items / Total (toggle asc/desc)
  - Auto-refresh cada 2s + timestamp de última actualización
  - Dot pulsante "En vivo" en el header
- Nav del picker (desktop + mobile) apunta a `/picker/carts`

---

## 🔜 Próximos Pasos — Producción

### Prioridad Alta
1. **Supabase Realtime** — Reemplazar relay en memoria + localStorage:
   - Tablas: `orders`, `carts` (ver `docs/supabase-schema.sql` v2)
   - Picker: `supabase.channel('orders').on('postgres_changes', ...)`
   - Consumer cart: upsert en cada mutación de `useCartStore`
   - Plan gratuito: ~200 conexiones. Para producción con múltiples scanners → Pro $25/mo

2. **TiendaNube Checkout API** — Reemplazar pasarela simulada:
   - `POST /v1/{store_id}/orders` → URL de checkout TN
   - Webhook callback → actualiza status en Picky
   - Ver `// TODO (TiendaNube)` en `/checkout/processing/page.tsx`

3. **Autenticación real** — Login con Google/Apple operativo (actualmente UI only)

### Prioridad Media
4. **Seeding completo desde TiendaNube** — Eliminar `lib/data.ts` mock en favor de `getTiendaNubeProducts()` como fuente única de verdad
5. **Zona en producto** — UI en `/store/[id]` para que el admin asigne `zone` a productos TiendaNube (actualmente `undefined` para productos TN)
6. **Drag & Drop en Kanban** — Mover cards entre columnas arrastrando (base ya preparada con `layoutId`)
7. **Multi-branch** — Agregar `storeId`/`branchId` a órdenes (ver `// TODO (Supabase)` en `useOrderStore.ts`)

### Prioridad Baja
8. **Confetti / sonido en READY** — Notificación en `/confirmation` cuando el estado sube a READY
9. **Escaneo QR en hand-off** — Picker escanea QR del cliente para marcar DELIVERED (actualmente es botón manual)
10. **Analytics reales** — Conectar `/admin` con datos de Supabase en vez de valores hardcoded

---

## Arquitectura de Sync — Resumen

```
Hoy (demo)                    Producción
─────────────────────────────────────────────────────
localStorage           →      Supabase orders table
/api/sync/orders       →      supabase.channel('orders')
/api/sync/cart         →      supabase.channel('carts')
polling cada 2-3s      →      push en tiempo real
TTL en memoria         →      persistencia real en DB
```

Todos los puntos de migración están marcados como `// TODO (Supabase):` en el código con instrucciones exactas.
