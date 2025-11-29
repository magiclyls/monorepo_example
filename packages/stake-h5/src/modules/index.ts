import type { App } from 'vue'
import { install as installI18n } from './i18n'
import { install as installRouter } from './router'
import { install as installPinia } from './pinia'
import { install as installFloating } from './floating'
import { install as installWujie } from './wujie'
import { install as installFeie } from './feie'

export async function install(app: App<Element>) {
  installRouter(app)
  installPinia(app)
  installFloating(app)
  installWujie(app)
  installFeie(app)
  await installI18n(app)
}
