import type { IAvailableCurrency, EnumCurrencyKey, TCurrencyObject,IPromoConfig } from '@tg/types'
import type { TTreeListType } from '~/composables/useApiMemberTreeList'
import { ApiFinanceDepositCurrency, ApiFinanceWithdrawCurrency, ApiMemberCurrencySort } from '@tg/apis'

type TBankTreeType<T extends TTreeListType | string>
  = T extends TTreeListType ? TTreeListType : string

type TRealNameKey = 'br' | 'cn' | 'en' | 'in' | 'th' | 'vn' | 'kr' | 'id'

/**
 * 币种 code
 */
export type CurrencyCode =
  '701' | '702' | '703' | '704' | '705' | '706' | '707' | '708' | '709' | '710' | '711' | '712' | '713' | '714' | '715' | '716' | '717' | '718' | '719' | '720' | '721' | '722' | '723' | '724' | '725' | '726' | '727' | '728' | '729' | '730' | '731' | '732' | '733' | '734' | '735'

/**
 * 新的汇率数据
 */
export type IExchangeRateFromToData = {
  [K in CurrencyCode]: string
}

/**
 * 页面渲染的货币列表
 */
export interface CurrencyData<T extends TTreeListType | string = string> {
  /** 货币类型 */
  type: EnumCurrencyKey
  /** 余额 */
  balance: string
  /** 带货币符号的余额 */
  balanceWithSymbol: string
  /** 货币id */
  cur: CurrencyCode
  /** 银行列表 */
  bankTree: TBankTreeType<T>
  /** 货币符号 */
  prefix: string
}
/**
 * 支付通道类型
 */
export interface Merchant {
  min: string
  max: string
  ratio: string
  bonus_max: string
}
/**
 * 钱包存款：支付方式类型
 */
export interface Merchants {
  id: string // 支付平台id
  name: string // 通道名称
  amount_max: string // 通道最大充值金额
  amount_min: string // 通道最小充值金额
  amount_type: number // 金额种类:1:固定2:范围
  amount_fixed: string // 固定金额
  often_amount: string // 常用金额,逗号隔开
  bankcard_id: string // 如果是公司入款，返回银行卡id
  method_id: string
  method_name: string
  alias: string // 支付通道用来组出图片的字段
  /** 是否内嵌模式 upay */
  embedded?: number
   bonus_map: {
      [key: string]: string
    }
    promo_cfgs: IPromoConfig[]
}

interface CurrencyValue {
  prefix: string
  cur: CurrencyCode
  bankTree: string
  /** 最大小数位数 */
  decimal: number
  /** 法币对应member detail中的真实姓名的key */
  realnameKey?: TRealNameKey
}

interface ISortedListItem {
  cur: CurrencyCode
}

