<script setup lang='ts'>
defineOptions({
  name: 'AppLoading',
})

const { height, fullScreen } = withDefaults(defineProps<Props>(), {
  fullScreen: true,
})
interface Props {
  height?: number
  fullScreen?: boolean
}
</script>

<template>
  <div class="w-full" :class="[{ 'loading-content-height': fullScreen }]">
    <div v-if="height && height > 0" class="content" :style="{ height: height && height > 0 ? `${height}px` : '100%' }">
      <BaseLoading />
    </div>
    <BaseAspectRatio v-else ratio="2/1">
      <div class="content">
        <BaseLoading />
      </div>
    </BaseAspectRatio>
  </div>
</template>

<style lang='scss' scoped>
.content{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
