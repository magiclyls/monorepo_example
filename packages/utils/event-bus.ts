import type { EventBusMap, EventHandler } from '@tg/types'

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
