<script setup lang="ts">
import BaseArrow from './BaseArrow.vue'

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
  <div class="cell rounded-[4px]">
    <div
      :role="clickable ? 'button' : undefined"
      tabindex="0"
      class="child flex justify-between items-center "
      @click="onClick"
    >
      <!-- 左侧标题 -->
      <div class="min-w-0 flex-1">
        <div class="text-[14px] font-[500] leading-[20px] mr-[10px]">
          <slot name="title" />
        </div>
      </div>

      <!-- 右侧自定义 + 默认箭头 -->
      <div class="flex gap-[10px] items-center">
        <slot name="right" />
        <div v-if="arrow" class="flex items-center gap-[4px] text-[#fff]">
          <BaseArrow />
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>

<style>
:root {
  --app-cell-background: transparent;
  --app-cell-min-height: 46px;
  --app-cell-padding-x: 12px;
  --app-cell-padding-y: 8px;
  --app-cell-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.12);
}
</style>

<style lang="scss" scoped>
.cell {
  background-color: var(--app-cell-background);
  // box-shadow: var(--app-cell-box-shadow);
  cursor: pointer;
  line-height: 30px;
  &.hover{
    background-color: var(--tg-secondary-main);
  }
  .child {
    min-height: var(--app-cell-min-height);
    padding: var(--app-cell-padding-y) var(--app-cell-padding-x);
  }
}
</style>
