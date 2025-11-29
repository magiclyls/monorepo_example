<script setup lang='ts'>
import type { CurrencyCode, CurrencyData, PayInfo } from '@tg/types'
import { ApiFinanceRecordDepositCoin, ApiFinanceRecordOther, ApiFinanceRecordOtherSelect, ApiFinanceRecordWithdrawBank, ApiFinanceRecordWithdrawCoin, ApiFinancRecordDepositBank } from '@tg/apis'
import { BaseList, PhBaseAmount, PhBaseButton, PhBaseCurrencyIcon, PhBaseDatePicker, PhBaseDialog, PhBaseEmpty, PhBaseTabs } from '@tg/bccomponents'
import { useList } from '@tg/hooks'
import { IconBirArrow } from '@tg/icons'
import { useCurrency } from '@tg/stores'
import { getCurrencyConfig } from '@tg/utils'
import { timeToFormatFullTimeByBoss } from '@tg/vue-i18n'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, toRaw, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
import AppLoading from '~/components/AppLoading.vue'
import AppPageLayout from '~/components/AppPageLayout.vue'
import BaseScrollTab from '~/components/BaseScrollTab.vue'
import { useWindowHeightRem } from '~/hooks'

defineOptions({ name: 'TransactionRecord' })

interface BaseTabItem {
  label: string
  value: string | number
  name: string
}
const router = useRouter()
const list = ref<PayInfo[]>([])
const total = ref(0)
const showDialog = ref(false)
const range = ref('')
const containerEl = ref()
const currencyStore = useCurrency()
const { currencyList } = storeToRefs(currencyStore)
// 加密货币存款
const recordDepositCoin = useList(ApiFinanceRecordDepositCoin, { manual: true }, { page_size: 10 })
// 法定货币存款
const recordDepositBank = useList(ApiFinancRecordDepositBank, { manual: true }, { page_size: 10 })
// 加密货币取款
const recordWithdrawCoin = useList(ApiFinanceRecordWithdrawCoin, { manual: true }, { page_size: 10 })
// 法定货币取款
const recordWithdrawBank = useList(ApiFinanceRecordWithdrawBank, { manual: true }, { page_size: 10 })
// 其他
const financeRecordOther = useList(ApiFinanceRecordOther, { manual: true }, { page_size: 10 })

const { t } = useI18n()
const tab = ref('deposit')
const activeRecord = ref<any>(getInit())
const stateVal = ref('0')
const date = ref([])
const parentEl = ref(null)
const parentDom = ref(null)
const selectedSecondLevelTab = ref<number | string>('real_coin')
const { heightRem } = useWindowHeightRem()
const statusTabs = ref<BaseTabItem[]>([
  {
    label: t('全部'),
    value: '0',
    name: t('全部'),
  },
  {
    label: t('成功'),
    value: '1',
    name: t('成功'),
  },
  {
    label: t('失败'),
    value: '2',
    name: t('失败'),
  },
  {
    label: t('进行中'),
    value: '3',
    name: t('进行中'),
  },
])

const currencyTypeTabs = ref<BaseTabItem[]>([
  { label: t('法定货币'), value: 'real_coin', name: t('法定货币') },
  { label: t('加密货币'), value: 'byte_coin', name: t('加密货币') },
])

const otherTabs = ref<BaseTabItem[]>([])

function transferCurrencyIdToName(id: CurrencyCode) {
  return currencyList.value.find((item: CurrencyData) => item.cur === id)?.type
}

const {
  runAsync: runRecordOtherSelect,
} = useRequest(ApiFinanceRecordOtherSelect, {
  onSuccess(data) {
    otherTabs.value = data?.map?.((item) => {
      return { label: item.name, value: item.id, name: item.name }
    }) || []
    if (tab.value === 'other') {
      activeRecord.value.runAsync({
        page: activeRecord.value.page,
        page_size: activeRecord.value.page_size,
        id: tab.value.toString(),
        start_date: date.value[0],
        end_date: date.value[1],
        state: '0',
      })
    }
  },
})

const getList = computed(() => {
  return groupDataByDate(list.value)
})

const tabList = computed<BaseTabItem[]>(() => {
  return [
    { label: t('存款'), value: 'deposit', name: t('存款') },
    { label: t('提款'), value: 'withdraw', name: t('提款') },
    { label: t('其他'), value: 'other', name: t('其他') },
  ]
})

function formatDepositState(state: number) {
  // <!--1：成功，2：失败，3，支付中，4：删除，5:待审核 6：取消-- >
  switch (state) {
    case 1: return t('成功')
    case 2: return t('失败')
    case 3: return t('进行中')
    case 4: return t('失败')
    case 5: return t('进行中')
    case 6: return t('失败')
    default: return '--'
  }
}

function formatWithdrawState(state: number) {
  // <!--1：成功，2：拒绝，3，审核中，4：删除，5：三方异常，6：出款中-- >
  switch (state) {
    case 1: return t('成功')
    case 2: return t('失败')
    case 3: return t('进行中')
    case 4: return t('失败')
    case 5: return t('失败')
    case 6: return t('进行中')
    default: return '--'
  }
}

