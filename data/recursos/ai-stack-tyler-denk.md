# Cómo construir tu propio AI Stack: el sistema que usa Tyler Denk para operar Beehiiv

## 1. El caso de Tyler Denk: cómo funciona su AI Stack

Tyler Denk, fundador y CEO de beehiiv, compartió el sistema de inteligencia artificial que utiliza para operar su empresa, que factura aproximadamente 35 millones de dólares al año y cuenta con más de 130 empleados.

Lo interesante no es la cantidad de herramientas que utiliza, sino cómo las tiene conectadas.

Su objetivo es que Claude pueda trabajar con información de diferentes áreas de la empresa: documentos, conversaciones, reuniones, código, bases de datos, finanzas, correos y calendario.

Esto permite que AI tenga contexto sobre lo que está sucediendo en el negocio y pueda ayudar a responder preguntas, analizar información y ejecutar tareas.

**La idea central:** AI es mucho más útil cuando conoce el contexto de tu empresa.

La arquitectura se puede entender en cuatro capas:

1. **Fuentes de información:** documentos, correos, reuniones, CRM, bases de datos, proyectos y conversaciones.
2. **Conexiones:** integraciones, conectores y MCP que permiten consultar esas fuentes.
3. **Inteligencia:** Claude interpreta la información y relaciona datos de distintas herramientas.
4. **Ejecución:** Skills, agentes y tareas programadas convierten ese conocimiento en trabajo real.

## 2. Las herramientas que utiliza Tyler Denk

Estas son las herramientas que aparecen en el stack que compartió.

| Herramienta | Para qué la utiliza |
| --- | --- |
| Claude | Su centro de interacción con la información de la empresa. |
| MCP Connectors | Conectar Claude con documentos, Slack, código, bases de datos, finanzas, correo y calendario. |
| Fellow | Transcribir reuniones y conservar el contexto de las conversaciones. |
| Unblocked | Reunir contexto del negocio desde herramientas como Slack y proyectos. |
| Linear | Gestionar proyectos, tareas y tickets de desarrollo. |
| Claude Skills | Analizar dashboards y cruzar métricas con conversaciones para encontrar riesgos y oportunidades. |
| Scheduled Tasks | Automatizar tareas recurrentes. |
| Claude Code | Trabajar con código y crear soluciones, entre otros usos. |
| Figma Slides | Crear presentaciones en combinación con Claude Code. |
| Wispr Flow | Trabajar con el computador utilizando la voz. |
| Muse | Herramienta que Tyler menciona que está probando personalmente para búsqueda de candidatos y logística de viajes. |

No necesitas implementar todas estas herramientas. Lo importante es entender qué problema resuelve cada una y cómo se conecta con las demás.

## 3. Cómo conecta toda la información de su empresa

Imagina que Tyler quiere saber cómo va el lanzamiento de una nueva funcionalidad de beehiiv.

Normalmente tendría que abrir varias aplicaciones:

- Slack para revisar qué ha hablado el equipo.
- Linear para revisar las tareas pendientes.
- El repositorio de código para ver los cambios realizados.
- Las transcripciones de reuniones para recordar decisiones y compromisos.

Con su sistema puede preguntarle directamente a Claude:

> "¿Cómo va el lanzamiento de esta funcionalidad? ¿Qué falta por hacer y qué está bloqueando al equipo?"

Claude puede consultar las fuentes conectadas, relacionar la información y generar una respuesta.

Ya no tienes que buscar manualmente en cinco aplicaciones para entender qué está pasando en tu empresa.

La información sigue estando en sus herramientas originales, pero AI puede consultarla y relacionarla.

## 4. Cómo empezar a construir tu propio AI Stack

No necesitas tener una empresa de 130 empleados para implementar este sistema.

Puedes empezar con las herramientas que ya utilizas.

### Paso 1. Identifica dónde está la información de tu empresa

Haz un inventario de las fuentes de información que utilizas actualmente.

Por ejemplo:

| Área | Información | Herramientas posibles |
| --- | --- | --- |
| Comercial | Clientes, oportunidades y ventas | HubSpot, Salesforce, Pipedrive |
| Marketing | Campañas, contenido y métricas | Meta Ads, Google Analytics |
| Operaciones | Procesos y procedimientos | Google Drive, Notion |
| Comunicación | Conversaciones del equipo | Slack, Microsoft Teams |
| Reuniones | Transcripciones y compromisos | Fathom, Fellow |
| Finanzas | Gastos, ingresos y reportes | Excel, Google Sheets |
| Proyectos | Tareas y responsables | Linear, Asana, Trello |
| Desarrollo | Código y documentación técnica | GitHub, GitLab |

