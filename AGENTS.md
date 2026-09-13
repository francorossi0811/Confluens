# AGENTS.md

Guía única de convenciones de **Confluens**, para agentes de IA (Claude Code, Codex CLI) y para personas. Si algo no está cubierto acá, **preguntar antes de decidir**. Si una instrucción de la tarea contradice este archivo, avisar el conflicto en lugar de elegir en silencio.

## Proyecto

Sistema de gestión de eventos y servicios gastronómicos para Los Abuelos Servicios Gastronómicos SRL: cinco salones (Paraná, Iguazú, Pucará, Bariloche, Auditorio) y un comedor. Cubre consulta, presupuesto, prereserva, seña, confirmación, comanda de cocina y cobro, más una landing pública.

- Scrum, sprints de 2 semanas. Backlog en Jira: historias `HU-XX` agrupadas en epics.
- El **modelo de dominio lo define el equipo en el Sprint Planning**. No inventar entidades, modelos, campos ni endpoints de dominio.
- Términos del dominio: [docs/glosario.md](docs/glosario.md). Decisiones de arquitectura: [docs/adr/](docs/adr/).

## Stack (versiones exactas)

Todas las dependencias van fijadas sin `^` ni `~` (`.npmrc` tiene `save-exact=true`).

| Área                  | Paquetes                                                                                                                                                                                                                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Runtime               | Node 20 LTS (≥ 20.19, ver `.nvmrc`), npm workspaces                                                                                                                                                                                                                                                                 |
| Lenguaje              | typescript 5.9.3                                                                                                                                                                                                                                                                                                    |
| Frontend              | react 18.3.1, react-dom 18.3.1, vite 7.3.6, @vitejs/plugin-react 5.2.0                                                                                                                                                                                                                                              |
| Estilos y UI          | tailwindcss 4.3.3, @tailwindcss/vite 4.3.3, shadcn 4.21.0 (CLI y CSS base, estilo `radix-nova`), radix-ui 1.6.7, class-variance-authority 0.7.1, cn 0.3.0 (reemplaza a clsx + tailwind-merge), lucide-react 1.45.0, tw-animate-css 1.4.0                                                                            |
| Datos y formularios   | @tanstack/react-query 5.102.8, react-hook-form 7.88.0, @hookform/resolvers 5.9.1, zod 4.6.4                                                                                                                                                                                                                         |
| Calendario y gráficos | @fullcalendar/core, react, daygrid, timegrid, interaction 6.1.21; recharts 3.10.1 (+ react-is 18.3.1)                                                                                                                                                                                                               |
| Backend               | express 4.22.2, swagger-ui-express 5.0.1, @asteasolutions/zod-to-openapi 9.1.0, tsx 4.23.13 (dev)                                                                                                                                                                                                                   |
| Base de datos         | PostgreSQL 16 (`postgres:16.15-alpine` en local, Neon en la nube) con extensión `btree_gist`; prisma 7.10.0, @prisma/client 7.10.0, @prisma/adapter-pg 7.10.0                                                                                                                                                       |
| Tests                 | vitest 4.1.11, supertest 7.2.2                                                                                                                                                                                                                                                                                      |
| Calidad               | eslint 9.39.5, @eslint/js 9.39.5, typescript-eslint 8.70.0, eslint-plugin-react-hooks 7.1.1, eslint-plugin-react-refresh 0.5.6, eslint-config-prettier 10.1.8, globals 17.12.0, prettier 3.9.6, husky 9.1.7, lint-staged 16.4.0, @commitlint/cli 20.5.3, @commitlint/config-conventional 20.5.3, concurrently 9.2.4 |
| CI y deploy           | GitHub Actions; web en Vercel, API en Render, base en Neon                                                                                                                                                                                                                                                          |

Tipos: @types/node 20.19.43, @types/react 18.3.31, @types/react-dom 18.3.7, @types/express 4.17.25, @types/supertest 7.2.1, @types/swagger-ui-express 4.1.8.

## Estructura

