# Crea anuncios UGC con Claude Code y Arcads

> 💡 **Repositorio:** github.com/mrpaidsocial/arcads-claude-code-mrpaidsocial: https://github.com/mrpaidsocial/arcads-claude-code-mrpaidsocial

## 1. ¿Qué es este repositorio y para qué sirve?

Este repositorio conecta Claude Code con la API de Arcads para que puedas crear piezas publicitarias mediante instrucciones en lenguaje natural.

En lugar de entrar manualmente a una plataforma, configurar cada generación y construir todos los prompts desde cero, Claude puede:

- Entender qué tipo de anuncio quieres producir.
- Elegir el modelo de generación adecuado.
- Construir prompts siguiendo plantillas especializadas.
- Enviar solicitudes a Arcads mediante su API.
- Esperar a que termine la generación.
- Organizar los archivos y guardar referencias.
- Estimar el consumo de créditos antes de generar.

> 💡 **Importante:** no es un modelo de IA gratuito ni una plataforma independiente que genere videos por sí sola. Necesitas una cuenta de Arcads y una API key válida. Las generaciones consumen créditos según el modelo y la configuración.

## 2. ¿Qué puedes crear con este repositorio?

El proyecto tiene varias familias de herramientas. Estas son las más interesantes:

### 1. Videos UGC

Videos que parecen grabados por personas reales, presentando productos, hablando a cámara, contando experiencias y haciendo recomendaciones.

*Modelo recomendado: Seedance 2.0.*

### 2. Anuncios cinematográficos

Videos de productos con efectos, iluminación, rotaciones, transiciones y tomas premium.

*Modelos: Seedance 2.0, Sora 2 y Kling 3.0.*

### 3. Influencers creados con IA

Crear un personaje, generar varias fotografías desde diferentes ángulos y reutilizarlo en diferentes anuncios para mantener consistencia.

*Modelo: Nano Banana.*

### 4. Anuncios estáticos para Meta

Tiene una biblioteca de 37 plantillas de anuncios: estilo Apple Notes, Forbes, comparaciones, conversaciones de WhatsApp, búsquedas de Google, revistas y más.

*Modelos: ChatGPT Image 2 y Nano Banana.*

### 5. Anuncios animados 3D

Crear personajes animados, construir una historia por escenas, generar imágenes y convertirlas en videos.

*Estilos: Pixar y claymation.*

### 6. Miniaturas para YouTube

Generar diferentes versiones de thumbnails, utilizando fotografías de referencia para conservar la identidad de una persona.

También puedes analizar anuncios de referencia, replicar su estructura para otros productos y preparar anuncios para publicar en Meta.

Todo esto está organizado mediante skills especializadas.

## 3. Cómo instalarlo en tu Mac

Vamos a utilizar Claude Code como entorno de trabajo.

Requisitos principales:

| Herramienta | Para qué sirve |
| --- | --- |
| Claude Code | Ejecutar las instrucciones y skills |
| Git | Descargar el repositorio |
| Cuenta Arcads | Acceder a la API |
| API key de Arcads | Autorizar las generaciones |

No necesitas instalar todas las dependencias adicionales desde el principio. Algunas solo se requieren para los flujos avanzados.

### Paso 1. Descargar el repositorio

Abre Terminal en tu Mac y ejecuta:

```
git clone https://github.com/mrpaidsocial/arcads-claude-code-mrpaidsocial.git
```

Después entra a la carpeta:

```
cd arcads-claude-code-mrpaidsocial
```

### Paso 2. Ejecutar la instalación

Desde la carpeta del proyecto ejecuta:

```
chmod +x scripts/setup.sh
./scripts/setup.sh
```

El instalador se encarga de:

1. Solicitar tu API key de Arcads.
2. Guardarla en un archivo `.env`.
3. Comprobar que la conexión funciona.
4. Crear tu archivo personal `MASTER_CONTEXT.md`.

### Paso 3. Conseguir tu API key

Entra al panel de Arcads, en app.arcads.ai/settings/api: https://app.arcads.ai/settings/api, busca la sección de API y copia tu clave.

Si todavía no tienes cuenta, puedes crearla en arcads.ai: https://arcads.ai.

Cuando el instalador solicite la clave, pégala directamente en Terminal.

> 🔒 Nunca compartas tu API key en conversaciones, archivos públicos o repositorios de GitHub. El archivo `.env` está diseñado para mantenerla fuera de Git.

### Paso 4. Abrir el proyecto en Claude Code

Desde la misma carpeta:

```
claude
```

Claude Code leerá las instrucciones del proyecto y cargará las skills disponibles.

El repositorio incluye un sistema de inicio de sesión que muestra información sobre las skills instaladas, la configuración y el contexto del proyecto.

## 4. Configura Claude para que trabaje como tu equipo creativo

Esta es una de las partes más importantes. El repositorio tiene un archivo llamado `MASTER_CONTEXT.md`.

Piensa en él como la memoria de tu equipo creativo.

Allí puedes definir:

- Qué empresa o marca estás trabajando.
- Qué productos vendes.
- Quién es tu público objetivo.
- Cuál es el tono de comunicación.
- Qué estilos visuales utilizas.
- Qué tipo de anuncios te gustan.
- Qué modelos prefieres.
- Cuánto cuestan tus generaciones en créditos.
El agente utiliza este contexto para evitar que tengas que explicar todo en cada conversación.

### Cómo configurarlo

Abre `MASTER_CONTEXT.md` en Claude Code y pídele:

