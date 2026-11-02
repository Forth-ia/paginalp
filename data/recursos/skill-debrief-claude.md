:::callout
  **Objetivo**

  Crear un Skill en Claude que conecte **Notion + Google Calendar** para:

  - 1) darte el **reporte del día** (agenda)
  - 2) mostrar tus **bloques disponibles**
  - 3) listar **tareas pendientes** desde Notion
  - 4) proponerte un **plan de trabajo** (o que tú asignes tareas al calendario)
:::

---

:::callout
  Hola, soy Luciano, ayudo a empresas a convertirse en AI - Natives. Instalamos los sistemas, entrenamos al equipo, y al final AI no es algo que "usan": es cómo operan todos los días. 
Lo comparto porque el mundo está cambiando más rápido de lo que la mayoría cree, y si podemos ser 10 veces más productivos con las herramientas correctas, sería un crimen no contárselo.

:::

### Lo que vas a necesitar

- Una cuenta de Claude (connectors)
- Tu cuenta de Notion
- Tu cuenta de Google Calendar
- 10 min para configurarlo todo
---

### 1) Abrir Claude y conectar Notion + Google Calendar

#### 1.1 Conecta Notion

1. Ve a **Settings / Ajustes** (normalmente en tu perfil).
1. Busca la sección **Integrations / Conexiones / Connected apps**.
1. Selecciona **Notion**.
1. Haz clic en **Connect**.
1. Notion te pedirá permisos:
  - Elige el workspace correcto.
  - Autoriza el acceso.
  - Si te da a elegir páginas/bases de datos, selecciona la base de datos de tareas (la crearás en el paso 2 si aún no existe).
    ![Claude, Customize > Connectors: Notion conectado con sus permisos de herramientas](/assets/img/recursos/skill-debrief-claude-1.jpg)

#### 1.2 Conecta Google Calendar

1. En la misma sección de integraciones, selecciona **Google Calendar**.
1. Haz clic en **Connect**.
1. Inicia sesión con tu Google.
1. Acepta permisos.
1. Confirma qué calendarios quieres habilitar (si aplica, selecciona el calendario donde realmente planeas tu día).
  ![Claude, Customize > Connectors: Google Calendar conectado](/assets/img/recursos/skill-debrief-claude-2.jpg)

:::callout
  **Checklist rápido (Paso 1):**

  - Notion conectado
  - Google Calendar conectado
  - Ya puedes pasar al Paso 2
  - Y si no solo pidele a claude qeu te guie para hacerlo
:::

---

### 2) Crear la base de datos en Notion (Tareas)

Vas a crear una tabla/base de datos con estas propiedades:

- **Nombre de la tarea** (Título)
- **Duración** (Número, idealmente en minutos)
- **Fecha límite** (Fecha)
- **Prioridad** (Select)
- **Status** (Status)
- **Proyecto** (Select o Relación si ya tienes una DB de Proyectos)
#### 2.1 Prompt para que Notion AI te cree la base de datos

Copia y pega este prompt en Notion AI (en una página en blanco) y dile que lo ejecute:

Prompt (Notion AI)

- Crea una base de datos tipo tabla llamada “Tareas”.
- Columnas:
  - “Nombre de la tarea” (Title)
  - “Duración (min)” (Number)
  - “Fecha límite” (Date)
  - “Prioridad” (Select) con opciones: Alta, Media, Baja
  - “Status” (Status) con opciones: Por hacer, En progreso, Hecho
  - “Proyecto” (Select) (si existe una base de datos “Proyectos”, entonces usa Relation en vez de Select)
- Agrega 3 tareas de ejemplo con datos realistas.
  ![Notion AI con el prompt para crear la base de datos Tareas](/assets/img/recursos/skill-debrief-claude-3.jpg)

:::callout
  **Recomendación:** usa Duración en minutos (15, 30, 1 hora, 2 horas). Es más fácil para bloquear el calendario.

:::

#### 2.2 Crear la base de datos manualmente (paso a paso)

