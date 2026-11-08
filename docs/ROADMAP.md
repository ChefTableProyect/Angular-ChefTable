# Roadmap

El roadmap prioriza un flujo vertical completo antes de ampliar funcionalidades. Cada fase debe dejar el sistema utilizable y verificable.

> Estado actualizado: 7 de noviembre de 2026. Las tareas marcadas representan código implementado y verificado con las pruebas disponibles.

## Fase 0 — Seguridad y línea base

- [x] Confirmar que los secretos locales están ignorados y fuera del historial Git.
- [x] Mover credenciales de Spring a variables de entorno.
- [x] Corregir configuración de ambientes Angular.
- [x] Fijar Node.js 22 LTS mediante `engines`, `.nvmrc` y CI.
- [x] Eliminar logs de tokens, contraseñas y formularios.
- [x] Corregir el formulario de login.
- [x] Limpiar correctamente la sesión al cerrar sesión.
- [ ] Añadir lint, formatter y scripts reproducibles.
- [x] Sustituir pruebas generadas que ya no representan la aplicación.

### Criterio de salida

Frontend y backend compilan y ejecutan pruebas en CI sin credenciales versionadas ni errores conocidos en autenticación básica.

## Fase 1 — Fundamentos del producto

- [x] Crear migraciones para usuarios, roles, categorías, platos y mesas.
- [x] Introducir DTOs y validación en la API.
- [x] Cambiar precios de `double` a `BigDecimal`.
- [x] Crear roles `ADMIN` y `KITCHEN`.
- [x] Implementar autorización por endpoint.
- [x] Versionar la API bajo `/api/v1`.
- [x] Definir el formato común de errores.
- [x] Reorganizar Angular por features.
- [x] Configurar `provideHttpClient`, interceptores y guards.

### Criterio de salida

Un administrador autenticado puede gestionar categorías, platos y mesas mediante endpoints protegidos y contratos validados.

## Fase 2 — Menú y carrito profesional

- [x] Implementar landing dentro de Angular.
- [x] Crear layout público y navegación responsive.
- [x] Implementar menú lazy-loaded.
- [x] Añadir categorías, búsqueda y filtros.
- [ ] Crear detalle de plato.
- [x] Implementar estados loading, empty y error.
- [x] Crear `CartStore` con Signals.
- [x] Persistir el carrito mediante un adapter.
- [x] Diseñar drawer de escritorio y barra inferior móvil.
- [x] Validar el código de mesa contra la API antes de habilitar el carrito.

### Criterio de salida

Desde un teléfono, un cliente puede entrar por una mesa válida, explorar el menú y preparar un carrito persistente y accesible.

## Fase 3 — Pedidos end-to-end

- [x] Crear `Order` y `OrderItem` en la API.
- [x] Implementar creación transaccional del pedido.
- [x] Recalcular precios y validar stock en servidor.
- [x] Generar código público de seguimiento.
- [x] Crear pantalla de confirmación.
- [x] Implementar seguimiento del pedido.
- [x] Probar concurrencia, stock insuficiente, cancelaciones e idempotencia con Testcontainers.
- [ ] Añadir pruebas E2E del flujo completo.

### Criterio de salida

Un cliente puede confirmar un pedido real y consultar su estado sin acceder a información de otros pedidos.

## Fase 4 — Panel de cocina

- [x] Crear layout para personal.
- [x] Implementar cola de pedidos por estado y antigüedad.
- [x] Mostrar mesa, tiempo, ítems y observaciones.
- [x] Validar transiciones de estado en backend.
- [x] Añadir actualización periódica inicial.
- [ ] Evaluar SSE o WebSocket mediante ADR.
- [ ] Probar permisos y errores de concurrencia.

### Criterio de salida

Cocina puede procesar un pedido desde `CONFIRMED` hasta `READY` sin utilizar herramientas externas.

## Fase 5 — Administración

- [ ] Dashboard con métricas operativas básicas.
- [ ] CRUD de categorías.
- [x] CRUD de platos.
- [x] Activación y desactivación de disponibilidad.
- [ ] Gestión de mesas y generación de QR.
- [ ] Gestión de usuarios internos y roles.
- [ ] Confirmación segura de acciones destructivas.
- [ ] Paginación, búsqueda y filtros.

### Criterio de salida

El restaurante puede mantener su menú y operación diaria desde interfaces protegidas y auditables.

## Fase 6 — Calidad y despliegue

- [ ] Actualizar Angular una versión mayor a la vez hasta una versión soportada.
- [ ] Migrar la suite frontend a la herramienta de pruebas elegida para la versión objetivo.
- [ ] Optimizar imágenes y eliminar videos sin uso.
- [ ] Alojar fuentes localmente.
- [x] Aplicar presupuestos de bundle y estilos por componente.
- [ ] Ejecutar auditoría de accesibilidad.
- [ ] Añadir health checks y observabilidad básica.
- [ ] Crear ambientes de desarrollo, staging y producción.
- [ ] Documentar backup, migraciones y rollback.

### Criterio de salida

La aplicación se despliega de forma reproducible, cuenta con monitoreo básico y mantiene los flujos críticos cubiertos por pruebas automáticas.

## Siguiente hito recomendado

Cerrar la vertical implementada antes de ampliar el alcance:

1. Revisar y organizar los cambios en commits descriptivos para frontend y backend.
2. Ejecutar el flujo manual mesa → menú → checkout → seguimiento → cocina → listo.
3. Automatizar una prueba E2E del recorrido crítico.
4. Reemplazar el código visible de mesa por un token opaco y revocable para los QR.
5. Crear un entorno de staging y añadir su URL y capturas al README.
6. Ejecutar una auditoría formal de accesibilidad antes de ampliar administración y métricas.
