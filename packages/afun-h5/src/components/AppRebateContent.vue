<script setup lang='ts'>
import type { Column } from '@tg/types'
import { ApiMemberRebateAutomatic, ApiMemberTieredRebateSumValidBet, ApiMemberTieredRebateValidBet, ApiMemberVipRebateVIPConfig } from '@tg/apis'
import { AfunBaseAmount, AfunBaseEmpty, AfunBaseImage, AfunBaseTable, AfunBaseTabs } from '@tg/bccomponents'
import { useRebateData } from '@tg/hooks'
import { IconUniArrowRight } from '@tg/icons'
import { useAppStore, useCurrency, useVipStore } from '@tg/stores'
import { EventBusNames } from '@tg/types'
import { add, appEventBus, application, getCurrencyConfig } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
import AppLoading from '~/components/AppLoading.vue'

defineOptions({ name: 'AppRebateContent' })

interface SourceItemType {
  v: string
  r: string[]
  vba: string
}

const { t } = useI18n()
const router = useRouter()
const vipStore = useVipStore()
const { isLogin } = storeToRefs(useAppStore())
const { rebateTypeArr, customPlatformName, customFormat } = useRebateData()
const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())

/** 获取返水配置 */
const { runAsync: runAsyncRebateAutomatic, data: rebateAutomatic } = useRequest(ApiMemberRebateAutomatic)
/** VIP返水模式 */
const { runAsync: runVipRebateVIPConfig } = useRequest(ApiMemberVipRebateVIPConfig)
/** 梯级返水数据 */
const tieredRebateValidBetData = ref()
/** 当前类型总的可领取金额 */
const tieredTotalRebate = ref('0')
/** 合并计算的tab数据映射 */
const uniformTieredRebateValidBetDataReflect = ref()
const uniformTab = ref('')
const uniformOption = ref<typeof rebateTypeArr>([])
/** 梯级返水模式  不是统一场馆 */
const { runAsync: runMemberTieredRebateValidBet } = useRequest(ApiMemberTieredRebateValidBet, {
  onSuccess: (data) => {
    tieredTotalRebate.value = '0'
    if (!data) {
      return tieredRebateValidBetData.value = data
    }
    else {
      tieredRebateValidBetData.value = data.map((item) => {
        const rebate_amount = customFormat(item.rebate_amount, 1)
        tieredTotalRebate.value = customFormat(add(+rebate_amount, +tieredTotalRebate.value), 1)
        const less_valid_bet_amount = customFormat(item.less_valid_bet_amount, 1)
        const valid_bet_amount = customFormat(item.valid_bet_amount, 1)
        const rate = customFormat(item.rate, 3)
        const next_rate = customFormat(item.next_rate, 3)
        const progressBar = `${+item.valid_bet_amount / +add(+item.less_valid_bet_amount, +item.valid_bet_amount) * 100}%`
        return { ...item, rebate_amount, less_valid_bet_amount, valid_bet_amount, progressBar, rate, next_rate }
      })
    }
  },
})
/** 梯级返水模式  统一场馆 */
const { runAsync: runMemberTieredRebateSumValidBet } = useRequest(ApiMemberTieredRebateSumValidBet, {
  onSuccess: (data) => {
    tieredTotalRebate.value = '0'
    if (!data) {
      return tieredRebateValidBetData.value = data
    }
    else {
      const uniformTieredRebateValidBetData = data.map((item) => {
        const rebate_amount = customFormat(item.rebate_amount, 1)
        tieredTotalRebate.value = customFormat(add(+rebate_amount, +tieredTotalRebate.value), 1)
        const less_valid_bet_amount = customFormat(item.less_valid_bet_amount, 1)
        const valid_bet_amount = customFormat(item.valid_bet_amount, 1)
        const rate = customFormat(item.rate, 3)
        const next_rate = customFormat(item.next_rate, 3)
        const progressBar = `${+item.valid_bet_amount / +add(+item.less_valid_bet_amount, +item.valid_bet_amount) * 100}%`
        // 场馆图标
        const game_type_icon = rebateTypeArr.find(a => item.game_type === a.value)?.icon
        const active_game_type_icon = rebateTypeArr.find(a => item.game_type === a.value)?.activeIcon
        return { ...item, rebate_amount, less_valid_bet_amount, valid_bet_amount, progressBar, rate, next_rate, game_type_icon, active_game_type_icon }
      })
      uniformTieredRebateValidBetDataReflect.value = uniformTieredRebateValidBetData.reduce((pre: any, item: any) => {
        pre[item.game_type] = item
        return pre
      }, {})
      tieredRebateValidBetData.value = [uniformTieredRebateValidBetDataReflect.value[uniformTab.value]]
      console.log('🚀 ~ tieredRebateValidBetData.value:', tieredRebateValidBetData.value)
    }
  },
})

