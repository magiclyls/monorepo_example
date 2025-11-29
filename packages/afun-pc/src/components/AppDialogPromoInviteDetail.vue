<script setup lang='ts'>
import type { CurrencyCode } from '~/composables/useCurrencyData'
import { IconUniDoc } from '@tg/icons'

import { ApiMemberAgencyValidMemberDetail } from '@tg/apis'

interface Props {
  data: { pid: string, currencyId: CurrencyCode }
}
defineOptions({
  name: 'AppDialogPromoInviteDetail',
})
const props = defineProps<Props>()
const closeDialog = inject('closeDialog', () => { })

const { t } = useI18n()
const { isLogin } = storeToRefs(useAppStore())
const { push } = useLocalRouter()
const { openNotify } = useNotify()

const columns: Column[] = [
  {
    title: t('gamer'),
    align: 'center',
    dataIndex: 'username',
    slot: 'username',
  },
  {
    title: t('time'),
    align: 'center',
    dataIndex: 'registered_at',
    slot: 'registered_at',
  },
  {
    title: t('status'),
    align: 'center',
    dataIndex: 'state',
    slot: 'status',
  },
]

const { list: stateOptions, selected: state, valueToLabel } = useSelect([
  { label: t('finance_other_tab_all'), value: 0 },
  { label: t('promo_valid'), value: 1 },
  { label: t('promo_not_valid'), value: 2 },
])
const username = useDebouncedRef({ value: '', delay: 1000, afterTrigger: goSearch })
const { data, loading, runAsync, prev, next, page, total } = useList(ApiMemberAgencyValidMemberDetail, {
  onError(err) {
    const obj = JSON.parse(err.message)
    if (obj.data === 'refresh') {
      openNotify({
        type: 'error',
        code: 'false',
        message: t('promo_end'),
      })
      push('/promotion')
      closeDialog()
    }
  },
}, { page_size: 10 })

const params = computed(() => ({
  pid: props.data.pid,
  username: username.value,
  state: state.value as 0 | 1 | 2,
  currency_id: props.data.currencyId,
  noNotify: true,
}))
const paginationData = computed(() => {
  return {
    pageSize: 10,
    page: page.value,
    total: total.value,
  }
})

const dataList = computed(() => {
  // 调试数据
  // return [
  //   { username: 'string', state: 1, registered_at: 123123 },
  //   { username: 'string', state: 2, registered_at: 123123 },
  //   { username: 'string', state: 1, registered_at: 123123 },
  //   { username: 'string', state: 2, registered_at: 123123 },
  // ]
  return data.value?.d ?? []
})

function goSearch() {
  if (isLogin.value)
    runAsync(params.value)
}

goSearch()
</script>

<template>
  <div class="px-[16px] pb-[16px]" @touchstart.stop @touchmove.stop>
    <div class="search-box grid grid-cols-2 gap-[11px]">
      <BaseSelect
        v-model="state" style="--tg-base-select-popper-style-padding-y:0px;--tg-base-select-popcontent-lineheight: 40px;"
        class="h-[40px] w-full" popper :options="stateOptions" @select="goSearch"
      >
        <template #option="{ data: { item, parentWidth } }">
          <div class="theme-option" :style="{ width: `${parentWidth}px` }">
            {{ item.label }}
          </div>
        </template>
      </BaseSelect>
      <BaseSearch
        v-model="username" :shadow="false"
        :place-holder="t('player_id')" class="input-box w-full" shape="square"
      />
    </div>
    <AppLoading v-show="loading" :full-screen="false" />
    <BaseTable v-show="!loading" class="theme-table mb-[16px]" :columns="columns" :data-source="dataList">
      <template #username="{ record }">
        <div class="flex items-center justify-center">
          <span class="mr-[4px] inline-block max-w-[12ch] overflow-hidden text-ellipsis whitespace-nowrap font-semibold">{{ record.username }}</span>
          <AppTooltip :text="t('copy_success')" @click="application.copy(record.username)">
            <template #content>
              <div class="flex items-center">
                <IconUniDoc />
              </div>
            </template>
          </AppTooltip>
        </div>
      </template>
      <template #registered_at="{ record }">
        {{ timeToFormatFullTimeByBoss(record.registered_at) }}
      </template>
      <template #status="{ record }">
        <span class="theme-text" :class="record.state === 1 ? 'text-tg-text-green' : ''">
          {{ valueToLabel(record.state) }}
        </span>
      </template>
    </BaseTable>
    <AppStack :pagination-data="paginationData" @previous="prev" @next="next" />
  </div>
</template>

<style>
html[theme='white'] {
  --tg-popper-bg: #e3e3e3;
}
[theme='green'] {
  --tg-popper-bg: #fff;
  --tg-popper-color-default: #2f4553;
  --tg-base-select-popper-active-color: #2f4553;
}
</style>

<style lang='scss' scoped>
.theme-option {
  text-align: center;
  @include webTheme('white') {
    background-color: #e3e3e3;
    color: #111;
  }
}
.theme-text {
  font-weight: 600;
  @include webTheme('white') {
    --tg-text-green: #ffaa09;
  }
  @include webTheme('green') {
    --tg-text-green: #f6d14a;
  }
}
.input-box {
  --tg-base-search-border-width: 0;
  @include webTheme('green') {
    --tg-base-search-border-width: var(--tg-border-width-sm);
  }
}
.search-box {
  @include webTheme('green') {
    --tg-body-bg: #02432d;
    --tg-border-color-main: #02432d;
    --tg-base-input-style-bg: #02432d;
    --tg-base-search-icon-color: #5ecea6;
    --tg-base-search-placeholder-color: #3cb389;
    --tg-base-select-popper-bg-color: #02432d;
  }
  @include webTheme('white') {
    --tg-base-select-popper-bg-color: #e3e3e3;
    --tg-base-input-style-bg: #e3e3e3;
    --tg-base-search-placeholder-color: #555;
    --tg-base-search-icon-color: #555;
  }
}
.theme-table {
  @include webTheme('white') {
    --tg-table-even-background: #f5f5f5;
    --tg-table-odd-background: #fff;
  }
  @include webTheme('green') {
    --tg-table-odd-background: #076237;
  }
}
</style>
