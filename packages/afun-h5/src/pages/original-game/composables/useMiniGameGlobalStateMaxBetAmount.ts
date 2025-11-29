import { Local } from '@tg/utils'
import { createGlobalState } from '@vueuse/core'
import { ref } from 'vue'

export const useMiniGameGlobalStateMaxBetAmount = createGlobalState(() => {
  const initValue = Local.get<boolean | undefined | null>('STORAGE_MINIGAME_MAX_BET')?.value
  const isMaxBetAmount = ref(!!initValue)

  return {
    isMaxBetAmount,
  }
})
