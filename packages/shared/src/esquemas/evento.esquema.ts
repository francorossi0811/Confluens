import { z } from 'zod';

import { esquemaFecha, esquemaFechaHora, esquemaId } from './comunes.esquema.js';

// Valores literales de la máquina de estados aprobada (docs/producto/dominio.md).
export const esquemaEstadoEvento = z.enum(['EnConsulta', 'Reservado', 'Cobrado', 'Cancelado']);
export type EstadoEvento = z.infer<typeof esquemaEstadoEvento>;

// distribucionId, inicio y fin pueden ser null en EnConsulta (y en Cancelado si viene de ahí).
export const esquemaEvento = z.object({
  id: esquemaId,
  clienteId: esquemaId,
  salonId: esquemaId,
  distribucionId: esquemaId.nullable(),
  fecha: esquemaFecha,
  inicio: esquemaFechaHora.nullable(),
  fin: esquemaFechaHora.nullable(),
  cantidadPersonas: z.number().int().positive(),
  estado: esquemaEstadoEvento,
  modalidadSalonRestaurante: z.boolean(), // opción interna, no visible al cliente
  creadoEn: esquemaFechaHora,
  actualizadoEn: esquemaFechaHora,
});
export type Evento = z.infer<typeof esquemaEvento>;