```
.
├── apps/
│   ├── api/                      API REST. Único workspace que accede a la base de datos.
│   │   ├── prisma/
│   │   │   ├── schema.prisma     Modelos de datos (requiere aviso para modificar)
│   │   │   └── migrations/       Migraciones versionadas (no editar las ya aplicadas)
│   │   ├── prisma.config.ts      Config del CLI de Prisma (URL de conexión, rutas)
│   │   └── src/
│   │       ├── servidor.ts       Punto de entrada: valida el entorno y hace listen
│   │       ├── app.ts            Crea la app Express sin listen (la usan los tests)
│   │       ├── rutas.ts          Monta el router de cada módulo bajo /api
│   │       ├── config/           Variables de entorno validadas con Zod
│   │       ├── docs/             Registro OpenAPI (Swagger UI en /api/docs)
│   │       ├── lib/              Cliente Prisma, ErrorApi, helpers sin dominio
│   │       ├── middlewares/      Manejo de errores, validación con Zod
│   │       ├── modulos/<modulo>/ Un módulo por área del dominio (ver abajo)
│   │       └── generated/        Cliente Prisma generado. No versionado, no editar.
│   └── web/                      SPA React. Nunca accede a la base ni importa de apps/api.
│       ├── components.json       Configuración de shadcn/ui
│       └── src/
│           ├── main.tsx          Punto de entrada: providers (TanStack Query)
│           ├── App.tsx           Componente raíz
│           ├── components/ui/    Componentes de shadcn/ui (se agregan con `npx shadcn add`)
│           ├── components/       Componentes propios reutilizables
│           ├── paginas/          Una carpeta por pantalla o ruta
│           ├── hooks/            Hooks propios; queries y mutations de TanStack Query
│           └── lib/              utils.ts (cn), cliente de la API, helpers
├── packages/
│   └── shared/                   Código compartido por API y web
│       └── src/
│           ├── index.ts          Barrel: todo lo público se re-exporta desde acá
│           ├── api/              Contrato de respuesta y códigos de error
│           ├── esquemas/         Schemas de Zod (`<entidad>.esquema.ts`)
│           └── tipos/            Tipos que no se derivan de un schema
├── docs/                         Documentación y vault de Obsidian (ADR, glosario)
├── docker/postgres/init/         Scripts de init de la base local
└── .github/                      CI, plantilla de PR, CODEOWNERS
```

Las carpetas `components/`, `paginas/` y `hooks/` de la web y `modulos/` de la API se crean con la primera historia que las necesite.

### Qué va en cada workspace

- **`apps/api`**: reglas de negocio, acceso a datos (Prisma), autorización, endpoints HTTP y documentación OpenAPI. La API es la autoridad: toda regla de negocio se valida acá aunque la web también la valide.
- **`apps/web`**: pantallas, componentes, navegación, estado de UI y consumo de la API con TanStack Query. No contiene reglas de negocio autoritativas.
- **`packages/shared`**: schemas de Zod, tipos derivados (`z.infer`), constantes y el contrato de respuesta de la API. Solo TypeScript y Zod: **no puede importar** Express, Prisma, React ni nada de `apps/`.

### Schemas y tipos compartidos

- Los schemas de validación de entrada (body, query, params) y los tipos de las respuestas viven en `packages/shared/src/esquemas/`, un archivo por entidad: `<entidad>.esquema.ts`.
- Nombres: schema `esquemaCrearEntidad`; tipo derivado con el mismo nombre sin prefijo, `type CrearEntidad = z.infer<typeof esquemaCrearEntidad>`.
- Todo archivo nuevo se re-exporta desde el `index.ts` de su carpeta.
- En la web se usan con `zodResolver` de React Hook Form; en la API con el middleware `validar({ body, query, params })`.
- Los tipos de Prisma **no** se exportan a la web: la API mapea a los tipos de `shared`.
- `shared` se compila a `dist/`. En `npm run dev` se recompila solo (watch). Si el typecheck de API o web no ve un cambio de `shared`, correr `npm run build -w @confluens/shared`.

### Módulos de la API

Cada módulo en `apps/api/src/modulos/<modulo>/` sigue esta forma (`<modulo>` en plural y kebab-case):

| Archivo                   | Responsabilidad                                                                                          |
| ------------------------- | -------------------------------------------------------------------------------------------------------- |
| `<modulo>.rutas.ts`       | `Router` de Express, middlewares de validación y registro de las rutas en OpenAPI                        |
| `<modulo>.controlador.ts` | Traduce HTTP ↔ servicio: lee `req`, llama al servicio y arma la `RespuestaExito`. Sin lógica de negocio. |
| `<modulo>.servicio.ts`    | Lógica de negocio y acceso a datos con Prisma. Lanza `ErrorApi` ante reglas incumplidas.                 |
| `<modulo>.reglas.ts`      | (Opcional) Funciones puras de negocio (cálculos, validaciones de estado), testeables sin base de datos   |
| `*.test.ts`               | Tests junto al archivo que prueban                                                                       |

Los handlers async se envuelven con `asincrono()` (`src/lib/asincrono.ts`): Express 4 no captura errores de promesas.

## Convenciones de nombres

