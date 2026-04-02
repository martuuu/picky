# Requerimientos Fines: QRs & Multi-Actor Assembly Flow

Este documento provee el contexto, arquitectura sugerida y guía de los próximos dos grandes requerimientos a implementar.

---

## Requerimiento 1: Autogeneración de QRs In-Store (Base TiendaNube)

**Objetivo:** Obtener que por cada producto traído de la API de TiendaNube, exista un código QR físico/virtual que, al ser escaneado por el cliente en la sucursal, cargue directamente el detalle del producto (`/scan`) o lo agregue al cart. Ademas se requiere que este QR cambie si no hay productos o si se modifican, para mostrar siempre lo ultimo y que te lleve al producto correcto (aunque creo que mientras no se elimine, el UID y el QR seran siempre los mismos, por que en esencia es su ADN-UID)

### Ayudas e Integración Sugerida:
1. **Punto Final de App:** En `picky/src/app/api/qr/route.ts` podes crear un generador de QR dinámico.
2. **Librería a usar:** Usa algo como `qrcode` (NPM) y `bwip-js` o en el frontend directamente react-qr-code. Sino la que creas y veas mas escalable
3. **Mapeo de Datos:** Cuando se haga fetch a TiendaNube, el SKU o el `product.id` será el Payload del QR (E.g. `picky://product/72819` o `https://mipicky.com/scan?sku=PCK-1000`). Atendamos que esto no tenga problemas de seguridad o intentos de ingresos forzosos o ataques (scrapping y demas)
4. **Flujo para la Administración:** Crea una pantalla básica (`/admin/qrs`) que haga un `fetch` full a TiendaNube, liste todos los productos, y pinte una cuadrícula para impresión masiva (hoja A4, 4x4, listos para guillotinar y pegar a la estantería del corralón). Esto seria la solucion para que las store puedan tener un acceso facil integrar fisicamente Picky

---

## Requerimiento 2: End-to-End Picker Assembly Flow (Gestión Integral del Pedido)

**Objetivo:** Permitir que una "Orden" viva de manera interactiva entre la webapp del usuario y la tablet/webapp del empleado (Picker), conectando el final del Checkout hasta la recolección física de los bienes.

### Core Arquitectónico (Supabase / LocalStorage Temporal):
Dado que actualmente el foco está en el frontend, y todavía no armamos sockets, la simulación de la "base de datos de órdenes" debe vivr al menos en `localStorage` o mejor, a través del state general/Zustand sincronizado temporalmente simulando polling. Usemos primero localStorage y luego usaremos Supabase/Hostinguer con Nest.js/Prisma/Postgres/AWS si escala demasiado o server dedicado.

### Fases del Flujo de Ensamblaje:

**Paso A: Creación (Cliente)**
- Al impactar el Checkout (`/checkout/page.tsx`), la orden pasa del Cart y muta a un objeto `Order { id, status: 'pending', items, user, total }`. 
- Si no hay un backend real disponible para iterarlo, almacenar este array de órdenes en el Browser Storage via persist zustand. (next.js o react no podrian manejar esto por ahora? asi no tenemos que instalar zustand por que eventualmente quedara deprecada - salvo que creas conveniente dejarlo para storear cierta data y que nos pueda servir para algo mas adelante ejemplo chequeos de que la persona esta fisicamente en el local o cosas por el estilo)

**Paso B: Tablero de Tienda/Depósito**
- Pantalla `/store/page.tsx`: Muestra una tabla con métricas y las "Órdenes Activas" agrupando en "Por Hacer", "Armando" y "Para Entregar".
- Pantalla `/picker/page.tsx`: Muestra exclusivamente las que están en estado `'pending'`. El operario hace "Tap" en [Tomar Pedido].

**Paso C: Proceso de Armado (Picker)**
- Pantalla `/picker/[orderId]/page.tsx`: 
  - El Picker navega por los pasillos con esta UI.
  - Al escanear/tildar un ítem recolectado, el item pasa a "Done".
  - Cuando todos los ítems fueron checkeados, el botón "Marcar como Listo para Retirar" dispara la modificación del status  (`status = 'ready'`).

**Paso D: Espera y Preparativo (Cliente)**
- La orden en el celular del cliente se actualiza constantemente (simular un polling cada x segundos que detecte que el State pasó de `pending` a `picking`, y finalmente a `ready`).
- Cuando es `'ready'`, la pantalla del cliente (`/confirmation/page.tsx`) entra en el mode de expansión. El resto de distracciones desaparecen y un QR gigantesco con el ID de la ORDEN toma la pantalla completa.

**Paso E: Hand-Off Final (Entrega)**
- El cliente se acerca al mostrador ("Pickup spot") y muestra su celular brillante y con gran tamaño al Empleado final.
- El Picker (o Cajero) usa un láser manual 2D o la cámara frontal de su equipo Picker. Escaneando ese QR masivo identificará instantáneamente la bolsa/palet del cliente y el sistema cambiará la orden de `'ready'` a `'delivered'`.
- La pantalla de confirmation del Cliente detecta que la orden bajó de cartel y reemplaza con "¡Gracias por tu compra!, Hasta pronto".

**Paso F: Portal picker**
- Agreguemos en el portal del picker la data real, ya que ahora hay maquetados ordenes que no son reales. ademas, agreuemos una vista del tipo Kanvan (futuro feature va a ser Drag and Drop) para poder gestionar las ordenes y pasarlas de pendientes a completadas y despues a retiradas.
- Seria ideal tener otra pagina (sublink tal vez?) con el historial de pedidos que seria mas bien la tabla de pedidos. Sorting, paginado, filtros.
- Y una nueva subpagina que diga "En proceso": Aca irian los datos que va recolectando la gente, por ejemplo, si hay 10 ordenes, y 3 ya estan en proceso, solo se muestran esas 3. Esas 3 mostrarian los preoductos que el consumidor ya tiene en el carrito, y permitiria previsualizar al Picker las cosas que va a llevar. Seria ideal que cuando el Cliente consumidor llega al paso de checkout, le avise al Picker que esta "Pagando" para saber que probablemente esa compra se realice, puede ir inspeccionando los productos y dejando todo listo para cuando pague, solo tenga que retirar.

### Puntos Técnicos Críticos
- **Estado Compartido:** Si el mismo navegador está siendo utilizado para testear ambos, el LocalStorage funcionará de maravilla para simular la red. Solo necesitas una "Store" en Zustand que controle `globalOrders[]` y lo persista.
- **Ruta Dinámica `/picker/[orderId]`**: Asegúrate de tener los componentes CheckList aislados y robustos.
- **Transición Cliente:** Un `useEffect` en `/confirmation` que valide si el estado cambió para disparar pirotecnia virtual (confetti, sonner) alertando que puede buscar la mercadería.
