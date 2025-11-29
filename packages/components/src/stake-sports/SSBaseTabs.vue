<script setup lang='ts'>
import type { Component } from 'vue'
import { computed, nextTick, ref } from 'vue'

interface Props {
  modelValue: string | number
  list: {
    label: string
    value: string | number
    icon?: Component
    disabled?: boolean
    [k: string]: any
  }[]
  full?: boolean
  center?: boolean
}

defineOptions({ name: 'SSBaseTabs' })
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'change'])

const curTabRef = ref<Array<Element | null>>([])
const lastIndex = ref(props.list.findIndex(a => a.value === props.modelValue))
const maxIndex = ref(props.list.length - 1)

const _list = computed(() => props.list.map((a) => {
  return {
    ...a,
    active: a.value === props.modelValue,
  }
}))

function onClickHandler(v: string | number, i: number) {
  emit('update:modelValue', v)
  emit('change', v)

  nextTick(() => {
    // 点击之后第二个元素要进入视口
    let nextOneIndex = i
    // 右边
    if (i > lastIndex.value) {
      if (i === maxIndex.value)
        nextOneIndex = i
      else
        nextOneIndex = i + 1
    }
    // 左边
    else {
      if (i === 0)
        nextOneIndex = i
      else
        nextOneIndex = i - 1
    }
    curTabRef.value[nextOneIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    })
    // 记录下标
    lastIndex.value = i
  })
}
</script>

<template>
  <div class="base-tab" :class="{ center }">
    <div class="base-tab-wrap" :class="{ full }">
      <div class="flex">
        <div
          v-for="item, i in _list" :key="item.value" :ref="el => curTabRef[i] = (el as Element)" class="tab"
          :class="{ active: item.active, disabled: item.disabled }" @click="onClickHandler(item.value, i)"
        >
          <component :is="item.icon" v-if="item.icon" class="mr-[8rem]" />
          <span>{{ item.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --ss-base-tab-background-color: #fff;
  --ss-base-tab-item-padding: 12rem 20rem;
  --ss-base-tab-active-background-color: #f23038;
  --ss-base-tab-active-text-color: #fff;
  --ss-base-tab-text-color: #0d2245;
}
</style>

<style lang="scss" scoped>
.base-tab {
  display: flex;
  max-width: 100%;
  padding: 5rem;
  background-color: var(--ss-base-tab-background-color);
  border-radius: 100rem;
}
.base-tab-wrap {
  overflow-y: hidden;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
}

.tab {
  flex: 1;
  flex-shrink: 0;
  padding: var(--ss-base-tab-item-padding);
  font-size: 14rem;
  font-weight: 600;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100px;
  line-height: 20rem;
  color: var(--ss-base-tab-text-color);

  &.active {
    color: var(--ss-base-tab-active-text-color);
    background-color: var(--ss-base-tab-active-background-color);
  }
  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}

.full {
  flex: 1;
}

.center {
  justify-content: center;
}
</style>
