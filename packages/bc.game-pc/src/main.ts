import { createApp } from 'vue'
import App from './App.vue'
import { install } from './modules'
import '@tg/tailwindcss/tailwind-config'
import 'virtual:svg-icons-register'

const app = createApp(App)
install(app)
app.mount('#app')
