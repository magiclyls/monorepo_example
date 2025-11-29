<script setup lang="ts">
import { ApiMemberHighRollersList, ApiMemberRaceList, ApiMemberRecordList, ApiMemberUserBetList } from '@tg/apis'
import utc from 'dayjs/plugin/utc'
import { IconUniHidden, IconSptCompetition, IconUniTrend, IconUniRank1, IconUniRank2, IconUniRank3 } from '@tg/icons'

type RewriteColumn = {
  xl?: boolean // 768-1200是否展示
  md?: boolean // <768是否展示
} & Column

interface Props {
  mode?: 'casino' | 'sports' | 'home'
  showTab?: boolean
  tabVal?: string
  isCasinoMine?: boolean // 是否显示我的投注
}
defineOptions({
  name: 'AppBetData',
})
const props = withDefaults(defineProps<Props>(), {
  mode: 'home',
  showTab: true,
  isCasinoMine: true,
})

const emit = defineEmits(['delMine'])

dayjs.extend(utc)

const { t } = useI18n()
const { VITE_SOCKET_PREFIX } = getEnv()
const router = useLocalRouter()

const date = {
  start_time: dayjs(new Date()).startOf('day').utc().format('YYYY-MM-DD HH:mm:ss'),
  end_time: dayjs(new Date()).endOf('day').utc().format('YYYY-MM-DD HH:mm:ss'),
}
const { isLogin } = storeToRefs(useAppStore())
const { isLessThanLg, isGreaterThanSm } = storeToRefs(useWindowStore())
const { currentLangZone } = storeToRefs(useLanguageStore())
const isCasinoMode = computed(() => props.mode === 'casino')
const {
  rightIsExpand,
} = useRightSidebar()
// const { rightIsExpand } = useRightSidebar()
const { bool: color, setBool: setColor } = useBoolean(false)
// 是否已经订阅消息
const { bool: isOrder, setBool: setIsOrder } = useBoolean(false)
const { isMobile } = storeToRefs(useWindowStore())
// 需要获取多少条数据
const selectSize: Ref<string> = ref('10')
// 是否开启隐身模式
const {
  bool: isHidden,
  setFalse: setIsHiddenFalse,
  setTrue: setIsHiddenTrue,
} = useBoolean(false)
// const { openStatisticsDialog } = useStatisticsDialog()
// 游戏投注详情
const { openBetSlipDialog } = useDialogBetSlip()
// 体育投注详情
const { openBetSlipDialogSports } = useDialogBetSlipSports()
// 我的投注
const {
  list,
  runAsync: runCasinoRecordList,
  loading,
  page_size: casinoRecordPageSize,
  // prev, next, hasMore, page,
} = useList(ApiMemberUserBetList, {}, { page_size: 10 })

// 最新版：风云榜
const {
  list: hightRollersList,
  runAsync: runMemberHighRollersList,
  loading: loadHighRollers,
  page_size: hightRollersPageSize,
  // prev, next, hasMore, page,
} = useList(ApiMemberHighRollersList, {}, { page_size: 10 })

// 所有投注
const {
  list: recordList,
  runAsync: runMemberRecordList,
  loading: loadRecord,
  page_size: recordPageSize,
  // prev, next, hasMore, page,
} = useList(ApiMemberRecordList, {}, { page_size: 10 })

// 新版：竞赛排行榜
const {
  list: raceList,
  runAsync: runMemberRaceList,
  loading: loadRace,
  page_size: rankPageSize,
  // prev, next, hasMore, page,
} = useList(ApiMemberRaceList, {}, { page_size: 10 })

// tab值
const activeTab: Ref<string> = ref(isCasinoMode.value ? (props.showTab ? 'casino-fy' : 'casino-all') : 'sports-fy')
const selectOptions: ISelectOption[] = [
  { label: '0', value: '0' },
  { label: '10', value: '10' },
  { label: '20', value: '20' },
  { label: '30', value: '30' },
  { label: '40', value: '40' },
]
// const updateList = ref([])

