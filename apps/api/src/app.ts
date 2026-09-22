import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Express } from 'express';
import swaggerUi from 'swagger-ui-express';

import { generarDocumentoOpenApi } from './docs/openapi.js';
import { manejadorErrores, rutaNoEncontrada } from './middlewares/manejador-errores.js';
import { rutasApi } from './rutas.js';

// FRONTEND_URL se lee directo de process.env (no de config/entorno.ts) por la misma
// razón que JWT_SECRET en lib/jwt.ts: config/entorno.ts exige DATABASE_URL y mata
// el proceso si falta, y crearApp() la usan los tests de app.test.ts/Supertest sin
// ninguna env var seteada en CI. El default apunta al puerto de Vite en local.
const FRONTEND_URL = process.env['FRONTEND_URL'] ?? 'http://localhost:5173';

export function crearApp(): Express {
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json());
  // cookie-parser: la sesión (HU-27) viaja en una cookie httpOnly, y los
  // middlewares de auth la leen desde req.cookies.
  app.use(cookieParser());
  // credentials:true es necesario para que el navegador mande/reciba la cookie de
  // sesión en requests cross-origin (Vercel↔Render en producción); `origin` fijo
  // (no `*`) porque un origin comodín es incompatible con credentials según la
  // spec de CORS.
  app.use(cors({ origin: FRONTEND_URL, credentials: true }));

  app.use('/api', rutasApi);
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(generarDocumentoOpenApi()));

  app.use(rutaNoEncontrada);
  app.use(manejadorErrores);

  return app;
}
