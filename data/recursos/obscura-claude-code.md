# Cómo conectar Obscura a Claude Code y automatizar el navegador con AI

## El comando exacto para conectar Obscura

Claude Code + Obscura

Ejecuta este comando en tu terminal:

```
claude mcp add obscura /path/to/obscura mcp
```

Importante: reemplaza `/path/to/obscura` por la ruta real del ejecutable que descargaste.

## ¿Qué es Obscura?

![README de Obscura: descripción, métricas reportadas e instalación](/assets/img/recursos/obscura-claude-code.jpeg)

Obscura es un motor de navegador headless de código abierto, escrito en Rust y diseñado para agentes de AI, automatización web y extracción de datos.

Ejecuta JavaScript mediante V8, admite el protocolo Chrome DevTools (CDP) y permite integrar herramientas de navegación con clientes de AI compatibles con MCP.

Una de sus principales diferencias frente a navegadores tradicionales es que no necesita Chromium. Según las cifras reportadas por el proyecto, esto puede reducir considerablemente el consumo de recursos.

| Métrica reportada | Obscura | Chrome headless |
| --- | --- | --- |
| Memoria | ~30 MB | 200+ MB |
| Tamaño del binario | ~70 MiB | 300+ MB |
| Carga típica de página | ~85 ms | ~500 ms |
| Inicio | Casi instantáneo | ~2 segundos |

Estas cifras son estimaciones reportadas por el proyecto, no resultados de una prueba independiente. El rendimiento real depende de la página, el equipo y la configuración.

> 💡 Obscura puede ser especialmente útil cuando los agentes consumen demasiada memoria, los procesos de scraping tardan mucho o necesitas automatizar múltiples páginas. También ofrece un modo stealth para modificar ciertas características de detección, aunque no garantiza que un sitio permita la automatización.

## Paso 1. Comprueba los requisitos

Antes de comenzar, asegúrate de tener:

- Claude Code instalado y funcionando.
- Un equipo con macOS, Linux o Windows.
- Acceso a la terminal.
- Permisos para descargar y ejecutar programas.

Importante: utiliza la automatización únicamente en sitios a los que tengas autorización para acceder. Respeta los límites de solicitudes, las condiciones del servicio, la privacidad y las restricciones de acceso.

## Paso 2. Descarga Obscura

Abre el repositorio oficial y descarga la versión correspondiente a tu sistema operativo.

