# Cómo crear presentaciones increíbles con Claude + Lovable

Copia y pega. Cada bloque de código es un prompt listo para usar. Cambia solo lo que está entre [corchetes].

> 💡 **Resultado:** pegas el brief de un cliente en Claude y salen la presentación y el presupuesto, con la misma marca y los mismos números.

## Paso 1. Mide cuántas horas se van

Antes de automatizar, ten el número. Pregúntale esto a quien arma propuestas en tu empresa:

```text
1. ¿Cuántas propuestas, presentaciones y presupuestos armaste las últimas 4 semanas?
2. ¿Cuánto tardó cada uno, de principio a fin?
3. ¿Qué partes copiaste de una propuesta anterior?
4. ¿Quién la revisó y cuánto tardó la revisión?
```

> 💡 Suma: horas por semana x costo por hora de esa persona. Ese es tu punto de partida y lo que vas a recuperar.

## Paso 2. Documenta tu empresa una sola vez

Necesitas tres cosas juntas en un solo documento:

- **Tu marca:** colores, tipografías, tono de voz, cómo se ve una presentación tuya.
- **Tus precios:** servicios, tarifas, paquetes, descuentos permitidos, condiciones de pago.
- **Las propuestas que sí cerraron:** de 3 a 5 reales, con su presupuesto.

No lo escribas a mano. Abre un chat nuevo en Claude, adjunta tus propuestas ganadoras, tu lista de precios y tu material de marca, y pega esto:

```text
Vas a ayudarme a crear el "Manual de propuestas" de mi empresa, [nombre de la empresa], que vende [qué vendes] a [tipo de cliente].

Te adjunto propuestas que sí cerraron, mi lista de precios y mi material de marca.

Primero analiza todo y dime qué patrones ves: cómo estructuro las propuestas, qué argumentos repito, cómo presento los precios y qué tono uso.

Después hazme las preguntas que te falten, una por una (máximo 10), para completar lo que no puedas deducir de los archivos.

Al final entrégame el Manual de propuestas con estas secciones:
1. Quiénes somos y qué vendemos (3 líneas)
2. Marca: colores, tipografías y tono de voz
3. Estructura estándar de una presentación (diapositiva por diapositiva)
4. Catálogo de servicios con precios, paquetes y reglas de descuento
5. Estructura estándar de un presupuesto (conceptos, cantidades, condiciones de pago, vigencia)
6. Argumentos y frases que funcionaron en las propuestas ganadoras
7. Lo que NUNCA debe aparecer en una propuesta nuestra
```

Revisa el resultado, corrige lo que esté mal y guárdalo. Ese es tu documento maestro.

## Paso 3. Crea un proyecto en Claude con tu manual

1. Crea un proyecto nuevo en Claude y llámalo "Propuestas".
2. Sube el Manual de propuestas y tus 3 a 5 propuestas ganadoras como archivos del proyecto.
3. En las instrucciones del proyecto pega esto:

```text
Eres el equipo de propuestas de [nombre de la empresa].

Cada vez que te pegue el brief de un cliente, produces DOS entregables a la vez, con el mismo diseño y los mismos números:

1. La presentación comercial, siguiendo la estructura del Manual de propuestas.
2. El presupuesto, usando solo los precios, paquetes y reglas de descuento del Manual.

Reglas:
- Usa solo los precios del Manual. Si el brief pide algo que no está en el catálogo, no inventes un precio: márcalo como "POR DEFINIR" y dime por qué.
- Los números de la presentación y del presupuesto deben coincidir exactamente.
- Usa la marca y el tono del Manual.
- Reutiliza los argumentos de las propuestas ganadoras, pero adaptados al cliente. No copies frases de otro cliente.
- Antes de entregar, haz una lista corta de supuestos que hiciste y de dudas que debe resolver una persona.
- Si falta información clave del brief (alcance, plazo, presupuesto del cliente), pregúntame antes de armar nada. Máximo 3 preguntas.
```

## Paso 4. Pega el brief y recibe todo

Cada vez que entre un cliente, abre un chat dentro del proyecto "Propuestas" y pega:

```text
Brief del cliente:

[pega aquí el brief tal como llegó: correo, mensaje, notas de la llamada]

Cliente: [nombre]
Contacto: [nombre y cargo]
Fecha límite para enviar: [fecha]

Arma la presentación y el presupuesto.
```

