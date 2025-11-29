import { useAppStore } from '@tg/stores'
import { createGlobalState } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

export const useWalletState = createGlobalState(() => {
  const { userInfo } = storeToRefs(useAppStore())

  /** 法币 CNY 真实姓名 */
  const realNameCNY = computed(() => userInfo.value?.realname?.cn)

  /** 法币 BRL 真实姓名 */
  const realNameBRL = computed(() => userInfo.value?.realname?.br)

  /** 法币 VND/KVND 真实姓名 */
  const realNameVND = computed(() => userInfo.value?.realname?.vn)

  /** 法币 THB 真实姓名 */
  const realNameTHB = computed(() => userInfo.value?.realname?.th)

  /** 法币 INR 真实姓名 */
  const realNameINR = computed(() => userInfo.value?.realname?.in)

  const realNameMap = computed(() => ({
    701: realNameCNY.value,
    702: realNameBRL.value,
    704: realNameVND.value,
    705: realNameTHB.value,
    703: realNameINR.value,
  } as any))

  return {
    realNameCNY,
    realNameBRL,
    realNameINR,
    realNameTHB,
    realNameVND,
    realNameMap,
  }
})
