/**
 * 定义事件名称与参数类型的映射
 */
export interface EventBusMap {
  [EventBusNames.CHAT_MESSAGE_BUS]: any
  [EventBusNames.CHAT_DEL_MESSAGE_BUS]: any
  [EventBusNames.CHAT_FORBID_MESSAGE_BUS]: any
  [EventBusNames.MQTT_CONNECT_SUCCESS_BUS]: any
  [EventBusNames.MQTT_DISCONNECT_BUS]: any
  [EventBusNames.REFRESH_BALANCE_BUS]: any
  [EventBusNames.FEEDBACK_CHAT_MESSAGE_BUS]: any
  [EventBusNames.REFRESH_MEMBER_BUS]: any
  [EventBusNames.REFRESH_AUTH_BUS]: any
  [EventBusNames.SPORTS_DATA_CHANGE_BUS]: any
  [EventBusNames.SPORTS_LIST_TO_CART_BUS]: any
  [EventBusNames.SPORTS_CART_TO_LIST_BUS]: any
  [EventBusNames.SPORTS_LIST_COUNTDOWN_BUS]: any
  [EventBusNames.SPORTS_LOBBY_RESET]: any
  [EventBusNames.CASINO_LOBBY_RESET]: any
  [EventBusNames.SPORTS_BETTING_TO_BETSLIP_BUS]: any
  [EventBusNames.SPORTS_TO_CART_BUS]: any
  [EventBusNames.CART_TO_SPORTS_BUS]: any
  [EventBusNames.ACTIVE_CAROUSEL_BUS]: any
  [EventBusNames.PROMO_TURNTABLE_BUS]: any
  [EventBusNames.REFRESH_BET_BUS]: any
  [EventBusNames.STATISTICS_BUS]: any
  [EventBusNames.REFRESH_NOTICE_NOTIFY]: any
  [EventBusNames.MINI_CRASH_BUS]: any
  [EventBusNames.BRAND_WEB_REG_CONFIG_CHANGE]: string
  [EventBusNames.DEPOSIT_CHANGE_FIAT_OR_VIRT]: string
  [EventBusNames.DEPOSIT_CHANGE_VIRT_QRCODE]: any
  [EventBusNames.RECEIVE_FLUTTER_APP_MSG]: any
  [EventBusNames.USER_CLAIMED_DOLLAR_BONUS]: any
  [EventBusNames.USER_GETBONUS_RESULT]: any
  [EventBusNames.PROMO_NOTIFY_REFRESH]: any
  [EventBusNames.PROMO_REDRAIN_BONUSDIALOG_CLOSE]: any
  [EventBusNames.PROMO_DEPOSIT_DIALOG]: any
  [EventBusNames.GET_TIIMEREBATE_SUCCESS]: any
  [EventBusNames.USER_REFRESH_RED_CLAIMED]: any
  [EventBusNames.KYC_VERIFY_SUCCESS]: any
  [EventBusNames.NEED_LOGiN_MSG]: any
  [EventBusNames.FINANCE_DEPOSIT_SUCCESS]: any
  [EventBusNames.KYC_FACIAL_RECOGNITION_SUCCESS]: any
  [EventBusNames.SITE_MAINTAIN]: any
  [EventBusNames.ADJUST]: any
  [EventBusNames.DEPOSIT_PWA]: any
  resize: { width: number; height: number }
}

type EventHandler<T = any> = (arg: T) => void

/** 事件总线 */
export class AppEventBus {
  private listeners: { [event: string]: EventHandler[] } = {}
  private lastEmitTimestamps: { [event: string]: number } = {}
  private throttleDurations: { [event: string]: number } = {}

  /**
   * 订阅事件
   * @param event 事件名称
   * @param handler 事件处理函数
   * @param throttleDuration 节流时间，单位毫秒，默认为 0
   */
  on<K extends keyof EventBusMap>(event: K, handler: EventHandler<EventBusMap[K]>, throttleDuration = 0): void {
    if (!this.listeners[event])
      this.listeners[event] = []

    this.listeners[event].push(handler as EventHandler)
    this.throttleDurations[event] = throttleDuration
  }

  /** 取消订阅事件 */
  off<K extends keyof EventBusMap>(event: K, handler: EventHandler<EventBusMap[K]>): void {
    if (this.listeners[event]) {
      const index = this.listeners[event].indexOf(handler as EventHandler)
      if (index > -1)
        this.listeners[event].splice(index, 1)
    }
  }

  /** 触发事件 */
  emit<K extends keyof EventBusMap>(event: K, arg?: EventBusMap[K]): void {
    const now = Date.now()
    const lastEmitTime = this.lastEmitTimestamps[event] || 0
    const throttleDuration = this.throttleDurations[event]

    if (now - lastEmitTime < throttleDuration)
      return // 事件被节流

    this.lastEmitTimestamps[event] = now

    if (this.listeners[event]) {
      this.listeners[event].forEach((handler: EventHandler<EventBusMap[K]>) => {
        handler(arg)
      })
    }
  }
}

/** 事件总线实例 */
export const appEventBus = new AppEventBus()

// // 示例使用
// const bus = new AppEventBus()
// // 订阅事件时，可以指定节流时间（例如，resize事件每1000毫秒只能触发一次）
// function resizeHandler(size: EventBusMap['resize']) {
//   console.log(`Width: ${size.width}, Height: ${size.height}`)
// }
// bus.on('resize', resizeHandler, 1000)
// // 触发事件时，如果在节流时间内，则会被忽略
// bus.emit('resize', { width: 1024, height: 768 })
// setTimeout(() => bus.emit('resize', { width: 1280, height: 720 }), 500) // 这次调用会被忽略
// setTimeout(() => bus.emit('resize', { width: 1280, height: 720 }), 1100) // 这次调用会执行