// 获取tab配置
const getTabOptions = computed(() => {
  switch (props.mode) {
    case 'casino': {
      const arr = [
        { value: 'casino-all', label: t('all_bets'), disabled: false },
        { value: 'casino-fy', label: t('casino_game_inside_bottom_tab_high_rollers') },
        { value: 'ranking-list', label: t('competition_board'), bubble: true },
      ]
      if (props.isCasinoMine)
        arr.unshift({ value: 'casino-mine', label: t('h5_casino_middle_tab_button_list_my_bets'), disabled: !isLogin.value })
      return arr
    }
    case 'sports':return [
      { value: 'sports-all', label: t('5h_sports_detail_above_table_tab_bar_all_bets') },
      { value: 'sports-fy', label: t('billboard') },
      { value: 'ranking-list', label: t('competition_board'), bubble: true },
    ]
    case 'home': return [
      { value: 'casino-all', label: t('casino_bets') },
      { value: 'sports-all', label: t('sports_betting') },
      { value: 'ranking-list', label: t('competition_board'), bubble: true },
    ]
  }
})
// 获取表格head
const getTableColumns: ComputedRef<RewriteColumn[]> = computed((): RewriteColumn[] => {
  switch (activeTab.value) {
    case 'casino-mine': return [
      {
        title: t('game'),
        width: '20%',
        dataIndex: 'game_name',
        slot: 'gameName',
        align: 'left',
        xl: true,
        md: true,
        isRound: 'left',
        skeWidth: '90px',
      },
      {
        title: t('time'),
        width: '20%',
        dataIndex: 'bet_time',
        align: 'center',
        slot: 'bet_time',
        skeWidth: '34px',
      },
      {
        title: t('bet_amount'),
        width: '20%',
        dataIndex: 'bet_amount',
        slot: 'betMoney',
        align: 'right',
        isRound: 'right',
        skeWidth: '77px',
      },
      {
        title: t('multiple_count'),
        width: '20%',
        dataIndex: 'factor',
        slot: 'factor',
        align: 'right',
        xl: true,
        skeWidth: '42px',
      },
      {
        title: t('sports_payment_amount'),
        width: '20%',
        dataIndex: 'settle_amount',
        slot: 'settle_amount',
        align: 'right',
        xl: true,
        md: true,
        isRound: 'right',
        skeWidth: '77px',
      },
    ]
    case 'casino-all':
    case 'casino-fy': return [
      {
        title: t('game'),
        width: '16%',
        dataIndex: 'gameName',
        slot: 'gameName',
        align: 'left',
        xl: true,
        md: true,
        isRound: 'left',
        skeWidth: '90px',
      },
      {
        title: t('casino_bottom_table_header_gamer'),
        width: '16%',
        dataIndex: 'username',
        slot: 'player',
        align: 'center',
        xl: true,
      },
      {
        title: t('create_time'),
        width: '16%',
        dataIndex: 'created_at',
        align: 'center',
        slot: 'bet_time',
        skeWidth: '34px',
      },
      {
        title: t('bet_amount'),
        width: '16%',
        dataIndex: 'bet_amount',
        slot: 'betMoney',
        align: 'right',
        isRound: 'right',
        skeWidth: '77px',
      },
      {
        title: t('multiple_count'),
        width: '16%',
        dataIndex: 'factor',
        slot: 'factor',
        align: 'right',
        xl: true,
        skeWidth: '42px',
      },
      {
        title: t('sports_payment_amount'),
        width: '16%',
        dataIndex: 'settle_amount',
        slot: 'settle_amount',
        align: 'right',
        xl: true,
        md: true,
        isRound: 'right',
        skeWidth: '77px',
      },
    ]
    case 'ranking-list': return [
      {
        title: t('sports_events_inside_table_header_rank'),
        dataIndex: '',
        slot: 'ranking',
        align: 'left',
        xl: true,
        md: true,
        skeWidth: '21px',
        // width: '10%',
      },
      {
        title: t('casino_bottom_table_header_gamer'),
        dataIndex: 'player',
        slot: 'player',
        align: 'center',
        xl: true,
        md: true,
        skeWidth: '50px',
        // width: isMobile.value ? '30%' : '30%',
      },
      {
        title: t('h5_sports_rece_leaderboard_table_header_wagered'),
        dataIndex: 'bet_amount',
        // slot: 'betMoney',
        isAmount: true,
        align: 'right',
        xl: true,
        md: true,
        isTips: true,
        isRound: 'right',
        skeWidth: '77px',
        // width: isMobile.value ? '40%' : '30%',
        color: 'var(--tg-table-amount-color)',
      },
      {
        title: t('sports_events_inside_table_header_prize'),
        dataIndex: 'settle_amount',
        // slot: isMobile.value ? 'bonusAmount' : '',
        isAmount: true,
        align: 'right',
        xl: true,
        md: true,
        isRound: 'right',
        skeWidth: '77px',
        color: 'var(--tg-table-amount-color)',
        // width: isMobile.value ? '20%' : '30%',
      },
    ]
    case 'sports-all':
    case 'sports-fy':return [
      {
        title: t('sports_event'),
        width: '20%',
        dataIndex: 'gameName',
        slot: 'gameName',
        align: 'left',
        xl: true,
        md: true,
        isRound: 'left',
      },
      {
        title: t('casino_bottom_table_header_gamer'),
        width: '20%',
        dataIndex: 'username',
        slot: 'player',
        align: 'center',
        xl: true,
      },
      {
        title: t('create_time'),
        width: '20%',
        dataIndex: 'created_at',
        align: 'center',
        slot: 'bet_time',
        xl: true,
        skeWidth: '34px',
      },
      {
        title: t('sports_odds_title'),
        width: '20%',
        dataIndex: 'factor',
        slot: 'factor',
        align: 'right',
        xl: true,
        skeWidth: '42px',
      },
      {
        title: t('h5_sports_detail_all_bets_or_billboad_header_bet_amount'),
        width: '20%',
        dataIndex: 'bet_amount',
        slot: 'betMoney',
        align: 'right',
        xl: true,
        md: true,
        isRound: 'right',
        skeWidth: '77px',
      },
    ]
    default: return []
  }
})
const getScaleColumns: ComputedRef<RewriteColumn[]> = computed((): RewriteColumn[] => {
  if (!isLessThanLg.value)
    return getTableColumns.value
  else if (isGreaterThanSm.value)
    return getTableColumns.value.filter(item => item.xl)
  else
    return getTableColumns.value.filter(item => item.md)
})
const getList = computed(() => {
  switch (activeTab.value) {
    case 'casino-mine': return list.value
    case 'casino-all':
    case 'sports-all': return recordList.value
    case 'casino-fy': return hightRollersList.value
    case 'sports-fy': return hightRollersList.value
    case 'ranking-list': return raceList.value
    default: return []
  }
})
const getBgColor = computed(() => {
  return {
    '--tg-table-even-background': color.value
      ? 'initial'
      : 'var(--tg-secondary-grey)',
    '--tg-table-odd-background': color.value
      ? 'var(--tg-secondary-grey)'
      : 'initial',
  }
})

