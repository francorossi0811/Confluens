import type { CrearPresupuesto, PresupuestoDetallado, RespuestaExito } from '@confluens/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiFetch } from '@/lib/api';

// Usado por TomarConsulta.tsx (HU-09/HU-15): crea Cliente (si hace falta), Evento EnConsulta y
// Presupuesto Estimado en un solo paso. Si `datos.solicitudId` viene, además vincula
// Solicitud.eventoId (HU-15), por eso invalida también ['solicitudes'].
export function useCrearPresupuesto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (datos: CrearPresupuesto) => {
      const respuesta = await apiFetch<RespuestaExito<PresupuestoDetallado>>('/presupuestos', {
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
