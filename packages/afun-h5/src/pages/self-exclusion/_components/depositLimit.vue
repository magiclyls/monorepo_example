<script setup lang='ts'>
import type { EnumCurrencyKey } from '@tg/types'
import { ApiMemberLimitBalanceConfig, ApiMemberLimitBalanceConfigDelete, ApiMemberLimitBalanceConfigInsert } from '@tg/apis'
import { AfunBaseAmount, AfunBaseButton, AfunBaseCurrencyIcon, AfunBaseInput, AfunBaseLabel, AfunBaseSelect, AfunBaseTable } from '@tg/bccomponents'
import { IconInfo } from '@tg/icons'
import { sortCurrencyList, useBrandStore, useCurrency } from '@tg/stores'
import { application, getCurrencyConfig } from '@tg/utils'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useNotify } from '~/hooks/index'

defineOptions({ name: 'AppPageDepositLimit' })

const { t } = useI18n()
const { timeZoneToTextWithoutRegion } = storeToRefs(useBrandStore())
const { openNotify } = useNotify()
const { sortList } = storeToRefs(useCurrency())

const amount = ref('')
const type = ref('1')
const typeList = [
  { label: t('每天'), value: '1' },
  { label: t('每周'), value: '2' },
  { label: t('每月'), value: '3' },
]

const columns = [
  {
    title: t('时间'),
    dataIndex: 'cfg_type',
    slot: 'cfg_type',
    align: 'center',
  },
  {
    title: t('金额'),
    dataIndex: 'limit_amount',
    slot: 'limit_amount',
    align: 'center',
    headerSlot: 'headAmount',
  },
  {
    title: t('进度'),
    dataIndex: 'progress',
    slot: 'progress',
    align: 'center',
  },
  {
    title: t('预扣'),
    dataIndex: 'withHolding',
    slot: 'withHolding',
    align: 'center',
    headerSlot: 'headWithHolding',
  },
  {
    title: t('操作'),
    dataIndex: 'operate',
    slot: 'operate',
    align: 'center',
  },
]

const { runAsync: runGetRecordList, loading: listLoading, data: depositLimitList } = useRequest(ApiMemberLimitBalanceConfig)
const { runAsync: runInsertDepositLimit } = useRequest(() => ApiMemberLimitBalanceConfigInsert({
  cfg_type: type.value,
  limit_amount: amount.value,
}), {
  onSuccess() {
    openNotify({
      type: 'success',
      title: t('创建成功'),
      message: t('您创建', {
        type: formatType(type.value),
        amount: amount.value,
        limitType: t('存款限额'),
      }),
    })

    amount.value = ''
    runGetRecordList()
  },
})
const { runAsync: runDeleteDepositLimit } = useRequest(ApiMemberLimitBalanceConfigDelete)

// 预扣的余额总数
const withHoldingTotal = computed(() => depositLimitList.value ? depositLimitList.value.total_balance : '')
// 预扣的余额明细
const withHoldingBalance = computed(() => {
  if (depositLimitList.value && depositLimitList.value.balance) {
    const { uid, ...rest } = depositLimitList.value.balance

    const arr = Object.entries(rest).map(([key, value]) => ({
      key,
      value,
    }))
    return sortCurrencyList(sortList.value ?? [], arr.map((a) => {
      return {
        ...a,
        cur: getCurrencyConfig(a.key as EnumCurrencyKey).cur,
      }
    }))
  }
  return []
})
// 表格数据
const dataSource = computed(() => {
  if (depositLimitList.value && depositLimitList.value.cfg && depositLimitList.value.cfg.length > 0) {
    return depositLimitList.value.cfg.map((a) => {
      return {
        ...a,
        typeLabel: formatType(a.cfg_type),
      }
    })
  }
  return []
})
// 是否存在记录
const isInserted = computed(() => {
  const obj = dataSource.value.find((a) => {
    return a.cfg_type === type.value
  })
  return Boolean(obj)
})

function formatType(v: string) {
  return typeList.find(a => a.value === v)?.label
}
function onAmountBlur() {
  amount.value = application.formatNumDecimal(amount.value, 2)
}
// 零点
function getDayZero(t: number) {
  return dayjs(t * 1000).startOf('day').format('YYYY-MM-DD HH:mm:ss')
}

