import { z } from 'zod';

import { esquemaFechaHora, esquemaId } from './comunes.esquema.js';

// Nombre único por salón; la capacidad nunca supera la del salón (lo valida la API).
export const esquemaDistribucion = z.object({
  id: esquemaId,
  salonId: esquemaId,
  nombre: z.string().min(1),
  capacidad: z.number().int().positive(),
  creadoEn: esquemaFechaHora,
  actualizadoEn: esquemaFechaHora,
});
export type Distribucion = z.infer<typeof esquemaDistribucion>;
