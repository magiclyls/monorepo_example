import type { TTheme } from '@tg/types'
import type { CurrencyCode } from '~/composables/useCurrencyData'
import { ApiExchangeRateFromTo } from '@tg/apis'
import WujieVue from 'wujie-vue3'
import { getEnv } from '@tg/utils';

type GameType = 'dice' | 'plinko' | 'limbo'

export function useMiniGame(gameName: GameType) {
  const { bus } = WujieVue
  const { DEV, VITE_MINIGAME_BASEURL, VITE_CASINO_IMG_CLOUD_URL } = getEnv()
  const origin = location.origin
  const appStore = useAppStore()
  const router = useLocalRouter()
  const { isLogin, currentGlobalCurrency, currentGlobalCurrencyBalance, userInfo, logoAndIcoAndLoading, isCompleteKYC } = storeToRefs(appStore)
  const { isKYCVerifyOpen } = storeToRefs(useBrandStore())
  const { openRegisterDialog } = useRegisterDialog()
  const { openDialogBetSlipOriginalGame } = useDialogBetSlipOriginalGame()
  const { openNotify } = useNotify()
  const { bool: showProvablyFair } = useBoolean(false)
  const { toggleIsTheatre } = useMiniGameGlobalStateTheatre()
  /** KYC弹窗 */
  const { openKYCDialog } = useDialogKYCVerify()

  const initVerifyGame = ref('')

  /** 新的汇率逻辑 */
  const rate = ref('0')
  const currentGlobalCurrencyCode = computed(() => getCurrencyConfig(currentGlobalCurrency.value).cur)
  const { run: runGetReateFromTo } = useRequest(ApiExchangeRateFromTo, {
    onSuccess(res, params) {
      const code = params[0].from as CurrencyCode
      rate.value = scientificToString(toFixed(res[code]))
    },
  })

  const gameProps = computed(() => {
    const p: {
      staticDomain: string
      logoUrl: string
      currencyId: string
      currency: string
      lang: string
      backendLang: string
      getBalanceData: () => void
      openNotify: (msg: any) => void
      balance?: number
      token?: string
      /** 汇率 */
      rate: string
      /** 货币符号 */
      currencyPrefix: string
      /** 小数位数 */
      decimalNum: number
      /** 最小投注额 */
      betLimitMin: number
      /** 最大投注e */
      betLimitMax: number
      /** 主题 */
      theme: TTheme
      /** 自我排除 */
      exclude: number
      /** 站点是否打开KYC */
      isKYCVerifyOpen: boolean
      /** 用户是否已完成KYC */
      isCompleteKYC: boolean
    } = {
      staticDomain: VITE_CASINO_IMG_CLOUD_URL,
      logoUrl: logoAndIcoAndLoading.value.logo_white,
      currencyId: getCurrencyConfig(currentGlobalCurrency.value).cur,
      currency: currentGlobalCurrency.value,
      lang: getCurrentLanguageForFrontend(),
      backendLang: getCurrentLanguageForBackend(),
      /** 账户余额 */
      balance: currentGlobalCurrencyBalance.value,
      rate: rate.value,
      currencyPrefix: application.isVirtualCurrency(currentGlobalCurrency.value) ? 'US$' : currencyConfig[currentGlobalCurrency.value].prefix,
      decimalNum: currencyConfig[currentGlobalCurrency.value].decimal,
      betLimitMin: 0,
      betLimitMax: 0,
      getBalanceData: appStore.getBalanceData,
      openNotify,
      theme: appStore.theme,
      isKYCVerifyOpen: isKYCVerifyOpen.value,
      isCompleteKYC: isCompleteKYC.value,
    }
    if (isLogin.value) {
      p.token = appStore.getToken()
      p.exclude = userInfo.value?.exclude
    }

    return p
  })

  const gameUrl = computed(() => {
    const _url = getMiniGameUrl()
    return `${_url}/`
  })

  function getMiniGameUrl() {
    let _base = ''
    if (DEV)
      _base = VITE_MINIGAME_BASEURL
    else
      _base = `${origin}/minigame/${gameName}`
    return _base
  }

  function openRegister() {
    openRegisterDialog()
  }

  function jumpToProvably() {
    router.push('/provably-fair/overview')
  }
  /** 打开公平性弹窗 */
  function onOpenProvablyFair(game: string) {
    initVerifyGame.value = game
    showProvablyFair.value = true
  }
  /** 打开投注记录弹窗 */
  function onOpenDialogBetRecord(data: { id: string, game: string }) {
    openDialogBetSlipOriginalGame({ ...data, uid: userInfo.value.uid })
  }
  /** iframe加载完成后才执行 */
  function onIframeLoaded() {
    if (application.isVirtualCurrency(currentGlobalCurrency.value))
      runGetReateFromTo({ from: currentGlobalCurrencyCode.value, to: '706' })
    else
      rate.value = '1'
  }
  /** 未进行KYC时拦截 */
  function openKYC() {
    const isSetX = document.documentElement.getAttribute('setx')
    if (isSetX === null) {
      document.documentElement.setAttribute('setx', 'xxx')
      openKYCDialog()

      setTimeout(() => {
        document.documentElement.removeAttribute('setx')
      }, 50)
    }
  }
  /** 开始游戏 */
  function setGameStartBool() {
    appStore.setGameStartBool(true)
  }
  onMounted(() => {
    bus.$on('openRegister', openRegister)
    bus.$on('scrollToTop', scrollMainContentToTop)
    bus.$on('jumpProvably', jumpToProvably)
    bus.$on('openProvablyFair', onOpenProvablyFair)
    bus.$on('openDialogBetRecord', onOpenDialogBetRecord)
    bus.$on('toggleIsTheatre', toggleIsTheatre)
    bus.$on('openKYC', openKYC)
    bus.$on('startGame', setGameStartBool)
  })

  onUnmounted(() => {
    bus.$off('openRegister', openRegister)
    bus.$off('scrollToTop', scrollMainContentToTop)
    bus.$off('jumpProvably', jumpToProvably)
    bus.$off('openProvablyFair', onOpenProvablyFair)
    bus.$off('openDialogBetRecord', onOpenDialogBetRecord)
    bus.$off('toggleIsTheatre', toggleIsTheatre)
    bus.$off('openKYC', openKYC)
    bus.$off('startGame', setGameStartBool)
    appStore.setGameStartBool(false)
  })

  watch(currentGlobalCurrencyBalance, (v) => {
    bus.$emit('channelMessageWujie', {
      balance: v,
    })
  })

  watch(currentGlobalCurrency, (v) => {
    bus.$emit('channelMessageWujie', {
      currency: v,
      currencyId: getCurrencyConfig(v).cur,
      currencyPrefix: application.isVirtualCurrency(v) ? 'US$' : currencyConfig[v].prefix,
      decimalNum: currencyConfig[v].decimal,
    })

    if (application.isVirtualCurrency(v))
      runGetReateFromTo({ from: currentGlobalCurrencyCode.value, to: '706' })
    else
      rate.value = '1'
  })

  watch(rate, (a) => {
    bus.$emit('channelMessageWujie', {
      rate: a,
    })
  })

  watch(isLogin, (v) => {
    bus.$emit('channelMessageWujie', {
      token: v ? appStore.getToken() : undefined,
    })
  })

  watch(logoAndIcoAndLoading, (v) => {
    bus.$emit('channelMessageWujie', {
      logoUrl: v.logo_white,
    })
  })

  watch([isKYCVerifyOpen, isCompleteKYC], ([a, b]) => {
    bus.$emit('channelMessageWujie', {
      isKYCVerifyOpen: a,
      isCompleteKYC: b,
    })
  })

  return {
    gameUrl,
    gameProps,
    showProvablyFair,
    initVerifyGame,
    onIframeLoaded,
  }
}
