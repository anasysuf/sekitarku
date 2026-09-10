const CACHE_NAME = 'sekitarku-v111-clean-id';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/leaf.svg',
  '/manifest.webmanifest'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) {
            console.log('[SW] Cleared old cache:', k);
            return caches.delete(k);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // 1. Navigation / Document: Network First, fallback to cached index.html
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          if (cached) return cached;
          return caches.match('/index.html');
        })
    );
    return;
  }

  // 2. OpenStreetMap Tiles: Network First with Cache Fallback for 100% reliable live tiles
  if (url.hostname.includes('tile.openstreetmap.org')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && (response.status === 200 || response.type === 'opaque')) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 3. Real-time External APIs (BMKG, Open-Meteo): Network First
  if (url.hostname.includes('open-meteo.com') || url.hostname.includes('data.bmkg.go.id')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 4. Static JS/CSS/Fonts/Assets: Cache First with Network Fallback
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      });
    })
  );
});


// PWA Widget Lifecycle Handlers for Android
self.addEventListener('widgetinstall', (event) => {
  event.waitUntil(updateWidgetData(event.widget));
});

self.addEventListener('widgetresume', (event) => {
  event.waitUntil(updateWidgetData(event.widget));
});

self.addEventListener('widgetclick', (event) => {
  if (event.action === 'refresh') {
    event.waitUntil(updateWidgetData(event.widget));
  } else {
    event.waitUntil(clients.openWindow('/'));
  }
});

async function updateWidgetData(widget) {
  try {
    const template = await (await fetch('/widget.json')).text();
    const data = await (await fetch('/api/widget')).text();
    if (self.widgets && self.widgets.updateByTag) {
      await self.widgets.updateByTag('sekitarku-widget', { template, data });
    }
  } catch (e) {
    console.log('[SW] Widget update notice:', e);
  }
}
