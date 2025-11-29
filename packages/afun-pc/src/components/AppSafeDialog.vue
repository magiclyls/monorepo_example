<script setup lang='ts'>
import type { IMemberBalanceLockerUpdate } from '@tg/types'

import type { CurrencyData } from '~/composables/useCurrencyData'
import { ApiMemberBalanceLockerUpdate, ApiMemberInterestConfig } from '@tg/apis'

defineOptions({
  name: 'AppSafeDialog',
})
const props = withDefaults(defineProps<{
  showBottom: boolean
  needAwait: boolean
  activeTab: 'deposit' | 'withdraw'
}>(), {
  showBottom: true,
  needAwait: true,
})

const emits = defineEmits(['change'])

const { t } = useI18n()
const appStore = useAppStore()
const { currentGlobalCurrency, isLogin } = storeToRefs(appStore)
const brandStore = useBrandStore()
const { isMobile } = storeToRefs(useWindowStore())
const {
  renderBalanceList,
} = useCurrencyData()
const { openNotify } = useNotify()
const { openRegisterDialog } = useRegisterDialog()

const activeCurrency = ref<CurrencyData>()

// const activeTab = ref('deposit')
// const tabOptions = [
//   { label: t('deposit'), value: 'deposit' },
//   { label: t('menu_title_settings_withdrawals'), value: 'withdraw' },
// ]
const amountRef = ref()
const password = ref('')
const passwordRef = ref()
const _curGlobalCurrency = computed(() => isLogin.value ? currentGlobalCurrency.value : appStore.getLanguageCurrency())
const maxAmount = ref('0.00')

// 获取利率
const { data: interestConfig, runAsync: runAsyncInterestConfig } = useRequest(ApiMemberInterestConfig, {
  debounceInterval: 1000,
  debounceOptions: {
    leading: true,
    trailing: false,
  },
})

const { getComponent } = useUserVerify()
const {
  value: amount,
  errorMessage: errAmount,
  resetField: resetAmount,
  validate: validateAmount,
  setValue: setAmount,
} = useField<string>('amount', (value) => {
  if (!isLogin.value)
    return ''
  if (!value)
    return t('min_amount_0')
  else if (Number(value) <= 0)
    return t('min_amount_0')
  else if (activeCurrency.value && Number(value) > Number(activeCurrency.value?.balance))
    maxNumber()
    // return t('validate_deposit_amount_max')
  return ''
})

const currency_code = computed(() => (getCurrencyConfig(_curGlobalCurrency.value)).cur)
const isDeposit = computed(() => props.activeTab === 'deposit')
const updateType = computed(() => isDeposit.value ? 1 : 2)
const updateParams = computed<IMemberBalanceLockerUpdate | null>(() => {
  if (activeCurrency.value) {
    return {
      amount: amount.value,
      flag: updateType.value,
      currency_id: Number(activeCurrency.value.cur),
      device: 0,
    }
  }
  return null
})
// 当前币种配置
const vaultFig = computed(() => {
  return interestConfig.value ? interestConfig.value.rate : { interest_rate: 0, min_deposit: 0, bill_time: 0 }
})

const billTime = computed(() => {
  if (vaultFig.value && vaultFig.value.bill_time) {
    const _billTime = +(vaultFig.value.bill_time || 0) // 秒
    const hour = Math.floor(_billTime / 60 / 60)
    const day = Math.floor(hour / 24)

    if (hour < 24) {
      if (hour <= 1)
        return t('time_hour')
      else
        return t('time_hour', { delta: hour })
    }
    if (day <= 1)
      return t('quantos_dias')
    else
      return t('quantos_dias', { delta: day })
  }

  return 0
})

function renderSvg(text: string) {
  return `<svg aria-hidden="true" style="width:14px;height:14px;margin: 0 5px;">
          <use xlink:href="#icon-coin-${text}"/>
        </svg>`
}
const {
  run: runLockerUpdate,
  loading: lockerUpdateLoading,
} = useRequest(ApiMemberBalanceLockerUpdate, {
  ready: isLogin,
  async onSuccess() {
    openNotify({
      title: isDeposit.value
        ? t('finance_other_tab_vault_deposit')
        : t('finance_other_tab_vault_withdrawal'),
      icon: 'navbar-wallet-notify',
      message: isDeposit.value
        ? t('success_deposit', {
            amount: updateParams.value?.amount,
            icon: activeCurrency.value ? renderSvg(activeCurrency.value.type.toLocaleLowerCase()) : '',
          })
        : t('confirm_draw_vault', {
            amount: updateParams.value?.amount,
            icon: activeCurrency.value ? renderSvg(activeCurrency.value.type.toLocaleLowerCase()) : '',
          }),
    })
    reset()
    appStore.getBalanceData()
    appStore.getLockerData()
    passwordRef.value?.resetPassword()
  },
})

