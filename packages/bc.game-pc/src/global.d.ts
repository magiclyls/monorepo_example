
declare module "jsdom"

/** 显示类型详细值 */
type Prettify<T> = {
  [P in keyof T]: T[P]
}

declare interface Window {
  /** PG 跳转地址 */
  pgGameUrl?: string
  /** 阿里云图形验证码 */
  initAliyunCaptcha?: any
  /** 当前是什么限制类型, area 和 bl */
  limitType?: 'area' | 'bl'
  flutter_inappwebview?: any
  flutterAppCallback?: (p?: string) => void
  /** 服务器时间 */
  serverTime: string
  /** 服务器时间和本地时间的差 */
  serverTimeDiff: number
  /** pwa安装事件 */
  installPromptEvent: any
  /** 单选语言 */
  langChoosed?: 'zh-CN' | 'pt-BR' | 'vi-VN' | 'th-TH' | 'hi-IN' | 'en-US'
  /** XInstall */
  XInstall?: any
}

/** 币种 code */
type CurrencyCode = '701' | '702' | '703' | '704' | '705' | '706' | '707' | '708' | '709' | '710' | '711' | '712' | '713' | '714' | '715' | '716' | '717' | '718' | '719' | '720' | '721' | '722' | '723' | '724' | '725' | '726' | '727' | '728' | '729' | '730' | '731' | '732'

/** 后端返回数据结构 */
interface IResponse<T> {
  status: boolean
  data: T
  /** 可以作为Toast标题的信息（多语言） */
  tip?: string
}

interface IResponseList<T> {
  d: T
  t: number
  s: number
}