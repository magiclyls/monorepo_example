import { createApp, h } from 'vue'
import AppNotice from '../components/AppNotice.vue'
import { install } from '../modules/index'

let instance: any = null
let id = 0

function initInstance() {
  const div = document.createElement('div')
  document.body.appendChild(div)
  const app = createApp({
    render() {
      return h(AppNotice, { ref: el => instance = el })
    },
  })

  install(app)
  app.mount(div)
}

function info(value: string) {
  if (!instance) {
    initInstance()
  }
  id++
  const msg = { label: value, id }
  instance.addMsg(msg)
}

export const message = {
  info,
}
