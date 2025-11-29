<script setup lang='ts'>
import type { CurrencyCode } from '@tg/types'
import { ApiGameOriginalBetLimit } from '@tg/apis'
import { PhBaseButton, PhBaseCurrencyIcon } from '@tg/bccomponents'
import { useBoolean, useFloatingVue } from '@tg/hooks'
import { useAppStore, useCurrency } from '@tg/stores'
import { application, div, getCurrencyConfig, mul } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, inject, nextTick, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useMiniGameGlobalStateMaxBetAmount } from '../composables/useMiniGameGlobalStateMaxBetAmount'

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
const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())
const { isLogin } = storeToRefs(useAppStore())
const { floatingState, setFloatingTrue, setFloatingFalse } = useFloatingVue()
const { bool: isFocus } = useBoolean(false)
const { bool: betAmountError } = useBoolean(false)
const { isMaxBetAmount } = useMiniGameGlobalStateMaxBetAmount()

const amountErrorMsg = ref('')

const currencyId = computed(() => props.currency)
const currencyType = computed(() => getCurrencyConfig(currencyId.value).name)
const decimalNum = computed(() => getCurrencyConfig(currencyType.value).decimal)
const currentGlobalCurrencyBalanceNumber = computed(() => +currentGlobalCurrencyMap.value.balance)

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
    amountErrorMsg.value = `${t('您的投注额不能大于余额')}!`
    setTimeout(() => {
      setFloatingTrue()
    }, 0)
  }
  else if (+props.modelValue > betLimitMax.value) {
    betAmountError.value = true
    amountErrorMsg.value = `${t('最大投注额')} ${betLimitMax.value}`
    setTimeout(() => {
      setFloatingTrue()
    }, 0)
  }
  else if (+props.modelValue < betLimitMin.value) {
    betAmountError.value = true
    amountErrorMsg.value = `${t('最小投注额')} ${betLimitMin.value}`
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
    <div class="bg group w-full flex hilo-bg" :class="[_disabled ? 'cursor-not-allowed' : '']">
      <div class="relative w-full flex grow">
        <input
          :value="modelValue" type="number" inputmode="decimal" :disabled="_disabled" min="0" :step="step"
          class="text-[#0D2245] focus:border-tg-border-color-deep-grey theme-border leading[1.5] w-full rounded-l-[4px] rounded-r-[0px] bg-[--app-mini-game-public-bet-amount-bg] p-[7rem] text-[13rem] font-semibold duration-[0.25s]"
          :class="[
            _disabled ? 'cursor-not-allowed opacity-[0.5]' : 'cursor-text',
            !isFocus && betAmountError ? 'border-tg-text-error' : 'border-tg-secondary group-hover:border-tg-border-color-deep-grey',
            hasIcon ? 'pr-[28rem] icon-right' : 'pr-[7rem]',
          ]" @input="onInput" @focus="onFocus" @mouseenter="onMouseenter" @click.stop @mouseleave="onMouseleave"
          @blur="onBlur"
        >
        <slot name="icon-one">
          <PhBaseCurrencyIcon
            style="--tg-app-currency-icon-size:16px" class="absolute right-[12rem] top-[50%] translate-y-[-50%]"
            :currency-type="currencyType"
          />
        </slot>
      </div>
      <div class="border-theme-green flex items-center">
        <slot name="button-one">
          <PhBaseButton
            class="btn-small mr-[2rem]" :disabled="_disabled" size="sm" @click="onClickHalf"
          >
            <span>½</span>
          </PhBaseButton>
        </slot>
        <div class="relative">
          <slot name="button-two">
            <PhBaseButton
              class="btn-small ml-[2rem] mr-[2rem]"
              :disabled="_disabled"
              :style="{ '--tg-base-button-border-radius': isMaxBetAmount ? '0' : '0  4px 4px 0' }" size="sm"
              @click="onClickDouble"
            >
              <span>2×</span>
            </PhBaseButton>
          </slot>
        </div>
        <div v-if="isMaxBetAmount && hasMax" class="relative">
          <PhBaseButton
            class="btn-small btn-max ml-[2rem]"
            :disabled="_disabled" style="--tg-base-button-border-radius:0  4px 4px 0;" size="sm"
            @click="onClickMax"
          >
            <span class="whitespace-nowrap">{{ t('最大值') }}</span>
          </PhBaseButton>
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
  --app-mini-game-public-bet-amount-bg: #0f212e;
}
</style>

<style scoped lang="scss">
.bg {
  border-radius: 4rem;
}
.btn-small {
  --ph-base-button-primary-background-color: #ebebeb;
  --ph-base-button-primary-text-color: #0d2245;
  --ph-base-button-padding-y: 4rem;
  --ph-base-button-padding-x: 7rem;
  --ph-base-button-font-size: 14rem;
}
.btn-max {
  --ph-base-button-primary-background-color: #f23038;
  --ph-base-button-primary-text-color: #fff;
  --ph-base-button-font-size: 12rem;
}
</style>
