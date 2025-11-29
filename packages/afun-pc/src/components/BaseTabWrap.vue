<script setup lang='ts'>
import { computed, nextTick, ref } from 'vue'

interface TabItem {
  label: string
  value: string | number
  [k: string]: any
}

interface Props {
  list: TabItem[]
  active: string | number
}

defineOptions({ name: 'BaseTabWrap' })
const props = defineProps<Props>()
const emit = defineEmits(['itemClick'])

const curTabRef = ref<Array<Element | null>>([])
const lastIndex = ref(props.list.findIndex((a: any) => a.value === props.active))
const maxIndex = ref(props.list.length - 1)

const _list = computed(() => {
  return props.list.map((a) => {
    return {
      ...a,
      active: a.value === props.active,
    }
  })
})

function onItemClick(item: TabItem, index: number) {
  emit('itemClick', item)

  // 自动滚入视口
  nextTick(() => {
    // 点击之后第二个元素要进入视口
    let nextOneIndex = index
    // 右边
    if (index > lastIndex.value) {
      if (index === maxIndex.value)
        nextOneIndex = index
      else
        nextOneIndex = index + 1
    }
    // 左边
    else {
      if (index === 0)
        nextOneIndex = index
      else
        nextOneIndex = index - 1
    }
    curTabRef.value[nextOneIndex]?.scrollIntoView({
      behavior: 'smooth', block: 'nearest', inline: 'nearest',
    })
    // 记录下标
    lastIndex.value = index
  })
}
</script>

<template>
  <div class="flex w-full overflow-x-scroll hide-scrollbar">
    <div v-for="item, index in _list" :ref="(el: any) => curTabRef[index] = (el as Element)" :key="item.value"
      @click="onItemClick(item, index)">
      <slot name="item" v-bind="{ item, index }">
        {{ item.label }}
      </slot>
    </div>
  </div>
</template>

<style lang='scss' scoped></style>
