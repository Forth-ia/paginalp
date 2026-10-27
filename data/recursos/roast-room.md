# Crea tu propia junta directiva (Roast Room) con AI

> **Qué es Roast Room y cómo seguir esta guía**
>
> Roast Room es un consejo simulado de 4 expertos que debate una decisión de negocio en 3 rondas y entrega un veredicto ejecutable, y se construye en Claude Code con 5 prompts: uno de contexto y uno por cada una de las 4 capas.
>
> La regla de oro: pega **un prompt a la vez, en orden**, y espera la confirmación de Claude Code antes de pasar al siguiente. Cada prompt prohíbe adelantarse a las capas posteriores, así Claude no mezcla trabajo y el resultado es más fiel.

| Capa | Qué es | Dónde vive | Prompt |
| --- | --- | --- | --- |
| 1. Información | Bases de conocimiento ("Brains"): 7 archivos Markdown por experto | `.claude/skills/roast-room/brains/[slug-experto]/` | Prompt 1 |
| 2. Subagentes | Un agente por experto, con su rol, lente y voz | `.claude/agents/council-[slug].md` | Prompt 2 |
| 3. Gestión (The Chair) | Skill orquestadora que modera las 3 rondas | `.claude/skills/roast-room/SKILL.md` | Prompt 3 |
| 4. Presentación y persistencia | Dashboard web en React y sesiones guardadas en JSON | `sessions/[session-id]/` | Prompt 4 |

El **Prompt 0** no crea nada: solo le da a Claude el mapa completo del proyecto y las reglas de contención.

## Antes de empezar

Necesitas Claude Code, Node.js y una carpeta vacía donde vivirá el proyecto.

1. Crea la carpeta e inicializa git:

```
mkdir roast-room && cd roast-room && git init
```

2. Verifica Node (`node --version`). Si no lo tienes: `brew install node`.
3. Abre Claude Code dentro de esa carpeta con el comando `claude`.
4. Pega los prompts de abajo uno por uno.

### Cómo hacerlo con tus propios expertos

Los prompts de esta guía usan 4 expertos de ejemplo: Alex Hormozi, Elon Musk, Freddy Vega y Simón Borrero. Para armar tu consejo, cambia en los prompts 0 a 4 estos datos de cada asiento:

- Nombre y *slug* (por ejemplo `alex-hormozi`).
- Su pilar o área de especialización.
- Su pregunta insignia, la que solo ese asiento hace.
- Lo que debe aparecer en sus marcos y casos (por ejemplo, el "Algoritmo de 5 pasos" de Musk).

Elige asientos con pilares distintos que choquen entre sí (por ejemplo, crecimiento agresivo contra eficiencia de ingeniería), porque el valor del consejo está en la fricción de la Ronda 2.

Recuerda que son simulaciones construidas con trabajo público, y los prompts piden que el agente lo diga si alguien le pregunta.

## Prompt 0: contexto y arquitectura

Este prompt no crea archivos: le da a Claude el mapa del proyecto y las reglas de contención. Claude debe responder solo confirmando que entiende y que espera el Prompt 1.

