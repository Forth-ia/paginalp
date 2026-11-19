# 3 automatizaciones para recuperar tiempo

No necesitas que la IA haga absolutamente todo. Solo automatiza las tareas que no necesitan tu intervención y deja que te avise cuando algo requiere tu aprobación.

> 💡 **Antes de empezar:**
> - Elige una sola tarea por automatización. Empieza pequeño.
> - Define qué puede hacer el agente solo y qué debe pasarte para aprobación.
> - Prueba con 5 casos reales antes de dejarlo corriendo.

## Automatización 1: responder clientes en WhatsApp

**Qué hace:** un agente responde las consultas repetitivas de tus clientes (precios, horarios, cómo funciona, estado de un pedido) y te pasa las que no sabe.

**Qué necesitas:**

- WhatsApp Business conectado a tu herramienta de automatización
- Un documento con tus preguntas frecuentes y respuestas
- Un agente de IA

**Pasos:**

1. Haz una lista de las 10 preguntas que más te hacen y escribe la respuesta ideal a cada una.
2. Conecta WhatsApp Business a tu herramienta de automatización para que cada mensaje nuevo llegue al agente.
3. Pega este prompt en el agente:

```text
Eres el asistente de [NOMBRE DE TU EMPRESA]. Responde en español, con tono cercano y breve. Usa solo la información de las preguntas frecuentes que te doy abajo. Si la pregunta no está ahí, o el cliente quiere pagar, reclamar o negociar, responde 'Un momento, te escribe alguien del equipo' y avísame. Nunca inventes precios ni promesas. PREGUNTAS FRECUENTES: [PEGA AQUÍ TU LISTA]
```

4. Activa el aviso: cada vez que el agente escale un caso, te llega una notificación con el mensaje del cliente.

> **Regla de aprobación:** el agente responde solo lo que está en tu lista. Todo lo demás pasa por ti.

## Automatización 2: actualizar el CRM

**Qué hace:** después de cada conversación o llamada, el agente actualiza el contacto en tu CRM sin que lo hagas a mano.

**Qué necesitas:**

- Un CRM (HubSpot, Notion, Airtable, Google Sheets, el que uses)
- Una fuente de información: el chat de WhatsApp, las notas de la llamada (transcripción gratis con Fathom) o un formulario

**Pasos:**

1. Define los campos que quieres mantener actualizados (por ejemplo: nombre, empresa, qué necesita, etapa, próximo paso, fecha del último contacto).
2. Conecta la fuente con el CRM desde tu herramienta de automatización.
3. Pega este prompt en el agente:

```text
Lee esta conversación y devuelve solo estos campos: nombre, empresa, qué necesita, etapa (nuevo, interesado, en negociación, cerrado), próximo paso y fecha. Si un dato no aparece, escribe 'sin dato'. No inventes nada. CONVERSACIÓN: [TEXTO]
```

4. Haz que el resultado se guarde directo en el contacto correspondiente.

> **Regla de aprobación:** si el agente cambia la etapa a "cerrado" o modifica un monto, te pide confirmación antes de guardar.

## Automatización 3: asignar tareas

**Qué hace:** cuando entra un pedido, un cliente nuevo o una solicitud, el agente crea la tarea y se la asigna a la persona correcta.

**Qué necesitas:**

- Tu sistema de tareas (Notion, Asana, Trello, ClickUp, el que uses)
- Una regla clara de quién hace qué

**Pasos:**

1. Escribe tus reglas de asignación. Ejemplo: "pedidos nuevos van a [PERSONA A], reclamos a [PERSONA B], temas de facturación a [PERSONA C]".
2. Conecta el evento que dispara la tarea (un formulario, un mensaje, un pago) con tu sistema de tareas.
3. Pega este prompt en el agente:

```text
Con esta solicitud, crea una tarea con: título corto, descripción, responsable y fecha límite. Usa estas reglas de asignación: [PEGA TUS REGLAS]. Si no encaja en ninguna regla, déjala sin asignar y avísame. SOLICITUD: [TEXTO]
```

4. Activa una notificación al responsable cada vez que se le asigna algo.

> **Regla de aprobación:** lo que no encaja en tus reglas llega a ti, no se asigna solo.

## Cómo implementarlas sin abrumarte

> - **Semana 1:** automatiza solo la número 1.
> - **Semana 2:** suma la número 2.
> - **Semana 3:** suma la número 3.

Cada semana revisa qué casos te escaló el agente y agrega esas respuestas o reglas a tus instrucciones. Así mejora solo con el uso.
