// Preguntas del pop-up del sitio (assets/js/site.js → POP_QUESTIONS, mismas opciones) y la
// prioridad A/B/C con la que el equipo de WhatsApp ordena a quién atender primero.
const CON_NEGOCIO = ['paralelo', 'independiente', 'negocio'];

const QUESTIONS = {
  etapa: {
    empleado: 'Soy empleado', emprender: 'Soy empleado y quiero emprender',
    paralelo: 'Soy empleado con un negocio aparte', independiente: 'Soy independiente o freelance',
    negocio: 'Tengo mi propio negocio', estudiante: 'Estudio o estoy buscando trabajo'
  },
  dueno: { show: CON_NEGOCIO, unico: 'Sí, soy el único dueño', socios: 'Sí, tengo socio(s)', directivo: 'Soy directivo, no dueño' },
  empleados: { show: CON_NEGOCIO, '0': 'No, trabajo solo', '1-5': '1 a 5', '6-20': '6 a 20', '21-50': '21 a 50', '51-200': '51 a 200', '200+': 'Más de 200' },
  rol: { show: ['empleado', 'emprender'], operativo: 'Operativo o analista', lider: 'Coordinador o líder de equipo', gerente: 'Gerente o director', clevel: 'Alta dirección (C-level)' },
  ventas: {
    show: CON_NEGOCIO, '0': 'Aún no factura', '<1k': 'Menos de US$1.000', '1k-5k': 'US$1.000 a 5.000',
    '5k-20k': 'US$5.000 a 20.000', '20k-100k': 'US$20.000 a 100.000', '100k+': 'Más de US$100.000'
  },
  industria: {
    servicios: 'Servicios profesionales (consultoría, legal, contable)', marketing: 'Marketing, publicidad o agencia',
    tecnologia: 'Tecnología o software', finanzas: 'Finanzas, banca o seguros', retail: 'Retail, comercio o e-commerce',
    salud: 'Salud y bienestar', educacion: 'Educación y formación', inmobiliario: 'Bienes raíces o construcción',
    manufactura: 'Manufactura o industria', logistica: 'Logística y transporte', hoteleria: 'Restaurantes, hotelería o turismo',
    agro: 'Agro', publico: 'Sector público u ONG', otra: 'Otra'
  }
};

function options(id) {
  return Object.keys(QUESTIONS[id]).filter(k => k !== 'show');
}

// Devuelve { valores, textos } si respondió todas las preguntas que le tocaban; si no, null.
function parseAnswers(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const etapa = raw.etapa;
  if (!options('etapa').includes(etapa)) return null;
  const valores = {}, textos = {};
  for (const id of Object.keys(QUESTIONS)) {
    const show = QUESTIONS[id].show;
    if (show && !show.includes(etapa)) continue;
    if (!options(id).includes(raw[id])) return null;
    valores[id] = raw[id];
    textos[id] = QUESTIONS[id][raw[id]];
  }
  return { valores, textos };
}

// A: negocio con equipo o con ventas de US$5.000+ al mes, o gerente/directivo.
// B: emprendiendo, independiente o con negocio. C: el resto.
function priority(v) {
  if (CON_NEGOCIO.includes(v.etapa) && (v.empleados !== '0' || ['5k-20k', '20k-100k', '100k+'].includes(v.ventas))) return 'A';
  if (['gerente', 'clevel'].includes(v.rol)) return 'A';
  if (v.etapa === 'emprender' || CON_NEGOCIO.includes(v.etapa)) return 'B';
  return 'C';
}

module.exports = { QUESTIONS, parseAnswers, priority };