- **Idioma: español** en todo el código propio (variables, funciones, tipos, clases, archivos, carpetas), commits, PRs y documentación.
  - **Sin tildes ni ñ** en identificadores y nombres de archivo: `salon`, `sena`, `tamanioPagina`, `comanda`.
  - Excepciones: APIs de librerías, nombres impuestos por herramientas (`main.tsx`, `App.tsx`, `vite.config.ts`, `index.ts`, archivos de `components/ui/` generados por shadcn), las claves JSON del contrato de respuesta (`data`, `meta`, `error`, `code`, `message`, `details`) y los valores de `code`.
- **Carpetas:** kebab-case (`modulos/reservas-salon/`).
- **Archivos TypeScript que no son componentes:** kebab-case, con sufijo de rol cuando aplica (`reservas.servicio.ts`, `manejador-errores.ts`, `pago.esquema.ts`).
- **Componentes React:** PascalCase, un componente por archivo, el archivo se llama igual que el componente (`CalendarioSalones.tsx`). Export nombrado; `App.tsx` es la única excepción con export default.
- **Hooks:** `use-nombre.ts` exporta `useNombre`.
- **Identificadores:** variables y funciones en camelCase; tipos, interfaces, clases y componentes en PascalCase; constantes globales inmutables en UPPER_SNAKE_CASE.
- **Imports:** en `apps/api` y `packages/shared` los imports relativos llevan extensión `.js` (`import { x } from './x.js'`), como exige NodeNext. En `apps/web` se usa el alias `@/` para `src/`. Los imports de solo tipos usan `import type` (lo exige ESLint).
- **Rutas HTTP:** kebab-case y en plural, en español (`/api/<recursos>/:id`).

## Formato de respuesta de la API

Los tipos están en `packages/shared/src/api/respuesta.ts`. Todas las respuestas JSON siguen este contrato.

**Éxito:** status 200 (consulta o actualización), 201 (creación) o 204 (sin cuerpo).

```json
{ "data": {} }
```

Listados paginados:

```json
{ "data": [], "meta": { "page": 1, "pageSize": 20, "total": 134 } }
```

