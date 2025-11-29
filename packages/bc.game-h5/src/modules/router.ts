import type { App } from 'vue'
import { router } from '@tg/shared-router'

export function install(app: App<Element>) {
  app.use(router)
}
