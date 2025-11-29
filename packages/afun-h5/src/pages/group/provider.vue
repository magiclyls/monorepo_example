<script setup lang="ts">
import { Local } from '@tg/utils'
import { onActivated, provide, ref } from 'vue'
import AppLoading from '~/components/AppLoading.vue'
import AppPageLayout from '~/components/AppPageLayout.vue'
import ProviderDetail from './_components/provider-detail.vue'

defineOptions({ name: 'KeepAliveCasinoGroupProvider' })

const title = ref('')
const localQuery = ref(Local.get('CasinoGroupProviderQuery')?.value || location.search)
const loadValue = ref(1)

function setTitle(v: string) {
  title.value = v
}

onActivated(() => {
  if (localQuery.value === location.search)
    return

  localQuery.value = location.search
  Local.set('CasinoGroupProviderQuery', localQuery.value)
  loadValue.value++
})

provide('setTitle', setTitle)
</script>

<template>
  <AppPageLayout :title="title" style="--ph-page-layout-padding-y:12px;">
    <Suspense timeout="0">
      <ProviderDetail />
      <template #fallback>
        <AppLoading />
      </template>
    </Suspense>
  </AppPageLayout>
</template>
