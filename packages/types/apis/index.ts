import type { CurrencyCode } from '../currencyData'
import type { EnumCurrency, EnumsTheme, TIMEZONEABBR } from '../enums'
import type { ICartInfo, ICartInfoData } from '../types'

/** 颜色主题 */
export type TTheme = keyof typeof EnumsTheme

/** 货币的Key */
export type EnumCurrencyKey = keyof typeof EnumCurrency

/**
 * 版型ID
 * 羽毛球和网球的波胆会回传 pat : 8 请前端判断 pat = 8 时，显示没有平局的波胆
 */
export type TPat = 1 | 2 | 3 | 4 | 5 | 6 | 8

/** 后端金额接口数据 */
export type TCurrencyObject = Prettify<{
  uid: string
} & {
  -readonly [K in EnumCurrencyKey]: string;
}>

export interface INotNotice {
  noNotify?: boolean
}

/** 后端返回数组时候的数据结构 */
export interface IResponseList<T> {
  d: T[]
  t: number
  s: number
  [k: string]: any
  info: {
    display_num: number
    name: string
    sums: Record<string, any>
    sums_pc: Record<string, any>
  }
  sums: {
    platform_id: string
    venue_id: string
    platform_name: string
    total: number
    icon: string
  }[]
}

/**
 * 给Interface添加auth 属性
 * 如果auth为true或者undefined，表示需要登录
 */
export type IAuth<T> = T & {
  auth?: boolean
}

/** 绑定的钱包银行卡对象 */
export interface BankCard {
  id: string
  site_id: string
  uid: string
  username: string
  currency_id: string
  type_id: string
  type_name: string
  open_name: string
  bank_id: number
  bank_name: string
  bank_account: string
  bank_area_cpf: string
  phone?: string
  email?: string
  /** 是否默认：1：是，2否 */
  is_default: number
  state: number
  created_at: number
  updated_at: number
  pay_password: string
  country: string
  city: string
  address: string
  auth_type: number
}

export interface IWithdrawTypeItem {
  id: string
  alias: string
  name: string
  /** 1CNY银行卡 2支付宝 3钱包支付 */
  type: 1 | 2 | 3
}

export interface IWithdrawBankOrWalletItem {
  bank_id: number
  bank_name: string
  /** 1:有默认卡 2:没默认卡 */
  is_default: number
  /** 出款方式id */
  withdraw_type_id: string
}

/** 绑定的钱包虚拟币地址对象 */
export interface VirtualCoin {
  id: string
  uid: string
  state: number
  /** 合约类型 */
  contract_type: string
  contract_name: string
  /** 货币名称 */
  currency_name: string
  created_at: number
  updated_at: number
  /** 是否默认：1：是，2否 */
  is_default: number
  /** 用户名 */
  username: string
  /** 钱包地址 */
  address: string
  auth_type: number
  currency_id: CurrencyCode
  pay_password: string
  type_id: string
  type_name: string
}

/** 用户信息 */
export interface IUserInfo {
  uid: string
  phone: string
  telegram: string
  facebook: string
  zalo: string
  line: string
  viber: string
  whatsapp: string
  twitter: string
  wechat: string
  qq: string
  area_code: string
  /** 性别 1=男，2=女 */
  sex: number | string
  cpf: string
  third_id?: string
  third_type?: string
  /**
   * 1:代表首存过
   */
  is_first_deposit: number
}

/** 用户详情  */
export interface IMemberDetail {
  avatar_url: string
  gender: string
  real_name: string
  nationality: string

  uid: string
  username: string
  email: string
  /** 邮箱是否验证 1=已验证，2=未验证 */
  email_check_state: number
  phone: string
  /** 手机号是否验证 1=已验证，2=未验证 */
  phone_check_state: number
  password: string
  created_at: number
  created_ip: string
  sid: string
  level_id: string
  vip: string
  top_uid: string
  top_name: string
  parent_uid: string
  parent_name: string
  birthday: string
  tester: string
  avatar: number
  device_number: string
  last_login_ip: string
  last_login_at: number
  last_login_device: string
  last_login_domain: string
  reg_domain: string
  reg_ip: string
  reg_device_no: string
  agency_rebate_state: number
  state: string
  source: string
  member_type: number
  bonus_state: number
  bonus_note: string
  note: string
  deposit_count: number
  withdraw_count: number
  deposit_amount: string
  withdraw_amount: string
  /** 谷歌验证吗key */
  google_key: string
  /** 1谷歌未认证 2谷歌已认证 */
  google_verify: number
  /** 是否设置资金密码 0=未设置 1=已设置 */
  pay_password: string
  online: string
  login_count: number
  level_lock_state: string
  /** 会员vip积分/打码 */
  score: string
  /** 会员当月保级积分/打码 */
  retain: string
  /** 会员当月保级充值 */
  deposit_retain: string
  lock_vip: number
  commission_state: number
  rebate_state: number
  chat_state: number
  ext: string
  names: string
  /** 账户余额 */
  balance: TCurrencyObject
  balance_agency: TCurrencyObject
  /** 利息宝余额 */
  balance_locker: TCurrencyObject
  mext: {
    telegram: string
    facebook: string
    zalo: string
    line: string
    viber: string
    whatsapp: string
    twitter: string
    wechat: string
    qq: string
    cpf: string
    sex: number
    third_type: number
    third_id: string
    auth_secret: string
    is_first_deposit: number
  }
  realname: {
    cn: string
    vn: string
    th: string
    br: string
    en: string
    in: string
  }
  exclude: number
  /** CPF号码 */
  cpf_number: string
  /**  0:默认 1:待验证 2:不在黑名单中 3:在黑名单中 */
  cpf_state: 0 | 1 | 2 | 3
  /** 1:待验证 2:已批准 3:已拒绝 4: 手动审核 */
  kyc_state: 0 | 1 | 2 | 3 | 4
  /** 暂停投注截止时间戳 */
  stop_bet: number
}

export interface IMemberBalanceLockerUpdate {
  /** 1:转入 2转出 */
  flag: 1 | 2
  currency_id: number
  amount: string
  password?: string
  /** 验证方式 1:双重验证码 2:资金密码 */
  auth_type?: number
}

