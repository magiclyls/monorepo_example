import type { notifyType } from './useNotify'
import AppPromoNotifications from '~/components/AppPromoNotifications.vue'
import { i18n } from '@tg/vue-i18n'

interface IPromoData {
  id: string
  type: 'promo'
  /**
   * turnable 大转盘
   *
   * agent 推广
   *
   * hongbao 红包
   *
   * profit 负盈利
   *
   * display 自定义
   */
  title: 'agent' | 'turnable' | 'hongbao' | 'profit' | 'display'
  content: string
  is_read: 0 | 1
  timestamp: number
  target: string
  target_id: string
  payload: {
    promo_name: string
    /**
     * 发放金额
     */
    bonus_amount: string
    /**
     * 发放金额(U)
     */
    from_bonus_amount: string
    /**
     * 发放货币id
     */
    currency_id: string
    /**
     * 1轮盘
     *
     * 2推广
     *
     * 3抢红包
     *
     * 4负盈利返现
     *
     * 5自定义
     */
    promo_type: '1' | '2' | '3' | '4' | '5'
    /**
     * 0:审核通过
     *
     * 1:审核拒绝
     *
     * 2:领取成功
     *
     * 3:领取失败
     *
     * 4:派发成功(自动)
     * 5: 审核中
     */
    type: '0' | '1' | '2' | '3' | '4' | '5'
  }
}

/**
 * type 0,2,4 是成功
 *
 * type 1,3 是失败
 * 5: 审核中
 */
function getNotifyType(type: string): { icon?: string; iconColor?: string; type?: notifyType } {
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

// function getTitleByPromoType(promo_type: string) {
//   const { t } = i18n.global

//   switch (promo_type) {
//     case '1':
//       return t('big_turntable')
//     case '2':
//       return t('promotion')
//     case '3':
//       return t('red_envelope')
//     case '4':
//       return t('negative_profit')
//     case '5':
//       return t('customize')
//     default:
//       return t('unknown')
//   }
// }
function getTitleByBonusType(type: string) {
  const { t } = i18n.global
  switch (type) {
    case '0':
      return t('examination_passed')
    case '2':
    case '4':
      return t('receive_success')
    case '1':
      return t('review_rejection')
    case '3':
      return t('fail_bonus')
    case '5':
    case '6':
      return t('submit_success_label')
    default:
      break
  }
  return ''
}

export function usePromoNotifications(_data: any) {
  const { openNotify } = useNotify()
  const { t } = i18n.global
  const data = JSON.parse(_data.payload)
  const type = data.type
  const amount = data.bonus_amount
  const currencyId = data.currency_id
  // const promo_type = data.promo_type

  const numDecimal = getCurrencyConfigByCode(currencyId)?.decimal
  const currencyType = getCurrencyConfigByCode(currencyId)?.name

  console.error('🦺🦺🦺活动通知数据', data)
  appEventBus.emit(EventBusNames.PROMO_NOTIFY_REFRESH, data)

  let isCustomMessage = ''
  const promoType = Number(data.promo_type)
  if (promoType === 8 && Number(type) === 1) {
    // 充值活动的 审核拒绝
    isCustomMessage = t('can_resubmitted')
  }
  if (promoType === 16 && Number(type) === 6) {
    // 会员答谢礼活动的 审核中
    isCustomMessage = t('lottery-review_progress')
  }
  openNotify({
    ...getNotifyType(type),
    title: getTitleByBonusType(type),
    message: isCustomMessage || (() => h(AppPromoNotifications, {
      amount: application.formatNumDecimal(amount, numDecimal),
      currencyType,
      type,
    })),
  })
}