1. En Notion, crea una nueva página o usa tu espacio donde gestionas tareas.
1. Escribe `/database` y elige **Table – Full page** (o **Table – Inline** si la quieres dentro de una página).
1. Nombra la base: **Tareas**.
1. Crea/ajusta las columnas así:
  - **Nombre de la tarea** → Title
  - **Duración (min)** → Select (opciones: 2 horas, 1 hora, 30 mins, 15 mins)
  - **Fecha límite** → Date
  - **Prioridad** → Select (opciones sugeridas: Alta, Media, Baja)
  - **Status** → Status (opciones sugeridas: Por hacer, En progreso, Hecho)
  - **Proyecto** → Select (nombre de los diferentes proyectos)
![Base de datos Tareas en Notion con duración, energía, fecha límite y prioridad](/assets/img/recursos/skill-debrief-claude-4.jpg)

---

### 3) Crear el Skill en Claude - Tienes 2 opciones

En este paso crearás el Skill y dejarás listo el contenido/instrucciones.

#### 3.1 Opción 1 — Descargar el archivo e instalarlo

1. Descarga este archivo -
:::file chief-of-staff.skill (4.6 KiB)

1. Instala este skill
![Selector de archivos del computador con chief-of-staff.skill seleccionado](/assets/img/recursos/skill-debrief-claude-5.jpg)

![Claude con el archivo chief-of-staff.skill adjunto, listo para instalar](/assets/img/recursos/skill-debrief-claude-6.jpg)

#### 3.2 - Copiar y pegar todo el prompt y volverlo archivo MD

#### Prompt para pegar - Este COPY y PASTE

  ---

  ### name: chief-of-staff
description: >
Morning debrief y gestión del día como Chief of Staff personal.
SIEMPRE usa este skill cuando el usuario diga "buenos días", "buenas tardes",
"debrief", "qué tengo hoy", "arrancamos", "cómo está el día", "planea mi día",
"good morning", "morning debrief", o cualquier variación de saludo matutino
o solicitud de planificación diaria. También actívalo cuando el usuario pregunte
"qué pendientes tengo", "qué hago ahora", "ayúdame a organizar el día",
"qué tareas tengo", o "cómo va mi semana".
Este skill conecta Google Calendar y Notion para leer el día completo, identificar
bloques libres, cruzar tareas pendientes con la energía disponible, y proponer un
plan de acción concreto. Al confirmar con "sí", "yes" o "dale", ejecuta: crea
eventos en calendario y actualiza estados en Notion automáticamente.
compatibility: "Requiere: Google Calendar (gcal_list_events, gcal_create_event, gcal_list_calendars), Notion (notion-query-database-view, notion-update-page, notion-search, notion-fetch)"

  ## Chief of Staff — Morning Debrief

  ### Paso 0 — Onboarding (solo la primera vez)

  Antes de poder hacer el debrief, el skill necesita conocer el contexto del usuario.
Detectar si ya existe configuración guardada en la conversación o en memoria.

  **Si NO hay configuración previa**, hacer estas preguntas de forma conversacional
(no como formulario, sino natural):

  1. ¿Cuál es tu nombre?
  1. ¿En qué zona horaria estás? (ciudad o zona IANA, ej: America/Bogota, America/New_York)
  1. ¿Cuál es tu email de Google Calendar principal?
  1. ¿Tienes una base de datos de tareas en Notion? Si sí, comparte el link o el nombre.
    - Si comparte link: usar `notion-fetch` para leer el schema y guardar el data_source_id
    - Si no tiene: ofrecerle crear una base básica (Tarea, Status, Prioridad, Fecha límite)
  1. ¿Cuáles son tus proyectos o áreas principales? (ej: "Ventas, Operaciones, Contenido")
  Guardar estas respuestas como **configuración del usuario** y usarlas en todos
