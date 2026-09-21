Claude tiene una serie de plugins especializados para equipos legales que permiten automatizar tareas como revisión de contratos, triage de NDAs, investigación, preparación de briefs y seguimiento de asuntos.

La verdadera potencia aparece cuando configuras Claude con **el playbook, las posiciones y la forma de trabajar de tu equipo**.

---

## 1. ¿Qué necesitas?

Necesitas Claude con acceso a plugins y, para los flujos más potentes, **Claude Cowork**.

Los plugins están disponibles en los planes pagos de Claude. Se pueden utilizar desde Claude web, Desktop y Cowork; algunas capacidades específicas, como hooks y subagentes, funcionan dentro de Cowork.

---

## 2. Instala el marketplace Legal

En Claude:

:::callout
💡

**Personalizar → Plugins → + → Agregar marketplace → Explorar fuentes de Anthropic → Legal**

:::

Agrega el marketplace Legal y después podrás explorar los plugins disponibles para trabajo legal.

También puedes instalar plugins directamente desde el directorio cuando estén disponibles.

### PASO 1 — Abre Cowork

Entra a Claude Cowork.

### PASO 2 — Plugins

Ve a: **Personalizar → Plugins**

### PASO 3 — Agrega Legal

Si todavía no aparece el marketplace Legal:

**+ → Agregar marketplace → Explorar fuentes de Anthropic → Legal**

### PASO 4 — Instala el plugin que necesites

---

## 3. Los principales plugins legales

Claude está evolucionando de un único "plugin Legal" hacia varios plugins especializados por área de práctica.

Entre ellos encontrarás experiencias para:

- Commercial Legal
- Litigation Legal
- Corporate Legal
- IP
- y otras áreas

La idea es que cada plugin tenga skills adaptadas a un tipo de trabajo legal específico.

---

## 4. Commercial Legal

Este es especialmente útil para contratos comerciales, NDAs y acuerdos con proveedores.

Sus skills incluyen:

### `/review`

Revisa un:

- NDA
- vendor agreement
- SaaS subscription
- contrato comercial

contra el playbook configurado.

Puede identificar excepciones y clasificarlas según el nivel de atención requerido.

### `/stakeholder-summary`

Convierte una revisión legal en un resumen que pueda entender fácilmente la persona de negocio que necesita tomar la decisión.

Por ejemplo:

En lugar de entregar un análisis jurídico de varias páginas, puedes obtener:

**Qué cambió → cuál es el riesgo → qué decisión necesita tomar el negocio.**

### `/cold-start-interview`

Este es uno de los más importantes para empezar.

Es una entrevista inicial que ayuda a Claude a entender:

- cómo trabaja tu equipo
- cuáles son tus posiciones estándar
- qué riesgos aceptas
- qué debes escalar
- cómo quieres que se estructuren las revisiones

Después esa información se utiliza para personalizar las demás skills.

---

## 5. El plugin Legal general

Además de Commercial Legal, el plugin **Legal** de Anthropic incluye skills enfocadas en operaciones legales generales.

### `/review-contract`

Subes un contrato y Claude lo compara cláusula por cláusula con tu playbook.

Puede:

- detectar desviaciones
- identificar riesgos
- marcar cláusulas que necesitan atención
- sugerir redlines
- clasificarlas como GREEN / YELLOW / RED

---

### `/triage-nda`

Para hacer un primer filtro de NDAs.

Claude compara el documento con tus estándares y ayuda a separar:

**GREEN → estándar**

**YELLOW → requiere revisión**

**RED → requiere atención legal**

La idea es que el abogado pueda concentrarse en las excepciones en lugar de revisar manualmente cada NDA desde cero.

---

### `/vendor-check`

Sirve para consultar el estado y contexto de acuerdos con proveedores.

Es especialmente útil cuando tienes múltiples vendors y necesitas saber qué acuerdos están activos, qué está pendiente o dónde existen fechas importantes.

---

### `/brief`

Genera briefings para asuntos legales.

Puede utilizarse para:

- investigaciones
- decisiones anteriores
- incidentes
- preguntas específicas
- briefs diarios

Una de las posibilidades más interesantes es conectarlo con tus fuentes internas para que pueda encontrar decisiones anteriores y citar de dónde sale cada conclusión.

---

### `/respond`

Ayuda a preparar respuestas para solicitudes legales recurrentes.

Por ejemplo:

- data subject requests
- discovery holds
- consultas recurrentes
- respuestas utilizando plantillas internas

---

## 6. Litigation Legal

Si trabajas en litigios, existe un plugin específico para este tipo de práctica.

Entre sus skills aparecen:

### `/brief-section-drafter`

Ayuda a redactar secciones de briefs manteniendo el estilo y teoría del caso.

Además, estructura las citas para que los hechos puedan verificarse contra sus fuentes.

### `/chronology`

Construye o actualiza una cronología a partir de documentos y fuentes declaradas.

Puede:

