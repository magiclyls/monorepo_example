<script lang="ts" setup>

</script>

<template>
  <div class="load-more-loading">
    <div class="dot dot-one">
    </div>
    <div class="dot dot-two">
    </div>
  </div>
</template>

<style scoped>
.load-more-loading {
  position: relative;
  display: flex;
  gap: 16px;
  padding-right: 6px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 1000px;
  background: rgba(255, 255, 255, 0.8);
  position: absolute;
}

.dot-one {
  animation: spin1 .8s infinite linear;
}

.dot-two {
  animation: spin1 .8s -.4s infinite linear;
}

@keyframes spin1 {

  0%,
  100% {
    transform: translateY(-50%) scale(.4);
  }

  25% {
    transform: translate(-1.15rem, -50%) scale(1);
  }

  50% {
    transform: translateY(-50%) scale(1.5);
  }

  75% {
    transform: translate(1.15rem, -50%) scale(1);
  }
}
</style>
