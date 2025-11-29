<script setup lang="ts">
import type { DynamicProviderKeys } from '~/utils/scroll-var'

defineOptions({
  name: 'KeepAliveCasinoGroupProvider',
})

const router = useRouter()
const loadValue = ref(1)

function handleScroll() {
  if (router.currentRoute.value.path?.includes('/casino/group/provider')) {
    resetScrollProviderVarValue()
    setScrollProviderVarValue(router.currentRoute.value.fullPath as DynamicProviderKeys, window.scrollY)
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <template v-if="globalInitMap.currentTemplate == 4">
    <AppProviderWhite :key="loadValue" />
  </template>
  <template v-else-if="globalInitMap.currentTemplate == 6">
    <AppProviderNewDefault :key="loadValue" />
  </template>
  <template v-else>
    <AppProvider :key="loadValue" />
  </template>
</template>

<style lang="scss" scoped>
</style>

<route lang="yaml">
name: KeepAliveCasinoGroupProvider
meta:
  layout: home
</route>