```markdown
Vamos a iniciar el desarrollo de un proyecto complejo llamado "Roast Room" (Founder Council) directamente en este repositorio usando Claude Code.

---

### OBJETIVO DEL PROYECTO

El proyecto consiste en una arquitectura de toma de decisiones estratégicas y debate simulado en 3 rondas mediante múltiples subagentes especializados que consultan bases de conocimiento en Markdown ("Brains") y son orquestados por un agente principal ("The Chair"), generando reportes persistentes de cada sesión.

---

### ARQUITECTURA GENERAL (4 CAPAS MODULARES)

El proyecto está estructurado estrictamente en 4 capas independientes:

1. Capa 1: Capa de Información (Brains)
    - Ruta: `.claude/skills/roast-room/brains/[slug-experto]/`
    - Contenido: Bases de conocimiento puras en 7 archivos Markdown estandarizados (`_hot.md`, `frameworks.md`, `positions.md`, `principles.md`, `voice.md`, `stories.md`, `sources.md`).
    - Experto objetivo: Alex Hormozi, Elon Musk, Freddy Vega, Simón Borrero.
2. Capa 2: Capa de Subagentes (Agents)
    - Ruta: `.claude/agents/council-[slug-experto].md`
    - Contenido: Definición del rol, prompt del sistema, lentes analíticos, restricciones de habla y permisos de acceso exclusivo a su carpeta correspondiente en Capa 1.
3. Capa 3: Capa de Gestión (The Chair / SKILL)
    - Ruta: `.claude/skills/roast-room/SKILL.md`
    - Contenido: El orquestador central que facilita el protocolo de debate en 3 rondas (Ronda 1: Posiciones iniciales → Ronda 2: Debate y Abogado del Diablo → Ronda 3: Votación final y veredicto).
4. Capa 4: Capa de Presentación y Persistencia (UI / Reports)
    - Ruta: `sessions/[session-id]/`
    - Contenido: Guardado de estados intermedios en JSON y generación de reportes compilados (PDF o visor HTML).

---

### REGLAS DE EJECUCIÓN Y CONTENCIÓN OBLIGATORIAS

1. TRABAJO CAPA POR CAPA: Queda estrictamente PROHIBIDO adelantarse a crear archivos o código pertenecientes a capas posteriores sin una orden explícita.
2. ESPERA DE PROMPTS ESPECÍFICOS: En este momento SOLO te estoy dando el contexto general. No crees carpetas, ni ejecutes búsquedas, ni crees archivos todavía.
3. CONFIRMACIÓN DE ENTENDIMIENTO: Analiza esta arquitectura, inicializa tu contexto con estas reglas y responde únicamente confirmando que entiendes la estructura del proyecto, las 4 capas y que quedas a la espera del "Prompt de la Capa 1" para comenzar a trabajar.
```

## Prompt 1: Capa 1, Información (Brains)

Este prompt hace que Claude investigue en la web y cree 28 archivos (7 por cada uno de los 4 expertos). Es la capa más larga: puede tardar y pedir permisos de búsqueda. Antes de seguir, revisa que existan las 4 carpetas con sus 7 archivos.

