/**
 * Agenda + Sheets maestro — lucianomusella.com/aprende
 * ---------------------------------------------------------------------------
 * Va en el Apps Script del Google Sheets central de leads (creado con
 * admin@getforth.ai). Lo llaman las funciones de Vercel (api/aprende-lead.js,
 * api/aprende-agenda.js, api/admin.js, api/resource-lead.js y api/popup-lead.js)
 * con una clave secreta.
 *
 * Hace cuatro cosas:
 *  1. Guarda cada lead en MAESTRO (todos, el email es la llave única) y en la
 *     pestaña del flujo que le toca, donde trabaja el agente:
 *       "ManyChat - Orgánicos"      ManyChat y pop-up del sitio, para alimentarlos.
 *       "Página - No agendados"     /aprende: calificados sin cita o formulario a medias.
 *       "Página - Agendados"        /aprende: con cita (y luego show / venta).
 *       "Página - No calificados"   /aprende: no pasan el filtro.
 *     Un lead de la página está en una sola de esas tres y se mueve al avanzar;
 *     cuando entra al formulario de la página sale de "ManyChat - Orgánicos".
 *  2. Calcula los horarios libres de los closers leyendo sus Google Calendar.
 *  3. Agenda la llamada (Google Meet) en el calendario del closer, invita al
 *     lead y avisa por correo al closer y al lead.
 *  4. Manda recordatorios por correo 24 h y 1 h antes (función activarRecordatorios).
 *
 * importarHistoricos() copia una vez los leads de los Sheets anteriores.
 *
 * Requisitos (una sola vez):
 *  - Servicios (+) → Google Calendar API (identificador "Calendar").
 *  - Configuración del proyecto → Propiedades del script → AGENDA_SECRET.
 *  - Implementar como aplicación web: Ejecutar como "Yo" con admin@getforth.ai,
 *    acceso "Cualquier usuario".
 *  - Cada closer distinto de admin@getforth.ai comparte su calendario con
 *    admin@getforth.ai con permiso "Hacer cambios en eventos".
 *  - Para importarHistoricos: admin@getforth.ai puede ver los Sheets de
 *    SHEETS_ANTERIORES.
 */

var AG = {
  zona: 'America/Bogota',
  offset: '-05:00', // Colombia no tiene horario de verano
  duracionMin: 30,
  diasAdelante: 14,
  avisoMinimoMin: 120, // no se puede agendar con menos de 2 horas
  diasHabiles: [1, 2, 3, 4, 5], // lunes a viernes
  closers: [
    { email: 'admin@getforth.ai', nombre: 'Luciano', bloques: [['11:00', '19:00']] },
    { email: 'info@getforth.ai', nombre: 'Andrea', bloques: [['07:30', '11:30'], ['13:00', '15:00']] }
  ],
  // Leads prioritarios (assets/js/aprende-qualify.js → priority): solo ven sus horarios,
  // y le llega un aviso por correo apenas califican.
  prioritario: 'admin@getforth.ai',
  titulo: 'Conversación con Luciano Musella · Programa de IA',
  remitente: 'Luciano Musella',
  whatsappComunidad: 'https://chat.whatsapp.com/FJwqTceWj4gBKpYKBAWEWW'
};

var HOJA_MAESTRO = 'MAESTRO';
var COLUMNAS_MAESTRO = [
  ['email', 'email'], ['Fecha de registro', 'creado'], ['Última actualización', 'actualizado'],
  ['Nombre', 'nombre'], ['WhatsApp', 'telefono'], ['País', 'pais'], ['Fuente', 'fuente'],
  ['Recursos descargados', 'recursos'], ['Estado', 'estado'], ['Calificado', 'calificado'], ['Prioridad', 'prioridad'],
  ['¿Dónde aplicará IA?', 'aplica'], ['¿Cuándo quiere empezar?', 'inicio'], ['Inversión $500 USD', 'inversion'],
  ['Principal reto', 'reto'],
  ['Cita (hora Colombia)', 'cita'], ['cita_inicio', 'cita_inicio'], ['Closer', 'closer'],
  ['Link de Meet', 'meet'], ['calendar_event_id', 'evento_calendario'],
  ['Asistencia', 'asistencia'], ['Venta', 'venta'], ['Valor venta', 'valor'], ['Moneda', 'moneda'],
  ['eventos_meta_enviados', 'eventos_meta'], ['Marcado por', 'marcado_por'],
  ['utm_source', 'utm_source'], ['utm_medium', 'utm_medium'], ['utm_campaign', 'utm_campaign'],
  ['utm_content', 'utm_content'], ['utm_term', 'utm_term'],
  ['fbp', 'fbp'], ['fbc', 'fbc'], ['recordatorio_24h', 'recordatorio_24h'], ['recordatorio_1h', 'recordatorio_1h']
];

