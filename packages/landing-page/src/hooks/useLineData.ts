import { computed, defineAsyncComponent, ref } from 'vue'
import ping from 'web-pingjs'
import { getCurrentSiteConfig } from '../config/site'
import { encodeBase64String } from './index.js'
import { isMobile } from './useCore'

export function useCurComponent() {
  const curComponent = computed(() => {
    const fileName = isMobile() ? 'h5' : 'pc'
    /* @vite-ignore */
    return defineAsyncComponent(() => import(/* @vite-ignore */`/src/pages/${window.site}/${fileName}.vue`))
  })

  return {
    curComponent,
  }
}

export function useLineData() {
  const siteConfig = getCurrentSiteConfig()

  // 是否加载中
  const loading = ref(false)
  // 线路数据
  const domains = ref<any[]>([])
  // 客服地址
  const csUrl = ref('')
  // 安卓下载地址
  const downloadAndroid = ref('')
  // ios下载地址
  const downloadIos = ref('')
  // 主域名
  const mainDomain = ref('')
  // 站点名
  const siteName = ref('')

  /** 有站点配置 */
  if (siteConfig) {
    csUrl.value = encodeBase64String(siteConfig.csUrl)
    downloadAndroid.value = encodeBase64String(siteConfig.downloadAndroid)
    downloadIos.value = encodeBase64String(siteConfig.downloadIos)
    mainDomain.value = encodeBase64String(siteConfig.mainDomain)
    siteName.value = encodeBase64String(siteConfig.siteName)
  }

  // 模拟接口获取线路
  function getHostData() {
    loading.value = true
    return new Promise((resolve) => {
      let hosts = []
      if (siteConfig) {
        hosts = encodeBase64String(siteConfig.domains).split(',')
      }
      resolve(hosts)
    })
  }
  function getDomainData() {
    // 获取线路之后测速
    getHostData().then((res: any) => {
      const hostArr = res.map((host: any) => {
        return new Promise((resolve) => {
          ping(host)
            .then((delta: any) => {
              resolve({ host, delta: delta.toString().slice(0, 2) })
            })
            .catch((err: Error) => {
              console.error('测速失败:', err.message)
              resolve({ host, delta: 999 })
            })
        })
      })

      Promise.allSettled(hostArr).then((res: any) => {
        // console.log("🦺🦺🦺 ~ Promise.allSettled ~ res:", res)
        domains.value = res.map((res: any) => res.value).sort((a: any, b: any) => a.delta - b.delta)
        loading.value = false
      })
    })
  }

  return {
    loading,
    domains,
    csUrl,
    downloadAndroid,
    downloadIos,
    mainDomain,
    siteName,
    getDomainData,
  }
}
