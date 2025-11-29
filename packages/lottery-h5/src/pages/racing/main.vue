<script lang="ts" setup>
import type { LotteryWinLoseSettleData } from '@tg/types'
import { ApiCpNav, ApiCpOdds, ApiCpTrend, ApiGameOriginalBetLimit } from '@tg/apis'
import { LotteryColorfulBalls, LotteryCountDown, LotteryCountDownMask, LotteryDialog, LotteryKindTabs, LotteryLoading, LotteryPopup, LotteryTableTabs, LotteryTicket } from '@tg/bccomponents'
import { IconLotTicket } from '@tg/icons'
import { useCurrency } from '@tg/stores'
import { EventBusNames } from '@tg/types'
import { appEventBus } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, defineAsyncComponent, nextTick, onActivated, onBeforeUnmount, onDeactivated, onMounted, provide, ref, watch } from 'vue'
import { useRequest } from 'vue-request'
import AppUserBalance from '../../components/AppUserBalance.vue'
import AppWinLoseSettle from '../../components/AppWinLoseSettle.vue'
import { useLocale, useProjectName } from '../../components/LotteryConfigProvider'
import { useRaceStore } from '../../stores/useRaceStore'
import { racingOddMap } from '../../utils/lotteryMaps'
import { calcTime, isLogin as getToken } from '../../utils/tool'
import AppRacingBet from './_components/AppRacingBet.vue'
import AppRaceCarAnimate from './_components/AppRacingCarAnimate.vue'
import AppRacingRules from './_components/AppRacingRules.vue'

const { $$t } = useLocale()
const raceStore = useRaceStore()
const currencyStore = useCurrency()
const isLogin = ref(getToken())
const { currentGlobalCurrencyMap } = storeToRefs(currencyStore)
const projectName = useProjectName()

const tab = [
  { label: $$t('第一名'), value: 1 },
  { label: $$t('第二名'), value: 2 },
  { label: $$t('第三名'), value: 3 },
]
const cpKinds = [
  { label: $$t('大'), color: 'big', value: 'Big' },
  { label: $$t('小'), color: 'small', value: 'Small' },
  { label: $$t('单'), color: 'odd', value: 'Odd' },
  { label: $$t('双'), color: 'even', value: 'Even' },
]
const tableTabs = [
  { label: $$t('游戏记录'), value: 1 },
  { label: $$t('我的记录'), value: 2 },
]
const compMap = new Map([
  [1, defineAsyncComponent(() => import('./_components/AppRacingGameHistory.vue'))],
  [2, defineAsyncComponent(() => import('./_components/AppRacingMyHistory.vue'))],
])
let timer: NodeJS.Timeout | null
const chooseSet = ref<Set<number>>(new Set())
const currentTab = ref()
const tabArr = ref()
const currentNum = ref(1)
const currentTableTab = ref(1)
const carAnimateRef = ref<InstanceType<typeof AppRaceCarAnimate> | null>(null)
const endTime = ref(0)
const randomId = ref(1)
const time = ref(0)
const curComponentRef = ref<any>(null)
const isShowMask = ref(false)
const isShowPop = ref(false)
const isShowRules = ref(false)
const isShowWinLose = ref(false)
const winLoseData = ref<LotteryWinLoseSettleData>({
  flag: 'Win',
  lottery_name: '',
  issue_id: '',
  settle_amount: '',
  balls: '',
  currency_id: '701',
})

provide('currentTab', currentTab)

const curComponent = computed(() => compMap.get(currentTableTab.value))
const ballsResult = computed(() => winLoseData.value.balls.split(',').slice(0, 3).map(item => Number(item)))
const { runAsync: runAsyncCpOdds, data: mainData } = useRequest(() => ApiCpOdds({ lottery_id: currentTab.value }), {
  onSuccess: (res) => {
    const issue = res?.issue
    if (issue) {
      const t = calcTime(issue.end_time)
      randomId.value = Date.now()
      time.value = t
      endTime.value = t > 5 ? 0 : t
    }
  },
})

const { runAsync: runAsyncCpNav } = useRequest(() => ApiCpNav({ lottery_id: 2001 }))
const { runAsync: runAsyncCpTrend, data: trendData } = useRequest(() => ApiCpTrend({ lottery_id: currentTab.value, page: 1 }))
const currencyCode = computed(() => currentGlobalCurrencyMap.value.cur)
/** 获取投注限额 */
const { data: betLimitData, runAsync: runGetOriginalGameBetLimit } = useRequest(() => ApiGameOriginalBetLimit(currencyCode.value), {
  manual: true,
  refreshDeps: currencyCode,
})

