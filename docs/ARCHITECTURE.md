# Arquitectura técnica

## Objetivos

- Mantener cada feature aislada y cargada bajo demanda.
- Separar presentación, estado, casos de uso y acceso a datos.
- Evitar que los componentes conozcan detalles de HTTP o almacenamiento.
- Proteger las reglas de negocio en la API.
- Permitir que menú, pedidos, cocina y administración evolucionen de manera independiente.
- Mantener una arquitectura proporcional al tamaño del proyecto.

ChefTable no se dividirá en microservicios durante el MVP. Un frontend modular y un monolito modular en Spring Boot proporcionan suficiente separación sin añadir complejidad operacional.

## Repositorios

| Repositorio | Responsabilidad |
| --- | --- |
| `Angular-ChefTable` | Aplicación web pública y paneles internos. |
| `API-ChefTable` | API, autenticación, reglas de negocio y persistencia. |
| `ChefTable_LandingPage` | Referencia visual histórica; la landing activa ya vive en Angular. |

El repositorio HTML original puede archivarse: no se mantiene una segunda versión activa de la interfaz.

## Arquitectura del frontend

### Organización por feature

```text
src/app/
├── core/
│   ├── auth/
│   │   ├── auth.store.ts
│   │   ├── auth.guard.ts
│   │   └── role.guard.ts
│   ├── config/
│   ├── errors/
│   ├── http/
│   │   ├── auth.interceptor.ts
│   │   └── api-error.interceptor.ts
│   └── layouts/
│       ├── public-layout/
│       └── staff-layout/
├── shared/
│   ├── ui/
│   ├── pipes/
│   ├── directives/
│   ├── models/
│   └── utils/
└── features/
    ├── landing/
    ├── menu/
    │   ├── data-access/
    │   ├── feature-menu/
    │   ├── ui/
    │   └── menu.routes.ts
    ├── cart/
    ├── orders/
    ├── order-tracking/
    ├── auth/
    ├── kitchen/
    └── admin/
        ├── dashboard/
        ├── menu-management/
        ├── categories/
        ├── tables/
        └── admin.routes.ts
```

No todos los directorios deben crearse anticipadamente. Se agregan cuando la feature necesita esa responsabilidad.

### Capas de una feature

- `feature-*`: componentes de página y composición del caso de uso.
- `ui`: componentes presentacionales reutilizables dentro de la feature.
- `data-access`: API client, store, facade, DTOs y mappers.
- `util`: funciones puras específicas de la feature.

Una feature no importa internamente otra feature. La colaboración ocurre mediante servicios públicos en `core`, modelos compartidos justificados o navegación por rutas.

### Lazy loading

El límite de carga diferida será la feature, mediante `loadChildren`:

```ts
export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/landing/landing.routes').then((m) => m.LANDING_ROUTES),
  },
  {
    path: 'menu',
    loadChildren: () =>
      import('./features/menu/menu.routes').then((m) => m.MENU_ROUTES),
  },
  {
    path: 'orders',
    loadChildren: () =>
      import('./features/orders/order.routes').then((m) => m.ORDER_ROUTES),
  },
  {
    path: 'kitchen',
    canMatch: [kitchenGuard],
    loadChildren: () =>
      import('./features/kitchen/kitchen.routes').then((m) => m.KITCHEN_ROUTES),
  },
  {
    path: 'admin',
    canMatch: [adminGuard],
    loadChildren: () =>
      import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
];
```

Los componentes de una feature también pueden usar `loadComponent` cuando una página secundaria sea suficientemente pesada. Los guards del navegador mejoran la experiencia, pero la autorización real siempre se aplica en la API.

### Estado y flujo de datos

Se utilizarán Signals y servicios provistos en el nivel de ruta o feature. NgRx no forma parte del MVP.

```text
Page component
      |
      v
Facade / Store ----> estado con Signals
      |
      v
API client ----> HttpClient ----> API Spring
      |
      v
DTO mapper ----> modelo de dominio del frontend
```

Stores iniciales:

- `AuthStore`: identidad, sesión y roles.
- `CartStore`: ítems, cantidades, observaciones y persistencia local.
- `MenuStore`: consulta, categorías, filtros y disponibilidad.
- `OrderFacade`: confirmación y consulta de pedidos.

El carrito puede persistir una copia local, pero `localStorage` o `sessionStorage` se acceden detrás de un adapter; ningún componente los utiliza directamente.

### Modelos y contratos

Los DTO recibidos desde la API no se usan directamente como modelos de interfaz. Cada feature puede transformarlos mediante una función mapper pura.

```text
MenuItemResponse -> mapMenuItem() -> MenuItem
CreateOrderForm  -> mapCreateOrderRequest() -> CreateOrderRequest
```

Se prohíbe `any` en contratos HTTP. Las respuestas de error utilizan un formato común.

## Arquitectura del backend

### Monolito modular por feature

```text
com.cheftable
├── shared
│   ├── config
│   ├── errors
│   └── security
├── auth
│   ├── api
│   ├── application
│   ├── domain
│   └── infrastructure
├── menu
│   ├── api
│   ├── application
│   ├── domain
│   └── infrastructure
├── orders
│   ├── api
│   ├── application
│   ├── domain
│   └── infrastructure
└── tables
    ├── api
    ├── application
    ├── domain
    └── infrastructure
```

