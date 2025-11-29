<script setup lang="ts">
import AppWithMenuHeader from '../components/AppWithMenuHeader.vue'
</script>

<template>
  <AppWithMenuHeader />
  <RouterView v-slot="{ Component }">
    <component :is="Component" class="page-content" />
  </RouterView>
</template>

<style scoped lang="scss">

</style>
