<script setup lang='ts'>
import { useTemplateRefsList } from '@vueuse/core'
import { nextTick, ref } from 'vue'
import BaseSportsTabScrollWrap from '~/components/BaseSportsTabScrollWrap.vue'

interface Props {
  current?: string
  list: {
    label: string
    value: string | number
  }[]
}

defineOptions({ name: 'BaseSportsTab' })
const props = defineProps<Props>()
const emit = defineEmits(['itemClick'])

const refs = useTemplateRefsList<HTMLDivElement>()

const lastIndex = ref(props.list.findIndex(a => a.value === props.current))
const maxIndex = ref(props.list.length - 1)

function clickHandler(tab: IBaseTabItem, i: number) {
  if (tab.value === void 0 || tab.value === props.current)
    return

  emit('itemClick', tab)

  nextTick(() => {
    /** 点击的元素进入视口 */
    // const index = props.list.findIndex(a => a.value === tab.value)
    // curTabRef.value[index]?.scrollIntoView({
    //   behavior: 'smooth',
    //   block: 'nearest',
    //   inline: 'nearest',
    // })

    /** 点击之后第二个元素要进入视口 */
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
    refs.value[nextOneIndex]?.scrollIntoView({
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
  <BaseSportsTabScrollWrap>
    <div class="h-[32px] inline-block whitespace-nowrap align-top">
      <div class="flex">
        <div
          v-for="t, i in list" :key="t.value" :ref="refs.set" class="tab"
          @click="clickHandler(t, i)"
        >
          <slot name="item" :data="{ item: t, active: current === t.value }">
            {{ t.label }}
          </slot>
        </div>
      </div>
    </div>
  </BaseSportsTabScrollWrap>
</template>

<style lang='scss' scoped>
.tab {
  color: #b3bec1;
  height: 32px;
  position: relative;
  font-size: 12px;
  box-sizing: border-box;
  font-weight: 700;
  line-height: 16px;
  margin-right: 8px;
  border-radius: 18px;
  letter-spacing: 2px;
  transition: all 0.3s;
  display: flex;

  &:last-of-type {
    margin-right: 0;
  }
}
</style>
