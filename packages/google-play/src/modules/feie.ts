import type { App } from 'vue'
import { createFeie } from 'feie-ui'

export async function install(app: App<Element>) {
  app.use(createFeie())
}
