# ADR 0001: Stack tecnológico

- **Estado:** Aceptada
- **Fecha:** 2026-09-13
- **Decisores:** equipo Confluens
- **Historia relacionada:** setup inicial del repositorio (Sprint 1)

## Contexto

- Confluens gestiona el ciclo de eventos de Los Abuelos Servicios Gastronómicos SRL: cinco salones y un comedor, con consultas, presupuestos, prereservas, señas, confirmaciones, comandas de cocina y cobros. El backlog inicial tiene 56 historias de usuario, 13 epics y 255 story points.
- El núcleo del dominio es un calendario de salones: dos reservas del mismo salón no pueden solaparse. Conviene garantizarlo en la base de datos y no solo en la aplicación.
- El sistema necesita formularios con validaciones, vistas de calendario, reportes con gráficos y una landing pública.
- El equipo tiene 7 integrantes; 3 escriben código asistidos por agentes de IA (Claude Code y Codex CLI). Las convenciones tienen que ser explícitas, estar escritas en el repo y poder verificarse automáticamente.
- Es un proyecto académico sin presupuesto de infraestructura: el hosting tiene que entrar en planes gratuitos.

## Decisión

Monorepo con npm workspaces y TypeScript estricto de punta a punta:

| Capa                 | Tecnología                                                                   | Por qué                                                                                                       |
| -------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Lenguaje             | TypeScript 5.9 (`strict`)                                                    | Un solo lenguaje en front y back; los tipos son el contrato que respetan personas y agentes.                  |
| Runtime              | Node 20 LTS (≥ 20.19)                                                        | Versión soportada por todo el tooling elegido y por Render.                                                   |
| Monorepo             | npm workspaces: `apps/api`, `apps/web`, `packages/shared`                    | Comparte schemas y tipos entre front y back sin publicar paquetes ni sumar herramientas.                      |
| Frontend             | React 18.3 + Vite 7                                                          | Ecosistema maduro y build rápido.                                                                             |
| UI                   | Tailwind CSS 4 + shadcn/ui                                                   | Componentes accesibles copiados al repo y modificables; estilos consistentes sin CSS a medida.                |
| Estado de servidor   | TanStack Query 5                                                             | Cache, reintentos e invalidación de datos de la API sin estado global manual.                                 |
| Formularios          | React Hook Form 7 + Zod 4                                                    | Los mismos schemas de `packages/shared` validan en el formulario y en la API.                                 |
| Calendario           | FullCalendar 6                                                               | Vistas de mes, semana y día con recursos para la agenda de salones.                                           |
| Gráficos             | Recharts 3                                                                   | Reportes declarativos en React.                                                                               |
| Backend              | Express 4                                                                    | Framework simple, conocido por el equipo y bien documentado.                                                  |
| ORM                  | Prisma 7 con `@prisma/adapter-pg`                                            | Schema declarativo, migraciones versionadas y cliente tipado.                                                 |
| Documentación de API | OpenAPI 3 generado desde Zod (`@asteasolutions/zod-to-openapi` + Swagger UI) | La documentación sale de los mismos schemas y no queda desactualizada.                                        |
| Base de datos        | PostgreSQL 16 + extensión `btree_gist`                                       | `btree_gist` permite una restricción `EXCLUDE` que impide en la base que se solapen reservas del mismo salón. |
| Tests                | Vitest 4 + Supertest 7                                                       | Mismo runner en todos los workspaces; Supertest prueba endpoints sin levantar el servidor.                    |
| Calidad              | ESLint 9, Prettier 3, Husky 9, lint-staged 16, commitlint 20                 | Convenciones verificadas en cada commit, no solo escritas.                                                    |
| CI                   | GitHub Actions                                                               | Integrado al repo; corre typecheck, lint, build y test en cada PR.                                            |
| Entorno local        | Docker Compose, solo para PostgreSQL                                         | La base local es igual en todas las máquinas; el resto corre con Node directamente.                           |
| Deploy               | Vercel (web), Render (API), Neon (base)                                      | Planes gratuitos, deploy desde GitHub y Postgres administrado con branching.                                  |

## Consecuencias

### Positivas

- Front y back comparten schemas y tipos: si cambia un contrato, el typecheck lo detecta en ambos lados.
- La regla de no solapamiento de reservas queda protegida en la base de datos, incluso ante errores de la aplicación o concurrencia.
- Las convenciones se verifican con lint, commit hooks y CI, lo que reduce las diferencias entre el código de los tres agentes.
- Sin costo de infraestructura durante el cursado.

### Negativas

- **Node 20 terminó su soporte (EOL) en abril de 2026.** Obliga a usar líneas anteriores de varias herramientas (Vitest 4 en lugar de 5, ESLint 9 en lugar de 10, lint-staged 16, commitlint 20) y no recibe parches de seguridad.
- `packages/shared` se compila a `dist/`: la API y el typecheck dependen de ese build (los scripts de la raíz lo resuelven).
- Prisma 7 no carga `.env` solo y separa la URL de runtime (con pooling) de la de migraciones (directa en Neon): hay que mantener dos variables.
- Render en plan gratuito "duerme" la API tras un rato sin tráfico; el primer request después tarda.
- Front (Vercel) y API (Render) viven en dominios distintos: en producción hará falta configurar CORS o un proxy.

### Acciones derivadas

- Evaluar la migración a Node 22 LTS en un sprint futuro (nuevo ADR).
- Definir en el Sprint Planning el modelo de dominio y la estrategia de CORS para producción.
