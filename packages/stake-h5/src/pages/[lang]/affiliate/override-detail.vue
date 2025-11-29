<script lang="ts" setup>
import { ApiAgencyCommissionDetail, ApiAgencyCommissionModelsOptions } from '@tg/apis'
import dayjs from 'dayjs'

const { isZhcn } = storeToRefs(useLanguageStore())
const { startTime, endTime } = getDaIntervalMap(new Date().getTime(), 30)
const { isMobile } = storeToRefs(useWindowStore())
const { mode, bonus_currency, type } = storeToRefs(useAffiliate())
const { t } = useI18n()
const { isLogin } = storeToRefs(useAppStore())
const { openPlayerCommissionDialog } = useDialogPlayerCommission()

const detail = ref<{
  username?: string
  valid_bet_amount?: string
  commission_amount?: string
}>({})
const { selected: currency_id, list: currencyList } = useSelect([
  {
    label: t('all_commission'),
    value: 0,
  },
  {
    label: t('direct_commission'),
    value: 1,
  },
  {
    label: t('team_commission'),
    value: 2,
  },
])

const typeId = ref('')
const platformIdList = ref<Array<{ label: string, value: any }>>([{
  label: t('label_all_type'),
  value: '',
}])

useRequest(ApiAgencyCommissionModelsOptions, {
  manual: false,
  onSuccess(data) {
    if (!data)
      return
    if (data.length === 1 && data[0].all === 1)
      return
    const arr = data.map((item) => {
      return {
        label: item.name,
        value: item.id,
      }
    })
    arr.unshift({
      label: t('label_all_type'),
      value: '',
    })
    platformIdList.value = arr
  },
})

const { list, page, page_size, loading, total, runAsync, resetPage } = useList(ApiAgencyCommissionDetail, {
  onSuccess: (res) => {
    detail.value = res.c
  },

}, { page_size: 5, isWatchPageOrPageSize: false })

const date = ref([
  dayjs(new Date().getTime() + window.serverTimeDiff).subtract(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
  dayjs(new Date().getTime() + window.serverTimeDiff).subtract(1, 'day').endOf('day').format('YYYY-MM-DD HH:mm:ss'),
])

const titleText = computed(() => {
  if (currency_id.value == 0)
    return t('commission_page_player')
  else if (currency_id.value == 1)
    return t('direct') + t('commission_page_player')
  else
    return t('team_text') + t('commission_page_player')
})

const columns = computed(() =>
  [
    {
      title: titleText.value,
      dataIndex: 'username',
      align: 'center',
      slot: 'username',
    },
    {
      title: t('hilo_bet'),
      dataIndex: 'valid_bet_amount',
      align: 'center',
      slot: 'valid_bet_amount',
    },
    {
      title: t('commission'),
      dataIndex: 'commission_amount',
      align: 'center',
      slot: 'commission_amount',
    },
  ])

const params = computed(() => {
  return {
    user_type: currency_id.value,
    model_id: typeId.value,
    start_time: date.value[0],
    end_time: date.value[1],
    page_size: page_size.value,
    page: page.value,
  }
})

const runFn = throttle(async (val: any) => {
  runAsync(val)
}, 500, { leading: true, trailing: false })

onMounted(() => {
  watch(isLogin, (newValue) => {
    newValue && useListSearch(params, runFn, resetPage)
  }, { immediate: true })
})
</script>

<template>
  <div class="all-data-page" :class="{ 'pc-mode': !isMobile, 'mobile-mode': isMobile }">
    <div class="my-commission-filter-wrap">
      <AppTimeSearch v-model="date" class="mb-[8px]" :type="2" default-type="yesterday" />
      <template v-if="isMobile">
        <BaseDatePicker
          :key="`${date[0] + date[1]}`" v-model="date" :style="isZhcn ? '--tg-base-date-picker-font-weight:500;' : '--tg-base-date-picker-font-weight:600;'"
          class="my-affiliate-picker" :init-start-date="date[0]" :init-end-date="date[1]" :min="startTime"
          :max="endTime" :is-utc="false"
        />
        <div class="mt-[8px] flex">
          <BaseSelect
            v-if="mode !== 1" v-model.lazy="currency_id" class="my-affiliate-select flex-1"
            :style="isZhcn ? '--tg-base-select-popper-font-weight:500;' : '--tg-base-select-popper-font-weight:600;'"
            :options="currencyList" style="margin-right: 0 !important" :popper="true" :same-hide="true"
          />
        </div>
        <div class="mt-[8px] flex">
          <BaseSelect
            v-model.lazy="typeId" class="my-affiliate-select flex-1"
            :style="isZhcn ? '--tg-base-select-popper-font-weight:500;' : '--tg-base-select-popper-font-weight:600;'"
            :options="platformIdList" style="margin-right: 0 !important" :popper="true" :same-hide="true"
          />
        </div>
      </template>
      <div v-else class="flex items-center gap-[8px]">
        <BaseDatePicker
          :key="`${date[0] + date[1]}`" v-model="date" :style="isZhcn ? '--tg-base-date-picker-font-weight:500;' : '--tg-base-date-picker-font-weight:600;'"
          class="my-affiliate-picker" :init-start-date="date[0]" :init-end-date="date[1]" :min="startTime"
          :max="endTime" :is-utc="false"
        />
        <BaseSelect
          v-if="mode !== 1" v-model.lazy="currency_id" class="my-affiliate-select"
          :options="currencyList" :style="isZhcn ? '--tg-base-select-popper-font-weight:500;' : '--tg-base-select-popper-font-weight:600;'" :popper="true" :same-hide="true"
        />
        <BaseSelect
          v-model.lazy="typeId" class="my-affiliate-select"
          :options="platformIdList" :style="isZhcn ? '--tg-base-select-popper-font-weight:500;' : '--tg-base-select-popper-font-weight:600;'" :popper="true" :same-hide="true"
        />
      </div>
    </div>
    <div class="detail">
      <div class="detail-item" :class="{ 'is-pc': !isMobile, isZhcn }">
        <div>{{ t('Valid_bets') }}</div>
        <AppAmount
          class="retention-item-amount" :amount="detail.valid_bet_amount"
          :currency-type="getCurrencyConfigByCode(bonus_currency)?.name"
        />
      </div>
      <div class="detail-item" :class="{ isZhcn }">
        <div>{{ t('commission_received') }}</div>
        <AppAmount
          class="retention-item-amount" :amount="detail.commission_amount"
          :currency-type="getCurrencyConfigByCode(bonus_currency)?.name"
        />
      </div>
    </div>
    <BaseLoading v-if="loading" class="h-[300px]" />
    <BaseTable
      v-else
      class="page-all-data page-direct-finance my-affiliate-table" :columns="columns" :data-source="list"
      :style="isZhcn ? '--tg-table-td-font-weight:500;' : ''"
    >
      <template #username="{ record }">
        <div class="center" @click="openPlayerCommissionDialog({ username: record.username, showClose: false, id: record.id })">
          {{ record.username }}
        </div>
      </template>
      <template #valid_bet_amount="{ record }">
        <div class="center" @click="openPlayerCommissionDialog({ username: record.username, showClose: false, id: record.id })">
          <AppAmount :amount="record.valid_bet_amount" :currency-type="getCurrencyConfigByCode(bonus_currency)?.name" />
        </div>
      </template>
      <template #commission_amount="{ record }">
        <div class="center" @click="openPlayerCommissionDialog({ username: record.username, showClose: false, id: record.id })">
          <AppAmount :amount="record.commission_amount" :currency-type="getCurrencyConfigByCode(bonus_currency)?.name" />
        </div>
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
        v-if="total > page_size"
        v-model:current-page="page" v-model:page-size="page_size"
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
  --tg-base-date-picker-outer-height: 40px;

  &.mobile-mode[lang='zh'] {
    :deep(.time-button) {
      min-width: initial !important;
      width: auto !important;
      flex: 1 !important;
    }
  }

  @include webTheme('green') {
    --tg-table-odd-background: #055434;
  }

  @include webTheme('white') {
    --tg-base-select-popper-label-hover-bg-color: #f5f5f5;
  }
}

