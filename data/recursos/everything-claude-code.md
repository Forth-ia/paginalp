📨 **La guía que necesitas para instalar un equipo de agentes de AI en tu herramienta de coding.**

**Everything Claude Code (ECC)** es un repositorio gratuito y open source que reúne agentes especializados, skills, comandos y herramientas para ayudarte a **planear, construir, probar y asegurar código**.

En aproximadamente 2 minutos puedes instalarlo y empezar a trabajar con estos agentes desde lenguaje natural.

---

### ¿Qué obtienes?

### 🤖 Agentes especializados

Una colección de agentes de AI especializados para diferentes tareas de desarrollo.

El número de agentes y herramientas continúa creciendo con las actualizaciones del repositorio.

### 🧩 Cientos de skills

Puedes ejecutar diferentes workflows utilizando lenguaje natural para tareas como:

- Planear funcionalidades
- Construir aplicaciones
- Escribir y revisar código
- Ejecutar pruebas
- Mejorar código existente
- Revisar seguridad
- Automatizar tareas de desarrollo

### 🔐 Una capa de seguridad

ECC también puede analizar tu aplicación desde una perspectiva de seguridad, encontrar vulnerabilidades y ayudarte a corregirlas antes de que se conviertan en un problema.

### 💻 Open source y gratuito

El repositorio es gratuito y open source.

**Importante:** ECC es gratuito, pero el acceso al modelo de AI que utilices depende del plan o API que ya tengas contratado.

---

:::callout
💡

### 🔗 Enlaces

**Repositorio de ECC:**

https://github.com/affaan-m/ECC

**ECC — sitio oficial e instaladores:**

https://ecc.tools/

**Documentación de plugins de Claude Code:**

https://docs.claude.com/en/docs/claude-code/plugins

:::

---

## Antes de comenzar

Antes de instalarlo, asegúrate de tener:

- **Claude Code, Cursor o Codex instalado.**
- Un plan activo o acceso mediante API para la herramienta que vas a utilizar.
- Tener claro que **ECC es gratuito y open source**.
- ¿Qué herramienta debería usar?

ECC funciona especialmente bien con **Claude Code**.

También cuenta con opciones para **Codex, Cursor y OpenCode**, aunque algunas capacidades pueden variar dependiendo de la herramienta.

> 💡 **Nota:** La cantidad de agentes y skills puede cambiar con las actualizaciones del repositorio. Si ves números diferentes a los mencionados en el video, es normal. El proyecto continúa creciendo.
>

---

## 1️⃣ Agrega el marketplace de ECC

Abre **Claude Code** y escribe:

```bash
/plugin marketplace add affaan-m/ECC
```

Este comando registra el repositorio como un marketplace de plugins para que Claude Code pueda acceder a todo lo que contiene ECC.

---

## 2️⃣ Instala el plugin

Dentro de Claude Code, ejecuta:

```bash
/plugin install ecc@ecc
```

¡Y listo!

La instalación incluye los diferentes:

- Agentes
- Skills
- Comandos
- Hooks
- Configuraciones

---

### ¿No estás usando Claude Code?

También existe una opción mediante npm para **Codex, Cursor y OpenCode**:

```bash
npm i -g ecc-universal
```

Esto instala los skills, agentes, hooks y configuraciones disponibles para tu herramienta.

> 💡 **Recomendación:** La experiencia más completa está en Claude Code. Las demás herramientas cuentan con adaptadores que cubren los agentes y skills principales.
>

---

## 3️⃣ Empieza a utilizar los agentes

Aquí es donde ECC deja de ser simplemente un plugin y empieza a funcionar como un **equipo de desarrollo**.

Puedes darle instrucciones utilizando lenguaje natural.

### 1. Planear

Escribe:

> **"Plan this feature"**
>

El agente de planificación analiza el problema y propone la arquitectura y los pasos necesarios.

### 2. Construir

Después puedes decir:

> **"Build it"**
>

Y utilizar AI para implementar la funcionalidad en tecnologías como:

- Django
- Next.js
- React
- JavaScript
- TypeScript
- Entre otras.

### 3. Probar

Después:

> **"Test it"**
>

El sistema puede ejecutar pruebas y ayudarte a verificar que el código funciona correctamente.

### 4. Asegurar

Finalmente:

> **"Secure it"**
>

El sistema puede revisar tu aplicación desde una perspectiva de seguridad, identificar posibles vulnerabilidades y ayudarte a corregirlas.

---

## 4️⃣ Haz una tarea real de principio a fin

La mejor forma de entender cómo funciona ECC es probarlo directamente en un proyecto real.

Elige una funcionalidad pequeña y haz el proceso completo:

**PLAN → BUILD → TEST → SECURE**

Por ejemplo:

```
Plan a dark mode toggle for my settings page, then build it, test it, and secure it.
```

O en español:

```
Planea un botón para activar modo oscuro en mi página de configuración.
Después constrúyelo, pruébalo y revisa su seguridad.
```

Una sola prueba completa te permitirá entender mucho mejor el flujo que simplemente leer toda la documentación.

---

## ✅ Checklist de verificación

Después de instalarlo, verifica lo siguiente:

- El marketplace se agregó correctamente.
- El plugin aparece como instalado.
- Puedes asignar tareas de planificación a un agente especializado.
- Las pruebas generan resultados reales y no simplemente una respuesta de "terminado".
- La revisión de seguridad analiza archivos reales de tu proyecto.
- Guardaste el repositorio en GitHub para poder seguir sus actualizaciones.

---

## 🛠️ Troubleshooting

### "Plugin not found in any marketplace"

Utiliza exactamente:

```bash
ecc@ecc
```

Algunas publicaciones antiguas muestran identificadores diferentes que pueden no funcionar actualmente.

---

### El marketplace no se puede agregar

Primero actualiza Claude Code.

Las versiones antiguas pueden tener problemas para resolver marketplaces externos.

Como alternativa, puedes utilizar:

```bash
npm i -g ecc-universal
```

---

### Los agentes responden, pero no parece que nada haya cambiado

Reinicia completamente tu herramienta después de instalar el plugin.

Muchas herramientas cargan los plugins únicamente cuando se inicia la aplicación.

---

### Estoy usando Cursor o Codex

Ten en cuenta que la experiencia puede ser diferente.

Claude Code tiene la integración más completa, mientras que los adaptadores para otras herramientas cubren las funcionalidades principales.

---

### Está consumiendo demasiado rápido mi uso de AI

Los agentes requieren llamadas adicionales al modelo.

Si tienes muchos agentes trabajando simultáneamente, el consumo puede aumentar rápidamente.

Empieza con:

**1 agente → tarea pequeña → revisar resultado**

Y después prueba workflows más completos como:

**PLAN → BUILD → TEST → SECURE**

---

## 🚀 ¿Qué sigue?

Ya tienes instalado ECC.

Ahora prueba algo pequeño en un proyecto.

La idea no es aprenderte todos los agentes de memoria.

Es aprender a decirle a tu herramienta de AI **qué quieres construir, qué necesitas revisar y qué problema quieres resolver.**

Empieza con una tarea y deja que los agentes hagan el trabajo pesado.
