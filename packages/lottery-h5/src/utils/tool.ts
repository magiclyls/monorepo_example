import type { EnumCurrencyKey } from '@tg/types'
import { getFlutterAppToken, getToken, isFlutterApp } from '@tg/utils'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

export function postMsgToParent(type: 'login' | 'exit' | 'currency', cy?: EnumCurrencyKey) {
  window.parent.postMessage(
    {
      auth: 'xxxxxxxxxxxxxxlotteryxxxxxxxxxxx',
      type,
      cy,
    },
    '*',
  )
}

export function isLogin() {
  if (isFlutterApp()) {
    return !!getFlutterAppToken()
  }
  return !!getToken()
}
export function calcTime(end: number) {
  return (end - getTimestampSeconds()) + 5
}

export function getTimestampSeconds() {
  dayjs.extend(utc)
  dayjs.extend(timezone)
  const istTime = dayjs().tz('Asia/Kolkata')
  return istTime.unix()
}

export function isIFrame() {
  return window.isFrameLottery
}
