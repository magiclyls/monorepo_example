<script setup lang="ts">
import type { PropType } from 'vue'
import BaseImage from '../../../components/src/BaseImage.vue'

defineProps({
  title: {
    type: String,
    required: true,
  },
  details: {
    type: Array as PropType<string[]>,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: false,
  },
})
</script>

<template>
  <div class="relative overflow-hidden cursor-pointer rounded-lg p-2 bg-[#323738] group">
    <div
      v-if="tag"
      class="absolute z-10 font-semibold left-0 top-0 px-2 rounded-br-xl rounded-tl-xl bg-gradient-to-tr from-[#E15A0F] to-[#F7931A] py-0.5 text-xs text-white"
    >
      {{ tag }}
    </div>
    <div class="font-semibold">
      <div class="rounded-lg bg-[#3A4142] flex flex-none center h-12">
        <BaseImage class="max-h-[90%] max-w-[90%]" :url="image" />
      </div>
      <div class="mt-2 text-white overflow-hidden text-ellipsis whitespace-nowrap">
        {{ title }}
      </div>
      <div v-for="detail in details" :key="detail" class="text-secondary text-xs text-[#B3BEC1]">
        {{ detail }}
      </div>
    </div>
  </div>
</template>
