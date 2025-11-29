<script setup lang='ts'>
import type { CasinoLobbyGameItem, CasinoProviderItem } from '@tg/types'

interface Props {
  data: {
    h5: CasinoLobbyGameItem[][]
    pc: CasinoLobbyGameItem[][]
  }
  title: string
  icon: string
}
defineOptions({
  name: 'AppCasinoLobbyProviderSliderWg',
})
const props = defineProps<Props>()

const { isMobile } = storeToRefs(useWindowStore())
const router = useLocalRouter()

const h5List = computed(() => props.data.h5 ? props.data.h5 : [])
const pcList = computed(() => {
  if (props.data.pc)
    return props.data.pc[0]

  return []
})

function goPage(item: CasinoProviderItem) {
  if (item.maintained === '2')
    return

  if (router.currentRoute.value.path.includes('/casino/group/provider'))
    router.replace(`/casino/group/provider?vid=${item.venue_id ?? item.id}`)
  else
    router.push(`/casino/group/provider?vid=${item.venue_id ?? item.id}`)
}
</script>

<template>
  <template v-if="isMobile">
    <AppSliderMultiLineWg
      v-if="h5List && h5List.length"
      :data="h5List" :title="title" :icon="icon"
      :total="h5List.length"
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
    </AppSliderMultiLineWg>
  </template>
  <AppProviderSlider v-else-if="pcList && pcList.length" :list="pcList" :title="title" :icon="icon" />
</template>

<style lang='scss' scoped>

</style>
