<script setup lang="ts">
import type { LotteryWinLoseSettleData } from '@tg/types'
import type { ProjectType } from 'src/hooks/useCurrencyComponentConfig'
import type { Component } from 'vue'
import { ApiCpNav, ApiCpOdds, ApiCpTrend, ApiGameOriginalBetLimit } from '@tg/apis'
import { LotteryButton, LotteryColorfulBalls, LotteryCountDown, LotteryCountDownMask, LotteryDialog, LotteryKindTabs, LotteryLoading, LotteryPopup, LotteryTableTabs, LotteryTicket } from '@tg/bccomponents'
import { IconLotteryAfunSearch, IconLotteryPhSearch, IconLotTicket } from '@tg/icons'
import { useCurrency } from '@tg/stores'
import { EventBusNames } from '@tg/types'
import {
  appEventBus,
} from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, defineAsyncComponent, onActivated, provide, ref, watch } from 'vue'
import { useRequest } from 'vue-request'
import AppUserBalance from '../../components/AppUserBalance.vue'
import AppWinLoseSettle from '../../components/AppWinLoseSettle.vue'
import { useLocale, useProjectName } from '../../components/LotteryConfigProvider'
import { useTrxWinGoStore } from '../../stores/useTrxWinGoStore'
import { colorHelp, multiplyArr, trxWinGoKindId } from '../../utils/lotteryMaps'
import { calcTime, isLogin as getLogin } from '../../utils/tool'
import AppTrxIframe from './_components/AppTrxIframe.vue'
import AppTrxWinGoBet from './_components/AppTrxWinGoBet.vue'
import AppTrxWinGoBigBalls from './_components/AppTrxWinGoBigBalls.vue'
import AppTrxWinGoGameRules from './_components/AppTrxWinGoGameRules.vue'

defineOptions({
  name: 'AppTrxWinGoMain',
})
const { $$t } = useLocale()
const projectName = useProjectName()
const isLogin = ref(getLogin())
const SEARCH_ICON_CONFIG: Record<string, {
  component: Component
  textClass: string
}> = {
  'afun-h5': {
    component: IconLotteryAfunSearch,
    textClass: 'text-black',
  },
  'ph-h5': {
    component: IconLotteryPhSearch,
    textClass: 'text-white',
  },
}
const searchIconConfig = computed(() => SEARCH_ICON_CONFIG[projectName] || SEARCH_ICON_CONFIG['ph-h5'])
const SearchIcon = computed(() => searchIconConfig.value.component)

const currencyStore = useCurrency()
const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())
/** 获取投注限额 */
const currencyCode = computed(() => currentGlobalCurrencyMap.value.cur)
const { data: betLimitData, run: runBetLimit } = useRequest(() => ApiGameOriginalBetLimit(currencyCode.value), {
  manual: true,
  refreshDeps: currencyCode,
})
const betLimitMin = computed(() => betLimitData.value ? Number(betLimitData.value[0]) : 0)
const betLimitMax = computed(() => betLimitData.value ? Number(betLimitData.value[1]) : 0)
const trxWinGoStore = useTrxWinGoStore()

type AsyncComp = ReturnType<typeof defineAsyncComponent>
const compMap: Map<number, AsyncComp> = new Map<number, AsyncComp>([
  [1, defineAsyncComponent(() => import('./_components/AppTrxWinGoGameHistory.vue'))],
  [2, defineAsyncComponent(() => import('./_components/AppTrxWinGoGameChart.vue'))],
  [3, defineAsyncComponent(() => import('./_components/AppTrxWinGoMyHistory.vue'))],
])

const btnArr = [{
  label: $$t('游戏记录'),
  value: 1,
}, {
  label: $$t('走势图'),
  value: 2,
}, {
  label: $$t('我的记录'),
  value: 3,
}]

const lotteryHash = ref<string>('')

const tabArr = ref<any[]>([])
// tab
const currentTab = ref(5002)
const time = ref(0)
const randomId = ref<number>(1)
const currentMultiply = ref(1)
const currentBtn = ref(1)
const isModal = ref(false)
const isPop = ref(false)
const clickTarget = ref({ color: '', text: '' })
const animatingIndexes = ref<number[]>([])
const isShowMask = ref(false)
const timeMask = ref(0)
const betPlayId = ref<number>()
const betOdd = ref<string>('')
const curComponentRef = ref<any>(null)
const isShowIframe = ref(false)
const iframeUrl = ref('https://tronscan.org')
const isShowWinLose = ref(false)
const winLoseData = ref<LotteryWinLoseSettleData>({
  flag: 'Win',
  lottery_name: '',
  issue_id: '',
  settle_amount: '',
  balls: '',
  currency_id: '701',
})

