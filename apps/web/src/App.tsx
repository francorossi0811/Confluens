import { RegistrarServicio } from '@/paginas/servicios/RegistrarServicio';

// Montaje temporal: todavía no hay router ni menú por rol (eso llega con HU-27, en otra rama sin
// mergear). Cuando se integren, esta página pasa a colgar de una ruta protegida en vez de ser la
// raíz de la app — mismo criterio que se dejó documentado para ConsultarSalones (HU-01).
import type { Solicitud } from '@confluens/shared';
import { useState } from 'react';

import { DetalleEvento } from '@/paginas/eventos/DetalleEvento';
import { TomarConsulta } from '@/paginas/eventos/TomarConsulta';
import { Landing } from '@/paginas/solicitudes/Landing';
import { ListadoSolicitudes } from '@/paginas/solicitudes/ListadoSolicitudes';

type Vista =
  | { tipo: 'publica' }
  | { tipo: 'interna' }
  | { tipo: 'tomar-consulta'; solicitud?: Solicitud }
  | { tipo: 'detalle-evento'; eventoId: number };

// Montaje temporal: todavía no hay router ni menú por rol integrado en esta rama (ADR 0002, HU-27,
// en otra rama sin mergear). Se alterna a mano entre la landing pública y las pantallas internas
// del Responsable de Eventos solo para poder verificarlas en un solo lugar; cuando se integren
// las ramas, la landing pasa a ser la raíz pública y el resto cuelga del Panel. Mismo criterio
// documentado en HU-01, HU-14 y HU-32.

// Montaje temporal: todavía no hay router ni menú por rol (eso llega con HU-27, en otra rama sin
// mergear). Cuando se integren, esta página pasa a colgar de una ruta protegida en vez de ser la
// raíz de la app.
export default function App() {
  const [vista, setVista] = useState<Vista>({ tipo: 'publica' });

  return (
    <>
      <main className="min-h-screen bg-background text-foreground">
        <RegistrarServicio />
      </main>
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex justify-center gap-2 border-b bg-card p-2 text-xs">
          <button
            className="underline underline-offset-2"
            onClick={() => setVista({ tipo: 'publica' })}
          >
            Vista pública
          </button>
          <span className="text-muted-foreground">·</span>
          <button
            className="underline underline-offset-2"
            onClick={() => setVista({ tipo: 'interna' })}
          >
            Vista interna (RE)
          </button>
        </div>
        {vista.tipo === 'publica' && <Landing />}
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
    </>
  );
}
