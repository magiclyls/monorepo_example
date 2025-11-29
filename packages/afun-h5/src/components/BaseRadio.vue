<script setup lang='ts'>
import type { ComputedRef } from 'vue'
import { useBoolean } from '@tg/hooks'
import { onClickOutside } from '@vueuse/core'
import { computed, inject, ref } from 'vue'

interface Props {
  value: string | number
}
defineOptions({
  name: 'BaseRadio',
})
const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits(['click'])

const onSelect = inject<(v: string | number) => void>('onSelect', () => {})
const sValue = inject<ComputedRef<string | number>>('sValue')
const shape = inject('shape')
const disabled = inject('disabled')

const isChecked = computed(() => props.value === sValue?.value)

const { bool, setTrue, setFalse } = useBoolean(false)
const outerRef = ref()
onClickOutside(outerRef, () => {
  setFalse()
})

function onCheck() {
  if (disabled)
    return

  setTrue()
  emit('click', props.value)
  onSelect(props.value)
}
</script>

<template>
  <div
    ref="outerRef"
    class="base-radio"
    :class="{ disabled, active: isChecked, focus: bool }"
    @click="onCheck"
  >
    <span class="icon" :class="[shape]">
      <span v-if="shape === 'circle'" class="dot" />
      <span v-else class="hook" />
    </span>
    <slot />
  </div>
</template>

<style lang="scss">
:root {
  --tg-base-radio-style-just-content: flex-start;
  --tg-base-radio-style-flex-direction: row;
  --tg-base-radio-style-color: #b1bad3;
  --tg-base-radio-style-width: 20px;
  --tg-base-radio-style-dot-bg: #fff;
  --tg-base-radio-text-active-color: var(--tg-base-radio-style-color);
  --tg-base-radio-icon-border-color: #2f4553;
  --tg-base-radio-icon-hover-border-color: #557086;
  --tg-base-radio-icon-active-border-color: #557086;
}
</style>

<style lang='scss' scoped>
.base-radio {
  color: var(--tg-base-radio-style-color);
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: var(--tg-base-radio-style-just-content);
  flex-direction: var(--tg-base-radio-style-flex-direction);

  .circle {
    border-radius: 50%;

    .dot {
      border-radius: 50%;
      width: 8px;
      height: 8px;
      background-color: var(--tg-base-radio-style-dot-bg);
      display: none;
    }
  }

  .square {
    border-radius: 4rem;

    .hook {
      width: var(--tg-base-radio-style-width);
      height: var(--tg-base-radio-style-width);
      background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNy4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgOCA4IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA4IDgiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTYuNCwxTDUuNywxLjdMMi45LDQuNUwyLjEsMy43TDEuNCwzTDAsNC40bDAuNywwLjdsMS41LDEuNWwwLjcsMC43bDAuNy0wLjdsMy41LTMuNWwwLjctMC43TDYuNCwxTDYuNCwxeiINCgkvPg0KPC9zdmc+DQo=');
      background-size: 75%;
      background-repeat: no-repeat;
      background-position: center center;
      display: none;
    }
  }

  .icon {
    width: var(--tg-base-radio-style-width);
    height: var(--tg-base-radio-style-width);
    transition: all ease 0.25s;
    box-shadow:
      0 1px 3px 0 rgba(0, 0, 0, 0.2),
      0 1px 2px 0 rgba(0, 0, 0, 0.122);
    cursor: pointer;
    border-width: 2px;
    border-style: solid;
    border-color: var(--tg-base-radio-icon-border-color);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    color: var(--tg-base-radio-text-active-color);
    .icon {
      border-color: var(--tg-base-radio-icon-hover-border-color);
    }
  }
}

.active {
  .icon {
    border-color: var(--tg-base-radio-icon-hover-border-color);
    background-color: var(--tg-base-radio-icon-active-border-color);
    .dot {
      display: inline-block;
    }

    .hook {
      display: block;
    }
  }
}

.disabled {
  cursor: not-allowed;
  opacity: 0.5;

  &:hover {
    .icon {
      cursor: not-allowed;
      border-color: #557086;
    }
  }
}
</style>