El primer objetivo es entender dónde vive el conocimiento de tu empresa.

### Paso 2. Conecta tus herramientas con Claude

Claude permite conectarse con diferentes aplicaciones mediante integraciones y MCP.

Algunas conexiones que puedes explorar:

- **Google Drive:** consultar documentos y archivos.
- **Gmail:** buscar información en correos.
- **Google Calendar:** consultar eventos y compromisos.
- **Slack:** consultar conversaciones.
- **Notion:** acceder a documentación y conocimiento interno.
- **GitHub:** consultar repositorios y código.

Puedes comenzar revisando las integraciones disponibles en Claude: https://claude.ai/directory

No todas las conexiones tienen las mismas capacidades. Algunas permiten consultar información y otras también pueden ejecutar acciones, dependiendo de los permisos.

### Paso 3. Dale contexto a Claude sobre tu empresa

Conectar herramientas no es suficiente.

Claude necesita entender cómo funciona tu negocio.

Crea un documento que incluya:

- Qué hace tu empresa.
- Qué productos y servicios ofrece.
- Quiénes son sus clientes.
- Cómo está organizado el equipo.
- Cuáles son los procesos principales.
- Qué objetivos tiene cada área.
- Qué indicadores utiliza para medir resultados.
- Cuáles son los problemas que busca resolver.

Puedes utilizar Claude Projects para organizar este contexto y trabajar con instrucciones y documentos específicos.

La idea es que no tengas que explicarle desde cero cómo funciona tu empresa cada vez que inicias una conversación.

## 5. MCP: cómo conectar tus aplicaciones con la IA

MCP significa Model Context Protocol.

Es un estándar que permite conectar modelos de inteligencia artificial con herramientas y fuentes de información externas.

Por ejemplo:

Si tienes un CRM con información de tus clientes, puedes utilizar una integración compatible para que Claude consulte esa información.

Así puedes preguntarle:

- ¿Cuáles son mis oportunidades comerciales más importantes?
- ¿Qué clientes llevan más de 15 días sin seguimiento?
- ¿Qué oportunidades tienen mayor probabilidad de cierre?
- ¿Qué compromisos comerciales tenemos pendientes?

En lugar de copiar y pegar información manualmente, Claude puede consultar las fuentes autorizadas.

**¿Dónde puedes aprender más?**

Documentación oficial de MCP: https://modelcontextprotocol.io/

Directorio de integraciones de Claude: https://claude.ai/directory

## 6. Skills: convierte tareas en procesos reutilizables

Una de las partes más interesantes del sistema de Tyler es el uso de Skills.

Un Skill es una carpeta con instrucciones que le enseña a AI cómo realizar una tarea específica.

Por ejemplo, puedes crear una Skill para analizar las ventas de tu empresa.

Le enseñas:

- Qué indicadores debe revisar.
- Qué información debe consultar.
- Cómo debe comparar los resultados.
- Qué problemas debe identificar.
- Cómo debe presentar sus conclusiones.

Después puedes reutilizar esas instrucciones cada vez que necesites realizar el análisis.

Ejemplo de un Skill para analizar ventas:

```
Analiza el rendimiento comercial de la empresa.

Consulta los dashboards de ventas y compara los resultados con el periodo anterior.

Revisa:
1. Ingresos.
2. Número de oportunidades.
3. Tasa de conversión.
4. Valor promedio de las ventas.
5. Oportunidades sin seguimiento.

Identifica cambios importantes, posibles problemas y oportunidades de mejora.

Relaciona los resultados con las actividades comerciales y las reuniones registradas.

Entrega un informe con:
- Resumen ejecutivo.
- Indicadores principales.
- Problemas identificados.
- Oportunidades.
- Tres acciones recomendadas.

Utiliza únicamente información respaldada por las fuentes disponibles e indica de dónde provienen los datos.
```

Esto permite que AI trabaje siguiendo un proceso consistente, sin tener que explicarle cada paso desde cero.

## 7. Automatiza tareas con Scheduled Tasks

Otra parte del stack son las tareas programadas.

En lugar de pedirle manualmente a Claude que realice una tarea, puedes configurar procesos recurrentes cuando el producto y las integraciones lo permitan.

Ejemplos:

**Todos los lunes:** preparar un resumen de las prioridades de cada área y los compromisos pendientes.

**Todos los viernes:** analizar los resultados comerciales de la semana y preparar un informe para el gerente.

