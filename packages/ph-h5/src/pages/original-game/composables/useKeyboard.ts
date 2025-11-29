import { KeyboardKeyEnum } from '@tg/types'
import { onMounted, onUnmounted } from 'vue'
import { useMiniGameGlobalStateHotKeys } from '../composables/useMiniGameGlobalStateHotKeys'

export function useKeyboard(callback: (key: KeyboardKeyEnum) => void) {
  const { isHotKeysEnabled } = useMiniGameGlobalStateHotKeys()
  const keyValues: string[] = Object.values(KeyboardKeyEnum)

  function handleKeyDown(event: KeyboardEvent) {
    if (isHotKeysEnabled.value && keyValues.includes(event.code))
      event.preventDefault()

    switch (event.code) {
      case KeyboardKeyEnum.A:
        callback(KeyboardKeyEnum.A)
        break
      case KeyboardKeyEnum.S:
        callback(KeyboardKeyEnum.S)
        break
      case KeyboardKeyEnum.D:
        callback(KeyboardKeyEnum.D)
        break
      case KeyboardKeyEnum.Q:
        callback(KeyboardKeyEnum.Q)
        break
      case KeyboardKeyEnum.W:
        callback(KeyboardKeyEnum.W)
        break
      case KeyboardKeyEnum.E:
        callback(KeyboardKeyEnum.E)
        break
      case KeyboardKeyEnum.R:
        callback(KeyboardKeyEnum.R)
        break
      case KeyboardKeyEnum.T:
        callback(KeyboardKeyEnum.T)
        break
      case KeyboardKeyEnum.Y:
        callback(KeyboardKeyEnum.Y)
        break
      case KeyboardKeyEnum.SPACE:
        callback(KeyboardKeyEnum.SPACE)
        break
      case KeyboardKeyEnum.ENTER:
        callback(KeyboardKeyEnum.ENTER)
        break
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })
}

// Test
// useKeyboard((e) => {
//   if (e === KeyboardKeyEnum.ENTER)
// })
