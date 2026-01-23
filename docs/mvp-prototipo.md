# 📋 MVP Prototipo - Feedback Cliente & Roadmap de Desarrollo

**Fecha:** 23 Enero 2026  
**Proyecto:** Picky - Smart In-Store Shopping  
**Cliente:** Sector Mayorista (Corralones, Ferreterías, Bazares)  
**Estado Actual:** Prototipo MVP 100% Completo (24 pantallas con mock data)

---

## 🎯 PARTE 1: REQUERIMIENTOS Y AJUSTES DEL CLIENTE

### 1.1 Correcciones UX Críticas

#### **A. Flujo de Navegación Post-Scan**
**Problema Actual:** El botón "Seguir Comprando" en la página de producto no vuelve al scanner.

**Solución Requerida:**
- Modificar lógica de navegación en `/tienda/[storeId]/producto/[sku]/page.tsx`
- Botón "Seguir Comprando" → Redirigir a `/tienda/[storeId]/escanear`
- Mantener estado del carrito durante la navegación
- Agregar breadcrumb visual: Scanner → Producto → Scanner

**Estimación:** 2 horas

---

#### **B. Mandatory QR Scan en Entrada del Local**
**Problema Actual:** El acceso directo a la tienda no simula el requisito de escanear QR en la entrada.

**Solución Requerida:**
- **Nueva página:** `/tienda/[storeId]/entrada` (pantalla intermedia obligatoria)
- Flujo: Home → **QR Entry Scanner** → Store Landing → Scanner de Productos
- Validaciones:
  - QR de entrada contiene: `storeId`, `timestamp`, `entryPoint` (ej: "Entrada Principal")
  - Session flag en localStorage: `picky_entry_validated_${storeId}`
  - TTL de 24 horas (sesión expira al día siguiente)
- UX:
  - Pantalla full-screen con cámara
  - Animación de "Acceso Permitido" (checkmark verde)
  - Registro de entrada en analytics (hora, puerta, dispositivo)

**Archivos a Crear:**
- `src/app/tienda/[storeId]/entrada/page.tsx`
- `src/components/cliente/EntryQRScanner.tsx`

**Estimación:** 6 horas

---

#### **C. Eliminación del Catálogo**
**Problema Actual:** El catálogo web es redundante si el cliente está físicamente en la tienda.

**Solución Requerida:**
- **Eliminar:** Ruta `/tienda/[storeId]/catalogo`
- **Eliminar:** Botón de catálogo en Store Landing
- **Mantener solo:** Scanner QR como método principal de selección
- **Excepción:** Preservar búsqueda por SKU/nombre en el scanner (input manual)

**Archivos a Modificar:**
- Eliminar: `src/app/tienda/[storeId]/catalogo/page.tsx`
- Modificar: `src/app/tienda/[storeId]/page.tsx` (remover botón de catálogo)
- Actualizar: Navbar links y breadcrumbs

**Estimación:** 3 horas

---

### 1.2 Rediseño de Pantalla de Producto

#### **Cambios Visuales & Priorización de Info**

**Problema Actual:** Imagen grande innecesaria, falta de énfasis en datos comerciales críticos.

**Nueva Jerarquía Visual (Mobile First):**

```
┌─────────────────────────────────────┐
│ [←] PRODUCTO           🛒 (3)       │ ← Header sticky
├─────────────────────────────────────┤
│                                     │
│  📷 [Mini imagen] | SKU: ABC-123    │ ← Thumbnail pequeño (80x80px)
│                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                     │
│  🏷️ PRECIO                          │
│  $ 12.450                           │ ← Precio giant (text-4xl)
│  Antes: $15.000 (-17%) 💰           │ ← Tachado + badge descuento
│                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                     │
│  📦 CANTIDAD & MEDIDAS              │
│  • Presentación: Caja x 24 unid.   │
│  • Medidas: 30x20x15 cm            │
│  • Peso: 5.2 kg                    │
│  • Bulto: Mediano                  │
│                                     │
│  [- | 2 | +]  Stock: 145 unid.     │ ← Stepper grande
│                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                     │
│  🎁 OFERTAS & COMBOS                │
│  Llevá 6 cajas → 15% OFF           │
│  Llevá 12+ cajas → 25% OFF         │
│                                     │
│  🔗 COMPRÁ JUNTO CON:               │
│  [Producto A] [Producto B]         │ ← Carousel horizontal
│                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                     │
│  ⚖️ COMPARADOR DE PRECIOS           │
│  Este producto vs. similares       │
│  [Ver comparación →]               │
│                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                     │
│  📝 DESCRIPCIÓN CORTA               │
│  Texto breve del producto...       │
│                                     │
└─────────────────────────────────────┘
│ [Seguir Escaneando] [Agregar $XXX] │ ← Bottom bar fixed
└─────────────────────────────────────┘
```

**Elementos a Agregar:**
1. **Bultos & Packaging:**
   - Campo `bulkType` en Product interface: `'small' | 'medium' | 'large' | 'extra-large'`
   - Íconos visuales por tamaño
   - Peso y dimensiones destacados

2. **Comparador de Precios:**
   - Modal con tabla comparativa
   - Productos de la misma categoría
   - Columnas: Nombre, Precio/unidad, Precio/bulto, Ahorro%

3. **Ofertas por Volumen:**
   - Array `volumeDiscounts` en Product:
     ```typescript
     volumeDiscounts: [
       { minQty: 6, discount: 15 },
       { minQty: 12, discount: 25 },
     ]
     ```
   - Highlight automático al cambiar cantidad

4. **Observaciones del Producto:**
   - Mover a una sección colapsable (Accordion)
   - Ejemplo: "Requiere refrigeración", "Frágil - Manipular con cuidado"

**Archivos a Modificar:**
- `src/app/tienda/[storeId]/producto/[sku]/page.tsx` (rediseño completo)
- `src/types/product.ts` (agregar campos nuevos)
- `src/components/cliente/ProductComparator.tsx` (nuevo componente)
- Mock data: Agregar 40-50 productos mayoristas

**Estimación:** 16 horas

---

### 1.3 Simplificación del Flujo de Compra

#### **Nuevo Flujo Optimizado:**

