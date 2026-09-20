import { RegistrarServicio } from '@/paginas/servicios/RegistrarServicio';

// Montaje temporal: todavía no hay router ni menú por rol (eso llega con HU-27, en otra rama sin
// mergear). Cuando se integren, esta página pasa a colgar de una ruta protegida en vez de ser la
// raíz de la app — mismo criterio que se dejó documentado para ConsultarSalones (HU-01).
export default function App() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <RegistrarServicio />
    </main>
  );
}
