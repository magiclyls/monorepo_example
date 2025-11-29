import { i18n } from '@tg/vue-i18n'
import AppDepositLimitNotificationsMessage from '~/components/AppDepositLimitNotificationsMessage.vue'

export function useDepositLimitNotifications(_data: any) {
  const { openNotify } = useNotify()
  const { t } = i18n.global

  const data = JSON.parse(_data.payload)

  const title = computed(() => {
    if (_data.title === 'release')
      return t('withholding_release')
    else if (_data.title === 'deposit')
      return t('deposit_success')

    return ''
  })
  const currency = data.currency
  // 存款金额
  const deposit_amount = data.deposit_amount ?? ''
  // 超出金额
  const deduct_amount = data.deduct_amount ?? ''
  // 释放金额
  const amount = data.amount ?? ''
  // 限额周期 每日、每周、每月
  const cfg_type = data.cfg_type

  // 预扣释放
  /**
   * 预扣释放
   * 已释放 1000.00 USDT 到您的账户
   */

  // 存款预扣
  /**
   * 存款成功
   * 存款 1000.00 USDT,其中 200.00 USDT因超出每日存款限额，已进行预扣
   */

  openNotify({
    type: 'success',
    title: title.value,
    message: () => h(AppDepositLimitNotificationsMessage, {
      currency: currency,
      deposit_amount: deposit_amount,
      deduct_amount: deduct_amount,
      amount: amount,
      cfg_type: cfg_type,
      type:_data.title
    }),
  })
}
