import { z } from 'zod';

// Primitivas comunes a las entidades. Los ids son enteros autoincrementales de PostgreSQL.
export const esquemaId = z.number().int().positive();

// Importe sin IVA (RN-05). Viaja como string (Decimal(12,2) de Prisma) para no perder precisión.
export const esquemaImporte = z.string().regex(/^\d{1,10}(\.\d{1,2})?$/, 'Importe inválido');

// Instante en ISO 8601 UTC (2026-10-10T13:00:00.000Z).
export const esquemaFechaHora = z.iso.datetime();

// Fecha de calendario sin hora (2026-10-10).
export const esquemaFecha = z.iso.date();
