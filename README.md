# PWA-Activity

# Parte 1: Investigación Teórica - Progressive Web Apps (PWA)

## 1. Web App Manifest (`manifest.json`)
El archivo de manifiesto es un archivo JSON que permite al navegador conocer cómo debe comportarse la aplicación al ser instalada en el dispositivo del usuario.

### Propiedades Clave:
* **`theme_color`**: Define el color de la barra de estado y los elementos de la interfaz del sistema operativo (como el conmutador de aplicaciones) para que coincidan con la identidad visual de la app.
* **`background_color`**: Se utiliza en la "Splash Screen" (pantalla de carga) que aparece inmediatamente después de que el usuario lanza la app desde su pantalla de inicio.
* **`display`**: 
    * **`standalone`**: Ejecuta la aplicación en una ventana propia, ocultando la barra de direcciones y botones del navegador, ofreciendo una experiencia de "App Nativa".
    * **`browser`**: Abre la aplicación como una pestaña estándar dentro del navegador.
* **`icons`**: Array de objetos que define las imágenes (normalmente en PNG o WebP) que el sistema operativo usará como icono de la app en el escritorio, menús y notificaciones. Es vital incluir varios tamaños (ej. 192x192 y 512x512) para asegurar nitidez en diferentes densidades de pantalla.

---

## 2. Service Workers
Un Service Worker es un script que el navegador ejecuta en segundo plano, actuando como un intermediario entre la aplicación web, el navegador y la red.

### Ciclo de Vida:
1.  **Registro (Registration):** El navegador detecta el archivo JS del Service Worker en el código principal.
2.  **Instalación (Installation):** Ocurre cuando el SW es descargado. Es el momento ideal para pre-cachear los archivos estáticos (HTML, CSS, imágenes).
3.  **Activación (Activation):** El SW toma el control. Aquí se suelen eliminar versiones antiguas de la caché para liberar espacio.
4.  **Fetching:** Una vez activo, el SW intercepta todas las peticiones de red realizadas por la aplicación.

### Proxy de Red:
Los Service Workers actúan como un **Proxy de Red** porque tienen la capacidad de interceptar peticiones HTTP mediante el evento `fetch`. El SW puede decidir si responde con un recurso guardado en la caché local o si permite que la petición continúe hacia el servidor, permitiendo que la app funcione sin conexión (Offline).



---

## 3. Estrategias de Almacenamiento (Caching)
Dependiendo del tipo de contenido, se utilizan diferentes estrategias para gestionar la caché:

| Estrategia | Descripción | Uso Ideal |
| :--- | :--- | :--- |
| **Stale-While-Revalidate** | Sirve el contenido desde la caché inmediatamente, pero lanza una petición a la red en segundo plano para actualizar la caché para la próxima vez. | Feeds de noticias o avatares. |
| **Cache First** | Busca el recurso en la caché primero. Solo si no lo encuentra, va a la red. | Activos estáticos: fuentes, CSS, logos. |
| **Network First** | Intenta obtener el recurso desde la red. Si la red falla (offline), entrega el recurso desde la caché. | Datos que cambian constantemente como precios o stock. |

---

## 4. Seguridad y TLS (HTTPS)
El protocolo HTTPS es un pilar innegociable para las PWAs.

### ¿Por qué es obligatorio para Service Workers?
Debido a que un Service Worker tiene la capacidad de interceptar conexiones y modificar las respuestas (actuando como un proxy), un atacante en una red insegura podría realizar un ataque de *Man-in-the-Middle* y tomar control total de la aplicación. HTTPS garantiza que el script no ha sido manipulado durante el tránsito.

### Impacto en el "Install Prompt":
Para que un navegador (como Chrome o Edge) muestre el cartel de **"Instalar Aplicación"**, el sitio debe cumplir obligatoriamente con el protocolo HTTPS (con un certificado TLS válido). Sin seguridad, el navegador considera que el sitio no es confiable para ser instalado como una aplicación del sistema.
