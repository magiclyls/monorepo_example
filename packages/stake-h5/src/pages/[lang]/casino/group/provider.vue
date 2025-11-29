<script setup lang="ts">
import type { DynamicProviderKeys } from '~/utils/scroll-var'

defineOptions({
  name: 'KeepAliveCasinoGroupProvider',
})

const router = useRouter()
const localQuery = ref<string>(Local.get('casinoGroupProviderQuery')?.value || location.search)
const loadValue = ref(1)

function handleScroll() {
  if (router.currentRoute.value.path?.includes('/casino/group/provider')) {
    resetScrollProviderVarValue()
    setScrollProviderVarValue(router.currentRoute.value.fullPath as DynamicProviderKeys, window.scrollY)
  }
}

onActivated(() => {
  if (localQuery.value === location.search)
    return

  localQuery.value = location.search
  Local.set('casinoGroupProviderQuery', localQuery.value)
  loadValue.value++
  console.log('重新刷新111')
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

watch(router.currentRoute, (n, o) => {
  const { vid: nVid } = n.query
  const { vid: oVid } = o.query

  const { path: nPath } = n
  const { path: oPath } = o

  if (nVid && oVid && (oVid !== nVid) && (nPath === oPath) && nPath?.includes('/casino/group/provider')) {
    console.log('重新刷新222')
    localQuery.value = location.search
    Local.set('casinoGroupProviderQuery', localQuery.value)
    loadValue.value++
  }
})
</script>

<template>
  <template v-if="globalInitMap.currentTemplate == 4">
    <AppProviderWhite :key="loadValue" />
  </template>
  <!-- <template v-else-if="globalInitMap.currentTemplate == 6">
    <AppProviderNewDefault :key="loadValue" />
  </template> -->
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
