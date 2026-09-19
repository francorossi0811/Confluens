import { z } from 'zod';

import { esquemaId, esquemaImporte } from './comunes.esquema.js';

// precioUnitario queda congelado al emitir. La línea del salón tiene servicioId null.
export const esquemaLineaPresupuesto = z.object({
  id: esquemaId,
  presupuestoId: esquemaId,
  servicioId: esquemaId.nullable(),
  descripcion: z.string().min(1),
  cantidad: z.number().int().positive(),
  precioUnitario: esquemaImporte,
  subtotal: esquemaImporte,
});
export type LineaPresupuesto = z.infer<typeof esquemaLineaPresupuesto>;
