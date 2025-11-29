<script setup lang='ts'>
import type { ICasinoBetRecordItem } from '@tg/types'
import { IconTabbarBet, IconEmpty1 } from '@tg/icons'

import { ApiMemberUserBetList } from '@tg/apis'

interface Props {
  isFirst: boolean
  period: string
}
defineOptions({
  name: 'AppCasinoPageMyBet',
})
const props = defineProps<Props>()

const { t } = useI18n()
const { isMobile } = storeToRefs(useWindowStore())
const { openBetSlipDialog } = useDialogBetSlip()
const { push } = useLocalRouter()

const columns = computed<Column[]>(() => {
  if (isMobile.value) {
    return [
      {
        title: t('game'),
        width: 90,
        dataIndex: 'game_name',
        slot: 'game_name',
        align: 'left',
        color: 'var(--tg-table-text-color)',
      },
      // {
      //   title: t('bet_number'),
      //   width: 90,
      //   dataIndex: 'bill_no',
      //   slot: 'bill_no',
      //   align: 'left',
      // },
      {
        title: t('bet_amount'),
        width: 90,
        dataIndex: 'bet_amount',
        slot: 'bet_amount',
        align: 'center',
        color: 'var(--tg-table-amount-color)',
      },
      {
        title: t('sports_payment_amount'),
        width: 90,
        dataIndex: 'net_amount',
        slot: 'net_amount',
        align: 'right',
      },
    ]
  }
  return [
    {
      title: t('game'),
      width: 90,
      dataIndex: 'game_name',
      slot: 'game_name',
      align: 'left',
      color: 'var(--tg-table-text-color)',
    },
    {
      title: t('bet_number'),
      width: 90,
      dataIndex: 'bill_no',
      slot: 'bill_no',
      align: 'left',
      color: 'var(--tg-table-text-color)',
    },
    {
      title: t('date'),
      width: 90,
      dataIndex: 'bet_time',
      slot: 'bet_time',
      align: 'center',
      color: 'var(--tg-table-text-color)',
    },
    {
      title: t('bet_amount'),
      width: 90,
      dataIndex: 'bet_amount',
      slot: 'bet_amount',
      align: 'right',
      color: 'var(--tg-table-amount-color)',
    },
    // {
    //   title: t('multiple_count'),
    //   width: 90,
    //   dataIndex: 'x',
    //   slot: 'x',
    //   align: 'center',
    // },
    {
      title: t('sports_payment_amount'),
      width: 90,
      dataIndex: 'net_amount',
      slot: 'net_amount',
      align: 'right',
    },
  ]
})
/** 开始时间 */
/** 开始时间 */
const startTime = computed(() => {
  if (props.period === 'today')
    return getTodayTimeRange().start
  if (props.period === 'week')
    return getCurrentWeekTimeRange().start
  if (props.period === 'month')
    return getCurrentMonthTimeRange().start
  return 0
})
/** 结束时间 */
const endTime = computed(() => {
  if (props.period === 'today')
    return getTodayTimeRange().end
  if (props.period === 'week')
    return getCurrentWeekTimeRange().end
  if (props.period === 'month')
    return getCurrentMonthTimeRange().end
  return 0
})

const {
  list,
  prev,
  next,
  total,
  page,
  runAsync,
  run,
  page_size,
  loading,
} = useList(ApiMemberUserBetList, {}, { page_size: 10 })
const paginationData = computed(() => {
  return {
    pageSize: page_size.value,
    page: page.value,
    total: total.value,
  }
})

function showDetail(data: ICasinoBetRecordItem) {
  openBetSlipDialog({ type: 'casino', data })
}
function openCasinoGame(data: ICasinoBetRecordItem) {
  const { game_code, platform_id, platform_name, game_name, game_class, game_type } = data
  const r = Math.random().toString(36).slice(-10)
  // 原创游戏
  if (game_class === EnumGlobalGameType.original)
    return push(`/casino/original-game/${game_name.toLowerCase()}`)

  let vid = +platform_id
  if (EnumCasinoPidToVid[+platform_id])
    vid = EnumCasinoPidToVid[+platform_id]

  push(`/casino/games/${r}?name=${game_name}&pn=${platform_name}&vid=${vid}&game_id=${game_code}&game_class=${game_class}&pid=${platform_id}${game_type ? `&type=${game_type}` : ''}`)
}

