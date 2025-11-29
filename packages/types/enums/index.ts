/** * 语言枚举 */
export enum EnumLanguage {
  /** * 中文 */
  'zh-CN' = 'zh_CN',
  /** * 葡萄牙语 Portuguese */
  'pt-BR' = 'pt_BR',
  /** * 越南语 Vietnamese */
  'vi-VN' = 'vi_VN',
  /** * 泰语 Thai */
  'th-TH' = 'th_TH',
  /** * 印度 India */
  'hi-IN' = 'hi_IN',
  /** * 英语 */
  'en-US' = 'en_US',
  /** 印尼语 */
  'in-ID' = 'in_ID',
  // /** 韩语 */
  'ko-KR' = 'ko_KR',
  // /** 日语 */
  'ja-JP' = 'ja_JP',
  /** 菲律宾语 */
  'tl-PH' = 'tl_PH',
}

/** * 站点名称枚举 */
export enum EnumSiteName {
  wi6 = 'Win6',
  x02 = '澳门新葡京',
  v03 = x02,
  meibo = 'Meibo',
  btb = 'betbo',
  btf = 'betff',
}

/** 主题枚举 6也是默认 */
export enum EnumsTheme {
  '' = 1,
  'green' = 2,
  'bcgame' = 3,
  'white' = 4,
  'greenblack' = 5,
  'new-default' = 6,
}

/** * 货币枚举 */
export enum EnumCurrency {
  /**
   * @description BRL 巴西雷亚尔
   */
  BRL,

  /**
   * @description CNY 人民币
   */
  CNY,

  /**
   * @description INR 印度卢比
   */
  INR,

  /**
   * @description KVND 越南盾
   */
  KVND,

  /**
   * @description THB 泰铢
   */
  THB,

  /**
   * @description USDT 泰达币
   */
  USDT,

  /**
   * @description BTC 比特币
   */
  BTC,

  /**
   * @description ETH 以太坊
   */
  ETH,

  /**
   * @description BNB 币安币
   */
  BNB,

  /**
   * @description EUR 欧元
   */
  EUR,

  /**
   * @description JPY 日元
   */
  JPY,

  /**
   * @description KRW 韩元
   */
  KRW,

  /**
   * @description IDR 印度尼西亚
   */
  IDR,

  /**
   * @description CAD 加拿大元
   */
  CAD,

  /**
   * @description ARS 阿根廷比索
   */
  ARS,

  /**
   * @description CLP 智利比索
   */
  CLP,

  /**
   * @description PEN 秘鲁索尔
   */
  PEN,

  /**
   * @description MXN 墨西哥比索
   */
  MXN,

  /**
   * @description LTC 莱特币
   */
  LTC,

  /**
   * @description DOGE 狗狗币
   */
  DOGE,

  /**
   * @description BCH 比特币现金
   */
  BCH,

  /**
   * @description XRP 瑞波币
   */
  XRP,

  /**
   * @description EOS 柚子币
   */
  EOS,

  /**
   * @description TRX 波场币
   */
  TRX,

  /**
   * @description USDC 美元稳定币
   */
  USDC,

  /**
   * @description APE 猿猴币
   */
  APE,

  /**
   * @description BUSD 币安美元
   */
  BUSD,

  /**
   * @description CRO 加密.com币
   */
  CRO,

  /**
   * @description DAI 戴稳定币
   */
  DAI,

  /**
   * @description LINK 链接币
   */
  LINK,

  /**
   * @description SAND 沙子币
   */
  SAND,

  /**
   * @description SHIB 柴犬币
   */
  SHIB,

  /**
   * @description UNI 联合币
   */
  UNI,

  /**
   * @description MATIC 多边形币
   */
  MATIC,
  VND,
  PHP,
}

