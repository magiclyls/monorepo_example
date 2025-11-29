<script setup lang='ts'>
import AppLoading from '~/components/AppLoading.vue'
import AppPageLayout from '~/components/AppPageLayout.vue'
import AppMiniGameLoadingTest from './AppMiniGameLoadingTest.vue'

defineOptions({ name: 'AppMiniGameLoading' })
</script>

<template>
  <AppPageLayout mini-gmae>
    <Suspense timeout="0">
      <AppMiniGameLoadingTest>
        <slot />
      </AppMiniGameLoadingTest>
      <template #fallback>
        <AppLoading />
      </template>
    </Suspense>
  </AppPageLayout>
</template>
