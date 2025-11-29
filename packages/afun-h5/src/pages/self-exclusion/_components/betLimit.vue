<script setup lang='ts'>
import { ApiMemberBetLimitInsert, ApiMemberBetLimitList, ApiMemberBetLimitUpdate } from '@tg/apis'
import { AfunBaseButton, AfunBaseCurrencyIcon, AfunBaseInput, AfunBaseLabel, AfunBaseSelect, AfunBaseTable } from '@tg/bccomponents'
import { useBrandStore } from '@tg/stores'
import { application } from '@tg/utils'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useNotify } from '~/hooks/index'

defineOptions({ name: 'AppPageBetLimit' })

const { t } = useI18n()
const { timeZoneToTextWithoutRegion } = storeToRefs(useBrandStore())
const { openNotify } = useNotify()

const limitType = ref(1)
const limitTypeList = [
  { label: t('下注限额'), value: 1 },
  { label: t('损失限额'), value: 2 },
]
const amount = ref('')
const type = ref(1)
const typeList = [
  { label: t('每天'), value: 1 },
  { label: t('每周'), value: 2 },
  { label: t('每月'), value: 3 },
]

// 次日零点
const nextDayZero = dayjs().add(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss')

// 限额列表
const { runAsync: runGetBetLimitList, data: betLimitList, loading: listLoading } = useRequest(ApiMemberBetLimitList)
// 添加投注限额
const { run: runBetLimitInsert } = useRequest(() => ApiMemberBetLimitInsert({
  type: type.value,
  limit_type: limitType.value,
  limit_amount: amount.value,
}), {
  onSuccess() {
    openNotify({
      type: 'success',
      title: t('创建成功'),
      message: t('您创建', {
        type: formatType(type.value),
        amount: amount.value,
        limitType: formatLimitType(limitType.value),
      }),
    })

    amount.value = ''
    runGetBetLimitList()
  },
})
// 更新或删除
const { runAsync: runUpdateBetLimitList } = useRequest(ApiMemberBetLimitUpdate, {
  onSuccess() {

  },
})

const columns = [
  {
    title: t('类型'),
    dataIndex: 'limit_type',
    slot: 'limit_type',
    align: 'center',
  },
  {
    title: t('时间'),
    dataIndex: 'type',
    slot: 'type',
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
    dataIndex: 'now_amount',
    slot: 'now_amount',
    align: 'center',
  },
  {
    title: t('操作'),
    dataIndex: 'operate',
    slot: 'operate',
    align: 'center',
  },
]

// const testData = [
//   {
//     limitType: 'limitType',
//     time: 'time',
//     amount: 'amount',
//     progress: 'progress',
//     operate: 'operate',
//   },
// ]

const dataSource = computed(() => {
  if (betLimitList.value && betLimitList.value.d && betLimitList.value.d.length > 0) {
    return betLimitList.value.d.map((a) => {
      const percentNum = Number(a.now_amount) / Number(a.limit_amount) * 100
      const remainingNum = Number(a.limit_amount) - Number(a.now_amount) < 0 ? 0 : Number(a.limit_amount) - Number(a.now_amount)

      return {
        ...a,
        limitTypeLabel: formatLimitType(a.limit_type),
        typeLabel: formatType(a.type),
        limit_amount: application.formatNumDecimal(a.limit_amount, 2),
        remaining: application.formatNumDecimal(remainingNum, 2),
        percent: `${(percentNum > 100 ? 100 : percentNum).toFixed(2)}%`,
      }
    })
  }

  return []
})

// 已存在的记录
const insertedObj = computed(() => {
  return dataSource.value.find((a) => {
    return a.limit_type === limitType.value && a.type === type.value
  })
})
// 是否存在记录
const isInserted = computed(() => Boolean(insertedObj.value))

function onAmountBlur() {
  amount.value = application.formatNumDecimal(amount.value, 2)
}
function formatLimitType(v: number) {
  return limitTypeList.find(a => a.value === v)?.label
}
function formatType(v: number) {
  return typeList.find(a => a.value === v)?.label
}
// 点击添加
function onBetLimitInsertClick() {
  // 已存在记录走更新接口
  if (isInserted.value && insertedObj.value) {
    runUpdateBetLimitList({
      id: insertedObj.value.id,
      status: 1,
      limit_amount: amount.value,
    }).then(() => {
      openNotify({
        type: 'success',
        title: t('创建成功'),
        message: t('您创建', {
          type: formatType(type.value),
          amount: amount.value,
          limitType: formatLimitType(limitType.value),
        }),
      })

      amount.value = ''
      runGetBetLimitList()
    })
  }
  else if (Number(amount.value) > 0) {
    runBetLimitInsert()
  }
}
// 点击删除
function onDeleteClick(id: string) {
  runUpdateBetLimitList({ id, status: 0, limit_amount: '' }).then(() => {
    openNotify({
      type: 'success',
      title: t('删除成功'),
      message: t('到期1', { time: nextDayZero }),
    })
    runGetBetLimitList()
  })
}

await application.allSettled([runGetBetLimitList()])
</script>

<template>
  <div class="flex flex-col gap-[16px] pb-[64px]">
    <div class="box-outer">
      <div class="px-[16px]">
        <h6 class="text-[20px] font-[500] text-[#FFF] leading-[28px] mb-[16px]">
          {{ t('设置您的投注限额') }}
        </h6>
        <div class="text-[14px] text-[#B1BAD3] font-[400] flex flex-col gap-[20px] leading-[1.5]">
          <p>{{ t('自我排除提示语8') }}</p>
          <p>{{ t('自我排除提示语9', { timeZone: ` (${timeZoneToTextWithoutRegion}) ` }) }}</p>
          <p>{{ t('自我排除提示语10', { timeZone: ` (${timeZoneToTextWithoutRegion}) ` }) }}</p>
        </div>
      </div>
      <div class="line" />
      <div class="px-[16px] flex flex-col gap-[16px]">
        <AfunBaseLabel :label="t('限制类型')" required>
          <AfunBaseSelect v-model="limitType" :options="limitTypeList" />
        </AfunBaseLabel>
        <AfunBaseLabel :label="t('限制金额')" required>
          <AfunBaseInput v-model="amount" type="number" input-mode="decimal" placeholder="0.00" @blur="onAmountBlur">
            <template #right>
              <AfunBaseCurrencyIcon currency-type="USDT" style="--ph-app-currency-icon-size:18px;" />
            </template>
          </AfunBaseInput>
        </AfunBaseLabel>
        <AfunBaseLabel :label="t('限制时间')" required>
          <AfunBaseSelect v-model="type" :options="typeList" />
        </AfunBaseLabel>
      </div>
      <div class="line" />
      <div class="flex justify-end px-[16px]">
        <AfunBaseButton
          :disabled="Number(amount) <= 0" class="min-w-[124px] h-[42px]"
          style="--afun-base-button-font-size:14px;" @click="onBetLimitInsertClick"
        >
          {{ isInserted ? t('更新') : t('添加限额') }}
        </AfunBaseButton>
      </div>
    </div>
    <AfunBaseTable
      :columns="columns" :data-source="dataSource" :loading="listLoading"
      style="--tg-table-td-font-weight:500;"
    >
      <template #headAmount>
        <div class="flex items-center">
          <span class="mr-[4px]">{{ t('金额') }}</span>
          <AfunBaseCurrencyIcon currency-type="USDT" />
        </div>
      </template>
      <template #limit_type="{ record }">
        <span>{{ record.limitTypeLabel }}</span>
      </template>
      <template #type="{ record }">
        <span>{{ record.typeLabel }}</span>
      </template>
      <template #now_amount="{ record }">
        <div class="w-[200px] flex flex-col">
          <div class="flex items-center justify-between leading-[20px] mb-[6px]">
            <span class="inline-flex items-center gap-[4px]">
              <span>{{ t('剩余') }}</span>
              <span>{{ record.remaining }}</span>
              <AfunBaseCurrencyIcon currency-type="USDT" />
            </span>
            <span>{{ record.percent }}</span>
          </div>
          <div class="w-full bg-[#3C4F59] h-[6px] rounded-[10px] overflow-hidden">
            <div class="bg-[#fff] h-full rounded-[10px]" :style="{ width: record.percent }" />
          </div>
        </div>
      </template>
      <template #operate="{ record }">
        <AfunBaseButton
          v-if="record.status === 1" type="none" class="text-[#ED4163] mx-auto"
          style="--afun-base-button-font-weight:400;--afun-base-button-font-size:14px;"
          @click="onDeleteClick(record.id)"
        >
          {{ t('删除') }}
        </AfunBaseButton>
        <span v-else class="text-[#fff] whitespace-nowrap">
          {{ t('到期2', { time: nextDayZero }) }}
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
