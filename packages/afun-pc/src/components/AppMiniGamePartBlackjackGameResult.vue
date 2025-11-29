<script lang="ts" setup>
import { GAMES_LIST_ENUM } from 'feie-ui'
import type { IOriginalGameDetail } from '@tg/types'

interface Props {
  showWinLoseDraw?: boolean
  data: IOriginalGameDetail
}
defineOptions({
  name: 'AppMiniGamePartBlackjackGameResult',
})
const props = defineProps<Props>()

const closeDialog = inject('closeDialog', () => { })

const { isMobile } = storeToRefs(useWindowStore())
const { t } = useI18n()
const { push } = useLocalRouter()
const { rightIsExpand, closeRightSidebar } = useRightSidebar()

const isWin = ref<boolean | undefined>(undefined)
const isLose = ref<boolean | undefined>(undefined)
const isDraw = ref<boolean | undefined>(undefined)
const isWinSplit = ref<boolean | undefined>(undefined)
const isLoseSplit = ref<boolean | undefined>(undefined)
const isDrawSplit = ref<boolean | undefined>(undefined)

const seedInfoData = computed(() => {
  return {
    serverSeed: props.data.server_seed,
    serverSeedHash: props.data.server_seed_hash,
    clientSeed: props.data.client_seed,
    nonce: props.data.nonce,
  }
})

const betDetail = computed(() => {
  let d
  try {
    d = JSON.parse(props.data?.bet_detail)
  }
  catch {
  }
  return d
})
const dealerCards = computed(() => betDetail.value?.dealer[0]?.card)
const _dealerValue = computed(() => betDetail.value?.dealer[0]?.value)
const dealerValue = computed(() => {
  let value = [0]
  if (dealerCards.value) {
    dealerCards.value.forEach((c: any) => {
      value = calcHandValue(c, value)
    })
  }
  return value
})
const players = computed(() => betDetail.value?.player)

onMounted(() => {
  if (players.value && players.value.length === 2) {
    const r = judge(+betDetail.value?.dealer[0].value, +betDetail.value?.player[0].value)
    const r2 = judge(+betDetail.value?.dealer[0].value, +betDetail.value?.player[1].value)
    isDraw.value = r === 0 ? true : undefined // originData.value ? dealerValue.value[0] === playerValue.value[0] && dealerValue.value[0] === playerSplitValue.value[0] : undefined
    isWin.value = r === 1 ? true : undefined // isDraw.value !== true && originData.value ? +originData.value.settle_amount > 0 : undefined
    isLose.value = r === -1 ? true : undefined // isWin.value !== true && isDraw.value !== true && originData.value ? +originData.value.settle_amount <= 0 : undefined
    isDrawSplit.value = r2 === 0 ? true : undefined // originData.value ? dealerValue.value[0] === playerValue.value[0] && dealerValue.value[0] === playerSplitValue.value[0] : undefined
    isWinSplit.value = r2 === 1 ? true : undefined // isDraw.value !== true && originData.value ? +originData.value.settle_amount > 0 : undefined
    isLoseSplit.value = r2 === -1 ? true : undefined // isWin.value !== true && isDraw.value !== true && originData.value ? +originData.value.settle_amount <= 0 : undefined
  }
  else {
    const r = judge(+betDetail.value?.dealer[0].value, +betDetail.value?.player[0].value)
    isDraw.value = r === 0 ? true : undefined // originData.value ? dealerValue.value[0] === playerValue.value[0] : undefined
    isWin.value = r === 1 ? true : undefined //  isDraw.value !== true && originData.value ? +originData.value.settle_amount > 0 : undefined
    isLose.value = r === -1 ? true : undefined // isWin.value !== true && isDraw.value !== true && originData.value ? +originData.value.settle_amount <= 0 : undefined
  }
})

// 判断输赢
function judge(d: number, p: number) {
  if (+p > 21)
    return -1

  if (+p <= 21) {
    if (+p > +d)
      return 1

    if (+p === +d)
      return 0

    if (+p < +d) {
      if (+d > 21)
        return 1
      else
        return -1
    }
  }
}

const gameBlackJackRef = ref()
const fontSizeGameRoot = 0.82

