// Contenido estático de la landing (carta de presentación, HU-14). Los salones y servicios reales
// viven en los módulos `salones` y `servicios` (grupo A, ramas todavía sin mergear) — no se
// duplica esa lógica ni sus endpoints acá (ver AGENTS.md §6, límites entre grupos). Este archivo
// solo repite datos estables y no monetarios del tarifario vigente (docs/negocio/tarifario-2026.md)
// para dar contexto en la landing: nombre, capacidades y superficie. Deliberadamente sin precios,
// porque el precio final que maneja el sistema es sin IVA (RN-05, resolución S-06) y ese cálculo
// es responsabilidad del módulo de servicios/presupuestos, no de esta landing estática.
export const SALONES_PRESENTACION = [
  { nombre: 'Auditorio', capacidadBanquete: 160, superficie: 289 },
  { nombre: 'Pucará', capacidadBanquete: 60, superficie: 121 },
  { nombre: 'Bariloche', capacidadBanquete: 50, superficie: 84 },
  { nombre: 'Iguazú', capacidadBanquete: 30, superficie: 49 },
  { nombre: 'Paraná', capacidadBanquete: 12, superficie: 24 },
] as const;

export const CATEGORIAS_SERVICIOS_PRESENTACION = [
  {
    nombre: 'Coffee breaks',
    descripcion: 'Desde un café simple hasta una propuesta completa con confitería artesanal.',
  },
  {
    nombre: 'Desayunos',
    descripcion: 'Infusiones, panificados y frutas para arrancar la jornada.',
  },
  { nombre: 'Degustación', descripcion: 'Tentempiés salados para encuentros breves.' },
  { nombre: 'Lunch / Cocktail', descripcion: 'Bocados variados con opciones frías y calientes.' },
  { nombre: 'Almuerzo / Cena', descripcion: 'Menú completo de entrada, plato principal y postre.' },
] as const;