// Pestañas donde trabaja el agente (ver encabezado).
var HOJA_ORGANICOS = 'ManyChat - Orgánicos';
var COLUMNAS_ORGANICOS = [
  ['Fecha de registro', 'creado'], ['Última actividad', 'actualizado'], ['Nombre', 'nombre'], ['Email', 'email'],
  ['WhatsApp', 'telefono'], ['Fuente', 'fuente'], ['Recursos descargados', 'recursos'], ['Estado', 'estado']
];
var HOJA_AGENDADOS = 'Página - Agendados';
var HOJA_NO_AGENDADOS = 'Página - No agendados';
var HOJA_NO_CALIFICADOS = 'Página - No calificados';
var HOJAS_PAGINA = [HOJA_NO_AGENDADOS, HOJA_AGENDADOS, HOJA_NO_CALIFICADOS];
var COLUMNAS_PAGINA = [
  ['Fecha de registro', 'creado'], ['Última actualización', 'actualizado'], ['Nombre', 'nombre'], ['Email', 'email'],
  ['WhatsApp', 'telefono'], ['País', 'pais'], ['Estado', 'estado'], ['Prioridad', 'prioridad'],
  ['¿Dónde aplicará IA?', 'aplica'], ['¿Cuándo quiere empezar?', 'inicio'], ['Inversión $500 USD', 'inversion'],
  ['Principal reto', 'reto'], ['Cita (hora Colombia)', 'cita'], ['Closer', 'closer'], ['Link de Meet', 'meet'],
  ['Asistencia', 'asistencia'], ['Venta', 'venta'], ['Valor venta', 'valor'], ['Moneda', 'moneda'],
  ['utm_source', 'utm_source'], ['utm_medium', 'utm_medium'], ['utm_campaign', 'utm_campaign'],
  ['utm_content', 'utm_content'], ['utm_term', 'utm_term'], ['Fuente', 'fuente']
];

// Estados que una nueva visita al formulario no debe pisar.
var ESTADOS_AVANZADOS = ['Agendado', 'Show', 'No show', 'Venta', 'No venta'];

function doPost(e) {
  var datos;
  try { datos = JSON.parse(e.postData.contents); } catch (err) { return respuesta_({ ok: false, error: 'json' }); }
  if (!claveValida_(datos.secret)) return respuesta_({ ok: false, error: 'no_autorizado' });
  try {
    var acciones = { organico: organico_, contacto: contacto_, calificacion: calificacion_, horarios: horarios_, agendar: agendar_, listar: listar_, lead: leadPorEmail_, marcar: marcar_ };
    if (!acciones[datos.action]) return respuesta_({ ok: false, error: 'accion' });
    return respuesta_(acciones[datos.action](datos));
  } catch (err) {
    console.error(datos.action, err);
    return respuesta_({ ok: false, error: String(err && err.message || err) });
  }
}

// ?accion=instalar&clave=<AGENDA_SECRET>: corre instalar() sin abrir el editor.
function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.accion === 'instalar') {
    if (!claveValida_(p.clave)) return respuesta_({ ok: false, error: 'no_autorizado' });
    try { return respuesta_({ ok: true, resultado: instalar() }); }
    catch (err) { return respuesta_({ ok: false, error: String(err && err.message || err) }); }
  }
  return ContentService.createTextOutput('Agenda Acelera activa ✅');
}

// La clave va en Propiedades del script o en un archivo Secreto.gs que solo existe en
// Apps Script (var AGENDA_SECRET_ARCHIVO = '...'): nunca en el repo, que es público.
function claveValida_(recibida) {
  var clave = PropertiesService.getScriptProperties().getProperty('AGENDA_SECRET') ||
    (typeof AGENDA_SECRET_ARCHIVO !== 'undefined' ? AGENDA_SECRET_ARCHIVO : '');
  return Boolean(recibida && clave && recibida === clave);
}

/* ----------------------------- leads ----------------------------- */

// ManyChat (links /acceso/) y pop-up del sitio.
function organico_(d) {
  if (!d.email) return { ok: false, error: 'email' };
  conLock_(function () {
    var actual = leerFila_(HOJA_MAESTRO, COLUMNAS_MAESTRO, d.email);
    var campos = { nombre: d.nombre, telefono: d.telefono, recursos_agregar: d.recurso };
    if (!actual) { campos.fuente = d.fuente; campos.estado = 'Orgánico'; }
    escribirFila_(HOJA_MAESTRO, COLUMNAS_MAESTRO, d.email, campos);
    // Si ya está en el flujo de la página, no se le abre un segundo flujo.
    if (actual && actual.estado && actual.estado !== 'Orgánico') return;
    escribirFila_(HOJA_ORGANICOS, COLUMNAS_ORGANICOS, d.email,
      { nombre: d.nombre, telefono: d.telefono, fuente: d.fuente, recursos_agregar: d.recurso, estado: 'Orgánico' });
  });
  return { ok: true };
}

function contacto_(d) {
  conLock_(function () {
    var actual = leerFila_(HOJA_MAESTRO, COLUMNAS_MAESTRO, d.email);
    var campos = camposBase_(d);
    var nuevo = !actual || !actual.estado || actual.estado === 'Orgánico';
    if (nuevo) campos.estado = 'Formulario incompleto';
    if (d.evento_meta) campos.eventos_meta_agregar = d.evento_meta;
    escribirFila_(HOJA_MAESTRO, COLUMNAS_MAESTRO, d.email, campos);
    if (nuevo) ubicarEnPagina_(d.email, HOJA_NO_AGENDADOS);
  });
  return { ok: true };
}

