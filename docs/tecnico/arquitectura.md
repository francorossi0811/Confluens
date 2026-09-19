# Arquitectura

Monorepo con npm workspaces. Docker solo para la base de datos local.

```
confluens/
├── apps/
│   ├── api/          Node 20 + Express 4 + TypeScript + Prisma
│   └── web/          React 18 + TypeScript + Vite
├── packages/
│   └── shared/       Tipos y schemas de Zod compartidos entre api y web
└── docs/
```

## Límites entre workspaces

`packages/shared` **no importa nada** de `apps/`. Es la única dependencia común y contiene los
schemas de Zod que validan tanto en el cliente como en el servidor, más los tipos derivados de
ellos. Si un tipo lo usan los dos lados, vive acá; si lo usa uno solo, vive en ese workspace.

`apps/web` nunca importa de `apps/api`, ni al revés. El contrato entre ambos es HTTP más los
tipos de `shared`.

## Capas en `apps/api`

```
routes/      → definición de endpoints y middleware
controllers/ → parseo del request, llamada al servicio, forma de la respuesta
services/    → lógica de negocio. Es donde viven las reglas RN-xx.
repositories/→ acceso a datos vía Prisma
```

Regla: los controllers no consultan Prisma directamente y los services no conocen `req` ni `res`.
La lógica de negocio tiene que poder testearse sin levantar el servidor.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18, Vite, Tailwind, shadcn/ui, TanStack Query, React Hook Form + Zod, FullCalendar, Recharts |
| Backend | Node 20 LTS, Express 4, TypeScript, Prisma, OpenAPI/Swagger |
| Base de datos | PostgreSQL 16 (Neon en la nube, Docker en local) |
| Tests | Vitest, Supertest, React Testing Library |
| CI/CD | GitHub Actions |
| Deploy | Vercel (web), Render (api), Neon (base) |

Las versiones se fijan sin `^` ni `~` en los `package.json`, para que los tres entornos de
desarrollo instalen exactamente lo mismo.

## Autenticación

JWT en cookie httpOnly, contraseñas con hash bcrypt. El middleware de autorización valida el rol
contra el enum definido en `dominio.md`. El rol `CLIENTE` existe en el enum desde el Sprint 1
aunque se active en el Sprint 2.

## Tareas programadas

`node-cron` en el proceso del backend, para el vencimiento de la seña (RN-06), la expiración de
presupuestos (RN-08) y el incremento mensual de precios. Requiere que el proceso se mantenga
activo: verificar el plan de Render antes de depender de esto en producción.
