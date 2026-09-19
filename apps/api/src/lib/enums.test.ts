import { esquemaEstadoEvento, esquemaEstadoPresupuesto, esquemaRol } from '@confluens/shared';
import { describe, expect, it } from 'vitest';

import { EstadoEvento, EstadoPresupuesto, Rol } from '../generated/prisma/enums.js';

// Los enums de schema.prisma y los de packages/shared tienen que ser idénticos:
// la API los persiste con Prisma y la web los valida con Zod.
describe('enums de Prisma y de @confluens/shared', () => {
  it.each([
    ['EstadoEvento', Object.values(EstadoEvento), esquemaEstadoEvento.options],
    ['EstadoPresupuesto', Object.values(EstadoPresupuesto), esquemaEstadoPresupuesto.options],
    ['Rol', Object.values(Rol), esquemaRol.options],
  ])('%s tiene los mismos valores en ambos lados', (_nombre, valoresPrisma, valoresShared) => {
    expect(valoresShared).toEqual(valoresPrisma);
  });
});
