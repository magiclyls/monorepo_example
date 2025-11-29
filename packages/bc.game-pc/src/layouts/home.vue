<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import Header from './header.vue'
import Sidebar from './sidebar.vue'

defineOptions({
  name: 'LayoutHome',
})

const transitionName = ref('')
/* 首次刷新不执行过度 */
onMounted(() => {
  setTimeout(() => {
    transitionName.value = 'slide'
  }, 1000)
})
</script>

<template>
  <Header />
  <Sidebar />
  <div class="page-root">
    <RouterView v-slot="{ Component }">
      <transition :name="transitionName">
        <component :is="Component" class="page-content" />
      </transition>
    </RouterView>
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
.page-root {
  margin-left: 240px;
}
.side-fold .page-root {
  margin-left: 72px;
}
.page-content {
  width: 100%;
  max-width: 1248px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
  transform-origin: 50% 50vh;
  padding-top: var(--header);
  padding-bottom: calc(var(--footer) + var(--safe-bottom));
}
.slide-enter-active {
  animation: slide-in 0.25s;
}

@keyframes slide-in {
  0% {
    transform: translateY(2%);
  }

  100% {
    transform: translateY(0);
  }
}
</style>
