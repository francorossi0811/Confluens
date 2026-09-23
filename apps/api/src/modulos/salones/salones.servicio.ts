import { obtenerSalonesConDistribuciones, obtenerSalonesPublicos } from './salones.repositorio.js';

// Repositorio con default (inyección de dependencias) para poder testear con un repo fake sin
// tocar la base — mismo criterio que auth.servicio.ts (HU-27).
//
// Sin lógica de negocio acá a propósito: HU-01 es una consulta de catálogo sin reglas RN-xx (el
// filtro por capacidad mínima y la sugerencia del salón más grande cuando ninguno alcanza son
// puramente de presentación, se resuelven en la web sobre la lista completa que ya se trajo).
// AGENTS.md §5 no pide test de servicio para "CRUD simple sin reglas"; el formato y status del
// endpoint se cubren en salones.rutas.test.ts.
export async function listarSalones(repo = { obtenerSalonesConDistribuciones }) {
  return repo.obtenerSalonesConDistribuciones();
}

// Listado del canal público (HU-07). El filtro de visibilidad y el recorte de campos viven en el
// repositorio, no acá: son parte de la consulta, no de una regla que dependa de quién pregunta.
export async function listarSalonesPublicos(repo = { obtenerSalonesPublicos }) {
  return repo.obtenerSalonesPublicos();
}
