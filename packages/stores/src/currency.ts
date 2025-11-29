import type {
  CurrencyCode,
  CurrencyData,
  EnumCurrencyKey,
  IAvailableCurrency,
  ISortedListItem,
} from '@tg/types'
import { ApiFinanceDepositCurrency, ApiFinanceWithdrawCurrency, ApiMemberBalance, ApiMemberCurrencySort } from '@tg/apis'
import { EnumCurrency, languageConfig, SendFlutterAppMessage } from '@tg/types'
import { getCurrencyConfig, isFlutterApp, Local, sendMsgToFlutterApp, STORAGE_CURRENT_GLOBAL_CURRENCY_KEY, sub, toFixed } from '@tg/utils'
import { getLang } from '@tg/vue-i18n'
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useRequest } from 'vue-request'
import { useAppStore } from './app'
/**
 * 根据排序接口返回的数据排序
 * @param sortList
 * @param list
 */
export function sortCurrencyList<T extends ISortedListItem>(sortList: CurrencyCode[], list: T[]) {
  const sortedList = list.sort((a, b) => {
    const indexA = sortList.indexOf(a.cur)
    const indexB = sortList.indexOf(b.cur)
    return indexA - indexB
  })

  return sortedList
}

export const useCurrency = defineStore('currency', () => {
  /** 隐藏余额为0的货币 */
  const isHideZeroBalance = ref(false)
  const appStore = useAppStore()
  const {
    lockerData,
  } = storeToRefs(appStore)
  /** 当前全局选择的货币信息 */
  const currentGlobalCurrencyMap = ref<CurrencyData>({
    /** 货币类型 */
    type: getLocalCurrentGlobalCurrency(),
    /** 余额 */
    balance: '0',
    /** 带货币符号的余额 */
    balanceWithSymbol: '0',
    /** 货币id */
    cur: getCurrencyConfig(getLocalCurrentGlobalCurrency()).cur,
    /** 银行列表 */
    bankTree: '',
    /** 货币符号 */
    prefix: '',
    /** 小数点位数 */
    decimal: 2,
    /** 货币类型 以前通过code获得时使用，直接使用的话用type */
    name: getLocalCurrentGlobalCurrency(),
  })
  /** 排序数据 */
  const sortList = ref<CurrencyCode[]>([])
  /** 支付可用货币列表-钱包存款 */
  const financeDepositCurrencyData = ref<IAvailableCurrency[]>([])
  /** 支付可用货币列表-钱包提款 */
  const financeWithdrawCurrencyData = ref<IAvailableCurrency[]>([])

  /** 余额接口 */
  const {
    run: runGetMemberBalance,
    runAsync: runAsyncGetMemberBalance,
    loading: loadingMemberBalance,
    data: memberBalanceList,
  } = useRequest(ApiMemberBalance)

  /** 钱包余额货币列表 */
  const currencyList = computed(() => {
    if (memberBalanceList.value) {
      const list: CurrencyData[] = []
      for (const key in memberBalanceList.value) {
        const type = key as EnumCurrencyKey
        if (Object.values(EnumCurrency).includes(type)) {
          const balanceNumber = memberBalanceList.value[type]
          list.push({
            type,
            balance: balanceNumber,
            balanceWithSymbol: balanceNumber,
            ...getCurrencyConfig(type),
          })
        }
      }

      // 根据排序接口返回的数据排序
      if (sortList.value?.length)
        return sortCurrencyList(sortList.value, list)
      return list
    }
    return []
  })

  /** 利息宝余额 */
  const renderBalanceLockerList = computed(() => {
    if (lockerData.value) {
      const list: CurrencyData[] = []
      for (const key in lockerData.value) {
        const type = key as EnumCurrencyKey
        if (Object.values(EnumCurrency).includes(type)) {
          const balanceNumber = lockerData.value[type]
          list.push({
            type,
            balance: balanceNumber,
            balanceWithSymbol: balanceNumber,
            ...getCurrencyConfig(type),
          })
        }
      }

      // 根据排序接口返回的数据排序
      if (sortList.value?.length)
        return sortCurrencyList(sortList.value, list)
      return list
    }
    return []
  })

  /** 支付可用货币列表-钱包提款-已排序 */
  type TWithdrawCurrencyList = IAvailableCurrency & ISortedListItem
  const depositCurrencyList = computed(() => {
    if (financeDepositCurrencyData.value && sortList.value) {
      return sortCurrencyList<TWithdrawCurrencyList>(sortList.value, financeDepositCurrencyData.value.map((a) => {
        return {
          ...a,
          cur: a.currency_id,
        }
      }))
    }
    return []
  })
  /** 支付可用货币列表-钱包提款-已排序 */
  const withdrawCurrencyList = computed(() => {
    if (financeWithdrawCurrencyData.value && sortList.value) {
      return sortCurrencyList<TWithdrawCurrencyList>(sortList.value, financeWithdrawCurrencyData.value.map((a) => {
        return {
          ...a,
          cur: a.currency_id,
        }
      }))
    }
    return []
  })

  /** 从接口获取数据，给页面货币列表赋值 */
  async function initCurrencyList() {
    if (isFlutterApp())
      sendMsgToFlutterApp(SendFlutterAppMessage.REFRESH_BALANCE)
    await runAsyncGetMemberBalance()
    // 增加默认货币逻辑
    const currencyDefault = getLocalCurrentGlobalCurrency()
    const index = currencyList.value.findIndex(a => a.type === currencyDefault)
    if (index > -1) {
      setCurrentGlobalCurrency(currencyList.value[index])
    }
    else {
      setCurrentGlobalCurrency(currencyList.value[0])
    }
  }

  /** 本地减少当前货币余额 */
  function deductCurrentGlobalCurrencyBalance(amount: number) {
    const val = toFixed(sub(Number(currentGlobalCurrencyMap.value.balance), amount), currentGlobalCurrencyMap.value.decimal)
    currentGlobalCurrencyMap.value.balance = val
  }

  /** 支付可用货币列表-钱包存款 */
  async function getFinanceDepositCurrency() {
    financeDepositCurrencyData.value = await ApiFinanceDepositCurrency()
  }
  /** 支付可用货币列表-钱包存款 */
  async function getFinanceWithdrawCurrency() {
    financeWithdrawCurrencyData.value = await ApiFinanceWithdrawCurrency()
  }

  /** 货币排序 */
  async function getMemberCurrencySort() {
    const res = await ApiMemberCurrencySort()
    sortList.value = res
  }

  /** 设置货币 */
  function setCurrentGlobalCurrency(currency: CurrencyData) {
    currentGlobalCurrencyMap.value = currency
    setLocalCurrentGlobalCurrency(currency.type)
  }

  /** 设置本地存储的当前全局选择的货币 */
  function setLocalCurrentGlobalCurrency(currency: EnumCurrencyKey) {
    if (isFlutterApp())
      sessionStorage.setItem('current_global_currency', currency)
    else
      Local.set(STORAGE_CURRENT_GLOBAL_CURRENCY_KEY, currency)
  }

  /** 获取本地存储的当前全局选择的货币 */
  function getLocalCurrentGlobalCurrency(): EnumCurrencyKey {
    const appCurrency = sessionStorage.getItem('current_global_currency') as (EnumCurrencyKey | undefined | null)

    const currency = Local.get<
      EnumCurrencyKey
    >(STORAGE_CURRENT_GLOBAL_CURRENCY_KEY)?.value

    if (isFlutterApp()) {
      return appCurrency
        ?? languageConfig[getLang()]?.currency
        ?? (getLang() === 'pt-BR' ? 'BRL' : 'USDT')
    }
    else {
      if (currency && currency !== null) {
        return currency
      }
      else {
        return languageConfig[getLang()]?.currency
          ?? (getLang() === 'pt-BR' ? 'BRL' : 'USDT')
      }
    }
  }

  /**
   * 根据排序接口返回的数据排序
   * @param sortList
   * @param list
   */
  function sortCurrencyList<T extends ISortedListItem>(sortList: CurrencyCode[], list: T[]) {
    const sortedList = list.sort((a, b) => {
      const indexA = sortList.indexOf(a.cur)
      const indexB = sortList.indexOf(b.cur)
      return indexA - indexB
    })

    return sortedList
  }

  onMounted(() => {
    getMemberCurrencySort()
  })

  return {
    sortList,
    currencyList,
    currentGlobalCurrencyMap,
    depositCurrencyList,
    withdrawCurrencyList,
    loadingMemberBalance,
    isHideZeroBalance,
    renderBalanceLockerList,
    initCurrencyList,
    getFinanceDepositCurrency,
    getFinanceWithdrawCurrency,
    setCurrentGlobalCurrency,
    setLocalCurrentGlobalCurrency,
    runGetMemberBalance,
    deductCurrentGlobalCurrencyBalance,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useCurrency, import.meta.hot))
