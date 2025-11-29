declare interface Window {
  // extend the window
}

declare module 'virtual:svg-icons-names' {
  const names: string[]
  export default names
}

// with vite-plugin-vue-markdown, markdown files can be treated as Vue components
declare module '*.md' {
  import { type DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.vue' {
  import { type DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.tsx' {
  import { type DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module "jsdom"

/** 显示类型详细值 */
type Prettify<T> = {
  [P in keyof T]: T[P]
}

declare interface Window {
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
  langChoosed?: 'zh-CN' | 'pt-BR' | 'vi-VN' | 'th-TH' | 'hi-IN' | 'en-US' | 'in-ID' | 'aa-AA' | 'ko-KR' | 'ja-JP' | 'tl-PH'
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
  /** KYC实例 */
  sdkInstance:any
  jsBridge?: {
    postMessage?: (eventType: string, eventValues: string) => void
  }
  webkit?: {
    messageHandlers?: {
      eventTracker?: {
        postMessage: ({eventName: string, eventValue: string}) => void
      }
    }
  }
}

/**
 * 用于select的option
 */
interface ISelectOption {
  label: string
  value: string | number
  bonus?: string
}

interface ISelectOptionString {
  label: string
  value: string
}

interface ISelectOptionNumber {
  label: string
  value: number
}

interface IObject {
  [key: string]: any
}

/**
 * 聊天室用户角色
 */
type ChatUserRole = 'moderator'

/**
 * 用户级别
 */
type UserLevelBadge = 'bronze' | 'silver' | 'gold' | 'diamond' | '1' | '2' | '3' | '4'

/**
 * 聊天室用户
 */
interface ChatUserInfo {
  name: string
  uid: string
  level?: UserLevelBadge
  role?: ChatUserRole
  [k: string]: any
}

/**
 * 聊天室消息体
 */
interface ChatMessageInfo {
  id?: string
  type?: 'tip' | 'rain'
  user: ChatUserInfo
  [k: string]: any
}

/**
 * SportTournament 体育系列赛事（不同大小不同等级的赛事）
 */
interface SportTournament {
  /** id */
  id: string
  /** 固定链接地址 */
  slug?: string
  /** 赛事名称 国家名称 体育运动名称 */
  name: string
  /** 国家代码 */
  countryCode?: string
  /** 具体对局 Match 的数量（tournamentList 里面 fixtureCount 的总和） */
  fixtureCount?: number
  /** 具体对局 Match 列表 */
  fixtureList?: Array<SportFixture>
  /** 赛事列表 */
  tournamentList?: Array<SportTournament>
  /** 上一级分类 */
  category?: SportTournament
  /** 属于具体什么运动 */
  sport?: Array<SportTournament>
  contentNotes?: Array
  [k: string]: any
}

/**
 * SportFixture 某一场对局
 */
interface SportFixture {
  id: string
  status: string
  slug: string
  name: string
  marketCount: number
  extId: string
  liveWidgetUrl: string
  widgetUrl: string
  // data:               any
  tournament: Tournament
  // eventStatus:        EventStatus;
  // groups:             Group[];
  [k: string]: any
}

/**
 * Column 表格列配置
 */
interface Column {
  /** 列头显示文字 */
  title?: string //
  /** 列宽度 */
  width?: number | string
  /** 列数据字符索引 */
  dataIndex: string
  /** 列插槽名称索引 */
  slot?: string
  /** 列对其方式 */
  align?: 'left' | 'center' | 'right'
  /** 是否展示排序 */
  sort?: boolean
  /** ascend-升序 | descend-降序 */
  sortDirections?: 'ascend' | 'descend' // 升序 ｜ 降序
  /** 气泡展示，总投注额专用 */
  isTips?: boolean
  /** 骨架屏是否显示圆形 left-左边 right-右边 */
  isRound?: 'left' | 'right',
  /** 骨架屏是否固定宽度 */
  skeWidth?: string,
  /** 是否表示金额 数据要有currency_id显示货币icon */
  isAmount?: boolean
  /** 金额是否需要颜色 */
  showColor?: boolean
  /** 表头 th 控制最多两行 */
  isThLineClamp2?: boolean
  /** 表头 th padding x */
  thPaddingX?: string | number
  /** 总计插槽 */
  sumSlot?: string
  /** 表头插槽 */
  headerSlot?: string
  /** 表格visible */
  visible?: boolean
  /** tbody文字颜色 */
  color?: string
  // 没有看mb是什么作用，解决ts报错，headerTextColor字面意思
  headerTextColor?: string
  mb?:number

}

/** Mines游戏方块数据 */
interface OriginalGameMinesTile {
  position: number
  result: string
  openByPlayer: boolean
  fetching: boolean
  chosen: boolean
}

interface OriginalGameDragonTile {
  result:string
  openByPlayer:boolean
  chosen:boolean
}

/** Keno游戏方块数据 */
interface OriginalGameKenoTile{
  position:number
  num:number
  chosen:boolean
  result:string
}