const odds = computed(() => {
  if (!mainData.value)
    return []
  return mainData.value?.odds.reduce((pre: { [key: number]: string }, cur) => {
    pre[cur.play_id] = cur.odds
    return pre
  }, {})
})
const lastRes = computed(() => trendData.value?.d?.list?.[0].result.split(',').map(item => Number(item)) || [])
const curPeriod = computed(() => mainData.value?.issue.id || '0')
const curRacingOddMap = computed(() => racingOddMap[currentNum.value])
async function changeTab(value: number) {
  currentTab.value = value
  isShowMask.value = false
  runAsyncCpOdds()
  if (curComponentRef.value)
    curComponentRef.value.refresh()
  await runAsyncCpTrend()
  if (carAnimateRef.value) {
    carAnimateRef.value?.resetAll()
    carAnimateRef.value.setResult(lastRes.value)
  }
}
function changeNum(value: number) {
  if (value === currentNum.value)
    return

  if (chooseSet.value.size > 0 && isShowPop.value) {
    chooseSet.value.clear()
  }
  currentNum.value = value
}
async function onTimeEnd(value: number) {
  if (isShowPop.value) {
    isShowPop.value = false
  }
  if (chooseSet.value.size > 0) {
    chooseSet.value.clear()
  }
  endTime.value = value
}

function chooseHandle(value: number) {
  if (!isShowPop.value)
    isShowPop.value = true
  if (chooseSet.value.has(value)) {
    chooseSet.value.delete(value)
    if (chooseSet.value.size === 0) {
      isShowPop.value = false
    }
  }
  else {
    chooseSet.value.add(value)
  }
}
function onClose() {
  isShowPop.value = false
  chooseSet.value.clear()
}

async function init() {
  if (isLogin.value) {
    await currencyStore.initCurrencyList().finally(() => {
      runGetOriginalGameBetLimit()
    })
  }
  const res = await runAsyncCpNav()
  const nav = res.map((item) => {
    return {
      label: item.lottery_name,
      value: item.lottery_id,
    }
  })
  tabArr.value = nav
  currentTab.value = tabArr.value[0].value
  raceStore.setRaceTabArr(nav)
  await runAsyncCpOdds()
  runAsyncCpTrend()
}
async function reset() {
  carAnimateRef.value?.resetAll()
  runAsyncCpOdds()
  curComponentRef.value?.refresh()
  await runAsyncCpTrend()
  nextTick(() => {
    carAnimateRef.value?.setResult(lastRes.value)
  })
}
async function dealMqtt(value: any) {
  const { payload, topic } = value.message.parsed
  if (payload.startsWith('start') && topic.endsWith(currentTab.value)) {
    isShowMask.value = false
    runAsyncCpOdds()
  }
  if (payload.startsWith('end') && topic.endsWith(currentTab.value)) {
    isShowMask.value = true
  }
  if (payload.startsWith('settle') && topic.endsWith(currentTab.value)) {
    curComponentRef.value?.refresh()
    await runAsyncCpTrend()
    carAnimateRef.value?.setResult(lastRes.value)
    carAnimateRef.value?.start()
  }
}
function onBetSuccess() {
  if (currentTableTab.value === 2) {
    curComponentRef.value?.refresh()
  }
}
function dealWinLose(values: any) {
  if (Number(values.type) !== 2)
    return
  if (isShowWinLose.value)
    return
  winLoseData.value = values
  timer = setTimeout(() => {
    isShowWinLose.value = true
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }, 9000)
}
appEventBus.on(EventBusNames.LOTTERY_RACE, (msg) => {
  dealMqtt(msg)
})
appEventBus.on(EventBusNames.LOTTERY_SETTLE_DIALOG, (msg) => {
  dealWinLose(msg)
})
appEventBus.on(EventBusNames.APP_GLOBAL_VISIBILITY, () => {
  reset()
})

watch(() => currentGlobalCurrencyMap.value.cur, () => {
  runGetOriginalGameBetLimit()
})
watch(isLogin, (newIsLogin) => {
  if (newIsLogin && currencyCode.value) {
    runGetOriginalGameBetLimit()
  }
}, { immediate: true })
onDeactivated(() => {
  reset()
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
})
onActivated(() => {
  reset()
  if (isLogin.value && currencyCode.value) {
    runGetOriginalGameBetLimit()
  }
})
onBeforeUnmount(() => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
})

onMounted(() => {
  nextTick(() => {
    carAnimateRef.value?.setResult(lastRes.value)
  })
})
await init()
</script>

