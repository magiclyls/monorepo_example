<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'
import AppHomeLayout from '~/components/AppHomeLayout.vue'
import AppLoading from '~/components/AppLoading.vue'

defineOptions({ name: 'AppSportsSportPage' })

const AppSportsSport = defineAsyncComponent(() => import('./_components/sports-sport.vue'))
</script>

<template>
  <AppHomeLayout show-bg>
    <Suspense timeout="0">
      <AppSportsSport />
      <template #fallback>
        <AppLoading />
      </template>
    </Suspense>
  </AppHomeLayout>
</template>

<style lang='scss' scoped></style>
