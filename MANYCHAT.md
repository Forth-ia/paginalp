# Acceso a recursos desde ManyChat

## Claude for Legal

Enlace para ManyChat:

https://www.lucianomusella.com/acceso/claude-for-legal/

Muestra la guía Legal de fondo con el mismo formulario obligatorio. Los datos
se guardan con la fuente `ManyChat · Claude for Legal` y, después de confirmar
el guardado, abre `/recursos/claude-for-legal/`. El catálogo mantiene ese enlace
público, sin registro obligatorio.

## Claude Productivity

Enlace para el botón o mensaje de ManyChat:

https://www.lucianomusella.com/acceso/claude-productivity/

Esta página utiliza el diseño del formulario de leads y exige nombre, email y
celular. Muestra la guía de fondo, con la navegación y el contenido bloqueados
por un formulario superpuesto que no se puede cerrar. Solo redirige
cuando `/api/resource-lead` recibe `{ "ok": true }` del recolector existente
de Google Sheets. Si falla, conserva el formulario y permite reintentar.
La confirmación redirigida de Google se puede consultar hasta tres veces sin
repetir el POST que guarda el lead. La función dispone de 60 segundos y sus
diagnósticos registran códigos de error, sin nombres, emails ni teléfonos.

Los registros se guardan en la misma hoja, con la fuente
`ManyChat · Claude Productivity`. No hace falta modificar Apps Script.
Los datos se envían por POST; no se agregan a la URL ni al almacenamiento del
navegador. La marca existente `lm_lead_captured` evita el popup opcional tras
el registro, pero no omite este formulario si se vuelve a abrir el enlace.

El catálogo sigue apuntando al enlace público:

https://www.lucianomusella.com/recursos/claude-productivity/

El formulario es obligatorio en el recorrido de ManyChat; no es un control de
acceso privado sobre el recurso público. Quien conozca o reciba el enlace
público puede leerlo directamente. No se verifica la titularidad del email o
celular mediante códigos.

Validación del servidor: `node --test tests/resource-lead.test.cjs`.