export interface IMemberReg {
  email: string
  username: string
  password: string
  birthday?: string
  /** 上级id，没有留空 */
  parent_uid?: string
  c?: string
  device_number: string
  /** 邮箱验证码 */
  captcha?: string
  phone?: string
  area_code?: string
  /** 滑块验证 */
  validate?: string
}

export interface IMemberThirdReg {
  email: string
  username: string
  parent_uid?: string
  c?: string
  device_number: string
  third_type: number
  third_id: string
  password?: string
  // phone?: string
}

export interface ICasinoGameItem {
  id: string
  game_type: string
  game_id: string
  platform_id: string
  venue_id: string
  platform_name: string
  img: string
  name: string
  sorting: number
  is_hot: number
  is_new: number
  is_fav: number
  online_num: number
  maintained: string
  en_name: string
  ty: number
  icon?: string
}

export interface ICasinoProviderGameItem {
  id: string
  platform_id: string
  venue_id: string
  platform_name: string
  name: string
  zh_name: string
  en_name: string
  pt_name: string
  th_name: string
  vn_name: string
  hi_name: string
  ko_name: string
  in_name: string
  ja_name: string
  client_type: string
  game_type: string
  zk_online: string
  online: string
  maintained: string
  game_id: string
  img: string
  sorting: number
  en_sort: number
  pt_sort: number
  vn_sort: number
  th_sort: number
  zh_sort: number
  hi_sort: number
  ko_sort: number
  in_sort: number
  ja_sort: number
  v_en_sort: number
  v_pt_sort: number
  v_vn_sort: number
  v_th_sort: number
  v_zh_sort: number
  v_hi_sort: number
  v_ko_sort: number
  v_in_sort: number
  v_ja_sort: number
  online_num: number
  category: string
  created_at: number
  currency: string
  lang: string
  rtp: string
  percent: string
  updated_at: string
  updated_uid: string
  updated_name: string
  is_hot: number
  is_new: number
  bet: number
  remark: string
  is_fav: number
  currencys: any[]
  langs: any[]
  client_types: any[]
  lucky_bet_logs?: any
  big_bet_logs?: any
}

export interface ICasinoBetRecordItem {
  bill_no: string
  bet_time: number
  platform_id: string
  platform_name: string
  username: string
  game_class: string
  game_name: string
  game_code: string
  bet_amount: string
  valid_bet_amount: string
  net_amount: string
  currency_id: CurrencyCode
  factor: string
  settle_amount: string
  detail: string
  uid: string
  bill_no_hash?: number
  game_type?: string
}

/** 场馆item */
export interface ProviderItem {
  id: string
  en_name: string
  game_type: string
  state: number
  maintained: string
  maintained_st: number
  maintained_et: number
  seq: number
  logo: string
  created_at: number
  updated_at: number
  updated_uid: string
  updated_name: string
  zh_name: string
  pt_name: string
  vn_name: string
  th_name: string
  game_num: number
  name: string
  venue_id: string
  [k: string]: any
}

export interface CasinoProviderItem {
  id: string
  venue_id: string
  name: string
  en_name: string
  zh_name: string
  pt_name: string
  vn_name: string
  th_name: string
  game_type: string
  zk_state: string
  state: string
  maintained: string
  seq: number
  logo: string
  nav: string
  background: string
  currency: string
  lang: string
  created_at: number
  updated_at: number
  updated_uid: string
  updated_name: string
  maintained_st: number
  maintained_et: number
  game_num: number
}

/** 汇率数据对象 */
export interface ExchangeRateData {
  [key: string]: { [key in CurrencyCode]?: string }
}

/** vip 等级配置对象 */
export interface VipConfig {
  /** 等级 */
  level: number
  /** 等级别称 */
  // alias: string
  /** 会员人数 */
  total: number
  /** 经验要求,积分 */
  upgrade: string
  /** 是否默认 */
  is_default: 0 | 1
  /** 添加时间 */
  created_at: number
  /** 修改时间 */
  updated_at: number
  /** 保级积分 */
  retain: string
  deposit_retain: string
  is_delete: number
  multiple: string
}

/** ================= 体育 ====================== */
/** 赛事详情 ml-ms */
export interface ISportEventInfoMlMs {
  /** WagerSelectionId */
  wid: string
  /** SelectionId */
  sid: string
  /** 球种名称 */
  sn: string
  /** Handicap */
  hdp: string
  /** Specifiers */
  sp: string
  /** OddsList 内的欧洲盘 OV */
  ov: string
  /** 需要传递给组件的props，用于加入到购物车的 */
  cartInfo: ICartInfo
}

/** 赛事详情 ml */
export interface ISportEventInfoMl {
  rei: string
  /** MarketlineId */
  mlid: string
  /** BetType */
  bt: number
  /** 是否角球 1不是 2是 */
  egi: number
  /** BetTypeName */
  btn: string
  pid: number
  /** PeriodName */
  pn: string
  /** MarketLineLevel */
  mll: number
  /** 0:关盘  1:开盘  2:锁盘 */
  mls: number
  /** 版型id */
  pat: TPat
  /** 对应的盘口标签 */
  tgis: number[]
  /** WagerSelections */
  ms: ISportEventInfoMlMs[]
  /** 用来组装接口返回的数据，比如后端返回的list中，其中两条在某些条件上是表现一样的，前端页面上是用一个元素显示 */
  other: ISportEventInfoMlMs[]
  /** 版型6的字段 */
  pat6: {
    titleList: string[]
    list: ISportEventInfoMlMs[]
  }
}