/** * casino游戏排序枚举 */
export enum EnumCasinoSortType {
  /** 名称a-z */
  nameA = 'name:asc',
  /** 名称z-a */
  nameZ = 'name:desc',
  /** 热门 */
  hot = 'hot:asc',
  /** 重点介绍 */
  recommend = 'recommend:asc',
  /** 新游戏 */
  new = 'new:asc',
}

/**
 * 体育下注单状态枚举 (Head)
 */
export enum EnumsBetSlipHeadStatus {
  /** 投注单 */
  betSlip,
  /** 我的投注 */
  myBets,
}

/**
 * 体育下注单状态枚举 (投注单-Tab)
 */
export enum EnumsBetSlipBetSlipTabStatus {
  /** 单项投注 */
  single,
  /** 复式投注 */
  multi,
}

/**
 * 体育下注单状态枚举 (我的投注-Tab)
 */
export enum EnumsBetSlipMyBetsTabStatus {
  /** 活跃 */
  active,
  /** 已结算 */
  settled,
}

/**
 * 投注赔率变化枚举
 */
export enum EnumOddsChange {
  /** 接受任何赔率变化 */
  acceptAnyOddsChange = 2,
  /** 只接受更高的赔率 */
  acceptHigherOdds = 1,
  /** 不接受任何赔率变化 */
  notAcceptAnyOddsChange = 0,
}

/**
 * 所有体育类型枚举
 */
export enum EnumSportType {
  /** 网球 */
  'tennis',
  /** 足球 */
  'soccer',
  /** 美式橄榄球 */
  'american-football',
  /** 篮球 */
  'basketball',
  /** 乒乓球 */
  'table-tennis',
  /** 冰上曲棍球 */
  'ice-hockey',
  /** 棒球 */
  'baseball',
  /** 板球 */
  'cricket',
  /** 电子板球 */
  'ecricket',
  /** 英雄联盟 */
  'league-of-legends',
  /** CS:GO/CS2 */
  'counter-strike',
  /** 综合格斗 */
  'mma',
  /** 英式橄榄球 */
  'rugby',
  /** 传说对决 */
  'arena-of-valor',
  /** 澳洲足球 */
  'aussie-rules',
  /** 羽毛球 */
  'badminton',
  /** 拳击 */
  'boxing',
  /** 飞镖 */
  'darts',
  /** 刀塔2 */
  'dota-2',
  /** FIFA */
  'fifa',
  /** 地板球 */
  'floorball',
  /** 五人制足球 */
  'futsal',
  /** 光环 */
  'halo',
  /** 手球 */
  'handball',
  /** 王者荣耀 */
  'kings-of-glory',
  /** 无尽对决 */
  'mobile-legends',
  /** NBA2K */
  'nba2k',
  /** 彩虹六号 */
  'rainbow-six',
  /** 桌球 */
  'snooker',
  /** 星际争霸2 */
  'starcraft-2',
  /** 星际争霸 I */
  'starcraft-1',
  /** 无畏契约 */
  'valorant',
  /** 排球 */
  'volleyball',
  /** 水球 */
  'waterpolo',
  /** 登山 */
  'alpine-skiing',
  /** 改装车比赛 */
  'stock-car-racing',
  /** 盖尔式板棍球 */
  'gaelic-hurling',
  /** 盖尔式足球 */
  'gaelic-football',
  /** 高尔夫 */
  'golf',
  /** 高山滑雪 */
  'ski-jumping',
  /** 滑雪和射击 */
  'biathlon',
  /** 摩托车竞速 */
  'motorcycle-racing',
  /** 沙滩排球 */
  'beach-volley',
  /** 特技比赛 */
  'politics-entertainment',
  /** 一级方程式 */
  'formula-1',
  /** 越野赛 */
  'cross-country',
  /** 自行车赛 */
  'cycling',
}

/** 体育盘口类型枚举 */
export enum EnumSportMarketType {
  /** 获胜盘 */
  WINNER = 'winner',
  /** 让分盘 */
  HANDICAP = 'handicap',
  /** 总分盘 */
  TOTAL = 'total',
}

