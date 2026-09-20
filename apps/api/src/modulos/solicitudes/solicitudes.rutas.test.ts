import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { crearApp } from '../../app.js';

// Se mockea el repositorio (no el servicio): ejercita la cadena real rutas → controlador →
// servicio, y solo reemplaza el punto de contacto con Prisma. Evita necesitar Postgres en CI,
// mismo criterio que servicios.rutas.test.ts (HU-32) y auth.rutas.test.ts (HU-27).
vi.mock('./solicitudes.repositorio.js', () => ({
  listar: vi.fn(),
  crear: vi.fn(),
}));

const { listar, crear } = await import('./solicitudes.repositorio.js');
const listarMock = vi.mocked(listar);
const crearMock = vi.mocked(crear);

const app = crearApp();

const solicitudDb = {
  id: 1,
  clienteId: null,
  nombre: 'Marina Gómez',
  telefono: '+54 9 351 555-1234',
  correo: 'marina@example.com',
  fechaDeseada: new Date('2026-11-15'),
  cantidadPersonas: 80,
  descartada: false,
  eventoId: null,
  creadoEn: new Date(),
  actualizadoEn: new Date(),
};

describe('GET /api/solicitudes', () => {
  beforeEach(() => {
    listarMock.mockReset();
  });

  it('responde 200 con las solicitudes registradas', async () => {
    listarMock.mockResolvedValue([solicitudDb]);

    const respuesta = await request(app).get('/api/solicitudes');

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.data).toHaveLength(1);
    expect(respuesta.body.data[0]).toMatchObject({ nombre: 'Marina Gómez' });
  });
});

describe('POST /api/solicitudes', () => {
  beforeEach(() => {
    crearMock.mockReset();
  });

  const cuerpoValido = {
    nombre: 'Marina Gómez',
    telefono: '+54 9 351 555-1234',
    correo: 'marina@example.com',
    fechaDeseada: '2026-11-15',
    cantidadPersonas: 80,
  };

  it('con datos completos responde 201 y crea la solicitud (criterio 1)', async () => {
    crearMock.mockResolvedValue(solicitudDb);

    const respuesta = await request(app).post('/api/solicitudes').send(cuerpoValido);

    expect(respuesta.status).toBe(201);
    expect(respuesta.body.data).toMatchObject({ nombre: 'Marina Gómez' });
  });

  it('sin datos de contacto responde 400 VALIDATION_ERROR (criterio 5)', async () => {
    const { nombre: _nombre, telefono: _telefono, correo: _correo, ...sinContacto } = cuerpoValido;

    const respuesta = await request(app).post('/api/solicitudes').send(sinContacto);

    expect(respuesta.status).toBe(400);
    expect(respuesta.body.error.code).toBe('VALIDATION_ERROR');
    expect(crearMock).not.toHaveBeenCalled();
  });

  it('sin fecha deseada responde 400 VALIDATION_ERROR (criterio 5)', async () => {
    const { fechaDeseada: _fechaDeseada, ...sinFecha } = cuerpoValido;

    const respuesta = await request(app).post('/api/solicitudes').send(sinFecha);

    expect(respuesta.status).toBe(400);
    expect(respuesta.body.error.code).toBe('VALIDATION_ERROR');
  });
});
