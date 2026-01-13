# Prototipo - Mobile First

**Descripción detallada:** Sistema que transforma el carrito virtual del cliente en instrucciones claras para que el personal prepare eficientemente el pedido. 

Sistema que transforma la experiencia de compra en tiendas físicas, permitiendo a los clientes seleccionar productos sin necesidad de cargarlos físicamente durante el recorrido.

### Proceso de compra y flow para el prototipo

**Conexión**: El cliente escanea con su camara el QR en la entrada para conectarse a la plataforma o ingresa manualmente al sitio por la web.

1. **Inicio**: Pagina inicial con Bienvenida : “Hola fulanito, bienvenido a la experiencia Shift en “nombre del local” opciones para Ver Carrito - Escanear Producto/Iniciar el recorrido - Acceso al sistema.
    
    La idea es que el home en definitiva sea una landing que deje ingresar al Portal de clientes y otra opcion que sea Portal Administrativo. (aca serian varias paginas, home-login y ambos home de portales - 4 pantallas en total-)
    
2. **Selección**: Escanea códigos QR/barras de los productos de muestra. Se permite escanear un QR y nos redirige automaticamente a la Pagina de Producto. Tambien necesitamos poder ver catalogo de productos desde una lista (todo esto podemos copiar exactamente a PedidosYA en muchas cosas. Aca tenemos por lo menos dos pantallas mas
3. **Pagina de Producto**: imagen del producto, detalles del producto escaneado,precio, selector de cantidades, stock disponible, observaciones, comparacion con otros productos, sugerencias de compras/productos combinables, ofertas, etc. Botones: Dejar, Agregar al pedido y Finalizar compra.  El carrito de compra como en el e-commerce?
    
    Cuando cargamos el producto podria salirnos un popup-modal que nos muestre ofertas que llevaron otros clientes con esos productos. (aca tenemos otra pagina y algunas funcionalidades key)
    
4. **Carrito**: Se simula un carrito con los productos cargados. Esencial agregar Ofertas, Descuentos por cantidad, Productos relacionados, etc. Esto lo dejaría en la ficha del producto. Agregaría: Por cada producto seleccionado , mostrar el precio, la cantidad y la posibilidad de eliminar el artículo o modificar la cantidad. Mostrar el resúmen de la compra: cantidad de productos, total a pagar, total ahorrado. Boton de IR a pagar.
    
    Aca lo mismo, ademas de la pagina de carrito con todo el stepper bien armado y guiado, tambien podriamos poner debajo un carousel con ofertas relacionadas a los productos que lleva el cliente
    
5. **Pago**: Puede agregarse una simulacion de pago con Mercadopago para mostrar la facilidad para concretar la compra.  La idea es mostrar como enviamos la data y como nos regresa.
6. **Preparacion**: Se envia la informacion al deposito de manera automatica. Lista de productos a preparar en orden de picking. Vital importancia el manejo y muestra de estados en esta etapa. ( Estado:  En preparación . Leyenda: estamos preparando tu pedido, tiempo estimado de preparación: 10 min , tenemos un café para vos. 
    
    Estas pantallas son clave y son Administrativas. Hacelas bien completas. Necesitamos la vista del cliente que espera el pedido (con indicaciones) y la Administrativa con todo el panel de control para el Empleado encargado de llevar el pedido y otra vista del Administrativo/Superadmin que controla y ve realtime todos los pedidos, monton, cantidad de items, etc. Tenemos varias pantallas mas aca.
    
7. **Retiro**: Pagina de confirmacion para retiro del producto. Se pueden mostrar detalles adicionales, factura, QR para validar el retiro( si el qr tiene que estar!). Estado: Pedido listo para retirar: Leyenda: tu pedido está listo, pasalo a retirar por el check out.. Estado: Pedido retiradp. Leyenda: Gracias por comprar con Shift en comercio.

Consideraciones

Los QR deben ser impresos y generados en base al “stock” del sitio de prueba. Al margen de ser un prototipo, se debe analizar la implementacion para la tienda de estos QR (de que forma los genera la plataforma, como se imprimen, etc).

El prototipo cubre el flow completo de una compra y de como seria el proceso interno para la recepcion y preparado de ese pedido. 

Backend para la gestión de pedidos:

1. Lista de pedidos
    1. A preparar( son los pedidos que fueron pagados)
        1. Pedido 1 —  PREPARAR
        2. Pedido 2— PREPARAR
    
    Al seleccionar PREPARAR se  abre el pedido con el listado detallado ordenado por picking . 
    
    Al finalizar seleccionar LISTO PARA ENTREGAR ( en este momento se le notifica al cliente( ruidito??)q el pedido está listo para retirar y el pedido para al listado Pedidos Preparados.
    
    Una vez que el cliente escanea el qr y retira el pedido pasa al listado Pedidos Entregados.
    
    La App en apariencia va a simular un sistema completamente funcional, pero el Inicio de Sesion o Acceso a la plataforma, Carga y Manejo de stock, Compra y Pick-up son simulados y no tendran una base de dato para persistir estos datos (es decir, son datos que se almacenan localmente en el celular y son eliminados a la brevedad).