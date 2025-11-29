window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  window.installPromptEvent = e
})

export function useAddpwa(webSiteName: string, iconUrl: string, bgColor: string) {
  const iconType = iconUrl.split('.').slice(-1).includes('webp') ? 'image/webp' : 'image/png'
  const c = new URLSearchParams(document.location.search).get('c')
  const u = new URLSearchParams(document.location.search).get('c')
  let url = `${location.origin}?`
  if (c)
    url = `${url}c=${c}`
  if (u)
    url = `${url}u=${u}`

  const obj = {
    background_color: bgColor,
    display: 'standalone',
    prefer_related_applications: false,
    related_applications: [],
    name: webSiteName,
    short_name: webSiteName,
    start_url: url,
    icons: [
      {
        sizes: 'any',
        src: iconUrl,
        type: iconType,
      },
      {
        sizes: '512x512',
        src: iconUrl,
        type: iconType,
      },
    ],
  }

  creatLink('manifest', toDataUrl(obj))
  // 动态加桌面图标
  creatLink('apple-touch-icon', iconUrl)
  creatLink('apple-touch-icon', iconUrl, '180x180')
  creatLink('"apple-touch-icon-precomposed', iconUrl)
}
function toDataUrl(obj: Record<string, any>) {
  const jsonString = JSON.stringify(obj)
  const encodedJson = encodeURIComponent(jsonString)
  const dataUrl = `data:text/json;charset=utf-8,${encodedJson}`
  return dataUrl
}
function creatLink(rel: string, href: string, sizes?: string) {
  const link: any = document.createElement('link')
  link.rel = rel
  link.href = href
  if (sizes)
    link.sizes = sizes
  document.head.appendChild(link)
}
