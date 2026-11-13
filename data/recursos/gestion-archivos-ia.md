# Guía de gestión de archivos con AI: deja que la AI organice tus archivos

Todos los días, mi carpeta de entrada se llena de archivos que quiero conservar (informes, hojas de cálculo, capturas de pantalla, recibos). En lugar de organizarlos manualmente, mi AI lee cada archivo, le asigna un nombre descriptivo y lo mueve a la carpeta correspondiente. Todos los días, sin falta.

Ahora, si esto suena demasiado bueno para ser verdad, hay algo que debes saber: primero necesitas dedicar 15 minutos a crear un manual de reglas que le enseñe a tu AI cómo organizar tus archivos según TUS preferencias. ¿Y lo mejor? Funciona con ChatGPT, Claude y Gemini, y con las principales plataformas de almacenamiento de archivos.

## El problema de la gestión de archivos

Imagina que tu médico te envía un informe de salud por correo electrónico y el PDF termina en tu carpeta de Descargas. Sabes que deberías ponerle un nombre como «Informe Anual de Salud 2035» y guardarlo en la ruta Salud > Recursos > Informes Anuales de Salud.

Pero hacerlo implica varios pasos, así que te dices que lo organizarás después. Y ahí se queda, olvidado.

Un nuevo informe médico termina en Descargas porque sigues posponiendo la tarea de cambiarle el nombre y guardarlo en la carpeta de Salud.

El problema no es que no sepamos que debemos organizar nuestros archivos. Todos tenemos una idea más o menos clara de cómo queremos hacerlo. El verdadero problema es tener que realizar ese trabajo repetitivo cada vez que llega un archivo nuevo.

¿No sería genial poder establecer las reglas una sola vez y dejar que la AI haga el trabajo pesado de cambiar los nombres y guardar cada archivo en su lugar?

## Tu manual de reglas para la gestión de archivos con AI

Tu manual de reglas necesita tres elementos esenciales:

### #1. Estructura de organización

La estructura de organización le indica a la AI dónde pertenece cada archivo y por qué.

La idea es comenzar con un Área, es decir, una parte de tu vida o trabajo que está en constante funcionamiento, como Salud, y crear tres subcarpetas:

- **Recursos (Resources):** contiene material al que volverás constantemente, como informes médicos anuales.
- **Proyectos (Projects):** contiene trabajos activos con un objetivo y una fecha de finalización, como planear una cirugía.
- **Archivo (Archive):** contiene proyectos finalizados o documentos desactualizados, como pólizas de seguros de años anteriores.

Las áreas de trabajo siguen exactamente la misma estructura. Por ejemplo, la carpeta Recursos de un área de Marketing de Producto podría contener tu manual de identidad de marca (Brand Kit).

### #2. Convenciones para nombrar archivos

Utiliza un patrón de nombres consistente, basado en los detalles que probablemente buscarás más adelante.

Por ejemplo:

- **Documentos independientes:** utiliza nombres cortos y descriptivos, como «Buenas prácticas para asuntos de correo electrónico», para que sepas qué contiene el archivo sin tener que abrirlo.
- **Carpetas de proyectos:** coloca primero el año y el trimestre, como «30Q3 Viaje a Seattle», para identificar cuándo comenzó el proyecto y de qué se trata.
- **Recibos y facturas:** incluye la fecha completa, por ejemplo, «helpscout-factura-2030-06-09.pdf», para que puedas encontrar exactamente el documento que necesitas.

### #3. Flujo de organización

El flujo de organización le indica a la AI cuándo debe pedirte una aclaración, por ejemplo, cuando encuentra algo que no está contemplado en el manual de reglas.

También establece cómo debe guardar tus preferencias para saber qué hacer la próxima vez.

> 💡 La estructura de organización determina en qué carpeta guardar cada archivo, las convenciones de nombres establecen cómo llamarlo y el flujo de organización le indica a la AI cuándo debe preguntarte si tiene dudas y cómo guardar tus respuestas.

## Gestión de archivos con AI: un ejemplo práctico

Para configurar este sistema:

1. Crea una carpeta vacía en tu computador (yo llamo a la mía «JS Root Folder») con seis subcarpetas: «00 Inbox», «01 Reference», «Personal Finances», «Business Finances», «Health» y «Travel».
2. Descarga el manual inicial de gestión de archivos (Starter File Management Rulebook) en formato Markdown (Archivo > Descargar > Markdown) y muévelo a la carpeta «01 Reference». Así, la AI tendrá un manual en texto plano que podrá leer y actualizar.
3. Dale acceso a la carpeta principal (Root Folder) desde la aplicación de escritorio de ChatGPT, Claude o Gemini.
4. Mueve algunos archivos que quieras conservar a la carpeta Inbox y pídele a la AI: «Lee mi manual de reglas en la carpeta 01 Reference y ayúdame a organizar los archivos de la carpeta Inbox».

