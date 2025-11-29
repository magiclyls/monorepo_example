<script setup lang='ts'>
import { ApiMemberBetLimitInsert, ApiMemberBetLimitList, ApiMemberBetLimitUpdate } from '@tg/apis';

defineOptions({ name: 'AppPageBetLimit' })

const { t } = useI18n()
const { timeZoneToTextWithoutRegion } = storeToRefs(useBrandStore())
const { openNotify } = useNotify()

const limitType = ref(1)
const limitTypeList = [
  { label: t('betting_limits'), value: 1 },
  { label: t('loss_limit'), value: 2 },
]
const amount = ref('')
const type = ref(1)
const typeList = [
  { label: t('every_day1'), value: 1 },
  { label: t('every_week1'), value: 2 },
  { label: t('every_month1'), value: 3 },
]

// 次日零点
const nextDayZero = dayjs().add(1, "day").startOf("day").format("YYYY-MM-DD HH:mm:ss")

// 添加投注限额
const { run: runBetLimitInsert } = useRequest(() => ApiMemberBetLimitInsert({
  type: type.value,
  limit_type: limitType.value,
  limit_amount: amount.value
}), {
  onSuccess() {
    openNotify({
      type: 'success',
      title: t('created_successfully'),
      message: t('you_create', {
        type: formatType(type.value),
        amount: amount.value, limitType:
          formatLimitType(limitType.value)
      })
    })

    amount.value = ''
    runGetBetLimitList()
  }
})
// 限额列表
const { runAsync: runGetBetLimitList, data: betLimitList, loading: listLoading } = useRequest(ApiMemberBetLimitList)
// 更新或删除
const { runAsync: runUpdateBetLimitList } = useRequest(ApiMemberBetLimitUpdate, {
  onSuccess() {

  }
})

const columns = [
  {
    title: t('label_type'),
    dataIndex: 'limit_type',
    slot: 'limit_type',
    align: 'center',
  },
  {
    title: t('time'),
    dataIndex: 'type',
    slot: 'type',
    align: 'center',
  },
  {
    title: t('amount'),
    dataIndex: 'limit_amount',
    slot: 'limit_amount',
    align: 'center',
    headerSlot: 'headAmount'
  },
  {
    title: t('progress'),
    dataIndex: 'now_amount',
    slot: 'now_amount',
    align: 'center',
  },
  {
    title: t('operate'),
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
        percent: (percentNum > 100 ? 100 : percentNum).toFixed(2) + '%'
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
      limit_amount: amount.value
    }).then(() => {
      openNotify({
        type: 'success',
        title: t('created_successfully'),
        message: t('you_create', {
          type: formatType(type.value),
          amount: amount.value, limitType:
            formatLimitType(limitType.value)
        })
      })

      amount.value = ''
      runGetBetLimitList()
    })
  }
  else if (Number(amount.value) > 0)
    runBetLimitInsert()
}
// 点击删除
function onDeleteClick(id: string) {
  runUpdateBetLimitList({ id, status: 0, limit_amount: '' }).then(() => {
    openNotify({
      type: 'success',
      title: t('success_delete'),
      message: t('expires_on', { time: nextDayZero })
    })
    runGetBetLimitList()
  })
}

await application.allSettled([runGetBetLimitList()])
</script>

<template>
  <div class="flex flex-col gap-[16px] pb-[32px]">
    <div class="box-outer">
      <div class="px-[16px]">
        <h6 class="text-[20px] font-[600] text-[#fff] leading-[28px] mb-[16px]">{{ t('set_your_betting_limits') }}</h6>
        <div class="text-[14px] text-[#B1BAD3] font-[500] flex flex-col gap-[20px] leading-[1.5]">
          <p>{{ t('self_exclusion_tip11') }}</p>
          <p>{{ t('self_exclusion_tip12', { timeZone: ` (${timeZoneToTextWithoutRegion}) ` }) }}</p>
          <p>{{ t('self_exclusion_tip13', { timeZone: ` (${timeZoneToTextWithoutRegion}) ` }) }}</p>
        </div>
      </div>
      <div class="line"></div>
      <div class="px-[16px] flex flex-col gap-[16px]">
        <BaseLabel :label="t('restriction_type')" must>
          <BaseSelect class="mt-[4px]" v-model="limitType" :options="limitTypeList" border popper :autoSize="true"
            style="--tg-base-select-popper-style-padding-x:12px;" />
        </BaseLabel>
        <BaseLabel :label="t('limit_amount')" must>
          <BaseInput v-model="amount" type="number" input-mode="decimal" placeholder="0.00"
            style="--tg-base-input-style-pad-left:12px;" @blur="onAmountBlur">
            <template #right-icon>
              <AppCurrencyIcon currency-type="USDT" style="--tg-app-currency-icon-size:18px;" />
            </template>
          </BaseInput>
        </BaseLabel>
        <BaseLabel :label="t('time_limit')" must>
          <BaseSelect class="mt-[4px]" v-model="type" :options="typeList" border popper :autoSize="true"
            style="--tg-base-select-popper-style-padding-x:12px;" />
        </BaseLabel>
      </div>
      <div class="line"></div>
      <div class="flex justify-end px-[16px]">
        <BaseButton :disabled="Number(amount) <= 0" @click="onBetLimitInsertClick" bg-style="secondary" class="h-[42px]"
          style="--tg-base-button-min-width:124px;">
          {{ isInserted ? t('update') : t('add_a_limit') }}
        </BaseButton>
      </div>
    </div>
    <BaseTable :columns="columns" :data-source="dataSource" :loading="listLoading"
      style="--tg-table-td-font-weight:500;">
      <template #headAmount>
        <div class="flex items-center">
          <span class="mr-[4px]">{{ t('amount') }}</span>
          <AppCurrencyIcon currency-type="USDT" />
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
              <span>{{ t('remaining') }}</span>
              <span>{{ record.remaining }}</span>
              <AppCurrencyIcon currency-type="USDT" />
            </span>
            <span>{{ record.percent }}</span>
          </div>
          <div class="w-full bg-[#3C4F59] h-[6px] rounded-[10px] overflow-hidden">
            <div class="bg-[#fff] h-full rounded-[10px]" :style="{ width: record.percent }"></div>
          </div>
        </div>
      </template>
      <template #operate="{ record }">
        <div>
          <BaseButton size="none" v-if="record.status === 1" type="text" @click="onDeleteClick(record.id)"
            style="--tg-base-button-text-default-color:#ED4163;">
            {{ t('delete') }}
          </BaseButton>
          <span v-else class="text-[#fff] whitespace-nowrap">{{ t('expires_on1', { time: nextDayZero }) }}</span>
        </div>
      </template>
    </BaseTable>
  </div>
</template>

<style lang='scss' scoped>
.box-outer {
  padding: 16px 0;
  width: 100%;
  border-radius: 4px;
  background-color: #213743;
  border: 2px solid #2F4553;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.20), 0 1px 2px 0 rgba(0, 0, 0, 0.12);
  --tg-base-select-popper-style-padding-y: 9.5px;

  .line {
    width: 100%;
    height: 1px;
    background-color: #2F4553;
    margin: 16px 0;
  }
}
</style>
