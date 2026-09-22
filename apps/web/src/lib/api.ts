import type { RespuestaError } from '@confluens/shared';

// Vacía en desarrollo: Vite redirige /api a la API local (ver server.proxy en vite.config.ts).
// En producción apunta al servicio de Render (ver VITE_API_URL en .env.example).
const URL_BASE_API = import.meta.env.VITE_API_URL ?? '';

// Preserva el code/message que ya arma la API (packages/shared/src/api/respuesta.ts) para que la
// UI pueda mostrar el mensaje real en vez de un genérico "algo salió mal".
export class ErrorApiCliente extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = 'ErrorApiCliente';
  }
}

export async function apiFetch<T>(ruta: string, opciones?: RequestInit): Promise<T> {
  const respuesta = await fetch(`${URL_BASE_API}/api${ruta}`, opciones);

  if (!respuesta.ok) {
    const cuerpo = (await respuesta.json()) as RespuestaError;
    throw new ErrorApiCliente(cuerpo.error.message, cuerpo.error.code);
  }

  return (await respuesta.json()) as T;
}
