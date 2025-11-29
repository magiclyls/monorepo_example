import type { TCurrencyObject } from '@tg/types'
import {
  ApiFinanceMethodComboListV2,
  ApiFinanceUpayBalance,
  ApiFinanceUpayGotobuy,
  ApiMemberAuthConfig,
  ApiMemberBalanceLocker,
  ApiMemberDetail,
  ApiMemberKYCInfo,
} from '@tg/apis'
import {
  useApiMemberTreeList,
  useBoolean,
} from '@tg/hooks'
import { EventBusNames } from '@tg/types'
import {
  appEventBus,
  getFlutterAppToken,
  isFlutterApp,
  Local,
  statisticsObj,
  STORAGE_TOKEN_KEY,
} from '@tg/utils'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRequest } from 'vue-request'

export const useAppStore = defineStore('app', () => {
  /** adjust eventtoken */
  const adjustEventToken = ref<any>({})
  /** upay 余额接口错误data code */
  const upayBalErrCode = ref()
  const showSideMenu = ref(false)
  const currentPath = ref('')
  /** 是否登录，程序用这个变量来判断是否登录 */
  const { bool: isLogin, setTrue: setLoginTrue, setFalse: setLoginFalse } = useBoolean(!!getToken())
  const balanceData = ref<TCurrencyObject>()
  const { bool: gameIsStart, setBool: setGameStartBool } = useBoolean(false)

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
  /** 获取用户锁定余额 */
  const { data: lockerData, runAsync: getLockerData } = useRequest(ApiMemberBalanceLocker, {
    ready: isLogin,
  })

  /** 用户KYC信息 */
  const { data: memberKYCInfo, runAsync: runGetMemberKYCInfo } = useRequest(ApiMemberKYCInfo, {
    ready: isLogin,
    manual: false,
  })

  /** MQTT是否已连接 */
  const { bool: mqttIsConnected, setTrue: setMqttConnectedTrue, setFalse: setMqttConnectedFalse } = useBoolean(false)

  const userInfo = computed(() => {
    if (balanceData.value && _userInfo.value)
      _userInfo.value.balance = balanceData.value

    if (lockerData.value && _userInfo.value)
      _userInfo.value.balance_locker = lockerData.value

    return _userInfo.value
  })

  /** 判断 人民下是否开通了upay互通 */
  const {
    runAsync: runAsyncPayCombo,
    data: comboList,
    loading: comboLoading,
  } = useRequest(ApiFinanceMethodComboListV2, {
    manual: true,
  })

  const {
    runAsync: runAsyncCnyPayCombo,
    data: comboCnyList,
    loading: comboCnyLoading,
  } = useRequest(() => ApiFinanceMethodComboListV2({ currency_id: '701' }), {
    manual: true,
  })
  /** 人民币下有没有开通 upay 互通 */
  const hasOpenUpayRoad = computed(() => {
    if (comboCnyList.value && comboCnyList.value.method && comboCnyList.value.method.length) {
      const arr = comboCnyList.value?.method.map(m => m.merchants && m.merchants.length ? m.merchants : []).flat()
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
  /** 是否开启了自我排除 */
  const isSelfExcludeOpen = computed(() => userInfo.value?.exclude === 1)

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

  const {
    loading: loadingAuthConfig,
    data: authConfig,
    runAsync: runMemberAuthConfig,
  } = useRequest(ApiMemberAuthConfig, {
    ready: isLogin,
    manual: false,
    throttleInterval: 500,
  })

  const isSetAuth = computed(() => {
    return authConfig.value?.is_secret === '1'
  })
  const isSetPayPwd = computed(() => {
    return authConfig.value?.is_pay_password === '1'
  })
  runMemberAuthConfig()

  function setToken(token: string) {
    // 将token加密后存储到本地
    Local.set(STORAGE_TOKEN_KEY, token)
    setLoginTrue()
  }

  function getToken() {
    if (isFlutterApp())
      return getFlutterAppToken()

    return Local.get<string | undefined>(STORAGE_TOKEN_KEY)?.value
  }

  function removeToken() {
    Local.remove(STORAGE_TOKEN_KEY)
    setLoginFalse()
  }

  function removeUserInfo() {
    _userInfo.value = undefined
  }

  /**
   * 动态修改 comboList 的值
   */
  function setComboList(d: any) {
    comboList.value = d
  }

  appEventBus.on(EventBusNames.MQTT_CONNECT_SUCCESS_BUS, () => {
    console.log('设置mqtt连接成功')
    setMqttConnectedTrue()
  })
  appEventBus.on(EventBusNames.MQTT_DISCONNECT_BUS, () => {
    console.log('设置mqtt连接失败')
    setMqttConnectedFalse()
  })

  return {
    isLogin,
    mqttIsConnected,
    isCompleteKYC,
    memberKYCInfo,
    userInfo,
    uPayBalance,
    loadingUpayBalance,
    uPayUrl,
    loadingUpayUrl,
    upayBalErrCode,
    comboList,
    comboLoading,
    hasOpenUpayRoad,
    comboCnyLoading,
    comboCnyList,
    balanceData,
    allContractList,
    allContractListData,
    isSetAuth,
    isSetPayPwd,
    lockerData,
    gameIsStart,
    showSideMenu,
    currentPath,
    isSelfExcludeOpen,
    adjustEventToken,
    setGameStartBool,
    getLockerData,
    setToken,
    setLoginTrue,
    setLoginFalse,
    removeToken,
    getToken,
    updateUserInfo,
    removeUserInfo,
    setMqttConnectedTrue,
    setMqttConnectedFalse,
    runGetMemberKYCInfo,
    runGetUpayBalance,
    runGetUpayUrl,
    runAsyncPayCombo,
    runAsyncCnyPayCombo,
    runMemberAuthConfig,
    setComboList,
    updateAllContractList,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
