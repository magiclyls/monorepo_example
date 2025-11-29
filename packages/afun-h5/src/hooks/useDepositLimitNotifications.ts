import { i18n } from '@tg/vue-i18n'
import { computed, h } from 'vue'
import AppDepositLimitNotificationsMessage from '~/components/AppDepositLimitNotificationsMessage.vue'
import { useNotify } from './useNotify'

export function useDepositLimitNotifications(_data: any) {
  const { openNotify } = useNotify()
  const { t } = i18n.global

  const data = JSON.parse(_data.payload)

  const title = computed(() => {
    if (_data.title === 'release')
      return t('预扣释放')
    else if (_data.title === 'deposit')
      return t('存款成功')

    return ''
  })
  const currency = data.currency
  // 存款金额
  const depositAmount = data.deposit_amount ?? ''
  // 超出金额
  const deductAmount = data.deduct_amount ?? ''
  // 释放金额
  const amount = data.amount ?? ''
  // 限额周期 每日、每周、每月
  const cfgType = data.cfg_type

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
      currency,
      depositAmount,
      deductAmount,
      amount,
      cfgType,
      type: _data.title,
    }),
  })
}
