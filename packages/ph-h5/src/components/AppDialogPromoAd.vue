<script setup lang="ts">
import { PhBaseImage } from '@tg/bccomponents'
import { useActivityMenu } from '@tg/hooks'
import { IconUniClose } from '@tg/icons'
import { useDialogStore } from '@tg/stores'
import { getEnv } from '@tg/utils'
import { getLangForBackend } from '@tg/vue-i18n'

import { throttle } from 'lodash'
import { storeToRefs } from 'pinia'

defineOptions({
  name: 'AppDialogPromoAd',
})

const { VITE_CASINO_IMG_CLOUD_URL } = getEnv()
const { promoAdDialogProps } = storeToRefs(useDialogStore())

const dialogStore = useDialogStore()
const { openActivity } = useActivityMenu()

// 点击节流
const openThrottleActivity = throttle((item: any) => {
  handleClose()
  openActivity(item)
}, 1.2 * 1000, {
  leading: true,
  trailing: false,
})

function handleClose() {
  dialogStore.setShowPromoAdDialogBool(false)
}
</script>

<template>
  <div class="h5-fixed-top bg-[rgba(0,0,0,0.4)] z-1111 center h-[100%] w-[100%]" @click="handleClose">
    <div class="margin-auto relative h-[386rem] w-[332rem] flex items-center justify-center">
      <div class="flex items-center justify-center">
        <PhBaseImage width="332rem" :url="`${VITE_CASINO_IMG_CLOUD_URL}/images/promo/pop/${getLangForBackend()}/${promoAdDialogProps!.ty}.webp`" @click.stop="openThrottleActivity(promoAdDialogProps)" />
      </div>
      <div
        class="center theme-close absolute right-[14rem] top-[0] h-[18rem] w-[18rem] cursor-pointer rounded-full"
        @click="handleClose"
      >
        <IconUniClose class="text-[12rem] text-[#c1c1c1]" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.theme-close {
  border: 1px solid #c1c1c1;
  --tg-icon-color: #c1c1c1;
}
</style>
