import { IniciarSesion } from '@/paginas/auth/IniciarSesion';
import { Panel } from '@/paginas/panel/Panel';
import { useSesion } from '@/hooks/use-sesion';

export default function App() {
  const { data: sesion, isLoading } = useSesion();

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

  if (!sesion) {
    return <IniciarSesion />;
  }

  return <Panel sesion={sesion} />;
}
