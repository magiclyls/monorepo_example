<script setup lang="ts">
import { AfunBaseButton, AfunBaseImage } from '@tg/bccomponents'
import { useNotificationState } from '@tg/hooks'
import { IconBirArrow, IconUniNotice } from '@tg/icons'
import { useAppStore, useCurrency, useDownloadStore } from '@tg/stores'
import { getBrandInfo } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import AppDownLoadBar from '~/components/AppDownLoadBar.vue'
import AppWallet from '~/components/AppWallet.vue'

withDefaults(defineProps<{ showBg?: boolean, showBack?: boolean, showDownloadBar?: boolean }>(), {})

const { isLogin } = storeToRefs(useAppStore())
const { showState } = useNotificationState()
const { isShowPwaHasC } = storeToRefs(useDownloadStore())
const route = useRoute()
const router = useRouter()
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

// function openSideMenu() {
//   showSideMenu.value = true
// }
</script>

<template>
  <div
    class="h5-sticky-top text-[20px] w-[var(--pc-max-width)]  bg-[#1a2c38]  z-fixed flex flex-col app-header"
    style="box-shadow: 0 4px 6px -1px rgba(0, 0, 0, .2), 0 2px 4px -1px rgba(0, 0, 0, .122)"
  >
    <div v-if="isShowPwaHasC && showDownloadBar" class="relative">
      <AppDownLoadBar />
    </div>
    <div class="flex items-center justify-between px-[12px]">
      <div class="center h-[60px]">
        <div class="cursor-pointer">
          <div v-if="showBack" class="center h-[60px] p-[5px]" @click="router.back()">
            <IconBirArrow class="text-[18px] rotate-[90deg]" />
          </div>
          <AfunBaseImage v-else is-network :url="logoImg" class="h-[29px] w-auto" width="auto" @click="router.push('/')" />
        </div>
      </div>

      <div v-if="isLogin" class="flex">
        <AppWallet />
        <div class="flex items-center text-[18px] ml-[12px]">
          <div class="flex items-center cursor-pointer relative" @click="router.push('/message')">
            <IconUniNotice class="text-[#fff]" />
            <span v-show="showState" class="top-0 right-[1px] rounded-[50%] w-[6px] h-[6px] absolute inline-block bg-[#42FF00]" />
          </div>
        </div>
      </div>
      <div v-else class="flex app-header-btn">
        <AfunBaseButton class="min-w-[62px]" style="--afun-base-button-font-size: 14px; --afun-base-button-padding-y: 8px;border: none;--afun-base-button-font-weight:600; --afun-base-button-primary-background-color:transparent;--afun-base-button-primary-text-color:#fff" @click="router.push('/login')">
          {{ t('登录') }}
        </AfunBaseButton>
        <AfunBaseButton class="min-w-[62px]" style="--afun-base-button-font-size: 14px; --afun-base-button-padding-y: 8px;border: none;--afun-base-button-font-weight:600;" @click="router.push('/register')">
          {{ t('注册') }}
        </AfunBaseButton>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header-bg-img {
  background-repeat: no-repeat;
  background-position: left top;
  background-size: 390px auto;
}
</style>
