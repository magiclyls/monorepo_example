<script setup lang="ts">
import { EventBusNames } from '@tg/types'
import { appEventBus } from '@tg/utils'
import { useDocumentVisibility } from '@vueuse/core'
import { watch } from 'vue'

defineOptions({
  name: 'AppGlobalWatchVisible',
})

const visibility = useDocumentVisibility()

watch(visibility, (n) => {
  // 可见事件
  if (n === 'visible')
    appEventBus.emit(EventBusNames.APP_GLOBAL_VISIBILITY)
})
</script>

<template>
  <div />
</template>

<style scoped lang="scss">

</style>
