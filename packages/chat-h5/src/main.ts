import dayjs from 'dayjs'
import isLeapYear from 'dayjs/plugin/isLeapYear'
import relativeTime from 'dayjs/plugin/relativeTime'

import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import weekday from 'dayjs/plugin/weekday'

import { createApp } from 'vue'
import App from './App.vue'
import { install } from './modules'
import './modules/vue-request'
// import './styles/tailwindcss.css'
import '@tg/tailwindcss/tailwind-config'
import '../styles/main.css'

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
dayjs.extend(timezone)

const app = createApp(App)
install(app)
app.mount('#app')