function calificacion_(d) {
  conLock_(function () {
    var actual = leerFila_(HOJA_MAESTRO, COLUMNAS_MAESTRO, d.email);
    var campos = camposBase_(d);
    campos.aplica = d.aplica; campos.inicio = d.inicio; campos.inversion = d.inversion; campos.reto = d.reto;
    campos.calificado = d.calificado ? 'Sí' : 'No';
    campos.prioridad = d.prioridad ? 'Alta' : '';
    var avanzado = actual && ESTADOS_AVANZADOS.indexOf(actual.estado) !== -1;
    if (!avanzado) campos.estado = d.calificado ? 'No agendado' : 'No calificado';
    if (d.evento_meta) campos.eventos_meta_agregar = d.evento_meta;
    escribirFila_(HOJA_MAESTRO, COLUMNAS_MAESTRO, d.email, campos);
    // Con cita ya agendada se queda en "Agendados"; solo se actualizan sus respuestas.
    if (avanzado) escribirFila_(HOJA_AGENDADOS, COLUMNAS_PAGINA, d.email, campos, true);
    else ubicarEnPagina_(d.email, d.calificado ? HOJA_NO_AGENDADOS : HOJA_NO_CALIFICADOS);
    if (d.prioridad && !avanzado) {
      try { avisarPrioritario_(leerFila_(HOJA_MAESTRO, COLUMNAS_MAESTRO, d.email)); } catch (err) { console.error('correo prioritario', err); }
    }
  });
  return { ok: true };
}

// Deja el lead (con lo que hay en MAESTRO) en una sola pestaña del flujo de la página.
function ubicarEnPagina_(email, destino) {
  var lead = leerFila_(HOJA_MAESTRO, COLUMNAS_MAESTRO, email);
  if (!lead) return;
  HOJAS_PAGINA.concat([HOJA_ORGANICOS]).forEach(function (h) { if (h !== destino) borrarFila_(h, email); });
  var campos = {};
  COLUMNAS_PAGINA.forEach(function (c) { if (c[1] !== 'email' && lead[c[1]] !== '') campos[c[1]] = lead[c[1]]; });
  escribirFila_(destino, COLUMNAS_PAGINA, email, campos);
}

function camposBase_(d) {
  var c = { nombre: d.nombre, telefono: d.telefono, pais: d.pais, fuente: d.fuente || 'Web · /aprende', fbp: d.fbp, fbc: d.fbc };
  var utm = d.utm || {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (k) { if (utm[k]) c[k] = utm[k]; });
  return c;
}

function leadPorEmail_(d) {
  var fila = leerFila_(HOJA_MAESTRO, COLUMNAS_MAESTRO, d.email);
  return fila ? { ok: true, lead: fila } : { ok: false, error: 'no_existe' };
}

// Campos que el panel /admin puede cambiar.
var CAMPOS_ADMIN = ['asistencia', 'venta', 'valor', 'moneda', 'estado', 'marcado_por'];
function marcar_(d) {
  var campos = {};
  CAMPOS_ADMIN.forEach(function (k) { if (d.campos && d.campos[k] !== undefined) campos[k] = d.campos[k]; });
  if (d.evento_meta) campos.eventos_meta_agregar = d.evento_meta;
  var fila;
  conLock_(function () {
    if (!leerFila_(HOJA_MAESTRO, COLUMNAS_MAESTRO, d.email)) throw new Error('no_existe');
    escribirFila_(HOJA_MAESTRO, COLUMNAS_MAESTRO, d.email, campos);
    escribirFila_(HOJA_AGENDADOS, COLUMNAS_PAGINA, d.email, campos, true);
    fila = leerFila_(HOJA_MAESTRO, COLUMNAS_MAESTRO, d.email);
  });
  return { ok: true, lead: fila };
}

function listar_() {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_MAESTRO);
  if (!hoja || hoja.getLastRow() < 2) return { ok: true, leads: [] };
  var valores = hoja.getDataRange().getValues();
  var mapa = mapaColumnas_(valores[0], COLUMNAS_MAESTRO);
  var leads = [];
  for (var i = valores.length - 1; i >= 1 && leads.length < 500; i--) {
    var fila = objetoFila_(valores[i], mapa);
    if (fila.calificado === 'Sí' || fila.cita_inicio) leads.push(fila);
  }
  return { ok: true, leads: leads };
}

/* ---------------------------- horarios ---------------------------- */

function horarios_(d) {
  var prioridad = Boolean(d && d.prioridad);
  var clave = prioridad ? 'horarios_prioridad' : 'horarios';
  var cache = CacheService.getScriptCache();
  var guardado = cache.get(clave);
  if (guardado) return JSON.parse(guardado);
  var ahora = new Date();
  var desde = new Date(ahora.getTime() + AG.avisoMinimoMin * 60000);
  var hasta = new Date(ahora.getTime() + AG.diasAdelante * 86400000);
  var libres = libresPorSlot_(ahora, hasta, desde);
  var slots = Object.keys(libres).filter(function (s) { return !prioridad || libres[s].indexOf(AG.prioritario) !== -1; }).sort();
  // Si el closer principal no tiene ningún espacio, el prioritario ve los de todos.
  if (prioridad && !slots.length) slots = Object.keys(libres).sort();
  var resultado = { ok: true, zona: AG.zona, duracion: AG.duracionMin, slots: slots };
  cache.put(clave, JSON.stringify(resultado), 60);
  return resultado;
}

