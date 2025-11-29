import { EventBusNames } from '@tg/types'
import { appEventBus, application, getCurrencyConfig } from '@tg/utils'
import { i18n } from '@tg/vue-i18n'
import AppPromoNotifications from '~/components/AppPromoNotifications.vue'

const { t } = i18n.global

/**
 * type 0,2,4 是成功
 *
 * type 1,3 是失败
 * 5: 审核中
 */
/* function getNotifyType(type: string): { icon?: string; iconColor?: string; type?: notifyType } {
  if (type === '0' || type === '2' || type === '4') {
    return {
      icon: 'navbar-settled',
      iconColor: '--tg-text-alltheme-green',
    }
  }
  else if (type === '5') {
    return {
      icon: 'navbar-settled',
      iconColor: '--tg-text-alltheme-warn',
    }
  }
  else if (type === '1') {
    return {
      icon: 'uni-warning',
      iconColor: '--tg-text-alltheme-error',
    }
  }
  else if (type === '6') {
    return {
      type: 'success',
      iconColor: '--tg-notice-update-bg',
    }
  }
  else {
    return {
      type: 'error',
    }
  }
}
*/
function getTitleByBonusType(type: string) {
  switch (type) {
    case '0':
      return t('审核通过')
    case '2':
    case '4':
      return t('领取成功')
    case '1':
      return t('审核拒绝')
    case '3':
      return t('领取失败')
    case '5':
    case '6':
      return t('提交成功')
    default:
      break
  }
  return ''
}

export function usePromoNotifications(_data: any) {
  const data = JSON.parse(_data.payload)
  const type = data.type
  const amount = data.bonus_amount
  const currencyId = data.currency_id
  // const promo_type = data.promo_type

  const numDecimal = getCurrencyConfig(currencyId)?.decimal
  const currencyType = getCurrencyConfig(currencyId)?.name

  console.error('🦺🦺🦺活动通知数据', data)
  appEventBus.emit(EventBusNames.PROMO_NOTIFY_REFRESH, data)

  let isCustomMessage = ''
  const promoType = Number(data.promo_type)
  if (promoType === 8 && Number(type) === 1) {
    // 充值活动的 审核拒绝
    isCustomMessage = t('可重新提交申请')
  }
  if (promoType === 16 && Number(type) === 6) {
    // 会员答谢礼活动的 审核中
    isCustomMessage = t('彩金审核中')
  }
  appEventBus.emit(EventBusNames.APP_GLOBAL_MESSAGE, { content: isCustomMessage || (
    <span>
      {`${getTitleByBonusType(type)}，`}
      <AppPromoNotifications
        amount={application.formatNumDecimal(amount, numDecimal)}
        type={type}
        currencyType={currencyType}
      />
    </span>
  ), type: 'Message' })
}
