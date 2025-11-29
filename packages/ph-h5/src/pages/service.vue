<script setup lang='ts'>
import { ApiMemberBrandKefuSign } from '@tg/apis'
import { ChatHomePage } from '@tg/chat-h5/core'
import { useBoolean } from '@tg/hooks'
import { useAppStore, useBrandStore } from '@tg/stores'
import { getEnv } from '@tg/utils'
import { getLang } from '@tg/vue-i18n'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
import { useWindowHeightRem } from '~/hooks'

defineOptions({ name: 'AppService' })

const { VITE_OFFICIAL_DOMAIN, VITE_CASINO_IMG_CLOUD_URL } = getEnv()
const { bool: loading } = useBoolean(false)
const { brandKf, logoAndIcoAndLoading } = storeToRefs(useBrandStore())
const { userInfo, isLogin } = storeToRefs(useAppStore())
const { bool: isIframeLoaded } = useBoolean(false)
const router = useRouter()
const { heightRem } = useWindowHeightRem()

// timeStamp
const time = ref(dayjs().valueOf())

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
    ? (`${detail.url}&lang=${getLang()}${str}&VITE_OFFICIAL_DOMAIN=${VITE_OFFICIAL_DOMAIN}&LOGO_URL=${`${VITE_CASINO_IMG_CLOUD_URL}/${logoAndIcoAndLoading.value.logo_white}`}&time=${time.value}&app=1`)
    : ''
})

// iframe加载完成
function onIframeLoaded() {
  isIframeLoaded.value = true
}

function endChat() {
  isIframeLoaded.value = false
  router.back()
}
</script>

<template>
  <div class="w-full" :style="{ height: `${heightRem}rem` }">
    <div class="h-full w-full flex flex-col">
      <ChatHomePage :is-h5="false" :on-close="endChat" />
    </div>
    <!-- <div
      v-if="(loading || !isIframeLoaded)"
      class="absolute left-0 top-0 z-[100] h-full w-full flex items-center justify-center"
    >
      <div
        class="absolute right-[8rem] top-[8rem] h-[24rem] w-[48rem] flex cursor-pointer items-center justify-center rounded-[10px] text-[16rem] transition-all duration-100"
        style="" @click="endChat"
      >
        <IconUniClose3 :style="{ color: '#fff' }" />
      </div>
      <AppLoading />
    </div>
    <div class="h-full w-full flex flex-col">
      <div class=" header-bg relative z-[1] h-[42rem] w-full flex items-center justify-center">
      </div>
      <iframe
        v-if="serviceUrl" :key="serviceUrl" :src="serviceUrl" allowfullscreen
        name="intercom-messenger-frame" title="Intercom live chat" data-intercom-frame="true" role="dialog" width="100%"
        class="grow" @load="onIframeLoaded"
      />
    </div>

    <div
      class="absolute right-[8rem] top-[8rem] z-[2] h-[24rem] w-[48rem] flex cursor-pointer items-center justify-center rounded-[10px] text-[16rem] transition-all duration-100"
      style="" @click="endChat"
    >
      <IconUniClose3 :style="{ color: '#fff' }" />
    </div> -->
  </div>
</template>

<style lang='scss' scoped>
.header-bg {
  background: linear-gradient(90deg, #f23038, #f23038);
}
</style>
