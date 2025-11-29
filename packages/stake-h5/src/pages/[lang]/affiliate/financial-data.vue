<script lang="ts" setup>
import { ApiAgencyCommissionFinance, ApiAgencyCommissionModelsList } from '@tg/apis'
import { IconUniSearch } from '@tg/icons'

const { isZhcn } = storeToRefs(useLanguageStore())
const { startTime, endTime } = getDaIntervalMap(new Date().getTime(), 30)
const { isMobile } = storeToRefs(useWindowStore())
const { mode, bonus_currency } = storeToRefs(useAffiliate())
const { t } = useI18n()
const detail = ref([])
const { isLogin } = storeToRefs(useAppStore())
const lock = ref(false)
const platformIdList = ref([
  {
    label: t('label_all_type'),
    value: '',
  },
])
const {
  selected: currency_id,
  list: currencyList,
} = useSelect([
  {
    label: t('finance_other_tab_all'),
    value: 0,
  },
  {
    label: t('direct'),
    value: 1,
  },
  {
    label: t('team_text'),
    value: 2,
  },
])
const sumData = computed(() => {
  if (detail.value && detail.value[0]) {
    const allData = detail.value[0]
    return [t('sum_label'), allData.valid_bet_amount, allData.net_amount, allData.deposit_amount, allData.withdraw_amount, allData.cash_profit]
  }
  return []
})

const {
  list,
  page,
  page_size,
  loading,
  total,
  prev,
  next,
  runAsync,
  resetPage,
} = useList(ApiAgencyCommissionFinance, {
  onSuccess: (res) => {
    detail.value = res.c
  },
}, { page_size: 5, isWatchPageOrPageSize: true })
useRequest(ApiAgencyCommissionModelsList, {
  manual: false,
  onSuccess(data) {
    platformIdList.value = platformIdList.value.concat(data.map((item) => {
      return {
        label: item.name,
        value: item.id,
      }
    }))
  },
})

const date = ref([])
const searchValue = useDebouncedRef({ value: '', delay: 1000 })

const columns = computed<Column[]>(() => {
  let width = 'auto'
  let isThLineClamp2 = false
  if (isMobile.value) {
    width = '31vw'
    isThLineClamp2 = true
  }

  return [
    {
      title: t('casino_bottom_table_header_gamer'),
      dataIndex: 'username',
      align: 'center',
      slot: 'time',
      skeWidth: '100px',
      isThLineClamp2,
      width,
    },
    {
      title: t('h5_bottom_menu_title_settings_bets'),
      dataIndex: 'valid_bet_amount',
      align: 'center',
      slot: 'settings_bets',
      isThLineClamp2,
      width,
    },
    {
      title: t('win_lose'),
      dataIndex: 'net_amount',
      align: 'center',
      slot: 'win_lose',
      isThLineClamp2,
      width,
    },
    {
      title: t('menu_title_settings_deposits'),
      dataIndex: 'deposit_amount',
      align: 'center',
      slot: 'settings_deposits',
      isThLineClamp2,
      width,
    },
    {
      title: t('withdraw'),
      dataIndex: 'withdraw_amount',
      align: 'center',
      slot: 'withdraw',
      isThLineClamp2,
      width,
    },
    {
      title: t('cash_profit'),
      dataIndex: 'cash_profit',
      align: 'center',
      slot: 'cash_profit',
      sumSlot: 'sum_cash_profit',
      isThLineClamp2,
      width,
    },
  ]
})

const params = computed(() => {
  return {
    username: searchValue.value,
    user_type: currency_id.value,
    start_time: date.value[0],
    end_time: date.value[1],
    page_size: page_size.value,
    page: page.value,
  }
})

const runFn = throttle(async (val) => {
  runAsync(val)
}, 500, { leading: true, trailing: false })

onMounted(() => {
  if (mode.value == 1) {
    currency_id.value = 1
    lock.value = true
  }
  else if (mode.value == 2) {
    currency_id.value = 0
    lock.value = true
  }
  else if (mode.value == 3) {
    currency_id.value = 0
  }

  watch(() => isLogin.value, (newValue) => {
    newValue && useListSearch(params, runFn, resetPage)
  }, { immediate: true })
})
</script>

