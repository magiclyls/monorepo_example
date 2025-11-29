<script setup lang="ts">
import type { CurrencyCode, EnumCurrencyKey, IAvailableCurrency } from '@tg/types'
import { PhBaseCurrencyIcon, PhBaseFinanceEmpty, PhBaseLabel, PhBaseSelectCurrency } from '@tg/bccomponents'
import { IconMore, IconUniArrowDown1 } from '@tg/icons'
import { useAppStore, useCurrency } from '@tg/stores'
import { application, delay, isVirtualCurrency, Local, STORAGE_WALLET_ROUTE } from '@tg/utils'
import { isPtbr, isZhcn } from '@tg/vue-i18n'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import MerchantList from './merchant-list.vue'

interface ICurrencyOption extends IAvailableCurrency {
  label: EnumCurrencyKey
  value: CurrencyCode
}
interface Props {
}
defineOptions({
  name: 'AppFiatDeposit',
})
const props = defineProps<Props>()
const emit = defineEmits(['changeCurrency', 'loaded'])
const { t } = useI18n()
const router = useRouter()
const route = useRoute()
/* const customRouter = useCustomRouter() */
/* const back_initCurrencyName = customRouter.backQuery.initCurrency as EnumCurrencyKey
const back_initCurrencyCode = getCurrencyConfig[back_initCurrencyName]?.cur */
const appStore = useAppStore()
const currencyStore = useCurrency()
const { comboList } = storeToRefs(appStore)
/** 当前存款货币列表：depositCurrencyList  钱包存款接口请求：runGetFinanceDepositCurrencyData */
const { depositCurrencyList, currentGlobalCurrencyMap, currencyList } = storeToRefs(currencyStore)
const showIds = ref<Array<string>>([])
const fiatSearchValue = ref('')
/** 当前的支付ID */
const curPaymentId = ref('')
/** 当前的法币 */
const activeFiatCurrency = ref({} as ICurrencyOption)

