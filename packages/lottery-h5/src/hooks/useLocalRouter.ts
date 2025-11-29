import { EventBusNames, SendFlutterAppMessage } from '@tg/types'
import { appEventBus, isFlutterApp, sendMsgToFlutterApp } from '@tg/utils'
import { useRouter } from 'vue-router'
import { isIFrame, postMsgToParent } from '../utils/tool'

export function useLocalRouter() {
  const router = useRouter()

  function push(url: string) {
    if (isFlutterApp() || isIFrame()) {
      router.push(url)
      return
    }
    appEventBus.emit(EventBusNames.LOTTERY_TO_MAIN_PAGE_ROUTE, url)
  }
  function back() {
    if (isFlutterApp() || isIFrame()) {
      router.back()
      return
    }
    appEventBus.emit(EventBusNames.LOTTERY_TO_MAIN_PAGE_ROUTE, 'back')
  }

  function exit() {
    if (isFlutterApp()) {
      sendMsgToFlutterApp(SendFlutterAppMessage.CLOSE_WINDOW)
      return
    }
    if (isIFrame()) {
      postMsgToParent('exit')
      return
    }
    back()
  }

  return {
    push,
    back,
    exit,
  }
}