```
QR Entrada → Scanner Productos → Agregar → [Loop Scanner] → Ir a Pagar → Resumen Pedido → Pago → QR Retiro
```

**Cambios Específicos:**

**A. Botón "Ir a Pagar" Floating (Siempre Visible)**
- Fixed bottom bar en todas las páginas post-entrada
- Muestra: `[🛒 3 productos | $45.230] [IR A PAGAR →]`
- Click → Lleva directo a nuevo "Resumen de Pedido"

**B. Nueva Página: "Resumen de Pedido" (Reemplazo de Carrito)**
- **Ruta:** `/tienda/[storeId]/resumen`
- **Contenido:**
  ```
  RESUMEN DE TU PEDIDO
  
  ┌─────────────────────────────┐
  │ Producto A  x3   $ 12.450   │
  │ Producto B  x1   $  8.200   │
  │ Producto C  x5   $ 24.580   │
  └─────────────────────────────┘
  
  Subtotal:        $ 45.230
  Descuentos:      -$ 2.500 💰
  ═══════════════════════════════
  TOTAL:           $ 42.730
  
  [Modificar Cantidades ↓]
  [Continuar a Pago →]
  [Productos relacionados →]
  ```

**C. Eliminar Páginas Innecesarias Post-Pago:**
- ❌ Eliminar: `/tienda/[storeId]/pedido/[orderId]` (tracking real-time)
- ❌ Eliminar: Info de tienda en confirmación
- ✅ Mantener SOLO: `/tienda/[storeId]/retiro` con QR grande y claro

**Archivos a Crear/Modificar:**
- Crear: `src/app/tienda/[storeId]/resumen/page.tsx`
- Modificar: `src/components/cliente/FloatingCheckoutBar.tsx` (nuevo)
- Eliminar: Código de tracking en `/pedido/[orderId]/page.tsx`
- Simplificar: `/confirmacion/page.tsx` → Solo QR + "Cómo Retirar"

**Estimación:** 12 horas

---

### 1.4 Métodos de Pago Adicionales

#### **Nuevas Opciones de Pago**

**Estado Actual:** Solo MercadoPago simulado.

**Requerimiento:**
1. **Efectivo en Caja:**
   - Genera orden "Pending Payment"
   - QR de pago en caja física
   - Staff marca como "Paid" en portal picker

2. **Pago en Caja con Tarjeta:**
   - Similar a efectivo
   - Terminal POS física (fuera del sistema Picky)

**Implementación:**

```typescript
type PaymentMethod = 
  | 'MERCADOPAGO'      // Pago online (actual)
  | 'CASH_AT_COUNTER'  // Efectivo en caja
  | 'CARD_AT_COUNTER'; // Tarjeta en caja física

// Nuevo flujo en checkout
if (method === 'CASH_AT_COUNTER' || method === 'CARD_AT_COUNTER') {
  // Generar orden con status: PENDING_PAYMENT
  // Mostrar QR de pago en caja
  // Picker Portal: Nueva columna "Esperando Pago"
}
```

**Archivos a Modificar:**
- `src/app/tienda/[storeId]/checkout/page.tsx` (agregar opciones)
- `src/app/picker/page.tsx` (nueva columna Kanban)
- `src/types/order.ts` (nuevos status)

**Estimación:** 8 horas

---

### 1.5 Sección de Arrepentidos & Quejas

#### **Nueva Funcionalidad: Customer Support**

**Ubicación:** Footer de todas las páginas cliente + Página dedicada

**Features:**
1. **Botón "¿Problemas con tu pedido?"** (Fixed bottom-left)
2. **Nueva página:** `/tienda/[storeId]/soporte`
3. **Formulario:**
   - Tipo de problema: [Producto incorrecto | Falta stock | Quiero cancelar | Otro]
   - Orden ID (autocompletado si tiene pedido activo)
   - Descripción (textarea)
   - Foto opcional (upload simulado)
   - Envío → Toast "Recibimos tu solicitud - Ticket #XXXX"

**Mock Backend:**
- Guardar en localStorage: `picky_support_tickets`
- Admin Dashboard: Nueva sección "Tickets de Soporte"

**Archivos a Crear:**
- `src/app/tienda/[storeId]/soporte/page.tsx`
- `src/components/cliente/SupportButton.tsx`
- `src/app/admin/soporte/page.tsx`

**Estimación:** 10 horas

---

### 1.6 Mejoras en Pantalla de Espera

#### **Nueva Experiencia "Waiting Room"**

**Problema Actual:** La espera mientras preparan el pedido es pasiva.

**Nuevas Features:**

**A. Mini-Encuesta de Experiencia (Opcional)**
```
┌──────────────────────────────────┐
│ Mientras esperás...              │
│                                  │
│ ¿Cómo fue tu experiencia Picky? │
│                                  │
│ 😍 😊 😐 😕 😞                    │
│                                  │
│ [Omitir] [Enviar →]              │
└──────────────────────────────────┘
```

**B. Ofertas Personalizadas Durante Espera**
- Carousel de productos que no llevó pero visitó
- "Clientes que compraron esto también llevaron..."
- Opcion de Desayuno o Merienda a mitad de precio, "Mientras esperas..." con opcion de pagarlo ahi mismo desde el celu

- Botón "Agregar al pedido actual" (si picker no empezó)

**C. Tiempo Estimado Dinámico**
- Cálculo real basado en:
  - Cantidad de productos en el pedido
  - Productos que requieren preparación especial
  - Cola actual de pedidos
- Barra de progreso animada
- Notificaciones push: "¡Tu pedido está listo!"

**Archivos a Modificar:**
- `src/app/tienda/[storeId]/pedido/[orderId]/page.tsx`
- `src/components/cliente/ExperienceSurvey.tsx` (nuevo)
- `src/components/cliente/WaitingRoomOffers.tsx` (nuevo)

**Estimación:** 14 horas

---

### 1.7 Portal Picker - Asignación de Pedidos

#### **Sistema de Asignación Manual y Automático**

**Features Requeridas:**

**A. Asignación Manual:**
- Click derecho en tarjeta de pedido → "Asignar a..."
- Lista de pickers disponibles
- Badge en card: "Asignado a: Juan P."

