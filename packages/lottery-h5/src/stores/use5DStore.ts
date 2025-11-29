import { LotteryFiveDBetPos } from '@tg/types'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

export const use5DStore = defineStore('use5DStore', () => {
  // 选中的位置
  const selectedPos = ref(LotteryFiveDBetPos.A)
  const selectedBSOE = ref<string>('')
  const selectedNumArr = ref<string[]>([])

  // 清空大小单双选中
  function clearSelectedBSOE() {
    selectedBSOE.value = ''
  }
  // 清空号码选中
  function clearSelectedNumArr() {
    selectedNumArr.value.length = 0
  }

  return {
    selectedPos,
    selectedBSOE,
    selectedNumArr,
    clearSelectedBSOE,
    clearSelectedNumArr,
  }
})
if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(use5DStore, import.meta.hot))
