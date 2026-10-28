# Cómo convertir cualquier tema en un video explicativo con Claude

Con HyperFrames puedes usar un agente de AI para crear videos con escenas, gráficos, animaciones, subtítulos y narración a partir de una idea o una fuente de información.

En esta guía te explico cómo hacerlo paso a paso.

## 1. Prepara las herramientas

Necesitas:

- **Claude Code:** para que la AI construya el proyecto de video.
- **HyperFrames:** un framework para crear y renderizar videos mediante composiciones web y animaciones.
- **Una fuente de información:** un paper, artículo, investigación, documento o tema que quieras explicar.
- **Una herramienta de voz:** puedes usar ElevenLabs o Google Cloud Text-to-Speech para generar la narración.

Enlaces oficiales:

- Claude: https://claude.ai/
- HyperFrames: https://hyperframes.app/docs/1-startup/2-quickstart
- ElevenLabs: https://elevenlabs.io/docs/overview/capabilities/text-to-speech
- Google Cloud Text-to-Speech: https://docs.cloud.google.com/text-to-speech/docs

## 2. Instala HyperFrames

Abre la terminal de tu computador y ejecuta:

```
npx skills add heygen-com/hyperframes
```

Este comando instala las instrucciones de HyperFrames para que tu agente de programación pueda utilizarlas.

**Importante:** este procedimiento está documentado para agentes como Claude Code, Codex y Cursor. No es lo mismo que abrir un chat normal en Claude web.

Si necesitas instrucciones adicionales, consulta la documentación oficial de HyperFrames antes de continuar.

## 3. Prepara el proyecto

En tu terminal, crea un proyecto nuevo:

```
npx hyperframes init mi-video
```

Después, abre la carpeta del proyecto con Claude Code.

HyperFrames permite que el agente genere las composiciones del video y después las previsualice y renderice.

## 4. Dale a Claude el material que quieres explicar

Puede ser un artículo, un paper científico, un documento o una idea que quieras desarrollar.

Si tienes un documento, guárdalo en la carpeta del proyecto o proporciona su contenido al agente. Si utilizas un enlace, asegúrate de que Claude pueda acceder a él.

No le pidas simplemente que haga un video. Dale instrucciones sobre qué debe explicar, a quién va dirigido y cómo quieres que se vea.

## 5. Copia este prompt

```
Usa la skill de HyperFrames para crear un video explicativo
a partir del siguiente material:

[TEMA, ARTÍCULO, PAPER O DOCUMENTO]

OBJETIVO:
Explicar las ideas más importantes de forma visual, clara
y entretenida, incluso para alguien que no conoce el tema.

ESTRUCTURA:
1. Empieza con una introducción que capte la atención.
2. Explica el problema o la pregunta principal.
3. Desarrolla las ideas en una secuencia lógica.
4. Utiliza gráficos, diagramas, ejemplos y animaciones
   cuando ayuden a comprender el contenido.
5. Termina con las conclusiones más importantes.

ESTILO VISUAL:
- Diseño editorial moderno y limpio.
- Tipografía legible y jerarquía visual clara.
- Animaciones fluidas y transiciones bien ejecutadas.
- Gráficos que expliquen conceptos, no elementos decorativos.
- Evita las diapositivas estáticas y el exceso de texto.

NARRACIÓN:
- Escribe un guion natural en español.
- Sin frases innecesarias ni afirmaciones inventadas.
- Conserva la precisión de la fuente original.
- Sincroniza las escenas con la narración y los subtítulos.

Antes de finalizar, verifica que las escenas se rendericen
correctamente y que el resultado tenga continuidad visual.

Genera el proyecto completo, prepara una previsualización
y exporta el video final en MP4.
```

## 6. Genera la voz

Puedes utilizar ElevenLabs o Google Cloud Text-to-Speech para convertir el guion en audio.

Si quieres que el proceso sea más automático, pídele al agente que integre la generación de voz en el proyecto y sincronice el audio con las escenas.

Ten presente que esto puede requerir configurar una API y sus credenciales. Algunas funciones pueden tener costos adicionales.

## 7. Previsualiza y exporta el video

Desde la carpeta del proyecto, ejecuta:

```
npx hyperframes preview
```

Esto abre una previsualización del video en el navegador.

Cuando estés satisfecho con el resultado, ejecuta:

```
npx hyperframes render --output video-final.mp4
```

Obtendrás el archivo MP4 si el proyecto y sus dependencias están configurados correctamente.

## 8. Revisa el resultado antes de publicarlo

Antes de compartirlo, comprueba:

- Que las afirmaciones coincidan con la fuente.
- Que los gráficos representen correctamente los conceptos.
- Que la narración se escuche bien y esté sincronizada.
- Que los textos sean legibles.
- Que el video no contenga errores visuales ni información inventada.

**La clave:** utiliza Claude para transformar la información en una historia visual, no para llenar una pantalla de texto. Cuanto mejor sea la fuente y más claras las instrucciones, mejor será el resultado.

### Documentación oficial

- Inicio rápido de HyperFrames: https://hyperframes.app/docs/1-startup/2-quickstart
- Guía de HyperFrames para convertir sitios web en videos: https://hyperframes.app/docs/3-guides/1-website-to-video
- Documentación de ElevenLabs: https://elevenlabs.io/docs/overview/capabilities/text-to-speech
- Documentación de Google Cloud Text-to-Speech: https://docs.cloud.google.com/text-to-speech/docs
