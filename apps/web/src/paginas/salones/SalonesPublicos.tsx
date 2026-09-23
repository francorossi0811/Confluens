import type { SalonPublico } from '@confluens/shared';
import { Building2, ChevronDown, Ruler, Users } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSalonesPublicos } from '@/hooks/use-salones';

// Listado de salones del canal público (HU-07). Lee de GET /salones/publicos, no de constantes en
// código: por eso un cambio de datos del salón se ve en la landing sin un paso de publicación
// manual (criterio 4) y un salón despublicado desde HU-08 deja de aparecer (criterio 6).
//
// Sin precios a propósito: el endpoint no los devuelve (ver salones.repositorio.ts). La vista con
// precios sin IVA es la del cliente registrado, y es del Sprint 2.
export function SalonesPublicos({ onConsultar }: { onConsultar: (salon: SalonPublico) => void }) {
  const { data: salones, isLoading, isError } = useSalonesPublicos();
  // Un solo salón expandido por vez: la ficha con distribuciones es larga y tenerlas todas
  // abiertas obliga a scrollear la sección entera para comparar dos salones.
  const [expandido, setExpandido] = useState<number | null>(null);

  if (isLoading) {
    return <p className="mt-6 text-sm text-muted-foreground">Cargando salones…</p>;
  }

  if (isError) {
    return (
      <p className="mt-6 text-sm text-destructive">
        No se pudieron cargar los salones. Probá recargar la página.
      </p>
    );
  }

  if (!salones || salones.length === 0) {
    return (
      <p className="mt-6 text-sm text-muted-foreground">
        Por el momento no hay salones publicados. Escribinos y te contamos las opciones disponibles.
      </p>
    );
  }

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {salones.map((salon) => {
        const estaExpandido = expandido === salon.id;

        return (
          <Card key={salon.id} className="flex flex-col">
            <CardHeader>
              {/* Mientras el salón no tenga foto cargada (HU-08) se muestra un ícono, no una
                  imagen de stock que no corresponde al salón real. */}
              {salon.fotoUrl ? (
                <img
                  src={salon.fotoUrl}
                  alt={`Salón ${salon.nombre}`}
                  className="h-40 w-full rounded-md object-cover"
                />
              ) : (
                <div className="flex h-40 w-full items-center justify-center rounded-md bg-muted">
                  <Building2 className="size-8 text-muted-foreground" />
                </div>
              )}
              <CardTitle>{salon.nombre}</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col gap-3 text-sm text-muted-foreground">
              <div className="flex flex-col gap-1">
                <span className="inline-flex items-center gap-1.5">
                  <Users className="size-4" /> Hasta {salon.capacidadMaxima} personas
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Ruler className="size-4" /> {salon.superficie} m²
                </span>
              </div>

              {/* Criterio 2: al seleccionar un salón se ven sus distribuciones posibles con la
                  capacidad de cada una. */}
              {salon.distribuciones.length > 0 && (
                <div>
                  <button
                    type="button"
                    aria-expanded={estaExpandido}
                    className="inline-flex items-center gap-1 text-sm font-medium text-foreground underline underline-offset-2"
                    onClick={() => setExpandido(estaExpandido ? null : salon.id)}
                  >
                    {estaExpandido ? 'Ocultar' : 'Ver'} distribuciones
                    <ChevronDown
                      className={`size-4 transition-transform ${estaExpandido ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {estaExpandido && (
                    <ul className="mt-2 divide-y rounded-md border">
                      {salon.distribuciones.map((distribucion) => (
                        <li
                          key={distribucion.id}
                          className="flex items-center justify-between px-3 py-2"
                        >
                          <span>{distribucion.nombre}</span>
                          <span className="font-medium text-foreground">
                            {distribucion.capacidad} personas
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Criterio 3: desde la ficha se avanza al formulario con el salón preseleccionado. */}
              <Button variant="outline" className="mt-auto" onClick={() => onConsultar(salon)}>
                Consultar este salón
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
