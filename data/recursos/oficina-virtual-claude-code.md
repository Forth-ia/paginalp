# Cómo crear tu propia oficina virtual

Trabajar desde casa tiene muchas ventajas, pero también tiene un costo: se pierde la cercanía. Ya no hay pasillos, ni cafés improvisados, ni ese "oye, ¿tienes un minuto?" que resolvía cosas en segundos. Todo pasa por videollamadas agendadas y mensajes que se sienten fríos.

Este proyecto busca recuperar esa cercanía. Es una **oficina virtual** en la que cada persona aparece como un personaje dentro de un plano de oficina. Puedes caminar hacia un compañero y hablar con él, y cuando te alejas, dejas de escucharlo, igual que en una oficina real. Hay salas de reunión privadas, zona de descanso, chat con globos de texto, reacciones y pantalla compartida.

Todo se construye con herramientas gratuitas: corre en local con un solo comando y, si quieres, se publica en internet usando planes gratis de Render, Vercel y Metered.

> 💡 **Es un proyecto complejo y se divide en tres componentes:**
> 1. **Backend** (servidor de conexiones en tiempo real)
> 2. **Frontend** (la parte visual)
> 3. **Servidor para comunicación por voz** (TURN)
>
> El backend y el frontend se pueden generar con Claude Code usando los prompts de más abajo. Para llevarlos a producción y conectarlos hay que seguir pasos manuales. La parte del servidor de voz es completamente manual.

## Parte 1: Generar el código con Claude Code

Ejecuta los prompts en orden, uno por uno. Espera a que Claude Code confirme cada paso antes de pasar al siguiente.

### Prompts del backend

#### Prompt 1: Servidor base y sockets

~~~text Prompt 1: Servidor base y sockets
Actúa como un Ingeniero de Software Full-Stack Senior especializado en WebSockets, WebRTC e interfaces interactivas en tiempo real.

Vamos a construir el MVP de una plataforma corporativa gamificada tipo "Oficina Virtual" (estilo Habbo Hotel / Gather.town) optimizada para ejecutarse 100% en local (localhost) con cero costo de infraestructura.

OBJETIVO GENERAL DEL MVP (PARTE 1)

Crear una aplicación web ligera de "un solo comando" que permita a múltiples usuarios conectar su micrófono, aparecer como un avatar/nodo en un plano 2D de oficina, moverse en tiempo real y establecer comunicación de voz por proximidad cuando dos avatares estén cerca.

ARQUITECTURA TÉCNICA LOCAL

1. Backend (Node.js + Express + Socket.io):
   - Gestión de salas/lobbies (Lobby principal por defecto).
   - Manejo de ciclo de vida de usuarios (conexión, almacenamiento de socket.id, nombre de usuario, estado y coordenadas X, Y).
   - Eventos de WebSocket a baja latencia para retransmitir movimiento e interpolación de posiciones.
   - Broker de señalización WebRTC integrado o conexión a servidor de señalización PeerJS local.
2. Frontend (HTML5 Vanilla + Canvas API + Socket.io Client + PeerJS Client):
   - Interfaz limpia, responsiva y oscura estilo dashboard/game.
   - Renderizado en un mapa 2D sobre HTML5 Canvas (sin motores de juego pesados por ahora).
   - Cálculo de distancia euclidiana entre el avatar local y otros avatares.
   - Integración de Audio WebRTC (PeerJS): conexión de audio P2P automática si la distancia es menor a 150px, ajustando el nivel de volumen según la proximidad.

ESTRUCTURA DE ARCHIVOS A CREAR

Por favor, inicializa el proyecto creando exactamente la siguiente estructura modular:

virtual-office-mvp/
├── package.json
├── server.js               <-- Servidor Node.js (Express + Socket.io + PeerJS Broker)
├── public/
│   ├── index.html          <-- Pantalla de Login (Nombre) + Canvas del Mapa + HUD
│   ├── css/
│   │   └── styles.css      <-- Estilos de interfaz (Dark Mode elegante)
│   └── js/
│       ├── main.js         <-- Inicialización y control de UI
│       ├── socket-client.js <-- Lógica de WebSockets (Posiciones y Lobby)
│       ├── audio-peer.js   <-- Lógica WebRTC / PeerJS (Voz y Proximidad)
│       └── game-canvas.js  <-- Loop de renderizado Canvas 2D (Avatares y Movimiento WASD)
└── README.md               <-- Instrucciones de ejecución (npm install y npm start)

