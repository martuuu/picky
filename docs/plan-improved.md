# Plan y Estado del Plataforma - Merged & Improved (Abril 2026)

Este documento centraliza todos los logros arquitectónicos y de UI/UX logrados (rebranding, logos, integraciones) y los pasos inmediatos a seguir para la versión productiva del software.

---

## ✅ Hitos Alcanzados (Completados)

### 1. Setup y Fundamentos Tecnológicos
- Inicialización con Next.js + Tailwind v4 + TypeScript.
- Integración nativa del modo oscuro absoluto (`defaultTheme="dark"`, `forcedTheme="dark"`), garantizando que todos los displays cliente usen la misma base sombría preimum.
- Configuración de Zustand para almacenamiento local de interacciones del carrito.

### 2. Branding y Re-diseño "Premium"
Se aplicó un Rebranding de 3 colores core: Violeta (`#8b5cf6`), Rosa (`#ec4899`) y Naranja (`#f59e0b`).
- **Gradientes Múltiples:** Más de 12 combinaciones (`gradient-purple-pink`, `gradient-purple-orange`).
- **Micro-animaciones:** Glassmorphism, glows y glows terciarios pulsantes.
- **Botones y Actions:** Custom variants con hover effects y scale transients.

### 3. Integración con Inventario Real (TiendaNube)
- Conexión vía Server Actions (cURL, OAuth Token, API endpoint) a la TiendaNube DEMO (App ID: 28964).
- Extracción dinámica autorizada (Token OAuth permanente guardado en entorno).
- Script independiente desarrollado capaz de crear en bulk un CSV con más de 50 ítems de decoración con múltiples SKUs y categorías listos para ser mapeados en la UI.

### 4. Experiencia del Consumidor / Cliente (Mobile App-like)
- **Home/Welcome:** Animaciones de "orbes" dinámicas, botones CTA gradientes, y layout claro de beneficios.
- **Scanner Flow (Smart Scanner):** Scanner bottom sheet con lectura responsiva. 
  - *Fix drástico de fricción en drag:* Implementado `onDragEnd` con umbral bajo + cálculo de velocidad para un "flick and snap" que se siente 100% nativo de iOS/Android, eliminando los "bounces" extraños de animaciones reactivas.
- **Product Detail:** Catálago enriquecido. 
  - **La Competencia:** Componente tipo carrusel horizontal con scroll comparativo nativo mostrando ahorro vs otros competidores.
- **Carrito Virtual:** 
  - Auto-sugestión "Antes de Comprar..." en modo scroll-snap carrusel mostrando cross-sales que el usuario ya miró pero no agregó.
- **Checkout:** Sistema optimizado destacando ahorro y labels como "15% off" en efectivo para conversión in-site.
- **Confirmation "Ready State":** Pantalla de espera dividida. Una vez que el estado cambia a `"ready"`, todo en pantalla se oculta/limpia dejando exclusivamente un gigantesco código QR al centro para facilitar velozmente el pick-up.

### 5. Log-in y Autenticación Social
- Flujo local armado con Auth de Google y Apple, sumando modales y estados unificados con los colores Picky.

---

## 🚧 Próximos Pasos (En Ejecución)

1. **Implementación de Funcionalidad Multicanal de Órdenes:** 
   - Flujo síncrono Cliente <-> Picker. (Detallado en `requirements.md`).
2. **Generación Física/Impresión QR Tiendanube:** 
   - Producir lotes de Códigos QR únicos bindeados a cada `productId` de Tiendanube.
3. **Seeding & Fetching Completo:** 
   - Eliminar finalmente los mocks crudos en favor de `getTiendaNubeProducts()` total de extremo a extremo e inyectarlos localmente al iniciar la cache.
