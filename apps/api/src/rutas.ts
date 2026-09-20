import { Router } from 'express';

import { rutasSalud } from './modulos/salud/salud.rutas.js';
import { rutasServicios } from './modulos/servicios/servicios.rutas.js';

// Router raíz de la API: cada módulo se monta acá bajo su prefijo.
export const rutasApi = Router();

rutasApi.use('/salud', rutasSalud);
rutasApi.use('/servicios', rutasServicios);
