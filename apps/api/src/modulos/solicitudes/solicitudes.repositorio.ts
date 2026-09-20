import type { CrearSolicitud } from '@confluens/shared';

import { prisma } from '../../lib/prisma.js';

// Capa de acceso a datos del módulo. Separada del servicio para poder mockear el módulo entero en
// solicitudes.rutas.test.ts sin necesitar Postgres corriendo (mismo criterio que servicios, HU-32).

// Orden por fecha de creación: el Responsable de Eventos revisa las solicitudes en el orden en que
// llegaron, no hay otro criterio de negocio definido para esta lista (HU-14 no lo pide).
export async function listar() {
  return prisma.solicitud.findMany({
    orderBy: { creadoEn: 'asc' },
  });
}

// clienteId queda null: en el Sprint 1 el formulario público no requiere autenticación (ver
// esquemaCrearSolicitud en packages/shared). La ficha de cliente la crea el Responsable de
// Eventos al tomar la solicitud, fuera del alcance de HU-14.
export async function crear(datos: CrearSolicitud) {
  return prisma.solicitud.create({
    data: { ...datos, clienteId: null },
  });
}

export type SolicitudesRepositorio = {
  listar: typeof listar;
  crear: typeof crear;
};
