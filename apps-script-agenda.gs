/**
 * Agenda + Sheets maestro — lucianomusella.com/aprende
 * ---------------------------------------------------------------------------
 * Reemplaza a web-aprende.gs dentro del Apps Script del Google Sheets
 * "Leads - Octubre 1". Lo llaman las funciones de Vercel (api/aprende-lead.js,
 * api/aprende-agenda.js y api/admin.js) con una clave secreta.
 *
 * Hace cuatro cosas:
 *  1. Guarda cada lead en la pestaña MAESTRO (el email es la llave única) y en
 *     la pestaña del flujo del agente: "Web - Aprende" (calificados) o
 *     "Web - No calificados".
 *  2. Calcula los horarios libres de los closers leyendo sus Google Calendar.
 *  3. Agenda la llamada (Google Meet) en el calendario del closer, invita al
 *     lead y avisa por correo al closer y al lead.
 *  4. Manda recordatorios por correo 24 h y 1 h antes (función activarRecordatorios).
 *
 * Requisitos (una sola vez):
 *  - Servicios (+) → Google Calendar API (identificador "Calendar").
 *  - Configuración del proyecto → Propiedades del script → AGENDA_SECRET.
 *  - Implementar como aplicación web: Ejecutar como "Yo" con admin@getforth.ai,
 *    acceso "Cualquier usuario".
 *  - Cada closer distinto de admin@getforth.ai comparte su calendario con
 *    admin@getforth.ai con permiso "Hacer cambios en eventos".
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
  titulo: 'Conversación con Luciano Musella · Programa de IA',
  remitente: 'Luciano Musella',
  whatsappComunidad: 'https://chat.whatsapp.com/FJwqTceWj4gBKpYKBAWEWW'
};

var HOJA_MAESTRO = 'MAESTRO';
var COLUMNAS_MAESTRO = [
  ['email', 'email'], ['Fecha de registro', 'creado'], ['Última actualización', 'actualizado'],
  ['Nombre', 'nombre'], ['WhatsApp', 'telefono'], ['País', 'pais'], ['Fuente', 'fuente'],
  ['Estado', 'estado'], ['Calificado', 'calificado'],
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

// Pestañas que lee el agente. "Web - Aprende" conserva sus columnas de siempre;
// las nuevas (Estado, Cita, País) se agregan al final.
var COLUMNAS_FLUJO = [
  ['Fecha y hora', 'creado'], ['Nombre', 'nombre'], ['Email', 'email'], ['WhatsApp', 'telefono'],
  ['¿Dónde vas a aplicar lo que aprendas de IA?', 'aplica'], ['¿Cuándo quieres empezar?', 'inicio'],
  ['Inversión $500 USD', 'inversion'], ['Principal reto', 'reto'],
  ['utm_source', 'utm_source'], ['utm_medium', 'utm_medium'], ['utm_campaign', 'utm_campaign'],
  ['utm_content', 'utm_content'], ['utm_term', 'utm_term'], ['Fuente', 'fuente'],
  ['Estado', 'estado'], ['Cita (hora Colombia)', 'cita'], ['País', 'pais']
];
var HOJA_CALIFICADOS = 'Web - Aprende';
var HOJA_NO_CALIFICADOS = 'Web - No calificados';

// Estados que una nueva visita al formulario no debe pisar.
var ESTADOS_AVANZADOS = ['Agendado', 'Show', 'No show', 'Venta', 'No venta'];

function doPost(e) {
  var datos;
  try { datos = JSON.parse(e.postData.contents); } catch (err) { return respuesta_({ ok: false, error: 'json' }); }
  // Formato anterior (web-aprende.gs): fila directa en "Web - Aprende", sin clave.
  if (!datos.action) return legado_(datos);
  if (!datos.secret || datos.secret !== PropertiesService.getScriptProperties().getProperty('AGENDA_SECRET')) {
    return respuesta_({ ok: false, error: 'no_autorizado' });
  }
  try {
    var acciones = { contacto: contacto_, calificacion: calificacion_, horarios: horarios_, agendar: agendar_, listar: listar_, lead: leadPorEmail_, marcar: marcar_ };
    if (!acciones[datos.action]) return respuesta_({ ok: false, error: 'accion' });
    return respuesta_(acciones[datos.action](datos));
  } catch (err) {
    console.error(datos.action, err);
    return respuesta_({ ok: false, error: String(err && err.message || err) });
  }
}

function doGet() {
  return ContentService.createTextOutput('Agenda Acelera activa ✅');
}

/* ----------------------------- leads ----------------------------- */

function contacto_(d) {
  conLock_(function () {
    var actual = leerFila_(HOJA_MAESTRO, COLUMNAS_MAESTRO, d.email);
    var campos = camposBase_(d);
    if (!actual || !actual.estado) campos.estado = 'Formulario iniciado';
    escribirFila_(HOJA_MAESTRO, COLUMNAS_MAESTRO, d.email, campos);
  });
  return { ok: true };
}

