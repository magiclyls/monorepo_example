<script lang="ts" setup>
import Footer from './footer.vue'
</script>

<template>
  <div>
    <RouterView v-slot="{ Component }">
      <component :is="Component" />
    </RouterView>
    <Footer />
  </div>
</template>

<style>
:root {
  --header: 3.5rem;
  --footrt: 0rem;
  --safe-bottom: 0rem;
}
</style>

<style scoped>
.page-content {
  transform-origin: 50% 50vh;
  padding-top: var(--header);
  padding-bottom: calc(var(--footer) + var(--safe-bottom));
}
</style>
