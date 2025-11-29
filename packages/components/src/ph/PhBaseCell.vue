<script setup lang="ts">
import PhBaseArrow from './PhBaseArrow.vue'

const props = withDefaults(defineProps<{
  clickable?: boolean
  disabled?: boolean
  arrow?: boolean // 是否显示默认右箭头
  className?: string
}>(), {
  clickable: true,
  disabled: false,
  arrow: false,
})

const emit = defineEmits<{
  (e: 'click', ev: MouseEvent): void
}>()

function onClick(ev: MouseEvent) {
  if (props.disabled)
    return
  if (props.clickable)
    emit('click', ev)
}
</script>

<template>
  <div class="cell rounded-[8rem]">
    <div
      :role="clickable ? 'button' : undefined"
      tabindex="0"
      class="child flex justify-between items-center "
      @click="onClick"
    >
      <!-- 左侧标题 -->
      <div class="min-w-0 flex-1">
        <div class="text-[14rem] font-[500] leading-[20rem] mr-[10rem] text-[#0D2245]">
          <slot name="title" />
        </div>
      </div>

      <!-- 右侧自定义 + 默认箭头 -->
      <div class="flex gap-[10rem] items-center">
        <slot name="right" />
        <div v-if="arrow" class="flex items-center gap-[4rem] text-[#9DABC8]">
          <PhBaseArrow />
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>

<style>
:root {
  --ph-app-cell-background: #fff;
  --ph-app-cell-min-height: 46rem;
  --ph-app-cell-padding-x: 12rem;
  --ph-app-cell-padding-y: 8rem;
}
</style>

<style lang="scss" scoped>
.cell {
  background-color: var(--ph-app-cell-background);
  .child {
    min-height: var(--ph-app-cell-min-height);
    padding: var(--ph-app-cell-padding-y) var(--ph-app-cell-padding-x);
  }
}
</style>
