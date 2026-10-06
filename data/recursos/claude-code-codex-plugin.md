# Cómo trabaja Claude Code + Codex: Plugin Oficial

Cuando tus tokens se acaban a media semana, casi siempre es por lo mismo: arreglar errores gasta más que construir. Esta guía explica cómo dividir el trabajo entre Claude y Codex para reservar el contexto de Claude para pensar, planear y revisar.

## El flujo

**Tú → Claude → Codex → Claude → Tú**

- **Claude:** entiende el problema, analiza el proyecto, crea el plan, decide la arquitectura, divide el trabajo y revisa el resultado.
- **Codex:** escribe código, modifica archivos, hace refactors grandes, investiga errores y ejecuta trabajo repetitivo o largo.

El objetivo no es reemplazar Claude, sino evitar que gaste su límite en tareas que puede delegar.

## Instala el plugin oficial

El plugin es `codex@openai-codex` y su marketplace oficial es `openai/codex-plugin-cc`.

### Paso 1. Agrega el marketplace

```text
/plugin marketplace add openai/codex-plugin-cc
```

### Paso 2. Instala el plugin

```text
/plugin install codex@openai-codex
```

### Paso 3. Recarga los plugins

```text
/reload-plugins
```

### Paso 4. Configura Codex

```text
/codex:setup
```

Si no encuentra Codex, abre una terminal normal e instala el CLI:

```bash
npm install -g @openai/codex
codex login
```

Luego vuelve a Claude Code y ejecuta `/codex:setup`.

## Deja clara la delegación en CLAUDE.md

Claude debe entender, planear, diseñar la arquitectura y revisar todo lo que devuelva Codex. Delega en Codex construcciones repetitivas o largas, refactors grandes, tareas que tocan muchos archivos y errores que Claude ya intentó resolver.

```markdown
## Reparto con Codex

El trabajo se divide entre Claude y Codex.

### Claude

- Entender el problema.
- Preguntar lo que falte.
- Crear el plan.
- Decidir la arquitectura.
- Revisar todo lo que vuelva de Codex.

### Codex

Delegar:

- Construcción repetitiva y larga.
- Refactors grandes.
- Tareas que afectan múltiples archivos.
- Errores que ya fueron intentados y siguen sin resolverse.

### Reglas

- Claude siempre revisa el resultado de Codex.
- Si Codex falla dos veces en la misma tarea, la tarea vuelve a Claude.
- Delegar no significa dejar de supervisar.
- Claude debe informar qué se delegó y qué resultado volvió.
```

## Comandos principales

| Comando | Para qué sirve |
| --- | --- |
| `/codex:setup` | Configurar y comprobar Codex |
| `/codex:review` | Revisar código |
| `/codex:adversarial-review` | Hacer una revisión crítica |
| `/codex:rescue` | Delegar una tarea a Codex |
| `/codex:transfer` | Pasar una conversación completa a Codex |
| `/codex:status` | Ver trabajos activos |
| `/codex:result` | Ver el resultado de un trabajo |
| `/codex:cancel` | Cancelar un trabajo |

`/codex:rescue` es el comando que delega el trabajo pesado.

## Flujo recomendado

1. Pide a Claude que analice el proyecto y cree el plan, sin escribir código.
2. Separa sus decisiones de la ejecución que hará Codex.
3. Cuando Claude se atasque tras dos intentos, usa `/codex:rescue` y entrega el error completo, los intentos previos y criterios de verificación.
4. Cuando Codex termine, pide a Claude que lea los archivos modificados, escriba pruebas y enumere pendientes sin rehacer la implementación.

Para retomar una sesión: `codex resume --last`. Para diagnosticar una instalación: `codex doctor`.

## Límites de uso

Claude consume su límite al analizar, planear, decidir la arquitectura, revisar, probar y documentar. Codex consume el uso de tu cuenta de ChatGPT al escribir código, modificar archivos, revisar y trabajar en tareas largas. Los límites concretos dependen de tu plan y pueden cambiar.