// { 'ISO inicio': [emails de closers libres] }
function libresPorSlot_(ahora, hasta, desde) {
  var ocupado = ocupadoPorCloser_(ahora, hasta);
  var libres = {};
  for (var i = 0; i <= AG.diasAdelante; i++) {
    var dia = new Date(ahora.getTime() + i * 86400000);
    var fecha = Utilities.formatDate(dia, AG.zona, 'yyyy-MM-dd');
    if (AG.diasHabiles.indexOf(Number(Utilities.formatDate(dia, AG.zona, 'u'))) === -1) continue;
    AG.closers.forEach(function (closer) {
      if (!ocupado[closer.email]) return; // sin acceso a su calendario: no se ofrece
      closer.bloques.forEach(function (bloque) {
        var inicio = new Date(fecha + 'T' + bloque[0] + ':00' + AG.offset);
        var fin = new Date(fecha + 'T' + bloque[1] + ':00' + AG.offset);
        for (var t = inicio.getTime(); t + AG.duracionMin * 60000 <= fin.getTime(); t += AG.duracionMin * 60000) {
          if (t < desde.getTime() || t > hasta.getTime()) continue;
          var finSlot = t + AG.duracionMin * 60000;
          var choca = ocupado[closer.email].some(function (b) { return b[0] < finSlot && b[1] > t; });
          if (choca) continue;
          var clave = new Date(t).toISOString();
          (libres[clave] = libres[clave] || []).push(closer.email);
        }
      });
    });
  }
  return libres;
}

function ocupadoPorCloser_(desde, hasta) {
  var respuesta = Calendar.Freebusy.query({
    timeMin: desde.toISOString(), timeMax: hasta.toISOString(), timeZone: AG.zona,
    items: AG.closers.map(function (c) { return { id: c.email }; })
  });
  var ocupado = {};
  AG.closers.forEach(function (c) {
    var cal = respuesta.calendars[c.email];
    if (!cal || (cal.errors && cal.errors.length)) { console.warn('Sin acceso al calendario de ' + c.email, cal && cal.errors); return; }
    ocupado[c.email] = (cal.busy || []).map(function (b) { return [new Date(b.start).getTime(), new Date(b.end).getTime()]; });
  });
  return ocupado;
}

/* ----------------------------- agendar ----------------------------- */

function agendar_(d) {
  var resultado;
  conLock_(function () {
    var lead = leerFila_(HOJA_MAESTRO, COLUMNAS_MAESTRO, d.email);
    if (!lead || lead.calificado !== 'Sí') { resultado = { ok: false, error: 'no_calificado' }; return; }
    if (lead.cita_inicio && new Date(lead.cita_inicio).getTime() > Date.now() && lead.estado === 'Agendado') {
      resultado = { ok: true, ya_agendado: true, cita: citaDe_(lead) }; return;
    }
    var inicio = new Date(d.inicio);
    var minimo = Date.now() + AG.avisoMinimoMin * 60000;
    if (isNaN(inicio.getTime()) || inicio.getTime() < minimo) { resultado = { ok: false, error: 'no_disponible' }; return; }
    var libres = libresPorSlot_(new Date(inicio.getTime() - 60000), new Date(inicio.getTime() + AG.duracionMin * 60000 + 60000), new Date(minimo))[inicio.toISOString()] || [];
    if (!libres.length) { resultado = { ok: false, error: 'no_disponible' }; return; }

    var closer = lead.prioridad === 'Alta' && libres.indexOf(AG.prioritario) !== -1
      ? AG.closers.filter(function (c) { return c.email === AG.prioritario; })[0]
      : elegirCloser_(libres);
    var fin = new Date(inicio.getTime() + AG.duracionMin * 60000);
    var evento = Calendar.Events.insert({
      summary: AG.titulo + ' · ' + lead.nombre,
      description: descripcionCita_(lead),
      start: { dateTime: inicio.toISOString(), timeZone: AG.zona },
      end: { dateTime: fin.toISOString(), timeZone: AG.zona },
      attendees: [{ email: lead.email, displayName: lead.nombre }],
      conferenceData: { createRequest: { requestId: Utilities.getUuid(), conferenceSolutionKey: { type: 'hangoutsMeet' } } },
      guestsCanModify: false
    }, closer.email, { conferenceDataVersion: 1, sendUpdates: 'all' });

    var campos = {
      estado: 'Agendado', cita: Utilities.formatDate(inicio, AG.zona, 'dd/MM/yyyy HH:mm'),
      cita_inicio: inicio.toISOString(), closer: closer.email, meet: evento.hangoutLink || '',
      evento_calendario: evento.id, recordatorio_24h: '', recordatorio_1h: ''
    };
    if (d.evento_meta) campos.eventos_meta_agregar = d.evento_meta;
    escribirFila_(HOJA_MAESTRO, COLUMNAS_MAESTRO, d.email, campos);
    ubicarEnPagina_(d.email, HOJA_AGENDADOS);
    CacheService.getScriptCache().removeAll(['horarios', 'horarios_prioridad']);
    lead = leerFila_(HOJA_MAESTRO, COLUMNAS_MAESTRO, d.email);
    resultado = { ok: true, cita: citaDe_(lead) };
    try { avisarCloser_(closer, lead); avisarLead_(lead, closer); } catch (err) { console.error('correo cita', err); }
  });
  return resultado;
}

