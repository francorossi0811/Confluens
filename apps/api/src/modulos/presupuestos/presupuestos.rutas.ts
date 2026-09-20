import { esquemaCrearPresupuesto, esquemaPresupuestoDetallado } from '@confluens/shared';
import { Router } from 'express';
import { z } from 'zod';

import { registroOpenApi } from '../../docs/openapi.js';
import { asincrono } from '../../lib/asincrono.js';
import { validar } from '../../middlewares/validar.js';
import { crear } from './presupuestos.controlador.js';

registroOpenApi.registerPath({
  method: 'post',
  path: '/presupuestos',
  tags: ['Presupuestos'],
  summary: 'Genera un presupuesto estimado a partir de salón, fecha, personas y servicios (HU-09)',
  request: { body: { content: { 'application/json': { schema: esquemaCrearPresupuesto } } } },
  responses: {
    201: {
      description: 'Presupuesto Estimado creado, con el evento en consulta y el detalle de líneas',
      content: { 'application/json': { schema: z.object({ data: esquemaPresupuestoDetallado }) } },
    },
    400: { description: 'Datos inválidos' },
    404: { description: 'El salón o alguno de los servicios seleccionados no existe' },
    422: { description: 'Alguno de los servicios seleccionados no está activo' },
  },
});

export const rutasPresupuestos = Router();

rutasPresupuestos.post('/', validar({ body: esquemaCrearPresupuesto }), asincrono(crear));
