# Visión del producto

## Resumen

ChefTable es una plataforma de pedidos en mesa para restaurantes. Permite que un cliente escanee el código QR de su mesa, consulte el menú, personalice su selección, confirme un pedido y siga su estado sin esperar a que un mesero tome la orden.

El sistema también ofrece interfaces de trabajo para cocina y administración.

## Problema

En un restaurante tradicional, tomar una orden y comunicar su avance depende de interacciones manuales. Esto puede generar:

- esperas innecesarias;
- errores al comunicar platos u observaciones;
- poca visibilidad del estado del pedido;
- dificultad para organizar los pedidos en cocina.

## Usuarios y responsabilidades

### Cliente

- Accede al menú desde una mesa válida.
- Explora categorías y platos.
- Consulta precio, descripción, alérgenos y disponibilidad.
- Agrega observaciones a cada ítem.
- Confirma el pedido.
- Consulta el estado mediante un código público no predecible.

El cliente no necesita crear una cuenta para ordenar.

### Personal de cocina

- Consulta pedidos confirmados.
- Cambia su estado a `PREPARING`, `READY` o `CANCELLED`.
- Visualiza mesa, hora, detalle y observaciones.

### Administrador

- Gestiona categorías y platos.
- Controla disponibilidad y stock.
- Gestiona mesas y códigos QR.
- Gestiona usuarios internos y roles.
- Consulta indicadores operativos básicos.

### Mesero — posterior al MVP

- Consulta el estado de las mesas.
- Confirma la entrega de pedidos.
- Registra pedidos asistidos cuando sea necesario.

## Flujo principal

1. El cliente escanea el QR de una mesa.
2. La aplicación valida el código y conserva el contexto de la mesa.
3. El cliente explora el menú y agrega ítems.
4. Revisa cantidades, observaciones y total estimado.
5. Confirma el pedido.
6. La API valida precios, disponibilidad y mesa.
7. Cocina recibe el pedido.
8. El cliente ve los cambios de estado.
9. El pedido se marca como entregado.

## Estados del pedido

```text
DRAFT -> CONFIRMED -> PREPARING -> READY -> DELIVERED
                  \-> CANCELLED
```

- `DRAFT`: existe solamente en el dispositivo del cliente.
- `CONFIRMED`: la API aceptó y registró el pedido.
- `PREPARING`: cocina empezó la preparación.
- `READY`: el pedido está listo para entregar.
- `DELIVERED`: el pedido fue entregado.
- `CANCELLED`: el pedido fue cancelado con un motivo.

No se permiten transiciones arbitrarias. La API es responsable de validar cada cambio.

## Alcance del MVP

- Landing pública integrada en Angular.
- Menú público por categorías.
- Búsqueda y filtros básicos.
- Detalle de plato y disponibilidad.
- Acceso mediante código de mesa.
- Carrito persistente durante la sesión.
- Creación y seguimiento de pedidos.
- Panel de cocina.
- Panel administrativo para platos, categorías y mesas.
- Login exclusivo para personal.
- Roles `ADMIN` y `KITCHEN`.
- Estados de carga, vacío y error.
- Diseño responsive y accesible.

## Fuera del MVP

- Pago en línea.
- Delivery y geolocalización.
- Reservas de mesa.
- Programa de fidelización.
- División de cuenta.
- Integraciones con impresoras o sistemas POS.
- Notificaciones push.
- Analítica avanzada.

Estas funciones no deben incorporarse hasta completar y validar el flujo principal.

## Reglas de negocio iniciales

- Los precios y totales siempre se calculan nuevamente en la API.
- Un cliente no puede ordenar desde una mesa inactiva.
- Un plato no disponible no puede formar parte de un pedido nuevo.
- Un pedido confirmado conserva el nombre y precio del plato en cada `OrderItem`, aunque el menú cambie después.
- El stock se descuenta de forma transaccional al confirmar el pedido.
- Las operaciones administrativas requieren autenticación y rol válido.
- El código público de seguimiento no expone identificadores secuenciales.

## Indicadores de éxito

- Porcentaje de pedidos creados sin error.
- Tiempo entre `CONFIRMED` y `READY`.
- Número de intentos de confirmación rechazados por disponibilidad.
- Tasa de recuperación frente a errores de red.
- Correcta finalización del flujo en móvil y escritorio.
