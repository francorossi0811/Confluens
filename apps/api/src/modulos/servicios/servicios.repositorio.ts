import type { CrearServicio } from '@confluens/shared';

import { prisma } from '../../lib/prisma.js';

// Capa de acceso a datos del módulo. Separada del servicio para poder inyectar un fake en
// servicios.servicio.test.ts (sin tocar Prisma) y para poder mockear el módulo entero en
// servicios.rutas.test.ts (sin necesitar Postgres corriendo) — mismo criterio que auth (HU-27).

// Orden alfabético: es un catálogo de consulta (HU-32 solo agrega el alta), no hay un criterio de
// negocio que justifique otro orden como en salones (HU-01, por capacidad).
export async function listarActivos() {
  return prisma.servicio.findMany({
    where: { activo: true },
    orderBy: { nombre: 'asc' },
  });
}

// nombre es @unique en el schema: sirve tanto para buscar como para el chequeo de duplicados del
// servicio (criterio 4 de HU-32).
export async function buscarPorNombre(nombre: string) {
  return prisma.servicio.findUnique({ where: { nombre } });
}

// "activo" se fija en true acá, no lo decide quien llama: HU-32 no tiene alta de servicio inactivo
// (ver comentario en packages/shared/src/esquemas/servicio.esquema.ts).
export async function crear(datos: CrearServicio) {
  return prisma.servicio.create({
    data: { ...datos, activo: true },
  });
}

export type ServiciosRepositorio = {
  listarActivos: typeof listarActivos;
  buscarPorNombre: typeof buscarPorNombre;
  crear: typeof crear;
};