// Reparto por turnos entre los closers libres en ese horario.
function elegirCloser_(libres) {
  var props = PropertiesService.getScriptProperties();
  var ultimo = props.getProperty('ULTIMO_CLOSER');
  var candidatos = AG.closers.filter(function (c) { return libres.indexOf(c.email) !== -1; });
  var elegido = candidatos.filter(function (c) { return c.email !== ultimo; })[0] || candidatos[0];
  props.setProperty('ULTIMO_CLOSER', elegido.email);
  return elegido;
}

function citaDe_(lead) {
  var closer = AG.closers.filter(function (c) { return c.email === lead.closer; })[0];
  return { inicio: lead.cita_inicio, duracion: AG.duracionMin, meet: lead.meet, closer: closer ? closer.nombre : '' };
}

function descripcionCita_(lead) {
  return [
    'Lead de lucianomusella.com/aprende', '',
    'Nombre: ' + lead.nombre, 'Email: ' + lead.email, 'WhatsApp: ' + lead.telefono + (lead.pais ? ' (' + lead.pais + ')' : ''), '',
    '¿Dónde aplicará IA? ' + lead.aplica, '¿Cuándo quiere empezar? ' + lead.inicio,
    'Inversión: ' + lead.inversion, 'Principal reto: ' + lead.reto, '',
    'utm_campaign: ' + (lead.utm_campaign || '-') + ' · utm_content: ' + (lead.utm_content || '-')
  ].join('\n');
}

/* ----------------------------- correos ----------------------------- */

function avisarCloser_(closer, lead) {
  MailApp.sendEmail({
    to: closer.email,
    subject: 'Nueva llamada agendada: ' + lead.nombre + ' · ' + lead.cita,
    htmlBody: '<p>Hola ' + esc_(closer.nombre) + ', tienes una nueva llamada desde la página.</p>' +
      '<p><b>' + esc_(lead.cita) + ' (hora Colombia)</b> · ' + AG.duracionMin + ' min<br>' +
      'Meet: <a href="' + esc_(lead.meet) + '">' + esc_(lead.meet) + '</a></p>' +
      '<pre style="font-family:inherit">' + esc_(descripcionCita_(lead)) + '</pre>' +
      '<p>Después de la llamada marca asistencia y venta en <a href="https://www.lucianomusella.com/admin/">lucianomusella.com/admin</a>.</p>'
  });
}

// Lead prioritario recién calificado (aún sin cita): aviso inmediato al closer principal.
function avisarPrioritario_(lead) {
  var wa = String(lead.telefono || '').replace(/\D/g, '');
  MailApp.sendEmail({
    to: AG.prioritario,
    subject: '🔥 Lead prioritario: ' + lead.nombre + ' (listo para invertir)',
    htmlBody: '<p><b>' + esc_(lead.nombre) + '</b> acaba de calificar como prioritario en la página. Puede agendar contigo ahora mismo; si no lo hace, escríbele.</p>' +
      '<p>Email: ' + esc_(lead.email) + '<br>WhatsApp: ' + esc_(lead.telefono) + (lead.pais ? ' (' + esc_(lead.pais) + ')' : '') + '</p>' +
      '<pre style="font-family:inherit">' + esc_(descripcionCita_(lead)) + '</pre>'
  });
}

function avisarLead_(lead, closer) {
  var nombre = String(lead.nombre).split(' ')[0];
  MailApp.sendEmail({
    to: lead.email, name: AG.remitente,
    subject: 'Tu llamada quedó agendada · ' + lead.cita + ' (hora Colombia)',
    htmlBody: '<p>Hola ' + esc_(nombre) + ',</p>' +
      '<p>Tu conversación de ' + AG.duracionMin + ' minutos con el equipo de Luciano Musella quedó agendada para el <b>' +
      esc_(lead.cita) + ' (hora Colombia)</b>.</p>' +
      '<p>Entra a la llamada desde este link: <a href="' + esc_(lead.meet) + '">' + esc_(lead.meet) + '</a><br>' +
      'También te llegó la invitación de Google Calendar para que la guardes.</p>' +
      '<p>Mientras tanto, únete a la comunidad: <a href="' + AG.whatsappComunidad + '">grupo de WhatsApp</a>.</p>' +
      '<p>Nos vemos pronto.</p>'
  });
}

