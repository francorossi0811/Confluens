import { useSolicitudes } from '@/hooks/use-solicitudes';

const formateadorFecha = new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium' });

// Vista interna para el Responsable de Eventos (criterio 4 de HU-14): "ve la solicitud
// diferenciada visualmente de reservas y eventos". Todavía no existen reservas ni eventos en la
// UI (llegan con HU-09/HU-15), así que la diferenciación hoy es la etiqueta "Solicitud" — el
// mismo lenguaje visual (badge) se reutiliza cuando aparezcan las otras dos listas.
// Sin autenticación todavía: cuando se monte el middleware de HU-27, este endpoint pasa a
// requerir sesión de RE/GG (mismo comentario que en solicitudes.controlador.ts).
export function ListadoSolicitudes() {
  const { data: solicitudes, isLoading, isError } = useSolicitudes();

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-6">
      <div>
        <h1 className="text-xl font-semibold">Solicitudes recibidas</h1>
        <p className="text-sm text-muted-foreground">Vista interna del Responsable de Eventos.</p>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Cargando…</p>}
      {isError && (
        <p className="text-sm text-destructive">No se pudieron cargar las solicitudes.</p>
      )}
      {solicitudes && solicitudes.length === 0 && (
        <p className="text-sm text-muted-foreground">Todavía no llegó ninguna solicitud.</p>
      )}

      <ul className="divide-y rounded-lg border">
        {solicitudes?.map((solicitud) => (
          <li key={solicitud.id} className="flex items-center justify-between gap-4 p-3 text-sm">
            <div>
              <p className="font-medium">{solicitud.nombre}</p>
              <p className="text-muted-foreground">
                {solicitud.telefono} · {solicitud.correo} · {solicitud.cantidadPersonas} personas ·{' '}
                {formateadorFecha.format(new Date(solicitud.fechaDeseada))}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
              Solicitud
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
