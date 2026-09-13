import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';

// Cada módulo registra sus rutas en este registro (ver modulos/salud/salud.rutas.ts).
export const registroOpenApi = new OpenAPIRegistry();

export function generarDocumentoOpenApi() {
  return new OpenApiGeneratorV3(registroOpenApi.definitions).generateDocument({
    openapi: '3.0.3',
    info: {
      title: 'Confluens API',
      version: '0.0.0',
    },
    servers: [{ url: '/api' }],
  });
}
