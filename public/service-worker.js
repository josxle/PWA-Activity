const CACHE_NAME = 'pwa-task-manager-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Evento de instalación: cachear recursos estáticos
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Cacheando activos estáticos');
      return cache.addAll(ASSETS_TO_CACHE);
    }).catch((error) => {
      console.error('[Service Worker] Error durante la instalación:', error);
    })
  );
  // Activar inmediatamente sin esperar a que se cierren otras pestañas
  self.skipWaiting();
});

// Evento de activación: limpiar cachés antiguas
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activando...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Eliminando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estrategia Network First con fallback a caché
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Ignorar solicitudes que no sean GET
  if (request.method !== 'GET') {
    return;
  }

  // Estrategia diferenciada según el tipo de recurso
  if (request.url.includes('/api/') || request.url.includes('.json')) {
    // Network First para datos
    event.respondWith(networkFirstStrategy(request));
  } else {
    // Cache First para activos
    event.respondWith(cacheFirstStrategy(request));
  }
});

/**
 * Estrategia Cache First: Caché primero, luego red
 * Ideal para activos estáticos que cambian raramente
 */
async function cacheFirstStrategy(request) {
  const cached = await caches.match(request);
  if (cached) {
    console.log('[Service Worker] Sirviendo desde caché:', request.url);
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[Service Worker] Error en fetch:', error);
    // Retornar offline page si está disponible
    return caches.match('/index.html') || new Response('Sin conexión', { status: 503 });
  }
}

/**
 * Estrategia Network First: Red primero, luego caché
 * Ideal para datos que cambian frecuentemente
 */
async function networkFirstStrategy(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[Service Worker] Error en fetch, usando caché:', request.url);
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    return new Response(
      JSON.stringify({ error: 'Sin conexión' }),
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Escuchar mensajes desde los clientes
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
