import type { Request, RequestHandler } from 'express';
import type { z } from 'zod';

interface EsquemasSolicitud {
  body?: z.ZodType;
  query?: z.ZodType;
  params?: z.ZodType;
}

/**
 * Valida body, query y params con schemas de Zod (idealmente importados de @confluens/shared).
 * Si la validación falla, el ZodError llega a manejadorErrores y se responde 400 VALIDATION_ERROR.
 */
export function validar(esquemas: EsquemasSolicitud): RequestHandler {
  return (req, _res, next) => {
    try {
      if (esquemas.body) req.body = esquemas.body.parse(req.body);
      if (esquemas.query) req.query = esquemas.query.parse(req.query) as Request['query'];
      if (esquemas.params) req.params = esquemas.params.parse(req.params) as Request['params'];
      next();
    } catch (error) {
      next(error);
    }
  };
}
