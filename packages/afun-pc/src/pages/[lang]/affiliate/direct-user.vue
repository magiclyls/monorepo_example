<script lang="ts" setup>
import { ApiAgencyReportUser } from '@tg/apis'

import { IconUniSearch,IconUniComputer } from '@tg/icons'

const { startTime, endTime } = getDaIntervalMap(new Date().getTime(), 30)
const { isMobile } = storeToRefs(useWindowStore())
const { t } = useI18n()
const { isLogin } = storeToRefs(useAppStore())
const {
  list,
  page,
  page_size,
  loading,
  total,
  runAsync,
  resetPage,
} = useList(ApiAgencyReportUser, {}, { page_size: 5, isWatchPageOrPageSize: false })

const date = ref([])
const searchValue = useDebouncedRef({ value: '', delay: 1000 })

const columns: Column[] = [
  {
    title: t('register_time'),
    dataIndex: 'created_at',
    align: 'center',
    slot: 'created_at',
    skeWidth: '100px',
  },
  {
    title: t('user_account'),
    dataIndex: 'username',
    align: 'center',
    slot: 'username',
  },
  {
    title: t('is_first_deposit'),
    dataIndex: 'deposit_count',
    align: 'center',
    slot: 'deposit_count',
    skeWidth: '50px',
  },
  {
    title: t('last_login'),
    dataIndex: 'last_login_at',
    align: 'center',
    slot: 'last_login_at',
    skeWidth: '100px',
  },
  {
    title: t('online_status'),
    dataIndex: 'online',
    align: 'right',
    slot: 'online',
    skeWidth: '50px',
  },
]

const params = computed(() => {
  return {
    username: searchValue.value,
    start_time: date.value[0],
    end_time: date.value[1],
    page_size: page_size.value,
    page: page.value,
  }
})

onMounted(() => {
  watch(() => isLogin.value, (newValue) => {
    newValue && useListSearch(params, runAsync, resetPage)
  }, { immediate: true })
})
</script>

<template>
  <div class="all-data-page">
    <div class="table-filter my-affiliate-filter">
      <BaseDatePicker
        v-model="date"
        class="my-affiliate-picker"
        :min="startTime"
        :max="endTime"
        :is-utc="false"
      />
      <div class="search-box">
        <BaseInput v-model="searchValue" class="my-affiliate-input" :placeholder="t('player_id')" clearable>
          <template #left-icon>
            <div class="center" style="padding-right: var(--tg-spacing-4);">
              <IconUniSearch  />
            </div>
          </template>
        </BaseInput>
      </div>
    </div>

    <BaseTable
      class="page-all-data page-direct-finance my-affiliate-table"
      :columns="columns"
      :data-source="list"
      :loading="loading"
      :skeleton-row="5"
      show-out-load
      :out-load-height="218"
    >
      <template #username="{ record }">
        <AppReportUserName :username="record.username" :level="`${record.vip}`" />
      </template>
      <template #deposit_count="{ record }">
        <span
          :style="{
            color: record.deposit_count <= 0 ? 'var(--tg-text-error)' : '',
          }"
        >
          {{ record.deposit_count
            ? t('attribute_collector_positive') : t('attribute_collector_negative') }}
        </span>
      </template>
      <template #created_at="{ record }">
        {{ timeToCustomizeFormat(record.created_at, 'MM/DD HH:mm') }}
        <!-- {{ `${timeToDateFormat(record.created_at)} ${timeToCustomizeFormat(
          record.created_at, 'HH:mm:ss')}` }} -->
      </template>
      <template #last_login_at="{ record: { last_login_at } }">
        {{ last_login_at ? `${timeToCustomizeFormat(last_login_at, 'MM/DD HH:mm')}` : '-' }}
      </template>
      <template #online="{ record }">
        <div class="center" style="justify-content: flex-end;">
          <div
            class="center"
            :class="{
              online: record.online === '2',
              offline: record.online === '1',
            }"
          >
            <IconUniComputer v-if="record.online === '2'" />
          </div>
          <span>{{ record.online === '2' ? t('active_state') : t('offline') }}</span>
        </div>
      </template>
    </BaseTable>
    <template v-if="isMobile">
      <AppStack
        v-if="total > page_size"
        class="mt-[16px]" :pagination-data="{
          pageSize: page_size,
          page,
          total,
        }" @previous="() => page-- " @next="() => page++"
      />
    </template>
    <template v-else>
      <BasePagination
        v-if="total > page_size"
        v-model:current-page="page"
        v-model:page-size="page_size"
        :total="total"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.all-data-page {
  --tg-badge-size: 10px;
  --tg-base-select-style-padding-right: var(--tg-spacing-28);
  @include webTheme('white') {
    --tg-base-input-style-bg: #f5f5f5;
    --tg-base-select-popper-bg-color: #f5f5f5;
    --tg-base-input-style-background-color: #f5f5f5;
    --tg-base-date-picker-bother: transparent;
  }
}

.online {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: var(--tg-text-green);
  margin-right: var(--tg-spacing-2);
  font-size: 8px;
}
.offline {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  margin-right: var(--tg-spacing-2);
  background-color: var(--tg-text-grey-lighter);
}
.page-all-data {
  --tg-app-amount-font-weight: var(--tg-font-weight-normal);
}

.table-filter {
  & > :last-child {
    grid-column-start: span 2;
  }
}
.search-box {
  @include webTheme('green') {
    --tg-box-shadow: none;
    --tg-base-input-style-placeholder-color: #fff;
    --tg-icon-color: #fff;
    --tg-base-input-style-background-color: var(--tg-base-square-tab-bg-green);
  }
}
.my-affiliate-filter {
  @include webTheme('green') {
    --tg-popper-hover-color-default: var(--tg-icon-color-grey);
    .my-affiliate-picker {
      --tg-base-date-picker-bg: #055434;
      --tg-base-date-picker-bother: 1px solid #055434;
      --tg-border-color-deep-grey: var(--tg-base-green-border);
    }
    .my-affiliate-select {
      --tg-icon-arrow-color: var(--tg-icon-color-grey);
      --tg-base-select-border: 1px solid #055434;
      --tg-border-color-deep-grey: var(--tg-base-green-border);
    }
  }
}
.my-affiliate-table {
  @include webTheme('green') {
    --tg-icon-color: var(--tg-icon-color-grey);
    --tg-text-white: var(--tg-text-placeholder);
  }
}
</style>
