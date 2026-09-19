import { esquemaCredenciales, esquemaSesion } from '@confluens/shared';
import { Router } from 'express';
import { z } from 'zod';

import { registroOpenApi } from '../../docs/openapi.js';
import { asincrono } from '../../lib/asincrono.js';
import { autenticar } from '../../middlewares/autenticar.js';
import { validar } from '../../middlewares/validar.js';
import { login, logout, yo } from './auth.controlador.js';

registroOpenApi.registerPath({
  method: 'post',
  path: '/auth/login',
  tags: ['Auth'],
  summary: 'Inicia sesión y setea la cookie httpOnly con el JWT',
  request: { body: { content: { 'application/json': { schema: esquemaCredenciales } } } },
  responses: {
    200: {
      description: 'Credenciales válidas',
      content: { 'application/json': { schema: z.object({ data: esquemaSesion }) } },
    },
    401: { description: 'Credenciales inválidas' },
  },
});

registroOpenApi.registerPath({
  method: 'post',
  path: '/auth/logout',
  tags: ['Auth'],
  summary: 'Cierra la sesión actual (limpia la cookie)',
  responses: { 204: { description: 'Sesión cerrada' } },
});

registroOpenApi.registerPath({
  method: 'get',
  path: '/auth/yo',
  tags: ['Auth'],
  summary: 'Devuelve la sesión autenticada actual',
  responses: {
    200: {
      description: 'Sesión vigente',
      content: { 'application/json': { schema: z.object({ data: esquemaSesion }) } },
    },
    401: { description: 'No autenticado' },
  },
});

export const rutasAuth = Router();

rutasAuth.post('/login', validar({ body: esquemaCredenciales }), asincrono(login));
rutasAuth.post('/logout', logout);
rutasAuth.get('/yo', autenticar, yo);
