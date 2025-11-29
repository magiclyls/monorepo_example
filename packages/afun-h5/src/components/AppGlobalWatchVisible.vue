<script setup lang="ts">
import { useAppStore, useCurrency } from '@tg/stores'
import { EventBusNames } from '@tg/types'
import { appEventBus } from '@tg/utils'
import { useDocumentVisibility } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'

defineOptions({
  name: 'AppGlobalWatchVisible',
})

const { isLogin } = storeToRefs(useAppStore())

const currencyStore = useCurrency()
const visibility = useDocumentVisibility()

watch(visibility, (n) => {
  if (n === 'visible' && isLogin.value) {
    currencyStore.initCurrencyList()
  }
  // 全局发射可见事件
  if (n === 'visible')
    appEventBus.emit(EventBusNames.APP_GLOBAL_VISIBILITY)
}, { immediate: true })
</script>

<template>
  <div />
</template>

<style scoped lang="scss">

</style>
