<script setup lang="ts">
import { useBoolean } from '@tg/hooks'
import { ref } from 'vue'

interface Props {
  count?: number // 展示的数字，大于 max 时显示为 max+，为 0 时隐藏；number
  max?: number // 展示封顶的数字值
}
defineOptions({
  name: 'SSBaseBadge',
})
const props = withDefaults(defineProps<Props>(), {
  count: 0,
  max: 99,
})

const { bool: showContent, setBool } = useBoolean(true)
const contentRef = ref()
</script>

<template>
  <div class="m-badge ">
    <span v-if="showContent" ref="contentRef">
      <slot />
    </span>
    <div
      v-show=" count !== 0 "
      class="m-badge-count"
      :class="{
        'small-num': count < 10,
      }"
      :title=" String(count)"
    >
      <span class="m-number">
        <span class="u-number">{{ count > max ? `${max}+` : count }}</span>
      </span>
    </div>
  </div>
</template>

<style>
:root {
  --ss-badge-font-size: 12rem;
  --ss-badge-padding-x: 6rem;
  --ss-badge-line-height: 1.5;
  --ss-badge-size: 8rem;
  --ss-badge-min-width: 1.8em;
  --ss-badge-height: auto;
  --ss-badge-border-radius: 10rem;
  --ss-badge-color: #fff;
  --ss-badge-background-color: #6d7693;
}
</style>

<style lang="scss" scoped>
.m-badge {
  line-height: 1;
  position: relative;
  width: fit-content;
  .u-status-dot {
    position: relative;
    top: -1px;
    display: inline-block;
    width: var(--ss-badge-size);
    height: var(--ss-badge-size);
    vertical-align: middle;
    border-radius: 50%;
  }
  .status-success {
    color: #1fff20;
    background-color: #1fff20;
  }
  .m-count {
    position: absolute;
    top: 0;
    inset-inline-end: 0;
    transform: translate(50%, -50%);
    transform-origin: 100% 0%;
  }
  .m-badge-count {
    position: absolute;
    top: 0;
    inset-inline-end: 0;
    transform: translate(65%, -50%);
    transform-origin: 100% 0%;
    overflow: hidden;
    padding: 0 var(--ss-badge-padding-x);
    z-index: auto;
    min-width: var(--ss-badge-min-width);
    height: var(--ss-badge-height);
    color: var(--ss-badge-color);
    font-size: var(--ss-badge-font-size);
    line-height: var(--ss-badge-line-height);
    white-space: nowrap;
    text-align: center;
    background: var(--ss-badge-background-color);
    border-radius: var(--ss-badge-border-radius);
    .m-number {
      position: relative;
      display: inline-block;
      font-weight: 600;
      .u-number {
        display: inline-block;
        margin: 0;
      }
    }
  }
}
</style>
