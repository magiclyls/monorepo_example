import { i18n } from '@tg/vue-i18n'

export function useMiniGameAutoBetNotifications() {
  const { t } = i18n.global
  const { openNotify } = useNotify()
  const appStore = useAppStore()
  const { userInfo } = appStore
  /** 自动投注开始 */
  function autoBetStartNotify() {
    if (userInfo?.exclude !== 1) {
      openNotify({
        type: 'auto',
        message: `<span style="color:var(--tg-text-white);font-weight:600;">${t(
          'mini_start_auto_bet_tip',
        )}</span>`,
      })
    }
  }
  /** 自动投注完成 */
  function autoBetStopNotify() {
    if (userInfo?.exclude !== 1) {
      openNotify({
        type: 'auto',
        message: `<span style="color:var(--tg-text-white);font-weight:600;">${t(
          'mini_stop_auto_bet_tip',
        )}</span>`,
      })
    }
  }
  /** 已到极限 */
  function autoBetEndNotify() {
    openNotify({
      type: 'auto',
      message: `<span style="color:var(--tg-text-white);font-weight:600;">${t(
        'mini_stop_auto_bet_tip',
      )}</span>`,
    })
  }
  /** 已达到止盈 */
  function autoBetStopWinNotify() {
    openNotify({
      type: 'auto',
      title: t('mini_stop_auto_bet_tip'),
      message: t('mini_auto_stop_win_line'),
    })
  }
  /** 已达到止损 */
  function autoBetStopLoseNotify() {
    openNotify({
      type: 'auto',
      title: t('mini_stop_auto_bet_tip'),
      message: t('mini_auto_stop_lose_line'),
    })
  }
  /** 网络问题投注失败 */
  function autoBetNetworkNotify() {
    openNotify({
      type: 'error',
      title: t('mini_stop_auto_bet_error'),
      message: t('mini_auto_stop_lose_line'),
    })
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