/** 赛事详情 */
export interface ISportEventInfo {
  /** 赛事ID */
  ei: string
  /** 球种Id */
  si: number
  /** 球种名称 */
  sn: string
  /** market 1:早盤 */
  m: number
  /** 聯賽id */
  ci: string
  /** 联赛名称 */
  cn: string
  /** 主队id */
  hti: string
  /** 主队名称 */
  htn: string
  /** 客队id */
  ati: string
  /** 客队名称 */
  atn: string
  /** 滚球时间 */
  rbt: string
  /** RBTimeStatus */
  rbts: number
  /** 玩法总数 */
  mc: number
  /** 赛事开始时间 */
  ed: number
  /** 当前是第几盘或者第几局 */
  ep: number
  /** 赛事状态 */
  es: number
  /**
   * 是否取得串关数量
   *
   * 1:支援串关
   *
   * 2:不支援串关
   */
  ic: 1 | 2
  /** 是否热门 */
  hot: number
  /** orderNumber */
  on: number
  /** 主队比分 */
  hp: number
  /** 客队比分 */
  ap: number
  /** 比分列表 */
  pol: {
    [key: string]: number
  }
  /** 地區id */
  pgid: string
  /** 地区 */
  pgn: string
  /**
   * 赛事是否有现场直播Url,
   *
   * 0:没有,
   *
   * 1:有
   */
  ls: number
  /** 现场直播 URL清单 */
  lsu: []
  /** 赛事的更多信息。每个体育的额外信息将有所不同 */
  eifo: string
  /** 盘口标签列表 */
  tgl: {
    /** 盘口标签Id */
    tgi: number
    /** 盘口标签名称 */
    tgn: string
  }[]
  /** 盘口清单 */
  ml: ISportEventInfoMl[]
  /** 赛事更新时间 */
  ts: 1699616882
  /** 客队图标 */
  atpic: string
  /** 主队图标 */
  htpic: string
  /** 球种图标 */
  spic: string
  /** 赛事进度 半场 上半场 下半场 休息 */
  rbtd: string
  /** 赛事进行时间 分:秒 */
  rbtt: string
  /** 背景图 */
  sbgpic: string
  qml: ISportsEventInfoQml[]
}
export interface ISportsEventInfoQml {
  n: string
  sqml: {
    n: string
    /** 盘口清单 */
    ml: ISportEventInfoMl[]
  }[]
}

/** 冠军盘口数据 */
export interface ISportOutrightsInfo {
  si: number
  sn: string
  pgid: string
  pgn: string
  ci: string
  cn: string
  ei: string
  oen: string
  ed: number
  mc: number
  ml: {
    mlid: string
    bt: number
    btn: string
    pid: number
    pn: string
    mll: number
    mls: number
    ms: {
      cartInfo: any
      wid: string
      sid: string
      sn: string
      hdp: string
      sp?: any
      ov: string
    }[]
  }[]
}

/** 存款请求接口对象 */
export interface DepositInfo {
  /** 金额 */
  amount: string
  /** 支付通道ID */
  cid: string
  /** 货币ID */
  currency_id: string
  /** 货币名称 */
  currency_name: string
  /** 支付方式ID */
  mid: string
  /** 银行编码-三方支付存款时使用 payment_type = 1 */
  bank_code?: string
  /** 存款人姓名-法币公司入款存款使用 payment_type = 2 */
  realname?: string
  /** 法币公司入款存款 虚拟币存款 使用 */
  bankcard_id?: string
  id?: string
  address?: string
  /** upay 密码 */
  extra?: string
}

/**
 * 3:不支援的币种
 *
 * 4:只接受两位小数
 *
 * 5:要10的倍数
 *
 * 6:只接受小数点后5位
 */
export type IBetInfoDl = 3 | 4 | 5 | 6
/**
 * 3:不支援的币种
 */
export type IBetInfoStatus = 1 | 2 | 3
/**
 * 盘口状态
 *
 * 0:关盘
 *
 * 1:开盘
 *
 * 2:不支援串关
 *
 * 3: 赔率<1.1，不支援串关
 */
export type TOS = 0 | 1 | 2 | 3
/**
 * 投注信息详情
 */
export interface IBetInfoBack {
  /** 快捷金额 */
  qck: Array<number>
  /** 盘口资讯 */
  wsi?: {
    /** 盘口Id */
    wid: string
    /** 赔率 */
    ov: string
    os: TOS
    /**
     * 1:早盘
     *
     * 2:今日
     *
     * 3:滚球
     */
    m: number
    /** 主队比分 */
    hp: number
    /** 客队比分 */
    ap: number
    /** 新的盘口Id */
    new_wid: string
  }[]
  dl: IBetInfoDl
  /**
   * 3:不支援的币种
   */
  status: IBetInfoStatus
  /** 下注资讯 */
  bi?: {
    /** 盘口id */
    wid: string
    /** 最大下注额 */
    maa: number
    /** 最小下注额 */
    mia: number
    /** 赔率 */
    ov: string
    /** 串关类型 */
    pt: number
    /** 注单数量 */
    bc: number
    /** 实际赛事ID */
    cei: string
  }[]
}

/**
 * 体育投注参数
 */
export interface IBetArgs {
  /**
   * 0:不接受任何赔率变化
   *
   * 1:接受更高赔率
   *
   * 2:接受任何赔率
   */
  ao: 0 | 1 | 2
  bl: {
    /** 串关类型(betinfo 接口返回) */
    pt: number
    /** 投注金额 */
    a: number
    bi: ICartInfoData[]
  }[]
  /** 货币 */
  cur: CurrencyCode
  /** 复式提示 */
  title?: string
  noNotify?: boolean
}

/**
 * 体育预约参数
 */
export interface IBetReserveArgs {
  bi: ICartInfoData[]
  /** 货币 */
  cur: CurrencyCode
  /** 投注金额 */
  a: number
  /** 目标赔率 */
  target_odd: string
}

