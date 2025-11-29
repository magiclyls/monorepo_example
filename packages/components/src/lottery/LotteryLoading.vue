<script setup lang='ts'>
defineOptions({ name: 'LotteryLoading' })
</script>

<template>
  <div class="loading" />
</template>

 <style lang='scss' scoped>
.loading {
  display: block;
  position: relative;
  width: 6px;
  height: 10px;
  animation: rectangle infinite 1s ease-in-out -0.2s;
  background-color: var(--lottery-loading-color);
}

.loading:before,
.loading:after {
  position: absolute;
  width: 6px;
  height: 10px;
  content: '';
  background-color: var(--lottery-loading-color);
}

.loading:before {
  left: -14px;

  animation: rectangle infinite 1s ease-in-out -0.4s;
}

.loading:after {
  right: -14px;
  animation: rectangle infinite 1s ease-in-out;
}

@keyframes rectangle {
  0%,
  80%,
  100% {
    height: 20px;
    box-shadow: 0 0 var(--lottery-loading-color);
  }

  40% {
    height: 33px;
    box-shadow: 0 -20px var(--lottery-loading-color);
  }
}
</style>
