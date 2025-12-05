// Service Worker for PWA
// 注意：Next.js会自动处理Service Worker，这个文件仅作为参考

const CACHE_NAME = 'funhanzi-v1'
const urlsToCache = [
  '/',
  '/manifest.json',
  // 添加其他需要缓存的资源
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 缓存命中则返回缓存，否则从网络获取
        return response || fetch(event.request)
      })
  )
})

