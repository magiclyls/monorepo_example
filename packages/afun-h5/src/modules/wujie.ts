import type { App } from 'vue'
import WujieVue from 'wujie-vue3'

export async function install(app: App<Element>) {
  app.use(WujieVue)
}
