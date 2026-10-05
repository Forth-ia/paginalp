# Convierte Claude en una máquina de leads

## Parte 1 · Conectar Claude con Composio

### Paso 1. Crea tu cuenta de Composio

Entra a [Composio](https://composio.dev/).

Crea una cuenta e inicia sesión.

Composio actualmente ofrece integraciones con más de 1.500 aplicaciones y utiliza MCP para darle acceso a esas herramientas a agentes como Claude.

### Paso 2. Abre Claude

Necesitas utilizar Claude con soporte para Connectors/MCP.

En Claude ve a:

**Settings → Connectors → Add custom connector**

Composio indica que este procedimiento funciona con Claude Web, Desktop y Cowork.

### Paso 3. Agrega Composio

En el campo del servidor MCP agrega:

```
https://connect.composio.dev/mcp
```

Ese es el endpoint MCP que Composio proporciona actualmente para conectarlo a herramientas compatibles.

Ponle como nombre:

```
Composio
```

Después haz clic en **Connect**.

Se abrirá el proceso de autorización de Composio.

## Parte 2 · Conectar Google Sheets

Ahora necesitamos darle a Claude un lugar donde guardar los leads.

### Paso 4. Autoriza Google Sheets

Una vez conectado Composio, dile a Claude:

```
Conecta mi cuenta de Google Sheets mediante Composio.
```

Claude debería llevarte al proceso de autorización.

Autoriza la cuenta de Google que quieras utilizar.

Composio permite conectar Google Sheets y ejecutar acciones como crear hojas, actualizar filas y modificar datos.

## Parte 3 · Conectar Google Maps

Ahora viene la parte interesante.

### Paso 5. Conecta Google Maps

En Claude escribe:

```
Conecta Google Maps mediante Composio.
```

Autoriza la cuenta cuando te la solicite.

Composio tiene actualmente una integración específica de Google Maps para Claude.

## Parte 4 · Crear tu primera base de leads

Antes de pedirle 1.000 leads, haz una prueba pequeña.

### Paso 6. Crea la estructura del Sheet

Puedes decirle a Claude:

```
Crea un Google Sheet llamado "Leads Inmobiliarias Colombia".

Quiero estas columnas:

Empresa
Categoría
Ciudad
Dirección
Teléfono
WhatsApp
Sitio web
Google Maps
Calificación
Fuente
Estado
Notas
```

Claude debería crear la estructura utilizando Google Sheets a través de Composio.

## Parte 5 · Hacer que Claude busque los leads

### Paso 7. Haz una búsqueda pequeña

Pídele:

```
Busca 20 inmobiliarias en Bogotá, Colombia.

Para cada empresa intenta obtener:

- Nombre
- Teléfono
- WhatsApp si está disponible
- Sitio web
- Dirección
- Ciudad
- Enlace de Google Maps

No inventes ningún dato.

Si un dato no está disponible, déjalo vacío.

Cuando termines, agrega todos los resultados al Google Sheet "Leads Inmobiliarias Colombia".

Antes de escribir los datos, revisa que no haya duplicados.
```

Esto te permite comprobar que **la conexión funciona antes de hacer una extracción grande**.

## Parte 6 · Escalar la prospección

Cuando la prueba funcione, puedes aumentar el volumen.

Por ejemplo:

```
Ahora continúa buscando inmobiliarias en Colombia.

Prioriza:

Bogotá
Medellín
Cali
Barranquilla
Cartagena
Bucaramanga
Pereira

Busca empresas diferentes a las que ya están en el Sheet.

Para cada empresa intenta obtener:

- Nombre
- Teléfono
- WhatsApp
- Sitio web
- Dirección
- Ciudad
- Google Maps

No inventes información.

Elimina duplicados.

Agrega los resultados directamente al Google Sheet.

Trabaja por lotes y continúa hasta conseguir la mayor cantidad de leads disponibles.
```

## Parte 7 · Mejorar la calidad del lead

Aquí es donde deja de ser simplemente scraping.

Puedes pedirle a Claude que clasifique los leads.

Por ejemplo:

```
Analiza todos los leads del Sheet.

Clasifica cada empresa según:

A = empresa claramente relevante y con información de contacto completa
B = empresa relevante pero con información incompleta
C = empresa poco relevante o con información insuficiente

Además identifica:

- Tiene teléfono
- Tiene WhatsApp
- Tiene sitio web
- Tiene email
- Tiene presencia digital

Agrega estas columnas al Sheet.
```

Ahora tienes una base mucho más útil para ventas.

## Parte 8 · Preparar el Sheet para Dapta

Ahora entra [Dapta](https://dapta.ai/ai-calls-register-v1-gad/).

Dapta permite cargar listas de contactos mediante CSV, Excel o Google Sheets y crear campañas/secuencias de llamadas.

### Paso 8. Revisa tus columnas

Para la campaña, asegúrate de tener como mínimo:

```
Nombre
Empresa
Teléfono
Ciudad
Website
```

Y puedes añadir:

```
Tipo de empresa
Servicio
Presupuesto
Estado
Notas
```

**No necesitas que todo esté lleno.**

Pero sí necesitas teléfonos válidos para una campaña de llamadas.

## Parte 9 · Crear el agente de voz

Dentro de Dapta crea un **AI Voice Agent**.

Dale contexto sobre:

### Quién eres

Ejemplo:

```
Somos una empresa que ayuda a inmobiliarias a generar más oportunidades comerciales utilizando AI.
```

### A quién llamas

```
Estamos contactando propietarios, gerentes o responsables comerciales de inmobiliarias.
```

### Objetivo

```
El objetivo de la llamada es determinar si la empresa está interesada en conocer una solución de AI para mejorar su proceso comercial y, si existe interés, agendar una reunión.
```

Dapta permite definir reglas de calificación y extraer variables como nombre, presupuesto, intención y resultado de la llamada.

## Parte 10 · Define las preguntas de calificación

Por ejemplo:

```
1. ¿Actualmente tienen un equipo comercial?

2. ¿Cómo consiguen nuevos clientes actualmente?

3. ¿Cuántos leads reciben aproximadamente al mes?

4. ¿Cómo hacen seguimiento a esos leads?

5. ¿Utilizan algún CRM?

6. ¿Estarían interesados en automatizar parte de este proceso?

7. ¿Quién es la persona encargada de tomar esta decisión?
```

No quieres que el agente simplemente diga:

> “¿Quieres comprar?”

Quieres que **diagnostique**.

## Parte 11 · Define qué es un lead calificado

Por ejemplo:

```
Considera un lead CALIFICADO cuando:

- Es una inmobiliaria activa.
- Tiene un equipo comercial o recibe leads.
- Tiene interés en mejorar su proceso comercial.
- Tiene autoridad o acceso al responsable de decisión.
- Está dispuesto a conocer la solución.

Considera NO CALIFICADO cuando:

- No está interesado.
- No corresponde al perfil.
- El teléfono no corresponde a la empresa.
- Solicita no volver a ser contactado.
```

Esto hace que la llamada produzca **datos accionables**, no solamente conversaciones.

## Parte 12 · Carga los leads

En Dapta puedes cargar tu lista desde Google Sheets, CSV o Excel.

Selecciona tu archivo/lista.

Mapea los campos:

```
Nombre → Nombre
Empresa → Empresa
Teléfono → Phone
Ciudad → Ciudad
Website → Website
```

Y cualquier otro campo personalizado que quieras utilizar.

## Parte 13 · Configura la campaña

Ahora defines:

**Horario de llamadas**

Por ejemplo:

```
Lunes - Viernes
9:00 AM - 5:00 PM
```

También puedes configurar intentos de seguimiento.

Dapta permite definir ventanas de llamada y reglas de reintento para campañas/secuencias.

Por ejemplo:

```
Intento 1 → Día 1
Intento 2 → Día 3
Intento 3 → Día 7
```

## Parte 14 · No lances 1.000 de una

Este paso es MUY importante.

Empieza con:

**10–20 leads.**

Escucha las llamadas.

Revisa:

- ¿El agente se presenta bien?
- ¿Pronuncia correctamente el nombre de la empresa?
- ¿Hace preguntas demasiado rápido?
- ¿Entiende las respuestas?
- ¿Califica correctamente?
- ¿Agenda reuniones?
- ¿Está hablando demasiado?
- ¿Los leads piden no ser contactados?

Después ajustas el agente.

Luego:

**20 → 50 → 100 → 500 → escala.**

## Parte 15 · El resultado final

Cuando esté funcionando, tienes algo así:

### 1. Prospección

Claude + Composio → Busca empresas → Extrae información → Guarda leads.

### 2. Base de datos

Google Sheets → Nombre, empresa, teléfono, website, ciudad, estado, etc.

### 3. Outbound

Dapta → Llama automáticamente → Conversa → Califica.

### 4. Resultado

- **INTERESADO** → Agenda reunión.
- **NO INTERESADO** → No continúa.
- **NO CONTESTÓ** → Reintenta según la secuencia.

## El prompt maestro para Claude

Una vez tengas todo conectado, puedes incluso empezar con algo como:

```
Quiero construir una campaña de prospección para inmobiliarias en Colombia.

1. Busca empresas relevantes.
2. Obtén nombre, teléfono, WhatsApp, sitio web, ciudad y dirección cuando estén disponibles.
3. No inventes información.
4. Elimina duplicados.
5. Guarda los resultados en mi Google Sheet "Leads Inmobiliarias Colombia".
6. Clasifica cada lead según la calidad de la información.
7. Prioriza empresas con teléfono válido y presencia digital.
8. Trabaja por lotes y continúa hasta obtener la mayor cantidad de leads que puedas encontrar.
9. Antes de terminar, revisa que no existan duplicados.

No necesito que me expliques cómo hacerlo.
Ejecuta las acciones utilizando las herramientas que tienes conectadas.
```
