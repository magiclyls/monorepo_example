<script setup lang="ts">
import { ApiFinanceBalanceTransfer, ApiFinanceBalanceTransferLock } from '@tg/apis'

defineOptions({
  name: 'AppWalletChangeV3',
})

const { t } = useI18n()
const { isLogin, balanceData, isCompleteKYC } = storeToRefs(useAppStore())
const { isKYCVerifyOpen } = storeToRefs(useBrandStore())
const { renderCurrencyList } = useCurrencyData()
const { openNotify } = useNotify()
const appStore = useAppStore()
const expireTime = ref(0)
const { bool: disabledPayInput } = useBoolean(false)
const { brandBase } = storeToRefs(useBrandStore())
/** KYC弹窗 */
const { openKYCDialog } = useDialogKYCVerify()
useIntervalFn(() => {
  if (expireTime.value > 0)
    expireTime.value -= 1
}, 1000)

const currencyPaySearch = ref('')
const currencyGetSearch = ref('')
/** 支付货币选项 - 法币  */
const currencyPayOptions = computed(() => {
  return renderCurrencyList.value.filter(a => !application.isVirtualCurrency(a.type)).map((b) => {
    return {
      label: b.type,
      value: getCurrencyConfigByCode(b.cur).name,
      currencyType: b.type,
      balance: b.balance,
    }
  }).filter(c => c.label.includes(currencyPaySearch.value.toUpperCase()))
})
/** 兑换货币选项 - 虚拟币 */
const currencyGetOptions = computed(() => {
  return renderCurrencyList.value.filter(a => application.isVirtualCurrency(a.type)).map((b) => {
    return {
      label: b.type,
      value: b.type,
      currencyType: b.type,
      balance: b.balance,
    }
  }).filter(c => c.label.includes(currencyGetSearch.value.toUpperCase()))
})
/** 互换货币选项 */
const currencyAllOptions1 = computed(() => {
  return renderCurrencyList.value.map((b) => {
    return {
      label: b.type,
      value: b.type,
      currencyType: b.type,
      balance: b.balance,
    }
  }).filter(c => c.label.includes(currencyPaySearch.value.toUpperCase()))
})
/** 互换货币选项 */
const currencyAllOptions2 = computed(() => {
  return renderCurrencyList.value.map((b) => {
    return {
      label: b.type,
      value: b.type,
      currencyType: b.type,
      balance: b.balance,
    }
  }).filter(c => c.label.includes(currencyGetSearch.value.toUpperCase()))
})

const source1 = computed(() => {
  const currency_exchange = brandBase.value?.currency_exchange
  if (currency_exchange && currency_exchange > 0)
    return [currencyPayOptions.value, currencyGetOptions.value, currencyAllOptions1.value][currency_exchange - 1]
  return []
})
const source2 = computed(() => {
  const currency_exchange = brandBase.value?.currency_exchange
  if (currency_exchange && currency_exchange > 0)
    return [currencyGetOptions.value, currencyPayOptions.value, currencyAllOptions2.value][currency_exchange - 1]
  return []
})
const currencyTypePay = ref(source1.value.find(item => Number(item.balance) > 0)?.value || source1.value[0]?.value)
const currencyTypeGet = ref(source2.value[0]?.value === currencyTypePay.value ? source2.value[1]?.value : source2.value[0]?.value)
const { rate, runGetRateFromTo } = useExchangeRateFromTo(currencyTypePay, currencyTypeGet, 9)

const currencyCodePay = computed(() => {
  return renderCurrencyList.value.find(a => a.type === currencyTypePay.value)?.cur ?? '0'
})
const currencyCodeGet = computed(() => {
  return renderCurrencyList.value.find(a => a.type === currencyTypeGet.value)?.cur ?? '0'
})
const currencyMaxBalance = computed(() => {
  if (balanceData.value)
    return balanceData.value[currencyTypePay.value] ?? 0

  return 0
})
const {
  value: amountGet,
  errorMessage: errorGet,
  setValue: setAmountGet,
  resetField: resetAmountGet,
} = useField<string>('amountGet', (v) => {
  return ''
})
const {
  value: amountPay,
  errorMessage: errorPay,
  setValue: setAmountPay,
  resetField: resetAmountPay,
} = useField<string>('amountPay', (v) => {
  return ''
})

// 兑换金额是否低于最低金额
const isAmountGetNotGood = computed(() => {
  const isVirtual = application.isVirtualCurrency(currencyTypeGet.value)
  return isVirtual ? +amountGet.value < 0.00000001 : +amountGet.value < 0.01
})
// 支付金额是否低于最低金额
const isAmountPayNotGood = computed(() => {
  const isVirtual = application.isVirtualCurrency(currencyTypePay.value)
  return isVirtual ? +amountPay.value < 0.00000001 : +amountPay.value < 0.01
})

