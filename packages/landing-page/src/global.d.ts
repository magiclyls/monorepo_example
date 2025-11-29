declare module 'jsdom'

declare module 'web-pingjs' {
  function ping(url: string): Promise<number>
  export default ping
}

/** 显示类型详细值 */
type Prettify<T> = {
  [P in keyof T]: T[P]
}

declare interface Window {
  /** 当前站点类型 */
  site: 'x02' | 'v03'
  /** 首页滚动距离 */
  casinoIndexScrollHeight: number
  /** google 统计id */
  tggoogleId: string | undefined
  /** facebook 统计id */
  tgfacebookId: string | undefined
  /** tiktok 统计id */
  tgtikTokId: string | undefined
  /** kwai 统计id */
  tgkwaiId: string | undefined
  /** Facebook 全局发送函数 */
  fbq?: (type: string, event: string, data?: any) => void
  /** Kwai 埋点全局方法 */
  kwaiq?: any
  /** PG 跳转地址 */
  pgGameUrl?: string
  /** 抖音 埋点全局方法 */
  ttq?: any
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
  langChoosed?: import('@tg/types').EnumLanguageKey
  /** 活动列表页滚动距离 */
  saveScrollPositionHeight?: number
  /** downloadStore */
  downloadStore?: any
  /** XInstall */
  XInstall?: any
  /** damke */
  DankeX?: any
  /** CodeInstall */
  CodeInstall?: any
  /** 是不是 Pc 渲染 H5 模式 */
  isPcRenderH5?: boolean
  t: any
  /** 取消 requestAnimationFrame 请求的旧版本方法 */
  mozCancelAnimationFrame: any
  updateServerTime: () => void
  brandDetail: import('@tg/types').BrandInfoType
}

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

/** Tab item */
interface IBaseTabItem {
  label: string
  value: string | number
}

/** Select item */
interface IBaseSelectItem {
  label: string
  value: string
}
