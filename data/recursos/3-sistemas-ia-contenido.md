# Los 3 sistemas de IA que tienes que construir

Construí una audiencia de más de 100.000 seguidores en menos de un año y tengo una empresa de IA con más de 30 clientes. Esta guía es lo que me hubiera gustado que alguien me explicara antes.

La mayoría de la gente usa la IA para hacer tareas sueltas. Lo que funciona es construir sistemas que corran cada semana sin depender de que "se te ocurra algo".

---

## Sistema 1: Producción

**Para qué sirve:** publicar con consistencia sin depender de la inspiración. Nosotros hacemos más de 14 videos a la semana con esto.

**El error común:** subir un video cuando se te ocurre algo y esperar que alguno se haga viral. Así es imposible ser consistente.

**Cómo funciona:** cada parte del video tiene su propio agente de IA con una sola función.

1. **Agente de research (lunes).** Busca temas, ángulos y videos que ya funcionaron en tu nicho y te entrega una lista priorizada.
2. **Agente de hooks.** Solo escribe hooks. No toca nada más del guion.
3. **Agente de lock-in zone.** Solo trabaja la segunda parte del video, el tramo entre el hook y el contenido, donde la gente decide si se queda.
4. **Tú.** Eliges, grabas y das tu criterio.

**Cómo montarlo:**

1. Define las etapas de tu proceso: tema, hook, lock-in, cuerpo, CTA.
2. Crea un agente (un proyecto o chat con instrucciones fijas) por etapa.
3. Dale a cada agente ejemplos de tus mejores videos y las reglas de tu marca.
4. Fija el día de research (lunes) y el de grabación. El ritmo es parte del sistema.

**Prompt base para tu agente de research (cópialo y adáptalo):**

```
Eres mi agente de research de contenido. Mi negocio: [qué vendes y a quién].
Mi audiencia: [quién es, qué problema tiene].

Cada semana te pido 10 ideas de video. Para cada una entrégame:
1. El tema en una frase
2. Por qué le importa a mi audiencia ahora
3. Un ángulo que no sea el obvio
4. Qué recurso podría entregar al final del video

Prioriza temas que conecten con mi oferta. Descarta lo genérico.
```

**Prompt base para tu agente de hooks:**

```
Eres mi agente de hooks. Solo escribes hooks, nada más.

Te daré el tema de un video. Escribe 10 hooks distintos de máximo 2 líneas.
Reglas:
- Que se entienda en menos de 3 segundos
- Que abra una pregunta que el espectador quiera cerrar
- Cero frases genéricas tipo "En este video te voy a contar..."
- Lenguaje de conversación, como lo diría un amigo

Después ordénalos del más fuerte al más débil y explica en una línea por qué.
```

**Prompt base para tu agente de lock-in zone:**

```
Eres mi agente de lock-in zone. Tu única tarea es escribir el tramo que va
justo después del hook.

Te daré el hook y el tema. Escribe 3 versiones del tramo que:
- Confirma la promesa del hook
- Da una razón concreta para quedarse hasta el final
- No revela la respuesta todavía
- Dura entre 10 y 20 segundos hablados
```

---

## Sistema 2: Lectura de data

**Para qué sirve:** dejar de adivinar qué funcionó. Cada semana sabes qué repetir y qué dejar de hacer.

**Qué medimos:**

- **Skip rate:** cuánta gente se va en los primeros segundos. Mide la calidad del hook.
- **Retención:** en qué momento se cae la gente. Mide la calidad del guion.
- **Engagement:** comentarios, guardados, compartidos. Mide si el tema le importó.

**Cómo funciona:** un agente de IA conectado a la API de la plataforma saca estas métricas de todo lo que publicaste y te las presenta de forma visual.

**Cómo montarlo:**

1. Conecta tu agente a la fuente de datos (API de la plataforma, o un export en CSV si apenas empiezas).
2. Pídele un reporte semanal con las métricas de cada pieza.
3. Cada semana, revisa con él los números de todo lo que publicaste.
4. Deja la conclusión por escrito: qué funcionó, qué no y qué cambias la próxima semana.
5. Esa conclusión alimenta al Sistema 1. Así el ciclo se cierra.

**Prompt base para tu reporte semanal:**

```
Aquí están las métricas de mis publicaciones de esta semana: [pega los datos].

Analízalas y respóndeme:
1. Top 3 piezas con mejor desempeño y qué tienen en común (hook, tema, formato)
2. Las 3 con peor desempeño y la hipótesis de por qué fallaron
3. En qué punto se cae la retención en las piezas más débiles
4. Tres cosas concretas que debería repetir la próxima semana
5. Tres cosas que debería dejar de hacer

Sé directo. No me des generalidades, usa los datos.
```

---

## Sistema 3: Atar todo a la métrica del negocio

**Para qué sirve:** que el contenido se mida por lo que le importa al negocio, no por vanidad. Es el sistema más importante de los tres.

**La idea central:** si tienes un negocio y quieres ganar más plata, enfócate en **leads** y **llamadas agendadas**.

Un video con un millón de views que no trae leads no le sirve al negocio. Uno con 20.000 que te llena la agenda, sí.

**Cómo funciona:** un dashboard donde cruzas cada video con los leads que trajo y las llamadas que se agendaron. Sabes exactamente de dónde llega cada lead.

**Cómo montarlo:**

1. **Una palabra clave por video.** Cada video pide comentar una palabra distinta para recibir el recurso. Así sabes qué video generó cada lead.
2. **Registra el origen.** Cada lead que entra queda guardado con el video que lo trajo (una hoja de cálculo sirve para empezar; después puedes usar tu CRM).
3. **Registra las llamadas.** Cuando un lead agenda, queda marcado con su origen.
4. **Cruza todo en un dashboard** con estas columnas por video:
    - Views
    - Leads generados
    - Llamadas agendadas
    - Leads por cada 1.000 views
5. **Decide con eso.** Haz más de lo que llena la agenda, aunque tenga menos views.

**Prompt base para analizar tu dashboard:**

```
Aquí está mi tabla cruzada de contenido contra negocio:
[pega: video, views, leads, llamadas agendadas]

Analízala y dime:
1. Qué videos trajeron más leads por cada 1.000 views
2. Qué videos tienen muchas views pero casi ningún lead
3. Qué temas o formatos se repiten en los que sí traen llamadas
4. Qué debería producir más la próxima semana y qué debería frenar
5. Una hipótesis de por qué los de muchas views no convirtieron

Ordena por impacto en el negocio, no por alcance.
```

---

## Cómo se conectan los tres

El **Sistema 1** produce. El **Sistema 2** te dice qué funcionó. El **Sistema 3** te dice qué le sirvió al negocio.

Cada semana, lo que aprendes en el 3 y en el 2 vuelve al 1 y cambia lo que produces. Ahí está la ventaja: un equipo pequeño que mejora un poco cada semana, sin depender de la suerte.

## Por dónde empezar esta semana

1. Elige un solo agente del Sistema 1 (el de hooks es el más fácil) y úsalo para tus próximos 5 videos.
2. Anota por video cuántos leads trajo. Con una hoja de cálculo basta.
3. El viernes, pega los números en el prompt del Sistema 2 y mira qué te dice.

No necesitas tener los tres perfectos. Necesitas que los tres existan y se hablen entre sí.
