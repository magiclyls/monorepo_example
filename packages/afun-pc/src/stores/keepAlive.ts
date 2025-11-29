import { defineStore } from 'pinia'

export const useKeepAliveStore = defineStore('keepAlive', () => {
  const keepAliveList = ref<string[]>([
    'KeepAliveCasino', 'KeepAliveCasinoGroupProvider', 'KeepAliveCasinoGroupCategory', 'KeepAliveIndexHome', 'KeepAliveCasinoGames',
    // 所有活动
    'KeepAlivePromotionList',
  /*   'KeepAlivePromotionBettingRewards',
    'KeepAlivePromotionSigninRewards',
    'KeepAlivePromotionBackCash', 'KeepAlivePromotionEveryEight',
    'KeepAlivePromotionFixedRecharge', 'KeepAlivePromotionInvite', 'KeepAlivePromotionRecharge', 'KeepAlivePromotionWeeklyGiveaway',
    'KeepAlivePromotionWalletPaymentDeposit', */
  ])

  const removeKeepAlive = (name: string) => {
    const index = keepAliveList.value.indexOf(name)
    if (index > -1)
      keepAliveList.value.splice(index, 1)

    // 还原删除的值
    return () => {
      keepAliveList.value.splice(index, 0, name)
    }
  }

  return {
    keepAliveList,
    removeKeepAlive,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useKeepAliveStore, import.meta.hot))
