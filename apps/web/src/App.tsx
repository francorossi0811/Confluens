import type { Solicitud } from '@confluens/shared';
import { useState } from 'react';

import { useSesion } from '@/hooks/use-sesion';
import { DetalleEvento } from '@/paginas/eventos/DetalleEvento';
import { TomarConsulta } from '@/paginas/eventos/TomarConsulta';
import { IniciarSesion } from '@/paginas/auth/IniciarSesion';
import { Panel } from '@/paginas/panel/Panel';
import { Landing } from '@/paginas/solicitudes/Landing';
import { ListadoSolicitudes } from '@/paginas/solicitudes/ListadoSolicitudes';

type Vista =
  | { tipo: 'publica' }
  | { tipo: 'interna' }
  | { tipo: 'tomar-consulta'; solicitud?: Solicitud }
  | { tipo: 'detalle-evento'; eventoId: number };

// Montaje temporal, todavía sin router (ADR 0002). Al integrar HU-27 con HU-14/HU-15 el canal
// público (landing + formulario de consulta, que no requiere sesión por el criterio 2 de HU-14)
// queda separado del canal interno, que ahora sí pasa por el login y el panel por rol de HU-27.
// Las pantallas internas de HU-14/HU-15 se alcanzan desde el panel con el conmutador de abajo:
// los ítems del menú de Panel siguen sin rutear (eso es HU-28), así que no se los toca acá.
export default function App() {
  const { data: sesion, isLoading } = useSesion();
  const [vista, setVista] = useState<Vista>({ tipo: 'publica' });

  // Mientras se resuelve GET /auth/yo no se sabe todavía si hay sesión: mostrar
  // login prematuramente causaría un parpadeo (login → panel) en cada recarga de
  // página para un usuario que sí tiene sesión vigente.
  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="text-sm text-muted-foreground">Cargando…</p>
      </main>
    );
  }

  if (vista.tipo === 'publica') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex justify-end border-b bg-card p-2 text-xs">
          <button
            className="underline underline-offset-2"
            onClick={() => setVista({ tipo: 'interna' })}
          >
            Acceso interno
          </button>
        </div>
        <Landing />
      </div>
    );
  }

  if (!sesion) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex justify-start border-b bg-card p-2 text-xs">
          <button
            className="underline underline-offset-2"
            onClick={() => setVista({ tipo: 'publica' })}
          >
            ← Volver al sitio público
          </button>
        </div>
        <IniciarSesion />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Panel sesion={sesion} />
      <div className="flex justify-center gap-2 border-t bg-card p-2 text-xs">
        <button
          className="underline underline-offset-2"
          onClick={() => setVista({ tipo: 'interna' })}
        >
          Solicitudes
        </button>
        <span className="text-muted-foreground">·</span>
        <button
          className="underline underline-offset-2"
          onClick={() => setVista({ tipo: 'publica' })}
        >
          Vista pública
        </button>
      </div>
      {vista.tipo === 'interna' && (
        <ListadoSolicitudes
          onTomar={(solicitud) => setVista({ tipo: 'tomar-consulta', solicitud })}
        />
      )}
      {vista.tipo === 'tomar-consulta' && (
        <TomarConsulta
          solicitud={vista.solicitud}
          onCreado={(eventoId) => setVista({ tipo: 'detalle-evento', eventoId })}
        />
      )}
      {vista.tipo === 'detalle-evento' && <DetalleEvento eventoId={vista.eventoId} />}
    </div>
  );
}
