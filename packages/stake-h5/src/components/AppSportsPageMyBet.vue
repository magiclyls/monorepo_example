<script setup lang='ts'>
import {
  IconSptUserBet,
} from '@tg/icons'

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

const { t } = useI18n()
const appStore = useAppStore()
const { isZhcn } = storeToRefs(useLanguageStore())
const router = useLocalRouter()
const { appContentWidth, isMobile } = storeToRefs(useWindowStore())
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
  { label: t('today'), value: 'today' },
  { label: t('this_week'), value: 'week' },
  { label: t('this_month'), value: 'month' },
]

const {
  sportBetList,
  total,
  page,
  page_size,
  next,
  prev,
  fetch,
} = useApiSportBetList(settle, _period, false, false, () => {
  // 请求完成之后
  if (!props.onPage)
    scrollToTop()
  hideLoading()
  hideSkeleton()
  listLength.value = total.value
})

const columnCount = computed(() => {
  if (appContentWidth.value > 1000)
    return 3
  else if (appContentWidth.value > 650)
    return 2
  return 1
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
  router.push(`/sports/${getSportsPlatId()}`)
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
  <div class="mb-[16px] min-h-[231px] @md:mb-[32px]">
    <div v-if="onPage && !loading" class="mb-[16px] mt-[25px] w-full flex flex-col @md:mb-[28px] @md:mt-0">
      <div
        class="text-tg-text-white mb-[16px] h-[25px] flex items-center text-[18px] font-semibold leading-[1.5] @md:h-[42px]">
        <IconSptUserBet />
        <h6 class="ml-[8px]">
          {{ t('my_bets') }}
        </h6>
      </div>
      <div class="flex items-center justify-between">
        <div class="theme-btn grid grid-flow-col items-center justify-start gap-x-[8px]">
          <BaseButton v-for="item in tabDaysList" :key="item.value" class="min-h-[38px]" :class="{
            'active-btn': _period === item.value,
            'text-[12px]': !isZhcn,
          }" :style="_period === item.value
            ? '--tg-base-button-style-bg-hover:var(--tg-sport-btn-hover);--tg-base-button-style-bg:var(--tg-sport-btn-hover)'
            : `--tg-base-button-style-bg-hover:var(--tg-sport-btn-hover);--tg-base-button-style-bg:var(--tg-secondary-dark)${!isZhcn}` ? '--tg-base-button-font-size:12px;' : ''
            " @click="onDayTabChange(item.value)">
            {{ item.label }}
          </BaseButton>
        </div>
        <BaseSelect v-model="settle" style="
            --tg-base-select-popper-style-padding-y: var(--tg-spacing-10);
            --tg-base-select-popper-style-padding-x: var(--tg-spacing-16)" :options="settleList" popper
          @select="showSkeleton()" />
      </div>
    </div>
    <AppLoading v-if="listLength > 0 ? false : (loading)" :height="onPage ? 207 : 220" />
    <template v-else>
      <div :class="isMobile && onPage ? 'rounded-[4px] theme-bg  p-[6px] pb-[16px]' : ''">
        <div v-if="listLength === 0" class="empty">
          <BaseEmpty>
            <template #icon>
              <BaseImage class="w-[112px]" url="/png/icon/uni-empty-betslip_greenblacktheme.png" v-if="appStore.theme === 'greenblack'" />
              <BaseImage class="w-[112px]" url="/png/icon/uni-empty-betslip_greentheme.png" v-else-if="appStore.theme === 'green'" />
              <BaseImage class="w-[112px]" url="/png/icon/uni-empty-betslip_whitetheme.png" v-else-if="appStore.theme === 'white'" />
              <BaseImage class="w-[112px]" url="/png/icon/uni-empty-betslip.png" v-else />
            </template>
            <template #description>
              <span class="theme-text">{{ settle === 0
                ? t('empty_unsettle_bet') : t('empty_settle_bet') }}
              </span>
            </template>
            <template #default>
              <BaseButton type="text" size="none" style=" --tg-base-button-text-default-color:var(--tg-text-white)"
                @click="goToBet">
                {{ t('h5_header_menu_my_bets_sports_empty_start_placing') }}
              </BaseButton>
            </template>
          </BaseEmpty>
        </div>
        <div v-else class="slip-wrapper" :class="{ 'mt-[16px]': !onPage }" :style="`column-count:${columnCount}`">
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
        <AppStack v-show="listLength > 0" class="mt-[16px]" :pagination-data="paginationData" scroll
          @previous="pagePrev" @next="pageNext" />
      </div>
    </template>
  </div>
</template>

<style lang='scss' scoped>
.title {
  margin-bottom: var(--tg-spacing-28);
}

.slip-wrapper {
  width: 100%;
  column-count: var(--column-count);
  column-gap: 16px;

  .child {
    margin-bottom: 3px;
    break-inside: avoid;
    width: 100%;
  }
}

.empty {
  width: 100%;
  --tg-empty-text-padding: var(--tg-spacing-12) 0 var(--tg-spacing-6);
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-btn {
  @include webTheme('green') {
    --tg-base-button-color: #5ECEA6;

    .active-btn {
      --tg-base-button-color: #fff;
    }
  }
}

.theme-bg {
  background-color: var(--tg-secondary-dark);

  @include webTheme('green') {
    background-color: #02432D;
  }

  @include webTheme('white') {
    background-color: #f5f5f5;
  }
}

.theme-text {
  @include webTheme('green') {
    color: #B1BAD3;
  }
}
</style>