> 💡 **Algo importante:** esto NO funciona en un chat web convencional, porque la AI necesita acceso directo a los archivos de tu computador.

### Esto fue lo que ocurrió cuando lo probé con cuatro archivos

**1. Primero, la AI propuso un plan.** Enumeró cada archivo con su nuevo nombre y ubicación, sin mover absolutamente nada.

**2. Preguntó sobre aquello que no podía identificar.** No estaba segura de si dos compras eran personales o empresariales, así que le respondí:

```text
Mi tarjeta de crédito personal termina en 8888 y mi tarjeta empresarial termina en 9090. Continúa con los cuatro archivos y recuerda esta regla sobre las tarjetas.
```

**3. Organizó todo y guardó la nueva regla.** Ahora la AI sabe cómo procesar los recibos la próxima vez, SIN necesidad de preguntarme.

La AI pregunta una sola vez si un recibo corresponde a un gasto personal o empresarial, guarda esa regla en tu manual y organiza los siguientes recibos sin volver a preguntarte.

El proceso es exactamente el mismo a medida que tus carpetas crecen: la AI utiliza el manual de reglas, los nombres de tus carpetas y el contenido de cada archivo para determinar dónde debe guardar cada documento nuevo.

> 💡 **Consejo práctico:** también puedes pedirle a la AI que analice tus carpetas y te recomiende nuevas subcarpetas. En mi caso, Claude creó cuatro subcarpetas dentro de mi carpeta Business Records en Google Drive. Después agrupó y movió mis archivos a las carpetas correspondientes.

En pocas palabras, el manual de reglas le proporciona a la AI los principios de organización, mientras que la estructura de carpetas y las preferencias guardadas le indican cómo aplicarlos.

## Organiza tus archivos existentes en la nube con AI

Para configurar esto:

1. Instala Google Drive para escritorio e inicia sesión. Así, tus carpetas de Drive aparecerán en Finder o en el Explorador de archivos de Windows, donde la AI podrá acceder a ellas. Cualquier cambio que realices se sincronizará automáticamente con Google Drive.
2. Esto también funciona con las aplicaciones de Dropbox, OneDrive e iCloud Drive.
3. Manteniendo conectada la carpeta donde está tu manual de reglas, dale acceso a la AI a tu carpeta principal de My Drive (en Claude, simplemente puedes montar varias carpetas en el chat).

No necesitas habilitar la disponibilidad sin conexión de Google Drive, porque la AI solo necesita consultar los nombres de las carpetas y los archivos.

### Antes de mover cualquier cosa, pídele a la AI que genere dos diagnósticos

- **Estado actual (Current State):** cómo están organizados tus archivos en este momento.
- **Estado futuro (Future State):** cómo podrían organizarse tus archivos aplicando el manual de reglas.

### Cuando estés satisfecho con la propuesta, pídele a la AI que te guíe paso a paso

- Comienza por las carpetas de las áreas que utilizas con mayor frecuencia.
- Siempre que sea posible, mueve las carpetas existentes completas.
- Por ahora, ignora los cambios de nombres de archivos para evitar convertir esto en un proyecto enorme de reorganización.

Podrías dejar que la AI realice todos los cambios, pero recomiendo que hagas esta primera reorganización tú mismo, siguiendo las indicaciones de la AI. Así te familiarizas con la nueva ubicación de tus archivos.

> 💡 **Consejo práctico:** si quieres empezar desde cero, mueve todos tus archivos y carpetas desorganizados a una carpeta llamada «Legacy» en el directorio principal. Después podrás construir tu nueva estructura desde una carpeta raíz vacía e ir recuperando gradualmente los archivos que necesites.

## Automatiza la gestión de archivos con una tarea programada

Una vez que tengas tus archivos organizados, puedes crear una tarea programada diaria para mantener todo en orden.

Para configurarla:

1. Crea una carpeta llamada «00 Inbox» en el directorio principal de My Drive.
2. Agrégala a Favoritos en Finder o a Acceso rápido en Windows para que puedas encontrarla fácilmente.
3. Coloca algunos archivos que realmente quieras conservar en esa carpeta y pídele a la AI que los organice utilizando tu manual de reglas.
4. Dale retroalimentación hasta que los nombres y las ubicaciones sean exactamente como los quieres.
5. En esa misma conversación, pídele a la AI, en lenguaje natural, que cree una tarea programada diaria para revisar tu carpeta Inbox y proponerte los cambios para que puedas revisarlos y aprobarlos.

Una tarea programada diaria utiliza tu manual de reglas para proponer un nombre y una ubicación para cada archivo de la carpeta Inbox. Después de que apruebes los cambios, organiza los archivos.

