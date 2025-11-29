import type { App } from 'vue'
import { install as installFeie } from './feie'
import { install as installFloating } from './floating'
import { install as installPinia } from './pinia'
import { install as installRouter } from './router'

export async function install(app: App<Element>) {
  installRouter(app)
  installPinia(app)
  installFloating(app)
  installFeie(app)
}
