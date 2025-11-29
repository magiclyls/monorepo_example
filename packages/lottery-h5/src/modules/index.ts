import type { App } from 'vue'
import { install as installFeie } from './feie'
import { install as installFloating } from './floating'
import { install as installPinia } from './pinia'
import { install as installRouter } from './router'
import { install as installWujie } from './wujie'

export async function install(app: App<Element>) {
  installRouter(app)
  installPinia(app)
  installFloating(app)
  installWujie(app)
  installFeie(app)
}