.my-affiliate-input {
  --tg-base-input-style-border: none;
}

.detail {
  margin-top: 8px;

  .detail-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 21px 16px;
    background: var(--tg-secondary-grey);
    color: var(--tg-text-lightgrey);
    margin-bottom: 1px;
    font-size: 14px;
    font-weight: 600;
    &.is-pc {
      margin-bottom: 2px;
    }
    &.isZhcn {
      font-weight: 500;
    }

    @include webTheme('white') {
      background: #f5f5f5;
    }

    @include webTheme('green') {
      background: #055434;
    }

    &:nth-child(1) {
      border-radius: 4px 4px 0 0;
    }

    &:last-child {
      border-radius: 0 0 4px 4px;
    }
  }

  .retention-item-amount {
    color: #ffffff;

    @include webTheme('white') {
      color: #111111;
    }
  }
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
      color: #fff;

      @include webTheme('white') {
        background: #f2ca5c !important;
      }

      @include webTheme('new-default') {
        background-color: #2f4554 !important;
      }

      @include webTheme('green') {
        background-color: #197b59 !important;
      }
    }
  }

  :deep(.label-box) {
    background: #071824;

    @include webTheme('white') {
      background-color: #e8e8e8 !important;
    }

    @include webTheme('green') {
      background-color: #055434 !important;
    }

    border-radius: 4px;
  }

  .my-affiliate-select,
  .my-affiliate-input {
    background: #071824 !important;

    @include webTheme('white') {
      background-color: #e8e8e8 !important;
    }

    @include webTheme('green') {
      background-color: #055434 !important;
    }

    border-radius: 4px;

    :deep(.popper-label) {
      background: #071824 !important;

      @include webTheme('white') {
        background-color: #e8e8e8 !important;
      }

      @include webTheme('green') {
        background-color: #055434 !important;
      }
    }
  }
}

.mobile-mode {
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

    .base-date-picker {
      flex: 1;
      margin-right: 0 !important;
    }
  }

  :deep(.base-date-picker) {
    margin-right: 19px !important;
  }
}
</style>
