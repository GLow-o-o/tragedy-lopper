const IMAGE_CACHE_NAME = 'tl-image-cache-v1';
const IMAGE_CACHE_PREFIX = 'tl-image-cache-';

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(
      names
        .filter((name) => name.startsWith(IMAGE_CACHE_PREFIX) && name !== IMAGE_CACHE_NAME)
        .map((name) => caches.delete(name)),
    );
    await self.clients.claim();
  })());
});

function isImageRequest(request) {
  if (request.method !== 'GET') return false;
  if (request.destination === 'image') return true;
  const url = new URL(request.url);
  return /\.(png|jpe?g|gif|webp|avif|svg|ico)$/i.test(url.pathname);
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (!isImageRequest(request)) return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(IMAGE_CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;

    try {
      const response = await fetch(request);
      if (response && response.ok) {
        cache.put(request, response.clone()).catch(() => {
          /* ignore quota/cache put failure */
        });
      }
      return response;
    } catch (error) {
      const fallback = await cache.match(request);
      if (fallback) return fallback;
      throw error;
    }
  })());
});
