<script setup lang="ts" name="AppTrxIframe">
import { IconLotBack } from '@tg/icons'
import { defineProps } from 'vue'

interface Props {
  url: string
}
const props = defineProps<Props>()
const emits = defineEmits(['close'])
</script>

<template>
  <div class="fixed top-0 left-0 size-full z-100">
    <div class="top-0 left-0 fixed z-99 w-full center">
      <div class="trx-iframe-header relative w-[var(--pc-max-width)] center ">
        <div class="absolute center text-[18rem] text-white cursor-pointer left-[10rem] top-[50%] -translate-y-[50%]" @click="emits('close')">
          <IconLotBack />
        </div>
        <span class="text-[18rem] font-normal text-white">TRX</span>
      </div>
    </div>
    <div class="content-padding-top w-screen h-full">
      <iframe
        :src="url"
        frameborder="0"
        allowfullscreen
        class=" border-0 w-screen h-full"
      />
    </div>
  </div>
</template>
