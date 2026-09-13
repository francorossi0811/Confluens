## Historia de usuario

Resuelve: HU-XX — <!-- título de la historia en Jira -->

## Qué cambió

<!-- Resumen de los cambios y por qué. Mencionar decisiones que el revisor tenga que validar. -->

-

## Cómo se probó

<!-- Tests agregados, pasos manuales para reproducir, capturas si hay cambios de UI. -->

-

## Checklist de Definition of Done

- [ ] Cumple todos los criterios de aceptación de la HU
- [ ] `npm run typecheck`, `npm run lint`, `npm run test` y `npm run build` pasan (CI en verde)
- [ ] La lógica de negocio nueva tiene tests
- [ ] Los endpoints nuevos usan el formato estándar de respuesta y están registrados en OpenAPI
- [ ] Los schemas de Zod y tipos compartidos están en `packages/shared`
- [ ] Si cambió `schema.prisma`: el cambio fue acordado con el equipo y la migración está incluida
- [ ] No se agregaron dependencias sin acordarlo con el equipo
- [ ] Sin `console.log` de depuración ni código comentado
- [ ] Documentación actualizada si cambió una convención (`AGENTS.md`, ADR, glosario)
- [ ] La rama y los commits referencian la HU (`feat/HU-XX-...`, `feat(HU-XX): ...`)