function calificacion_(d) {
  conLock_(function () {
    var actual = leerFila_(HOJA_MAESTRO, COLUMNAS_MAESTRO, d.email);
    var campos = camposBase_(d);
    campos.aplica = d.aplica; campos.inicio = d.inicio; campos.inversion = d.inversion; campos.reto = d.reto;
    campos.calificado = d.calificado ? 'Sí' : 'No';
    var avanzado = actual && ESTADOS_AVANZADOS.indexOf(actual.estado) !== -1;
    if (!avanzado) campos.estado = d.calificado ? 'No agendado' : 'No calificado';
    if (d.evento_meta) campos.eventos_meta_agregar = d.evento_meta;
    escribirFila_(HOJA_MAESTRO, COLUMNAS_MAESTRO, d.email, campos);

    var flujo = {};
    Object.keys(campos).forEach(function (k) { flujo[k] = campos[k]; });
    flujo.fuente = d.calificado ? 'Aprende · Lead calificado' : 'Aprende · No calificado';
    if (avanzado) delete flujo.estado;
    escribirFila_(d.calificado ? HOJA_CALIFICADOS : HOJA_NO_CALIFICADOS, COLUMNAS_FLUJO, d.email, flujo);
  });
  return { ok: true };
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
    if (campos.estado) escribirFila_(HOJA_CALIFICADOS, COLUMNAS_FLUJO, d.email, { estado: campos.estado }, true);
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

function horarios_() {
  var cache = CacheService.getScriptCache();
  var guardado = cache.get('horarios');
  if (guardado) return JSON.parse(guardado);
  var ahora = new Date();
  var desde = new Date(ahora.getTime() + AG.avisoMinimoMin * 60000);
  var hasta = new Date(ahora.getTime() + AG.diasAdelante * 86400000);
  var libres = libresPorSlot_(ahora, hasta, desde);
  var slots = Object.keys(libres).sort();
  var resultado = { ok: true, zona: AG.zona, duracion: AG.duracionMin, slots: slots };
  cache.put('horarios', JSON.stringify(resultado), 60);
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

    var closer = elegirCloser_(libres);
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
    escribirFila_(HOJA_CALIFICADOS, COLUMNAS_FLUJO, d.email, { estado: 'Agendado', cita: campos.cita }, true);
    CacheService.getScriptCache().remove('horarios');
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

// Ejecútala desde el editor para comprobar el acceso a los calendarios.
function probarCalendarios() {
  var ocupado = ocupadoPorCloser_(new Date(), new Date(Date.now() + 7 * 86400000));
  AG.closers.forEach(function (c) { console.log(c.email + ': ' + (ocupado[c.email] ? 'OK, ' + ocupado[c.email].length + ' bloques ocupados' : 'SIN ACCESO')); });
  console.log('Horarios libres próximos 14 días: ' + horarios_().slots.length);
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
  var ahora = new Date();
  if (n === -1) {
    if (mapa.creado !== undefined) fila[mapa.creado] = ahora;
    fila[mapa.email] = String(email).trim().toLowerCase();
  }
  if (mapa.actualizado !== undefined) fila[mapa.actualizado] = ahora;
  Object.keys(campos).forEach(function (k) {
    var v = campos[k];
    if (v === undefined || v === null) return;
    if (k === 'eventos_meta_agregar') {
      if (mapa.eventos_meta === undefined) return;
      var previos = String(fila[mapa.eventos_meta] || '').split(',').map(function (x) { return x.trim(); }).filter(String);
      if (previos.indexOf(v) === -1) previos.push(v);
      fila[mapa.eventos_meta] = previos.join(', ');
      return;
    }
    if (mapa[k] === undefined) return;
    fila[mapa[k]] = v;
  });
  // El apóstrofo inicial hace que Sheets guarde cada texto tal cual: no convierte
  // el WhatsApp en número, ni la cita en fecha, ni ejecuta fórmulas del texto libre.
  fila = fila.map(function (v) { return typeof v === 'string' && v !== '' ? "'" + v : v; });
  if (n === -1) hoja.appendRow(fila);
  else hoja.getRange(n, 1, 1, ancho).setValues([fila]);
}

function legado_(datos) {
  conLock_(function () {
    var campos = {};
    COLUMNAS_FLUJO.forEach(function (c) { if (datos[c[1]] !== undefined) campos[c[1]] = String(datos[c[1]]); });
    escribirFila_(HOJA_CALIFICADOS, COLUMNAS_FLUJO, datos.email || '', campos);
  });
  return respuesta_({ ok: true });
}

function esc_(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
}

function respuesta_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
