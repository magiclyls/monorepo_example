<script setup lang='ts'>
import type { ProjectType } from '../../hooks/useCurrencyComponentConfig'
import { ApiCpNav, ApiCpOdds, ApiCpTrend5D, ApiGameOriginalBetLimit } from '@tg/apis'
import { LotteryCountDown, LotteryCountDownMask, LotteryDialog, LotteryKindTabs, LotteryLoading, LotteryPopup, LotteryTableTabs } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { IconLotTicket } from '@tg/icons'
import { useCurrency } from '@tg/stores'
import { EventBusNames } from '@tg/types'
import { appEventBus, application } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, defineAsyncComponent, nextTick, onActivated, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRequest } from 'vue-request'
import AppUserBalance from '../../components/AppUserBalance.vue'
import { useLocale, useProjectName } from '../../components/LotteryConfigProvider'
import { use5DStore } from '../../stores/use5DStore'
import { calcTime, isLogin as getToken } from '../../utils/tool'
import AppFiveDBetPanel from './_components/AppFiveDBetPanel.vue'
import AppFiveDBetPopup from './_components/AppFiveDBetPopup.vue'
import AppFiveDGameRules from './_components/AppFiveDGameRules.vue'
import AppFiveDResult from './_components/AppFiveDResult.vue'
import AppFiveDResultSlot from './_components/AppFiveDResultSlot.vue'
import AppFiveDSettleDialog from './_components/AppFiveDSettleDialog.vue'

defineOptions({ name: 'App5DMain' })

const { $$t } = useLocale()
const token = getToken()
const { bool: isPop } = useBoolean(false)
const { bool: isModal } = useBoolean(false)
const { bool: isShowMask } = useBoolean(false)
const { bool: isShowSettleDialog } = useBoolean(false)
const { bool: isFirst, setFalse: isFirstFalse } = useBoolean(true)
const fiveDStore = use5DStore()
const currencyStore = useCurrency()
const { currentGlobalCurrencyMap } = storeToRefs(currencyStore)
const isLogin = ref(getToken())

