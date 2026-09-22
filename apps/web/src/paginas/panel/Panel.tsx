import type { Rol, Sesion } from '@confluens/shared';

import { Button } from '@/components/ui/button';
import { useCerrarSesion } from '@/hooks/use-sesion';

// Qué ítems de menú ve cada rol. Criterio 3 de HU-27: un Responsable de Eventos no
// puede llegar a administración de usuarios ni a reportes de ingresos. Esas
// pantallas todavía no existen (son HU-28 y HU-21, futuras) — este mapa solo decide
// visibilidad de menú, no rutea a nada todavía, así que no se inventa contenido que
// no está en el alcance de esta historia.
const SECCIONES_POR_ROL: Record<Rol, string[]> = {
  RESPONSABLE_EVENTOS: ['Salones', 'Solicitudes', 'Presupuestos', 'Eventos'],
  RESPONSABLE_FINANZAS: ['Presupuestos', 'Eventos', 'Cobranzas'],
  GERENTE_GENERAL: [
    'Salones',
    'Solicitudes',
    'Presupuestos',
    'Eventos',
    'Cobranzas',
    'Administración de usuarios',
    'Reportes de ingresos',
  ],
  CLIENTE: ['Mis solicitudes'],
};

export function Panel({ sesion }: { sesion: Sesion }) {
  const cerrarSesion = useCerrarSesion();

  return (
    <main className="flex min-h-screen flex-col gap-6 bg-background p-6 text-foreground">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Confluens</h1>
          <p className="text-sm text-muted-foreground">
            {sesion.email} · {sesion.rol}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => cerrarSesion.mutate()}
          disabled={cerrarSesion.isPending}
        >
          Cerrar sesión
        </Button>
      </header>

      <nav className="flex flex-col gap-2">
        {SECCIONES_POR_ROL[sesion.rol].map((seccion) => (
          <span key={seccion} className="rounded-lg border px-3 py-2 text-sm">
            {seccion}
          </span>
        ))}
      </nav>
    </main>
  );
}
