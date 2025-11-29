import { createGlobalState } from '@vueuse/core'
import { ref } from 'vue'

export const useMiniGameGlobalStatePlayerResult = createGlobalState(() => {
  const showPlayerResult =ref(true)
  function togglePlayerResult() {
    showPlayerResult.value = !showPlayerResult.value
  }
  
  return {
    showPlayerResult,
    togglePlayerResult,
  }
})
