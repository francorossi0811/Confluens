# docs — Contexto del proyecto Confluens

Esta carpeta es la fuente de verdad para cualquier agente de IA que trabaje en este repo.
Se deriva de la documentación aprobada por la cátedra (carpeta de Drive "Documentación para subir")
y de la máquina de estados corregida.

## Protocolo de carga

No leas esta carpeta entera. Abrí solo lo que la tarea necesita.

| Si vas a… | Leé |
|---|---|
| Escribir cualquier código | `/AGENTS.md` (raíz) + `producto/dominio.md` |
| Implementar una historia del sprint en curso | + `producto/sprint-01.md` |
| Tocar el modelo de datos o los enums | + `tecnico/modelo-datos.md` |
| Cargar datos de prueba o precios | + `negocio/tarifario-2026.md` |
| Entender por qué algo está hecho así | + `tecnico/adr/` |
| Discutir alcance o prioridades | + `producto/backlog.md` |

Regla para el agente: si una definición que necesitás no está en estos archivos,
**no la inventes**. Está en `producto/pendientes.md` o hay que preguntar.

## Contenido

```
docs/
├── README.md                    ← este archivo
├── producto/
│   ├── dominio.md               Glosario, estados y reglas de negocio. El más importante.
│   ├── backlog.md               Las 43 historias en una línea cada una, con Epic, RD y sprint.
│   ├── sprint-01.md             Las 6 historias del sprint en curso, con criterios completos.
│   └── pendientes.md            Lo que todavía no definió el cliente. Qué NO asumir.
├── tecnico/
│   ├── arquitectura.md          Monorepo, capas y límites entre workspaces.
│   ├── modelo-datos.md          Entidades, enums y la restricción de no solapamiento.
│   └── adr/                     Decisiones técnicas: 0001 (stack) + template.md.
└── negocio/
    └── tarifario-2026.md        Salones, capacidades y precios reales. Base de los seeds.
```

## Qué NO va acá

- El Plan de Proyecto y el Estudio Inicial completos. Viven en Drive; acá va solo lo destilado.
- Estado de tareas: eso es Jira. Nada de "en progreso" ni asignaciones en markdown.
- Notas de reunión y borradores académicos.

## Al cerrar cada sprint

Actualizar `producto/dominio.md` si cambió una regla, reemplazar `sprint-01.md` por el
siguiente, Si la historia implicó una decisión técnica difícil de revertir o que sorprendería a quien lea el código después, agregar una ADR en docs/tecnico/adr/ copiando template.md, numerada, en el mismo PR. Maximo 2 por user story