> 💡 Asegúrate de que la tarea programada se ejecute dentro de la carpeta del proyecto que contiene tu manual de reglas y que tenga acceso a tu carpeta de Google Drive. Así podrá leer tus instrucciones y encontrar tus archivos. Durante los primeros días probablemente tendrás que darle más retroalimentación, pero después de dos semanas, los resultados deberían alcanzar aproximadamente un 95 % de precisión, con una intervención mínima de tu parte.

## Prompts

Utiliza estos prompts en orden. Reemplaza `JS Root Folder`, `01 Reference`, `00 Inbox`, `Google Drive` y `9 a.m.` por los nombres de tus propias carpetas, tu plataforma de almacenamiento y la hora a la que prefieres que se ejecute la tarea.

Mantén la misma conversación cuando un prompt posterior dependa de decisiones que ya hayas aprobado anteriormente.

### 1. Organiza los archivos de tu carpeta Inbox inicial

Agrega algunos archivos a `00 Inbox` y utiliza este prompt para obtener una propuesta completa antes de que se mueva cualquier archivo.

```text
Lee mi manual de reglas en la carpeta 01 Reference y ayúdame a organizar los archivos de la carpeta 00 Inbox.
```

Después de revisar la propuesta, responde con cualquier contexto que falte, aprueba los archivos que quieres modificar e indícale a la AI qué preferencias debe recordar.

```text
Cambia [archivo o regla] a [nombre, ubicación o preferencia correcta]. Continúa con los archivos aprobados y recuerda esta preferencia para la próxima vez.
```

### 2. Crear un mapa del estado actual y del estado futuro

Utiliza este prompt antes de reorganizar los archivos que ya tienes en la nube. La AI leerá los nombres de las carpetas y los archivos, identificará la estructura actual y propondrá una nueva organización sin modificar absolutamente nada.

```text
Lee mi manual de gestión de archivos en 01 Reference. Después, revisa los nombres de los archivos y carpetas de mi Google Drive, sin abrir documentos ni modificar nada.

Entrégame cuatro secciones, en este orden:

1. Estado actual (Current State): Un árbol de carpetas fácil de leer, con el número de archivos, incluyendo las subcarpetas.

2. Problemas por considerar (Issues to Consider): Problemas estructurales reales, por qué son importantes y posibles excepciones intencionales.

3. Estructura futura propuesta (Proposed Future State): Un árbol comparable que siga mi manual de reglas, conserve las agrupaciones útiles y señale las ubicaciones que no sean seguras.

4. Preguntas para mí (Questions for Me): Preguntas específicas sobre archivos poco claros, estado de los proyectos o preferencias que debas conocer antes de finalizar.

Sé conciso.
```

### 3. Reorganizar un Área paso a paso

Utiliza este prompt en la misma conversación después de responder las preguntas de la AI y aprobar la estructura propuesta. En esta primera etapa, tú mismo realizarás los movimientos para familiarizarte con la nueva ubicación de todos tus archivos.

```text
Guíame paso a paso para reorganizar esta Área según la estructura que acordamos. Hazlo una acción a la vez. Mantén juntas las carpetas existentes que sigan siendo útiles y, por ahora, deja los nombres de los archivos sin cambios. Yo mismo realizaré los movimientos.
```

### 4. Probar un grupo de archivos en tu Inbox de la nube

Una vez que hayas organizado tus carpetas existentes, prueba manualmente con algunos archivos reales antes de configurar la tarea diaria.

```text
Lee la versión más reciente de mi manual de gestión de archivos en 01 Reference, dentro de JS Root Folder, y propón cómo nombrar y dónde guardar los archivos de 00 Inbox, dentro de la carpeta My Drive de mi Google Drive.

Espera mi aprobación antes de realizar cualquier cambio.
```

### 5. Crear una tarea programada diaria en ChatGPT Work

Utiliza este prompt en la misma conversación, después de comprobar que la prueba manual con los archivos de tu Inbox en la nube está dando nombres y ubicaciones confiables.

```text
Crea una tarea programada diaria en esta conversación a las 9 a. m., según mi hora local.

En cada ejecución, lee la versión más reciente de mi manual de gestión de archivos en 01 Reference, dentro de JS Root Folder. Después, revisa los archivos de 00 Inbox, dentro de la carpeta My Drive de mi Google Drive.

Sigue las instrucciones del manual para proponer nombres y ubicaciones para cada archivo.

Guarda las rutas completas de ambas carpetas en las instrucciones de la tarea.

Entrégame la propuesta y espera mi aprobación antes de cambiar los nombres o mover cualquier archivo de ese grupo.

Si la carpeta Inbox está vacía, responde: «No hay archivos para organizar».

Si no puedes acceder al manual de reglas, a la carpeta Inbox o a algún archivo, indícame qué necesitas para continuar.
```
