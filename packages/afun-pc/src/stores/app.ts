import type { EnumCurrencyKey, MaintainData, TCurrencyObject, TTheme } from '@tg/types'
import { ApiFinanceMethodComboListV2, ApiFinanceUpayBalance, ApiFinanceUpayGotobuy, ApiGameRecycle, ApiMemberBalance, ApiMemberBalanceLocker, ApiMemberDetail, ApiMemberKYCInfo, ApiMemberRebateAutomatic, ApiMemberVipBonusRecord, ApiMemberVipConfig, ApiMemberVipDetail } from '@tg/apis'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { globalInitMap } from '~/utils/init'

const today = dayjs()

export const useAppStore = defineStore('app', () => {
  /** adjust eventtoken */
  const adjustEventToken = ref<any>({})
  const route = useRoute()
  const { isMobile } = storeToRefs(useWindowStore())
  const { brandPc } = storeToRefs(useBrandStore())
  const balanceData = ref<TCurrencyObject>()
  /** 请注意如果要判断这个值 new-default 也是默认颜色 所以默认的时候要写在最后用else判断 默认颜色不要判断固定的值 */
  const theme = ref<TTheme>(globalInitMap.currentTheme as TTheme)
  const { bool: gameIsStart, setBool: setGameStartBool } = useBoolean(false)
  const maintainData = ref<MaintainData | undefined>()

  function setMaintainData(d: MaintainData) {
    maintainData.value = d
  }

  /** 当前全局选择的货币 */
  const currentGlobalCurrency = ref<EnumCurrencyKey>(getLocalCurrentGlobalCurrency())
  /** 首次加载完成-用于优化一些比较大的元素，在首屏内容加载完成后再加载，比如首页右下角的活动轮播 */
  const isAppFirstLoadFinish = ref(false)
  /** upay 余额接口错误data code */
  const upayBalErrCode = ref()

  /** 是否登录，程序用这个变量来判断是否登录 */
  const { bool: isLogin, setTrue: setLoginTrue, setFalse: setLoginFalse } = useBoolean(!!getToken())
  /** 用户信息 */
  const { data: _userInfo, runAsync: updateUserInfo } = useRequest(ApiMemberDetail, {
    ready: isLogin,
    manual: false,
    onSuccess() {
      if (statisticsObj.o)
        appEventBus.emit(EventBusNames.STATISTICS_BUS, statisticsObj.o)
    },
  })
  /** 获取所有虚拟币协议 */
  const {
    data: allContractList,
    runAsync: updateAllContractList,
  } = useApiMemberTreeList('018')
    /** 虚拟币协议格式化 */
  const allContractListData = computed(() => {
    if (allContractList.value?.length) {
      const res: Record<string, { label: string, value: string }[]> = {}
      for (const item of allContractList.value) {
        if (item.pid === '1800') {
          res[item.name] = []
        }
        else {
          const parent = allContractList.value.find(i => i.id === item.pid)
          if (parent) {
            res[parent.name]
              ? res[parent.name].push({ label: item.name, value: item.id })
              : res[parent.name] = [{ label: item.name, value: item.id }]
          }
        }
      }
      return res
    }
    return {}
  })
  /** 获取用户余额 */
  const { runAsync: getBalanceData } = useRequest(ApiMemberBalance, {
    ready: isLogin,
    manual: false,
    onAfter: () => {
      if (isFlutterApp())
        sendMsgToFlutterApp(SendFlutterAppMessage.REFRESH_BALANCE)
    },
    onSuccess(res) {
      const _banlance = res
      if (_banlance.VND) {
        _banlance.KVND = _banlance.VND
        delete _banlance.VND
      }
      balanceData.value = _banlance
    },
  })
  /** 获取用户锁定余额 */
  const { data: lockerData, runAsync: getLockerData } = useRequest(ApiMemberBalanceLocker, {
    ready: isLogin,
  })

  // 是否手动领取
  const { runAsync: runAsyncRebateAutomatic, data: rebateAutomatic } = useRequest(ApiMemberRebateAutomatic, {
    manual: true,
  })

  /** 用户KYC信息 */
  const { data: memberKYCInfo, runAsync: runGetMemberKYCInfo } = useRequest(ApiMemberKYCInfo, {
    ready: isLogin,
    manual: false,
  })

  /** 公司信息 */
  const { VITE_OFFICIAL_DOMAIN, VITE_SITE_NAME } = getEnv()
  const emailObj: { [k: string]: string } = {
    meibo: 'meibocom@gmail.com',
    wi6: 'win6com@gmail.com',
    ju8: 'ju88com@gmail.com',
  }
  const companyData = ref({
    email: emailObj[VITE_SITE_NAME],
    // 合作伙伴邮箱
    partnerEmail: `partners@${VITE_OFFICIAL_DOMAIN}`,
    // 新闻媒体邮箱
    newsEmail: `press@${VITE_OFFICIAL_DOMAIN}`,
  })
  /**
   * Logo，Ico，Loading 图片
   */
  const logoAndIcoAndLoading = computed(() => {
    if (brandPc.value) {
      return {
        logo_white: brandPc.value.pc_logo_white,
        logo_gray: brandPc.value.pc_logo_gray,
        ico: brandPc.value.pc_icon || '',
        loadingImgUrl: brandPc.value.pc_loading?.image ?? '',
        first_letter: brandPc.value.pc_first_letter,
        after_login: brandPc.value.pc_logo_white_after_login,
      }
    }
    return {
      logo_white: '',
      logo_gray: '',
      ico: '',
      loadingImgUrl: '',
      first_letter: '',
    }
  })

  const icoUrl = computed(() => logoAndIcoAndLoading.value.ico)
  const visibility = useDocumentVisibility()

  useIco(icoUrl)

  /** MQTT是否已连接 */
  const { bool: mqttIsConnected, setTrue: setMqttConnectedTrue, setFalse: setMqttConnectedFalse } = useBoolean(false)

  /** 会员vip基础配置活动详情 */
  const { data: vipRuleDetailData, run: runGetVipRuleDetailData } = useRequest(() => ApiMemberVipDetail({ lang: getCurrentLanguageForBackend() }))
  /** vip配置 */
  const { runAsync: runGetVipConfig, data: vipConfigData, loading: getVipConfigLoading } = useRequest(ApiMemberVipConfig, {
    // ready: isLogin,
    manual: false,
    onSuccess(res) {
      if (res && res.front_show === '1' && !vipRuleDetailData.value)
        runGetVipRuleDetailData()
    },
  })
  /** 会员vip奖金近90天领取记录 - 没有记录时隐藏tab */
  const { runAsync: runGetMemberVipBonusRecord, data: memberVipBonusRecordData } = useRequest(() => ApiMemberVipBonusRecord({
    page: 1,
    page_size: 10,
    start_time: today.subtract(89, 'day').startOf('day').unix(),
    end_time: today.endOf('day').unix(),
    cash_type: '',
  }), { ready: isLogin })

  const userInfo = computed(() => {
    if (balanceData.value && _userInfo.value)
      _userInfo.value.balance = balanceData.value

    if (lockerData.value && _userInfo.value)
      _userInfo.value.balance_locker = lockerData.value

    return _userInfo.value
  })

  /** 用户当前选择的货币余额, 带有符号前缀 */
  const currentGlobalCurrencyBalance = computed(() => {
    if (balanceData.value && _userInfo.value)
      return userInfo.value?.balance[currentGlobalCurrency.value]
    return application.isVirtualCurrency(currentGlobalCurrency.value) ? '0.00000000' : '0.00'
  })

  /** 用户当前选择的货币余额, 数字 */
  const currentGlobalCurrencyBalanceNumber = computed(() => {
    // const currency = currentGlobalCurrency.value
    // const balance = userInfo.value?.balance[currency]
    return Number(currentGlobalCurrencyBalance.value ?? 0)
  })

  const readyGetUpayBalance = computed(() => !!(isLogin.value)) //  && userInfo.value?.realname?.cn
  /** 判断 人民下是否开通了upay互通 */
  const {
    runAsync: runAsyncCnyPayCombo,
    loading:comboCnyLoading,
    data: comboList,
  } = useRequest(() => ApiFinanceMethodComboListV2({ currency_id: '701' }), {
    manual: true,
  })
  /** 人民币下有没有开通 upay 互通 */
  const hasOpenUpayRoad = computed(() => {
    if (comboList.value && comboList.value.method && comboList.value.method.length) {
      const arr = comboList.value?.method.map(m => m.merchants && m.merchants.length ? m.merchants : []).flat()
      if (arr.filter(a => a.embedded === 1).length)
        return true
    }
    return false
  })
  /** 是否完成KYC验证 */
  const isCompleteKYC = computed(() => {
    return memberKYCInfo.value?.kyc_state === undefined
      ? false
      : (memberKYCInfo.value?.kyc_state === 2 || memberKYCInfo.value?.kyc_state === 4)
  })

  /** 后台是否配置了返水数据 */
  const isHaveVIPRebateConfig = computed(() => rebateAutomatic.value ? rebateAutomatic.value.gts !== '' : false)

  /** 后台是否开启VIP入口展示 */
  const isVipOpen = computed(() => vipConfigData.value ? vipConfigData.value.front_show === '1' : false)
  /** 后台是否开启VIP晋级奖金 */
  const isVipUpgradeBonusOpen = computed(() => vipConfigData.value ? vipConfigData.value.upgrade === '1' : false)
  /** 后台是否开启VIP日奖金 */
  const isVipDayBonusOpen = computed(() => vipConfigData.value ? vipConfigData.value.day === '1' : false)
  /** 后台是否开启VIP周奖金 */
  const isVipWeekBonusOpen = computed(() => vipConfigData.value ? vipConfigData.value.week === '1' : false)
  /** 后台是否开启VIP月奖金 */
  const isVipMonthBonusOpen = computed(() => vipConfigData.value ? vipConfigData.value.month === '1' : false)
  /** VIP奖金全部关闭 */
  const isAllVipBonusClosed = computed(() => !isVipDayBonusOpen.value && !isVipWeekBonusOpen.value && !isVipMonthBonusOpen.value)
  /** 会员是否有vip奖金领取记录 */
  const isMemberHaveVipBonusRecord = computed(() => {
    if (memberVipBonusRecordData.value)
      return memberVipBonusRecordData.value.d && memberVipBonusRecordData.value.d.length > 0

    return false
  })

  /** U币存款链接 */
  const {
    data: uPayUrl,
    runAsync: runGetUpayUrl,
    loading: loadingUpayUrl,
  } = useRequest(ApiFinanceUpayGotobuy, {
    manual: true,
  })
  /** U币余额 */
  const {
    data: uPayBalance,
    runAsync: runGetUpayBalance,
    loading: loadingUpayBalance,
  } = useRequest(ApiFinanceUpayBalance, {
    ready: hasOpenUpayRoad,
    manual: true,
    onError: (err: Error) => {
      console.log('哈哈哈哈哈 err upay ====== ', err)
      try {
        const msg = JSON.parse(err?.message)
        upayBalErrCode.value = msg.data
        if (msg && msg.data && msg.data === '5024') {
          setTimeout(() => {
            upayBalErrCode.value = undefined
          }, 2000)
        }
      }
      catch {

      }
    },
  })

  function setToken(token: string) {
    // 将token加密后存储到本地
    Local.set(STORAGE_TOKEN_KEY, token)
    setLoginTrue()
  }

  function getToken() {
    if (isFlutterApp())
      return getFlutterAppToken()

    const _token = Local.get<string | undefined>(STORAGE_TOKEN_KEY)?.value
    if (_token)
      return _token
    else
      return undefined
  }

  function removeToken() {
    Local.remove(STORAGE_TOKEN_KEY)
    setLoginFalse()
  }

  function removeUserInfo() {
    _userInfo.value = undefined
  }

  /** 获取本地存储的当前全局选择的货币 */
  function getLocalCurrentGlobalCurrency(): EnumCurrencyKey {
    const appCurrency = sessionStorage.getItem('current_global_currency') as (EnumCurrencyKey | undefined | null)

    const currency = Local.get<
      EnumCurrencyKey
    >(STORAGE_CURRENT_GLOBAL_CURRENCY_KEY)?.value

    if (isFlutterApp()) {
      return appCurrency
        ?? languageConfig[getCurrentLanguageForFrontend()]?.currency
        ?? (getCurrentLanguageForFrontend() === 'pt-BR' ? 'BRL' : 'USDT')
    }
    else {
      if (currency && currency !== null) {
        return currency
      }
      else {
        return languageConfig[getCurrentLanguageForFrontend()]?.currency
          ?? (getCurrentLanguageForFrontend() === 'pt-BR' ? 'BRL' : 'USDT')
      }
    }
  }

  /** 获取对应语言的币种 */
  function getLanguageCurrency() {
    return languageConfig[getCurrentLanguageForFrontend()]?.currency
      ?? (getCurrentLanguageForFrontend() === 'pt-BR' ? 'BRL' : 'USDT')
  }

  /** 设置本地存储的当前全局选择的货币 */
  function setLocalCurrentGlobalCurrency(currency: EnumCurrencyKey) {
    if (isFlutterApp())
      sessionStorage.setItem('current_global_currency', currency)
    else
      Local.set(STORAGE_CURRENT_GLOBAL_CURRENCY_KEY, currency)
  }

  /** 改变全局货币 */
  function changeGlobalCurrency(currency: EnumCurrencyKey) {
    currentGlobalCurrency.value = currency
    setLocalCurrentGlobalCurrency(currency)
  }

  /**
   * 扣除当前全局选中货币的余额
   * @param num 扣除的数值
   */
  function deductCurrentGlobalCurrencyBalance(num: number) {
    const currency = currentGlobalCurrency.value
    const balance = balanceData.value?.[currency]
    const fixedNumber = ['BTC', 'ETH'].includes(currency) ? 8 : 2
    const val = toFixed(sub(Number(balance), num), fixedNumber)

    if (balanceData.value && balance && +val >= 0)
      balanceData.value[currency] = val
  }

  /**
   * 设置首屏加载完成状态、延迟3秒
   */
  function setIsAppFirstLoadFinish() {
    setTimeout(() => {
      isAppFirstLoadFinish.value = true
    }, 3000)
  }

  /**
   * 改变主题
   * @param val
   */
  function changeTheme(val: TTheme) {
    changeMetaTheme(val)
    document.documentElement.setAttribute('theme', val)
    theme.value = val
    globalInitMap.currentTemplate = EnumsTheme[val]
  }

  /**
   * 动态修改 comboList 的值
   */
  function setComboList(d: any) {
    comboList.value = d
  }

  // 移除重复的初始化函数，只保留一个
  function initializePixelIds() {
    const params = new URLSearchParams(window.location.search)
    const fbPixelId = params.get('fbPixelId')

    if (fbPixelId) {
      console.log('Initializing Facebook Pixel ID:', fbPixelId)
      Local.set('tgfacebookId', { value: fbPixelId })

      // Add safety check for statistics object and its methods
      if (statisticsObj && typeof statisticsObj.resetInit === 'function') {
        console.log('Resetting statistics with new Facebook Pixel ID')
        statisticsObj.resetInit(['facebook'])
      }
      else {
        console.warn('Statistics object not ready yet')
      }
    }
  }

  // 使用 watch 来监听路由变化，在应用初始化时执行
  watch(() => route.fullPath, () => {
    initializePixelIds()
  }, { immediate: true })

  // 在更早的时机初始化
  onBeforeMount(() => {
    console.log('Initializing pixel IDs')
    initializePixelIds()
  })

  // 添加在 store 开始处
  function initPixelIds() {
    const params = new URLSearchParams(window.location.search)
    const fbPixelId = params.get('fbPixelId')

    if (fbPixelId) {
      console.log('Saving FB Pixel ID:', fbPixelId)
      Local.set(STORAGE_FB_PIXEL_ID, fbPixelId)
    }
  }

  // 在 store 初始化时调用
  onMounted(() => {
    initPixelIds()
  })

  let getBalanceTimer: any = null
  watch(visibility, (bool) => {
    // 如果页面可见，更新用户余额
    // 轮训三次回收娱乐城余额
    if (!route.fullPath.includes('casino/mobile-game-frame') && !route.fullPath.includes('casino/games')) {
      if (bool === 'visible' && isLogin.value && isMobile.value) {
        if (getBalanceTimer) {
          clearInterval(getBalanceTimer)
          getBalanceTimer = null
        }
        let count = 0
        getBalanceTimer = setInterval(() => {
          count++
          if (count === 3 || count === 13 || count === 23) {
            if (!route.fullPath.includes('casino/mobile-game-frame') && !route.fullPath.includes('casino/games') && isLogin.value) {
              ApiGameRecycle().finally(() => {
                getBalanceData()
              })
            }
          }

          if (count > 23) {
            clearInterval(getBalanceTimer)
            getBalanceTimer = null
          }
        }, 1000)
      }
    }

    if (bool === 'visible') {
      if (isLogin.value)
        updateUserInfo()
    }
  })

  appEventBus.on(EventBusNames.MQTT_CONNECT_SUCCESS_BUS, () => {
    console.log('设置mqtt连接成功')
    setMqttConnectedTrue()
  })
  appEventBus.on(EventBusNames.MQTT_DISCONNECT_BUS, () => {
    console.log('设置mqtt连接失败')
    setMqttConnectedFalse()
  })

  // 初始化时调用，如果后台没有配置返水数据则隐藏Tab
  function getRebateTabStatus() {
    const globalCurrencyCode = currencyConfig[currentGlobalCurrency.value]?.cur ?? '701'
    // const currency_id = supportedCur.includes(globalCurrencyCode) ? globalCurrencyCode : '706'
    runAsyncRebateAutomatic(globalCurrencyCode)
  }
  getRebateTabStatus()

  // 监听货币变化重新获取是否隐藏VIP反水Tab
  watch(currentGlobalCurrency, () => {
    getRebateTabStatus()
  })

  return {
    isLogin,
    userInfo,
    mqttIsConnected,
    allContractList,
    allContractListData,
    currentGlobalCurrency,
    vipConfigData,
    currentGlobalCurrencyBalance,
    currentGlobalCurrencyBalanceNumber,
    companyData,
    logoAndIcoAndLoading,
    getVipConfigLoading,
    balanceData,
    lockerData,
    rebateAutomatic,
    isAppFirstLoadFinish,
    theme,
    uPayBalance,
    loadingUpayBalance,
    uPayUrl,
    loadingUpayUrl,
    readyGetUpayBalance,
    upayBalErrCode,
    comboList,
    comboCnyLoading,
    hasOpenUpayRoad,
    isCompleteKYC,
    memberKYCInfo,
    gameIsStart,
    isHaveVIPRebateConfig,
    isVipOpen,
    isVipUpgradeBonusOpen,
    isVipDayBonusOpen,
    isVipWeekBonusOpen,
    isVipMonthBonusOpen,
    isAllVipBonusClosed,
    isMemberHaveVipBonusRecord,
    vipRuleDetailData,
    adjustEventToken,
    setGameStartBool,
    setToken,
    setLoginTrue,
    setLoginFalse,
    removeToken,
    getToken,
    updateUserInfo,
    removeUserInfo,
    setMqttConnectedTrue,
    setMqttConnectedFalse,
    getBalanceData,
    getLockerData,
    runGetVipConfig,
    runGetMemberVipBonusRecord,
    changeGlobalCurrency,
    runAsyncRebateAutomatic,
    deductCurrentGlobalCurrencyBalance,
    setIsAppFirstLoadFinish,
    getLanguageCurrency,
    changeTheme,
    runGetUpayBalance,
    runGetUpayUrl,
    runAsyncCnyPayCombo,
    setComboList,
    runGetMemberKYCInfo,
    updateAllContractList,
    initializePixelIds,
    maintainData,
    setMaintainData,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
