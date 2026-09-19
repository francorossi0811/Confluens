import type { Credenciales, Sesion } from '@confluens/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { apiFetch, ErrorApiWeb } from '@/lib/api';

const CLAVE_SESION = ['sesion'] as const;

/**
 * Sesión actual, si existe. `retry: false` es clave acá: un 401 de GET /auth/yo es
 * una respuesta legítima (no hay sesión iniciada), no un error transitorio de red.
 * Sin esto, TanStack Query reintentaría varias veces antes de resolver "sin
 * sesión", demorando la pantalla de login innecesariamente.
 */
export function useSesion() {
  return useQuery<Sesion | null>({
    queryKey: CLAVE_SESION,
    queryFn: async () => {
      try {
        return await apiFetch<Sesion>('auth/yo');
      } catch (error) {
        if (error instanceof ErrorApiWeb && error.code === 'UNAUTHENTICATED') {
          return null;
        }
        throw error;
      }
    },
    retry: false,
  });
}

export function useIniciarSesion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (credenciales: Credenciales) =>
      apiFetch<Sesion>('auth/login', {
        method: 'POST',
        body: JSON.stringify(credenciales),
      }),
    onSuccess: (sesion) => {
      // Escribe directo en cache en vez de solo invalidar: evita un GET /auth/yo
      // extra inmediatamente después del login, ya que login ya devuelve la sesión.
      queryClient.setQueryData(CLAVE_SESION, sesion);
    },
  });
}

export function useCerrarSesion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiFetch<void>('auth/logout', { method: 'POST' }),
    onSuccess: () => {
      queryClient.setQueryData(CLAVE_SESION, null);
    },
  });
}
