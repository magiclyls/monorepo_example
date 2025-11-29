<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  titlePlacement?: 'left' | 'center' | 'right'
  offset?: string
  spacing?: string
  size?: string
}

defineOptions({ name: 'BaseDivider' })

const props = withDefaults(defineProps<Props>(), {
  titlePlacement: 'center',
  offset: '0rem',
})

const cssVars = computed(() => ({
  '--left-offset': props.titlePlacement === 'left' ? props.offset : '100%',
  '--right-offset': props.titlePlacement === 'right' ? props.offset : '100%', // 宽度
  '--divider-spacing': props.spacing ? `${props.spacing}rem` : 'var(--bg-divider-spacing)', // 文案水平margin
  '--divider-height': props.size ? `${props.size}rem` : 'var(--bg-divider-height)', // 线段高度
}))
</script>

<template>
  <div
    class="base-divider"
    :class="`title-${props.titlePlacement}`"
    :style="cssVars"
  >
    <div v-if="titlePlacement !== 'left'" class="line left" />
    <div v-if="$slots.default" class="title">
      <slot />
    </div>
    <div v-if="titlePlacement !== 'right'" class="line right" />
  </div>
</template>

<style>
:root {
  --bg-divider-height: 2rem;
  --bg-divider-spacing: 16rem;
  --tg-base-divider-bg-color: #ebebeb;
}
</style>

<style scoped lang="scss">
.base-divider {
  display: flex;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  height: 18.4rem;
  .line {
    flex: 1;
    height: var(--divider-height);
    background-color: var(--tg-base-divider-bg-color);
  }

  .left {
    width: var(--left-offset);
  }

  .right {
    width: var(--right-offset);
  }

  .title {
    color: inherit;
    margin: 0 var(--divider-spacing);
  }
}
</style>
