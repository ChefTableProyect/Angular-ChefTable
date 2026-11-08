# Guía de desarrollo

## Requisitos

- Node.js 22 LTS. No utilizar versiones impares de Node.
- npm compatible con la versión fijada del proyecto.
- Java 17.
- Docker Desktop o MySQL 8 para desarrollo local.
- Git.

Angular 19 es la versión actual del repositorio, pero está fuera de soporte. La actualización se realizará una versión mayor a la vez después de estabilizar la base y las pruebas.

## Repositorios locales esperados

```text
Programacion/
├── angular/Angular-ChefTable
├── spring/API-ChefTable
└── html/ChefTable_LandingPage
```

El repositorio HTML es una referencia temporal. Las nuevas pantallas públicas se implementan en Angular.

## Configuración segura

Nunca se versionan:

- contraseñas de bases de datos;
- secretos JWT;
- claves privadas de CAPTCHA;
- tokens de acceso;
- archivos `.env` reales.

La API deberá leer variables equivalentes a:

```text
DB_URL=jdbc:mysql://localhost:3306/cheftable
DB_USERNAME=cheftable
DB_PASSWORD=valor-local
JWT_SECRET=secreto-base64-de-al-menos-256-bits
JWT_TTL_SECONDS=900
CORS_ALLOWED_ORIGINS=http://localhost:4200
```

Se versionará solamente un archivo de ejemplo sin valores sensibles. Si una credencial llegara a aparecer en Git, debe rotarse; eliminarla del archivo actual no invalidaría las copias históricas.

## Ejecución

### Frontend

```bash
npm ci
npm start
```

Comandos disponibles:

```bash
npm run build
npm test
npm run test:watch
npm run check
```

### Backend

En Windows:

```powershell
.\mvnw.cmd spring-boot:run
.\mvnw.cmd test
```

La API se ejecuta en `http://localhost:8080` y el frontend en `http://localhost:4200`.

`JWT_SECRET` debe estar codificado en Base64. Puede generarse a partir de 32 bytes aleatorios; nunca se debe reutilizar el secreto de producción en desarrollo.

## Flujo de Git

- La rama principal debe permanecer compilable.
- Las ramas nuevas usan prefijos como `feat/`, `fix/`, `refactor/`, `test/` y `docs/`.
- Un cambio funcional incluye código, pruebas y documentación afectada.
- No se mezclan refactors generales con nuevas funcionalidades salvo que sean inseparables.
- Antes de integrar: build, lint y tests deben aprobar.

Formato sugerido de commits:

```text
feat(orders): create customer order flow
fix(auth): clear session on logout
refactor(menu): extract menu facade
test(kitchen): cover valid status transitions
docs(architecture): record session strategy
```

## Convenciones Angular

- Organización por feature, no por tipo global de archivo.
- Componentes standalone.
- Lazy loading mediante `loadChildren` en los límites de feature.
- Change detection `OnPush` en componentes.
- Signals para estado local y de feature.
- Formularios reactivos tipados.
- `provideHttpClient` e interceptores funcionales.
- Modelos y respuestas HTTP tipados; no utilizar `any`.
- Componentes presentacionales sin llamadas HTTP.
- No acceder directamente a `localStorage` o `sessionStorage` desde componentes.
- Métodos, propiedades y archivos en inglés; textos visibles al usuario en español.
- Nombres de métodos que expresen intención: `addItem`, no `AgregarCarrito1`.
- Formato monetario y fechas mediante APIs de internacionalización.
- No dejar `console.log`, datos de prueba o comentarios muertos en producción.

## Convenciones Spring Boot

- Inyección exclusivamente por constructor.
- Organización por feature y capas internas.
- DTOs separados de entidades JPA.
- `BigDecimal` para dinero.
- Bean Validation en requests.
- `@Transactional` en casos de uso que modifican múltiples recursos.
- Excepciones transformadas por un handler global.
- Respuestas HTTP semánticas y tipadas.
- Repositorios definidos por contratos pequeños.
- Sin reglas de negocio en controllers.
- Sin secretos en `application.properties`.
- Migraciones de esquema mediante Flyway; no editar producción manualmente.

## Estrategia de pruebas

Una prueba debe verificar comportamiento, no detalles privados de implementación.

Prioridades:

1. Cálculo y validación del pedido.
2. Transiciones válidas e inválidas de estado.
3. Disponibilidad y concurrencia de stock.
4. Autorización por roles.
5. Persistencia del carrito.
6. Flujos de error y reintento.
7. Accesibilidad de formularios y navegación crítica.

Los tests generados que solo comprueban `should create` deben reemplazarse por escenarios útiles.

## Revisión de código

Durante una revisión se comprueba:

- comportamiento correcto y casos límite;
- claridad de nombres y responsabilidades;
- ausencia de secretos y datos sensibles;
- contrato API compatible;
- estados de carga, vacío y error;
- accesibilidad y responsive design;
- pruebas proporcionales al riesgo;
- documentación actualizada.

## Definition of Done

Una tarea se considera terminada cuando:

- cumple sus criterios de aceptación;
- no introduce errores de compilación, lint o tipos;
- incluye pruebas relevantes;
- maneja error, carga y resultado vacío cuando corresponde;
- funciona en móvil y escritorio si tiene interfaz;
- respeta controles de autorización;
- no contiene secretos ni logs sensibles;
- actualiza documentación o contrato API cuando aplica;
- puede ser revisada sin depender de cambios locales no versionados.
