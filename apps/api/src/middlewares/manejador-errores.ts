import { CODIGOS_ERROR, type RespuestaError } from '@confluens/shared';
import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';

import { ErrorApi } from '../lib/errores.js';

export const rutaNoEncontrada: RequestHandler = (req, _res, next) => {
  next(ErrorApi.noEncontrado(`No existe la ruta ${req.method} ${req.path}`));
};

export const manejadorErrores: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
  let status = 500;
  let cuerpo: RespuestaError = {
    error: { code: CODIGOS_ERROR.INTERNO, message: 'Error interno del servidor' },
  };

  if (error instanceof ErrorApi) {
    status = error.status;
    cuerpo = { error: { code: error.codigo, message: error.message, details: error.detalles } };
  } else if (error instanceof ZodError) {
    status = 400;
    cuerpo = {
      error: {
        code: CODIGOS_ERROR.VALIDACION,
        message: 'Los datos enviados no son válidos',
        details: error.issues.map((issue) => ({
          campo: issue.path.join('.'),
          mensaje: issue.message,
        })),
      },
    };
  } else if (esJsonInvalido(error)) {
    status = 400;
    cuerpo = {
      error: {
        code: CODIGOS_ERROR.VALIDACION,
        message: 'El cuerpo de la solicitud no es JSON válido',
      },
    };
  } else {
    console.error(error);
  }

  res.status(status).json(cuerpo);
};

function esJsonInvalido(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    error.type === 'entity.parse.failed'
  );
}
