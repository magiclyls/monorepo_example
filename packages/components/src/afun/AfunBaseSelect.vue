<script setup lang='ts'>
import type { Placement } from 'floating-vue'
import { useBoolean } from '@tg/hooks'
import { IconUniArrowUpBig } from '@tg/icons'
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
  autoSize?: boolean | string
  centerItem?: boolean
  activeBackgroundColor?: string
  activeColor?: string
  shadowed?: boolean
}
defineOptions({ name: 'AfunBaseSelect' })
const props = withDefaults(defineProps<Props>(), {
  placement: 'bottom',
  popperMaxHeight: '20em',
  autoSize: 'min',
  activeColor: '#15C16B',
  activeBackgroundColor: 'transparent',
})
const emit = defineEmits(['update:modelValue', 'change'])

const { bool: isMenuShown, setBool } = useBoolean(false)

const selectedOption = computed(() => props.options.find(a => a.value === props.modelValue))

function popperApplyShow() {

}
function handleHide() {

}
function onOptionsClick(item: IOption) {
  if (item.disabled) {
    return false
  }
  emit('update:modelValue', item.value)
  emit('change', item.value)
}
defineExpose({
  setBool,
})
</script>

<template>
  <VDropdown
    v-model:shown="isMenuShown" :distance="10" :placement="placement" :auto-size="width ? false : 'min'"
    :style="$attrs.style" @apply-show="popperApplyShow"
    @hide="handleHide"
  >
    <div class="flex h-full items-center relative">
      <slot name="label" :data="selectedOption" :is-menu-shown="isMenuShown">
        <div class="label" :class="{ active: isMenuShown, shadow: shadowed }">
          <span v-if="placeHolder && !modelValue" class="text-[#9DABC9] font-[600]">{{ placeHolder }}</span>
          <span v-else>{{ selectedOption?.label }}</span>
        </div>
      </slot>
      <div
        class="arrow-icon"
      >
        <IconUniArrowUpBig class="text-[#B1BAD3] text-[10px] rotate-[180deg] transition-rotate duration-250" :class="isMenuShown ? 'rotate-[360deg]' : ''" />
      </div>
    </div>
    <template #popper="{ hide }">
      <slot name="popper" v-bind="{ options, hide, width, popperMaxHeight }">
        <div
          class="flex flex-col py-[6px] scroll-y hide-scroll-bar" :style="{
            'width': `${width}px`,
            'maxHeight': popperMaxHeight,
            '--afun-base-select-active-background-color': activeBackgroundColor,
            '--afun-base-select-active-color': activeColor,
          }"
        >
          <div v-for="item, index in options" :key="item.value" class="w-full" @click="onOptionsClick(item); hide()">
            <slot name="option" v-bind="{ item, hide, index, active: item.value === modelValue }">
              <div class="item" :class="{ active: item.value === modelValue, center: centerItem }">
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
  --afun-base-select-height: 43px;
  --afun-base-select-padding: 0 8px;
  --afun-base-select-background-color: #0f212e;
  --afun-base-select-label-color: #fff;
  --afun-base-select-font-size: 14px;
  --afun-base-select-font-weight: 600;
  --afun-base-select-border-color: #2f4553;
  --afun-base-select-border-color-focus: #557086;
  --afun-base-select-border-radius: 4px;
  --afun-base-select-arrow-icon-size: 14px;
  --afun-base-select-arrow-icon-right: 8px;
  --afun-base-select-arrow-icon-color: inherit;
  --afun-base-select-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.12);
}
</style>

<style lang='scss' scoped>
.label {
  width: 100%;
  border-radius: var(--afun-base-select-border-radius);
  border: 2px solid var(--afun-base-select-border-color);
  height: var(--afun-base-select-height);
  padding: var(--afun-base-select-padding);
  display: flex;
  align-items: center;
  font-weight: var(--afun-base-select-font-weight);
  font-size: var(--afun-base-select-font-size);
  color: var(--afun-base-select-label-color);
  background-color: var(--afun-base-select-background-color);
  &.shadow {
    box-shadow: var(--afun-base-select-shadow);
  }
  &.active {
    border-color: var(--afun-base-select-border-color-focus);
  }
}
.arrow-icon {
  font-size: var(--afun-base-select-arrow-icon-size);
  right: var(--afun-base-select-arrow-icon-right);
  flex: none;
  display: flex;
  align-items: center;
  top: 50%;
  transform: translateY(-50%);
  position: absolute;
  transition-duration: 0.35s;
  color: var(--afun-base-select-arrow-icon-color);
}

.item {
  width: 100%;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  line-height: 22px;
  font-weight: 600;
  font-size: 14px;
  color: #0d2245;
  &.center {
    justify-content: center;
  }
  &.active {
    background-color: var(--afun-base-select-active-background-color);
    color: var(--afun-base-select-active-color);
  }
}
</style>
