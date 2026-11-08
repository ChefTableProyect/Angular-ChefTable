# Sistema de diseño y experiencia de usuario

## Objetivo visual

ChefTable debe sentirse como un restaurante contemporáneo, cercano y confiable. La interfaz debe dar protagonismo a la comida y mantener las acciones principales obvias, especialmente desde un teléfono.

La dirección visual evita el aspecto genérico de un panel Bootstrap y utiliza una identidad gastronómica cálida.

## Principios

1. **La comida es protagonista:** fotografías consistentes y contenido fácil de explorar.
2. **Una acción principal por pantalla:** reducir decisiones innecesarias.
3. **Diseñado primero para móvil:** el cliente usará principalmente su teléfono en la mesa.
4. **Estado siempre visible:** carga, disponibilidad, confirmación y progreso deben comunicarse.
5. **Accesibilidad desde el inicio:** no se considera una mejora posterior.

## Identidad

### Paleta propuesta

Los valores son tokens iniciales y deben validarse visualmente antes de cerrar la implementación.

```css
:root {
  --color-cream-50: #fffaf2;
  --color-cream-100: #f7efdf;
  --color-charcoal-900: #20231f;
  --color-olive-800: #2f3b2f;
  --color-olive-700: #3f513f;
  --color-terracotta-600: #b95435;
  --color-terracotta-700: #994129;
  --color-gold-500: #c49a52;
  --color-success-600: #39734d;
  --color-warning-600: #a46514;
  --color-danger-600: #b23a3a;
  --color-white: #ffffff;
}
```

Todos los pares de texto y fondo deben alcanzar contraste WCAG AA.

### Tipografía

- Títulos: una serif editorial, por ejemplo `Fraunces`.
- Interfaz y lectura: una sans-serif, por ejemplo `Inter`.
- Fallback: fuentes del sistema.

Las fuentes deben alojarse localmente para evitar dependencias externas durante el build y mejorar privacidad y rendimiento.

| Token | Tamaño | Uso |
| --- | --- | --- |
| `display` | `clamp(2.5rem, 7vw, 5rem)` | Hero |
| `h1` | `clamp(2rem, 5vw, 3.5rem)` | Título de página |
| `h2` | `clamp(1.5rem, 3vw, 2.25rem)` | Secciones |
| `h3` | `1.25rem` | Tarjetas y grupos |
| `body` | `1rem` | Texto general |
| `small` | `0.875rem` | Ayuda y metadatos |

### Espaciado

Se utiliza una escala base de 4 px:

```text
4, 8, 12, 16, 24, 32, 48, 64, 96
```

No deben introducirse valores arbitrarios si un token existente resuelve el caso.

### Bordes y elevación

```css
--radius-sm: 0.5rem;
--radius-md: 0.875rem;
--radius-lg: 1.5rem;
--shadow-sm: 0 2px 10px rgb(32 35 31 / 8%);
--shadow-md: 0 12px 30px rgb(32 35 31 / 14%);
```

## Estructura de la landing

1. Navbar con logo, menú, cómo funciona y acceso de personal.
2. Hero con el mensaje `Ordena desde tu mesa, sin esperas`.
3. CTA principal `Ver menú`.
4. Proceso en tres pasos: `Escanea`, `Elige`, `Disfruta`.
5. Platos destacados obtenidos desde la API.
6. Historia breve y auténtica del restaurante.
7. Ubicación, horario y contacto.
8. CTA final y footer.

No deben mostrarse testimonios, direcciones o datos ficticios como si fueran reales. Mientras el producto sea una demostración, el contenido deberá indicarlo claramente.

## Componentes principales

### Botones

- `primary`: acción principal de la pantalla.
- `secondary`: alternativa relevante.
- `ghost`: navegación o acción de bajo énfasis.
- `danger`: operación destructiva con confirmación.

Todos deben incluir estados `hover`, `focus-visible`, `disabled` y `loading`.

### Tarjeta de plato

- Imagen con relación de aspecto constante.
- Nombre y descripción de máximo tres líneas.
- Precio con formato local.
- Categoría o etiquetas relevantes.
- Estado de disponibilidad.
- Acción `Agregar`.

### Carrito

- En móvil: barra inferior con cantidad, total y botón para revisar.
- En escritorio: drawer lateral.
- Permite modificar cantidades, eliminar y agregar observaciones.
- Muestra un resumen antes de confirmar.
- Nunca permite confirmar sin una mesa válida.

### Estado del pedido

Debe utilizar una línea de progreso comprensible con texto, no depender únicamente del color. Las fechas y horas se muestran en la zona horaria del restaurante.

### Tablas administrativas

- Deben adaptarse a pantallas pequeñas o transformarse en tarjetas.
- Incluyen búsqueda, filtros, paginación y estados vacíos.
- Las acciones destructivas requieren confirmación.

## Estados obligatorios

Cada feature que consuma datos debe diseñar:

- carga inicial con skeleton;
- lista vacía;
- error recuperable con botón para reintentar;
- error de permisos;
- contenido cargado;
- confirmación de operación exitosa.

No se utilizarán loaders de pantalla completa para operaciones pequeñas.

## Accesibilidad

- Documento y contenido en español con `lang="es"`.
- Navegación completa mediante teclado.
- Foco visible y orden lógico.
- Áreas táctiles mínimas de 44 × 44 px.
- Etiquetas asociadas a controles de formulario.
- Mensajes de error vinculados mediante `aria-describedby`.
- Modal y drawer con control de foco y cierre mediante `Escape`.
- Imágenes informativas con texto alternativo útil; decorativas con `alt=""`.
- Animaciones respetando `prefers-reduced-motion`.
- No utilizar enlaces sin `href` como botones.

## Contenido y formato

- Moneda inicial: soles peruanos mediante `Intl.NumberFormat` con locale `es-PE` y moneda `PEN`.
- Fechas y horas: formato `es-PE`.
- Cantidades y precios no se concatenan manualmente.
- Los errores técnicos se registran, pero no se muestran literalmente al cliente.

## Criterio de aceptación visual

Una pantalla se considera terminada cuando:

- funciona en móvil, tablet y escritorio;
- incluye todos sus estados;
- es navegable con teclado;
- no presenta desplazamiento horizontal accidental;
- utiliza tokens en lugar de colores o espacios aislados;
- mantiene jerarquía visual clara;
- fue comparada con su referencia visual o diseño aprobado.
