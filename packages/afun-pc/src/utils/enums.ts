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
  /** 测试语言 */
  'aa-AA' = 'aa_AA',
  /** 印尼语 */
  'in-ID' = 'in_ID',
  /** 韩语 */
  'ko-KR' = 'ko_KR',
  /** 日语 */
  'ja-JP' = 'ja_JP',
  /** 菲语 */
  'tl-PH' = 'tl_PH',
}

/** * 站点名称枚举 */
export enum EnumSiteName {
  'wi6' = 'Win6',
  'x02' = '澳门新葡京',
  'v03' = x02,
  'meibo' = 'Meibo',
  'btb' = 'betbo',
  'btf' = 'betff',
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
  PHP
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
  'rebate' = 814,
  /** 活动红利 */
  'activity' = 815,
  /** 人工红利派发 */
  'admin_activity' = 816,
  /** 存款优惠 */
  'deposit_bonus' = 817,
  /** vip晋级礼金 */
  'vip_upgrade' = 818,
  /** vip日红包 */
  'vip_day' = 819,
  /** vip周红包 */
  'vip_week' = 820,
  /** vip月红包 */
  'vip_monthly' = 821,
  /** vip生日礼金 */
  'vip_birthday' = 822,
}

/**
 * 游戏类型枚举
 */
export enum EnumGlobalGameType {
  /** 真人 */
  'casino' = '1',
  /** 捕鱼 */
  'fish' = '2',
  /** 电子 */
  'slot' = '3',
  /** 体育 */
  'sports' = '4',
  /** 原创游戏 */
  'original' = '8',
}

/**
 * 体育场馆
 */
