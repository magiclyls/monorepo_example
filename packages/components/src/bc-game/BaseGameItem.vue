<script setup lang="ts">
interface Props {
  bgImage: string // 背景图片URL
  size?: [string, string] // 卡片尺寸
  showHoverMask?: boolean // 是否显示悬浮蒙层
}

withDefaults(defineProps<Props>(), {
  size: () => ['9.0625rem', '12.0625rem'],
  bgImage: '',
  showHoverMask: true,
})
</script>

<template>
  <div
    class="base-card"
    :style="{
      width: size[0],
      height: size[1],
      backgroundImage: `url(${bgImage})`,
    }"
  >
    <div class="card-content">
      <div class="bottom-right-slot">
        <slot name="bottom-right" />
      </div>
      <div v-if="showHoverMask" class="hover-mask">
        <slot name="hover-content" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.base-card {
  position: relative;
  border-radius: 0.5rem;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #232626;
  overflow: hidden;

  .card-content {
    position: absolute;
    width: 100%;
    height: 100%;

    .bottom-right-slot {
      position: absolute;
      right: 0.5rem;
      bottom: 0.5rem;
    }

    .hover-mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      opacity: 0;
      transition: opacity 0.3s ease;
      cursor: pointer;
      color: #fff;
    }
  }

  &:hover {
    .hover-mask {
      opacity: 1;
    }
  }
}
</style>