/**
 * 体育EndDom枚举
 */
export enum EnumSportEndDomID {
  /** PC样式 购物车的EndDom */
  PC_CART_END_DOM = 'PC_CART_END_DOM',
  /** H5样式 下的EndDom */
  H5_CART_END_DOM = 'H5_CART_END_DOM',
}

/**
 *  活动红利相关的帐变类型
 */
export enum PromoTransactionType {
  /** 会员返水 */
  rebate = 814,
  /** 活动红利 */
  activity = 815,
  /** 人工红利派发 */
  admin_activity = 816,
  /** 存款优惠 */
  deposit_bonus = 817,
  /** vip晋级礼金 */
  vip_upgrade = 818,
  /** vip日红包 */
  vip_day = 819,
  /** vip周红包 */
  vip_week = 820,
  /** vip月红包 */
  vip_monthly = 821,
  /** vip生日礼金 */
  vip_birthday = 822,
}

/**
 * 游戏类型枚举
 */
export enum EnumGlobalGameType {
  /** 真人 */
  casino = '1',
  /** 捕鱼 */
  fish = '2',
  /** 电子 */
  slot = '3',
  /** 体育 */
  sports = '4',
  /** 彩票 */
  lottery = '7',
  /** 原创游戏 */
  original = '8',
}

/**
 * 体育场馆
 */
export enum EnumSportVenue {
  IM = 401,
}

/**
 * 自营彩票
 */
export enum EnumOriginalLotteryVenue {
  originalLottery = '703',
}

/**
 * 自营彩票游戏路径和ID
 */
export const EnumOriginalLotteryID = {
  1002: 'original-lottery-win-go',
  2002: 'original-lottery-racing',
  3002: 'original-lottery-k3',
  4002: 'original-lottery-5d',
  5002: 'original-lottery-trx-win-go',
} as const

export type EnumOriginalLotteryIDKey = keyof typeof EnumOriginalLotteryID

/**
 * 娱乐城Pid-Vid映射
 */
export const EnumCasinoPidToVid: {
  [k: number]: number
} = {
  102: 102,
  303: 102,
  201: 201,
  308: 201,
}

/** 键盘按键 */
export enum KeyboardKeyEnum {
  A = 'KeyA',
  S = 'KeyS',
  D = 'KeyD',
  Q = 'KeyQ',
  W = 'KeyW',
  E = 'KeyE',
  R = 'KeyR',
  T = 'KeyT',
  Y = 'KeyY',
  Key1 = '1',
  Key2 = '2',
  Key3 = '3',
  Key4 = '4',
  SPACE = 'Space',
  ENTER = 'Enter',
}

/** 扑克牌花色枚举 */
export enum PokerColors {
  HEITAO = 'S',
  HONTAO = 'H',
  FANGKUAI = 'D',
  MEIHUA = 'C',
}

/**
 * 跳转类型
 * @param 1-自定义
 * @param 2-娱乐城
 * @param 3-体育
 * @param 4-利息宝
 * @param 5-VIP
 * @param 6-联盟中心
 * @param 7-优惠活动
 * @param 8-在线客服
 * @param 9-存款弹窗
 */
export enum EnumJump {
  /** 自定义 */
  CUSTOM = 1,
  /** 娱乐城 */
  CASINO = 2,
  /** 体育 */
  SPORTS = 3,
  /** 利息宝 */
  SAFE = 4,
  /** VIP */
  VIP = 5,
  /** 联盟中心 */
  ALLIANCE = 6,
  /** 优惠活动 */
  PROMOTION = 7,
  /** 在线客服 */
  SERVICE = 8,
  /** 存款弹窗 */
  DEPOSIT = 9,
  /** VIP 返水 */
  REBATE = 10,
  /** 注册弹窗 */
  REGISTER = 11,
  /** 下载app弹窗 */
  APP = 12,
  /** 设置联系方式 */
  SETTINGS = 13,
  /** 活动详情 */
  PROMOTION_DETAIL = 14,
  /** 活动详情2 内部活动完整地址  */
  PROMOTION_DETAIL_SELF = 15,
}

