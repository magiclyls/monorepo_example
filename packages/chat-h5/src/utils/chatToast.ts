import { ref } from 'vue'

interface ChatToastItem {
  id: number
  message: string
  type: 'info' | 'error' | 'success'
}

const toasts = ref<ChatToastItem[]>([])
let seed = 0

function pushToast(message: string, type: ChatToastItem['type'], duration = 2000) {
  const id = ++seed
  toasts.value.push({ id, message, type })

  setTimeout(() => {
    const index = toasts.value.findIndex(item => item.id === id)
    if (index !== -1)
      toasts.value.splice(index, 1)
  }, duration)
}

export function showChatError(message: string, duration = 5000) {
  pushToast(message, 'error', duration)
}

export function showChatInfo(message: string, duration = 5000) {
  pushToast(message, 'info', duration)
}

export function showChatSuccess(message: string, duration = 5000) {
  pushToast(message, 'success', duration)
}

export function useChatToastStore() {
  return { toasts }
}