function getTransactionWay(item: PayInfo) {
  if (tab.value === 'other') {
    return item.cash_type_name
  }
  else if (selectedSecondLevelTab.value === 'real_coin') {
    return item.pay_method_name || item.cash_type_name || `${item.currency_name}`
  }
  else {
    return item.currency_name
  }
}

function groupDataByDate(rawList: typeof activeRecord.value.list) {
  const groupedObj: Record<string, typeof rawList> = {}
  for (const item of rawList) {
    const dateKey = dayjs(item.created_at * 1000).format('MM月DD日')
    if (!groupedObj[dateKey]) {
      groupedObj[dateKey] = []
    }
    groupedObj[dateKey].push(item)
  }

  return groupedObj
}

function getInit() {
  switch (tab.value) {
    case 'deposit': return recordDepositBank
    case 'withdraw': return recordWithdrawBank
    case 'other': return financeRecordOther
  }
}

function runInit() {
  if (activeRecord.value.loading || !date.value.length)
    return
  if (tab.value === 'other') {
    // TransactionLockerIn       = 838  //存入  3
    // TransactionLockerOut      = 839  //取出.  3
    // TransactionLockerInterest = 8370 //利息结算 3
    // 如果id匹配上，就添加 wallet_type = 3
    const walletType3List = ['838', '839', '8370']

    // TransactionWalletInLocker  = 8371 //主钱包转入利息宝. 1
    // TransactionLockerOutWallet = 8372 //利息宝转入主钱包 1
    // 如果id匹配上，就添加 wallet_type = 1
    const walletType1List = ['8371', '8372']

    const params: any = {
      page: activeRecord.value.page,
      page_size: activeRecord.value.page_size,
      id: selectedSecondLevelTab.value.toString(),
      state: '0',
      start_date: date.value[0],
      end_date: date.value[1],
    }
    if (walletType3List.includes(selectedSecondLevelTab.value.toString()))
      params.wallet_type = '3'
    if (walletType1List.includes(selectedSecondLevelTab.value.toString()))
      params.wallet_type = '1'

    activeRecord.value.run(params)
  }
  else {
    activeRecord.value.run({
      state: stateVal.value,
      start_date: date.value[0],
      end_date: date.value[1],
      id: selectedSecondLevelTab.value.toString(),
    })
  }
}

function tabChange() {
  list.value = []
  total.value = 0
  if (tab.value === 'deposit') {
    if (selectedSecondLevelTab.value === 'real_coin') {
      activeRecord.value = recordDepositBank
    }
    else {
      activeRecord.value = recordDepositCoin
    }
  }
  else if (tab.value === 'withdraw') {
    if (selectedSecondLevelTab.value === 'real_coin') {
      activeRecord.value = recordWithdrawBank
    }
    else {
      activeRecord.value = recordWithdrawCoin
    }
  }
  else {
    activeRecord.value = financeRecordOther
  }
  activeRecord.value.page = 1
  activeRecord.value.list.length = 0
  runInit()
}

function loadMore() {
  activeRecord.value.page++
}

function getColor(item: PayInfo) {
  return item.state === 1 ? '#2BA471' : (item.state === 3 || (item.state === 5 && tab.value === 'deposit') || (item.state === 6 && tab.value === 'withdraw')) ? '#F88D22' : '#FF4D4F'
}

watch(tab, () => {
  stateVal.value = '0'
  selectedSecondLevelTab.value = 'real_coin'
  if (tab.value === 'other') {
    if (otherTabs.value?.length) {
      selectedSecondLevelTab.value = otherTabs.value[0].value
    }
    else {
      selectedSecondLevelTab.value = ''
    }
  }
  tabChange()
})

watch(stateVal, () => {
  tabChange()
})

watch(selectedSecondLevelTab, () => {
  stateVal.value = '0'
  tabChange()
})

watch(() => activeRecord.value.list, () => {
  if (activeRecord.value.list?.length) {
    list.value = [...toRaw(list.value ?? []), ...activeRecord.value.list]
  }
  total.value = activeRecord.value.total
}, { deep: true })

if (tab.value !== 'other' && date.value.length) {
  activeRecord.value.run({
    state: stateVal.value,
    start_date: date.value[0],
    end_date: date.value[1],
    id: selectedSecondLevelTab.value.toString(),
  })
}
onMounted(() => {
  runRecordOtherSelect()
})

watch(date, () => {
  list.value = []
  activeRecord.value.run({
    state: stateVal.value,
    start_date: date.value[0],
    end_date: date.value[1],
    id: selectedSecondLevelTab.value.toString(),
  })
}, {
  deep: true,
})

onMounted(() => {
  parentDom.value = parentEl.value
})
</script>

