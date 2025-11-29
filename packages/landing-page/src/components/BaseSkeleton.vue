<script lang="ts" setup>
interface Props {
  bg?: string
  width?: string
  height?: string
  animated?: string
  rounded?: boolean
  br?: string
}

defineOptions({
  name: 'BaseSkeleton',
})

withDefaults(defineProps<Props>(), {
  bg: '#B1BAD3',
  width: '100%',
  height: '20rem',
  animated: 'ani-opacity',
  rounded: false,
  br: '4rem',
})
</script>

<template>
  <div
    class="skeleton"
    :style="{ width, height }"
    :class="[animated, rounded === true ? 'rounded' : '']"
  >
    <!-- 1 盒子 -->
    <div class="block" :style="{ 'backgroundColor': bg, 'border-radius': br ?? '4rem' }" />
    <!-- 2 闪烁效果 skeleton 伪元素 --->
  </div>
</template>

<style scoped lang="scss">
.skeleton {
  display: inline-block;
  position: relative;
  overflow: hidden;
  vertical-align: middle;
  .block {
    width: 100%;
    height: 100%;
  }
}
.ani-shan {
  &::after {
    content: '';
    position: absolute;
    animation: ani-shan 1.5s ease 0s infinite;
    top: 0;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      to left,
      rgba(128, 128, 128, 0) 0%,
      rgba(128, 128, 128, 0.7) 50%,
      rgba(128, 128, 128, 0) 100%
    );
    transform: skewX(-45deg);
  }
}
.ani-opacity {
  animation: ani-opacity 1.5s linear 0s infinite;
}
.rounded {
  border-radius: 50%;
}
@keyframes ani-opacity {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
}
@keyframes ani-shan {
  0% {
    left: -100%;
  }
  100% {
    left: 120%;
  }
}
</style>
