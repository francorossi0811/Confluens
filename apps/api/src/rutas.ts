import { Router } from 'express';

import { rutasPresupuestos } from './modulos/presupuestos/presupuestos.rutas.js';
import { rutasSalud } from './modulos/salud/salud.rutas.js';

// Router raíz de la API: cada módulo se monta acá bajo su prefijo.
export const rutasApi = Router();

rutasApi.use('/presupuestos', rutasPresupuestos);
rutasApi.use('/salud', rutasSalud);
