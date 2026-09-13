import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../generated/prisma/client.js';

// Instancia única del cliente. En runtime se usa DATABASE_URL (en Neon, la URL con pooling).
const adaptador = new PrismaPg({ connectionString: process.env['DATABASE_URL'] });

export const prisma = new PrismaClient({ adapter: adaptador });