- extraer eventos
- ordenarlos por fecha
- eliminar duplicados
- marcar su relevancia

### `/cold-start-interview`

También existe aquí una entrevista inicial, pero adaptada al contexto de litigios.

Puede recoger información como:

- rol del abogado
- tipo de práctica
- lado del caso
- calibración de riesgo
- estilo de trabajo
- house style

---

## 7. No empieces a usarlo todavía

Antes de lanzar `/review`, haz algo mucho más importante:

### Ejecuta `/cold-start-interview`

Esto permite que Claude conozca tu práctica.

Puedes darle:

- tu NDA playbook
- contratos estándar
- posiciones de negociación
- jurisdicciones aceptadas
- límites de responsabilidad
- cláusulas que siempre deben escalarse
- ejemplos de contratos que ya aprobaste
- ejemplos de revisiones anteriores

---

## 8. Crea tu carpeta Legal

Una estructura sencilla:

```
LEGAL/
│
├── PLAYBOOK/
│   ├── NDA-Playbook.pdf
│   ├── Contract-Playbook.pdf
│   └── Risk-Standards.docx
│
├── TEMPLATES/
│   ├── Standard-NDA.docx
│   ├── MSA.docx
│   └── Vendor-Agreement.docx
│
├── INCOMING/
│   ├── NDA-001.pdf
│   └── Vendor-002.docx
│
└── REVIEWED/
```

En Cowork puedes agregar esta carpeta como working folder para que Claude utilice esos documentos como contexto. Claude Academy recomienda precisamente mantener el playbook y las plantillas estándar en una carpeta de trabajo.

---

## 9. Conecta tus herramientas

Aquí es donde el flujo empieza a ponerse realmente interesante.

Puedes conectar Claude con herramientas como:

- Google Drive
- Microsoft 365
- DocuSign
- Slack
- sistemas de gestión documental
- herramientas de contratos

Claude dispone además de conectores legales para sistemas especializados. Entre los disponibles aparecen herramientas como Ironclad, Bloomberg Law, CourtListener y Datasite.

---

## 10. Flujo completo para un NDA

Imagina que llega un NDA nuevo.

### 1. Entra el documento

Lo guardas en:

`LEGAL/INCOMING/`

### 2. Claude lo analiza

Ejecutas:

`/review`

o, si estás utilizando el plugin Legal general:

`/triage-nda`

### 3. Claude compara contra tu playbook

Busca:

- duración
- jurisdicción
- carve-outs
- confidencialidad
- restricciones
- excepciones

### 4. Solo revisas las excepciones

Si hay una desviación:

**YELLOW / RED**

Claude te señala exactamente qué debes mirar.

### 5. Preparas el resumen

Ejecutas:

`/stakeholder-summary`

Y conviertes la revisión legal en algo que el equipo comercial pueda entender rápidamente.

---

## 11. Flujo para contratos

Para un contrato comercial:

`/review-contract`

Claude analiza el documento contra tus posiciones.

Después:

`/stakeholder-summary`

para convertir el análisis en un resumen ejecutivo.

Y si necesitas preparar una respuesta:

`/respond`

Así puedes pasar de:

**Contrato → análisis → resumen → respuesta**

sin reconstruir el contexto en cada paso.

---

## 12. Flujo para investigación legal

Si necesitas investigar una cuestión:

`/brief`

Puedes configurarlo para trabajar con tus decisiones anteriores y fuentes internas.

Por ejemplo:

> `/brief ¿Esta nueva solicitud cambia nuestra conclusión de la revisión anterior?`
>

Claude puede buscar la revisión previa, identificar qué cambió y mostrar las fuentes utilizadas para llegar a la conclusión.

---

## 13. Flujo para litigios

Si estás trabajando un caso:

`/chronology`

→ construye la línea de tiempo.

Después:

`/brief-section-drafter`

→ prepara una sección del brief.

Y puedes mantener todo conectado con el contexto del asunto.

---

## 14. La lista rápida de comandos

### Commercial Legal

`/review`

Revisa contratos comerciales, NDAs y SaaS contra tu playbook.

`/stakeholder-summary`

Convierte una revisión legal en un resumen para negocio.

`/cold-start-interview`

Configura a Claude con la forma de trabajar de tu equipo.

### Legal

`/review-contract`

Revisión contractual detallada.

`/triage-nda`

Primer filtro de NDAs.

`/vendor-check`

Consulta acuerdos y estado de proveedores.

`/brief`

Briefings e investigación contextual.

`/respond`

Respuestas legales recurrentes.

### Litigation Legal

`/brief-section-drafter`

Redacción de secciones de briefs.

`/chronology`

Construcción de cronologías.

`/cold-start-interview`

Configuración inicial para práctica de litigios.

---

:::callout
💡

### Importante

Claude puede acelerar y estructurar el trabajo legal, pero sus resultados deben ser revisados por profesionales jurídicos antes de tomar decisiones o firmar documentos.

:::
