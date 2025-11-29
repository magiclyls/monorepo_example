<script setup lang="ts">
import { IconUniClose } from '@tg/icons'
import { ApiMemberBrandKefuSign } from '@tg/apis'
import { ChatHomePage } from '@tg/chat-h5/core'
import { getEnv } from '@tg/utils';


interface Props {
  modelValue: boolean
}
defineOptions({
  name: 'AppService',
})
withDefaults(defineProps<Props>(), {
  modelValue: false,
})

const { t } = useI18n()
const router = useLocalRouter()
const { VITE_OFFICIAL_DOMAIN, VITE_CASINO_IMG_CLOUD_URL } = getEnv()
const { isMobile } = storeToRefs(useWindowStore())
const { userInfo, isLogin, logoAndIcoAndLoading } = storeToRefs(useAppStore())
const { closeService } = useService()
const { bool: isIframeLoaded } = useBoolean(false)
const { bool: isHomePage } = useBoolean(true)
const { bool: loading } = useBoolean(false)
const { brandKf } = storeToRefs(useBrandStore())
const { data: sign } = useRequest(ApiMemberBrandKefuSign, {
  ready: isLogin,
  manual: false,
})
const { closeRightSidebar } = useRightSidebar()
/** 如果从登陆PWA弹窗打开客服，则要重新打开登陆PWA弹窗 */
const { isHaveWaitingLoginPWADialog, setIsHaveWaitingLoginPWADialogFalse } = useGlobalStateWalletState()
const { openLoginPwaDialog } = useDialogLoginPwa()

// timeStamp
const time = ref(dayjs().valueOf())
// a01客服地址，开发临时用
const serviceUrl1 = ref('https://a18111.com#/?business_id=150&access_key=C8B3111B9F0467651D4EB62DA14D1439&lang=zh&VITE_OFFICIAL_DOMAIN=新葡京&LOGO_URL=https://d2utx4nptvgikt.cloudfront.net/brand/1721301852790.webp&time=1722409427150&app=1')

const customStyle = computed(() => {
  if (isMobile.value) {
    return {
      // 'width': 'var(--pc-h5model-width)',
      'width': '100%',
      'height': '100%',
      'bottom': '0',
      'max-height': 'none',
      'border-radius': '0',
      'background-color': 'var(--tg-secondary-dark)',
    }
  }
  else {
    return {
      'width': '400px',
      'height': 'min(704px, 100% - 40px)',
      'right': '20px',
      'bottom': '20px',
      'max-height': '704px',
      'border-radius': '16px',
    }
  }
})
const serviceUrl = computed(() => {
  if (!brandKf.value)
    return ''

  const detail = brandKf.value.find((item: any) => +item.state === 1)

  let str = ''
  if (isLogin.value && userInfo.value)
    str = `&username=${userInfo.value.username}&sign=${sign.value}`

  return detail && detail.url
    ? (`${detail.url}&lang=${getCurrentUrlLanguage()}${str}&VITE_OFFICIAL_DOMAIN=${VITE_OFFICIAL_DOMAIN}&LOGO_URL=${`${VITE_CASINO_IMG_CLOUD_URL}/${logoAndIcoAndLoading.value.logo_white}`}&time=${time.value}&app=1`)
    : ''
})

// iframe加载完成
function onIframeLoaded() {
  isIframeLoaded.value = true
}

function endChat() {
  if (isMobile.value)
    closeRightSidebar()

  closeService()
  setTimeout(() => {
    isHomePage.value = true
    isIframeLoaded.value = false
    time.value = dayjs().valueOf()
  }, 50)
}

onUnmounted(() => {
  if (isHaveWaitingLoginPWADialog.value) {
    setIsHaveWaitingLoginPWADialogFalse()
    openLoginPwaDialog()
  }
})
</script>

<template>
  <div
    class="app-service md:fixed md:z-[10000]"
    :class="{
      none: !modelValue,
      mobile: isMobile,
    }"
    :style="customStyle"
    :data-url-s="serviceUrl"
  >
    <div
      v-if="(loading)"
      class="bg-tg-primary absolute left-0 top-0 z-[100] h-full w-full flex items-center justify-center"
    >
      <div
        class="absolute right-[8px] top-[8px] h-[48px] w-[48px] flex cursor-pointer items-center justify-center rounded-[10px] text-[14px] transition-all duration-100"
        style="" @click="endChat"
      >
        <IconUniClose />
      </div>
      <!-- <BaseLoading /> -->
      <AppLoading full-screen />
    </div>
    <div class="h-full w-full flex flex-col">
      <!-- <div class="shadow-tg-header-shadow relative z-[1] h-[60px] w-full flex items-center justify-center bg-[#12212D]">
        <BaseLogo :use-logo-after-login="false" />
      </div>
      <iframe
        v-if="serviceUrl" :key="serviceUrl" :src="serviceUrl" allowfullscreen
        name="intercom-messenger-frame" title="Intercom live chat" data-intercom-frame="true" role="dialog" width="100%"
        class="grow" @load="onIframeLoaded"
      /> -->
      <div class="grow min-h-0">
        <ChatHomePage :is-h5="false" :on-close="endChat"/>
      </div>
    </div>

    <!-- <div
      class="absolute right-[8px] top-[8px] z-[2] h-[48px] w-[48px] flex cursor-pointer items-center justify-center rounded-[10px] text-[14px] transition-all duration-100"
      style="" @click="endChat"
    >
      <IconUniClose />
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
.background-black {
  background: linear-gradient(180deg, #2f4452 81.25%, rgba(48, 69, 83, 0.62) 88.11%, rgba(105, 153, 184, 0) 95.8%);
}

.shadow-style {
  box-shadow:
    0px 2px 8px 0px rgba(0, 0, 0, 0.06),
    0px 0px 0px 1px rgba(0, 0, 0, 0.08);
}

.app-service {
  display: flex;
  transform-origin: right bottom;
  min-height: 80px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 5px 40px;
  border-radius: 16px;
  overflow: hidden;
  opacity: 1;

  &.mobile {
    position: fixed;
    z-index: 999999;
    width: var(--pc-h5model-width);
    padding-bottom: var(--tg-footerbar-height);
  }

  &.none {
    width: 0 !important;
    height: 0 !important;
    opacity: 0 !important;
    transform: scale(0) !important;
  }
}

@media (min-width: 768px) {
  .app-service {
    transition:
      width 200ms ease 0s,
      height 200ms ease 0s,
      max-height 200ms ease 0s,
      transform 300ms cubic-bezier(0, 1.2, 1, 1) 0s,
      opacity 83ms ease-out 0s;
  }
}
</style>
