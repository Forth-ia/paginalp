/* /aprende — preguntas del formulario y regla de lead calificado.
   Lo usan el navegador (aprende/lead-form.js) y el servidor (api/aprende-lead.js):
   cambia aquí las opciones o el criterio y ambos quedan alineados. */
(function (root) {
  'use strict';
  var QUESTIONS = {
    aplica: {
      label: '¿Dónde vas a aplicar lo que aprendas de inteligencia artificial?',
      options: {
        empleado: 'Soy empleado y en mi trabajo actual',
        dueno: 'Soy dueño y en mi propia empresa',
        freelancer: 'Soy freelancer o consultor, con mis clientes',
        nuevo_negocio: 'Para crear un nuevo negocio',
        no_claro: 'Todavía no tengo claro'
      }
    },
    inicio: {
      label: '¿Cuándo quieres empezar a aprender y aplicar IA de verdad?',
      options: {
        ya: 'Lo antes posible',
        este_mes: 'Este mes',
        '2_3_meses': 'En los próximos 2-3 meses',
        mas_adelante: 'Más adelante',
        explorando: 'Por ahora solo estoy explorando'
      }
    },
    inversion: {
      label: 'El programa tiene una inversión aproximada de $500 USD. Si ves que encaja contigo, ¿cómo estás frente a esa inversión?',
      options: {
        listo: 'Estoy listo para invertir',
        organizarme: 'Podría hacerlo, pero tendría que organizarme',
        conocer_mas: 'Necesito conocer mejor el programa antes de decidir',
        no_puede: 'Ahora mismo no podría hacer esa inversión'
      }
    }
  };

  // Selector de país del WhatsApp: [nombre, indicativo]. El primero es el predeterminado.
  var COUNTRIES = [
    ['Colombia', '57'], ['México', '52'], ['Argentina', '54'], ['Chile', '56'], ['Perú', '51'],
    ['Ecuador', '593'], ['Venezuela', '58'], ['Uruguay', '598'], ['Paraguay', '595'], ['Bolivia', '591'],
    ['Costa Rica', '506'], ['Panamá', '507'], ['Guatemala', '502'], ['El Salvador', '503'],
    ['Honduras', '504'], ['Nicaragua', '505'], ['República Dominicana', '1'], ['Puerto Rico', '1'],
    ['España', '34'], ['Estados Unidos', '1']
  ];

  // Calificado = ninguna respuesta descalificante, con dos casos condicionados.
  function qualify(a) {
    if (a.aplica === 'no_claro') return false;
    if (a.inicio === 'mas_adelante' || a.inicio === 'explorando') return false;
    if (a.inversion === 'no_puede') return false;
    if (a.inversion === 'conocer_mas' && a.inicio !== 'ya' && a.inicio !== 'este_mes') return false;
    if (a.aplica === 'nuevo_negocio' && a.inversion !== 'listo' && a.inversion !== 'organizarme') return false;
    return true;
  }

  var api = { QUESTIONS: QUESTIONS, COUNTRIES: COUNTRIES, qualify: qualify };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.aprendeQualify = api;
})(this);