// 点击新增
function onDepositLimitInsertClick() {
  runInsertDepositLimit()
}
// 点击删除
function onDeleteClick(id: string) {
  runDeleteDepositLimit({ id }).then(() => {
    const nextDayZero = dayjs().add(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss')

    openNotify({
      type: 'success',
      title: t('删除成功'),
      message: t('到期1', { time: nextDayZero }),
    })
    runGetRecordList()
  })
}

await application.allSettled([runGetRecordList()])
</script>

<template>
  <div class="flex flex-col gap-[16px] pb-[64px]">
    <div class="box-outer">
      <div class="px-[16px]">
        <h6 class="text-[20px] font-[600] text-[#fff] leading-[28px] mb-[16px]">
          {{ t('设置您的存款限额') }}
        </h6>
        <div class="text-[14px] text-[#b1bad3] font-[500] flex flex-col gap-[20px] leading-[1.5]">
          <p>{{ t('自我排除提示语11') }}</p>
          <p>{{ t('自我排除提示语12', { timeZone: ` (${timeZoneToTextWithoutRegion}) ` }) }}</p>
          <p>{{ t('自我排除提示语13') }}</p>
          <p>{{ t('自我排除提示语14', { timeZone: ` (${timeZoneToTextWithoutRegion}) ` }) }}</p>
        </div>
      </div>
      <div class="line" />
      <div class="px-[16px] flex flex-col gap-[16px]">
        <AfunBaseLabel :label="t('限制金额')" required>
          <AfunBaseInput v-model="amount" type="number" input-mode="decimal" placeholder="0.00" @blur="onAmountBlur">
            <template #right>
              <AfunBaseCurrencyIcon currency-type="USDT" style="--ph-app-currency-icon-size:18px;" />
            </template>
          </AfunBaseInput>
        </AfunBaseLabel>
        <AfunBaseLabel :label="t('限制时间')" required>
          <AfunBaseSelect v-model="type" class="mt-[4px]" :options="typeList" />
        </AfunBaseLabel>
      </div>
      <div class="line" />
      <div class="flex justify-end px-[16px]">
        <AfunBaseButton class="min-w-[124px] h-[42px]" @click="onDepositLimitInsertClick">
          {{ isInserted ? t('更新') : t('添加限额') }}
        </AfunBaseButton>
      </div>
    </div>

    <AfunBaseTable :columns="columns" :loading="listLoading" :data-source="dataSource" style="--tg-table-td-font-weight:500;">
      <template #headAmount>
        <div class="flex items-center">
          <span class="mr-[4px]">{{ t('金额') }}</span>
          <AfunBaseCurrencyIcon currency-type="USDT" />
        </div>
      </template>
      <template #headWithHolding>
        <div class="flex items-center">
          <VTooltip
            placement="top" popper-class="deposit-limit-table-tooltip-popper" strategy="absolute" auto-hide
            :triggers="['click', 'hover']"
          >
            <div class="flex text-[12px] items-center mr-[3px] text-[#b1bad3] p-[5px]">
              <IconInfo />
            </div>
            <template #popper>
              <span class="text-[#000] text-[12px] leading-[1.5] font-[400] inline-block max-w-[224px]">{{
                t('预扣提示语') }}</span>
            </template>
          </VTooltip>
          <span class="mr-[4px]">{{ t('预扣') }}</span>
          <AfunBaseCurrencyIcon currency-type="USDT" />
        </div>
      </template>
      <template #cfg_type="{ record }">
        <span>{{ record.typeLabel }}</span>
      </template>
      <!-- 进度 -->
      <template #progress="{ record }">
        <div class="w-[200rem] flex flex-col">
          <div class="flex items-center justify-between leading-[20rem] mb-[6rem]">
            <span class="inline-flex items-center gap-[4rem]">
              <span>{{ t('剩余') }}</span>
              <span>{{ record.left_amount < 0 ? 0 : record.left_amount }}</span>
              <PhBaseCurrencyIcon currency-type="USDT" />
            </span>
            <span>{{ record.progress }}</span>
          </div>
          <div class="w-full bg-[#3C4F59] h-[6rem] rounded-[10rem] overflow-hidden">
            <div class="bg-[#fff] h-full rounded-[10rem]" :style="{ width: record.progress }" />
          </div>
        </div>
      </template>
      <!-- 预扣 -->
      <template #withHolding="{ record }">
        <div class="flex items-center justify-center">
          <span>{{ withHoldingTotal }}</span>
          <VTooltip
            v-if="withHoldingBalance.length > 0"
            placement="bottom" popper-class="deposit-limit-table-tooltip-popper" strategy="absolute"
            auto-hide :triggers="['click', 'hover']"
          >
            <div class="flex text-[12px] items-center ml-[8px] text-[#9DABC8]">
              <IconInfo />
            </div>
            <template #popper>
              <div class="flex flex-col gap-[10px]" style="--ph-app-currency-icon-style-color:#fff;">
                <div v-for="item in withHoldingBalance" :key="item.key" class="flex items-center justify-between h-[20px] gap-[20px]">
                  <AfunBaseCurrencyIcon show-name :currency-type="(item.key as EnumCurrencyKey)" />
                  <AfunBaseAmount :amount="item.value" />
                </div>
              </div>
            </template>
          </VTooltip>
        </div>
      </template>
      <template #operate="{ record }">
        <AfunBaseButton
          v-if="record.deleted_at === 0" type="none" class="text-[#ED4163] mx-auto"
          style="--afun-base-button-font-weight:400;--afun-base-button-font-size:14px;"
          @click="onDeleteClick(record.id)"
        >
          {{ t('删除') }}
        </AfunBaseButton>
        <span v-else class="text-[#fff] whitespace-nowrap">
          {{ t('到期2', { time: getDayZero(record.deleted_at) }) }}
        </span>
      </template>
    </AfunBaseTable>
  </div>
</template>

<style lang='scss' scoped>
.box-outer {
  padding: 16px 0;
  width: 100%;
  border-radius: 4px;
  background-color: #213743;
  border: 2px solid #2f4553;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.2),
    0 1px 2px 0 rgba(0, 0, 0, 0.12);

  .line {
    width: 100%;
    height: 1px;
    background-color: #2f4553;
    margin: 16px 0;
  }
}
</style>
