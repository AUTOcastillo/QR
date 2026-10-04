const CACHE_NAME = 'qr-castillo-v8'; // 🚀 CAMBIO CLAVE: Subimos a v8 para forzar la descarga del nuevo index.html con las correcciones
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js',
  'https://assets.mixkit.co/active_storage/sfx/861/861-preview.mp3'
  // Si separaste el JS o CSS en archivos externos, agrégalos aquí. Ejemplo:
  // './app.js',
  // './style.css'
];

self.addEventListener('install', event => {
  // Forzar la activación inmediata del nuevo Service Worker
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  // Borrar los cachés antiguos que no coincidan con la versión actual (eliminará la v7)
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  // Ignorar la API de Sono para que siempre se consulte en tiempo real
  if (event.request.url.includes('api.sono.lat')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Comportamiento normal para el resto de los archivos (imágenes, HTML, sonidos)
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