// 禁用提交按钮
const submitDisabled = computed(() => {
  if (!amountGet.value || !amountPay.value)
    return true

  return isAmountGetNotGood.value || isAmountPayNotGood.value
})

const { run: runFinanceBalanceTransferLock , loading: isDataLoading} = useRequest(ApiFinanceBalanceTransferLock, {
  onSuccess(res) {
    if (res.expire_at === 0 || !res.expire_at) {
      expireTime.value = 0
      return
    }

    const now = Math.floor(Date.now() / 1000)
    const diffSecond = res.expire_at - now
    expireTime.value = diffSecond > 0 ? diffSecond : 0
  },
})

const { run, loading } = useRequest(ApiFinanceBalanceTransfer, {
  onSuccess(res) {
    openNotify({
      type: 'success',
      title: t('exchange'),
      message: t('exchange_notify_title_success'),
    })
    appStore.getBalanceData()
    resetAmountPay()
    resetAmountGet()
    runFinanceBalanceTransferLock()
  },
})

// 设置兑换金额保留指定位数
function setAmountGetWithToFixed(amount: string) {
  setAmountGet(application.formatNumDecimal(amount, currencyConfig[currencyTypeGet.value].decimal))
}
// 设置支付金额保留指定位数
function setAmountPayWithToFixed(amount: string) {
  setAmountPay(application.formatNumDecimal(amount, currencyConfig[currencyTypeGet.value].decimal))
}
// 支付金额输入时
function onAmountPayInput(v: string) {
  setAmountGetWithToFixed(mul(+v, +rate.value))
}
// 兑换金额输入时
function onAmountGetInput(v: string) {
  setAmountPayWithToFixed(div(+v, +rate.value))
}
// 确认
function confirm() {
  /** 增加kyc逻辑 */
  if (isLogin.value && isKYCVerifyOpen.value && !isCompleteKYC.value)
    return openKYCDialog()

  if (+amountPay.value > 0) {
    run({
      currency_in: currencyCodeGet.value,
      currency_out: currencyCodePay.value,
      amount: amountPay.value,
    })
  }
}
// 切换支付货币
function onCurrencyPayClick(item: any) {
  currencyTypePay.value = item.value
  if (balanceData.value && balanceData.value[currencyTypePay.value])
    disabledPayInput.value = false
  else
    disabledPayInput.value = true
}
// 切换兑换货币
function onCurrencyGetClick(item: any) {
  currencyTypeGet.value = item.value
  // nextTick(() => {
  //   setAmountGetWithToFixed(mul(+amountPay.value, +rate.value))
  // })
}
function onPopperHide() {
  setTimeout(() => {
    currencyPaySearch.value = ''
    currencyGetSearch.value = ''
  }, 200)
}
function checkValue() {
  setAmountGetWithToFixed(mul(+amountPay.value, +rate.value))
}

// 监听支付货币类型
watch(currencyTypePay, (a) => {
  balanceData.value && setAmountPay(balanceData.value[currencyTypePay.value] ?? '')
  // setAmountGetWithToFixed(mul(+amountPay.value, +rate.value))
})
// 监听支付金额
watch(amountPay, (a) => {
  if (+a > +currencyMaxBalance.value)
    setAmountPay(`${currencyMaxBalance.value}`)
    // setAmountGetWithToFixed(mul(+amountPay.value, +rate.value))
})
watch(currencyMaxBalance, (a) => {
  if (!loading.value) {
    setAmountPay(`${a}`)
    setAmountGetWithToFixed(mul(+amountPay.value, +rate.value))
  }
})
// 监听货币列表变化，后台是否关闭该币种
watch(renderCurrencyList, (a) => {
  if (balanceData.value) {
    if (!balanceData.value[currencyTypePay.value]) {
      openNotify({
        type: 'error',
        title: t('buy_fail'),
        message: t('currency_has_been_disabled'),
      })
      disabledPayInput.value = true
    }
    else {
      disabledPayInput.value = false
    }
  }
})
// 监听汇率的变化--每次货币变化都要重新获取汇率
watch(rate, (a) => {
  if (a)
    setAmountGetWithToFixed(mul(+amountPay.value, +a))
})

onMounted(() => {
  runFinanceBalanceTransferLock()
  balanceData.value && setAmountPay((balanceData.value[currencyTypePay.value] ?? ''))
  setAmountGetWithToFixed(mul(+amountPay.value, +rate.value))
})

runGetRateFromTo()
</script>

