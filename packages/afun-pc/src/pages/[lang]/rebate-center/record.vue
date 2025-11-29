<script setup lang='ts'>
import { ApiMemberVipBonusRecord } from '@tg/apis'
import { IconUniClose } from '@tg/icons'

defineOptions({ name: 'VipRebateRecord' })

const { t } = useI18n()
const today = dayjs()
const { isLogin } = storeToRefs(useAppStore())
const { isMobile } = storeToRefs(useWindowStore())

const dayOptions = [
  { label: t('today'), value: '0' },
  { label: t('last_days_mid', { delta: 7 }), value: '6' },
  { label: t('last_days_mid', { delta: 30 }), value: '29' },
  { label: t('last_days_mid', { delta: 90 }), value: '89' },
]
const columns = reactive<Column[]>([
  {
    title: t('label_draw_time'),
    dataIndex: 'created_at',
    slot: 'created_at',
    align: 'center',
    width: '50%',
    color: 'var(--tg-table-text-color)',
  },
  {
    title: t('receive_bonus_amount'),
    dataIndex: 'receive_amount',
    slot: 'receive_amount',
    align: 'center',
    width: '50%',
    color: 'var(--tg-table-amount-color)',
  },
])
const dayType = ref('0')
const page = ref(1)
const page_size = ref(10)
const total = ref(0)

const params = computed(() => ({
  page: page.value,
  page_size: page_size.value,
  start_time: today.subtract(+dayType.value, 'day').startOf('day').unix(),
  end_time: today.endOf('day').unix(),
  cash_type: '814',
}))

const { loading, data, runAsync: runAsyncGetRecordAsync, run } = useRequest(ApiMemberVipBonusRecord, {
  onSuccess(res) {
    if (page.value === 1 && res.d && res.d.length > 0 && res.t)
      total.value = res.t
  },
})
const records = computed(() => {
  if (data.value && data.value.d && data.value.d.length > 0)
    return data.value.d
  return []
})

function changeDayType(item: ISelectOptionString) {
  if (dayType.value === item.value)
    return

  dayType.value = item.value
  reset()
  getData()
}
function onPrevious() {
  page.value = page.value - 1
  getData()
}
function onNext() {
  page.value = page.value + 1
  getData()
}
function getData() {
  run(params.value)
}
function reset() {
  page.value = 1
  total.value = 0
}

if (isLogin.value)
  application.allSettled([runAsyncGetRecordAsync(params.value)])
</script>

<template>
  <div :class="{ 'is-pc': !isMobile }">
    <div class="flex justify-between items-center mb-[16px] leading-[22px] text-[18px] font-[600] capitalize"><span>返水记录</span><span><IconUniClose class="text-[12px]"/></span></div>
    <div class="tabs">
      <div
        v-for="item in dayOptions" :key="item.value" class="theme-tab-btn"
        :class="{ active: dayType === item.value }" @click="changeDayType(item)"
      >
        <span class="w-full">{{ item.label }}</span>
      </div>
    </div>
    <BaseTable
      class="theme-table" :loading="loading" :columns="columns" :data-source="records" show-out-load
      :out-load-height="218" emptyHeight="160px"
    >
      <template #created_at="{ record }">
        {{ timeToCustomizeFormat(record.created_at, 'YYYY/MM/DD HH:mm:ss') }}
      </template>
      <template #receive_amount="{ record }">
        <div class="center">
          <AppAmount
            :amount="record.receive_amount"
            :currency-type="getCurrencyConfigByCode(record.receive_currency_id).name"
          />
        </div>
      </template>
    </BaseTable>
    <div v-if="total > page_size" class="mb-[14px] mt-[24px]">
      <AppStack :pagination-data="{ page, pageSize: page_size, total }" @previous="onPrevious" @next="onNext" />
    </div>
  </div>
</template>

<style lang='scss' scoped>
.tabs {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-bottom: 5px;
  width: 100%;
  column-gap: 16px;

  .theme-tab-btn {
    color: var(--tg-text-white);
    font-size: 14px;
    font-weight: 500;
    height: 40px;
    border-radius: 4px;
    background: #0F212E;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0 2px;

    @include webTheme('green') {
      background: #02432d;
    }

    @include webTheme('white') {
      background: #f5f5f5;
    }

    &.active {
      background: #24EE89;
      color: #000;

      @include webTheme('green') {
        background: #5ecea6;
      }

      @include webTheme('white') {
        background: #f2ca5c;
      }
    }

    &:active {
      span {
        transform: scale(0.96);
      }
    }
  }
}

.theme-table {
  --tg-table-td-font-weight: 500;
  --tg-app-amount-font-weight: 500;

  @include webTheme('green') {
    --tg-table-amount-color: #3cb389;
    --tg-table-text-color: #3cb389;
  }
}

.is-pc {
  padding: var(--tg-spacing-12);
  border-radius: var(--tg-radius-default);

  @include webTheme('white') {
    --tg-table-odd-background: #fff;
    --tg-table-even-background: #f5f5f5;
  }

  .tabs {
    display: flex;

    .theme-tab-btn {
      padding: 0 12px;
      min-width: 40px;

      @include webTheme('green') {
        border-color: #055434;
      }

      @include webTheme('white') {
        border-color: #c1c1c1;
      }

      &.active {
        @include webTheme('green') {
          border-color: #5ecea6;
        }

        @include webTheme('white') {
          border-color: #f2ca5c;
          background: #f2ca5c;
        }
      }
    }
  }
}
</style>