/** 时区配置 */
export enum TIMEZONE {
  ETC = 'Etc/GMT',
  BRT = 'America/Sao_Paulo',
  CST = 'Asia/Shanghai',
  THAILAND = 'Etc/GMT+7',
  VIETNAM = THAILAND,
  INDIA = 'Etc/GMT-5:30',
  USA = 'Edt/GMT-4',
  /** 印尼 */
  INDONESIA = 'THAILAND',
  /** 韩语 */
  KOREA = 'Etc/GMT+9',
  /** 日本 */
  JAPAN = 'KOREA',
}

/** 时区配置 */
export enum TIMEZONEABBR {
  ETC = 'UTC',
  BRT = 'America/Sao_Paulo',
  CST = 'Asia/Shanghai',
  THAILAND = 'Asia/Bangkok',
  VIETNAM = 'Asia/Ho_Chi_Minh',
  INDIA = 'Asia/Kolkata',
  USA = 'America/New_York',
  INDONESIA = 'Asia/Jakarta',
  KOREA = 'Asia/Seoul',
  JAPAN = 'Asia/Tokyo',
  PHILIPPINES = 'Asia/Manila',
}
export type TimezoneValue = typeof TIMEZONEABBR[keyof typeof TIMEZONEABBR]

/** 时区对应前台展示文案的翻译KEY */
export const TIMEZONE_LABEL_KEY: {
  [k: string]: string
} = {
  [TIMEZONEABBR.ETC]: 'Label_UTC',
  [TIMEZONEABBR.BRT]: 'Label_BRT',
  [TIMEZONEABBR.CST]: 'Label_CST',
  [TIMEZONEABBR.THAILAND]: 'Label_THAILAND',
  [TIMEZONEABBR.VIETNAM]: 'Label_VIETNAM',
  [TIMEZONEABBR.INDIA]: 'Label_INDIA',
  [TIMEZONEABBR.USA]: 'Label_USA',
  [TIMEZONEABBR.INDONESIA]: 'Label_INDONESIA',
  [TIMEZONEABBR.KOREA]: 'Label_KOREA',
  [TIMEZONEABBR.JAPAN]: 'Label_JAPAN',
  [TIMEZONEABBR.PHILIPPINES]: 'Label_PHILIPPINES',
}

/**
 * 活动类型
 */
export enum EnumPromoTy {
  /** 轮盘 */
  LUNPAN = 1,
  /** 推广 */
  TUIGUANG = 2,
  /** 抢红包 */
  HONGBAO = 3,
  /** 负盈利 */
  FUYINGLI = 4,
  /** 自定义 */
  ZIDINGYI = 5,
}

/** 1=叫牌 2=停牌 3=分牌 4=加倍 5=买保险 6=不买保险 7=查询订单 8=创建订单 */
export enum BlackJackActionType {
  CALL = 1,
  STOP,
  SPLIT,
  MULTIPLE,
  INSURANCE,
  NO_INSURANCE,
  QUERY_ORDER,
  CREATE_ORDER,
}

const suit = [PokerColors.FANGKUAI, PokerColors.HONTAO, PokerColors.HEITAO, PokerColors.MEIHUA]
export const PokerArray = Array.from({ length: 9 }).fill(0, 0).map((i, idx) => `${idx + 2}`).concat(['J', 'Q', 'K', 'A']).map(i => Array.from({ length: 4 }).fill(i, 0)).flat().map((i, idx) => ({ rank: i, suit: suit[idx % 4] }))

export enum FlutterAppQuery {
  /** 1 是flutterApp */
  isFlutterApp = '1',
}

