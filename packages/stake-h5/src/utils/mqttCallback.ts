
/**
 * 刷新余额
 * @description 5秒内只能触发一次
 */
export const refreshBalanceThrottle = throttle(() => {
  appEventBus.emit(EventBusNames.REFRESH_BALANCE_BUS, true)
}, 5 * 1000)

/**
 * 刷新站内信 公告
 * @description 5秒内只能触发一次
 */
export const refreshNoticeThrottle = throttle((ty: string) => {
  appEventBus.emit(EventBusNames.REFRESH_NOTICE_NOTIFY, ty)
}, 5 * 1000)

/**
 * 活动奖金通知
 * @description 1秒内只能触发一次
 */
export const promoNotificationsThrottle = throttle((data: any) => {
  usePromoNotifications(data)
}, 1.2 * 1000, {
  leading: true,
  trailing: false,
})

/**
 * VIP奖金通知
 * @description 1秒内只能触发一次
 */
export const vipBonusNotificationsThrottle = throttle((data: any) => {
  useVipBonusNotifications(data)
}, 1.2 * 1000, {
  leading: true,
  trailing: false,
})

/**
 * 存取款通知
 * @description 1秒内只能触发一次
 */
export const depositWithdrawThrottle = throttle((msg: string) => {
  if (msg.includes('withdraw_in_process') || msg.includes('deposit_in_process'))
    return
  const data = JSON.parse(msg)
  useMemberNotifications(data)

  if (msg.includes('deposit_success'))
    appEventBus.emit(EventBusNames.FINANCE_DEPOSIT_SUCCESS)
}, 1.2 * 1000, {
  leading: true,
  trailing: false,
})

/**
 * 存款pwa
 * @description 1秒内只能触发一次
 */
export const depositPwaNotificationsThrottle = throttle((msg: string) => {
  appEventBus.emit(EventBusNames.DEPOSIT_PWA, msg)
}, 1.2 * 1000, {
  leading: true,
  trailing: false,
})

/**
 * 自我排除 -- 存款限额
 * @description 1秒内只能触发一次
 */
export const depositLimitNotificationsThrottle = throttle((data: any) => {
  useDepositLimitNotifications(data)
}, 1.2 * 1000, {
  leading: true,
  trailing: false,
})


/**
 * 刷新用户信息
 * @description 5秒内只能触发一次
 */
const refreshMemberThrottle = throttle(() => {
  appEventBus.emit(EventBusNames.REFRESH_MEMBER_BUS, true)
}, 5 * 1000)

export interface MqttCallbackParamType { topic: string; message: { origin: string; parsed?: any } }

/** 聊天室 接收消息 */
export function addChatCallback({ topic, message }: MqttCallbackParamType) {
  appEventBus.emit(EventBusNames.CHAT_MESSAGE_BUS, message.parsed)
}

/** 聊天室 删除消息 */
export function delChatCallback({ topic, message }: MqttCallbackParamType) {
  appEventBus.emit(EventBusNames.CHAT_DEL_MESSAGE_BUS, message.origin)
}

/** 聊天室 禁言 */
export function forbidChatCallback({ topic, message }: MqttCallbackParamType) {
  appEventBus.emit(EventBusNames.CHAT_FORBID_MESSAGE_BUS, message.origin)
}

/** 刷新用户余额 */
export function balanceMsgCallback({ topic, message }: MqttCallbackParamType) {
  // 刷新用户余额
  refreshBalanceThrottle()
}

/** 通知消息: 活动 VIP 存取款通知 */
export function notificationMsgCallback({ topic, message }: MqttCallbackParamType) {
  console.error('notifications', message.origin)
  refreshNoticeThrottle(message.origin)
  if (message.parsed && message.parsed.type === 'promo') {
    // 活动
    promoNotificationsThrottle(message.parsed)
  }
  else if (message.parsed && message.parsed.type === 'vip') {
    // VIP
    vipBonusNotificationsThrottle(message.parsed)
  }
  else if (message.parsed && message.parsed.type === 'pwa') {
    // 存款pwa
    depositPwaNotificationsThrottle(message.parsed)
  }
  else if (message.parsed && message.parsed.type === 'limit_balance') {
    // 自我排除 -- 存款限额
    depositLimitNotificationsThrottle(message.parsed)
  }
  else if (message.parsed && message.parsed.type === 'pixel') {
    // 统计
    const obj = JSON.parse(message.parsed.payload)
    const param = {
      amount: obj.deposit_amount,
      currency: getCurrencyConfigByCode(obj.currency_id).name,
      success: 1,
      order_id: obj.order_id,
      uid: obj.uid,

    }
    if (obj.is_first){
      sendMsgToFlutterThirdPartyApp(SendFlutterThirdPartyAppMessage.FIRSTRECHARGE, param)
      appEventBus.emit(EventBusNames.ADJUST, SendFlutterThirdPartyAppMessage.FIRSTRECHARGE)
    }
    else{
      sendMsgToFlutterThirdPartyApp(SendFlutterThirdPartyAppMessage.RECHARGE, param)
      appEventBus.emit(EventBusNames.ADJUST, SendFlutterThirdPartyAppMessage.RECHARGE)
    }

  }
  else {
    // 存取款通知
    depositWithdrawThrottle(message.origin)
  }
}

