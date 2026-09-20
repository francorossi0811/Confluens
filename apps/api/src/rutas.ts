import { Router } from 'express';

import { rutasSalones } from './modulos/salones/salones.rutas.js';
import { rutasSalud } from './modulos/salud/salud.rutas.js';

// Router raíz de la API: cada módulo se monta acá bajo su prefijo.
export const rutasApi = Router();

rutasApi.use('/salud', rutasSalud);
rutasApi.use('/salones', rutasSalones);
