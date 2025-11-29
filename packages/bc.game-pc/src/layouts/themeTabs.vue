<script setup lang="ts">
import { BaseIcon } from '@tg/bccomponents'
import { ref } from 'vue'

defineOptions({
  name: 'LayoutThemeTabs',
})

const active = ref(0)
</script>

<template>
  <div class="mt-2 h-10 w-full cursor-pointer rounded-lg flex font-semibold p-0.5 bg-[#323738]">
    <div class="relative flex h-9 w-full">
      <div class="absolute top-0 h-9 rounded-lg bg-[#4a5354] transition-all ease-out w-1/2" :style="{ left: `${active * 50}%` }" />
      <div class="relative h-9 flex justify-center items-center w-1/2" @click="active = 0">
        <BaseIcon name="dark-theme" class="text-1rem]" />
        <span class="ml-1 text-white">黑暗</span>
      </div>
      <div class="relative h-9 flex justify-center items-center w-1/2" @click="active = 1">
        <BaseIcon name="light-theme" class="text-1rem]" />
        <span class="ml-1">灯光</span>
      </div>
    </div>
  </div>
</template>
