# Cómo crear tu primer REPO y respaldar tus proyectos con GitHub

Si trabajas con proyectos, aplicaciones, páginas web o herramientas de AI, necesitas aprender a usar GitHub.

Git y GitHub te permiten guardar versiones de tus proyectos, recuperar archivos anteriores, experimentar sin dañar tu versión principal y tener una copia del proyecto en internet.

**No necesitas ser programador para empezar.**

## 1. Entiende los tres conceptos

Antes de comenzar, diferencia estos términos:

- **Git:** herramienta que registra los cambios que haces en los archivos de un proyecto.
- **Repositorio (repo):** carpeta de tu proyecto que Git mantiene bajo control de versiones.
- **GitHub:** plataforma en internet donde puedes alojar tus repositorios y sincronizarlos con tu computador.

También debes conocer tres conceptos:

- **Commit:** un punto de control que guarda un avance de tu proyecto.
- **Branch (rama):** una línea de trabajo paralela para probar cambios sin afectar la versión principal.
- **Clone (clonar):** descargar una copia completa de un repositorio, incluyendo su historial.

## 2. Crea tu cuenta de GitHub

1. Entra a https://github.com
2. Haz clic en **Sign up**.
3. Regístrate con tu correo electrónico.
4. Verifica tu cuenta.

Esta será tu cuenta para guardar y administrar tus proyectos.

## 3. Prepara tu computador

Para trabajar con repositorios necesitas tener Git instalado.

Puedes consultar las instrucciones oficiales según tu sistema operativo: https://github.com/git-guides/install-git

Una vez instalado, abre la Terminal (en Mac) o la terminal de tu sistema operativo.

Escribe:

```
git --version
```

Si aparece un número de versión, significa que Git está instalado correctamente.

La primera vez también debes configurar tu nombre y correo:

```
git config --global user.name "Tu Nombre"
git config --global user.email "tu-correo@email.com"
```

Utiliza el correo asociado a tu cuenta de GitHub.

## 4. Convierte tu proyecto en un repositorio

Supongamos que tienes una carpeta llamada `mi-proyecto` con todos los archivos de tu aplicación.

Abre la terminal dentro de esa carpeta. Puedes hacerlo desde tu editor de código o navegando hasta la carpeta desde la terminal.

Ejecuta estos comandos uno por uno:

### Paso 1. Inicializa Git

```
git init
```

Esto convierte tu carpeta en un repositorio de Git.

### Paso 2. Agrega los archivos

```
git add .
```

Esto prepara los archivos para guardarlos en el historial.

### Paso 3. Crea tu primer commit

```
git commit -m "Mi primer respaldo"
```

¡Listo! Ya tienes tu primer punto de control.

**Importante:** este commit todavía está guardado localmente en tu computador. Ahora vamos a subirlo a GitHub.

## 5. Sube tu proyecto a GitHub

Entra a https://github.com/new y crea un repositorio nuevo.

Configúralo así:

- **Repository name:** `mi-proyecto`
- **Description:** una descripción de tu proyecto.
- **Visibility:** Private (recomendado si es un proyecto personal o de trabajo).
- No selecciones README, .gitignore ni License si vas a conectar una carpeta que ya tiene archivos y acabas de inicializar con Git.

Haz clic en **Create repository**.

GitHub te mostrará una página con instrucciones para conectar tu proyecto.

En la terminal, ejecuta los siguientes comandos, reemplazando la URL por la que te entrega GitHub:

```
git branch -M main
git remote add origin https://github.com/TU-USUARIO/mi-proyecto.git
git push -u origin main
```

**¿Qué hace cada comando?**

- `git branch -M main`: establece el nombre de tu rama principal.
- `git remote add origin`: conecta tu proyecto local con el repositorio de GitHub.
- `git push`: sube tus archivos y commits a GitHub.

¡Ya tienes tu proyecto respaldado en internet!

## 6. Aprende a guardar tus avances

Esta es la parte que debes convertir en un hábito.

Cada vez que avances en tu proyecto y quieras guardar un punto de control, abre la terminal dentro de la carpeta y ejecuta:

### 1. Revisa qué cambió

```
git status
```

