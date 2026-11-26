/**
 * Recordatorios de las citas de la agenda, enviados desde recordatorios@getforth.ai.
 *
 * Proyecto de Apps Script independiente, de la cuenta recordatorios@getforth.ai (no de admin@): así
 * los correos automáticos a los leads salen de esa cuenta y, si algún día Gmail la limita, admin@ no
 * se ve afectado. Lee la pestaña MAESTRO del Sheet "Leads - Central" (que admin@ comparte con esta
 * cuenta como Editor) y, cada 5 minutos:
 *  1. Confirma la cita recién agendada ("Tu llamada quedó agendada"). Si la cita cambió de hora,
 *     avisa la hora nueva.
 *  2. Manda el recordatorio 24 h antes y el de 1 h antes, y lo marca en recordatorio_24h /
 *     recordatorio_1h (las mismas columnas de siempre).
 *
 * La cita la sigue creando el script de la agenda (apps-script-agenda.gs, cuenta admin@), con la
 * invitación de Google Calendar y el aviso al closer; ese script ya no le escribe al lead.
 *
 * Instalación (una vez, desde el editor de esta cuenta): ejecutar instalar(). Pide permisos, marca
 * como ya confirmadas las citas que existen (para no volver a confirmarlas) y crea el disparador.
 */

var REC = {
  sheetId: '__SHEET_ID__',
  hoja: 'MAESTRO',
  zona: 'America/Bogota',
  remitente: 'Luciano Musella',
  duracionMin: 30,
  whatsappComunidad: 'https://chat.whatsapp.com/FJwqTceWj4gBKpYKBAWEWW'
};

// Los títulos de columna de MAESTRO que se usan (los mismos de apps-script-agenda.gs).
var COLUMNAS = [
  ['email', 'email'], ['Nombre', 'nombre'], ['Estado', 'estado'], ['Cita (hora Colombia)', 'cita'],
  ['cita_inicio', 'cita_inicio'], ['Link de Meet', 'meet'],
  ['recordatorio_24h', 'recordatorio_24h'], ['recordatorio_1h', 'recordatorio_1h']
];

function instalar() {
  marcarConfirmadas_();
  ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === 'revisarCitas') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('revisarCitas').timeBased().everyMinutes(5).create();
  return { listo: true, cuenta: Session.getEffectiveUser().getEmail() };
}

function leer_() {
  var hoja = SpreadsheetApp.openById(REC.sheetId).getSheetByName(REC.hoja);
  if (!hoja || hoja.getLastRow() < 2) return null;
  var valores = hoja.getDataRange().getValues();
  var titulos = valores[0];
  var mapa = {};
  COLUMNAS.forEach(function (c) { var i = titulos.indexOf(c[0]); if (i !== -1) mapa[c[1]] = i; });
  ['email', 'estado', 'cita_inicio', 'recordatorio_24h', 'recordatorio_1h'].forEach(function (k) {
    if (mapa[k] === undefined) throw new Error('Falta la columna "' + k + '" en ' + REC.hoja);
  });
  var citas = [];
  for (var i = 1; i < valores.length; i++) {
    var fila = valores[i];
    var o = { fila: i + 1 };
    Object.keys(mapa).forEach(function (k) { var v = fila[mapa[k]]; o[k] = v instanceof Date ? v.toISOString() : String(v == null ? '' : v); });
    o.email = o.email.trim().toLowerCase();
    if (o.estado === 'Agendado' && o.cita_inicio && o.meet && o.email) citas.push(o);
  }
  return { hoja: hoja, mapa: mapa, citas: citas };
}

/** Citas que ya se confirmaron: email → cita_inicio. Así un cambio de hora se avisa una vez. */
function confirmadas_() {
  return JSON.parse(PropertiesService.getScriptProperties().getProperty('confirmadas') || '{}');
}

function guardarConfirmadas_(mapa) {
  // Solo las que no han pasado, para que no crezca sin fin.
  var ahora = Date.now();
  Object.keys(mapa).forEach(function (email) { if (new Date(mapa[email]).getTime() < ahora - 86400000) delete mapa[email]; });
  PropertiesService.getScriptProperties().setProperty('confirmadas', JSON.stringify(mapa));
}

function marcarConfirmadas_() {
  var datos = leer_();
  var mapa = confirmadas_();
  if (datos) datos.citas.forEach(function (c) { mapa[c.email] = c.cita_inicio; });
  guardarConfirmadas_(mapa);
}

