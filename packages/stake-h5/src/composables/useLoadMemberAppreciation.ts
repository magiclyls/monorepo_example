import type { CurrencyCode } from '~/composables/useCurrencyData'
import { ApiMemberPromoList } from '@tg/apis'

export function useLoadMemberAppreciation() {
  const HIDE_TODAY = 'local_hide_unlogin_first_recharge_today'
  const HIDE_FOREVER = 'local_hide_unlogin_first_recharge'
  const FORMAT1 = 'YYYY-MM-DD'
  const today = dayjs()
  const { userLanguage, AllLanguages } = storeToRefs(useLanguageStore())
  const appStore = useAppStore()
  const { isLogin, currentGlobalCurrency, userInfo } = storeToRefs(appStore)
  const route = useRoute()

  const isFetchOk = ref(false)
  const popData1 = ref()
  const currentDollarZone = computed(() => AllLanguages.value.filter(lang => lang.value === userLanguage.value)[0].zone)
  const currentLangCurrency = computed(() => {
    return currencyConfig[languageConfig[getCurrentLanguageForFrontend()].currency].cur
  })
  const globalCurrencyCode = computed(() => {
    if (isLogin.value)
      return application.isVirtualCurrency(currentGlobalCurrency.value) ? currencyConfig.USDT.cur : currencyConfig[currentGlobalCurrency.value].cur

    return currentLangCurrency.value
  })
  const usedCurrencyCode = ref<CurrencyCode>(globalCurrencyCode.value)

  // 未登录，首充弹窗数据 ------已登录也挪到这个接口
  const {
    runAsync: runAsyncInfo,
  } = useRequest(ApiMemberPromoList, {
    onSuccess: (data) => {
      isFetchOk.value = true
      if (data.state === -100)
        return Local.set(HIDE_FOREVER, true)
      const { appearLocation, firstDepositPop } = data.promo_info.config // firstDepositPop 1显示，其他不显示  appearLocation 1所有页面，2 仅首页
      const isHome = route.name === 'KeepAliveCasino' || route.name === 'casino-home'
      if (firstDepositPop !== 1)
        return false
      if (appearLocation === 2 && !isHome)
        return false
      if (isLogin.value) {
        if (data.cashback_info) {
          let obj = null
          try {
            obj = JSON.parse(data.cashback_info)
          }
          catch (e) {

          }
          if (obj) {
            const { ty, time } = obj
            const nowTime = Number(data.cur_time)
            const endTime = dayjs.unix(Number(data.reg_time)).add(Number(time), ty === 1 ? 'minute' : 'hour').unix()

            const duration = endTime - nowTime
            obj.duration = duration
            const b = Local.get(`local_hide_first_recharge_${userInfo.value?.uid}`)?.value
            if (b)
              return
            if (obj)
              popData1.value = obj
          }
        }
      }
      else {
        const tongue = data.promo_info.config.tongue || []
        const prize = tongue[usedCurrencyCode.value] || []
        const hide = Local.get(HIDE_FOREVER)?.value
        const hideToday = Local.get(HIDE_TODAY)?.value === today.format(FORMAT1)
        if (prize.length > 0 && !hide && !hideToday)
          popData1.value = data
      }
    },
  })
  const uid = computed(() => userInfo.value?.uid)
  watch([isLogin, uid], ([_isLogin, _uid]) => {
    if (_isLogin) {
      const regToken = Local.get('local_regist_token')?.value
      const isRegist = regToken === appStore.getToken()
      const hide = Boolean(Local.get(`local_hide_first_recharge_${_uid}`)?.value) || false
      if (isRegist && _uid && !hide) {
        runAsyncInfo()
      }
      else {
        isFetchOk.value = true
        popData1.value = null
      }
    }
    else {
      runAsyncInfo()
    }
  }, { immediate: true })

  onMounted(() => {

  })

  return {
    popData1,
    isFetchOk,
  }
}
