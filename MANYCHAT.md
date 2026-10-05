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
repetir el POST que guarda el lead. La función dispone de 90 segundos y sus
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

## SkillSpector

Enlace para ManyChat: https://www.lucianomusella.com/acceso/skillspector/

Muestra la guía de fondo y exige nombre, email y celular. Solo abre la guía
cuando el recolector confirma el guardado, con fuente `ManyChat · SkillSpector`.
El catálogo conserva el acceso público `/recursos/skillspector/`.

## 63 agentes de AI de ECC

Enlace para ManyChat: https://www.lucianomusella.com/acceso/everything-claude-code/

Muestra la guía de fondo y exige nombre, email y celular. Solo abre la guía
cuando el recolector confirma el guardado, con fuente `ManyChat · 63 agentes de AI · ECC`.
El catálogo conserva el acceso público `/recursos/everything-claude-code/`.

## Sales Coach Assistant

Enlace para el botón o mensaje de ManyChat:

https://www.lucianomusella.com/acceso/sales-coach-assistant/

Muestra la guía al fondo con el formulario existente obligatorio de nombre,
email y celular. No se puede cerrar ni omitir por un registro anterior.
Solo abre la guía después de confirmar el guardado en la hoja existente,
con la fuente `ManyChat · Sales Coach Assistant`. Si el guardado falla,
conserva el formulario y permite reintentar.

El catálogo y los visitantes normales mantienen el enlace público sin bloqueo:

https://www.lucianomusella.com/recursos/sales-coach-assistant/

Utiliza el enlace `/acceso/` en ManyChat: no se detecta el origen automáticamente.
El recurso público sigue abierto para quien conozca o reciba su enlace.

## Convierte Claude en una máquina de leads

Enlace para el botón de ManyChat:

https://www.lucianomusella.com/acceso/claude-maquina-de-leads/

El formulario existente exige nombre, correo y celular con la guía visible al
fondo. No se puede cerrar y un registro anterior no permite saltarlo. Solo abre
la guía tras confirmar el guardado en la hoja existente, con la fuente
`ManyChat · Convierte Claude en una máquina de leads`. Si falla, permite reintentar.

El enlace público sigue abierto y es el que utiliza el catálogo:

https://www.lucianomusella.com/recursos/claude-maquina-de-leads/

La distinción depende del enlace enviado, no del navegador ni del referrer.
Quien tenga el enlace público puede leer la guía directamente.

### Diagnóstico de confirmación de Google

El recolector espera hasta 60 segundos para guardar. Tras la redirección de
Google, consulta la confirmación hasta tres veces, con 8 segundos por intento,
pausas de 1 y 2 segundos y sin caché. No repite automáticamente el POST.
El límite de Vercel es 90 segundos. Los errores registran fase y duración,
sin datos de contacto. No se desbloquea la guía si Google no confirma `ok: true`.
