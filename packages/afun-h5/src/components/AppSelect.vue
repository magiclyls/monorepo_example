<script setup lang="ts">
import type { Placement } from 'floating-vue'
import { AfunBaseSelect } from '@tg/bccomponents'
import { computed } from 'vue'

type Align = 'center' | 'left'

interface IOption {
  label: string
  value: any
  [key: string]: any
}
interface Props {
  modelValue: any
  options: IOption[]
  itemAlign?: Align
  placeHolder?: string
  full?: boolean
  poperWidth?: number
  placement?: Placement
  options1noselect?: boolean
  autoSize?: boolean | string

}
const props = withDefaults(defineProps<Props>(), {
  itemAlign: 'center',
  full: false,
  options1noselect: true,
  autoSize: 'min',
})
const emit = defineEmits(['update:modelValue', 'change'])

const activeItem = computed(() => {
  return props.options.find(item => item.value === props.modelValue)
})

const computedValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})
</script>

<template>
  <div
    v-if="options.length === 1 && options1noselect"
    class="flex  items-center h-[var(--app-select-label-height)] px-[8px] rounded-[4px] bg-[#0F212E] border-solid border-1 border-[var(--app-select-label-border-color)]"
    :class="{ 'flex-1': full }"
  >
    <div
      v-if="$slots['item-icon']"
      style=" --ph-app-currency-icon-size:var(--app-select-label-icon-size)"
      class="mr-[var(--app-select-icon-gap)] w-[var(--app-select-label-icon-size)] h-[var(--app-select-label-icon-size)]"
    >
      <slot name="item-icon" v-bind="{ item: activeItem }" />
    </div>
    <span class="whitespace-nowrap font-[600]"> {{ activeItem?.label }}</span>
  </div>
  <AfunBaseSelect
    v-else
    v-model="computedValue"
    :options="options"
    :place-holder="placeHolder"
    :width="poperWidth"
    :auto-size="autoSize"
    :placement="placement"
    @change="(v) => emit('change', v)"
  >
    <template #label="{ data, isMenuShown }">
      <slot v-if="$slots.label" name="label" v-bind="{ data, isMenuShown }" />
      <div
        v-else
        class="flex  items-center h-[var(--app-select-label-height)] pl-[8px] pr-[26px] rounded-[4px] bg-[#0F212E] border-solid border-1 border-[var(--app-select-label-border-color)]"
        :class="[isMenuShown ? 'border-[var(--app-select-label-border-color-active)]' : 'border-[var(--app-select-label-border-color)]', full ? 'flex-1' : 'justify-between']"
      >
        <div
          v-if="$slots['item-icon'] && modelValue"
          style=" --ph-app-currency-icon-size:var(--app-select-label-icon-size)"
          class="mr-[var(--app-select-icon-gap)] w-[var(--app-select-label-icon-size)] h-[var(--app-select-label-icon-size)]"
        >
          <slot name="item-icon" v-bind="{ item: data }" />
        </div>
        <span v-if="placeHolder && !modelValue" class="text-[#9DABC9] font-[600]">{{ placeHolder }}</span>
        <span v-else class=" whitespace-nowrap font-[600]"> {{ data?.label }}</span>
      </div>
    </template>
    <template #option="{ item, active, index, hide }">
      <slot v-if="$slots.option" name="option" v-bind="{ item, active, index, hide }" />
      <div
        v-else
        class="select-item flex items-center"
        :class="{
          active,
          'last': index === options.length - 1,
          'justify-center': itemAlign === 'center',
        }"
      >
        <div
          v-if="$slots['item-icon']"
          style=" --ph-app-currency-icon-size:var(--app-select-item-icon-size)"
          class="mr-[var(--app-select-icon-gap)] w-[var(--app-select-item-icon-size)] h-[var(--app-select-item-icon-size)]"
        >
          <slot name="item-icon" v-bind="{ item }" />
        </div>
        <span class=" whitespace-nowrap font-[600]"> {{ item.label }}</span>
      </div>
    </template>
    <template #extra>
      <slot name="extra" />
    </template>
  </AfunBaseSelect>
</template>

<style>
:root {
  --app-select-icon-gap: 6px;
  --app-select-label-icon-size: 18px;
  --app-select-item-icon-size: 16px;
  --app-select-label-border-color: #2f4553;
  --app-select-label-border-color-active: #f23038;
  --app-select-label-height: 43px;
}
</style>

<style scoped lang="scss">
.select-item {
  width: 100%;
  padding: 0 8px;
  line-height: 32px;
  font-size: 14px;
  color: #0d2245;
  &.active {
    color: #15c16b;
  }
}
</style>
