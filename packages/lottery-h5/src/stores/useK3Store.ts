import type { LotteryBetItem } from '@tg/types'
import { combinations } from '@tg/utils'
import { flatten } from 'lodash'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useK3Store = defineStore('useK3Store', () => {
  const showBetPop = ref<boolean>(false)
  const K3BetData = ref<any>()
  const K3BetType = ref<number | undefined>()
  // type 1 total,2 2same,3 3same,4 different
  const K3BetParams = computed(() => {
    // 同步数据
    if (K3BetType.value === 1) {
      return K3BetData.value
    }
    else if (K3BetType.value === 2) {
      let typ2Arr: LotteryBetItem[] = []
      const { betArr1, betArr2, betArr3 } = K3BetData.value
      if (betArr2?.length > 0 && betArr3?.length > 0) {
        typ2Arr = flatten(betArr2.map((i2: LotteryBetItem) => {
          return betArr3.map((i3: LotteryBetItem) => {
            return {
              ...i3,
              balls: i2.balls && i3.balls && i2.balls.concat(i3.balls),
            }
          })
        }))
      }
      return betArr1.concat(typ2Arr)
    }
    else if (K3BetType.value === 3) {
      const { betArr1, betArr2 } = K3BetData.value
      return betArr1.concat(betArr2)
    }
    else if (K3BetType.value === 4) {
      const { betArr1, betArr2, betArr3 } = K3BetData.value
      let firstItem = betArr1[0]
      const result1 = combinations(betArr1.map((item: LotteryBetItem) => item.balls?.[0]), 3).map((arr) => {
        return {
          ...firstItem,
          label: arr.join(''),
          balls: arr,
        }
      })
      firstItem = betArr3[0]
      const result3 = combinations(betArr3.map((item: LotteryBetItem) => item.balls?.[0]), 2).map((arr) => {
        return {
          ...firstItem,
          balls: arr,
          label: arr.join(''),
        }
      })
      return result1.concat(result3).concat(betArr2)
    }
  })

  function startBet(data: any, type: number) {
    showBetPop.value = true
    K3BetData.value = data
    K3BetType.value = type
  }
  function closePop() {
    showBetPop.value = false
  }
  function clearBet() {
    K3BetData.value = undefined
    K3BetType.value = undefined
  }

  return {
    showBetPop,
    K3BetData,
    K3BetType,
    K3BetParams,
    startBet,
    closePop,
    clearBet,
  }
})
if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useK3Store, import.meta.hot))
