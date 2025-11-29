/*
  version-polling 主线程集成示例
  - 创建 Worker
  - 接收 worker 消息并弹窗提示
*/

export function init(language: string) {
  const userLanguage = language || navigator.language || 'en-US'

  // 创建 Worker（确保路径正确）
  const worker = new Worker('/static-js/version-worker.js', { type: 'module' })

  // 定义多语言内容
  const messages: Record<string, any> = {
    'zh-CN': '检测到新版本可用，建议刷新页面以加载最新内容',
    'en-US': 'A new version is available. Please refresh the page to load the latest content.',
    'tl-PH': 'Une nouvelle version est disponible. Veuillez actualiser la page pour charger le contenu le plus récent.',
    'hi-IN': 'एक नया संस्करण उपलब्ध है। नवीनतम सामग्री लोड करने के लिए पृष्ठ को ताज़ा करें।',
    'ko-KR': '새 버전이 있습니다. 최신 콘텐츠를 로드하려면 페이지를 새로 고치십시오.',
    'pt-BR': 'Uma nova versão está disponível. Atualize a página para carregar o conteúdo mais recente.',
    'vi-VN': 'Có phiên bản mới. Vui lòng làm mới trang để tải nội dung mới nhất.',
    'ja-JP': '新しいバージョンが利用可能です。最新のコンテンツを読み込むには、ページを更新してください。',
    'in-ID': 'Versi baru tersedia. Segarkan halaman untuk memuat konten terbaru.',
    'th-TH': 'มีเวอร์ชันใหม่ โปรดรีเฟรชหน้าเพื่อโหลดเนื้อหาล่าสุด',
  }

  worker.onmessage = (ev) => {
    const msg = ev.data
    if (!msg || !msg.type)
      return

    switch (msg.type) {
      case 'configured':
        console.log('[version-worker] configured', msg)
        break
      case 'init':
        console.log('[version-worker] initial ETag', msg.etag)
        break
      case 'update':
        console.log('[version-worker] update detected', msg)
        // eslint-disable-next-line no-alert
        if (window.confirm(getMessage())) {
          window.location.reload()
        }
        break
      case 'no-etag':
        console.log('[version-worker] no ETag from server; cannot reliably compare')
        break
      case 'error':
        console.warn('[version-worker] error', msg.error)
        break
      default:
        console.log('[version-worker] message', msg)
    }
  }

  // 初始化：获取 baseline ETag 并发送配置给 Worker，然后根据 visibilityState 启动或暂停
  // 根据页面可见性决定是否启动轮询
  if (document.visibilityState === 'visible') {
    worker.postMessage({ type: 'start' })
  }
  else {
    // 等待 visible 再启动
    worker.postMessage({ type: 'pause' })
  }

  // 监听页面可见性，切换 worker 轮询
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      worker.postMessage({ type: 'resume' })
    }
    else {
      worker.postMessage({ type: 'pause' })
    }
  })

  // 页面卸载时清理 Worker
  window.addEventListener('beforeunload', () => {
    try {
      worker.terminate()
    }
    catch (error) {}
  })
  // 获取用户语言，默认使用英文
  function getMessage() {
    const message = messages[userLanguage] || messages['en-US']
    return message
  }
}
