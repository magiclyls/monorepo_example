<script setup lang="ts">
import type { EnumCurrencyKey, IAvailableCurrency, IPromoDetail } from '@tg/types'
import { ApiFinanceMethodListV2, ApiFinanceThirdCoinDeposit, ApiPaymentDepositCoinApplication, ApiThirdVirtualGetAddr } from '@tg/apis'
import { AfunBaseButton, AfunBaseCurrencyIcon, AfunBaseInput, AfunBaseLabel } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { IconInfo, IconUniArrowDown } from '@tg/icons'
import { useCurrency } from '@tg/stores'
import { EventBusNames } from '@tg/types'
import { appEventBus, isVirtualCurrency, Local, STORAGE_WALLET_ROUTE, toFixedByLockCurrency } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { useField } from 'vee-validate'
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'
import AppAuthWrap from '~/components/AppAuthWrap.vue'
import AppLoading from '~/components/AppLoading.vue'
import AppPageLayout from '~/components/AppPageLayout.vue'
import AppSelect from '~/components/AppSelect.vue'
import AppSelectCurrency from '~/components/AppSelectCurrency.vue'
import BaseMoneyKeyboard from '~/components/BaseMoneyKeyboard.vue'
import { Message } from '~/utils'
import AppDepositVirAddressQrcode from './_components/viraddress-qrcode.vue'

interface ICurrencyOption extends IAvailableCurrency {
  label: EnumCurrencyKey
  value: EnumCurrencyKey
}

defineOptions({
  name: 'AppVirDepositDetail',
})
const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const currencyStore = useCurrency()
const { depositCurrencyList, currencyList } = storeToRefs(currencyStore)
/** 标签：付款方式 or 选择银行 */
const { bool: isDataLoading } = useBoolean(false)

const { bool: isDisableQrcode, setTrue: setTrueQrcode, setFalse: setFalseQrcode } = useBoolean(false)
const VirQrcodeMsg = ref('')
const amountRef = ref()
/** 当前的充值优惠 */
const activeDepositPromo = ref('')
/** 当前的支付类型:1:在线支付, 2:公司入款 */
const routeData = (Local.get(STORAGE_WALLET_ROUTE)?.value as any[])?.[0]
const { curPaymentType, paymentId, initCurrentNetwork } = routeData
const virAddreesQrcodeData = ref(JSON.parse((routeData?.initvirAddreesQrcodeData || '{}') as string))
const activeMerchant = ref(JSON.parse((routeData?.curMerchant || '{}') as string))
const contractList = ref(JSON.parse((routeData?.initContractList || '{}') as string))
const activeVirCurrency = ref(JSON.parse((routeData?.initVirCurrency || '{}') as string))
const curDepositPromo = ref(JSON.parse((routeData?.curDepositPromo || '[]') as string))
const paymentType = ref(Number(curPaymentType))
/** 当前的支付ID */
const curPaymentId = ref(paymentId as string)

const currentNetwork = ref(initCurrentNetwork)

/** 当前虚拟币列表 */
const virCurrencyList = computed(() => {
  if (depositCurrencyList.value.length) {
    return depositCurrencyList.value.filter(a => isVirtualCurrency(a.currency_name)).map((b) => {
      return {
        ...b,
        label: b.currency_name,
        value: b.currency_id,
      }
    })
  }
  return []
})

/** 通知消息：是否优先显示虚拟币代收付二维码 */
const showQrcodeFirst = ref(false)
const backDepositInfo: {
  address: string
  amount: string
  memo?: string
  currency_name: string
  id?: string
} = reactive({
  address: '',
  amount: '',
  currency_name: '',
  memo: '',
})

