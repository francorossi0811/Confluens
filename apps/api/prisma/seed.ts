// Seed de salones, distribuciones y catálogo de servicios.
// Fuente única: docs/negocio/tarifario-2026.md. Todos los precios en pesos, sin IVA (RN-05).
// Es idempotente: se puede correr varias veces (upsert por nombre).
// Uso: npm run prisma:seed -w @confluens/api
import { prisma } from '../src/lib/prisma.js';

interface SeedSalon {
  nombre: string;
  superficie: number;
  precioJornadaCompleta: string;
  precioMediaJornada: string;
  distribuciones: { nombre: string; capacidad: number }[];
}

// Las tres columnas de capacidad del tarifario son las distribuciones de cada salón.
const SALONES: SeedSalon[] = [
  {
    nombre: 'Auditorio',
    superficie: 289,
    precioJornadaCompleta: '920290',
    precioMediaJornada: '830136',
    distribuciones: [
      { nombre: 'Conferencia', capacidad: 280 },
      { nombre: 'Mesas de trabajo', capacidad: 200 },
      { nombre: 'Banquete', capacidad: 160 },
    ],
  },
  {
    nombre: 'Pucará',
    superficie: 121,
    precioJornadaCompleta: '508000',
    precioMediaJornada: '448000',
    distribuciones: [
      { nombre: 'Conferencia', capacidad: 90 },
      { nombre: 'Mesas de trabajo', capacidad: 60 },
      { nombre: 'Banquete', capacidad: 60 },
    ],
  },
  {
    nombre: 'Bariloche',
    superficie: 84,
    precioJornadaCompleta: '476436',
    precioMediaJornada: '402650',
    distribuciones: [
      { nombre: 'Conferencia', capacidad: 70 },
      { nombre: 'Mesas de trabajo', capacidad: 40 },
      { nombre: 'Banquete', capacidad: 50 },
    ],
  },
  {
    nombre: 'Iguazú',
    superficie: 49,
    precioJornadaCompleta: '379374',
    precioMediaJornada: '319219',
    distribuciones: [
      { nombre: 'Conferencia', capacidad: 40 },
      { nombre: 'Mesas de trabajo', capacidad: 30 },
      { nombre: 'Banquete', capacidad: 30 },
    ],
  },
  {
    nombre: 'Paraná',
    superficie: 24,
    precioJornadaCompleta: '142200',
    precioMediaJornada: '107900',
    distribuciones: [
      { nombre: 'Conferencia', capacidad: 10 },
      { nombre: 'Mesas de trabajo', capacidad: 10 },
      { nombre: 'Banquete', capacidad: 12 },
    ],
  },
];

interface SeedServicio {
  nombre: string;
  descripcion: string;
  precio: number;
  porPersona: boolean;
}

const COFFEE_BREAKS: SeedServicio[] = [
  {
    nombre: 'Coffee Refresh',
    descripcion: 'Café, tés, leche, jugo, agua con y sin gas',
    precio: 8730,
    porPersona: true,
  },
  {
    nombre: 'Coffee Intermedio',
    descripcion: 'Café, tés, leche, jugo, agua con y sin gas + panificación base',
    precio: 10500,
    porPersona: true,
  },
  {
    nombre: 'Coffee Express',
    descripcion: 'Café, leche, jugo de naranja, aguas, criollos y medialunas',
    precio: 11860,
    porPersona: true,
  },
  {
    nombre: 'Coffee Especial',
    descripcion:
      'Café, leche, jugo de naranja, aguas, criollos y medialunas + tés + confitería artesanal',
    precio: 14700,
    porPersona: true,
  },
  {
    nombre: 'Coffee César Carman',
    descripcion:
      'Café, leche, jugo de naranja, aguas, criollos, medialunas, tés y confitería artesanal + gaseosas, chips en pan de la casa, ensalada de frutas',
    precio: 15750,
    porPersona: true,
  },
];

// Recargos por persona sobre cada coffee break. Se cargan como variantes con el precio ya aplicado
// porque Servicio tiene un precio fijo (decisión del Sprint 1).
const RECARGOS_COFFEE = [
  { sufijo: 'continuo en salón', detalle: 'Coffee continuo en salón', porcentaje: 20 },
  {
    sufijo: 'en mesas con mozo',
    detalle: 'Servicio en mesas con mozo personalizado',
    porcentaje: 30,
  },
];

const VARIANTES_COFFEE: SeedServicio[] = COFFEE_BREAKS.flatMap((coffee) =>
  RECARGOS_COFFEE.map((recargo) => ({
    nombre: `${coffee.nombre} — ${recargo.sufijo}`,
    descripcion: `${coffee.descripcion}. ${recargo.detalle}: ${recargo.porcentaje}% más por persona`,
    // Los precios base son enteros y los porcentajes, múltiplos de 10: el resultado es exacto.
    precio: (coffee.precio * (100 + recargo.porcentaje)) / 100,
    porPersona: true,
  })),
);

const DISPENSER: SeedServicio = {
  nombre: 'Dispenser con vasos descartables',
  descripcion: 'Precio fijo, no por persona',
  precio: 65250,
  porPersona: false,
};