Claude te devuelve la presentación y el presupuesto, más la lista de supuestos y dudas.

> 💡 Si quieres la presentación como archivo, agrégale al final: "Entrégame la presentación como archivo de PowerPoint y el presupuesto como hoja de cálculo."

## Paso 5. Conecta tus herramientas

Para no subir archivos a mano, conecta Claude a donde ya vive tu información (por ejemplo, tu carpeta de documentos o tu CRM) desde la sección de conectores de Claude. Así puede leer propuestas anteriores y guardar el resultado en el mismo lugar.

Prompt para probarlo, una vez conectado:

```text
Busca en [nombre de la herramienta] las 3 últimas propuestas que enviamos a clientes de [sector]. Dime qué tienen en común y úsalas como referencia para esta propuesta.
```

## Paso 6. Que siga trabajando aunque apagues el computador

Si tu plan de Claude permite tareas programadas, puedes pedirle que revise cada mañana los briefs nuevos y deje las propuestas en borrador. Pega esto en un chat del proyecto:

```text
Quiero programar una tarea: todos los días laborales a las [hora], revisa [dónde llegan los briefs: carpeta, correo, tablero] y, por cada brief nuevo, prepara la presentación y el presupuesto como borrador y déjalos en [dónde guardarlos]. No envíes nada a ningún cliente.
```

> 💡 **Importante:** que deje borradores y nunca envíe solo. La revisión humana sigue siendo obligatoria.

## Paso 7. Conviértelo en una app con Lovable (el prompt lo escribe Claude)

Si no quieres que tu equipo abra Claude cada vez, haz una pantalla simple: pegan el brief, tocan un botón y salen la presentación y el presupuesto. Lovable construye la app. Claude escribe el prompt para Lovable, así no empiezas de cero.

### 7.1 Pide a Claude el prompt para Lovable

Abre un chat dentro del proyecto "Propuestas" y pega:

```text
Quiero construir en Lovable una app interna para mi equipo, a partir del Manual de propuestas de este proyecto.

Escríbeme UN solo prompt, listo para pegar en Lovable, que describa la app completa:

1. Qué hace: el usuario pega el brief de un cliente, escribe el nombre del cliente y toca un botón. La app genera la presentación y el presupuesto con el mismo diseño y los mismos números.
2. Pantallas: una para pegar el brief, una para revisar y editar el resultado, una con el historial de propuestas.
3. Marca: usa los colores, tipografías y tono del manual. Inclúyelos en el prompt como valores concretos (códigos de color y nombres de fuentes).
4. Precios: el catálogo de servicios y precios del manual va como datos de la app, no escrito dentro del texto de la IA, para poder cambiarlo sin tocar nada más.
5. Reglas del presupuesto: las del manual (descuentos permitidos, condiciones de pago, vigencia). Si algo no está en el catálogo, la app lo marca "POR DEFINIR" y no inventa un precio.
6. Revisión humana: nada se envía a un cliente desde la app. Solo se descarga o se copia, después de que una persona apruebe.
7. Exportar: la presentación como PDF y el presupuesto como PDF o tabla descargable.
8. Seguridad: la clave de API de la IA se guarda como secreto del proyecto y nunca aparece en el código ni en la pantalla.

Antes de escribirlo, hazme las preguntas que necesites (máximo 5). Entrégamelo en un solo bloque de texto, sin explicaciones alrededor.
```

### 7.2 Pega el resultado en Lovable

Crea un proyecto nuevo en Lovable, pega el prompt que te dio Claude y deja que construya la primera versión.

### 7.3 Prueba con un brief real

Usa el brief de un cliente que ya cerraste y compara con la propuesta que sí enviaste. Si algo está mal, pídele el arreglo a Lovable en una frase. Por ejemplo:

```text
El presupuesto me salió con un descuento del 20% y el máximo permitido es 10%. Corrige la regla para que nunca supere el 10% y marca en rojo cualquier línea que lo intente.
```

### 7.4 Conecta la IA

Para que la app genere el contenido necesita un modelo de IA detrás. Pídele a Lovable que use la integración de IA que tenga disponible, o tu propia clave de API de Claude guardada como secreto. Verifica en Lovable cuál de las dos opciones tienes en tu plan.

### 7.5 Mismo orden de siempre

La app no cambia la regla del Paso 6: genera borradores y una persona revisa antes de enviar.
