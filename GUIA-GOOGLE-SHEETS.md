# Guía: conectar el formulario con Google Sheets

Objetivo: que cada vez que alguien llene el formulario de la web, sus datos
(Nombre, Email, Teléfono) aparezcan automáticamente en una hoja de Google.

Tiempo aproximado: 10 minutos. No necesitas saber programar.

---

## Paso 1 — Crear la hoja de cálculo

1. Abre el archivo de Google Sheets compartido para esta web.
2. Conserva la primera pestaña con el nombre **"Leads"**.
3. Ya tiene las columnas correctas: Fecha y hora, Nombre, Email, Teléfono y Fuente.

## Paso 2 — Abrir el editor de Apps Script

1. Dentro de la hoja, ve al menú **Extensiones → Apps Script**.
2. Se abre una pestaña nueva con un editor de código.
3. Borra todo lo que aparezca por defecto (normalmente `function myFunction() {}`).

## Paso 3 — Pegar el código

1. Abre el archivo **`apps-script-leads.gs`** (está en esta misma carpeta).
2. Copia TODO su contenido y pégalo en el editor de Apps Script.
3. Haz clic en el icono de **guardar** (💾).

## Paso 4 — Publicar (Deploy) el script

1. Arriba a la derecha haz clic en **Implementar → Nueva implementación**.
2. En el icono de engranaje ⚙ ("Seleccionar tipo") elige **Aplicación web**.
3. Configura así:
   - **Descripción:** Recolector de leads (lo que quieras)
   - **Ejecutar como:** Yo (tu cuenta)
   - **Quién tiene acceso:** **Cualquier usuario** ← MUY IMPORTANTE
4. Haz clic en **Implementar**.
5. Google pedirá **autorizar permisos**: acepta con tu cuenta.
   (Si aparece "Google no verificó esta app", haz clic en *Configuración avanzada
   → Ir a [nombre del proyecto] (no seguro)* y continúa. Es normal, es tu propio script.)
6. Al terminar te dará una **URL de la aplicación web**. Se ve así:

   ```
   https://script.google.com/macros/s/AKfycb.........../exec
   ```

7. **Copia esa URL.**  ← Es lo único que necesito de ti.

## Paso 5 — Pegar la URL en la página

Pásame la URL y yo la coloco en la página (o, si prefieres hacerlo tú mismo):

1. Abre `assets/js/site.js`.
2. Busca la línea que dice:
   ```js
   var LEADS_ENDPOINT = 'PASTE_YOUR_APPS_SCRIPT_URL_HERE';
   ```
3. Reemplaza `PASTE_YOUR_APPS_SCRIPT_URL_HERE` por tu URL (deja las comillas):
   ```js
   var LEADS_ENDPOINT = 'https://script.google.com/macros/s/AKfycb.../exec';
   ```
4. Guarda el archivo.

## Paso 6 — Probar

1. Abre la web (http://localhost:8000), llena el formulario y envíalo.
2. Vuelve a tu Google Sheet: debería aparecer una fila nueva con los datos.

¡Listo! A partir de ahí la hoja se actualiza sola con cada lead.

---

### Notas
- La hoja se llena en la primera pestaña llamada **"Leads"**.
- Si cambias el código del script más adelante, recuerda hacer
  **Implementar → Gestionar implementaciones → editar → Nueva versión** para
  que los cambios surtan efecto (o la URL seguirá usando la versión vieja).
