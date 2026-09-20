import { prisma } from '../lib/prisma.js';

/**
 * RN-06: si no se registró la seña dentro del plazo, el evento vuelve a Cancelado y el salón se
 * libera (el UPDATE alcanza: la constraint EXCLUDE de Postgres solo restringe Reservado/Cobrado,
 * así que un evento que pasa a Cancelado deja de bloquear el salón automáticamente).
 */
export async function cancelarReservasConSenaVencida(): Promise<number> {
  const vencidos = await prisma.evento.findMany({
    where: { estado: 'Reservado', senaRegistradaEn: null, senaVenceEn: { lt: new Date() } },
    select: { id: true },
  });
  if (vencidos.length === 0) return 0;

  const ids = vencidos.map((evento) => evento.id);
  await prisma.$transaction([
    prisma.presupuesto.updateMany({
      where: { eventoId: { in: ids }, estado: 'Confirmado' },
      data: { estado: 'Cancelado' },
    }),
    prisma.evento.updateMany({
      where: { id: { in: ids } },
      data: { estado: 'Cancelado' },
    }),
  ]);
  return vencidos.length;
}