```markdown
Nos vamos a enfocar EXCLUSIVAMENTE en implementar la Capa 1: Capa de Información (Brains) del proyecto Roast Room. No toques la capa de subagentes, ni la skill del Chair, ni la capa de persistencia/UI por ahora.

Tu objetivo es investigar, procesar información pública y poblar la base de conocimiento estática (Brain) para los siguientes 4 miembros del consejo:

1. Alex Hormozi (`alex-hormozi`) - Ofertas, pricing, modelos de monetización, unit economics y ventas.
2. Elon Musk (`elon-musk`) - Principios primeros, ingeniería de costos, escalabilidad física/tecnológica, automatización y velocidad de ejecución.
3. Freddy Vega (`freddy-vega`) - EdTech, adquisición orgánica, creación de comunidad, retención, cultura tecnológica en LatAm y visión de producto/educación.
4. Simón Borrero (`simon-borrero`) - Marketplaces, logística hiperlocal, hipercrecimiento (hypergrowth), levantamiento de capital VC y ejecuciones agresivas.

---

### ESTRUCTURA DE CARPETAS Y ARCHIVOS OBLIGATORIA

Para CADA UNO de los 4 expertos, debes crear su directorio en `.claude/skills/roast-room/brains/[slug-experto]/` con exactamente estos 7 archivos Markdown bien estructurados:

1. `_hot.md` (Hoja de Rápida Consulta / Decision Sheet):
    - Pillar / Área de especialización del experto.
    - La Pregunta Insignia que posee (ej. Hormozi: "¿Will people pay, how much, and how do we close?"; Musk: "¿Estamos optimizando una parte del proceso que ni siquiera debería existir?").
    - Worldview (visión general del mundo, negocios y tecnología en 1-2 párrafos).
    - Las 8 reglas fundamentales por las que decide.
    - Sus 5 marcos mentales/fórmulas principales.
    - Su bucle de decisión (paso a paso de cómo analiza un problema).
    - Preguntas clave que suele hacer.
    - Guía rápida de tono y estilo verbal.
    - Puntos ciegos o dónde falla/misfire su lente analítico.
2. `frameworks.md` (Marcos Mentales y Algoritmos):
    - Modelos conceptuales, ecuaciones y algoritmos de trabajo atribuibles al experto (ej. El "Algoritmo de 5 pasos" de Musk, la "Ecuación de Valor" de Hormozi, la "Fórmula de Nunca Parar de Aprender" de Freddy, las "Métricas de Densidad Logística" de Simón).
    - Para cada marco: Nombre, Qué es, Componentes, Cuándo usarlo, Cómo evaluar/puntuación y Citas textuales si existen.
3. `positions.md` (Posturas y Opiniones Específicas):
    - Sus posturas en temas clave: pricing, levantamiento de capital vs bootstrapping, contratación, velocidad vs calidad, inteligencia artificial, trabajo remoto vs presencial, etc.
    - Incluye citas textuales y referencias de su evolución en el tiempo.
4. `principles.md` (Principios Rectores):
    - Lista de reglas de decisión clasificadas por temas (Oferta, Producto, Operaciones, Capital, Equipo).
    - Asigna un nivel de confianza a cada principio (Alta, Media, Baja) basado en la recurrencia en sus publicaciones, entrevistas o conferencias.
5. `voice.md` (Estilo de Comunicación y Tono):
    - Cadencia de habla, estructura típica de sus argumentos.
    - Cómo inicia un debate, cómo reacciona ante desacuerdos y cómo justifica sus puntos.
    - Palabras habituales, muletillas y frases insignia (ej. "Nunca pares de aprender", "First principles", "Hustle puro").
    - Lo que NUNCA o RARA VEZ hace al comunicarse.
6. `stories.md` (Casos de Estudio y Experiencias):
    - Anécdotas reales, crisis superadas y casos de estudio que suelen citar en sus intervenciones públicas (ej. SpaceX en 2008, los primeros días de Rappi entregando rosquillas, la creación de Platzi desde Cristalab/Mejorando.la, la quiebra de los gimnasios de Hormozi).
7. `sources.md` (Índice de Fuentes):
    - Lista estructurada de fuentes consultadas (videos de YouTube, transcripciones de podcasts, entrevistas, conferencias, tweets/posts) con identificadores únicos (ej. S001, S002).

---

### RESTRICCIONES Y METODOLOGÍA DE INVESTIGACIÓN

- Investiga activamente en la web las entrevistas, libros, podcasts y publicaciones de cada personaje para asegurar que el conocimiento sea preciso y fiel a su pensamiento real.
- Todos los archivos deben ser Markdown puro, estructurado y sin datos de relleno genéricos.
- NO crees archivos fuera del directorio `.claude/skills/roast-room/brains/`.
- NO crees archivos de subagentes (`.claude/agents/`), ni la skill del Chair (`SKILL.md`), ni código JS/Python por ahora.

---

Confírmame cuando la investigación y la generación de los 28 archivos (7 por cada uno de los 4 expertos) en la Capa 1 esté completamente finalizada.
```

## Prompt 2: Capa 2, Subagentes

Este prompt crea los 4 archivos de agente en `.claude/agents/`. Cada agente solo puede leer su propio brain, que es lo que mantiene su voz y su lente separadas de las de los demás. Antes de seguir, revisa que existan `council-hormozi.md`, `council-musk.md`, `council-vega.md` y `council-borrero.md`.