**Error:**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Los datos enviados no son válidos",
    "details": [{ "campo": "fechaInicio", "mensaje": "Fecha inválida" }]
  }
}
```

| Status | `code`                    | Cuándo                                                                    |
| ------ | ------------------------- | ------------------------------------------------------------------------- |
| 400    | `VALIDATION_ERROR`        | Body, query o params no pasan el schema de Zod, o el JSON está malformado |
| 401    | `UNAUTHENTICATED`         | Falta sesión o es inválida                                                |
| 403    | `FORBIDDEN`               | Autenticado pero sin permiso                                              |
| 404    | `NOT_FOUND`               | El recurso o la ruta no existen                                           |
| 409    | `CONFLICT`                | Conflicto con el estado actual (por ejemplo, solapamiento de reservas)    |
| 422    | `BUSINESS_RULE_VIOLATION` | Datos válidos que violan una regla de negocio                             |
| 500    | `INTERNAL_ERROR`          | Error no previsto. Nunca se exponen detalles internos ni stack traces.    |

Reglas:

- Los errores esperados se lanzan con `ErrorApi` (`src/lib/errores.ts`); nunca armar `res.status(4xx).json(...)` a mano.
- Los errores llegan al middleware `manejadorErrores`, que es el único que escribe respuestas de error. Los `ZodError` se convierten solos en 400.
- `message` está en español y es mostrable al usuario; `code` es estable y la web decide con él.
- Agregar un `code` nuevo implica editar `CODIGOS_ERROR` en `shared` y esta tabla.
- Todo endpoint se registra en OpenAPI (`registroOpenApi.registerPath`) con los schemas de `shared`.

## Comandos

Desde la raíz:

| Comando                                      | Qué hace                                                                                             |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `npm run dev`                                | Levanta shared (watch), API (http://localhost:3000, docs en /api/docs) y web (http://localhost:5173) |
| `npm run build`                              | Compila shared, API y web                                                                            |
| `npm run typecheck`                          | Compila shared y chequea tipos en todos los workspaces                                               |
| `npm run lint`                               | ESLint en todos los workspaces                                                                       |
| `npm run test`                               | Vitest en todos los workspaces                                                                       |
| `npm run format` / `format:check`            | Prettier                                                                                             |
| `npm run db:up` / `db:down`                  | Levanta o baja PostgreSQL local (Docker)                                                             |
| `npm run prisma:migrate -w @confluens/api`   | Crea y aplica una migración en local (`prisma migrate dev`)                                          |
| `npm run prisma:deploy -w @confluens/api`    | Aplica migraciones pendientes (CI y producción)                                                      |
| `npm run <script> -w @confluens/<workspace>` | Corre un script en un solo workspace                                                                 |

## Tests

- Vitest en todos los workspaces; Supertest para endpoints de la API sobre `crearApp()` (sin `listen`).
- Archivos `*.test.ts` o `*.test.tsx` al lado del código que prueban.
- **Se testea:** reglas de negocio (solapamiento de reservas, cálculos de presupuestos y señas, transiciones de estado de un evento), funciones de `*.reglas.ts`, schemas de Zod con refinamientos no triviales, middlewares y endpoints que tengan lógica (status, formato de error, permisos).
- **No se testea:** CRUD simple sin reglas, componentes solo presentacionales, código generado (`generated/`, `components/ui/`) ni configuración.
- Los tests no deben depender de servicios externos ni de datos de Neon.
- Toda corrección de un bug de lógica incluye un test que lo reproduce.

## Git, ramas y commits

- `main` = lo desplegado en producción. `develop` = integración. **No se pushea directo a ninguna de las dos**: todo entra por PR a `develop`.
- Una historia por rama y por PR.
- Ramas: `feat/HU-XX-descripcion-corta`, `fix/HU-XX-descripcion-corta`. Tareas sin historia: `chore/descripcion-corta`, `docs/descripcion-corta`.
- Commits en formato Conventional Commits, validados por commitlint:
  - `feat(HU-XX): agrega alta de ...`
  - `fix(HU-XX): corrige ...`
  - Tipos: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `ci`, `build`, `perf`, `style`.
  - Descripción en español, en minúscula, en presente (`agrega`, `corrige`), sin punto final.
  - Commits atómicos: un cambio lógico por commit.
- Los hooks de Husky corren lint-staged (ESLint + Prettier sobre lo staged) y commitlint. **Nunca usar `--no-verify`.**
- El PR usa la plantilla de `.github/pull_request_template.md` y necesita CI en verde.

## Definition of Done

Una historia está terminada cuando:

1. Cumple todos sus criterios de aceptación.
2. `typecheck`, `lint`, `test` y `build` pasan en CI.
3. La lógica de negocio nueva o modificada tiene tests.
4. Los endpoints nuevos respetan el formato de respuesta y están documentados en OpenAPI.
5. Los schemas y tipos compartidos están en `packages/shared`.
6. Si cambió el modelo de datos, el cambio fue acordado con el equipo y la migración de Prisma está incluida.
7. No hay `console.log` de depuración, código comentado ni `TODO` sin historia asociada.
8. La documentación afectada está actualizada (este archivo, ADR, glosario).
9. El PR fue revisado y aprobado por al menos otro integrante y está mergeado en `develop`.
10. La historia está movida a Done en Jira.

## Límites para agentes de IA

**Antes de hacer cualquiera de estas cosas, un agente tiene que detenerse, explicar qué quiere cambiar y por qué, y esperar confirmación:**

- Modificar `apps/api/prisma/schema.prisma` o crear, editar o borrar migraciones.
- Instalar, actualizar o desinstalar dependencias (incluye las que agregan CLIs como `shadcn` o `prisma init`).
- Tocar configuración compartida: `eslint.config.js`, `tsconfig*.json`, `.prettierrc.json`, `.prettierignore`, `commitlint.config.js`, `.lintstagedrc.json`, `.husky/`, `.github/`, `docker-compose.yml`, `prisma.config.ts`, `vite.config.ts`, `components.json`, `.npmrc`, `.nvmrc` o los `scripts` de cualquier `package.json`.
- Editar archivos de un workspace que no sea el de la historia en curso (por ejemplo, tocar `apps/api` en una historia de UI). Si la historia necesita cambios en `packages/shared`, avisarlo al empezar.
- Crear entidades, modelos o endpoints de dominio que no estén en la historia.
- Agregar códigos de error o cambiar el contrato de respuesta.

**Nunca:**

- Tocar la carpeta `.claude/` de la raíz (skills del equipo) ni commitear `.claude/settings.local.json`.
- Commitear `.env` ni credenciales, ni poner valores reales en `.env.example`.
- Pushear a `main` o `develop`, forzar push en ramas compartidas o saltear hooks con `--no-verify`.
- Editar código generado (`apps/api/src/generated/`) ni migraciones ya aplicadas.
- Desactivar reglas de ESLint o de TypeScript (`// eslint-disable`, `@ts-ignore`, `any`) para que algo compile, sin explicarlo en el PR.
