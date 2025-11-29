<script setup lang='ts'>
import type { ISportsMyBetSlipItem } from '@tg/types'
import { ApiSportBetList, ApiSportBetListByTime } from '@tg/apis'
import { PhBaseEmpty, PhBaseImage, PhBasePagination } from '@tg/bccomponents'
import { useList } from '@tg/hooks'
import { useCurrency } from '@tg/stores'
import { getCurrentMonthTimeRange, getCurrentWeekTimeRange, getTodayTimeRange } from '@tg/vue-i18n'
import { storeToRefs } from 'pinia'
import { computed, onBeforeMount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppSportBetRecordSkeleton from '~/components/AppSportBetRecordSkeleton.vue'
import AppSportsMyBetSlip from '~/components/AppSportsMyBetSlip.vue'

defineOptions({ name: 'CasinoBetRecord' })

const props = defineProps<Props>()

interface Props {
  period: string
  settle: number
}

const { t } = useI18n()
const router = useRouter()
const showDetail = ref(false)
const selectedItem = ref()
const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())

const {
  list: _list,
  runAsync: runGetSportBetList,
  loading,
  total,
  page,
  page_size,
  next,
  prev,
} = useList(props.period ? ApiSportBetListByTime : ApiSportBetList, {
  onBefore() {
    _list.value = []
  },
}, {
  page_size: 20,
})

const sportBetList = computed<ISportsMyBetSlipItem[]>(() => {
  if (_list.value.length === 0)
    return []

  return _list.value
})

/** 未结算total */
const totalUnsettled = computed(() => {
  if (_list.value.length === 0 || props.settle === 1)
    return 0

  return total.value
})

/** 开始时间 */
const startTime = computed(() => {
  console.log(props.period)
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

function fetch() {
  if (props.period) {
    return new Promise((resolve) => {
      runGetSportBetList({
        cur: currentGlobalCurrencyMap.value.cur,
        settle: props.settle.toString(),
        start_time: startTime.value,
        end_time: endTime.value,
      }).finally(() => {
        resolve(true)
      })
    })
  }
  return new Promise((resolve) => {
    runGetSportBetList({
      cur: currentGlobalCurrencyMap.value.cur,
      settle: props.settle.toString(),
      start_time: '',
      end_time: '',
    }).finally(() => {
      resolve(true)
    })
  })
}

onBeforeMount(() => {
  fetch()
})

watch(props, () => {
  fetch()
})
</script>

<template>
  <div>
    <template v-if="sportBetList.length">
      <AppSportsMyBetSlip v-for="item in sportBetList" :key="item.a" :data="item" class="mb-[10rem]" @show="selectedItem = item; showDetail = true" />
    </template>
    <div v-else-if="loading">
      <AppSportBetRecordSkeleton :num="2" />
    </div>
    <div v-else class="overflow-hidden mt-[28rem]">
      <PhBaseEmpty :description="t('投注单为空')">
        <template #icon>
          <PhBaseImage url="/ph-h5/png/uni-table-empty.png" />
        </template>
      </PhBaseEmpty>
      <div class="text-center text-[#0D2245] font-[600] mb-[31rem] mt-[2rem]" @click="router.push('/sports')">
        {{ t('立即开始游戏') }}
      </div>
    </div>

    <PhBasePagination
      v-show="sportBetList.length > 0"
      class="mt-[18rem] mb-[8rem]"
      :page="page"
      :page-size="page_size"
      :total="total"
      @previous="prev"
      @next="next"
    />
  </div>
</template>
