/**
 * Leads calificados de lucianomusella.com/aprende → pestaña "Web - Aprende"
 * --------------------------------------------------------------------------
 * Va como archivo aparte dentro del Apps Script del Google Sheets de leads
 * (el mismo de "Forms - Octubre 1 (v2)"). Recibe solo los leads que pasaron
 * el filtro de la página (api/aprende-lead.js) y los escribe en su propia
 * pestaña, sin tocar las pestañas de los formularios instantáneos de Meta.
 *
 * Instalación: pegar como archivo nuevo → Implementar → Nueva implementación
 * → Aplicación web · Ejecutar como: Yo · Acceso: Cualquier usuario.
 */

var WEB_APRENDE_HOJA = 'Web - Aprende';
var WEB_APRENDE_COLUMNAS = [
  ['Fecha y hora', 'fecha'], ['Nombre', 'nombre'], ['Email', 'email'], ['WhatsApp', 'telefono'],
  ['¿Dónde vas a aplicar lo que aprendas de IA?', 'aplica'], ['¿Cuándo quieres empezar?', 'inicio'],
  ['Inversión $500 USD', 'inversion'], ['Principal reto', 'reto'],
  ['utm_source', 'utm_source'], ['utm_medium', 'utm_medium'], ['utm_campaign', 'utm_campaign'],
  ['utm_content', 'utm_content'], ['utm_term', 'utm_term'], ['Fuente', 'fuente']
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var datos = JSON.parse(e.postData.contents);
    lock.waitLock(20000);
    var libro = SpreadsheetApp.getActiveSpreadsheet();
    var hoja = libro.getSheetByName(WEB_APRENDE_HOJA) || libro.insertSheet(WEB_APRENDE_HOJA);
    if (hoja.getLastRow() === 0) {
      hoja.appendRow(WEB_APRENDE_COLUMNAS.map(function (c) { return c[0]; }));
      hoja.getRange(1, 1, 1, WEB_APRENDE_COLUMNAS.length)
        .setBackground('#e07a54').setFontColor('#ffffff').setFontWeight('bold').setWrap(true);
      hoja.setFrozenRows(1);
      hoja.getRange('A2:A').setNumberFormat('dd/mm/yyyy hh:mm');
      hoja.getRange('D2:D').setNumberFormat('@'); // el WhatsApp se guarda como texto
    }
    hoja.appendRow(WEB_APRENDE_COLUMNAS.map(function (c) {
      return c[1] === 'fecha' ? new Date() : String(datos[c[1]] || '');
    }));
    return webAprendeRespuesta_({ ok: true });
  } catch (err) {
    return webAprendeRespuesta_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput('Recolector Web - Aprende activo ✅');
}

function webAprendeRespuesta_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
