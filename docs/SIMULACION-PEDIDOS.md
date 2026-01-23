# Simulación Automática de Pedidos

## 🎯 Objetivo

Simular el flujo completo de un pedido desde el pago hasta el retiro, permitiendo testear la ex6. **Confirmar pago** → Redirige a `/pedido?orderId=XXX`
7. **Observar transiciones automáticas:**
   - 0-5s: PENDING_PAYMENT o PAID
   - 5-12s: PAID
   - 12-20s: PREPARING
   - 20s+: READY_FOR_PICKUP
8. **Click en "Ver Código QR"** → `/confirmacion?orderId=XXX`ia del usuario sin necesidad de esperar tiempos reales.

## ⏱️ Timeline de Estados

### Estado 1: PENDING_PAYMENT → PAID
**Tiempo:** 5 segundos después de crear el pedido
- Se simula la confirmación de pago (solo para pagos en efectivo/tarjeta en mostrador)
- Los pagos con MercadoPago se marcan como PAID inmediatamente
- Toast: "Pago confirmado - Tu pedido está siendo preparado"

### Estado 2: PAID → PREPARING  
**Tiempo:** 12 segundos después de crear pedido (7 segundos después de PAID)
- El pedido entra en preparación
- Toast: "Preparando pedido - Tu pedido está en preparación"

### Estado 3: PREPARING → READY_FOR_PICKUP
**Tiempo:** 20 segundos después de crear pedido (8 segundos después de PREPARING)
- El pedido está listo para retiro
- Vibración: [200ms, 100ms, 200ms, 100ms, 200ms]
- Toast: "¡Pedido listo! - Podés retirarlo en caja" (10 segundos)
- Se muestra el botón verde para ver el código QR

**TIMELINE TOTAL: 20 segundos** ⚡

## 🎨 Features por Estado

### Durante PENDING_PAYMENT
- ⚠️ Alert amarillo: "Recordá pagar en caja al retirar tu pedido"
- Barra de progreso: 25%
- Timer mostrando tiempo transcurrido
- Ofertas de comida/bebida
- Zona de juegos (después de 3 minutos)

### Durante PAID
- ✅ Confirmación verde en el paso de "Pago confirmado"
- Barra de progreso: 50%
- Timer estimado de preparación
- Ofertas mientras espera

### Durante PREPARING
- 📦 Icono de Package activo
- Barra de progreso: 75%
- Countdown del tiempo restante
- Sugerencia de playground (después de 3 min)
- Encuesta de experiencia (después de 2 min)

### Durante READY_FOR_PICKUP
- 🎉 Card verde grande con "¡Tu pedido está listo!"
- Barra de progreso: 100%
- Botón principal: "Ver Código QR para Retiro"
- Se ocultan las ofertas de comida
- Se mantiene la información del pedido

## 🔄 Actualización en Tiempo Real

### Polling de Estados
- **Intervalo:** Cada 5 segundos
- **Método:** localStorage `picky_orders`
- **Acción:** Recargar order completa desde storage

### Timer Visual
- **Actualización:** Cada 1 segundo
- **Display:** "Tiempo transcurrido: X min"
- **Cálculo:** `currentTime - order.createdAt`

### Estimación de Tiempo
- **Base:** 10 minutos mínimo
- **Por Item:** +2 minutos por producto
- **Display:** "Tiempo estimado: X minutos"
- **Actualización dinámica:** Se reduce mientras transcurre el tiempo

## 🎮 Playground para Niños

### Condiciones de Aparición
- **Siempre visible** mientras el pedido NO esté en READY_FOR_PICKUP o COMPLETED
- **Estados válidos:** PENDING_PAYMENT, PAID, PREPARING
- **Ubicación:** Después de las ofertas de comida/bebida
- **Sin animación de entrada** (disponible desde el inicio)

### Contenido
- 🎈 Título: "Zona de Juegos para Niños"
- 📍 Ubicación: "Planta baja, sector norte"
- 👶 Edad: "De 3 a 10 años"
- Botón con toast informativo

## 📊 Encuesta de Experiencia

### Timing
- **Aparece:** Después de 2 minutos (120 segundos)
- **Condición:** Solo si NO está en READY_FOR_PICKUP o COMPLETED
- **Una vez por pedido**

### Ratings
- 😞 = 1 estrella (Muy malo)
- 😐 = 2 estrellas (Regular)
- 🙂 = 3 estrellas (Bueno)
- 😄 = 4 estrellas (Muy bueno)
- 🤩 = 5 estrellas (Excelente)

### Storage
```javascript
localStorage.setItem('picky_surveys', JSON.stringify([
  {
    orderId: 'ORD-xxx',
    rating: 1-5,
    timestamp: ISO string
  }
]))
```

## 🔧 Configuración de Tiempos

Para modificar los tiempos de simulación, editar en `/src/app/tienda/[storeId]/pedido/page.tsx`:

```typescript
// Línea ~73: Auto-progress timer
const statusTimer = setTimeout(() => {
  // PENDING_PAYMENT → PAID: 5 segundos (timer1, línea ~82)
  // PAID → PREPARING: 12 segundos totales (timer2, línea ~103)
  // PREPARING → READY_FOR_PICKUP: 20 segundos totales (timer3, línea ~124)
}, XXXX); // Cambiar estos valores en cada timer

// Línea ~145: Polling interval
const interval = setInterval(loadOrder, 5000); // Cada 5 segundos

// Línea ~148: Timer update
const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
```

### Tiempos Actuales
- **Timer 1:** 5000ms (5 segundos)
- **Timer 2:** 12000ms (12 segundos desde inicio)
- **Timer 3:** 20000ms (20 segundos desde inicio)
- **Polling:** 5000ms
- **UI Update:** 1000ms

## 🚀 Flujo de Testing Recomendado

1. **Agregar productos al carrito** (2-3 items)
2. **Ir a checkout** y llenar datos
3. **Seleccionar método de pago:**
   - MercadoPago → PAID inmediato
   - Efectivo/Tarjeta → PENDING_PAYMENT
4. **Confirmar pago** → Redirige a `/pedido?orderId=XXX`
5. **Observar transiciones automáticas:**
   - 0-10s: PENDING_PAYMENT o PAID
   - 10-25s: PAID
   - 25-55s: PREPARING
   - 55s+: READY_FOR_PICKUP
6. **Click en "Ver Código QR"** → `/confirmacion?orderId=XXX`

## 📱 Feedback Háptico

### Confirmación de Pago
```javascript
navigator.vibrate([200, 100, 200]);
```

### Pedido Listo
```javascript
navigator.vibrate([200, 100, 200, 100, 200]);
```

## 💾 Estructura de Order en localStorage

```typescript
{
  id: 'ORD-1737654321000',
  orderNumber: 'PK-123456',
  storeId: 'store-001',
  customerId: 'user-uuid',
  items: [...],
  status: 'PREPARING',
  paymentMethod: 'MERCADOPAGO',
  subtotal: 15000,
  totalDiscount: 2000,
  total: 13000,
  estimatedPrepTime: 16, // minutos
  createdAt: '2026-01-23T...',
  updatedAt: '2026-01-23T...'
}
```

## 🎯 Próximas Mejoras

1. **Push Notifications** cuando el pedido esté listo
2. **WebSocket** para actualizaciones en tiempo real
3. **Configuración de tiempos** desde panel admin
4. **Estados adicionales:** CANCELLED, DELAYED
5. **Razones de delay** con notificación al cliente
6. **Tracking de picker** para órdenes de retiro en sucursal
