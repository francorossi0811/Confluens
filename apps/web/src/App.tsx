import { useState } from 'react';

import { Landing } from '@/paginas/solicitudes/Landing';
import { ListadoSolicitudes } from '@/paginas/solicitudes/ListadoSolicitudes';

// Montaje temporal: todavía no hay router ni menú por rol integrado en esta rama (ADR 0002, HU-27,
// en otra rama sin mergear). Se alterna a mano entre la landing pública y el listado interno del
// Responsable de Eventos solo para poder verificar las dos pantallas de HU-14 en un solo lugar;
// cuando se integren las ramas, la landing pasa a ser la raíz pública y el listado cuelga del
// Panel. Mismo criterio documentado en HU-01 y HU-32.
export default function App() {
  const [vista, setVista] = useState<'publica' | 'interna'>('publica');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex justify-center gap-2 border-b bg-card p-2 text-xs">
        <button className="underline underline-offset-2" onClick={() => setVista('publica')}>
          Vista pública
        </button>
        <span className="text-muted-foreground">·</span>
        <button className="underline underline-offset-2" onClick={() => setVista('interna')}>
          Vista interna (RE)
        </button>
      </div>
      {vista === 'publica' ? <Landing /> : <ListadoSolicitudes />}
    </div>
  );
}