// Disparador cada 15 minutos (activarRecordatorios): recordatorio 24 h y 1 h antes.
function enviarRecordatorios() {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_MAESTRO);
  if (!hoja || hoja.getLastRow() < 2) return;
  var valores = hoja.getDataRange().getValues();
  var mapa = mapaColumnas_(valores[0], COLUMNAS_MAESTRO);
  var ahora = Date.now();
  for (var i = 1; i < valores.length; i++) {
    var lead = objetoFila_(valores[i], mapa);
    if (lead.estado !== 'Agendado' || !lead.cita_inicio || !lead.meet) continue;
    var falta = new Date(lead.cita_inicio).getTime() - ahora;
    if (falta <= 0) continue;
    var tipo = falta <= 75 * 60000 && !lead.recordatorio_1h ? '1h' : (falta <= 24 * 3600000 && falta > 3 * 3600000 && !lead.recordatorio_24h ? '24h' : '');
    if (!tipo) continue;
    MailApp.sendEmail({
      to: lead.email, name: AG.remitente,
      subject: (tipo === '1h' ? 'En 1 hora: ' : 'Mañana: ') + 'tu llamada con el equipo de Luciano Musella',
      htmlBody: '<p>Hola ' + esc_(String(lead.nombre).split(' ')[0]) + ', te recordamos tu llamada del <b>' + esc_(lead.cita) +
        ' (hora Colombia)</b>.</p><p>Entra aquí: <a href="' + esc_(lead.meet) + '">' + esc_(lead.meet) + '</a></p>'
    });
    hoja.getRange(i + 1, mapa[tipo === '1h' ? 'recordatorio_1h' : 'recordatorio_24h'] + 1).setValue(new Date());
  }
}

function activarRecordatorios() {
  ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === 'enviarRecordatorios') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('enviarRecordatorios').timeBased().everyMinutes(15).create();
}

// Instalación en un clic: autoriza el script, revisa calendarios, activa recordatorios
// e importa los históricos. Ejecútala una vez desde el editor.
function instalar() {
  var calendarios = probarCalendarios();
  activarRecordatorios();
  var importados = importarHistoricos();
  console.log('Importados: ' + JSON.stringify(importados));
  return { calendarios: calendarios, recordatorios: 'activos', importados: importados };
}

// Ejecútala desde el editor para comprobar el acceso a los calendarios.
function probarCalendarios() {
  var ocupado = ocupadoPorCloser_(new Date(), new Date(Date.now() + 7 * 86400000));
  var estado = {};
  AG.closers.forEach(function (c) {
    estado[c.email] = ocupado[c.email] ? 'OK, ' + ocupado[c.email].length + ' bloques ocupados' : 'SIN ACCESO';
    console.log(c.email + ': ' + estado[c.email]);
  });
  estado.horarios_libres_14_dias = horarios_().slots.length;
  console.log('Horarios libres próximos 14 días: ' + estado.horarios_libres_14_dias);
  return estado;
}

/* ------------------------- importar históricos ------------------------- */

var SHEETS_ANTERIORES = {
  manychat: '1nkNG9buhWsLM7ADuG9VOyZbWE6P2z7PAAXt3FCr_tDU', // "Leads - Manychat - Página" (pestaña Leads)
  pagina: '1XDJwH0i-jech5NN9QmqDP7-ev9YmL4ga47FCU6okO8M'    // "Leads - Octubre 1" (pestaña Web - Aprende)
};

// Ejecútala una vez desde el editor. Se puede repetir: el email es la llave, no duplica.
function importarHistoricos() {
  var maestro = tabla_(HOJA_MAESTRO, COLUMNAS_MAESTRO), organicos = tabla_(HOJA_ORGANICOS, COLUMNAS_ORGANICOS);
  var pagina = {};
  HOJAS_PAGINA.forEach(function (h) { pagina[h] = tabla_(h, COLUMNAS_PAGINA); });
  var cuenta = { organicos: 0, agendados: 0, noAgendados: 0, omitidos: 0 };

  // 1. ManyChat + pop-up -> "ManyChat - Orgánicos"
  var libroMc = SpreadsheetApp.openById(SHEETS_ANTERIORES.manychat);
  filasDe_(libroMc.getSheetByName('Leads') || libroMc.getSheets()[0]).forEach(function (r) {
    var email = correo_(r['Email']);
    if (!email) { cuenta.omitidos++; return; }
    var fuente = String(r['Fuente'] || 'Página Web');
    var recurso = fuente.replace(/^ManyChat · /, '').replace(/^Recurso: /, '');
    var previo = maestro.get(email);
    var campos = { creado: r['Fecha y hora'], nombre: r['Nombre'], telefono: String(r['Teléfono'] || ''), recursos_agregar: recurso };
    if (!previo) { campos.fuente = fuente; campos.estado = 'Orgánico'; }
    maestro.set(email, campos);
    if (previo && previo.estado && previo.estado !== 'Orgánico') return;
    organicos.set(email, { creado: r['Fecha y hora'], nombre: r['Nombre'], telefono: String(r['Teléfono'] || ''), fuente: fuente, recursos_agregar: recurso, estado: 'Orgánico' });
    cuenta.organicos++;
  });

  // 2. Leads calificados de la página -> Agendados / No agendados (según los calendarios)
  var citas = citasPorInvitado_();
  var anterior = SpreadsheetApp.openById(SHEETS_ANTERIORES.pagina).getSheetByName('Web - Aprende');
  filasDe_(anterior).forEach(function (r) {
    var email = correo_(r['Email']);
    if (!email || /prueba/i.test(r['Nombre'] + ' ' + email)) { cuenta.omitidos++; return; }
    var cita = citas[email];
    var previo = maestro.get(email);
    var campos = {
      creado: r['Fecha y hora'], nombre: r['Nombre'], telefono: String(r['WhatsApp'] || ''), pais: r['País'],
      aplica: r['¿Dónde vas a aplicar lo que aprendas de IA?'], inicio: r['¿Cuándo quieres empezar?'],
      inversion: r['Inversión $500 USD'], reto: r['Principal reto'], calificado: 'Sí', fuente: 'Aprende · histórico',
      utm_source: r['utm_source'], utm_medium: r['utm_medium'], utm_campaign: r['utm_campaign'], utm_content: r['utm_content'], utm_term: r['utm_term']
    };
    if (!previo || ESTADOS_AVANZADOS.indexOf(previo.estado) === -1) {
      campos.estado = cita ? 'Agendado' : 'No agendado';
      if (cita) {
        campos.cita = Utilities.formatDate(cita.inicio, AG.zona, 'dd/MM/yyyy HH:mm');
        campos.cita_inicio = cita.inicio.toISOString(); campos.closer = cita.closer;
      }
    }
    maestro.set(email, campos);
    var lead = maestro.get(email);
    var destino = ESTADOS_AVANZADOS.indexOf(lead.estado) !== -1 ? HOJA_AGENDADOS : HOJA_NO_AGENDADOS;
    organicos.del(email);
    HOJAS_PAGINA.forEach(function (h) { if (h !== destino) pagina[h].del(email); });
    var datos = {};
    COLUMNAS_PAGINA.forEach(function (c) { if (c[1] !== 'email' && lead[c[1]] !== '') datos[c[1]] = lead[c[1]]; });
    pagina[destino].set(email, datos);
    cuenta[destino === HOJA_AGENDADOS ? 'agendados' : 'noAgendados']++;
  });

  [maestro, organicos].concat(HOJAS_PAGINA.map(function (h) { return pagina[h]; })).forEach(function (t) { t.save(); });
  console.log(JSON.stringify(cuenta));
  return cuenta;
}

