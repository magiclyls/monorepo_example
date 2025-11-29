import { acceptHMRUpdate, defineStore } from 'pinia'
import { shallowRef } from 'vue'

interface RaceTab {
  label: string
  value: number
}

export const useRaceStore = defineStore('useRaceStore', () => {
  const raceTabArr = shallowRef<RaceTab[]>([])

  function setRaceTabArr(arr: RaceTab[]) {
    raceTabArr.value = arr
  }

  return {
    raceTabArr,
    setRaceTabArr,
  }
})
if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useRaceStore, import.meta.hot))
