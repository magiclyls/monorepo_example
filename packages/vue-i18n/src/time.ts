import type { TIMEZONEABBR } from '@tg/types'
import dayjs from 'dayjs'
import { getLang, i18n } from './core'

const langKey: { [t: string]: string } = {
  'en-US': 'en',
  'zh-CN': 'zh-cn',
  'vi-VN': 'vi',
  'pt-BR': 'pt-br',
  'th-TH': 'th',
  'hi-IN': 'hi',
  'in-ID': 'id',
  'ko-KR': 'ko',
  'ja-JP': 'ja',
  'tl-PH': 'fil',
}

// 月日 星期 时分
const dateWithDayFormat: { [t: string]: string } = {
  'en-US': 'ddd, MMM D h:mm A',
  'tl-PH': 'ddd, MMM D h:mm A',
  'zh-CN': 'MM月DD日 ddd HH:mm',
  'vi-VN': 'ddd, D MMMM HH:mm',
  'pt-BR': 'dddd, D [De] MMM HH:mm',
  'th-TH': 'DD/MM ddd HH:mm',
  'hi-IN': 'dddd, D MMMM h:mm A',
  'in-ID': 'ddd, D MMM HH:mm',
  'ko-KR': 'MM월 DD일 (ddd) HH:mm',
  'ja-JP': 'MM月DD日(ddd) HH:mm',
}

// 时分
const timeWithLangFormat: { [t: string]: string } = {
  'en-US': 'h:mm',
  'tl-PH': 'h:mm',
  'zh-CN': 'HH:mm',
  'vi-VN': 'HH:mm',
  'pt-BR': 'HH:mm',
  'th-TH': 'HH:mm',
  'hi-IN': 'h:mm',
  'in-ID': 'HH:mm',
  'ko-KR': 'HH:mm',
  'ja-JP': 'HH:mm',
}

// 时分 月日
const timeWithLangDayFormat: { [t: string]: string } = {
  'en-US': 'DD/MM h:mm',
  'tl-PH': 'DD/MM h:mm',
  'zh-CN': 'HH:mm MM/DD',
  'vi-VN': 'DD/MM HH:mm',
  'pt-BR': 'DD/MM HH:mm',
  'th-TH': 'DD/MM HH:mm',
  'hi-IN': 'DD/MM h:mm',
  'in-ID': 'DD/MM HH:mm',
  'ko-KR': 'MM/DD HH:mm',
  'ja-JP': 'MM/DD HH:mm',
}
// 月日 时分
const timeWithLangDayFormat2: { [t: string]: string } = {
  'en-US': 'DD/MM h:mm',
  'tl-PH': 'DD/MM h:mm',
  'zh-CN': 'MM/DD HH:mm',
  'vi-VN': 'DD/MM HH:mm',
  'pt-BR': 'DD/MM HH:mm',
  'th-TH': 'DD/MM HH:mm',
  'hi-IN': 'DD/MM h:mm',
  'in-ID': 'DD/MM HH:mm',
  'ko-KR': 'MM/DD HH:mm',
  'ja-JP': 'MM/DD HH:mm',
}

// 年月日（文字）
const dateFormat: { [t: string]: string } = {
  'en-US': 'MMMM DD,YYYY',
  'tl-PH': 'MMMM DD,YYYY',
  'zh-CN': 'YYYY年MM月DD日',
  'vi-VN': '[ngày] DD [tháng] M,YYYY',
  'pt-BR': 'DD [de] MMMM [de] YYYY',
  'th-TH': 'DD/MM/YYYY',
  'hi-IN': 'DD/MM/YYYY',
  'in-ID': 'DD MMMM YYYY',
  'ko-KR': 'YYYY년 MM월 DD일',
  'ja-JP': 'YYYY年MM月DD日',
}

