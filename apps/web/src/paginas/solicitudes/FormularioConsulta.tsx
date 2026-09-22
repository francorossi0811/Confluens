import { esquemaCrearSolicitud } from '@confluens/shared';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ErrorApiCliente } from '@/lib/api';
import { useRegistrarSolicitud } from '@/hooks/use-solicitudes';

const valoresIniciales = {
  nombre: '',
  telefono: '',
  correo: '',
  fechaDeseada: '',
  cantidadPersonas: '',
};

// Igual que RegistrarServicio.tsx (HU-32) y ConsultarSalones.tsx (HU-01): useState controlado en
// vez de React Hook Form, porque los componentes ui/* de shadcn no usan React.forwardRef. Se
// valida con el mismo esquemaCrearSolicitud del servidor para dar el error al toque (criterio 5)
// sin esperar el round-trip — cantidadPersonas viaja como string en el estado del input y se
// castea a número recién al validar, porque <input type="number"> maneja strings.
export function FormularioConsulta() {
  const registrarSolicitud = useRegistrarSolicitud();

  const [valores, setValores] = useState(valoresIniciales);
  const [erroresCampos, setErroresCampos] = useState<Record<string, string>>({});

  function actualizarCampo<K extends keyof typeof valoresIniciales>(
    campo: K,
    valor: (typeof valoresIniciales)[K],
  ) {
    setValores((anteriores) => ({ ...anteriores, [campo]: valor }));
  }

  function manejarEnvio(evento: React.FormEvent) {
    evento.preventDefault();

    const resultado = esquemaCrearSolicitud.safeParse({
      ...valores,
      cantidadPersonas: Number(valores.cantidadPersonas),
    });
    if (!resultado.success) {
      const errores: Record<string, string> = {};
      for (const issue of resultado.error.issues) {
        errores[String(issue.path[0])] = issue.message;
      }
      setErroresCampos(errores);
      return;
    }

    setErroresCampos({});
    registrarSolicitud.mutate(resultado.data, {
      onSuccess: () => setValores(valoresIniciales),
    });
  }

  // Criterio 1 (HU-14): "recibo confirmación de que fue enviada". Se muestra en vez del
  // formulario, con la opción de cargar otra consulta sin perder el resto de la landing.
  if (registrarSolicitud.isSuccess) {
    return (
      <div className="rounded-lg border bg-card p-6 text-center">
        <h3 className="text-lg font-medium">¡Listo! Recibimos tu consulta</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          En breve nos comunicamos para coordinar los detalles.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => registrarSolicitud.reset()}>
          Enviar otra consulta
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={manejarEnvio} className="space-y-4 rounded-lg border bg-card p-6">
      <div className="space-y-1.5">
        <Label htmlFor="nombre">Nombre y apellido</Label>
        <Input
          id="nombre"
          value={valores.nombre}
          onChange={(e) => actualizarCampo('nombre', e.target.value)}
        />
        {erroresCampos['nombre'] && (
          <p className="text-sm text-destructive">{erroresCampos['nombre']}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            value={valores.telefono}
            onChange={(e) => actualizarCampo('telefono', e.target.value)}
          />
          {erroresCampos['telefono'] && (
            <p className="text-sm text-destructive">{erroresCampos['telefono']}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="correo">Correo</Label>
          <Input
            id="correo"
            type="email"
            value={valores.correo}
            onChange={(e) => actualizarCampo('correo', e.target.value)}
          />
          {erroresCampos['correo'] && (
            <p className="text-sm text-destructive">{erroresCampos['correo']}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="fechaDeseada">Fecha deseada</Label>
          <Input
            id="fechaDeseada"
            type="date"
            value={valores.fechaDeseada}
            onChange={(e) => actualizarCampo('fechaDeseada', e.target.value)}
          />
          {erroresCampos['fechaDeseada'] && (
            <p className="text-sm text-destructive">{erroresCampos['fechaDeseada']}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cantidadPersonas">Cantidad estimada de personas</Label>
          <Input
            id="cantidadPersonas"
            type="number"
            min={1}
            value={valores.cantidadPersonas}
            onChange={(e) => actualizarCampo('cantidadPersonas', e.target.value)}
          />
          {erroresCampos['cantidadPersonas'] && (
            <p className="text-sm text-destructive">{erroresCampos['cantidadPersonas']}</p>
          )}
        </div>
      </div>

      {registrarSolicitud.isError && (
        <p className="text-sm text-destructive">
          {registrarSolicitud.error instanceof ErrorApiCliente
            ? registrarSolicitud.error.message
            : 'No se pudo enviar la consulta.'}
        </p>
      )}

      <Button type="submit" disabled={registrarSolicitud.isPending} className="w-full">
        {registrarSolicitud.isPending ? 'Enviando…' : 'Enviar consulta'}
      </Button>
    </form>
  );
}