```markdown
Nos vamos a enfocar EXCLUSIVAMENTE en implementar la Capa 2: Capa de Subagentes del proyecto Roast Room. La Capa 1 (Brains) ya está lista. NO toques la Capa 3 (SKILL.md del Chair) ni la Capa 4 (Persistencia/UI) por ahora.

Tu objetivo es crear los 4 archivos de definición de subagentes dentro del directorio `.claude/agents/`:

1. `council-hormozi.md` (Alex Hormozi)
2. `council-musk.md` (Elon Musk)
3. `council-vega.md` (Freddy Vega)
4. `council-borrero.md` (Simón Borrero)

---

### ESTRUCTURA DE CADA ARCHIVO DE SUBAGENTE

Debes utilizar el formato exacto de agente de Claude Code (con frontmatter YAML al inicio) tomando como referencia la plantilla estándar del proyecto:

1. Cabecera YAML (Frontmatter):
    - `name`: `council-[slug]`
    - `description`: Descripción clara del rol que ocupa en el consejo, sus temas de dominio y en qué ruta vive su brain.
    - `tools`: `Read, Grep, Glob`
    - `maxTurns`: `12`
2. Declaración del Asiento y Responsabilidad Principal:
    - Definición explícita de su área (ej. "You hold the Offers, pricing, and sales seat...").
    - Aclaración de simulación: "You are a simulation built from his public work, and if anyone asks, you say so."
    - Pregunta clave que posee en exclusiva (owned question).
    - Aclaración de equilibrio: "The Chair balances the room. You do not."
3. Sección "Your brain":
    - Ruta base exacta a su carpeta en Capa 1: `.claude/skills/roast-room/brains/[slug-experto]/`
    - Regla 1: Leer siempre `_hot.md` primero en cada interacción.
    - Regla 2: Leer máximo 3 archivos adicionales relevantes (`frameworks.md`, `positions.md`, `principles.md`, `voice.md`, `stories.md`).
    - Regla 3: Restricción estricta de memoria: No buscar información sobre el experto fuera de su carpeta brain.
    - Regla 4: Citación de fuentes con identificadores del brain.
4. Sección "Your lens" (Filtro analítico específico):
    - Los 5 a 6 principios o preguntas de filtro mediante los cuales este subagente desglosa cualquier problema de negocio.
5. Sección "How you talk" (Voz y tono):
    - Tono de voz característico, muletillas, estructura verbal, forma de hacer cálculos o usar analogías.
    - Regla de primera persona: Hablar como el asiento ("I'd kill option A"), nunca narrar en tercera persona ("He says...").
6. Sección "How you debate" (Dinámica de debate):
    - Argumentar desde su pilar principal.
    - Identificar a sus oponentes naturales en el consejo (ej. Musk vs. Borrero en capital vs. eficiencia de ingeniería; Vega vs. Hormozi en retención/comunidad vs. monetización agresiva de corto plazo).
    - Reacciones ante el consenso (atacar la parte más débil de su propia postura si todos están de acuerdo).
    - Entrega directa sin preámbulos.
7. Sección "Never" (Restricciones absolutas):
    - No atribuirse ser la persona real.
    - No usar guiones largos (em dashes).
    - No usar respuestas tibias o evasivas ("it depends" sin condiciones numéricas/claras).
    - No presentar reglas empíricas como leyes absolutas.

---

### ESPECIFICACIONES DE LOS 4 ASIENTOS

1. `council-hormozi.md`:
    - Rol: Offers, pricing, and sales.
    - Pregunta: "Will people pay, how much, and how do we close?"
    - Brain: `.claude/skills/roast-room/brains/alex-hormozi/`
2. `council-musk.md`:
    - Rol: First-principles engineering, cost reduction, and radical scale.
    - Pregunta: "Is this limited by physics/math or just conventional wisdom, and how do we scale it 10x faster?"
    - Lens: Algoritmo de 5 pasos (Cuestionar requerimientos, Eliminar partes, Optimizar, Acelerar, Automatizar), razonamiento desde primeros principios, tolerar riesgo extremo por ventajas tecnológicas masivas.
    - Brain: `.claude/skills/roast-room/brains/elon-musk/`
3. `council-vega.md`:
    - Rol: Community, organic acquisition, education, and long-term retention.
    - Pregunta: "Does this create real talent/value for the user, build a loyal community, and scale organically in LatAm/global markets?"
    - Lens: Filosofía "Nunca pares de aprender", enfoque en producto/educación como driver de retención, construcción de marca/comunidad sobre adquisición pagada agresiva, cultura tech y talento.
    - Brain: `.claude/skills/roast-room/brains/freddy-vega/`
4. `council-borrero.md`:
    - Rol: Marketplaces, hypergrowth, unit economics at scale, and capital execution.
    - Pregunta: "How do we dominate the market, build supply/demand density, and execute at extreme speed with VC backing?"
    - Lens: Densidad logística/de red, velocidad de ejecución en calle, ganar el mercado mediante escala agresiva, optimizar unit economics por transacción/orden, mentalidad de "hustle" operativo.
    - Brain: `.claude/skills/roast-room/brains/simon-borrero/`

---

### REGLAS DE EJECUCIÓN

- Genera los 4 archivos en `.claude/agents/`.
- Asegúrate de que las rutas relativas a los brains apunten correctamente a los archivos creados en la Capa 1.
- NO crees el archivo `SKILL.md` de la Capa 3 todavía.

Confírmame cuando los 4 archivos de subagentes en `.claude/agents/` estén completamente creados.
```

## Prompt 3: Capa 3, The Chair (SKILL)