```
Quiero configurar mi MASTER_CONTEXT.md.

Ayúdame a definir:
1. Mi marca y sus productos.
2. Mi audiencia y sus principales problemas.
3. Mi propuesta de valor.
4. Mi tono de comunicación.
5. Mis referencias visuales.
6. Los estilos de anuncios que quiero producir.
7. Mis preferencias de modelos y presupuesto.

Hazme las preguntas necesarias y actualiza el archivo con mis respuestas.
```

> 💡 **Mi recomendación:** configura primero una marca y un producto de prueba antes de comenzar a producir campañas completas.

## 5. Cómo utilizar las skills

Una skill es un conjunto de instrucciones que le enseña a Claude cómo ejecutar una tarea específica.

En este repositorio encontrarás diferentes skills. No necesitas aprender a programarlas: puedes pedirle a Claude que ejecute el flujo correspondiente.

Estas son algunas de las más importantes:

| Skill | Función |
| --- | --- |
| `arcads-external-api` | Conexión y generación mediante Arcads |
| `chatgpt-image-ad` | Anuncios estáticos con ChatGPT Image |
| `nano-banana-image-ad` | Anuncios estáticos con Nano Banana |
| `image-ad-clone` | Analizar y replicar anuncios de referencia |
| `generate-youtube-thumbnail` | Crear miniaturas de YouTube |
| `meta-ad-builder` | Preparar y publicar anuncios en Meta |
| `pixar-style-ad` | Crear anuncios animados 3D |
| `claymation-ad` | Crear anuncios estilo plastilina |

No tienes que memorizar estos nombres. Puedes describir lo que quieres y Claude debería seleccionar la skill correspondiente.

## 6. Cosas que puedes pedirle a Claude

### Caso 1. Crear un video UGC

```
Quiero crear un anuncio UGC de 12 segundos para mi producto.

La protagonista es una mujer de 28 años que está en su cocina, sosteniendo el producto y hablando directamente a cámara.

Quiero que parezca un video grabado con un iPhone, con iluminación natural, movimientos espontáneos y una interpretación auténtica.

Utiliza Seedance 2.0 y la plantilla UGC de este repositorio.

Antes de generar:
1. Propón el guion.
2. Construye el prompt.
3. Muéstrame el costo estimado.
4. Espera mi aprobación.
```

### Caso 2. Crear un influencer con IA

```
Quiero crear un influencer virtual para mi marca.

Será un hombre de 30 años, colombiano, con apariencia natural y estilo de creador de contenido.

Primero crea su retrato principal con Nano Banana.

Cuando lo apruebe, genera otras 9 imágenes:
- Perfil izquierdo y derecho.
- Vista de tres cuartos.
- Primeros planos.
- Diferentes expresiones.
- Diferentes poses.

Quiero mantener la misma identidad facial en todas las imágenes.

Guarda las referencias para reutilizarlas en futuros videos y campañas.
```

### Caso 3. Crear un anuncio estático para Instagram

```
Quiero crear 5 variaciones de anuncios estáticos para Meta Ads.

Producto: [PRODUCTO].
Audiencia: [AUDIENCIA].
Beneficio principal: [BENEFICIO].

Explora las 37 plantillas disponibles en el repositorio y selecciona las cinco que mejor se adapten al producto.

Quiero conceptos visuales diferentes:
1. Estilo Apple Notes.
2. Estilo editorial Forbes.
3. Comparación antes y después.
4. Una conversación ficticia.
5. Una pieza publicitaria minimalista.

Utiliza ChatGPT Image 2 o Nano Banana según la plantilla.

Muéstrame los conceptos antes de generar.
```

### Caso 4. Replicar un anuncio que encontraste

Puedes darle una imagen o un video de referencia y pedirle que analice su estructura para adaptarla a otro producto.

```
Quiero analizar este anuncio de referencia.

Identifica:
- El hook visual.
- La composición.
- La jerarquía del texto.
- Los colores.
- La iluminación.
- El tipo de fotografía.
- La estructura del mensaje.
- Los elementos que hacen que destaque.

Después quiero convertirlo en una plantilla reutilizable para mi producto.

No quiero copiar exactamente la marca original. Quiero conservar el concepto creativo y adaptarlo a nuestra identidad visual.

Utiliza la skill image-ad-clone.
```

### Caso 5. Crear un anuncio animado estilo Pixar

```
Quiero crear un anuncio animado estilo Pixar para promocionar [PRODUCTO].

Quiero que el producto sea un personaje animado con personalidad propia.

Construye una historia de 8 escenas:

1. Presentación del problema.
2. Aparición del personaje.
3. Conflicto.
4. Descubrimiento de la solución.
5. Presentación del producto.
6. Demostración del beneficio.
7. Transformación.
8. Llamado a la acción.

Primero genera la hoja de personajes y el storyboard.
Después de mi aprobación, genera los videos con Seedance 2.0 y ensambla las escenas.

Utiliza la skill pixar-style-ad.
```

## Recursos para aprender más

- Publicación original en X: https://x.com/dravenip/status/2107890789225525312
- Tutorial del creador del repositorio: walkthrough en video del repositorio (YouTube): https://youtu.be/HHGQN9Zqaxo
- Repositorio completo en GitHub: github.com: https://github.com/mrpaidsocial/arcads-claude-code-mrpaidsocial
- Configuración de la API de Arcads: app.arcads.ai: https://app.arcads.ai/settings/api
- Documentación técnica de Arcads: external-api.arcads.ai: https://external-api.arcads.ai/docs