<template>
  <div class="wallet-wrap mb-[16px] flex flex-col p-[24px] gap-[14px]">
     <AppLoading v-if="isDataLoading" />
     <template v-else>
      <BaseLabel :label="t('pay_with', { currency: currencyTypePay })" must-small>
        <BaseInput
          v-model="amountPay" type="number" :msg="errorPay" style="--tg-base-input-right-button-padding:0;"
          hide-spin-btn input-mode="decimal" :disabled="disabledPayInput" @input="onAmountPayInput" @blur="checkValue"
        >
          <template #right-button>
            <BaseSelect
              v-model="currencyTypePay" popper :options="source1" style="--tg-base-select-popper-style-padding-x:12px;
              --tg-base-select-popper-style-padding-y:11px;
              --tg-base-select-popper-bg-color:transparent;
              --tg-base-select-hover-bg-color:transparent;
              width: 110px;" popper-max-height="22em" :skidding="-20" @popper-hide="onPopperHide"
            >
              <template #label>
                <AppCurrencyIcon show-name :currency-type="currencyTypePay" />
              </template>

              <template #popper="{ hide }">
                <div class="bg max-h-[368px] max-w-[180px] flex flex-col gap-[16px] overflow-hidden pt-[12px]">
                  <div class="w-full px-[10px]">
                    <BaseSearch
                      v-model="currencyPaySearch"
                      style="--tg-base-search-icon-size:16px;--tg-base-search-base-padding-x:12px;" class="h-[36px]"
                      :place-holder="t('search')" white-style shape="square"
                    />
                  </div>
                  <div class="scroll-y w-full flex flex-col">
                    <div
                      v-for="item, in source1" :key="item.value"
                      class="theme-color text-tg-text-secondary flex-shrink-0 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap px-[10px] py-[10px] text-[14px] font-semibold"
                      @click="hide(); onCurrencyPayClick(item)"
                    >
                      <div class="flex items-center justify-between">
                        <AppCurrencyIcon :currency-type="item.currencyType" show-name />
                        <span>{{ item.balance }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </BaseSelect>
          </template>
        </BaseInput>
      </BaseLabel>
      <!-- 葡萄牙语需要给currencyTypeGet这个变量加上括号 -->
      <BaseLabel
        :label="`${t('pop_up_currency_exchange', { delta: currencyTypeGet })}`" must-small
        :right-text="`${t('rate')}: ${rate}`"
      >
        <BaseInput
          v-model="amountGet" type="number" :msg="errorGet" style="--tg-base-input-right-button-padding:0;"
          hide-spin-btn input-mode="decimal" @input="onAmountGetInput"
        >
          <template #right-button>
            <BaseSelect
              v-model="currencyTypeGet" popper :options="source2" style="--tg-base-select-popper-style-padding-x:12px;
              --tg-base-select-popper-style-padding-y:11px;
              --tg-base-select-popper-bg-color:transparent;
              --tg-base-select-hover-bg-color:transparent;
              width: 110px;" popper-max-height="22em" :skidding="-20" @popper-hide="onPopperHide"
            >
              <template #label>
                <AppCurrencyIcon show-name :currency-type="currencyTypeGet" />
              </template>

              <template #popper="{ hide }">
                <div class="bg max-h-[368px] max-w-[180px] flex flex-col gap-[16px] overflow-hidden pt-[12px]">
                  <div class="w-full px-[10px]">
                    <BaseSearch
                      v-model="currencyGetSearch"
                      style="--tg-base-search-icon-size:16px;--tg-base-search-base-padding-x:12px;" class="h-[36px]"
                      :place-holder="t('search')" white-style shape="square"
                    />
                  </div>
                  <div class="scroll-y w-full flex flex-col">
                    <div
                      v-for="item, in source2" :key="item.value"
                      class="text-tg-text-secondary theme-color flex-shrink-0 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap px-[10px] py-[10px] text-[14px] font-semibold"
                      @click="hide(); onCurrencyGetClick(item)"
                    >
                      <div class="flex items-center justify-between">
                        <AppCurrencyIcon :currency-type="item.currencyType" show-name />
                        <span>{{ item.balance }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </BaseSelect>
          </template>
        </BaseInput>
        <span class="tips mt-[5px] block text-[12px] font-medium leading-[17px]">
          {{ t('money_exchange_tip') }}
        </span>
      </BaseLabel>
      <BaseButton
        size="md" style="--tg-base-button-font-size:16px;" bg-style="primary"
        :disabled="submitDisabled || loading || !!expireTime" :loading="loading" @click="confirm"
      >
        {{ expireTime ? `${expireTime}s` : t('pop_up_currency_exchange_button_confirm_pay') }}
      </BaseButton>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.bg {
  --tg-text-secondary: #111;
}
.theme-color {
  @include webTheme('green') {
    color: #02432d;
  }
  &:hover {
    background-color: var(--tg-popper-hover-bg);
    @include webTheme('green') {
      background: #197b5980;
    }
  }
}
.tips {
  @include webTheme('green') {
    color: #42bc91;
  }
}
.wallet-wrap {
  @include webTheme('green') {
    --tg-body-bg: var(--tg-green-dark);
  }
}
</style>