let animationTimer: NodeJS.Timeout | null = null
let clearAllTimer: NodeJS.Timeout | null = null
const { runAsync: runAsyncCpOdds, data } = useRequest(() => ApiCpOdds({ lottery_id: currentTab.value }), {
  onSuccess: (res) => {
    const issue = res?.issue
    if (issue) {
      const t = calcTime(issue.end_time)
      randomId.value = Date.now()
      time.value = t
      timeMask.value = t > 5 ? 0 : t
    }
  },
})
const { runAsync: runAsyncCpNav } = useRequest(() => ApiCpNav({ lottery_id: 5002 }))

const { runAsync: runAsyncLotteryRes } = useRequest(() => ApiCpTrend({ lottery_id: currentTab.value, page: 1 }), {
})

provide('currentTab', currentTab)

const odds = computed<{ [key: number]: string }>(() => {
  let obj = {}
  if (data.value) {
    obj = data.value.odds.reduce((pre, item) => {
      pre[item.play_id] = item.odds
      return pre
    }, {} as { [key: number]: string })
  }
  return obj
})

const curPeriod = computed(() => data.value?.issue.id || '0')
const curComponent = computed(() => compMap.get(currentBtn.value))
const highLightIndex = computed(() => {
  for (let i = lotteryHash.value.length - 1; i >= 0; i--) {
    if (!Number.isNaN(Number(lotteryHash.value[i]))) {
      return i
    }
  }
  return -1
})

async function getLotteryRes() {
  return runAsyncLotteryRes().then((res) => {
    const list = res?.d?.list[0] || []
    lotteryHash.value = list.hash_value.slice(-5).toUpperCase()
  })
}

function changeMultiply(value: number) {
  if (currentMultiply.value === value)
    return
  currentMultiply.value = value
}
// 三种类型，1 颜色 ， 2 小球 ， 3 大小
function openBet(kind: 1 | 2 | 3, text: string, targetOdd: string) {
  const color = getClickColor(kind, text)
  betPlayId.value = kind === 2 ? trxWinGoKindId.Balls : trxWinGoKindId[text]
  betOdd.value = targetOdd
  clickTarget.value.color = color
  clickTarget.value.text = text
  isPop.value = true
}
function getClickColor(type: 1 | 2 | 3, value: string) {
  if (type === 2 && value !== '0' && value !== '5') {
    return Number(value) % 2 === 0 ? 'red' : 'green'
  }
  return colorHelp[type][value] || ''
}
function randomOpenBet() {
  startRandomAnimation().then(() => {
    openBet(2, String(Math.floor(Math.random() * 10)), odds.value[trxWinGoKindId.Balls])
  })
}
function timeToShowMask(val: number) {
  if (isPop.value) {
    isPop.value = false
  }
  timeMask.value = val
}

function startRandomAnimation(): Promise<void> {
  return new Promise((resolve) => {
    if (animationTimer)
      clearInterval(animationTimer)
    if (clearAllTimer)
      clearTimeout(clearAllTimer)

    animationTimer = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * 10)

      if (!animatingIndexes.value.includes(randomIndex)) {
        animatingIndexes.value.push(randomIndex)

        setTimeout(() => {
          animatingIndexes.value = animatingIndexes.value.filter(i => i !== randomIndex)
        }, 300)
      }
    }, 150)

    clearAllTimer = setTimeout(() => {
      if (animationTimer)
        clearInterval(animationTimer)
      animatingIndexes.value = []
      resolve()
    }, 2000)
  })
}
function onBetSuccess() {
  isPop.value = false
  if (curComponentRef.value && currentBtn.value === 3) {
    curComponentRef.value.refresh()
  }
}
function onBetClose() {
  isPop.value = false
  currentMultiply.value = 1
}
function openIFrame(type: 'search' | 'push', target?: string) {
  iframeUrl.value = type === 'search' ? 'https://tronscan.org' : `https://tronscan.org/#/block/${target}`
  isShowIframe.value = true
}

async function init() {
  if (isLogin.value) {
    await currencyStore.initCurrencyList()
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
  trxWinGoStore.setTrxWinGoTabArr(nav)

  await runAsyncCpOdds()
  getLotteryRes()
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
    // 调用game history接口拿结果数据
    if (curComponentRef.value) {
      curComponentRef.value.refresh()
    }
    await getLotteryRes()
  }
}
function dealWinLose(values: any) {
  console.log('🚀 ~ dealWinLose ~ values:', values)
  if (Number(values.type) !== 5)
    return
  if (isShowWinLose.value)
    return
  winLoseData.value = values
  isShowWinLose.value = true
}
function settleClassName(value: string) {
  // 1算奇偶，2算大小
  const numVal = Number(value)
  if (numVal === 0)
    return 'zero'
  if (numVal === 5)
    return 'five'
  return numVal % 2 === 0 ? 'red' : 'green'
}
function settleColorName(value: string) {
  const numVal = Number(value)
  if (numVal === 0)
    return `${$$t('红色')}|${$$t('紫色')}`
  if (numVal === 5)
    return `${$$t('绿色')}|${$$t('紫色')}`
  return numVal % 2 === 0 ? $$t('红色') : $$t('绿色')
}
function reloadTrxWinGo() {
  runAsyncCpOdds()
  if (curComponentRef.value)
    curComponentRef.value.refresh()
  getLotteryRes()
}
watch(isLogin, (newIsLogin) => {
  if (newIsLogin && currencyCode.value) {
    runBetLimit()
  }
}, { immediate: true })

