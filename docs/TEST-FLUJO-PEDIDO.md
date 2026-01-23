# 🧪 Test Plan - Flujo de Pedido Completo

## ✅ Checklist de Testing

### Pre-requisitos
- [ ] Servidor Next.js corriendo en `http://localhost:3000`
- [ ] Consola del navegador abierta (F12 → Console)
- [ ] localStorage limpio (opcional: Application → Clear storage)

---

## 📋 Test 1: Flujo Completo desde Cero

### Paso 1: Entrada al Local (5 segundos)
1. Navegar a: `http://localhost:3000/tienda/store-001/entrada`
2. Click en "Simular Entrada" (botón naranja)
3. **Esperar:** Animación de check verde
4. **Resultado esperado:** Redirect a `/tienda/store-001`

### Paso 2: Escanear Productos (30 segundos)
1. Estar en: `http://localhost:3000/tienda/store-001/escanear`
2. Click en "Ver Catálogo" (botón morado inferior)
3. **Resultado esperado:** Redirect a `/catalogo`

### Paso 3: Agregar Productos (1 minuto)
1. Estar en: `/tienda/store-001/catalogo`
2. Click en cualquier producto
3. En la página del producto:
   - Ajustar cantidad si querés
   - Click "Agregar al Carrito"
4. **Resultado esperado:** 
   - Modal "RelatedOffersSheet" aparece
   - Título "¡Producto agregado!" con check verde
   - Total calculado correctamente

### Paso 4: Ir al Resumen (10 segundos)
1. En el modal, click "Ir al Carrito"
2. **Resultado esperado:** Redirect a `/resumen`
3. **Verificar:**
   - Lista de productos agregados
   - Total correcto
   - Botón "Continuar a Pago" visible

### Paso 5: Checkout (30 segundos)
1. Click en "Continuar a Pago"
2. **Resultado esperado:** Redirect a `/checkout`
3. Llenar formulario:
   - Nombre: "Test User"
   - Teléfono: "1234567890"
4. Seleccionar método de pago:
   - **Opción A:** MercadoPago (PAID inmediato) ✅ RECOMENDADO
   - **Opción B:** Efectivo (PENDING_PAYMENT → PAID en 10s)
5. Click en "Pagar ahora"
6. **Resultado esperado:** 
   - Toast de confirmación
   - Redirect a `/pedido?orderId=ORD-xxxxx`
   - ⚠️ NO debe ir a `/escanear`

---

## 🎯 Test 2: Simulación Automática de Estados

### Setup
1. Estar en: `/tienda/store-001/pedido?orderId=ORD-xxxxx`
2. **Abrir consola del navegador** (F12)
3. Buscar log: `🚀 [PEDIDO] Iniciando simulación automática de estados...`

### Timeline Esperado

#### T = 0 segundos
- **UI visible:**
  - Header con contador: `⏱️ 0s`
  - Estado: "Pendiente de pago" o "Pago confirmado" (según método)
  - Barra de progreso: 25% o 50%
  - Timer: "Tiempo transcurrido: 0 min"
  - Card naranja "Mientras esperás..." con 2 ofertas
- **Consola:**
  ```
  🚀 [PEDIDO] Iniciando simulación automática de estados...
  📍 Order ID: ORD-xxxxx
  ⏰ Tiempo actual: HH:MM:SS
  ```

#### T = 10 segundos (Timer 1)
- **UI cambios:**
  - Badge contador: `⏱️ 10s`
  - Si era PENDING_PAYMENT → ahora PAID
  - Barra progreso: 50%
  - Toast verde: "✅ Pago confirmado"
- **Consola:**
  ```
  ⏱️  [10s] Ejecutando Timer 1...
  ✅ Status changed: PENDING_PAYMENT → PAID
  ```

#### T = 25 segundos (Timer 2)
- **UI cambios:**
  - Badge contador: `⏱️ 25s`
  - Estado: "Preparando pedido" activo (icono Package)
  - Barra progreso: 75%
  - Toast azul: "📦 Preparando pedido"
- **Consola:**
  ```
  ⏱️  [25s] Ejecutando Timer 2...
  📊 Status actual: PAID
  📦 Status changed: → PREPARING
  ```

#### T = 55 segundos (Timer 3) 🎉
- **UI cambios:**
  - Badge contador: `⏱️ 55s`
  - Estado: "Listo para retirar" (último check verde)
  - Barra progreso: 100%
  - 🎊 **Card verde grande aparece:**
    - Título: "¡Tu pedido está listo!"
    - Botón: "Ver Código QR para Retiro"
  - Card naranja "Mientras esperás..." desaparece
  - Vibración del teléfono (5 pulsos)
  - Toast verde 10 segundos: "🎉 ¡Pedido listo!"
- **Consola:**
  ```
  ⏱️  [55s] Ejecutando Timer 3...
  📊 Status actual: PREPARING
  🎉 Status changed: → READY_FOR_PICKUP
  ```

### Otras Features por Tiempo

#### T = 3 minutos (180 segundos)
- **Aparece:** Card rosa "🎈 Zona de Juegos para Niños"
- **Ubicación:** Debajo de ofertas de comida
- **Condición:** Solo si NO está en READY_FOR_PICKUP

