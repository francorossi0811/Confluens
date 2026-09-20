import { z } from 'zod';

import { esquemaFecha, esquemaId } from './comunes.esquema.js';
import { esquemaEvento } from './evento.esquema.js';
import { esquemaLineaPresupuesto } from './linea-presupuesto.esquema.js';
import { esquemaPresupuesto } from './presupuesto.esquema.js';

// RN-04: un servicio puede contratarse para menos personas que el total del evento.
export const esquemaServicioSeleccionado = z.object({
  servicioId: esquemaId,
  cantidad: z.number().int().positive(),
});
export type ServicioSeleccionado = z.infer<typeof esquemaServicioSeleccionado>;

// No se puede derivar de Evento.inicio/fin (quedan null mientras el evento está en EnConsulta).
// Definición formal de ambos conceptos en docs/negocio/tarifario-2026.md.
export const esquemaTipoJornada = z.enum(['completa', 'media']);
export type TipoJornada = z.infer<typeof esquemaTipoJornada>;

// Contrato de POST /presupuestos (HU-09). Lo usa el panel interno del Responsable de Eventos, no
// el canal público, así que a diferencia de esquemaCrearSolicitud no hace falta un mensaje de Zod
// en español por campo.
export const esquemaCrearPresupuesto = z.object({
  // Datos de contacto del cliente: si ya existe un Cliente con este correo se reutiliza (estos
  // campos no lo actualizan); si no existe, se crea con estos valores.
  nombre: z.string().min(1),
  telefono: z.string().min(1),
  correo: z.email(),
  // Datos del evento en consulta que se crea junto con el presupuesto.
  salonId: esquemaId,
  fecha: esquemaFecha,
  cantidadPersonas: z.number().int().positive(),
  tipoJornada: esquemaTipoJornada,
  // Puede venir vacío: un presupuesto solo con el salón es válido.
  servicios: z.array(esquemaServicioSeleccionado).default([]),
});
export type CrearPresupuesto = z.infer<typeof esquemaCrearPresupuesto>;

// Respuesta de POST /presupuestos: el presupuesto recién creado con su evento y el detalle de
// líneas, compuesto ad-hoc para esta respuesta puntual (esquemaPresupuesto se mantiene "plano"
// para el resto de usos, sin anidar la relación).
export const esquemaPresupuestoDetallado = esquemaPresupuesto.extend({
  evento: esquemaEvento,
  lineas: z.array(esquemaLineaPresupuesto),
});
export type PresupuestoDetallado = z.infer<typeof esquemaPresupuestoDetallado>;
