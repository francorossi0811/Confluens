import { prisma } from '../../lib/prisma.js';

// Orden por capacidad descendente: así el primer elemento de la lista es siempre "la mayor
// disponible" (criterio 4 de HU-01), sin tener que recalcular un máximo aparte en el servicio.
export async function obtenerSalonesConDistribuciones() {
  return prisma.salon.findMany({
    include: { distribuciones: true },
    orderBy: { capacidadMaxima: 'desc' },
  });
}

// Catálogo del canal público (HU-07). Dos diferencias con la consulta interna, y las dos son
// criterios de aceptación:
// - where visibleEnLanding: un salón despublicado desde HU-08 no se lista, aunque siga disponible
//   para uso interno (criterio 6).
// - select explícito en vez de include: los precios no se seleccionan, así que no salen de la base
//   ni viajan por la red (criterio 5). Un omit sobre el modelo completo dejaría la puerta abierta a
//   que un campo nuevo se publique solo; acá hay que agregarlo a mano.
export async function obtenerSalonesPublicos() {
  return prisma.salon.findMany({
    where: { visibleEnLanding: true },
    select: {
      id: true,
      nombre: true,
      capacidadMaxima: true,
      superficie: true,
      fotoUrl: true,
      distribuciones: true,
    },
    orderBy: { capacidadMaxima: 'desc' },
  });
}
