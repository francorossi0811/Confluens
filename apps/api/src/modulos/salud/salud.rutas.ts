import type { RespuestaExito } from '@confluens/shared';
import { Router } from 'express';
import { z } from 'zod';

import { registroOpenApi } from '../../docs/openapi.js';

// Health check de infraestructura (Render lo usa para saber si la API está viva). No es un endpoint de dominio.
const esquemaSalud = z.object({ estado: z.literal('ok') });

registroOpenApi.registerPath({
  method: 'get',
  path: '/salud',
  tags: ['Salud'],
  summary: 'Verifica que la API esté levantada',
  responses: {
    200: {
      description: 'API operativa',
      content: { 'application/json': { schema: z.object({ data: esquemaSalud }) } },
    },
  },
});

export const rutasSalud = Router();

rutasSalud.get('/', (_req, res) => {
  const cuerpo: RespuestaExito<z.infer<typeof esquemaSalud>> = { data: { estado: 'ok' } };
  res.json(cuerpo);
});
