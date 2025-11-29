import { createApp } from 'vue'
import App from './App.vue'
import { install } from './modules'

// import './styles/tailwindcss.css'
import '@tg/tailwindcss/tailwind-config'
import 'virtual:svg-icons-register'
import '../styles/main.css'

const app = createApp(App)
install(app)
app.mount('#app')
