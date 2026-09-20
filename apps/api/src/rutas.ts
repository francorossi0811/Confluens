import { Router } from 'express';

import { rutasEventos } from './modulos/eventos/eventos.rutas.js';
import { rutasPresupuestos } from './modulos/presupuestos/presupuestos.rutas.js';
import { rutasSalud } from './modulos/salud/salud.rutas.js';
import { rutasSolicitudes } from './modulos/solicitudes/solicitudes.rutas.js';

// Router raíz de la API: cada módulo se monta acá bajo su prefijo.
export const rutasApi = Router();

rutasApi.use('/eventos', rutasEventos);
rutasApi.use('/presupuestos', rutasPresupuestos);
rutasApi.use('/salud', rutasSalud);
rutasApi.use('/solicitudes', rutasSolicitudes);
