import type { App } from 'vue'
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'

export function install(app: App<Element>) {
  app.use(FloatingVue)
}
