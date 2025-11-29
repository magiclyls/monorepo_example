import { i18n } from '@tg/vue-i18n'
import type { EnumCurrencyKey } from '@tg/types'
import AppMemberNotificationsMessage from '~/components/AppMemberNotificationsMessage.vue'

export function useMemberNotifications(data: any) {
  const token = Local.get<string | undefined>(STORAGE_TOKEN_KEY)?.value
  if (!token)
    return
  const { title } = data
  const { t } = i18n.global
  const { openNotify } = useNotify()
  const isSuccess = title.includes('success')
  const isFail = title.includes('fail')

  const content = JSON.parse(data.payload)
  const amount = isSuccess ? content.finally_amount : (content.pay_amount ?? content.finally_amount)
  const currencyType = content.currency_name as EnumCurrencyKey

  let keypath = title.includes('withdraw') ? 'withdraw_info_' : 'deposit_info_'
  if (isSuccess)
    keypath += 'success'
  else if (isFail)
    keypath += 'fail'
  else
    keypath += 'going'

  if (title === 'withdraw_in_process') {
    openNotify({
      icon: `coin-${currencyType?.toLocaleLowerCase()}`,
      title: t(title),
      message: () => h(AppMemberNotificationsMessage, { amount: application.formatNumDecimal(amount, currencyConfig[currencyType].decimal), currencyType, keypath }),
    })
  }
  else {
    openNotify({
      type: isFail ? 'error' : 'wallet',
      title: t(title),
      message: () => h(AppMemberNotificationsMessage, { amount: application.formatNumDecimal(amount, currencyConfig[currencyType].decimal), currencyType, keypath }),
    })
  }
}
