<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'
import AppHomeLayout from '~/components/AppHomeLayout.vue'
import AppLoading from '~/components/AppLoading.vue'

defineOptions({ name: 'AppSportsOutrightsPage' })

const AppSportsOutright = defineAsyncComponent(() => import('./_components/sports-outrights.vue'))
</script>

<template>
  <AppHomeLayout show-bg>
    <Suspense timeout="0">
      <AppSportsOutright />
      <template #fallback>
        <AppLoading />
      </template>
    </Suspense>
  </AppHomeLayout>
</template>

<style lang='scss' scoped></style>
