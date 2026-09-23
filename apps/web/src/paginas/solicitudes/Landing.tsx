import type { SalonPublico } from '@confluens/shared';
// AtSign y no un ícono de Instagram: lucide-react sacó los logos de marca de su set, y no se
// agrega una dependencia de íconos nueva por un solo enlace.
import { AtSign, Check, LayoutGrid, MapPin } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ServiciosPublicos } from '@/paginas/servicios/ServiciosPublicos';
import { SalonesPublicos } from '@/paginas/salones/SalonesPublicos';
import {
  CONDICIONES_DE_CONTRATACION,
  FORMATOS_DE_ARMADO,
  INCLUIDO_SIN_CARGO,
  INSTAGRAM,
  UBICACION,
} from './datos-institucionales';
import { FormularioConsulta } from './FormularioConsulta';

// Landing pública (HU-07, sobre la carta de presentación de HU-14): presenta salones, oferta
// gastronómica, ubicación, redes, formatos de armado y condiciones de contratación, y termina en
// el formulario de consulta. No requiere autenticación (criterio 1 de HU-07 y criterio 2 de
// HU-14).
//
// Salones y servicios se leen de la API (criterio 4: los cambios se reflejan sin publicación
// manual). Lo institucional es estático, en datos-institucionales.ts.
//
// Sin precios en toda la pantalla: la vista con precios sin IVA es la del cliente registrado y es
// del Sprint 2. Los endpoints públicos tampoco los devuelven, así que no hay riesgo de que se
// filtren por el Network aunque nadie los muestre.
export function Landing() {
  // Criterio 3: desde la ficha de un salón se llega al formulario con ese salón preseleccionado.
  const [salonElegido, setSalonElegido] = useState<SalonPublico | null>(null);

  function consultarSalon(salon: SalonPublico) {
    setSalonElegido(salon);
    // El formulario está en la misma página; sin router (ADR 0002) el "avanzar al formulario" es
    // el scroll al ancla, igual que el botón del encabezado.
    document.getElementById('consulta')?.scrollIntoView({ behavior: 'smooth' });
  }

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
        <p className="mt-1 text-muted-foreground">
          Mirá las distribuciones posibles de cada salón y consultá por el que te sirva.
        </p>
        <SalonesPublicos onConsultar={consultarSalon} />
      </section>

      <section className="border-t bg-card">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-semibold">Servicios gastronómicos</h2>
          <p className="mt-1 text-muted-foreground">
            Se suman al evento según la cantidad de personas que definas.
          </p>
          <ServiciosPublicos />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <h2 className="inline-flex items-center gap-2 text-2xl font-semibold">
              <LayoutGrid className="size-5" /> Formatos de armado
            </h2>
            <p className="mt-1 text-muted-foreground">
              Cada salón se arma en el formato que mejor se adapte al evento.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {FORMATOS_DE_ARMADO.map((formato) => (
                <li key={formato} className="rounded-full border px-3 py-1 text-sm">
                  {formato}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Incluido sin cargo</h2>
            <p className="mt-1 text-muted-foreground">Viene con el alquiler del salón.</p>
            <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
              {INCLUIDO_SIN_CARGO.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t bg-card">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-semibold">Condiciones de contratación</h2>
          <p className="mt-1 text-muted-foreground">
            Las mismas que figuran en el presupuesto que te enviamos.
          </p>
          <dl className="mt-6 divide-y rounded-lg border bg-background">
            {CONDICIONES_DE_CONTRATACION.map(({ condicion, detalle }) => (
              <div key={condicion} className="grid gap-1 p-4 sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium">{condicion}</dt>
                <dd className="text-sm text-muted-foreground sm:col-span-2">{detalle}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="consulta" className="mx-auto max-w-lg px-6 py-16">
        <h2 className="text-center text-2xl font-semibold">Contanos sobre tu evento</h2>
        <p className="mt-1 text-center text-muted-foreground">
          Dejanos tus datos y la fecha que tenés en mente.
        </p>
        <div className="mt-6">
          <FormularioConsulta
            salonElegido={salonElegido}
            onQuitarSalon={() => setSalonElegido(null)}
          />
        </div>
      </section>

      <footer className="border-t bg-card">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-10 text-sm sm:flex-row sm:items-center sm:justify-between">
          <a
            href={UBICACION.mapaUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-muted-foreground underline-offset-4 hover:underline"
          >
            <MapPin className="size-4" />
            {UBICACION.direccion} · {UBICACION.localidad}
          </a>
          <a
            href={INSTAGRAM.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-muted-foreground underline-offset-4 hover:underline"
          >
            <AtSign className="size-4" />
            {INSTAGRAM.usuario} en Instagram
          </a>
        </div>
      </footer>
    </main>
  );
}
