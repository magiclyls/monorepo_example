import { createGlobalState } from '@vueuse/core'
import { ref } from 'vue'

export const useMiniGameGlobalStateTheatre = createGlobalState(() => {
  const isTheatre = ref(false)
  function toggleIsTheatre() {
    isTheatre.value = !isTheatre.value
  }
  return {
    isTheatre,
    toggleIsTheatre,
  }
})
