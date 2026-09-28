**SkillSpector**, desarrollado por NVIDIA, analiza las skills de agentes de AI para detectar instrucciones maliciosas, código inseguro, acceso a credenciales, extracción de datos, riesgos de supply chain y otros problemas de seguridad **antes de instalarlas**.

En esta guía aprenderás a:

- Instalar SkillSpector.
- Analizar una skill individual.
- Analizar una carpeta completa de skills.
- Revisar repositorios de GitHub antes de instalarlos.
- Generar reportes de seguridad.
- Conectar SkillSpector con Claude Code como un MCP.

:::callout
💡

Repo: https://github.com/nvidia/skillspector

:::

---

## 🔎 ¿Qué hace SkillSpector?

SkillSpector puede analizar:

- Una carpeta local con una skill.
- Un archivo individual `SKILL.md`.
- Un repositorio de GitHub.
- Un archivo ZIP.
- Una carpeta que contenga múltiples skills.

El análisis genera:

- **Puntuación de riesgo de 0–100**
- Nivel de severidad
- Recomendación
- Veredicto de seguridad
- Hallazgos detallados

SkillSpector analiza **68 patrones de vulnerabilidad en 17 categorías**, incluyendo:

- Prompt injection
- Extracción de variables de entorno
- Ejecución remota de código
- Persistencia
- Dependencias peligrosas
- MCP tool poisoning
- Acceso o extracción de credenciales
- Exfiltración de datos

> ⚠️ **Importante:** una puntuación baja no garantiza que una skill sea segura. Utiliza SkillSpector como una herramienta de revisión de seguridad, no como una autorización automática para instalar código desconocido.
>

---

## 🧰 ¿Qué necesitas?

Antes de comenzar necesitas:

- macOS, Linux o Windows con una terminal compatible con Unix.
- Python **3.12 o superior**.
- `uv` instalado.
- Claude Code instalado y autenticado si quieres configurar el MCP.

### Repositorio oficial

**NVIDIA/SkillSpector:**

https://github.com/NVIDIA/SkillSpector

---

## 1️⃣ Instala SkillSpector

Para instalar la versión estándar del scanner mediante línea de comandos:

```bash
uv tool install skillspector
```

### Confirma que se instaló correctamente

```bash
skillspector --version
```

### Para actualizarlo más adelante

```bash
uv tool upgrade skillspector
```

---

## 2️⃣ Analiza una skill

SkillSpector puede analizar diferentes tipos de archivos y fuentes.

### Analizar una carpeta local

```bash
skillspector scan /ruta/a/tu/skill
```

### Analizar un archivo `SKILL.md`

```bash
skillspector scan /ruta/a/SKILL.md
```

### Analizar un repositorio de GitHub

Puedes analizar un repositorio antes de clonarlo o instalarlo:

```bash
skillspector scan https://github.com/usuario/repositorio
```

### Analizar un archivo ZIP

```bash
skillspector scan skill.zip
```

---

## 3️⃣ Analiza tus skills existentes de Claude

Las skills de Claude Code normalmente se encuentran en:

```
.claude/skills
```

Pueden estar dentro de un proyecto específico o en la configuración general de Claude del usuario.

### Desde la carpeta de un proyecto

Ejecuta:

```bash
skillspector scan .claude/skills
```

### Skills a nivel de usuario en macOS o Linux

Puedes probar:

```bash
skillspector scan ~/.claude/skills
```

Si tus skills están almacenadas en otra ubicación, simplemente reemplaza la ruta por la carpeta correspondiente.

SkillSpector detectará y analizará las skills que encuentre dentro de ella.

---

## 4️⃣ Haz un análisis rápido sin LLM

El análisis normal puede utilizar un LLM para realizar análisis semántico.

Si quieres hacer una primera revisión más rápida y **sin necesidad de una API key**, puedes utilizar:

```bash
skillspector scan /ruta/a/tu/skill --no-llm
```

### ¿Cuándo utilizarlo?

El modo `--no-llm` es útil para hacer un **primer filtro rápido**.

Sin embargo, el análisis completo puede detectar instrucciones sospechosas que podrían parecer normales para un análisis basado únicamente en patrones.

**Recomendación:**

**Primera revisión → `--no-llm`**

**Revisión completa → análisis con LLM**

---

## 5️⃣ Guarda el reporte

Puedes guardar los resultados en diferentes formatos.

### JSON

Para guardar un reporte procesable por otras herramientas:

```bash
skillspector scan /ruta/a/tu/skill --format json > report.json
```

### Markdown

Para generar un reporte fácil de leer:

```bash
skillspector scan /ruta/a/tu/skill --format markdown > report.md
```

### SARIF

Para integrarlo con herramientas de seguridad o CI:

```bash
skillspector scan /ruta/a/tu/skill --format sarif > report.sarif
```

---

## 🔌 Conecta SkillSpector con Claude Code

También puedes configurar SkillSpector como un **MCP**.

Esto permite que Claude pueda utilizar el scanner como una herramienta directamente, en lugar de que tengas que ejecutar manualmente cada comando.

---

### Paso 1 — Instala la versión MCP

Instala la versión de SkillSpector necesaria para utilizarlo como MCP:

```bash
uv tool install skillspector
```

---

### Paso 2 — Regístralo en Claude Code

Agrega SkillSpector como servidor MCP utilizando la configuración correspondiente de Claude Code.

