import { Building2, Coffee, Ruler, Users } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CATEGORIAS_SERVICIOS_PRESENTACION, SALONES_PRESENTACION } from './datos-presentacion';
import { FormularioConsulta } from './FormularioConsulta';

// Landing pública (carta de presentación, HU-14): presenta la organización, los salones y las
// categorías de servicios, y termina en el formulario de consulta. No requiere autenticación
// (criterio 2) ni bloquea el salón (criterio 3, no hay nada que reservar todavía en esta pantalla).
//
// Fotos: no hay material real todavía, así que cada salón muestra un ícono en vez de una imagen de
// stock inventada. Se reemplaza por fotografía real cuando el equipo la tenga (ver conversación
// del PR, no hace falta tocar el modelo de datos para eso: son assets del frontend).
export function Landing() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            Los Abuelos Servicios Gastronómicos
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            Tu evento, en el salón que se ajusta a vos
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Cinco salones y un catálogo de servicios gastronómicos para eventos sociales y
            empresariales. Contanos qué necesitás y te respondemos con la disponibilidad.
          </p>
          <Button size="lg" className="mt-8" asChild>
            <a href="#consulta">Consultar disponibilidad</a>
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-2xl font-semibold">Nuestros salones</h2>
        <p className="mt-1 text-muted-foreground">Capacidad en formato banquete.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SALONES_PRESENTACION.map((salon) => (
            <Card key={salon.nombre}>
              <CardHeader>
                <Building2 className="size-8 text-muted-foreground" />
                <CardTitle>{salon.nombre}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Users className="size-4" /> Hasta {salon.capacidadBanquete} personas
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Ruler className="size-4" /> {salon.superficie} m²
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t bg-card">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-semibold">Servicios gastronómicos</h2>
          <p className="mt-1 text-muted-foreground">
            Se suman al evento según la cantidad de personas que definas.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIAS_SERVICIOS_PRESENTACION.map((categoria) => (
              <Card key={categoria.nombre}>
                <CardHeader>
                  <Coffee className="size-8 text-muted-foreground" />
                  <CardTitle>{categoria.nombre}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {categoria.descripcion}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="consulta" className="mx-auto max-w-lg px-6 py-16">
        <h2 className="text-center text-2xl font-semibold">Contanos sobre tu evento</h2>
        <p className="mt-1 text-center text-muted-foreground">
          Dejanos tus datos y la fecha que tenés en mente.
        </p>
        <div className="mt-6">
          <FormularioConsulta />
        </div>
      </section>
    </main>
  );
}