function changeHidden() {
  if (isHidden.value)
    setIsHiddenFalse()
  else
    setIsHiddenTrue()
}

// 获取getTopic
function getTopic(val: string) {
  return `${VITE_SOCKET_PREFIX}/member/bet/${getLocalUrlToUrlLang()}/${val.replace(/-/g, '/')}`
}
// 更新数据
function setBetList(msg: any) {
  const newList = msg
  if (newList && !loadRecord.value && !loadHighRollers.value) {
    const hightArr = uniqBy(newList.concat(hightRollersList.value), (item: { bill_no: any }) => item.bill_no)
    if (hightArr.length > selectSize.value)
      setColor(!color.value)

    hightRollersList.value = hightArr.splice(0, selectSize.value)
  }
}
// 订阅
function subscribeMsg(topic: string) {
  if (!isOrder.value) {
    setIsOrder(true)
    // setTimeout(() => {
    socketClient.addSubscribe(topic, { callback: memberBetCallback }) // getTopic(activeTab.value)
    appEventBus.on(EventBusNames.REFRESH_BET_BUS, setBetList)
    // }, 1200)
  }
}
// 取消订阅
function cancelMsg(topic: string, callBack?: () => void) {
  if (isOrder.value) {
    setIsOrder(false)
    socketClient.removeSubscribe(topic, () => {
      callBack && callBack()
    })
    appEventBus.off(EventBusNames.REFRESH_BET_BUS, setBetList)
  }
}
function openDialogBetSlip(record: any) {
  if (activeTab.value.includes('casino')) {
    openBetSlipDialog({ data: record })
  }

  else if (activeTab.value.includes('sports')) {
    const detail = JSON.parse(record.detail)
    openBetSlipDialogSports({
      data: {
        ...detail,
        bi: [{ ...detail.bi[0], et: 1 }],
      },
      username: record.username,
      uid: record.uid,
      order_no: record.bill_no,
    })
  }
}

