<script lang="ts" setup>
import Footer from './footer.vue'
import Header from './header.vue'
</script>

<template>
  <div>
    <Header />
    <RouterView v-slot="{ Component }">
      <component :is="Component" class="page-content" />
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
