<script setup lang="ts">
import { PhBaseButton } from '@tg/bccomponents'
import { IconUniArrowDown1 } from '@tg/icons'
import { useAppStore, useDownloadStore } from '@tg/stores'
import { isFlutterApp } from '@tg/utils'
import { useTitle } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppWallet from '~/components/AppWallet.vue'
import { useWindowHeightRem } from '~/hooks'

const props = withDefaults(defineProps<Props>(), {
  miniGmae: false,
})

const { isShowPwaHasC } = storeToRefs(useDownloadStore())

interface Props {
  title?: string
  miniGmae?: boolean
}

const router = useRouter()
const title = useTitle(props.title)
const { isLogin } = storeToRefs(useAppStore())
const { t } = useI18n()
const { heightRem } = useWindowHeightRem()

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
  <div v-else class="page-container" :style="{ minHeight: `${heightRem}rem` }">
    <div
      v-if="!isFlutterApp()"
      class="w-[var(--pc-max-width)] fixed-center top-0 h-[42rem] bg-white flex items-center justify-between pr-[10rem]"
    >
      <div class="absolute h-full px-[10rem] left-0 cursor-pointer flex items-center justify-center" @click="onBack">
        <IconUniArrowDown1 class="rotate-[90deg] text-[18rem]  back-icon" />
      </div>
      <template v-if="!miniGmae">
        <span class="w-full px-[30rem] text-center text-[16rem] font-[500] ">
          {{ title }}
        </span>
        <div class="absolute right-[10rem]">
          <template v-if="$slots.right">
            <slot name="right" />
          </template>
        </div>
      </template>
      <template v-else>
        <div class="flex justify-end w-full h-full items-center">
          <PhBaseButton v-if="!isLogin" class="app-header w-[69.04rem]" @click="router.push('/register')">
            {{ t('注册') }}
          </PhBaseButton>
          <AppWallet v-else />
        </div>
      </template>
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<style>
:root {
  --ph-page-layout-padding-x: 10rem;
  --ph-page-layout-padding-y: 16rem;
}
</style>

<style scoped lang="scss">
.fixed-center {
  position: sticky;
  z-index: 99;
}
.app-content {
  padding: var(--ph-page-layout-padding-y) var(--ph-page-layout-padding-x);
}
.page-container {
  color: #0d2245;
  background: #f6f7f8;

  .back-icon {
    --tg-base-icon-color: #0d2245;
  }

  .content {
    padding: var(--ph-page-layout-padding-y) var(--ph-page-layout-padding-x);
  }
}

.app-header {
  --ph-base-button-width: 57rem;
  --ph-base-button-height: 26rem;
  --ph-base-button-font-weight: 500;
  --ph-base-button-font-size: 12rem;
  --ph-base-button-padding-y: 1rem;
  --ph-base-button-padding-x: 0;
  --ph-base-button-border-radius: 24rem;
}
</style>
