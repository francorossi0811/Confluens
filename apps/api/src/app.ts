import express, { type Express } from 'express';
import swaggerUi from 'swagger-ui-express';

import { generarDocumentoOpenApi } from './docs/openapi.js';
import { manejadorErrores, rutaNoEncontrada } from './middlewares/manejador-errores.js';
import { rutasApi } from './rutas.js';

export function crearApp(): Express {
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json());

  app.use('/api', rutasApi);
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(generarDocumentoOpenApi()));

  app.use(rutaNoEncontrada);
  app.use(manejadorErrores);

  return app;
}