export interface ISportsMyBetSlipItem {
  /** 投注金额 */
  a: number
  /** 赔率 */
  ov: string
  /** 最多可赢 */
  mwa: number
  /** 投注时间 */
  bt: number
  /** 注单号 */
  ono: string
  /** 注单状态 0未结算 1已结算 2待处理 3已拒绝(危险球取消) 4已取消 */
  os: number
  /** 0:未结算 1:赢 2:输 3:平 4:赢一半 5:输一半 6:输部分 */
  oc: number
  /** 净盈利(输赢多少钱) */
  pa: number
  /** 结算时间 */
  st: number
  bi: {
    pol: {
      [text: string]: number
    }
    /** 盘口类型 */
    bt: number
    /** 下注类型名称 */
    btn: string
    /** 球种Id */
    si: number
    /** 赛事ID */
    ei: string
    /** 赔率 */
    ov: string
    /** 下注选项 */
    sn: string
    /** 赛果 */
    re: string
    /** 盘口 */
    hdp: string
    /** 主队名 */
    htn: string
    /** 客队名 */
    atn: string
    atpic: string
    htpic: string
    /** 开赛时间 */
    ed: number
    hp: number
    ap: number
    /** 地区Id */
    pgid: string
    /** 联赛id */
    ci: string
    /** 联赛名 */
    cn: string
    /**
     * 1：显示主客队名称
     *
     * 2：显示联赛名称
     */
    et: 1 | 2
    /**
     * 0 不支持重新投注
     *
     * 1 支持重新投注
     */
    reb: 0 | 1
    wid: string
    mlid: string
    mll: number
    ic: 1 | 2
    m: number
    pid: number
    sid: string
    /** 球种icon */
    spic: string
  }[]
}

export interface ISportsBetListArgs {
  /** 是否结算，0:未结算 1:已结算 */
  settle: number
  /** 进入货币 */
  cur: CurrencyCode
  page?: number
  page_size?: number
}

/**
 * 赛事列表数据
 */
export interface ISportEventList {
  /** 球种Id */
  si: number
  /** market 1:早盤 */
  m: number
  /** 赛事ID */
  ei: string
  /**
   * Action
   *
   * 0:更新或次插入赛事
   *
   * 1:移除赛事
   */
  ac: string
  /** 赛事更新时间 */
  ts: number
  /** 聯賽id */
  ci: string
  /** 地區id */
  pgid: string
  v: ISportEventInfo[]
}

/**
 * 交易记录，存取款数据
 */
export interface PayInfo {
  /** 订单号 */
  order_number: string
  /** 状态：1：成功，2：失败，3，支付中，4：删除，5:待审核 6：取消 */
  state: 1 | 2 | 3 | 4 | 5 | 6
  /** 建立时间 */
  created_at: number
  /** 金额 */
  finally_amount: string
  /** 货币id */
  currency_id: CurrencyCode
  /** 货币名称 */
  currency_name: EnumCurrencyKey
  /** 交易编号 */
  trans_no: string
  /** 金额 */
  amount: string
  /** 种类id */
  cash_type: string
  /** 种类名称 */
  cash_type_name: string
  /** 备注 */
  remark: string
  /** 交易方式 */
  pay_method_name: string
  /** 存款金额 */
  pay_amount: string
  /** 是否有预扣 */
  is_limit_balance: boolean
  /** 存款预扣金额 */
  limit_amount: string
  /** 实际到账金额 */
  actual_amount: string
}

export type IBrandDetailTag =
  'base' | 'deposit' | 'withdraw' | 'regweb' | 'third' | 'kf' | 'pc' | 'area' | 'bottom' | 'agency_show'
export interface IBrandDetailBase { }
export interface IBrandDetailDeposit { }
export interface IBrandDetailWithdraw { }
export interface IBrandDetailReg { }
export interface IBrandDetailThird { }
export interface IBrandDetailCustomer { }
export interface IBrandDetailPc {
  loading: {
    image: string
  }
  icon: {
    image: string
  }
  logo: {
    image: string
  }
}
export interface IBrandDetailArea { }

export interface ISportsInfo {
  /** 资料更新时间 */
  delta: number
  list: ISportEventInfo[]
  /**
   * 1:成功
   *
   * 3:赛事已结束
   */
  status: 1 | 3
}

/**
 * 钱包存款取款可用货币列表
 */
export interface IAvailableCurrency {
  /** 货币id */
  currency_id: CurrencyCode
  /** 货币名称 */
  currency_name: EnumCurrencyKey
  /** 余额 */
  balance?: string
}

/**
 * 钱包可取款余额（钱包提款）
 */
export interface IAvailableBalance {
  /** 可提款金额 */
  withdraw_balance: string
  /** 所需打码 */
  remaining_balance: string
  /** 会员余额 */
  total_balance: string
}

export interface INoticeItem {
  value?: string
  /** ID */
  id: string
  /** 公告类型 1-公告  2-跑马灯 */
  notice_type: number
  /** 公告标题 */
  title: {
    [key: string]: string
  }
  /** 开始时间 */
  start_time: number
  /** 结束时间 */
  end_time: number
  /** 弹跳位置 1-不限制 2-登录前 3-登陆后 */
  bounce_location: number
  /** 弹跳频率 1-不限制 2-自定义 */
  bounce_frequency: number
  /** 自定义频率次数 */
  bounce_frequency_limit: number
  /** 弹窗内容类型 1-文字 2-图片 */
  pop_up_type: number
  /** 是否显示“允许不在提示”的开关按钮，并且默认为开启,1开启，2关闭 */
  is_limit: number
  /** 1：已读，2未读取 */
  is_read: number
  /** 内容 */
  content: {
    [key: string]: string
  }
  /** 图片地址 */
  image_url: {
    [key: string]: string
  }
}
export interface IMemberNoticeItem {
  /** ID */
  id: string
  flags: string
  crowd_content: string
  /** 公告标题 */
  title: string
  /** 开始时间 */
  start_time: number
  /** 结束时间 */
  end_time: number
  client: string
  /** 弹跳位置 1-不限制 2-登录前 3-登陆后 */
  bounce_location: number
  /** 弹跳频率 1-不限制 2-自定义 */
  bounce_frequency: number
  /** 自定义频率次数 */
  bounce_frequency_limit: number
  /** 是否显示“允许不在提示”的开关按钮，并且默认为开启,1开启，2关闭 */
  is_limit: number
  /** 弹窗内容类型 1-文字 2-图片 */
  pop_up_type: number
  /** 内容 */
  content: string
  /** 图片地址 */
  image_url: string
  state: number
  created_by: string
  created_at: number
  created_uid: string
  updated_by: string
  updated_at: number
  image_info: string
  seq: number
  /** 是否已读 */
  read: boolean
}

