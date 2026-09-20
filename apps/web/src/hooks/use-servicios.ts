import type { CrearServicio, RespuestaExito, Servicio } from '@confluens/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { apiFetch } from '@/lib/api';

// Catálogo de servicios: mismo criterio que useSalones (HU-01), sin refetch agresivo porque el
// catálogo cambia por alta manual, no en tiempo real.
export function useServicios() {
  return useQuery({
    queryKey: ['servicios'],
    queryFn: async () => {
      const respuesta = await apiFetch<RespuestaExito<Servicio[]>>('/servicios');
      return respuesta.data;
    },
  });
}

export function useCrearServicio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (datos: CrearServicio) => {
      const respuesta = await apiFetch<RespuestaExito<Servicio>>('/servicios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
      return respuesta.data;
    },
    // Invalida el catálogo para que el listado refleje el alta sin recargar la página (criterio 1:
    // "queda disponible para seleccionar").
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['servicios'] });
    },
  });
}