// 彩票时间格式化 年月日 时分秒（文字）
const dateFormat2: { [t: string]: string } = {
  'en-US': 'YYYY-MM-DD HH:mm:ss',
  'tl-PH': 'YYYY-MM-DD HH:mm:ss',
  'zh-CN': 'YYYY年MM月DD日 hh:mm:ss',
  'vi-VN': '[ngày] DD [tháng] M,YYYY hh:mm:ss',
  'pt-BR': 'DD [de] MMMM [de] YYYY hh:mm:ss',
  'th-TH': 'DD/MM/YYYY hh:mm:ss',
  'hi-IN': 'DD/MM/YYYY hh:mm:ss',
  'in-ID': 'DD MMMM YYYY hh:mm:ss',
  'ko-KR': 'YYYY년 MM월 DD일 hh:mm:ss',
  'ja-JP': 'YYYY年MM月DD日 hh:mm:ss',
}

export function checkTs(ts: number) {
  return `${ts}`.length < 13 ? ts * 1000 : ts
}

export function dayByZone({ zone, t }: { zone?: TIMEZONEABBR, t?: any }) {
  if (!zone)
    zone = dayjs.tz.guess() as TIMEZONEABBR
  return dayjs(t).tz(zone)
}

export function dayByZoneStamp({ zone, t }: { zone?: TIMEZONEABBR, t: number }) {
  return dayByZone({ zone, t: checkTs(t) })
}

/** 月日 星期 时分 */
export function timeToDateWithDayFormat(ts: number): string {
  dayjs.locale(langKey[getLang()])
  if (getLang() === 'vi-VN')
    return dayjs(checkTs(ts)).format(dateWithDayFormat[getLang()]).replace('T', 'Th ').replace('tháng', 'Thg')

  return dayjs(checkTs(ts)).format(dateWithDayFormat[getLang()])
}

/** 按时区：时分 */
export function timeToZoneFormat(ts: number, zone?: TIMEZONEABBR): string {
  dayjs.locale(langKey[getLang()])
  if (getLang() === 'vi-VN')
    return dayByZoneStamp({ t: checkTs(ts), zone }).format(timeWithLangFormat[getLang()]).replace('T', 'Th ').replace('tháng', 'Thg')

  return dayByZoneStamp({ t: checkTs(ts), zone }).format(timeWithLangFormat[getLang()])
}

/** 按时区：时分 日期 */
export function timeToZoneDayFormat(ts: number, zone?: TIMEZONEABBR): string {
  dayjs.locale(langKey[getLang()])
  if (getLang() === 'vi-VN')
    return dayByZoneStamp({ t: checkTs(ts), zone }).format(timeWithLangDayFormat[getLang()]).replace('T', 'Th ').replace('tháng', 'Thg')

  return dayByZoneStamp({ t: checkTs(ts), zone }).format(timeWithLangDayFormat[getLang()])
}
/** 按时区：月日 时分 */
export function timeToZoneDayFormat2(ts: number, zone?: TIMEZONEABBR): string {
  dayjs.locale(langKey[getLang()])
  if (getLang() === 'vi-VN')
    return dayByZoneStamp({ t: checkTs(ts), zone }).format(timeWithLangDayFormat2[getLang()]).replace('T', 'Th ').replace('tháng', 'Thg')

  return dayByZoneStamp({ t: checkTs(ts), zone }).format(timeWithLangDayFormat2[getLang()])
}

/** 年月日（文字） */
export function timeToDateFormat(ts: number): string {
  dayjs.locale(langKey[getLang()])
  return dayjs(checkTs(ts)).format(dateFormat[getLang()])
}

/** 彩票时间格式化年月日（文字）hh:mm:ss */
export function timeTodateFormat2(ts: number): string {
  // dayjs.locale(langKey[getLang()])
  dayjs.locale('hi')
  return dayjs(checkTs(ts)).format(dateFormat2['en-US'])
}

/** 过去时间转换 */
export function timeToFromNow(ts: number) {
  const { t } = i18n.global
  const startsTime = dayjs(checkTs(ts))
  const resSec = dayjs().diff(startsTime, 'second')
  if (resSec < 60 && resSec > 0)
    return t('秒前', { delta: resSec })

  const lang = getLang()
  dayjs.locale(langKey[lang])
  const fromNow = dayjs(checkTs(ts)).fromNow()
  return lang === 'en-US' ? fromNow.replace(/\b[a-z]/g, (x: string) => x.toUpperCase()) : fromNow
}

