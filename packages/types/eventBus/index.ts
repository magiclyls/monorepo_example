import type { EnumLanguageKeys } from '../enums'

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
  /** 重新渲染程序 */
  APP_RELOAD,
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
  /** 登录实效 */
  TOKEN,
  /** 体育向应用发送路由跳转 */
  SPORTS_TO_MAIN_PAGE_ROUTE,
  /** 接口错误消息 */
  API_ERROR_MESSAGE,
  /** 活动奖金通知 */
  PROMO_BONUS_NOTIFICATION,
  /** cp-win-go */
  LOTTERY_WIN_GO,
  /** cp-race */
  LOTTERY_RACE,
  /** cp-5D */
  LOTTERY_5D,
  /** K3 */
  LOTTERY_K3,
  LOTTERY_K3_HISTORY,
  /** cp-trx-win-go */
  TRX_WIN_GO,
  /** 项目外需要触发Message事件 */
  APP_GLOBAL_MESSAGE,
  /** 彩票向应用发送路由跳转 */
  LOTTERY_TO_MAIN_PAGE_ROUTE,
  /** 全局的页面visibility事件 */
  APP_GLOBAL_VISIBILITY,
  /** 彩票输赢通知 */
  LOTTERY_SETTLE_DIALOG,
  /** 充值Pwa弹窗 */
  DEPOSIT_PWA,
  /** VIP奖金 */
  VIP_BONUS_NOTIFICATIONS,
  /** Adjust统计 */
  ADJUST,
  /** 自我排除 -- 存款限额 */
  DEPOSIT_LIMIT,
  /** 自我排除 -- 暂停投注 */
  SUSPEND_BETTING,
}

/**
 * 定义事件名称与参数类型的映射
 */
export interface EventBusMap {
  [EventBusNames.CHAT_MESSAGE_BUS]: any
  [EventBusNames.CHAT_DEL_MESSAGE_BUS]: any
  [EventBusNames.CHAT_FORBID_MESSAGE_BUS]: any
  [EventBusNames.MQTT_CONNECT_SUCCESS_BUS]: any
  [EventBusNames.MQTT_DISCONNECT_BUS]: any
  [EventBusNames.REFRESH_BALANCE_BUS]: any
  [EventBusNames.FEEDBACK_CHAT_MESSAGE_BUS]: any
  [EventBusNames.REFRESH_MEMBER_BUS]: any
  [EventBusNames.REFRESH_AUTH_BUS]: any
  [EventBusNames.SPORTS_DATA_CHANGE_BUS]: any
  [EventBusNames.SPORTS_LIST_TO_CART_BUS]: any
  [EventBusNames.SPORTS_CART_TO_LIST_BUS]: any
  [EventBusNames.SPORTS_LIST_COUNTDOWN_BUS]: any
  [EventBusNames.SPORTS_LOBBY_RESET]: any
  [EventBusNames.CASINO_LOBBY_RESET]: any
  [EventBusNames.SPORTS_BETTING_TO_BETSLIP_BUS]: any
  [EventBusNames.SPORTS_TO_CART_BUS]: any
  [EventBusNames.CART_TO_SPORTS_BUS]: any
  [EventBusNames.ACTIVE_CAROUSEL_BUS]: any
  [EventBusNames.PROMO_TURNTABLE_BUS]: any
  [EventBusNames.REFRESH_BET_BUS]: any
  [EventBusNames.STATISTICS_BUS]: any
  [EventBusNames.REFRESH_NOTICE_NOTIFY]: any
  [EventBusNames.MINI_CRASH_BUS]: any
  [EventBusNames.BRAND_WEB_REG_CONFIG_CHANGE]: string
  [EventBusNames.DEPOSIT_CHANGE_FIAT_OR_VIRT]: string
  [EventBusNames.DEPOSIT_CHANGE_VIRT_QRCODE]: any
  [EventBusNames.RECEIVE_FLUTTER_APP_MSG]: any
  [EventBusNames.USER_CLAIMED_DOLLAR_BONUS]: any
  [EventBusNames.USER_GETBONUS_RESULT]: any
  [EventBusNames.PROMO_NOTIFY_REFRESH]: any
  [EventBusNames.PROMO_REDRAIN_BONUSDIALOG_CLOSE]: any
  [EventBusNames.PROMO_DEPOSIT_DIALOG]: any
  [EventBusNames.GET_TIIMEREBATE_SUCCESS]: any
  [EventBusNames.USER_REFRESH_RED_CLAIMED]: any
  [EventBusNames.APP_RELOAD]: EnumLanguageKeys
  [EventBusNames.KYC_VERIFY_SUCCESS]: any
  [EventBusNames.NEED_LOGiN_MSG]: any
  [EventBusNames.FINANCE_DEPOSIT_SUCCESS]: any
  [EventBusNames.LOTTERY_WIN_GO]: any
  [EventBusNames.LOTTERY_RACE]: any
  [EventBusNames.LOTTERY_5D]: any
  [EventBusNames.LOTTERY_K3]: any
  [EventBusNames.LOTTERY_K3_HISTORY]: any
  [EventBusNames.KYC_FACIAL_RECOGNITION_SUCCESS]: any
  [EventBusNames.SITE_MAINTAIN]: any
  [EventBusNames.TOKEN]: any
  [EventBusNames.SPORTS_TO_MAIN_PAGE_ROUTE]: any
  [EventBusNames.API_ERROR_MESSAGE]: any
  [EventBusNames.PROMO_BONUS_NOTIFICATION]: any
  [EventBusNames.APP_GLOBAL_MESSAGE]: any
  [EventBusNames.LOTTERY_TO_MAIN_PAGE_ROUTE]: any
  [EventBusNames.APP_GLOBAL_VISIBILITY]: any
  [EventBusNames.TRX_WIN_GO]: any
  [EventBusNames.LOTTERY_SETTLE_DIALOG]: any
  [EventBusNames.DEPOSIT_PWA]: any
  [EventBusNames.VIP_BONUS_NOTIFICATIONS]: any
  [EventBusNames.ADJUST]: any
  [EventBusNames.DEPOSIT_LIMIT]: any
  [EventBusNames.SUSPEND_BETTING]: any
  resize: { width: number, height: number }
}

/** 体育向应用发送路由跳转的路由列表 */
export enum ESportsToMainPageRoutes {
  /** 登录 */
  LOGIN,
  /** 注册 */
  REGISTER,
  /** 体育投注记录 */
  MY_BET,
  /** 体育首页 */
  SPORTS_HOME,
  /** 体育详情页 */
  FIXTURE,
  /** 体育球种 */
  SPORT,
  /** 体育地区 */
  REGION,
  /** 体育联赛 */
  LEAGUE,
  /** 冠军详情页面 */
  OUTRIGHT,
  /** KYC 打开KYC弹窗 */
  KYC,
}

export type EventHandler<T = any> = (arg: T) => void
