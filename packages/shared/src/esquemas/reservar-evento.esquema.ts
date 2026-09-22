import { z } from 'zod';

import { esquemaFechaHora, esquemaId } from './comunes.esquema.js';
import { esquemaCliente } from './cliente.esquema.js';
import { esquemaDistribucion } from './distribucion.esquema.js';
import { esquemaEvento } from './evento.esquema.js';
import { esquemaLineaPresupuesto } from './linea-presupuesto.esquema.js';
import { esquemaPresupuesto } from './presupuesto.esquema.js';
import { esquemaSalon } from './salon.esquema.js';
import { esquemaSolicitud } from './solicitud.esquema.js';

// Contrato de POST /eventos/:id/reservar (HU-15). Confirma el presupuesto Estimado del evento y
// reserva el salón en un solo paso (decisión de producto: un único botón "Confirmar y reservar").
export const esquemaReservarEvento = z.object({
  distribucionId: esquemaId,
  inicio: esquemaFechaHora,
  fin: esquemaFechaHora,
  modalidadSalonRestaurante: z.boolean().default(false),
  // Criterio 3: si cantidadPersonas > distribucion.capacidad, el primer intento sin este flag
  // devuelve 422; el RE reintenta con confirmarCapacidadExcedida: true tras el aviso en UI.
  confirmarCapacidadExcedida: z.boolean().default(false),
});
export type ReservarEvento = z.infer<typeof esquemaReservarEvento>;

// Presupuesto con sus líneas, mismo shape que PresupuestoDetallado de crear-presupuesto.esquema.ts
// (HU-09), repetido acá para no crear una dependencia cruzada entre módulos de esquemas.
const esquemaPresupuestoConLineas = esquemaPresupuesto.extend({
  lineas: z.array(esquemaLineaPresupuesto),
});

// Respuesta de GET /eventos/:id y de las acciones de estado (reservar/registrar-sena/cancelar):
// el detalle completo que necesita la vista DetalleEvento en un solo pedido.
export const esquemaEventoDetallado = esquemaEvento.extend({
  cliente: esquemaCliente,
  salon: esquemaSalon,
  distribucion: esquemaDistribucion.nullable(),
  presupuestos: z.array(esquemaPresupuestoConLineas),
  solicitud: esquemaSolicitud.nullable(),
});
export type EventoDetallado = z.infer<typeof esquemaEventoDetallado>;