Este prompt crea la skill `roast-room`, el orquestador que modera el debate y que luego invocas con el comando `/roast-room`. Es el cerebro del proyecto: define las 3 rondas, el mecanismo de abogado del diablo y el formato de salida. Al terminar, revisa que exista `.claude/skills/roast-room/SKILL.md`.

```markdown
Nos vamos a enfocar EXCLUSIVAMENTE en implementar la Capa 3: Capa de Gestión (The Chair / SKILL) del proyecto Roast Room. La Capa 1 (Brains) y la Capa 2 (Subagentes) ya están completamente creadas. NO toques la Capa 4 (Persistencia/UI) por ahora.

Tu objetivo es crear la Skill principal del orquestador en `.claude/skills/roast-room/SKILL.md`.

---

### ESTRUCTURA Y RESPONSABILIDADES DEL ARCHIVO `SKILL.md`

El archivo debe tener el formato estándar de Skill para Claude Code (frontmatter YAML al inicio):

1. Cabecera YAML (Frontmatter):
    - `name`: `roast-room`
    - `description`: "Facilitador y orquestador del consejo de toma de decisiones (Roast Room) integrado por Alex Hormozi, Elon Musk, Freddy Vega y Simón Borrero. Ejecuta un debate iterativo en 3 rondas para evaluar dilemas de negocio y entregar un veredicto ejecutable."
    - `argument-hint`: "[decisión a evaluar con opciones, contexto, métricas y criterios de éxito]"
2. Rol del Presidente (The Chair):
    - Actúas como el moderador imparcial de la mesa.
    - Tu función no es imponer tu opinión personal, sino orquestar a los subagentes (`council-hormozi`, `council-musk`, `council-vega`, `council-borrero`), garantizar la rigidez del debate, forzar contraargumentos y sintetizar los resultados.
3. Recepción y Estructuración del Brief (Input):
    Al recibir la consulta del usuario mediante `/roast-room`, valida que el brief contenga:
    - El dilema estratégico o decisión a tomar.
    - Las opciones explícitas a comparar (mínimo Opción A y Opción B).
    - Métricas y datos reales (ingresos, presupuesto, runway, métricas de retención, etc.).
    - Qué significa el éxito y cuál es la inclinación/sesgo actual del usuario.
    (Si falta información crítica para tomar una decisión informada, el Chair debe hacer preguntas breves antes de iniciar las rondas).
4. Protocolo de Debate en 3 Rondas:
    - **RONDA 1: Posiciones Iniciales Independientes**
        - Invoca en paralelo o secuencia a los 4 subagentes (o a aquellos que apliquen al dilema planteado).
        - Cada subagente debe evaluar las opciones desde su filtro/lente analítico exclusivo, asignar una puntuación cuantitativa (1 a 10) a cada opción y justificar su postura en su tono característico.
    - **RONDA 2: Debate Cruzado y Abogado del Diablo**
        - Analiza el grado de consenso de la Ronda 1.
        - **Mecanismo de Fuerza / Abogado del Diablo:** Si todos o la mayoría apoyan la misma opción, el Chair DEBE obligar a al menos 2 agentes (ej. Musk vs. Borrero o Hormozi vs. Vega) a asumir la postura opuesta y defender con violencia argumentativa las opciones descartadas.
        - Los subagentes leen las posturas de sus colegas, responden directamente a los puntos débiles de otros ("Hormozi contesta a Vega", "Musk cuestiona la escala de Borrero") y ajustan o reafirman sus votos indicando exactamente qué los hizo mover.
    - **RONDA 3: Votación Final y Veredicto**
        - Cada subagente emite su voto definitivo no condicionado.
        - El Chair consolida el promedio ponderado de las puntuaciones.
        - Genera la síntesis ejecutiva del veredicto: Opción ganadora, condiciones/salvaguardas indispensables para ejecutarla, mayores riesgos identificados y lista de acciones inmediatas.
5. Formato Estricto de Salida por Ronda:
    - Define cómo el Chair debe presentar las respuestas en la pantalla durante la sesión para que la lectura sea fluida y estructurada.

---

### REGLAS DE EJECUCIÓN

- Genera el archivo `.claude/skills/roast-room/SKILL.md`.
- Asegúrate de que las llamadas a los subagentes utilicen los nombres exactos definidos en la Capa 2 (`council-hormozi`, `council-musk`, `council-vega`, `council-borrero`).
- NO crees scripts de exportación a PDF/HTML ni carpetas de la Capa 4 todavía.

Confírmame cuando el archivo `SKILL.md` esté completamente creado y estructurado.
```

