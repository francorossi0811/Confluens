import { ConsultarSalones } from '@/paginas/salones/ConsultarSalones';

// Montaje temporal: todavía no hay router ni menú por rol (eso llega con HU-27, en otra rama sin
// mergear). Cuando se integren, esta página pasa a colgar de una ruta protegida en vez de ser la
// raíz de la app.
export default function App() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <ConsultarSalones />
    </main>
  );
}
