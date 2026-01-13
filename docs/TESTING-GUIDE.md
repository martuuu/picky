# 🧪 GUÍA DE TESTING - Flujo de Checkout Completo

**Versión:** 1.0  
**Fecha:** 13 Enero 2026  
**Última Actualización:** 23:00 hs

---

## 🚀 INICIO RÁPIDO

### 1. Levantar el servidor
```bash
cd /Users/martinnavarro/Documents/picky
npm run dev
```

**URL Base:** http://localhost:3000

---

## 📱 FLUJO COMPLETO A TESTEAR

### PASO 1: Acceso Inicial
1. Abrir http://localhost:3000
2. Click en "**Portal Cliente**"
3. Serás redirigido a `/tienda/store-001` (Bazar Casa Bella)

**✅ Validar:**
- Landing de tienda se carga correctamente
- Nombre de tienda: "Bazar Casa Bella"
- 3 botones visibles: Escanear / Ver Carrito / Ver Catálogo
- Badge del carrito muestra "0" inicialmente

---

### PASO 2: Agregar Productos al Carrito
**Opción A: Desde el Catálogo**
1. Click en "**Ver Catálogo**"
2. Buscar "Olla" en el search bar
3. Click en el producto "Olla de Acero Inoxidable 24cm"
4. En la PDP:
   - Ajustar cantidad a **2**
   - Agregar observaciones: "Envolver para regalo"
   - Click "**Agregar al carrito**"
5. Toast aparece: "✓ Producto agregado"
6. Click en "**Ir al carrito**" en el toast

**Opción B: Desde el Escáner**
1. Click en "**Escanear Producto**"
2. Click en "**Simular Escaneo**" (genera producto random)
3. Te redirige automáticamente al PDP
4. Agregar al carrito

**✅ Validar:**
- Toast notification aparece
- Badge del carrito floating se actualiza
- Vibración del dispositivo (si está habilitada)

---

### PASO 3: Gestionar el Carrito
1. Ya estás en `/tienda/store-001/carrito`
2. Ver productos agregados con thumbnails
3. Probar botones **+** y **-** para ajustar cantidad
4. Ver que el total se actualiza en tiempo real

**✅ Validar:**
- Stepper de progreso muestra "Carrito" activo
- Subtotal y Total calculados correctamente
- Si hay descuentos, mostrar badge "¡Ahorraste $X!"
- Ofertas relacionadas en carousel inferior
- Botón "Ir a Pagar" con animación pulse

---

### PASO 4: Checkout 🎯 **NUEVA PANTALLA**
1. Click en "**Ir a Pagar**"
2. Serás redirigido a `/tienda/store-001/checkout`

**Completar formulario:**
- **Nombre:** Juan Pérez
- **Teléfono:** 1123456789
- **Método de pago:** Seleccionar **MercadoPago** (click en el card)

**✅ Validar:**
- Formulario con 2 secciones numeradas (1️⃣ 2️⃣)
- Validación inline si dejás campos vacíos
- Error message rojo con ícono si teléfono inválido
- Banner azul "Demo: El pago será simulado..."
- Card de tiempo estimado: "~15 minutos" (varía según qty)
- Accordion "Resumen del pedido" colapsable
- Sticky footer con total destacado
- Botón verde "Pagar ahora"

**Probar validaciones:**
- Intentar pagar con campos vacíos → Toast error
- Ingresar teléfono de 5 dígitos → Error inline
- Ingresar datos correctos → Procede

---

### PASO 5: Procesar Pago 🎯 **SIMULACIÓN**
1. Con datos válidos, click en "**Pagar ahora**"

**Lo que sucede:**
- Botón cambia a "Procesando..." con spinner
- Delay de 800-1500ms (random)
- Toast success: "¡Pago exitoso! Pedido PK-XXXXXX confirmado"
- Vibración intensa: [100ms, 50ms, 100ms]
- Redirect automático en 1.5 segundos

**✅ Validar:**
- Loading state correcto (botón disabled)
- Mensaje "Procesando tu pago..." animado
- No se puede hacer doble-click
- Toast con ícono de checkmark verde
- Redirección automática a Estado del Pedido

---

### PASO 6: Estado del Pedido 🎯 **NUEVA PANTALLA**
1. Automáticamente redirigido a `/tienda/store-001/pedido/ORD-XXXXXXXXXX`