los debriefs futuros. No volver a preguntar a menos que el usuario diga
"actualiza mi configuración" o "cambia mi Notion".

  **Si YA hay configuración**, saltar directo al Paso 1.

  ---

  ### Configuración del usuario (se llena en onboarding)

  ```plain text
  NOMBRE: [nombre del usuario]
  ZONA_HORARIA: [ej: America/Bogota]
  CALENDARIO_ID: [email o ID del calendario principal]
  NOTION_DATA_SOURCE_ID: [collection://... obtenido del fetch]
  NOTION_VIEW_URL: [URL de la vista principal de tareas, si existe]
  PROYECTOS: [lista de proyectos/áreas del usuario]
  ```

  ---

  ### Paso 1 — Recolectar datos (silencioso, sin narrar)

  Ejecutar en paralelo sin comentar al usuario:

  1. **Google Calendar:**
    - Listar calendarios disponibles con `gcal_list_calendars`
    - Traer todos los eventos del día actual (00:00–23:59) en la zona horaria del usuario
    - Usar el `CALENDARIO_ID` guardado en configuración, o el calendario primary si no hay
  1. **Notion Tareas:**
    - Si hay `NOTION_VIEW_URL`: consultar con `notion-query-database-view`
    - Si no hay view pero sí `NOTION_DATA_SOURCE_ID`: usar `notion-search` con filtro Status ≠ Done
    - Traer TODAS las tareas pendientes (Status ≠ Done)
  ---

  ### Paso 2 — Analizar el día

  #### A. Mapa del día

  - Lista cronológica de eventos: hora inicio/fin, duración, asistentes clave
  - Tipo de evento: reunión externa / interna / grabación / llamada / personal
  - Marcar si el usuario es organizador o invitado
  #### B. Bloques libres

  - Calcular todos los gaps entre eventos > 20 minutos
  - Incluir el bloque antes del primer evento y después del último
  - Clasificar por tamaño:
    - 🟢 **Bloque grande** (90+ min) → ideal para Deep Work
    - 🟡 **Bloque mediano** (30–89 min) → Reactivo o trabajo enfocado
    - 🔴 **Bloque pequeño** (<30 min) → Admin rápido
  - **Regla clave:** cualquier bloque libre es aprovechable independientemente
del tipo de día. Si hay un hueco, úsalo. No limitar por cantidad de reuniones.
  #### C. Tipo de día (contexto informativo, no restrictivo)

  Solo para dar color al reporte:

  - **Día cargado** (3+ eventos) → mencionarlo brevemente
  - **Día mixto** (1–2 eventos) → buena combinación posible
  - **Día libre** (0 eventos) → oportunidad para trabajo profundo
  #### D. Inventario completo de pendientes

  Leer TODAS las tareas con Status ≠ Done y ordenarlas:

  1. Por **Prioridad**: Alta → Media → Baja → Sin prioridad
  1. Dentro de cada prioridad, por **Fecha límite**: más próxima primero, sin fecha al final
  1. Para cada tarea mostrar: Nombre · Proyecto/Área · Tipo de energía (si existe) ·
Duración estimada (si existe) · Fecha límite (si tiene)
  #### E. Cruce tareas vs bloques

  Asignar cada tarea a su bloque óptimo:

  - **Duración** de la tarea vs tamaño del bloque disponible
  - **Energía** requerida: Deep Work en bloques grandes de mañana,
Reactivo/Admin en bloques pequeños o tarde
  - **Prioridad + Fecha límite**: lo más urgente e importante va primero
  - **Proyecto/Área**: agrupar tareas del mismo proyecto en el mismo bloque
  - Si hay más tareas que bloques: las de Alta prioridad y fecha límite
