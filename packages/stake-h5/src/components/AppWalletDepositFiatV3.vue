<script setup lang="ts">
import { IconUniWarningColor, IconUniArrowRight } from '@tg/icons'

import type { EnumCurrencyKey, IAvailableCurrency } from '@tg/types'
import type { CurrencyCode } from '~/composables/useCurrencyData'
import { ApiFinanceMethodComboListV2 } from '@tg/apis'

interface ICurrencyOption extends IAvailableCurrency {
  label: EnumCurrencyKey
  value: CurrencyCode
}
interface Props {
  initFiatCurrency: EnumCurrencyKey
}
defineOptions({
  name: 'AppWalletDepositFiatV3',
})
const props = defineProps<Props>()
const emit = defineEmits(['changeCurrency'])
const { t } = useI18n()
const { bool: isDataLoading } = useBoolean(false)
const customRouter = useCustomRouter()
const back_initCurrencyName = customRouter.backQuery.initCurrency as EnumCurrencyKey
const back_initCurrencyCode = currencyConfig[back_initCurrencyName]?.cur
const appStore = useAppStore()
const { balanceData } = storeToRefs(appStore)
/** 当前存款货币列表：depositCurrencyList  钱包存款接口请求：runGetFinanceDepositCurrencyData */
const { depositCurrencyList, runGetFinanceDepositCurrencyData } = useCurrencyData()
const { isZhcn, isPtbr } = storeToRefs(useLanguageStore())
const showIds = ref<Array<string>>([])
const fiatSearchValue = ref('')
/** 当前的支付ID */
const curPaymentId = ref('')
/** 当前的法币 */
const activeFiatCurrency = ref({} as ICurrencyOption)
/** 支付方式&协议V2列表 */
const {
  runAsync: runAsyncPaymentMethodList,
  data: paymentMethodList,
} = useRequest(ApiFinanceMethodComboListV2, {
  onSuccess(res, p) {
    if (p && p[0] && p[0].currency_id === '701')
      appStore.setComboList(res)
  },
})
/** 当前法币列表 */
const fiatCurrencyList = computed(() => {
  if (depositCurrencyList.value.length) {
    return depositCurrencyList.value.filter(a => !application.isVirtualCurrency(a.currency_name)).map((b) => {
      return {
        ...b,
        label: b.currency_name,
        value: b.currency_id,
      }
    })
  }
  return []
})
const fiatCurrencyListOptions = computed(() => {
  return fiatCurrencyList.value.filter(a => a.currency_name.includes(fiatSearchValue.value.toUpperCase())).map((a) => {
    return {
      ...a,
      value: a.currency_id,
      label: a.currency_name,
    }
  })
})
/** 只有一个支付方式 */
const isOnlyOnePaymentMethod = computed(() => paymentMethodList.value?.method ? paymentMethodList.value.method.length === 1 : false)
/** 在中文状态下，过滤法币里的钱包支付列表 */
const filterWalletPaymentList = computed(() => {
  if (isZhcn.value)
    return paymentMethodList.value?.method ? paymentMethodList.value.method.filter(a => a.alias !== 'qb') : []
  else
    return paymentMethodList.value?.method ? paymentMethodList.value.method : []
})
const renderList = computed(() => {
  if (filterWalletPaymentList.value.length > 0) {
    if (isOnlyOnePaymentMethod.value) {
      return filterWalletPaymentList.value.map((a) => {
        return {
          ...a,
          merchants: showIds.value.includes(a.id) ? a.merchants : a.merchants.length > 5 ? a.merchants.slice(0, 5) : a.merchants,
        }
      })
    }
    else {
      return filterWalletPaymentList.value.map((a) => {
        return {
          ...a,
          merchants: showIds.value.includes(a.id) ? a.merchants : a.merchants.length >= 10 ? a.merchants.slice(0, 3) : a.merchants.slice(0, 2),
        }
      })
    }
  }

  return []
})
/** 葡萄牙语: 支付通道列表 */
const paymentMethodPtList = computed(() => {
  if (isPtbr.value && activeFiatCurrency.value.currency_id === '702' && paymentMethodList?.value?.method) {
    return paymentMethodList?.value?.method.map((a) => {
      return {
        ...a,
        value: a.id,
        label: a.name,
      }
    })
  }
  else { return [] }
})
function ifShowMore(id: string) {
  if (paymentMethodList.value?.method && paymentMethodList.value.method.length > 0) {
    if (isOnlyOnePaymentMethod.value)
      return paymentMethodList.value.method.filter(a => a.id === id)[0].merchants.length > 5 && !showIds.value.includes(id)

    return paymentMethodList.value.method.filter(a => a.id === id)[0].merchants.length > 2 && !showIds.value.includes(id)
  }
}
function ifShowHide(id: string) {
  return showIds.value.includes(id)
}
function onShowAllClick(id: string) {
  showIds.value.push(id)
}
function onHideALlClick(id: string) {
  const i = showIds.value.findIndex(a => a === id)
  if (i > -1)
    showIds.value.splice(i, 1)
}
function tipLableColor(type: number) {
  switch (type) {
    case 1001:
      return '#1375E1'
    case 1002:
      return '#00A200'
    case 1003:
      return '#F30000'
    case 1004:
      return '#D47200'
    default:
      return ''
  }
}
/** 切换货币类型事件 */
function onFiatCurrencyChange(item: ICurrencyOption) {
  activeFiatCurrency.value = item
  getData()
  // emit('changeCurrency', item.currency_name)
}
function onFiatPopperHide() {
  setTimeout(() => {
    fiatSearchValue.value = ''
  }, 200)
}
/** 获取初始化的数据 */
async function getData() {
  isDataLoading.value = true
  return Promise.allSettled([
    runAsyncPaymentMethodList({ currency_id: activeFiatCurrency.value.currency_id }),
  ]).then(() => {
    isDataLoading.value = false
  })
}
/** 选择线上支持或转账 */
function gotoDepositFiatDetail(itsm: any, id: any, type: any, haveBank: boolean, zkId: string) {
  curPaymentId.value = itsm.id
  customRouter.push('/deposit/detail', {
    currencyType: 'fiat', // 当前的货币类型
    currencyId: activeFiatCurrency.value.currency_id, // 当前的货币ID
    currencyName: activeFiatCurrency.value.currency_name, // 当前的货币名称
    curMerchant: itsm, // 当前的支付通道
    curPaymentType: type,
    paymentId: id, // 当前的支付ID
    initHaveBank: haveBank,
    initzkId: zkId,
    initFiatCurrency: activeFiatCurrency.value, // 初始化当前法币
    activeCurrency: activeFiatCurrency.value, // 初始化当前法币
    curDepositPromo: curDepositPromo(id), // 当前支付优惠
    merchantsList: curMerchantsList(id), // 当前支付通道列表
  })
}
/** 选择当前的支付优惠 */
function curDepositPromo(id: string) {
  const curPaymentMethod = paymentMethodList?.value?.method.filter(a => a.id === id)[0]
  return curPaymentMethod?.deposit_promo
}
/** 选择当前的支付通道 */
function curMerchantsList(id: string) {
  const curPaymentMethod = paymentMethodList?.value?.method.filter(a => a.id === id)[0]
  return curPaymentMethod?.merchants
}