// function getMemberBetList() {
//   setTimeLoad(true)
//   const type = ['casino-all', 'sports-all'].includes(activeTab.value) ? '0' : (['casino-fy', 'sports-fy'].includes(activeTab.value) ? '1' : '')
//   !loadBet.value && runMemberBetList({ type })
// }
if (isMobile.value) {
  watch(() => rightIsExpand.value, (newValue) => {
    if (newValue) {
      cancelMsg(getTopic(activeTab.value))
    }
    else {
      setTimeout(() => {
        subscribeMsg(getTopic(activeTab.value))
      }, 1200)
    }
  })
}
watch(() => props.tabVal, (newValue) => {
  if (newValue)
    activeTab.value = newValue
})
watch(() => activeTab.value, (nvl, ovl) => {
  if (selectSize.value !== '0') {
    const size = Number(selectSize.value)
    if (nvl === 'casino-mine') {
      /** 判断分页大小书是否变化 */
      const isChange = casinoRecordPageSize.value !== size
      if (isChange)
        casinoRecordPageSize.value = size
      else
        runCasinoRecordList({})
    }
    else if (['casino-all', 'sports-all'].includes(activeTab.value)) {
      const isChange = recordPageSize.value !== size
      if (isChange)
        recordPageSize.value = size
      else
        if (nvl === 'sports-all') // 所有投注
          runMemberRecordList({ types: '1', game_class: props.mode === 'sports' ? '4' : '' })
        else
          runMemberRecordList({ types: '0', game_class: props.mode === 'sports' ? '4' : '' })
    }
    else if (['casino-fy', 'sports-fy'].includes(activeTab.value)) {
      const isChange = hightRollersPageSize.value !== size
      if (isChange)
        hightRollersPageSize.value = size
      else
        if (nvl === 'sports-fy')
          runMemberHighRollersList({ types: '1', game_class: props.mode === 'sports' ? '4' : '' })
        else
          runMemberHighRollersList({ types: '0', game_class: props.mode === 'sports' ? '4' : '' })
    }
    else if (['ranking-list'].includes(activeTab.value)) {
      const isChange = rankPageSize.value !== size
      if (isChange)
        rankPageSize.value = size
      else
        if (ovl.includes('sports'))
          runMemberRaceList({ types: '1' })
        else
          runMemberRaceList({ types: '0' })
    }
  }
  if (['casino-all', 'casino-fy', 'sports-all', 'sports-fy'].includes(activeTab.value)) {
    if (isOrder.value) {
      cancelMsg(getTopic(ovl), () => {
        subscribeMsg(getTopic(nvl))
      })
    }
    else {
      subscribeMsg(getTopic(nvl))
    }
    // socketClient.removeSubscribe(getTopic(ovl), () => {
    //   setIsOrder(false)
    //   subscribeMsg(getTopic(nvl))
    // })

    // if (timer.value) {
    //   setTimeLoad(false)
    //   clearInterval(timer.value)
    //   timer.value = null
    // }
    // timer.value = setInterval(() => {
    //   if (selectSize.value !== '0') {
    //     getMemberBetList()
    //     setColor(!color.value)
    //   }
    // }, 5000)
  }
  else {
    cancelMsg(getTopic(ovl))
    // socketClient.removeSubscribe(getTopic(ovl))
    // setIsOrder(false)
    // timer.value && clearInterval(timer.value)
    // timer.value = null
    setColor(true)
    // setTimeLoad(false)
  }
})
watch(() => isLogin.value, (newValue) => {
  if (newValue && isCasinoMode.value) {
    runCasinoRecordList({}).then(() => {
      if (!list.value.length)
        emit('delMine')

      else if (props.isCasinoMine)
        activeTab.value = 'casino-mine'
    })
  }
}, { immediate: true })
watch(() => selectSize.value, (newValue) => {
  if (activeTab.value === 'casino-mine') {
    casinoRecordPageSize.value = Number(newValue)
  }
  else if (activeTab.value === 'ranking-list') {
    rankPageSize.value = Number(newValue)
    const types = {
      types: isCasinoMode.value ? '1' : '0',
    }
    !raceList.value.length && runMemberRaceList(types)
  }
  else if (activeTab.value === 'casino-all') {
    recordPageSize.value = Number(newValue)
  }
  else if (activeTab.value === 'sports-fy' || activeTab.value === 'casino-fy') {
    hightRollersPageSize.value = Number(newValue)
  }
  else {
    // betPageSize.value = Number(newValue)
  }
})

