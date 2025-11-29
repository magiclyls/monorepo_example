<script lang="ts" setup>
import { AfunBaseImage } from '@tg/bccomponents'
import { useRoute, useRouter } from 'vue-router'

defineOptions({
  name: 'AppServiceFloatButton',
})
const router = useRouter()
const route = useRoute()
</script>

<template>
  <div
    v-if="route.name === 'Home'"
    class="fixed z-[90] flex cursor-pointer items-center text-[56px]"
    :style="{
      left: 'calc((100vw - min(100vw, var(--pc-max-width))) / 2 + 16px)',
      bottom: 'calc(env(safe-area-inset-bottom) + 60px + 16px)',
    }"
  >
    <AfunBaseImage url="/m/afun-h5/png/uni-kefu.png" class="w-[56px]" @click="router.push('/service')" />
  </div>
</template>
