import { z } from 'zod';

import { esquemaFechaHora, esquemaId, esquemaImporte } from './comunes.esquema.js';

export const esquemaServicio = z.object({
  id: esquemaId,
  nombre: z.string().min(1),
  descripcion: z.string().min(1),
  unidadMedida: z.string().min(1),
  precio: esquemaImporte,
  porPersona: z.boolean(),
  tercerizado: z.boolean(), // su precio no entra en el total del presupuesto
  activo: z.boolean(),
  creadoEn: esquemaFechaHora,
  actualizadoEn: esquemaFechaHora,
});
export type Servicio = z.infer<typeof esquemaServicio>;