/** 最小额度 */
const getMin = computed(() => {
  return Number(activeMerchant.value.amount_min)
})
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
const oftenAmount = computed(() => {
  return strToArray(activeMerchant.value?.often_amount ?? '', activeMerchant.value?.bonus_map)
})
/** 固定金额 amount_type: 1:固定, 2:范围 */
const fixedAmount = computed(() => {
  if (activeMerchant.value.amount_type === 1)
    return strToArray(activeMerchant.value?.amount_fixed ?? '')

  return []
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
/** 虚拟币代收付存款地址 */
const {
  runAsync: runAsyncvirDepositAddrees,
  loading: virDepositAddreesLoading,
} = useRequest(ApiThirdVirtualGetAddr)
/** 虚拟币存款 */
const { run: runPaymentDepositCoinApplication, loading: paymentDepositCoinInfoLoading } = useRequest(ApiPaymentDepositCoinApplication, {
  onSuccess(data) {
    backDepositInfo.address = data.deposit_coin.wallet_address
    backDepositInfo.currency_name = data.deposit_coin.currency_name
    backDepositInfo.amount = data.amount
    backDepositInfo.id = data.id
    backDepositInfo.memo = data.memo
    amountReset()
    Local.push(STORAGE_WALLET_ROUTE, {
      currencyType: 'virtual',
      activeVirCurrency: JSON.stringify(activeVirCurrency.value),
      currentNetwork: currentNetwork.value,
      backDepositInfo: JSON.stringify(backDepositInfo),
    })
    router.push({
      path: '/wallet/deposit-detail/submit',
      query: {

      },
    })
  },
})
/** 第三方支付存款 */
const {
  run: runFinanceThirdCoinDeposit,
  loading: financeThirdCoinDepositLoading,
} = useRequest(ApiFinanceThirdCoinDeposit, {
  onSuccess(data) {
    showNotify()
    backDepositInfo.address = data.address
    backDepositInfo.amount = data.amount
    backDepositInfo.memo = ''
    amountReset()
    Local.push(STORAGE_WALLET_ROUTE, {
      currencyType: 'virtual',
      activeVirCurrency: JSON.stringify(activeVirCurrency.value),
      currentNetwork: currentNetwork.value,
      backDepositInfo: JSON.stringify(backDepositInfo),
    })
    router.push({
      path: '/wallet/deposit-detail/submit',
      query: {

      },
    })
  },
})
/** 支付方式V2列表 */
const {
  runAsync: runAsyncPaymentMethodList,
} = useRequest(ApiFinanceMethodListV2, {
  onSuccess() {
  },
})

/** 充值优惠列表 */
const depositPromoArray = computed(() => {
  if (curDepositPromo.value && curDepositPromo.value.length > 0) {
    return curDepositPromo.value.map((i: any) => {
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

const getAmountLimit = computed(() => {
  return (activeMerchant.value?.amount_min && activeMerchant.value?.amount_max)
    ? `${activeMerchant.value?.amount_min}-${activeMerchant.value?.amount_max}`
    : `${t('请输入存款金额')}`
})
/** 获取二维码数据 */
function getQrcodeData() {
  if (VirQrcodeMsg.value && Object.keys(VirQrcodeMsg.value).length > 0) {
    if (showQrcodeFirst.value) {
      setFalseQrcode()
    }
    else {
      setTrueQrcode()
      virAddreesQrcodeData.value.virDepositAddrees = ''
    }
  }
  else if (VirQrcodeMsg.value === '') {
    setFalseQrcode()
  }
  else {
    setTrueQrcode()
    virAddreesQrcodeData.value.virDepositAddrees = ''
  }
}
function checkShareQrCode(codeMsg: any) {
  // 取出所有的键
  if (codeMsg === '' || Object.keys(codeMsg).length === 0) {
    showQrcodeFirst.value = false
  }
  else {
    const msg = codeMsg
    const currencyKeys = Object.keys(msg)
    const CurrencyFindIndex = currencyKeys.includes(activeVirCurrency.value.currency_id)
    const ContractFindIndex = getContractId(msg).includes(currentNetwork.value)
    if (CurrencyFindIndex && ContractFindIndex && virAddreesQrcodeData.value.virDepositAddrees)
      showQrcodeFirst.value = true

    else
      showQrcodeFirst.value = false
  }
}
/** 取出message里的协议编号 */
function getContractId(msg: any) {
  // 用于存储所有内层对象的键
  const innerKeys: string[] = []
  // 遍历外层对象的每一个键
  Object.keys(msg).forEach((outerKey) => {
    const innerObject = msg[outerKey]
    // 遍历内层对象的每一个键
    Object.keys(innerObject).forEach((innerKey) => {
      innerKeys.push(innerKey)
    })
  })
  return innerKeys
}
/** 格式化金额 */
function formatAmount() {
  if (amount.value)
    setAmount(Number.parseFloat(amount.value).toString())
}
async function confirmPayment() {
  if (amountRef.value)
    amountRef.value.setTouchTrue()
  await amountValidate()
  if (!amountError.value) {
    if (paymentType.value === 1) { // 三方支付存款
      runFinanceThirdCoinDeposit({
        amount: amount.value,
        bank_code: '',
        cid: activeMerchant.value?.id ?? '',
        mid: curPaymentId.value,
        currency_id: activeVirCurrency.value.currency_id,
        currency_name: activeVirCurrency.value.currency_name,
        bankcard_id: activeMerchant.value?.bankcard_id ?? '',
      })
    }
    else if (paymentType.value === 2) { // 虚拟币存款(公司入款)
      runPaymentDepositCoinApplication({
        amount: amount.value,
        cid: activeMerchant.value?.id ?? '',
        currency_id: activeVirCurrency.value.currency_id,
        currency_name: activeVirCurrency.value.currency_name,
        mid: curPaymentId.value,
        bankcard_id: activeMerchant.value?.bankcard_id ?? '',
      })
    }
  }
}
function showNotify() {
  const type = activeVirCurrency.value.currency_name
  Message.info(t('存款进行中'))
  /*  openNotify({
    icon: `coin-${type.toLocaleLowerCase()}`,
    title: t('deposit_in_process'),
    message: () => h(AppMemberNotificationsMessage, {
      amount: application.formatNumDecimal(backDepositInfo.amount, currencyConfig[type].decimal),
      currencyType: type,
      keypath: 'deposit_info_going',
    }),
  }) */
}
/** 切换货币类型事件 */
async function onVirtCurrencyChange(item: ICurrencyOption) {
  activeVirCurrency.value = item

  await router.back()
  router.replace({
    path: '/wallet',
    query: {
      tab: 'deposit',
      subtab: 'virtual',
      currency: item.currency_id,
    },
  })
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
  let resultStr = total1 > 0 ? toFixedByLockCurrency(total1.toString(), activeVirCurrency.value.currency_name) : ''

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
        resultStr = toFixedByLockCurrency((total1 + Number(currentStage.min)).toString(), activeVirCurrency.value.currency_name)
      }
      else if (bonus_type === 2) {
        resultStr = `${toFixedByLockCurrency((Number(currentStage.min) + total1).toString(), activeVirCurrency.value.currency_name)}~${toFixedByLockCurrency((Number(currentStage.max) + total1).toString(), activeVirCurrency.value.currency_name)}`
      }
      else if (bonus_type === 3) {
        resultStr = toFixedByLockCurrency((total1 + Math.min(currentStage.scale * amount / 100, currentStage.limit)).toString(), activeFiatCurrency.value.currency_name)
      }
    }
  }
  return resultStr
}
/** 是否显示虚拟币代收付存款地址 */
function handleVirQrcodeChange(msg: any) {
  VirQrcodeMsg.value = msg
}
watch(currentNetwork, (v) => {
  amountReset()
  activeDepositPromo.value = ''
  runAsyncPaymentMethodList({ currency_id: activeVirCurrency.value.currency_id, contract_id: v }).then((data) => {
    const paymentList = data.filter(item => item.merchants.filter(child => child.payment_type === paymentType.value).length > 0)
    if (paymentList.length > 0) {
      activeMerchant.value = paymentList[0].merchants.filter(item => item.payment_type === paymentType.value)[0]
      curPaymentId.value = paymentList[0].id
    }
    if (paymentType.value === 3) {
      virAddreesQrcodeData.value.virDepositRatio = paymentList[0].deposit_promo[0] === undefined ? '' : paymentList[0].deposit_promo[0].ratio
      virAddreesQrcodeData.value.virDepositMin = paymentList[0].deposit_promo[0] === undefined ? '' : paymentList[0].deposit_promo[0].min
      virAddreesQrcodeData.value.currency = activeVirCurrency.value.currency_name
      runAsyncvirDepositAddrees({ id: paymentList[0].merchants[0].id, mid: paymentList[0].id, currency_id: activeVirCurrency.value.currency_id }).then((data) => {
        virAddreesQrcodeData.value.virDepositAddrees = data || ''
      })
    }
  })
})
watch(amount, (a) => {
  if (Number.isNaN(Number(a)))
    return
  activeDepositPromo.value = getReceivedStr(Number(a))
}, { immediate: true })
watch(VirQrcodeMsg, (a) => {
  checkShareQrCode(a)
  getQrcodeData()
})
/* watch(balanceData, (val) => {
  if (val && val.uid)
    virCurrencyList.value = virCurrencyList.value.map(v => ({ ...v, balance: val[v.currency_name] }))
}) */
// 余额有变化，打码信息更新
watch(currencyList, () => {
  currencyStore.getFinanceDepositCurrency()
})
onMounted(() => {
  appEventBus.on(EventBusNames.DEPOSIT_CHANGE_VIRT_QRCODE, handleVirQrcodeChange)
})

onUnmounted(() => {
  appEventBus.off(EventBusNames.DEPOSIT_CHANGE_VIRT_QRCODE, handleVirQrcodeChange)
})
</script>

<template>
  <AppPageLayout :title="$t('存款')">
    <div class="flex flex-col gap-[16px]">
      <div class="flex flex-col gap-[16px]">
        <!-- 选择货币 -->
        <AfunBaseLabel :label="t('存款货币')" required layout="horizontal">
          <template v-if="activeVirCurrency">
            <div
              v-if="virCurrencyList.length === 1"
              class="flex items-center justify-between h-[43px] px-[8px] rounded-[4px] bg-[#0F212E]"
            >
              <AfunBaseCurrencyIcon
                icon-align="left" :show-name="true" style="--ph-app-currency-icon-size:18px;"
                :currency-type="activeVirCurrency.currency_name"
              />
            </div>
            <AppSelectCurrency
              v-else v-slot="slotProps" :t="t" :options="virCurrencyList"
              :currency="activeVirCurrency?.cur" @choose="onVirtCurrencyChange"
            >
              <div
                class="flex items-center justify-between h-[43px] px-[8px] rounded-[4px] bg-[#0F212E]"
                :class="[slotProps.isMenuShown ? 'border-[#F23038]' : 'border-[#0F212E]']"
              >
                <AfunBaseCurrencyIcon
                  icon-align="left" :show-name="true" style="--ph-app-currency-icon-size:18px;"
                  :currency-type="activeVirCurrency.currency_name"
                />
                <IconUniArrowDown v-if="virCurrencyList.length > 1" class="ml-[4px] text-[#9dabc9]" />
              </div>
            </AppSelectCurrency>
          </template>
        </AfunBaseLabel>
        <!-- 选择网络标签 -->
        <AfunBaseLabel v-if="contractList && contractList.length > 0" :label="t('选择网络')" required layout="horizontal">
          <AppSelect
            v-model="currentNetwork" :options="contractList" placement="bottom-end"
            style="--app-select-label-border-color: #0F212E; --app-select-label-border-color-active: #0F212E;"
          />
        </AfunBaseLabel>
        <div class="flex flex-col gap-16 pt-16">
          <template v-if="paymentType === 3">
            <AppDepositVirAddressQrcode
              :data="virAddreesQrcodeData" :disabled="isDisableQrcode"
              :loading="virDepositAddreesLoading"
            />
          </template>
          <!-- 三方支付存款 -->
          <div v-else class="flex flex-col gap-[16px]">
            <!-- 充值金额 -->
            <AfunBaseLabel :label="t('存款金额')" required>
              <!-- 输入金额 -->
              <AfunBaseInput
                v-if="activeMerchant && activeMerchant.amount_type === 2" ref="amountRef" v-model="amount"
                class="deposit-input" :placeholder="getAmountLimit" :msg="amountError" type="number"
                input-mode="decimal" clear-place-holder-on-focus msg-after-touched @blur="formatAmount"
              >
                <template #right>
                  <div
                    v-if="activeDepositPromo"
                    class="bg-[#2F4553] px-[12px]  h-full center whitespace-nowrap rounded-r-[2px] font-[600] text-[#B1BAD3]"
                  >
                    {{ t('赠送') }} +{{ activeDepositPromo }}
                  </div>
                </template>
              </AfunBaseInput>
              <!-- 固定金额 -->
              <div
                v-if="activeMerchant && activeMerchant.amount_type === 1"
                class="w-full flex items-center justify-between rounded-[4px] border-solid border-[1px] border-[#2F4553] bg-[#0F212E]"
              >
                <AppSelect v-model="amount" class="flex-1 px-[10px] min-w-0" :options="fixedAmount">
                  <template #label="{ data, isMenuShown }">
                    <div v-if="data?.label" class="leading-[40px]">
                      {{ data?.label }}
                    </div>
                    <div v-else class="leading-[40px] text-[#57646D]  pr-[30px] truncate">
                      {{ t('请下拉选择存款金额') }}
                    </div>
                  </template>
                </AppSelect>
                <div
                  v-if="activeDepositPromo"
                  class="bg-[#2F4553] px-[12px] h-[40px] center whitespace-nowrap rounded-r-[2px] font-[600] text-[#B1BAD3]"
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
            <!-- 充值金额面板 -->
            <BaseMoneyKeyboard
              v-if="oftenAmount && oftenAmount.length" v-model="amount"
              :currency="activeVirCurrency?.cur" class="keyboard" :options="oftenAmount"
            />
            <!-- 确认支付按钮 -->
            <AfunBaseButton
              :loading="paymentDepositCoinInfoLoading || financeThirdCoinDepositLoading"
              @click="confirmPayment"
            >
              {{ t('确认支付') }}
            </AfunBaseButton>
          </div>
          <AppLoading v-if="isDataLoading" />
        </div>
      </div>
      <AppAuthWrap />
    </div>
  </AppPageLayout>
</template>

<style lang="scss" scoped>
.deposit-input {
  --afun-base-input-padding-left: 10px;
  --afun-base-input-padding-right: 0;
  --afun-base-input-padding-y: 9px;
}
</style>
