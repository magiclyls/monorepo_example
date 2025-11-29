<script setup lang='ts'>
import { EnumCurrencyKey } from '@tg/types';
import { IconInfo } from '@tg/icons';
import {
  ApiMemberLimitBalanceConfig,
  ApiMemberLimitBalanceConfigInsert,
  ApiMemberLimitBalanceConfigDelete
} from '@tg/apis';
import AppAmount from './AppAmount.vue';
defineOptions({ name: 'AppPageDepositLimit' })

const { t } = useI18n()
const { timeZoneToTextWithoutRegion } = storeToRefs(useBrandStore())
const { openNotify } = useNotify()
const {sortList,sortCurrencyList} = useCurrencyData()

const amount = ref('')
const type = ref('1')
const typeList = [
  { label: t('every_day1'), value: '1' },
  { label: t('every_week1'), value: '2' },
  { label: t('every_month1'), value: '3' },
]

const columns = [
  {
    title: t('time'),
    dataIndex: 'cfg_type',
    slot: 'cfg_type',
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
    dataIndex: 'progress',
    slot: 'progress',
    align: 'center',
  },
  {
    title: t('with_holding'),
    dataIndex: 'withHolding',
    slot: 'withHolding',
    align: 'center',
    headerSlot: 'headWithHolding'
  },
  {
    title: t('operate'),
    dataIndex: 'operate',
    slot: 'operate',
    align: 'center',
  },
]

const { runAsync: runGetRecordList, loading: listLoading, data: depositLimitList } = useRequest(ApiMemberLimitBalanceConfig)
const { runAsync: runInsertDepositLimit } = useRequest(() => ApiMemberLimitBalanceConfigInsert({
  cfg_type: type.value,
  limit_amount: amount.value
}), {
  onSuccess() {
    openNotify({
      type: 'success',
      title: t('created_successfully'),
      message: t('you_create', {
        type: formatType(type.value),
        amount: amount.value,
        limitType: t('deposit_limit')
      })
    })

    amount.value = ''
    runGetRecordList()
  }
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
      value
    }))
    return sortCurrencyList(sortList.value ?? [],arr.map((a)=>{
      return {
        ...a,
        cur:getCurrencyConfig(a.key as EnumCurrencyKey).cur
      }
    }))
  }
  return []
})
// 表格数据
const dataSource = computed(() => {
  if (depositLimitList.value && depositLimitList.value.cfg && depositLimitList.value.cfg.length > 0)
    return depositLimitList.value.cfg.map((a) => {
      return {
        ...a,
        typeLabel: formatType(a.cfg_type)
      }
    })
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
  return dayjs(t * 1000).startOf("day").format("YYYY-MM-DD HH:mm:ss")
}

// 点击新增
function onDepositLimitInsertClick() {
  runInsertDepositLimit()
}
// 点击删除
function onDeleteClick(id: string) {
  runDeleteDepositLimit({ id }).then(() => {
    const nextDayZero = dayjs().add(1, "day").startOf("day").format("YYYY-MM-DD HH:mm:ss")

    openNotify({
      type: 'success',
      title: t('success_delete'),
      message: t('expires_on', { time: nextDayZero })
    })
    runGetRecordList()
  })
}

await application.allSettled([runGetRecordList()])
</script>

<template>
  <div class="flex flex-col gap-[16px] pb-[32px]">
    <div class="box-outer">
      <div class="px-[16px]">
        <h6 class="text-[20px] font-[600] text-[#fff] leading-[28px] mb-[16px]">{{ t('set_your_deposit_limit') }}</h6>
        <div class="text-[14px] text-[#B1BAD3] font-[500] flex flex-col gap-[20px] leading-[1.5]">
          <p>{{ t('self_exclusion_tip14') }}</p>
          <p>{{ t('self_exclusion_tip15', { timeZone: ` (${timeZoneToTextWithoutRegion}) ` }) }}</p>
          <p>{{ t('self_exclusion_tip16') }}</p>
          <p>{{ t('self_exclusion_tip17', { timeZone: ` (${timeZoneToTextWithoutRegion}) ` }) }}</p>
        </div>
      </div>
      <div class="line"></div>
      <div class="px-[16px] flex flex-col gap-[16px]">
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
        <BaseButton :disabled="Number(amount) <= 0" bg-style="secondary" class="h-[42px]"
          style="--tg-base-button-min-width:124px;" @click="onDepositLimitInsertClick">
          {{ isInserted ? t('update') : t('add_a_limit') }}
        </BaseButton>
      </div>
    </div>

    <BaseTable :columns="columns" :data-source="dataSource" :loading="listLoading">
      <template #headAmount>
        <div class="flex items-center">
          <span class="mr-[4px]">{{ t('amount') }}</span>
          <AppCurrencyIcon currency-type="USDT" />
        </div>
      </template>
      <template #headWithHolding>
        <div class="flex items-center">
          <AppTooltip>
            <template #content>
              <div class="flex text-[12px] items-center mr-[8px]">
                <IconInfo />
              </div>
            </template>
            <template #popper>
              <span class="text-[#05080A] text-[12px] leading-[1.5] font-[400] inline-block max-w-[224px]">{{
                t('with_holding_tips') }}</span>
            </template>
          </AppTooltip>
          <span class="mr-[4px]">{{ t('with_holding') }}</span>
          <AppCurrencyIcon currency-type="USDT" />
        </div>
      </template>
      <template #cfg_type="{ record }">
        <span>{{ record.typeLabel }}</span>
      </template>
      <!-- 进度 -->
      <template #progress="{ record }">
        <div class="w-[200px] flex flex-col">
          <div class="flex items-center justify-between leading-[20px] mb-[6px]">
            <span class="inline-flex items-center gap-[4px]">
              <span>{{ t('remaining') }}</span>
              <span>{{ record.left_amount < 0 ? 0 : record.left_amount }}</span>
              <AppCurrencyIcon currency-type="USDT" />
            </span>
            <span>{{ record.progress }}</span>
          </div>
          <div class="w-full bg-[#3C4F59] h-[6px] rounded-[10px] overflow-hidden">
            <div class="bg-[#fff] h-full rounded-[10px]" :style="{ width: record.progress }"></div>
          </div>
        </div>
      </template>
      <!-- 预扣 -->
      <template #withHolding="{ record }">
        <div class="flex items-center justify-center">
          <span>{{ withHoldingTotal }}</span>
          <AppTooltip placement="bottom" v-if="withHoldingBalance.length > 0">
            <template #content>
              <div class="flex text-[12px] items-center ml-[8px]">
                <IconInfo />
              </div>
            </template>
            <template #popper>
              <div class="flex flex-col gap-[10px]">
                <div v-for="item in withHoldingBalance" :key="item.key"
                  class="flex items-center justify-between h-[20px]">
                  <AppCurrencyIcon showName :currency-type="item.key as EnumCurrencyKey" class="mr-[20px]" />
                  <AppAmount :amount="item.value" />
                </div>
              </div>
            </template>
          </AppTooltip>
        </div>
      </template>
      <template #operate="{ record }">
        <div>
          <BaseButton size="none" v-if="record.deleted_at === 0" type="text" @click="onDeleteClick(record.id)"
            style="--tg-base-button-text-default-color:#ED4163;">
            {{ t('delete') }}
          </BaseButton>
          <span v-else class="text-[#fff] whitespace-nowrap">
            {{ t('expires_on1', { time: getDayZero(record.deleted_at)}) }}
          </span>
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