REGLAS Y SECUENCIA DE EJECUCIÓN DEL PASO 1

Para este primer paso de construcción, debes enfocarte en dejar funcionando el SERVIDOR BASE y la INFRAESTRUCTURA DE SOCKETS:

1. Crea el archivo package.json con las dependencias necesarias (express, socket.io, peer).
2. Implementa server.js configurando el servidor HTTP en el puerto 3000, los eventos de Socket.io (connection, join-room, move-player, disconnect) y la escucha de estado en memoria.
3. Crea la estructura de carpetas en /public con archivos plantilla funcionales para el cliente.
4. Asegúrate de que al ejecutar npm start, el servidor levante sin errores y responda en http://localhost:3000.

Ejecuta la creación de la estructura y el código del servidor base. Confírmame cuando esté listo para probar el inicio del servidor.
~~~

#### Prompt 2: Oficina, salas privadas y presencia

~~~text Prompt 2: Oficina, salas privadas y presencia
OBJETIVOS DEL PASO 2

1. Mejora del Canvas y mapa de oficina (visuales y zonas):
   - Rediseña el Canvas de 1200x700 para representar una oficina corporativa real estructurada con las siguientes áreas delimitadas visualmente:
     - Recepción / Lobby Principal (zona de spawn inicial).
     - Espacio Abierto de Escritorios (Open Workspace).
     - 2 Salas de Reunión Privadas (Meeting Room A y Meeting Room B).
     - Zona de Descanso / Cafetería (Breakroom).
   - Dibuja divisiones claras, paredes, mesas/escritorios y etiquetas que identifiquen cada área dentro del Canvas.
2. Mecánica de zonas privadas (muting/aislamiento por sala):
   - Implementa la lógica de "Áreas Privadas": si 2 o más avatares entran dentro del perímetro delimitado por la "Sala de Reunión A", sus canales de audio se aíslan en una sub-sala.
   - Los usuarios fuera de la sala privada no deben escuchar el audio de los usuarios que están dentro (independientemente de qué tan cerca estén físicamente en el mapa).
   - Muestra un indicador visual en el Canvas (ej. "🔒 En reunión privada") sobre los avatares que estén dentro de estas salas.
3. Estados de presencia y avatares:
   - Permite que el usuario cambie su estado de presencia desde la interfaz (HUD) entre 3 opciones:
     - 🟢 Disponible (verde, audio por proximidad activo).
     - 🟡 En Llamada / Ocupado (amarillo, audio de proximidad pausado/silenciado).
     - 🔴 No Molestar (rojo, silencio total + indicador visual en su avatar).
   - Renderiza los avatares como círculos estilizados con las iniciales del usuario, un indicador direccional hacia donde se mueven y un halo de color reflejando su estado de presencia.
4. Feedback visual y UX de audio en tiempo real:
   - Dibuja un radio/círculo tenue alrededor del avatar local que represente visualmente su "Rango de Audición" (150px).
   - Agrega un indicador animado de nivel de voz (onda o anillo que palpita) alrededor del avatar cuando su micrófono esté capturando audio activo.
   - Muestra una lista/sidebar en la interfaz con los usuarios conectados actualmente en el lobby y su estado.

REGLAS TÉCNICAS Y ENTREGABLES

1. Mantén la arquitectura de un solo comando (npm start) corriendo todo en local.
2. Modifica public/js/game-canvas.js para renderizar el mapa detallado, zonas de reunión y halos de audio/presencia.
3. Actualiza public/js/socket-client.js y public/js/audio-peer.js para gestionar los eventos de entrada/salida de salas privadas y cambio de estado de presencia.
4. Actualiza server.js para sincronizar los estados de presencia de los jugadores entre todos los clientes.

Ejecuta estas mejoras. Confírmame cuando el servidor esté actualizado y el cliente refleje la oficina rediseñada, las salas privadas y los estados de presencia.
~~~

#### Prompt 3: Chat, emotes, sillas y pantalla compartida

~~~text Prompt 3: Chat, emotes, sillas y pantalla compartida
OBJETIVOS DEL PASO 3

1. Chat de texto y emotes flotantes (estilo Habbo / Club Penguin):
   - Sistema de chat flotante: agrega un input de chat rápido en el HUD. Cuando un usuario envía un mensaje, este debe aparecer como una burbuja de texto flotante sobre la cabeza de su avatar durante 5 segundos (además de guardarse en un historial lateral expandible).
   - Menú de emotes/reacciones: permite enviar reacciones rápidas (👋, ❤️, 🔥, 😂, 👏, 💡, ❓). Al seleccionar una, el icono flota y escala sobre el avatar del jugador con un efecto de animación.
