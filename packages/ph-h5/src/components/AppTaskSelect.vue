<script setup lang='ts'>
import type { Placement } from 'floating-vue'
import { useBoolean } from '@tg/hooks'
import { IconTaskSelectArrowDown } from '@tg/icons'
import { computed } from 'vue'

interface IOption {
  label: string
  value: any
  [key: string]: any
}

interface Props {
  modelValue: any
  options: IOption[]
  placement?: Placement
  width?: number
  placeHolder?: string
  popperMaxHeight?: string
  autoSize?: boolean
}
defineOptions({ name: 'AppTaskSelect' })
const props = withDefaults(defineProps<Props>(), {
  placement: 'bottom',
  popperMaxHeight: '20em',
  autoSize: true,
})
const emit = defineEmits(['update:modelValue', 'change'])

const { bool: isMenuShown } = useBoolean(false)

const selectedOption = computed(() => props.options.find(a => a.value === props.modelValue))

function popperApplyShow() {

}
function handleHide() {

}
function onOptionsClick(item: IOption) {
  emit('update:modelValue', item.value)
  emit('change', item.value)
}
</script>

<template>
  <VDropdown
    v-model:shown="isMenuShown" :distance="10" :placement="placement"
    @apply-show="popperApplyShow" @hide="handleHide"
  >
    <div class="flex h-full items-center relative">
      <div class="label">
        <span v-if="placeHolder && !modelValue" class="text-[#9DABC9] font-[500]">{{ placeHolder }}</span>
        <span v-else class="mr-[4rem]">{{ selectedOption?.label }}</span>
        <div
          class="text-[14rem] text-[#9DABC8] flex-none flex items-center  duration-[0.35s]"
        >
          <IconTaskSelectArrowDown :class="isMenuShown ? 'rotate-[-180deg]' : ''" />
        </div>
      </div>
    </div>
    <template #popper="{ hide }">
      <slot name="popper" v-bind="{ options, hide, width, popperMaxHeight }">
        <div
          class="flex flex-col py-[4rem] scroll-y hide-scroll-bar" :style="{
            width: `${width}rem`,
            maxHeight: popperMaxHeight,
          }"
        >
          <div v-for="item, index in options" :key="item.value" class="w-full" @click="onOptionsClick(item); hide()">
            <slot name="option" v-bind="{ item, hide, index, active: item.value === modelValue }">
              <div class="item" :class="{ active: item.value === modelValue }">
                <slot name="item" v-bind="{ item, hide, index, active: item.value === modelValue }">
                  <span class=" whitespace-nowrap">
                    {{ item.label }}
                  </span>
                </slot>
              </div>
            </slot>
          </div>
          <slot name="extra" />
        </div>
      </slot>
    </template>
  </VDropdown>
</template>

<style>
:root {
  --ph-base-select-height: 40rem;
  --ph-base-select-padding: 0 8rem;
  --ph-base-select-background-color: transparent;
  --ph-base-select-label-color: #0d2245;
  --ph-base-select-font-size: 14rem;
  --ph-base-select-font-weight: 600;
  --ph-base-select-border-color: #ebebeb;
  --ph-base-select-border-radius: 6rem;
}
</style>

<style lang='scss' scoped>
.label {
  width: 100%;
  border-radius: var(--ph-base-select-border-radius);
  border: 1px solid var(--ph-base-select-border-color);
  height: var(--ph-base-select-height);
  padding: var(--ph-base-select-padding);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--ph-base-select-font-weight);
  font-size: var(--ph-base-select-font-size);
  color: var(--ph-base-select-label-color);
  background-color: var(--ph-base-select-background-color);
}

.item {
  width: 100%;
  padding: 8rem 16rem;
  display: flex;
  align-items: center;
  line-height: 22rem;
  font-weight: 600;
  font-size: 14rem;
  color: #0d2245;

  &.active {
    background-color: #f23038;
    color: #fff;
  }
}
</style>
