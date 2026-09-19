import { prisma } from '../../lib/prisma.js';

// Capa de acceso a datos del módulo auth. Separada del servicio para poder
// inyectar un fake en los tests unitarios de auth.servicio.ts sin tocar Prisma
// (ver auth.servicio.test.ts) y para poder mockear el módulo entero
// (`vi.mock('./auth.repositorio.js')`) en los tests de integración de las rutas,
// que así no requieren una base de datos real corriendo en CI.
export async function buscarUsuarioPorEmail(email: string) {
  return prisma.usuario.findUnique({ where: { email } });
}

export type AuthRepositorio = {
  buscarUsuarioPorEmail: typeof buscarUsuarioPorEmail;
};
