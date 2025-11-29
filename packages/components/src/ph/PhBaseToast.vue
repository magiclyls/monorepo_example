<script setup lang="ts">
import type { VNode } from 'vue'

defineProps<{
  toasts: { id: number, content: string | VNode }[]
}>()
</script>

<template>
  <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] space-y-2 w-[312rem]">
    <TransitionGroup name="fade" tag="div" class=" flex flex-col items-center">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="text-white text-[12rem] font-[500] py-[12rem] bg-black/75 rounded-[6rem] text-left mb-[1rem] inline-block max-w-screen w-auto" :class="[
          typeof toast.content === 'string' ? 'px-[20rem]' : 'px-[12rem]',
        ]"
      >
        <component :is="toast.content" v-if="typeof toast.content !== 'string'" />
        <span v-else>{{ toast.content }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