const _curMap: Record<EnumCurrencyKey, CurrencyValue> = {
  CNY: {
    prefix: '¥',
    cur: '701',
    bankTree: '019001',
    decimal: 2,
    realnameKey: 'cn',
  },
  BRL: {
    prefix: 'R$',
    cur: '702',
    bankTree: '019002',
    decimal: 2,
    realnameKey: 'br',
  },
  INR: {
    prefix: '₹',
    cur: '703',
    bankTree: '019003',
    decimal: 2,
    realnameKey: 'in',
  },
  KVND: {
    prefix: '₫',
    cur: '704',
    bankTree: '019004',
    decimal: 2,
    realnameKey: 'vn',
  },
  VND: {
    prefix: '₫',
    cur: '704',
    bankTree: '019004',
    decimal: 2,
    realnameKey: 'vn',
  },
  THB: {
    prefix: '฿',
    cur: '705',
    bankTree: '019005',
    decimal: 2,
    realnameKey: 'th',
  },
  KRW: {
    prefix: '₩',
    cur: '733',
    bankTree: '',
    decimal: 2,
    realnameKey: 'kr',
  },
  IDR: {
    prefix: 'Rp',
    cur: '734',
    bankTree: '',
    decimal: 2,
    realnameKey: 'id',
  },
  USDT: {
    prefix: 'USDT',
    cur: '706',
    bankTree: '',
    decimal: 2,
    realnameKey: 'en',
  },
  BTC: {
    prefix: 'BTC',
    cur: '707',
    bankTree: '',
    decimal: 8,
  },
  ETH: {
    prefix: 'ETH',
    cur: '708',
    bankTree: '',
    decimal: 8,
  },
  BNB: {
    prefix: 'BNB',
    cur: '709',
    bankTree: '',
    decimal: 2,
  },
  // 新增货币
  EUR: {
    prefix: '€',
    cur: '710',
    bankTree: '019006',
    decimal: 2,
  },
  JPY: {
    prefix: '¥',
    cur: '711',
    bankTree: '019007',
    decimal: 2,
  },
  CAD: {
    prefix: 'CA$',
    cur: '712',
    bankTree: '019008',
    decimal: 2,
  },
  ARS: {
    prefix: 'ARS',
    cur: '713',
    bankTree: '019009',
    decimal: 2,
  },
  CLP: {
    prefix: 'CLP',
    cur: '714',
    bankTree: '019010',
    decimal: 2,
  },
  PEN: {
    prefix: 'PEN',
    cur: '715',
    bankTree: '019011',
    decimal: 2,
  },
  MXN: {
    prefix: '$',
    cur: '716',
    bankTree: '019012',
    decimal: 2,
  },
  LTC: {
    prefix: 'Ł',
    cur: '717',
    bankTree: '',
    decimal: 2,
  },
  DOGE: {
    prefix: 'Ð',
    cur: '718',
    bankTree: '',
    decimal: 2,
  },
  BCH: {
    prefix: '₿',
    cur: '719',
    bankTree: '',
    decimal: 2,
  },
  XRP: {
    prefix: 'XRP',
    cur: '720',
    bankTree: '',
    decimal: 2,
  },
  EOS: {
    prefix: 'EOS',
    cur: '721',
    bankTree: '',
    decimal: 2,
  },
  TRX: {
    prefix: 'TRX',
    cur: '722',
    bankTree: '',
    decimal: 2,
  },
  USDC: {
    prefix: 'USDC',
    cur: '723',
    bankTree: '',
    decimal: 2,
  },
  APE: {
    prefix: 'APE',
    cur: '724',
    bankTree: '',
    decimal: 6,
  },
  BUSD: {
    prefix: 'BUSD',
    cur: '725',
    bankTree: '',
    decimal: 2,
  },
  CRO: {
    prefix: 'CRO',
    cur: '726',
    bankTree: '',
    decimal: 2,
  },
  DAI: {
    prefix: 'DAI',
    cur: '727',
    bankTree: '',
    decimal: 2,
  },
  LINK: {
    prefix: 'LINK',
    cur: '728',
    bankTree: '',
    decimal: 2,
  },
  SAND: {
    prefix: 'SAND',
    cur: '729',
    bankTree: '',
    decimal: 2,
  },
  SHIB: {
    prefix: 'SHIB',
    cur: '730',
    bankTree: '',
    decimal: 2,
  },
  UNI: {
    prefix: 'UNI',
    cur: '731',
    bankTree: '',
    decimal: 2,
  },
  MATIC: {
    prefix: 'MATIC',
    cur: '732',
    bankTree: '',
    decimal: 2,
  },
  PHP: {
    prefix: '₱',
    cur: '735',
    bankTree: '',
    decimal: 2,
  },
}

export const currencyConfig = new Proxy(_curMap, {
  get(target, key: EnumCurrencyKey) {
    if (key in target) {
      return target[key]
    }
    else {
      if (key === 'VND' || key === 'KVND')
        return target.KVND
      else
        return undefined
    }
  },
})

/**
 *  获取货币配置
 * @param currency 货币类型
 * @returns
 */
export function getCurrencyConfig(currency: EnumCurrencyKey) {
  return currencyConfig[currency]
}
export function getCurrencyConfigByCode(currencyCode: CurrencyCode): {
  prefix: string
  cur: CurrencyCode
  bankTree: string
  name: EnumCurrencyKey
  decimal: number
  realnameKey?: TRealNameKey
} {
  return Object.entries(currencyConfig)
    .map(([k, v]: [string, any]) =>
      ({ name: k, ...v }))
    .filter(i => i.cur === `${currencyCode}`)[0]!
}

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

/**
 * 使用货币数据
 */
