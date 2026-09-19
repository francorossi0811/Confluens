import { z } from 'zod';

import { esquemaId } from './comunes.esquema.js';
import { esquemaRol } from './usuario.esquema.js';

// Credenciales que viajan en el body de POST /auth/login (HU-27).
// Sin política de longitud/complejidad de contraseña acá: esa regla es de alta de
// usuario (HU-28, Sprint 5), no de inicio de sesión. Inventarla en esta HU sería
// asumir algo que docs/ todavía no define.
//
// Mensajes de error en español y redactados para quien complete el formulario, no
// para quien lea el código: los defaults de Zod ("Invalid email address", "Too
// small...") son en inglés y hablan en términos técnicos (longitud de string) que no
// tienen sentido para alguien llenando un login. Se traduce puntualmente este
// esquema (el que ve el usuario final en IniciarSesion.tsx) y no el resto de
// esquemas de packages/shared, que hoy no tienen mensajes custom: esos son
// formularios internos de personal ya capacitado en el sistema, mientras que el
// login es la primera pantalla que cualquier persona ve.
export const esquemaCredenciales = z.object({
  email: z.email({ error: 'Ingresá un email válido (por ejemplo: nombre@empresa.com)' }),
  contrasena: z.string().min(1, { error: 'Ingresá tu contraseña' }),
});
export type Credenciales = z.infer<typeof esquemaCredenciales>;

// Forma de la sesión autenticada: lo que se firma dentro del JWT y lo que devuelven
// POST /auth/login y GET /auth/yo. A propósito NO es esquemaUsuario (que trae
// creadoEn/actualizadoEn): el JWT ya contiene todo lo que un request autenticado
// necesita para decidir permisos, así que no hace falta volver a consultar la base
// en cada request protegido.
export const esquemaSesion = z.object({
  id: esquemaId,
  email: z.email(),
  rol: esquemaRol,
});
export type Sesion = z.infer<typeof esquemaSesion>;