próxima van al plan; el resto al backlog del día
  ---

  ### Paso 3 — Generar el reporte

  Presentar en este formato, adaptando el idioma al del usuario:

  ```plain text
  ☀️ Buenos días, [NOMBRE]. Son las [HORA]. Aquí está tu día:
  
  ---
  
  📅 TU DÍA — [DÍA, FECHA]
  [Tipo de día en una línea]
  
  [Si hay eventos:]
  • [HH:MM – HH:MM] [Nombre evento] · [duración] · [contexto: quién organiza, asistentes clave]
  
  [Si no hay eventos:]
  • Día libre — sin reuniones agendadas
  
  ---
  
  ⏱ BLOQUES DISPONIBLES
  
  • [HH:MM – HH:MM] → [duración] — [🟢 Deep Work / 🟡 Reactivo / 🔴 Admin]
  [listar TODOS los bloques >20 min]
  
  ---
  
  ✅ TODOS TUS PENDIENTES ([N] tareas)
  
  🔴 Alta prioridad
    • [Tarea] · [Proyecto] · [Energía si existe] · [Duración si existe] · [Fecha límite si tiene]
  
  🟡 Media prioridad
    • [Tarea] · [Proyecto] · [Energía si existe] · [Duración si existe] · [Fecha límite si tiene]
  
  ⚪ Baja / Sin prioridad
    • [Tarea] · [Proyecto] · [Fecha límite si tiene]
  
  ⚠️ [Si hay tareas sin Prioridad o sin Fecha límite asignada, mencionarlo aquí
      y sugerir que las completen en Notion]
  
  ---
  
  🗺 PLAN PROPUESTO PARA HOY
  
  [Aprovechar TODOS los bloques libres disponibles]
  
  [HH:MM – HH:MM] 🟢 → [Tarea 1] ([Proyecto]) + [Tarea 2 si cabe] ([Proyecto])
  [HH:MM – HH:MM] 🟡 → [Tarea 3] ([Proyecto])
  [HH:MM – HH:MM] 🔴 → [Tarea 4] ([Proyecto])
  
  [Si quedan tareas sin asignar:]
  📋 Backlog (no alcanzan hoy — retomar mañana):
    • [Tarea] · [Proyecto] · [Prioridad]
  
  ---
  
  💬 [Una línea táctica: insight del día, algo a tener en cuenta, recomendación concreta]
  
  ¿Arrancamos con este plan? Con un "sí" lo bloqueo en el calendario y actualizo Notion.
  ```

  ---

  ### Paso 4 — Ejecutar al confirmar

  Cuando el usuario responda "sí", "yes", "dale", "listo", "confirma", "go", "ok" o similar:

  #### En Google Calendar:

  Crear un evento por cada bloque asignado en el plan:

  - **Título:** [Nombre de tarea] · [Proyecto]
  - **Hora:** el bloque propuesto exacto
  - **Descripción:** `Proyecto: X | Energía: Y | Duración estimada: Z`
  - **Sin invitados** (bloques de trabajo personal)
  - **Color según tipo de energía:**
    - Deep Work → colorId "2" (verde/Sage)
    - Reactivo → colorId "5" (amarillo/Banana)
    - Admin → colorId "8" (gris/Graphite)
    - Llamada → colorId "7" (azul/Peacock)
    - Sin tipo → colorId "1" (lavanda/default)
  - `sendUpdates: "none"`
  #### En Notion:

  - Tareas asignadas al plan con Status "Not started" → cambiar a "In progress"
  - Tareas ya en "In progress" → dejar igual
  - Si la base de Notion no tiene campo Status → omitir este paso e informar al usuario
  #### Confirmar al usuario:

  ```plain text
  ✅ Listo. Bloqueé [N] eventos en tu calendario y marqué [N] tareas como
     In Progress en Notion.
  
  Que te vaya bien hoy. 💪
  ```

  ---

  ### Reglas de comportamiento

  1. **Nunca narrar el proceso** — no decir "voy a consultar tu calendario",
simplemente hacerlo y mostrar el reporte
  1. **Ser específico** — nombres reales de tareas y proyectos, nunca genérico
  1. **No inventar** — usar solo datos reales de Calendar y Notion
  1. **Aprovechar todos los huecos** — no saltarse bloques libres por el tipo de día
  1. **Adaptarse al idioma** — si el usuario escribe en inglés, responder en inglés;
si escribe en español, en español
  1. **Si el día ya empezó** (hora > 9am): proponer bloques a partir de la hora
