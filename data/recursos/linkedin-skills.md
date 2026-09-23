> *LinkedIn Skills es un paquete gratuito de 11 Skills especializados para escribir, humanizar, revisar, planificar y reutilizar contenido de LinkedIn con Claude, Codex y otros agentes de IA.*

:::callout
  **Ideal para**

  - Founders que quieren generar conversaciones desde LinkedIn
  - Equipos que crean contenido con Claude o Codex
  - Personas que quieren conservar su voz al usar IA
  - Quien quiere convertir contenido existente en posts nativos
:::

:::callout
  **Incluye**

  - Los 11 Skills y cuándo usar cada uno
  - Instalación en Claude web, Desktop, Claude Code, Codex y OpenClaw
  - Prompts para posts, auditoría, perfil y planificación
  - Flujo semanal de creación, revisión y engagement
  - Configuración opcional de Apify, Publora y Pixfaro
:::

---

### 1) Qué obtienes con este paquete

No es solo un prompt. Es un flujo completo con 11 Skills que Claude selecciona según lo que le pidas:

| Skill | Qué hace |
| --- | --- |
| **Post Writer** | Escribe posts con 20 fórmulas de hooks y ángulos para founders. |
| **Comment Drafter** | Crea comentarios útiles a partir de la URL de un post. |
| **Reply Handler** | Redacta respuestas para conversaciones y comentarios. |
| **Post Audit** | Revisa estructura, distribución y señales de texto generado por IA. |
| **Humanizer** | Elimina vocabulario genérico, guiones largos y patrones repetitivos. |
| **Hook Extractor** | Convierte hooks que funcionan en plantillas reutilizables. |
| **Content Planner** | Crea planes de contenido de 7 días. |
| **Engagement Monitor** | Agrupa a quienes interactúan según su cercanía a tu audiencia ideal. |
| **Profile Optimizer** | Reescribe Headline, About, Featured y Experience. |
| **Employee Advocacy** | Diseña un programa de LinkedIn para equipos. |
| **Repurposer** | Convierte tweets, videos, blogs y newsletters en posts nativos. |

Repositorio: [sergebulaev/linkedin-skills](https://github.com/sergebulaev/linkedin-skills).

### 2) Instalación rápida

**Claude en la web:** abre Skills en la barra lateral, pulsa **Add from GitHub**, introduce `sergebulaev/linkedin-skills`, finaliza la instalación y abre una conversación nueva.

**Claude Desktop:** ve a **Customize → + junto a Personal plugins → Create plugin → Add marketplace → Add from a repository**. Introduce `sergebulaev/linkedin-skills`, instálalo y abre una conversación nueva.

**Claude Code**

```plain text
/plugin marketplace add sergebulaev/linkedin-skills
/plugin install linkedin-skills@linkedin-skills
```

**Codex**

```bash
codex plugin marketplace add sergebulaev/linkedin-skills
codex plugin add linkedin-skills@linkedin-skills
```

**Un comando para agentes compatibles**

```bash
npx skills add sergebulaev/linkedin-skills
```

**OpenClaw:** clona el repositorio en tu directorio de trabajo e indícale en el system prompt que lea el `SKILL.md` relevante para cada tarea de LinkedIn.

### 3) Prompts para empezar

**Escribir un post**

```plain text
Escribe un post de LinkedIn sobre por qué las agencias de AI están reemplazando a las agencias tradicionales.

Soy founder. Elige un hook fuerte para conseguir alcance, mantenlo específico y muéstrame el borrador antes de publicar cualquier cosa.
```

**Humanizar un post**

```plain text
Humaniza este post de LinkedIn. Elimina vocabulario típico de AI, guiones largos, estructuras repetitivas y afirmaciones genéricas.

Mantén mi punto original y mi forma de escribir:

[pega aquí el post]
```

**Auditar antes de publicar**

```plain text
Audita este post de LinkedIn teniendo en cuenta fuerza del hook, claridad, señales de texto generado por AI, formato y posibles puntos de abandono.

Explícame las tres mejoras de mayor impacto y después dame una versión revisada:

[pega aquí el post]
```

**Plan semanal**

```plain text
Crea un plan de contenido de LinkedIn de 7 días para un founder que vende automatizaciones con AI a pequeñas y medianas empresas.

Incluye tema, formato, hook, hora de publicación, CTA y cinco cuentas o tipos de audiencia con los que debería interactuar cada día.
```

### 4) Un flujo semanal sencillo

**Lunes:** usa Content Planner para generar ideas de los próximos 7 días. Elige de 3 a 5 que se relacionen directamente con tu oferta, resultados, experiencia y trabajo actual.

**Antes de cada publicación:** usa Post Writer con una audiencia, idea central, prueba o ejemplo, oferta, CTA y tono. Cuanto más específico sea el input, mejor será el borrador.

**Antes de publicar:** pasa el texto por Post Audit y después por Humanizer. Léelo en voz alta: el objetivo no es perfección, sino que siga sonando a ti.

**Después de publicar:** usa Comment Drafter para aportar valor en posts relevantes y Reply Handler para las conversaciones en los tuyos.

**Al final de la semana:** revisa qué hooks generaron visitas al perfil, comentarios relevantes, mensajes directos y conversaciones calificadas. No optimices solo por impresiones.

### 5) Conexiones opcionales

El paquete funciona sin Apify: si no puede leer un post, te pedirá que pegues el contenido. Para automatizar lectura de posts, comentarios y engagers, crea un archivo `.env` en la raíz del paquete:

```plain text
APIFY_TOKEN=apify_api_tu_token_aqui
```

Publora permite programar y publicar, pero los Skills crean borradores por defecto y esperan tu aprobación. Guarda estas credenciales únicamente en `.env`:

```plain text
PUBLORA_API_KEY=sk_tu_key_aqui
LINKEDIN_PLATFORM_ID=linkedin_tu_id_aqui
```

Para ideas visuales o generación de imágenes puedes añadir:

```plain text
PIXFARO_TOKEN=pf_live_tu_token_aqui
```

:::callout
  **Importante:** nunca compartas ni subas a GitHub tokens privados. Añade `.env` a tu `.gitignore` y revisa cada post, comentario, respuesta o acción programada antes de publicarla.
:::

### 6) Cómo conseguir mejores resultados

1. Dale a Claude una opinión, experiencia o argumento real; no pidas simplemente “un post viral”.
1. Añade pruebas: resultados, capturas, historias de clientes, errores, números o detrás de cámaras.
1. Define una sola audiencia y una sola acción deseada.
1. Usa Humanizer como editor, no como autoridad final: protege tu voz.
1. Mantén siempre la aprobación antes de publicar.

### 7) Solución de problemas

| Problema | Solución |
| --- | --- |
| Los Skills no se activan | Confirma la instalación, inicia una conversación nueva y especifica que la tarea es para LinkedIn. |
| Claude pide pegar un post | Añade Apify o pega el contenido manualmente. |
| Publora no encuentra la API key | Verifica que `.env` está en la raíz de `linkedin-skills`. |
| El contenido suena genérico | Incluye una historia, un número, una opinión y una audiencia concreta. |

:::callout
  **La versión corta:** instala el repositorio, abre una conversación nueva, pide un post, auditoría o mejora de perfil, revisa el resultado y publica únicamente cuando de verdad suene como tú. El flujo es: **Crear → Revisar → Aprobar → Publicar**.
:::