**Todos los días:** revisar las tareas vencidas y detectar proyectos que puedan estar retrasados.

**Una vez al mes:** analizar los principales indicadores de la empresa y comparar los resultados con el mes anterior.

La idea es que AI no solo responda cuando alguien le pregunta algo, sino que también pueda ayudar a mantener procesos recurrentes.

## 8. Seguridad: antes de conectar toda tu empresa

Conectar información empresarial requiere tener cuidado con los permisos.

Algunas recomendaciones:

- Utiliza cuentas corporativas administradas.
- Concede únicamente los permisos necesarios.
- Empieza con accesos de lectura cuando sea posible.
- No conectes información confidencial sin autorización.
- Revisa qué aplicaciones pueden modificar o eliminar información.
- Exige aprobación humana para pagos, cambios importantes y comunicaciones sensibles.
- Verifica las respuestas utilizando las fuentes originales.

La idea es construir un sistema útil, pero también seguro.

## 9. Tu plan para construir un AI Stack en 30 días

No intentes implementar todo de una vez.

Te recomiendo comenzar con este plan:

| Semana | Objetivo | Resultado |
| --- | --- | --- |
| Semana 1 | Identificar dónde está la información de tu empresa y qué procesos quieres mejorar. | Mapa de herramientas y oportunidades. |
| Semana 2 | Conectar Claude con dos o tres fuentes de información. | Primeras consultas con contexto real. |
| Semana 3 | Crear Projects, instrucciones y Skills para tareas específicas. | Primeros procesos reutilizables. |
| Semana 4 | Probar automatizaciones y tareas programadas. | Primer flujo de trabajo apoyado en IA. |

## 10. Diseña tu propio AI Stack

Antes de empezar, responde estas preguntas:

1. ¿Qué proceso de tu empresa te gustaría automatizar?
2. ¿Dónde está actualmente la información necesaria para realizar ese proceso?
3. ¿Qué herramientas utiliza tu equipo?
4. ¿Qué información debería poder consultar Claude?
5. ¿Qué tareas podría ejecutar la IA?
6. ¿Qué decisiones deben seguir dependiendo de una persona?
7. ¿Cómo vas a medir si la implementación está generando resultados?

### Prompt para diseñar tu propio sistema

Puedes copiar este prompt en Claude:

```
Actúa como un consultor experto en implementación de inteligencia artificial y automatización empresarial. Quiero que me ayudes a diseñar un AI Stack para mi empresa, inspirado en el sistema que utiliza Tyler Denk en beehiiv.

Primero, hazme preguntas para entender:
- Qué hace mi empresa.
- Cómo está organizado mi equipo.
- Qué herramientas utilizamos actualmente.
- Dónde está almacenada nuestra información.
- Cuáles son nuestros principales procesos.
- Qué tareas consumen más tiempo.
- Qué problemas queremos resolver.

Después, diseña una arquitectura que permita conectar nuestras fuentes de información con herramientas de inteligencia artificial.

Quiero que me entregues:
1. Un mapa de las herramientas que utilizamos.
2. Qué aplicaciones deberíamos conectar.
3. Qué conectores o integraciones podemos utilizar.
4. Qué información necesita conocer la IA sobre nuestro negocio.
5. Qué Skills podemos construir.
6. Qué agentes podemos implementar.
7. Qué procesos podemos automatizar.
8. Un plan de implementación por etapas.

No quiero que me recomiendes herramientas innecesarias. Prioriza aprovechar las que ya utilizamos y enfócate en generar resultados medibles. Ten en cuenta la seguridad, los permisos de acceso y la necesidad de aprobación humana para acciones sensibles.
```

## La conclusión más importante

La diferencia entre una empresa que simplemente utiliza ChatGPT y una empresa AI Native está en cómo integra la inteligencia artificial en sus operaciones.

Se trata de que AI tenga acceso al contexto correcto, entienda cómo funciona tu empresa y pueda ayudarte a resolver problemas reales.

Empieza conectando tu información. Después construye Skills, agentes y automatizaciones sobre ese contexto.

Ese es el verdadero potencial de construir un AI Stack.

## Fuentes para profundizar

1. Publicación original de Tyler Denk en LinkedIn
2. Documentación de MCP: https://modelcontextprotocol.io/
3. Directorio de integraciones de Claude: https://claude.ai/directory
4. Documentación del MCP de beehiiv

> 💡 **Nota:** las herramientas, funcionalidades, permisos y planes pueden cambiar. Verifica la documentación oficial antes de implementar cada integración.
