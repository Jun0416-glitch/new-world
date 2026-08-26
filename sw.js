// sw.js - Service Worker for new-world
// 中文注释：这是一个通用的 Service Worker 模板，包含预缓存、激活阶段清理旧缓存、以及 fetch 的缓存策略（导航使用 network-first，静态资源使用 cache-first）。

const CACHE_VERSION = 'v2';
const CACHE_NAME = `new-world-cache-${CACHE_VERSION}`;

// 这里放需要预缓存的静态资源。请根据你的项目实际文件名调整。
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  // '/styles.css',
  // '/app.js',
];

self.addEventListener('install', event => {
  self.skipWaiting(); // 安装后立即激活
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_URLS).catch(err => {
        // 某些资源不存在时仍然继续安装，记录错误以便调试
        console.warn('Precache failed:', err);
      });
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

// 简单的缓存策略：
// - 导航请求（页面跳转）使用 network-first（优先网络，回退缓存或离线响应）
// - 其他静态资源使用 cache-first（优先缓存，未命中则网络请求并缓存）

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return; // 只处理 GET 请求

  const request = event.request;

  // 导航请求（用户直接访问页面或刷新）
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  // 对于同源的静态资源，使用 cache-first
  if (new URL(request.url).origin === self.location.origin) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // 否则，走网络请求（可以扩展为跨域资源的缓存策略）
  event.respondWith(fetch(request).catch(() => caches.match(request)));
});

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    // 仅缓存 200 响应
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    // 在离线时，尝试返回同一路径的预缓存内容（如 index.html 或 offline.html）
    return caches.match(request) || caches.match('/index.html') || caches.match('/offline.html');
  }
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    // 成功则缓存一份（可选）
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    // 网络失败时回退到缓存
    const cached = await cache.match(request) || await cache.match('/index.html') || await cache.match('/offline.html');
    if (cached) return cached;
    // 最后返回一个简单的离线响应
    return new Response('<!doctype html><meta charset="utf-8"><title>Offline</title><p>You appear to be offline.</p>', { headers: { 'Content-Type': 'text/html' } });
  }
}