export const useCurrencyData = createGlobalState(() => {
  const appStore = useAppStore()
  const {
    userInfo,
    allContractList,
    currentGlobalCurrency,
    balanceData,
    lockerData,
    isLogin,
  } = storeToRefs(appStore)

  const {
    bool: hideZeroBalance,
    setBool: setHideZeroBalance,
  } = useBoolean(Local.get<boolean | undefined>(STORAGE_HIDE_ZERO_BALANCE_KEY)?.value)

  // 搜索内容
  const searchValue = ref('')

  /** 当前选择的货币,用在充值和提现的下拉列表 */
  const currentCurrency = ref(currentGlobalCurrency.value)

  const currentCurrencyCode = computed(() => currencyConfig[currentCurrency.value]?.cur)

  /** 货币排序 */
  const { data: sortList } = useRequest(ApiMemberCurrencySort, {
    manual: false,
  })

  /** 支付可用货币列表-钱包提款-原始数据 */
  const {
    data: financeWithdrawCurrencyData,
    runAsync: runGetFinanceWithdrawCurrencyData,
    loading: widthdrawCurrencyLoading
  } = useRequest(ApiFinanceWithdrawCurrency, {
    manual: false,
    ready: isLogin,
  })

  /** 支付可用货币列表-钱包存款 */
  const {
    data: financeDepositCurrencyData,
    runAsync: runGetFinanceDepositCurrencyData,
  } = useRequest(ApiFinanceDepositCurrency, {
    manual: false,
    ready: isLogin,
  })

  /** 支付可用货币列表-钱包提款-已排序 */
  type TWithdrawCurrencyList = IAvailableCurrency & ISortedListItem
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

  /** 支付可用货币列表-钱包存款-已排序 */
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

  /** 钱包余额 */
  const renderBalanceList = computed(() => {
    const _list = allCurrencyData(balanceData.value).filter(
      ({ balance }) => { return !(hideZeroBalance.value && (Number(balance) === 0)) },
    )

    // 根据排序接口返回的数据排序
    if (sortList.value?.length)
      return sortCurrencyList(sortList.value, _list)

    return _list
  })

  /** 利息宝余额 */
  const renderBalanceLockerList = computed(() => {
    const _list = allCurrencyData(lockerData.value)

    // 根据排序接口返回的数据排序
    if (sortList.value?.length)
      return sortCurrencyList(sortList.value, _list)

    return _list
  })

  /** 钱包弹框，下拉选择 */
  const renderCurrencyList = computed(() => {
    const _list = allCurrencyData(balanceData.value)

    // 根据排序接口返回的数据排序
    if (sortList.value?.length)
      return sortCurrencyList(sortList.value, _list)

    return _list
  })

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

  const CurrencyOptions = computed(() => {
    return renderBalanceList.value.map(item => ({ value: item.cur, label: item.type }))
  })

  /** 清空搜索内容 */
  function clearSearchValue() {
    searchValue.value = ''
  }

  /** 货币列表;含筛选 */
  function allCurrencyData(currency: TCurrencyObject | undefined) {
    if (!currency)
      return []

    const list: CurrencyData[] = []
    for (const key in currency) {
      const type = key as EnumCurrencyKey
      if (Object.values(EnumCurrency).includes(type)) {
        const balanceNumber = currency[type]
        list.push({
          type,
          balance: balanceNumber,
          balanceWithSymbol: balanceNumber,
          cur: getCurrencyConfig(type).cur,
          bankTree: getCurrencyConfig(type).bankTree,
          prefix: getCurrencyConfig(type).prefix,
        })
      }
    }
    if (searchValue.value)
      return list.filter(({ type }) => type.includes(searchValue.value.toLocaleUpperCase()))
    else
      return list
  }

  /** 钱包存取款货币列表，下拉选择 */
  function renderFinanceCurrencyList(financeList: IAvailableCurrency[]) {
    return financeList.map((item) => {
      const type = item.currency_name
      return {
        type,
        balance: item.balance ?? '',
        balanceWithSymbol: item.balance ?? '',
        cur: item?.currency_id,
        bankTree: getCurrencyConfig(type).bankTree,
        prefix: getCurrencyConfig(type).prefix,
      }
    }).filter(b => b.type.includes(searchValue.value.toLocaleUpperCase()))
  }

  function getVirtualCurrencyContractType(currency: EnumCurrencyKey) {
    return allContractListData.value[currency]
  }

  /** 根据协议id获取对应的名称 */
  function getVirContractName(id: string): string {
    return allContractList.value?.find(item => item.id === id)?.name ?? ''
  }

  /** 根据法币获取用户信息中的真实姓名 */
  function getRealNameFromUserInfoByFiatCurrencyId(id: CurrencyCode) {
    const key = getCurrencyConfigByCode(id).realnameKey

    if (key)
      return userInfo.value?.realname[key]
  }

  return {
    sortList,
    renderBalanceList,
    renderBalanceLockerList,
    currentCurrency,
    currentCurrencyCode,
    searchValue,
    hideZeroBalance,
    renderCurrencyList,
    allContractListData,
    withdrawCurrencyList,
    depositCurrencyList,
    balanceData,
    renderFinanceCurrencyList,
    CurrencyOptions,
    widthdrawCurrencyLoading,
    clearSearchValue,
    setHideZeroBalance,
    getVirtualCurrencyContractType,
    getVirContractName,
    runGetFinanceWithdrawCurrencyData,
    getRealNameFromUserInfoByFiatCurrencyId,
    runGetFinanceDepositCurrencyData,
    sortCurrencyList
  }
})

// export function useCurrencyOptions() {
//   const appStore = useAppStore()
//   const {
//     balanceData,
//   } = storeToRefs(appStore)

//   /** 货币排序 */
//   const { data: sortList } = useRequest(ApiMemberCurrencySort, {
//     manual: false,
//   })

//   /**
//    * 获取货币下拉列表
//    */
//   const getCurrencyOptions = computed(() => {
//     const options: {
//       value: CurrencyCode
//       label: EnumCurrencyKey
//       cur: CurrencyCode
//     }[] = []
//     for (const key in (balanceData.value ?? [])) {
//       const type = key as EnumCurrencyKey
//       if (Object.values(EnumCurrency).includes(type)) {
//         const cur = currencyConfig[key as EnumCurrencyKey].cur
//         options.push({
//           value: cur,
//           label: key as EnumCurrencyKey,
//           cur,
//         })
//       }
//     }
//     if (sortList.value && sortList.value.length)
//       return sortCurrencyList(sortList.value, options)
//     return options
//   })

//   return {
//     getCurrencyOptions,
//   }
// }