export interface IMarqueeItem {
  id: string
  notice_type: number
  title: {
    [key: string]: string
  }
  start_time: number
  end_time: number
  created_at: number
  bounce_location: number
  bounce_frequency: number
  bounce_frequency_limit: number
  pop_up_type: number
  content: {
    [key: string]: string
  }
  image_url?: any
  is_limit: number
  is_read: number
  seq: number
}

/**
 * 小游戏投注记录数据结构
 */
export interface IOriginalGameDetail {
  bet_detail: string
  order_id: string
  uid: string
  username: string
  currency_id: CurrencyCode
  bet_amount: string
  net_amount: string
  settle_amount: string
  remark: string
  game_id: string
  bet_type: string
  created_at: number
  result: string
  seed_id: string
  nonce: number
  client_seed: string
  server_seed: string
  server_seed_hash: string
  payout_multiplier: string
}

/**
 * 推广活动配置接口数据接口
 */
export interface IPromotionInviteConfig {
  detail: string
  /** 按钮状态 1显示 2不显示 */
  button: 1 | 2
  button_text: string
  button_redirect: string
  button_type: number | string
  settings: {
    ppl: number
    bonus: string
  }[]
  first_deposit_amount: string
  total_deposit_amount: string
  total_bet_amount: string
  total_deposit_days: string
  total_deposit_times: string
  /** 有效会员标准: 1 满足全部 2 满足任意一项 */
  condition_type: string
  /** 奖励样式 1:开红包 2:开宝箱 3 金色宝箱 4:进度条 */
  bonus_tpl: '1' | '2' | '3' | '4'
  /** 显示金额 1:显示 2:不显示 */
  show_amount: '1' | '2'
  /** 奖金方式 1:固定金额 2:累计日结 */
  bonus_type: '1' | '2'
  /** 活动开始时间 */
  start_at: number
  /** 活动结束时间 */
  end_at: number
  /** 展示开始时间 */
  display_start_at: number
  /** 展示结束时间 */
  display_end_at: number
  link_url: string
  /** banner图 */
  image: string
  /** 1: 自动派发 2:手动领取 */
  automatic: '1' | '2'
  currency_id: CurrencyCode
  /** 1: textArea 2:富文本 */
  rule_type: 1 | 2
  state: number | string
  /** 是否支持当前请求的货币 */
  sup: boolean
  /** 语言string[] */
  lang: string
  /** 活动名称 多语言obj */
  name: string
}

/**
 * 邀请活动有效人数数据
 */
export interface IPromotionInviteValidMemberData {
  /** 有效推广人数 */
  valid_member_count: number
  /** 已领取的人数 */
  received_member_count: number
  /** 可领取的金额 */
  bonus_amount: string
  record: {
    /** 发放梯级，从1开始 */
    lvl: number
    /** 状态 1:待审核 2:已审核 3:已发放(领取) 4:待领取 5:拒绝 */
    state: number
    /** 发放奖金 */
    bonus_amount: string
    /** 原始发放奖金 */
    from_bonus_amount: string
    currency_id: string
  }[]
}

export interface MiniGameSeedDetail {
  active_casino_bets: Array<{
    bet_amount: string
    created_at: number
    currency_id: CurrencyCode
    game_id: string
    game_name: string
    order_id: string
    uid: string
    username: string
  }>
  active_client_seed: string
  active_server_seed_hash: string
  next_server_seed_hash: string
  nonce: number
}
export interface virAddreesQrcode {
  virDepositAddrees: string
  virDepositRatio: string
  virDepositMin: string
  currency: string
}