<template>
  <AppPageLayout :title="t('交易记录')" style="--ph-page-layout-padding-x:0;--ph-page-layout-padding-y:0">
    <div id="transaction-record" ref="containerEl" class="relative">
      <div class="px-[10rem] py-[16rem]" :style="{ minHeight: `${heightRem - 42}rem` }">
        <div class="flex justify-between items-start">
          <PhBaseTabs v-model="tab" :list="tabList" :type="3" class="mb-[16rem]" />
          <div class="text-[#6D7693] text-[14rem] font-[500] flex items-center gap-[4rem]" @click="showDialog = true">
            {{ range }}
            <IconBirArrow class="text-[#9dabc8] text-[10rem] mr-[4rem]" />
          </div>
        </div>
        <BaseScrollTab :list="tab === 'other' ? otherTabs : currencyTypeTabs" gap="12rem">
          <template #default="{ item, onClick }">
            <PhBaseButton :type="selectedSecondLevelTab === item.value ? 'primary' : 'secondary'" class="h-[40rem] mb-[16rem]" style="--ph-base-button-font-size: 14rem; --ph-base-button-font-weight: 500; --ph-base-button-border-color: #EBEBEB;--ph-base-button-secondary-background-color:#fff; --ph-base-button-border-radius: 4rem" @click="selectedSecondLevelTab = item.value;onClick($event, item)">
              {{ item.label }}
            </PhBaseButton>
          </template>
        </BaseScrollTab>
        <div class="bg-[#fff] rounded-[8rem] px-[10rem] py-[12rem]" :class="list.length > 0 && 'pb-0'">
          <PhBaseTabs v-if="tab !== 'other'" v-model="stateVal" :list="statusTabs" :type="3" class="mb-[16rem]" />
          <BaseList
            v-if="list.length > 0" :finished="list.length > 0 ? list.length >= total : false"
            :loading="activeRecord.loading" :need-stop="false" hide-loading @load="loadMore"
          >
            <div v-for="key in Object.keys(getList)" :key="key" class="bg-[#F6F7F8] rounded-[6rem] mb-[16rem] last-of-type:mb-0 pb-[8rem]">
              <div class="px-[12rem] text-[#0D2245] py-[8rem] font-[500] border-b border-b-[#EBEBEB]">
                {{ key }}
              </div>
              <div
                v-for="item in getList[key]" :key="item.order_number" class="mt-[16rem] px-[12rem] py-[6rem] text-[36rem] flex" @click="tab !== 'other' && router.push({
                  name: 'TransactionRecordDetail',
                  query: { data: JSON.stringify({ ...item, method: tab, status: tab === 'deposit' ? formatDepositState(item.state) : formatWithdrawState(item.state), color: getColor(item) }) } })"
              >
                <PhBaseCurrencyIcon :currency-type="item.currency_name || getCurrencyConfig(item.currency_id).name" style="--ph-app-currency-icon-size:36rem" />
                <div class="flex flex-col gap-[10rem] flex-1 ml-[8rem]">
                  <div class="text-[14rem] font-[500] text-[#0D2245] text-left">
                    {{ getTransactionWay(item) }}
                  </div>
                  <div class="text-[#6D7693] text-[12rem] font-[500] text-left">
                    {{ timeToFormatFullTimeByBoss(item.created_at) }}
                  </div>
                </div>
                <div class="flex flex-col gap-[9rem] items-end">
                  <PhBaseAmount :amount="item.pay_amount || item.amount" :show-icon="false" style="--ss-app-amount-amount-margin:0; --ss-app-amount-font-weight: 500" :currency-type="getCurrencyConfig(item.currency_id)?.name" class="text-[14rem] mr-[0]" />
                  <div v-if="tab !== 'other'" class="text-[#6D7693] text-[12rem] font-[500] text-right" :style="{ color: getColor(item) }">
                    {{ tab === 'deposit' ? formatDepositState(item.state) : formatWithdrawState(item.state) }}
                  </div>
                </div>
              </div>
            </div>
          </BaseList>
          <div v-else-if="activeRecord.loading">
            <AppLoading :height="156" :full-screen="false" />
          </div>
          <PhBaseEmpty v-else img="/ph-h5/png/uni-table-empty.png" class=" h-[156rem]" :description="t('暂无数据')" />
        </div>
      </div>
      <PhBaseDialog v-model="showDialog" :show-close="false" :teleport="containerEl" position="start" style="--ph-base-dialog-width:100%;--ph-base-dialog-background-color:rgba(246, 247, 248, 1);--ph-base-dialog-border-top-radius:0; --ph-base-dialog-border-bottom-radius:8rem;--ph-base-dialog-position:absolute" :show-header="false">
        <div class="px-[10rem] py-[16rem]">
          <div class="flex justify-between items-start">
            <PhBaseTabs v-model="tab" :list="tabList" :type="3" />
            <div class="text-[#F23038] text-[14rem] font-[500] flex items-center" @click="showDialog = false">
              {{ range }}
              <IconBirArrow class="ml-[4rem] rotate-180 text-[#F23038] text-[10rem] mr-[4rem]" />
            </div>
          </div>
          <div class="text-[#6D7693] text-[14rem] font-[500] mt-[16rem]">
            {{ t('当前系统支持查询近3个月存取款记录') }}
          </div>
          <PhBaseDatePicker
            v-model="date"
            v-model:range="range"
            class="mt-[16rem] w-full"
            :is-utc="false"
            show-tab
            @change="showDialog = false"
          />
        </div>
      </PhBaseDialog>
    </div>
  </AppPageLayout>
</template>