/** 当前法币列表 */
const fiatCurrencyList = computed(() => {
  if (depositCurrencyList.value.length) {
    return depositCurrencyList.value.filter(a => !isVirtualCurrency(a.currency_name)).map((b) => {
      return {
        ...b,
        label: b.currency_name,
        value: b.currency_id,
        type: b.currency_name,
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
      type: a.currency_name,
    }
  })
})
/** 只有一个支付方式 */
const isOnlyOnePaymentMethod = computed(() => comboList.value?.method ? comboList.value.method.length === 1 : false)
/** 在中文状态下，过滤法币里的钱包支付列表 */
const filterWalletPaymentList = computed(() => {
  if (isZhcn())
    return comboList.value?.method ? comboList.value.method.filter(a => a.alias !== 'qb') : []
  else
    return comboList.value?.method ? comboList.value.method : []
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
  if (isPtbr() && activeFiatCurrency.value.currency_id === '702' && comboList.value?.method) {
    return comboList.value?.method.map((a) => {
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
  if (comboList.value?.method && comboList.value.method.length > 0) {
    if (isOnlyOnePaymentMethod.value)
      return comboList.value.method.filter(a => a.id === id)[0].merchants.length > 5 && !showIds.value.includes(id)

    return comboList.value.method.filter(a => a.id === id)[0].merchants.length > 2 && !showIds.value.includes(id)
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
/** 切换货币类型事件 */
function onFiatCurrencyChange(item: ICurrencyOption) {
  activeFiatCurrency.value = item
  appStore.runAsyncPayCombo({ currency_id: activeFiatCurrency.value.currency_id })
}

/** 选择线上支持或转账 */
function gotoDepositFiatDetail({ item, list }: { item: any, list: any }) {
  const { id, payment_type, bank, zkId } = list
  curPaymentId.value = item.id
  Local.push(STORAGE_WALLET_ROUTE, {
    currencyType: 'fiat', // 当前的货币类型
    currencyId: activeFiatCurrency.value.currency_id, // 当前的货币ID
    currencyName: activeFiatCurrency.value.currency_name, // 当前的货币名称
    curMerchant: JSON.stringify(item), // 当前的支付通道
    curPaymentType: payment_type,
    paymentId: id, // 当前的支付ID
    initHaveBank: bank,
    initzkId: zkId,
    initFiatCurrency: JSON.stringify(activeFiatCurrency.value), // 初始化当前法币
    activeCurrency: JSON.stringify(activeFiatCurrency.value), // 初始化当前法币
    curDepositPromo: JSON.stringify(curDepositPromo(id)), // 当前支付优惠
    merchantsList: JSON.stringify(curMerchantsList(id)), // 当前支付通道列表
  })
  router.push({
    path: '/wallet/deposit-detail',
    query: {

    },
  })
}
/** 选择当前的支付优惠 */
function curDepositPromo(id: string) {
  const curPaymentMethod = comboList.value?.method.filter(a => a.id === id)[0]
  return curPaymentMethod?.deposit_promo
}
/** 选择当前的支付通道 */
function curMerchantsList(id: string) {
  const curPaymentMethod = comboList.value?.method.filter(a => a.id === id)[0]
  return curPaymentMethod?.merchants
}

const defaultCurrency = computed(() => {
  const routeCurrency = route.query.currency as CurrencyCode
  const firstFiat = fiatCurrencyList.value[0]
  const defaultCode = routeCurrency || (isVirtualCurrency(currentGlobalCurrencyMap.value.type) ? firstFiat.currency_id : currentGlobalCurrencyMap.value.cur)
  return fiatCurrencyList.value.find(a => a.currency_id === defaultCode) || firstFiat
})

watch(defaultCurrency, onFiatCurrencyChange, { immediate: true })

watch(activeFiatCurrency, (t) => {
  if (t) {
    router.replace({
      query: {
        ...route.query,
        currency: t.currency_id,
      },
    })
  }
}, { immediate: true })

// 余额有变化，打码信息更新
watch(currencyList, () => {
  currencyStore.getFinanceDepositCurrency()
})
const loadingTime = 500
setTimeout(() => {
  emit('loaded')
}, loadingTime)
await application.allSettled([delay(loadingTime)])
</script>

<template>
  <div class="my-[16rem] p-[12rem] flex flex-col gap-[16rem] rounded-[8rem]  bg-white">
    <!-- 选择货币 -->
    <PhBaseLabel :label="t('存款货币')" required layout="horizontal">
      <template v-if="fiatCurrencyList.length > 0">
        <div
          v-if="fiatCurrencyList.length === 1"
          class="flex items-center justify-between h-[40rem] px-[8rem] border-solid border border-[#EBEBEB] rounded-[4rem]"
        >
          <PhBaseCurrencyIcon icon-align="left" :show-name="true" style="--ph-app-currency-icon-size:18rem;" :currency-type="activeFiatCurrency.currency_name" />
        </div>
        <PhBaseSelectCurrency v-else v-slot="slotProps" :t="t" :options="fiatCurrencyListOptions" :currency="activeFiatCurrency?.currency_id" @choose="onFiatCurrencyChange">
          <div class="flex items-center justify-between h-[40rem] px-[8rem] border-solid border  rounded-[4rem]" :class="[slotProps.isMenuShown ? 'border-[#F23038]' : 'border-[#EBEBEB]']">
            <PhBaseCurrencyIcon icon-align="left" :show-name="true" style="--ph-app-currency-icon-size:18rem;" :currency-type="activeFiatCurrency.currency_name" />
            <IconUniArrowDown1 v-if="fiatCurrencyListOptions.length > 1" class="ml-[4rem] text-[#9dabc9]" />
          </div>
        </PhBaseSelectCurrency>
      </template>
    </PhBaseLabel>
    <!-- 针对葡萄牙语的处理：插拔式 -->
    <!--    <template v-else-if="isPtbr() && activeFiatCurrency.currency_name === 'BRL'">
      <AppWalletDepositPayPanel
        v-if="paymentMethodPtList.length > 0" :payment-method-list="paymentMethodPtList" :active-currency="activeFiatCurrency"
      />
      <PhBaseFinanceEmpty v-else :description="$t('无存款渠道')" />
    </template> -->
    <PhBaseLabel v-if="comboList?.method?.length" :label="t('选择支付方式')">
      <div class="px-[9rem] pt-[6rem] pb-[12rem] flex flex-col gap-[6rem] border-solid border border-[#EBEBEB] rounded-[4rem]">
        <!-- 线上支付列表 -->
        <div
          v-for="list in renderList" :key="list.id" :label="list.name" class="mt-6 flex flex-col"
        >
          <div class="font-[500] mb-[6rem]">
            {{ list.name }}
          </div>
          <MerchantList :list="list" currency-type="fiat" :currency="activeFiatCurrency" @itemclick="gotoDepositFiatDetail" />
          <div v-if="ifShowMore(list.id)" class="center mt-6 cursor-pointer " @click="onShowAllClick(list.id)">
            <IconMore class="text-[24rem] more" />
          </div>
          <div v-if="ifShowHide(list.id)" class="center mt-6 cursor-pointer" @click="onHideALlClick(list.id)">
            <IconMore class="text-[24rem] rotate-180 more" />
          </div>
        </div>
      </div>
    </PhBaseLabel>
    <PhBaseFinanceEmpty v-else :description="$t('无存款渠道')" />
  </div>
</template>

<style lang='scss' scoped>
.more {
  color: #f23038;
}
</style>
