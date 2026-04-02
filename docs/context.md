# Contexto del Proyecto: Picky - Plataforma de Retail Inteligente

## 1. Visión y Propósito
**Picky** es una plataforma de "Smart Shopping" (Scan & Go) orientada inicialmente a Corralones y tiendas físicas de gran volumen, pero expansible a cualquier formato de retail moderno. 
Transforma la experiencia de compra física eliminando filas y puntos de dolor: los usuarios ingresan a la tienda, escanean los códigos QR de los productos reales con su teléfono móvil web, arman un carrito de compras digital in-store, aplican descuentos en vivo y abonan desde el dispositivo (o en caja rápida con código/QR). Finalmente, retiran el pedido preparado por el personal (Pickers).

**Core Experience:**
- **Cliente:** Experiencia mobile-first nativa desde el navegador (PWA). UI oscura premium, interacciones fluidas (bottom sheets arrastrables), escaneo Rápido, pagos con un toque, y una pantalla de "Status" de retiro atractiva e informativa para que pase sus tiempos muertos viendo ofertas relacionadas y cruzadas.
- **Staff (Picker):** Interfaces preparadas para el trabajo en depósito. Optimizado en visibilidad de SKU, ubicación en depósito (Pasillos/Estantes) y flujos veloces.
- **Admin:** Panel de métricas e inventario.

## 2. Estado Actual del Sistema (Abril 2026)
- **Fase MVP de Alta Fidelidad:** El prototipo visual se encuentra en su iteración suprema, con **Dark Mode por defecto**, animaciones robustas y un branding corporativo de 3 colores (Violeta, Naranja, Rosa). 
- **Integraciones Reales:**
  - El catálogo de productos interactúa de forma nativa con **TiendaNube** utilizando credenciales de App (OAuth / REST API), permitiendo traer productos, variantes y precios reales de una tienda demostrativa.
- **Flujos Implementados:** Listado, detalles interactivos, carruseles horizontales snap, checkout de ofertas cruzadas (15% Cash), y la finalización (pantalla de retiro con QR full-screen).

## 3. Stack Tecnológico
- **Frontend Core:** Next.js (App Router), React 18, TypeScript, Tailwind CSS v4.
- **Animaciones & UI:** Framer Motion (Drag gestures pesados e interfaces de pantalla táctil similares a apps nativas), Lucide-React para iconos.
- **Gestión de Estado:** Zustand (para el cart client-side y el status local).
- **Backend & Catálogo:** Interacción directa en funciones Edge o API Routes con el ecosistema de APIs de TiendaNube.
- **Despliegue Asumido:** Vercel o similar.

## 4. Filosofía de Desarrollo & UX
- **Mobile First Obligatorio:** Nada de vistas de cliente debe verse o sentirse mal en mobile. Los elementos interactables como carruseles y paneles bottom-sheet deben responder naturalmente al touch/pan.
- **Diseño Premium:** Uso de glassmorphism sutil, gradientes duales controlados (ejs: *gradient-purple-pink*, *gradient-purple-orange*) para acciones clave. No usar grises planos aburridos.
- **"Picky Smarts":** Notificaciones custom, cross-selling en carruseles antes de comprar, y comparativas automáticas con "la competencia". Todo apuntando a rentabilidad.
