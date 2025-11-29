// import Previewer from 'virtual:vue-component-preview'
import isLeapYear from 'dayjs/plugin/isLeapYear'
import isoWeek from 'dayjs/plugin/isoWeek'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import weekday from 'dayjs/plugin/weekday'
import App from './App.vue'

import { install } from './modules'
import { loadLanguageAsync } from '@tg/vue-i18n'
import LimitIp from './pages/[lang]/limit-ip.vue'
import ServerError from './pages/[lang]/server-error.vue'

import '@tg/tailwindcss/tailwind-config'
import 'dayjs/locale/en'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/vi'
import 'dayjs/locale/pt-br'
import 'dayjs/locale/th'
import 'dayjs/locale/hi'
import 'dayjs/locale/id'
import 'dayjs/locale/ko'

import 'dayjs/locale/ja'
import './styles/reset.scss'
import './styles/main.scss'

import './styles/animate.scss'

import './styles/tailwindcss.css'
import './modules/vue-request'
import 'feie-ui/dist/style.css'

dayjs.extend(isLeapYear)
dayjs.extend(weekday)
dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isoWeek)

const handleError = debounce(async () => {
  const app = createApp(LimitIp)
  await install(app)
  app.mount('#app')
}, 500)

const handleServerError = debounce(async () => {
  const app = createApp(ServerError)
  await install(app)
  app.mount('#app')
}, 500)

globalInit().then(async () => {
  if (globalInitMap.currentTemplate !== 1 && globalInitMap.currentTemplate !== 6) {
    globalInitMap.isPcRenderH5 = !isMobileFn() && window.innerWidth >= 768
    setMobileBodyStyle(430)
  }
  else {
    globalInitMap.isPcRenderH5 = false
  }

  loadLanguageAsync(getCurrentLanguageForFrontend()).then(async () => {
    const app = createApp(App)
    await install(app)
    app.mount('#app')
  })
}).catch((err) => {
  console.error('初始化接口报错')
  if (err?.response?.status === 200) {
    loadLanguageAsync(getCurrentLanguageForFrontend()).then(async () => {
      // console.log('403错误，IP或者地区错误', err)
      handleError()
    })
  }
  else {
    loadLanguageAsync(getCurrentLanguageForFrontend()).then(async () => {
      // console.log('后端 API报错')
      handleServerError()
    })
  }
})

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw-block-domain.js', { scope: '/' })
      // .then(() => {
      //   if (isPwa() && isIos()) {
      //     if (!Local.get('hasReload')) {
      //       Local.set('hasReload', true)
      //       setTimeout(() => {
      //         location.reload()
      //       }, 1000)
      //     }
      //   }
      // })
      .catch((error) => {
        console.error('Service Worker 注册失败:', error)
      })
  })
}
