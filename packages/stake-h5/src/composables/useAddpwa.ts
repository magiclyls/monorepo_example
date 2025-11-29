import { getEnv } from '@tg/utils';

export default function useAddpwa() {
  const { VITE_SITE_NAME } = getEnv()
  const webSiteName = (EnumSiteName as any)[VITE_SITE_NAME] ?? VITE_SITE_NAME
  const iconUrl = `${application.getImgUrl(globalInitMap.allBrandInfo?.app?.pwa_desktop || globalInitMap.allBrandInfo?.app?.app_desktop || '')}?date=${Date.now()}`
  const iconType = iconUrl.split('.').slice(-1).includes('webp') ? 'image/webp' : 'image/png'
  addPWA(webSiteName, iconUrl, iconType)
}

function addPWA(webSiteName: string, iconUrl: string, iconType: string) {
  const id = new URLSearchParams(document.location.search).get('c')
  const url = id ? `${location.origin}?c=${id}` : location.origin
  const obj = {
    background_color: '#1a2c38',
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
// function UCtoChrome() {
//   const url = window.location.href.split('//')[1]
//   const scheme = window.location.href.split('//')[0].includes('s') ? 'https' : 'http'
//   const newURl = `intent://${url}#Intent;scheme=${scheme};package=com.android.chrome;end`
//   isAndroid() && isUCBrowser() && setTimeout(() => {
//     window.location.href = newURl
//   }, 2000)
// }
// function isUCBrowser() {
//   const userAgent = navigator.userAgent || navigator.vendor
//   return /UCWEB|UCBrowser/i.test(userAgent)
// }

// UCtoChrome()
