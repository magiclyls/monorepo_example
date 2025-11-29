<script setup lang='ts'>
import type { Component } from 'vue'
import { computed, nextTick, ref } from 'vue'
import BaseImage from '../BaseImage.vue'

interface Props {
  modelValue: string | number
  list: {
    label: string
    value: string | number
    icon?: Component | string
    disabled?: boolean
    [k: string]: any
  }[]
}

defineOptions({ name: 'SSBaseTabs2' })
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
  <div class="w-full max-w-full">
    <div class="tab-wrap scroll-x">
      <div class="flex">
        <div
          v-for="item, i in _list" :key="item.value" class="tab" :class="{ active: item.active, disabled: item.disabled }"
          @click="onClickHandler(item.value, i)"
        >
          <div class="w-[28rem] h-[28rem] mb-[4rem]">
            <BaseImage v-if="item.icon && typeof item.icon === 'string'" :url="item.icon" />
          </div>
          <span>{{ item.label }}</span>
          <div class="line" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.tab-wrap {
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 6rem;
  color: #6d7693;
  font-size: 12rem;
  font-weight: 500;
  position: relative;
  padding-bottom: 6rem;
  cursor: pointer;
  line-height: 12rem;

  .line {
    width: 28rem;
    height: 2rem;
    border-radius: 10px;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  &.active {
    color: #f23038;

    .line {
      background-color: #f23038;
    }
  }
  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>