// runMemberBetList({ type: props.showTab ? '1' : '0', game_class: props.mode === 'sports' ? '4' : '' })
runMemberHighRollersList({ types: activeTab.value === 'sports-fy' ? '1' : '0', game_class: props.mode === 'sports' ? '4' : '' })

onMounted(() => {
  setColor(true)
  subscribeMsg(getTopic(activeTab.value))
  if (isLogin.value && props.isCasinoMine && isCasinoMode.value)
    activeTab.value = 'casino-mine'
})

onActivated(() => {
  setTimeout(() => {
    subscribeMsg(getTopic(activeTab.value))
  }, 1200)
})

onDeactivated(() => {
  cancelMsg(getTopic(activeTab.value))
})

onUnmounted(() => {
  cancelMsg(getTopic(activeTab.value))
})
</script>

<template>
  <div class="app-bet-data" :class="[isMobile ? 'h5-mobile' : '']">
    <div class="bet-data-head">
      <BaseTab v-show="showTab" v-model="activeTab" :list="getTabOptions" size="large" />
      <div v-if="isGreaterThanSm && mode !== 'home'" class="center select-ranking">
        <VTooltip placement="top">
          <div
            class="switch-hidden" :style="{ '--tg-icon-color': isHidden ? 'var(--tg-text-white)' : '' }"
            @click.stop="changeHidden"
          >
            <IconUniHidden />
          </div>
          <template #popper>
            <div class="tiny-menu-item-title">
              {{ `${t('hidden_mode')}${isHidden ? t('turn_on') : t('close')}` }}
            </div>
          </template>
        </VTooltip>
        <BaseSelect v-model="selectSize" :options="selectOptions" small />
      </div>
    </div>
    <template v-if="selectSize !== '0'">
      <div v-show="activeTab === 'ranking-list'" class="ranking-time">
        <div class="center cursor-pointer">
          <IconSptCompetition />
          <span>{{ t('competition', {
            money: `$${application.numberToLocaleString(100, getCurrentLanguageForFrontend())}K`,
          })
          }} – {{
            t('h5_sports_rece_leaderboard_left_hours', { delta: 24 }) }}</span>
        </div>
        <div class="center cursor-pointer">
          <IconUniTrend />
          <span>
            {{ t('end_time_table', { time: 8 }) }}
          </span>
        </div>
      </div>
      <BaseTable
        :columns="getScaleColumns" :data-source="getList" :style="getBgColor"
        :loading="loading || loadRecord || loadRace" :last-first-padding="isMobile" :show-empty="false" is-amount-popper
        @row-click="(data) => openDialogBetSlip(data)"
      >
        <template #gameName="{ record }">
          <div class="game-box">
            <AppImage :url="`${record.icon}`" style="" err-icon="chess-slot-machine" width="14px" is-network />
            <div class="game-name">
              {{ record.game_name }}
            </div>
          </div>
        </template>
        <template #bet_time="{ record }">
          <span>{{ timeToZoneFormat(Number(record.created_at), currentLangZone) }}</span>
        </template>
        <template #player="{ record }">
          <template v-if="record.state === '2' || typeof record.username === 'undefined'">
            <VTooltip placement="top" :triggers="['click', 'hover']">
              <div class="center stealth-box">
                <IconUniHidden />
                <span style="padding-left: 5px;" class="semibold">
                  {{ t('hidden_user') }}
                </span>
              </div>
              <template #popper>
                <div class="tiny-menu-item-title">
                  {{ t('user_turn_on_hidden') }}
                </div>
              </template>
            </VTooltip>
          </template>
          <div v-else class="semibold player-box">
            <!-- @click="openStatisticsDialog" -->
            {{ record.username }}
          </div>
        </template>
        <template #betMoney="{ record: { currency_id, bet_amount } }">
          <div style="display: inline-block;">
            <!-- <VTooltip placement="top" :triggers="['click', 'hover']"> -->
            <AppAmount
              class="amount-list"
              :amount="bet_amount"
              :currency-type="getCurrencyConfigByCode(currency_id)?.name"
              style="--tg-app-amount-font-weight:var(--tg-font-weight-normal);"
            />
          </div>
        </template>
        <template #settle_amount="{ record: { settle_amount, currency_id } }">
          <div :style="{ display: 'inline-block' }" class="amount-def-col" :class="[settle_amount > 0 && 'amount-col']">
            <AppAmount
              show-color
              :amount="settle_amount"
              :currency-type="getCurrencyConfigByCode(currency_id)?.name"
              style="--tg-app-amount-font-weight:var(--tg-font-weight-normal);"
            />
          </div>
        </template>
        <template #ranking="{ index }">
          <div v-if="index < 3" class="ranking-box">
            <IconUniRank1 v-if="index === 0" />
            <IconUniRank2 v-else-if="index === 1" />
            <IconUniRank3 v-else-if="index === 2" />
          </div>
          <span v-else>{{ `${index + 1}th` }}</span>
        </template>
        <template #factor="{ record: { factor } }">
          {{ factor ? toFixed(+factor) + (mode === 'casino' ? 'x' : '') : '-' }}
        </template>
      </BaseTable>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.app-bet-data {
  --tg-app-amount-font-weight: 400;
  .bet-data-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--tg-spacing-4);
    .select-ranking {
      column-gap: var(--tg-spacing-10);
    }
  }
  .ranking-time {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: nowrap;
    color: var(--tg-text-white);
    font-size: var(--tg-font-size-default);
    padding: 16px 8px;
    border-bottom: var(--tg-spacing-2) solid rgba(255, 255, 255, 0.05);
    span {
      padding-left: var(--tg-spacing-8);
      font-weight: var(--tg-font-weight-semibold);
    }
    > div:hover {
      --tg-icon-color: var(--tg-text-white);
    }
  }
  .switch-hidden {
    cursor: pointer;
  }
  .game-box {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    cursor: pointer;
    font-weight: var(--tg-font-weight-semibold);
    --app-sport-image-error-icon-size: 14px;
    .game-name {
      max-width: 12ch;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-left: 10px;
      color: var(--tg-text-white);
    }
  }
  .player-box {
    color: var(--tg-text-white);
  }
  .stealth-box {
    cursor: help;
  }
  .ranking-box {
    font-size: var(--tg-font-size-lg);
    display: flex;
  }
  .cursor-pointer {
    cursor: pointer;
    &:active {
      transform: scale(0.98);
    }
  }
}
.h5-mobile {
  --tg-table-th-padding-x: var(--tg-spacing-8);
  --tg-table-td-padding-x: var(--tg-spacing-8);
  --tg-table-tr-last-first-padding: var(--tg-spacing-16);
  // th:last-child {
  //   padding-right: var(--tg-spacing-16) !important;
  // }
  // th:first-child {
  //   padding-left: var(--tg-spacing-16) !important;
  // }
}
.amount-list {
  @include webTheme('green') {
    color: var(--tg-table-amount-color);
  }
}
</style>
