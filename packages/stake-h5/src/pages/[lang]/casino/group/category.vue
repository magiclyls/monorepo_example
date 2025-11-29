<script setup lang="ts">
import type { DynamicCategoryKeys } from '~/utils/scroll-var'

defineOptions({
  name: 'KeepAliveCasinoGroupCategory',
})

const router = useRouter()
const localQuery = ref<string>(Local.get('casinoGroupCategoryQuery')?.value || location.search)
const loadValue = ref(1)

function handleScroll() {
  if (router.currentRoute.value.path?.includes('/casino/group/category')) {
    resetScrollCategoryVarValue()
    setScrollCategoryVarValue(router.currentRoute.value.fullPath as DynamicCategoryKeys, window.scrollY)
  }
}

onActivated(() => {
  if (localQuery.value === location.search)
    return

  localQuery.value = location.search
  Local.set('casinoGroupCategoryQuery', localQuery.value)
  loadValue.value++
  console.log('重新刷新CateGory111')
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

watch(router.currentRoute, (n, o) => {
  const { cid: nCid } = n.query
  const { cid: oCid } = o.query

  const { path: nPath } = n
  const { path: oPath } = o

  if (nCid && oCid && (oCid !== nCid) && (nPath === oPath) && nPath?.includes('/casino/group/category')) {
    console.log('重新刷新CateGory222')
    localQuery.value = location.search
    Local.set('casinoGroupCategoryQuery', localQuery.value)
    loadValue.value++
  }
})
</script>

<template>
  <template v-if="globalInitMap.currentTemplate == 4">
    <AppCategoryWhite :key="loadValue" />
  </template>
  <!-- <template v-else-if="globalInitMap.currentTemplate == 6">
    <AppCategoryNewDefault :key="loadValue" />
  </template> -->
  <template v-else>
    <AppCategory :key="loadValue" />
  </template>
</template>

<style lang="scss" scoped>
</style>

<route lang="yaml">
name: KeepAliveCasinoGroupCategory
meta:
  layout: home
</route>
