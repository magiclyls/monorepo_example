<script setup lang="ts">
import AppMiniGameLoading from '../_components/AppMiniGameLoading.vue'
import AppMiniGamePlinko from './AppMiniGamePlinko.vue'

defineOptions({ name: 'OriginalGamePlinko' })
</script>

<template>
  <AppMiniGameLoading>
    <AppMiniGamePlinko />
  </AppMiniGameLoading>
</template>