const DESAYUNOS: SeedServicio[] = [
  {
    nombre: 'Desayuno César Carman',
    descripcion:
      'Infusiones, jugo, aguas, yogurts, criollos, medialunas, confitería, tostadas, panes, mermeladas, dulce de leche, manteca, cereales, ensalada de frutas, jamón y queso',
    precio: 14800,
    porPersona: true,
  },
  {
    nombre: 'Desayuno Especial',
    descripcion:
      'Café, leche, té, frutas, frutos secos, sándwich de jamón y queso, budín, jugos detox, agua',
    precio: 14000,
    porPersona: true,
  },
  {
    nombre: 'Desayuno Continental',
    descripcion: 'Infusiones, jugo, aguas, criollos, medialunas, mermeladas y manteca',
    precio: 12990,
    porPersona: true,
  },
];

const DEGUSTACION: SeedServicio[] = [
  {
    nombre: 'Break salado (tentempié) — Opción 1',
    descripcion:
      'Chips en pan de la casa, cuadraditos de pan inglés de jamón y queso, mafaldas, bebida',
    precio: 18000,
    porPersona: true,
  },
];

// "Opción N" se repite entre Lunch / Cocktail y Almuerzo / Cena: se prefija la categoría porque el
// nombre de servicio es único.
const BEBIDA_LUNCH = 'Bebida: gaseosas, saborizadas y agua';

const LUNCH_COCKTAIL: SeedServicio[] = [
  {
    nombre: 'Lunch / Cocktail — Opción 2',
    descripcion: `Petit empanadas, brouschettas, grignoter, cazuela de cacciatora (pollo), helado de la casa. ${BEBIDA_LUNCH}`,
    precio: 28000,
    porPersona: true,
  },
  {
    nombre: 'Lunch / Cocktail — Opción 3',
    descripcion: `Petit empanadas, sushi, grignoter, brouschettas, ceviche de mariscos, tabla de fiambres y quesos, cazuela de cerdo braseado, toc de crema helada. ${BEBIDA_LUNCH}`,
    precio: 32900,
    porPersona: true,
  },
  {
    nombre: 'Lunch / Cocktail — Opción 4',
    descripcion: `Petit empanadas, sushi, grignoter, ceviche de mariscos, tabla de fiambres y quesos, pinchos de cerdo, cazuela de lomo, toc de crema helada. ${BEBIDA_LUNCH}`,
    precio: 34500,
    porPersona: true,
  },
  {
    nombre: 'Lunch / Cocktail — Opción 5',
    descripcion: `Tartelets variados, sushi, grignoter, ceviche, tabla de fiambres ahumados, tabla de quesos especiales, pinchos de cerdo, carpaccio de salmón, brusquettas, cazuela de lomo, toc crema helada. ${BEBIDA_LUNCH}`,
    precio: 48200,
    porPersona: true,
  },
  {
    nombre: 'Lunch / Cocktail — Opción 6',
    descripcion: `Lo de la opción 5 + cazuela de mariscos. ${BEBIDA_LUNCH}`,
    precio: 60700,
    porPersona: true,
  },
];

const BEBIDA_ALMUERZO = 'Bebida: gaseosas y aguas. Vinos, champagne y café se cotizan aparte';

const ALMUERZO_CENA: SeedServicio[] = [
  {
    nombre: 'Almuerzo / Cena — Opción 2',
    descripcion: `Torre de tomates confitados con muzzarella · roll de pollo con mozzarella y morrones · pavlova. ${BEBIDA_ALMUERZO}`,
    precio: 38900,
    porPersona: true,
  },
  {
    nombre: 'Almuerzo / Cena — Opción 3',
    descripcion: `Tabla de fiambres serranos y quesos · ojo de bife en crocante con mousse de espárragos · pavlova. ${BEBIDA_ALMUERZO}`,
    precio: 51900,
    porPersona: true,
  },
  {
    nombre: 'Almuerzo / Cena — Opción 4',
    descripcion: `Cuchara de mariscos, brusquetas de salmón ahumado, jabalí ahumado · sorrentinos de hongos y lomo César Carman · trifflé Martini helado. ${BEBIDA_ALMUERZO}`,
    precio: 59500,
    porPersona: true,
  },
];

const SERVICIOS: SeedServicio[] = [
  ...COFFEE_BREAKS,
  ...VARIANTES_COFFEE,
  DISPENSER,
  ...DESAYUNOS,
  ...DEGUSTACION,
  ...LUNCH_COCKTAIL,
  ...ALMUERZO_CENA,
];

async function cargarSalones(): Promise<void> {
  for (const { distribuciones, ...datos } of SALONES) {
    // Capacidad máxima del salón = la mayor de sus distribuciones (decisión del Sprint 1).
    const capacidadMaxima = Math.max(...distribuciones.map((d) => d.capacidad));
    const salon = await prisma.salon.upsert({
      where: { nombre: datos.nombre },
      create: { ...datos, capacidadMaxima },
      update: { ...datos, capacidadMaxima },
    });

    for (const distribucion of distribuciones) {
      await prisma.distribucion.upsert({
        where: { salonId_nombre: { salonId: salon.id, nombre: distribucion.nombre } },
        create: { ...distribucion, salonId: salon.id },
        update: { capacidad: distribucion.capacidad },
      });
    }
  }
}

async function cargarServicios(): Promise<void> {
  for (const servicio of SERVICIOS) {
    const datos = {
      ...servicio,
      precio: String(servicio.precio),
      unidadMedida: servicio.porPersona ? 'persona' : 'unidad',
      tercerizado: false,
    };
    await prisma.servicio.upsert({
      where: { nombre: servicio.nombre },
      create: datos,
      update: datos,
    });
  }
}

try {
  await cargarSalones();
  await cargarServicios();
  console.log(`Seed completo: ${SALONES.length} salones y ${SERVICIOS.length} servicios.`);
} finally {
  await prisma.$disconnect();
}
