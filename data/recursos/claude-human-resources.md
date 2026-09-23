> *Claude tiene un plugin específico para Human Resources que convierte tareas repetitivas de HR en workflows estructurados dentro de Claude Cowork: ofertas, onboarding, evaluaciones, reportes y consultas sobre políticas internas.*

:::callout
  **Ideal para**

  - Equipos de Recursos Humanos y People Ops
  - Founders que estructuran sus procesos de talento
  - Managers que preparan onboarding y evaluaciones
  - Empresas con políticas y documentación interna dispersa
:::

:::callout
  **Incluye**

  - Instalación paso a paso del plugin
  - 6 workflows de HR explicados
  - Configuración de contexto permanente
  - Flujo recomendado para empezar
  - Advertencias para decisiones sensibles
:::

---

### 1) Qué puedes hacer con Claude for HR

Los comandos del plugin funcionan como Skills especializados: Claude carga las instrucciones adecuadas y puede usar las herramientas conectadas para completar cada workflow.

| Comando | Para qué sirve |
| --- | --- |
| `/draft-offer` | Crear un borrador de oferta laboral con las condiciones acordadas. |
| `/onboarding` | Crear un plan de onboarding para un nuevo empleado. |
| `/performance-review` | Preparar una evaluación de desempeño estructurada. |
| `/policy-lookup` | Buscar información en políticas y documentos internos. |
| `/people-report` | Crear reportes de People/HR a partir de tus datos. |
| `/comp-analysis` | Analizar y comparar información de compensación. |

### 2) Cómo instalar Claude for HR

1. Descarga **Claude Desktop** para tu sistema operativo. Cowork ya está incluido.
1. Abre Claude Desktop y selecciona **Cowork**.
1. En la barra lateral, ve a **Customize → Browse plugins**.
1. Busca **Human Resources** y selecciona el plugin publicado por Anthropic.
1. Pulsa **Install**.
1. Conecta las herramientas que usa tu empresa: Google Calendar o Microsoft 365, Gmail, Slack o Teams, Notion o Confluence, HRIS, ATS y herramientas de compensación.

Las conexiones hacen que Claude trabaje con información de tus sistemas y no solo genere texto.

### 3) Configura las instrucciones de tu empresa

Ve a **Settings → Cowork → Global Instructions**. Ahí puedes guardar el tono de comunicación, formatos de documentos, políticas importantes e información específica de la organización.

Esto evita explicar el mismo contexto en cada conversación y hace que los workflows se adapten a cómo trabaja tu equipo.

### 4) Casos de uso

**Oferta laboral — `/draft-offer`**

Entrega cargo, nivel, salario, fecha de inicio, condiciones y la plantilla de la empresa. Claude prepara un borrador para revisión; si tienes conexiones configuradas, puede continuar el flujo hacia herramientas como DocuSign. Revisa siempre antes de enviarlo.

**Onboarding — `/onboarding`**

Especifica cargo, equipo, ubicación, fecha de inicio y objetivos. Claude puede crear un checklist para esa persona y un plan de 30-60-90 días.

**Evaluación de desempeño — `/performance-review`**

Proporciona objetivos, resultados, feedback, contexto y periodo de evaluación. Claude estructura un primer borrador con logros, áreas de desarrollo y justificación. El manager debe revisar y asumir responsabilidad por la versión final.

**Políticas internas — `/policy-lookup`**

Pregunta, por ejemplo: `¿Cómo funciona la licencia parental para empleados con contrato a término fijo?`. Claude busca en los documentos conectados y responde con el contexto real de tu empresa, en vez de depender solo de conocimiento general.

**People Report — `/people-report`**

Conecta Excel, Google Sheets o tu HRIS para reportes de headcount, rotación, time to fill, engagement, diversidad o salud organizacional. Claude puede convertir datos en un reporte e incluso una presentación según tu configuración.

### 5) Un punto importante: compensación

`/comp-analysis` puede comparar información de compensación con datos de mercado, pero no debería ser la única fuente para decisiones salariales. AIHR encontró problemas importantes de benchmarking, sobre todo para posiciones senior.

Úsalo como punto de partida para investigar, no como una referencia definitiva para establecer salarios.

### 6) La regla más importante: human in the loop

Claude for HR funciona mejor como motor de primeros borradores y workflows, no como sustituto del criterio de Recursos Humanos.

Revisa especialmente ofertas, evaluaciones, compensación, información de empleados, situaciones disciplinarias, temas legales y políticas internas antes de convertir el resultado en una decisión o comunicación final.

### 7) El flujo para probar primero

1. Conecta tus documentos.
1. Instala Human Resources.
1. Configura Global Instructions.
1. Prueba `/policy-lookup`.
1. Prueba `/onboarding`.
1. Revisa los resultados y personaliza el Skill para tu empresa.

:::callout
  **El cambio importante:** pasa de “Claude, escribe un onboarding” a “Claude, ejecuta nuestro workflow de onboarding usando los documentos, herramientas y procesos de nuestra empresa”. Claude deja de ser solo un chatbot y se convierte en una capa de trabajo sobre tus procesos de HR.
:::
