<script setup lang='ts'>
import { AfunBaseButton } from '@tg/bccomponents'
import { useBoolean, useFloatingVue } from '@tg/hooks'
import { IconUniArrowUpSmall, IconUniArrowUpSmall2 } from '@tg/icons'
import { application, sub } from '@tg/utils'
import { add, floor } from 'lodash'
import { computed, inject, nextTick, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  modelValue: string
  disabled?: boolean
  amountError?: boolean
  min?: number
  max?: number
  step?: number
}
defineOptions({
  name: 'AppNumberCount',
})
const props = withDefaults(defineProps<Props>(), {
  disabled: undefined,
  min: 0,
  step: 1,
})
const emit = defineEmits(['input', 'update:modelValue', 'blur', 'update:amountError'])
const formDisabled = inject('formDisabled', ref(false))
const decimalNum = ref(2)

const { t } = useI18n()
// const { isLogin } = storeToRefs(useAppStore())
const { floatingState, setFloatingTrue, setFloatingFalse } = useFloatingVue()
const { bool: isFocus } = useBoolean(false)
const { bool: betAmountError } = useBoolean(false)

const amountErrorMsg = ref('')

const _disabled = computed(() => props.disabled ?? formDisabled.value)
const betLimitMin = computed(() => props.min)
const betLimitMax = computed(() => props.max)
const step = computed(() => props.step)

function onInput(e: any) {
  let v = e.target.value
  if (+v < 0)
    v = 0
  emit('input', v)
  emit('update:modelValue', v)

  nextTick(() => {
    if (betAmountError.value)
      setFloatingTrue()

    else
      setFloatingFalse()
  })
}
function onFocus() {
  isFocus.value = true
  if (betAmountError.value)
    setFloatingTrue()
}
function onBlur() {
  isFocus.value = false
  emit('update:modelValue', application.formatNumDecimal(props.modelValue, decimalNum.value))
  emit('blur')
}
function clickDown() {
  const temp = floor(+sub(+props.modelValue, props.step), 2).toFixed(2)
  if (+props.modelValue <= props.min || _disabled.value)
    return
  emit('update:modelValue', temp)
  setTimeout(() => {
    valiAmountBetLimit()
  }, 0)
}
function clickUp() {
  const temp = floor(add(+props.modelValue, props.step)).toFixed(2)
  if ((props.max !== undefined && props.max > 0 && +props.modelValue >= props.max) || _disabled.value)
    return
  emit('update:modelValue', +props.modelValue < props.min ? `${props.min}` : temp)
  setTimeout(() => {
    valiAmountBetLimit()
  }, 0)
}
function onMouseenter() {
  if (betAmountError.value)
    setFloatingTrue()
}
function onMouseleave() {
  if (!isFocus.value)
    setFloatingFalse()
}
function valiAmountBetLimit() {
  if (betLimitMax.value !== undefined && +props.modelValue > +betLimitMax.value) {
    betAmountError.value = true
    amountErrorMsg.value = `${t('最大投注额')} ${betLimitMax.value}`
    setTimeout(() => {
      setFloatingTrue()
    }, 0)
  }
  else if (+props.modelValue < betLimitMin.value) {
    betAmountError.value = true
    amountErrorMsg.value = `${t('这里必须要大于或等于', [betLimitMin.value])}`
    setTimeout(() => {
      setFloatingTrue()
    }, 0)
  }
  else {
    betAmountError.value = false
    amountErrorMsg.value = ''
    setFloatingFalse()
  }
  emit('update:amountError', betAmountError.value)
}
watch(() => props.modelValue, () => {
  if (isFocus.value)
    valiAmountBetLimit()
})

onMounted(() => {
})

defineExpose({
  betAmountError,
  valiAmountBetLimit,
  up: clickUp,
  down: clickDown,
})
</script>

<template>
  <VTooltip :shown="floatingState" :triggers="[]" :auto-hide="false" placement="top">
    <div class="group bg w-full flex rounded-[4px] border border-[#2f4553] border-solid p-[4px]" :class="[_disabled ? 'cursor-not-allowed' : '']">
      <div class="relative w-full flex grow">
        <input
          :value="modelValue" type="number" inputmode="decimal" :disabled="_disabled" min="0" :step="step"
          class="theme-border leading[1.5] text-tg-text-white bg-tg-secondary-dark focus:border-tg-text-grey w-full border-0 p-7 pr-7 text-[14px] font-[600] duration-[0.25s]"
          :class="[
            _disabled ? 'cursor-not-allowed opacity-[0.5]' : 'cursor-text',
            !isFocus && betAmountError ? 'border-tg-text-error' : 'border-tg-secondary group-hover:border-tg-border-color-deep-grey',
          ]" @input="onInput" @focus="onFocus" @mouseenter="onMouseenter" @click.stop @mouseleave="onMouseleave"
          @blur="onBlur"
        >
      </div>
      <div class="flex items-center">
        <slot name="button-one">
          <AfunBaseButton
            class="btn mr-[2px]"
            type="none"
            :disabled="+modelValue <= min || _disabled"
            @click="clickDown"
          >
            <IconUniArrowUpSmall class="w-[14px] h-[14px] text-[#fff]" />
          </AfunBaseButton>
        </slot>
        <div class="relative">
          <slot name="button-two">
            <AfunBaseButton
              class="btn ml-[2px]"
              type="none"
              :disabled="(max !== undefined && +max > 0 ? +modelValue >= max : false) || _disabled"
              @click="clickUp"
            >
              <IconUniArrowUpSmall2 class="w-[14px] h-[14px] text-[#fff]" />
            </AfunBaseButton>
          </slot>
        </div>
      </div>
    </div>
    <template #popper>
      <div class="tiny-menu-item-title">
        {{ amountErrorMsg }}
      </div>
    </template>
  </VTooltip>
</template>

<style lang='scss' scoped>
:root {
  --tg-theme-border-color: #2f4553;
  --tg-theme-border-width: 2px;
}
.line {
}
.theme-border {
  &:hover {
  }
  &:focus {
  }
}
.bg {
  background-color: #0f212e;
  .btn {
    background-color: #2f4553;
    padding: 7px;
    border-radius: 8px;
    --afun-base-button-font-size: 14px;
  }
}
</style>
