import { esquemaSesion, type Sesion } from '@confluens/shared';
import type { CookieOptions } from 'express';
import jwt from 'jsonwebtoken';

// Nombre de la cookie httpOnly donde viaja el JWT de sesión (HU-27).
export const NOMBRE_COOKIE_SESION = 'confluens_sesion';

// Duración de la sesión por inactividad (criterio 5). Se lee de env para poder
// ajustarla sin tocar código; default 120 minutos = las "2 horas" acordadas con el
// usuario. autenticar.ts renueva la cookie en cada request exitoso, así que esto es
// en realidad una ventana deslizante, no una duración fija desde el login.
const JWT_EXPIRA_MINUTOS = Number(process.env['JWT_EXPIRA_MINUTOS'] ?? 120);

// Por qué esto NO usa config/entorno.ts: cargarEntorno() exige DATABASE_URL y hace
// process.exit(1) si falta, y el pipeline de CI corre los tests sin ninguna env var
// seteada. Si este módulo (importado por crearApp() a través del módulo auth) llamara
// a cargarEntorno(), mataría el proceso de test en CI. Por eso se lee process.env
// directo acá, con un fallback de desarrollo, y solo se exige en producción.
function obtenerSecreto(): string {
  const secreto = process.env['JWT_SECRET'];
  if (secreto) return secreto;
  if (process.env['NODE_ENV'] === 'production') {
    throw new Error('JWT_SECRET es obligatorio en producción');
  }
  // Fallback fijo solo para desarrollo/test local: nunca se usa en producción
  // porque la rama de arriba corta antes de llegar acá.
  return 'clave-de-desarrollo-confluens-no-usar-en-produccion';
}

export function firmarToken(sesion: Sesion): string {
  return jwt.sign(sesion, obtenerSecreto(), { expiresIn: `${JWT_EXPIRA_MINUTOS}m` });
}

// Opciones de la cookie de sesión, compartidas entre el login (auth.controlador.ts)
// y la renovación en cada request (middlewares/autenticar.ts) para que no se
// desincronicen.
//
// Por qué `secure`/`sameSite` dependen de NODE_ENV: en producción, Vercel (web) y
// Render (api) son dominios distintos, así que la cookie es cross-site y el
// navegador exige `sameSite: 'none'` + `secure: true` (que a su vez exige HTTPS,
// disponible en ambas plataformas). En desarrollo, Vite sirve la web por HTTP en
// localhost y el navegador DESCARTA cualquier cookie `secure` sobre una conexión no
// HTTPS — con `secure: true` fijo, el login funcionaría en producción pero
// quedaría roto en local. `sameSite: 'lax'` alcanza en dev porque el proxy de Vite
// (`/api` → localhost:3000) hace que el navegador vea todo como same-origin.
export function opcionesCookieSesion(): CookieOptions {
  const esProduccion = process.env['NODE_ENV'] === 'production';
  return {
    httpOnly: true,
    sameSite: esProduccion ? 'none' : 'lax',
    secure: esProduccion,
    maxAge: JWT_EXPIRA_MINUTOS * 60 * 1000,
  };
}

// Mismas opciones que opcionesCookieSesion() pero sin maxAge: Express 4.22 marca
// como deprecado pasarle maxAge a res.clearCookie (a partir de v5 lo ignora, y hoy
// ya emite un warning). httpOnly/sameSite/secure sí importan acá: el navegador solo
// borra la cookie si estos atributos coinciden con los que se usaron al setearla.
export function opcionesLimpiarCookieSesion(): CookieOptions {
  const { maxAge: _maxAge, ...resto } = opcionesCookieSesion();
  return resto;
}

// Devuelve la sesión si el token es válido y tiene la forma esperada, o null si
// está ausente, vencido, fue forjado, o el payload no matchea esquemaSesion (por
// ejemplo, un token firmado con una versión vieja del payload). null en vez de
// lanzar: quien llama (autenticar.ts) decide el error de dominio (ErrorApi), este
// módulo no conoce el contrato HTTP.
export function verificarToken(token: string): Sesion | null {
  try {
    const payload = jwt.verify(token, obtenerSecreto());
    const resultado = esquemaSesion.safeParse(payload);
    return resultado.success ? resultado.data : null;
  } catch {
    return null;
  }
}