**B. Asignación Automática:**
- Toggle en Admin Config: "Auto-asignar pedidos"
- Algoritmos:
  1. **Round Robin:** Distribuir equitativamente
  2. **Menor Carga:** Asignar al picker con menos pedidos activos
  3. **Por Zona:** Picker especializado en departamento X
- Notificación al picker: Sound + Browser notification

**C. Reasignación:**
- Admin puede cambiar asignación en cualquier momento
- Historial de reasignaciones (para analytics)

**Archivos a Crear/Modificar:**
- Modificar: `src/app/picker/page.tsx` (agregar dropdown de asignación)
- Modificar: `src/stores/usePickerStore.ts` (lógica de asignación)
- Crear: `src/app/admin/configuracion/asignacion/page.tsx`

**Estimación:** 12 horas

---

### 1.8 Analytics Avanzados para el Negocio

#### **Nuevo Dashboard: "Insights del Cliente"**

**Métricas a Implementar:**

**A. Mapa de Calor del Recorrido**
```typescript
interface CustomerJourney {
  sessionId: string;
  storeId: string;
  entryTime: Date;
  exitTime: Date;
  scannedProducts: {
    sku: string;
    timestamp: Date;
    location?: string; // "Pasillo 3 - Estantería A"
  }[];
  purchasedProducts: string[];
  abandonedProducts: string[]; // Escaneó pero no compró
  dwellTime: {
    area: string;
    seconds: number;
  }[];
}
```

**B. Top 10 Productos Escaneados vs. Top 10 Comprados**
- Tabla comparativa
- Insight: "Aceite de Oliva es el #1 escaneado pero #5 en compras"
- Acción sugerida: Analizar precio o disponibilidad

**C. Productos Sin Stock (Histórico)**
- Contador de veces que se intentó escanear un producto sin stock
- Alert automático: "Tomate Triturado fue buscado 47 veces sin stock"

**D. Tiempo de Espera Promedio**
- Por horario del día
- Por cantidad de productos
- Meta: Mantener < 10 minutos

**E. Tasa de Abandono del Carrito**
- % de sesiones que agregaron productos pero no pagaron
- Razones (si completaron encuesta de abandono)

**Archivos a Crear:**
- `src/app/admin/insights/page.tsx` (nuevo dashboard)
- `src/components/admin/HeatmapChart.tsx`
- `src/components/admin/ScannedVsPurchased.tsx`
- `src/lib/analytics/customerJourney.ts`

**Estimación:** 20 horas

---

### 1.9 Productos Mayoristas - Expansión del Catálogo

#### **Nuevos Productos & Categorías**

**Requerimiento:** Mínimo 50-80 productos mayoristas reales.

**Nuevas Categorías:**
1. **Construcción & Ferretería**
   - Cemento, cal, yeso
   - Herramientas eléctricas
   - Bulonería y tornillería (por kilo)
   
2. **Electricidad**
   - Cables por rollo (50m, 100m)
   - Llaves, tomas, cajas
   
3. **Plomería**
   - Caños PVC (3", 4", 6")
   - Grifería y accesorios
   
4. **Pinturería**
   - Látex por balde (10L, 20L)
   - Esmaltes sintéticos
   
5. **Jardín & Exterior**
   - Mangueras por metro
   - Herramientas de jardín
   
6. **Limpieza Industrial**
   - Detergentes x 5L
   - Lavandina x 10L

**Características Especiales por Producto:**
- **Ventas por Bulto:** "Tornillos 1/4" - Caja x 100 unid."
- **Ventas por Metro:** "Cable Unipolar 2.5mm - Rollo 100m"
- **Ventas por Peso:** "Clavos Acero - Bolsa x 5kg"
- **Diferenciación de Tamaños:** 
  - Cemento: 25kg, 50kg
  - Baldes pintura: 4L, 10L, 20L

**Archivo a Actualizar:**
- `src/data/mock-products.json` (expandir a 60+ productos)
- `src/data/mock-categories.json` (agregar 6 categorías nuevas)

**Estimación:** 8 horas (investigación + carga de data)

---

## 📊 RESUMEN PARTE 1: ESTIMACIÓN DE AJUSTES

| # | Feature | Prioridad | Horas | Complejidad |
|---|---------|-----------|-------|-------------|
| 1.1.A | Fix navegación post-scan | Alta | 2h | Baja |
| 1.1.B | QR Entry Scanner | Alta | 6h | Media |
| 1.1.C | Eliminar catálogo | Media | 3h | Baja |
| 1.2 | Rediseño pantalla producto | Alta | 16h | Alta |
| 1.3 | Simplificar flujo compra | Alta | 12h | Media |
| 1.4 | Métodos pago adicionales | Media | 8h | Media |
| 1.5 | Sección soporte/arrepentidos | Baja | 10h | Media |
| 1.6 | Mejoras pantalla espera | Media | 14h | Media |
| 1.7 | Asignación pedidos picker | Alta | 12h | Media |
| 1.8 | Analytics avanzados | Baja | 20h | Alta |
| 1.9 | Expansión catálogo mayorista | Alta | 8h | Baja |
| **TOTAL PARTE 1** | | | **111 horas** | |

**Estimación en Semanas:** ~3 semanas (1 dev full-time)  
**Costo Argentina (2026):** $350.000 - $450.000 ARS (dev semi-senior)

---

## 🔌 PARTE 2: INTEGRACIÓN TIENDANUBE & SAP (PROTOTIPO)

### 2.1 Estrategia de Integración

#### **Objetivo:**
Crear un **prototipo funcional** que consuma APIs reales de Tiendanube y SAP en **modo desarrollo/sandbox**, evitando desarrollar backend completo hasta validar el producto final.

#### **Arquitectura Propuesta:**

```
┌─────────────────────────────────────────────────────────────┐
│                     PICKY FRONTEND                          │
│                   (Next.js App Router)                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              MIDDLEWARE LAYER (Next.js API Routes)          │
│                                                             │
│  /api/products/sync    → Sincroniza catálogo               │
│  /api/orders/create    → Crea orden en CRM                 │
│  /api/inventory/check  → Consulta stock real               │
│  /api/payments/webhook → Recibe notificaciones MP          │
└────────┬────────────────────────────────┬───────────────────┘
         │                                │
         ▼                                ▼
┌──────────────────┐            ┌──────────────────┐
│  TIENDANUBE API  │            │   SAP SERVICE    │
│   (REST/OAuth)   │            │   LAYER (OData)  │
│                  │            │                  │
│ - Productos      │            │ - Items          │
│ - Stock          │            │ - Stock          │
│ - Órdenes        │            │ - Orders         │
│ - Clientes       │            │ - BPs            │
└──────────────────┘            └──────────────────┘
```

---

### 2.2 Integración Tiendanube (Modo Desarrollo)

#### **A. Setup Inicial**

**Requisitos:**
1. Crear cuenta de desarrollo en [Tiendanube Partners](https://www.tiendanube.com/partners)
2. Obtener credenciales:
   - `TIENDANUBE_CLIENT_ID`
   - `TIENDANUBE_CLIENT_SECRET`
   - `TIENDANUBE_ACCESS_TOKEN` (via OAuth2)

**Instalación de Dependencias:**
```bash
npm install axios
npm install @types/node
```

**Configuración:**
```typescript
// lib/tiendanube/config.ts
import axios from 'axios';

const TIENDANUBE_API_URL = 'https://api.tiendanube.com/v1';
const STORE_ID = process.env.TIENDANUBE_STORE_ID; // ID de tienda demo

export const tiendanubeClient = axios.create({
  baseURL: `${TIENDANUBE_API_URL}/${STORE_ID}`,
  headers: {
    'Authentication': `bearer ${process.env.TIENDANUBE_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
    'User-Agent': 'Picky App (desarrollo@picky.app)',
  },
});
```

#### **B. Endpoints a Implementar**

**1. Sincronizar Productos (Read-Only)**

```typescript
// app/api/tiendanube/products/route.ts
import { NextResponse } from 'next/server';
import { tiendanubeClient } from '@/lib/tiendanube/config';

