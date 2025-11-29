import { acceptHMRUpdate, defineStore } from 'pinia'
import { shallowRef } from 'vue'

interface WinGoTab {
  label: string
  value: number
}

export const useWinGoStore = defineStore('useWinGoStore', () => {
  const winGoTabArr = shallowRef<WinGoTab[]>([])

  function setWinGoTabArr(arr: WinGoTab[]) {
    winGoTabArr.value = arr
  }

  return {
    winGoTabArr,
    setWinGoTabArr,
  }
})
if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useWinGoStore, import.meta.hot))
