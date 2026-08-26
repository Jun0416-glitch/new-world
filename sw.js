// sw.js - Service Worker for new-world
// Removed untrusted files (/222 /333 /444) from PRECACHE_URLS and bumped cache version to v3.

const CACHE_VERSION = 'v3';
const CACHE_NAME = `new-world-cache-${CACHE_VERSION}`;

// Precache list: keep only known safe site assets here.
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  // add static assets you trust here, e.g. '/styles.css', '/app.js'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_URLS).catch(err => {
        console.warn('Precache failed:', err);
      });
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const request = event.request;
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }
  if (new URL(request.url).origin === self.location.origin) {
    event.respondWith(cacheFirst(request));
    return;
  }
  event.respondWith(fetch(request).catch(() => caches.match(request)));
});

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && response.status === 200) cache.put(request, response.clone());
    return response;
  } catch (err) {
    return caches.match(request) || caches.match('/index.html') || caches.match('/offline.html');
  }
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response && response.status === 200) cache.put(request, response.clone());
    return response;
  } catch (err) {
    const cached = await cache.match(request) || await cache.match('/index.html') || await cache.match('/offline.html');
    if (cached) return cached;
    return new Response('<!doctype html><meta charset="utf-8"><title>Offline</title><p>You appear to be offline.</p>', { headers: { 'Content-Type': 'text/html' } });
  }
}
