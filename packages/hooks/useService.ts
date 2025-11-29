import { ApiMemberBrandKefuSign } from '@tg/apis'
import { useAppStore, useBrandStore } from '@tg/stores'
import { getEnv, lockBodyScroll } from '@tg/utils'
import { getLang } from '@tg/vue-i18n'
import { createGlobalState } from '@vueuse/core'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRequest } from 'vue-request'
import { useBoolean } from './useBoolean'

export const useService = createGlobalState(() => {
  const { VITE_OFFICIAL_DOMAIN, VITE_CASINO_IMG_CLOUD_URL } = getEnv()

  // timeStamp
  const time = ref(dayjs().valueOf())
  const { bool: serviceState, setBool } = useBoolean(false)
  const { userInfo, isLogin } = storeToRefs(useAppStore())
  const { brandKf, logoAndIcoAndLoading } = storeToRefs(useBrandStore())
  const { data: sign } = useRequest(ApiMemberBrandKefuSign, {
    ready: isLogin,
    manual: false,
  })

  const serviceUrl = computed(() => {
    if (!brandKf.value)
      return ''

    const detail = brandKf.value.find((item: any) => +item.state === 1)

    let str = ''
    if (isLogin.value && userInfo.value)
      str = `&username=${userInfo.value.username}&sign=${sign.value}`

    return detail && detail.url
      ? (`${detail.url}&lang=${getLang()}${str}&VITE_OFFICIAL_DOMAIN=${VITE_OFFICIAL_DOMAIN}&LOGO_URL=${`${VITE_CASINO_IMG_CLOUD_URL}/${logoAndIcoAndLoading.value.logo_white}`}&time=${time.value}`)
      : ''
  })

  /**
   * 打开客服
   */
  function openService({ isFootBar = false }: { isFootBar: boolean }) {
    if (!isFootBar) {
      const footbarBtn = document.getElementById('h5-footbar-kefu')
      footbarBtn?.click()
    }
    setBool(true)
    lockBodyScroll(true)
  }

  /**
   * 关闭客服
   */
  function closeService() {
    setBool(false)
    lockBodyScroll(false)
  }

  return {
    openService,
    closeService,
  }
})
