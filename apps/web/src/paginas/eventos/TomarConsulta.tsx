import { esquemaCrearPresupuesto } from '@confluens/shared';
import type { Solicitud } from '@confluens/shared';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCrearPresupuesto } from '@/hooks/use-presupuestos';
import { ErrorApiCliente } from '@/lib/api';

interface ServicioSeleccionadoForm {
  servicioId: string;
  cantidad: string;
}

interface TomarConsultaProps {
  solicitud?: Solicitud;
  onCreado: (eventoId: number) => void;
}

// Genera el presupuesto Estimado (HU-09) que arranca el evento EnConsulta. Si `solicitud` viene
// (el RE apretó "Tomar consulta" en ListadoSolicitudes), precarga sus datos y manda solicitudId
// para que el backend vincule Solicitud.eventoId (HU-15). Todavía no existe un catálogo de
// salones/servicios navegable en esta rama (HU-01/HU-32 sin mergear), así que salonId y cada
// servicio se cargan por id numérico — es una limitación conocida, no un rediseño de HU-15.
export function TomarConsulta({ solicitud, onCreado }: TomarConsultaProps) {
  const crearPresupuesto = useCrearPresupuesto();

  const [nombre, setNombre] = useState(solicitud?.nombre ?? '');
  const [telefono, setTelefono] = useState(solicitud?.telefono ?? '');
  const [correo, setCorreo] = useState(solicitud?.correo ?? '');
  // La API devuelve fechaDeseada como datetime ISO completo (serialización de Prisma DateTime,
  // p.ej. "2026-09-23T00:00:00.000Z"), pero <input type="date"> exige "YYYY-MM-DD" exacto para
  // aceptar el value — por eso se recorta a los primeros 10 caracteres antes de precargar.
  const [fecha, setFecha] = useState(solicitud?.fechaDeseada.slice(0, 10) ?? '');
  const [cantidadPersonas, setCantidadPersonas] = useState(
    solicitud ? String(solicitud.cantidadPersonas) : '',
  );
  const [salonId, setSalonId] = useState('');
  const [tipoJornada, setTipoJornada] = useState<'completa' | 'media'>('completa');
  const [servicios, setServicios] = useState<ServicioSeleccionadoForm[]>([]);
  const [erroresCampos, setErroresCampos] = useState<Record<string, string>>({});

  function agregarServicio() {
    setServicios((anteriores) => [...anteriores, { servicioId: '', cantidad: '1' }]);
  }

  function quitarServicio(indice: number) {
    setServicios((anteriores) => anteriores.filter((_, i) => i !== indice));
  }

  function actualizarServicio(
    indice: number,
    campo: keyof ServicioSeleccionadoForm,
    valor: string,
  ) {
    setServicios((anteriores) =>
      anteriores.map((servicio, i) => (i === indice ? { ...servicio, [campo]: valor } : servicio)),
    );
  }

  function manejarEnvio(evento: React.FormEvent) {
    evento.preventDefault();

    const resultado = esquemaCrearPresupuesto.safeParse({
      nombre,
      telefono,
      correo,
      salonId: Number(salonId),
      fecha,
      cantidadPersonas: Number(cantidadPersonas),
      tipoJornada,
      servicios: servicios
        .filter((s) => s.servicioId !== '')
        .map((s) => ({ servicioId: Number(s.servicioId), cantidad: Number(s.cantidad) })),
      ...(solicitud ? { solicitudId: solicitud.id } : {}),
    });
    if (!resultado.success) {
      const errores: Record<string, string> = {};
      for (const issue of resultado.error.issues) {
        errores[String(issue.path[0])] = issue.message;
      }
      setErroresCampos(errores);
      return;
    }

    setErroresCampos({});
    crearPresupuesto.mutate(resultado.data, {
      onSuccess: (presupuesto) => onCreado(presupuesto.evento.id),
    });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-6">
      <div>
        <h1 className="text-xl font-semibold">Tomar consulta</h1>
        <p className="text-sm text-muted-foreground">
          Genera el presupuesto estimado y deja el evento En consulta.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos del evento</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={manejarEnvio} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="nombre">Nombre y apellido</Label>
              <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
              {erroresCampos['nombre'] && (
                <p className="text-sm text-destructive">{erroresCampos['nombre']}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
                {erroresCampos['telefono'] && (
                  <p className="text-sm text-destructive">{erroresCampos['telefono']}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="correo">Correo</Label>
                <Input
                  id="correo"
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
                {erroresCampos['correo'] && (
                  <p className="text-sm text-destructive">{erroresCampos['correo']}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="fecha">Fecha</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                />
                {erroresCampos['fecha'] && (
                  <p className="text-sm text-destructive">{erroresCampos['fecha']}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cantidadPersonas">Cantidad de personas</Label>
                <Input
                  id="cantidadPersonas"
                  type="number"
                  min={1}
                  value={cantidadPersonas}
                  onChange={(e) => setCantidadPersonas(e.target.value)}
                />
                {erroresCampos['cantidadPersonas'] && (
                  <p className="text-sm text-destructive">{erroresCampos['cantidadPersonas']}</p>
                )}
              </div>
            </div>

            {/* TODO (UX, post-merge Grupo A): reemplazar este input numérico por una selección
                visual de salones (nombre, capacidad, precioJornadaCompleta/precioMediaJornada) y el
                bloque de servicios de abajo por un checklist con desplegable de cantidad inline.
                Pedido explícito del usuario en esta sesión; no se implementa todavía porque salones
                y servicios son territorio de Grupo A (AGENTS.md §6) y hoy no existe endpoint de
                listado, solo búsqueda por id (presupuestos.repositorio.ts). Retomar cuando se
                mergeen esas ramas y haya GET /salones y GET /servicios reales. */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="salonId">Salón (id)</Label>
                <Input
                  id="salonId"
                  type="number"
                  min={1}
                  value={salonId}
                  onChange={(e) => setSalonId(e.target.value)}
                />
                {erroresCampos['salonId'] && (
                  <p className="text-sm text-destructive">{erroresCampos['salonId']}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Tipo de jornada</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={tipoJornada === 'completa' ? 'default' : 'outline'}
                    onClick={() => setTipoJornada('completa')}
                  >
                    Completa
                  </Button>
                  <Button
                    type="button"
                    variant={tipoJornada === 'media' ? 'default' : 'outline'}
                    onClick={() => setTipoJornada('media')}
                  >
                    Media
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Servicios (opcional)</Label>
                <Button type="button" variant="outline" size="sm" onClick={agregarServicio}>
                  Agregar servicio
                </Button>
              </div>
              {servicios.map((servicio, indice) => (
                <div key={indice} className="flex items-end gap-2">
                  <div className="flex-1 space-y-1.5">
                    <Label htmlFor={`servicio-id-${indice}`}>Servicio (id)</Label>
                    <Input
                      id={`servicio-id-${indice}`}
                      type="number"
                      min={1}
                      value={servicio.servicioId}
                      onChange={(e) => actualizarServicio(indice, 'servicioId', e.target.value)}
                    />
                  </div>
                  <div className="w-28 space-y-1.5">
                    <Label htmlFor={`servicio-cantidad-${indice}`}>Cantidad</Label>
                    <Input
                      id={`servicio-cantidad-${indice}`}
                      type="number"
                      min={1}
                      value={servicio.cantidad}
                      onChange={(e) => actualizarServicio(indice, 'cantidad', e.target.value)}
                    />
                  </div>
                  <Button type="button" variant="ghost" onClick={() => quitarServicio(indice)}>
                    Quitar
                  </Button>
                </div>
              ))}
            </div>

            {crearPresupuesto.isError && (
              <p className="text-sm text-destructive">
                {crearPresupuesto.error instanceof ErrorApiCliente
                  ? crearPresupuesto.error.message
                  : 'No se pudo generar el presupuesto.'}
              </p>
            )}

            <Button type="submit" disabled={crearPresupuesto.isPending} className="w-full">
              {crearPresupuesto.isPending ? 'Generando…' : 'Generar presupuesto'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