**Lo que sucederá automáticamente:**
- **T+0s:** Estado **PAID** (Pago confirmado) - Badge azul
- **T+3s:** Estado **PREPARING** (En preparación) - Badge amarillo
  - Aparece progress bar animado
  - Aparece card "¿Querés un café mientras esperás?"
- **T+23s:** Estado **READY_FOR_PICKUP** (Listo para retirar) - Badge verde
  - Vibración fuerte: [200, 100, 200, 100, 200]
  - Card con border verde pulsante
  - Botón "Ver QR de retiro" aparece

**✅ Validar:**
- Header muestra orderNumber (PK-XXXXXX)
- Badge de estado cambia de color automáticamente
- Progress bar se anima de 0% → 33% → 66% → 100%
- Timeline vertical en "Historial del pedido" se actualiza
- Cada cambio de estado tiene timestamp
- Footer "Seguir comprando" desaparece cuando está listo
- Polling funciona (revisa cada 3 segundos)

---

### PASO 7: Confirmación con QR 🎯 **NUEVA PANTALLA**
1. Click en "**Ver QR de retiro**"
2. Serás redirigido a `/tienda/store-001/confirmacion?orderId=ORD-XXX`

**Lo que verás:**
- **Confetti animation** (30 partículas de colores cayendo)
- Success card: "¡Pedido confirmado!" con checkmark animado
- QR Code de 300×300px generado dinámicamente
- 2 botones: "Descargar" y "Compartir"
- Resumen del pedido (cliente, teléfono, total)
- Instrucciones de retiro paso a paso
- Punto de retiro con ubicación y horarios
- Sticky footer "Volver al inicio"

**✅ Validar:**
- Confetti se reproduce durante 3 segundos
- QR code se genera correctamente (no debe fallar)
- CheckCircle hace animación de scale pulse (loop infinito)
- Click "Descargar" → Descarga PNG con nombre `Picky-PK-XXXXXX.png`
- Click "Compartir" → Abre share sheet nativo (mobile) o copia URL (desktop)
- Toast feedback en cada acción

**Probar QR Download:**
1. Click en "**Descargar**"
2. Toast: "QR descargado"
3. Verificar en carpeta de descargas

**Probar QR Share:**
1. Click en "**Compartir**"
2. En mobile: abre share sheet nativo
3. En desktop: copia URL al portapapeles
4. Toast según el método usado

---

### PASO 8: Volver al Inicio
1. Click en "**🏠 Volver al inicio**"
2. Serás redirigido a `/tienda/store-001/catalogo`
3. Carrito ahora está vacío (badge = 0)

**✅ Validar:**
- Carrito fue limpiado después del pago
- Orden sigue guardada en localStorage
- Puedes rehacer todo el flujo desde cero

---

## 🔍 TESTS EDGE CASES

### Test 1: Carrito Vacío en Checkout
1. Ir directamente a http://localhost:3000/tienda/store-001/checkout
2. **Resultado esperado:** Redirect automático a catálogo con toast error

### Test 2: OrderId Inválido
1. Ir directamente a http://localhost:3000/tienda/store-001/pedido/FAKE-ID
2. **Resultado esperado:** Mensaje "Pedido no encontrado" + botón fallback

### Test 3: Sin OrderId en Confirmación
1. Ir directamente a http://localhost:3000/tienda/store-001/confirmacion
2. **Resultado esperado:** Redirect a home

### Test 4: Validación de Formulario
En checkout:
1. Dejar nombre vacío → Click "Pagar ahora"
   - **Resultado:** Error "Ingresá tu nombre" + toast general
2. Ingresar teléfono "123" → Click "Pagar ahora"
   - **Resultado:** Error "Teléfono inválido (10 dígitos)"
3. Ingresar teléfono "1234567890" → Éxito

### Test 5: Doble Click en Pagar
1. Completar form correctamente
2. Hacer doble-click rápido en "Pagar ahora"
3. **Resultado:** Segundo click ignorado (botón disabled)

### Test 6: Refresh Durante Pago
1. Click en "Pagar ahora"
2. Durante loading (spinner), hacer refresh (F5)
3. **Resultado:** Checkout resetea, orden NO se crea

---

## 📊 DATOS DE PRUEBA

### Usuario Demo:
- **Nombre:** Juan Pérez
- **Teléfono:** 1123456789

