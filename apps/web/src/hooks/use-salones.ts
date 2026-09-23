import type { RespuestaExito, SalonConDistribuciones, SalonPublico } from '@confluens/shared';
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

// Catálogo del canal público (HU-07). Query aparte de useSalones —y no el mismo dato filtrado en
// la web— porque son respuestas distintas: esta no trae los salones despublicados ni los precios.
// La clave anidada ['salones', 'publicos'] hace que invalidateQueries({ queryKey: ['salones'] })
// alcance a las dos, que es lo que el criterio 4 pide: si cambian los datos de un salón, la landing
// se actualiza sin un paso de publicación manual.
export function useSalonesPublicos() {
  return useQuery({
    queryKey: ['salones', 'publicos'],
    queryFn: async () => {
      const respuesta = await apiFetch<RespuestaExito<SalonPublico[]>>('/salones/publicos');
      return respuesta.data;
    },
  });
}
