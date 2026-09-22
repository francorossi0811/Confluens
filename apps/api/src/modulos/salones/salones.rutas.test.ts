import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

import { crearApp } from '../../app.js';

// Se mockea el repositorio (no la DB real): mismo criterio que auth.rutas.test.ts (HU-27), ver
// ADR 0003 — ci.yml no levanta Postgres para el job de test. vi.mock se hoistea automáticamente
// por encima de los imports de este archivo, así que crearApp() ya usa este mock.
vi.mock('./salones.repositorio.js', () => ({
  obtenerSalonesConDistribuciones: vi.fn().mockResolvedValue([
    {
      id: 1,
      nombre: 'Auditorio',
      capacidadMaxima: 280,
      superficie: 289,
      precioJornadaCompleta: '920290.00',
      precioMediaJornada: '830136.00',
      creadoEn: new Date('2026-01-01T00:00:00.000Z'),
      actualizadoEn: new Date('2026-01-01T00:00:00.000Z'),
      distribuciones: [
        {
          id: 1,
          salonId: 1,
          nombre: 'Conferencia',
          capacidad: 280,
          creadoEn: new Date('2026-01-01T00:00:00.000Z'),
          actualizadoEn: new Date('2026-01-01T00:00:00.000Z'),
        },
      ],
    },
  ]),
}));

describe('GET /api/salones', () => {
  const app = crearApp();

  it('responde 200 con el catálogo de salones y sus distribuciones anidadas', async () => {
    const respuesta = await request(app).get('/api/salones');

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({
      data: [
        expect.objectContaining({
          nombre: 'Auditorio',
          capacidadMaxima: 280,
          distribuciones: [expect.objectContaining({ nombre: 'Conferencia', capacidad: 280 })],
        }),
      ],
    });
  });
});
