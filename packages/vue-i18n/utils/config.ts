import { type EnumLanguageKeys, TIMEZONEABBR } from '@tg/types'

export const ALL_LANGUAGES: {
  title: string
  path: string
  icon: string
  value: EnumLanguageKeys
  phone: string
  phoneId: string
  prefix: string
  offset: number
  zone: TIMEZONEABBR
}[] = [
  {
    title: '简体中文',
    path: '',
    icon: '86',
    value: 'zh-CN',
    phone: '+86',
    phoneId: '1137',
    prefix: 'zh',
    offset: 8,
    zone: TIMEZONEABBR.CST,
  },
  {
    title: 'English',
    path: '',
    icon: '1',
    value: 'en-US',
    phone: '+1',
    phoneId: '1283',
    prefix: 'en',
    offset: -4,
    zone: TIMEZONEABBR.USA,
  },
  {
    title: 'Tiếng Việt',
    path: '',
    icon: '84',
    value: 'vi-VN',
    phone: '+84',
    phoneId: '1287',
    prefix: 'vn',
    offset: 7,
    zone: TIMEZONEABBR.VIETNAM,
  },
  {
    title: 'Português',
    path: '',
    icon: '55',
    value: 'pt-BR',
    phone: '+55',
    phoneId: '1125',
    prefix: 'pt',
    offset: -3,
    zone: TIMEZONEABBR.BRT,
  },
  {
    title: 'ภาษาไทย',
    path: '',
    icon: '66',
    value: 'th-TH',
    phone: '+66',
    phoneId: '66',
    prefix: 'th',
    offset: 7,
    zone: TIMEZONEABBR.THAILAND,
  },
  {
    title: 'हिन्दी',
    path: '',
    icon: '91',
    value: 'hi-IN',
    phone: '+91',
    phoneId: '91',
    prefix: 'hi',
    offset: 5.5,
    zone: TIMEZONEABBR.INDIA,
  },
  {
    title: 'Indonesia',
    path: '',
    icon: '62',
    value: 'in-ID',
    phone: '+62',
    phoneId: '62',
    prefix: 'id',
    offset: 7,
    zone: TIMEZONEABBR.INDONESIA,
  },
  {
    title: '한국어',
    path: '',
    icon: '82',
    value: 'ko-KR',
    phone: '+82',
    phoneId: '82',
    prefix: 'ko',
    offset: 9,
    zone: TIMEZONEABBR.KOREA,
  },
  {
    title: '日本語',
    path: '',
    icon: '81',
    value: 'ja-JP',
    phone: '+81',
    phoneId: '81',
    prefix: 'ja',
    offset: 9,
    zone: TIMEZONEABBR.JAPAN,
  },
  {
    title: 'Filipino',
    path: '',
    icon: '63',
    value: 'tl-PH',
    phone: '+63',
    phoneId: '63',
    prefix: 'tl',
    offset: 8,
    zone: TIMEZONEABBR.PHILIPPINES,
  },
]
