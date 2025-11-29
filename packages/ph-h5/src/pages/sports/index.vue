<script setup lang='ts'>
import { defineAsyncComponent, provide, ref } from 'vue'
import AppHomeLayout from '~/components/AppHomeLayout.vue'
import AppLoading from '~/components/AppLoading.vue'

defineOptions({ name: 'AppSportsHomePage' })

const AppSportsHome = defineAsyncComponent(() => import('./_components/sports-home.vue'))

const isResolved = ref(false)

function onResolve() {
  isResolved.value = true
}

provide('isResolved', isResolved)
</script>

<template>
  <AppHomeLayout show-bg>
    <Suspense timeout="0" @resolve="onResolve">
      <AppSportsHome />
      <template #fallback>
        <AppLoading />
      </template>
    </Suspense>
  </AppHomeLayout>
</template>

<style lang='scss' scoped>

</style>
