import type { RespuestaError, RespuestaExito } from '@confluens/shared';

// Error tipado que envuelve el `error` del contrato {data}/{error} de la API
// (ver AGENTS.md, "Formato de respuesta"), para que quien llame pueda mostrar
// error.message directamente sin volver a parsear la respuesta.
export class ErrorApiWeb extends Error {
  readonly code: RespuestaError['error']['code'];

  constructor(error: RespuestaError['error']) {
    super(error.message);
    this.name = 'ErrorApiWeb';
    this.code = error.code;
  }
}

/**
 * Wrapper de fetch para llamar a la API. `credentials: 'include'` es imprescindible
 * para HU-27: sin esto, el navegador no manda la cookie httpOnly de sesión en el
 * request, y todo endpoint protegido respondería 401 aunque el login haya sido
 * exitoso. path es relativo a /api (ej. 'auth/login').
 */
export async function apiFetch<T>(path: string, opciones?: RequestInit): Promise<T> {
  const respuesta = await fetch(`/api/${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...opciones?.headers },
    ...opciones,
  });

  // 204 (ej. logout) no trae body: no hay nada que parsear.
  if (respuesta.status === 204) {
    return undefined as T;
  }

  const cuerpo = (await respuesta.json()) as RespuestaExito<T> | RespuestaError;

  if (!respuesta.ok) {
    throw new ErrorApiWeb((cuerpo as RespuestaError).error);
  }

  return (cuerpo as RespuestaExito<T>).data;
}