<template>
  <div class="all-data-page" :class="{ 'pc-mode': !isMobile, 'mobile-mode': isMobile }">
    <div class="my-commission-filter-wrap">
      <AppTimeSearch v-model="date" class="mb-[8px]" />
      <template v-if="isMobile">
        <BaseDatePicker
          :key="`${date[0] + date[1]}`" v-model="date" class="my-affiliate-picker mb-[8px]" :init-start-date="date[0]"
          :init-end-date="date[1]" :min="startTime" :max="endTime"
          :style="isZhcn ? '--tg-base-date-picker-font-weight:500;' : '--tg-base-date-picker-font-weight:600;'"
          :is-utc="false"
        />
        <div class="flex">
          <BaseSelect
            v-if="mode != 1" v-model.lazy="currency_id" class="my-affiliate-select mr-[21px] flex-1"
            :style="isZhcn ? '--tg-base-select-popper-font-weight:500' : '--tg-base-select-popper-font-weight:600'"
            :options="currencyList" :popper="true" :same-hide="true"
          />
          <BaseInput
            v-model="searchValue" class="my-affiliate-input flex-1" :placeholder="t('player_id')"
            :style="isZhcn ? '--tg-base-input-style-font-weight:500;' : ''"
            clearable
          >
            <template #left-icon>
              <div class="center" style="padding-right: var(--tg-spacing-4);">
                <IconUniSearch  />
              </div>
            </template>
          </BaseInput>
        </div>
      </template>
      <div v-else class="mb-[14px] flex items-center gap-[8px]">
        <BaseDatePicker
          :key="`${date[0] + date[1]}`" v-model="date" class="my-affiliate-picker" :init-start-date="date[0]"
          :init-end-date="date[1]" :style="isZhcn ? '--tg-base-date-picker-font-weight:500;' : '--tg-base-date-picker-font-weight:600;'" :min="startTime" :max="endTime"
          :is-utc="false"
        />
        <BaseSelect
          v-if="mode != 1" v-model.lazy="currency_id" class="my-affiliate-select flex-1"
          :style="isZhcn ? '--tg-base-select-popper-font-weight:500' : '--tg-base-select-popper-font-weight:600'"
          :options="currencyList" :popper="true" :same-hide="true"
        />
        <BaseInput
          v-model="searchValue"
          :style="isZhcn ? '--tg-base-input-style-font-weight:500;' : ''"
          class="my-affiliate-input flex-1" :placeholder="t('player_id')" clearable
        >
          <template #left-icon>
            <div class="center" style="padding-right: var(--tg-spacing-4);">
              <IconUniSearch  />
            </div>
          </template>
        </BaseInput>
      </div>
    </div>
    <BaseTable
      class="page-all-data page-direct-finance my-affiliate-table" :columns="columns" :data-source="list"
      :loading="loading" :skeleton-row="5" :currency-id="bonus_currency" show-out-load is-amount-popper
      :sum-data="sumData" :show-summary="true" :out-load-height="218"
      :style="isZhcn ? '--tg-table-td-font-weight:500;' : ''"
    >
      <template #th-settings_bets>
        <div class="center" style="margin-left: 3px">
          <AppCurrencyIcon :currency-type="getCurrencyConfigByCode(bonus_currency).name" />
        </div>
      </template>
      <template #th-win_lose>
        <div class="center" style="margin-left: 3px">
          <AppCurrencyIcon :currency-type="getCurrencyConfigByCode(bonus_currency)?.name" />
        </div>
      </template>
      <template #th-settings_deposits>
        <div class="center" style="margin-left: 3px">
          <AppCurrencyIcon :currency-type="getCurrencyConfigByCode(bonus_currency)?.name" />
        </div>
      </template>
      <template #th-withdraw>
        <div class="center" style="margin-left: 3px">
          <AppCurrencyIcon :currency-type="getCurrencyConfigByCode(bonus_currency)?.name" />
        </div>
      </template>
      <template #th-cash_profit>
        <div class="center" style="margin-left: 3px">
          <AppCurrencyIcon :currency-type="getCurrencyConfigByCode(bonus_currency)?.name" />
        </div>
      </template>

      <template #cash_profit="{ record }">
        <span v-if="Number(record.cash_profit) === 0">
          {{ record.cash_profit }}
        </span>
        <span v-else :style="{ color: record.cash_profit > 0 ? 'var(--positive-color)' : 'var(--negative-color)' }">
          {{ record.cash_profit > 0 ? '+' : '-' }}{{ record.cash_profit }}
        </span>
      </template>
      <template #sum_cash_profit="{ sums, n }">
        <span v-if="Number(sums[n]) === 0">
          {{ sums[n] }}
        </span>
        <span v-else :style="{ color: sums[n] > 0 ? 'var(--positive-color)' : 'var(--negative-color)' }">
          {{ sums[n] > 0 ? '+' : '-' }}{{ sums[n] }}
        </span>
      </template>
    </BaseTable>
    <template v-if="isMobile">
      <AppStackPage
        v-if="total > page_size"
        class="mt-[16px]" :pagination-data="{
          pageSize: page_size,
          page,
          total,
        }" @previous="() => page-- " @next="() => page++" @size-change="(pageSize) => page_size = pageSize"
      />
    </template>
    <template v-else>
      <BasePagination
        v-if="total > page_size" v-model:current-page="page" v-model:page-size="page_size"
        :total="total"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.all-data-page {
  --tg-badge-size: 10px;
  --tg-base-select-style-padding-right: var(--tg-spacing-28);
  --tg-base-select-popper-style-padding-y: 11px;
  --tg-base-select-popper-style-padding-x: 13.5px;
  --tg-spacing-16: 22px;
  --tg-base-select-popper-label-hover-bg-color: var(--tg-base-date-picker-bg);
  --tg-base-input-height: 40px;
  --tg-base-date-picker-outer-height: 40px;

  &.mobile-mode[lang='zh'] {
    :deep(.time-button) {
      min-width: initial !important;
      width: auto !important;
      flex: 1 !important;
    }
  }

  @include webTheme('new-default') {
    --positive-color: #1fff20;
    --negative-color: #e91134;
  }

  @include webTheme('green') {
    --tg-table-odd-background: #055434;

    --positive-color: #1fff20;
    --negative-color: #f34b39;
  }

  @include webTheme('white') {
    --tg-base-select-popper-label-hover-bg-color: #f5f5f5;

    --positive-color: #00a501;
    --negative-color: #ff0101;
  }
}

