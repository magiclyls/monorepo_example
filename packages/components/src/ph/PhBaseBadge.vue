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

defineOptions({ name: 'PhBaseBadge' })
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
  --ph-base-badge-radius: 15rem;
  --ph-base-badge-bg: #f23038;
  --ph-base-badge-color: #fff;
  --ph-base-badge-fontsize: 12rem;
  --ph-base-badge-fontweight: 600;
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
  height: 18rem;
  min-width: 22rem;
  padding: 0 7rem;
  font-size: var(--ph-base-badge-fontsize);
  font-weight: var(--ph-base-badge-fontweight);
  color: var(--ph-base-badge-color);
  background-color: var(--ph-base-badge-bg);
  border-radius: var(--ph-base-badge-radius);
  white-space: nowrap;
}
</style>