// 前往游戏
function openCasinoGame() {
  if (isMobile.value) {
    setTimeout(() => {
      rightIsExpand.value && closeRightSidebar()
    }, 50)
  }
  closeDialog()

  if (isFlutterApp()) {
    sendMsgToFlutterApp(SendFlutterAppMessage.OPEN_GAME, GAMES_LIST_ENUM.BLACKJACK)
    return
  }

  push(`/casino/original-game/${GAMES_LIST_ENUM.BLACKJACK}`)
}
</script>

<template>
  <div ref="gameBlackJackRef" class="box w-full">
    <div class="mb-[10px] px-[16px]">
      <dl class="@xm:flex-row @xm:grid @xm:grid-cols-3 stats-row flex flex-col">
        <div class="col large">
          <dt>
            <span class="title">{{ $t('menu_title_settings_bets') }}</span>
          </dt>
          <dd>
            <div class="currency">
              <AppAmount style="color:var(--tg-table-amount-color)" :amount="data.bet_amount" :currency-code="data.currency_id" />
            </div>
          </dd>
          <div class="@xm:block divider hidden" />
        </div>
        <div class="col large">
          <dt>
            <span class="title">{{ $t('multiple_count') }}</span>
          </dt>
          <dd>
            <span>{{ toFixed(+data.payout_multiplier, 2) }}x</span>
          </dd>
          <div class="divider @xm:block hidden" />
        </div>
        <div class="col large">
          <dt>
            <span class="title">{{ $t('my_bets_table_click_pop_up_payment_amount') }}</span>
          </dt>
          <dd>
            <div class="currency">
              <AppAmount :amount="data.settle_amount" :currency-code="data.currency_id" show-color />
            </div>
          </dd>
          <div class="divider @xm:block hidden" />
        </div>
      </dl>
    </div>
    <div
      :style="{ fontSize: `${fontSizeGameRoot}em` }"
      class="hands relative grid h-fit min-h-[250px] w-full content-between gap-[14px] overflow-x-scroll bg-[length:40%] bg-center bg-no-repeat px-[16px] pb-[16px] @md:h-auto"
    >
      <div class="desc text-tg-secondary-light text-center text-sm font-semibold leading-[20px]">
        {{ $t('dealer') }}
      </div>
      <div class="dealer w-full flex justify-center">
        <div
          v-if="dealerCards && dealerCards.length"
          class="wrap relative mt-[1em] min-h-[7.9em] min-w-[5em] flex items-start text-[0.61em] @md:text-[1.22em]"
          :style="{
            width: `${5 + 2.5 * (dealerCards.length - 1)}em`,
            height: `${7.9 + 1 * (dealerCards.length - 1)}em`,
            fontSize: isMobile ? '0.61em' : '1.22em',
          }"
        >
          <div
            v-for="card, idx in dealerCards"
            :key="idx"
            class="content dealt dealer-card"
            :class="[`card${idx}`]"
            :style="{ marginTop: `${idx}em`, marginLeft: idx === 0 ? '0' : '-2.5em' }"
          >
            <AppMiniGamePokerCard :animate-enabled="false" :rank="card.rank" :color="card.suit" :face-down="false" />
          </div>
          <div
            v-if="+_dealerValue >= 21"
            class="text-tg-text-white value none absolute left-full top-0 w-[7ch] translate-x-[-100%] translate-y-[-100%] rounded-full px-[2px] py-[1px] text-center text-sm font-extrabold"
          >
            {{ _dealerValue }}
          </div>
          <div
            v-else
            class="value none text-tg-text-white absolute left-full top-0 w-[7ch] translate-x-[-100%] translate-y-[-100%] rounded-full px-[2px] py-[1px] text-center text-sm font-extrabold"
          >
            {{ dealerValue?.join(',') }}
          </div>
        </div>
      </div>
      <div class="desc text-tg-secondary-light text-center text-sm font-semibold leading-[20px]">
        {{ $t('table_player') }}
      </div>
      <div v-if="players && players.length" class="player flex flex-row-reverse justify-around">
        <div
          v-for="(p, idx) in players"
          :key="idx"
          class="hand-wrap relative flex flex-col items-center justify-center"
        >
          <div
            class="wrap relative mt-[1em] min-h-[7.9em] min-w-[5em] flex items-start text-[0.61em] @md:text-[1.22em]"
            :style="{
              width: `${5 + 2.5 * (p.card.length - 1)}em`,
              height: `${7.9 + 1 * (p.card.length - 1)}em`,
              fontSize: isMobile ? '0.61em' : '1.22em',
            }"
          >
            <div
              v-for="card, cdx in p.card"
              :key="cdx"
              class="content dealt player-card"
              :class="[`card${cdx}`]"
              :style="{
                marginTop: `${cdx}em`,
                marginLeft: cdx === 0 ? '0' : '-2.5em',
              }"
            >
              <!-- :win="isWin" :lose="isLose" :draw="isDraw" :active="splitActiveIndex === 0" -->
              <AppMiniGamePokerCard :animate-enabled="false" :rank="card.rank" :color="card.suit" :face-down="false" :win="idx === 0 ? isWin : isWinSplit" :lose="idx === 0 ? isLose : isLoseSplit" :draw="idx === 0 ? isDraw : isDrawSplit" />
            </div>
            <div
              class="value none text-tg-text-white absolute left-full top-0 w-[7ch] translate-x-[-100%] translate-y-[-100%] rounded-full px-[2px] py-[1px] text-center text-sm font-extrabold"
              :class="{ draw: idx === 0 ? isDraw === true : isDrawSplit === true, win: idx === 0 ? isWin === true : isWinSplit === true, lose: idx === 0 ? isLose === true : isLoseSplit === true }"
            >
              {{ p.value }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 前往游戏 -->
    <BaseButton v-if="!isAdmin()" class="theme-btn mx-auto mb-[16px] block capitalize" size="md" bg-style="dark" shadow @click="openCasinoGame">
      {{ t('go_to', { app_name: 'Blackjack' }) }}
    </BaseButton>
    <!-- 种子信息 -->
    <AppMiniGamePartSeedInfo v-if="!isAdmin()" :game="GAMES_LIST_ENUM.BLACKJACK" :data="seedInfoData" />
  </div>
</template>

<style lang="scss" scoped>
.theme-btn{
  @include webTheme('white'){
    box-shadow: none;
  }
  @include webTheme('green') {
      --tg-base-button-style-bg-dark: #197B59;
      --tg-base-button-color: white;
  }
}
.divider {
  position: absolute;
  width: 2px;
  height: 80%;
  top: 50%;
  right: 100%;
  transform: translate(50%, -50%);
  background: var(--tg-secondary-grey);
}
.stats-row {
  // display: grid;
  padding: 12px 14px;
  background: var(--tg-secondary-dark);
  border-radius: 4px;
  width: 100%;
  // grid-template-columns: repeat(3, 1fr);
  @include webTheme('white'){
    background-color: #fff;
    --tg-app-amount-green-color:#FF9E36;
  }
  @include webTheme('green'){
    background-color: #02432D;
    --tg-table-amount-color:white;
  }
  .col {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    position: relative;
    padding: 7px;
    &:first-of-type .divider {
      display: none;
    }
    dt {
      color: var(--tg-text-lightgrey);
      transition: 250ms;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      line-height: 14px;
    }
    dd {
      // margin-top: 4px;
      color: #fff;
      font-weight: 600;
      display: flex;
      align-items: center;
      @include webTheme('white') {
        color: #484848;
    }
    }
  }
}
  .dealer {
    .deck {
      &>*:not(:nth-child(1)) {
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }
  .hands {
    grid-template-rows: repeat(4, max-content);
  }
  .hand-wrap {
    .active-left, .active-right {
      display: none;
    }
    &.is-active {
      .active-left, .active-right {
        display: block;
      }
    }
  }
  .value {
    box-shadow: var(--tg-box-shadow);
    transition-property: background, color, transform, opacity;
    transition-timing-function: ease-out;
    &.none {
      background: var(--tg-secondary-main);
    }
    &.active {
      background: #4391e7;
      color: #082f5a;
    }
    &.draw {
      background: #ff9d00;
      color: #633d00;
    }
    &.win {
      background: #1fff20;
      color: #004d00;
    }
    &.lose {
      background: #e9113c;
      color: white;
    }
  }
</style>
