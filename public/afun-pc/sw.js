//时间占位符不能删除和移动

//CACHE_NAME占位符不能删除和移动
//urlsToCache占位符不能删除和移动

// const CACHE_NAME = 'my-site-cache-v1.10'
// const urlsToCache = [ '/logo.png']


globalThis.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    }),
  ),
  globalThis.skipWaiting()
})

globalThis.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME)
            return caches.delete(cacheName)
          else
            return Promise.resolve()
        }),
      )
    }),
  ),
  globalThis.clients.claim()
})

globalThis.addEventListener('fetch', (event) => {
  // if (urlsToCache.includes(event.request.url.replace(/^(.*\/api)/, ''))) {}  匹配API
  if(!urlsToCache.includes(removeProtocolDomainPort(event.request.url)) ) return
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response)
        return response
      return fetch(event.request)
    }),
  )
})

function removeProtocolDomainPort(url) {
  const urlObj = new URL(url);
  return url.replace(urlObj.origin,'')
}
