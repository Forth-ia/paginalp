# Fable orquesta, Codex ejecuta

## Cómo hacer que Fable piense y Codex construya sin quemar tus límites de Claude

Convierte Fable en el orquestador: entiende el proyecto, crea el plan y revisa. Codex se encarga de la construcción pesada mediante el plugin oficial de OpenAI para Claude Code.

## La regla de oro

**Fable piensa y revisa. Codex construye.**

Fable explora el proyecto, hace preguntas, decide la arquitectura, divide el trabajo y revisa. Codex escribe código, modifica archivos, construye funcionalidades, hace refactors y ejecuta el plan.

## Flujo

1. Fable explora y propone el plan, sin escribir código.
2. Tú apruebas el plan.
3. Fable delega cada tarea aprobada con `/codex:rescue`.
4. Codex ejecuta, prueba y entrega un resumen.
5. Fable revisa con `/codex:review`.

Para proyectos grandes, divide el trabajo en tareas pequeñas con objetivo, archivos, restricciones, criterio de terminado y pruebas. Si Fable falla dos veces con el mismo error, delega la investigación a Codex con el error, intentos previos, configuración y logs relevantes.