export interface paymentBankInfo {
  id: string
  amount: string
  bankcard: {
    id: string
    open_name: string
    bank_id: string
    bank_account: string
    level: string
    client_type: string
    state: number
    bank_area_cpf: string
  }
}
export interface DollarWavesDataDetail {
  /** 模版 1 2 */
  // tpl: 1 | 2
  /** 活动展示状态 1 展示 */
  display: number | string
  /** 活动状态 1开启 2关闭 3未开启 */
  state: string | number
  // tongue: Array<string>
  lang: Array<string>
  name: {
    [k: string]: string
  }
  rule_type: number | string
  count: {
    [k: string]: number
  }
  conf: {
    [k: string]: any
  }
  /** 红包掉落样式 1 红包 2 金钱 */
  drop?: string | number
  claim_Limit?: string
  single_match_limit?: string
  multiple: number
  timezone: TIMEZONEABBR
  // conf?: {
  //   [ck: string]: {
  //     cond?: {
  //     }
  //     config?: {
  //       // claimLimit: string
  //       // countdown: number
  //     }
  //     /** 红包掉落样式 1 红包 2 金钱 */
  //     // drop?: string | number
  //   }
  // }
  /** 红包场次时间段 */
  cycle?: Array<Array<number>>
  // date: {
  //   base: string[]
  //   custom: string[]
  //   monthly: Array<string | number>
  //   weekly: {
  //     monday: boolean
  //     tuesday: boolean
  //     wednesday: boolean
  //     thursday: boolean
  //     friday: boolean
  //     saturday: boolean
  //     sunday: boolean
  //   }
  // }
  // limit: {
  //   bonus: string | number
  //   daily: string | number
  //   dailybonus: string | number
  // }
  // period: Array<string>
  display_time: {
    s: string
    e: string
  }
  detail: {
    original: string
    [k: string]: string
  }
  buttonText: {
    [k: string]: string
  }
  button: {
    /** 是否显示底部按钮 1 显示 2 不显示 */
    button: number
    /** 自定义情况 跳转链接 */
    redirect: string
    /** 跳转类型 1 自定义 2 娱乐城 3 体育 4 优惠活动 5 联盟中心 其他值不处理 */
    button_type: string | number
    text: {
      [k: string]: string
    }
  }
  img: {
    [k: string]: string
  }
  /** 模版2 配置 */
  // config: Array<{
  //   cond: string
  //   max: string
  //   min: string
  //   scale: string
  //   scope: string[]
  // }>
}
export interface CategoryItem {
  id: string
  lang: string
  name: string
  sorting: number
  updated_at: number
  updated_name: string
  updated_uid: string
}
export interface ActivityItem {
  id: string
  name: string
  ty: number
  category: string
  group: number
  group_detail: string
  start_at: number
  start_at_tz: string
  end_at: number
  updated_at: number
  display_start_at: number
  display_end_at_tz: string
  end_at_tz: string
  display_end_at: number
  display?: number
  /** 展示方式 1:内置页面 2:跳转外部链接 */
  display_type: '1' | '2'
  state: number
  client_type: string
  apply_conditions: string
  shortcut: number
  shortcut_detail: string
  multiple: number
  recommend: number
  apply_limit: number
  period: number
  currency_id: number
  images: string
  summary: string
  detail: string
  button: number
  button_text: string
  button_redirect: string
  button_type: number
  config: string
  created_uid: string
  created_name: string
  updated_uid: string
  updated_name: string
  langs?: string[]
  display_mode: 0 | 1 | 2 | 3 // display_mode  0全部 1仅登录显示 2仅显示横幅 3全部关闭
}
export interface RechargeActivity {
  reg_time: string
  time_zone: string
  promo_cur: CurrencyCode
  first_time: number
  first_amount: number
  last_time: number
  last_amount: number
  cumulative_amount: number
  cur_time: string
  cashback_info: string
  task_id: string
  state: number // 0(待获取资格)，1(待领取)，2(已领取)，3(没有资格)，4（待审核），5（重新提交）6 可领取但未到领奖时间 30 前首充用户注册的帐户ip不能参与首充活动
  activity_state: number // 10 活动结束  11 活动未开始 12 活动已结束但还展示
  promo_info: {
    button_type: number // 跳转类型 1-自定义 2-娱乐城 3-体育 4-优惠活动 5-联盟中心
    s: string
    e: string
    detail: string
    button: number // 按钮状态 1显示 2不显示
    rule_type: number // 规则说明  1 固定模版 2 自定义模版
    images: string
    state: number //
    display: number
    tongue: string
    text: string
    redirect: string
    config: {
      firstDepositPop: number
      appearLocation: number
      cond: number
      currency: CurrencyCode
      period: {
        flag: number // 账户首充 0不限制 1注册时间内存款 累计充值 1每日循环(00:00重置) 2每周循环(00:00重置) 3每月循环(00:00重置)
        days: number[]
        val: number
        ty: number
      }
      bonus: number
      tongue: {
        [key: number]: {
          deposit: string
          scale: string
          limit: string
          min: string
          max: string
        }[]
      }
    }
    names: string
  }
}

export interface PromoMineDetail {
  cond: string[]
  images: string
  summary: string
  detail: string
  currency_id: string
  day_claim: string
  count_down_start: number
  count_down_end: number
  start_time: number
  end_time: number
  state: number
  rule_type: number
  button: number
  button_type: number
  button_text: string
  button_redirect: string
  len: string
  rewardType: string
  gameName: string
  hour_claim_state: number
  cur_time: string
}

export interface PromoMineClaim {
  task_id: string
  state: number
  message: string
}

export interface PromoMineClaimList {
  d: PromoMineClaimListD[]
  t: number
  s: number
  sum_amount: string
}

export interface PromoMineClaimListD {
  id: string
  pid: string
  uid: string
  time: string
  currency_id: string
  amount: string
  created_at: number
}

export interface FixedRechargeActivity {
  BormLastId: number
  apply_condition: string
  apply_conditions: null
  apply_limit: number
  apply_period: number
  automatic: number
  button: number
  button_redirect: string
  button_text: string
  button_type: number
  category: string
  categorys: null
  client_type: string
  client_types: null
  close_type: number
  config: string
  created_at: number
  created_name: string
  created_uid: string
  currency_id: CurrencyCode
  currencys: CurrencyCode[]
  detail: string
  detail_image: number
  display: number
  display_end_at: number
  display_end_at_tz: string
  display_start_at: number
  display_start_at_tz: string
  display_type: string
  en_name: string
  end_at: number
  end_at_tz: string
  group: number
  group_detail: string
  hi_name: string
  id: string
  images: string
  lang: string
  langs: null
  last_claim_time: number
  multiple: string
  name: string
  period: number // 0不支持该币种，1支持
  pop: string
  pt_name: string
  recommend: number
  rule_type: number
  shortcut: number
  shortcut_client: string
  shortcut_clients: null
  shortcut_detail: string
  shortcut_details: null
  sorting: number
  start_at: number
  start_at_tz: string
  state: number // 开启状态 1开启 2关闭 3未开启
  summary: string
  th_name: string
  timezone: string
  ty: number
  updated_at: number
  updated_name: string
  updated_uid: string
  vn_name: string
  withdraw_type: number
  zh_name: string
}
export interface WalletPaymentDepositActivity {
  BormLastId: number
  id: string
  timezone: string
  name: string
  en_name: string
  pt_name: string
  vn_name: string
  th_name: string
  zh_name: string
  hi_name: string
  ty: number
  category: string
  categorys: null
  group: number
  group_detail: string
  display: number
  display_start_at: number
  display_end_at: number
  display_start_at_tz: string
  display_end_at_tz: string
  state: number
  close_type: number
  start_at: number
  end_at: number
  start_at_tz: string
  end_at_tz: string
  client_type: string
  client_types: null
  apply_condition: string
  apply_conditions: null
  shortcut: number
  shortcut_client: string
  shortcut_clients: null
  shortcut_detail: string
  shortcut_details: null
  multiple: string
  recommend: number
  apply_limit: number
  period: number
  apply_period: number
  currency_id: CurrencyCode
  currencys: CurrencyCode[]
  lang: string
  langs: null
  automatic: number
  withdraw_type: number
  pop: string
  sorting: number
  images: string
  summary: string
  rule_type: number
  detail: string
  button: number
  button_type: number
  button_text: string
  button_redirect: string
  detail_image: number
  config: string
  display_type: string
  created_at: number
  created_uid: string
  created_name: string
  updated_at: number
  updated_uid: string
  updated_name: string
  en_sort: number
  pt_sort: number
  vn_sort: number
  th_sort: number
  zh_sort: number
  hi_sort: number
  last_claim_time: number
}
export interface LoginWalletPaymentDepositActivity {
  claim_amount: string
  deposit_amount: string
  cond_deposit_amount: string
  recent_deposit_at: string
  recent_deposit_amount: string
  claim_time: string
  count_start_at: string
  count_end_at: string
  cur: CurrencyCode
  wait_claim: number
  state: number // state=1可领取，5未达到条件 ---只有这2个状态
  wallet:
  {
    id: string
    name: string
  }[]
  contract:
  {
    [key: string]: {
      id: string
      currency_id: string
      value: string
      label: string
    }[]
  }
}

