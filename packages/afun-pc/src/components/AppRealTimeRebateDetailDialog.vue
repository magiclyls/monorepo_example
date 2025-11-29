<script lang="ts" setup>
import { IconUniClose, IconUniAllRect } from '@tg/icons'
import { ApiMemberRebateDetail } from '@tg/apis'

defineOptions({
  name: 'AppRealTimeRebateDetailDialog',
})
const props = defineProps<Props>()

interface Props {
}

const closeDialog = inject('closeDialog', () => { })

const { t } = useI18n()
const customRouter = useCustomRouter()
// const { rebateType } = useRebateData()
const { userLanguage } = storeToRefs(useLanguageStore())

// const {
//   runAsync: runAsyncRebateDetail,
//   loading: loadingRebateDetail,
//   list: rebateDetail,
//   next,
//   prev,
//   page,
//   page_size,
//   total,
// } = useList(ApiMemberRebateDetail, {}, { page_size: 6, page: 1, isWatchPageOrPageSize: false })

const { data: rebateDetail, runAsync: runGetData, loading: loadingRebateDetail } = useRequest(ApiMemberRebateDetail)

const dataResource = computed(() => rebateDetail.value?.map(r => ({ ...r, time: r.date })) ?? [])

const currentDetail = computed(() => ({ currency_id: customRouter.query.currency_id, game_type: customRouter.query.game_type }))

// const getPage = computed(() => {
//   return {
//     pageSize: page_size.value,
//     page: page.value,
//     total: total.value,
//   }
// })

const columns = computed<Column[]>(() => [
  {
    title: t('time'),
    dataIndex: 'time',
    align: 'center',
    slot: 'created_at',
    color: 'var(--tg-table-text-color)',
  },
  {
    title: t('platform_label'),
    dataIndex: 'platform_name',
    align: 'center',
    slot: 'platform_name',
    color: 'var(--tg-table-text-color)',
  },
  {
    title: t('menu_title_settings_bets'),
    dataIndex: 'valid_bet_amount',
    align: 'center',
    slot: 'valid_bet_amount',
    color: 'var(--tg-table-text-color)',
    // isAmount: true,
  },
  // {
  //   title: t('vip_proportion'),
  //   dataIndex: 'rate',
  //   align: 'center',
  //   slot: 'rate',
  // },
  {
    title: t('amount'),
    dataIndex: 'rebate_amount',
    align: 'center',
    slot: 'rebate_amount',
    // isAmount: true,
  },
])

function getPlatName(name: string, id: string) {
  if (name && name.length && id && id.length) {
    if (name.toLowerCase() === 'casino games' || id[0] === '8')
      return t('casino_game2')
    else if (name.toLowerCase() === 'im' || name.toLowerCase() === 'inplay matrix' || id[0] === '4')
      return t('sports')
  }
  return name
}

function close() {
  closeDialog()
}

// function pageNext() {
//   next()
//   runAsyncRebateDetail(currentDetail.value)
// }
// function pagePrev() {
//   prev()
//   runAsyncRebateDetail(currentDetail.value)
// }

// page.value = 1
runGetData(currentDetail.value)
</script>

<template>
  <div class="h-full">
    <div v-if="loadingRebateDetail" class="center dialog-loading-height h-full flex flex-col">
      <BaseLoading />
    </div>
    <div v-else class="app-realtime-rebate-detail h-full flex flex-col" @touchstart.stop @touchmove.stop>
      <div class="tg-base-dialog-header">
        <h2>
          <IconUniAllRect />
          <span>{{ t('detail') }}</span>
          <AppCurrencyIcon v-if="currentDetail && currentDetail.currency_id" :currency-type="getCurrencyConfigByCode(currentDetail.currency_id)?.name" />
        </h2>
        <a class="close" @click.stop="close">
          <IconUniClose />
        </a>
      </div>
      <div class="scroll-y flex flex-1 flex-col p-[16px] pt-0" @touchstart.stop @touchmove.stop>
        <div>
          <BaseTable
            :columns="columns" :data-source="dataResource" :loading="loadingRebateDetail"
            :show-out-load="true" class="theme-table"
          >
            <template #platform_name="{ record: { platform_name, platform_id } }">
              <div>
                {{ getPlatName(`${platform_name}`, `${platform_id}`) }}
              </div>
            </template>
            <template #created_at="{ record: { time } }">
              <div v-if="time">
                {{ timeToCustomizeFormat(new Date(time).getTime(), 'MM/DD') }}
              </div>
            </template>
            <!-- <template #rate="{ record: { rate } }">
            {{ `${rate}%` }}
          </template> -->
            <template #valid_bet_amount="{ record: { valid_bet_amount, currency_id } }">
              <div class="center">
                <AppAmount class="theme-amount1" :amount="valid_bet_amount" :currency-code="currency_id" :show-icon="false" />
              </div>
            </template>
            <template #rebate_amount="{ record: { rebate_amount, currency_id } }">
              <div class="center">
                <AppAmount class="theme-amount2" :amount="rebate_amount" :currency-code="currency_id" :show-icon="false" />
              </div>
            </template>
          </BaseTable>
        </div>
      </div>
      <div class="p-[16px] pt-0">
        <!-- <div v-if="total > 6">
        <AppStack :pagination-data="getPage" @previous="pagePrev" @next="pageNext" />
      </div> -->
        <BaseButton class="w-full" bg-style="primary" size="xl" style="--tg-base-button-font-size:var(--tg-font-size-base)" @click="customRouter.back()">
          {{ t('navigation_back') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-realtime-rebate-detail {
  --tg-empty-padding: 40px;
  --tg-app-amount-font-weight: 400;
  // --tg-app-amount-green-color: var(--tg-primary-fail);
}
.theme-amount1 {
  @include webTheme('green') {
    color: var(--tg-text-yellow-light);
  }
  @include webTheme('greenblack') {
    color: var(--tg-table-amount-color);
  }
  @include webTheme('white') {
    color: #484848;
  }
}
.theme-amount2 {
  color: green;
  @include webTheme('green') {
    color: var(--tg-text-yellow-light);
  }
  @include webTheme('greenblack') {
    color: var(--tg-table-amount-color);
  }
  @include webTheme('white') {
    color: #ffaa09;
  }
}
.theme-table {
  @include webTheme('white') {
    --tg-table-th-color: #111111;
    --tg-table-td-font-weight: 500;
    --tg-app-amount-font-weight: 500;
    --tg-table-even-background: #f5f5f5;
    --tg-table-odd-background: #fff;
  }
  @include webTheme('green') {
    --tg-table-even-background: #055434;
    --tg-table-odd-background: #076237;
    --tg-table-th-background: #055434;
    --tg-table-amount-color: #3cb389;
    --tg-table-text-color: #3cb389;
  }
}
</style>