async function handleUpdate() {
  if (!isLogin.value) {
    openRegisterDialog()
    return
  }
  amountRef.value.setTouchTrue()
  if (passwordRef.value)
    passwordRef.value.setTouchTrue()
  await validateAmount()
  if (isDeposit.value) {
    if (!errAmount.value && updateParams.value) {
      if (Number(amount.value) < Number(vaultFig.value?.min_deposit ?? 0)) {
        openNotify({
          title: t('finance_other_tab_vault_deposit'),
          type: 'error',
          message: t('currency_min_deposit_amount', { amount: vaultFig.value?.min_deposit, icon: activeCurrency.value ? renderSvg(activeCurrency.value.type.toLocaleLowerCase()) : '' }),
        })
      }
      else {
        runLockerUpdate(updateParams.value)
      }
    }
  }
  else {
    await passwordRef.value.validatePassword()
    if (!errAmount.value && !passwordRef.value.errPassword && updateParams.value)
      runLockerUpdate({ ...updateParams.value, password: password.value, auth_type: +passwordRef.value.authType })
  }
}
function changeCurrency(item: CurrencyData) {
  const config = getCurrencyConfig(_curGlobalCurrency.value)
  item = item ?? { type: _curGlobalCurrency.value, balance: '0.00', balanceWithSymbol: '0.00', cur: config.cur, prefix: config.prefix } as CurrencyData
  runAsyncInterestConfig({ cur: item?.cur ?? currency_code.value })
  activeCurrency.value = item

  reset()
  emits('change', item)
}
function maxNumber() {
  if (!isLogin.value)
    return
  if (activeCurrency.value && isDeposit.value)
    setAmount(application.formatNumDecimal(activeCurrency.value.balance, currencyConfig[activeCurrency.value.type].decimal))

  else if (activeCurrency.value && !isDeposit.value)
    setAmount(application.formatNumDecimal(activeCurrency.value.balance, currencyConfig[activeCurrency.value.type].decimal))

  else setAmount(application.formatNumDecimal(0, 2))
}
function reset() {
  resetAmount()
  if (activeCurrency.value) {
    maxAmount.value = application.formatNumDecimal(activeCurrency.value.balance, currencyConfig[activeCurrency.value.type].decimal)
    setAmount(application.formatNumDecimal(0, currencyConfig[activeCurrency.value.type].decimal), false)
  }
}
function handleBlur() {
  if (activeCurrency.value)
    setAmount(application.formatNumDecimal(amount.value, currencyConfig[activeCurrency.value.type].decimal), true)
}

function getCurrencyMaxBalance() {
  const now_currencyData = renderBalanceList.value.find(item => _curGlobalCurrency.value === item.type)
  if (now_currencyData)
    maxAmount.value = application.formatNumDecimal(now_currencyData.balance, currencyConfig[now_currencyData.type].decimal)
}

watch(() => props.activeTab, () => {
  if (props.activeTab === 'deposit')
    reset()
  else
    nextTick(maxNumber)
  amountRef.value?.setTouchFalse()
})

watch(() => _curGlobalCurrency.value, (val) => {
  const code = getCurrencyConfig(val).cur
  runAsyncInterestConfig({ cur: code })
})

watch(isLogin, (val) => {
  amountRef.value?.setTouchFalse()
  if (val) {
    // changeCurrency(activeCurrency.value)
    appStore.getBalanceData().then(() => {
      appStore.getLockerData().then(() => {
        runAsyncInterestConfig({ cur: currency_code.value })
        maxNumber()
      })
    })
    setTimeout(() => {
      maxNumber()
    }, 2000)
  }
})

onMounted(() => {
  appStore.getLockerData()
  if (!props.needAwait)
    runAsyncInterestConfig({ cur: currency_code.value })
  getCurrencyMaxBalance()
})

if (props.needAwait)
  await application.allSettled([runAsyncInterestConfig({ cur: currency_code.value })])
</script>

