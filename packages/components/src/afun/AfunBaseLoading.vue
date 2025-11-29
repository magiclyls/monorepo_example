<script lang="ts" setup>
import { isFlutterApp } from '@tg/utils'
import { computed } from 'vue'

defineOptions({
  name: 'AfunBaseLoading',
})
const isFlutter = computed(() => isFlutterApp())
</script>

<template>
  <!-- <object type="image/svg+xml" data="/img/base-loading.svg" class="h-[12px] w-[76px]" /> -->
  <div class="relative" :class="[isFlutter && 'opacity-0']">
    <div class="loader top-[46%]">
      <div class="loader-animation" />
    </div>

    <div class="loader-wrap">
      <div class="wrap">
        <div class="content">
          <div class="loader top-[46%]">
            <div class="loader-animation" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrap {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.content {
  position: relative;
  height: 100%;
  width: 100%;
}

.loader-wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader {
  width: 76px;
  height: 12px;
  background-color: #2f4553; // var(--grey-400);
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  border-radius: 64px;
}

.loader .loader-animation {
  border-radius: 64px;
  position: absolute;
  background-color: white; // var(--white);
  top: 2px;
  bottom: 2px;
  animation: loader-slide 0.8s infinite;
  will-change: left, right;
}

.loader .loader-animation.no-animation-chromatic {
  animation-play-state: paused;
}

@keyframes loader-slide {
  0% {
    right: 64px;
    left: 2px;
  }

  5% {
    left: 2px;
  }

  50% {
    right: 2px;
    left: 64px;
  }

  55% {
    right: 2px;
  }

  to {
    right: 64px;
    left: 2px;
  }
}
</style>