actual, no desde las 8am
  1. **Si no hay tareas pendientes:** decirlo claro y sugerir que el usuario
agregue tareas a su Notion
  1. **Si Notion no está configurado:** hacer el debrief solo con el calendario
y mencionarlo al usuario
  1. **Ante tareas sin duración o prioridad:** asumir razonablemente,
marcar con ⚠️ y sugerir que las complete en Notion
  1. **Tono:** directo, cálido, como un chief of staff de confianza —
no un asistente corporativo frío
  ---

  ### Evening Debrief (opcional)

  Si el usuario dice "cómo quedó el día", "qué faltó", "cierre del día",
"end of day", "evening debrief" o similar:

  1. Leer tareas con Status "In progress" o "Not started" con fecha límite hoy
  1. Leer eventos del día (pasados)
  1. Presentar:
    - ✅ Qué se completó (Status = Done de hoy)
    - 🔄 Qué quedó en progreso
    - 📋 Qué no se tocó
    - 💡 Sugerencia de qué mover a mañana (priorizando Alta + fecha límite próxima)
  1. Preguntar si actualiza fechas límite en Notion → ejecutar con confirmación
  ---

  ### Actualizar configuración

  Si el usuario dice "actualiza mi configuración", "cambia mi Notion",
"quiero usar otro calendario" o similar:

  - Volver al Paso 0 y hacer solo las preguntas relevantes al cambio solicitado
  - Actualizar los valores en configuración y confirmar los cambios
Le dices que te lo vuelva un archvio MD

---

### 4) Activarlo con la “palabra mágica”

Define una frase corta para activarlo

#### Palabra mágica sugerida

- **“Brief” "buenos días", "buenas tardes", "debrief", "qué tengo hoy", "arrancamos", "cómo está el día", "planea mi día", "good morning”**
#### Cómo usarla

1. Abre un chat en Claude.
1. Escribe: la palabra mágica
1. (Opcional) Aclara el enfoque del día: hoy quiero avanzar en el proyecto X”.
![Plan propuesto por Claude con tareas asignadas a los bloques libres del día](/assets/img/recursos/skill-debrief-claude-9.jpg)

---

![Respuesta de Claude al escribir "morning": agenda del día con reuniones y alertas](/assets/img/recursos/skill-debrief-claude-7.jpg)

![Respuesta de Claude con todos los pendientes de Notion ordenados por prioridad](/assets/img/recursos/skill-debrief-claude-8.jpg)

### 5) Flujo de uso (lo que hace el Skill)

Cada vez que lo actives con la palabra mágica, debe seguir este orden:

#### 5.1 Reporte del día (Calendario)

- Lista eventos de hoy (hora inicio/fin, título).
- Señala reuniones clave y tiempos de enfoque disponibles.
#### 5.2 Bloques disponibles

- Identifica bloques libres (por ejemplo: 09:30–11:00, 14:00–15:30).
- Indica duración de cada bloque.
#### 5.3 Lista de tareas pendientes (Notion)

- Filtra por Status ≠ Hecho.
- Ordena por: Prioridad (Alta → Baja) y Fecha límite (más cercana primero).
#### 5.4 Propuesta de plan (agenda sugerida)

- Propone asignar tareas a bloques según duración.
- Si un bloque no alcanza, sugiere dividir la tarea o moverla al siguiente bloque.
#### 5.5 Confirmación (tú decides)

- Opción A: “Sí, agenda esto tal cual.”
- Opción B: “Cambia el orden / mueve esta tarea a la tarde.”
- Opción C: “No agendes nada, solo dame el plan.”
:::callout
  **Resultado ideal:** Terminas con un calendario con bloques de trabajo claros y un plan realista para el día.

:::

---

### Copy listo para poner al final del Lead Magnet (CTA)

Si quieres, copia esto tal cual:

- “Si quieres que esto quede automatizado al 100% para tu negocio (con plantillas, prompts y workflows), escríbeme ‘MAGIA’ y te digo cómo lo implementamos en tu Notion.”