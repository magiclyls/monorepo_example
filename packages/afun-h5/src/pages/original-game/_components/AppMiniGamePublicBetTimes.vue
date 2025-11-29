<script setup lang='ts'>
import { useBoolean, useFloatingVue } from '@tg/hooks'
import { IconUniInfinite } from '@tg/icons'
import { computed, inject, nextTick, ref } from 'vue'

interface Props {
  modelValue: number
  disabled?: boolean
  min?: number
  max?: number
}
defineOptions({
  name: 'AppMiniGamePublicBetTimes',
})
const props = withDefaults(defineProps<Props>(), {
  disabled: undefined,
  max: 999999999,
  min: 0,
})
const emit = defineEmits(['input', 'update:modelValue'])
const formDisabled = inject('formDisabled', ref(false))

const { floatingState, setFloatingTrue, setFloatingFalse } = useFloatingVue()
const { bool: isFocus } = useBoolean(false)

const isOverMax = computed(() => +props.modelValue > props.max)
const isUnderMin = computed(() => +props.modelValue < props.min)
const errorMsg = computed(() => {
  if (isOverMax.value)
    return `Maximum is "${props.max}"`

  else if (isUnderMin.value)
    return `Minimum is "${props.min}"`

  return ''
})
const betTimeError = computed(() => isOverMax.value || isUnderMin.value)
const _disabled = computed(() => props.disabled ?? formDisabled.value)
const isInfiniteBet = computed(() => +props.modelValue === 0 || !props.modelValue)

function onInput(e: any) {
  const v = e.target.value

  emit('input', Math.floor(v))
  emit('update:modelValue', Math.floor(v))

  nextTick(() => {
    if (betTimeError.value)
      setFloatingTrue()
    else
      setFloatingFalse()
  })
}
function onFocus() {
  isFocus.value = true
  if (betTimeError.value)
    setFloatingTrue()
}
function onBlur() {
  isFocus.value = false
}
function onMouseenter() {
  if (betTimeError.value)
    setFloatingTrue()
}
function onMouseleave() {
  if (!isFocus.value)
    setFloatingFalse()
}

defineExpose({ betTimeError })
</script>

<template>
  <VTooltip :shown="floatingState" :triggers="[]" :auto-hide="false" placement="top">
    <div class="group h-[40px] w-full flex" :class="[_disabled ? 'cursor-not-allowed' : '']">
      <div class="relative w-full flex grow">
        <input
          :value="modelValue" type="number" inputmode="decimal" :disabled="_disabled" min="0"
          class="bg-[#0f212e] theme-border leading[1.5] w-full rounded-[4px] p-[7px] text-[14px] font-semibold duration-[0.25s]"
          :class="[
            _disabled ? 'cursor-not-allowed opacity-[0.5]' : 'cursor-text',
            isInfiniteBet ? 'pr-[28px]' : '',
            !isFocus && betTimeError ? 'border-[#ed4163]' : '',
          ]"
          @input="onInput" @focus="onFocus" @mouseenter="onMouseenter" @click.stop @mouseleave="onMouseleave"
          @blur="onBlur"
        >
        <slot name="right-icon">
          <div class="flex items-center absolute right-[12px] top-[50%] translate-y-[-50%]">
            <IconUniInfinite v-show="isInfiniteBet" class="theme-icon" style="font-size: 16px;" />
          </div>
        </slot>
      </div>
    </div>
    <template #popper>
      <div class="tiny-menu-item-title">
        {{ errorMsg }}
      </div>
    </template>
  </VTooltip>
</template>

<style scoped lang="scss">
.theme-icon {
  color: #b1bad3;
}
.theme-border {
  border: 2px solid #557086;
  &:hover {
  }
}
</style>
