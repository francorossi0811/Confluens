import { esquemaCrearServicio, esquemaServicio } from '@confluens/shared';
import { Router } from 'express';
import { z } from 'zod';

import { registroOpenApi } from '../../docs/openapi.js';
import { asincrono } from '../../lib/asincrono.js';
import { validar } from '../../middlewares/validar.js';
import { crear, listar } from './servicios.controlador.js';

registroOpenApi.registerPath({
  method: 'get',
  path: '/servicios',
  tags: ['Servicios'],
  summary: 'Lista los servicios activos del catálogo (HU-32)',
  responses: {
    200: {
      description: 'Catálogo de servicios activos, ordenado por nombre',
      content: { 'application/json': { schema: z.object({ data: z.array(esquemaServicio) }) } },
    },
  },
});

registroOpenApi.registerPath({
  method: 'post',
  path: '/servicios',
  tags: ['Servicios'],
  summary: 'Registra un servicio nuevo en el catálogo (HU-32)',
  request: { body: { content: { 'application/json': { schema: esquemaCrearServicio } } } },
  responses: {
    201: {
      description: 'Servicio creado',
      content: { 'application/json': { schema: z.object({ data: esquemaServicio }) } },
    },
    409: { description: 'Ya existe un servicio con ese nombre' },
  },
});

export const rutasServicios = Router();

rutasServicios.get('/', asincrono(listar));
rutasServicios.post('/', validar({ body: esquemaCrearServicio }), asincrono(crear));
