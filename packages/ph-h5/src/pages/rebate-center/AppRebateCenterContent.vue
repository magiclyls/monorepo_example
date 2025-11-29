<script setup lang='ts'>
import { defineAsyncComponent, provide } from 'vue'
import AppLoading from '~/components/AppLoading.vue'
import AppVipInfoBar from '~/components/AppVipInfoBar.vue'

defineOptions({ name: 'AppRebateCenterContent' })
const props = defineProps<{ isInPromo?: boolean }>()

const _component = defineAsyncComponent(() => import('~/components/AppRebateContent.vue'))

if (props.isInPromo) {
  provide('isInPromoRebate', true)
}
</script>

<template>
  <div>
    <AppVipInfoBar class="mb-[16rem]" />
    <Suspense timeout="0">
      <component :is="_component" />
      <template #fallback>
        <AppLoading />
      </template>
    </Suspense>
  </div>
</template>

<style lang='scss' scoped></style>
