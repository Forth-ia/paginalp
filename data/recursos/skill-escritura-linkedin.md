# Guía: crea tu skill de escritura para LinkedIn

## Qué vas a lograr

Al terminar esta guía vas a tener un skill de Claude que escribe posts de LinkedIn con tu voz, no con voz de ChatGPT. Es el mismo sistema que uso yo: Claude lee tus posts reales, te propone 3 ángulos, tú eliges uno y te entrega 2 versiones.

**Tiempo estimado:** 45 minutos la primera vez.

**Lo que necesitas:**

- Una cuenta de Claude con Skills habilitados.
- Entre 30 y 50 posts tuyos que hayan salido bien (si no tienes tantos, con 15 funciona).
- Acceso a este documento para copiar la plantilla del final.

## Paso 1: junta tus posts reales

Los posts reales son la fuente de verdad del skill. Las reglas de estilo ayudan, pero Claude aprende más de 40 posts tuyos que de 40 reglas.

1. Abre tu perfil de LinkedIn y copia tus últimos 30 a 50 posts.
2. Pega todo en un solo archivo de texto y sepáralos con una línea `---`.
3. Quédate con los que sonaron más a ti, no solo con los que tuvieron más likes.
4. Guarda el archivo como `linkedin-posts-ultimos-50.md`.

Si escribes desde cero y no tienes posts, usa transcripciones de tus videos o mensajes de voz. Lo importante es que sea lenguaje tuyo.

## Paso 2: saca tu análisis de estilo

En un chat nuevo de Claude, adjunta el archivo del paso 1 y pega este prompt. El resultado es tu archivo `universal-writing-style.md`.

```
Analiza los posts que te adjunto y escribe un análisis completo de mi estilo de escritura.

Cubre estos puntos, con ejemplos textuales de mis posts:
1. Voz y tono (a quién suena: fundador, profesor, amigo...).
2. Cómo empiezo los posts (tipos de hooks que más uso).
3. Estructura típica de principio a fin.
4. Largo de párrafos y ritmo de las frases.
5. Palabras y expresiones que repito.
6. Cómo explico ideas complejas (ejemplos, analogías, números).
7. Cómo cierro (preguntas, CTA, reflexiones).
8. Qué NUNCA haría: frases y formatos que no suenan a mí.

No inventes nada: usa solo lo que veas en los posts. Entrégalo como un documento en Markdown.
```

Léelo completo. Si algo no suena a ti, corrígelo antes de guardarlo. Este archivo es el que más pesa en la calidad final.

## Paso 3: arma tu SKILL.md

El skill es un solo archivo llamado `SKILL.md` más una carpeta `references/` con los dos archivos que ya creaste. La plantilla completa está al final de esta guía; estas son las partes que debes personalizar.

| Parte del skill | Para qué sirve | Qué cambias tú |
| --- | --- | --- |
| Descripción (frontmatter) | Le dice a Claude cuándo activarse | Tu nombre y las frases exactas con las que pedirás un post |
| Archivos de referencia | Tus posts y tu análisis de estilo | Nada: solo asegúrate de que los nombres coincidan |
| Workflow de 2 fases | Primero 3 ángulos, luego 2 posts | Opcional: cambia el número de ángulos o versiones |
| Voz | Cómo suenas tú | Quién eres, a quién le hablas, palabras que usas |
| Qué evitar | Frases que no son tuyas | Tu lista de muletillas de IA que odias |
| Límite de longitud | Largo máximo del post | Tu largo ideal (yo uso 200 palabras) |

**La regla que más importa:** el skill nunca escribe el post de entrada. Primero propone ángulos y espera tu elección. Eso evita el post genérico de primera respuesta.

## Paso 4: súbelo a Claude

1. Crea una carpeta con el nombre de tu skill, por ejemplo `tunombre-linkedin-writing`.
2. Dentro pon `SKILL.md` y una subcarpeta `references/` con `universal-writing-style.md` y `linkedin-posts-ultimos-50.md`.
3. Comprime la carpeta en un `.zip`.
4. En la sección de Skills de los ajustes de Claude, sube el `.zip` y actívalo.

Si no tienes cómo crear los archivos, pega la plantilla en un chat y pídele a Claude: "Convierte esto en un skill con mis dos archivos de referencia y dame el .zip".

## Paso 5: úsalo

El flujo siempre es el mismo, en dos mensajes.