### 2. Prepara los cambios

```
git add .
```

### 3. Guarda el avance

```
git commit -m "Descripción del avance"
```

Por ejemplo:

```
git commit -m "Agregué el sistema de inicio de sesión"
```

### 4. Sube los cambios a GitHub

```
git push
```

Ahora tienes ese nuevo punto de control guardado tanto en tu computador como en GitHub.

> 💡 **Mi recomendación:** haz un commit cada vez que completes una funcionalidad importante o un avance significativo.

## 7. ¿Cómo recuperas tu proyecto si pierdes tu computador?

Esta es una de las razones más importantes para usar GitHub.

Si tu computador se daña, puedes recuperar tu proyecto desde cualquier otro equipo.

1. Entra a tu cuenta de GitHub.
2. Busca el repositorio que quieres recuperar.
3. Haz clic en el botón **Code**.
4. Copia la dirección HTTPS.
5. Abre una terminal y ejecuta:

```
git clone https://github.com/TU-USUARIO/mi-proyecto.git
```

Esto descargará una copia completa del repositorio, incluyendo los archivos y el historial de versiones.

También puedes descargar los archivos desde GitHub usando **Code → Download ZIP**, aunque esa opción no conserva el historial completo de Git.

## 8. Experimenta sin dañar tu proyecto principal

Imagina que tienes una aplicación funcionando y quieres probar una nueva funcionalidad.

En lugar de modificar directamente tu versión principal, puedes crear una rama:

```
git switch -c nueva-funcionalidad
```

Ahora puedes trabajar en esa rama sin modificar la rama principal `main`.

Cuando termines, puedes guardar tus cambios:

```
git add .
git commit -m "Nueva funcionalidad"
```

Si quieres integrar los cambios a tu versión principal:

```
git switch main
git merge nueva-funcionalidad
```

Si el experimento no funciona, puedes volver a `main` sin haber mezclado esos cambios.

## 9. Tres reglas para proteger tus proyectos

**1. No olvides hacer push.**

Un commit guardado únicamente en tu computador no es un respaldo en la nube. Debes ejecutar `git push` para sincronizarlo con GitHub.

**2. Nunca subas contraseñas o claves privadas.**

Archivos como `.env` pueden contener contraseñas, API keys y credenciales. Configura un `.gitignore` para excluirlos antes de subir tus archivos.

**3. Utiliza repositorios privados para proyectos sensibles.**

Un repositorio público puede ser visto por cualquier persona. Private restringe el acceso a las personas autorizadas, aunque debes seguir protegiendo tus secretos y credenciales.

## 10. Los comandos que debes guardar

| Comando | Para qué sirve |
| --- | --- |
| `git init` | Crear un repositorio |
| `git status` | Revisar los cambios |
| `git add .` | Preparar los cambios |
| `git commit -m "mensaje"` | Guardar un punto de control |
| `git push` | Subir cambios a GitHub |
| `git pull` | Traer cambios desde GitHub |
| `git clone URL` | Descargar un repositorio |
| `git log` | Consultar el historial |
| `git switch -c nombre` | Crear una rama nueva |
| `git switch main` | Volver a la rama principal |

## Recursos oficiales para seguir aprendiendo

Toda esta guía está basada en la documentación oficial de GitHub.

- Crear tu primer repositorio: https://docs.github.com/es/repositories/creating-and-managing-repositories/creating-a-new-repository
- Entender qué es Git: https://docs.github.com/en/get-started/using-git/about-git
- Aprender a usar los commits: https://docs.github.com/en/get-started/using-git/about-commits
- Aprender sobre ramas: https://docs.github.com/en/get-started/using-git/about-branches
- Clonar repositorios: https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository
- Proteger archivos sensibles con .gitignore: https://docs.github.com/en/get-started/git-basics/ignoring-files

> 💡 **RECUERDA:** Git guarda el historial de tu proyecto. GitHub te permite tener una copia remota. Acostúmbrate a guardar tus avances con commits y sincronizarlos con *push*.
>
> Si trabajas con un equipo y quieres ver las últimas versiones subidas, haces *pull*.
>
> No esperes a perder semanas de trabajo para empezar a utilizarlo.
