import type { EnumCurrencyKey } from '../apis'
import type { EnumLanguageKeys } from '../enums'

export type TTreeListType =
  '001' | '019001' | '019004' | '004' | '005' | '006' | '007' | '008' | '011' | '019002' | '019003' | '019005' | '018001' | '018002' | '018003' | '018004' | '018'

export type TBankTreeType<T extends TTreeListType | string>
  = T extends TTreeListType ? TTreeListType : string

export type TRealNameKey = 'br' | 'cn' | 'en' | 'in' | 'th' | 'vn' | 'kr' | 'id'

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
  /** 小数点位数 */
  decimal: number
  /** 货币类型 以前通过code获得时使用，直接使用的话用type */
  name: string
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
  zk_id: string
}

export interface CurrencyValue {
  prefix: string
  cur: CurrencyCode
  bankTree: string
  /** 最大小数位数 */
  decimal: number
  /** 法币对应member detail中的真实姓名的key */
  realnameKey?: TRealNameKey
  /** 货币枚举值(CNY,BRL) */
  name?: EnumCurrencyKey
}

export interface ISortedListItem {
  cur: CurrencyCode
}

/** 语言对应配置 */
export const languageConfig: Record<EnumLanguageKeys, {
  /** 默认货币 */
  currency: EnumCurrencyKey
}> = {
  'zh-CN': {
    currency: 'CNY',
  },
  'pt-BR': {
    currency: 'BRL',
  },
  'vi-VN': {
    currency: 'KVND',
  },
  'th-TH': {
    currency: 'THB',
  },
  'hi-IN': {
    currency: 'INR',
  },
  'en-US': {
    currency: 'USDT',
  },
  'in-ID': {
    currency: 'IDR',
  },
  'ko-KR': {
    currency: 'KRW',
  },
  'ja-JP': {
    currency: 'JPY',
  },
  'tl-PH': {
    currency: 'PHP',
  },
}
