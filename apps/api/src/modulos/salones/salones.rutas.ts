import { esquemaSalonConDistribuciones } from '@confluens/shared';
import { Router } from 'express';
import { z } from 'zod';

import { registroOpenApi } from '../../docs/openapi.js';
import { asincrono } from '../../lib/asincrono.js';
import { listar } from './salones.controlador.js';

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

export const rutasSalones = Router();

rutasSalones.get('/', asincrono(listar));
