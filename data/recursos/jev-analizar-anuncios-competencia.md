# Cómo usar Jev para analizar los anuncios de tu competencia

## Qué es Jev

Jev es el clasificador de TypeSafe. Le mandas un anuncio (el copy y una imagen) junto con una lista fija de preguntas, y te devuelve una categoría por pregunta con su nivel de confianza. Por ejemplo: qué formato tiene, qué tipo de hook abre el anuncio, qué oferta hace y para qué nivel de consciencia está escrito.

Es barato: cobra por tokens de entrada (USD 0,042 por millón) y los de salida son gratis. Clasificar 150 anuncios cuesta unos centavos.

> 💡 **Requisitos:** una API key de TypeSafe (se crea en console.typesafe.ai/keys), Node 22 o superior y Claude Code.

## Qué construimos: Ad Intel

Con Jev creamos **Ad Intel**, una app local que analiza los anuncios de cualquier empresa. Le das una marca, recorre todos sus anuncios en la Meta Ad Library, los clasifica con Jev y los ordena por **días activo**.

La tesis es simple: nadie sigue pagando un anuncio que no funciona. Cuanto más tiempo lleva corriendo un anuncio, más probable es que sea rentable. Si cruzas los días activo con el tipo de anuncio (formato, hook, oferta, ángulo y nivel de consciencia), ves qué estrategias le funcionan a cada marca. Así puedes estudiar a tu competencia con datos, no con intuición.

## Cómo funciona

1. **Scrapear.** Un navegador Chromium sin ventana abre la Ad Library pública de Meta (no hace falta iniciar sesión) y captura los anuncios con sus fechas, el copy y las miniaturas.
2. **Descargar creativos.** Las miniaturas se guardan en local, porque las URLs de Meta caducan en pocos días.
3. **Clasificar con Jev.** Se envía cada anuncio (copy + miniatura) a Jev con una lista fija de preguntas. Jev responde con una categoría por pregunta y su nivel de confianza.
4. **Visualizar.** Una app en React grafica una fila por categoría y un punto por anuncio, ordenados por días activo.

## Paso 1. Construye la app con el prompt maestro

Crea una carpeta vacía, abre Claude Code dentro de ella y pega el prompt maestro completo. Describe la app entera: el scraper, el cliente de Jev, las preguntas de clasificación, la interfaz y el orden en que se debe construir y probar.

[[PROMPT_MAESTRO]]

## Paso 2. Lo único manual

1. Entra a facebook.com/ads/library, busca la marca y abre su página.
2. Copia la URL completa de esa página (lleva `view_all_page_id=`).

## Paso 3. Prepara la herramienta (una sola vez)

```text
En esta carpeta está Ad Intel. Déjala lista para usar:
1. Verifica que Node sea 22 o superior; si no, dime cómo actualizarlo y para.
2. Corre npm install.
3. Instala Chromium con npx playwright-core install chromium y anota la ruta del ejecutable.
4. Crea .env a partir de .env.example y pon esa ruta en CHROMIUM_PATH.
5. Pídeme mi TYPESAFE_API_KEY (se crea en console.typesafe.ai/keys) y guárdala en .env sin mostrarla ni enviarla a ningún otro sitio.
6. Corre npm run typecheck y confírmame en una línea que todo quedó listo.
```

## Paso 4. Analiza una marca y mira las analíticas

Cambia lo que está entre corchetes y pégalo cada vez que quieras analizar una marca nueva.

```text
Analiza esta marca con Ad Intel: [PEGA AQUÍ LA URL DE LA AD LIBRARY]
Nombre para mostrar: [NOMBRE DE LA MARCA]

1. Saca el page id de view_all_page_id en la URL y un slug corto sin espacios a partir del nombre.
2. Corre npm run scrape -- --page <id> --slug <slug> --label "<nombre>" --limit 150.
3. Corre npm run classify -- <slug> --estimate y, si cuesta menos de $0.10, sigue sin preguntarme.
4. Corre npm run classify -- <slug>.
5. Arranca npm run dev en segundo plano y dame el enlace http://localhost:5173.
6. Lee public/data/<slug>.json y resume en una frase por dimensión (formato, hook, oferta, ángulo y consciencia) qué categoría dura más, con su mediana de días activo y cuántos anuncios tiene; ignora las categorías con menos de 3 anuncios.
7. Si algo falla, diagnostica la causa, arréglala y vuelve a intentarlo antes de avisarme.
```

## Paso 5. Compara dos marcas (opcional)

```text
Compara los análisis de Ad Intel de [SLUG 1] y [SLUG 2] que están en public/data.
Para formato, hook y oferta, dime en una tabla qué categoría le dura más a cada marca (mediana de días activo, mínimo 3 anuncios) y cierra con una frase sobre la mayor diferencia entre las dos.
```

## Límites

- Jev no acepta video, así que los videos se clasifican por su miniatura y su copy, no por el audio.
- Los días activo de un anuncio terminado son fin menos inicio; los de uno activo, hoy menos inicio.
- El scraper depende del HTML y del GraphQL de Meta: si cambian el formato, hay que ajustarlo.
- La API oficial de Meta solo cubre anuncios entregados en la UE. Por eso la app usa la versión web pública de la Ad Library.
- Muchos días activo es una señal, no una prueba de rentabilidad. Úsalo para encontrar patrones, no como verdad absoluta.
