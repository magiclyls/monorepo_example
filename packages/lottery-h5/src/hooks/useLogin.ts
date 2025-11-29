import { EventBusNames, SendFlutterAppMessage } from '@tg/types'
import { appEventBus, isFlutterApp, sendMsgToFlutterApp } from '@tg/utils'
import { isIFrame, postMsgToParent } from '../utils/tool'

export function useLogin(close: (() => void) | null = null) {
  function login() {
    if (isFlutterApp()) {
      sendMsgToFlutterApp(SendFlutterAppMessage.APP_LOGIN)
      return
    }
    if (isIFrame()) {
      postMsgToParent('login')
      return
    }
    close && close()
    appEventBus.emit(EventBusNames.LOTTERY_TO_MAIN_PAGE_ROUTE, 'login')
  }
  return { login }
}
