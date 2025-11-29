<script setup lang='ts'>
import { IconUniArrowUpSmall, IconUniArrowUpSmall2 } from '@tg/icons'
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
  const temp = floor(sub(+props.modelValue, props.step), 2).toFixed(2)
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
    amountErrorMsg.value = `${t('mini_max_bet_amount')} ${betLimitMax.value}`
    setTimeout(() => {
      setFloatingTrue()
    }, 0)
  }
  else if (+props.modelValue < betLimitMin.value) {
    betAmountError.value = true
    amountErrorMsg.value = `${t('big_equal_than', [betLimitMin.value])}`
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
    <div class="group bg w-full flex" :class="[_disabled ? 'cursor-not-allowed' : '']">
      <div class="relative w-full flex grow">
        <input
          :value="modelValue" type="number" inputmode="decimal" :disabled="_disabled" min="0" :step="step"
          class="theme-border leading[1.5] text-tg-text-white bg-tg-secondary-dark focus:border-[var(--tg-text-grey)] w-full border-[2px] rounded-l-[4px] rounded-r-[0px] border-solid p-[7px] pr-[7px] text-[14px] font-semibold duration-[0.25s]"
          :class="[
            _disabled ? 'cursor-not-allowed opacity-[0.5]' : 'cursor-text',
            !isFocus && betAmountError ? 'border-[var(--tg-text-error)]' : 'border-tg-secondary group-hover:border-[var(--tg-border-color-deep-grey)]',
          ]" @input="onInput" @focus="onFocus" @mouseenter="onMouseenter" @click.stop @mouseleave="onMouseleave"
          @blur="onBlur"
        >
      </div>
      <div class="flex items-center">
        <slot name="button-one">
          <BaseButton
            class="btn"
            size="sm"
            :disabled="+modelValue <= min || _disabled"
            @click="clickDown"
          >
            <IconUniArrowUpSmall />
          </BaseButton>
        </slot>
        <div class="relative">
          <slot name="button-two">
            <BaseButton
              class="btn"
              size="sm"
              :disabled="(max !== undefined && +max > 0 ? +modelValue >= max : false) || _disabled"
              @click="clickUp"
            >
              <IconUniArrowUpSmall2 :style="{'color': '#fff'}" />
            </BaseButton>
          </slot>
          <div class="line bg-tg-primary absolute left-0 top-[25%] h-[22px] w-[2px] translate-x-[-50%]" />
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
:root{
  --tg-theme-border-color:#FFEFB0;
  --tg-theme-border-width:2px;
}
.line{
  @include webTheme('white'){
    background-color: #555555;
  }
}
.theme-border{
  @include webTheme('white'){
    --tg-border-color-deep-grey:#F2CA5C;
    border-width: 1px;
  }
  @include webTheme('green'){
    border: 2px solid #0B6242;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.12), 0px 1px 3px 0px rgba(0, 0, 0, 0.20);
  }
  &:hover{
    @include webTheme('green'){
      border: var(--tg-theme-border-width) solid var(--tg-theme-border-color);
    }
  }
  &:focus{
    @include webTheme('white'){
      border-color: #F2CA5C;
    }
  }
}
.bg{
  .btn{
    --tg-base-button-border-radius: 0  4px 4px 0;
    --tg-icon-color: white
  }

  @include webTheme('white') {
    --tg-base-button-style-bg: #E3E3E3;
    --tg-base-button-line-border-color: #E3E3E3;
    --tg-secondary-dark:#fff;
    .btn{
      --tg-icon-color: black
    }
  }
  @include webTheme('green') {
    --tg-secondary-dark:#02432d;
    .btn{
      --tg-icon-color: white
    }
  }
}
</style>
