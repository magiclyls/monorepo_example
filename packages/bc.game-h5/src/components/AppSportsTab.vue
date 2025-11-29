<script setup lang='ts'>
import { BaseIcon } from '@tg/bccomponents'
import BaseSportsTab from '~/components/BaseSportsTab.vue'

interface Props {
  modelValue?: string | number
  list: {
    label: string
    value: string | number
  }[]
}

defineOptions({ name: 'AppSportsTab' })

defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

function onItemClick(tab: IBaseTabItem) {
  emit('update:modelValue', tab.value)
}
</script>

<template>
  <BaseSportsTab :current="modelValue" :list="list" @item-click="onItemClick">
    <template #item="{ data: { item, active } }">
      <div class="item" :class="{ active }">
        <div class="text-[22px] flex items-center mr-[4px]">
          <BaseIcon :has-transition="false" :name="item.icon" />
        </div>
        {{ item.label }}
      </div>
    </template>
  </BaseSportsTab>
</template>

<style lang='scss' scoped>
.item {
  color: #fff;
  border-radius: 18px;
  padding: 0 12px;
  background: #292d2e;
  display: flex;
  align-items: center;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  line-height: 16px;

  &.active {
    color: #000;
    background: #24ee89;
    --tg-base-icon-color: #000;
  }
}
</style>
