import { acceptHMRUpdate, defineStore } from 'pinia'
import { shallowRef } from 'vue'

interface WinGoTab {
  label: string
  value: number
}

export const useTrxWinGoStore = defineStore('useTrxWinGoStore', () => {
  const trxWinGoTabArr = shallowRef<WinGoTab[]>([])

  function setTrxWinGoTabArr(arr: WinGoTab[]) {
    trxWinGoTabArr.value = arr
  }

  return {
    trxWinGoTabArr,
    setTrxWinGoTabArr,
  }
})
if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useTrxWinGoStore, import.meta.hot))
