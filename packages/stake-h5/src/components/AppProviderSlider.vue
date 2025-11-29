<script lang="ts" setup>
import type { CasinoProviderItem } from '@tg/types'

interface Props {
  list: any[]
  title: string
  icon: string
}
defineOptions({
  name: 'AppProviderSlider',
})
defineProps<Props>()

const router = useLocalRouter()
const appStore = useAppStore()
const { theme } = storeToRefs(appStore)

function goPage(item: CasinoProviderItem) {
  if (item.maintained === '2')
    return
  router.push(`/casino/group/provider?vid=${item.venue_id ?? item.id}`)
}
</script>

<template>
  <AppSliderWg
    v-if="theme === 'greenblack'"
    :icon="icon"
    :title="title"
    :data="list"
    :show-view-all="false"
    game-type="provider"
    path="/casino/collection/provider"
    use-cloud-img
    :total="list?.length"
  >
    <template #item="{ item, loading }">
      <BaseProviderItem
        :url="item.img || item.logo || item.icon"
        :maintained="item.maintained" :loading="loading"
        @click="goPage(item)"
      />
    </template>
  </AppSliderWg>
  <AppSlider
    v-else
    :icon="icon"
    :title="title"
    :data="list"
    :show-view-all="false"
    game-type="provider"
    path="/casino/collection/provider"
    use-cloud-img
  >
    <template #item="{ item, loading }">
      <BaseProviderItem
        :url="item.img || item.logo || item.icon"
        :maintained="item.maintained" :loading="loading"
        @click="goPage(item)"
      />
    </template>
  </AppSlider>
</template>

<style lang="scss">
</style>
