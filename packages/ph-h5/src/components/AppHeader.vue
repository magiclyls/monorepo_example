<script setup lang="ts">
import { PhBaseButton, PhBaseImage, PhBasePopup } from '@tg/bccomponents'
import { useNotificationState } from '@tg/hooks'
import { IconPhHeaderMenu, IconUniNotice } from '@tg/icons'
import { useAppStore, useCurrency, useDownloadStore } from '@tg/stores'
import { getBrandInfo } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import AppWallet from '~/components/AppWallet.vue'
import AppDownLoadBar from './AppDownLoadBar.vue'
import AppSlideMenu from './AppSlideMenu.vue'

defineProps<{ showBg?: boolean }>()

const { isLogin, showSideMenu, currentPath } = storeToRefs(useAppStore())
const { showState } = useNotificationState()
const { isShowPwaHasC } = storeToRefs(useDownloadStore())

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())

const BLogoImg = getBrandInfo('pc.pc_logo_white')
const SLogoImg = getBrandInfo('pc.pc_first_letter')

const logoImg = computed(() => {
  if (currentGlobalCurrencyMap.value.balance.length > 18) {
    return SLogoImg
  }
  else {
    return BLogoImg
  }
})

function goTarget(v: string) {
  router.push(v)
}
function openSideMenu() {
  showSideMenu.value = true
}

watch(
  () => route.fullPath,
  (newPath, oldPath) => {
    showSideMenu.value = false
    currentPath.value = ''
  },
)
</script>

<template>
  <div
    v-bg-image="showBg ? '/casino-head-bg' : ''" :class="{ 'header-bg-img': showBg }"
    class="h5-sticky-top text-[20rem] w-[var(--pc-max-width)]  bg-[#f6f7f8]  z-fixed flex flex-col app-header"
  >
    <div v-if="isShowPwaHasC">
      <AppDownLoadBar />
    </div>
    <div class="flex items-center justify-between h-full pl-[12rem] pr-[8rem]">
      <div class="relative h-[50rem] flex items-center">
        <IconPhHeaderMenu class="text-[24rem] text-[#F23038]  cursor-pointer" @click="openSideMenu" />
        <div class="absolute left-[32rem] h-[26rem] w-[77rem]  cursor-pointer" style="top:50%;transform: translate(0,-50%);" @click="router.push('/')">
          <PhBaseImage is-network :url="logoImg" class="h-[26rem]" width="auto" />
        </div>
      </div>

      <div v-if="isLogin" class="flex">
        <AppWallet />
        <div class="flex items-center text-[18rem] ml-[10rem]" style="--tg-base-icon-color:#6D7693;">
          <div class="flex items-center cursor-pointer relative" @click="goTarget('/message')">
            <IconUniNotice />
            <span v-show="showState" class="top-0 right-0 rounded-[50%] w-[3rem] h-[3rem] absolute inline-block bg-[#F23038]" />
          </div>
        </div>
      </div>
      <div v-else class="flex app-header-btn">
        <PhBaseButton
          type="none" class="mr-[6rem] min-w-[62rem] btn-py center shrink-0 text-[#F23038] bg-[rgba(242,48,56,0.08)]"
          style="--ph-base-button-border-color: #F23038;--ph-base-button-line-height:26rem;"
          @click="goTarget('/login')"
        >
          {{ t('登录') }}
        </PhBaseButton>
        <PhBaseButton class="min-w-[62rem] btn-py" style="--ph-base-button-line-height:26rem;" @click="goTarget('/register')">
          {{ t('注册') }}
        </PhBaseButton>
      </div>
    </div>
    <!-- 侧边栏菜单 -->
    <PhBasePopup v-model="showSideMenu" position="left">
      <AppSlideMenu />
    </PhBasePopup>
  </div>
</template>

<style scoped lang="scss">
.header-bg-img {
  background-repeat: no-repeat;
  background-position: left top;
  background-size: 390px auto;
}

.app-header {
  --ph-base-button-width: 57rem;
  --ph-base-button-height: 26rem;
  --ph-base-button-font-weight: 500;
  --ph-base-button-font-size: 12rem;
  &-btn {
    --ph-base-button-padding-y: 1rem;
    --ph-base-button-padding-x: 0;
    --ph-base-button-border-radius: 24rem;
  }
}

.btn-py {
  padding: 0 6rem;
}
</style>
