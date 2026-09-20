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

// Contrato de POST /solicitudes (HU-14): el formulario público solo manda datos de contacto,
// fecha deseada y cantidad estimada. clienteId lo decide el servidor (null en Sprint 1, sin
// autenticación); descartada y eventoId los administra el Responsable de Eventos después, al
// tomar la solicitud — no vienen del formulario.
export const esquemaCrearSolicitud = esquemaSolicitud.omit({
  id: true,
  clienteId: true,
  descartada: true,
  eventoId: true,
  creadoEn: true,
  actualizadoEn: true,
});
export type CrearSolicitud = z.infer<typeof esquemaCrearSolicitud>;
