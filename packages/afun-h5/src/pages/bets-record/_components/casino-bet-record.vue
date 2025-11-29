<script setup lang='ts'>
import type { ICasinoBetRecordItem } from '@tg/types'
import { ApiMemberUserBetList } from '@tg/apis'
import { AfunBaseAmount, AfunBaseButton, AfunBaseDialog, AfunBaseEmpty, AfunBaseImage, AfunBasePagination, AfunBaseTable } from '@tg/bccomponents'
import { useList } from '@tg/hooks'
import { IconTabbarBet } from '@tg/icons'
import { EnumCasinoPidToVid, EnumGlobalGameType, EnumOriginalLotteryVenue } from '@tg/types'
import { application, getCurrencyConfig } from '@tg/utils'
import { getCurrentMonthTimeRange, getCurrentWeekTimeRange, getTodayTimeRange } from '@tg/vue-i18n'
import { computed, onBeforeMount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppDialogBetSlipCasino from '~/components/AppDialogBetSlipCasino.vue'

interface Column {
  title?: string
  width?: number | string
  dataIndex: string
  slot?: string
  align?: 'left' | 'center' | 'right'
  color: string
}

defineOptions({ name: 'CasinoBetRecord' })

const props = defineProps<Props>()

interface Props {
  period: string
}

const { t } = useI18n()

const router = useRouter()
const selectedItem = ref()
const showDetailDialog = ref(false)

const columns = ref<Column[]>([
  {
    title: t('游戏'),
    width: 90,
    dataIndex: 'game_name',
    slot: 'game_name',
    align: 'center',
    color: 'var(--afun-table-text-color)',
  },
  {
    title: t('投注金额'),
    width: 90,
    dataIndex: 'bet_amount',
    slot: 'bet_amount',
    align: 'center',
    color: 'var(--afun-table-amount-color)',
  },
  {
    title: t('支付额'),
    width: 90,
    dataIndex: 'net_amount',
    slot: 'net_amount',
    align: 'center',
    color: 'var(--afun-table-amount-color)',
  },
])

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

function showDetail(data: ICasinoBetRecordItem) {
//   openBetSlipDialog({ type: 'casino', data })
  selectedItem.value = { type: 'casino', data }
  showDetailDialog.value = true
}
function openCasinoGame(data: ICasinoBetRecordItem) {
  const { game_code, platform_id, platform_name, game_name, game_class } = data

  let vid = +platform_id
  if (EnumCasinoPidToVid[+platform_id])
    vid = EnumCasinoPidToVid[+platform_id]
  const query: any = {
    id: game_name,
    name: game_name,
    pn: platform_name,
    type: game_class,
    code: game_code,
    vid,
    game_id: game_code,
  }

  let toPath = ''
  // 原创游戏
  if (game_class === EnumGlobalGameType.original) {
    toPath = `?page_dialog=original-game-${game_name.toLowerCase()}`
  }
  // 原创彩票
  else if (platform_id === EnumOriginalLotteryVenue.originalLottery) {
    toPath = application.getOriginalLotteryRouter(game_code)
  }
  else {
    query.page_dialog = 'game-detail'
    toPath = `?${application.objectToUrlParams(query)}`
  }
  router.push(toPath)
}

onBeforeMount(() => {
  runAsync({ start_time: startTime.value * 1000, end_time: endTime.value * 1000 })
})

watch(startTime, () => {
  runAsync({ start_time: startTime.value * 1000, end_time: endTime.value * 1000 })
})
</script>

<template>
  <div>
    <AfunBaseTable :columns="columns" :loading="loading" :data-source="list" style="--afun-table-odd-background: #213743; --afun-table-th-height: 48px; --afun-table-th-font-weight: 500; " :skeleton-row="4">
      <template #game_name="{ record }">
        <div class="inline-block">
          <AfunBaseButton size="none" type="none" class="flex gap-[8px]" @click="openCasinoGame(record)">
            <AfunBaseImage class="w-[14px]" :url="record.icon" is-network with-theme />
            <span class="text-[14px] font-[600] text-[#fff] capitalize">{{
              record.game_name }}</span>
          </AfunBaseButton>
        </div>
      </template>
      <template #bill_no="{ record }">
        <AfunBaseButton size="none" type="none" @click="showDetail(record)">
          <div class="bill_no">
            <IconTabbarBet style="font-size: 16px;" />
            <span style="color: var(--afun-table-text-white-to-theme-color)">{{ record.bill_no }}</span>
          </div>
        </AfunBaseButton>
      </template>
      <template #bet_amount="{ record }">
        <div class="flex justify-center" @click="showDetail(record)">
          <AfunBaseAmount :amount="record.bet_amount" :currency-type="getCurrencyConfig(record.currency_id)?.name" :show-icon="true" style="--afun-app-amount-font-weight: 600; --afun-base-amount-font-size:14px;" />
        </div>
      </template>
      <template #net_amount="{ record }">
        <div class="flex justify-center" :class="{ win: record.settle_amount > 0 }" @click="showDetail(record)">
          <AfunBaseAmount
            :amount="record.settle_amount" :currency-type="getCurrencyConfig(record.currency_id)?.name" :show-icon="true" show-color
            style="--afun-app-amount-font-weight: 600; --afun-base-amount-font-size:14px;--afun-base-amount-positive-color: #24EE89;--afun-base-amount-negative-color: #B1BAD3;"
          />
        </div>
      </template>
      <template #empty>
        <div class="mt-[10px]" @click="router.push('/')">
          <AfunBaseEmpty img="/m/afun-h5/png/uni-table-empty.png" :description="t('投注单为空')" />
          <div class="text-center text-[#fff] font-[600] mb-[31px] mt-[2px]">
            {{ t('立即开始游戏') }}
          </div>
        </div>
      </template>
    </AfunBaseTable>
    <AfunBasePagination
      v-show="list.length > 0"
      class="h-[36px] mt-[2px]"
      :page="page"
      :page-size="page_size"
      :total="total"
      @previous="prev"
      @next="next"
    />
    <AfunBaseDialog v-if="selectedItem" v-model="showDetailDialog" :title="t('投注')" style="--afun-base-dialog-background-color: #1A2C38; --afun-base-dialog-icon-color: #B1BAD3">
      <AppDialogBetSlipCasino v-if="showDetailDialog" :casino-data="selectedItem.data" />
      <template #icon>
        <IconTabbarBet class="text-[#B1BAD3] mr-[8px]" />
      </template>
    </AfunBaseDialog>
  </div>
</template>