// Disparador cada 5 minutos.
function revisarCitas() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) return;
  try {
    var datos = leer_();
    if (!datos) return;
    var confirmadas = confirmadas_();
    var ahora = Date.now();
    datos.citas.forEach(function (c) {
      var falta = new Date(c.cita_inicio).getTime() - ahora;
      if (!(falta > 0)) return;
      try {
        if (confirmadas[c.email] !== c.cita_inicio) {
          var cambio = Boolean(confirmadas[c.email]);
          enviar_(c, cambio ? 'Cambiamos la hora de tu llamada · ' + c.cita + ' (hora Colombia)' : 'Tu llamada quedó agendada · ' + c.cita + ' (hora Colombia)', confirmacion_(c, cambio));
          confirmadas[c.email] = c.cita_inicio;
          guardarConfirmadas_(confirmadas);
          return; // el recordatorio, en la próxima vuelta
        }
        var tipo = falta <= 75 * 60000 && !c.recordatorio_1h ? '1h' : (falta <= 24 * 3600000 && falta > 3 * 3600000 && !c.recordatorio_24h ? '24h' : '');
        if (!tipo) return;
        enviar_(c, (tipo === '1h' ? 'En 1 hora: ' : 'Mañana: ') + 'tu llamada con el equipo de Luciano Musella', recordatorio_(c));
        // La fila se vuelve a buscar por email justo antes de escribir: el script de la agenda puede haber movido filas.
        marcar_(datos, c.email, tipo === '1h' ? 'recordatorio_1h' : 'recordatorio_24h');
      } catch (err) {
        console.error('No pude escribirle a ' + c.email, err);
      }
    });
  } finally {
    lock.releaseLock();
  }
}

function marcar_(datos, email, columna) {
  var correos = datos.hoja.getRange(2, datos.mapa.email + 1, datos.hoja.getLastRow() - 1, 1).getValues();
  for (var i = correos.length - 1; i >= 0; i--) {
    if (String(correos[i][0]).replace(/^'/, '').trim().toLowerCase() === email) {
      datos.hoja.getRange(i + 2, datos.mapa[columna] + 1).setValue(new Date());
      return;
    }
  }
}

function enviar_(c, asunto, html) {
  MailApp.sendEmail({ to: c.email, name: REC.remitente, subject: asunto, htmlBody: html });
}

function nombre_(c) { return esc_(String(c.nombre || '').split(' ')[0] || 'hola'); }

function confirmacion_(c, cambio) {
  return '<p>Hola ' + nombre_(c) + ',</p>' +
    (cambio
      ? '<p>Tu conversación con el equipo de Luciano Musella cambió de hora. Ahora es el <b>' + esc_(c.cita) + ' (hora Colombia)</b>.</p>'
      : '<p>Tu conversación de ' + REC.duracionMin + ' minutos con el equipo de Luciano Musella quedó agendada para el <b>' + esc_(c.cita) + ' (hora Colombia)</b>.</p>') +
    '<p>Entra a la llamada desde este link: <a href="' + esc_(c.meet) + '">' + esc_(c.meet) + '</a><br>' +
    'También te llegó la invitación de Google Calendar para que la guardes.</p>' +
    (cambio ? '' : '<p>Mientras tanto, únete a la comunidad: <a href="' + REC.whatsappComunidad + '">grupo de WhatsApp</a>.</p>') +
    '<p>Nos vemos pronto.</p>';
}

function recordatorio_(c) {
  return '<p>Hola ' + nombre_(c) + ', te recordamos tu llamada del <b>' + esc_(c.cita) +
    ' (hora Colombia)</b>.</p><p>Entra aquí: <a href="' + esc_(c.meet) + '">' + esc_(c.meet) + '</a></p>';
}

function esc_(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]; });
}

/** Prueba manual: manda la confirmación y el recordatorio de ejemplo a la cuenta que lo ejecuta. */
function probar() {
  var yo = Session.getEffectiveUser().getEmail();
  var c = { email: yo, nombre: 'Prueba', cita: '01/12/2026 15:00', meet: 'https://meet.google.com/abc-defg-hij' };
  enviar_(c, '[Prueba] Tu llamada quedó agendada', confirmacion_(c, false));
  enviar_(c, '[Prueba] En 1 hora: tu llamada con el equipo de Luciano Musella', recordatorio_(c));
  return { enviado_a: yo };
}
