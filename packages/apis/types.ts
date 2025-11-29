import type { TCurrencyObject } from '@tg/types'

/** 用户详情  */
export interface IMemberDetail {
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
  score: string
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
}