#### T = 2 minutos (120 segundos)
- **Aparece:** Card morado "¿Cómo va tu experiencia?"
- **Encuesta:** 5 emojis para rating
- **Condición:** Solo si NO está listo

---

## 🐛 Debugging - Si algo falla

### Problema 1: No redirige después de pagar
**Síntomas:**
- Click "Pagar ahora" → va a `/escanear`
- No llega a `/pedido`

**Solución:**
1. Verificar en consola si hay errores
2. Limpiar localStorage: `localStorage.clear()`
3. Refresh hard: `Cmd + Shift + R` (Mac)
4. Intentar de nuevo

### Problema 2: Estados no cambian automáticamente
**Síntomas:**
- Se queda en el mismo estado por más de 55 segundos
- No aparece el botón verde
- No hay toasts

**Verificar en consola:**
```javascript
// Ver logs de timers
// Deberías ver:
// ⏱️  [10s] Ejecutando Timer 1...
// ⏱️  [25s] Ejecutando Timer 2...
// ⏱️  [55s] Ejecutando Timer 3...
```

**Si NO ves los logs:**
1. Verificar que el archivo `/pedido/page.tsx` tenga los console.log
2. Refrescar la página
3. Verificar que el orderId sea válido

**Si ves los logs pero no cambia la UI:**
1. Verificar localStorage:
   ```javascript
   JSON.parse(localStorage.getItem('picky_orders'))
   // Buscar tu orden y ver el status
   ```
2. El polling cada 5 segundos debería actualizar
3. Verificar que `loadOrder()` se ejecuta

### Problema 3: Badge contador no aparece
**Síntomas:**
- No se ve `⏱️ Xs` en el header

**Solución:**
- Verificar que `elapsedSeconds` state está inicializado
- Refrescar página

### Problema 4: Modal no aparece después de agregar producto
**Síntomas:**
- Click "Agregar al Carrito" → nada pasa
- No hay modal

**Verificar:**
1. Producto tiene `relatedProducts` array
2. Ver en consola si hay errores de compilación
3. Verificar `RelatedOffersSheet` importado correctamente

---

## 📊 Resultados Esperados

### ✅ Test Exitoso
- [ ] Redirect de checkout a pedido funciona
- [ ] Badge contador incrementa cada segundo
- [ ] Timer 1 ejecuta a los 10s (log + toast)
- [ ] Timer 2 ejecuta a los 25s (log + toast)
- [ ] Timer 3 ejecuta a los 55s (log + toast + vibración)
- [ ] Barra de progreso avanza: 25% → 50% → 75% → 100%
- [ ] Card verde "¡Pedido listo!" aparece
- [ ] Botón "Ver Código QR" funcional
- [ ] Click botón → redirect a `/confirmacion`

### ❌ Signos de Fallo
- Redirect a `/escanear` después de pagar
- Badge contador congelado en 0s
- No hay logs en consola
- Estados no cambian después de 60 segundos
- Toasts no aparecen
- Card verde no aparece
- Barra de progreso estancada

---

## 🔧 Comandos Útiles

### Limpiar Todo y Empezar de Cero
```javascript
// En consola del navegador:
localStorage.clear();
location.reload();
```

### Ver Estado Actual del Pedido
```javascript
// Ver todos los pedidos:
JSON.parse(localStorage.getItem('picky_orders'));

// Ver pedido específico:
const orders = JSON.parse(localStorage.getItem('picky_orders'));
const myOrder = orders.find(o => o.id === 'ORD-1769190363077');
console.log('Status:', myOrder.status);
```

### Forzar Cambio de Estado (Emergency)
```javascript
const orders = JSON.parse(localStorage.getItem('picky_orders'));
orders[0].status = 'READY_FOR_PICKUP';
localStorage.setItem('picky_orders', JSON.stringify(orders));
location.reload();
```

### Ver Próximos Timers Programados
```javascript
// Los timers están en el useEffect
// Se crean cuando cargas /pedido
// Se limpian cuando sales de la página
```

---

## 📈 Métricas de Éxito

| Métrica | Target | Medición |
|---------|--------|----------|
| Tiempo total test | < 3 minutos | Manual |
| Redirects correctos | 100% | Visual |
| Toasts mostrados | 3/3 | Visual |
| Estados progresados | 4/4 | Consola + UI |
| Vibración funciona | ✅ | Físico (móvil) |
| localStorage sync | ✅ | DevTools |

---

## 🎬 Video de Referencia

**Grabá un video si todo funciona:**
1. Screen recording desde inicio de checkout
2. Mostrar consola en una esquina
3. Mostrar badge contador
4. Capturar los 3 toasts
5. Mostrar card verde final

**Usar para:**
- Documentación
- Onboarding equipo
- Demo a stakeholders

---

## 🚀 Next Steps Después del Test

Si todo funciona:
1. ✅ Marcar como DONE en backlog
2. Commit & push cambios
3. Documentar en CHANGELOG.md
4. Crear demo para QA

Si algo falla:
1. 📸 Screenshot del error
2. Copy/paste logs de consola
3. Reportar con contexto completo
4. Iterar hasta fix
