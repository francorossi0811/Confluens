import type { CrearSolicitud, RespuestaExito, Solicitud } from '@confluens/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { apiFetch } from '@/lib/api';

// Usado por el listado interno del Responsable de Eventos (criterio 4 de HU-14): todavía no hay
// autenticación montada en esta rama, así que el endpoint responde a cualquiera que lo consulte.
export function useSolicitudes() {
  return useQuery({
    queryKey: ['solicitudes'],
    queryFn: async () => {
      const respuesta = await apiFetch<RespuestaExito<Solicitud[]>>('/solicitudes');
      return respuesta.data;
    },
  });
}

// Usado por el formulario público (sin sesión, criterio 2 de HU-14).
export function useRegistrarSolicitud() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (datos: CrearSolicitud) => {
      const respuesta = await apiFetch<RespuestaExito<Solicitud>>('/solicitudes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
      return respuesta.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['solicitudes'] });
    },
  });
}