/** 获取图标路径 */
function getMerchantsIconPath(type: number, item: object) {
  let str = (item as { alias: string }).alias
  if (str === 'qb') {
    str = (item as { zk_id: string }).zk_id
    return `/payment/deposit/${str}.webp`
  }
  else {
    return type === 2 ? `/webp/bank/${str}.webp` : `/payment/deposit/${str ?? 'dft'}.webp`
  }
}
function initCurrency() {
  if (depositCurrencyList.value.length > 0) {
    if (application.isVirtualCurrency(props.initFiatCurrency))
      activeFiatCurrency.value = depositCurrencyList.value.filter(a => !application.isVirtualCurrency(a.currency_name))[0] as unknown as ICurrencyOption

    else
      activeFiatCurrency.value = depositCurrencyList.value.filter(a => a.currency_id === currencyConfig[props.initFiatCurrency]?.cur)[0] as unknown as ICurrencyOption
  }
}
initCurrency()

// 余额有变化，打码信息更新
watch(balanceData, () => {
  runGetFinanceDepositCurrencyData()
})
onActivated(() => {
  if (back_initCurrencyName)
    activeFiatCurrency.value = fiatCurrencyList.value.filter(a => a.currency_id === back_initCurrencyCode || a.currency_name === back_initCurrencyName)[0] as unknown as ICurrencyOption
  getData()
})
await application.allSettled([runAsyncPaymentMethodList({ currency_id: activeFiatCurrency.value.currency_id ?? '702' })])
</script>

