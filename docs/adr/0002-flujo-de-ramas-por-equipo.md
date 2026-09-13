# ADR 0002: Flujo de ramas por equipo

- **Estado:** Aceptada
- **Fecha:** 2026-09-13
- **Decisores:** equipo Confluens
- **Historia relacionada:** setup inicial del repositorio (Sprint 1)

## Contexto

- El código lo escriben dos equipos que trabajan en paralelo, cada uno con varias historias de usuario por sprint.
- Una rama por HU generaría muchas ramas y PRs chicos para un equipo de estudiantes con tiempo acotado de revisión.
- `main` se despliega en producción (Vercel y Render), así que tiene que recibir solo código integrado y probado.

## Decisión

Usamos cuatro ramas permanentes:

- `equipo-1` y `equipo-2`: cada equipo pushea ahí todas sus HU en curso.
- `develop`: recibe los PRs de las ramas de equipo, después de revisión y CI en verde.
- `main`: recibe PRs desde `develop` cuando lo integrado está probado.

`develop` y `main` están protegidas en GitHub: solo aceptan PRs con los checks del CI en verde, la rama actualizada y 1 aprobación, sin force push ni borrado. Los PRs se mergean con merge commit y las ramas de equipo no se borran. Las ramas de equipo se actualizan con `merge` de `develop`, nunca con rebase.

La trazabilidad con Jira pasa de las ramas a los commits: cada commit lleva `tipo(HU-XX)`.

## Consecuencias

### Positivas

- Menos ramas y PRs que administrar; la revisión se hace por lote de HU.
- Cada equipo integra a su ritmo sin bloquear al otro.
- `develop` y `main` quedan protegidas: nadie puede romperlas con un push directo.

### Negativas

- Los PRs de equipo a `develop` son más grandes y cuesta más revisarlos.
- Una HU a medio terminar en la rama del equipo viaja a `develop` junto con las terminadas si se abre el PR en ese momento. Hay que coordinar cuándo integrar.
- Si los equipos tardan en traer `develop` a su rama, los conflictos crecen.
- No se puede aislar o revertir una HU sola con facilidad: sus commits están mezclados con los de otras HU de la misma rama.

### Acciones derivadas

- Definir en el Sprint Planning qué integrantes forman cada equipo (tabla en `AGENTS.md`).
- Mergear los PRs con "Create a merge commit".