// { email del invitado: { inicio, closer } } con las citas de los últimos 90 días y próximos 60.
function citasPorInvitado_() {
  var citas = {};
  var desde = new Date(Date.now() - 90 * 86400000), hasta = new Date(Date.now() + 60 * 86400000);
  AG.closers.forEach(function (c) {
    var cal = CalendarApp.getCalendarById(c.email);
    if (!cal) { console.warn('Sin acceso al calendario de ' + c.email); return; }
    cal.getEvents(desde, hasta).forEach(function (ev) {
      ev.getGuestList().forEach(function (g) {
        var email = correo_(g.getEmail());
        if (email && email !== c.email) citas[email] = { inicio: ev.getStartTime(), closer: c.email };
      });
    });
  });
  return citas;
}

function filasDe_(hoja) {
  if (!hoja || hoja.getLastRow() < 2) return [];
  var valores = hoja.getDataRange().getValues(), titulos = valores[0];
  return valores.slice(1).map(function (fila) {
    var o = {};
    titulos.forEach(function (t, i) { o[t] = fila[i]; });
    return o;
  });
}

function correo_(valor) {
  var email = String(valor || '').trim().toLowerCase();
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? email : '';
}

// Pestaña completa en memoria (para importar miles de filas sin pasarse del tiempo de Apps Script).
function tabla_(nombre, columnas) {
  var hoja = hoja_(nombre, columnas);
  var mapa = asegurarColumnas_(hoja, columnas);
  var ancho = hoja.getLastColumn();
  var filas = hoja.getLastRow() > 1 ? hoja.getRange(2, 1, hoja.getLastRow() - 1, ancho).getValues() : [];
  var indice = {};
  filas.forEach(function (f, i) { indice[String(f[mapa.email]).trim().toLowerCase()] = i; });
  var cambio = false;
  return {
    get: function (email) { return email in indice ? objetoFila_(filas[indice[email]], mapa) : null; },
    set: function (email, campos) {
      var nueva = !(email in indice);
      if (nueva) { indice[email] = filas.length; filas.push(new Array(ancho).fill('')); }
      aplicarCampos_(filas[indice[email]], mapa, email, campos, nueva);
      cambio = true;
    },
    del: function (email) {
      if (!(email in indice)) return;
      filas.splice(indice[email], 1);
      indice = {};
      filas.forEach(function (f, i) { indice[String(f[mapa.email]).trim().toLowerCase()] = i; });
      cambio = true;
    },
    save: function () {
      if (!cambio) return;
      if (hoja.getLastRow() > 1) hoja.getRange(2, 1, hoja.getLastRow() - 1, ancho).clearContent();
      if (filas.length) hoja.getRange(2, 1, filas.length, ancho).setValues(filas.map(textoPlano_));
    }
  };
}

/* ------------------------- Sheets: utilidades ------------------------- */

function conLock_(fn) {
  var lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try { fn(); } finally { lock.releaseLock(); }
}

function hoja_(nombre, columnas) {
  var libro = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = libro.getSheetByName(nombre);
  if (!hoja) hoja = libro.insertSheet(nombre);
  if (hoja.getLastRow() === 0) {
    hoja.appendRow(columnas.map(function (c) { return c[0]; }));
    hoja.getRange(1, 1, 1, columnas.length).setBackground('#e07a54').setFontColor('#ffffff').setFontWeight('bold').setWrap(true);
    hoja.setFrozenRows(1);
  }
  return hoja;
}

