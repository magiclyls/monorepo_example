import type { Ref } from 'vue'
import { getEnv } from '@tg/utils'
import { watch } from 'vue'

/**
 * Ico Hook
 * @param link  ico的链接
 */
const link_site_ico = document.createElement('link')
link_site_ico.rel = 'shortcut icon'
link_site_ico.type = 'image/x-icon'
document.head.appendChild(link_site_ico)
const link_site_ico2 = document.createElement('link')
link_site_ico2.rel = 'icon'
link_site_ico2.type = 'image/x-icon'
document.head.appendChild(link_site_ico)
document.head.appendChild(link_site_ico2)
export function useIco(icoPath: Ref<string>) {
  const { VITE_CASINO_IMG_CLOUD_URL } = getEnv()
  watch(icoPath, (val) => {
    if (val) {
      link_site_ico.href = `${VITE_CASINO_IMG_CLOUD_URL}/${val}`
      link_site_ico2.href = `${VITE_CASINO_IMG_CLOUD_URL}/${val}`
    }
  }, { immediate: true })
}
// <link rel="shortcut icon" href="images/favicon.ico" type="image/x-icon">
// <link rel="icon" href="images/favicon.ico" type="image/x-icon">
