import type { Component } from 'vue'

export type notifyType =
'set' | 'user' | 'email' | 'error' | 'success' | 'insurance' | 'statistics' | 'phone' | 'wallet' | 'auto' | 'info' | 'chat'

export interface MenuItem {
  title?: string
  tailTitle?: string
  icon?: any
  path?: string
  expand?: boolean
  label?: string
  hot?: boolean
  fullPath?: string
  children?: Menu
  domId?: string
  token?: boolean
  className?: string
  modalQuery?: { [k: string]: any }
  type?: 'sheet'
  sheetTitle?: string
  value?: any
  change?: (val: any) => void
  fixtureCount?: number
  /** 有path，不会执行 */
  callBack?: () => void
  useCloudImg?: boolean
  separate?: boolean
  sptToken?: boolean
  /** 活动菜单加的方法，比path优先，不会触发path */
  backFun?: () => void
  accordHeadClick?: () => void
  promo_id?: string
  hideArrow?: boolean
  isOdds?: boolean
  noneImageReplace?: boolean
  list?: MenuItem[]
}

export type Menu = Array<MenuItem>

export interface ISelectOptionNumber {
  label: string
  value: number
}

export interface IComponentsList {
  [t: string]: Component
}

export interface ISelectOption {
  label: string
  value: string | number
  bonus?: string
}

export interface ISelectOptionString {
  label: string
  value: string
}

export interface ITurntableFirstDialogProps {
  showRoll?: boolean
  /** 首页弹框转盘配置是，首页弹框接口返回的 */
  data?: any
  state?: number
  pid?: string
  amount?: string
}

export interface MqttCallbackParamType { topic: string, message: { origin: string, parsed?: any } }
