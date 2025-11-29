// version-worker.js
// 在 Worker 中轮询目标 URL 的 HEAD（或 GET）并比较 ETag。
// Worker 与主线程通过 postMessage 通信。

let timerId = null
let interval = 30 * 1000
let url = '/index.html'
let currentETag = null
let running = false
let updated = false

async function fetchETag(target) {
  try {
    // 尝试 HEAD 请求
    const headResp = await fetch(target, {
      method: 'HEAD',
      cache: 'no-store',
      credentials: 'same-origin', // 根据需要改为 'include'
    })
    // 注意：有些服务器不返回 HEAD 或不返回 ETag
    let etag = headResp.headers.get('ETag')
    if (etag)
      return { etag, status: headResp.status }
    // 若 HEAD 没有 ETag，则回退到 GET（只取 headers）
    const getResp = await fetch(target, {
      method: 'GET',
      cache: 'no-store',
      credentials: 'same-origin',
    })
    etag = getResp.headers.get('ETag')
    return { etag, status: getResp.status }
  }
  catch (err) {
    // 网络错误等
    return { etag: null, error: err }
  }
}

async function checkOnce() {
  const res = await fetchETag(url)
  if (res.error) {
    postMessage({ type: 'error', error: String(res.error) })
    return
  }
  // 如果请求非 2xx，则也不处理（可根据需要调整）
  if (res.status && (res.status < 200 || res.status >= 400)) {
    postMessage({ type: 'status', status: res.status })
    return
  }

  const newETag = res.etag
  // 把 null/undefined 当做不可比较（不触发更新），除非你希望在没有 ETag 时比较其他字段
  if (!newETag) {
    postMessage({ type: 'no-etag' })
    return
  }

  // 若当前 ETag 为 null，说明这是第一次获取 -> 更新当前值但不触发通知
  if (currentETag === null) {
    currentETag = newETag
    postMessage({ type: 'init', etag: currentETag })
    return
  }

  // 对比 ETag
  if (newETag !== currentETag) {
    // 发现更新：告知主线程
    updated = true
    stopPolling()
    postMessage({ type: 'update', oldETag: currentETag, newETag })
  }
}

function startPolling() {
  if (running && updated)
    return
  running = true
  checkOnce()
  timerId = setInterval(() => {
    checkOnce()
  }, interval)
}

function stopPolling() {
  running = false
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  }
}

// 接收主线程消息：配置、暂停、恢复、手动检查、设置 currentETag 等
onmessage = function (ev) {
  const msg = ev.data
  if (!msg || !msg.type)
    return
  switch (msg.type) {
    case 'config':
      // { url, interval, currentETag, credentials }
      url = msg.url || url
      interval = msg.interval || interval
      if (typeof msg.currentETag !== 'undefined')
        currentETag = msg.currentETag
      postMessage({ type: 'configured', url, interval, currentETag })
      break
    case 'start':
      startPolling()
      break
    case 'stop':
      stopPolling()
      break
    case 'pause':
      stopPolling()
      break
    case 'resume':
      startPolling()
      break
    case 'checkOnce':
      checkOnce()
      break
    case 'setCurrentETag':
      currentETag = msg.etag
      postMessage({ type: 'setCurrentETag', etag: currentETag })
      break
    default:
      // Unknown
      postMessage({ type: 'warn', message: `unknown message type: ${msg.type}` })
  }
}