- `api`: controllers y DTOs HTTP.
- `application`: casos de uso y límites transaccionales.
- `domain`: reglas, entidades, value objects y contratos de repositorio.
- `infrastructure`: JPA, seguridad y adaptadores externos.

No se devolverán entidades JPA desde los controllers.

### Modelo de dominio inicial

```text
Category 1 --- * MenuItem
DiningTable 1 --- * Order
Order 1 --- * OrderItem
User * --- * Role
```

#### MenuItem

- `id`
- `name`
- `description`
- `price: BigDecimal`
- `imageUrl`
- `available`
- `stock`
- `categoryId`

#### Order

- `id`
- `publicCode`
- `tableId`
- `status`
- `total: BigDecimal`
- `createdAt`
- `updatedAt`
- `items`

#### OrderItem

- `menuItemId`
- `itemNameSnapshot`
- `unitPriceSnapshot`
- `quantity`
- `notes`
- `subtotal`

El snapshot evita que un cambio posterior del menú modifique pedidos históricos.

### API inicial

La API se versionará con el prefijo `/api/v1`.

| Método | Endpoint | Acceso | Uso |
| --- | --- | --- | --- |
| `GET` | `/menu/items` | Público | Consultar platos disponibles. |
| `GET` | `/menu/categories` | Público | Consultar categorías. |
| `GET` | `/tables/{code}` | Público limitado | Validar contexto de mesa. |
| `POST` | `/orders` | Público limitado | Confirmar pedido. |
| `GET` | `/orders/{publicCode}` | Público limitado | Consultar seguimiento. |
| `GET` | `/kitchen/orders` | `KITCHEN`, `ADMIN` | Consultar cola de cocina. |
| `PATCH` | `/kitchen/orders/{id}/status` | `KITCHEN`, `ADMIN` | Cambiar estado. |
| `POST` | `/admin/menu/items` | `ADMIN` | Crear plato. |
| `PUT` | `/admin/menu/items/{id}` | `ADMIN` | Actualizar plato. |
| `DELETE` | `/admin/menu/items/{id}` | `ADMIN` | Desactivar plato. |

Los endpoints administrativos de categorías, mesas y usuarios seguirán el mismo criterio.

### Errores

Formato base:

```json
{
  "type": "VALIDATION_ERROR",
  "title": "La solicitud contiene datos inválidos",
  "status": 400,
  "traceId": "identificador-de-correlacion",
  "fieldErrors": {
    "items[0].quantity": "Debe ser mayor que cero"
  }
}
```

No se exponen stack traces, nombres de tablas ni mensajes internos.

## Aplicación de SOLID

| Principio | Decisión |
| --- | --- |
| Responsabilidad única | Componentes presentan; stores coordinan estado; API clients comunican; casos de uso aplican reglas. |
| Abierto/cerrado | Estados y políticas se amplían mediante estrategias o nuevos casos de uso, sin condicionales distribuidos por la UI. |
| Sustitución de Liskov | Adapters como almacenamiento en memoria o navegador cumplen el mismo contrato observable. |
| Segregación de interfaces | `MenuApi`, `OrderApi`, `AuthApi` y `AdminApi` tienen superficies pequeñas. |
| Inversión de dependencias | Casos de uso dependen de contratos de repositorio; componentes dependen de facades, no de `HttpClient`. |

SOLID no implica crear abstracciones sin una segunda implementación o una razón de cambio identificada.

## Seguridad

- Todos los secretos se obtienen desde variables de entorno o un secret manager.
- Los secretos locales permanecen ignorados y fuera del historial Git.
- Las contraseñas se almacenan únicamente con un algoritmo seguro soportado por Spring Security.
- Los roles se verifican en backend con autorización por método o endpoint.
- Se aplican límites de frecuencia a login, validación de mesa y seguimiento público.
- La API valida cantidades, precios, mesa y transiciones de estado.
- CORS utiliza orígenes explícitos por ambiente.
- La estrategia definitiva de sesión será cookie `HttpOnly`, `Secure` y `SameSite`, o access token corto con renovación segura.
- Los logs no contienen contraseñas, tokens ni datos personales innecesarios.

## Pruebas

### Frontend

- Funciones puras y stores: pruebas unitarias.
- Componentes: comportamiento visible y accesibilidad básica.
- API clients: `HttpTestingController` o equivalente de la versión objetivo.
- Flujos críticos: pruebas E2E de menú, pedido, cocina y administración.

### Backend

- Dominio y casos de uso: pruebas unitarias.
- Repositorios: pruebas de integración con base de datos de prueba.
- Controllers y seguridad: pruebas de integración HTTP.
- Flujo de pedido y concurrencia de stock: pruebas transaccionales.

## Decisiones pendientes

Antes de implementar la autenticación definitiva se registrarán ADR para:

- estrategia de sesión y renovación;
- actualización de pedidos: polling, Server-Sent Events o WebSocket;
- almacenamiento y entrega de imágenes;
- despliegue de frontend, API y base de datos.
