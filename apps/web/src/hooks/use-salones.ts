import type { RespuestaExito, SalonConDistribuciones } from '@confluens/shared';
import { useQuery } from '@tanstack/react-query';

import { apiFetch } from '@/lib/api';

// Los 5 salones con distribuciones anidadas llegan en un único request (ver comentario en
// packages/shared/src/esquemas/salon.esquema.ts); no hace falta paginar ni refetch agresivo
// porque el catálogo cambia por seed o alta manual, no en tiempo real.
export function useSalones() {
  return useQuery({
    queryKey: ['salones'],
    queryFn: async () => {
      const respuesta = await apiFetch<RespuestaExito<SalonConDistribuciones[]>>('/salones');
      return respuesta.data;
    },
  });
}