1. **Mensaje 1:** pídele el post con tu frase de activación y dale el contexto. Ejemplo: "Escribe un post para LinkedIn. Esta semana automaticé la facturación de un cliente y pasó de 6 horas a 20 minutos".
2. Claude responde con 3 ángulos distintos (historia personal, problema, contrarian, número, etc.) y pregunta cuál escoges.
3. **Mensaje 2:** respondes con el número, por ejemplo "2" o "el 3 pero más enfocado en ventas".
4. Claude te entrega 2 versiones del post, de máximo 200 palabras cada una.

> 💡 **Tip:** mientras más real el contexto (números, clientes, lo que te pasó), mejor el post. El skill no inventa datos, así que lo que no le des no lo usa.

## Errores comunes y cómo ajustarlo

| Problema | Causa probable | Solución |
| --- | --- | --- |
| El post suena a ChatGPT | Pocos posts de referencia o análisis de estilo flojo | Agrega más posts reales y revisa el análisis del paso 2 |
| Escribe el post sin darte ángulos | La regla del workflow no quedó clara | Refuerza la sección "Nunca saltarse la elección del ángulo" |
| Se activa cuando no debe | Descripción muy amplia | Lista en la descripción lo que NO debe activarlo |
| Se pasa de largo | Falta el límite | Fija un máximo de palabras y pide contar antes de entregar |
| Inventa datos o clientes | No hay regla de no inventar | Mantén la sección "No inventar" tal cual |
| Todos los posts se parecen | Tus 50 posts son del mismo tema | Mezcla temas y formatos en la referencia |

Cada vez que un post salga mal, no lo corrijas solo a mano: dile a Claude qué estuvo mal y pídele que actualice el skill. Así mejora con cada uso.

## Plantilla completa del SKILL.md

Copia todo el bloque en un archivo llamado `SKILL.md`. Reemplaza lo que está entre [CORCHETES] con tus datos.