/** 可自定义格式 */
export function timeToCustomizeFormat(ts: number, format = 'HH:mm MM/DD'): string {
  return dayjs(checkTs(ts)).format(format)
}

/** 统一为3/05样式【老板反馈】 */
export function timeToFormatByBoss(ts: number): string {
  return timeToCustomizeFormat(ts, 'MM/DD')
}

/** 符合老板要求格式的完整时间 */
export function timeToFormatFullTimeByBoss(ts: number): string {
  return `${timeToFormatByBoss(ts)} ${timeToCustomizeFormat(ts, 'HH:mm')}`
}

/** 老板要求的区分中文的时间格式 */
export function timeToFormatDiffOnChinese(ts: number, format = 'HH:mm MM/DD'): string {
  const isZhcn = getLang() === 'zh-CN'

  // 处理中文格式
  if (isZhcn) {
    const formatArr = format.split(' ')
    let zhchFormat = ''

    for (let i = 0; i < formatArr.length; i++)
      formatArr[i] = formatArr[i].replace(/^M{2}[-/\s._]?D{2}$/i, 'MM月DD日')

    if (formatArr.length === 2)
      zhchFormat = formatArr[0].includes('HH') ? `${formatArr[1]} ${formatArr[0]}` : formatArr.join(' ')

    else
      zhchFormat = formatArr[0]

    return dayjs(checkTs(ts)).format(zhchFormat)
  }

  return dayjs(checkTs(ts)).format(format)
}

/**
 * 根据输入的日期参数，和往前推的天数，返回一个日期数组
 * @param {number | string} date 日期参数
 * @param {number} days 往前推的天数
 * @returns {object} 日期对象
 *
 * @example getDayList(2023-12-31, 10) => {start: 2023-12-31, end: 2023-12-22}
 */
export function getDaIntervalMap(date: number | string, days: number): { startTime: string, endTime: string } {
  const result = {
    startTime: '',
    endTime: '',
  }

  // 如果是string类型，转换成number类型
  if (typeof date === 'string')
    date = +new Date(date)

  const timestamp = checkTs(date)

  // 开始日期就是date，结束日期就是date减去days天
  result.endTime = `${dayjs(timestamp).format('YYYY-MM-DD')} 00:00:00`
  result.startTime
    = `${dayjs(timestamp).subtract(days, 'day').format('YYYY-MM-DD')} 23:59:59`

  return result
}

/**
 * 获取今天的时间段
 */
export function getTodayTimeRange() {
  const now = new Date()

  // 获取今天的零点
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  startOfDay.setHours(0, 0, 0, 0) // 设置到当天的开始时间（零点）

  // 获取今天的 23:59:59
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  endOfDay.setHours(23, 59, 59, 999) // 设置到当天的结束时间（23:59:59.999）

  return {
    start: Math.floor(startOfDay.getTime() / 1000),
    end: Math.floor(endOfDay.getTime() / 1000),
  }
}

/**
 * 获取本周时间段，精确到时分秒
 */
export function getCurrentWeekTimeRange() {
  const now = new Date()
  const dayOfWeek = now.getDay() // 0 (Sunday) to 6 (Saturday)
  const diffToMonday = (dayOfWeek + 6) % 7 // Number of days to previous Monday

  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - diffToMonday)
  startOfWeek.setHours(0, 0, 0, 0)

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  endOfWeek.setHours(23, 59, 59, 999)

  return {
    start: Math.floor(startOfWeek.getTime() / 1000),
    end: Math.floor(endOfWeek.getTime() / 1000),
  }
}

/**
 * 获取本月时间段，精确到时分秒
 */
export function getCurrentMonthTimeRange() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  startOfMonth.setHours(0, 0, 0, 0)

  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  endOfMonth.setHours(23, 59, 59, 999)

  return {
    start: Math.floor(startOfMonth.getTime() / 1000),
    end: Math.floor(endOfMonth.getTime() / 1000),
  }
}
