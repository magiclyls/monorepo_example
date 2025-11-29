<script setup lang="ts">
import { ApiFinanceBalanceTransfer, ApiFinanceBalanceTransferLock } from '@tg/apis'
import { AfunBaseButton, AfunBaseCurrencyIcon, AfunBaseInput, AfunBaseLabel } from '@tg/bccomponents'
import { useExchangeRateFromTo } from '@tg/hooks'
import { IconUniArrowDown } from '@tg/icons'
import { useBrandStore, useCurrency } from '@tg/stores'
import { application, div, getCurrencyConfig, mul } from '@tg/utils'
import { useIntervalFn } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useField } from 'vee-validate'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import AppAuthWrap from '~/components/AppAuthWrap.vue'
import AppLoading from '~/components/AppLoading.vue'
import AppSelectCurrency from '~/components/AppSelectCurrency.vue'
import { Message } from '~/utils'

defineOptions({
  name: 'AppCurrencyExchange',
})

const { t } = useI18n()
const currencyStore = useCurrency()
const { currencyList } = storeToRefs(useCurrency())
const { isKYCVerifyOpen } = storeToRefs(useBrandStore())
const expireTime = ref(0)
const { brandBase } = storeToRefs(useBrandStore())
/** KYC弹窗 */
/* const { openKYCDialog } = useDialogKYCVerify() */
useIntervalFn(() => {
  if (expireTime.value > 0)
    expireTime.value -= 1
}, 1000)

/** 支付货币选项 - 法币  */
const currencyPayOptions = computed(() => {
  return currencyList.value.filter(a => !application.isVirtualCurrency(a.type)).map((b) => {
    return {
      label: b.type,
      value: getCurrencyConfig(b.cur).name,
      currencyType: b.type,
      balance: b.balance,
    }
  })
})
/** 兑换货币选项 - 虚拟币 */
const currencyGetOptions = computed(() => {
  return currencyList.value.filter(a => application.isVirtualCurrency(a.type)).map((b) => {
    return {
      label: b.type,
      value: b.type,
      currencyType: b.type,
      balance: b.balance,
    }
  })
})
/** 互换货币选项 */
const currencyAllOptions = computed(() => {
  return currencyList.value.map((b) => {
    return {
      label: b.type,
      value: b.type,
      currencyType: b.type,
      balance: b.balance,
    }
  })
})

const source1 = computed(() => {
  const currency_exchange = brandBase.value?.currency_exchange
  if (currency_exchange && currency_exchange > 0)
    return [currencyPayOptions.value, currencyGetOptions.value, currencyAllOptions.value][currency_exchange - 1]
  return []
})
const source2 = computed(() => {
  const currency_exchange = brandBase.value?.currency_exchange
  if (currency_exchange && currency_exchange > 0)
    return [currencyGetOptions.value, currencyPayOptions.value, currencyAllOptions.value][currency_exchange - 1]
  return []
})
const currencyTypePay = ref()
const currencyTypeGet = ref()
watch([source1, source2], ([s1, s2]) => {
  if (s1 && s2) {
    currencyTypePay.value = source1.value.find(item => Number(item.balance) > 0)?.value || source1.value[0]?.value
    currencyTypeGet.value = source2.value[0]?.value === currencyTypePay.value ? source2.value[1]?.value : source2.value[0]?.value
  }
}, { immediate: true })
const { rate, runGetRateFromTo } = useExchangeRateFromTo(currencyTypePay, currencyTypeGet, 9)