export interface LoginFixedRechargeActivity {
  claim_amount: string
  deposit_amount: string
  cond_deposit_amount: string
  bet_amount: string
  cond_bet_amount: string
  last_claim_time: number
  fixed_start_at: string
  fixed_end_at: string
  cur: CurrencyCode
  bet_multiple: string
  state: number // 1=满足条件可以领取，2=已过期，3=未满足条件，4，已领取，5：满足条件未到达领取时间 6： 到时间未符合
  conf:
  {
    d: string
    b: string
  }[]

}
export interface DepositStoryRecordList {
  d: { id: string, created_at: number, deposit_amount: string, state: number, currency_id: CurrencyCode }[]
  s: number
  t: number
}
export interface SignRewardDataConfig {
  pid: string
  cond_period: number
  cond_loop: number
  cond_type: number
  cond_base_conf: {
    day: number
    deposit: string
    bet: string
    bonus: string
    state: number
    extra: string
    highlight: number
  }[]
  cond_extra_conf: {
    serial?: any
    jackpot?: any
  }
  cond_extra_serial?: any
  cond_extra_jackpot?: any
  multiple: string
  summary: string
  detail: string
  images: string
  currency_id: string
  count_down_start: number
  count_down_end: number
  start_time: number
  end_time: number
  deposit: string
  bet: string
  bonus_cnt: number
  bonus_amt: string
  display_start_at: number
  display_end_at: number
  close_type: number
  state: number
  fr_currency_id: string
  rule_type: number
  button: number
  button_type: number
  button_text: string
  button_redirect: string
  rule?: any
  platform_range: number
  platform_ids: any[]
  names: string
  timezone: string
  lang: string
}
// 神秘盲盒
export interface MysteryBoxDetail {
  BormLastId: number
  id: string
  timezone: string
  name: string
  en_name: string
  pt_name: string
  vn_name: string
  th_name: string
  zh_name: string
  hi_name: string
  ty: number
  category: number[]
  categorys: any | null
  group: number
  group_detail: string
  display: number
  display_start_at: number
  display_end_at: number
  display_start_at_tz: string
  display_end_at_tz: string
  state: number
  close_type: number
  start_at: number
  end_at: number
  start_at_tz: string
  end_at_tz: string
  client_type: number[]
  client_types: any | null
  apply_condition: string
  apply_conditions: any | null
  shortcut: number
  shortcut_client: number[]
  shortcut_clients: any | null
  shortcut_detail: string[]
  shortcut_details: any | null
  multiple: string
  recommend: number
  apply_limit: number
  period: number
  apply_period: number
  currency_id: string
  currencys: any | null
  lang: string[]
  langs: any | null
  automatic: number
  withdraw_type: number
  pop: string
  sorting: number
  images: string
  summary: { [key: string]: string }
  rule_type: number
  detail: string
  button: number
  button_type: number
  button_text: { [key: string]: string | null }
  button_redirect: string
  detail_image: number
  config: string
  display_type: string
  created_at: number
  created_uid: string
  created_name: string
  updated_at: number
  updated_uid: string
  updated_name: string
  last_claim_time: number
}
export interface MemberAppreciationDetail {
  start_at: string
  end_at: string
  claim_day: string
  activity_name: string
  images: string
  claim_status: string
  max_limit: string
  state: number
  lang: string[]
}

/**
 * 任务列表
 */

export interface TaskList {
  bonus_amount: string
  data: Data[]
}

