<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'
import AppHomeLayout from '~/components/AppHomeLayout.vue'
import AppLoading from '~/components/AppLoading.vue'

defineOptions({ name: 'AppSportsLeaguePage' })

const AppSportsLeague = defineAsyncComponent(() => import('./_components/sports-league.vue'))
</script>

<template>
  <AppHomeLayout show-bg>
    <Suspense timeout="0">
      <AppSportsLeague />
      <template #fallback>
        <AppLoading />
      </template>
    </Suspense>
  </AppHomeLayout>
</template>

<style lang='scss' scoped></style>
