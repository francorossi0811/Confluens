import { z } from 'zod';

import { esquemaFechaHora, esquemaId, esquemaImporte } from './comunes.esquema.js';

export const esquemaSalon = z.object({
  id: esquemaId,
  nombre: z.string().min(1),
  capacidadMaxima: z.number().int().positive(),
  superficie: z.number().int().positive(), // m²
  precioJornadaCompleta: esquemaImporte,
  precioMediaJornada: esquemaImporte,
  creadoEn: esquemaFechaHora,
  actualizadoEn: esquemaFechaHora,
});
export type Salon = z.infer<typeof esquemaSalon>;
