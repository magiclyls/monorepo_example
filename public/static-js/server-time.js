function updateServerTime() {
  const baseUrl = ('%PROD%' === 'true') ? '/' : '/api/'
  fetch(`${baseUrl}date?t=${Date.now()}`, { method: 'HEAD' }).then((res) => {
    const date = res.headers.get('date')
    window.serverTime = date
    window.serverTimeDiff = new Date(date).getTime() - Date.now()
  })
}
