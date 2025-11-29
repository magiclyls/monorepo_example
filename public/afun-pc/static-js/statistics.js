function getUrlParam(name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`)
  const r = window.location.search.substr(1).match(reg)
  if (r !== null)
    return decodeURIComponent(r[2])
  return null
}

window.tggoogleId = getUrlParam('google') || ''
window.tgfacebookId = getUrlParam('facebook') || ''
window.tgtiktokId = getUrlParam('tiktok') || ''
window.tgkwaiId = getUrlParam('kwai') || ''

if (window.tggoogleId) {
  localStorage.setItem('tggoogleId', JSON.stringify({
    value: window.tggoogleId,
  }, null, 2))
}

if (window.tgfacebookId) {
  localStorage.setItem('tgfacebookId', JSON.stringify({
    value: window.tgfacebookId,
  }, null, 2))
}

if (window.tgtiktokId) {
  localStorage.setItem('tgtiktokId', JSON.stringify({
    value: window.tgtiktokId,
  }, null, 2))
}

if (window.tgkwaiId) {
  localStorage.setItem('tgkwaiId', JSON.stringify({
    value: window.tgkwaiId,
  }, null, 2))
}