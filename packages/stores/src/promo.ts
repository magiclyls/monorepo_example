import { Local, STORAGE_REDRAIN_LAST_BONUS, STORAGE_REDRAIN_LAST_BONUS_ACCOUNT } from '@tg/utils'
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useAppStore } from './app'

export const usePromoStore = defineStore('promo', () => {
  const { isLogin } = storeToRefs(useAppStore())
  const lastBonusData = ref<any>(isLogin.value ? Local.get(STORAGE_REDRAIN_LAST_BONUS)?.value : undefined)
  const lastBonusAccount = ref<any>(isLogin.value ? Local.get(STORAGE_REDRAIN_LAST_BONUS_ACCOUNT)?.value : undefined)
  const depositDetail = ref<any>(null)

  /** 红包活动倒计时时间 */
  const redCountCurrent = ref()

  function setLastBonusData(data: any) {
    lastBonusData.value = data
    Local.set(STORAGE_REDRAIN_LAST_BONUS, data)
  }
  function setLastBonusAccount(data: any) {
    lastBonusAccount.value = data
    Local.set(STORAGE_REDRAIN_LAST_BONUS_ACCOUNT, data)
  }

  function setRedCountCurrent(c: any) {
    redCountCurrent.value = c
  }
  /** 存取款弹窗，需要进入的subtab, detail */
  function setDepositDetail(data: any) {
    depositDetail.value = data
  }

  return {
    redCountCurrent,
    lastBonusData,
    lastBonusAccount,

    setRedCountCurrent,
    setLastBonusData,
    setLastBonusAccount,
    depositDetail,
    setDepositDetail,

  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(usePromoStore, import.meta.hot))
