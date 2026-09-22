import type { RespuestaExito, SalonConDistribuciones } from '@confluens/shared';
import type { Request, Response } from 'express';

import { listarSalones } from './salones.servicio.js';

export async function listar(_req: Request, res: Response): Promise<void> {
  const salones = await listarSalones();
  const cuerpo: RespuestaExito<SalonConDistribuciones[]> = {
    // Prisma serializa Decimal como objeto; se castea porque el shape real ya matchea el schema de
    // shared (Decimal -> string) al pasar por res.json(), igual que en los demás módulos.
    data: salones as unknown as SalonConDistribuciones[],
  };
  res.json(cuerpo);
}
