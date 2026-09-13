import { z } from 'zod';

const esquemaEntorno = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1),
});

export type Entorno = z.infer<typeof esquemaEntorno>;

export function cargarEntorno(): Entorno {
  const resultado = esquemaEntorno.safeParse(process.env);
  if (!resultado.success) {
    console.error(`Variables de entorno inválidas:\n${z.prettifyError(resultado.error)}`);
    process.exit(1);
  }
  return resultado.data;
}
