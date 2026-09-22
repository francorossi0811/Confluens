import type { Rol } from '@confluens/shared';
import type { RequestHandler } from 'express';

import { ErrorApi } from '../lib/errores.js';

/**
 * Restringe una ruta a los roles indicados (criterio 3: un RE no puede administrar
 * usuarios ni ver reportes de ingresos). Debe montarse SIEMPRE después de
 * `autenticar` en la cadena de middlewares: confía en que `req.usuario` ya está
 * seteado y no vuelve a verificar el JWT.
 */
export function autorizar(...roles: Rol[]): RequestHandler {
  return (req, _res, next) => {
    if (!req.usuario || !roles.includes(req.usuario.rol)) {
      next(ErrorApi.noAutorizado());
      return;
    }
    next();
  };
}