Una vez registrado, Claude podrá acceder al scanner como una herramienta.

---

### Paso 3 — Confirma la conexión

Abre Claude Code y ejecuta:

```
/mcp
```

Busca:

```
skillspector
```

en la lista de servidores conectados.

Si aparece allí, la conexión está activa.

---

### Paso 4 — Pídele a Claude que analice una skill antes de instalarla

Una vez conectado el MCP, puedes pedirle a Claude que analice una skill antes de instalarla.

Por ejemplo:

> **Analiza esta skill de GitHub con SkillSpector antes de instalarla: [URL]**
>

También puedes indicarle una carpeta local:

> **Analiza esta carpeta de skills con SkillSpector y dime si encuentras riesgos de seguridad: `/ruta/a/skills`**
>

### ⚠️ Mantén separados el análisis y la instalación

El flujo recomendado es:

**SCAN → REVIEW → APPROVE → INSTALL**

Claude debería:

1. Analizar la skill.
2. Explicarte los resultados.
3. Mostrarte los hallazgos relevantes.
4. Esperar tu aprobación.
5. Instalar o habilitar la skill únicamente después de tu aprobación.

---

## 📊 ¿Cómo leer los resultados?

Presta especial atención a estos elementos:

### Risk score

La puntuación general de riesgo, de **0 a 100**.

### Severity

El nivel de severidad asignado al comportamiento detectado.

### Recommendation

La recomendación que SkillSpector genera sobre qué hacer a continuación.

### Safe to install

El veredicto del scanner.

> ⚠️ No significa que exista una garantía absoluta de seguridad.
>

### Findings

Los hallazgos específicos que generaron la puntuación.

Aquí deberías revisar:

- Archivo
- Línea
- Código
- Patrón detectado
- Motivo de la alerta

### Scan mode

Indica cómo se realizó el análisis:

- Análisis estático
- Análisis estático + LLM

---

## 🚨 Señales de alerta

Detente y revisa cuidadosamente una skill si encuentras comportamientos como:

### 🔑 Acceso a información sensible

Por ejemplo:

- Variables de entorno
- SSH keys
- Tokens
- Archivos de contraseñas
- Credenciales

### 🌐 Envío de datos externos

Código que envía información local hacia URLs externas.

### 📥 Descargar y ejecutar scripts remotos

Especialmente cuando una skill descarga código de Internet y posteriormente lo ejecuta.

### 💻 Ejecución de código

Presta atención a:

```
exec
eval
subprocess
os.system
```

y mecanismos similares de ejecución.

### 🔄 Persistencia

Por ejemplo:

- Cron jobs
- Scripts de inicio
- Procesos que buscan ejecutarse automáticamente
- Otros mecanismos de persistencia

### 🧩 Código ofuscado

Por ejemplo:

- Base64
- Comandos codificados
- Código deliberadamente difícil de interpretar

### 🔓 Permisos demasiado amplios

Especialmente:

- Wildcard permissions
- Capacidades MCP no declaradas
- Accesos que no parecen necesarios para el propósito de la skill

### 👻 Instrucciones ocultas

Busca instrucciones escondidas dentro de:

- Comentarios
- Unicode
- Texto invisible
- Contenido aparentemente irrelevante

---

## 🛡️ Flujo recomendado para instalar una skill de forma segura

Utiliza este proceso cada vez que encuentres una skill nueva:

### 1. Analiza el repositorio

Haz el scan sobre la URL de GitHub **antes de clonarlo**.

### 2. Revisa los hallazgos importantes

Lee todos los hallazgos clasificados como **High** o **Critical**.

### 3. Comprueba los permisos

Pregúntate:

> ¿Los permisos que solicita esta skill tienen sentido para lo que dice hacer?
>

### 4. Revisa el código exacto

Mira el archivo y la línea que generaron la alerta.

### 5. Prueba en un entorno separado

Si no conoces la skill, pruébala primero en un proyecto desechable y **sin secretos reales**.

### 6. Instala después de entenderla

Antes de instalarla, debes saber qué información:

- Lee
- Escribe
- Ejecuta
- Envía externamente

### 7. Analiza nuevamente después de actualizar

Cada actualización puede introducir cambios.

Por eso, vuelve a ejecutar el scanner después de cada update.

---

## 📌 Opcional: Crear un baseline

Si revisaste los hallazgos existentes y decidiste aceptarlos conscientemente, puedes crear un **baseline**:

```bash
skillspector baseline
```

Después puedes mostrar únicamente los hallazgos nuevos en futuros análisis.

```bash
skillspector scan /ruta/a/tu/skill --baseline
```

También puedes revisar los hallazgos que fueron suprimidos cuando sea necesario.

> ⚠️ **Importante:** nunca utilices un baseline para ocultar hallazgos que todavía no hayas revisado personalmente.
>

---

## ⚡ Quick Start

Si quieres empezar rápidamente, este es el flujo:

### 1. Instala

```bash
uv tool install skillspector
```

### 2. Analiza

```bash
skillspector scan /ruta/a/tu/skill
```

### 3. Si quieres una revisión rápida sin LLM

```bash
skillspector scan /ruta/a/tu/skill --no-llm
```

### 4. Revisa los findings

Presta atención a:

**High / Critical → permisos → credenciales → ejecución de código → exfiltración de datos**

### 5. Instala únicamente después de revisar

SCAN → REVIEW → APPROVE → INSTALL
