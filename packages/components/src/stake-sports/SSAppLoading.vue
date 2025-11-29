<script setup lang='ts'>
import BaseAspectRatio from '../bc-game/BaseAspectRatio.vue'
import SSBaseLoading from './SSBaseLoading.vue'

defineOptions({
  name: 'SSAppLoading',
})

const { height, fullScreen } = withDefaults(defineProps<Props>(), {
  fullScreen: true,
})
interface Props {
  height?: number
  fullScreen?: boolean
  projectName?: string
}
</script>

<template>
  <div class="w-full" :class="[{ 'loading-content-height': fullScreen }]">
    <div v-if="height && height > 0" class="content" :style="{ height: height && height > 0 ? `${height}rem` : '100%' }">
      <SSBaseLoading :project-name="projectName" />
    </div>
    <BaseAspectRatio v-else ratio="2/1">
      <div class="content">
        <SSBaseLoading :project-name="projectName" />
      </div>
    </BaseAspectRatio>
  </div>
</template>

<style>
:root {
  --ph-loading-content-height: calc(100vh - 50rem);
}
</style>

<style lang='scss' scoped>
.loading-content-height {
  height: var(--ph-loading-content-height);
}
.content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
