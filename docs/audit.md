# Auditoría — Resuelto (Abril 2026)

> Este documento registra la auditoría técnica realizada en Sesión 5. Todos los ítems fueron implementados.
> Ver estado actualizado en `plan-improved.md` y `context.md`.

---

## Ítem 1 — Carritos en Vivo para el Picker ✅
**Problema:** El picker no tenía visibilidad del carrito del consumidor pre-compra.

**Solución implementada:**
- Hook `useLiveCart` en `/picker/page.tsx`: lee `/api/sync/cart` relay (cross-device) con fallback a `picky-cart-storage` localStorage
- Nueva página `/picker/carts` con tabla expandible, KPIs, ordenamiento por hora/items/total, auto-refresh 2s
- Nav del picker (desktop + mobile) navega a `/picker/carts`
- `// TODO (Supabase):` en `useCartStore.ts` y `useLiveCart` con instrucciones de migración

---

## Ítem 2 — Demo MacBook + Celular ✅
**Problema:** localStorage no se comparte entre dispositivos; picker en Vercel veía todo vacío.

**Solución implementada:**
- `/api/sync/orders` — relay GET/POST/DELETE, Map en `globalThis`, TTL 2h
- `/api/sync/cart` — relay GET/POST, Map en `globalThis`, TTL 30min
- `useOrderStore` pushea cada mutación al relay y pollea cada 3s para mergear
- `useCartStore` pushea cada mutación al relay via `syncCartToRelay` fire-and-forget
- Merge por `updatedAt` más reciente (el dato más nuevo gana)

---

## Ítem 3 — Pasarela de Pagos Simulada ✅
**Problema:** El checkout tenía un `setTimeout(2000)` sin pantalla intermedia.

**Solución implementada:**
- `/checkout/processing` — pantalla fullscreen animada con pasos por método de pago
- MercadoPago (4 pasos), Efectivo (3 pasos + código de reserva), Débito/NFC (4 pasos)
- Orden se crea en `PAYING` → processing la avanza a `PENDING` al finalizar
- `// TODO (TiendaNube):` con pasos exactos para integrar TN Checkout API

---

## Ítem 4 — seedDemoOrders no daba feedback ✅
**Problema:** IDs fijos causaban silent no-ops al re-seedear después de órdenes DELIVERED.

**Solución implementada:**
- Genera IDs aleatorios frescos (`generateOrderId()`) en cada llamada
- Retorna `count` de órdenes agregadas
- Picker muestra toast: "N Órdenes Cargadas — Datos demo listos en el Kanban"

---

## Ítem 5 — Órdenes Inteligentes / Carritos en Vivo ✅
**Problema:** No existía una sección para pre-visualizar carritos activos pre-compra.

**Solución implementada:** Ver Ítem 1 + nueva página `/picker/carts`.

---

## Ítem 6 — Store: TiendaNube no mostraba productos en la tabla ✅
**Problema 1:** `useMemo` en `store/page.tsx` no incluía `products` en sus dependencias.
**Problema 2:** `TiendaNubeProduct` definido dos veces con tipos distintos → error TS2345.

**Solución implementada:**
- `useMemo` deps: `[products, search, filterCategory, filterBrand, filterStock]`
- `tiendanube.ts` importa `TiendaNubeProduct` desde `tiendanubeMapper.ts` (una sola fuente)
