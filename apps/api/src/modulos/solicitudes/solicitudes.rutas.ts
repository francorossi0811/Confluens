import { esquemaCrearSolicitud, esquemaSolicitud } from '@confluens/shared';
import { Router } from 'express';
import { z } from 'zod';

import { registroOpenApi } from '../../docs/openapi.js';
import { asincrono } from '../../lib/asincrono.js';
import { validar } from '../../middlewares/validar.js';
import { crear, listar } from './solicitudes.controlador.js';

registroOpenApi.registerPath({
  method: 'get',
  path: '/solicitudes',
  tags: ['Solicitudes'],
  summary: 'Lista las solicitudes del canal público, sin filtrar (HU-14)',
  responses: {
    200: {
      description: 'Solicitudes ordenadas por fecha de creación',
      content: { 'application/json': { schema: z.object({ data: z.array(esquemaSolicitud) }) } },
    },
  },
});

registroOpenApi.registerPath({
  method: 'post',
  path: '/solicitudes',
  tags: ['Solicitudes'],
  summary: 'Registra una solicitud desde el formulario público, sin autenticación (HU-14)',
  request: { body: { content: { 'application/json': { schema: esquemaCrearSolicitud } } } },
  responses: {
    201: {
      description: 'Solicitud creada',
      content: { 'application/json': { schema: z.object({ data: esquemaSolicitud }) } },
    },
    400: { description: 'Faltan datos de contacto o la fecha deseada' },
  },
});

export const rutasSolicitudes = Router();

rutasSolicitudes.get('/', asincrono(listar));
rutasSolicitudes.post('/', validar({ body: esquemaCrearSolicitud }), asincrono(crear));
