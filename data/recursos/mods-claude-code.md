# Guía de instalación de Mods para Claude Code

## 1. Instalar los mods del video
Repositorio: AceleraTalent/Mods-Claude (https://github.com/AceleraTalent/Mods-Claude.git)
Abre Claude Code y ejecuta estos comandos, uno por uno.
### Paso 1. Agrega el marketplace de mods
```
/plugin marketplace add AceleraTalent/Mods-Claude
```
### Paso 2. Instala el mod Code Tutor
```
/plugin install code-tutor@aceleratalent-mods
```
### Paso 3. Instala el mod Productivity HUD
```
/plugin install productivity-hud@aceleratalent-mods
```
### Para actualizar los mods más adelante
```
/plugin marketplace update aceleratalent-mods
```
## 2. Instalar cualquier otro mod

- **Con el link del repositorio:** dale a Claude el link del repositorio del mod y pídele que lo clone y lo implemente.
- **Sin el link:** pídele a Claude que busque el mod en la web y luego lo clone e implemente.
- **Hazlo permanente:** una vez probado con éxito, pídele a Claude que lo deje disponible para todas las sesiones.
- **Personalízalo:** si quieres modificar o cambiar un mod hecho por otra persona, Claude te ayuda a crear tu propia versión.

## 3. Crear tu propio mod

- Usa la documentación oficial de Claude como base para el prompt: code.claude.com/docs/en/plugins/mods/overview (https://code.claude.com/docs/en/plugins/mods/overview)
- Pídele a Claude que genere un prompt detallado para construir el mod. Por ejemplo:

```
Necesito usar la nueva herramienta de los Claude Mods para implementar una solución que monitoree los tokens, el contexto y el dinero gastado en todo momento durante el uso de Claude. La idea es estructurarlo de tal manera que sea útil al público que busca el rendimiento y productividad más que los detalles técnicos de todo lo que los tokens y el porcentaje de uso de Claude significan. Tiene que estar completamente centrado en ser visualmente impactante con un buen diseño y una interfaz limpia y profesional. Para esto requiero el prompt que le he de proporcionar a Claude para que cree el mod de acuerdo con la documentación oficial.
```

- Dale el prompt resultante a Claude para que empiece la construcción. Pídele que indique los comandos agregados con los que se usará el mod y que lo deje disponible para todas las sesiones.
- Cuando recibas y pruebes el mod, dale instrucciones de refinamiento si hace falta.

## 4. Prompt técnico (cópialo tal cual)
```
Crea un Claude Mod en TypeScript/JavaScript llamado `claude-productivity-hud` (ubicado dentro de la estructura estándar de plugin: `.claude-plugin/plugin.json` y `hooks/register.js`).

El objetivo principal de este Mod es ser un **HUD (Heads-Up Display) de Productividad y Eficiencia Operativa** altamente pulido, visualmente impactante y enfocado en usuarios orientados al rendimiento (devs senior, tech leads, founders). Debe traducir los datos técnicos de tokens a métricas claras de impacto financiero, capacidad de contexto y presupuesto de sesión.

---

### 1. Requisitos Visuales y UI (Look & Feel)

- **Modo de Visualización Principal:**
    - Implementa un **Band o Dashboard en la parte superior del Prompt Box** (utilizando el hook `ui.render` con componente tipo `Band` o sustituyendo filas relevantes).
    - Adicionalmente, implementa una **Pane (Panel lateral)** activable por comando para ver estadísticas detalladas sin saturar la terminal.
- **Estilo de Diseño:**
    - Interfaz extremadamente limpia, profesional y moderna. Usa barras de progreso con caracteres de alta densidad (e.g., `████████░░ 80%`), códigos de colores claros según el nivel de uso (Verde: Saludable, Amarillo: Precaución, Rojo: Límite crítico).
    - Incluye micro-animaciones o indicadores de estado activos durante el procesamiento (`Spinner` / `Thinking`).

---

### 2. Métricas y Traducción de Datos (Business & Efficiency Focus)

El Mod debe capturar eventos de turno (`turn.*` / `tool.call` / `prompt.*`) para registrar la entrada/salida de tokens y calcular en tiempo real:

1. **Estado del Context Window (Capacidad de Memoria Atten-Span):**
    - Porcentaje de llenado del contexto actual (ej: `45% de capacidad usada`).
    - Indicador visual tipo batería/barra de progreso (`[████░░░░░░]`).
    - Métrica de "Espacio Restante Estimado" en número de mensajes o turnos promedio antes de requerir un `/compact`.
2. **Costo Estimado en Tiempo Real (Inversión Financiera):**
    - Inversión acumulada en USD ($) en la sesión actual calculada sobre tarifas estándar del modelo en uso (Prompt Tokens vs. Completion Tokens).
    - Costo promedio por interacción/turno.
3. **Burn-Rate / Velocidad de Consumo (Productividad):**
    - Tasa de gasto por minuto (ej: `$0.04 / min` o `12k tokens / min`).
    - Un indicador visual de "Eficiencia de Prompt" (relación entre tokens generados vs. tokens consumidos de contexto).

---

### 3. Funcionalidades Interactivas y Comandos Personalizados

Implementa mediante `$.api.addCommand`:

- `/hud`: Alterna (toggle) la visibilidad del Panel lateral con el desglose completo de métricas.
- `/budget [USD]`: Define un límite presupuestario para la sesión. Si el costo acumulado supera el límite, la interfaz debe mostrar una alerta destacada en rojo y sugerir optimizar el contexto.
- `/stats`: Muestra un resumen ejecutivo formateado en markdown en la consola con el ROI de la sesión (tiempo transcurrido vs. costo invertido vs. tareas/tools ejecutados).

---

### 4. Estructura de Implementación Técnica (`hooks/register.js`)

- Utiliza la función `export function register(on)` para registrar los eventos:
    - `on('turn.*')` o intercepción de llamadas para extraer uso de tokens del objeto de evento.
    - `on('ui.render', { component: '...' })` para inyectar la interfaz reactiva mediante `$.ui.invalidate('ui.render')`.
- Almacena el estado global en variables de módulo compartidas (`sessionStats = { inputTokens, outputTokens, totalCost, maxContext, budget }`).

Escribe todo el código limpio, bien documentado y modular dentro de los archivos correspondientes del plugin.
```
