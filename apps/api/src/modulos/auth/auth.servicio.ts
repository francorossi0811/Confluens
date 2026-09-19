import type { Credenciales, Sesion } from '@confluens/shared';

import { compararContrasena } from '../../lib/contrasena.js';
import { ErrorApi } from '../../lib/errores.js';
import { firmarToken } from '../../lib/jwt.js';
import * as authRepositorioReal from './auth.repositorio.js';
import type { AuthRepositorio } from './auth.repositorio.js';

// Hash bcrypt fijo de un valor arbitrario, sin usuario asociado. Se compara contra
// él cuando el email no existe, para que iniciarSesion() tarde lo mismo (una
// operación de bcrypt.compare) exista o no la cuenta. Sin esto, un atacante podría
// medir el tiempo de respuesta para enumerar qué emails están registrados: buscar
// en la base es rápido y devolvería antes que un intento con email inexistente.
const HASH_DUMMY = '$2b$10$oXlaoV0.SaEDkKBpGZyhrO2uxZ5F31Sd5wE9reWYpplLsAymkW3Q6';

/**
 * Valida credenciales y, si son correctas, devuelve la sesión y su JWT firmado.
 * `repositorio` tiene un default para uso real; en los tests unitarios se pasa un
 * fake para no tocar Prisma/la base de datos (ver auth.servicio.test.ts).
 *
 * Criterio 2 (sprint-01.md): ante contraseña incorrecta o email inexistente, se
 * responde el mismo error genérico — nunca se indica cuál de los dos datos falló.
 */
export async function iniciarSesion(
  credenciales: Credenciales,
  repositorio: AuthRepositorio = authRepositorioReal,
): Promise<{ sesion: Sesion; token: string }> {
  const usuario = await repositorio.buscarUsuarioPorEmail(credenciales.email);

  const hashAComparar = usuario?.hashContrasena ?? HASH_DUMMY;
  const contrasenaValida = await compararContrasena(credenciales.contrasena, hashAComparar);

  if (!usuario || !contrasenaValida) {
    throw ErrorApi.noAutenticado();
  }

  const sesion: Sesion = { id: usuario.id, email: usuario.email, rol: usuario.rol };
  const token = firmarToken(sesion);
  return { sesion, token };
}
