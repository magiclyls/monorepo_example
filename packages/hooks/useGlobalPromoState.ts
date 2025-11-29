import { ApiMemberPromoCombine } from '@tg/apis'
import { useAppStore } from '@tg/stores'
import { createGlobalState } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRequest } from 'vue-request'

/**
 * 活动弹窗 侧边栏 浮窗
 */
export const useGlobalPromoState = createGlobalState(() => {
  const { isLogin } = storeToRefs(useAppStore())

  const { data: promoHandyData, runAsync: runPromoCombine } = useRequest(ApiMemberPromoCombine, {
    manual: true,
    refreshDeps: isLogin,
  })

  const promoPop = computed(() => (promoHandyData.value?.pop || []).filter((item) => {
    if (item.display_mode === 1 && !isLogin.value)
      return false
    if (item.display_mode === 3)
      return false
    return true
  }))
  const promoShortCut = computed(() => (promoHandyData.value?.sc || []).filter((item) => {
    if (item.display_mode === 1 && !isLogin.value)
      return false
    if (item.display_mode === 3)
      return false
    return true
  }))
  const promoSideBar = computed(() => (promoHandyData.value?.rec || []).filter((item) => {
    if (item.display_mode === 1 && !isLogin.value)
      return false
    if (item.display_mode === 3)
      return false
    return true
  }))

  return {
    promoHandyData,
    promoPop,
    promoShortCut,
    promoSideBar,
    runPromoCombine,
  }
})
