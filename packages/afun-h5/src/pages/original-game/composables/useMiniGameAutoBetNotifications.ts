import { useAppStore } from '@tg/stores'
import { i18n } from '@tg/vue-i18n'
import { Message } from '~/utils'

export function useMiniGameAutoBetNotifications() {
  const { t } = i18n.global
  const appStore = useAppStore()
  const { userInfo } = appStore
  /** 自动投注开始 */
  function autoBetStartNotify() {
    if (userInfo?.exclude !== 1) {
      Message.info(t('自动投注开始'))
    }
  }
  /** 自动投注完成 */
  function autoBetStopNotify() {
    if (userInfo?.exclude !== 1) {
      Message.info(t('自动投注完成'))
    }
  }
  /** 已到极限 */
  function autoBetEndNotify() {
    Message.info(t('已到极限'))
  }
  /** 已达到止盈 */
  function autoBetStopWinNotify() {
    Message.info(t('已达到止盈'))
  }
  /** 已达到止损 */
  function autoBetStopLoseNotify() {
    Message.info(t('已达到止损'))
  }
  /** 网络问题投注失败 */
  function autoBetNetworkNotify() {
    Message.info(t('网络问题投注失败'))
  }

  return {
    autoBetStartNotify,
    autoBetStopNotify,
    autoBetEndNotify,
    autoBetStopWinNotify,
    autoBetStopLoseNotify,
    autoBetNetworkNotify,
  }
}
