(() => {
  "use strict";
  importScripts(
    '/sw/sw-moudules.utils.js', // 工具函数
    '/sw/sw-moudules.domain.js', // 域名切换相关
    '/sw/sw-moudules.page.js', // 域名切换页面
  );

  
  self.addEventListener("install", event => {

    event.waitUntil(Promise.all([
      self.skipWaiting(),
      // caches.open('online-page').then(cache => cache.put('sw-page.html', createDynamicOnlinePage(buildStringMap())))
    ]))
  });

  self.addEventListener("activate", event => {
    event.waitUntil(self.clients.claim());
  });
  

    self.addEventListener("fetch", event => {
      //不确定兼容问题  可以过滤API请求
      const acceptHeader = event.request.headers.get('Accept') || '';
      if(!acceptHeader.includes('text/html')) {
        return 
      }
      const url = new URL(event.request.url);
      if (event.request.method !== 'GET' 
        || url.origin !== self.location.origin 
        || url.pathname.includes('.')) {   //静态资源请求 
        return;
      }
      // 处理block域名  
      event.respondWith((async () => {
        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse.ok) {
            return networkResponse;
          }
          //不是正常状态码
          return  createDynamicOnlinePage(buildStringMap())

        } catch (err) {
          if (!navigator.onLine) { // 判断用户是否在线
            console.log('用户离线');
            return err;
          } else {
           return  createDynamicOnlinePage(buildStringMap())
          }
        }
      })());
    })
})();

