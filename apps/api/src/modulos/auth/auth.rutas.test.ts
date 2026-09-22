import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { crearApp } from '../../app.js';
import { hashearContrasena } from '../../lib/contrasena.js';
import { firmarToken, NOMBRE_COOKIE_SESION } from '../../lib/jwt.js';

// Se mockea el repositorio (no el servicio): así se ejercita la cadena real
// rutas → controlador → servicio, y solo se reemplaza el punto de contacto con
// Prisma. Evita necesitar Postgres en CI (ci.yml no levanta un servicio de DB
// para el job de test) sin perder cobertura sobre la lógica de auth.
vi.mock('./auth.repositorio.js', () => ({
  buscarUsuarioPorEmail: vi.fn(),
}));

const { buscarUsuarioPorEmail } = await import('./auth.repositorio.js');
const buscarUsuarioPorEmailMock = vi.mocked(buscarUsuarioPorEmail);

const app = crearApp();

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    buscarUsuarioPorEmailMock.mockReset();
  });

  it('con credenciales válidas responde 200, setea la cookie httpOnly y no expone el token en el body', async () => {
    const hash = await hashearContrasena('contrasena-correcta');
    buscarUsuarioPorEmailMock.mockResolvedValue({
      id: 1,
      email: 'ge@confluens.test',
      hashContrasena: hash,
      rol: 'GERENTE_GENERAL',
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    });

    const respuesta = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ge@confluens.test', contrasena: 'contrasena-correcta' });

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({
      data: { id: 1, email: 'ge@confluens.test', rol: 'GERENTE_GENERAL' },
    });
    expect(respuesta.body.data.token).toBeUndefined();
    const cookies = respuesta.headers['set-cookie'] as unknown as string[];
    expect(
      cookies.some((c) => c.startsWith(`${NOMBRE_COOKIE_SESION}=`) && c.includes('HttpOnly')),
    ).toBe(true);
  });

  it('con contraseña incorrecta responde 401 sin indicar cuál dato falló (criterio 2)', async () => {
    const hash = await hashearContrasena('contrasena-correcta');
    buscarUsuarioPorEmailMock.mockResolvedValue({
      id: 1,
      email: 'ge@confluens.test',
      hashContrasena: hash,
      rol: 'GERENTE_GENERAL',
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    });

    const respuesta = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ge@confluens.test', contrasena: 'incorrecta' });

    expect(respuesta.status).toBe(401);
    expect(respuesta.body.error.code).toBe('UNAUTHENTICATED');
    expect(respuesta.body.error.message.toLowerCase()).not.toContain('contraseña');
    expect(respuesta.body.error.message.toLowerCase()).not.toContain('email');
  });

  it('con email inexistente responde el mismo 401 genérico (criterio 2)', async () => {
    buscarUsuarioPorEmailMock.mockResolvedValue(null);

    const respuesta = await request(app)
      .post('/api/auth/login')
      .send({ email: 'no-existe@confluens.test', contrasena: 'lo-que-sea' });

    expect(respuesta.status).toBe(401);
    expect(respuesta.body.error.code).toBe('UNAUTHENTICATED');
  });

  it('con body inválido (falta contrasena) responde 400 VALIDATION_ERROR', async () => {
    const respuesta = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ge@confluens.test' });

    expect(respuesta.status).toBe(400);
    expect(respuesta.body.error.code).toBe('VALIDATION_ERROR');
  });
});

describe('POST /api/auth/logout', () => {
  it('responde 204 y limpia la cookie de sesión', async () => {
    const respuesta = await request(app).post('/api/auth/logout');

    expect(respuesta.status).toBe(204);
    const cookies = respuesta.headers['set-cookie'] as unknown as string[];
    // clearCookie fija la cookie vacía con fecha de expiración en el pasado.
    expect(cookies.some((c) => c.startsWith(`${NOMBRE_COOKIE_SESION}=;`))).toBe(true);
  });
});

describe('GET /api/auth/yo', () => {
  it('sin cookie responde 401 UNAUTHENTICATED', async () => {
    const respuesta = await request(app).get('/api/auth/yo');

    expect(respuesta.status).toBe(401);
    expect(respuesta.body.error.code).toBe('UNAUTHENTICATED');
  });

  it('con cookie válida responde 200 con la sesión', async () => {
    const token = firmarToken({ id: 1, email: 'ge@confluens.test', rol: 'GERENTE_GENERAL' });

    const respuesta = await request(app)
      .get('/api/auth/yo')
      .set('Cookie', [`${NOMBRE_COOKIE_SESION}=${token}`]);

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({
      data: { id: 1, email: 'ge@confluens.test', rol: 'GERENTE_GENERAL' },
    });
  });
});
