import type { ServicioPublico } from '@confluens/shared';
import { Coffee } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useServiciosPublicos } from '@/hooks/use-servicios';

const SIN_CATEGORIA = 'Otros servicios';

// Agrupa por categoría preservando el orden en que vienen: el endpoint ya ordena por categoría y
// después por nombre, con los servicios sin categoría al final (ver servicios.repositorio.ts).
function agruparPorCategoria(servicios: ServicioPublico[]) {
  const grupos = new Map<string, ServicioPublico[]>();
  for (const servicio of servicios) {
    const categoria = servicio.categoria ?? SIN_CATEGORIA;
    const grupo = grupos.get(categoria);
    if (grupo) {
      grupo.push(servicio);
    } else {
      grupos.set(categoria, [servicio]);
    }
  }
  return [...grupos];
}

// Oferta gastronómica del canal público (HU-07). Son los servicios reales del catálogo, no un
// resumen escrito a mano: si se da de alta un servicio nuevo, aparece acá sin tocar código.
// Sin precios — el endpoint no los devuelve.
export function ServiciosPublicos() {
  const { data: servicios, isLoading, isError } = useServiciosPublicos();

  if (isLoading) {
    return <p className="mt-6 text-sm text-muted-foreground">Cargando servicios…</p>;
  }

  if (isError) {
    return (
      <p className="mt-6 text-sm text-destructive">
        No se pudo cargar la oferta gastronómica. Probá recargar la página.
      </p>
    );
  }

  if (!servicios || servicios.length === 0) {
    return (
      <p className="mt-6 text-sm text-muted-foreground">
        Estamos actualizando la carta. Consultanos y te la enviamos.
      </p>
    );
  }

  return (
    <div className="mt-6 space-y-10">
      {agruparPorCategoria(servicios).map(([categoria, delGrupo]) => (
        <div key={categoria}>
          <h3 className="text-lg font-medium">{categoria}</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {delGrupo.map((servicio) => (
              <Card key={servicio.id}>
                <CardHeader>
                  {servicio.fotoUrl ? (
                    <img
                      src={servicio.fotoUrl}
                      alt={servicio.nombre}
                      className="h-32 w-full rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex h-32 w-full items-center justify-center rounded-md bg-muted">
                      <Coffee className="size-7 text-muted-foreground" />
                    </div>
                  )}
                  <CardTitle className="text-base">{servicio.nombre}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {servicio.descripcion}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
