import type { EnumJump as EnumJumpType } from '@tg/types'
import { useAppStore, useDialogStore } from '@tg/stores'
import { EnumJump, EventBusNames, SendFlutterAppMessage } from '@tg/types'
import { appEventBus, isExternal, isFlutterApp, sendMsgToFlutterApp } from '@tg/utils'
import { checkTs, getLangForBackend } from '@tg/vue-i18n'
import { throttle } from 'lodash'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

/**
 * 处理跳转自定义链接
 * 1.没带http开头的链接，前端自己将当前域名+语言+自定义链接组合成完整的url
 * 2.带了http开头的链接，不需要组合
 * 3.h5的全部在当前页面打开链接
 * 4.PC组合链接当前页面打开，http开头的新标签打开
 */
export function useRedirect() {
  const { t } = useI18n()
  const router = useRouter()
  const { isLogin } = storeToRefs(useAppStore())
  const dialogStore = useDialogStore()

  const notifyThrottle = throttle(() => {
    appEventBus.emit(EventBusNames.APP_GLOBAL_MESSAGE, { content: t('精彩活动'), type: 'info' })
  }, 5 * 1000, { leading: true, trailing: false })

  function toCustomUrl(url: string) {
    if (isExternal(url)) {
      location.href = url
    }
    else {
      const _url = `${url.startsWith('/') ? url : (`/${url}`)}`
      if (_url.includes('dollar-waves?promoid=')) {
        const redId = _url.split('dollar-waves?promoid=')[1]
        if (redId && +redId > 0) {
          const red_start_stamp = localStorage.getItem(`promo_red_start_${redId}_${getLangForBackend()}`)
          const now_stamp = new Date().getTime()
          if (red_start_stamp && +red_start_stamp > 0) {
            if (now_stamp < +red_start_stamp) {
              notifyThrottle()
              return
            }
          }
        }
      }
      router.push(_url)
    }
  }

  function handleSafe() {
    if (isLogin.value)
      dialogStore.openSafeDialog()
    else
      router.push('/login')
  }

  function jumpToUrl(item: { type?: EnumJumpType, jumpUrl?: string, jumpState?: string | number, promo_info?: any }) {
    if (item.jumpState && +item.jumpState === 2)
      return
    if (item.promo_info && item.promo_info.id) {
      const now_stamp = new Date().getTime()
      const { display_mode, start_at, end_at } = item.promo_info
      if (display_mode === 2)
        return notifyThrottle()
      if (!start_at || !end_at) {
        appEventBus.emit(EventBusNames.APP_GLOBAL_MESSAGE, { content: t('活动已结束'), type: 'error' })
        return
      }
      if (end_at && +end_at > 0) {
        if (now_stamp > checkTs(+end_at)) {
          appEventBus.emit(EventBusNames.APP_GLOBAL_MESSAGE, { content: t('活动已结束'), type: 'error' })
        }
      }
      if (start_at && +start_at > 0) {
        if (now_stamp < checkTs(+start_at)) {
          notifyThrottle()
          return
        }
      }
    }

    switch (item.type) {
      case EnumJump.CUSTOM:
        if (item.jumpState !== undefined)
          +item.jumpState === 1 && item.jumpUrl && toCustomUrl(item.jumpUrl)
        else
          item.jumpUrl && toCustomUrl(item.jumpUrl)
        break
      case EnumJump.CASINO:
        if (isFlutterApp())
          sendMsgToFlutterApp(SendFlutterAppMessage.CASINO_HOME)
        else
          router.push('/')
        break
      case EnumJump.SPORTS:
        if (isFlutterApp())
          sendMsgToFlutterApp(SendFlutterAppMessage.SPORTS_HOME)
        else
          router.push(`/sports`)
        break
      case EnumJump.SAFE:
        if (isFlutterApp())
          sendMsgToFlutterApp(SendFlutterAppMessage.SAFE_VAULT)
        else
          handleSafe()
        break
      case EnumJump.VIP:
        if (isFlutterApp())
          sendMsgToFlutterApp(SendFlutterAppMessage.USER_VIP)
        else
          router.push('/vip?tab=vipBonus')
        break
      case EnumJump.ALLIANCE:
        if (isFlutterApp())
          sendMsgToFlutterApp(SendFlutterAppMessage.USER_AFFILIATE)
        else
          router.push('/affiliate/invitation-link')
        break
      case EnumJump.PROMOTION:
        if (isFlutterApp())
          sendMsgToFlutterApp(SendFlutterAppMessage.ALL_PROMOTION)
        else
          router.push('/promotions')
        break
      case EnumJump.SERVICE:
        if (isFlutterApp()) {
          sendMsgToFlutterApp(SendFlutterAppMessage.OPEN_SERVICE)
        }
        else {
          router.push('/service')
        }

        break
      case EnumJump.DEPOSIT:
        if (isFlutterApp())
          sendMsgToFlutterApp(SendFlutterAppMessage.OPEN_DEPOSIT_MODAL)
        else
          router.push('/wallet')
        break
      case EnumJump.REBATE:
        if (isFlutterApp())
          sendMsgToFlutterApp(SendFlutterAppMessage.USER_REBATE)
        else
          router.push('/rebate-center/rebate')
        break
      case EnumJump.REGISTER:
        if (isLogin.value) {
          if (isFlutterApp())
            sendMsgToFlutterApp(SendFlutterAppMessage.CASINO_HOME)
          else
            router.push('/casino')
          return
        }
        if (isFlutterApp())
          sendMsgToFlutterApp(SendFlutterAppMessage.DIALOG_REGISTER)
        else
          router.push('/register')
        break
      case EnumJump.APP:
        // TODO
        // dialogStore.openAppDownloadDialog()
        break
      case EnumJump.SETTINGS:
        if (isLogin.value) {
          if (isFlutterApp())
            sendMsgToFlutterApp(SendFlutterAppMessage.USER_SETTINGS)
          else
            router.push('/settings/general')
        }
        else {
          if (isFlutterApp())
            sendMsgToFlutterApp(SendFlutterAppMessage.DIALOG_REGISTER)
          else
            router.push('/register')
        }
        break
      case EnumJump.PROMOTION_DETAIL:
        item.jumpUrl && toCustomUrl(item.jumpUrl)
        break
      case EnumJump.PROMOTION_DETAIL_SELF:
        item.jumpUrl && router.push(item.jumpUrl)
        break
    }
  }

  return {
    toCustomUrl,
    jumpToUrl,
    handleSafe,
  }
}
