<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  prefix?: string
  name: string
  hasTransition?: boolean
}

defineOptions({
  name: 'BaseIcon',
})

const props = withDefaults(defineProps<Props>(), {
  prefix: 'icon',
  hasTransition: true,
})

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>

<template>
  <svg
    class="app-svg-icon"
    :class="{ 'has-transition': hasTransition }"
  >
    <use :xlink:href="symbolId" />
  </svg>
</template>

<style>
:root {
  --tg-base-icon-color: rgb(179 190 193);
}
</style>

<style lang="scss" scoped>
.app-svg-icon {
  display: inline-block;
  color: var(--tg-base-icon-color);
  width: 1em;
  height: 1em;
  pointer-events: none;
  stroke-width: 0;
  flex-shrink: 0;
  fill: currentColor;
  stroke: currentColor;
  &.has-transition {
    transition: all ease 0.25s;
  }
}
</style>