onActivated(() => {
  reloadTrxWinGo()
  isLogin.value = getLogin()
  if (isLogin.value && currencyCode.value) {
    runBetLimit()
  }
})
appEventBus.on(EventBusNames.TRX_WIN_GO, (msg) => {
  dealMqtt(msg)
})
appEventBus.on(EventBusNames.LOTTERY_SETTLE_DIALOG, (msg) => {
  dealWinLose(msg)
})

appEventBus.on(EventBusNames.APP_GLOBAL_VISIBILITY, () => {
  reloadTrxWinGo()
})

await init()
</script>

<template>
  <div class="px-[13rem] pt-[16rem] grid gap-[16rem] pb-[58rem]">
    <AppUserBalance :project="projectName as ProjectType" />
    <LotteryKindTabs v-model="currentTab" :tabs="tabArr" :col="1" :project="projectName" />
    <LotteryTicket bg-img="/lottery/png/variable-trx-win-go-ticket.png" class="p-[10rem] pb-0" height="187rem">
      <div class="w-full h-1/2 main-text-color">
        <div class="w-full flex">
          <div class="main-border-color border-[1rem] leading-[25rem] h-[25rem] rounded-[5rem] min-w-[56rem] text-center text-[12rem] font-[400] mr-[10rem]">
            {{ $$t('期号') }}
          </div>
          <div class="main-border-color2 border-[1rem] py-[4rem] text-[18rem] rounded-[30rem] center min-w-[105rem] h-[23rem]" @click="isModal = true">
            <IconLotTicket /><span class="ml-[2rem]  text-[12rem]">{{ $$t('玩法说明') }}</span>
          </div>
          <div class="main-border-color2 border-[1rem] ml-auto mb-[auto] py-[4rem] px-[3rem] text-[18rem] rounded-[30rem] center h-[23rem]" @click="openIFrame('search')">
            <component :is="SearchIcon" class="text-[18rem]" :class="searchIconConfig.textClass" />
            <span class="ml-[2rem] text-[12rem] pr-[6rem]">{{ $$t('公链查询') }}</span>
          </div>
        </div>
        <div class="font-[400] text-[14rem] flex items-center justify-between w-full">
          <span>{{ curPeriod }}</span>
          <div class="flex items-center">
            <span class="mr-[8rem]">{{ $$t('开奖时间') }}</span>
            <LotteryCountDown
              :key="randomId" class="my-[8rem] justify-end custom-countdown" :time="time"
              type="trx-win-go"
              @on-time="timeToShowMask"
            />
          </div>
        </div>
      </div>
      <div class="h-1/2 flex items-center justify-between">
        <template v-for="value, index in lotteryHash" :key="index">
          <AppTrxWinGoBigBalls :value="value" :is-yellow="highLightIndex === index" class="size-[55rem]" />
        </template>
      </div>
    </LotteryTicket>
    <div class="bet-area p-[8rem] grid gap-y-[13rem] rounded-[8rem] relative">
      <div class="flex justify-around text-white font-[500]">
        <div class="bet-green w-[100rem] h-[35rem] px-[10rem] rounded-tr-[10rem] cursor-pointer rounded-bl-[10rem] flex items-center" @click="openBet(1, 'Green', odds?.[trxWinGoKindId.Green])">
          <span class="mr-auto">{{ $$t('绿色') }}</span><span>{{ odds?.[trxWinGoKindId.Green] }}X</span>
        </div>
        <div class="bet-purple w-[100rem] flex items-center px-[10rem] h-[35rem] cursor-pointer rounded-[10rem]" @click="openBet(1, 'Purple', odds?.[trxWinGoKindId.Purple])">
          <span class="mr-auto">{{ $$t('紫色') }}</span><span>{{ odds?.[trxWinGoKindId.Purple] }}X</span>
        </div>
        <div class="bet-red w-[100rem] px-[10rem] flex items-center h-[35rem] cursor-pointer rounded-tl-[10rem] rounded-br-[10rem]" @click="openBet(1, 'Red', odds?.[trxWinGoKindId.Red])">
          <span class="mr-auto">{{ $$t('红色') }}</span><span>{{ odds?.[trxWinGoKindId.Red] }}X</span>
        </div>
      </div>
      <div class="bet-grid grid grid-cols-5 gap-x-[18rem] gap-y-[8.5rem] text-[12px] rounded-[10rem] py-[14rem] px-[10rem]">
        <div v-for="_, index of 10" :key="index" class="flex flex-col items-center cursor-pointer" @click="openBet(2, String(index), odds?.[trxWinGoKindId.Balls])">
          <LotteryColorfulBalls
            :number="index" class="size-[44rem]" :class="[
              animatingIndexes.includes(index) ? 'animate-balls-scale' : '',
            ]"
          />
          <div>{{ odds?.[trxWinGoKindId.Balls] }}X</div>
        </div>
      </div>
      <div class="flex ">
        <LotteryButton class="random-btn mr-[5rem] w-[80rem] h-[30rem]" @click="randomOpenBet">
          {{ $$t('随机') }}
        </LotteryButton>
        <div
          v-for="item of multiplyArr" :key="item"
          class="multiply-btn min-w-[37rem] shrink-0 h-[30rem] mr-[5rem] last:mr-0 rounded-[8rem] cursor-pointer center text-[12rem] font-[500]"
          :class="{ 'multiply-btn-active': currentMultiply === item }"
          @click="changeMultiply(item)"
        >
          X{{ item }}
        </div>
      </div>
      <div class="process px-[12rem] h-[36rem] flex text-white text-[16rem]">
        <div class="w-1/2 bg-[#FFA82E] rounded-l-[20rem] flex items-center px-[10rem]" @click="openBet(3, 'Big', odds?.[trxWinGoKindId.Big])">
          <span class="mr-auto">{{ $$t('大') }}</span>
          <span>{{ odds?.[trxWinGoKindId.Big] }}X</span>
        </div>
        <div class="w-1/2 bg-[#6DA7F4] rounded-r-[20rem] flex items-center px-[10rem]" @click="openBet(3, 'Small', odds?.[trxWinGoKindId.Small])">
          <span class="mr-auto">{{ $$t('小') }}</span>
          <span>{{ odds?.[trxWinGoKindId.Small] }}X</span>
        </div>
      </div>
      <LotteryCountDownMask v-if="timeMask > 0 || isShowMask" :time="timeMask" />
    </div>

    <LotteryTableTabs v-model="currentBtn" :tabs="btnArr" />
    <Suspense timeout="0">
      <component :is="curComponent" ref="curComponentRef" @open="(val:string) => openIFrame('push', val)" />
      <template #fallback>
        <div class="flex items-center justify-center min-h-[200rem]">
          <LotteryLoading />
        </div>
      </template>
    </Suspense>
    <LotteryDialog v-model="isModal" :title="$$t('玩法说明')" :max-size="[264, 371]" :close-text="$$t('关闭')" :project="projectName">
      <AppTrxWinGoGameRules />
    </LotteryDialog>
    <LotteryPopup v-model="isPop" :has-wrapper="true">
      <AppTrxWinGoBet v-if="isPop" v-model:current-multiply="currentMultiply" :min="betLimitMin" :max="betLimitMax" :period="curPeriod" :bet-odd="betOdd" :bet-play-id="(betPlayId as number)" :cur-period="curPeriod" :target="clickTarget" :current-tab="currentTab" :project="projectName as ProjectType" @close="onBetClose" @success="onBetSuccess" />
    </LotteryPopup>
    <AppTrxIframe v-show="isShowIframe" :url="iframeUrl" @close="isShowIframe = false" />
    <LotteryDialog v-model="isShowWinLose" :show-header="false" style="--lot-dialog-container-bg: transparent" :mask-close="false" :project="projectName">
      <AppWinLoseSettle v-if="isShowWinLose" :type="winLoseData.flag" :amount="winLoseData.settle_amount" :period="winLoseData.issue_id" :name="winLoseData.lottery_name" :currency-id="winLoseData.currency_id" @close="isShowWinLose = false">
        <div class="text-[11rem] flex font-[500]">
          <div class="mr-[5rem] text-white leading-[22rem]">
            {{ $$t('彩票结果') }}
          </div>
          <div :class="settleClassName(winLoseData.balls)" class="px-[12rem] leading-[22rem] mr-[5rem] rounded-[5rem]">
            {{ settleColorName(winLoseData.balls) }}
          </div>
          <div class="mr-[5rem] size-[22rem] leading-[22rem] text-center rounded-[100rem]" :class="settleClassName(winLoseData.balls)">
            {{ winLoseData.balls }}
          </div>
          <div :class="settleClassName(winLoseData.balls)" class="px-[12rem] leading-[22rem] rounded-[5rem]">
            {{ Number(winLoseData.balls) > 4 ? $$t('大') : $$t('小') }}
          </div>
        </div>
      </AppWinLoseSettle>
    </LotteryDialog>
  </div>
</template>
