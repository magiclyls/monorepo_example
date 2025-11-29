<script setup lang='ts'>
import type { CurrencyCode } from '~/composables/useCurrencyData'
import { ApiGameOriginalBetLimit } from '@tg/apis'

interface Props {
  modelValue: string
  disabled?: boolean
  currency: CurrencyCode
  amountError?: boolean
  hasMax?: boolean
  hasIcon?: boolean
  needEmit?: boolean
}
defineOptions({
  name: 'AppMiniGamePublicBetAmount',
})
const props = withDefaults(defineProps<Props>(), {
  disabled: undefined,
  hasMax: true,
  hasIcon: true,
  needEmit: true,
})
const emit = defineEmits(['input', 'update:modelValue', 'blur', 'update:amountError'])
const formDisabled = inject('formDisabled', ref(false))

const { t } = useI18n()
const { currentGlobalCurrencyBalanceNumber, isLogin } = storeToRefs(useAppStore())
const { floatingState, setFloatingTrue, setFloatingFalse } = useFloatingVue()
const { bool: isFocus } = useBoolean(false)
const { bool: betAmountError } = useBoolean(false)
const { isMaxBetAmount } = useMiniGameGlobalStateMaxBetAmount()

const amountErrorMsg = ref('')

const currencyId = computed(() => props.currency)
const currencyType = computed(() => getCurrencyConfigByCode(currencyId.value).name)
const decimalNum = computed(() => currencyConfig[currencyType.value].decimal)

/** 获取投注限额 */
const { data: betLimitData, runAsync: runGetOriginalGameBetLimit } = useRequest(() => ApiGameOriginalBetLimit(currencyId.value))

const _disabled = computed(() => props.disabled ?? formDisabled.value)
const betLimitMin = computed(() => betLimitData.value ? betLimitData.value[0] : 0)
const betLimitMax = computed(() => betLimitData.value ? betLimitData.value[1] : 10)
const step = computed(() => `0.${'0'.repeat(decimalNum.value - 1)}1`)

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
function onClickHalf() {
  emit('update:modelValue', application.formatNumDecimal(div(+props.modelValue, 2), decimalNum.value))
  setTimeout(() => {
    valiAmountBetLimit()
  }, 0)
}
function onClickDouble() {
  let str = mul(+props.modelValue, 2)
  if (+str > currentGlobalCurrencyBalanceNumber.value)
    str = currentGlobalCurrencyBalanceNumber.value.toString()

  emit('update:modelValue', application.formatNumDecimal(str, decimalNum.value))
  setTimeout(() => {
    valiAmountBetLimit()
  }, 0)
}
function onClickMax() {
  emit('update:modelValue', application.formatNumDecimal(currentGlobalCurrencyBalanceNumber.value.toString(), decimalNum.value))
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
  // 校验投注限额
  if (+props.modelValue > currentGlobalCurrencyBalanceNumber.value) {
    betAmountError.value = true
    amountErrorMsg.value = t('mini_more_than_balance')
    setTimeout(() => {
      setFloatingTrue()
    }, 0)
  }
  else if (+props.modelValue > betLimitMax.value) {
    betAmountError.value = true
    amountErrorMsg.value = `${t('mini_max_bet_amount')} ${betLimitMax.value}`
    setTimeout(() => {
      setFloatingTrue()
    }, 0)
  }
  else if (+props.modelValue < betLimitMin.value) {
    betAmountError.value = true
    amountErrorMsg.value = `${t('mini_min_bet_amount')} ${betLimitMin.value}`
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
  if (isFocus.value && isLogin.value)
    valiAmountBetLimit()
})
watch(() => props.currency, () => {
  runGetOriginalGameBetLimit().then(() => {
    if (isLogin.value)
      valiAmountBetLimit()
  })
})
watch(isLogin, (a) => {
  if (a)
    runGetOriginalGameBetLimit()
})
watch(betLimitMin, (a) => {
  if (!props.disabled)
    emit('update:modelValue', application.formatNumDecimal(a, decimalNum.value))
})

onMounted(() => {
  if (isLogin.value) {
    runGetOriginalGameBetLimit().then((res) => {
      if (res && props.needEmit)
        emit('update:modelValue', application.formatNumDecimal(res[0], decimalNum.value))
    })
  }
})

defineExpose({
  betAmountError,
  valiAmountBetLimit,
  double: onClickDouble,
  half: onClickHalf,
})
</script>