export enum EnumSportVenue {
  IM = 401,
}

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
  ETC = 'Etc/GMT',
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
export const TIMEZONE_LABEL_KEY = {
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

export enum EventBusNames {
  /** 聊天室消息 通知 */
  CHAT_MESSAGE_BUS,
  /** 聊天室消息 删除 */
  CHAT_DEL_MESSAGE_BUS,
  /** 聊天室禁言 */
  CHAT_FORBID_MESSAGE_BUS,
  /** MQTT 连接成功 通知 */
  MQTT_CONNECT_SUCCESS_BUS,
  /** MQTT 断开连接 通知 */
  MQTT_DISCONNECT_BUS,
  /** 刷新余额通知 */
  REFRESH_BALANCE_BUS,
  /** 反馈对话消息通知 */
  FEEDBACK_CHAT_MESSAGE_BUS,
  /** 刷新用户信息通知 */
  REFRESH_MEMBER_BUS,
  /** 第三方登录状态通知 */
  REFRESH_AUTH_BUS,
  /** 体育数据变化通知 */
  SPORTS_DATA_CHANGE_BUS,
  /** 体育列表向购物车通知 */
  SPORTS_LIST_TO_CART_BUS,
  /** 体育购物车向列表通知 */
  SPORTS_CART_TO_LIST_BUS,
  /** 体育列表倒计时，用来刷新页面上的时间 */
  SPORTS_LIST_COUNTDOWN_BUS,
  /** 路由回到体育首页时通知tab返回到大厅 */
  SPORTS_LOBBY_RESET,
  /** 路由回到娱乐城首页时通知tab返回到大厅 */
  CASINO_LOBBY_RESET,
  /** 右侧体育投注单向投注页面通知 */
  SPORTS_BETTING_TO_BETSLIP_BUS,
  /** 体育列表，详情等 向 购物车发送通知 */
  SPORTS_TO_CART_BUS,
  /** 体育购物车向列表，详情等发送通知 */
  CART_TO_SPORTS_BUS,
  /** 活动大转盘实时领取数据 */
  ACTIVE_CAROUSEL_BUS,
  /** 活动大转盘实时金额&状态 */
  PROMO_TURNTABLE_BUS,
  /** 所有投注，风云榜消息通知 */
  REFRESH_BET_BUS,
  /** 数据埋点通知，如果url有埋点数据，或者接口返回埋点数据，本地埋点成功，就通知 */
  STATISTICS_BUS,
  /** 收到通知，消息中心需要刷新数据 */
  REFRESH_NOTICE_NOTIFY,
  /** Crash 游戏订阅 */
  MINI_CRASH_BUS,
  /** 商户后台-系统管理-品牌设置-注册设置Web注册配置修改通知 */
  BRAND_WEB_REG_CONFIG_CHANGE,
  /** 钱包存款功能-自动切换法币和虚拟币 */
  DEPOSIT_CHANGE_FIAT_OR_VIRT,
  /** 钱包存款功能-虚拟币二维码 */
  DEPOSIT_CHANGE_VIRT_QRCODE,
  RECEIVE_FLUTTER_APP_MSG,
  /** 用户领取成功红包 */
  USER_CLAIMED_DOLLAR_BONUS,
  /** 用户在红包雨场景抢红包成功 */
  USER_GETBONUS_RESULT,
  /** 活动通知，刷新活动页详情 */
  PROMO_NOTIFY_REFRESH,
  /** 红包雨领取结果弹窗关闭 */
  PROMO_REDRAIN_BONUSDIALOG_CLOSE,
  /** 首充活动弹窗显示消息 */
  PROMO_DEPOSIT_DIALOG,
  /** 领取实时返水成功 */
  GET_TIIMEREBATE_SUCCESS,
  /** 刷新用户领取结果 */
  USER_REFRESH_RED_CLAIMED,
  /** KYC验证成功 */
  KYC_VERIFY_SUCCESS,
  /** 打开登录弹窗 */
  NEED_LOGiN_MSG,
  /** 存款成功 */
  FINANCE_DEPOSIT_SUCCESS,
  /** 脸部识别成功 */
  KYC_FACIAL_RECOGNITION_SUCCESS,
  /** 站点维护 */
  SITE_MAINTAIN,
  /** ADJUST统计 */
  ADJUST,
  /** 存款pwa */
  DEPOSIT_PWA,
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
export const PokerArray = Array(9).fill(0, 0)
  .map((i, idx) => `${idx + 2}`).concat(['J', 'Q', 'K', 'A']).map(i => Array(4).fill(i, 0))
  .flat().map((i, idx) => ({ rank: i, suit: suit[idx % 4] }))

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
  /** 个人中心 - 联系方式 */
  USER_SETTINGS = 'user_settings',
  /** 活动 普通提示 */
  PROMO_NORMAL_TIPS = 'promo_normal_tips',
  /** 活动 未达条件提示 */
  PROMO_NORMAL_TIPS_1 = 'promo_normal_tips_1',
  /** 签到活动 领取成功 */
  SIGN_RECEIVE_AWARD = 'sign_receive_award',
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

// export const MqttSubEvents = {
// 'balance': `${VITE_SOCKET_PREFIX}/balance/`,
// 'member': `${VITE_SOCKET_PREFIX}/member/`,
// 'member/notifications': `${VITE_SOCKET_PREFIX}/member/notifications/`,
// 'member/bet': `${VITE_SOCKET_PREFIX}/member/bet/`,
// 'member/brand/detail': `${VITE_SOCKET_PREFIX}/member/brand/detail`,
// 'auth': `${VITE_SOCKET_PREFIX}/auth/`,
// 'chat': `${VITE_SOCKET_PREFIX}/chat/`,
// 'chat/del': `${VITE_SOCKET_PREFIX}/chat/del`,
// 'chat/forbid': `${VITE_SOCKET_PREFIX}/chat/forbid`,
// 'deposit/flush': `${VITE_SOCKET_PREFIX}/deposit/flush`,
// 'deposit/virtual': `${VITE_SOCKET_PREFIX}/deposit/virtual`,
// 'games/crash/pub': 'games/crash/pub',
// 'games/crash': `games/crash/${VITE_SOCKET_PREFIX}`,
// 'common': `${VITE_SOCKET_PREFIX}/common`,
// 'member/active/carousel': `${VITE_SOCKET_PREFIX}/member/active/carousel`,
// 'promo/turntable': `${VITE_SOCKET_PREFIX}/promo/turntable/`,
// 'sport/delta': 'sport/delta/',
// }
// export type MqttSubEventsKeys = keyof typeof MqttSubEvents

/** 后台返水支持的货币 */
export const supportedCur = ['701', '702', '703', '704', '705', '706', '710', '711']