export enum SendFlutterAppMessage {
  /** 打开游戏公平性 */
  PROVABLY_FAIR_OVERVIEW = 'provably-fair/overview',
  /** 打开游戏 */
  OPEN_GAME = 'open-game',
  /** 打开游戏计算细目 */
  PROVABLY_FAIR_CALCULATION = 'provably-fair/calculation',
  /** 登录弹窗 */
  DIALOG_LOGIN = 'dialog_login',
  /** 注册弹窗 */
  DIALOG_REGISTER = 'dialog_register',
  /** 娱乐城首页 */
  CASINO_HOME = 'casino_home',
  /** 体育首页 */
  SPORTS_HOME = 'sports_home',
  /** 利息宝 */
  SAFE_VAULT = 'safe_vault',
  /** 个人中心 - vip */
  USER_VIP = 'user_vip',
  /** 联盟计划 */
  USER_AFFILIATE = 'user_affiliate',
  /** 活动列表 */
  ALL_PROMOTION = 'all_promotion',
  /** 客服 */
  OPEN_SERVICE = 'open_service',
  /** 刷新余额 */
  REFRESH_BALANCE = 'refresh_balance',
  /** 分享到社交平台 */
  PUBLIC_SHARE = 'public_share',
  /** 打开红包雨 */
  OPEN_DOLLAR_RAIN_MODAL = 'open_dollar_rain_modal',
  /** 打开红包雨结果弹窗 */
  OPEN_DOLLAR_RAIN_RESULT_MODAL = 'open_dollar_rain_result_modal',
  /** 打开负盈利活动 */
  OPEN_BACK_CASH_MODAL = 'open_back_cash_modal',
  /** 打开存款弹窗 */
  OPEN_DEPOSIT_MODAL = 'open_deposit_modal',
  /** 个人中心 - vip 返水 */
  USER_REBATE = 'user_rebate',
  /** 接口返回False */
  API_FALSE = 'api_false',
  /** 个人中心 - 联系方式 */
  USER_SETTINGS = 'user_settings',
  /** 活动 普通提示 */
  PROMO_NORMAL_TIPS = 'promo_normal_tips',
  /** 活动 未达条件提示 */
  PROMO_NORMAL_TIPS_1 = 'promo_normal_tips_1',
  /** 签到活动 领取成功 */
  SIGN_RECEIVE_AWARD = 'sign_receive_award',
  /** 返回 */
  CLOSE_WINDOW = 'close_window',
  /** 登录 */
  APP_LOGIN = 'app_login',
  /** 切换货币 */
  CURRENCY_CHANGE = 'currency_change',

}
// 给三方app发消息
export enum SendFlutterThirdPartyAppMessage {
  /** 登录 */
  LOGIN = 'login',
  /** 登出 */
  LOGOUT = 'logout',
  /** 点击注册 */
  REGISTERCLICK = 'registerClick',
  /** 注册成功 */
  REGISTERSUCCESS = 'register',
  /** 点击充值 */
  RECHARGECLICK = 'rechargeClick',
  /** 首充成功 */
  FIRSTRECHARGE = 'firstrecharge',
  /** 复充成功 */
  RECHARGE = 'recharge',
  /** 进入游戏 */
  ENTERGAME = 'enterGame',

}

/** app 给 h5 发消息 */
export enum ReceiveFlutterAppMessage {
  /** 切换币种 */
  CURRENCY_CHANGE = 'currency_change',
  /** 红包雨活动刷新h5领取状态 */
  PROMO_RED_REFRESH_CLAIMED = 'promo_red_refresh_claimed',
}

export enum EnumLy {
  /** 一分时时彩 */
  YFSSC = 'YFSSC',
}

/** 后台返水支持的货币 */
export const supportedCur = ['701', '702', '703', '704', '705', '706', '710', '711', '735']

// 取款方法
export enum WithdrawMethod {
  BANK = 1,
  ALIPAY,
  WALLET,
}

export type EnumLanguageKeys = keyof typeof EnumLanguage
export type EnumLanguageValues = typeof EnumLanguage[EnumLanguageKeys]
