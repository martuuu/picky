Auditoría Completa
1. Carritos pre-compra visibles para el Picker ("Órdenes Inteligentes")
Estado actual: El useCartStore usa persist con key picky-cart-storage en localStorage. El cross-tab sync del evento storage está implementado solo para picky-orders-storage (órdenes), no para el carrito. El picker no tiene ninguna vista del carrito del consumidor.

Para el prototipo (localStorage): Es 100% viable. El carrito ya persiste en localStorage. Solo necesitamos:

Agregar un listener de storage para picky-cart-storage en el picker
Crear una nueva sección/columna "Carritos Activos" en el Kanban que lea el carrito (status tipo BROWSING)
Funciona perfecto en la misma máquina (MacBook con dos tabs: una de consumidor, otra de picker)
Limitación: Solo funciona en el mismo browser. Dos dispositivos distintos NO comparten localStorage.

Para Supabase: Trivial — el carrito se persiste en una tabla Cart y el picker lo ve via Realtime channel. Multi-dispositivo, multi-browser.

2. Demo MacBook + Celular (mismo WiFi)
Estado actual: La app usa localStorage, que es por browser/dispositivo. Dos dispositivos no comparten estado.

Opciones para demo:

Vercel (la más simple): Desplegás en Vercel, abrís /scan en el celular y /picker en la MacBook. Problema: localStorage no se comparte entre dispositivos, así que el picker no ve las órdenes del celular.
Workaround para el prototipo: Puedo agregar una API route /api/sync que actúe como "relay" usando un store en memoria del servidor de Next.js. El consumidor hace POST al crear orden, el picker hace polling GET. Es hacky pero funcional para una demo de 30 minutos sin Supabase.
Supabase Realtime: Resuelve todo limpiamente — insert en Order dispara un postgres_changes event y el picker lo recibe en tiempo real, sin importar el dispositivo.
Mi recomendación: Para la demo, la opción más pragmática es usar Vercel + la API relay en memoria. Son ~50 líneas de código. Supabase es la solución definitiva.

3. Pasarela de pagos simulada
Estado actual en checkout/page.tsx:66-108:


const handlePay = () => {
  setProcessing(true);
  setTimeout(() => {
    createOrder({ status: "PENDING", ... });
    clearCart();
    router.push("/confirmation");
  }, 2000);
};
Hay un setTimeout de 2 segundos que simula procesamiento, pero no hay ninguna pantalla de pasarela de pago. Solo es "esperar y listo".

Lo que puedo implementar:

Una pantalla intermedia tipo MercadoPago/MercadoPago Checkout Pro con animaciones (simulada)
Flujo: botón "Pagar" → pantalla fullscreen de procesamiento con pasos animados (Verificando datos → Procesando pago → Confirmado) → redirige a /confirmation
Para efectivo: simulación distinta (genera un código de pago, "pagá en caja" con timer)
Para débito: simulación de "Acercá tu tarjeta al POS"
La data no persiste más allá de localStorage, perfecto para la demo.

4. "Cargar Órdenes Demo" — ¿Funciona?
Estado actual en useOrderStore.ts:142-201: seedDemoOrders() crea 3 órdenes hardcoded con IDs fijos (PCK-4092, PCK-4105, PCK-4088) y usa existingIds para no duplicar.

Bug potencial: Si ya tenés las 3 órdenes cargadas (incluso como DELIVERED), el filter las considera existentes y no agrega nada. No hay feedback visual de "ya están cargadas" vs "se cargaron 3 nuevas".

Además, la orden PCK-4088 tiene status: 'PICKING' con createdAt: before(22) — creada hace 22 minutos. Eso la pone en riesgo de atraso (>20min) y si la rehidratación flashea, podría ser el bug que veías antes. Ya lo arreglamos.

Fix: Limpiar el seed para que regenere IDs aleatorios o que muestre toast de feedback.

5. "Órdenes Inteligentes" — Pre-compra del consumidor
Estado actual: No existe. El nav del picker tiene: Órdenes, Historial, Inventario Rápido, Ajustes.

Propuesta: Agregar una sección "Carritos en Vivo" (o "Pre-Órdenes") al picker que muestre los carritos activos de consumidores aún no pagados. Esto da al picker un heads-up de qué van a necesitar preparar. Funcionalmente es leer picky-cart-storage (otro tab, mismo browser) o un store compartido.

Para el prototipo: Viable con un nuevo store useActiveCartsStore que sincroniza vía storage event, o más simple: el picker lee directamente picky-cart-storage del localStorage.

6. Store page — TiendaNube no muestra productos en la tabla
Estado actual en store/page.tsx:157-168:


const filtered = useMemo(() => {
  return products.filter((p: Product) => { ... });
}, [search, filterCategory, filterBrand, filterStock]);
Bug: products está en el array de dependencias del useMemo (línea 168) — no, no lo está. products depende del state useTiendaNube y tnProducts, pero el useMemo solo depende de [search, filterCategory, filterBrand, filterStock]. Cuando tnProducts se carga, products cambia pero useMemo no se re-ejecuta.

Además, hay un error de TypeScript pre-existente en la API route: el tipo TiendaNubeProduct del mapper es más completo que el del client (tiendanube.ts), por lo que mapTiendaNubeProducts(tnProducts) falla en tipos. Esto puede causar que la respuesta sea un error 500 en runtime si los campos no coinciden.

Plan de Implementación
#	Tarea	Complejidad
1	Fix useMemo en store/page.tsx (agregar products a deps)	Trivial
2	Fix tipo TiendaNubeProduct en API route (unificar tipos)	Bajo
3	Pasarela de pago simulada (pantalla intermedia animada)	Medio
4	Fix seedDemoOrders (feedback + reset IDs)	Bajo
5	Carritos en Vivo en picker sidebar (leer cart via localStorage)	Medio
6	Agregar "Carritos en Vivo" al nav del picker	Bajo
¿Apruebo todo y arranco, o querés ajustar prioridades o alcance?