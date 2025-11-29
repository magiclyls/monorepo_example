import { i18n } from '@tg/vue-i18n'
import AppVipBonusNotificationsMessage from '~/components/AppVipBonusNotificationsMessage.vue'

export function useVipBonusNotifications(_data: any) {
  const { openNotify } = useNotify()
  const { t } = i18n.global

  const data = JSON.parse(_data.payload)

  const amount = data.amount
  const currencyId = data.currency_id
  const content = data.content

  const currencyType = getCurrencyConfigByCode(currencyId)?.name

  openNotify({
    type: 'success',
    title: t('receive_success'),
    message: () => h(AppVipBonusNotificationsMessage, {
      amount: application.formatNumDecimal(amount, currencyConfig[currencyType].decimal),
      currencyType,
      content,
    }),
  })
}
