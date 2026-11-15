# Virality Predictor de Higgsfield + Claude

## Qué es

Virality Predictor analiza un video antes de publicarlo. Recibe un clip de hasta quince segundos, vertical u horizontal, y en segundos devuelve un reporte basado en cuatro indicadores principales. Según Higgsfield, entrega un puntaje de viralidad, el momento exacto de mayor fuerza del hook, un hold rate y un mapa de calor que muestra qué regiones del cerebro activa tu clip. Se lanzó el 9 de mayo de 2026.

> 💡 **Requisitos:** una suscripción paga y activa de Higgsfield y una cuenta de Claude. No se necesita API key ni configuración adicional.

## Paso 1: Conectar Higgsfield a Claude (web o app de escritorio)

1. Abre claude.ai, haz clic en tu ícono de perfil y entra a **Settings → Connectors**.
2. Haz clic en **Add custom connector**.
3. Ponle de nombre: `Higgsfield`
4. Pega la URL del servidor MCP: `https://mcp.higgsfield.ai/mcp`
5. Haz clic en **Connect**: se abre una ventana de autorización de Higgsfield. Inicia sesión con tu cuenta de Higgsfield y autoriza.

> 💡 En Claude Desktop los pasos son iguales: Settings (menú superior, o Cmd+, en Mac) → Connectors → Add custom connector, pegas `https://mcp.higgsfield.ai/mcp`, haces clic en Connect y autorizas con tu cuenta de Higgsfield.

La conexión se hace una sola vez: el conector queda ligado a tu cuenta, así que está disponible en Claude Web, Desktop y Cowork. Cuando ya está conectado a tu cuenta, Claude en el celular también lo puede usar.

### Paso 1 (alternativo): Claude Code desde la terminal

Un solo comando agrega el conector:

```bash
claude mcp add higgsfield https://mcp.higgsfield.ai/mcp
```

> 💡 **Ojo:** para Claude Code y Codex, Higgsfield recomienda usar su CLI en vez del conector visual. El CLI se instala de forma global con npm, se autentica en la terminal y opcionalmente trae los skills empaquetados de Higgsfield. El repositorio oficial del CLI es [github.com/higgsfield-ai/cli](https://github.com/higgsfield-ai/cli).

### Si da error al conectar

Claude puede mostrar "Couldn't reach the MCP server" o "Authorization with the MCP server failed" al agregar el conector. Revisa que la URL sea exactamente `https://mcp.higgsfield.ai/mcp` y que tu suscripción de Higgsfield esté activa. En planes de Anthropic administrados (Team/Enterprise), puede que un administrador tenga que habilitar primero la URL del MCP de Higgsfield.

## Paso 2: Usar Virality Predictor desde Claude

1. Abre un chat nuevo en Claude y verifica que el conector Higgsfield esté activo (en el menú de herramientas del chat).
2. Adjunta tu video (máximo 15 segundos) o pásale el link.
3. Escribe algo como el prompt de abajo.
4. Claude sube el video a Higgsfield, lanza el análisis y te devuelve un dashboard interactivo con los resultados.
5. Para volver a abrir un análisis anterior, usa el segundo prompt. La herramienta reabre el dashboard existente sin volver a analizar.

```text
Analiza este video con el Virality Predictor de Higgsfield y dime el puntaje de viralidad, hook score, hold rate y qué debería cambiar.
```

```text
Ábreme otra vez el reporte de Virality Predictor del video X.
```

También funciona con videos que hayas generado dentro de Higgsfield: le puedes pedir a Claude que genere el video y después lo pase directo por el predictor.

## Flujo recomendado para anuncios

1. Importa el brand deck a Claude para sacar ideas.
2. Genera anuncios estilo UGC con Higgsfield.
3. Filtra los creativos con el Virality Predictor.
4. Evalúa los puntajes, la fuerza del hook y el hold rate. Luego itera sobre la versión con el puntaje más alto y expórtala en el formato nativo de cada plataforma.

## Costo

Cuando salió, el predictor estaba gratis como preview experimental, sin consumir créditos. Sin embargo, Higgsfield dice que cada generación hecha a través del conector usa créditos, y los modelos ilimitados y las generaciones gratis no aplican. Revisa tu saldo en Higgsfield antes de analizar muchos videos.

## Límites

- Solo clips de hasta 15 segundos. Si tu reel dura más, analiza los primeros 15 segundos (hook + Lock-In Zone).
- El puntaje es una predicción, no una garantía. Úsalo para comparar versiones de un mismo video, no como verdad absoluta.

## Fuentes

- [Higgsfield: Virality Predictor](https://higgsfield.ai/es/apps/virality-predictor)
