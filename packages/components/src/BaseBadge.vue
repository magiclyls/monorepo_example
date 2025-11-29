<script lang="ts" setup>
import { computed } from 'vue'

// value：要显示的数字或文本内容。
// max：可选，显示数字的最大值，超过该值时显示为 ${max}+。
// dot：可选，布尔值，是否以小红点的形式显示，无需具体数字。
// fang：可选，是否为方形。
// type：可选，徽标的类型，用于设置不同的样式。
interface Props {
  value?: number | string
  max?: number
  dot?: boolean
  fang?: boolean
  type?: 'primary' | 'success' | 'warning' | 'danger'
}

const props = withDefaults(defineProps<Props>(), {
  fang: true,
})

const displayValue = computed(() => {
  if (typeof props.value === 'number' && typeof props.max === 'number' && props.value > props.max) {
    return `${props.max}+`
  }
  return props.value
})

const typeClass = computed(() => {
  const text = ((props.type ? `badge--${props.type}` : '') + (props.fang ? ` fang` : ''))
  return text
})
</script>

<template>
  <div class="badge-container">
    <slot />
    <span
      v-if="dot || value"
      class="badge" :class="[typeClass]"
    >
      <template v-if="!dot">
        {{ displayValue }}
      </template>
    </span>
  </div>
</template>

<style scoped>
.badge-container {
  position: relative;
  display: inline-block;
}

.badge {
  position: absolute;
  top: -1px;
  right: -8px;
  transform: translate(50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  min-width: 20px;
  padding: 0 8px;
  font-size: 12px;
  color: #000;
  background-color: #aee485;
  border-radius: 10px;
  white-space: nowrap;
}

.badge--primary {
  background-color: #409eff;
}

.badge--success {
  background-color: #67c23a;
}

.badge--warning {
  background-color: #e6a23c;
}

.badge--danger {
  background-color: #f56c6c;
}

.fang {
  border-radius: 5px;
}
.badge:empty {
  display: none;
}
</style>
