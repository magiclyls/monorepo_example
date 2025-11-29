<script setup lang="ts">
import type { EnumCurrencyKey, IAvailableCurrency, IPromoDetail } from '@tg/types'
import { ApiFinanceThirdDeposit, ApiPaymentDepositBankApplication, ApiPaymentDepositBankList } from '@tg/apis'
import { AfunBaseAmount, AfunBaseButton, AfunBaseCurrencyIcon, AfunBaseInput, AfunBaseLabel } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { IconInfo, IconUniArrowDown, IconUniRefresh } from '@tg/icons'
import { useAppStore, useBrandStore, useCurrency } from '@tg/stores'
import { CustomStatisticsEvent } from '@tg/types'
import { isMiBrowser, isVirtualCurrency, Local, Statistics, STORAGE_WALLET_ROUTE, toFixedByLockCurrency } from '@tg/utils'
import { useDocumentVisibility } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useField } from 'vee-validate'
import { computed, onActivated, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'
import AppLoading from '~/components/AppLoading.vue'
import AppPageLayout from '~/components/AppPageLayout.vue'
import AppSelect from '~/components/AppSelect.vue'
import AppSelectCurrency from '~/components/AppSelectCurrency.vue'
import BaseMoneyKeyboard from '~/components/BaseMoneyKeyboard.vue'
import { Message } from '~/utils'
import MerchantIcon from './_components/merchant-icon.vue'

defineOptions({
  name: 'AppDepositeDetail',
})
interface ICurrencyOption extends IAvailableCurrency {
  label: EnumCurrencyKey
  value: EnumCurrencyKey
}
const { depositCurrencyList, currencyList } = storeToRefs(useCurrency())
const visibility = useDocumentVisibility()
const { t } = useI18n()
const appStore = useAppStore()
const currencyStore = useCurrency()
const { userInfo, isLogin, uPayBalance, loadingUpayBalance, uPayUrl, loadingUpayUrl, upayBalErrCode, isCompleteKYC } = storeToRefs(appStore)
const { isKYCVerifyOpen } = storeToRefs(useBrandStore())
const { updateUserInfo } = useAppStore()
const { bool: isDataLoading } = useBoolean(false)

/** KYC弹窗 */
// const { openKYCDialog } = useDialogKYCVerify()
/** 从那个 sub tab 点击进来的 */
const route = useRoute()
const router = useRouter()
const amountRef = ref()
const routeData = (Local.get(STORAGE_WALLET_ROUTE)?.value as any[])?.[0]
const subTab = routeData?.paymentId as string
const paymentId = routeData?.paymentId as string
const initzkId = routeData?.initzkId as string
const currencyType = routeData?.currencyType as any
const curPaymentType = Number(routeData?.curPaymentType)
const curMerchant = JSON.parse((routeData?.curMerchant || '{}') as string)
const merchantsList = JSON.parse((routeData?.merchantsList || '[]') as string)
const initFiatCurrency = JSON.parse((routeData?.initFiatCurrency || '{}') as string)
const curDepositPromo = JSON.parse((routeData?.curDepositPromo || '[]') as string)
const activeFiatCurrency = ref(initFiatCurrency)
/** 标签：付款方式 or 选择银行 */
const currentPaymentLable = ref(curPaymentType === 2 ? t('选择银行') : t('选择付款方式'))

/** 当前的充值优惠 */
const activeDepositPromo = ref('')
/** 总控ID */
const zkId = ref(initzkId)
/** 当前支付通道是否有银行 */
const haveBank = ref(Number(routeData?.initHaveBank) === 1)
/** 当前的支付通道 */

const activeMerchantId = ref(curMerchant.id)
const activeMerchant = computed(() => merchantsList?.find((item: any) => item.id === activeMerchantId.value))
const strToArray = function (amounts: string, bonusMap?: Record<string, string>) {
  const temp = amounts.split(',').filter(str => str.trim() !== '')
  return temp.map((i) => {
    return {
      label: i,
      value: i,
      bonus: bonusMap?.[i] || '', // 從 bonus_map 中獲取對應的 bonus
    }
  })
}
/** 常用金额 */
const oftenAmount = ref(curMerchant && strToArray(curMerchant?.often_amount ?? '', curMerchant?.bonus_map))
/** 检测是否选择银行 */
const {
  value: curPaymentBank,
  errorMessage: curBankError,
  validate: curBankValidate,
} = useField<string>('curPaymentBank', (value) => {
  if (!value)
    return t('请选择银行')
  return ''
}, { initialValue: '' })
/** 最小额度 */
const getMin = computed(() => {
  return Number(activeMerchant.value.amount_min)
})
/** 校验最小最大金额 */
const {
  value: amount,
  errorMessage: amountError,
  validate: amountValidate,
  resetField: amountReset,
  setValue: setAmount,
} = useField<string>('amount', (value) => {
  const Value = Number(value)
  if (!value)
    return activeMerchant.value?.amount_type === 1 ? t('请选择金额') : t('请输入金额')
  else if (Value < getMin.value)
    return `${t('最小金额为')}${activeMerchant.value?.amount_min}`
  else if (activeMerchant.value?.amount_max && Value > Number(activeMerchant.value?.amount_max))
    return `${t('最大金额为')}${activeMerchant.value?.amount_max}`
  return ''
}, { initialValue: oftenAmount.value[0]?.value })
/** 校验存款人姓名 */
const {
  value: depositName,
  errorMessage: depositNameError,
  validate: depositNameValidate,
  resetField: depositNameReset,
} = useField<string>('depositName', (value) => {
  if (!value)
    return t('请输入存款人姓名')
  return ''
})

const isEmbedPending = ref(false)

const uPayPwdRef = ref()

/** 内嵌模式 upay */
const isEmbed = computed(() => Boolean(activeMerchant.value && activeMerchant.value.embedded && +activeMerchant.value.embedded === 1))

/** U币密码 */
const {
  value: uPayPwd,
  errorMessage: uPayPwdError,
  validate: uPayPwdValidate,
  resetField: uPayPwdReset,
  setValue: setuPayPwd,
} = useField<string>('uPayPwd', (value) => {
  // if (isEmbed.value && !value)
  //   return t('pls_enter_u_pwd')
  return ''
})

/** 银行列表请求 */
const {
  run: runPaymentDepositBankList,
  data: paymentDepositBankList,
} = useRequest(ApiPaymentDepositBankList)
/** 第三方支付存款 */
const {
  runAsync: runAsyncThirdDeposit,
  loading: thirdDepositLoading,
} = useRequest(ApiFinanceThirdDeposit)
/** 公司入款存款 */
const {
  run: runPaymentDepositBankApplication,
  data: paymentDepositBankInfo,
  loading: paymentDepositBankInfoLoading,
} = useRequest(ApiPaymentDepositBankApplication, {
  onSuccess() {
    depositNameReset()
    amountReset()
    uPayPwdReset()
    activeDepositPromo.value = ''
    Local.push(STORAGE_WALLET_ROUTE, {
      currencyType,
      curPaymentType,
      curMerchant: JSON.stringify(activeMerchant.value),
      paymentDepositBankInfo: JSON.stringify(paymentDepositBankInfo.value),
      activeFiatCurrency: JSON.stringify(activeFiatCurrency.value),
    })
    router.push({
      path: '/wallet/deposit-detail/submit',
      query: {},
    })
    handleDeposit()
  },
})
/** 固定金额 */
const fixedAmount = computed(() => {
  if (activeMerchant.value.amount_type === 1)
    return strToArray(activeMerchant.value?.amount_fixed ?? '', activeMerchant.value?.bonus_map)

  return []
})
/** 充值优惠列表 */
const depositPromoArray = computed(() => {
  if (curDepositPromo && curDepositPromo.length > 0) {
    return curDepositPromo.map((i: any) => {
      return {
        ...i,
        label: i.max,
        value: i.max,
        bonus: i.bonus_max,
      }
    })
  }
  else {
    return []
  }
})

const _merchantsArray = computed(() => {
  return merchantsList?.map((a: any) => {
    return {
      ...a,
      label: a.name,
      value: a.id,
    }
  })
})
/** 支付通道列表 */
const merchantsArray = ref(_merchantsArray.value)
/** 法币列表 */
const fiatCurrencyList = computed(() => {
  if (depositCurrencyList.value) {
    return depositCurrencyList.value.filter(a => !isVirtualCurrency(a.currency_name)).map((b) => {
      return {
        ...b,
        label: b.currency_name,
        value: b.currency_name,
      }
    })
  }
  return []
})

/** 银行列表数据 */
const paymentDepositBankData = computed(() => {
  if (paymentDepositBankList.value) {
    return paymentDepositBankList.value.map((i) => {
      return {
        label: i.name,
        value: i.id,
      }
    })
  }
  return []
})
/** 是否为法币入款、隐藏通道 */
const isPaymentDepositBank = computed(() => {
  return curPaymentType === 2
})
const getAmountLimit = computed(() => {
  return `${activeMerchant.value?.amount_min}-${activeMerchant.value?.amount_max}`
})

/** 是否已经绑定 upay 账号 */
const hasBindUpayAccount = computed(() => true)

let upayRefreshTimer: any
function refreshUpayBalance() {
  if (loadingUpayBalance.value || loadingUpayUrl.value)
    return
  if (isLogin.value) {
    clearTimeout(upayRefreshTimer)
    upayRefreshTimer = setTimeout(() => {
      appStore.runGetUpayBalance()
    }, upayBalErrCode.value === '5024' ? 2000 : 0)
  }
}

function goBuyUpay() {
  if (loadingUpayUrl.value)
    return

  if (isLogin.value && hasBindUpayAccount.value) {
    let newWindow: any
    if (!isMiBrowser())
      newWindow = window.open('', '_blank')
    appStore.runGetUpayUrl().then((uu) => {
      console.log('uPayUrl.value === ', uPayUrl.value, uu)

      if (isMiBrowser()) {
        window.open(uu)
      }
      else {
        if (!newWindow)
          return
        newWindow.location.href = uu ?? ''
      }
    })
  }
  else {
    // toAddBankcards()
  }
}

const upayBalanceNum = computed(() => uPayBalance.value?.Balance)

async function depositSubmit() {
  if (userInfo.value?.exclude === 1) {
    Message.error('请先解除自我排除')
    return
  }
  /** 增加kyc逻辑 */
  /* if (isLogin.value && isKYCVerifyOpen.value && !isCompleteKYC.value)
    return openKYCDialog() */

  if (amountRef.value)
    amountRef.value.setTouchTrue()
  /** 校验金额 */
  await amountValidate()
  if (isEmbed.value) {
    if (uPayPwdRef.value)
      uPayPwdRef.value.setTouchTrue()
    await uPayPwdValidate()
  }
  /** 校验银行 */
  if (haveBank.value)
    await curBankValidate()
  /** 校验存款人姓名 */
  await depositNameValidate()

  if (amountError.value
    || (haveBank.value && curBankError.value)
    || (isPaymentDepositBank.value && depositNameError.value)
    || (isEmbed.value && uPayPwdError.value)
  ) {
    return
  }

  /** 进行请求 */
  if (isPaymentDepositBank.value && !depositNameError.value) { // 公司入款存款
    runPaymentDepositBankApplication({
      amount: amount.value,
      cid: activeMerchant.value?.id ?? '',
      mid: paymentId,
      currency_id: activeFiatCurrency.value.currency_id,
      currency_name: activeFiatCurrency.value.currency_name,
      realname: depositName.value,
      bankcard_id: activeMerchant.value?.bankcard_id ?? '',
    })
  }
  else { // 三方支付存款
    if (isEmbed.value) {
      if (hasBindUpayAccount.value) {
        if (upayBalanceNum.value && +upayBalanceNum.value > 0) {
          runAsyncThirdDeposit({
            amount: amount.value, // 存款金额
            cid: activeMerchant.value?.id ?? '', // 支付通道ID
            mid: paymentId, // 支付方式ID
            bank_code: curPaymentBank.value, // 银行编号
            currency_id: activeFiatCurrency.value.currency_id, // 当前货币ID
            currency_name: activeFiatCurrency.value.currency_name, // 当前货币名称
            extra: uPayPwd.value,
          }).then((data: string) => {
            isEmbedPending.value = true
            // upay 不用打开窗口，status true 提示 下单成功就行
          }).catch((err: Error) => {
            try {
              const msg = JSON.parse(err?.message)
              if (msg && msg.data && msg.data === '5023')
                goBuyUpay()
            }
            catch {

            }
          })
        }
        else {
          Message.error('余额不足')
          goBuyUpay()
        }
      }
      else {
        Message.error('请先绑定账号')
      }
      return
    }
    if (isMiBrowser()) {
      runAsyncThirdDeposit({
        amount: amount.value, // 存款金额
        cid: activeMerchant.value?.id ?? '', // 支付通道ID
        mid: paymentId, // 支付方式ID
        bank_code: curPaymentBank.value, // 银行编号
        currency_id: activeFiatCurrency.value.currency_id, // 当前货币ID
        currency_name: activeFiatCurrency.value.currency_name, // 当前货币名称
      }).then((data: string) => {
        window.open(data, '_blank')
      })
    }
    else {
      const newWindow = window.open('', '_blank')
      if (!newWindow)
        return
      runAsyncThirdDeposit({
        amount: amount.value, // 存款金额
        cid: activeMerchant.value?.id ?? '', // 支付通道ID
        mid: paymentId, // 支付方式ID
        bank_code: curPaymentBank.value, // 银行编号
        currency_id: activeFiatCurrency.value.currency_id, // 当前货币ID
        currency_name: activeFiatCurrency.value.currency_name, // 当前货币名称
      }).then((data) => {
        newWindow.location.href = data
      }).catch(() => newWindow.close())
    }
  }
}
/** 初始化银行列表 */
async function initData() {
  if (haveBank.value) {
    return Promise.allSettled([
      runPaymentDepositBankList({ id: zkId.value }),
    ])
  }
  appStore.updateUserInfo()
}
function handleDeposit() {
  Statistics.sendStatisticsCustomEvent(CustomStatisticsEvent.ADD_TO_CART)
  setTimeout(() => {
    updateUserInfo()
  }, 1000 * 300)
}

/** 格式化金额 */
function formatAmount() {
  if (amount.value)
    setAmount(Number.parseInt(amount.value).toString())
}

/** 切换货币类型事件 */
async function onFiatCurrencyChange(item: ICurrencyOption) {
  // 中文、CNY、go back
  activeFiatCurrency.value = item
  router.back()
  setTimeout(() => {
    router.replace({
      path: '/wallet',
      query: {
        tab: 'deposit',
        subtab: 'fiat',
        currency: item.currency_id,
      },
    })
  }, 100)
}

function promoAmount(amount: number) {
  const bonusMax = depositPromoArray.value.length > 0 ? Number.parseFloat(depositPromoArray.value?.[depositPromoArray.value.length - 1].bonus_max) : 0
  const _amount = amount as number
  if (_amount > 0 && depositPromoArray.value.length > 0) {
    if (_amount >= Number.parseFloat(depositPromoArray.value?.[depositPromoArray.value.length - 1].min)) {
      if (depositPromoArray.value.length > 0 && bonusMax > 0) {
        const ratio = Number.parseFloat(depositPromoArray.value?.[0].ratio)
        return ratio * _amount > bonusMax ? bonusMax : ratio * _amount
      }
      else if (depositPromoArray.value.length > 0 && bonusMax === 0) {
        const ratio = Number.parseFloat(depositPromoArray.value?.[0].ratio)
        return ratio * _amount
      }
      else {
        return 0.00
      }
    }
    else {
      return 0.00
    }
  }
  else {
    return 0.00
  }
}

function getReceivedStr(amount: number) {
  const total1 = promoAmount(amount)
  /**  优惠活动列表 */
  let resultStr = total1 > 0 ? toFixedByLockCurrency(total1.toString(), activeFiatCurrency.value.currency_name) : ''

  if (activeMerchant.value.promo_cfgs && activeMerchant.value.promo_cfgs[0]) {
    const {
      bonus_type, // 1:固定金额,2:随机金额, 3:比例金额
      promo_cfgs,
    } = activeMerchant.value.promo_cfgs[0]
    const sortedCfgs = promo_cfgs.sort((a: IPromoDetail, b: IPromoDetail) => Number(a.deposit) - Number(b.deposit))
    const firstStage = sortedCfgs[0]
    const lastStage = sortedCfgs[sortedCfgs.length - 1]
    if (amount >= Number(firstStage.deposit)) {
      let currentStage
      if (amount >= Number(lastStage.deposit)) {
        currentStage = lastStage
      }
      else {
        const nextIndex = sortedCfgs.findIndex((item: IPromoDetail) => Number(item.deposit) > amount)
        currentStage = sortedCfgs[nextIndex - 1]
      }

      if (bonus_type === 1) {
        resultStr = toFixedByLockCurrency((total1 + Number(currentStage.min)).toString(), activeFiatCurrency.value.currency_name)
      }
      else if (bonus_type === 2) {
        resultStr = `${toFixedByLockCurrency((Number(currentStage.min) + total1).toString(), activeFiatCurrency.value.currency_name)}~${toFixedByLockCurrency((Number(currentStage.max) + total1).toString(), activeFiatCurrency.value.currency_name)}`
      }
      else if (bonus_type === 3) {
        resultStr = toFixedByLockCurrency((total1 + Math.min(currentStage.scale * amount / 100, currentStage.limit)).toString(), activeFiatCurrency.value.currency_name)
      }
    }
  }
  return resultStr
}

onActivated(() => {
  isEmbedPending.value = false
  appStore.runGetUpayBalance()
})

/** 选择当前的支付通道 */
watch(activeMerchantId, () => {
  depositNameReset()
  amountReset()
  uPayPwdReset()
  activeDepositPromo.value = ''
  oftenAmount.value = strToArray(activeMerchant.value?.often_amount ?? '', activeMerchant.value?.bonus_map)
})

watch(amount, (a) => {
  if (Number.isNaN(Number(a)))
    return
  activeDepositPromo.value = getReceivedStr(Number(a))
}, { immediate: true })

// 余额有变化，打码信息更新
watch(currencyList, () => {
  currencyStore.getFinanceDepositCurrency()
  setTimeout(() => {
    if (isLogin.value)
      appStore.runGetUpayBalance()
  }, 1000)
})

watch(upayBalanceNum, () => {
  setTimeout(() => {
    isEmbedPending.value = false
    amountReset()
    uPayPwdReset()
  }, 500)
})
watch(visibility, (newValue) => {
  if (newValue === 'visible') {
    if (isLogin.value) {
      setTimeout(() => {
        appStore.runGetUpayBalance()
      }, 1000)
    }
  }
})

onMounted(() => {
  initData()
})
</script>

<template>
  <AppPageLayout :title="$t('存款')">
    <div class="flex flex-col gap-[16px] bg-[#1A2C38]">
      <!-- 选择货币 -->
      <AfunBaseLabel :label="t('存款货币')" required layout="horizontal">
        <template v-if="fiatCurrencyList.length > 0">
          <div v-if="fiatCurrencyList.length === 1" class="">
            <AfunBaseCurrencyIcon
              icon-align="left" :show-name="true" style="--afun-app-currency-icon-size:18px;"
              :currency-type="activeFiatCurrency.currency_name"
            />
          </div>
          <AppSelectCurrency
            v-else v-slot="slotProps" :t="t" :options="fiatCurrencyList"
            :currency="activeFiatCurrency?.cur" @choose="onFiatCurrencyChange"
          >
            <div class="flex items-center justify-between h-[43px] px-[8px] bg-[#0F212E] rounded-[4px]">
              <AfunBaseCurrencyIcon
                icon-align="left" :show-name="true" style="--afun-app-currency-icon-size:18px;"
                :currency-type="activeFiatCurrency.currency_name"
              />
              <IconUniArrowDown v-if="fiatCurrencyList.length > 1" class="ml-[4px] text-[#9dabc9]" />
            </div>
          </AppSelectCurrency>
        </template>
      </AfunBaseLabel>
      <!-- 选择付款方式 -->
      <AfunBaseLabel v-if="merchantsArray?.length > 0" :label="currentPaymentLable" required layout="horizontal">
        <AppSelect
          v-model="activeMerchantId" :options="merchantsArray" placement="bottom-end"
          style="--app-select-label-border-color: #0F212E; --app-select-label-border-color-active: #0F212E;"
        >
          <template #item-icon="{ item }">
            <MerchantIcon size="100%" :currency-type="currencyType" :type="curPaymentType" :item="item" />
          </template>
        </AppSelect>
      </AfunBaseLabel>
      <!-- 选择银行 -->
      <AfunBaseLabel v-if="haveBank" :label="t('选择银行')" required layout="horizontal">
        <AppSelect
          v-model="curPaymentBank" :options="paymentDepositBankData" placement="bottom-end"
          style="--app-select-label-border-color: #0F212E; --app-select-label-border-color-active: #0F212E;"
        >
          <template #item-icon="{ item }">
            <MerchantIcon size="100%" :currency-type="currencyType" :type="curPaymentType" :item="item" />
          </template>
        </AppSelect>
      </AfunBaseLabel>
      <!--  :msg="curBankError" -->

      <div v-if="isEmbed" class=" flex items-center justify-between">
        <div class="flex items-center text-[14px] font-[600]">
          <span class="mr-4 text-[#B1BAD3]">{{ t('余额：') }}</span>
          <AfunBaseAmount
            v-if="isLogin" currency-type="CNY" style="--afun-base-amount-font-size:14px;"
            :amount="uPayBalance?.Balance ?? '0.00'" reverse
          />
          <span v-else class="mr-4">{{ t('获取失败') }}</span>
          <div
            class=" ml-[4px] cursor-pointer  center text-[16px]"
            :class="[loadingUpayBalance || loadingUpayUrl ? 'ani-roll-2' : '']" @click="refreshUpayBalance"
          >
            <IconUniRefresh class="text-[#9DABC8]" />
          </div>
        </div>
        <AfunBaseButton :loading="loadingUpayUrl" class="add-btn1 center" @click="goBuyUpay">
          <template #loadingText>
            <!-- <template v-if="loadingBankcard">
            <div class="h-32 px-8 text-[14px] font-[600] leading-[32px]">
              ...
            </div>
          </template>
    <template v-else> -->

            <!-- </template> -->
          </template>
          <div class="  text-[14px] leading-[20px] font-[600] ">
            {{ isLogin && hasBindUpayAccount ? t('+购买U币') : t('绑定账号') }}
          </div>
        </AfunBaseButton>
      </div>
      <!-- 三方支付存款 -->
      <div class="flex flex-col gap-[16px]">
        <!-- 存款人姓名 -->
        <AfunBaseLabel v-if="isPaymentDepositBank" :label="t('存款人姓名')" required>
          <AfunBaseInput v-model="depositName" :msg="depositNameError" :placeholder="t('请输入存款人姓名')" />
        </AfunBaseLabel>
        <!-- 充值金额 -->
        <AfunBaseLabel :label="t('存款金额')" required>
          <!-- 输入金额 -->
          <AfunBaseInput
            v-if="activeMerchant && activeMerchant.amount_type === 2" ref="amountRef" v-model="amount"
            class="deposit-input" :placeholder="getAmountLimit" :msg="amountError" type="number" input-mode="decimal"
            clear-place-holder-on-focus msg-after-touched @blur="formatAmount"
          >
            <template #right>
              <div
                v-if="activeDepositPromo"
                class="bg-[#2F4553] px-[12px] h-full center whitespace-nowrap rounded-r-[2px] font-[600] text-[#B1BAD3]"
              >
                {{ t('赠送') }} +{{ activeDepositPromo }}
              </div>
            </template>
          </AfunBaseInput>
          <!-- 固定金额 -->
          <div
            v-if="activeMerchant && activeMerchant.amount_type === 1"
            class="w-full flex items-center justify-between "
          >
            <AppSelect
              v-model="amount"
              class="flex-1 min-w-0 px-[10px] bg-[#0F212E] border-solid border-1 border-[#2F4553]"
              :class="[activeDepositPromo ? 'rounded-l-[4px]' : 'rounded-[4px]']" :options="fixedAmount"
            >
              <template #label="{ data, isMenuShown }">
                <div v-if="data?.label" class="leading-[39px]">
                  {{ data?.label }}
                </div>
                <div v-else class="leading-[39px] text-[#9DABC9]  pr-[30px] truncate">
                  {{ t('请下拉选择存款金额') }}
                </div>
              </template>
            </AppSelect>
            <div
              v-if="activeDepositPromo"
              class="bg-[#2F4553] px-[12px] text-[#B1BAD3] h-[43px] center whitespace-nowrap rounded-r-[4px]  font-[600]"
            >
              {{ t('赠送') }} +{{ activeDepositPromo }}
            </div>
          </div>
          <div
            v-if="amountError && activeMerchant && activeMerchant.amount_type === 1"
            class="mt-[6px] flex items-center leading-[17px] text-[12px] font-[600]"
          >
            <IconInfo class="text-[14px] mr-[4px] text-[#ff4d4f]" />
            <span class="text-[#FF4D4F]">{{ amountError }}</span>
          </div>
        </AfunBaseLabel>

        <!-- U币密码 -->
        <AfunBaseLabel v-if="isEmbed" :label="t('U币密码')">
          <AfunBaseInput
            ref="uPayPwdRef" v-model="uPayPwd" :placeholder="t('请输入U币密码')" :msg="uPayPwdError"
            clear-place-holder-on-focus msg-after-touched type="password"
          />
        </AfunBaseLabel>

        <!-- 充值金额面板 -->
        <BaseMoneyKeyboard
          v-if="oftenAmount && oftenAmount.length" v-model="amount" class="keyboard"
          :options="oftenAmount" :currency="activeFiatCurrency?.currency_id"
        />
        <!-- 确认支付按钮 -->
        <AfunBaseButton v-if="isEmbedPending" loading class=" center">
          <span>{{ t('充值中...') }}</span>
        </AfunBaseButton>
        <AfunBaseButton v-else :loading="thirdDepositLoading || paymentDepositBankInfoLoading" @click="depositSubmit">
          {{ t('确认支付') }}
        </AfunBaseButton>
      </div>
      <AppLoading v-if="isDataLoading" />
    </div>
  </AppPageLayout>
</template>

<style scoped lang="scss">
.add-btn1 {
  --afun-base-button-padding-y: 9px;
  --afun-base-button-padding-x: 8px;
  --afun-base-button-border-radius: 4px;
}

.deposit-input {
  --afun-base-input-padding-left: 10px;
  --afun-base-input-padding-right: 0;
  --afun-base-input-padding-y: 9px;
}

// 按钮loading动画
.ani-roll-2 {
  transform-origin: center;
  animation-name: tg-roll-2;
  animation-duration: 1.6s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes tg-roll-2 {
  0%,
  5% {
    transform: rotate(0);
  }

  15% {
    transform: rotate(45deg);
  }

  20%,
  30% {
    transform: rotate(90deg);
  }

  37.5% {
    transform: rotate(135deg);
  }

  45%,
  55% {
    transform: rotate(180deg);
  }

  62.5% {
    transform: rotate(225deg);
  }

  70%,
  80% {
    transform: rotate(270deg);
  }

  87.5% {
    transform: rotate(315deg);
  }

  95%,
  to {
    transform: rotate(360deg);
  }
}
</style>