type AsyncComp = ReturnType<typeof defineAsyncComponent>
const projectName = useProjectName()
const compMap: Map<number, AsyncComp> = new Map<number, AsyncComp>([
  [1, defineAsyncComponent(() => import('./_components/AppFiveDGameHistory.vue'))],
  [2, defineAsyncComponent(() => import('./_components/AppFiveDGameChart.vue'))],
  [3, defineAsyncComponent(() => import('./_components/AppFiveDMyHistory.vue'))],
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
const time = ref(0)
const randomId = ref<number>(1)
const currentTab = ref(0)
const curComponentRef = ref<any>()
const isShowAnimal = ref(false)
const timeMask = ref(0)
const settleDialogProps = ref()
// 表格
const currentBtn = ref(1)

// D530s  = 4001
// D560s  = 4002
// D5180s = 4003
// D5300s = 4004
// D5600s = 4005

const { runAsync: runAsyncCpNav, data: cpNavData } = useRequest(() => ApiCpNav({ lottery_id: 4001 }), {
  onSuccess(res) {
    currentTab.value = res[0].lottery_id
  },
})
const { runAsync: runAsyncCpOdds, data: cpOddsData } = useRequest(() => ApiCpOdds({ lottery_id: currentTab.value }), {
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
const { runAsync: runAsyncCpTrend, data: cpTrendData } = useRequest(() =>
  ApiCpTrend5D({ lottery_id: currentTab.value, page: 1 }),
)

/** 获取投注限额 */
const currencyCode = computed(() => currentGlobalCurrencyMap.value.cur)
const { data: betLimitData, runAsync: runGetOriginalGameBetLimit } = useRequest(() => ApiGameOriginalBetLimit(currencyCode.value), {
  manual: true,
  refreshDeps: currencyCode,
})

// 彩种
const tabArr = computed(() => {
  if (cpNavData.value) {
    return cpNavData.value.map((a) => {
      return {
        label: a.lottery_name,
        value: a.lottery_id,
      }
    })
  }
  return []
})
// 赔率数据
const oddsData = computed(() => {
  if (cpOddsData.value) {
    return cpOddsData.value.odds
  }
  return []
})
// 期号
const issueId = computed(() => {
  if (cpOddsData.value) {
    return cpOddsData.value.issue.id
  }
  return ''
})
// 投注记录
const curComponent = computed(() => compMap.get(currentBtn.value))
// 上一期结果
const lastResult = computed(() => {
  if (cpTrendData.value) {
    return cpTrendData.value.d.history[0].result.split(',')
  }
  return []
})

function changeTab(value: number) {
  if (currentTab.value === value)
    return
  currentTab.value = value
  runAsyncCpOdds()
  runAsyncCpTrend()
  nextTick(() => {
    if (curComponentRef.value) {
      curComponentRef.value.refresh()
    }
  })
}

function timeToShowMask(val: number) {
  if (isPop.value) {
    isPop.value = false
  }
  timeMask.value = val
}

function initCurrency() {
  return new Promise<void>((resolve) => {
    if (token) {
      currencyStore.initCurrencyList()
        .then(() => {
          runGetOriginalGameBetLimit()
        })
        .finally(() => {
          resolve()
        })
    }
    else {
      resolve()
    }
  })
}
async function init() {
  return new Promise<void>((resolve) => {
    runAsyncCpNav().then(() => {
      const arr = [runAsyncCpTrend(), runAsyncCpOdds()]

      Promise.allSettled(arr).finally(() => {
        resolve()
      })
    }).catch(() => {
      resolve()
    })
  })
}

async function start(value: any) {
  const { payload, topic } = value.message.parsed
  if (payload.startsWith('start') && topic.endsWith(currentTab.value)) {
    isShowMask.value = false
    runAsyncCpOdds()
    if (curComponentRef.value) {
      curComponentRef.value.refresh()
    }
    await runAsyncCpTrend()
    isShowAnimal.value = true
  }
  if (payload.startsWith('end') && topic.endsWith(currentTab.value)) {
    isShowMask.value = true
  }
  if (payload.startsWith('settle') && topic.endsWith(currentTab.value)) {
    // 调用game history接口拿结果数据

  }
}

function onBetSuccess() {
  if (curComponentRef.value) {
    curComponentRef.value.refresh()
  }
}
function refresh() {
  runAsyncCpOdds()
  runAsyncCpTrend()
}
function openSettleDialog(data: any) {
  if (data.type === '4') {
    if (isShowSettleDialog.value)
      return

    settleDialogProps.value = {
      type: data.flag,
      name: data.lottery_name,
      period: data.issue_id,
      amount: data.settle_amount,
      currencyId: data.currency_id,
      balls: data.balls,
    }
    isShowSettleDialog.value = true
  }
}

watch(isPop, (a) => {
  if (!a) {
    fiveDStore.clearSelectedBSOE()
    fiveDStore.clearSelectedNumArr()
  }
})
watch(() => currentGlobalCurrencyMap.value.cur, () => {
  runGetOriginalGameBetLimit()
})
watch(isLogin, (newIsLogin) => {
  if (newIsLogin && currencyCode.value) {
    runGetOriginalGameBetLimit()
  }
}, { immediate: true })
onActivated(() => {
  refresh()
  isLogin.value = getToken()
  if (isLogin.value && currencyCode.value) {
    runGetOriginalGameBetLimit()
  }
})

onMounted(() => {
  appEventBus.on(EventBusNames.LOTTERY_5D, start)
  appEventBus.on(EventBusNames.APP_GLOBAL_VISIBILITY, refresh)
  appEventBus.on(EventBusNames.LOTTERY_SETTLE_DIALOG, openSettleDialog)
})
onBeforeUnmount(() => {
  appEventBus.off(EventBusNames.LOTTERY_5D, start)
  appEventBus.off(EventBusNames.APP_GLOBAL_VISIBILITY, refresh)
  appEventBus.on(EventBusNames.LOTTERY_SETTLE_DIALOG, openSettleDialog)
})

await application.allSettled([initCurrency(), init()])
</script>

<template>
  <div>
    <div class="px-[13rem] pt-[16rem] grid gap-[16rem] pb-[58rem]">
      <AppUserBalance :project="projectName as ProjectType" />
      <LotteryKindTabs v-model="currentTab" :tabs="tabArr" :project="projectName" @change="changeTab" />
      <AppFiveDResult :result="lastResult" />

      <div class="bet-area-bg rounded-t-[10rem] mb-[17rem]">
        <!-- 期号 倒计时 -->
        <div class="pt-[16rem] px-[11rem] mb-[18rem]">
          <div class="flex">
            <div class="w-1/2">
              <div class="flex items-center">
                <span class="period-text mr-[13rem] font-[500] text-[12rem] whitespace-nowrap">{{ $$t('期号') }}</span>
                <div
                  class="direct-btn flex items-center min-w-[128rem] h-[23rem] rounded-[30rem] justify-center px-[6rem] "
                  @click="isModal = true"
                >
                  <IconLotTicket class="text-[18rem] mr-[4rem]" />
                  <span class="text-[11rem] font-[500]">
                    {{ $$t('玩法说明') }}
                  </span>
                </div>
              </div>
              <div class="id-text leading-[30rem] text-[20rem] font-[600]">
                {{ issueId }}
              </div>
            </div>
            <div class="w-1/2 flex flex-col items-end">
              <div class="period-text font-[500] leading-[23rem] text-[12rem] text-right">
                {{ $$t('倒计时') }}
              </div>
              <div>
                <LotteryCountDown
                  :key="randomId" :time="time" style="
                   --lot-timer-box-first-clip:none;
                   --lot-timer-box-last-clip:none;
                   --lot-time-box-margin:0 3rem;
                   --lot-time-box-width:20rem;
                   " type="k3"
                  @on-time="timeToShowMask"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- 开奖结果 -->
        <AppFiveDResultSlot :key="currentTab" :result="lastResult" class="mb-[17rem]" />

        <!-- 下注选项 -->
        <div class=" relative">
          <div class="pt-[13rem] px-[13rem]">
            <AppFiveDBetPanel :data="oddsData" @open-pop="isPop = true" />
          </div>

          <!-- 倒计时遮罩 -->
          <LotteryCountDownMask
            v-if="timeMask > 0 || isShowMask" :time="timeMask"
            style="--lottery-count-down-num-bg-color:#F23038;"
          />
        </div>
      </div>

      <LotteryTableTabs v-model="currentBtn" :tabs="btnArr" @change="isFirstFalse" />
      <!-- 首次加载 -->
      <template v-if="isFirst">
        <component :is="curComponent" ref="curComponentRef" :current-tab="currentTab" />
      </template>
      <template v-else>
        <Suspense timeout="0">
          <component :is="curComponent" ref="curComponentRef" :current-tab="currentTab" />
          <template #fallback>
            <div class="flex items-center justify-center min-h-[200rem]">
              <LotteryLoading />
            </div>
          </template>
        </Suspense>
      </template>
    </div>

    <!-- 下注弹出 -->
    <LotteryPopup v-model="isPop" :has-wrapper="true">
      <AppFiveDBetPopup
        v-if="cpOddsData"
        :project="projectName" :issue-id="issueId" :data="cpOddsData" :lottery-id="currentTab"
        :bet-limit-data="betLimitData ?? ['0', '10']" @close="isPop = false" @success="onBetSuccess"
      />
    </LotteryPopup>
    <!-- 玩法规则 -->
    <LotteryDialog v-model="isModal" :title="$$t('玩法说明')" :max-size="[264, 371]" :close-text="$$t('关闭')" :project="projectName">
      <AppFiveDGameRules />
    </LotteryDialog>

    <!-- <输赢弹窗 /> -->
    <LotteryDialog v-model="isShowSettleDialog" :show-header="false" style="--lot-dialog-container-bg:transparent;" :project="projectName">
      <AppFiveDSettleDialog v-if="isShowSettleDialog" :data="settleDialogProps" @close="isShowSettleDialog = false" />
    </LotteryDialog>
  </div>
</template>
