import type { ISportEventInfo, ISportEventList, MqttCallbackParamType } from '@tg/types'
import type { SocketClient } from '@tg/utils'
import { EventBusNames } from '@tg/types'
import { appEventBus } from '@tg/utils'
import { getLangForBackend, timeToDateFormat } from '@tg/vue-i18n'
import { cloneDeep } from 'lodash'

/**
 * 盘口根据时间组合方法
 * @param origin 赛事详情数据
 */
export function sportsDataGroupByDate(origin: ISportEventInfo[]) {
  const _origin = origin.map((a) => {
    const date = timeToDateFormat(a.ed)
    return { ...a, date }
  })

  const arr: { date: string, list: ISportEventInfo[] }[] = []
  for (let i = 0; i < _origin.length; i++) {
    if (i === 0) {
      arr.push({ date: _origin[i].date, list: [_origin[i]] })
      continue
    }
    const index = arr.findIndex(a => a.date === _origin[i].date)
    if (index > -1)
      arr[index].list.push(_origin[i])
    else
      arr.push({ date: _origin[i].date, list: [_origin[i]] })
  }
  return arr
}

/** 体育数据刷新 */
function sportDeltaCallback({ topic, message }: MqttCallbackParamType) {
  if (message.parsed) {
    if (message.parsed.v)
      message.parsed.v = JSON.parse(message.parsed.v)
  }
  sportDataChange(message.parsed as any)
}

let sportTimer: any = null
const sportDeltaDataList: ISportEventList[] = []
/**
 * 通知体育数据刷新
 * @description 3秒内的数都会被合并
 */
export function sportDataChange(obj: ISportEventList) {
  sportDeltaDataList.push(obj)

  if (sportTimer)
    clearTimeout(sportTimer)

  sportTimer = setTimeout(() => {
    appEventBus.emit(EventBusNames.SPORTS_DATA_CHANGE_BUS, cloneDeep(sportDeltaDataList))
    sportDeltaDataList.length = 0
  }, 4 * 1000)
}

/**
 * 体育通知
 * @desc 用于通知体育页面的数据更新，使用两种方式，一种通过websocket，一种通过setInterval
 */
export class SportsNotify {
  mqtt: SocketClient

  timer: any = null

  /** 是否订阅了体育数据变化 */
  isSubscribed = false

  constructor(_mqtt: SocketClient) {
    this.mqtt = _mqtt
  }

  /**
   * 订阅体育数据变化
   *
   * dev/sport/delta/{lang}
   */
  subscribe() {
    console.error('订阅体育数据变化')
    const lang = getLangForBackend()
    this.mqtt.addSubscribe(`sport/delta/${lang}`, {
      successFn: () => {
        this.isSubscribed = true
      },
      callback: sportDeltaCallback,
    })
  }

  /**
   * 取消订阅体育数据变化
   *
   * dev/sport/delta/{lang}
   */
  unsubscribe() {
    console.error('取消订阅体育数据变化')
    const lang = getLangForBackend()
    this.mqtt.removeSubscribe(`sport/delta/${lang}`, () => {
      this.isSubscribed = false
    })
  }

  countdownHandler() { }

  /**
   * 开始倒计时
   */
  startCountdown() {
    this.stopCountdown()
    this.timer = setInterval(() => {
      appEventBus.emit(EventBusNames.SPORTS_LIST_COUNTDOWN_BUS)
    }, 500)
  }

  /**
   * 停止倒计时
   */
  stopCountdown() {
    clearInterval(this.timer)
  }
}
