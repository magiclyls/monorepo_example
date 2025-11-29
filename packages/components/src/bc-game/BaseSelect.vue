<script lang="ts" setup>
import { useBoolean } from '@tg/hooks'
import { Dropdown as VDropdown } from 'floating-vue'
import {
  computed,
  ref,
} from 'vue'
import BaseEmpty from './BaseEmpty.vue'
import BaseInput from './BaseInput.vue'

interface Props {
  modelValue?: any
  options: {
    label: string
    value: any
    disabled?: boolean
    [key: string]: any
  }[]
  placement?: 'bottom' | 'bottom-start'
  popperStrategy?: 'fixed' | 'absolute'
  popperClass?: string
  distance?: number
  skidding?: number
  disabled?: boolean
  placeholder?: string
  popperSearch?: boolean
  popperSearchPlaceholder?: string
  emptyDescription?: string
  popPrevent?: boolean
  popperMaxHeight?: string
  width?: string
}
defineOptions({
  name: 'BaseSelect',
})
const props = withDefaults(defineProps<Props>(), {
  placement: 'bottom',
  popperStrategy: 'absolute',
  popperMaxHeight: '20rem',
  width: '25rem',
  popperSearch: true,
})
const emit = defineEmits(['update:modelValue', 'select', 'focus', 'popperHide'])
const popperSearchValue = ref('')
const {
  bool: isPopperOpen,
  setTrue: setPopperOpen,
  setFalse: setPopperClose,
} = useBoolean(false)

const popperOptions = computed(() => {
  if (props.popperSearch)
    return props.options.filter(a => a.label.toLowerCase().includes(popperSearchValue.value.toLowerCase()))

  return props.options
})
const selectedOption = computed(() =>
  props.options.find(a => a.value === props.modelValue))

/* function onChange(event: any) {
  const v = event.target.value

  if (v === props.modelValue)
    return

  emit('update:modelValue', v)
  emit('select', v)
} */
function onClickPopperItem(item: any, hide: () => void) {
  const v = item.value
  if (/* item.state === 2 ||  */item.disabled)
    return
  else if (v === props.modelValue)
    return
  hide()
  emit('update:modelValue', v)
  emit('select', v)
}
function onPopperOpen() {
  setPopperOpen()
  emit('focus')
}
function onVDropdownHide() {
  setPopperClose()
  emit('popperHide')
}
function popInnerTouchmove(e: TouchEvent) {
  if (props.popPrevent)
    e.preventDefault()
}
</script>

<template>
  <VDropdown
    :disabled="disabled" :strategy="popperStrategy"
    :distance="distance"
    :skidding="skidding"
    :placement="placement"
    :popper-class="[popperClass, 'select-dropdown']"
    :arrow="false"
    @hide="onVDropdownHide"
    @show="onPopperOpen"
  >
    <slot :selected-option="selectedOption" :is-open="isPopperOpen" />
    <template #popper="{ hide }">
      <slot name="popper" :hide="hide">
        <div :style="{ maxHeight: popperMaxHeight, width }" class="scroll-y  dropdown-layer bg-layer3 select-root flex flex-col min-h-[80vh]  sm:min-h-100 w-full" @touchmove="popInnerTouchmove">
          <div class="flex-1">
            <div v-if="popperSearch" class="top-0 text-base font-semibold flex items-center justify-between sticky z-20 pb-2 sm:pt-4 bg-layer3">
              <BaseInput v-model="popperSearchValue" name="username" class="top-search flex-1" :place-holder="popperSearchPlaceholder" search />
              <slot name="search-right" />
            </div>
            <template v-if="popperOptions.length > 0">
              <div
                v-for="item, i in popperOptions"
                :key="i"
                @click="onClickPopperItem(item, hide)"
              >
                <slot name="select-item" :item="item" :selected-option="selectedOption" :hide="hide" />
              </div>
            </template>
            <BaseEmpty v-else :description="emptyDescription" />
          </div>
          <slot name="footer" />
        </div>
      </slot>
    </template>
  </VDropdown>
</template>

<style lang="scss">
.v-popper__popper.select-dropdown.v-popper--theme-dropdown {
  .v-popper__inner {
    background: none;
    border: none;
    box-shadow: none;
  }
  .v-popper__arrow-container {
    display: none;
  }
}
@media (hover: hover) and (pointer: fine) and (min-width: 640px) {
  .select-item:hover,
  .fix-light-hover:hover {
    background-image: linear-gradient(0deg, var(--color-white-50) 0%, var(--color-white-50) 100%);
  }
}
</style>

<style lang="scss" scoped>
.select-root {
  color: var(--color-white);
}
</style>
