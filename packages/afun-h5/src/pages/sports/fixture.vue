<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'
import AppHomeLayout from '~/components/AppHomeLayout.vue'
import AppLoading from '~/components/AppLoading.vue'

defineOptions({ name: 'AppSportsFixturePage' })

const AppSportsFixture = defineAsyncComponent(() => import('./_components/sports-fixture.vue'))
</script>

<template>
  <AppHomeLayout show-bg>
    <Suspense timeout="0">
      <AppSportsFixture />
      <template #fallback>
        <AppLoading />
      </template>
    </Suspense>
  </AppHomeLayout>
</template>

<style lang='scss' scoped></style>
