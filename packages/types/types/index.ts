import type { EnumCurrency } from '../enums'

/**
 * 用于select的option
 */
export interface ISelectOption {
  label: string
  value: string | number
}

/** 货币的Key */
export type EnumCurrencyKey = keyof typeof EnumCurrency

/** Input Model 类型 */
export type InputMode = 'decimal' | 'email' | 'none' | 'numeric' | 'search' | 'tel' | 'text' | 'url'

/** 后端金额接口数据 */
export type TCurrencyObject = Prettify<{
  uid: string
} & {
  -readonly [K in EnumCurrencyKey]: string;
}>