export async function GET() {
  try {
    const response = await tiendanubeClient.get('/products', {
      params: {
        per_page: 100,
        page: 1,
      },
    });

    // Mapear productos de Tiendanube a formato Picky
    const pickyProducts = response.data.map((tnProduct: any) => ({
      id: `TN-${tnProduct.id}`,
      sku: tnProduct.variants[0].sku,
      name: tnProduct.name.es, // o .pt según idioma
      description: tnProduct.description.es,
      price: parseFloat(tnProduct.variants[0].price),
      originalPrice: parseFloat(tnProduct.variants[0].compare_at_price) || null,
      stock: tnProduct.variants[0].stock,
      imageUrl: tnProduct.images[0]?.src || '/placeholder.png',
      categoryId: `CAT-${tnProduct.categories[0]?.id || 'general'}`,
      // Campos adicionales mayoristas
      bulkType: detectBulkType(tnProduct.weight), // helper function
      packaging: tnProduct.attributes.find(a => a.name === 'Packaging')?.value,
    }));

    return NextResponse.json({ products: pickyProducts });
  } catch (error: any) {
    console.error('Tiendanube API Error:', error.response?.data);
    return NextResponse.json(
      { error: 'Error al sincronizar productos' },
      { status: 500 }
    );
  }
}

// Helper: Detectar tipo de bulto según peso
function detectBulkType(weightKg: number) {
  if (weightKg < 2) return 'small';
  if (weightKg < 10) return 'medium';
  if (weightKg < 25) return 'large';
  return 'extra-large';
}
```

**2. Crear Orden en Tiendanube**

```typescript
// app/api/tiendanube/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { tiendanubeClient } from '@/lib/tiendanube/config';

export async function POST(req: NextRequest) {
  try {
    const pickyOrder = await req.json();

    const tiendanubeOrder = {
      note: `Pedido Picky - Scanner In-Store - ID: ${pickyOrder.id}`,
      customer: {
        name: pickyOrder.customerName,
        phone: pickyOrder.customerPhone,
        // email: pickyOrder.customerEmail, // opcional
      },
      products: pickyOrder.items.map((item: any) => ({
        variant_id: parseInt(item.product.sku.replace('TN-', '')),
        quantity: item.quantity,
        price: item.product.price.toString(),
      })),
      shipping: 'pickup', // Retiro en tienda
      payment_status: pickyOrder.paymentMethod === 'MERCADOPAGO' ? 'pending' : 'unpaid',
      status: 'open',
      gateway: pickyOrder.paymentMethod === 'MERCADOPAGO' ? 'mercadopago' : 'cash',
    };

    const response = await tiendanubeClient.post('/orders', tiendanubeOrder);

    return NextResponse.json({
      success: true,
      tiendanubeOrderId: response.data.id,
      message: 'Orden creada en Tiendanube',
    });
  } catch (error: any) {
    console.error('Error creando orden:', error.response?.data);
    return NextResponse.json(
      { error: 'Error al crear orden en Tiendanube' },
      { status: 500 }
    );
  }
}
```

**3. Consultar Stock en Tiempo Real**

```typescript
// app/api/tiendanube/stock/[sku]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { tiendanubeClient } from '@/lib/tiendanube/config';

export async function GET(
  req: NextRequest,
  { params }: { params: { sku: string } }
) {
  try {
    const variantId = params.sku.replace('TN-', '');
    
    const response = await tiendanubeClient.get(`/products/${variantId}`);
    const stock = response.data.variants[0].stock;

    return NextResponse.json({ sku: params.sku, stock });
  } catch (error) {
    return NextResponse.json(
      { error: 'SKU no encontrado' },
      { status: 404 }
    );
  }
}
```

#### **C. Integración en el Frontend**

**Modificar Zustand Store para Consumir API Real:**

```typescript
// stores/useProductStore.ts (nuevo)
import { create } from 'zustand';
import { Product } from '@/types/product';

interface ProductStore {
  products: Product[];
  loading: boolean;
  error: string | null;
  syncFromTiendanube: () => Promise<void>;
  checkStock: (sku: string) => Promise<number>;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  loading: false,
  error: null,

