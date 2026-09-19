import { describe, expect, it } from 'vitest';

import type { Usuario } from '../../generated/prisma/client.js';
import { hashearContrasena } from '../../lib/contrasena.js';
import { verificarToken } from '../../lib/jwt.js';
import type { AuthRepositorio } from './auth.repositorio.js';
import { iniciarSesion } from './auth.servicio.js';

// Repositorio fake: iniciarSesion() recibe el repositorio real como default
// param, así que acá se lo reemplaza por un objeto en memoria. Ni toca Prisma ni
// necesita una base de datos corriendo (ver decisión técnica del plan de HU-27).
function repositorioFake(usuarios: Usuario[]): AuthRepositorio {
  return {
    buscarUsuarioPorEmail: async (email) => usuarios.find((u) => u.email === email) ?? null,
  };
}

describe('auth.servicio: iniciarSesion', () => {
  it('con credenciales válidas devuelve la sesión y un token verificable', async () => {
    const hash = await hashearContrasena('contrasena-correcta');
    const repositorio = repositorioFake([
      {
        id: 1,
        email: 'ge@confluens.test',
        hashContrasena: hash,
        rol: 'GERENTE_GENERAL',
        creadoEn: new Date(),
        actualizadoEn: new Date(),
      },
    ]);

    const resultado = await iniciarSesion(
      { email: 'ge@confluens.test', contrasena: 'contrasena-correcta' },
      repositorio,
    );

    expect(resultado.sesion).toEqual({ id: 1, email: 'ge@confluens.test', rol: 'GERENTE_GENERAL' });
    // El token que se firma tiene que ser el mismo que después acepta autenticar.ts.
    expect(verificarToken(resultado.token)).toEqual(resultado.sesion);
  });

  it('con contraseña incorrecta lanza el mismo error genérico (criterio 2)', async () => {
    const hash = await hashearContrasena('contrasena-correcta');
    const repositorio = repositorioFake([
      {
        id: 1,
        email: 'ge@confluens.test',
        hashContrasena: hash,
        rol: 'GERENTE_GENERAL',
        creadoEn: new Date(),
        actualizadoEn: new Date(),
      },
    ]);

    await expect(
      iniciarSesion({ email: 'ge@confluens.test', contrasena: 'incorrecta' }, repositorio),
    ).rejects.toMatchObject({ status: 401, codigo: 'UNAUTHENTICATED' });
  });

  it('con email inexistente lanza el mismo error genérico que una contraseña incorrecta (criterio 2)', async () => {
    const repositorio = repositorioFake([]);

    await expect(
      iniciarSesion({ email: 'no-existe@confluens.test', contrasena: 'lo-que-sea' }, repositorio),
    ).rejects.toMatchObject({ status: 401, codigo: 'UNAUTHENTICATED' });
  });
});