const currencyCodePay = computed<any>(() => {
  return currencyList.value.find(a => a.type === currencyTypePay.value)?.cur ?? '0'
})
const currencyCodeGet = computed<any>(() => {
  return currencyList.value.find(a => a.type === currencyTypeGet.value)?.cur ?? '0'
})
const currencyMaxBalance = computed(() => {
  return Number(currencyList.value.find(item => item.type === currencyTypePay.value)?.balance || 0)
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

const { run: runFinanceBalanceTransferLock, loading: isDataLoading } = useRequest(ApiFinanceBalanceTransferLock, {
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
    Message.success(t('兑换成功'))
    currencyStore.initCurrencyList()
    resetAmountPay()
    resetAmountGet()
    runFinanceBalanceTransferLock()
  },
})

// 设置兑换金额保留指定位数
function setAmountGetWithToFixed(amount: string) {
  setAmountGet(application.formatNumDecimal(amount, getCurrencyConfig(currencyTypeGet.value).decimal))
}
// 设置支付金额保留指定位数
function setAmountPayWithToFixed(amount: string) {
  setAmountPay(application.formatNumDecimal(amount, getCurrencyConfig(currencyTypeGet.value).decimal))
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
/*   if (isLogin.value && isKYCVerifyOpen.value && !isCompleteKYC.value)
    return openKYCDialog() */

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
/*   if (balanceData.value && balanceData.value[currencyTypePay.value])
    disabledPayInput.value = false
  else
    disabledPayInput.value = true */
}
// 切换兑换货币
function onCurrencyGetClick(item: any) {
  currencyTypeGet.value = item.type
  // nextTick(() => {
  //   setAmountGetWithToFixed(mul(+amountPay.value, +rate.value))
  // })
}

function checkValue() {
  setAmountGetWithToFixed(mul(+amountPay.value, +rate.value))
}

// 监听支付金额
watch(amountPay, (a) => {
  if (+a > currencyMaxBalance.value)
    setAmountPay(`${currencyMaxBalance.value}`)
    // setAmountGetWithToFixed(mul(+amountPay.value, +rate.value))
})
watch(currencyMaxBalance, (a) => {
  if (!loading.value) {
    setAmountPay(`${a}`)
    setAmountGetWithToFixed(mul(+amountPay.value, +rate.value))
  }
}, { immediate: true })

// 监听货币列表变化，后台是否关闭该币种
watch(currencyList, (_list) => {
  if (!_list.find(item => item.type === currencyTypePay.value)) {
    Message.error(t('币种已关闭，请刷新！'))
  }
})
// 监听汇率的变化--每次货币变化都要重新获取汇率
watch(rate, (a) => {
  if (a)
    setAmountGetWithToFixed(mul(+amountPay.value, +a))
})

onMounted(() => {
  if (currencyTypePay.value && currencyTypeGet.value) {
    runGetRateFromTo()
  }
  runFinanceBalanceTransferLock()
})
</script>

<template>
  <div class="d">
    <div class="flex flex-col gap-[16px] pt-[16px]">
      <AppLoading v-if="isDataLoading" />
      <template v-else>
        <AfunBaseLabel :label="t('以货币支付', { currency: currencyTypePay })" required style="--afun-base-label-color:#B1BAD3">
          <AfunBaseInput
            v-model="amountPay"
            class="deposit-input"
            name="giveee"
            type="number"
            input-mode="decimal"
            :msg="errorPay"
            :disabled="currencyMaxBalance === 0" @input="onAmountPayInput" @blur="checkValue"
          >
            <template #right>
              <AppSelectCurrency :t="t" :options="source1" :currency="currencyCodePay" @choose="onCurrencyPayClick">
                <div class="bg-[#2F4553] px-[12px]  h-[41px] center whitespace-nowrap rounded-r-[2px]  font-[600]">
                  <AfunBaseCurrencyIcon icon-align="left" :show-name="true" style="--afun-app-currency-icon-size:14px;" :currency-type="currencyTypePay" />
                  <IconUniArrowDown v-if="source1.length > 1" class="ml-[10px] text-[#9dabc9]" />
                </div>
              </AppSelectCurrency>
            </template>
          </AfunBaseInput>
        </AfunBaseLabel>
        <!-- 葡萄牙语需要给currencyTypeGet这个变量加上括号 -->
        <AfunBaseLabel
          :label="t('兑换货币', { currency: currencyTypeGet })"
          :right-text="t('汇率', { rate })"
          required
          style="--afun-base-label-color:#B1BAD3"
        >
          <AfunBaseInput
            v-model="amountGet"
            class="deposit-input"
            type="number"
            input-mode="decimal"
            :msg="errorGet"
            @input="onAmountGetInput"
          >
            <template #right>
              <AppSelectCurrency :t="t" :options="source2" :currency="currencyCodeGet" @choose="onCurrencyGetClick">
                <div class="bg-[#2F4553] px-[12px]  h-[41px] center whitespace-nowrap rounded-r-[4px]  font-[600]">
                  <AfunBaseCurrencyIcon icon-align="left" :show-name="true" style="--afun-app-currency-icon-size:14px;" :currency-type="currencyTypeGet" />
                  <IconUniArrowDown v-if="source2.length > 1" class="ml-[10px] text-[#9dabc9]" />
                </div>
              </AppSelectCurrency>
            </template>
          </AfunBaseInput>
          <div class="text-[#6D7693] mt-[5px] text-[12px] font-[400] leading-[17px]">
            {{ t('当前兑换的货币将根据市场实时汇率进行兑换') }}
          </div>
        </AfunBaseLabel>
        <AfunBaseButton
          :disabled="submitDisabled || loading || !!expireTime" :loading="loading" @click="confirm"
        >
          {{ expireTime ? `${expireTime}s` : t('确认支付') }}
        </AfunBaseButton>
      </template>
    </div>
    <AppAuthWrap />
  </div>
</template>

<style lang="scss" scoped>
.deposit-input {
  --afun-base-input-padding-left: 10px;
  --afun-base-input-padding-right: 0;
  --afun-base-input-padding-y: 9px;
  --afun-base-input-border-radius: 4px;
  --afun-base-input-border-color: #2f4553;
  --afun-base-input-background-color: #0f212e;
}
</style>
