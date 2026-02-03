# Contexto del Proyecto: Picky - Prototipo MVP

## 1. Visión
Construir un prototipo de alta fidelidad para "Picky", una aplicación de "Smart Shopping" para tiendas físicas (scan & go).
El objetivo es transformar la experiencia de compra permitiendo a los usuarios escanear productos, armar un carrito virtual y pagar desde su móvil, para luego retirar el pedido preparado.

**Fuente de Verdad de Diseño:**
- Wireframes de "Stitch" ubicados en `stitch_smart_scanner_interface/`.
- Cada carpeta contiene un `code.html` (referencia de estructura/clases) y `screen.png` (referencia visual).
- **Importante:** Los diseños están en Inglés. La implementación debe ser **100% en Español Latinoamericano**.

## 2. Estado del Proyecto
- **Inicio desde Cero:** No hay código previo en este directorio. Se inicializará un nuevo proyecto Next.js.
- **Enfoque:** Frontend-First. Sin integraciones reales con SAP o Tiendanube por ahora (todo mockeado).
- **Prioridad:** Estética "Premium", Animaciones fluidas, UX excelente.

## 3. Stack Tecnológico
- **Framework:** Next.js (App Router).
- **Lenguaje:** TypeScript.
- **Estilos:** Tailwind CSS v4.
- **Iconos:** Lucide React.
- **Animaciones:** Framer Motion.
- **Estado Global:** Zustand.
- **Notificaciones:** Sonner.
- **Base de Datos:** PostgreSQL/Supabase con Prisma.

## 4. Estructura de Diseño (Basada en Stitch)
El diseño se dividirá en componentes reutilizables extraídos de los mocks HTML proporcionados.
Se debe prestar especial atención a la adaptación de mobile-first para la experiencia del cliente.
Se implementará un sistema de alerts custom para mejorar la experiencia de usuario (Smart Toasts).
