export type StatisticsType = 'google' | 'facebook' | 'tiktok' | 'kwai'

/**
 * 埋点自定义事件
 */
export enum CustomStatisticsEvent {
  /** 购物（注册） */
  REGISTER = 'register',
  /** 首充（首次充值） */
  FIRST_CHARGE = 'firstrecharge',
  /** 内容浏览（页面刷新） */
  CONTENT_VIEW = 'contentView',
  /** 付款完成 */
  PAY_COMPLETE = 'payComplete',
  /** 添加到购物车 */
  ADD_TO_CART = 'addToCart',
}

/**
 * kwai 事件不能自定义，需要使用官方提供的
 * @see https://docs.qingque.cn/d/home/eZQCNZ1wBFnEpQEAMmOhfoVwI?identityId=1pTerwwOjbg
 */
export const kwaiMap: Record<CustomStatisticsEvent, string> = {
  [CustomStatisticsEvent.REGISTER]: 'completeRegistration',
  [CustomStatisticsEvent.FIRST_CHARGE]: 'firstDeposit',
  [CustomStatisticsEvent.CONTENT_VIEW]: 'contentView',
  [CustomStatisticsEvent.PAY_COMPLETE]: 'purchase',
  [CustomStatisticsEvent.ADD_TO_CART]: 'addToCart',
}

/**
 * TikTok 使用原生事件
 */
export const tikTokMap: Record<CustomStatisticsEvent, string> = {
  [CustomStatisticsEvent.REGISTER]: 'completeRegistration',
  [CustomStatisticsEvent.FIRST_CHARGE]: 'firstDeposit',
  [CustomStatisticsEvent.CONTENT_VIEW]: 'contentView',
  [CustomStatisticsEvent.PAY_COMPLETE]: 'purchase',
  [CustomStatisticsEvent.ADD_TO_CART]: 'addToCart',
}

/**
 * Facebook 使用原生事件
 */
export const facebookMap: Record<CustomStatisticsEvent, string> = {
  [CustomStatisticsEvent.REGISTER]: 'CompleteRegistration',
  [CustomStatisticsEvent.FIRST_CHARGE]: 'Purchase',
  [CustomStatisticsEvent.CONTENT_VIEW]: 'ViewContent',
  [CustomStatisticsEvent.PAY_COMPLETE]: 'Purchase',
  [CustomStatisticsEvent.ADD_TO_CART]: 'InitiateCheckout',
}
