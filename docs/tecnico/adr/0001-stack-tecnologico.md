# ADR 0001 — Stack tecnológico

**Fecha:** 2026-09  ·  **Estado:** aceptada

## Contexto

Equipo de siete personas, tres de las cuales escriben código asistidas por agentes de IA, con
seis sprints de dos semanas y sin experiencia previa compartida en un mismo stack. El producto
es una aplicación web de gestión con agenda, presupuestos y cobranzas, para un cliente real.

## Decisión

TypeScript de punta a punta: React 18 con Vite en el frontend, Node 20 con Express 4 en el
backend, Prisma sobre PostgreSQL 16. Monorepo con npm workspaces y un paquete `shared` con los
schemas de Zod que validan de los dos lados. Despliegue en Vercel, Render y Neon.

## Consecuencias

**A favor.** Un solo lenguaje reduce el costo de que cualquiera del equipo toque cualquier parte.
Los schemas de Zod compartidos eliminan la desincronización entre lo que valida el formulario y
lo que valida la API. Prisma genera tipos desde el esquema, así que el modelo de datos es la
única fuente de verdad de los tipos del backend. Las tres plataformas de despliegue tienen plan
gratuito suficiente para el proyecto.

**En contra.** Prisma no genera restricciones de exclusión, y el no solapamiento de reservas las
necesita, así que hay SQL crudo en las migraciones. El plan gratuito de Render suspende procesos
inactivos, lo que afecta a las tareas programadas de `node-cron`. Express 4 no trae validación ni
manejo de errores, hay que construirlos.

**Alternativas descartadas.** Spring Boot, que varios del equipo conocían, pero obligaba a dos
lenguajes y perdía los schemas compartidos. Next.js, que resolvía el frontend público pero
mezclaba responsabilidades que el equipo prefirió mantener separadas.
