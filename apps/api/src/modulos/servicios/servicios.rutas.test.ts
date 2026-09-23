import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { crearApp } from '../../app.js';
import { Decimal } from '../../generated/prisma/internal/prismaNamespace.js';

// Se mockea el repositorio (no el servicio): así se ejercita la cadena real
// rutas → controlador → servicio, y solo se reemplaza el punto de contacto con Prisma. Evita
// necesitar Postgres en CI, mismo criterio que auth.rutas.test.ts (HU-27).
vi.mock('./servicios.repositorio.js', () => ({
  listarActivos: vi.fn(),
  listarPublicos: vi.fn(),
  buscarPorNombre: vi.fn(),
  crear: vi.fn(),
}));

const { listarActivos, listarPublicos, buscarPorNombre, crear } =
  await import('./servicios.repositorio.js');
const listarActivosMock = vi.mocked(listarActivos);
const listarPublicosMock = vi.mocked(listarPublicos);
const buscarPorNombreMock = vi.mocked(buscarPorNombre);
const crearMock = vi.mocked(crear);

const app = crearApp();

const servicioDb = {
  id: 1,
  nombre: 'Coffee break estándar',
  descripcion: 'Café, té, agua, jugo y dos tipos de masas dulces/saladas',
  unidadMedida: 'persona',
  precio: new Decimal('4500'),
  porPersona: true,
  tercerizado: false,
  activo: true,
  categoria: 'Coffee breaks',
  fotoUrl: null,
  creadoEn: new Date(),
  actualizadoEn: new Date(),
};

describe('GET /api/servicios', () => {
  beforeEach(() => {
    listarActivosMock.mockReset();
  });

  it('responde 200 con el catálogo de servicios activos', async () => {
    listarActivosMock.mockResolvedValue([servicioDb]);

    const respuesta = await request(app).get('/api/servicios');

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.data).toHaveLength(1);
    expect(respuesta.body.data[0]).toMatchObject({
      nombre: 'Coffee break estándar',
      precio: '4500',
    });
  });
});

// HU-07. Igual que en salones: el recorte de campos es un select del repositorio, así que el mock
// ya devuelve la forma recortada y lo que se verifica acá es el contrato de la ruta.
describe('GET /api/servicios/publicos', () => {
  const servicioPublico = {
    id: servicioDb.id,
    nombre: servicioDb.nombre,
    descripcion: servicioDb.descripcion,
    categoria: servicioDb.categoria,
    fotoUrl: servicioDb.fotoUrl,
  };

  beforeEach(() => {
    listarPublicosMock.mockReset();
  });

  it('responde 200 sin sesión, con la oferta agrupable por categoría', async () => {
    listarPublicosMock.mockResolvedValue([servicioPublico]);

    const respuesta = await request(app).get('/api/servicios/publicos');

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.data).toEqual([
      expect.objectContaining({ nombre: 'Coffee break estándar', categoria: 'Coffee breaks' }),
    ]);
  });

  it('no expone precio ni datos internos de presupuestación', async () => {
    listarPublicosMock.mockResolvedValue([servicioPublico]);

    const respuesta = await request(app).get('/api/servicios/publicos');

    expect(respuesta.body.data[0]).not.toHaveProperty('precio');
    expect(respuesta.body.data[0]).not.toHaveProperty('porPersona');
    expect(respuesta.body.data[0]).not.toHaveProperty('tercerizado');
    expect(respuesta.text).not.toContain('4500');
  });
});

describe('POST /api/servicios', () => {
  beforeEach(() => {
    buscarPorNombreMock.mockReset();
    crearMock.mockReset();
  });

  const cuerpoValido = {
    nombre: 'Coffee break estándar',
    descripcion: 'Café, té, agua, jugo y dos tipos de masas dulces/saladas',
    unidadMedida: 'persona',
    precio: '4500',
    porPersona: true,
    tercerizado: false,
  };

  it('con un nombre nuevo responde 201 y crea el servicio', async () => {
    buscarPorNombreMock.mockResolvedValue(null);
    crearMock.mockResolvedValue(servicioDb);

    const respuesta = await request(app).post('/api/servicios').send(cuerpoValido);

    expect(respuesta.status).toBe(201);
    expect(respuesta.body.data).toMatchObject({ nombre: 'Coffee break estándar' });
  });

  it('con un nombre ya existente responde 409 CONFLICT (criterio 4)', async () => {
    buscarPorNombreMock.mockResolvedValue(servicioDb);

    const respuesta = await request(app).post('/api/servicios').send(cuerpoValido);

    expect(respuesta.status).toBe(409);
    expect(respuesta.body.error.code).toBe('CONFLICT');
    expect(crearMock).not.toHaveBeenCalled();
  });

  it('con body inválido (falta precio) responde 400 VALIDATION_ERROR', async () => {
    const { precio: _precio, ...sinPrecio } = cuerpoValido;

    const respuesta = await request(app).post('/api/servicios').send(sinPrecio);

    expect(respuesta.status).toBe(400);
    expect(respuesta.body.error.code).toBe('VALIDATION_ERROR');
  });
});
