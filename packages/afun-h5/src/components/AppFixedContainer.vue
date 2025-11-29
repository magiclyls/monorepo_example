<script setup lang="ts">
import { isFlutterApp } from '@tg/utils'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppDollarRainCountdown from '~/components/AppDollarRainCountdown.vue'
import AppPromoHotGate from '~/components/AppPromoHotGate.vue'

defineOptions({
  name: 'AppFixedContainer',
})
const route = useRoute()

const isHome = computed(() => route.name === 'Home' || route.path === '/')
</script>

<template>
  <div id="fixed-container">
    <div class="pointer-events-auto">
      <div class="rightbar flex flex-col gap-[40px]">
        <AppDollarRainCountdown v-if="!isFlutterApp() && isHome " />
        <AppPromoHotGate v-if="!isFlutterApp() && isHome" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#fixed-container {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: var(--pc-max-width);
  height: 100%;
  z-index: 99;
  pointer-events: none;
}
.rightbar {
  position: absolute;
  right: 0;
  bottom: 75px;
}
</style>
