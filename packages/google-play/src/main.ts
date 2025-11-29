import { createApp } from 'vue'
import App from './App.vue'
import { bgImage } from './directive/bg-image'
import { install } from './modules'
import './modules/vue-request'
import '@tg/tailwindcss/tailwind-config'

import '../styles/main.scss'

const app = createApp(App)
install(app)
app.directive('bg-image', bgImage)
app.mount('#app')
