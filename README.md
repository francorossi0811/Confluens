# Confluens

Sistema Integral de Gestión de Eventos para Los Abuelos Servicios Gastronómicos SRL (Hotel Dr. César Carman). Centraliza el ciclo completo del evento —consulta, presupuesto, prereserva, confirmación, comanda de cocina y cobro. Incluye landing pública con los salones y acceso directo a la reserva. Proyecto de tesis, Analista en Sistemas (UTN).

## Levantar el proyecto

Requisitos: Node 20.19 o superior (`nvm use` toma la versión de `.nvmrc`) y Docker.

```bash
git clone https://github.com/francorossi0811/Confluens.git && cd Confluens
cp .env.example .env
npm install
npm run db:up && npm run prisma:deploy -w @confluens/api
npm run dev
```

- Web: http://localhost:5173
- API: http://localhost:3000/api/salud
- Documentación de la API (Swagger): http://localhost:3000/api/docs

## Documentación

- **[AGENTS.md](AGENTS.md)**: stack, estructura, convenciones, Definition of Done y reglas para agentes de IA. Leer antes de contribuir.
- [docs/](docs/index.md): ADR, glosario y documentación del equipo (vault de Obsidian).