<template>
  <div class="racing">
    <div class="px-[13rem] pt-[16rem] grid gap-[16rem] pb-[16rem]">
      <AppUserBalance :project="projectName" />
      <LotteryKindTabs v-model="currentTab" :tabs="tabArr" :project="projectName" @change="changeTab" />
      <LotteryTicket bg-img="/lottery/png/variable-race-ticket.png" height="70rem">
        <div class="flex ">
          <div class="w-1/2 pl-[15rem] pt-[12.5rem] text-[12rem] main-text-color font-[500]">
            <div class="flex mb-[7.5rem] items-center">
              <span class="mr-[4rem] font-[600]"> {{ $$t('期号') }}</span><span class="border-[1rem] main-border-color rounded-[30rem] leading-[17rem] center px-[6rem] main-text-color" @click="isShowRules = true"><IconLotTicket class="text-[18rem]" />{{ $$t('玩法说明') }}</span>
            </div>
            <div class="leading-[19rem] text-[15rem] font-[700]">
              {{ curPeriod }}
            </div>
          </div>
          <div class="w-1/2 flex justify-end pr-[14rem] pt-[10rem]">
            <div>
              <div class="font-[600] text-[12rem] main-text-color mb-[3rem] text-right">
                {{ $$t('倒计时') }}
              </div>
              <div>
                <LotteryCountDown :key="randomId" :time="time" class="custom-countdown" type="racing" @on-time="onTimeEnd" />
              </div>
            </div>
          </div>
        </div>
      </LotteryTicket>
    </div>
    <div class="px-[5rem] pb-[16rem]">
      <AppRaceCarAnimate ref="carAnimateRef" :end-time="endTime" :cur-period="curPeriod" />
    </div>
    <div class="px-[13rem]">
      <div class="racing-main-bg rounded-[8rem] p-[13rem] relative">
        <div class="flex justify-around mb-[7rem]">
          <div v-for="item in tab" :key="item.value" class="w-[98rem] text-center main-text-color1 leading-[30rem] rounded-[15rem]" :class="[currentNum === item.value ? 'racing-active' : '']" @click="changeNum(item.value)">
            {{ item.label }}
          </div>
        </div>
        <div class="grid mb-[16rem] grid-cols-5 gap-x-[4rem] gap-y-[4rem] main-text-color2 text-[12rem] racing-main-bg1 rounded-[10rem] py-[3rem] px-[10rem]">
          <div v-for="_, index of 10" :key="index" class="flex flex-col items-center cursor-pointer" :class="{ 'race-ball-active': chooseSet.has(index + 1) }" @click="chooseHandle(index + 1)">
            <LotteryColorfulBalls :number="index + 1" class="w-[44rem] h-[46rem]" type="race" />
            <div>{{ odds?.[curRacingOddMap.Ball] }}X</div>
          </div>
        </div>
        <div class="grid grid-cols-4 gap-x-[9rem] text-white font-[500]">
          <div v-for="item in cpKinds" :key="item.value" class="h-[29rem] w-[72rem] center text-[10rem]" :class="[{ 'race-rect-active': chooseSet.has(curRacingOddMap[item.value]) }, item.color]" @click="chooseHandle(curRacingOddMap[item.value])">
            <span class="mr-[15rem]">{{ item.label }}</span>
            <span>{{ odds?.[curRacingOddMap[item.value]] }}X</span>
          </div>
        </div>
        <LotteryCountDownMask v-if="endTime > 0 || isShowMask" :time="endTime" />
      </div>
      <div class="my-[16rem]">
        <LotteryTableTabs v-model="currentTableTab" :tabs="tableTabs" :tab-size="['165rem', '36rem']" />
      </div>
      <Suspense timeout="0">
        <component :is="curComponent" ref="curComponentRef" />
        <template #fallback>
          <div class="flex items-center justify-center min-h-[200rem]">
            <LotteryLoading />
          </div>
        </template>
      </Suspense>
    </div>
    <LotteryDialog v-model="isShowRules" :title="$$t('玩法说明')" :max-size="[264, 371]" :close-text="$$t('关闭')" :project="projectName">
      <AppRacingRules />
    </LotteryDialog>
    <LotteryPopup v-model="isShowPop">
      <AppRacingBet
        v-if="isShowPop" :level="currentNum" :period="curPeriod" :choose="chooseSet" :odds="odds"
        :bet-limit-data="betLimitData ?? ['0', '10']" :project="projectName" @close="onClose"
        @success="onBetSuccess"
      />
    </LotteryPopup>
    <LotteryDialog v-model="isShowWinLose" :show-header="false" style="--lot-dialog-container-bg: transparent" :mask-close="false">
      <AppWinLoseSettle v-if="isShowWinLose" :type="winLoseData.flag" :amount="winLoseData.settle_amount" :period="winLoseData.issue_id" :name="winLoseData.lottery_name" :currency-id="winLoseData.currency_id" @close="isShowWinLose = false">
        <div>
          <h1 class="text-[11rem] font-[500] text-white text-center">
            {{ $$t('彩票结果') }}
          </h1>
          <div class="text-[12rem] grid grid-cols-3 gap-x-[10rem] font-[500]">
            <div v-for="item, index in ballsResult" :key="index">
              <div class="text-center mb-[4rem] bg-[#FD4D52] rounded-[7rem] leading-[24rem] text-white px-[8rem]">
                {{ tab.find(item => item.value === index + 1)?.label }}
              </div>
              <div class="center">
                <LotteryColorfulBalls type="race" :number="item" class="w-[32rem] h-[26rem]" />
              </div>
            </div>
          </div>
        </div>
      </AppWinLoseSettle>
    </LotteryDialog>
  </div>
</template>

<style scoped lang="scss">
</style>
