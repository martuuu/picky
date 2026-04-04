# Contexto del Proyecto: Picky — Plataforma de Retail Inteligente

## 1. Visión y Propósito

**Picky** es una plataforma de "Smart Shopping" (Scan & Go) orientada inicialmente a Corralones y tiendas físicas de gran volumen, expansible a cualquier formato de retail moderno.

Transforma la experiencia de compra física eliminando filas: los usuarios ingresan a la tienda, escanean códigos QR de productos con su teléfono, arman un carrito digital in-store, aplican descuentos y abonan desde el dispositivo. El personal (Pickers) prepara el pedido y lo entrega en mostrador, locker o drive-thru.

**Core Experience:**
- **Cliente:** Mobile-first desde el navegador. UI oscura premium, escaneo real de QR con cámara, pagos con animación, pantalla de retiro con QR gigante.
- **Staff (Picker):** Kanban de órdenes, checklist de items por pasillo/estante, historial, y vista de carritos en vivo pre-compra.
- **Admin:** Panel de inventario con toggle TiendaNube, generación masiva de QR en A4 para impresión física.

---

## 2. Estado Actual del Sistema (Abril 2026)

### Arquitectura de Datos
- **Persistencia local:** Zustand `persist` con `localStorage` (keys: `picky-orders-storage`, `picky-cart-storage`).
- **Sync cross-tab (mismo browser):** `window.addEventListener('storage', ...)` → `store.persist.rehydrate()`.
- **Sync cross-device (mismo deployment):** API relay en memoria — `/api/sync/orders` y `/api/sync/cart` — Map global en Node.js con TTL. Polling cada 2-3s desde clientes.
- **Producción (futuro):** Supabase Realtime reemplaza el relay. TODOs marcados en cada archivo relevante.

### Flujo de Orden Completo (end-to-end funcional)
```
Cliente escanea QR → agrega al carrito → checkout (datos + método pago)
  → /checkout/processing (animación por método: MP/Efectivo/Débito NFC)
  → orden creada en PAYING → PENDING → picker la ve en Kanban
  → picker "Toma Pedido" (PICKING) → checklist de items → READY
  → cliente ve QR gigante en /confirmation
  → picker escanea QR → DELIVERED → "Gracias por tu compra"
```

### Integraciones Reales
- **TiendaNube REST API:** OAuth, fetch de productos, mapeo a formato Picky (`tiendanubeMapper.ts`), toggle en `/store`.
- **ZXing (`@zxing/browser`):** Lectura real de QR con cámara del dispositivo en `/scan`.
- **`qrcode.react`:** Generación de QR `picky://product/<SKU>` en `/admin/qrs`.

### Rutas Implementadas

| Ruta | Descripción |
|------|-------------|
| `/` | Home / landing |
| `/scan` | Scanner con cámara real (ZXing) + strip de productos táctil |
| `/product/[id]` | Detalle de producto con variantes, specs, reviews, cross-sell |
| `/checkout` | Form en 2 pasos: entrega + pago |
| `/checkout/processing` | Pasarela simulada animada (por método de pago) |
| `/confirmation` | Estado de orden en tiempo real + QR de retiro |
| `/picker` | Kanban (Pendientes / En Proceso / Listos) con sync cross-device |
| `/picker/[orderId]` | Checklist de items por pasillo para el picker |
| `/picker/history` | Historial DELIVERED/CANCELLED con filtros, sort, paginación |
| `/picker/carts` | Carritos en Vivo — tabla expandible de carritos activos pre-compra |
| `/store` | Admin: inventario + toggle TiendaNube + QR por producto |
| `/admin` | Dashboard analytics |
| `/admin/qrs` | Grilla A4 4×4 de QR labels para impresión física |
| `/arrepentimiento` | Botón de arrepentimiento legal |

### Archivos Clave

| Archivo | Responsabilidad |
|---------|----------------|
| `src/stores/useOrderStore.ts` | Store de órdenes: CRUD, seed demo, sync relay, cross-tab |
| `src/stores/useCartStore.ts` | Store de carrito: pricing, sync relay cross-device |
| `src/app/api/sync/orders/route.ts` | Relay de órdenes (GET/POST/DELETE) |
| `src/app/api/sync/cart/route.ts` | Relay de carritos (GET/POST) |
| `src/app/checkout/processing/page.tsx` | Pasarela de pago simulada animada |
| `src/app/picker/carts/page.tsx` | Vista de carritos en vivo para el picker |
| `src/lib/tiendanubeMapper.ts` | Mapeo TiendaNube API → Product interno |
| `src/lib/tiendanube.ts` | Cliente TiendaNube (usa tipos de tiendanubeMapper) |
| `src/app/api/tiendanube/products/route.ts` | API route: fetch productos TN, cache 60s |
| `docs/supabase-schema.sql` | Schema v2: enums, RLS, Realtime notes, seed data |

---

## 3. Stack Tecnológico

- **Frontend:** Next.js 16 App Router, React 18, TypeScript, Tailwind CSS v4
- **Animaciones:** Framer Motion — `layoutId`/`LayoutGroup` para vuelo de cards, `AnimatePresence initial={false}` para evitar flash de rehidratación
- **Estado:** Zustand v5 con `persist` middleware
- **QR:** `@zxing/browser` (lectura), `qrcode.react` (generación)
- **Icons:** Lucide React
- **Toasts:** Sonner + PickyAlert custom
- **Despliegue:** Vercel

---

## 4. Filosofía de Desarrollo & UX

- **Mobile First:** El flujo del consumidor es 100% mobile. El picker puede ser tablet o desktop.
- **Diseño Premium:** Glassmorphism sutil, gradientes `gradient-purple-pink` / `gradient-purple-orange` para CTAs. No grises planos.
- **Sin backend propio:** Todo corre en Next.js API Routes + localStorage + relay en memoria. Supabase es el siguiente paso natural.
- **TODOs como hoja de ruta:** Cada decisión de arquitectura temporal tiene un `// TODO (Supabase):` con instrucciones explícitas para la migración.
