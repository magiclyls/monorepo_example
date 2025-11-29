import type { VNode } from 'vue'
import { AfunBaseToast } from '@tg/bccomponents'
import { createVNode, reactive, render } from 'vue'

interface ToastItem {
  id: number
  content: string | VNode
}

const toasts = reactive<ToastItem[]>([])
let seed = 0

function addToast(content: string | VNode, duration = 2000) {
  const id = ++seed
  toasts.push({ id, content })

  setTimeout(() => {
    const idx = toasts.findIndex(t => t.id === id)
    if (idx !== -1)
      toasts.splice(idx, 1)
  }, duration)
}

let mounted = false
export function mountToastHost() {
  if (mounted)
    return

  const el = document.createElement('div')
  document.body.appendChild(el)

  const vnode = createVNode(AfunBaseToast, { toasts })
  render(vnode, el)

  mounted = true
}

// 支持 string / VNode / h() / 自定义组件
export const Message = {
  info(content: string | VNode, duration = 2000) {
    mountToastHost()
    addToast(content, duration)
  },
  error(content: string | VNode, duration = 2000) {
    mountToastHost()
    addToast(content, duration)
  },
  success(content: string | VNode, duration = 2000) {
    mountToastHost()
    addToast(content, duration)
  },
}
