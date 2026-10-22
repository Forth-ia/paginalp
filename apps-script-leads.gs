/**
 * Luciano Musella — Recolector de Leads → Google Sheets
 * --------------------------------------------------------
 * Este script recibe los datos del formulario de la página web
 * y los agrega como una fila nueva en tu Google Sheet, ya con
 * un diseño limpio y profesional.
 *
 * Cómo usarlo: ver la guía paso a paso en GUIA-GOOGLE-SHEETS.md
 *
 * TIP: para embellecer una hoja que ya tiene datos, ejecuta una
 * vez la función  embellecerHoja  desde el editor (botón Ejecutar).
 */

var NOMBRE_HOJA = 'Leads'; // Primera pestaña del archivo compartido

function doPost(e) {
  try {
    // 1. Leer los datos que envía el popup.
    var datos = {};
    if (e && e.postData && e.postData.contents) {
      datos = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      datos = e.parameter; // respaldo por si llegan como parámetros
    }

    // 2. Abrir (o crear) la hoja "Leads".
    var libro = SpreadsheetApp.getActiveSpreadsheet();
    var hoja = libro.getSheetByName(NOMBRE_HOJA);
    if (!hoja) {
      hoja = libro.insertSheet(NOMBRE_HOJA);
    }

    // 3. Si la hoja está vacía, escribir encabezados y darle estilo.
    if (hoja.getLastRow() === 0) {
      hoja.appendRow(['Fecha y hora', 'Nombre', 'Email', 'Teléfono', 'Fuente']);
      aplicarEstilo_(hoja);
    }

    // 4. Agregar la fila nueva. La fecha se asigna aquí para que sea fiable.
    hoja.appendRow([
      new Date(),
      datos.nombre   || '',
      datos.email    || '',
      datos.telefono || '',
      datos.fuente   || 'Página Web'
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Permite abrir la URL en el navegador para comprobar que está activa.
function doGet() {
  return ContentService
    .createTextOutput('El recolector de leads de lucianomusella.com está activo ✅')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Embellece la hoja "Leads" (ejecútala una vez desde el editor para
 * dejar bonita una hoja que ya tiene filas).
 */
function embellecerHoja() {
  var libro = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = libro.getSheetByName(NOMBRE_HOJA);
  if (!hoja) {
    hoja = libro.insertSheet(NOMBRE_HOJA);
  }
  if (hoja.getLastRow() === 0) {
    hoja.appendRow(['Fecha y hora', 'Nombre', 'Email', 'Teléfono', 'Fuente']);
  }
  aplicarEstilo_(hoja);
}

/**
 * Aplica todo el formato visual a la hoja (uso interno).
 * Colores de la marca AI Founders LATAM (coral).
 */
function aplicarEstilo_(hoja) {
  var CORAL  = '#e07a54';
  var CRUDO  = '#fdf3ee'; // coral muy claro para filas alternas
  var BLANCO = '#ffffff';
  var TEXTO  = '#374151';

  // --- Encabezado (fila 1) ---
  var head = hoja.getRange(1, 1, 1, 5);
  head.setBackground(CORAL)
      .setFontColor(BLANCO)
      .setFontWeight('bold')
      .setFontSize(11)
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle');
  hoja.setRowHeight(1, 36);
  hoja.setFrozenRows(1); // la fila de títulos queda fija al hacer scroll

  // --- Ancho de columnas ---
  hoja.setColumnWidth(1, 165); // Fecha y hora
  hoja.setColumnWidth(2, 190); // Nombre
  hoja.setColumnWidth(3, 240); // Email
  hoja.setColumnWidth(4, 160); // Teléfono
  hoja.setColumnWidth(5, 150); // Fuente

  // --- Cuerpo: fuente, color y alineación ---
  var cuerpo = hoja.getRange('A2:E');
  cuerpo.setFontFamily('Arial')
        .setFontSize(10)
        .setFontColor(TEXTO)
        .setVerticalAlignment('middle');
  hoja.getRange('A2:A').setNumberFormat('dd/mm/yyyy  hh:mm')
                       .setHorizontalAlignment('center'); // Fecha
  hoja.getRange('D2:E').setHorizontalAlignment('center');  // Teléfono y Fuente

  // --- Filas alternadas (banding) en todas las columnas ---
  var bandings = hoja.getBandings();
  for (var i = 0; i < bandings.length; i++) {
    bandings[i].remove(); // limpiar bandas previas para no duplicar
  }
  var rango = hoja.getRange(1, 1, hoja.getMaxRows(), 5);
  var banding = rango.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, true, false);
  banding.setHeaderRowColor(CORAL)
         .setFirstRowColor(BLANCO)
         .setSecondRowColor(CRUDO);
}
