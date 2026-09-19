import { existsSync } from 'node:fs';
import { defineConfig } from 'prisma/config';

// Prisma 7 no carga .env automáticamente. En local se usa el .env de la raíz del monorepo
// (los scripts de npm corren con cwd = apps/api); en CI y producción las variables vienen del entorno.
const archivoEntorno = '../../.env';
if (existsSync(archivoEntorno)) {
  process.loadEnvFile(archivoEntorno);
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // El CLI (migraciones) necesita conexión directa: en Neon, DIRECT_URL es la URL sin pooling.
    url: process.env['DIRECT_URL'] ?? process.env['DATABASE_URL'],
  },
});
