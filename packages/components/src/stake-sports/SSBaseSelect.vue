<script setup lang='ts'>
import type { Placement } from 'floating-vue'
import { useBoolean } from '@tg/hooks'
import { IconUniArrowDown, IconUniArrowDown1 } from '@tg/icons'
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
  disabled?: boolean
  autoSize?: boolean
  projectName?: string
}
defineOptions({ name: 'SSBaseSelect' })
const props = withDefaults(defineProps<Props>(), {
  placement: 'bottom',
  popperMaxHeight: '20em',
  autoSize: false,
  /** 先基于ph-h5的ui开发，所以默认ph-h5 */
  projectName: 'ph-h5',
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
    v-model:shown="isMenuShown" :distance="10" :placement="placement" :auto-size="width ? false : autoSize"
    :disabled="disabled" @apply-show="popperApplyShow" @hide="handleHide"
  >
    <slot name="label-outer" :data="selectedOption" :is-menu-shown="isMenuShown">
      <div class="label-wrap">
        <slot name="label" :data="selectedOption">
          <div class="label" :class="{ disabled }">
            <span v-if="placeHolder && !modelValue" class="text-[#9DABC9] font-[500]">{{ placeHolder }}</span>
            <span v-else>{{ selectedOption?.label }}</span>
          </div>
        </slot>
        <div
          class="text-[14rem] ml-[8rem] flex-none flex items-center duration-[0.35s]"
          :class="isMenuShown ? 'rotate-[-180deg]' : ''"
        >
          <IconUniArrowDown v-if="projectName === 'afun-h5'" class="text-[#b1bad3]" />
          <IconUniArrowDown1 v-else class="text-[#9DABC8]" />
        </div>
      </div>
    </slot>

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
                  <span>
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
  --ss-base-select-height: 40rem;
  --ss-base-select-padding: 0 11rem;
  --ss-base-select-background-color: #fff;
  --ss-base-select-label-color: #0d2245;
  --ss-base-select-font-size: 14rem;
  --ss-base-select-font-weight: 600;
  --ss-base-select-border-color: #ebebeb;
  --ss-base-select-border-radius: 6rem;
  --ss-base-select-item-color: #0d2245;
  --ss-base-select-item-active-color: #f23038;
}
</style>

<style lang='scss' scoped>
.label-wrap {
  border-radius: var(--ss-base-select-border-radius);
  border: 1px solid var(--ss-base-select-border-color);
  display: flex;
  height: var(--ss-base-select-height);
  align-items: center;
  position: relative;
  padding: var(--ss-base-select-padding);
  background-color: var(--ss-base-select-background-color);
}
.label {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  font-weight: var(--ss-base-select-font-weight);
  font-size: var(--ss-base-select-font-size);
  color: var(--ss-base-select-label-color);

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.item {
  width: 100%;
  padding: 8rem 16rem;
  display: flex;
  align-items: center;
  line-height: 22rem;
  font-weight: 600;
  font-size: 14rem;
  color: var(--ss-base-select-item-color);
  white-space: nowrap;

  &.active {
    color: var(--ss-base-select-item-active-color);
  }
}
</style>