2. Mobiliario interactivo y posición "sentado":
   - Colisión / acomodamiento en sillas: cuando un avatar camine hacia una silla o escritorio (dibujados en las salas o cafetería), debe "encajarse" o sentarse automáticamente, cambiando la orientación del avatar hacia la mesa.
   - Estado visual "🪑 Sentado" en la etiqueta del personaje para que los demás sepan que está instalado trabajando.
3. Pantalla compartida y componentes de sala (oficina útil):
   - Integración de WebRTC Screen Share: en las 2 salas de reunión (Meeting Room A y B) agrega un objeto visual tipo "Pantalla/TV de Presentación".
   - Si un usuario entra a la sala y presiona "Compartir Pantalla" en el HUD, utiliza la API navigator.mediaDevices.getDisplayMedia() para retransmitir su pantalla a todos los integrantes que estén dentro de esa misma sala privada.
   - Al compartir pantalla, debe abrirse un modal/visor flotante en los clientes dentro de la sala para ver la presentación.
4. Anillo de voz global y control de audio mejorado:
   - Sincroniza la detección del volumen del micrófono a través de WebSocket para que el ANILLO DE VOZ PULSANTE se dibuje sobre el avatar de CUALQUIER usuario que esté hablando en ese momento, no solo en el cliente local.
   - Controles rápidos en el Sidebar: agrega un botón de "Mute individual" al lado de cada usuario en la lista para que puedas silenciar a alguien localmente si tiene ruido de fondo.

REGLAS TÉCNICAS Y ENTREGABLES

1. Mantén la ejecución 100% local con cero costo (npm start).
2. Actualiza server.js para retransmitir los eventos de chat, emotes, compartir pantalla (señalización de video para screen share) e intensidad de voz por avatar.
3. Actualiza public/js/game-canvas.js para renderizar las burbujas de chat flotantes, emotes animados, avatares sentados y el visor de pantalla compartida.
4. Actualiza public/js/audio-peer.js para integrar el flujo de video/screen share vía WebRTC dentro de las salas privadas.

Ejecuta estas mejoras. Confírmame cuando el servidor y los scripts estén listos para probar la magia del chat flotante, los emotes y la pantalla compartida.
~~~

### Prompt del frontend

#### Prompt 4: UI / Pixel Art estilo Habbo

~~~text Prompt 4: UI / Pixel Art estilo Habbo
¡El comportamiento del Paso 3 es excelente! Ahora vamos a ejecutar el PASO 4 para transformar la interfaz visual en una experiencia retro cautivadora al estilo HABBO HOTEL / CLUB PENGUIN.

OBJETIVOS DEL PASO 4 (UI / PIXEL ART ESTILO HABBO)

1. Avatares en Pixel Art ("los muñequitos"):
   - Sustituye los círculos planos de los avatares por personajes/sprites de Pixel Art estilo Habbo.
   - Genera/dibuja de forma procedimental (o usando spritesheet canvas 2D) los muñequitos con:
     - Cabeza, cuerpo, piernas y tono de ropa configurable/variado por usuario.
     - Animaciones de caminata de 4 direcciones (frente, espalda, izquierda, derecha) según el vector de movimiento WASD.
     - Estado "Sentado": cuando el muñequito se sienta en una silla, debe cambiar a su cuadro/pose de estar sentado con las piernas dobladas.
     - Insignia/halo de estado (🟢, 🟡, 🔴) estilizado sobre su cabeza.
2. Rediseño del mapa y mobiliario estilo hotel retro:
   - Aplica un estilo retro de píxel art a las texturas del mapa:
     - Suelos con patrones de azulejos, alfombras de oficina y parqué de madera.
     - Paredes de ladrillo/cristal oscuro con bordes marcados tipo Pixel Art.
     - Mobiliario (escritorios, plantas, sillones, máquinas de café, pantallas de TV) dibujados con estética isométrica/2D de Hotel.
3. Interfaz y globos de chat Habbo:
   - Rediseña las burbujas de texto sobre el personaje para que imiten los míticos globos de diálogo de Habbo:
     - Globo blanco/amarillento con picos de borde retro, tipografía pixel/bold limpia y una "cola" que apunta exactamente a la cabeza del muñequito.
     - Desplazamiento vertical suave de los mensajes si un usuario envía varias líneas seguidas.
   - Rediseña la barra inferior (HUD) al estilo "Habbo Toolbar":
     - Botón de consola de chat, selector de emotes con barra deslizante y selector de estado de presencia integrado.
