import cron from 'node-cron';

import { cancelarReservasConSenaVencida } from './senas.trabajo.js';

// RN-06: corre cada hora. El plazo de la seña se mide en días, no hace falta más frecuencia.
export function iniciarTrabajosProgramados(): void {
  cron.schedule('0 * * * *', () => {
    cancelarReservasConSenaVencida().catch((error: unknown) => {
      console.error('Error en el trabajo de vencimiento de seña:', error);
    });
  });
}