if (props.isFirst)
  await application.allSettled([runAsync({ start_time: startTime.value * 1000, end_time: endTime.value * 1000 })])
else
  run({ start_time: startTime.value * 1000, end_time: endTime.value * 1000 })
</script>

<template>
  <div class="mb-[16px] min-h-[231px] @md:mb-[32px]">
    <AppLoading v-if="list && list.length ? false : loading" :height="isMobile ? 220 : 220" />
    <template v-else>
      <div v-if="list.length === 0" class="empty">
        <BaseEmpty style="font-size: var(--tg-empty-icon-size);padding-bottom: 0;" icon="empty-1">
          <template #icon>
            <BaseImage class="w-[80px]" url="/png/icon/empty-1.png" />
          </template>
          <template #description>
            <div class="mb-[-7px] mt-[12px]">
              {{ t('empty_casino_bet') }}
            </div>
          </template>
        </BaseEmpty>
        <div class="idiot">
          <BaseButton type="text" size="none" style="--tg-base-button-text-default-color:var(--tg-text-white)"
            @click="push('/casino')">
            {{ t('start_game_now') }}！
          </BaseButton>
        </div>
      </div>

      <BaseTable v-else :loading="loading" :columns="columns" :data-source="list" class="table">
        <template #game_name="{ record }">
          <BaseButton size="none" type="text" @click="openCasinoGame(record)">
            <BaseImage class="w-[14px]" :url="record.icon" is-network with-theme />
            <span
              style="padding-left:  var(--tg-spacing-4);color: var(--tg-table-text-white-to-theme-color);text-transform: capitalize;">{{
                record.game_name }}</span>
          </BaseButton>
        </template>
        <template #bill_no="{ record }">
          <BaseButton size="none" type="text" @click="showDetail(record)">
            <div class="bill_no">
              <IconTabbarBet v-if="!isMobile" style="font-size: var(--tg-font-size-base);" />
              <span style="color: var(--tg-table-text-white-to-theme-color)">{{ record.bill_no }}</span>
            </div>
          </BaseButton>
        </template>
        <template #bet_time="{ record: { bet_time } }">
          <div>
            {{ timeToCustomizeFormat(bet_time) }}
          </div>
        </template>
        <template #bet_amount="{ record }">
          <div class="flex justify-center @md:justify-end" @click="showDetail(record)">
            <AppAmount :amount="record.bet_amount" :currency-type="getCurrencyConfigByCode(record.currency_id)?.name"
              :show-icon="false" />
          </div>
        </template>
        <template #net_amount="{ record }">
          <div class="amount cursor-pointer" :class="{ win: record.settle_amount > 0 }" @click="showDetail(record)">
            <AppAmount :amount="record.settle_amount" :currency-type="getCurrencyConfigByCode(record.currency_id)?.name"
              show-color />
          </div>
        </template>
      </BaseTable>
      <AppStack v-show="list.length > 0" class="mt-[16px]" :pagination-data="paginationData" scroll @previous="prev"
        @next="next" />
    </template>
  </div>
</template>

<style>
:root {
  --tg-table-text-white-to-theme-color: var(--tg-text-white);
}

[theme='green'] {
  --tg-table-text-white-to-theme-color: var(--tg-text-green-main);
}
</style>

<style lang='scss' scoped>
.table {
  @include webTheme('white') {
    --tg-table-odd-background: white;
    --tg-table-even-background: #f5f5f5;
    --tg-app-amount-green-color: #ffaa09;
    --tg-app-amount-red-color: #ed4163;
  }

  @include webTheme('green') {
    --tg-table-text-white-to-theme-color: white;
    --tg-table-amount-color: #3cb389;
    --tg-app-amount-green-color: #f6d14a;
    --tg-app-amount-red-color: #f34b39;
  }
}

.empty {
  width: 100%;
  height: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 32px;
  margin-bottom: 20px;
  padding: 16px;

  .idiot {
    display: flex;
    flex-direction: column;

    span {
      font-size: var(--tg-font-size-default);
      color: var(--tg-text-lightgrey);
      margin-bottom: 4px;
    }
  }
}

.bill_no {
  display: flex;
  align-items: center;

  span {
    margin-left: var(--tg-spacing-4);
    display: inline-block;
    max-width: 9ch;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: var(--tg-text-white);
    font-weight: var(--tg-font-weight-semibold);
  }
}

.amount {
  display: flex;
  justify-content: flex-end;
}
</style>