  syncFromTiendanube: async () => {
    set({ loading: true, error: null });
    
    try {
      const res = await fetch('/api/tiendanube/products');
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);
      
      set({ products: data.products, loading: false });
      
      // Guardar en localStorage como fallback
      localStorage.setItem('picky_products_cache', JSON.stringify(data.products));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      
      // Fallback a cache local
      const cached = localStorage.getItem('picky_products_cache');
      if (cached) {
        set({ products: JSON.parse(cached) });
      }
    }
  },

  checkStock: async (sku: string) => {
    try {
      const res = await fetch(`/api/tiendanube/stock/${sku}`);
      const data = await res.json();
      return data.stock;
    } catch {
      // Fallback: buscar en productos cargados
      const product = get().products.find(p => p.sku === sku);
      return product?.stock || 0;
    }
  },
}));
```

**Usar en Componentes:**

```typescript
// app/tienda/[storeId]/page.tsx
'use client';

import { useEffect } from 'react';
import { useProductStore } from '@/stores/useProductStore';

export default function StoreLandingPage() {
  const { syncFromTiendanube, loading } = useProductStore();

  useEffect(() => {
    // Sincronizar productos al entrar
    syncFromTiendanube();
  }, [syncFromTiendanube]);

  if (loading) {
    return <div>Sincronizando catálogo con Tiendanube...</div>;
  }

  // ... resto del componente
}
```

**Estimación Tiendanube:** 24 horas

---

### 2.3 Semi-Integración SAP Business One (Modo Desarrollo)

#### **A. Setup Inicial SAP Service Layer**

**Requisitos:**
1. Acceso a instancia SAP B1 de desarrollo (cloud o on-premise)
2. Service Layer habilitado (puerto 50000 por defecto)
3. Usuario con permisos de lectura/escritura en:
   - Items (Artículos)
   - BusinessPartners (Clientes)
   - Orders (Órdenes de venta)

**Configuración:**

```typescript
// lib/sap/config.ts
import axios from 'axios';

const SAP_SERVICE_LAYER_URL = process.env.SAP_SERVICE_LAYER_URL; // https://sap-server:50000/b1s/v1
const SAP_COMPANY_DB = process.env.SAP_COMPANY_DB; // Nombre de la BD
const SAP_USERNAME = process.env.SAP_USERNAME;
const SAP_PASSWORD = process.env.SAP_PASSWORD;

let sessionId: string | null = null;

// Login y obtener SessionID
export async function sapLogin() {
  if (sessionId) return sessionId;

  try {
    const response = await axios.post(
      `${SAP_SERVICE_LAYER_URL}/Login`,
      {
        CompanyDB: SAP_COMPANY_DB,
        UserName: SAP_USERNAME,
        Password: SAP_PASSWORD,
      },
      {
        httpsAgent: new (require('https').Agent)({
          rejectUnauthorized: false, // Solo para desarrollo
        }),
      }
    );

    sessionId = response.data.SessionId;
    return sessionId;
  } catch (error: any) {
    console.error('SAP Login Error:', error.response?.data);
    throw new Error('Error al conectar con SAP');
  }
}

// Cliente HTTP con sesión
export async function sapClient() {
  const session = await sapLogin();

  return axios.create({
    baseURL: SAP_SERVICE_LAYER_URL,
    headers: {
      'Cookie': `B1SESSION=${session}`,
      'Content-Type': 'application/json',
    },
    httpsAgent: new (require('https').Agent)({
      rejectUnauthorized: false,
    }),
  });
}
```

#### **B. Endpoints SAP a Implementar**

**1. Consultar Artículos (Items)**

```typescript
// app/api/sap/items/route.ts
import { NextResponse } from 'next/server';
import { sapClient } from '@/lib/sap/config';

export async function GET() {
  try {
    const client = await sapClient();

    // Consultar Items con stock disponible
    const response = await client.get('/Items', {
      params: {
        $select: 'ItemCode,ItemName,ItemPrices,QuantityOnStock,U_BulkType,U_Packaging',
        $filter: "QuantityOnStock gt 0 and Frozen eq 'N'",
        $top: 100,
      },
    });

    // Mapear a formato Picky
    const pickyProducts = response.data.value.map((item: any) => ({
      id: `SAP-${item.ItemCode}`,
      sku: item.ItemCode,
      name: item.ItemName,
      price: item.ItemPrices[0]?.Price || 0,
      stock: item.QuantityOnStock,
      bulkType: item.U_BulkType || 'medium',
      packaging: item.U_Packaging,
      // Imagen: SAP no suele tenerlas, usar placeholder
      imageUrl: `/api/sap/items/${item.ItemCode}/image`,
    }));

    return NextResponse.json({ products: pickyProducts });
  } catch (error: any) {
    console.error('SAP API Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Error al consultar artículos SAP' },
      { status: 500 }
    );
  }
}
```

**2. Crear Orden de Venta (Sales Order)**

```typescript
// app/api/sap/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sapClient } from '@/lib/sap/config';

export async function POST(req: NextRequest) {
  try {
    const pickyOrder = await req.json();
    const client = await sapClient();

    // Buscar o crear Business Partner (cliente)
    let bpCode = await findOrCreateBusinessPartner(client, pickyOrder.customerPhone);

    const sapOrder = {
      CardCode: bpCode,
      DocDate: new Date().toISOString().split('T')[0],
      DocDueDate: new Date().toISOString().split('T')[0],
      Comments: `Pedido Picky In-Store - ${pickyOrder.orderNumber}`,
      DocumentLines: pickyOrder.items.map((item: any, index: number) => ({
        LineNum: index,
        ItemCode: item.product.sku.replace('SAP-', ''),
        Quantity: item.quantity,
        UnitPrice: item.product.price,
      })),
      U_PaymentMethod: pickyOrder.paymentMethod, // Campo customizado
    };

    const response = await client.post('/Orders', sapOrder);

    return NextResponse.json({
      success: true,
      sapDocEntry: response.data.DocEntry,
      message: 'Orden creada en SAP Business One',
    });
  } catch (error: any) {
    console.error('SAP Order Creation Error:', error.response?.data);
    return NextResponse.json(
      { error: 'Error al crear orden en SAP' },
      { status: 500 }
    );
  }
}

