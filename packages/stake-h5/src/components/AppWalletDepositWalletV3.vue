<!-- 人民币：钱包支付 -->
<script setup lang="ts">
import { IconUniArrowRight, IconUniWarningColor } from '@tg/icons'
import { ApiFinanceMethodComboListV2 } from '@tg/apis'

defineOptions({
  name: 'AppWalletDepositWalletV3',
})
const { t } = useI18n()
const { bool: isDataLoading } = useBoolean(false)
const appStore = useAppStore()
const customRouter = useCustomRouter()
const promoStore = usePromoStore()
const { depositDetail } = storeToRefs(promoStore)
/** 当前的支付ID */
const curPaymentId = ref('')
/** 当前的法币 */
const activeFiatCurrency = ref({
  currency_id: '701',
  currency_name: 'CNY',
})
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
const _paymentMethodList = computed(() => {
  if (paymentMethodList.value?.method && paymentMethodList.value.method.length > 0)
    return paymentMethodList.value.method.filter(a => a.alias === 'qb')
  else
    return []
})
const renderList = computed(() => {
  if (_paymentMethodList.value && _paymentMethodList.value.length > 0) {
    return _paymentMethodList.value.map((a) => {
      return {
        ...a,
        merchants: a.merchants,
      }
    })
  }
  return []
})
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
/** 选择线上支持或转账 */
function gotoDepositFiatDetail(itsm: any, id: any, type: any, haveBank: boolean, zkId: string) {
  curPaymentId.value = itsm.id
  customRouter.push('/deposit/detail', {
    currencyType: 'wallet', // 当前的货币类型
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
    from_sub_tab: 'wallet',
  })
}
/** 选择当前的支付优惠 */
function curDepositPromo(id: string) {
  if (_paymentMethodList?.value && _paymentMethodList.value.length > 0)
    return _paymentMethodList.value.filter(a => a.id === id)[0].deposit_promo

  else
    return []
}
/** 选择当前的支付通道 */
function curMerchantsList(id: string) {
  if (_paymentMethodList?.value && _paymentMethodList.value.length > 0)
    return _paymentMethodList.value.filter(a => a.id === id)[0].merchants

  else
    return []
}
/** 获取图标路径 */
function getMerchantsIconPath(type: number, str: string) {
  return type === 2 ? `/webp/bank/${str}.webp` : `/payment/deposit/${str ?? 'dft'}.webp`
}

watch(renderList, (_renderList) => {
  if (_renderList.length > 0) {
    if (depositDetail.value && depositDetail.value.subTab === 'wallet' && depositDetail.value.detail) {
      const merchantId = depositDetail.value.detail.id
      let listItem: any = null
      let merchantItem: any = null
      _renderList.forEach((itemTemp) => {
        const tempMerChantItem = itemTemp?.merchants.find(item => item.id === merchantId)
        if (tempMerChantItem) {
          listItem = itemTemp
          merchantItem = tempMerChantItem
        }
      })
      if (listItem && merchantItem) {
        gotoDepositFiatDetail(merchantItem, listItem.id, listItem.payment_type, listItem.bank, listItem.zkId)
        promoStore.setDepositDetail(null)
      }
    }
  }
})
await application.allSettled([runAsyncPaymentMethodList({ currency_id: activeFiatCurrency.value.currency_id })])
</script>

<template>
  <div class="pay-list-wrap flex flex-col gap-[16px]">
    <AppLoading v-if="isDataLoading" />
    <!-- 选择支付方式 -->
    <template v-else>
      <template v-if="renderList?.length ?? 0 > 0">
        <div class="mt-[6px] flex flex-col rounded-[4px] bg-[var(--app-wallet-deposit-walletV3-bg)] px-[9px] py-[6px]">
          <!-- 线上支付列表 -->
          <div
            v-for="list in renderList" :key="list.id" class="flex flex-col"
          >
            <div v-for="item in list.merchants" :key="item.id" class="relative my-[6px] h-[50px] w-full flex cursor-pointer break-all rounded bg-[var(--app-wallet-deposit-walletV3-tabs-bg)] text-[12px] leading-[12px]" @click="gotoDepositFiatDetail(item, list.id, list.payment_type, list.bank, list.zkId)">
              <div class="inline-flex flex-1 items-center justify-start gap-[1px]">
                <div class="bg-tg-wallet-left-card-bg h-[50px] w-[60px] flex items-center justify-center rounded-bl rounded-tl">
                  <BaseImage width="24px" height="24px" :url="getMerchantsIconPath(list.payment_type, item.zk_id)" is-network />
                </div>
                <div class="text-tg-text-white ml-[6px] flex-1 font-medium">
                  {{ item.name }}
                </div>
              </div>
              <div class="placeholder w-[132px] @md:w-[242px]" />
              <div class="absolute right-[5px] top-[18px] h-[24px] inline-flex items-center justify-end gap-[1px]">
                <div class="color-secondary text-right font-medium @md:w-[220px]">
                  {{ item.amount_min }}-{{ item.amount_max }} {{ activeFiatCurrency.currency_name }}
                </div>
                <IconUniArrowRight />
              </div>
              <div v-if="list.pname" class="absolute right-0 top-0 h-[14px] inline-flex items-center justify-end gap-[10px] rounded-bl rounded-tr px-[10px]" :style="{ backgroundColor: tipLableColor(list.ptype) }">
                <div class="text-right font-semibold text-white">
                  {{ list.pname }}{{ list.ptype === 1002 ? `${list.promo}%` : '' }}
                </div>
              </div>
            </div>
          </div>
        </div>
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
  /* --app-wallet-deposit-walletV3-bg: #d8d8d8; */
  --app-wallet-deposit-walletV3-bg: #ffffff;
  /* --app-wallet-deposit-walletV3-tabs-bg: #E8E8E8; */
  --app-wallet-deposit-walletV3-tabs-bg: #f5f5f5;
}
[theme='green'] {
  --tg-wallet-green-dark-bg: #02432d;
}
</style>

<style lang="scss" scoped>
.color-secondary {
  color: var(--tg-text-lightgrey);
}
[theme='white'] {
  .color-secondary {
    color: #555;
  }
}
.pay-list-wrap {
  @include webTheme('green') {
    --app-wallet-deposit-walletV3-tabs-bg: var(--tg-body-bg);
    --tg-wallet-left-card-bg: var(--tg-sport-card-bg);
    --app-wallet-deposit-walletV3-bg: var(--tg-wallet-green-dark-bg);
  }
}
</style>
