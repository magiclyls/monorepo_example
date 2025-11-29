import { ApiMemberBrandAppVersion, ApiMemberMarketDetail } from '@tg/apis'
import { i18n } from '@tg/vue-i18n'
import { acceptHMRUpdate, defineStore } from 'pinia'

/**
 * @description 下载条和下载逻辑
 */
export const useDownloadStore = defineStore('download', () => {
  const dankeKey = 'x9e38809ee057c33'
  const channelDomain = window.location.origin.replace(/\/$/, '')
  const channelCode = Local.get(STORAGE_CCCCC)?.value
  const u = Local.get(STORAGE_UUUUU)?.value
  const adjustapptoken = Local.get('adjustapptoken')?.value
  const eventtoken = Local.get('eventtoken')?.value
  const fbp = Cookie.get('_fbp') ?? ''
  const fbc = Cookie.get('_fbc') ?? ''
  const dankeParamsObj = { channelDomain,channelCode,u,adjustapptoken,eventtoken,fbp,fbc }
  let dankeParams = ''
  for(let key in dankeParamsObj) {
    if(dankeParamsObj[key]) {
      dankeParams += `${key}=${dankeParamsObj[key]}&`
    }
  }
  useAddpwa()
  const { t } = i18n.global
  const { openNotify } = useNotify()
  const { VITE_SITE_NAME } = getEnv()
  const languageStore = useLanguageStore()
  const { userLanguage } = storeToRefs(languageStore)
  const { bool: isShowPwa, setFalse: setIsShowPwaFalse } = useBoolean((!isAppNested()))

  // 获取ios和安卓包
  const { runAsync: runMemberBrandAppVersion, data: appVersionData } = useRequest(ApiMemberBrandAppVersion)
  // 获取渠道配置
  const { runAsync: runPWAconfig, data: pwaData, loading: PWAconfigLoading, error: pwaDataError } = useRequest(ApiMemberMarketDetail)
  const isRunPWAconfigOrNotStart = computed(() => PWAconfigLoading.value || (!pwaDataError.value && !pwaData.value))

  const showPwaGlobal = reactive({
    config: true,
    isShow: false,
  })
  const iconUrl = ref(`${application.getImgUrl(globalInitMap.allBrandInfo?.app?.pwa_desktop || globalInitMap.allBrandInfo?.app?.app_desktop || '')}?date=${Date.now()}`)
  const webSiteName = ref((EnumSiteName as any)[VITE_SITE_NAME])
  // xinstall 秘钥
  // const XinstallConfig = reactive({
  //   xi_domain: globalInitMap.allBrandInfo?.api_domain?.vg_install_domain,
  //   sharetraceKey: globalInitMap.allBrandInfo?.api_domain?.vg_install_key,
  //   downloadType: globalInitMap.allBrandInfo?.api_domain?.type,
  // })
  // 全局配置
  const pwaGlobalConfig = ref<Record<string, any>>({})
  /** 可以使用的android地址 */
  const androidApkUrl = ref<string>('')
  const isShowPwaHasC = computed(() => {
    if (isRunPWAconfigOrNotStart.value)
      return false
    // 如果全局没配置不显示
    else if (!showPwaGlobal.config)
      return false
    // 如果有渠道配置优先由渠道控制
    else if (pwaData.value)
      return pwaData.value.fix === '1' && isShowPwa.value
    else
      return showPwaGlobal.isShow && isShowPwa.value
  })

  /** 中间弹窗：配置，包括官方App/自定义 */
  const homeAppDownloadConfig = computed(() => {
    let homeAppDownload
    try {
      const obj = JSON.parse((globalInitMap.allBrandInfo?.pc?.home_app_download || '{}') as string)
      homeAppDownload = obj.flag && +obj.flag === 2 ? obj.customize : obj.official
    }
    catch {
    }
    return homeAppDownload
  })
  /** 中间弹窗：是否选择了自定义 1 官方 2 自定义 */
  const flag = computed(() => {
    let f
    try {
      const obj = JSON.parse((globalInitMap.allBrandInfo?.pc?.home_app_download || '{}') as string)
      f = obj.flag
    }
    catch {
    }
    return f
  })
  /** 中间弹窗：自定义下载链接 android */
  const customizeAndroidApk = computed(() => flag.value && +flag.value === 2 ? homeAppDownloadConfig.value?.android : '')
  /** 中间弹窗：自定义下载链接 ios */
  const customizeIosLink = computed(() => flag.value && +flag.value === 2 ? homeAppDownloadConfig.value?.ios : '')

  function getIsShowPwaGlobal() {
    try {
      const data = JSON.parse(globalInitMap.allBrandInfo?.pc?.pc_lead ?? '')
      const imgUrl = data.img[userLanguage.value.replace('-', '_')]
      if (data.barType === 1) // 自定义样式
        return showPwaGlobal.isShow = data.state === 2
      else if (data.barType === 2)// 图片
        return showPwaGlobal.isShow = data.state === 2 && Boolean(imgUrl)
    }
    catch (err) {
      console.log(err)
      // 当parse错误的时候优先级要大于渠道控制避免出现样式问题
      return showPwaGlobal.config = false
    }
  }

  function getPwaGlobalData() {
    try {
      const data = JSON.parse(globalInitMap.allBrandInfo!.pc!.pc_lead)
      pwaGlobalConfig.value = data
      pwaGlobalConfig.value.imgUrl = data.img[userLanguage.value.replace('-', '_')]
      pwaGlobalConfig.value.btnTextcontent = data.config.btnText.content[userLanguage.value.replace('-', '_')] || data.config.btnText.content.default
      pwaGlobalConfig.value.btnTextcolor = data.config.btnText.color
      pwaGlobalConfig.value.mainTitlecontent = data.config.mainTitle.content[userLanguage.value.replace('-', '_')] || data.config.mainTitle.content.default
      pwaGlobalConfig.value.mainTitlecolor = data.config.mainTitle.color
      pwaGlobalConfig.value.subTitlecontent = data.config.subTitle.content[userLanguage.value.replace('-', '_')] || data.config.subTitle.content.default
      pwaGlobalConfig.value.subTitlecolor = data.config.subTitle.color
      pwaGlobalConfig.value.handledBtnIcon = isIos() ? data.config.btnIcon.svg.ios : data.config.btnIcon.svg.android
      pwaGlobalConfig.value.btnIconColor = data.config.btnIcon.color
      pwaGlobalConfig.value.btnPosition = data.config.btnPosition
    }
    catch (err) {
      console.log(err)
      return false
    }
  }

  function downLoad(isCheckCust: boolean | 1 | 2 = false) {
    /*
      true 首页中间下载弹窗优先自定义链接
      不用传参 优先下载APP
      数字 2  优先下载pwa

      --用法--
     function downLoad() {
          if (window.downloadStore.downLoad(true) === 'ShowSafari')  isShowAdd.value = true
      }

      function closeAdd() {
        isShowAdd.value = false
      }

       <AppAddToDesk v-if="isShowAdd" @close="closeAdd" />   IOS Safari提示组件
    */
    if (isCheckCust && flag.value && +flag.value === 2) {
      if (isIos()) {
        if (customizeIosLink.value && customizeIosLink.value.includes('http'))
          setTimeout(() => window.location.href = customizeIosLink.value, 0)
        else
          openNotify({ type: 'error', title: `${t('pwa_no_download1')}`, message: `${t('pwa_no_download2')}` })
      }
      else {
        if (customizeAndroidApk.value && isExternal(customizeAndroidApk.value) && customizeAndroidApk.value.includes('.apk'))
          setTimeout(() => window.location.href = customizeAndroidApk.value, 0)
        else
          openNotify({ type: 'error', title: `${t('pwa_no_download1')}`, message: `${t('pwa_no_download2')}` })
      }
      return
    }
    if (isPwa()) { // pwa环境
      XinstallDownLoad()
    }
    else if (isCheckCust === 2) { // pwa下载优先
      if (isSupportPwa() && window.installPromptEvent) {
        handleClickPWA()
      }
      else if (isIos()) {
        if (isSafari)
          return 'ShowSafari'
        else
          XinstallDownLoad()
      }
      else {
        XinstallDownLoad() // 安卓和pc
      }
    }
    else { // APP下载优先
      if ((!isIos() && androidApkUrl.value)
        || (isIos() && appVersionData.value?.ios?.link?.primary?.includes('http'))
        || (isIos() && appVersionData.value?.ios?.link?.backup?.includes('http'))) {
        XinstallDownLoad()
      }
      else if (isSupportPwa() && window.installPromptEvent) {
        handleClickPWA()
      }
      else if (isIos()) {
        if (isSafari)
          return 'ShowSafari'
        else
          XinstallDownLoad()
      }
      else {
        XinstallDownLoad() // 安卓和pc
      }
    }
  }

  /**
   * 获取可以使用的Apk下载地址
   */
  async function getApkUrl(): Promise<string | undefined> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      let errorIndex = 0
      const allApkUrl = [
        pwaData.value?.apk,
        pwaData.value?.official_apk,
        pwaData.value?.official_reserve_apk,
        appVersionData.value?.android?.link?.primary,
        appVersionData.value?.android?.link?.backup,
      ].filter(Boolean) as string[]
      if (allApkUrl.length === 0)
        resolve(undefined)
      for (const apkUrl of allApkUrl) {
        if (await checkApkUrl(apkUrl)) {
          resolve(apkUrl)
          break
        }
        else {
          errorIndex++
          if (errorIndex === allApkUrl.length)
            resolve(undefined)
        }
      }
    })
  }

  async function XinstallDownLoad() {
    if (
      (!isIos() && !androidApkUrl.value)
      || (isIos() && !appVersionData.value?.ios?.link?.primary?.includes('http') && !appVersionData.value?.ios?.link?.backup?.includes('http')
      )
    ) {
      // openNotify({ type: 'error', title: `${t('pwa_no_download1')}`, message: `${t('pwa_no_download2')}` })
      return false
    }
    console.log('DankeX',dankeKey, dankeParamsObj)
    window.DankeX?.download(dankeKey,dankeParams)
    downLink()
  }

  function downLink() {
    if (isIos())
      setTimeout(() => window.location.href = (appVersionData.value?.ios?.link?.primary || appVersionData.value?.ios?.link?.backup || ''), 0)
    else if (!isIos())
      setTimeout(() => window.location.href = androidApkUrl.value, 0)
  }

  async function handleClickPWA() {
    if (window.installPromptEvent) {
      window.installPromptEvent.prompt()
      // 记录用户的选择结果
      const { outcome } = await window.installPromptEvent.userChoice
      if (outcome === 'accepted')
        console.log('用户接受了PWA安装')
      else
        console.log('用户拒绝了PWA安装')
      window.installPromptEvent = null
    }
  }
  function isSupportPwa() {
    return 'serviceWorker' in navigator && Object.prototype.hasOwnProperty.call(window, 'BeforeInstallPromptEvent')
  }

  getIsShowPwaGlobal()
  getPwaGlobalData()
  runMemberBrandAppVersion()
  runPWAconfig(new URLSearchParams(document.location.search).get('c'))

  watch([appVersionData, pwaData], async () => {
    androidApkUrl.value = await getApkUrl() as string
  })

  window.downloadStore = {
    webSiteName,
    pwaGlobalConfig,
    pwaData,
    iconUrl,
    isShowPwaHasC,
    downLoad,
  }

  return {
    isShowPwaHasC,
    iconUrl,
    webSiteName,
    pwaGlobalConfig,
    pwaData,
    setIsShowPwaFalse,
    downLoad,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useDownloadStore, import.meta.hot))
