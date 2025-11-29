<script setup lang='ts'>
import { BaseImage, SSAppLoading, SSBaseButton, SSBaseEmpty, SSBaseSelect } from '@tg/bccomponents'
import { useApiSportBetList, useBoolean, useSportSelectSettle } from '@tg/hooks'
import { IconSptUserBet } from '@tg/icons'
import { ESportsToMainPageRoutes, EventBusNames } from '@tg/types'
import { appEventBus, application, scrollToTop } from '@tg/utils'
import { isZhcn } from '@tg/vue-i18n'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSportsConfig } from '../../config/index'
import AppSportsMyBetSlip from './AppSportsMyBetSlip.vue'
import AppSportsMyBetSlipSkeleton from './AppSportsMyBetSlipSkeleton.vue'
import AppStack from './AppStack.vue'

interface Props {
  onPage?: boolean
  settle?: number
  isFirst?: boolean
  period?: string
}
defineOptions({
  name: 'AppSportsPageMyBet',
})
const props = defineProps<Props>()

const { projectName } = useSportsConfig()
const { t } = useI18n()
const {
  bool: loading,
  setTrue: showLoading,
  setFalse: hideLoading,
} = useBoolean(false)
const {
  bool: isShowSkeleton,
  setTrue: showSkeleton,
  setFalse: hideSkeleton,
} = useBoolean(false)
const {
  settle,
  settleList,
} = useSportSelectSettle(props.settle)

const listLength = ref(0)
const _period = props.onPage ? ref('today') : props.period ? ref(props.period) : undefined
const tabDaysList = [
  { label: t('今日'), value: 'today' },
  { label: t('本周'), value: 'week' },
  { label: t('本月'), value: 'month' },
]

const {
  sportBetList,
  total,
  page,
  page_size,
  next,
  prev,
  fetch,
} = useApiSportBetList(settle, _period, false, true, () => {
  // 请求完成之后
  if (!props.onPage)
    scrollToTop()
  hideLoading()
  hideSkeleton()
  listLength.value = total.value
})

const paginationData = computed(() => {
  return {
    pageSize: page_size.value,
    page: page.value,
    total: total.value,
  }
})

function pagePrev() {
  scrollToTop()
  showSkeleton()
  prev()
}
function pageNext() {
  scrollToTop()
  showSkeleton()
  next()
}
function goToBet() {
  appEventBus.emit(EventBusNames.SPORTS_TO_MAIN_PAGE_ROUTE, { name: ESportsToMainPageRoutes.SPORTS_HOME })
  setTimeout(() => {
    appEventBus.emit(EventBusNames.SPORTS_LOBBY_RESET, true)
  }, 50)
}
function addRightSettleChange(v: any) {
  if (v === settle.value)
    fetch()
}
function onDayTabChange(v: string) {
  if (_period) {
    showSkeleton()
    _period.value = v
  }
}
function onSettleChange() {
  listLength.value = 0
  showSkeleton()
}

if (props.isFirst) {
  showLoading()
  await application.allSettled([fetch()])
}
else {
  showLoading()
  fetch()
}

watch(() => props.period, (v) => {
  if (_period && v)
    _period.value = v
})

onMounted(() => {
  appEventBus.on(EventBusNames.SPORTS_BETTING_TO_BETSLIP_BUS, addRightSettleChange)
})

onUnmounted(() => {
  appEventBus.off(EventBusNames.SPORTS_BETTING_TO_BETSLIP_BUS, addRightSettleChange)
})
</script>

<template>
  <div class="mb-[16rem] min-h-[231rem] mt-[var(--ss-spt-page-my-bet-mt1)]">
    <div v-if="onPage && !loading" class="w-full flex flex-col ">
      <div class="text-[var(--ss-spt-page-title-color1)] mb-[12rem] h-[25rem] flex items-center text-[18rem] font-semibold leading-[1.5] ">
        <IconSptUserBet class="text-[var(--ss-spt-page-my-bet-color3)]" />
        <h6 class="ml-[8rem]">
          {{ t('我的投注') }}
        </h6>
      </div>
      <div class="flex items-center mb-[12rem] justify-between">
        <div class="theme-btn grid grid-flow-col items-center justify-start gap-x-[12rem]">
          <div
            v-for="item in tabDaysList" :key="item.value"
            :class="[isZhcn() ? 'text-[14rem]' : 'text-[12rem]', { active: _period === item.value }]" class="time-btn"
            @click="onDayTabChange(item.value)"
          >
            {{ item.label }}
          </div>
        </div>
        <SSBaseSelect
          v-model="settle"
          :options="settleList"
          popper @change="onSettleChange"
        />
      </div>
    </div>
    <SSAppLoading v-if="listLength > 0 ? false : (loading)" :height="onPage ? 207 : 220" />
    <template v-else>
      <div :class="onPage ? 'rounded-[4rem] theme-bg p-[12rem]' : ''">
        <div v-if="listLength === 0" class="empty">
          <SSBaseEmpty>
            <template #icon>
              <BaseImage width="120px" :url="`/${projectName}/png/uni-table-empty.png`" />
            </template>
            <template #description>
              <span class="theme-text block">{{ settle === 0
                ? t('暂无未结算的赌注') : t('暂无已结算的赌注') }}
              </span>
              <SSBaseButton
                type="text"
                size="none"
                style="--ss-base-button-text-default-color:var(--ss-spt-page-my-bet-color4);"
                @click="goToBet"
              >
                {{ t('立即开始下注') }}
              </SSBaseButton>
            </template>
          </SSBaseEmpty>
        </div>
        <div v-else class="slip-wrapper">
          <template v-if="isShowSkeleton">
            <div v-for="item in 9" :key="item" class="child">
              <AppSportsMyBetSlipSkeleton :settle="settle" />
            </div>
          </template>
          <template v-else>
            <div v-for="item in sportBetList" :key="item.ono" class="child">
              <AppSportsMyBetSlip :data="item" />
            </div>
          </template>
        </div>
        <AppStack
          v-show="listLength > 0"
          class="mt-[16rem]"
          :pagination-data="paginationData"
          scroll
          @previous="pagePrev" @next="pageNext"
        />
      </div>
    </template>
  </div>
</template>

<style lang='scss' scoped>
.title {
  margin-bottom: 28rem;
}
.time-btn {
  min-width: 52rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40rem;
  color: var(--ss-spt-page-my-bet-color1);
  font-weight: 500;
  background-color: var(--ss-spt-page-my-bet-bg1);
  border: 1px solid var(--ss-spt-page-my-bet-border1);
  border-radius: 4rem;
  padding: 8rem 12rem;
  &.active {
    background-color: var(--ss-spt-page-my-bet-bg2);
    border-color: var(--ss-spt-page-my-bet-border2);
    color: var(--ss-spt-page-my-bet-color2);
  }
}
.slip-wrapper {
  width: 100%;
  column-count: 1;
  column-gap: 16rem;

  .child {
    margin-bottom: 10rem;
    break-inside: avoid;
    width: 100%;
  }
}

.empty {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.theme-bg {
  background-color: var(--ss-spt-page-my-bet-bg3);
}
</style>
