import type { CrearPresupuesto, PresupuestoDetallado, RespuestaExito } from '@confluens/shared';
import type { Request, Response } from 'express';

import { generarPresupuesto } from './presupuestos.servicio.js';

// req.body ya validado por validar({ body: esquemaCrearPresupuesto }) en presupuestos.rutas.ts.
export async function crear(req: Request, res: Response): Promise<void> {
  const presupuesto = await generarPresupuesto(req.body as CrearPresupuesto);
  const cuerpo: RespuestaExito<PresupuestoDetallado> = {
    data: presupuesto as unknown as PresupuestoDetallado,
  };
  res.status(201).json(cuerpo);
}
