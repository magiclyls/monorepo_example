<script setup lang="ts">
import { defineAsyncComponent, onActivated, onDeactivated, provide, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppLoading from '~/components/AppLoading.vue'
import AppPageLayout from '~/components/AppPageLayout.vue'

defineOptions({ name: 'KeepAliveCasinoGroupCategory' })

const CategoryDetail = defineAsyncComponent(() => import('./_components/category-detail.vue'))

const title = ref('')

const route = useRoute()
const key = ref(route.fullPath)

let stopWatch: (() => void) | null = null

function startWatch() {
  stopWatch = watch(route, () => {
    if (route.fullPath.includes('/group/categor')) {
      key.value = route.fullPath
    }
  }, { immediate: true })
}

function stopWatching() {
  if (stopWatch) {
    stopWatch()
    stopWatch = null
  }
}

onActivated(() => {
  startWatch()
})

onDeactivated(() => {
  stopWatching()
})

function setTitle(v: string) {
  title.value = v
}

provide('setTitle', setTitle)
</script>

<template>
  <AppPageLayout :title="title" style="--ph-page-layout-padding-y:12rem;">
    <Suspense timeout="0">
      <CategoryDetail />
      <template #fallback>
        <AppLoading />
      </template>
    </Suspense>
  </AppPageLayout>
</template>
