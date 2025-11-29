<script setup lang='ts'>
import type { ICasinoBetRecordItem } from '@tg/types'
import { ApiMemberUserBetList } from '@tg/apis'
import { PhBaseAmount, PhBaseButton, PhBaseDialog, PhBaseEmpty, PhBaseImage, PhBasePagination, PhBaseTable } from '@tg/bccomponents'
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
    color: 'var(--tg-table-text-color)',
  },
  {
    title: t('投注金额'),
    width: 90,
    dataIndex: 'bet_amount',
    slot: 'bet_amount',
    align: 'center',
    color: 'var(--tg-table-amount-color)',
  },
  {
    title: t('支付额'),
    width: 90,
    dataIndex: 'net_amount',
    slot: 'net_amount',
    align: 'center',
    color: 'var(--tg-table-amount-color)',
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
  console.log(data, 'datdataa')

  const { game_code, platform_id, platform_name, game_name, game_class, game_type, id } = data
  const r = Math.random().toString(36).slice(-10)
  // 原创游戏
  if (game_class === EnumGlobalGameType.original)
    return router.push(`/original-game/${game_name.toLowerCase()}`)
  // 原创彩票
  if (platform_id === EnumOriginalLotteryVenue.originalLottery) {
    return router.push(application.getOriginalLotteryRouter(game_code))
  }

  let vid = +platform_id
  if (EnumCasinoPidToVid[+platform_id])
    vid = EnumCasinoPidToVid[+platform_id]

  router.push(`/games/${id || r}?name=${game_name}&pn=${platform_name}&vid=${vid}&game_id=${game_code}&game_class=${game_class}&pid=${platform_id}${game_type ? `&type=${game_type}` : ''}`)
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
    <PhBaseTable :loading="loading" :columns="columns" :data-source="list" style="--tg-table-odd-background: #F6F7F8; --tg-table-th-height: 48rem; --tg-table-th-font-weight: 500; " :skeleton-row="4">
      <template #game_name="{ record }">
        <div class="inline-block">
          <PhBaseButton size="none" type="none" class="flex gap-[8rem]" @click="openCasinoGame(record)">
            <PhBaseImage class="w-[14rem]" :url="record.icon" is-network with-theme />
            <span class="text-[14rem] font-[600] text-[#0D2245] capitalize">{{
              record.game_name }}</span>
          </PhBaseButton>
        </div>
      </template>
      <template #bill_no="{ record }">
        <PhBaseButton size="none" type="none" @click="showDetail(record)">
          <div class="bill_no">
            <IconTabbarBet style="font-size: 16rem;" />
            <span style="color: var(--tg-table-text-white-to-theme-color)">{{ record.bill_no }}</span>
          </div>
        </PhBaseButton>
      </template>
      <template #bet_amount="{ record }">
        <div class="flex justify-center" @click="showDetail(record)">
          <PhBaseAmount :amount="record.bet_amount" :currency-type="getCurrencyConfig(record.currency_id)?.name" :show-icon="true" style="--ph-app-amount-font-weight: 600" />
        </div>
      </template>
      <template #net_amount="{ record }">
        <div class="flex justify-center" :class="{ win: record.settle_amount > 0 }" @click="showDetail(record)">
          <PhBaseAmount :amount="record.settle_amount" :currency-type="getCurrencyConfig(record.currency_id)?.name" :show-icon="true" show-color style="--ph-app-amount-font-weight: 600" />
        </div>
      </template>
      <template #empty>
        <div class="mt-[10rem]" @click="router.push('/')">
          <PhBaseEmpty :description="t('投注单为空')">
            <template #icon>
              <PhBaseImage url="/ph-h5/png/uni-table-empty.png" />
            </template>
          </PhBaseEmpty>
          <div class="text-center text-[#0D2245] font-[600] mb-[31rem] mt-[2rem]">
            {{ t('立即开始游戏') }}
          </div>
        </div>
      </template>
    </PhBaseTable>
    <PhBasePagination
      v-show="list.length > 0"
      class="h-[36rem] mt-[2rem]"
      :page="page"
      :page-size="page_size"
      :total="total"
      @previous="prev"
      @next="next"
    />
    <PhBaseDialog v-if="selectedItem" v-model="showDetailDialog" :title="t('投注')" style="--ph-base-dialog-background-color: #F6F7F8; --ph-base-dialog-icon-color: #9DABC8">
      <AppDialogBetSlipCasino v-if="showDetailDialog" :casino-data="selectedItem.data" />
      <template #icon>
        <IconTabbarBet class="text-[#9DABC8] mr-[8rem]" />
      </template>
    </PhBaseDialog>
  </div>
</template>
