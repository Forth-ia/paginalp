# Así haces que Claude deje de mentirte (Claude + Firecrawl)

## 1. Qué es y para qué sirve

Alexandria es el catálogo de Firecrawl que le da a Claude acceso a más de 400 proveedores de datos (enriquecimiento de empresas, búsqueda de personas, emails, finanzas, noticias, registros públicos, SEO) a través de una sola conexión. Además de Alexandria, Firecrawl le suma a Claude búsqueda web, scraping de páginas, interacción con sitios y monitoreo de cambios.

El flujo siempre es el mismo, en tres pasos:

1. **Descubrir** la herramienta que sirve (gratis).
2. **Revisar** qué datos pide y cuánto cuesta (gratis).
3. **Ejecutarla** para traer los datos (se cobra en créditos, según el precio listado de cada herramienta).

## 2. Antes de empezar

Necesitas una cuenta de Firecrawl (se crea gratis al conectar) y elegir una de dos rutas según dónde uses Claude. Alexandria no funciona en el modo gratuito sin cuenta: exige una API key o una conexión iniciada con tu cuenta.

| Usas Claude en… | Ruta | Necesitas terminal | Tiempo aprox. |
| --- | --- | --- | --- |
| claude.ai, app de escritorio o móvil | Ruta 1: conector | No | 2 minutos |
| Claude Code (terminal o pestaña Code) | Ruta 2: MCP + CLI | Sí, con Node.js instalado | 5 minutos |

## 3. Ruta 1: claude.ai y la app de Claude (sin terminal)

Se conecta desde el directorio de conectores de Claude, con un clic y sin copiar claves.

1. Abre el [conector de Firecrawl en Claude](https://claude.ai/directory/connectors/firecrawl) con tu sesión de Claude iniciada.
2. Haz clic en **Conectar** (Connect).
3. Se abre Firecrawl: inicia sesión o crea tu cuenta gratis.
4. Autoriza el acceso y elige tu equipo (team) de Firecrawl.
5. Vuelve a Claude y abre un chat nuevo. En el menú de herramientas del chat (botón «+» o el ícono de conectores), confirma que Firecrawl está activado.
6. Si las herramientas no aparecen, recarga la página o reinicia la app.

> 🔒 No pegues una API key en ningún enlace de instalación: el conector maneja la autenticación por su cuenta.

## 4. Ruta 2: Claude Code (MCP + CLI)

En Claude Code conviene instalar dos cosas: el servidor MCP (para que Claude use Firecrawl como herramienta) y el CLI con sus skills (para que lo use desde la terminal). Son independientes: autenticar uno no autentica el otro.

### Paso 0. Revisa si ya lo tienes

Si inicias sesión en Claude Code con tu suscripción de Claude, hereda los conectores de claude.ai. Abre Claude Code, escribe `/mcp` y mira si Firecrawl ya aparece. Si está, salta al paso 2.

### Paso 1. Agrega el servidor MCP

En tu terminal:

```bash
claude mcp add --transport http firecrawl https://mcp.firecrawl.dev/v2/mcp-oauth
```

Luego abre Claude Code, escribe `/mcp`, selecciona firecrawl y completa el inicio de sesión en el navegador (eligiendo tu equipo).

> 💡 Esa URL es para el cliente MCP: no la abras directo en el navegador.

### Paso 2. Instala el CLI y las skills

Requiere Node.js. En la carpeta de tu proyecto:

```bash
npx -y firecrawl-cli@latest init --all --browser
```

Esto instala el comando `firecrawl`, las skills del CLI y las skills de flujos de trabajo (informes de investigación, auditorías SEO, listas de leads), y abre el navegador para iniciar sesión.

Alternativa manual:

```bash
npm install -g firecrawl-cli
firecrawl login
```

### Paso 3. Verifica el CLI

```bash
firecrawl --status
firecrawl scrape "https://firecrawl.dev" -o .firecrawl/install-check.md
```

Si ambos comandos responden sin error, quedó listo. Si algún trabajo falla, `firecrawl doctor <job-id>` diagnostica el problema.

## 5. Probar que funciona

La prueba es simple: pídele a Claude una búsqueda y confirma que responde con enlaces a las fuentes.

### Prueba básica (cualquier ruta)

Escríbele a Claude:

```text
Busca en la web las últimas notas de versión de Firecrawl y resume las fuentes.
```

### Prueba de Alexandria (por MCP)

Pídele algo que necesite un proveedor de datos, por ejemplo:

```text
Usa Firecrawl Alexandria para encontrar una herramienta de enriquecimiento de empresas, muéstrame qué datos pide y cuánto cuesta, y luego tráeme el perfil de una empresa.
```

Claude usará `firecrawl_search` para descubrir la herramienta, `firecrawl_find_tools` para revisar sus datos y precio, y `firecrawl_scrape` para ejecutarla.

### Prueba de Alexandria (por CLI)

Los mismos tres pasos desde la terminal:

```bash
# 1. Descubrir herramientas (gratis)
firecrawl search alexandria 'perfil de una empresa a partir de su dominio'

# 2. Revisar qué pide y cuánto cuesta (gratis)
firecrawl list <proveedor> <capacidad> --pretty

# 3. Ejecutar (cobra créditos)
firecrawl scrape <proveedor>/<capacidad> --options '<JSON con los datos que pide>'
```

Reemplaza `<proveedor>` y `<capacidad>` por los que te devuelva el paso 1.

## 6. Costos y errores comunes

Descubrir y revisar herramientas es gratis; solo pagas créditos al ejecutar una, al precio que muestra cada herramienta. Cada feedback que envías sobre Alexandria devuelve 1 crédito (máximo 100 por equipo al día).

| Problema | Qué hacer |
| --- | --- |
| Las herramientas de Firecrawl no aparecen en Claude | Abre un chat nuevo o reinicia la app; en Claude Code revisa `/mcp` |
| Error `THIRD_PARTY_DATA_TERMS_REQUIRED` | Ese proveedor exige aceptar sus términos: un admin de tu equipo los acepta en el enlace que trae el error |
| Error 401 o «sin autenticar» en el CLI | Ejecuta `firecrawl login --browser` |
| Alexandria no responde sin cuenta | El modo gratuito sin clave no incluye Alexandria; conecta tu cuenta |
| Llamadas rechazadas desde VPN o proxy | Desactiva la VPN o usa tu cuenta autenticada |
| Un trabajo falla sin explicación | `firecrawl doctor <job-id>` |

Tus conexiones activas se revisan y revocan en Connected apps de Firecrawl.

## Fuentes

- Firecrawl Alexandria: https://alexandria.firecrawl.dev/
- Docs de Alexandria: https://docs.firecrawl.dev/features/alexandria
- Guía de conexión MCP (OAuth): https://docs.firecrawl.dev/mcp-server/oauth
- Onboarding para agentes (SKILL.md): https://alexandria.firecrawl.dev/agent-onboarding/SKILL.md
