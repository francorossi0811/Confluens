import { prisma } from '../../lib/prisma.js';

// Orden por capacidad descendente: así el primer elemento de la lista es siempre "la mayor
// disponible" (criterio 4 de HU-01), sin tener que recalcular un máximo aparte en el servicio.
export async function obtenerSalonesConDistribuciones() {
  return prisma.salon.findMany({
    include: { distribuciones: true },
    orderBy: { capacidadMaxima: 'desc' },
  });
}