export interface Data {
  reg_time: string
  task_cur: CurrencyCode
  deposit_amount: string
  task_state: number // 1未开始 2进行中 3已关闭 4删除
  cur_time: string
  platform_name: string
  platform_id: number
  sales_rate: string
  state: number // -1系统错误，0未完成任务，1待领取奖励，2已领取奖励，3注册时间在任务创建时间之前，4一个IP只能参与一次，5一个设备只能参与一次，6当前币种不支持，7vip等级限制参与，8你已领取此类型任务不能参与同类型的任务,9.在验证任务创建前就已经验证完成不能参与验证活动
  maintained?: string
  bonus_amount: number
  valid_bet_amount: number
  coding: number
  icon?: string
  task_info: {
    button_type?: number
    button_redirect?: string
    betting_info: any
    ty: number // 1.注册,2.下载,3.验证,4.存款,5.投注
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

export interface GameDetails {
  id: string
  platform_id: string
  platform_name: string
  name: string
  game_type: string
  zk_online: number
  online: number
  game_id: string
  img: string
  sorting: number
  created_at: number
  rtp: string
  percent: string
  updated_at: string
  is_hot: string
  is_new: string
  is_fav: string
  currencys: EnumCurrencyKey[]
}

/**
 * 跟单数据
 */
export interface ISportsFollowBetList {
  /** 投注金额 */
  a: number
  /** 币种 */
  cur: CurrencyCode
  /** 赔率 */
  ov: string
  /** 最多可赢 */
  mwa: number
  /** 投注时间 */
  bt: number
  /** 注单号 */
  ono: string
  /** 注单状态 */
  os: number
  /** 输赢结算状态 */
  oc: number
  /** 净盈利(输赢多少钱) */
  pa: number
  /** 结算时间 */
  st: number
  /** 投注用户名称 */
  mu: string
  bi: {
    /** 投注类型 id */
    bt: number
    /** 下注类型名称  (胜平负) */
    btn: string
    /** market 1:早盘 2:今日 3:滚球 4:即将开赛 5:即将开赛及滚球 */
    m: number
    /** 球种Id */
    si: number
    /** 球种图片 */
    spic: string
    /** 赛事Id */
    ei: string
    /** 比赛时段 1:全场 2:上半场 3:下半场 */
    pid: number
    /** 赛事类型 */
    et: number
    /** 赔率 */
    ov: string
    /** 球种名称 */
    sn: string
    /** 下注种类id，ex: 大小里面的大=1 小=2 */
    sid: string
    /** 赛果 (100:84) */
    re: string
    hdp: string
    /** 主队名称 */
    htn: string
    /** 主队图片 */
    htpic: string
    /** 客队名称 */
    atn: string
    /** 客队图片 */
    atpic: string
    /** 主队得分 */
    hp: number
    /** 客队得分 */
    ap: number
    /** 地区id */
    pgid: string
    /** 联赛id */
    ci: string
    /** 联赛名称 */
    cn: string
    /** 赛事开始时间 */
    ed: number
    /** Specifiers */
    sp: string
    /** 是否支持重投 1:支持 0:不支持 */
    reb: number
    /** 投注项id，最内层id 大小玩法选择大的投注选项id */
    wid: string
    /** 盘口id， 让球、大小 那层的id */
    mlid: string
    /** 坑位 (当有多个不同分数的让分盘时，各盘口的序号) */
    mll: number
    /** 是否取得串关数量 0:全部 1:只限串关 */
    ic: number
    /** 比分列表 */
    pol: {
      /** 主队比分 */
      1: string
      /** 客队比分 */
      2: string
      9: string
      10: string
      11: string
      12: string
      13: string
      14: string
      19: string
      20: string
    }
  }[]
}

export interface MaintainData {
  maintain: string
  state: string
  content?: string
}

export interface IMemberStationInfoItem {
  id: string
  title: string
  msg: string
  read: boolean
  read_count: number
  created_at: number
  msg_num: number
}
export interface INotificationInfoItem {
  id: string
  type: string
  title: string
  originalTitle?: string
  content: string
  is_read: number
  timestamp: number
  target: string
  target_id: string
  payload: string
}

/**
 * ApiMemberGameLobby
 * 娱乐城lobby接口
 */
export interface IApiMemberGameLobbyRes {
  id: string
  name: string
  icon: string
  navs: {
    /** ty = 1类别， ty = 2场馆 */
    ty: number
    cid: string
    platform_id: string
    name: string
    icon: string
    background: string
    useCloudImg: boolean
  }[]
  litems: {
    /** ty = 1类别， ty = 2场馆 */
    ty: number
    cid: string
    platform_id: string
    name: string
    icon: string
    total: number
    background: string
    games: ICasinoGameItem[]
    /** 一排显示几个 2、3、4，顺序与nav_games对应 */
    item_nums: number[]
    nav_games: ICasinoGameItem[][]
    venue: {
      h5: ICasinoGameItem[][]
      pc: ICasinoGameItem[][]
    }
  }[]
  sidebars: {
    /** ty = 1类别， ty = 2场馆 */
    ty: number
    cid: string
    platform_id: string
    name: string
    icon: string
    background: string
  }[]
  bottoms: {
    /** ty = 1类别， ty = 2场馆 */
    ty: number
    cid: string
    platform_id: string
    name: string
    icon: string
    total: number
    background: string
    games: ICasinoGameItem[]
  }[]
  venues: {
    id: string
    name: string
    icon: string
    total: number
    venue: {
      pc: ICasinoGameItem[][]
      h5: ICasinoGameItem[][]
    }
  }
}
export interface MiniGamePlinko {
  id: string
  active: boolean
  payout_multiplier: string
  amount_multiplier: string
  amount: string
  payout: string
  updated_at: number
  currency: string
  game: string
  uid: string
  name: string
  state: {
    risk: string
    rows: string
    point: string
    index: number
    result: string
    path: string[]
  }
}

enum WORD_COLLECTION_CYCLE {
  WEEK = 1,
  MONTH = 2,
  FOREVER = 3,
  CUSTOMIZE = 4,
}

enum WORD_COLLECT_ROLL_TYPE {
  TICKET = 1,
  LETTER = 2,
  NUMBER = 3,
  COIN = 4,
  EMPTY = 5,
}

export interface ApiWordCollectionRecordRes {
  id: string
  uid: string
  username: string
  parent_uid: string
  pid: string
  create_at: number
  active_start_time: number
  active_end_time: number
  active_cycle: WORD_COLLECTION_CYCLE
  active_cycle_type: number
  lottery_tickets: number
  wordle_tickets: '[{"count": 0, "world": "B"}, {"count": 0, "world": "D"}]'
  single_recharge: string
  recharge_total: '{"count": 0, "sum": 0}'
  total_codings: '{"count": 0, "sum": 0}'
  currency: string
  subordinate_height_single_recharge: string
  subordinate_recharge_total: '{"count": 0, "sum": 0}'
  subordinate_total_coding: '{"count": 0, "sum": 0}'
  last_statistics_time: number
  next_reset_time: number
}

export interface ApiWordCollectionConfigRes {
  conf: {
    award_config: { // 转盘数据
      amount_quantity: number
      roll_type: [WORD_COLLECT_ROLL_TYPE, string?]
      weight: string
    }[]
    award_times: number
    collect_amount: string
    roll_config: {
      roll_amount: string
      roll_quantity: string
      roll_type: WORD_COLLECT_ROLL_TYPE // 奖券1。字母2。数字3 金币4 空奖5
    }[]
    rule_times: number
  }
  currency_id: string
  giftLimit: number
  reset_cycle: WORD_COLLECTION_CYCLE // 1 周，2月， 3无限制，4自定义天数
  reset_cycle_day: number // 自定义天数这里取自定义天数的时间
  multiple: string
  summary: '{"original": "", "zh_CN": ""}'
  detail: '{"zh_CN": "收集 \\"A\\"、\\"1\\"、\\"E\\"，每收集一套即可兑换一次 200 CNY$$currency$$ 的奖励。\\n    "}'
}
