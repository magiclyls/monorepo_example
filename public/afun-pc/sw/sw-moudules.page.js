
// 请勿修改此文件

const pageHtml = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    :root {
      --bg-color: #1e2c37;
      --loader-btn-color: #4dabf7;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0;
      padding: 0;
      background-color: var(--bg-color);
      min-height: 100vh;
      overflow: hidden;
    }

    #app {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      box-sizing: border-box;
      background: var(--bg-color);
      overflow: hidden;
    }

    #main {
      display: none;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }

    #loading {
      display: block;
      width: 100%;
      height: 100%;
      background: var(--bg-color);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .loaders {
      width: 30px;
      aspect-ratio: 1;
      border-radius: 50%;
      border: 3px solid var(--loader-btn-color);
      animation:
        l20-1 0.8s infinite linear alternate,
        l20-2 1.6s infinite linear;
    }

    @keyframes l20-1 {
      0% {
        clip-path: polygon(50% 50%, 0 0, 50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0%)
      }

      12.5% {
        clip-path: polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 0%, 100% 0%, 100% 0%)
      }

      25% {
        clip-path: polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 100%, 100% 100%, 100% 100%)
      }

      50% {
        clip-path: polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%)
      }

      62.5% {
        clip-path: polygon(50% 50%, 100% 0, 100% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%)
      }

      75% {
        clip-path: polygon(50% 50%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 50% 100%, 0% 100%)
      }

      100% {
        clip-path: polygon(50% 50%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 0% 100%)
      }
    }

    @keyframes l20-2 {
      0% {
        transform: scaleY(1) rotate(0deg)
      }

      49.99% {
        transform: scaleY(1) rotate(135deg)
      }

      50% {
        transform: scaleY(-1) rotate(0deg)
      }

      100% {
        transform: scaleY(-1) rotate(-135deg)
      }
    }
  </style>
</head>

<body>
  <div id="app">
    <div id="main">
      <iframe width="100%" height="100%" frameborder="0"></iframe>
    </div>
    <div id="loading">
      <div class="loaders"></div>
    </div>
  </div>
  <script>
    (async () => {
      let startTime = Date.now();
      const getId = (id) => document.getElementById(id);
      '@fetchDomainList';
      '@checkDomainAvailability';
      '@findAvailableDomain';
      '@IndexedDBHelper';

      //init indexdb
      const dbHelper = new IndexedDBHelper('dadada', 1);    
      dbHelper.init([
        {
          name: 'users', 
           options: { keyPath: 'id', autoIncrement: true }, 
          indexes: [
          { name: 'domain', keyPath: 'domain' ,options: { unique: false }}
         ]
      }
      ]).then(() => {
        console.log('sw-moudules.pageindexedDB初始化成功');
      }).catch(console.error);


      const init = async () => {
        let domainList = await fetchDomainList();
        const availableDomain = await findAvailableDomain(domainList);
        const urlParams = '?' + ''

        if (availableDomain) {
          const iframe = getId('main').querySelector('iframe');
          iframe.src = availableDomain  + urlParams;
          await sleep(2400);
          showMain();
          postMessage(iframe, 'IN_SERVICE_WORKER', 'ready');
        } else {
          await sleep(1000);
          alert('domain is unAvailable')
        }
      };

      function showMain() {
        getId('main').style.display = 'block';
        getId('loading').style.display = 'none';
      }

      //向iframe发送消息
      function postMessage(iframe, type, params) {
        iframe.onload = () => {
          sleep(1000)
            .then(() => {
              iframe.contentWindow.postMessage({ type, params }, '*');
            });
        }
      }

       window.addEventListener('message', (event) => {
    const { type, data } = event?.data || {}
    console.log(event.origin, '收到ifram页面的消息:', event.data)
    const maps = {
      UPTDAE_DOMAINS: async () => {
        dbHelper.save('users', data)
      },
    }
    maps[type] && maps[type]()
  })

      async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

      setTimeout(async () => {
        await init();
      }, 1000);
    })();
  </script>
</body>

</html>`;

function createDynamicOnlinePage(injected) {
  let html = pageHtml;
  const replacements = {
    '@fetchDomainList': injected.fetchDomainList.valueOf(),
    '@checkDomainAvailability': injected.checkDomainAvailability.valueOf(),
    '@findAvailableDomain': injected.findAvailableDomain.valueOf(),
    '@IndexedDBHelper': injected.IndexedDBHelper.valueOf(),
  };
  for (const [key, value] of Object.entries(replacements)) {
    html = html.replace(`'${key}'`, `${value}\n`);
  };

  const htmlHandler = new Response(html, {
    headers: {
      'Content-Type': 'text/html',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
  return htmlHandler;   
}