.my-affiliate-input {
  --tg-base-input-style-border: none;
  border-radius: 4px;
}

.hint {
  color: var(--tg-text-grey-lighter);
  margin-top: 4px;
}

.page-all-data {
  --tg-app-amount-font-weight: var(--tg-font-weight-normal);
}

.all-data-page {
  @include webTheme('white') {
    --tg-base-select-popper-bg-color: #f5f5f5;
    --tg-base-date-picker-bother: transparent;
    --tg-app-amount-green-color: #ff9e36;
  }

  .my-commission-filter-wrap {
    --tg-base-date-picker-bother: none;

    .my-affiliate-picker {
      --tg-base-date-picker-color: #fff;
      --tg-base-date-picker-outer-margin-right: 8px;
    }

    @include webTheme('green') {
      --tg-popper-hover-color-default: var(--tg-icon-color-grey);
      --tg-base-input-style-bg: #02432d;

      .my-affiliate-picker {
        --tg-base-date-picker-bg: #02432d;
        --tg-base-date-picker-bother: 1px solid #02432d;
        --tg-border-color-deep-grey: var(--tg-base-green-border);
      }

      .my-affiliate-select {
        --tg-icon-arrow-color: var(--tg-icon-color-grey);
        --tg-base-select-border: 1px solid #02432d;
        --tg-border-color-deep-grey: var(--tg-base-green-border);
        --tg-base-select-popper-bg-color: #02432d;
        --tg-base-select-popper-label-hover-bg-color: #02432d;
      }
    }

    @include webTheme('white') {
      --tg-base-input-style-bg: #f5f5f5;
      --tg-base-input-style-background-color: #f5f5f5;

      .my-affiliate-picker {
        --tg-base-date-picker-color: #111111;
      }
    }
  }

  .my-affiliate-table {
    @include webTheme('green') {
      --tg-icon-color: var(--tg-icon-color-grey);
      --tg-text-white: var(--tg-text-placeholder);
      --tg-table-even-background: transparent;
      --tg-table-odd-background: #055434;
    }
  }

  .operate {
    @include webTheme('white') {
      color: #111111;
    }
  }
}