> 💡 [Repositorio oficial](https://github.com/h4ckf0r0day/obscura)

> 💡 [Busca el archivo compatible con tu sistema y arquitectura](https://github.com/h4ckf0r0day/obscura/releases/tag/v0.2.5)

### macOS — Apple Silicon

Para equipos con procesadores de la serie M de Apple:

```
curl -LO https://github.com/h4ckf0r0day/obscura/releases/latest/download/obscura-aarch64-macos.tar.gz
tar xzf obscura-aarch64-macos.tar.gz
chmod +x obscura
```

### macOS — Intel

```
curl -LO https://github.com/h4ckf0r0day/obscura/releases/latest/download/obscura-x86_64-macos.tar.gz
tar xzf obscura-x86_64-macos.tar.gz
chmod +x obscura
```

### Linux — x86_64

```
curl -LO https://github.com/h4ckf0r0day/obscura/releases/latest/download/obscura-x86_64-linux.tar.gz
tar xzf obscura-x86_64-linux.tar.gz
chmod +x obscura
```

### Linux — ARM64

```
curl -LO https://github.com/h4ckf0r0day/obscura/releases/latest/download/obscura-aarch64-linux.tar.gz
tar xzf obscura-aarch64-linux.tar.gz
chmod +x obscura
```

### Windows

1. Abre la página de versiones de Obscura.
2. Descarga el archivo ZIP correspondiente a Windows.
3. Descomprímelo en una carpeta permanente.
4. Localiza `obscura.exe` y copia su ruta completa.

> 💡 Los archivos de distribución pueden incluir tanto `obscura` como `obscura-worker`. Si vas a utilizar scraping paralelo, conserva ambos ejecutables en el mismo directorio.

## Paso 3. Comprueba que Obscura funciona

Antes de conectarlo con Claude Code, verifica que el ejecutable puede abrir una página web.

En macOS o Linux, desde la carpeta donde descargaste el programa, ejecuta:

```
./obscura fetch https://example.com --eval "document.title"
```

En Windows PowerShell:

```
.\obscura.exe fetch https://example.com --eval "document.title"
```

¿Qué debería pasar?

Obscura debe abrir la página y devolver su título. Si no funciona, revisa que el ejecutable sea el correcto y que tenga permisos de ejecución.

Si tu sistema operativo bloquea el archivo, verifica primero que proviene del repositorio oficial antes de autorizar su ejecución.

## Paso 4. Encuentra la ruta completa del ejecutable

Claude Code necesita saber exactamente dónde está instalado Obscura.

### En macOS o Linux

Desde la carpeta que contiene el ejecutable, ejecuta:

```
pwd
```

El comando mostrará la ruta del directorio actual. Añade `/obscura` al final.

Por ejemplo:

```
/Users/tuusuario/tools/obscura/obscura
```

### En Windows

En el Explorador de archivos, haz clic derecho sobre `obscura.exe` mientras mantienes pulsada la tecla Shift y selecciona la opción para copiar la ruta como texto. Utiliza esa ruta en la configuración de Claude Code.

## Paso 5. Conecta Obscura con Claude Code

Ahora registra Obscura como un servidor MCP. MCP permite que Claude Code descubra y utilice herramientas externas compatibles.

Ejecuta el comando reemplazando la ruta de ejemplo por la que obtuviste en el paso anterior.

macOS:

```
claude mcp add obscura /Users/tuusuario/tools/obscura/obscura mcp
```

Linux:

```
claude mcp add obscura /home/tuusuario/tools/obscura/obscura mcp
```

Windows PowerShell:

```
claude mcp add obscura C:\Tools\Obscura\obscura.exe mcp
```

Una vez registrado el servidor, reinicia Claude Code y comprueba que las herramientas de Obscura estén disponibles.

Si tu ruta contiene espacios, consulta la sintaxis de argumentos de tu terminal y de la versión de Claude Code que utilizas para asegurarte de que la ruta se interpreta como un único argumento.

## Paso 6. Verifica la conexión

Abre Claude Code y envíale esta instrucción:

Prompt de prueba

```
Utiliza las herramientas del navegador Obscura para abrir
https://example.com, leer el título de la página y resumir
el texto visible.

Indícame qué herramientas de Obscura utilizaste.
```

Si todo está correctamente configurado, Claude debería poder utilizar las herramientas del navegador para acceder a la página y resumir su contenido.

### ¿Qué hacer si Claude no encuentra las herramientas?

1. Verifica que la ruta del ejecutable sea correcta.
2. Repite la prueba del paso 3.
3. Elimina y registra de nuevo el servidor MCP con la ruta correcta.
4. Cierra y reinicia Claude Code por completo.
5. Comprueba que el sistema operativo no haya puesto el archivo en cuarentena ni haya bloqueado su ejecución.

Puedes consultar también la guía oficial de configuración MCP de Obscura en el repositorio.

## Paso 7. Activa el modo stealth cuando sea necesario

Obscura incluye un modo stealth que modifica determinadas señales del navegador para reducir la detección automatizada y bloquear rastreadores.

Si necesitas activarlo en la configuración del servidor MCP, el comando y sus argumentos quedan así:

```
{
  "mcpServers": {
    "obscura": {
      "command": "/path/to/obscura",
      "args": ["mcp", "--stealth"]
    }
  }
}
```

Reemplaza `/path/to/obscura` por la ruta real del ejecutable.

Mi recomendación es empezar sin este modo y habilitarlo solo cuando exista una necesidad legítima. No garantiza acceso a una web ni autoriza a evadir sistemas de autenticación, restricciones explícitas o controles de acceso.

## Paso 8. Dale a Claude instrucciones precisas para navegar

Conectar el navegador es solo una parte del proceso. Para conseguir buenos resultados, debes definir qué información quieres, cuántas páginas puede revisar y cómo debe entregarte los datos.

Utiliza esta plantilla como punto de partida:

Plantilla de automatización web

```
Utiliza Obscura para realizar esta tarea de navegación.

Objetivo: [resultado exacto que necesito]
URL inicial: [dirección de la página]
Datos necesarios: [campos que quiero obtener]
Máximo de páginas: [número]
Formato de salida: [tabla Markdown / JSON / CSV]

Reglas:
- No inicies sesión ni envíes formularios sin mi autorización.
- No modifiques información sin preguntarme primero.
- Respeta los límites de solicitudes y detente si se deniega el acceso.
- Incluye la URL de origen de cada resultado.
- Indica los campos faltantes en lugar de inventar datos.
- Guarda resultados intermedios cada [número] de páginas.
```

### Ejemplo práctico: investigación de empresas

Imagina que quieres analizar empresas de un directorio público y organizar la información en una tabla.

```
Utiliza Obscura para revisar las primeras 25 empresas
de este directorio público.

Recopila:
- Nombre de la empresa
- Sitio web
- Categoría
- Ubicación
- URL de la fuente

Devuelve los resultados en una tabla Markdown.
No abras páginas que requieran iniciar sesión, no envíes
formularios ni recopiles datos personales de contacto.
```

Este enfoque permite convertir una tarea manual de investigación en un proceso estructurado y repetible, siempre que el sitio permita ese tipo de acceso.

## Comandos útiles de Obscura

### 1. Extraer texto legible

```
obscura fetch https://example.com --dump text
```

Obtiene el texto de una página para analizar su contenido.

### 2. Extraer enlaces

```
obscura fetch https://example.com --dump links
```

Recopila los enlaces encontrados en la página.

### 3. Esperar a que cargue una página dinámica

```
obscura fetch https://example.com --wait-until networkidle0
```

Espera a que la actividad de red se estabilice; en algunas webs esto puede tardar demasiado.

### 4. Guardar una captura de pantalla

```
obscura fetch https://example.com --screenshot page.png
```

Guarda una captura de la página en un archivo.

### 5. Procesar varias URLs en paralelo

```
obscura scrape https://example.com https://example.org \
  --concurrency 10 \
  --format json
```

Procesa varias direcciones y devuelve los resultados en JSON. Ajusta la concurrencia a los límites del sitio.

### 6. Iniciar un servidor CDP local

```
obscura serve --port 9222
```

Inicia un servidor local compatible con Chrome DevTools Protocol.

Verifica las opciones disponibles en la documentación de la versión instalada, ya que los argumentos pueden cambiar entre versiones.

## Solución de problemas

| Problema | Qué puedes hacer |
| --- | --- |
| `Command not found` | Utiliza la ruta completa o añade el directorio al `PATH`. |
| `Permission denied` | En macOS o Linux, ejecuta `chmod +x /path/to/obscura`. |
| Una página pesada no termina de cargar | Ajusta el tiempo de espera o la condición de carga. |
| La web local está bloqueada | Comprueba la protección contra SSRF y consulta las instrucciones específicas para entornos locales. |
| El sitio sigue bloqueando la automatización | Reduce la concurrencia, respeta sus reglas y utiliza su API oficial si está disponible. |

### Acceso a un servidor local de desarrollo

Obscura bloquea por defecto determinadas direcciones IP privadas e internas como protección contra solicitudes del lado del servidor (SSRF).

Si necesitas probar un servidor local de confianza, la documentación del proyecto contempla una opción para permitir la red privada:

```
obscura fetch http://127.0.0.1:3000 --allow-private-network --dump text
```

Utilízala únicamente en un entorno controlado. No la habilites indiscriminadamente para navegar por sitios externos.

## Recursos oficiales

- [Repositorio de Obscura en GitHub](https://github.com/h4ckf0r0day/obscura)
- [Últimas versiones y descargas](https://github.com/h4ckf0r0day/obscura/releases/latest)
- [Documentación oficial para configurar MCP](https://github.com/h4ckf0r0day/obscura#readme)
