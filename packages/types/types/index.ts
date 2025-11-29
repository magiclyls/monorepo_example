import type {
  EnumCurrencyKey,
  ISportEventInfo,
  ISportOutrightsInfo,
  TOS,
  TTheme,
} from '../apis'
import type { CurrencyCode } from '../currencyData'
import type { EnumLanguage, EnumsTheme, PokerColors, ReceiveFlutterAppMessage, TimezoneValue } from '../enums'
import type { ESportsToMainPageRoutes } from '../eventBus'

/**
 * 首页模板
 * stake-黑色  值 1
 * stake-绿  值 2
 * bc.game  值 3
 * 大老板制定的首页-白 值 4
 * 青黑 -- 值 5
 * 新版黑色stake -- 值 6
 */
export type HomeTemplate = typeof EnumsTheme[keyof typeof EnumsTheme]

export interface GlobalInitMap {
  /** 体育馆维护状态 */
  isSportsMaintained: boolean | null
  /** 体育馆维护开始时间 */
  sportsMaintainedStartTime: number | null
  /** 体育馆维护结束时间 */
  sportsMaintainedEndTime: number | null
  /** 默认跳转首页 */
  defaultRedirect: string
  /** 全局全参数品牌信息 */
  allBrandInfo: BrandInfoType | null
  /** 当前是什么首页模板 */
  currentTemplate: HomeTemplate
  /** 当前是什么主题模板 */
  currentTheme: TTheme
  /** 是否打开注册弹窗 */
  isOpenRegisterDialog: boolean
  /** 是否打开登录弹窗 */
  isOpenLoginDialog: boolean
  /** 是否打开下载弹窗 */
  isOpenDownLoadDialog: boolean
  /** 是否打开底部下载弹窗 */
  isOpenDownLoadDialogBottom: boolean
  /** 是不是pc渲染h5模式 */
  isPcRenderH5: boolean
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
export interface ChatUserInfo {
  name: string
  uid: string
  level?: UserLevelBadge
  role?: ChatUserRole
  [k: string]: any
}
/**
 * 聊天室消息体
 */
export interface ChatMessageInfo {
  id?: string
  type?: 'tip' | 'rain'
  user: ChatUserInfo
  [k: string]: any
}

export type EnumLanguageKey = keyof typeof EnumLanguage

export interface BasePopProps {
  title?: string
  show?: boolean
  showClose?: boolean
  showHeader?: boolean
  zIndex?: number
  closeCb?: () => void
  wraperClass?: string
}

export interface Room {
  icon: string
  label: string
  value: EnumLanguageKey
  apiValue: string
}

export interface IBreadCrumbItem {
  /** 面包屑点击跳转的地址 */
  path: string
  /** 面包屑显示的名称 */
  title: string
  /** 路由数据 */
  data?: {
    name: ESportsToMainPageRoutes
    data?: {
      si: number
      pgid?: string
      ci?: string
      ei?: string
      query?: string
    }
  }
}

export interface PanelTypeItem {
  title?: string
  homeTeam: string
  awayTeam: string
}

/** 面板数据类型 */
export interface IBasePanelType {
  /** 球种id */
  si: number
  /** 开始时间 */
  startTime: string
  /** 主队名称 */
  homeTeamName: string
  /** 客队名称 */
  awayTeamName: string
  /** 备注 */
  remark: string
  /** 主队分数 */
  homeTeamScore: number
  /** 客队分数 */
  awayTeamScore: number
  /** 客队图标 */
  atpic: string
  /** 主队图标 */
  htpic: string
  /** 球种图标 */
  spic: string
  /** 角球 */
  corner?: {
    /** 主队角球数量 */
    homeTeam: number | string
    /** 客队角球数量 */
    awayTeam: number | string
  }
  /** 红牌 */
  redCard?: {
    /** 主队红牌数量 */
    homeTeam: number | string
    /** 客队红牌数量 */
    awayTeam: number | string
  }
  /** 黄牌 */
  yellowCard?: {
    /** 主队黄牌数量 */
    homeTeam: number | string
    /** 客队黄牌数量 */
    awayTeam: number | string
  }
  period?: PanelTypeItem[]
  gameScore?: {
    homeTeam: number
    awayTeam: number
  }
  /** 加时数据 */
  overtime?: {
    /** 主队加时数据 */
    homeTeam: number
    /** 客队加时数据 */
    awayTeam: number
  }
  pol: {
    [key: string]: number
  }
}

/**
 * 体育投注数据类型
 */
export interface IBetInfo {
  rei: string
  /** 投注项id，最内层id 大小玩法选择大的投注选项id */
  wid: string
  /** 盘口id， 让球、大小 那层的id */
  mlid: string
  /** 坑位 (当有多个不同分数的让分盘时，各盘口的序号) */
  mll: number
  /**
   * 1:全场
   *
   * 2:上半场
   *
   * 3:下半场
   */
  pid: number
  /**
   * 玩法id
   *
   * 玩法种类id
   *
   * ex:让球 1
   *
   * 大小 2
   *
   * 独赢 3
   */
  bt: number
  /** 赔率 */
  ov: string
  /**
   * 1:早盘
   *
   * 2:今日
   *
   * 3:滚球
   */
  m: number
  /** 赛事id */
  ei: string
  /** 球种Id */
  si: number
  /** handicap */
  hdp: string
  /**
   * 下注种类id，ex: 大小裡面的大=1 小=2
   */
  sid: string
  sp: string
}

/**
 * 赛事信息
 *
 * 用来存储赛事信息的数据结构，用在右侧投注面板和获取赛事信息的接口
 */
export type ICartInfo = {
  /** 主队名称 */
  homeTeamName: string
  /** 客队名称 */
  awayTeamName: string

  /** 盘口名称 */
  btn: string

  /** 选项名称 */
  sn: string

  /**
   * 是否取得串关数量
   *
   * 1:支援串关
   *
   * 2:不支援串关
   */
  ic: 1 | 2
  /** 开赛时间 */
  ed: number
  /** 地区Id */
  pgid: string
  /** 联赛id */
  ci: string
  /** 客队比分 */
  ap: number
  /** 主队比分 */
  hp: number
  /** 联赛名称 */
  cn: string
} & IBetInfo

/**
 * 购物车数据
 * @desc 相对于 ICartInfo 带有amount，用来存储购物车中的金额
 */
export type ICartInfoData = ICartInfo & {
  amount: number
  os: TOS
  /** 最⼤投注额 */
  maa: number
  /** 最⼩投注额 */
  mia: number
  /** 是否变成了结果 */
  result?: 'fulfilled' | 'rejected'
  /** 实际赛事ID */
  cei?: string
  /** 串关类型 */
  pt: number
  /** 客队比分 */
  ap: number
  /** 主队比分 */
  hp: number
  /** 新的盘口Id */
  new_wid: string
  sp: string
  /** 当前项的赔率是否变化 */
  ovIsChange: boolean
  /** 投注额错误信息 */
  errorMsg: string
  /** 预约赔率 */
  appointingOv?: number
}

// /**
//  * 更新购物车数据，反应数据是否有变化
//  */
// export interface IUpdateCartData {
//   /** 赔率是否改变 */
//   ovIsChange: boolean
//   /** 是否有更低的赔率 */
//   ovIsLower: boolean
// }

/**
 * 赛事信息改变回调函数
 */
export type IBetInfoChangeCallback = (
  data: {
    /** os和ov有变化的数据 */
    osOvIsChangeList: ISportListToCartData[]
  }
) => void

/**
 * 列表通知回调函数
 */
// export type IListToCartCallback = (data: IUpdateCartData) => void

/**
 * 赛事根据联赛组合
 */
export type ISportDataGroupedByLeague = {
  ci: string
  cn: string
  list: ISportEventInfo[]
}[]

/**
 * 冠军赛事根据联赛组合
 */
export type IOutrightDataGroupedByLeague = {
  ci: string
  cn: string
  list: ISportOutrightsInfo[]
}[]

/**
 * 列表和购物车通知传递的数据类型
 */
export interface ISportListToCartData {
  /** 盘口id */
  wid: string
  /** 赔率 */
  ov: string
  os: TOS
  /** 盘口id， 让球、大小 那层的id */
  mlid: string
}

/**
 * 体育面包屑类型
 */
export interface ISportsBreadcrumbs {
  label: string
  value: string
  path: string
  /** 路由数据 */
  data?: {
    name: ESportsToMainPageRoutes
    data?: {
      si: number
      pgid?: string
      ci?: string
      ei?: string
      query?: string
    }
  }
}

/**
 * Banner 类型
 */
export interface BannerItem {
  imgUrl: string
  type: number
  jumpState: number | string
  backgroundUrl: string
  rightImageUrl: string
  content: string
  banner_style3_background: string
  banner_style: 1 | 2 | 3
  title: string
  superscript: string
  button?: {
    text: string
    url: string
    type: number
  }
  align: 'left' | 'right'
  promo_info: {
    display_mode: number
    end_at: number
    id: string
    start_at: number
  }
}

/**
 * 扑克牌配置
 * JOKER
 */
export type PokerRank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A'
export interface PokerCardProps {
  rank?: PokerRank
  suit?: PokerColors
  color?: PokerColors
  faceDown?: boolean
  lose?: boolean
  win?: boolean
  disabled?: boolean
  active?: boolean
  draw?: boolean
  /** 关闭动画秒数 */
  closeDuration?: number
  /** 动画是否开启 */
  animateEnabled?: boolean
  /** 打开牌 */
  flipDuration?: number
}

export type WeekDays = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

/** 回合过程 deal=发牌 hit=叫牌 stand=停叫 double=加倍 split=分牌 bust=爆点 blackjack=黑杰克 insurance=买保险  */
export type PlayerCardActions = 'deal' | 'hit' | 'stand' | 'double' | 'split' | 'bust' | 'blackjack' | 'insurance' | 'noInsurance' | 'full'

export interface PokerCardItem {
  rank: PokerRank
  suit: PokerColors
}

export interface NpcPokerState {
  value: string
  actions: PlayerCardActions[]
  card: PokerCardItem[]
}

export interface BlackJackData {
  id: string
  active: boolean
  payout_multiplier: string
  amount_multiplier: string
  amount: string
  payout: string
  updated_at: number
  currency: CurrencyCode
  game: string
  uid: string
  name: string
  settle_amount: string
  state: {
    bet_amount_detail?: {
      bet_amount: string
      double_amount1: string
      double_amount2: string
      insurance_amount: string
      split_amount: string
    }
    player: NpcPokerState[]
    dealer: NpcPokerState[]
  }
}

/** App传递的类型 */
export type FlutterAppQueryType = 't' | 'isFlutterApp'

/** App 传给 h5 的消息类型 */
export interface FlutterAppMsgType {
  type: ReceiveFlutterAppMessage
  msg: {
    currency?: EnumCurrencyKey
    promoRedPid?: string
    [k: string]: any
  }
}

export type Language = 'zh_CN' | 'en_US' | 'vi_VN' | 'pt_BR' | 'th_TH' | 'hi_IN'
/** 品牌信息类型 */
export interface BrandInfoType {
  ban?: boolean
  bl?: boolean
  /** 链接跳转 1首页 2注册 3登录 4体育 */
  location?: number
  /** 体育维护状态 1 是正常 2是维护 */
  smaint?: { state: number, et: number, st: number }
  amount?: {
    [k: string]: { d: string, w: string }
  }
  tpl: HomeTemplate
  base?: {
    commission: boolean
    commission_withdraw_min: string
    deposit: boolean
    currency_exchange: number // 1 法币换虚拟,2 虚拟换法币,3 互换,0  关闭
    fast: number
    default: {
      currency: CurrencyCode
      lang: Language
      timezone: string
    }
    /** 配置切换的语言 */
    lang: {
      /** 1 单一语言 2 所有 */
      f: number
      d: string | Array<Language>
    }
    verify: {
      all: boolean
      otp: boolean
      password: boolean
    }
    /** 1是开启 */
    kyc: number
    /** 保险库、利息宝是否开启 1是开启 */
    interest: 0 | 1
    /** 原生体育 */
    nativeTY: boolean
    /** 是否开启存款PWA */
    pwaSetting: { pwaEnabled: boolean }
    /** 是否开启登陆PWA */
    loginPwa: boolean
    /** 长方形 1 正方形 2  tql 等于8  才会有这个字段 */
    gameImgType?: number
    /** 时区 */
    timezone: TimezoneValue
    /** 验证方式 1邮箱或手机 2邮箱或手机+脸部识别 */
    verification: number
  }
  kf?: Array<{
    id: number
    remark: string
    state: string
    url: string
  }>
  pc?: {
    pc_first_letter: string
    pc_icon: string
    pc_logo_gray: string
    pc_logo_white: string
    pc_logo_white_after_login: string
    pc_loading?: {
      image?: string
    }
    pc_lead: string
    home_app_download: string
    bottom_app_download?: string
  }
  reg?: Array<{
    birthday: boolean
    mail: {
      mail: boolean
      verify: boolean
    }
    phone: {
      phone: boolean
      verify: boolean
    }
    username: boolean
    verify: boolean
    /** 验证方式 1邮箱或手机 2邮箱或手机+脸部识别 */
    verification: number
  }>
  third?: {
    FaceBook: {
      id: string
      secret: string
      state: number
    }
    Google: {
      id: string
      secret: string
      state: number
    }
    Line: {
      id: string
      secret: string
      state: number
    }
    Twitch: {
      id: string
      secret: string
      state: number
    }
  }
  app?: {
    app_desktop: string
    pwa_desktop: string
    app_first_letter: string
    app_logo_gray: string
    app_logo_white: string
    app_logo_white_after_login: string
    app_open: string
    app_restore: string
  }
  api_domain?: {
    host: Array<string>
    type: number
    vg_install_domain: string
    vg_install_key: string
    pwa_back_domain: Array<string>
    h5_url?: string
  }
  /** 百度，友盟统计代码 */
  code: string
}

type Primitive = string | number | boolean | bigint | symbol | null | undefined

export type GetPath<T, Prev extends string = ''> =
  T extends Primitive ? never :
      {
        [K in keyof T & string]:
        T[K] extends Primitive | Array<any>
          ? `${Prev}${K}`
          : `${Prev}${K}` | GetPath<T[K], `${Prev}${K}.`>
      }[keyof T & string]

/** 根据路径取值类型 */
export type GetPathValue<T, P extends string> =
  P extends `${infer K}.${infer Rest}`
    ? K extends keyof T
      ? GetPathValue<NonNullable<T[K]>, Rest> // ✅ 这里用 NonNullable
      : never
    : P extends keyof T
      ? NonNullable<T[P]> // ✅ 去掉可选
      : never
export interface IPromoConfig {
  id: string // 优惠活动id
  bonus_type: number // 1:固定金额,2:随机金额, 3:比例金额
  promo_cfgs: IPromoDetail[]
  currency_id: string // 活动配置货币
  cur_rate: string // 转成活动货币汇率
}

export interface IPromoDetail {
  deposit: string
  scale: string
  limit: string
  min: string
  max: string
}
export interface IMerchant {
  id: string
  name: string
  amount_max: string
  amount_min: string
  amount_type: number
  amount_fixed: string
  often_amount: string
  bankcard_id: string
  method_id: string
  method_name: string
  alias: EnumCurrencyKey
  payment_type: number
  currency_name?: string
  bonus_map: {
    [key: string]: string
  }
  promo_cfgs: IPromoConfig[]
}

export interface MerchantGroup {
  alias: string
  bank: boolean
  contract_id: string
  deposit_promo: {
    min: string
    max: string
    ratio: string
    bonus_max: string
  }[]
  id: string
  merchants: IMerchant[]
  name: string
  payment_type: number
  pname: string
  promo: string
  ptype: number
  zkId: string
}

export interface Currency {
  balance?: string
  currency_id: CurrencyCode
  currency_name: string
  label: string
  value: string
  cur: string
  amount: number
}

export interface BaseOption {
  label: string
  value: string
}

/**
 * Column 表格列配置
 */
export interface Column {
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
  isRound?: 'left' | 'right'
  /** 骨架屏是否固定宽度 */
  skeWidth?: string
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
  mb?: number
}
/**
 * 任务列表
 */

export interface TaskDetail {
  reg_time: string
  task_cur: CurrencyCode
  deposit_amount: string
  task_state: number // 1未开始 2进行中 3已关闭 4删除
  apply_amount: string // 可领取金额
  cur_time: string
  platform_name: string
  platform_id: number
  sales_rate: string
  state: number // -1系统错误，0未完成任务，1待领取奖励，2已领取奖励，3注册时间在任务创建时间之前，4一个IP只能参与一次，5一个设备只能参与一次，6当前币种不支持，7vip等级限制参与，8你已领取此类型任务不能参与同类型的任务,9.在验证任务创建前就已经验证完成不能参与验证活动
  maintained?: string
  next_level_threshold_amount: '' // 差多少
  next_level_award: '' // 差多少可领取多少
  bonus_amount: number
  valid_bet_amount: number
  coding: number
  icon?: string
  task_info: {
    button_type?: number
    button_redirect?: string
    betting_info: any
    ty: number // 1.注册,2.下载,3.手机验证,4.累积存款,5.有效投注，6.邮箱验证，7.KYC认证，8.钱包/虚拟币存款
    id: string
    cate_id: number
    validate_type: number
    close_type: number
    job_duration_type: number
    cycle: number
    start_at: string
    end_at: string
    button: string
    detail: string
    lang: string
    images: string
    state: number
    names: string
    job_config: {
      currency_id: CurrencyCode // 货币配置
      device: string[] // 注册端口、下载端口
      claim_expired_days: number
      cycle: number
      sport: number
      assign_sport: Record<string, unknown> // 可以根据实际结构细化类型
      statistic_type: number
      bonus_type: 1 | 2 // 1 固定金额，2 随机金额
      bonus_amount: string[] // 随机金额时，显示该数组
      bonus_config: { amount: string, award: string }[] // 可进一步定义结构
      wallet_method_ids: number[] | null
      coin_method_ids: number[] | null
    }
    tongue: {
      [k: string]: any
    }
    text: string
    redirect: string
    conf: {
      vip: number[]
      tongue: any
      way: {
        [k: string]: any

      }
    }
    sport: string
    assign_sport: {
      [k: string]: string[]
    }

  }
}

export interface TaskBonusItem {
  ty: number
  names: string
  amount: string
  award: string
}

export interface TaskSelectorItem {
  id: string
  names: string
  ty: number
  device: string
}
export interface TaskBetSelectorItem {
  id: string
  names: string
  ty: number
  support_platform: string
  device: string
}

export interface TaskInnerDetail {
  bonus: TaskBonusItem[]
  selector: {
    [key: string]: TaskSelectorItem[]
  }
  bet_selector: TaskBetSelectorItem[]
}
export interface TaskRecord {
  apply_amount: string
  currency_id: CurrencyCode
  job_id: string
  job_names: string
  receive_at: number
  ty: number
  version: string
}

export type TBaseNotifyType =
'set' | 'user' | 'email' | 'error' | 'success' | 'insurance' | 'statistics' | 'phone' | 'wallet' | 'auto' | 'info' | 'chat'