:deep(.time-range-container) {
  display: flex;
  gap: 8px; // 按钮间距
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

:deep(.time-button) {
  white-space: nowrap;
  min-width: fit-content;
  min-width: 96px;
  width: auto;
  padding: 8px 13px;
  flex-shrink: 0; // 防止被压缩
}

:deep(.base-input .input-box input),
:deep(.base-input .input-box input::placeholder) {
  color: #b1bad3 !important;
  opacity: 1 !important;
}

:deep(.base-input .input-box input:-webkit-autofill),
:deep(.base-input .input-box input:-webkit-autofill:hover),
:deep(.base-input .input-box input:-webkit-autofill:focus) {
  -webkit-text-fill-color: #b1bad3 !important;
  transition: background-color 5000s ease-in-out 0s;
}

@media only screen and (max-width: 768px) {
  :deep(.th-box) {
    display: flex !important;
  }
}

.pc-mode {
  padding: calc(27px - 12px) calc(20px - 12px);

  :deep(.time-button),
  :deep(.input-box) {
    background: #071824;

    @include webTheme('white') {
      background-color: #e8e8e8 !important;
    }

    @include webTheme('green') {
      background-color: #055434 !important;
    }

    &.active {
      background: #2f4554;
      @include webTheme('white') {
        background: #f2ca5c;
      }

      @include webTheme('new-default') {
        // background-color: #2F4554 !important;
      }

      @include webTheme('green') {
        background-color: #197b59;
      }
    }
  }

  :deep(.label-box) {
    background: #071824 !important;

    @include webTheme('white') {
      background-color: #e8e8e8 !important;
    }

    @include webTheme('green') {
      background-color: #055434 !important;
    }

    border-radius: 4px;
  }

  :deep(.time-button),
  :deep(.base-date-picker) {
    background: #071824;

    @include webTheme('white') {
      background-color: #e8e8e8 !important;
    }

    @include webTheme('green') {
      background-color: #055434 !important;
    }
  }

  .my-affiliate-select,
  .my-affiliate-input,
  :deep(input),
  :deep(.popper-label) {
    background: #071824 !important;

    @include webTheme('white') {
      background-color: #e8e8e8 !important;
    }

    @include webTheme('green') {
      background-color: #055434 !important;
    }

    border-radius: 4px;
    opacity: 1 !important;

    :deep(.input-box),
    :deep(.popper-label) {
      opacity: 1 !important;

      @include webTheme('white') {
        background: #f5f5f5;
      }

      @include webTheme('new-default') {
        background-color: #0f212e !important;
      }

      @include webTheme('green') {
        background-color: #055434;
      }
    }

    :deep(.disabled) {
      opacity: 1 !important;
    }
  }

  .data-item {
    align-items: center;
  }

  :deep(.popper-label) {
    opacity: 1 !important;
  }
}

.mobile-mode {
  .my-commission-filter-wrap {
    margin-bottom: 8px;
  }

  :deep(.time-button),
  :deep(.label-box),
  :deep(.popper-label),
  :deep(.input-box) {
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  :deep(.date-picker-outer) {
    justify-content: space-between;
    gap: 19px;

    & > div {
      flex: 1;
      margin-right: 0 !important;
    }
  }

  :deep(.base-date-picker),
  :deep(.my-affiliate-select) {
    margin-right: 19px !important;
  }

  :deep(.time-button),
  :deep(.base-date-picker),
  :deep(input) {
    @include webTheme('white') {
      background: #f5f5f5;
    }

    @include webTheme('new-default') {
      background-color: #0f212e !important;
    }

    @include webTheme('green') {
      background-color: #055434;
    }

    &.active {
      @include webTheme('white') {
        background: #f2ca5c;
      }

      @include webTheme('new-default') {
        background-color: #2f4554 !important;
      }

      @include webTheme('green') {
        background-color: #197b59;
      }
    }
  }

  .my-affiliate-select,
  .my-affiliate-input {
    @include webTheme('white') {
      background: #f5f5f5;
    }

    @include webTheme('new-default') {
      background-color: #0f212e !important;
    }

    @include webTheme('green') {
      background-color: #055434;
    }

    :deep(.input-box),
    :deep(.popper-label) {
      opacity: 1 !important;

      @include webTheme('white') {
        background: #f5f5f5;
      }

      @include webTheme('new-default') {
        background-color: #0f212e !important;
      }

      @include webTheme('green') {
        background-color: #055434;
      }

      input {
        color: #fff !important;
      }
    }
  }
}
</style>
