<script setup lang='ts'>
interface Props {
  label?: string
  required?: boolean
  layout?: 'horizontal' | 'vertical'
  rightText?: string // 右侧文本
  warnText?: string // 红色额外文本
}
defineOptions({ name: 'PhBaseLabel' })
withDefaults(defineProps<Props>(), {
  layout: 'vertical',
})
</script>

<template>
  <div :class="layout">
    <div class="w-full flex items-center justify-between">
      <div v-if="label" class="label">
        <span>{{ label }}</span>
        <span v-if="required" class="text-[#F23038] text-[12rem] ml-[5rem]">*{{ warnText }}</span>
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
  --ph-base-label-font-size: 14rem;
  --ph-base-label-font-weight: 500;
  --ph-base-label-color: #0d2245;
  --ph-base-label-margin-bottom: 5rem;
  --ph-base-label-line-height: 20rem;
  --ph-base-label-right-text-color: #6d7693;
  --ph-base-label-right-text-font-weight: 500;
  --ph-base-label-right-text-font-size: 14rem;
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
  font-size: var(--ph-base-label-font-size);
  font-weight: var(--ph-base-label-font-weight);
  color: var(--ph-base-label-color);
  margin-bottom: var(--ph-base-label-margin-bottom);
  line-height: var(--ph-base-label-line-height);
}
.rightText {
  color: var(--ph-base-label-right-text-color);
  font-size: var(--ph-base-label-right-text-font-size);
  font-weight: var(--ph-base-label-right-text-font-weight);
}
</style>