// Lee los encabezados; agrega al final las columnas que falten.
function asegurarColumnas_(hoja, columnas) {
  var ancho = Math.max(hoja.getLastColumn(), 1);
  var titulos = hoja.getRange(1, 1, 1, ancho).getValues()[0];
  var faltan = columnas.filter(function (c) { return titulos.indexOf(c[0]) === -1; }).map(function (c) { return c[0]; });
  if (faltan.length) {
    hoja.getRange(1, titulos.length + 1, 1, faltan.length).setValues([faltan])
      .setBackground('#e07a54').setFontColor('#ffffff').setFontWeight('bold').setWrap(true);
    titulos = titulos.concat(faltan);
  }
  return mapaColumnas_(titulos, columnas);
}

function mapaColumnas_(titulos, columnas) {
  var mapa = {};
  columnas.forEach(function (c) { var i = titulos.indexOf(c[0]); if (i !== -1) mapa[c[1]] = i; });
  return mapa;
}

function objetoFila_(fila, mapa) {
  var o = {};
  Object.keys(mapa).forEach(function (k) {
    var v = fila[mapa[k]];
    o[k] = v instanceof Date ? v.toISOString() : (v === null || v === undefined ? '' : String(v));
  });
  return o;
}

function buscarFila_(hoja, mapa, email) {
  if (hoja.getLastRow() < 2 || mapa.email === undefined) return -1;
  var correos = hoja.getRange(2, mapa.email + 1, hoja.getLastRow() - 1, 1).getValues();
  var buscado = String(email).trim().toLowerCase();
  for (var i = correos.length - 1; i >= 0; i--) {
    if (String(correos[i][0]).trim().toLowerCase() === buscado) return i + 2;
  }
  return -1;
}

function leerFila_(nombre, columnas, email) {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(nombre);
  if (!hoja) return null;
  var mapa = asegurarColumnas_(hoja, columnas);
  var n = buscarFila_(hoja, mapa, email);
  if (n === -1) return null;
  return objetoFila_(hoja.getRange(n, 1, 1, hoja.getLastColumn()).getValues()[0], mapa);
}

// Crea o actualiza la fila de ese email. soloSiExiste: no crea filas nuevas.
function escribirFila_(nombre, columnas, email, campos, soloSiExiste) {
  var hoja = hoja_(nombre, columnas);
  var mapa = asegurarColumnas_(hoja, columnas);
  var n = buscarFila_(hoja, mapa, email);
  if (n === -1 && soloSiExiste) return;
  var ancho = hoja.getLastColumn();
  var fila = n === -1 ? new Array(ancho).fill('') : hoja.getRange(n, 1, 1, ancho).getValues()[0];
  aplicarCampos_(fila, mapa, email, campos, n === -1);
  fila = textoPlano_(fila);
  if (n === -1) hoja.appendRow(fila);
  else hoja.getRange(n, 1, 1, ancho).setValues([fila]);
}

function aplicarCampos_(fila, mapa, email, campos, nueva) {
  var ahora = new Date();
  if (nueva) {
    if (mapa.creado !== undefined) fila[mapa.creado] = ahora;
    fila[mapa.email] = String(email).trim().toLowerCase();
  }
  if (mapa.actualizado !== undefined) fila[mapa.actualizado] = ahora;
  Object.keys(campos).forEach(function (k) {
    var v = campos[k];
    if (v === undefined || v === null || v === '' && /_agregar$/.test(k)) return;
    // "<campo>_agregar": suma el valor a la lista separada por comas de esa columna.
    var lista = /^(.+)_agregar$/.exec(k);
    if (lista) {
      var col = lista[1];
      if (mapa[col] === undefined) return;
      var previos = String(fila[mapa[col]] || '').split(',').map(function (x) { return x.trim(); }).filter(String);
      if (previos.indexOf(v) === -1) previos.push(v);
      fila[mapa[col]] = previos.join(', ');
      return;
    }
    if (mapa[k] === undefined) return;
    // Las fechas llegan como texto ISO cuando se copian de otra pestaña.
    fila[mapa[k]] = (k === 'creado' || k === 'actualizado') && typeof v === 'string' && v ? new Date(v) : v;
  });
}

// El apóstrofo inicial hace que Sheets guarde cada texto tal cual: no convierte
// el WhatsApp en número, ni la cita en fecha, ni ejecuta fórmulas del texto libre.
function textoPlano_(fila) {
  return fila.map(function (v) { return typeof v === 'string' && v !== '' ? "'" + v : v; });
}

function borrarFila_(nombre, email) {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(nombre);
  if (!hoja || hoja.getLastRow() < 2) return;
  var titulos = hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0];
  var mapa = { email: titulos.indexOf('Email') !== -1 ? titulos.indexOf('Email') : titulos.indexOf('email') };
  if (mapa.email === -1) return;
  for (var n = buscarFila_(hoja, mapa, email); n !== -1; n = buscarFila_(hoja, mapa, email)) hoja.deleteRow(n);
}

function esc_(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
}

function respuesta_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
