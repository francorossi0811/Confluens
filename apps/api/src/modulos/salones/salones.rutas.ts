import { esquemaSalonConDistribuciones, esquemaSalonPublico } from '@confluens/shared';
import { Router } from 'express';
import { z } from 'zod';

import { registroOpenApi } from '../../docs/openapi.js';
import { asincrono } from '../../lib/asincrono.js';
import { listar, listarPublicos } from './salones.controlador.js';

registroOpenApi.registerPath({
  method: 'get',
  path: '/salones',
  tags: ['Salones'],
  summary: 'Lista los salones con sus distribuciones (HU-01)',
  responses: {
    200: {
      description: 'Catálogo completo de salones, ordenado por capacidad máxima descendente',
      content: {
        'application/json': {
          schema: z.object({ data: z.array(esquemaSalonConDistribuciones) }),
        },
      },
    },
  },
});

registroOpenApi.registerPath({
  method: 'get',
  path: '/salones/publicos',
  tags: ['Salones'],
  summary: 'Lista los salones publicados en la landing, sin autenticación (HU-07)',
  responses: {
    200: {
      description:
        'Salones con visibleEnLanding = true, sin precios: el canal público solo expone la ' +
        'información de referencia del salón',
      content: { 'application/json': { schema: z.object({ data: z.array(esquemaSalonPublico) }) } },
    },
  },
});

export const rutasSalones = Router();

// /publicos va antes de cualquier ruta con parámetro: si en el futuro se agrega un GET /:id,
// Express matchearía "publicos" como id.
rutasSalones.get('/publicos', asincrono(listarPublicos));
rutasSalones.get('/', asincrono(listar));
