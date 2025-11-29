<script setup lang="ts">
import { AfunBaseButton } from '@tg/bccomponents'
import { IconBirArrow } from '@tg/icons'
import { useAppStore } from '@tg/stores'
import { isFlutterApp } from '@tg/utils'
import { useTitle } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppWallet from '~/components/AppWallet.vue'

const props = withDefaults(defineProps<Props>(), {
  miniGmae: false,
})

interface Props {
  title?: string
  miniGmae?: boolean
}

const router = useRouter()
const title = useTitle(props.title)
const { isLogin } = storeToRefs(useAppStore())
const { t } = useI18n()

watch(() => props.title, (a) => {
  title.value = a
})
function onBack() {
  // 钱包
  router.back()
}
</script>

<template>
  <div v-if="isFlutterApp()" class="app-content">
    <slot />
  </div>
  <div v-else class="page-container">
    <div
      v-if="!isFlutterApp()"
      class="w-[var(--pc-max-width)] fixed-center top-0 h-[60px]  flex items-center justify-between pr-[12px] bg-[#1A2C38]"
    >
      <div class="absolute h-full  left-0 px-[17px] cursor-pointer flex items-center justify-center" @click="onBack">
        <IconBirArrow class="text-[18px]  back-icon rotate-[90deg]" />
      </div>
      <template v-if="!miniGmae">
        <span class="w-full px-[30px] text-center text-[18px] font-[600] ">
          {{ title }}
        </span>
        <div class="absolute right-[10px]">
          <template v-if="$slots.right">
            <slot name="right" />
          </template>
        </div>
      </template>
      <template v-else>
        <div class="flex justify-end w-full h-full items-center">
          <template v-if="!isLogin">
            <AfunBaseButton class="min-w-[62px]" style="--afun-base-button-font-size: 14px; --afun-base-button-padding-y: 8px;border: none;--afun-base-button-font-weight:600; --afun-base-button-primary-background-color:transparent;--afun-base-button-primary-text-color:#fff" @click="router.push('/login')">
              {{ t('登录') }}
            </AfunBaseButton>
            <AfunBaseButton class="min-w-[62px]" style="--afun-base-button-font-size: 14px; --afun-base-button-padding-y: 8px;border: none;" @click="router.push('/register')">
              {{ t('注册') }}
            </AfunBaseButton>
          </template>
          <AppWallet v-else />
        </div>
      </template>
    </div>
    <div class="content global-padding-bottom">
      <slot />
    </div>
  </div>
</template>

<style>
:root {
  --afun-page-layout-padding-x: 12px;
  --afun-page-layout-padding-top: 16px;
  --afun-page-layout-padding-bottom: 0;
}
</style>

<style scoped lang="scss">
.fixed-center {
  position: sticky;
  z-index: 99;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.2),
    0 2px 4px -1px rgba(0, 0, 0, 0.12);
}
.app-content {
  padding: var(--afun-page-layout-padding-top) var(--afun-page-layout-padding-x) var(--afun-page-layout-padding-bottom)
    var(--afun-page-layout-padding-x);
}
.page-container {
  height: 100%;
  color: #fff;

  .back-icon {
    --tg-base-icon-color: #0d2245;
  }

  .content {
    padding: var(--afun-page-layout-padding-top) var(--afun-page-layout-padding-x) 12px
      var(--afun-page-layout-padding-x);
  }
}

.app-header {
  --afun-base-button-width: 57px;
  --afun-base-button-height: 26px;
  --afun-base-button-font-weight: 500;
  --afun-base-button-font-size: 12px;
  --afun-base-button-padding-y: 1px;
  --afun-base-button-padding-x: 0;
  --afun-base-button-border-radius: 24px;
}
</style>
