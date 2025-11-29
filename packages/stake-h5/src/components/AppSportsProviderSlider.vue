<script lang="ts" setup>
import type { ProviderItem } from '@tg/types'

interface Props {
  list: ProviderItem[]
  modelValue: string
}
defineOptions({
  name: 'AppSportsProviderSlider',
})
defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'change'])

function onClick(item: ProviderItem) {
  if (item.maintained === '2')
    return
  emit('update:modelValue', item.id)
  emit('change', item.id)
}
</script>

<template>
  <AppSlider
    :title="$t('sports_provider') "
    :data="list"
    :show-view-all="false"
    :show-arrow="false"
  >
    <template #default="{ item }">
      <BaseProviderItem
        :url="item.logo"
        :active="item.id === modelValue"
        show-bg
        :maintained="item.maintained"
        @click="onClick(item)"
      />
    </template>
  </AppSlider>
</template>

<style lang="scss">
</style>