## Prompt 4: Capa 4, Presentación y persistencia

Este prompt construye el dashboard en React y el sistema que guarda cada sesión en `sessions/[session-id]/`. Es la única capa que genera código de aplicación, así que al terminar debe haber un proyecto que arranca con `npm start`.

```markdown
Nos vamos a enfocar EXCLUSIVAMENTE en implementar la Capa 4: Capa de Presentación, Interfaz Reactiva y Persistencia del proyecto Roast Room. Las Capas 1, 2 y 3 ya están creadas.

Tu objetivo es construir la interfaz web reactiva completa y el sistema de persistencia para visualizar las sesiones del consejo en tiempo real y diferido.

---

### REQUERIMIENTOS DE LA CAPA 4 (UI / DASHBOARD REACTIVO)

1. Persistencia de Archivos por Sesión:
    - Configura el sistema para guardar cada ejecución en `sessions/[session-id]/`:
        - `brief.json`: Contexto, métricas y opciones.
        - `round-1.json`: Puntuaciones (1-10) y argumentos independientes.
        - `round-2.json`: Debate cruzado, "abogado del diablo" y réplicas.
        - `round-3.json`: Votos finales no condicionados y veredicto del Chair.
2. Interfaz Gráfica Reactiva e Interactiva (Dashboard App):
    Construye una aplicación web en React con las siguientes secciones e interacciones:
    - **Sala de Consejo Animada (Council Room Chamber):**
        - Caricaturas/Avatares estilizados de los 4 consejeros (Alex Hormozi, Elon Musk, Freddy Vega, Simón Borrero).
        - Indicadores visuales de quién tiene la palabra, estados de ánimo/reacción (Fuego, Escepticismo, Aprobación) y burbujas de diálogo dinámicas que muestran las frases e ideas mientras avanza la discusión.
        - Controles de reproducción: Reproducir/Pausar debate, ajustar velocidad (1x, 2x), avanzar de ronda y saltar a intervención clave.
    - **Consola de Votos y Matriz Comparativa:**
        - Gráficos interactivos de radar y barras comparando los puntajes asignados por cada experto a las Opción A, B y C.
        - Desglose de ponderación del Chair y resumen ejecutivo del veredicto ganador.
    - **Visor de Debate y Transcripción Interactiva:**
        - Filtro por consejero o por ronda (Ronda 1: Posiciones, Ronda 2: Fricción, Ronda 3: Votación).
        - Resaltado de citas textuales de sus "Brains" e identificadores de fuentes (ej. Value Equation, Algoritmo de 5 Pasos).
    - **Exportación e Intercambio:**
        - Botones interactivos para exportar la sesión completa en JSON estructurado o generar un informe en PDF imprimible.
        - Selector de sesiones cargadas previamente o simulación de nuevas consultas.

---

Confírmame cuando el Dashboard Reactivo de la Capa 4 esté integrado y listo para visualizar sesiones.
```

## Cómo usarlo

Con las 4 capas listas, una sesión son dos pasos: correr el debate en Claude Code y verlo en el dashboard.

1. En Claude Code escribe `/roast-room` seguido de tu decisión. Incluye las opciones (mínimo A y B), tus números reales (ingresos, presupuesto, runway, retención), qué significa el éxito y hacia qué opción te inclinas hoy. Si falta algo crítico, el Chair te hará preguntas breves antes de empezar.
2. Cuando termine el debate, la sesión queda guardada en `sessions/[session-id]/`.
3. En una terminal, dentro de la carpeta del proyecto, corre `npm start` y abre la página interactiva para ver la sala, los votos y la transcripción.

### Consejos

- Si un prompt se queda a medias, escribe "continúa con lo que falta de esta capa" en lugar de volver a pegarlo.
- Revisa los brains de la Capa 1 antes de seguir: si un experto suena genérico, los agentes y el Chair también lo van a ser.
- Las citas y marcos salen de fuentes públicas que Claude investiga, así que contrasta los datos importantes con las fuentes listadas en `sources.md`.
- Prueba el consejo con una decisión real y con números concretos: los veredictos son mucho mejores con datos que con preguntas vagas.
