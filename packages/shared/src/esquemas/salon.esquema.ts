import { z } from 'zod';

import { esquemaFechaHora, esquemaId, esquemaImporte } from './comunes.esquema.js';
import { esquemaDistribucion } from './distribucion.esquema.js';

export const esquemaSalon = z.object({
  id: esquemaId,
  nombre: z.string().min(1),
  capacidadMaxima: z.number().int().positive(),
  superficie: z.number().int().positive(), // m²
  precioJornadaCompleta: esquemaImporte,
  precioMediaJornada: esquemaImporte,
  creadoEn: esquemaFechaHora,
  actualizadoEn: esquemaFechaHora,
});
export type Salon = z.infer<typeof esquemaSalon>;

// Forma que devuelve GET /api/salones (HU-01): el salón con sus distribuciones ya anidadas.
// Son solo 5 salones con 3 distribuciones cada uno (15 filas en total), así que se resuelve en
// un único viaje de red en vez de forzar a la web a pedir cada distribución por separado — evita
// una segunda ruta (GET /api/salones/:id) que esta historia todavía no necesita.
export const esquemaSalonConDistribuciones = esquemaSalon.extend({
  distribuciones: z.array(esquemaDistribucion),
});
export type SalonConDistribuciones = z.infer<typeof esquemaSalonConDistribuciones>;
