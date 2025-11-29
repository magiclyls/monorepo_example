import { ApiMemberBrandDetail } from '@tg/apis'
import { getBrandInfo } from '@tg/utils'

import { getLang, loadLanguageAsync, setServerLangMap } from '@tg/vue-i18n'
import dayjs from 'dayjs'
import isLeapYear from 'dayjs/plugin/isLeapYear'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'

import utc from 'dayjs/plugin/utc'
import weekday from 'dayjs/plugin/weekday'
import { createApp } from 'vue'
import App from './App.vue'
import { bgImage } from './directive/bg-image'
import { install } from './modules'

import './modules/vue-request'
import '@tg/tailwindcss/tailwind-config'
import '../styles/main.scss'
import 'dayjs/locale/en'
import 'dayjs/locale/hi'
import 'dayjs/locale/id'
import 'dayjs/locale/ja'
import 'dayjs/locale/ko'
import 'dayjs/locale/pt-br'
import 'dayjs/locale/th'
import 'dayjs/locale/vi'
import 'dayjs/locale/zh-cn'

dayjs.extend(isLeapYear)
dayjs.extend(weekday)
dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone);

(async () => {
  // ✅ 异步操作
  try {
    window.brandDetail = await ApiMemberBrandDetail()

    if (!window.brandDetail) {
      throw new Error('brandDetail 没有数据')
    }
    setServerLangMap(getBrandInfo('base.lang.d') || [])
    await loadLanguageAsync(getLang())
    const app = createApp(App)
    await install(app)
    app.directive('bg-image', bgImage)
    app.mount('#app')
  }
  catch (err) {
    console.error('Main 初始化报错', err)
  }
})()
