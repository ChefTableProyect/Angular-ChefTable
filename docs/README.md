# Documentación de ChefTable

Esta carpeta es la fuente de verdad funcional y técnica de ChefTable. Sus decisiones aplican al frontend Angular, a la API Spring Boot y a la integración de la landing.

## Documentos

| Documento | Propósito |
| --- | --- |
| [PRODUCT.md](PRODUCT.md) | Define el problema, los usuarios, el alcance y los flujos del producto. |
| [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) | Define identidad visual, componentes, responsive design y accesibilidad. |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Define módulos, capas, lazy loading, dominio, API y aplicación de SOLID. |
| [DEVELOPMENT.md](DEVELOPMENT.md) | Establece configuración local, convenciones, pruebas y Definition of Done. |
| [ROADMAP.md](ROADMAP.md) | Ordena la implementación por fases y criterios de aceptación. |
| [PORTFOLIO_CHECKLIST.md](PORTFOLIO_CHECKLIST.md) | Define qué revisar antes del commit, publicación y entrevista. |

## Regla de mantenimiento

Cuando una decisión cambie el comportamiento del producto, su arquitectura o su diseño, el documento correspondiente debe actualizarse en el mismo pull request.

Las decisiones técnicas difíciles de revertir deberán registrarse posteriormente como ADR en `docs/decisions/`.
