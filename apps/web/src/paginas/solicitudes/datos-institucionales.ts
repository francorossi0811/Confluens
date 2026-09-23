// Contenido institucional de la landing (HU-07): ubicación, redes, formatos de armado, qué está
// incluido sin cargo y condiciones de contratación. Es estático a propósito: no son datos que el
// sistema administre (no hay entidad ni pantalla de alta para ellos) y no cambian por operación,
// a diferencia de salones y servicios, que sí se leen de la base.
//
// Los formatos, lo incluido y las condiciones se transcriben de docs/negocio/tarifario-2026.md
// (tarifario vigente del cliente). Si el tarifario cambia, se actualiza acá.

// Aportados por el equipo, todavía no están en docs/negocio/: conviene confirmarlos con el cliente
// antes del deploy. Solo se publica Instagram porque es la única red confirmada — no se inventan
// Facebook, WhatsApp ni teléfono.
export const UBICACION = {
  direccion: 'Av. Sabattini 459',
  localidad: 'Córdoba, Argentina',
  // Link en vez del iframe de Google Maps: embeberlo sumaría un tercero que rastrea a cualquiera
  // que entre a la landing, y el dato que el visitante necesita es la dirección.
  mapaUrl: 'https://www.google.com/maps/search/?api=1&query=Av.+Sabattini+459,+Córdoba,+Argentina',
} as const;

export const INSTAGRAM = {
  usuario: '@hoteldrcesarcarman',
  url: 'https://instagram.com/hoteldrcesarcarman',
} as const;

// tarifario-2026.md:23-24
export const FORMATOS_DE_ARMADO = [
  'Auditorio',
  'Escuela',
  'Imperial',
  'Montaje en U',
  'Banquete',
] as const;

// tarifario-2026.md:46-48
export const INCLUIDO_SIN_CARGO = [
  'Podio para locutor y atriles',
  'Rotafolios',
  'Sanitarios en planta baja y subsuelo',
  'Ambiente climatizado',
  'Wi-fi',
  'Servicio de gastronomía',
  'Asistencia médica permanente',
  'Estacionamiento gratuito para hasta 100 autos',
] as const;

// tarifario-2026.md:113-125. Se publican las condiciones, no las reglas RN-xx que originan: al
// cliente le importa el plazo, no el identificador interno.
export const CONDICIONES_DE_CONTRATACION = [
  { condicion: 'Seña', detalle: '20% del total, dentro de los 10 días de confirmado el evento' },
  {
    condicion: 'Falta de anticipo',
    detalle: 'El hotel se libera de responsabilidad por la reserva',
  },
  { condicion: 'Cancelación', detalle: 'Hasta 48 horas hábiles antes del evento' },
  { condicion: 'Reintegro', detalle: 'La seña no se reintegra ni se aplica a otros servicios' },
  { condicion: 'Validez del presupuesto', detalle: '30 días' },
  {
    condicion: 'Confirmación de asistentes',
    detalle: '7 días antes; se admiten hasta 5 personas más hasta 48 hs antes',
  },
  { condicion: 'Ausencias', detalle: 'Se cobra la cantidad contratada' },
  { condicion: 'Gastos extra', detalle: 'Se abonan al concluir el evento' },
  { condicion: 'Medios de pago', detalle: 'Efectivo, cheque, transferencia o tarjeta' },
  {
    condicion: 'Armado y montaje',
    detalle: 'No se permite clavar ni pegar material decorativo',
  },
  {
    condicion: 'Ingreso de alimentos',
    detalle: 'No permitido por parte del cliente, proveedores o invitados',
  },
] as const;