4. Feedback sonoro y pulido de UX:
   - Efectos de sonido con Web Audio API (retro 8-bit / chimes suavecitos):
     - Sonido pop al enviar/recibir mensaje de chat.
     - Sonido click retro al sentarse en una silla o cambiar de estado.
     - Sonido beep sutil cuando alguien entra a tu misma sala privada.

REGLAS TÉCNICAS Y ENTREGABLES

1. Mantén la ejecución 100% local (npm start) y ligera, sin dependencias de compiladores pesados.
2. Todo el renderizado de los avatares en Pixel Art debe realizarse mediante sprites/canvas nativo en public/js/game-canvas.js.
3. Conserva intacta toda la lógica funcional del Paso 3 (salas privadas, WebRTC screen share, mute individual y audio por proximidad).

Ejecuta estas mejoras estéticas. Confírmame cuando el servidor esté actualizado y el cliente luzca como una auténtica Oficina Virtual estilo Habbo Hotel.
~~~

## Parte 2: Publicar en internet

En este punto ya tienes una versión que funciona perfectamente de manera local, y se pueden conectar las personas que estén en la misma red de internet. Para hostearla en la red, haz lo siguiente.

### Preparación

- Sube el código a un repositorio de GitHub.
- Ten clara la arquitectura: la web (la parte visual) y el servidor (conexiones en tiempo real) van en lugares distintos, porque Vercel no admite conexiones permanentes.

### Paso A: Publicar el servidor (backend) en Render, plan gratis

1. Crea una cuenta en Render y conecta el repositorio de GitHub.
2. Crea un servicio web de Node con el plan **Free**.
3. Define las variables del servidor:
   - `NO_HTTPS=1` (Render ya pone el HTTPS).
   - `CORS_ORIGIN` con la dirección de la web en Vercel (se completa más abajo).
4. Espera a que termine el despliegue y copia la dirección del servidor.
5. Comprueba que funciona abriendo `https://<servidor>/health`.

### Paso B: Publicar la web (frontend) en Vercel

1. Crea una cuenta en Vercel e importa el mismo repositorio.
2. Verifica que Vercel lo trate como **sitio estático** y que use **Node 24.x**.
3. Agrega la variable `BACKEND_URL` con la dirección del servidor de Render y despliega.
4. Vuelve a Render, pon en `CORS_ORIGIN` la dirección final de Vercel y deja que redespliegue.
5. Si `BACKEND_URL` cambia en el futuro, hay que volver a desplegar la web.
6. Prueba la dirección de Vercel desde dos dispositivos distintos.

### Problemas que ya aparecieron

- Vercel detectaba Express y fallaba: se arregló forzando "sitio estático".
- Error de versión de Node: se arregló fijando Node 24.x.
- El despliegue no salía con la cuenta correcta: se arregló haciendo un redeploy desde la cuenta correcta de Vercel.

> ⚠️ **Cosas a tener en cuenta del plan gratis de Render:**
> - El servidor se duerme tras unos minutos sin uso, así que la primera conexión tarda entre 30 y 60 segundos.
> - El estado vive en memoria. Si el servidor se reinicia, se pierde quién está dentro de la oficina.
> - Para evitar la espera, se puede pasar a un plan de pago o usar un servicio que lo "despierte" cada cierto tiempo.

## Parte 3: Conectarlo con el servidor de voz (TURN)

### Entender el problema

- La voz y la pantalla compartida van directo de persona a persona. En la misma red funciona sin nada extra, pero entre redes distintas casi siempre falla.
- La solución es un **servidor TURN**, que hace de puente y retransmite el audio y el video cuando la conexión directa no es posible.

### Crear la cuenta en Metered

1. Entra a Metered.ca y crea una cuenta.
2. Crea una app y copia el dominio (ej. `miapp.metered.live`).
3. Copia la clave API desde el panel.

### Conectarlo al backend

1. En Render, abre el servicio y entra a **Environment**.
2. Agrega `METERED_DOMAIN` con el dominio de Metered.
3. Agrega `METERED_API_KEY` con la clave API.
4. Guarda. Render redespliega solo y no hace falta tocar Vercel.
5. Comprueba que `https://<servidor>/ice-servers` devuelva la lista de servidores. El frontend la consulta solo al conectarse.
