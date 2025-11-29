import { ApiMemberBrandAppVersion, ApiMemberMarketDetail } from '@tg/apis'
import { useAddpwa, useBoolean } from '@tg/hooks'
import { application, checkApkUrl, getBrandInfo, getEnv, isAppNested, isIos, isPwa, isSafari, Local, STORAGE_CCCCC, STORAGE_UUUUU } from '@tg/utils'
import { getLang } from '@tg/vue-i18n'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const { VITE_SITE_NAME, VITE_OFFICIAL_NAME } = getEnv()

export const useDownloadStore = defineStore('download', () => {
  const route = useRoute()
  const userLanguage = ref(getLang())
  const brandApp = ref(getBrandInfo('app'))
  const brandPc = ref(getBrandInfo('pc'))
  const isOpenDownLoadDialog = ref(false)
  const isOpenDownLoadDialogBottom = ref(false)

  // 初始化下载对话是否显示
  try {
    const obj = JSON.parse((brandPc.value?.home_app_download || '{}') as string)
    const temp = obj.flag && +obj.flag === 2 ? obj.customize : obj.official
    const isPopUP = (temp?.popup)
    const isPopUPBottom = (JSON.parse((brandPc.value?.bottom_app_download || '{}') as string)?.popup)
    if (isPopUP === false)
      isOpenDownLoadDialog.value = true
    if (isPopUPBottom === false)
      isOpenDownLoadDialogBottom.value = true
  }
  catch {}
  /* 手动控制展示顶部滚动条 */
  const { bool: isShowPwa, setFalse: setIsShowPwaFalse } = useBoolean((!isAppNested()))
  /* ios和安卓包数据 */
  const { bool: isShowAddToDesk, setBool: setIsShowAddToDesk } = useBoolean((false))
  /* ios和安卓包数据 */
  const appVersionData = ref()
  /** 最终使用的安卓包地址 */
  const androidApkUrl = ref<string>('')
  /* 渠道配置 */
  const pwaData = ref()
  const PWAconfigLoading = ref(false)
  const pwaDataError = ref(false)
  const isRunPWAconfigOrNotStart = computed(() => PWAconfigLoading.value || (!pwaDataError.value && !pwaData.value))
  /* 接口数据是否展示顶部下载条 */
  const showPwaGlobal = reactive({
    config: true,
    isShow: false,
  })
  /* 顶部下载条配置 */
  const pwaGlobalConfig = ref<Record<string, any>>({})
  /* 中间下载配置 */
  const dialogDownLoadData = ref<Record<string, any>>({})
  /* 底部下载配置 */
  const dialogDownLoadBottomData = ref<Record<string, any>>({})

  /* 顶部下载条最终是否展示 */
  const isShowPwaHasC = computed(() => {
    if (isRunPWAconfigOrNotStart.value)
      return false
    // 如果全局没配置不显示
    else if (!showPwaGlobal.config)
      return false
    // 如果有渠道配置优先由渠道控制
    else if (pwaData.value)
      return pwaData.value.fix === '1' && isShowPwa.value && route.name === 'Home'
    else
      return showPwaGlobal.isShow && isShowPwa.value && route.name === 'Home'
  })

  const iconUrl = computed(() => `${application.getImgUrl(brandApp.value?.pwa_desktop || brandApp.value?.app_desktop || '')}?date=${Date.now()}`)
  const webSiteName = ref(VITE_OFFICIAL_NAME || 'unknown')
  /* 顶部接口数据处理 */
  function getIsShowPwaGlobal() {
    showPwaGlobal.config = true
    try {
      const data = JSON.parse(brandPc.value?.pc_lead ?? '')
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
      const data = JSON.parse(brandPc.value?.pc_lead ?? '')
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
      pwaGlobalConfig.value.bgColorType = data.config.bgColorType
      pwaGlobalConfig.value.bgGradientColor = data.config.bgGradientColor
      pwaGlobalConfig.value.btnColorType = data.config.btnColorType
      pwaGlobalConfig.value.btnGradientColor = data.config.btnGradientColor
    }
    catch (err) {
      console.log(err)
      return false
    }
  }

  /* 中间下载接口数据处理 */
  function getIsShowDialogDownLoad() {
    try {
      const obj = JSON.parse((brandPc.value?.home_app_download || '{}'))
      const data = obj.flag && +obj.flag === 2 ? obj.customize : obj.official
      data.buttonText = data.lang.buttonText[userLanguage.value.replace('-', '_')]
      data.content = data.lang.content[userLanguage.value.replace('-', '_')]
      data.title = data.lang.title[userLanguage.value.replace('-', '_')]
      dialogDownLoadData.value = data
    }
    catch (err) {
      console.log('getIsShowDialogDownLoad', err)
    }
  }

  /* 底部下载接口数据处理 */
  function getIsShowBottomDialogDownLoad() {
    try {
      const data = JSON.parse(brandPc.value?.bottom_app_download ?? '')
      data.buttonText = data.lang.buttonText[userLanguage.value.replace('-', '_')]
      data.content = data.lang.content[userLanguage.value.replace('-', '_')]
      data.title = data.lang.title[userLanguage.value.replace('-', '_')]
      dialogDownLoadBottomData.value = data
    }
    catch (err) {
      console.log('getIsShowBottomDialogDownLoad', err)
    }
  }

  /* 获取渠道配置 */
  async function runPWAconfig() {
    PWAconfigLoading.value = true
    try {
      const res = await ApiMemberMarketDetail()
      pwaData.value = res
      PWAconfigLoading.value = false
    }
    catch (error) {
      pwaDataError.value = true
      PWAconfigLoading.value = false
    }
  }
  /* 获取ios和安卓包 */
  async function runMemberBrandAppVersion() {
    const res = await ApiMemberBrandAppVersion()
    appVersionData.value = res
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

  /**
   * 1 优先下载APP  |  2  优先下载pwa
   */
  function downLoad(type: 1 | 2) {
    // pwa环境
    if (isPwa()) {
      XinstallDownLoad()
    }
    // pwa下载优先
    else if (type === 2) {
      if (isSupportPwa() && window.installPromptEvent) {
        handleClickPWA()
      }
      else if (isIos()) {
        if (isSafari)
          setIsShowAddToDesk(true)
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
          setIsShowAddToDesk(true)
        else
          XinstallDownLoad()
      }
      else {
        XinstallDownLoad() // 安卓和pc
      }
    }
  }

  async function XinstallDownLoad() {
    if ((!isIos() && !androidApkUrl.value) || (isIos() && !appVersionData.value?.ios?.link?.primary?.includes('http') && !appVersionData.value?.ios?.link?.backup?.includes('http'))
    ) {
      return false
    }
    const channelDomain = window.location.origin.replace(/\/$/, '')
    const c = Local.get(STORAGE_CCCCC)?.value
    const u = Local.get(STORAGE_UUUUU)?.value
    console.log('DankeX', 'u', channelDomain, 'channelCode', c, 'u', u)
    const fbp = getCookie('_fbp') ?? ''
    const fbc = getCookie('_fbc') ?? ''
    window.DankeX?.download('x9e38809ee057c33', `channelDomain=${channelDomain}&channelCode=${c}&u=${u}&fbp=${fbp}&fbc=${fbc}`)
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

  function getCookie(name: string) {
    const pattern = new RegExp(`(?:^|; )${encodeURIComponent(name)}=([^;]*)`)
    const match = document.cookie.match(pattern)
    return match ? decodeURIComponent(match[1]) : undefined
  }

  watch([appVersionData, pwaData], async () => {
    androidApkUrl.value = await getApkUrl() as string
  })
  watch(brandPc, () => {
    if (!brandPc.value)
      return
    getIsShowPwaGlobal()
    getPwaGlobalData()
    getIsShowDialogDownLoad()
    getIsShowBottomDialogDownLoad()
    useAddpwa(webSiteName.value, iconUrl.value, '#f6f7f8')
  }, { immediate: true })

  runPWAconfig()
  runMemberBrandAppVersion()
  return {
    isOpenDownLoadDialog,
    isOpenDownLoadDialogBottom,
    iconUrl,
    webSiteName,
    pwaGlobalConfig,
    pwaData,
    isShowPwaHasC,
    dialogDownLoadData,
    dialogDownLoadBottomData,
    isShowAddToDesk,
    downLoad,
    setIsShowPwaFalse,
    setIsShowAddToDesk,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useDownloadStore, import.meta.hot))
