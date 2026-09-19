import { z } from 'zod';

import { esquemaFecha, esquemaFechaHora, esquemaId } from './comunes.esquema.js';

// clienteId es null mientras el formulario no requiera autenticación (Sprint 1).
export const esquemaSolicitud = z.object({
  id: esquemaId,
  clienteId: esquemaId.nullable(),
  nombre: z.string().min(1),
  telefono: z.string().min(1),
  correo: z.email(),
  fechaDeseada: esquemaFecha,
  cantidadPersonas: z.number().int().positive(), // estimada
  descartada: z.boolean(),
  eventoId: esquemaId.nullable(), // evento EnConsulta en el que se convirtió
  creadoEn: esquemaFechaHora,
  actualizadoEn: esquemaFechaHora,
});
export type Solicitud = z.infer<typeof esquemaSolicitud>;