// Helper: Buscar o crear cliente en SAP
async function findOrCreateBusinessPartner(client: any, phone: string) {
  try {
    // Buscar por teléfono (campo customizado U_Phone)
    const search = await client.get('/BusinessPartners', {
      params: {
        $filter: `U_Phone eq '${phone}'`,
        $select: 'CardCode',
      },
    });

    if (search.data.value.length > 0) {
      return search.data.value[0].CardCode;
    }

    // Crear nuevo BP
    const newBP = await client.post('/BusinessPartners', {
      CardCode: `CLI-${phone.slice(-6)}`,
      CardName: `Cliente Picky ${phone}`,
      CardType: 'cCustomer',
      Phone1: phone,
      U_Phone: phone,
    });

    return newBP.data.CardCode;
  } catch (error) {
    console.error('Error managing Business Partner:', error);
    throw error;
  }
}
```

**3. Actualizar Stock (Inventory Update)**

```typescript
// app/api/sap/stock/[itemCode]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sapClient } from '@/lib/sap/config';

export async function GET(
  req: NextRequest,
  { params }: { params: { itemCode: string } }
) {
  try {
    const client = await sapClient();
    
    const response = await client.get(`/Items('${params.itemCode}')`, {
      params: {
        $select: 'QuantityOnStock',
      },
    });

    return NextResponse.json({
      itemCode: params.itemCode,
      stock: response.data.QuantityOnStock,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Artículo no encontrado' },
      { status: 404 }
    );
  }
}
```

**Estimación SAP:** 32 horas (incluye setup de ambiente de desarrollo)

---

### 2.4 Abstracción Multi-Provider (Middleware Unificado)

#### **Objetivo:**
Que el frontend no sepa si está hablando con Tiendanube o SAP.

**Implementación:**

```typescript
// lib/inventory/provider.ts
export type InventoryProvider = 'TIENDANUBE' | 'SAP' | 'MOCK';

export interface IInventoryProvider {
  getProducts(): Promise<Product[]>;
  getProduct(sku: string): Promise<Product>;
  checkStock(sku: string): Promise<number>;
  createOrder(order: Order): Promise<{ success: boolean; externalId: string }>;
}

// Factory Pattern
export function getInventoryProvider(type: InventoryProvider): IInventoryProvider {
  switch (type) {
    case 'TIENDANUBE':
      return new TiendanubeProvider();
    case 'SAP':
      return new SAPProvider();
    case 'MOCK':
    default:
      return new MockProvider();
  }
}

// Implementaciones
class TiendanubeProvider implements IInventoryProvider {
  async getProducts() {
    const res = await fetch('/api/tiendanube/products');
    return res.json().then(d => d.products);
  }
  
  async checkStock(sku: string) {
    const res = await fetch(`/api/tiendanube/stock/${sku}`);
    return res.json().then(d => d.stock);
  }
  
  // ... más métodos
}

class SAPProvider implements IInventoryProvider {
  async getProducts() {
    const res = await fetch('/api/sap/items');
    return res.json().then(d => d.products);
  }
  
  // ... más métodos
}

class MockProvider implements IInventoryProvider {
  async getProducts() {
    return parseProducts(mockProducts.products);
  }
  
  // ... más métodos (actual sistema)
}
```

**Uso en Store:**

```typescript
// stores/useProductStore.ts
import { getInventoryProvider } from '@/lib/inventory/provider';

const provider = getInventoryProvider(
  process.env.NEXT_PUBLIC_INVENTORY_PROVIDER as any || 'MOCK'
);

export const useProductStore = create<ProductStore>((set) => ({
  // ...
  
  syncProducts: async () => {
    set({ loading: true });
    try {
      const products = await provider.getProducts();
      set({ products, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
```

**Configuración por Environment:**

```env
# .env.local (Desarrollo con mock)
NEXT_PUBLIC_INVENTORY_PROVIDER=MOCK

# .env.development (Testing con Tiendanube)
NEXT_PUBLIC_INVENTORY_PROVIDER=TIENDANUBE
TIENDANUBE_STORE_ID=123456
TIENDANUBE_ACCESS_TOKEN=xxxxx

# .env.production (Cliente real con SAP)
NEXT_PUBLIC_INVENTORY_PROVIDER=SAP
SAP_SERVICE_LAYER_URL=https://cliente-sap.com:50000/b1s/v1
SAP_COMPANY_DB=SBODEMO
SAP_USERNAME=manager
SAP_PASSWORD=xxxxx
```

**Estimación Middleware Unificado:** 16 horas

---

### 2.5 Testing & Validación de Integraciones

#### **Plan de Pruebas:**

**A. Tiendanube - Checklist de Validación:**
- [ ] Sincronización completa de catálogo (100+ productos)
- [ ] Imágenes cargadas correctamente
- [ ] Stock real vs. mock (comparativa)
- [ ] Creación de orden de prueba
- [ ] Webhook de pago MercadoPago → Actualiza estado en TN
- [ ] Manejo de errores (producto eliminado, sin stock, etc.)

**B. SAP - Checklist de Validación:**
- [ ] Conexión exitosa a Service Layer
- [ ] Query de Items con filtros complejos
- [ ] Creación de Business Partner automático
- [ ] Creación de Sales Order con múltiples líneas
- [ ] Actualización de stock en tiempo real
- [ ] Manejo de errores SAP (session timeout, permisos, etc.)

**C. Tests Automatizados (Opcional pero Recomendado):**

```typescript
// tests/integration/tiendanube.test.ts
import { describe, test, expect } from 'vitest';

describe('Tiendanube Integration', () => {
  test('should fetch products from API', async () => {
    const res = await fetch('http://localhost:3000/api/tiendanube/products');
    const data = await res.json();
    
    expect(data.products).toBeDefined();
    expect(data.products.length).toBeGreaterThan(0);
    expect(data.products[0]).toHaveProperty('sku');
  });

  test('should check stock for existing product', async () => {
    const res = await fetch('http://localhost:3000/api/tiendanube/stock/TN-12345');
    const data = await res.json();
    
    expect(data.stock).toBeTypeOf('number');
  });
});
```

**Instalación:**
```bash
npm install -D vitest @vitejs/plugin-react
```

**Estimación Testing:** 12 horas

---

## 📊 RESUMEN PARTE 2: ESTIMACIÓN DE INTEGRACIONES

| Feature | Horas | Complejidad |
|---------|-------|-------------|
| Setup Tiendanube + OAuth | 8h | Media |
| Endpoints Tiendanube (productos, órdenes, stock) | 16h | Media |
| Setup SAP Service Layer | 12h | Alta |
| Endpoints SAP (items, orders, BPs) | 20h | Alta |
| Middleware Unificado (Provider Abstraction) | 16h | Media |
| Testing & Validación | 12h | Media |
| **TOTAL PARTE 2** | **84 horas** | |

**Estimación en Semanas:** ~2.5 semanas (1 dev full-time)  
**Costo Argentina (2026):** $250.000 - $350.000 ARS

---

## 💰 PARTE 3: COSTOS TOTALES & ROADMAP COMPLETO

### 3.1 Estimación de Costos - Argentina 2026

#### **Tarifas de Referencia (Desarrollador Full-Stack):**

| Nivel | Tarifa/Hora | Mensual (160h) |
|-------|-------------|----------------|
| **Junior** | $1.500 - $2.000 | $240.000 - $320.000 |
| **Semi-Senior** | $2.500 - $3.500 | $400.000 - $560.000 |
| **Senior** | $4.000 - $6.000 | $640.000 - $960.000 |

#### **Costos del Prototipo (Ajustes + Integraciones):**

| Fase | Horas | Dev Level | Costo Estimado |
|------|-------|-----------|----------------|
| **Parte 1:** Ajustes del cliente | 111h | Semi-Senior | $277.500 - $388.500 |
| **Parte 2:** Integraciones | 84h | Senior | $336.000 - $504.000 |
| **Testing & QA** | 20h | Semi-Senior | $50.000 - $70.000 |
| **Documentación** | 10h | Semi-Senior | $25.000 - $35.000 |
| **TOTAL PROTOTIPO** | **225h** | | **$688.500 - $997.500** |

**Promedio:** ~$843.000 ARS (~5-6 semanas de desarrollo)

---

### 3.2 Costo de Sistema Final (Producción Completa)

#### **Componentes Adicionales Post-Prototipo:**

**A. Backend Real (Reemplazar localStorage):**
- Base de datos: PostgreSQL + Prisma ORM (20h)
- API REST completa con autenticación JWT (40h)
- Webhooks MercadoPago en producción (8h)
- Sistema de notificaciones push (16h)
- Manejo de sesiones y usuarios (12h)
- **Subtotal:** 96 horas

**B. Features Avanzadas:**
- PWA completa (service workers, offline mode) (24h)
- Geolocalización y mapas (Google Maps API) (16h)
- Sistema de cupones y descuentos dinámicos (20h)
- CRM integrado (gestión de clientes) (32h)
- Dashboard analytics real-time (WebSockets) (24h)
- Multi-tienda (arquitectura multi-tenant) (40h)
- **Subtotal:** 156 horas

**C. Infraestructura & DevOps:**
- Deploy en Vercel/Railway (Next.js + DB) (8h)
- CI/CD con GitHub Actions (6h)
- Monitoreo (Sentry + analytics) (8h)
- Backups automatizados (4h)
- **Subtotal:** 26 horas

**D. Seguridad & Compliance:**
- Auditoría de seguridad (penetration testing) (16h)
- HTTPS + certificados SSL (4h)
- Cumplimiento GDPR / Ley de Protección de Datos (12h)
- Encriptación de datos sensibles (8h)
- **Subtotal:** 40 horas

**E. Mobile Apps Nativas (Opcional):**
- React Native (iOS + Android) (120h)
- Deploy en App Store + Google Play (16h)
- **Subtotal:** 136 horas

**F. Testing & QA Final:**
- Tests unitarios (Jest + React Testing Library) (32h)
- Tests E2E (Playwright) (24h)
- QA manual (múltiples dispositivos) (16h)
- **Subtotal:** 72 horas

---

#### **COSTO TOTAL - SISTEMA FINAL (SIN APPS NATIVAS):**

| Componente | Horas | Costo (Semi-Senior) | Costo (Senior) |
|------------|-------|---------------------|----------------|
| Prototipo (ya cotizado) | 225h | $562.500 | $900.000 |
| Backend Real | 96h | $240.000 | $384.000 |
| Features Avanzadas | 156h | $390.000 | $624.000 |
| Infraestructura | 26h | $65.000 | $104.000 |
| Seguridad | 40h | $100.000 | $160.000 |
| Testing Final | 72h | $180.000 | $288.000 |
| **TOTAL** | **615h** | **$1.537.500** | **$2.460.000** |

**Tiempo Estimado:** 4-5 meses (1 dev) o 2-3 meses (equipo de 2)

---

#### **CON APPS NATIVAS (iOS + Android):**

**TOTAL:** 751 horas → **$1.877.500 - $3.004.000 ARS**

**Tiempo Estimado:** 5-6 meses (1 dev) o 3-4 meses (equipo de 2)

---

### 3.3 Roadmap de Desarrollo Sugerido

#### **FASE 1: Prototipo Mejorado (5-6 semanas)**

**Sprint 1 (Semana 1-2): Ajustes Críticos**
- ✅ Fix navegación post-scan
- ✅ QR Entry Scanner obligatorio
- ✅ Eliminar catálogo web
- ✅ Rediseño pantalla producto (foco mayorista)
- ✅ Expansión mock data (60+ productos)

**Sprint 2 (Semana 3): Simplificación de Flujo**
- ✅ Nuevo "Resumen de Pedido"
- ✅ Floating "Ir a Pagar" button
- ✅ Métodos de pago adicionales (efectivo/caja)
- ✅ Simplificar confirmación

**Sprint 3 (Semana 4): Features de Soporte**
- ✅ Sección arrepentidos/quejas
- ✅ Mejoras pantalla espera + encuesta
- ✅ Asignación manual de pedidos (picker)

**Sprint 4 (Semana 5-6): Integraciones Desarrollo**
- ✅ Setup Tiendanube API
- ✅ Setup SAP Service Layer
- ✅ Middleware unificado
- ✅ Testing de integraciones

**Entregable:** Prototipo funcional con integraciones en modo desarrollo.

---

#### **FASE 2: Analytics & Optimización (3-4 semanas)**

**Sprint 5 (Semana 7-8): Dashboard Insights**
- Mapa de calor del recorrido
- Top productos escaneados vs. comprados
- Alertas de stock faltante
- Tiempo de espera promedio

**Sprint 6 (Semana 9-10): Optimizaciones UX**
- Mejoras de performance
- Pulido de animaciones
- Ajustes responsive
- User testing con clientes reales

**Entregable:** Sistema optimizado con analytics avanzados.

---

#### **FASE 3: Backend Real & Producción (8-10 semanas)**

**Sprint 7-8 (Semana 11-14): Backend & DB**
- PostgreSQL + Prisma setup
- Migración de localStorage a DB
- API REST completa
- Autenticación JWT

**Sprint 9-10 (Semana 15-18): Features Avanzadas**
- PWA completa
- Notificaciones push
- Sistema de cupones
- CRM básico

**Sprint 11-12 (Semana 19-22): Deploy & Seguridad**
- Deploy en producción
- CI/CD pipeline
- Auditoría de seguridad
- Testing E2E

**Entregable:** Sistema en producción listo para usuarios reales.

---

#### **FASE 4 (OPCIONAL): Mobile Apps (8-10 semanas)**

**Sprint 13-16 (Semana 23-30):**
- React Native development
- Deploy en stores
- Marketing & onboarding

**Entregable:** Apps nativas iOS + Android.

---

### 3.4 Consideraciones Finales

#### **Riesgos & Mitigaciones:**

**1. Integración SAP Compleja:**
- **Riesgo:** Service Layer no disponible o con restricciones.
- **Mitigación:** Validar acceso antes de empezar. Considerar alternativa con APIs SOAP (más antiguas pero estables).

**2. Límites de Rate de APIs:**
- **Riesgo:** Tiendanube tiene límites de 1000 requests/hora.
- **Mitigación:** Implementar caché con Redis, sincronizar catálogo 1x/día.

**3. Cambios en Requerimientos:**
- **Riesgo:** Cliente pide más features mid-project.
- **Mitigación:** Trabajar con sprints cerrados, cambios solo entre sprints.

**4. Performance con 1000+ Productos:**
- **Riesgo:** Consultas lentas al catálogo.
- **Mitigación:** Paginación, búsqueda con índices, CDN para imágenes.

---

#### **Recomendaciones Técnicas:**

1. **Empezar con Tiendanube (más fácil)** antes de SAP.
2. **Usar Vercel para hosting** (Next.js optimizado).
3. **PostgreSQL en Supabase** (free tier generoso).
4. **Implementar feature flags** (activar/desactivar features sin deploy).
5. **Documentar todo** (crucial para mantener el código).

---

#### **Próximos Pasos Inmediatos:**

1. ✅ **Aprobar este documento** con el cliente.
2. ✅ **Priorizar features** de Parte 1 (¿cuáles son must-have?).
3. ✅ **Conseguir credenciales** de Tiendanube/SAP para desarrollo.
4. ✅ **Definir equipo:** ¿1 dev o 2? ¿Diseñador? ¿QA dedicado?
5. ✅ **Setup de proyecto:** GitHub, Trello/Jira, Slack.
6. ✅ **Kick-off meeting:** Alinear expectativas y timelines.

---

## 📝 ANEXO: Ejemplo de Propuesta Comercial

### **PROPUESTA TÉCNICA Y ECONÓMICA**

**Cliente:** [Nombre del Cliente]  
**Proyecto:** Picky - Mejoras del Prototipo MVP + Integraciones  
**Fecha:** 23 Enero 2026  
**Validez:** 30 días

---

#### **ALCANCE DEL PROYECTO:**

**Fase 1: Prototipo Mejorado (6 semanas)**

Incluye:
- 11 ajustes de UX según feedback del cliente
- Rediseño de pantalla de producto (orientación mayorista)
- Expansión de catálogo a 60+ productos
- Integración con Tiendanube (modo desarrollo)
- Semi-integración con SAP Business One
- Testing y validación de integraciones

**Entregables:**
- Código fuente en repositorio Git
- Prototipo funcional deployado en URL de staging
- Documentación técnica de APIs
- Manual de usuario básico

**Inversión:** $843.000 ARS

**Forma de Pago:**
- 30% al inicio ($252.900)
- 40% a mitad de proyecto ($337.200)
- 30% al finalizar ($252.900)

---

#### **FASE 2 (OPCIONAL): Sistema Final en Producción**

**Inversión:** $1.537.500 ARS (sin apps nativas)  
**Tiempo:** 4-5 meses  
**Pago:** En 3 cuotas mensuales

---

#### **CONDICIONES:**

- Reuniones semanales de seguimiento (1 hora)
- Comunicación por Slack/WhatsApp (horario laboral)
- Revisiones ilimitadas en fase de desarrollo
- 1 mes de soporte post-entrega (bugs críticos)
- Hosting NO incluido (cliente provee o cotizamos aparte)

---

**Desarrollador Asignado:**  
[Tu Nombre] - Full-Stack Senior Developer  
Portfolio: [URL]  
LinkedIn: [URL]

**Firma del Cliente:** _________________  
**Fecha:** _________________

---

## 🎯 CONCLUSIÓN

Este documento provee una hoja de ruta completa para transformar el prototipo actual de Picky en un sistema production-ready con integraciones reales a Tiendanube y SAP.

**Highlights:**
- ✅ 11 ajustes críticos de UX documentados
- ✅ Roadmap técnico detallado de integraciones
- ✅ Estimaciones realistas de tiempo y costo
- ✅ Arquitectura escalable y provider-agnostic
- ✅ Plan de 4 fases: Prototipo → Analytics → Producción → Mobile

**Recomendación Final:**  
Ejecutar **Fase 1 completa** (6 semanas) para validar integraciones antes de comprometer inversión en backend completo. Esto permite ajustar rumbo si se detectan limitaciones técnicas o cambios de negocio.

---

**Documento preparado por:** GitHub Copilot  
**Fecha:** 23 Enero 2026  
**Versión:** 1.0
