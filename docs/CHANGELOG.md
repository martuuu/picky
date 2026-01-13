# 📝 CHANGELOG - Picky

## [14 Enero 2026 - 01:45 hs] - Bug Fix: Cámara QR Scanner

### 🐛 Bug Fix
- **Issue:** Cámara permanecía activa después de escaneo exitoso
- **Root Cause:** Scanner no se detenía al detectar código QR
- **Solution:** 
  - Agregado `scanner.stop()` y `scanner.clear()` en callback de éxito
  - Agregado flag `scannerStoppedRef` para prevenir múltiples callbacks
  - Cámara ahora se apaga automáticamente después de escaneo exitoso

### 📁 Files Modified
- `/src/components/cliente/QRScanner.tsx` - Agregado stop/clear en onScanSuccess
- `/src/app/tienda/[storeId]/escanear/page.tsx` - Agregado useRef para control de estado

### ✅ Validation
- Cámara se apaga correctamente después de escaneo
- DevTools ya no muestra cámara activa después de redirección
- Prevención de múltiples callbacks simultáneos

---

## [14 Enero 2026 - 01:30 hs] - Portal Cliente CASI COMPLETO 🎉

### ✨ Enhancements - Estado del Pedido

#### Ofertas del Bar (40% OFF)
- **Combo 1:** Café + Medialunas - ~~$2.500~~ → **$1.500** (40% OFF)
- **Combo 2:** Capuccino + Brownie - ~~$3.200~~ → **$1.920** (40% OFF)
- Grid responsive 2 columnas con cards blancas
- Badges visuales con porcentaje de descuento
- Instrucción: "Mostrá este pedido en el bar para aplicar el descuento"
- Gradiente amber/orange para destacar ofertas de café

#### Sugerencia de Playground para Niños
- Card separada con gradiente blue/cyan
- Ícono Sparkles para llamar la atención familiar
- Mensaje: "¿Venís con niños? Visitá nuestro Patio de Recreación con juegos y área segura"
- Ubicación clara: "📍 Planta baja - Sector izquierdo"
- Diseño family-friendly para mejorar experiencia de familias

#### UX Improvements
- **Tiempo extendido en PREPARING:** 20s → 40s (más tiempo para leer ofertas)
- Ofertas solo visibles durante estado PREPARING
- Cross-sell estratégico con productos del bar
- Atención a segmento familiar (kids playground)

### 🗑️ Documentation Cleanup
- ❌ Eliminado: `/docs/TESTING-GUIDE.md` (guía temporal de testing)
- ❌ Eliminado: `/docs/SESION-13-ENERO-CHECKOUT.md` (documentación de sesión temporal)

### 📄 Documentation Updates
- ✅ **PROGRESS.md**: Actualizado a 53% completado, Cliente Mobile @ 90%
- ✅ **frontend-roadmap.md**: Marcadas pantallas 7-9 como completadas, Fase 3 como próxima prioridad
- ✅ **plan.md**: Actualizado objetivo inmediato a Portal Picker Desktop

---

## [13 Enero 2026 - 23:00 hs] - Checkout Flow COMPLETO

### ✅ New Features - Complete Customer Journey

#### Checkout & Pago (`/checkout`)
- Formulario de datos con validación inline (nombre requerido, teléfono 10 dígitos)
- Selección de método de pago (MercadoPago / Tarjeta)
- Resumen colapsable con Accordion
- Tiempo estimado dinámico de preparación
- Sticky footer con total y botón "Pagar ahora"
- Loading states durante procesamiento
- Generación de Order con orderNumber (PK-XXXXXX)
- Persistencia en localStorage
- Clear cart automático post-pago
- Vibración + toast de éxito
- Redirección automática a Estado del Pedido

#### Estado del Pedido (`/pedido/[orderId]`)
- Sistema de estados: PAID → PREPARING → READY_FOR_PICKUP → COMPLETED
- Auto-polling cada 3 segundos para updates
- Auto-transiciones: PAID→PREPARING (3s), PREPARING→READY (20s inicialmente, luego 40s)
- Progress bar animado (0% → 33% → 66% → 100%)
- Status card destacada con íconos y colores dinámicos
- Timeline vertical con historial de cambios
- Información de tienda con ubicación y teléfono
- Detalle completo del pedido con thumbnails
- CTA "Ver QR de retiro" cuando está READY
- Vibración intensa cuando pedido está listo [200,100,200,100,200]

#### Confirmación de Retiro (`/confirmacion`)
- Animación de confetti (30 partículas, 3 segundos)
- Generación de QR Code (300x300px) con datos del pedido
- Download QR como PNG (filename: Picky-PK-XXXXXX.png)
- Web Share API con fallback a clipboard
- Ícono CheckCircle con animación scale pulse
- Instrucciones claras de retiro
- Botón "Volver a comprar"

### 🐛 Bug Fixes
- **Critical:** Checkout file corruption resolved (file became empty)
  - Recreated entire page.tsx (448 lines)
  - Verified compilation and server response (200 OK)
- **Minor:** Fixed React purity violations in confetti animation
  - Changed from Math.random() to deterministic positioning: `left: ${i*3.33%}%`
- **Minor:** Fixed TypeScript 'any' type in statusHistory callback
  - Added explicit type annotation: `(h: { to: string }) => h.to === 'PREPARING'`

### 📊 Progress Update
- **Completion:** 35% → 53% (6 pantallas → 9 pantallas)
- **Cliente Mobile:** 60% → 90% (6/10 → 9/10)
- **Remaining:** Solo falta Modal Ofertas para completar Cliente Mobile

---

## Tech Stack

**Framework:**
- Next.js 16.1.1 (App Router, Turbopack)
- TypeScript 5 (strict mode)
- React 19

**UI & Styling:**
- Shadcn/UI (16 components)
- Tailwind CSS 4
- Lucide React (icons)
- Framer Motion (animations)

**State Management:**
- Zustand 5 with persist middleware
- localStorage for orders, cart, sessions

**QR Technology:**
- html5-qrcode (scanning)
- qrcode library (generation)
- jspdf (download)

**Design System:**
- Mobile-first approach
- Primary: Green #10b981
- Secondary: Blue #3b82f6
- Warning: Yellow #eab308
- Amber gradients for promotions
- Blue gradients for family content

**Key Features:**
- Auto-polling (3-second intervals)
- Haptic feedback (Vibration API)
- Web Share API with fallback
- Confetti animations
- Progress bars with smooth transitions
- Toast notifications (Sonner)

---

## Next Steps 🎯

### Immediate Priority: Portal Picker Desktop (Fase 3)
1. **Kanban de Pedidos** - Drag & drop con @dnd-kit
2. **Modal Detalle** - Edición de estado + notas
3. **Escaneo QR Retiro** - Validación con camera

### Future: Admin Dashboard (Fase 4)
1. **Dashboard Analytics** - Charts con Recharts
2. **Generación QR Masiva** - Bulk QR generation
3. **Gestión Productos** - CRUD completo
4. **Configuración** - Settings de tienda

### Cliente Mobile - Final Touch
10. **Modal Ofertas Combinadas** - Bottom sheet automático (último pendiente)

---

## User Feedback 💬

> "Toda la parte del portal del cliente quedo EXCELENTE 🔥🔥"  
> — Cliente, 13 Enero 2026

---

**Maintained by:** Picky Development Team  
**Project Status:** 🚀 53% MVP Complete - Ready for Picker Portal  
**Server:** 🟢 http://localhost:3000
