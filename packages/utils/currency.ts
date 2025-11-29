import type { CurrencyCode, CurrencyValue, EnumCurrencyKey } from '@tg/types'

export const currencyMap: Record<EnumCurrencyKey, CurrencyValue> = {
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

/**
 * 获取语言的静态配置
 */
export function getCurrencyConfig(currency: EnumCurrencyKey | CurrencyCode) {
  if (!Number.isNaN(Number(currency))) {
    const keys = Object.keys(currencyMap) as EnumCurrencyKey[]
    const values = Object.values(currencyMap)
    const index = values.findIndex(item => Number(item.cur) === Number(currency))
    const currencyKey = keys[index]
    return {
      ...currencyMap[currencyKey],
      name: currencyKey,
    }
  }

  return {
    ...currencyMap[currency as EnumCurrencyKey],
    name: currency as EnumCurrencyKey,
  }
}
