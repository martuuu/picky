# Plan de Implementación Inmediata

## Objetivos Iniciales
Configurar el entorno de desarrollo y establecer la arquitectura base del proyecto para comenzar la construcción de los componentes visuales enfocados en la experiencia de un **Corralón Inteligente**.

## Pasos

### 1. Inicialización del Proyecto
- [x] Ejecutar `create-next-app` con TypeScript, Tailwind, ESLint.
- [x] Configurar alias de rutas (`@/*`).
- [x] Instalar dependencias clave: `framer-motion`, `lucide-react`, `clsx`, `tailwind-merge`, `sonner`, `zustand`.
- [x] Configurar Tailwind con colores y fuentes del diseño de Picky.
- [x] Configurar Supabase y Prisma para la persistencia.

### {
14: "id": "p-1",
15: "sku": "PIN-LAT-01",
16: "name": "Látex Interior Profesional",
17: "category": "Pinturas",
18: "price": 45900,
19: "originalPrice": 52000,
// ...
}

### 2. Análisis y Porting de Diseños (Stitch -> React)
Vamos a procesar las pantallas clave. Para cada una:
1.  Analizar `screen.png` y `code.html`.
2.  Extraer colores y tokens de diseño.
3.  Crear componentes UI atómicos (Botones, Cards, Inputs).
4.  Ensamblar la página.

**Pantallas Prioritarias (Cliente):**
- [x] `welcome_to_picky_experience` (Revertido a Corralón)
- [x] `smart_scanner_interface_1` (Scanner UI con Cart Badge)
- [x] `product_catalog_browse` (Catálogo de Materiales)
- [x] `product_detailed_view` (Detalle de Producto optimizado para Densidad de Información)
- [x] `virtual_smart_cart` (Carrito)
- [x] `checkout` (Flujo de Pago Standard)
- [x] `confirmation` (Confirmación de Compra)

**Pantallas Staff/Admin:**
- [x] `picker_order_management` (Gestión de Pedidos)
- [x] `order_picking_checklist` (Lista de selección para Picker)
- [x] `admin_analytics` (Dashboard de métricas)

### 3. Estructura de Datos (Mocks & DB)
- [x] Definir interfaces TypeScript para `Product`, `Order`, `Category`.
- [x] Crear datos mock completos en `src/lib/data.ts`.
- [ ] Implementar Seeding robusto en Supabase con datos de Corralón.

### 4. Refinamiento Estético
- [x] Implementar Custom Alerts mejorados (Picky Smarts).
- [x] Asegurar uniformidad del light theme.
- [x] Optimizar vistas de detalle de producto.
