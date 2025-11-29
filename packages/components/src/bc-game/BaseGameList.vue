<script lang="ts" setup>
import { computed } from 'vue'

defineOptions({
  name: 'BaseGameList',
})
const props = withDefaults(defineProps<Props>(), {
  columnsNum: 8,
  xGap: 8,
  yGap: 0,
  isScroll: false,
})
interface Props {
  isScroll?: boolean // 是否展示1行带滚动
  columnsNum?: number // 列数
  xGap?: number // 横向间距
  yGap?: number // 纵向间距
}
const calculationStyle = computed(() => {
  if (props.isScroll) {
    return {
      '--grid-row': 1,
      '--grid-padding': 0,
      '--grid-gap-x': `${props.xGap}px`,
      '--grid-gap-y': `${props.yGap}px`,
    }
  }
  else {
    return {
      'grid-template-columns': `repeat(8, 145px)`,
      '--grid-gap-x': `${props.xGap}px`,
      '--grid-gap-y': `${props.yGap}px`,
      '--grid-row-height': `${props.cardHeight}px`,
      '--grid-col-width': `${props.cardWidth}px`,
    }
  }
})

const calculationClass = computed(() => {
  return ['game-list grid grid-flow-col', { 'overflow-x-scroll': props.isScroll }]
})
</script>

<template>
  <div class="mt-4" />
  <div :class="calculationClass" :style="calculationStyle">
    <slot />
  </div>
</template>

<style  scoped>
.grid {
  display: grid;
}
.game-list {
  grid-template-rows: repeat(var(--grid-rows), minmax(var(--grid-row-height), 1fr));
  grid-auto-columns: var(--grid-col-width);
  column-gap: var(--grid-gap-x);
  row-gap: var(--grid-gap-y);
  scroll-padding-inline: var(--grid-padding);
  padding: 0 var(--grid-padding);
}
.grid-flow-col {
  grid-auto-flow: column;
}
.overflow-x-scroll {
  overflow-x: scroll;
}
</style>
