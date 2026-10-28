# Cómo usar la alternativa de Adobe creada con Claude

## Photoshop, Premiere, Illustrator y más, sin pagar una suscripción

Un proyecto de código abierto llamado **Craft App Suite** está recreando herramientas similares a las de Adobe desde cero.

Incluye editores de fotografías, video, ilustraciones vectoriales, PDFs y más. Lo interesante es que varias de estas aplicaciones también están diseñadas para trabajar con agentes de inteligencia artificial.

En esta guía te enseño cómo conseguirlas y empezar a utilizarlas.

## 1. Descarga las aplicaciones

No necesitas programar ni instalar Claude para probarlas.

**Paso 1.** Entra al repositorio oficial: https://github.com/storytold/craft-launcher

**Paso 2.** Haz clic en **Download ArtCraft Launcher** o entra directamente a la página de descargas: https://github.com/storytold/craft-launcher/releases/latest

**Paso 3.** Descarga la versión compatible con tu computador:

- **Windows:** descarga el instalador que termina en `windows-x64.msi` si tienes un PC convencional de 64 bits.
- **Mac:** descarga el archivo que termina en `macos-universal.dmg`.
- **Linux:** elige el archivo compatible con tu distribución, como `.AppImage` o `.deb`.

**Paso 4.** Instala y abre ArtCraft Launcher.

**Paso 5.** Dentro de la aplicación encontrarás el catálogo de herramientas disponibles. Selecciona la que quieras probar y utiliza la opción de instalación.

El launcher también permite abrir las aplicaciones instaladas y comprobar si existen actualizaciones.

## 2. Conoce las alternativas a Adobe

### PhotoCraft: alternativa a Photoshop

Sirve para editar imágenes y trabajar con documentos PSD.

Entre sus funciones se incluyen capas, máscaras, texto y filtros.

**Cómo probarlo:**

1. Instala PhotoCraft desde el launcher.
2. Abre la aplicación.
3. Importa una imagen o un archivo PSD.
4. Prueba las capas, los ajustes y los filtros.
5. Guarda o exporta tu trabajo.

Repositorio: https://github.com/storytold/photocraft

### FilmCraft: alternativa a Premiere Pro

Está pensado para edición de video, color y sonido.

**Cómo probarlo:**

1. Instala FilmCraft.
2. Abre un proyecto nuevo.
3. Importa un video de prueba.
4. Explora las herramientas de edición disponibles.
5. Prueba la exportación de un resultado.

Todavía está en desarrollo y no debes asumir que puede abrir tus proyectos de Premiere.

Repositorio: https://github.com/storytold/filmcraft

### VectorCraft: alternativa a Illustrator

Es una herramienta para trabajar con ilustraciones y gráficos vectoriales.

Puedes explorarla para crear elementos gráficos y diseños que necesiten edición vectorial.

Repositorio: https://github.com/storytold/vectorcraft

### PdfCraft: alternativa a Acrobat

Está diseñada para trabajar con documentos PDF.

Entre sus usos están leer, organizar, unir y dividir archivos PDF, dependiendo de las funciones disponibles en la versión instalada.

Repositorio: https://github.com/storytold/pdfcraft

## 3. Otras herramientas que puedes explorar

El proyecto también incluye aplicaciones para diferentes tipos de trabajo:

- **LightCraft:** fotografía y revelado de imágenes RAW.
- **EffectCraft:** efectos visuales y motion graphics.
- **DesignCraft:** diseño editorial y maquetación.
- **WordCraft:** documentos de texto.
- **GridCraft:** hojas de cálculo.
- **DeckCraft:** presentaciones.
- **SoundCraft:** grabación y edición de audio.
- **CADCraft:** diseño asistido por computadora.

Puedes encontrarlas desde el mismo ArtCraft Launcher.

Importante: que una herramienta aparezca en el catálogo no significa que ya tenga todas sus funciones terminadas.

## 4. Lo más interesante: automatización con agentes de AI

Aquí está una de las mayores oportunidades de este proyecto.

Las aplicaciones Craft están desarrollando interfaces de automatización, incluyendo servidores MCP.

### ¿Qué significa MCP?

Es un protocolo que permite conectar herramientas externas con asistentes y agentes de inteligencia artificial.

En lugar de hacer manualmente cada paso, un agente compatible puede interactuar con las funciones que una aplicación expone.

Por ejemplo, imagina que tu equipo necesita procesar 500 fotografías.

En vez de abrirlas una por una, el objetivo sería conectar un agente a PhotoCraft para ejecutar un flujo como este:

1. Abrir las imágenes de una carpeta.
2. Aplicar ajustes similares.
3. Exportar los resultados.
4. Guardarlos en una carpeta de destino.

Para hacerlo necesitarás configurar un cliente de IA compatible con MCP y el servidor de la aplicación correspondiente. No basta con instalar el launcher.

La disponibilidad de cada operación depende de las funciones implementadas y de la versión instalada.

**Si utilizas Claude Code u otra herramienta compatible con MCP**, puedes consultar la documentación técnica de cada repositorio para aprender a conectar sus servidores y crear automatizaciones.

## 5. ¿Realmente puedes reemplazar Adobe?

Todavía no por completo.

Estas herramientas son gratuitas y de código abierto, pero muchas están en fase temprana de desarrollo.

Eso significa que pueden tener errores, funciones incompletas y limitaciones de compatibilidad.

Si trabajas profesionalmente con archivos complejos de Photoshop o Premiere, lo recomendable es probarlas primero con copias de tus proyectos.

**Mi recomendación:** empieza con PhotoCraft o PdfCraft, explora lo que ya funciona y después revisa las posibilidades de automatización.

No necesitas reemplazar todas tus herramientas de inmediato para empezar a aprovechar este proyecto.

## 6. Todos los recursos

**Instalador de la suite:** https://github.com/storytold/craft-launcher

**Descarga directa de la última versión:** https://github.com/storytold/craft-launcher/releases/latest

**Página del proyecto:** https://getartcraft.com

**Código fuente de PhotoCraft:** https://github.com/storytold/photocraft

**Código fuente de FilmCraft:** https://github.com/storytold/filmcraft

**Código fuente de VectorCraft:** https://github.com/storytold/vectorcraft

> 💡 La parte más interesante no es únicamente tener alternativas gratuitas a Photoshop, Premiere o Illustrator.
>
> Es la posibilidad de combinar herramientas creativas de código abierto con agentes de inteligencia artificial para automatizar procesos que antes requerían horas de trabajo manual.
>
> Y puedes empezar a experimentar con ellas desde hoy.
