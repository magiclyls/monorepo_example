<script setup lang='ts'>
interface Props {
  label?: string
  required?: boolean
  layout?: 'horizontal' | 'vertical'
  rightText?: string // 右侧文本
  warnText?: string // 红色额外文本
}
defineOptions({ name: 'AfunBaseLabel' })
withDefaults(defineProps<Props>(), {
  layout: 'vertical',
})
</script>

<template>
  <div :class="layout">
    <div class="w-full flex items-center justify-between">
      <div v-if="label" class="label">
        <span>{{ label }}</span>
        <span v-if="required" class="text-[#ED4163] text-[12px] ml-[5px]">*{{ warnText }}</span>
      </div>
      <div v-if="rightText" class="rightText">
        <span>{{ rightText }}</span>
      </div>
    </div>

    <slot />
  </div>
</template>

<style>
:root {
  --afun-base-label-font-size: 14px;
  --afun-base-label-font-weight: 600;
  --afun-base-label-color: #b1bad3;
  --afun-base-label-margin-bottom: 5px;
  --afun-base-label-line-height: 20px;
  --afun-base-label-right-text-color: #b1bad3;
  --afun-base-label-right-text-font-weight: 600;
  --afun-base-label-right-text-font-size: 14px;
}
</style>

<style lang='scss' scoped>
.vertical {
}
.horizontal {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.label {
  font-size: var(--afun-base-label-font-size);
  font-weight: var(--afun-base-label-font-weight);
  color: var(--afun-base-label-color);
  margin-bottom: var(--afun-base-label-margin-bottom);
  line-height: var(--afun-base-label-line-height);
}
.rightText {
  color: var(--afun-base-label-right-text-color);
  font-size: var(--afun-base-label-right-text-font-size);
  font-weight: var(--afun-base-label-right-text-font-weight);
}
</style>