const APILoading = ref(false)
/** 当前类型的值 */
const tab = ref('')
const tabList = ref<typeof rebateTypeArr>([])

const columns = ref<Column[]>([])
const rebateConfig = ref<{ [t: string]: string }[]>([])

/** 是否梯级模式 */
const isTiered = computed(() => {
  if (rebateAutomatic.value)
    return +rebateAutomatic.value.mode === 2
  return false
})
/** 是否梯级只展示一种货币 */
const isUnified = computed(() => {
  if (rebateAutomatic.value)
    return +rebateAutomatic.value.unified === 1
  return false
})
/** 是否梯级展示统一场馆 */
const isUnifiedSum = computed(() => {
  if (rebateAutomatic.value)
    return +rebateAutomatic.value.unified_sum === 1
  return false
})

/** 设置VIP表格头 */
function setColumn(name: string[]) {
  columns.value = name.map((item, index) => {
    const title = customPlatformName(item)
    return { title, dataIndex: `rate${index}`, align: 'center', color: 'var(--afun-table-text-color)' }
  })
  columns.value.unshift({
    title: `${t('vip等级', { data: 'VIP' })}`,
    dataIndex: 'v',
    align: 'center',
    slot: 'level',
    skeWidth: '32px',
  })
}
/** 设置VIP表格的值 */
function setSource(data: { v: string, r: string[] }[]) {
  rebateConfig.value = data.map((item) => {
    const { v, r, vba } = item as SourceItemType
    const obj: { [t: string]: string } = {}
    obj.vba = vipStore.isZeroShowOther(vba) ? vba : application.formatNumDecimal(vba, 2)
    obj.v = v
    for (const i in r)
      obj[`rate${i}`] = vipStore.isZeroShowOther(r[i]) ? '-' : `${application.formatNumDecimal(r[i], 2, 1)}%`
    return obj
  })
}
/** 组装VIP所有数据 */
function setAllData(data: Record<string, any>) {
  const { data: _data, name } = data
  setColumn(name)
  setSource(_data)
}

function toDetailPage(name: string, game_type: string) {
  router.push(`/rebate-center/rebate-detail?value=${tab.value || game_type}&name=${encodeURIComponent(name)}&isUnified=${isUnified.value}&isUnifiedSum=${isUnifiedSum.value}`)
}

