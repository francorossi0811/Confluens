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

// Body de POST /servicios (HU-32): se omiten los campos que controla el servidor. "activo" nace
// siempre en true (no hay alta con un servicio ya inactivo) y no hay endpoint de baja en este
// sprint, así que tampoco es parte del contrato de creación.
export const esquemaCrearServicio = esquemaServicio.omit({
  id: true,
  activo: true,
  creadoEn: true,
  actualizadoEn: true,
});
export type CrearServicio = z.infer<typeof esquemaCrearServicio>;