/** 活动大转盘实时领取通知 */
export function promoCarouselCallback({ topic, message }: MqttCallbackParamType) {
  // 活动大转盘实时领取通知
  appEventBus.emit(EventBusNames.ACTIVE_CAROUSEL_BUS, message.parsed)
}

/** 活动大转盘实时金额&状态 */
export function promoTurntableCallback({ topic, message }: MqttCallbackParamType) {
  appEventBus.emit(EventBusNames.PROMO_TURNTABLE_BUS, message.origin)
}

/** 所有投注，风云榜通知 */
export function memberBetCallback({ topic, message }: MqttCallbackParamType) {
  appEventBus.emit(EventBusNames.REFRESH_BET_BUS, message.parsed)
}

/** 用户相关消息 */
export function memberCallback({ topic, message }: MqttCallbackParamType) {
  // 刷新用户信息
  refreshMemberThrottle()
  refreshNoticeThrottle(message.origin)
}

/** 品牌设置相关 */
export function memberBrandCallback({ topic, message }: MqttCallbackParamType) {
  memberCallback({ topic, message })
  appEventBus.emit(EventBusNames.BRAND_WEB_REG_CONFIG_CHANGE, message.origin)
}

/** 入款卡/支付方式/支付方法/通道等有变动 */
export function depositFlushCallback({ topic, message }: MqttCallbackParamType) {
  // 入款卡/支付方式/支付方法/通道等有变动
  // appEventBus.emit(EventBusNames.DEPOSIT_CHANGE_FIAT_OR_VIRT, message.origin)
}

/** 虚拟币二维码通知 */
export function depositVirtualCallback({ topic, message }: MqttCallbackParamType) {
  // 虚拟币二维码通知
  appEventBus.emit(EventBusNames.DEPOSIT_CHANGE_VIRT_QRCODE, message.parsed)
}

/** 第三方登录状态推送 */
export function thirdAuthCallback({ topic, message }: MqttCallbackParamType) {
  // 第三方登录状态推送
  appEventBus.emit(EventBusNames.REFRESH_AUTH_BUS, message.parsed)
}

/** 体育数据刷新 */
export function sportDeltaCallback({ topic, message }: MqttCallbackParamType) {
  if (message.parsed) {
    if (message.parsed.v)
      message.parsed.v = JSON.parse(message.parsed.v)
  }
  sportDataChange(message.parsed as any)
}

/** 公共通知: 站内信 station 公告 notice */
export function commonCallback({ topic, message }: MqttCallbackParamType) {
  refreshNoticeThrottle(message.origin)
}

/** crash 游戏通知 */
export function crashCallback({ topic, message }: MqttCallbackParamType) {
  appEventBus.emit(EventBusNames.MINI_CRASH_BUS, message.parsed)
}

/** 首充活动弹窗通知 */
/* export function promoDepositCallback({ topic, message }: MqttCallbackParamType) {
  appEventBus.emit(EventBusNames.PROMO_DEPOSIT_DIALOG, message.parsed)
}

/** 定点充值活动通知 */
export function promoFixedDepositCallback({ topic, message }: MqttCallbackParamType) {
  appEventBus.emit(EventBusNames.PROMO_NOTIFY_REFRESH, message.origin)
  // promo_fixed_start 活动开始
}

/**
 * KYC验证状态通知
 * origin:  Aprovado-成功  Reprovado-不成功
 * parsed:
 * 5秒内只能触发一次
 * */
const KYCVerifySuccessThrottle = throttle(() => {
  appEventBus.emit(EventBusNames.KYC_VERIFY_SUCCESS)
}, 5 * 1000)
export function kycVerifyMsgCallBack({ topic, message }: MqttCallbackParamType) {
  if (message.origin === 'Aprovado')
    KYCVerifySuccessThrottle()
}

/**
 * 脸部识别通知
 * ref_id string 与本地匹配，一致则响应
 * liveness:"Liveness Aprovado"
 * facematch:"Aprovado" Liveness Aprovado
 */
export function kycFacialRecognitionMsgCallBack({ topic, message }: MqttCallbackParamType) {
  console.log('🚸🚸🚸 ~ 脸部识别通知 ~ message:', message)
  if (message.parsed.facematch === 'Aprovado' || message.parsed.facematch === 'Liveness Aprovado')
    appEventBus.emit(EventBusNames.KYC_FACIAL_RECOGNITION_SUCCESS, message.parsed)
}

/**
 * 站点维护状态通知
 * parsed:  state  maintain
 * parsed:
 * */
export function maintainCallBack({ topic, message }: MqttCallbackParamType) {
  appEventBus.emit(EventBusNames.SITE_MAINTAIN, message.parsed)
}
