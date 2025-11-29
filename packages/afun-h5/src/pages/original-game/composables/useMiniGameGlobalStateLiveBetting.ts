import { createGlobalState } from '@vueuse/core'
import { ref } from 'vue'

export const useMiniGameGlobalStateLiveBetting = createGlobalState(() => {
  const isLiveBetting = ref(false)
  function toggleLiveBetting() {
    isLiveBetting.value = !isLiveBetting.value
  }
  return {
    isLiveBetting,
    toggleLiveBetting,
  }
})