<template>
  <div class="app-safe" :class="{ page: !showBottom }">
    <div class="safe-content rate-value-content">
      <template v-if="getComponent && !isDeposit && isLogin">
        <Suspense timeout="0">
          <component :is="getComponent" :key="brandStore.brandChangeNum" :tip-text="$t('menu_title_settings_withdrawals')" />
          <template #fallback>
            <div class="dialog-loading-height flex items-center justify-center">
              <BaseLoading />
            </div>
          </template>
        </Suspense>
      </template>
      <template v-else>
        <div class="amount">
          <div class="top">
            <span class="label">{{ t('now_currency') }}</span>
          </div>
          <BaseInput
            v-model="maxAmount" disabled style="--tg-base-input-right-button-padding:0"
          >
            <template #right-button>
              <div>
                <AppSelectCurrency :key="currency_code" interest-deposit :type="isDeposit ? 1 : 2" :set-func="changeCurrency" @change="changeCurrency" />
              </div>
            </template>
          </BaseInput>
        </div>
        <!-- <div v-show="!isDeposit && isLogin" class="center">
          <div class="flex-col-start">
            <span>{{ t('currency') }}</span>
            <AppSelectCurrency :key="currency_code" :type="2" :set-func="changeCurrency" @change="changeCurrency" />
          </div>
        </div> -->
        <div class="amount">
          <div class="top">
            <span v-show="isDeposit" class="label">{{ t('insert_amount') }}</span>
            <span v-show="!isDeposit" class="label">{{ t('amount') }}</span>
          </div>
          <BaseInput
            ref="amountRef" v-model="amount" type="number" :msg="errAmount" msg-after-touched
            @blur="handleBlur" @on-right-button="maxNumber"
          >
            <!-- <template #right-icon>
              <AppCurrencyIcon v-if="activeCurrency" :currency-type="activeCurrency.type" />
            </template> -->
            <template #right-button>
              <div class="w-[70px] text-center">
                <span>{{ t('max_tag') }}</span>
              </div>
            </template>
          </BaseInput>
        </div>
        <div v-show="isDeposit" class="text-tg-text-lightgrey font-semibold">
          <span v-if="billTime">{{ t('interest_description', { unit: billTime }) }} {{
            vaultFig?.interest_rate ? vaultFig?.interest_rate : 0 }}%</span>
          <span v-else>-</span>
        </div>
        <BaseButton
          v-if="isDeposit" bg-style="primary" size="xl" :loading="lockerUpdateLoading"
          :class="[isMobile && !isLogin && 'mobile-nologinn-btn','mb-[16px]']"
          style="font-size: var(--tg-font-size-base);" @click="handleUpdate"
        >
          {{ t('save_to_vault') }}
        </BaseButton>
        <template v-else>
          <AppPasswordInput v-if="isLogin" ref="passwordRef" v-model="password" class="password-input" mb="4px"/>
          <BaseButton
            style="font-size: var(--tg-font-size-base);" bg-style="primary" size="xl"
            :class="[isMobile && !isLogin && 'mobile-nologinn-btn','mb-[16px]']"
            :loading="lockerUpdateLoading" @click="handleUpdate"
          >
            {{ t('draw_vault') }}
          </BaseButton>
        </template>
      </template>
    </div>
    <AppAuthWarp v-if="props.showBottom" show-more />
  </div>
</template>

<style lang='scss' scoped>
.label{
  margin-bottom: 4px;
}
.mobile-nologinn-btn {
  --tg-base-button-default-fake-active-bg: var(--tg-text-green);
}
.app-safe {
  --tg-base-button-font-size: 14px;
  font-size: 14px;
  @include webTheme('green') {
    --tg-primary-main: transparent;
  }
  @include webTheme('white') {
    --tg-tab-style-wrap-bg-color: #f5f5f5;
    --tg-tab-style-color: #111;
    --tg-base-input-style-background-color: F5F5F5;
  }
  .safe-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .flex-col-start {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    color: var(--tg-text-lightgrey);
    font-weight: var(--tg-font-weight-semibold);
    line-height: 21px;
  }
  .amount {
    display: flex;
    flex-direction: column;
    --tg-base-input-style-pad-x: var(--tg-spacing-7);

    .top {
      display: flex;
      justify-content: space-between;
      color: var(--tg-text-lightgrey);
      font-weight: var(--tg-font-weight-semibold);
      margin-bottom: var(--tg-spacing-4);
      @include webTheme('white') {
        color: #111;
      }
      .us {
        font-size: var(--tg-font-size-xs);
      }
    }
    @include webTheme('green') {
      --tg-base-input-right-button-bg: #197b59;
      --tg-base-input-style-border: 2px solid #197b59;
      --tg-border-color-deep-grey: #ffefb0;
      --tg-text-green-main: #ffefb0;
    }
  }
}
.rate-value-content {
  @include webTheme('green') {
    --tg-tab-style-wrap-bg-color: var(--tg-base-button-style-bg-dark);
    --tg-text-green-sub: var(--tw-ring-offset-color);
    --tg-tab-active-text-color: var(--tw-ring-offset-color);
  }
}

.base-input {
  @include webTheme('green') {
    --tg-base-input-style-bg: #02432d;
  }
  @include webTheme('white') {
    --tg-base-input-style-bg: #fff;
  }
}

.base-tab {
  @include webTheme('white') {
    --tg-tab-style-wrap-bg-color: #fff;
  }
}
.password-input {
  @include webTheme('white') {
    --tg-base-input-style-bg: #fff;
  }
}

.page {
  .base-input {
    @include webTheme('white') {
      --tg-base-input-style-bg: #f5f5f5;
    }
  }

  .base-tab {
    @include webTheme('white') {
      --tg-tab-style-wrap-bg-color: #f5f5f5;
    }
  }
  .password-input {
    @include webTheme('white') {
      --tg-base-input-style-bg: #f5f5f5;
    }
  }
}


</style>