### Productos Sugeridos:
- **Olla de Acero Inoxidable** (SKU: OLLA-ACERO-24CM) - $18.900
- **Juego de Platos 18 Piezas** (SKU: JUEGO-PLATOS-18PZ) - $24.500
- **Sartén Antiadherente** (SKU: SARTEN-TEFLON-28CM) - $12.800

### Tiendas:
- **store-001:** Bazar Casa Bella
- **store-002:** Bazar Don José

---

## 🐛 BUGS CONOCIDOS (Esperados en MVP)

1. **Undo en carrito:** Botón "Deshacer" muestra toast pero no restaura (TODO)
2. **Stock real:** No se decrementa al comprar (simulado)
3. **Multi-tab sync:** Si abrís 2 tabs, el carrito no se sincroniza (BroadcastChannel pendiente)
4. **Order persistence:** Se pierde al limpiar localStorage (DB futura)
5. **Validación de teléfono:** Solo valida cantidad de dígitos, no formato AR
6. **QR Code data:** Es mock, picker aún no implementado

---

## 🎨 UI/UX A VALIDAR

### Colores:
- Verde primary: `#10b981` (todos los CTAs principales)
- Azul: `#3b82f6` (MercadoPago, info cards)
- Amarillo: `#eab308` (estado PREPARING)
- Verde claro: `#dcfce7` (success cards)

### Animaciones:
- **Pulse:** Botón "Ir a Pagar" en carrito
- **Spin:** Loader durante procesamiento
- **Scale:** CheckCircle en confirmación
- **Confetti:** 30 partículas cayendo con rotación
- **Progress bar:** Smooth transition en estado del pedido

### Feedback Háptico:
- **Agregar al carrito:** 1 vibración corta
- **Pago exitoso:** [100, 50, 100]
- **Pedido listo:** [200, 100, 200, 100, 200]

### Toasts:
- **Success:** Verde con checkmark
- **Error:** Rojo con AlertCircle
- **Info:** Azul con Info icon
- **Action:** Con botón "Ver carrito" o "Deshacer"

---

## 📱 TESTING EN MOBILE

### Chrome DevTools (Desktop)
1. Abrir DevTools (F12)
2. Click en "Toggle device toolbar" (Ctrl+Shift+M)
3. Seleccionar "iPhone 14 Pro" o "Pixel 7"
4. Recargar página

### Testing Real (Mobile)
1. Conectar dispositivo a misma red WiFi
2. Obtener IP local: `ifconfig | grep inet` (macOS)
3. Abrir en mobile: `http://192.168.X.X:3000`
4. Probar vibración (solo funciona en dispositivo real)
5. Probar Web Share API (nativa en mobile)

---

## ✅ CHECKLIST FINAL

- [ ] Servidor corriendo en http://localhost:3000
- [ ] Catálogo carga correctamente
- [ ] Agregar 2+ productos al carrito
- [ ] Editar cantidades en carrito
- [ ] Proceder a checkout
- [ ] Completar formulario con validaciones
- [ ] Simular pago exitoso
- [ ] Observar transiciones automáticas de estado
- [ ] Ver confetti en confirmación
- [ ] Descargar QR code
- [ ] Compartir QR (test en mobile si es posible)
- [ ] Volver al inicio y verificar carrito vacío

---

## 🚨 REPORTE DE BUGS

Si encontrás un bug durante el testing:

1. **Descripción:** ¿Qué esperabas que pasara?
2. **Pasos para reproducir:** Lista exacta de clicks
3. **Resultado actual:** ¿Qué pasó en realidad?
4. **Screenshot:** Si es visual
5. **Consola:** Errores en DevTools Console (F12)

**Ejemplo:**
```
BUG: Toast no aparece al agregar producto
Pasos:
1. Ir a catálogo
2. Click en "Olla de Acero"
3. Click en "Agregar al carrito"
Resultado: Producto se agrega pero no hay toast
Esperado: Toast verde "✓ Producto agregado"
```

---

## 📚 REFERENCIAS

- **Código fuente:** `/src/app/tienda/[storeId]/`
- **Documentación:** `/docs/PROGRESS.md`
- **Resumen:** `/docs/SESION-13-ENERO-CHECKOUT.md`
- **Stores:** `/src/stores/useCartStore.ts`, `/src/stores/useUserStore.ts`
- **Types:** `/src/types/order.ts`, `/src/types/cart.ts`

---

**Happy Testing! 🎉**
