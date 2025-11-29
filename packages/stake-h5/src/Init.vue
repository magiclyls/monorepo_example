<script setup lang="ts">
import App from './App.vue'

const { isSportsMaintained } = storeToRefs(useSportsStore())

watch(isSportsMaintained, (_isSportsMaintained) => {
  if (_isSportsMaintained !== null)
    Local.set(STORAGE_SPORTS_IS_MAINTAINED, _isSportsMaintained)
})
</script>

<template>
  <App v-if="isSportsMaintained !== null" />
</template>
