import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

import { crearApp } from '../../app.js';

// Se mockea el repositorio (no la DB real): mismo criterio que auth.rutas.test.ts (HU-27), ver
// ADR 0003 — ci.yml no levanta Postgres para el job de test. vi.mock se hoistea automáticamente
// por encima de los imports de este archivo, así que crearApp() ya usa este mock.
const FECHA = new Date('2026-01-01T00:00:00.000Z');

const distribucionAuditorio = {
  id: 1,
  salonId: 1,
  nombre: 'Conferencia',
  capacidad: 280,
  creadoEn: FECHA,
  actualizadoEn: FECHA,
};

// Auditorio está publicado y Bariloche no: así el mismo fixture sirve para verificar que el
// listado interno los trae a los dos y el público solo al primero (criterio 6 de HU-07).
const auditorio = {
  id: 1,
  nombre: 'Auditorio',
  capacidadMaxima: 280,
  superficie: 289,
  precioJornadaCompleta: '920290.00',
  precioMediaJornada: '830136.00',
  visibleEnLanding: true,
  fotoUrl: null,
  creadoEn: FECHA,
  actualizadoEn: FECHA,
  distribuciones: [distribucionAuditorio],
};

const bariloche = {
  ...auditorio,
  id: 2,
  nombre: 'Bariloche',
  capacidadMaxima: 70,
  superficie: 84,
  visibleEnLanding: false,
  distribuciones: [],
};

vi.mock('./salones.repositorio.js', () => ({
  obtenerSalonesConDistribuciones: vi.fn(),
  obtenerSalonesPublicos: vi.fn(),
}));

const { obtenerSalonesConDistribuciones, obtenerSalonesPublicos } =
  await import('./salones.repositorio.js');
const obtenerSalonesConDistribucionesMock = vi.mocked(obtenerSalonesConDistribuciones);
const obtenerSalonesPublicosMock = vi.mocked(obtenerSalonesPublicos);

describe('GET /api/salones', () => {
  const app = crearApp();

  it('responde 200 con el catálogo de salones y sus distribuciones anidadas', async () => {
    obtenerSalonesConDistribucionesMock.mockResolvedValue([auditorio, bariloche] as never);

    const respuesta = await request(app).get('/api/salones');

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({
      data: [
        expect.objectContaining({
          nombre: 'Auditorio',
          capacidadMaxima: 280,
          distribuciones: [expect.objectContaining({ nombre: 'Conferencia', capacidad: 280 })],
        }),
        expect.objectContaining({ nombre: 'Bariloche' }),
      ],
    });
  });

  it('sigue devolviendo los precios al canal interno', async () => {
    obtenerSalonesConDistribucionesMock.mockResolvedValue([auditorio] as never);

    const respuesta = await request(app).get('/api/salones');

    expect(respuesta.body.data[0]).toMatchObject({
      precioJornadaCompleta: '920290.00',
      precioMediaJornada: '830136.00',
    });
  });
});

// HU-07. El filtro de visibilidad y el recorte de precios están en el repositorio (un select de
// Prisma), así que acá el mock ya devuelve la forma recortada: lo que se verifica es el contrato
// de la ruta, no la query. Que el select sea el correcto se ve en salones.repositorio.ts.
describe('GET /api/salones/publicos', () => {
  const app = crearApp();

  // Lo que devolvería obtenerSalonesPublicos() con el select de la implementación real.
  const auditorioPublico = {
    id: auditorio.id,
    nombre: auditorio.nombre,
    capacidadMaxima: auditorio.capacidadMaxima,
    superficie: auditorio.superficie,
    fotoUrl: auditorio.fotoUrl,
    distribuciones: auditorio.distribuciones,
  };

  it('responde 200 sin sesión, con los salones publicados y sus distribuciones', async () => {
    obtenerSalonesPublicosMock.mockResolvedValue([auditorioPublico] as never);

    const respuesta = await request(app).get('/api/salones/publicos');

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.data).toEqual([
      expect.objectContaining({
        nombre: 'Auditorio',
        capacidadMaxima: 280,
        superficie: 289,
        distribuciones: [expect.objectContaining({ nombre: 'Conferencia', capacidad: 280 })],
      }),
    ]);
  });

  it('no expone ningún precio (criterio 5)', async () => {
    obtenerSalonesPublicosMock.mockResolvedValue([auditorioPublico] as never);

    const respuesta = await request(app).get('/api/salones/publicos');

    expect(respuesta.body.data[0]).not.toHaveProperty('precioJornadaCompleta');
    expect(respuesta.body.data[0]).not.toHaveProperty('precioMediaJornada');
    // El JSON crudo tampoco los menciona: el precio no viaja por el canal público.
    expect(respuesta.text).not.toContain('920290');
  });

  it('no lista los salones despublicados (criterio 6)', async () => {
    obtenerSalonesPublicosMock.mockResolvedValue([auditorioPublico] as never);

    const respuesta = await request(app).get('/api/salones/publicos');

    expect(respuesta.body.data).toHaveLength(1);
    expect(respuesta.body.data.map((s: { nombre: string }) => s.nombre)).not.toContain('Bariloche');
  });
});
