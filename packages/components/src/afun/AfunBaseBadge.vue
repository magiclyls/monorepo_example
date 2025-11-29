<script lang="ts" setup>
import { computed } from 'vue'

// value：要显示的数字或文本内容。
// max：可选，显示数字的最大值，超过该值时显示为 ${max}+。
// dot：可选，布尔值，是否以小红点的形式显示，无需具体数字。
interface Props {
  value?: number | string
  max?: number
  dot?: boolean
}

defineOptions({ name: 'AfunBaseBadge' })
const props = withDefaults(defineProps<Props>(), {
})

const displayValue = computed(() => {
  if (typeof props.value === 'number' && typeof props.max === 'number' && props.value > props.max) {
    return `${props.max}+`
  }
  return props.value
})
</script>

<template>
  <div class="badge-container">
    <slot />
    <span
      v-if="dot || value"
      class="badge"
    >
      <template v-if="!dot">
        {{ displayValue }}
      </template>
    </span>
  </div>
</template>

<style>
:root {
  --afun-base-badge-radius: 15px;
  --afun-base-badge-bg: #f23038;
  --afun-base-badge-color: #fff;
  --afun-base-badge-fontsize: 12px;
  --afun-base-badge-fontweight: 600;
}
</style>

<style scoped>
.badge-container {
  position: relative;
  display: inline-block;
}

.badge {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 18px;
  min-width: 22px;
  padding: 0 7px;
  font-size: var(--afun-base-badge-fontsize);
  font-weight: var(--afun-base-badge-fontweight);
  color: var(--afun-base-badge-color);
  background-color: var(--afun-base-badge-bg);
  border-radius: var(--afun-base-badge-radius);
  white-space: nowrap;
}
</style>
