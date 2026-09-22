import type { CrearServicio, RespuestaExito, Servicio } from '@confluens/shared';
import type { Request, Response } from 'express';

import { crearServicio, listarServicios } from './servicios.servicio.js';

export async function listar(_req: Request, res: Response): Promise<void> {
  const servicios = await listarServicios();
  const cuerpo: RespuestaExito<Servicio[]> = {
    // Prisma serializa Decimal con su propio toJSON(); el shape resultante ya matchea el schema de
    // shared (Decimal -> string), igual que en los demás módulos (ver salones.controlador.ts).
    data: servicios as unknown as Servicio[],
  };
  res.json(cuerpo);
}

// req.body ya llegó validado por validar({ body: esquemaCrearServicio }) en servicios.rutas.ts.
export async function crear(req: Request, res: Response): Promise<void> {
  const servicio = await crearServicio(req.body as CrearServicio);
  const cuerpo: RespuestaExito<Servicio> = { data: servicio as unknown as Servicio };
  res.status(201).json(cuerpo);
}
