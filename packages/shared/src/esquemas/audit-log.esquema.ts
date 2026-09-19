import { z } from 'zod';

import { esquemaFechaHora, esquemaId } from './comunes.esquema.js';

// Registro inmutable. usuarioId es null cuando actúa el Sistema (SYS).
export const esquemaAuditLog = z.object({
  id: esquemaId,
  usuarioId: esquemaId.nullable(),
  fecha: esquemaFechaHora,
  entidad: z.string().min(1),
  entidadId: z.string().min(1),
  valorAnterior: z.json().nullable(),
  valorNuevo: z.json().nullable(),
});
export type AuditLog = z.infer<typeof esquemaAuditLog>;
