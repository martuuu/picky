# 🛒 Picky - Smart In-Store Shopping

**Sistema Scan & Go para tiendas físicas** (Corralones, Bazares, Ferreterías, Mayoristas)

MVP Prototipo - Frontend First con Mock Data + localStorage

---

## 📊 Estado del Proyecto

**Progreso:** � **35% Completado** (6/17 pantallas)  
**Última Actualización:** 13 Enero 2026 - 21:30 hs  
**Servidor:** 🟢 Corriendo en http://localhost:3000

### ✅ Completado (6 pantallas)
- ✅ Setup inicial completo (Next.js 16.1.1 + TypeScript 5 + Shadcn/UI)
- ✅ 16 componentes UI instalados
- ✅ Zustand stores (Cart + User) con persist middleware
- ✅ TypeScript interfaces completas (5 archivos)
- ✅ Mock data (20 productos bazar, 6 categorías, 2 tiendas)
- ✅ **Landing Principal** - Home con selector de portales
- ✅ **Store Landing** - Bienvenida + inicialización de sesión
- ✅ **Catálogo** - Grid 2 col + búsqueda + filtros
- ✅ **Scanner QR** - Con simulador + input manual
- ✅ **Product Detail Page** - Completa con ofertas
- ✅ **Carrito** - Gestión completa + ofertas dinámicas

### 🚧 En Desarrollo
- **Checkout & Pago** (PRÓXIMO 🎯) - Simulación MercadoPago

### ⏳ Próximo
- Estado del Pedido (real-time tracking)
- Confirmación de Retiro
- Modal Ofertas Combinadas
- Picker Portal (Kanban)
- Admin Dashboard

---

## 🚀 Quick Start

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Abrir en navegador
open http://localhost:3000
```

---

## 📱 Pantallas del MVP (17 total)

### 👤 Cliente Mobile (10 pantallas) - 60% Completado
1. ✅ **Landing Principal** - `/` - Selector de portales
2. ✅ **Landing Tienda** - `/tienda/[storeId]` - Bienvenida personalizada
3. ✅ **Escáner QR** - `/tienda/[storeId]/escanear` - Con simulador + input manual
4. ✅ **Catálogo** - `/tienda/[storeId]/catalogo` - Búsqueda + filtros + grid
5. ✅ **Product Detail** - `/tienda/[storeId]/producto/[sku]` - Completa con ofertas
6. ✅ **Carrito** - `/tienda/[storeId]/carrito` - Gestión completa + resumen
7. ⏳ **Checkout** - `/tienda/[storeId]/checkout` - **PRÓXIMO**
8. ⏳ **Estado Pedido** - `/tienda/[storeId]/pedido/[orderId]` - Real-time tracking
9. ⏳ **Confirmación** - `/tienda/[storeId]/confirmacion` - QR retiro + feedback
10. ⏳ **Modal Ofertas** - Popup automático bottom-sheet

### 📦 Picker Desktop (3 pantallas) - 0% Completado
11. ⏳ **Kanban de Pedidos** - `/picker`
12. ⏳ **Modal Detalle Picking** - `/picker/pedido/[orderId]`
13. ⏳ **Escaneo QR Retiro** - `/picker/retiro`

### 📊 Admin Dashboard (4 pantallas) - 0% Completado
14. ⏳ **Dashboard Principal** - `/admin`
15. ⏳ **Analytics Avanzado** - `/admin/analytics`
16. ⏳ **Gestión Productos + QR** - `/admin/productos`
17. ⏳ **Configuración** - `/admin/configuracion`

---

## 🏗️ Arquitectura

```
picky/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # ✅ Landing Principal
│   │   ├── providers.tsx      # ✅ React Query + Toaster
│   │   ├── tienda/[storeId]/
│   │   │   ├── page.tsx       # ✅ Store Landing
│   │   │   ├── catalogo/      # ✅ Catálogo
│   │   │   ├── escanear/      # ✅ QR Scanner
│   │   │   ├── producto/[sku]/# ✅ PDP
│   │   │   ├── carrito/       # ✅ Cart
│   │   │   ├── checkout/      # ⏳ Checkout (PRÓXIMO)
│   │   │   ├── pedido/[id]/   # ⏳ Order Status
│   │   │   └── confirmacion/  # ⏳ Confirmation
│   │   ├── picker/            # ⏳ Picker Views
│   │   └── admin/             # ⏳ Admin Dashboard
│   ├── components/
│   │   ├── ui/                # ✅ 16 Shadcn components
│   │   ├── cliente/           # Cliente-specific components
│   │   ├── picker/            # Picker-specific components
│   │   └── admin/             # Admin-specific components
│   ├── stores/
│   │   ├── useCartStore.ts    # ✅ Zustand cart with persist
│   │   └── useUserStore.ts    # ✅ Zustand user/session
│   ├── types/                 # ✅ 5 TypeScript interfaces
│   │   ├── product.ts
│   │   ├── cart.ts
│   │   ├── order.ts
│   │   ├── user.ts
│   │   └── analytics.ts
│   ├── data/                  # ✅ Mock Data
│   │   ├── mock-products.json # 10 productos
│   │   ├── mock-categories.json # 6 categorías
│   │   └── mock-stores.json   # 2 tiendas
│   └── lib/
│       ├── utils.ts           # ✅ Helpers (formatPrice, formatDate)
│       ├── api/               # Mock API Layer (futuro)
│       └── adapters/          # Tiendanube/SAP adapters (futuro)
└── docs/                      # 📝 Documentación completa
    ├── plan.md               # Plan maestro actualizado
    ├── context.md            # Visión del proyecto
    ├── frontend-roadmap.md   # Roadmap detallado
    └── backend-roadmap.md    # Integraciones futuras
