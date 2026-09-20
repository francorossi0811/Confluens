import { prisma } from '../../lib/prisma.js';
import type { Prisma } from '../../generated/prisma/client.js';

// Capa de acceso a datos del módulo. Cada función acepta un `tx` opcional (default: el cliente
// global) para poder correr dentro de la transacción que arma crearEnTransaccion, y para que los
// tests puedan mockear el módulo entero sin simular una transacción real (mismo criterio que
// solicitudes.repositorio.ts, HU-14).

export async function buscarClientePorCorreo(
  correo: string,
  tx: Prisma.TransactionClient = prisma,
) {
  return tx.cliente.findFirst({ where: { correo } });
}

export async function crearCliente(
  datos: { nombre: string; telefono: string; correo: string },
  tx: Prisma.TransactionClient = prisma,
) {
  return tx.cliente.create({ data: datos });
}

export async function buscarSalon(salonId: number, tx: Prisma.TransactionClient = prisma) {
  return tx.salon.findUnique({ where: { id: salonId } });
}

// No filtra por `activo`: el servicio necesita distinguir "no existe" (404) de "existe pero no
// está activo" (422), así que decide con el listado completo.
export async function buscarServiciosPorIds(ids: number[], tx: Prisma.TransactionClient = prisma) {
  return tx.servicio.findMany({ where: { id: { in: ids } } });
}

export async function crearEvento(
  datos: { clienteId: number; salonId: number; fecha: Date; cantidadPersonas: number },
  tx: Prisma.TransactionClient = prisma,
) {
  // estado: EnConsulta es el default del schema, no hace falta pasarlo.
  return tx.evento.create({ data: datos });
}

export async function crearPresupuestoConLineas(
  datos: {
    eventoId: number;
    total: string;
    lineas: {
      servicioId: number | null;
      descripcion: string;
      cantidad: number;
      precioUnitario: string;
      subtotal: string;
    }[];
  },
  tx: Prisma.TransactionClient = prisma,
) {
  return tx.presupuesto.create({
    data: {
      eventoId: datos.eventoId,
      total: datos.total,
      lineas: { create: datos.lineas },
    },
    include: { lineas: true, evento: true },
  });
}

// Orquesta la transacción completa: el servicio arma el callback y le pasa el mismo `tx` a cada
// función interna, logrando atomicidad real (todo o nada) entre Cliente, Evento, Presupuesto y
// sus líneas.
export async function crearEnTransaccion<T>(
  ejecutar: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  return prisma.$transaction((tx) => ejecutar(tx));
}

export type PresupuestosRepositorio = {
  buscarClientePorCorreo: typeof buscarClientePorCorreo;
  crearCliente: typeof crearCliente;
  buscarSalon: typeof buscarSalon;
  buscarServiciosPorIds: typeof buscarServiciosPorIds;
  crearEvento: typeof crearEvento;
  crearPresupuestoConLineas: typeof crearPresupuestoConLineas;
  crearEnTransaccion: typeof crearEnTransaccion;
};