/** 初始化数据 */
async function getData(showLoading = true) {
  if (showLoading)
    APILoading.value = true
  try {
    // const currency_id = supportedCur.includes(currentGlobalCurrencyMap.value.cur) ? currentGlobalCurrencyMap.value.cur : '706'
    const { gts, mode, unified_sum } = await runAsyncRebateAutomatic(currentGlobalCurrencyMap.value.cur)
    // 如果是统一场馆不用tabs
    if (mode === '2' && unified_sum === '1') {
      uniformOption.value = gts.split(',').map((id: string) => rebateTypeArr.find(a => id === a.value)).filter(Boolean) as typeof rebateTypeArr
      uniformTab.value = uniformOption.value[0].value
      await runMemberTieredRebateSumValidBet({ currency_id: currentGlobalCurrencyMap.value.cur })
    }
    else {
      tabList.value = gts.split(',').map((id: string) => rebateTypeArr.find(a => id === a.value)).filter(Boolean) as typeof rebateTypeArr
      if (tab.value) {
        const res = tabList.value.find(item => tab.value === item.value)
        if (!res)
          tab.value = tabList.value[0].value
      }
      else {
        tab.value = tabList.value[0].value
      }
      if (!tab.value)
        return
      if (mode === '1') {
        const data = await runVipRebateVIPConfig({ game_type: tab.value, cur: '' })
        if (data)
          setAllData(data)
      }
      else if (mode === '2') {
        await runMemberTieredRebateValidBet({ game_type: tab.value, currency_id: currentGlobalCurrencyMap.value.cur })
      }
    }
    APILoading.value = false
  }
  catch (error) {
    APILoading.value = false
  }
}
function eventBusGetData() {
  isTiered.value && getData()
}
function onUniformTabChange(val: string) {
  uniformTab.value = val
  tieredRebateValidBetData.value = [uniformTieredRebateValidBetDataReflect.value[val]]
}

watch([currentGlobalCurrencyMap, tab], ([nvl1, nvl2], [ovl1, ovl2]) => {
  APILoading.value = true
  if (ovl2 && !isTiered.value) {
    runVipRebateVIPConfig({
      game_type: tab.value,
      cur: '',
    }).then((data) => {
      const { data: _data, name } = data
      setColumn(name)
      setSource(_data)
    }).finally(() => {
      APILoading.value = false
    })
  }
  else if (nvl1 !== ovl1 && isTiered.value) {
    getData()
  }
  else if (ovl2 && isTiered.value) {
    runMemberTieredRebateValidBet({ game_type: tab.value, currency_id: currentGlobalCurrencyMap.value.cur }).finally(() => {
      APILoading.value = false
    })
  }
})

watch(isLogin, () => isTiered.value && getData())

onMounted(() => {
  appEventBus.on(EventBusNames.GET_TIIMEREBATE_SUCCESS, eventBusGetData)
})
onBeforeUnmount(() => {
  appEventBus.off(EventBusNames.GET_TIIMEREBATE_SUCCESS, eventBusGetData)
})

await application.allSettled([getData()])
</script>

