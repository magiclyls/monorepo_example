import type { App } from 'vue'
import BaseToast from '~/components/BaseToast.vue'

const getToastList = (function () {
  let toastList = document.querySelector('.tg-toast-list')
  if (toastList === null || toastList === void 0) {
    toastList = document.createElement('div')
    toastList.className = 'tg-toast-list'
    document.body.appendChild(toastList)
  }
  return function () {
    return toastList
  }
})()

// 只允许同时存在一个Toast
let isOpen = false
let app: null | App = null
const div = document.createElement('div')
let timer: null | NodeJS.Timeout = null
const toastList = getToastList()
toastList.appendChild(div)

export function useToast() {
  const openToast = ({ message, type, currencyIcon }: Record<string, any>) => {
    if (isOpen)
      closeTaost()

    app = createApp(h(BaseToast, {
      message, type, currencyIcon,
    }))
    app.mount(div)
    isOpen = true
    timer = setTimeout(() => {
      closeTaost()
    }, 1000 * 3)
  }

  function closeTaost() {
    timer && clearTimeout(timer)
    if (app) {
      app.unmount()
      app = null
    }
    isOpen = false
  }

  return {
    openToast,
  }
}
