<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'
import AppHomeLayout from '~/components/AppHomeLayout.vue'
import AppLoading from '~/components/AppLoading.vue'

defineOptions({ name: 'AppSportsRegionPage' })

const AppSportsRegion = defineAsyncComponent(() => import('./_components/sports-region.vue'))
</script>

<template>
  <AppHomeLayout show-bg>
    <Suspense timeout="0">
      <AppSportsRegion />
      <template #fallback>
        <AppLoading />
      </template>
    </Suspense>
  </AppHomeLayout>
</template>

<style lang='scss' scoped></style>
