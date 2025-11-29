<script setup lang='ts'>
defineOptions({ name: 'BaseLoading' })
</script>

<template>
  <div class="base-loading" />
</template>

<style>
:root {
  --tg-base-loading-size: 44px;
}
</style>

<style lang='scss' scoped>
.base-loading {
  border-width: 4px;
  border-style: solid;
  border-color: rgb(36, 238, 137) rgba(36, 238, 137, 0.2) rgba(36, 238, 137, 0.2);
  border-image: initial;
  width: var(--tg-base-loading-size);
  height: var(--tg-base-loading-size);
  animation: ani-rotate 1s linear infinite;
  border-radius: 50%;
}

@keyframes ani-rotate {
  0% {
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(180deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
