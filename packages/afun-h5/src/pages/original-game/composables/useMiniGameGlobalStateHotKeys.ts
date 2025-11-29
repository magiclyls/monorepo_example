import { Local } from '@tg/utils'
import { createGlobalState } from '@vueuse/core'
import { ref } from 'vue'

export const useMiniGameGlobalStateHotKeys = createGlobalState(() => {
  const isHotKeysEnabled = ref(Local.get<boolean>('STORAGE_MINI_GAME_HOTKEYS_ENABLED')?.value ?? false)

  Local.set('STORAGE_MINI_GAME_HOTKEYS_ENABLED', isHotKeysEnabled.value)

  return {
    isHotKeysEnabled,
  }
})