<template>
  <div class="vip-rebate">
    <div class="tabs">
      <div :style="{ marginBottom: !isTiered ? '16px' : 0 }">
        <div v-if="isTiered && !tabList.length && !uniformOption.length" class="flex justify-between font-[400]">
          <span class="mb-[2px]">
            <span>{{ $t('当前可领取') }}</span>
            <span class="text-[#fff]">&nbsp;{{ tieredTotalRebate }}</span>
          </span>
          <span class="cursor-pointer" @click="router.push('/rebate-center/record')">
            {{ $t('返水记录') }}
          </span>
        </div>
        <template v-if="tabList.length">
          <div class="mb-[4px] flex items-center text-[14px] text-[#B1BAD3]">
            <span class="flex-1 font-[400]">{{ $t('类型选择') }}</span>
            <span class="cursor-pointer font-[400]" @click="router.push('/rebate-center/record')">
              {{ $t('返水记录') }}
            </span>
          </div>
          <AfunBaseTabs v-model="tab" :type="7" active-icon-color :list="tabList" style="--tab-type-7-gap: 18px" />
        </template>
        <template v-if="uniformOption.length">
          <div class="mb-[4px] flex items-center text-[14px] text-[#B1BAD3]">
            <span class="flex-1 font-[400]">{{ $t('类型选择') }}</span>
            <span class="cursor-pointer font-[400]" @click="router.push('/rebate-center/record')">
              {{ $t('返水记录') }}
            </span>
          </div>
          <AfunBaseTabs v-model="uniformTab" :type="7" active-icon-color :list="uniformOption" style="--tab-type-7-gap: 18px" @update:model-value="onUniformTabChange" />
        </template>
      </div>
      <AfunBaseTable
        v-if="!isTiered" :columns="columns" :data-source="rebateConfig" :loading="APILoading"
        :skeleton-width="20" show-out-load class="mt-[16px]" style="
        --afun-table-th-height:48px;
        --afun-table-td-height:48px;
        "
      >
        <template #level="{ record }">
          <div class="flex items-center justify-center">
            <AfunBaseImage width="40px" :is-network="true" :url="`/images/vip/${record.v}.webp`" />
          </div>
        </template>
        <template #tiered="{ record }">
          <div class="flex items-center justify-center">
            <span>{{ record.v }}</span>
          </div>
        </template>
      </AfunBaseTable>
      <div v-else class="mt-[16px]">
        <template v-if="APILoading">
          <AppLoading />
        </template>
        <template v-else-if="tieredRebateValidBetData">
          <div
            v-for="item in tieredRebateValidBetData" :key="item.platform_id"
            class="w-full bg-[#213743] rounded-[6px] mb-[16px] pl-[6px] pr-[2px] cursor-pointer h-[80px] flex"
            @click="toDetailPage(item.platform_name, item.game_type)"
          >
            <div class="flex flex-col text-[12px] font-[600] grow">
              <div class="flex items-center mb-[1px] mt-[6px]">
                <div class="w-[32px] h-[32px] flex items-center justify-center">
                  <AfunBaseImage
                    v-if="item.game_type_icon" height="24px" width="24px" fit="contain"
                    :url="item.game_type_icon"
                  />
                  <AfunBaseImage
                    v-else height="24px" width="24px" fit="contain" :is-network="true"
                    :url="`/images/rebate/${item.platform_id}.webp`"
                  />
                </div>
                <div class="flex  items-center ml-[6px] text-[#B1BAD3]">
                  {{ $t('有效投注') }}
                  <AfunBaseAmount
                    class="mx-[2px] text-[#fff]" style="--afun-base-amount-font-size: 12px"
                    :amount="item.valid_bet_amount" :currency-type="getCurrencyConfig((item.currency_id))?.name"
                  />
                </div>
              </div>
              <div class="w-full max-w-[183px] mb-[4px] h-[6px] rounded-[100px] bg-[#3C4F59]">
                <div class="h-full rounded-[100px] bg-[#fff]" :style="{ width: item.progressBar }" />
              </div>
              <div class="h-[10px]">
                <div v-if="Number(item.less_valid_bet_amount) > 0" class="flex items-center text-[10px] text-[#B1BAD3]">
                  <span>{{ $t('再投注') }}</span>
                  <span class="mx-[2px] text-[#fff]">{{ item.less_valid_bet_amount }}</span>
                  <span>{{ $t('可领取') }}</span>
                  <span class="ml-[2px] text-[#fff]">{{ item.next_rate }}</span>
                </div>
              </div>
            </div>
            <div class="flex flex-col mr-[6.25px] flex-none text-[12px] leading-[17px] font-[600] mt-[15px]">
              <div class="flex items-center justify-end mb-[15px] text-[#B1BAD3]">
                <span>{{ $t('返水率') }}</span>
                <span class="mx-[2px] text-[#fff]">{{ item.rate }}</span>
              </div>
              <div class="flex items-center justify-end text-[#B1BAD3]">
                <span>{{ $t('可领取') }}</span>
                <span class="mx-[2px] text-[#fff]">{{ item.rebate_amount }}</span>
              </div>
            </div>
            <IconUniArrowRight class="text-[16px] text-[#9DABC9] mt-[30px]" />
          </div>
        </template>

        <template v-else>
          <AfunBaseEmpty />
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.vip-rebate {
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .rebate-table {
    --afun-table-td-padding-y: 0;
    --afun-table-td-padding-x: 0;
    --afun-table-th-padding-x: 0;
  }

  color: #6d7693;
  font-size: 14px;
}
</style>
