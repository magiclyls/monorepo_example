<script setup lang="ts">
import { provide, reactive } from 'vue'
import { type ConfigProviderContext, configSymbol } from '../config'

const props = defineProps<ConfigProviderContext>()
const reactiveProps = reactive(props)

provide(configSymbol, reactiveProps)
</script>

<template>
  <slot />
</template>

<style lang="scss">
// ⚠️本地调试的时候才打开
// @import url('./SportsConfigProvider.afun-h5.global.css');
// @import url('./SportsConfigProvider.ph-h5.global.css');

.stake-sports-page-title {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 25rem;

  .left {
    display: flex;
    align-items: center;
    font-size: 18rem;
    color: var(--ss-spt-page-title-color1);
    font-weight: 600;
    gap: 8rem;
    line-height: 1.5;
  }

  .right {
    display: flex;
    align-items: center;
  }
}
.accordion-badge-wrap {
  --tg-badge-font-size: 12rem;
  margin-right: 16rem;
  display: flex;
}
</style>