<template>
  <div class="root wallet-wrap mb-[16px] flex flex-col gap-[16px]">
    <!-- 选择货币 -->
    <div v-if="fiatCurrencyList.length > 1" class="flex items-center justify-between">
      <label class="text-[14px] font-semibold leading-[19.6px]">{{ t('deposit_currency') }} <span class="text-tg-text-error ml-[5px] text-[12px]">*</span></label>
      <template v-if="activeFiatCurrency || fiatCurrencyList.length > 1">
        <div v-if="fiatCurrencyList.length === 1" class="text-tg-text-white bg-tg-secondary-dark flex items-center rounded-[4px] px-[10px] py-[11px] text-[14px] font-semibold">
          <AppCurrencyIcon icon-align="right" style="--tg-app-currency-icon-size:18px;" :currency-type="activeFiatCurrency.currency_name" show-name />
        </div>
        <BaseSelect
          v-else
          v-model="activeFiatCurrency.currency_name"
          class="select1"
          popper-clazz="deep-mode" :skidding="-28" popper :border="false" popper-strategy="fixed"
          :options="fiatCurrencyListOptions" style="--tg-base-select-popper-style-padding-x:10px;--tg-base-select-popper-style-padding-y:11px;" @popper-hide="onFiatPopperHide"
        >
          <template #label>
            <AppCurrencyIcon icon-align="right" style="--tg-app-currency-icon-size:18px;" :currency-type="activeFiatCurrency.currency_name" show-name />
          </template>
          <template #popper="{ hide }">
            <div id="WalletDeposit" class="bg max-h-[368px] max-w-[180px] flex flex-col gap-[16px] overflow-hidden pt-[12px]">
              <div class="w-full px-[10px]">
                <BaseSearch
                  v-model="fiatSearchValue" style="--tg-base-search-icon-size:16px;--tg-base-search-base-padding-x:12px;"
                  class="base-search-icon-color h-[36px]" :place-holder="t('search')" white-style shape="square"
                />
              </div>
              <div class="scroll-y w-full flex flex-col">
                <div
                  v-for="fiat in fiatCurrencyListOptions" :key="fiat.value"
                  class="theme-color text-tg-text-secondary flex-shrink-0 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap px-[10px] py-[10px] text-[14px] font-semibold"
                  @click="hide();onFiatCurrencyChange(fiat)"
                >
                  <div class="flex items-center justify-between">
                    <AppCurrencyIcon :currency-type="fiat.label" show-name />
                    <span>{{ fiat.balance }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </BaseSelect>
      </template>
    </div>
    <AppLoading v-if="isDataLoading" />
    <!-- 针对葡萄牙语的处理：插拔式 -->
    <template v-else-if="isPtbr && activeFiatCurrency.currency_name === 'BRL'">
      <AppWalletDepositPayPanel
        v-if="paymentMethodPtList.length > 0" :payment-method-list="paymentMethodPtList" :active-currency="activeFiatCurrency"
      />
      <template v-else>
        <div class="border-tg-text-lightgrey w-full border-[2px] rounded-[4px] border-dashed bg-[var(--app-wallet-deposit-walletV3-bg)] py-[20px]">
          <div class="flex justify-center gap-[12px]">
            <IconUniWarningColor style="font-size: var(--tg-font-size-base);" name="uni-warning-color" />
            <div class="font-medium leading-[19.6px]">
              <div>
                {{ t('not_deposit_information_currency') }}
              </div>
              <div>{{ t('please_again_later_contact_customer_service') }}</div>
            </div>
          </div>
        </div>
      </template>
    </template>
    <template v-else>
      <template v-if="paymentMethodList?.method?.length ?? 0 > 0">
        <BaseLabel
          :label="t('choose_pay_methods')"
        >
          <div class="mt-[6px] flex flex-col rounded-[4px] bg-[var(--app-wallet-deposit-walletV3-bg)] px-[9px] py-[6px]">
            <!-- 线上支付列表 -->
            <BaseLabel
              v-for="list in renderList" :key="list.id" :label="list.name" class="mt-[6px] flex flex-col"
            >
              <div v-for="item in list.merchants" :key="item.id" class="relative my-[6px] h-[50px] text-[12px] w-full cursor-pointer rounded bg-[var(--app-wallet-deposit-walletV3-tabs-bg)]" @click="gotoDepositFiatDetail(item, list.id, list.payment_type, list.bank, list.zkId)">
                <div class="absoluteleft-0 top-0 inline-flex items-center justify-start gap-[1px]">
                  <div class="bg-tg-wallet-left-card-bg h-[50px] w-[60px] flex items-center justify-center rounded-bl rounded-tl">
                    <BaseImage width="24px" height="24px" :url="getMerchantsIconPath(list.payment_type, item)" is-network />
                  </div>
                  <div class="text-tg-text-white ml-[6px] w-[72px] text-[12px] font-medium @md:w-[220px]">
                    {{ item.name }}
                  </div>
                </div>
                <div class="absolute right-[5px] top-[18px] inline-flex items-center justify-end gap-[1px]">
                  <div class="color-secondary text-left text-[12px] font-medium">
                    {{ item.amount_min }}-{{ item.amount_max }} {{ activeFiatCurrency.currency_name === 'VND' ? 'KVND' : activeFiatCurrency.currency_name }}
                  </div>
                  <IconUniArrowRight />
                </div>
                <div v-if="list.pname" class="absolute right-0 top-0 h-[14px] inline-flex items-center justify-end gap-[10px] rounded-bl rounded-tr px-[10px]" :style="{ backgroundColor: tipLableColor(list.ptype) }">
                  <div class="text-right text-[12px] font-semibold text-white">
                    {{ list.pname }} {{ list.ptype === 1002 ? `${list.promo}%` : '' }}
                  </div>
                </div>
              </div>
              <div v-if="ifShowMore(list.id)" class="text-special mb-[6px] mt-[4px] cursor-pointer text-center text-[14px]" @click="onShowAllClick(list.id)">
                {{ t('show_more') }}
              </div>
              <div v-if="ifShowHide(list.id)" class="text-special mb-[6px] mt-[4px] cursor-pointer text-center text-[14px]" @click="onHideALlClick(list.id)">
                {{ t('hide_all') }}
              </div>
            </BaseLabel>
          </div>
        </BaseLabel>
      </template>
      <template v-else>
        <div class="border-tg-text-lightgrey w-full border-[2px] rounded-[4px] border-dashed bg-[var(--app-wallet-deposit-walletV3-bg)] py-[20px]">
          <div class="flex justify-center gap-[12px]">
            <IconUniWarningColor style="font-size: var(--tg-font-size-base);" />
            <div class="font-medium leading-[19.6px]">
              <div>
                {{ t('not_deposit_information_currency') }}
              </div>
              <div>{{ t('please_again_later_contact_customer_service') }}</div>
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<style>
:root {
  --app-wallet-deposit-walletV3-bg: var(--tg-secondary-dark);
  --app-wallet-deposit-walletV3-tabs-bg: var(--tg-secondary-main);
}

[theme='white'] {
  --app-wallet-deposit-walletV3-bg: #ffffff;
  --app-wallet-deposit-walletV3-tabs-bg: #e8e8e8;
}
</style>

<style lang='scss' scoped>
.select1 {
  @include webTheme('green') {
    --tg-base-select-popper-bg-color: #02432d;
  }
}
.base-search-icon-color {
  @include webTheme('white') {
    --tg-base-search-icon-color: #c1c1c1;
    --tg-base-search-icon-border-color: #c1c1c1;
    --tg-text-grey-light: #555555;
    --tg-secondary-main: #555555;
  }
}

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
.type-other {
  .other-first {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}
.text-special {
  color: var(--tg-text-lightgrey);
}
.color-secondary {
  color: var(--tg-text-lightgrey);
}
.wallet-wrap {
  @include webTheme('green') {
    --tg-body-bg: var(--tg-green-dark);
  }
}
</style>
