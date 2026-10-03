# Crea contenido con Higgsfield + Codex CLI

![Ejemplos de contenido de producto generado con Higgsfield](../../assets/img/recursos/higgsfield-codex-cli.png)

## Antes de empezar

La mayoría de las personas conocen **Codex CLI** como una herramienta para programar.

Pero también puede convertirse en una de las formas más rápidas de crear un **pipeline de contenido**, porque lo que un agente de código hace muy bien *(leer un objetivo, dividirlo en pasos, utilizar herramientas y mantener los archivos organizados)* es prácticamente la misma estructura que necesitas para producir una campaña de lanzamiento.

La idea es sencilla:

**Subes una sola foto de tu producto → describes lo que quieres → Codex ejecuta el proceso → recibes los archivos de contenido en tu computador.**

Puedes obtener, por ejemplo:

- Imágenes para tus productos
- Anuncios estilo UGC
- Comerciales de producto
- Thumbnails
- Variaciones creativas para campañas

---

## ¿Cómo funciona?

Hay **dos piezas principales**:

### 1. Codex CLI = el agente

Codex se encarga de entender tu objetivo, planificar el trabajo, dividirlo en pasos, ejecutar las herramientas necesarias, organizar los archivos y guardar los resultados.

### 2. Higgsfield Skills = las habilidades creativas

Las **Skills de Higgsfield** le dan a Codex los conocimientos específicos para generar cada tipo de contenido. Tú simplemente indicas el objetivo y **el agente puede seleccionar la Skill adecuada**.

> **Tú defines qué quieres → Codex decide cómo hacerlo → Higgsfield genera el contenido.**

---

## ¿Por qué usar Skills en lugar de MCP?

Higgsfield puede utilizarse tanto mediante **Skills** como mediante un **conector MCP**. Ambas opciones acceden a la misma cuenta y utilizan los mismos créditos; la diferencia está en cómo trabajan.

### Skills

Están diseñadas específicamente para agentes de código. Cada Skill tiene una estructura definida, lo que permite menor consumo de tokens, workflows más consistentes, resultados más repetibles y procesos más estructurados.

### MCP

El conector MCP funciona mejor cuando estás trabajando directamente en un chat y quieres que el modelo pueda elegir libremente parámetros y acciones según el contexto.

> **Skills → mejor para agentes como Codex.**
>
> **MCP → mejor para trabajar directamente desde un chat.**

## Importante: los créditos

Independientemente de si utilizas **Skills o MCP**, las generaciones consumen créditos de tu plan de Higgsfield. Los modelos ilimitados y las generaciones gratuitas **no aplican al uso mediante CLI o MCP**.

---

# PARTE 1 · Instalar Codex CLI y las Skills

Todo el proceso toma aproximadamente **5 minutos**. Necesitas tu computador, acceso a la **Terminal**, una cuenta de Higgsfield y Codex CLI instalado.

## Paso 1. Instalar Higgsfield CLI

```bash
npm i -g @higgsfield/cli
```

También puedes instalarlo utilizando el script oficial:

```bash
curl -fsSL https://raw.githubusercontent.com/higgsfield-ai/cli/main/install.sh | sh
```

## Paso 2. Conectar tu cuenta de Higgsfield

```bash
higgsfield auth login
```

Esto abrirá una ventana del navegador para conectar tu cuenta de Higgsfield. **No necesitas una API Key.** Antes de aprobar la conexión, revisa los permisos solicitados.

El CLI necesita acceso a contenido generado, archivos multimedia que subas, workspaces, plan y créditos. Esto es necesario para enviar los trabajos de generación y recuperar los resultados.

## Paso 3. Instalar las Skills de Higgsfield

```bash
npx skills add higgsfield-ai/skills
```

El instalador detectará automáticamente qué agente estás utilizando —por ejemplo, Codex, Claude Code o Cursor— e instalará cada Skill en la ubicación correspondiente.

### Si detecta el agente equivocado

```bash
npx skills add higgsfield-ai/skills -a codex
```

Para instalaciones automatizadas puedes usar `-g` para instalar globalmente para el usuario actual y `-y` para saltarte las confirmaciones. **Recomendación:** usa estas opciones únicamente si ya sabes dónde quieres que se instalen las Skills; la instalación interactiva muestra las rutas donde quedarán guardadas.

## Paso 4. Ejecutar una Skill

Dentro de Codex puedes llamar directamente una Skill utilizando:

```plain text
/higgsfield:generate
```

También puedes explicar en lenguaje natural qué quieres hacer y dejar que el agente seleccione automáticamente la Skill adecuada.

> “Toma esta foto de producto y crea una campaña completa con imágenes para ecommerce, un anuncio UGC y un comercial cinematográfico.”

---

# PARTE 2 · Organiza tu proyecto correctamente

Trabaja siempre dentro de una **carpeta de proyecto dedicada**. Por ejemplo:

```plain text
mi-campaña/
├── referencias/
├── productos/
├── ugc/
├── comerciales/
├── thumbnails/
└── tracking/
```

La estructura exacta dependerá del workflow que ejecutes. Codex puede crear directorios para cada campaña, guardar resultados, crear archivos de seguimiento y mantener el historial del trabajo.

> **Un pipeline no es un chat. Es una carpeta que acumula historial.**

Por eso es mejor mantener cada campaña dentro de su propio proyecto.

---

# PARTE 3 · ¿Qué hago si las imágenes de referencia no llegan?

Si tus imágenes de referencia no están llegando correctamente a Higgsfield durante la generación, vuelve a ejecutar:

```bash
npx skills add higgsfield-ai/skills
```

Versiones anteriores del CLI tenían un problema que podía impedir que las referencias pasaran correctamente al proceso de generación. Las versiones actuales permiten pasar las referencias, **incluidas las imágenes**.

---

## Flujo completo

1. Abre una carpeta de campaña.
2. Sube una foto de tu producto.
3. Describe los assets que necesitas.
4. Codex selecciona la Skill y ejecuta el workflow.
5. Higgsfield genera el contenido y Codex lo organiza dentro del proyecto.
