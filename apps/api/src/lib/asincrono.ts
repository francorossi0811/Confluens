import type { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Express 4 no captura errores de handlers async: sin este wrapper, un throw dentro
 * de un controlador async no llega a manejadorErrores. Envolver todo handler async.
 */
export function asincrono(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    handler(req, res, next).catch(next);
  };
}
