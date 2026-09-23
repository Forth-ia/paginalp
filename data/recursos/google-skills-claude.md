> *Google publicó Skills oficiales para que Claude Code trabaje con Firebase, Cloud Run, Gemini, BigQuery y otras tecnologías siguiendo el playbook de Google. Esta guía explica qué son, cuándo se activan y cómo empezar sin instalar de más.*

:::callout
  **Ideal para**

  - Personas que empiezan a usar Claude Code con Google Cloud
  - Developers que construyen apps con Firebase, Cloud Run o Gemini
  - Equipos que quieren seguir las prácticas oficiales de Google
  - Quien quiere instalar Skills sin llenar el contexto innecesariamente
:::

:::callout
  **Incluye**

  - Qué hace un Skill y cuándo Claude lo utiliza
  - Instalación por proyecto y global
  - Librería de Skills de Google explicada en lenguaje simple
  - Prompts para Firebase, Cloud Run y Gemini
  - Errores de configuración frecuentes
:::

---

### 1) Qué son los Google Skills

Un **Skill** es una pequeña carpeta que contiene un archivo `SKILL.md`. Es documentación diseñada específicamente para un agente de IA: incluye instrucciones oficiales, ejemplos y buenas prácticas para una tecnología concreta.

En vez de pegar documentación completa en cada prompt, Claude conoce el nombre y la descripción de cada Skill. Solo carga el contenido completo cuando la tarea coincide con él. El resultado es más precisión, menos contexto innecesario y un enfoque consistente entre proyectos.

### 2) Cuándo Claude utiliza un Skill

No necesitas ejecutarlo manualmente en cada solicitud.

1. **Descubrimiento:** al empezar una sesión, Claude Code revisa las carpetas de Skills y carga solo sus nombres y descripciones.
1. **Activación:** si tu tarea coincide con una descripción —por ejemplo, desplegar una app— carga el `SKILL.md` correspondiente, como Cloud Run Basics.
1. **Ejecución:** utiliza sus instrucciones, código y referencias mientras completa el trabajo.

:::callout
  **Dónde guardarlos:** usa `.claude/skills/<nombre>/SKILL.md` para Skills de un proyecto y `~/.claude/skills/<nombre>/SKILL.md` para los que quieras en todos tus proyectos. Como regla práctica, deja los específicos de cliente o stack dentro del repositorio.
:::

### 3) Cómo instalarlos desde cero

**Opción recomendada — un solo comando**

```bash
npx skills add google/skills
```

El selector interactivo te permite elegir qué instalar. Empieza con dos o tres, no con toda la librería.

**Opción plugin de Claude Code**

```bash
claude plugin marketplace add google/skills
claude plugin install <plugin>@google-plugins
```

**Opción manual:** entra a [github.com/google/skills](https://github.com/google/skills), busca el Skill elegido, copia su `SKILL.md` a `.claude/skills/<nombre-del-skill>/` y reinicia Claude Code.

### 4) Los Skills más útiles de Google

**Primeros pasos con Google Cloud**

- **Onboarding to Google Cloud:** configura correctamente un proyecto nuevo; úsalo al comenzar con un cliente.
- **Authenticating to Google Cloud:** cubre credenciales, cuentas de servicio, ADC e IAM. Configúralo antes de otros Skills de Cloud.
- **Foundation Builder:** crea una base de infraestructura organizada para un negocio.

**Web y hosting**

- **Firebase Basics:** Firestore, reglas de seguridad, autenticación y Functions. Ideal para portales y dashboards con usuarios.
- **Cloud Run Basics:** contenedores, escalabilidad y distribución de tráfico. Úsalo cuando la app está lista pero falta el despliegue.

**IA, datos y desarrollo**

- **Gemini API:** SDKs y endpoints actuales para integrar IA dentro de una aplicación.
- **BigQuery:** optimización de consultas, particionamiento, esquemas y control de costos para analytics y reporting.
- **AlloyDB / Cloud SQL:** buenas prácticas para PostgreSQL y MySQL administrados.
- **gcloud CLI:** enseña a Claude a usar bien la línea de comandos de Google Cloud; suele tener sentido instalarlo globalmente.

**Seguridad y arquitectura**

- **GKE + Platform / Workload Security:** clusters, Workload Identity, node pools y hardening. Omítelo si no usas Kubernetes.
- **Well-Architected Framework:** revisa seguridad, confiabilidad, costo, rendimiento, operaciones y sostenibilidad antes de producción.
- **Network Observability:** ayuda a investigar conectividad dentro de Google Cloud.

### 5) Los 3 Skills para empezar

1. **Firebase Basics** para autenticación, base de datos y hosting.
1. **Cloud Run Basics** para convertir el deployment en un flujo guiado.
1. **Gemini API** para construir funcionalidades de IA con el SDK actual.

### 6) Prompts listos para usar

**Firebase**

```plain text
Usando el Firebase Skill, créame un portal para clientes con autenticación por email, una base de datos de Firestore para almacenar proyectos y reglas de seguridad que garanticen que cada cliente solo pueda ver sus propios datos.
```

**Cloud Run**

```plain text
Usando el Cloud Run Skill, convierte esta aplicación en un contenedor y despliega la aplicación en Cloud Run con configuraciones de escalabilidad razonables.

Explícame cada comando de gcloud antes de ejecutarlo.
```

**Gemini**

```plain text
Usando el Gemini API Skill, agrega una funcionalidad de resumen con AI a esta aplicación utilizando el SDK más reciente de Gemini.

No utilices endpoints obsoletos.
```

### 7) Errores que debes evitar

1. **Instalar todos los Skills de una vez.** Más Skills significan más descripciones en contexto; instala solo los que usarás.
1. **Saltarte autenticación.** La mayoría de problemas de Google Cloud son credenciales y permisos.
1. **Poner todo globalmente.** Mantén lo específico de cada proyecto en `.claude/skills/`.
1. **Olvidar reiniciar Claude Code.** El descubrimiento ocurre al empezar una nueva sesión.
1. **Esperar que el Skill haga todo solo.** Da un buen playbook, pero todavía debes explicar con claridad qué quieres construir.

:::callout
  **Tip práctico:** instala primero autenticación si vas a usar Google Cloud. Luego elige Firebase, Cloud Run o Gemini según el proyecto real que tengas delante.
:::
