import { z } from 'zod';

import { esquemaFechaHora, esquemaId } from './comunes.esquema.js';

export const esquemaCliente = z.object({
  id: esquemaId,
  nombre: z.string().min(1), // razón social o nombre
  telefono: z.string().min(1),
  correo: z.email(),
  activo: z.boolean(),
  usuarioId: esquemaId.nullable(),
  creadoEn: esquemaFechaHora,
  actualizadoEn: esquemaFechaHora,
});
export type Cliente = z.infer<typeof esquemaCliente>;