<template>
  <VTooltip :shown="floatingState" :triggers="[]" :auto-hide="false" placement="top">
    <div class="bg group w-full flex" :class="[_disabled ? 'cursor-not-allowed' : '']">
      <div class="relative w-full flex grow">
        <input
          :value="modelValue" type="number" inputmode="decimal" :disabled="_disabled" min="0" :step="step"
          class="text-tg-text-white focus:border-[var(--tg-border-color-deep-grey)] theme-border leading[1.5] w-full border-[2px] rounded-l-[4px] rounded-r-[0px] border-solid bg-[var(--app-mini-game-public-bet-amount-bg)] p-[7px] text-[14px] font-semibold duration-[0.25s]"
          :class="[
            _disabled ? 'cursor-not-allowed opacity-[0.5]' : 'cursor-text',
            !isFocus && betAmountError ? 'border-tg-text-error' : 'border-tg-secondary group-hover:border-[var(--tg-border-color-deep-grey)]',
            hasIcon ? 'pr-[28px] icon-right' : 'pr-[7px]',
          ]" @input="onInput" @focus="onFocus" @mouseenter="onMouseenter" @click.stop @mouseleave="onMouseleave"
          @blur="onBlur"
        >
        <slot name="icon-one">
          <AppCurrencyIcon
            style="--tg-app-currency-icon-size:16px" class="absolute right-[12px] top-[50%] translate-y-[-50%]"
            :currency-type="currencyType"
          />
        </slot>
      </div>
      <div class="border-theme-green flex items-center">
        <slot name="button-one">
          <BaseButton class="theme-btn1" :disabled="_disabled" style="--tg-base-button-border-radius:0;" size="sm" @click="onClickHalf">
            <span>½</span>
          </BaseButton>
        </slot>
        <div class="relative">
          <slot name="button-two">
            <BaseButton
              class="theme-btn1"
              :disabled="_disabled"
              :style="{ '--tg-base-button-border-radius': isMaxBetAmount ? '0' : '0  4px 4px 0' }" size="sm"
              @click="onClickDouble"
            >
              <span>2×</span>
            </BaseButton>
          </slot>
          <div class="theme-border1 absolute left-0 top-[25%] h-[22px] w-[2px] translate-x-[-50%]" />
        </div>
        <div v-if="isMaxBetAmount && hasMax" class="relative">
          <BaseButton
            class="theme-btn1"
            :disabled="_disabled" style="--tg-base-button-border-radius:0  4px 4px 0;" size="sm"
            @click="onClickMax"
          >
            <span class="whitespace-nowrap">{{ t('max_tag2') }}</span>
          </BaseButton>
          <div class="theme-border1 absolute left-0 top-[25%] h-[22px] w-[2px] translate-x-[-50%]" />
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

<style>
:root {
  --app-mini-game-public-bet-amount-bg: var(--tg-secondary-dark);
}
</style>

<style scoped lang="scss">
.theme-border {
  @include webTheme('green') {
    border: 1px solid #197b59;
    background-color: #02432d;
    border-right: none;
  }
  @include webTheme('white') {
    border: 1px solid transparent;
    background-color: white;
  }
  &:hover {
    @include webTheme('green') {
      border: 1px solid #5ecea6;
    }
    @include webTheme('white') {
      border: 1px solid #f2ca5c;
    }
  }
}
.theme-border1 {
  background-color: var(--tg-primary-main);
  @include webTheme('white') {
    background-color: #555;
  }
  @include webTheme('green') {
    background-color: #055434;
  }
}
.bg {
  border-radius: 4px;
  @include webTheme('white') {
    --tg-secondary-dark: #f5f5f5;
    --app-mini-game-public-bet-amount-bg: #f5f5f5;
    --tg-base-button-style-bg: #f2ca5c;
    --tg-base-button-line-border-color: #f2ca5c;
    span {
      color: #111;
    }
  }
}
.theme-btn1 {
  @include webTheme('white') {
    --tg-base-button-style-bg: #e8e8e8;
  }
  @include webTheme('green') {
    --tg-base-button-style-bg: #197b59;
    color: #fff;
  }
}
.border-theme-green {
  @include webTheme('green') {
    border: 1px solid #197b59;
    border-radius: 0 6px 6px 0;
  }
}
</style>
