import type { EnumCurrencyKey } from '@tg/types'

/**
 * 金额格式
 */
/** 获取字符串开头非数字部分 */
function extractNonNumericStart(str: string) {
  const match = str.match(/^\D+/)
  return match ? match[0] : ''
}
export function formatAmountFunc(amount: string, currencyType: EnumCurrencyKey) {
  const match = extractNonNumericStart(amount)
  const _amount = amount.replace(match, '')
  return match + application.formatNumDecimal(_amount, currencyConfig[currencyType].decimal)
}
