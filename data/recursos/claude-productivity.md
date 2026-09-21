> Un sistema de asistencia impulsado por inteligencia artificial diseñado para actuar como un colega digital que gestiona tareas, organiza flujos de trabajo y se conecta con aplicaciones de trabajo cotidianas.

## ¿Qué es el Productivity Plugin?

El **Productivity Plugin** convierte a Claude Cowork en algo mucho más parecido a un asistente de trabajo.

En lugar de simplemente preguntarle cosas a Claude, puedes darle contexto sobre tu trabajo para que te ayude a:

- Organizar tus tareas.
- Planear tu día.
- Dar seguimiento a pendientes.
- Recordar información importante de tu trabajo.
- Identificar tareas atrasadas.
- Mantener contexto sobre tus proyectos y personas.
- Conectar información de diferentes herramientas.

---

## 1. ¿Qué necesitas?

Antes de instalarlo necesitas:

**Claude Cowork** instalado en tu computador.

El Productivity Plugin está diseñado para funcionar dentro de Cowork. La página oficial de Anthropic muestra la opción de instalarlo directamente desde Claude Cowork.

---

## 2. Instalar el Productivity Plugin

La forma más sencilla es hacerlo directamente desde Cowork.

### Paso 1

Abre **Claude Cowork**.

### Paso 2

Ve a: **Plugins → Browse**

### Paso 3

Busca: **Productivity**

### Paso 4

Selecciona el plugin y haz clic en **Install**.

:::callout
💡 El plugin aparece en el directorio oficial de Anthropic como **Productivity** y está marcado como **Anthropic Verified**.
:::

---

## 3. Inicializa el plugin

Una vez instalado, el primer comando que debes utilizar es:

`/start`

Este comando inicializa las principales funciones del plugin: **tareas, memoria y dashboard visual**.

Puedes empezar simplemente escribiendo:

> `/start`

Después de esto, Claude podrá empezar a trabajar con el sistema de productividad.

---

## 4. Enséñale cómo trabajas

Aquí está una de las partes más importantes.

No quieres que Claude simplemente sepa que eres "empresario" o "marketing manager".

Quieres darle **contexto real de tu trabajo**.

Por ejemplo:

> Soy fundador de una empresa de AI.
>
> Mis principales proyectos actualmente son:
>
> - Lanzamiento de mi nuevo curso.
> - Contenido para Instagram.
> - Proyectos de implementación para clientes.
> - Seguimiento comercial.
>
> Mis prioridades esta semana son:
>
> 1. Terminar el lanzamiento.
> 2. Grabar contenido.
> 3. Hacer seguimiento a clientes.
>
> Normalmente tengo reuniones en las tardes y prefiero dejar las mañanas para trabajo de concentración.

Mientras más contexto relevante tenga Claude, más útil puede ser la memoria de trabajo del plugin.

---

## 5. Usa Claude para organizar tus tareas

Ahora puedes empezar a darle tareas directamente en conversación.

Por ejemplo:

> Necesito terminar la presentación del cliente mañana, revisar los contratos pendientes y preparar el contenido de Instagram de esta semana. Organízame estas tareas por prioridad.

El plugin utiliza una lista de tareas en Markdown que Claude puede leer, escribir y ejecutar. También puede hacer seguimiento del estado de las tareas y detectar elementos que llevan tiempo pendientes.

---

## 6. Usa `/update`

Este es uno de los comandos más útiles.

Escribe: `/update`

Claude puede utilizarlo para hacer una revisión rápida de tus tareas pendientes, detectar elementos atrasados y revisar posibles vacíos en su memoria.

También existe: `/update --comprehensive`

Esta versión hace una revisión más profunda de fuentes conectadas como email, calendario y chat para encontrar posibles tareas que hayas pasado por alto y sugerir nueva información para la memoria.

---

## 7. Conecta tus herramientas de trabajo

Productivity puede trabajar con herramientas externas mediante **MCP**, permitiendo conectar tu chat, email, calendario, base de conocimiento y gestor de proyectos.

El tutorial que usamos como referencia menciona herramientas como:

- Notion
- Slack
- Asana
- Linear
- Jira
- Monday
- ClickUp
- Microsoft 365

Por ejemplo, si tienes tus proyectos en Notion y tus conversaciones en Slack, puedes construir un sistema donde Claude tenga mucho más contexto sobre lo que está pasando.

:::callout
**Importante:** las conexiones y permisos dependen de las herramientas que conectes. Revisa siempre qué acceso estás concediendo antes de permitir que Claude ejecute acciones.
:::

---

## 8. Algunos ejemplos de uso

### Al comenzar el día

Puedes decir:

> Buenos días. Revisa mis prioridades, reuniones y tareas pendientes y dime qué debería hacer hoy.

---

### Después de una reunión

Puedes decir:

> Acabo de terminar una reunión con el equipo. Estas fueron las decisiones:
>
> - Actualizar la propuesta.
> - Enviar el documento al cliente.
> - Agendar seguimiento para el viernes.
>
> Convierte esto en tareas y organiza las fechas.

---

### Cuando tienes demasiadas cosas pendientes

> Tengo estas 10 tareas pendientes. Ayúdame a identificar cuáles son realmente prioritarias y cuáles puedo mover.

---

### Cuando cambias de proyecto

> Voy a trabajar ahora en el proyecto de marketing. ¿Qué tareas están pendientes y qué debería revisar antes de empezar?

---

### Al terminar el día

> Hazme un resumen de lo que avancé hoy y dime qué debería pasar para mañana.

---

## 9. La verdadera ventaja: memoria + tareas

La idea del Productivity Plugin es construir **contexto persistente alrededor de tu trabajo**.

Por ejemplo, puedes enseñarle:

- Quiénes son las personas de tu equipo.
- En qué proyectos estás trabajando.
- Cómo llamas internamente a ciertas cosas.
- Cuáles son tus prioridades.
- Qué tareas están pendientes.
- Cómo funcionan determinados procesos.

---

## Comandos que debes guardar

| Comando | Para qué sirve |
| --- | --- |
| `/start` | Inicializar tareas, memoria y dashboard |
| `/update` | Revisar tareas pendientes y vacíos de memoria |
| `/update --comprehensive` | Hacer una revisión más profunda de email, calendario y chat |

Estos son los comandos que aparecen actualmente en la página oficial del plugin.

> **Nota:** algunos tutoriales externos muestran comandos con el prefijo `/productivity:` como `/productivity:daily-plan` o `/productivity:capture`.
