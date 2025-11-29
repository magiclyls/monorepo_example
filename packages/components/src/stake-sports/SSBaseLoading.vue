<script lang="ts" setup>
import { computed } from 'vue'
import { Vue3Lottie } from 'vue3-lottie'
import dataJson from './betmax3.json'

interface Props {
  projectName?: string
}

defineOptions({
  name: 'SSBaseLoading',
})
const props = defineProps<Props>()

// Afun项目
const isAfunH5 = computed(() => props.projectName === 'afun-h5')
</script>

<template>
  <div class="flex flex-col">
    <Vue3Lottie v-if="isAfunH5" :animation-data="dataJson" :width="100" />
    <span v-else class="text-[13rem] text-[var(--ss-base-loading-text-color)] whitespace-nowrap">
      Loading...
    </span>
  </div>
</template>

<style>
:root {
  --ss-base-loading-text-color: #333;
}
</style>