```

---

## 🎨 Stack Tecnológico

### Frontend
- **Framework:** Next.js 16.1.1 (App Router + Turbopack)
- **Lenguaje:** TypeScript 5
- **UI:** Shadcn/UI + Tailwind CSS 4
- **Icons:** Lucide React
- **Animaciones:** Framer Motion
- **State:** Zustand con persist middleware
- **Data Fetching:** React Query
- **QR:** html5-qrcode + qrcode

### Backend (Simulado en MVP)
- **Mock Data:** JSON estáticos
- **Persistencia:** localStorage
- **Latencia artificial:** 300-500ms con setTimeout

---

## 📦 Dependencias Instaladas

```json
{
  "dependencies": {
    "@radix-ui/*": "Componentes primitivos de Shadcn",
    "@tanstack/react-query": "^5.90.16",
    "zustand": "^5.0.10",
    "framer-motion": "^12.26.2",
    "html5-qrcode": "^2.3.8",
    "qrcode": "^1.5.4",
    "jspdf": "^4.0.0",
    "recharts": "^3.6.0",
    "date-fns": "^4.1.0",
    "lucide-react": "^0.562.0",
    "sonner": "^2.0.7"
  }
}
```

---

## 🎯 Filosofía del MVP

**"Frontend-First con Mock Data"**

- ✅ Deploy ultra rápido (solo frontend estático)
- ✅ Costo $0 de infraestructura
- ✅ Validación de UX/UI sin complejidad backend
- ✅ Cambios rápidos sin migraciones de DB
- ✅ Demo funcional para inversores/clientes

**Post-MVP:** Integración con MercadoPago → Tiendanube → SAP/VTEX

---

## 📝 Scripts Disponibles

```bash
npm run dev     # Servidor de desarrollo (http://localhost:3000)
npm run build   # Build de producción
npm run start   # Servidor de producción
npm run lint    # Linter ESLint
```

---

## 🎨 Inspiración UI

**PedidosYa** (sin color rojo)
- Cards limpios y espaciados
- Tabs horizontales para categorías
- Badges de cantidad en carrito
- Colores: Verde (#16a34a) y Azul (#2563eb)

---

## 📚 Documentación

Ver `/docs/` para documentación detallada:
- **plan.md** - Roadmap maestro con progreso actualizado
- **context.md** - Visión completa del proyecto
- **frontend-roadmap.md** - Fases de desarrollo detalladas
- **backend-roadmap.md** - Integraciones post-MVP

---

## 🚀 Próximos Pasos

1. **Catálogo de Productos** (1.5 días)
   - Grid de productos con búsqueda
   - Tabs de categorías
   - ProductCard reutilizable

2. **Escáner QR** (1 día)
   - Integración html5-qrcode
   - Permisos de cámara
   - Redirección automática a PDP

3. **Product Detail Page** (2-3 días)
   - Carousel de imágenes
   - Selector de cantidad
   - Modal de ofertas combinadas

---

## 👥 Equipo

**Desarrollador Senior:** Implementando MVP Frontend-First

---

## 📄 Licencia

Proyecto privado - Todos los derechos reservados © 2026
