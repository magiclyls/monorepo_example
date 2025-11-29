<script setup lang="ts">
defineOptions({
  name: 'LayoutSidebar',
})
</script>

<template>
  <div class="sidebar">
    basemenu
  </div>
  <AppWatchHttp />
</template>

<style lang="scss">
.sidebar {
  position: fixed;
  width: 15rem;
  left: 0px;
  top: 3.75rem;
  bottom: 0px;
  z-index: 100;
  transition: 0.2s;
  background-color: #2a2d2e;
}
.side-fold .sidebar {
  width: 4.5rem;
}
</style>