```
---
name: [tunombre]-linkedin-writing
description: "Escribe posts de LinkedIn en la voz real de [TU NOMBRE], usando como referencia obligatoria sus posts reales y el análisis de su estilo. Activar cuando [TU NOMBRE] pida explícitamente un post de LinkedIn para él/ella, con frases como: 'escribe un post para LinkedIn', 'hazme un post de LinkedIn', 'quiero un post de LinkedIn sobre X'. NO activar para captions de Instagram, tweets, guiones, emails, newsletters, blogs, ni para 'mejora este texto' o 'dame ideas para LinkedIn'."
---

# [TU NOMBRE] LinkedIn Writing Skill

## PROPÓSITO
Escribir posts de LinkedIn imitando fielmente el estilo real de [TU NOMBRE]. Debe replicar su forma de pensar, su ritmo, su estructura, su nivel de informalidad, sus hooks, su storytelling y sus cierres.
Prioridad absoluta: que el resultado parezca algo que [TU NOMBRE] realmente habría escrito.

## 1. TRIGGER
Activar solo si hay un pedido explícito de escribir un post de LinkedIn. Ignorar mayúsculas, tildes y puntuación.
No activar con: 'ayúdame con LinkedIn', 'dame ideas', 'mejora este texto', captions, tweets, guiones, emails, blogs, newsletters.

## 2. ARCHIVOS DE REFERENCIA (consultar SIEMPRE antes de escribir)
- references/universal-writing-style.md: análisis del estilo (voz, tono, estructura, ritmo, recursos).
- references/linkedin-posts-ultimos-50.md: posts reales. Es la fuente principal de verdad.
Si no puedes leer alguno, avisa antes de escribir en vez de improvisar.
Jerarquía: 1) posts reales, 2) análisis de estilo, 3) instrucciones del mensaje actual, 4) criterio general. Si el copywriting típico contradice cómo escribe [TU NOMBRE], gana [TU NOMBRE].

## 3. WORKFLOW OBLIGATORIO (siempre dos fases)

### FASE 1: DEFINIR EL ÁNGULO
1. Analiza el contexto: tema, qué pasó, qué aprendió, qué dato es interesante, qué opinión tiene. No inventes hechos, clientes, métricas ni experiencias.
2. Lee el análisis de estilo.
3. Busca entre 3 y 7 posts reales relacionados con el tema y analiza en silencio cómo empieza, cuánto contexto da, cómo transiciona y cómo cierra. No muestres este análisis.
4. Propón EXACTAMENTE 3 ángulos realmente distintos (no 3 variaciones del mismo hook). Cada uno en 2-3 frases: hook posible, historia central, idea que deja.
   Tipos posibles: historia personal, problema, contrarian, caso cliente, futuro, framework, descubrimiento, números, analogía.
5. Cierra con: 'Cuál escogemos: 1, 2 o 3?'
6. DETENTE. No escribas ningún post. Espera la respuesta.

### FASE 2: ESCRIBIR
Solo después de que el usuario elija un ángulo:
1. Vuelve a los posts reales más parecidos y captura ritmo, estructura, energía, tipo de hook, transición y cierre. No copies frases largas literalmente.
2. Genera EXACTAMENTE 2 versiones del mismo ángulo con ejecución distinta (no cambies solo el hook: varía punto de entrada, orden, ejemplo, intensidad o cierre).

Nunca: Tema -> post. Siempre: Tema -> referencias -> 3 ángulos -> el usuario elige -> 2 posts.

## 4. LÍMITE DE LONGITUD
Máximo absoluto: [200] palabras por post. Ideal: [130-190].

## 5. VOZ
Escribir como [DESCRIBE QUIÉN ERES: ej. un fundador metido en la operación, un profesor práctico, un amigo que cuenta algo].
NO sonar como: periodista, consultor corporativo, copywriter genérico, profesor universitario, ChatGPT, gurú motivacional.
Principio central: '[Esto lo vi / me pasó / lo probé / lo construimos y se los quiero mostrar]'.
Expresiones frecuentes de [TU NOMBRE] (usar solo cuando encajen): [LISTA 8-12 EXPRESIONES TUYAS DE TUS POSTS: 'Me puse a...', 'Acabo de...', 'Entonces...']

## 6. HOOKS
Las primeras 1-3 líneas deben generar curiosidad, dolor, sorpresa, tensión, contradicción, resultado, identificación o ambición.
Tipos: descubrimiento, afirmación fuerte, pregunta, caso concreto, número, personal.
Intensidad solo cuando corresponda.

## 7. ESTRUCTURA Y FORMATO
Hook -> contexto -> problema -> ejemplo/historia -> solución o descubrimiento -> aprendizaje -> cierre. Sin títulos visibles: debe sentirse como una conversación.
Párrafos de 1 frase, máximo 2-3. Mucho espacio en blanco. Una idea por párrafo. Alterna frases largas y cortas.

## 8. CONTENIDO
- Primero la escena o el caso, después la moraleja.
- Toda idea abstracta se aterriza con una situación real.
- Si el tema es técnico: primero la persona, lo que hacía manual y lo que le costaba, y después la tecnología.
- Usa números solo si son reales.
- Usa contraste (antes/ahora, manual/automático) y evita abusar de 'No se trata de X, se trata de Y'.
- Muestra autoridad con experiencia ('con clientes...', 'probamos...'), no declarándola.

## 9. CTA
No pongas CTA comercial automático. El cierre debe ser consecuencia natural: pregunta, conversación, acción, DM, reflexión o remate.

## 10. QUÉ EVITAR
Prohibido sonar así: 'En el dinámico panorama actual...', 'La inteligencia artificial está revolucionando...', 'En conclusión...', 'Es fundamental comprender...', 'Sin lugar a dudas...', '¿Estás listo para transformar tu negocio?'.
Tampoco: 'Te cuento por qué', 'Guarda este post', 'Sígueme para más', 'Plot twist', 'Hot take'.
[AGREGA AQUÍ LAS FRASES QUE ODIAS Y NO SUENAN A TI]
Emojis: [NO usar, salvo que los pida / usar así: ...].

## 11. NO INVENTAR
Nunca inventes clientes, conversaciones, resultados, números, productos ni opiniones. Si falta contexto, trabaja solo con lo que te dieron. Si el post depende de noticias o datos actuales, verifícalos antes de escribir.

## 12. CONTROL DE CALIDAD (revisar en silencio antes de entregar)
Voz: ¿suena hablado o escrito por una agencia? Hook: ¿las 2 primeras líneas dan ganas de seguir? Concreción: ¿hay ejemplos? Ritmo: ¿párrafos cortos? Longitud: ¿dentro del límite? CTA: ¿tiene sentido o es de relleno?

## 13. OUTPUT EXACTO
Fase 1: solo los 3 ángulos numerados + 'Cuál escogemos: 1, 2 o 3?'. Nada más.
Fase 2: '## Versión 1' y '## Versión 2' con el post completo. Nada más, salvo que el usuario pida análisis.

## 14. OBJETIVO FINAL
El lector debe sentir: '[TU NOMBRE] acaba de vivir algo y me lo está contando', no 'una IA imitó su estilo'. La naturalidad está por encima de la perfección.
```

Con esto ya tienes tu propio sistema. Pruébalo con un post real esta semana y ajusta lo que no suene a ti.
