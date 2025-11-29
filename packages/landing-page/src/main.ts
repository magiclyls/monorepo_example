import { ApiMemberBrandDetail } from '@tg/apis'
import { LANGUAGE_MAP, loadLanguageAsync } from '@tg/vue-i18n'
import { createApp } from 'vue'
import App from './App.vue'
import { bgImage } from './directive/bg-image'
import { install } from './modules'
import './modules/vue-request'
import '@tg/tailwindcss/tailwind-config'
import '../styles/main.scss'

(async () => {
  // ✅ 异步操作
  try {
    window.brandDetail = await ApiMemberBrandDetail()

    if (!window.brandDetail) {
      throw new Error('brandDetail 没有数据')
    }
    await loadLanguageAsync(LANGUAGE_MAP['zh-CN'])
    const app = createApp(App)
    await install(app)
    app.directive('bg-image', bgImage)
    app.mount('#app')
  }
  catch (err) {
    console.error('Main 初始化报错', err)
  }
})()
