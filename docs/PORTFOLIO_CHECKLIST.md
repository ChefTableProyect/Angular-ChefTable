# Checklist de portafolio

## Antes del commit

- [ ] Revisar `git diff` en frontend y backend.
- [ ] Confirmar que `.env`, credenciales y tokens no aparecen en `git status`.
- [ ] Ejecutar `npm run check` en Angular.
- [ ] Ejecutar `.\mvnw.cmd test` en Spring con Docker activo.
- [ ] Probar manualmente QR → menú → checkout → seguimiento → cocina.
- [ ] Crear commits descriptivos y separados por repositorio.

Commits sugeridos:

```text
feat(orders): complete table ordering flow
test(orders): cover idempotency and stock concurrency
docs(portfolio): document architecture and local setup
ci: verify frontend and backend on pull requests
```

## Antes de publicar

- [ ] Elegir hosting para Angular, Spring y MySQL.
- [ ] Configurar secretos únicamente en la plataforma.
- [ ] Aplicar migraciones en un ambiente nuevo.
- [ ] Crear usuarios de demostración sin reutilizar credenciales personales.
- [ ] Añadir URL pública y capturas al README.
- [ ] Verificar responsive, teclado y movimiento reducido.
- [ ] Confirmar que Swagger y endpoints internos no quedan expuestos sin autorización.

## Guion breve para entrevista

1. El carrito no reserva inventario; la API lo asigna al confirmar.
2. Los productos se bloquean en orden estable para evitar sobreventa y reducir deadlocks.
3. `Idempotency-Key` permite reintentar sin duplicar pedidos.
4. Angular usa features lazy-loaded, Signals y componentes standalone.
5. Los guards son experiencia de usuario; Spring Security es la frontera real.
6. El proyecto permanece como monolito modular porque el alcance no justifica microservicios.

## Mejoras posteriores, no bloqueantes

- Token opaco y revocable por QR en lugar del código visible de mesa.
- Prueba E2E del recorrido crítico.
- Observabilidad y health checks.
- Gestión administrativa de mesas, usuarios y QR.
- Actualización en tiempo real mediante SSE o WebSocket si las métricas lo justifican.
