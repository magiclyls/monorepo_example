<script setup lang='ts'>
import { BaseIcon } from '@tg/bccomponents'
import BaseSportsTab from '~/components/BaseSportsTab.vue'

interface Props {
  modelValue?: string | number
}

defineOptions({ name: 'AppSportsPagesTab' })
defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const tabList = [
  { label: 'Highlights', value: '1', icon: 'sports-rec', iconActColor: '#FF9820' },
  { label: 'Event Builder', value: '2', icon: 'uni-cal', iconActColor: '#BC4EFF' },
  { label: 'Bets Feed', value: '3', icon: 'uni-rows', iconActColor: '#67B6FF' },
]

function onItemClick(tab: IBaseTabItem) {
  emit('update:modelValue', tab.value)
}
</script>

<template>
  <BaseSportsTab :current="modelValue" :list="tabList" @item-click="onItemClick">
    <template #item="{ data: { item, active } }">
      <div class="item" :class="{ active }">
        <div
          class="mr-[8px] flex items-center text-[16px]"
          :style="[active ? `--tg-base-icon-color:${item.iconActColor};` : '']"
        >
          <BaseIcon :name="item.icon" />
        </div>
        {{ item.label }}
      </div>
    </template>
  </BaseSportsTab>
</template>

<style lang='scss' scoped>
.item {
  display: flex;
  align-items: center;
  background: #292d2e;
  padding: 0 12px;
  border-radius: 18px;
  text-transform: uppercase;
  font-weight: 700;

  &.active {
    color: #ffffff;
    background: #3a4142;
  }

  @media (hover: hover) and (pointer: fine) {
    &:not(.active):hover {
      cursor: pointer;
      background: #3a4142;
      transition: all 0.3s;
    }
  }
}
</style>
